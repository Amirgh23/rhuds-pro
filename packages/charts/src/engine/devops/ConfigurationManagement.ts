/**
 * Configuration Management
 * Manages configuration versioning and deployment
 */

export interface ConfigVersion {
  id: string;
  version: string;
  timestamp: number;
  author: string;
  changes: ConfigChange[];
  description: string;
  status: 'draft' | 'approved' | 'deployed' | 'rolled-back';
}

export interface ConfigChange {
  key: string;
  oldValue?: unknown;
  newValue?: unknown;
  action: 'add' | 'update' | 'delete';
}

export interface ConfigEnvironment {
  id: string;
  name: string;
  configs: Map<string, unknown>;
  currentVersion: string;
  deploymentHistory: DeploymentRecord[];
}

export interface DeploymentRecord {
  id: string;
  versionId: string;
  timestamp: number;
  status: 'success' | 'failed' | 'rolled-back';
  duration: number;
  error?: string;
}

/**
 * Configuration Management System
 * Manages configuration versioning and deployment
 */
export class ConfigurationManagement {
  private versions: Map<string, ConfigVersion> = new Map();
  private environments: Map<string, ConfigEnvironment> = new Map();
  private deploymentValidators: Array<(config: Record<string, unknown>) => Promise<boolean>> = [];

  /**
   * Create configuration version
   */
  public createConfigVersion(
    version: string,
    author: string,
    changes: ConfigChange[],
    description: string
  ): ConfigVersion {
    const configVersion: ConfigVersion = {
      id: `config-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      version,
      timestamp: Date.now(),
      author,
      changes,
      description,
      status: 'draft',
    };

    this.versions.set(configVersion.id, configVersion);
    return configVersion;
  }

  /**
   * Register deployment validator
   */
  public registerDeploymentValidator(
    validator: (config: Record<string, unknown>) => Promise<boolean>
  ): void {
    this.deploymentValidators.push(validator);
  }

  /**
   * Approve configuration version
   */
  public approveConfigVersion(versionId: string): ConfigVersion {
    const version = this.versions.get(versionId);
    if (!version) {
      throw new Error(`Configuration version not found: ${versionId}`);
    }

    version.status = 'approved';
    return version;
  }

  /**
   * Deploy configuration
   */
  public async deployConfiguration(
    environmentId: string,
    versionId: string
  ): Promise<DeploymentRecord> {
    const environment = this.environments.get(environmentId);
    if (!environment) {
      throw new Error(`Environment not found: ${environmentId}`);
    }

    const version = this.versions.get(versionId);
    if (!version) {
      throw new Error(`Configuration version not found: ${versionId}`);
    }

    if (version.status !== 'approved') {
      throw new Error(`Configuration not approved: ${version.status}`);
    }

    const startTime = Date.now();
    const record: DeploymentRecord = {
      id: `deploy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      versionId,
      timestamp: startTime,
      status: 'success',
      duration: 0,
    };

    try {
      // Apply changes
      const newConfigs = new Map(environment.configs);
      for (const change of version.changes) {
        if (change.action === 'add' || change.action === 'update') {
          newConfigs.set(change.key, change.newValue);
        } else if (change.action === 'delete') {
          newConfigs.delete(change.key);
        }
      }

      // Validate configuration
      const configObj = Object.fromEntries(newConfigs);
      for (const validator of this.deploymentValidators) {
        const isValid = await validator(configObj);
        if (!isValid) {
          throw new Error('Configuration validation failed');
        }
      }

      // Apply configuration
      environment.configs = newConfigs;
      environment.currentVersion = versionId;
      version.status = 'deployed';

      record.duration = Date.now() - startTime;
    } catch (error) {
      record.status = 'failed';
      record.error = (error as Error).message;
      record.duration = Date.now() - startTime;
    }

    environment.deploymentHistory.push(record);
    return record;
  }

  /**
   * Rollback configuration
   */
  public async rollbackConfiguration(
    environmentId: string,
    versionId: string
  ): Promise<DeploymentRecord> {
    const environment = this.environments.get(environmentId);
    if (!environment) {
      throw new Error(`Environment not found: ${environmentId}`);
    }

    const version = this.versions.get(versionId);
    if (!version) {
      throw new Error(`Configuration version not found: ${versionId}`);
    }

    const startTime = Date.now();
    const record: DeploymentRecord = {
      id: `rollback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      versionId,
      timestamp: startTime,
      status: 'success',
      duration: 0,
    };

    try {
      // Reverse changes
      const newConfigs = new Map(environment.configs);
      for (const change of version.changes) {
        if (change.action === 'add') {
          newConfigs.delete(change.key);
        } else if (change.action === 'update' || change.action === 'delete') {
          if (change.oldValue !== undefined) {
            newConfigs.set(change.key, change.oldValue);
          }
        }
      }

      environment.configs = newConfigs;
      version.status = 'rolled-back';

      record.duration = Date.now() - startTime;
    } catch (error) {
      record.status = 'failed';
      record.error = (error as Error).message;
      record.duration = Date.now() - startTime;
    }

    environment.deploymentHistory.push(record);
    return record;
  }

  /**
   * Create environment
   */
  public createEnvironment(name: string): ConfigEnvironment {
    const environment: ConfigEnvironment = {
      id: `env-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      configs: new Map(),
      currentVersion: '',
      deploymentHistory: [],
    };

    this.environments.set(environment.id, environment);
    return environment;
  }

  /**
   * Get configuration
   */
  public getConfiguration(environmentId: string, key: string): unknown {
    const environment = this.environments.get(environmentId);
    if (!environment) {
      throw new Error(`Environment not found: ${environmentId}`);
    }

    return environment.configs.get(key);
  }

  /**
   * Get all configurations
   */
  public getAllConfigurations(environmentId: string): Record<string, unknown> {
    const environment = this.environments.get(environmentId);
    if (!environment) {
      throw new Error(`Environment not found: ${environmentId}`);
    }

    return Object.fromEntries(environment.configs);
  }

  /**
   * Get configuration version
   */
  public getConfigVersion(versionId: string): ConfigVersion | undefined {
    return this.versions.get(versionId);
  }

  /**
   * List configuration versions
   */
  public listConfigVersions(limit: number = 10): ConfigVersion[] {
    return Array.from(this.versions.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get deployment history
   */
  public getDeploymentHistory(environmentId: string, limit: number = 10): DeploymentRecord[] {
    const environment = this.environments.get(environmentId);
    if (!environment) {
      throw new Error(`Environment not found: ${environmentId}`);
    }

    return environment.deploymentHistory.slice(-limit);
  }

  /**
   * Validate configuration version
   */
  public async validateConfigVersion(versionId: string): Promise<Record<string, unknown>> {
    const version = this.versions.get(versionId);
    if (!version) {
      throw new Error(`Configuration version not found: ${versionId}`);
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate changes
    for (const change of version.changes) {
      if (!change.key) {
        errors.push('Change missing key');
      }
      if (!['add', 'update', 'delete'].includes(change.action)) {
        errors.push(`Invalid action: ${change.action}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Export configuration
   */
  public exportConfiguration(environmentId: string): Record<string, unknown> {
    const environment = this.environments.get(environmentId);
    if (!environment) {
      throw new Error(`Environment not found: ${environmentId}`);
    }

    return {
      name: environment.name,
      configs: Object.fromEntries(environment.configs),
      currentVersion: environment.currentVersion,
    };
  }

  /**
   * Import configuration
   */
  public importConfiguration(environmentId: string, config: Record<string, unknown>): void {
    const environment = this.environments.get(environmentId);
    if (!environment) {
      throw new Error(`Environment not found: ${environmentId}`);
    }

    for (const [key, value] of Object.entries(config)) {
      environment.configs.set(key, value);
    }
  }

  /**
   * Delete environment
   */
  public deleteEnvironment(environmentId: string): void {
    this.environments.delete(environmentId);
  }
}
