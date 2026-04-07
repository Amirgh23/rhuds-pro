/**
 * Plugin Loader
 * بارگذار پلاگین برای سیستم افزونه‌ها
 *
 * Features:
 * - Plugin loading
 * - Plugin validation
 * - Dependency resolution
 * - Error handling
 */

import { EventEmitter } from 'events';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  main: string;
  hooks: string[];
  permissions: string[];
  dependencies: Record<string, string>;
  config?: Record<string, any>;
}

export interface LoadedPlugin {
  manifest: PluginManifest;
  module: any;
  enabled: boolean;
  loadedAt: number;
  error?: string;
}

export class PluginLoader extends EventEmitter {
  private loadedPlugins: Map<string, LoadedPlugin>;
  private pluginPaths: string[];
  private stats: {
    pluginsLoaded: number;
    pluginsFailed: number;
    dependenciesResolved: number;
    dependenciesFailed: number;
  };

  constructor(pluginPaths: string[] = []) {
    super();
    this.loadedPlugins = new Map();
    this.pluginPaths = pluginPaths;
    this.stats = {
      pluginsLoaded: 0,
      pluginsFailed: 0,
      dependenciesResolved: 0,
      dependenciesFailed: 0,
    };
  }

  async loadPlugin(manifest: PluginManifest): Promise<LoadedPlugin | null> {
    try {
      // Validate manifest
      if (!this.validateManifest(manifest)) {
        this.stats.pluginsFailed++;
        this.emit('plugin-load-failed', { pluginId: manifest.id, error: 'Invalid manifest' });
        return null;
      }

      // Check dependencies
      const depsResolved = await this.resolveDependencies(manifest);
      if (!depsResolved) {
        this.stats.pluginsFailed++;
        this.stats.dependenciesFailed++;
        this.emit('plugin-load-failed', {
          pluginId: manifest.id,
          error: 'Dependency resolution failed',
        });
        return null;
      }

      this.stats.dependenciesResolved++;

      // Load plugin module
      const module = await this.loadPluginModule(manifest);
      if (!module) {
        this.stats.pluginsFailed++;
        this.emit('plugin-load-failed', { pluginId: manifest.id, error: 'Module loading failed' });
        return null;
      }

      // Create loaded plugin
      const loadedPlugin: LoadedPlugin = {
        manifest,
        module,
        enabled: true,
        loadedAt: Date.now(),
      };

      this.loadedPlugins.set(manifest.id, loadedPlugin);
      this.stats.pluginsLoaded++;

      this.emit('plugin-loaded', { pluginId: manifest.id, version: manifest.version });

      return loadedPlugin;
    } catch (error) {
      this.stats.pluginsFailed++;
      this.emit('plugin-load-error', { pluginId: manifest.id, error: (error as Error).message });
      return null;
    }
  }

  private validateManifest(manifest: PluginManifest): boolean {
    // Check required fields
    if (!manifest.id || !manifest.name || !manifest.version || !manifest.main) {
      return false;
    }

    // Validate version format
    if (!/^\d+\.\d+\.\d+/.test(manifest.version)) {
      return false;
    }

    // Validate hooks array
    if (!Array.isArray(manifest.hooks)) {
      return false;
    }

    // Validate permissions array
    if (!Array.isArray(manifest.permissions)) {
      return false;
    }

    return true;
  }

  private async resolveDependencies(manifest: PluginManifest): Promise<boolean> {
    if (!manifest.dependencies || Object.keys(manifest.dependencies).length === 0) {
      return true;
    }

    for (const [depId, depVersion] of Object.entries(manifest.dependencies)) {
      const loaded = this.loadedPlugins.get(depId);

      if (!loaded) {
        this.emit('dependency-missing', { pluginId: manifest.id, dependency: depId });
        return false;
      }

      // Check version compatibility
      if (!this.isVersionCompatible(loaded.manifest.version, depVersion)) {
        this.emit('dependency-version-mismatch', {
          pluginId: manifest.id,
          dependency: depId,
          required: depVersion,
          available: loaded.manifest.version,
        });
        return false;
      }
    }

    return true;
  }

  private isVersionCompatible(available: string, required: string): boolean {
    // Simple version comparison (major.minor.patch)
    const [availMajor, availMinor] = available.split('.').map(Number);
    const [reqMajor, reqMinor] = required.split('.').map(Number);

    return availMajor === reqMajor && availMinor >= reqMinor;
  }

  private async loadPluginModule(manifest: PluginManifest): Promise<any> {
    try {
      // Simulate module loading
      return {
        init: async (context: any) => {
          this.emit('plugin-initialized', { pluginId: manifest.id });
        },
        destroy: async () => {
          this.emit('plugin-destroyed', { pluginId: manifest.id });
        },
      };
    } catch (error) {
      this.emit('module-load-error', { pluginId: manifest.id, error: (error as Error).message });
      return null;
    }
  }

  async unloadPlugin(pluginId: string): Promise<boolean> {
    const loaded = this.loadedPlugins.get(pluginId);
    if (!loaded) {
      return false;
    }

    try {
      // Call destroy if available
      if (loaded.module?.destroy) {
        await loaded.module.destroy();
      }

      this.loadedPlugins.delete(pluginId);
      this.emit('plugin-unloaded', { pluginId });

      return true;
    } catch (error) {
      this.emit('plugin-unload-error', { pluginId, error: (error as Error).message });
      return false;
    }
  }

  getPlugin(pluginId: string): LoadedPlugin | undefined {
    return this.loadedPlugins.get(pluginId);
  }

  getAllPlugins(): LoadedPlugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  getEnabledPlugins(): LoadedPlugin[] {
    return Array.from(this.loadedPlugins.values()).filter((p) => p.enabled);
  }

  enablePlugin(pluginId: string): boolean {
    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) {
      return false;
    }

    plugin.enabled = true;
    this.emit('plugin-enabled', { pluginId });

    return true;
  }

  disablePlugin(pluginId: string): boolean {
    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) {
      return false;
    }

    plugin.enabled = false;
    this.emit('plugin-disabled', { pluginId });

    return true;
  }

  getStats() {
    return {
      ...this.stats,
      totalLoaded: this.loadedPlugins.size,
      enabledCount: Array.from(this.loadedPlugins.values()).filter((p) => p.enabled).length,
    };
  }
}
