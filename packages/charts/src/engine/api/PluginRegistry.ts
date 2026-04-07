/**
 * Plugin Registry
 * ثبت‌نام و مدیریت پلاگین‌ها
 *
 * Features:
 * - Plugin registration
 * - Plugin discovery
 * - Plugin marketplace
 * - Plugin versioning
 */

import { EventEmitter } from 'events';

export interface PluginEntry {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: string;
  tags: string[];
  downloads: number;
  rating: number;
  homepage?: string;
  repository?: string;
  license?: string;
  registeredAt: number;
}

export interface PluginSearchResult {
  entries: PluginEntry[];
  total: number;
  limit: number;
  offset: number;
}

export class PluginRegistry extends EventEmitter {
  private registry: Map<string, PluginEntry[]>;
  private categories: Set<string>;
  private stats: {
    pluginsRegistered: number;
    pluginsSearched: number;
    pluginsDownloaded: number;
    categoriesCreated: number;
  };

  constructor() {
    super();
    this.registry = new Map();
    this.categories = new Set();
    this.stats = {
      pluginsRegistered: 0,
      pluginsSearched: 0,
      pluginsDownloaded: 0,
      categoriesCreated: 0,
    };
    this.initializeDefaultCategories();
  }

  private initializeDefaultCategories(): void {
    const defaultCategories = [
      'visualization',
      'data-processing',
      'export',
      'integration',
      'theme',
      'analytics',
      'performance',
      'security',
    ];

    for (const category of defaultCategories) {
      this.categories.add(category);
      this.registry.set(category, []);
      this.stats.categoriesCreated++;
    }
  }

  registerPlugin(entry: PluginEntry): boolean {
    try {
      // Validate entry
      if (!this.validateEntry(entry)) {
        this.emit('registration-failed', { pluginId: entry.id, error: 'Invalid entry' });
        return false;
      }

      // Get or create category
      if (!this.registry.has(entry.category)) {
        this.registry.set(entry.category, []);
        this.categories.add(entry.category);
        this.stats.categoriesCreated++;
      }

      // Add to registry
      const categoryPlugins = this.registry.get(entry.category)!;
      categoryPlugins.push(entry);

      this.stats.pluginsRegistered++;
      this.emit('plugin-registered', { pluginId: entry.id, category: entry.category });

      return true;
    } catch (error) {
      this.emit('registration-error', { pluginId: entry.id, error: (error as Error).message });
      return false;
    }
  }

  private validateEntry(entry: PluginEntry): boolean {
    // Check required fields
    if (!entry.id || !entry.name || !entry.version || !entry.category) {
      return false;
    }

    // Validate version format
    if (!/^\d+\.\d+\.\d+/.test(entry.version)) {
      return false;
    }

    // Validate rating
    if (entry.rating < 0 || entry.rating > 5) {
      return false;
    }

    return true;
  }

  unregisterPlugin(pluginId: string): boolean {
    for (const [category, plugins] of this.registry) {
      const index = plugins.findIndex((p) => p.id === pluginId);
      if (index >= 0) {
        plugins.splice(index, 1);
        this.emit('plugin-unregistered', { pluginId, category });
        return true;
      }
    }

    return false;
  }

  searchPlugins(query: string, limit: number = 10, offset: number = 0): PluginSearchResult {
    const results: PluginEntry[] = [];

    for (const plugins of this.registry.values()) {
      for (const plugin of plugins) {
        if (
          plugin.name.toLowerCase().includes(query.toLowerCase()) ||
          plugin.description.toLowerCase().includes(query.toLowerCase()) ||
          plugin.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
        ) {
          results.push(plugin);
        }
      }
    }

    this.stats.pluginsSearched++;
    this.emit('search-executed', { query, resultCount: results.length });

    // Sort by rating and downloads
    results.sort((a, b) => {
      const ratingDiff = b.rating - a.rating;
      return ratingDiff !== 0 ? ratingDiff : b.downloads - a.downloads;
    });

    // Paginate
    const paginated = results.slice(offset, offset + limit);

    return {
      entries: paginated,
      total: results.length,
      limit,
      offset,
    };
  }

  searchByCategory(category: string, limit: number = 10, offset: number = 0): PluginSearchResult {
    const plugins = this.registry.get(category) || [];

    // Sort by rating and downloads
    const sorted = [...plugins].sort((a, b) => {
      const ratingDiff = b.rating - a.rating;
      return ratingDiff !== 0 ? ratingDiff : b.downloads - a.downloads;
    });

    // Paginate
    const paginated = sorted.slice(offset, offset + limit);

    this.emit('category-search', { category, resultCount: paginated.length });

    return {
      entries: paginated,
      total: sorted.length,
      limit,
      offset,
    };
  }

  getPlugin(pluginId: string): PluginEntry | undefined {
    for (const plugins of this.registry.values()) {
      const plugin = plugins.find((p) => p.id === pluginId);
      if (plugin) {
        return plugin;
      }
    }

    return undefined;
  }

  getPluginsByAuthor(author: string): PluginEntry[] {
    const results: PluginEntry[] = [];

    for (const plugins of this.registry.values()) {
      for (const plugin of plugins) {
        if (plugin.author.toLowerCase() === author.toLowerCase()) {
          results.push(plugin);
        }
      }
    }

    return results;
  }

  getPluginsByTag(tag: string): PluginEntry[] {
    const results: PluginEntry[] = [];

    for (const plugins of this.registry.values()) {
      for (const plugin of plugins) {
        if (plugin.tags.includes(tag)) {
          results.push(plugin);
        }
      }
    }

    return results;
  }

  getCategories(): string[] {
    return Array.from(this.categories);
  }

  getCategoryPlugins(category: string): PluginEntry[] {
    return this.registry.get(category) || [];
  }

  updatePluginRating(pluginId: string, rating: number): boolean {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) {
      return false;
    }

    if (rating < 0 || rating > 5) {
      return false;
    }

    plugin.rating = rating;
    this.emit('plugin-rating-updated', { pluginId, rating });

    return true;
  }

  incrementDownloads(pluginId: string): boolean {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) {
      return false;
    }

    plugin.downloads++;
    this.stats.pluginsDownloaded++;
    this.emit('plugin-downloaded', { pluginId, downloads: plugin.downloads });

    return true;
  }

  getStats() {
    return {
      ...this.stats,
      totalPlugins: Array.from(this.registry.values()).reduce(
        (sum, plugins) => sum + plugins.length,
        0
      ),
      totalCategories: this.categories.size,
    };
  }
}
