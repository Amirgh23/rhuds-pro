/**
 * API Versioning Manager
 * Manages API versions, compatibility, and migration strategies
 */

export interface APIVersion {
  version: string;
  releaseDate: Date;
  deprecated: boolean;
  deprecationDate?: Date;
  sunsetDate?: Date;
  features: string[];
  breaking: string[];
}

export interface VersionedEndpoint {
  path: string;
  versions: Map<string, (data: unknown) => unknown>;
  currentVersion: string;
  deprecated: boolean;
}

export interface VersionStrategy {
  type: 'url' | 'header' | 'query';
  headerName?: string;
  queryParam?: string;
}

/**
 * APIVersioningManager - Manage API versions and compatibility
 */
export class APIVersioningManager {
  private versions: Map<string, APIVersion> = new Map();
  private endpoints: Map<string, VersionedEndpoint> = new Map();
  private strategy: VersionStrategy;
  private currentVersion: string = '1.0.0';
  private listeners: Set<(event: string, data: unknown) => void> = new Set();

  constructor(strategy: VersionStrategy = { type: 'header', headerName: 'API-Version' }) {
    this.strategy = strategy;
  }

  /**
   * Register API version
   */
  registerVersion(version: APIVersion): void {
    this.versions.set(version.version, version);
    this.currentVersion = version.version;
    this.emit('version_registered', version);
  }

  /**
   * Get version info
   */
  getVersion(version: string): APIVersion | null {
    return this.versions.get(version) ?? null;
  }

  /**
   * Get all versions
   */
  getAllVersions(): APIVersion[] {
    return Array.from(this.versions.values());
  }

  /**
   * Register versioned endpoint
   */
  registerEndpoint(
    path: string,
    versions: Record<string, (data: unknown) => unknown>,
    currentVersion: string
  ): void {
    const endpoint: VersionedEndpoint = {
      path,
      versions: new Map(Object.entries(versions)),
      currentVersion,
      deprecated: false,
    };

    this.endpoints.set(path, endpoint);
    this.emit('endpoint_registered', endpoint);
  }

  /**
   * Get endpoint handler for version
   */
  getEndpointHandler(path: string, version: string): ((data: unknown) => unknown) | null {
    const endpoint = this.endpoints.get(path);
    if (!endpoint) {
      return null;
    }

    const handler = endpoint.versions.get(version);
    if (!handler && version !== endpoint.currentVersion) {
      // Try to use current version as fallback
      return endpoint.versions.get(endpoint.currentVersion) ?? null;
    }

    return handler ?? null;
  }

  /**
   * Deprecate version
   */
  deprecateVersion(version: string, sunsetDate: Date): void {
    const versionInfo = this.versions.get(version);
    if (versionInfo) {
      versionInfo.deprecated = true;
      versionInfo.deprecationDate = new Date();
      versionInfo.sunsetDate = sunsetDate;
      this.emit('version_deprecated', versionInfo);
    }
  }

  /**
   * Deprecate endpoint
   */
  deprecateEndpoint(path: string): void {
    const endpoint = this.endpoints.get(path);
    if (endpoint) {
      endpoint.deprecated = true;
      this.emit('endpoint_deprecated', endpoint);
    }
  }

  /**
   * Get migration path
   */
  getMigrationPath(fromVersion: string, toVersion: string): string[] {
    const versions = Array.from(this.versions.keys()).sort();
    const fromIndex = versions.indexOf(fromVersion);
    const toIndex = versions.indexOf(toVersion);

    if (fromIndex === -1 || toIndex === -1) {
      return [];
    }

    if (fromIndex > toIndex) {
      return [];
    }

    return versions.slice(fromIndex, toIndex + 1);
  }

  /**
   * Get breaking changes between versions
   */
  getBreakingChanges(fromVersion: string, toVersion: string): string[] {
    const path = this.getMigrationPath(fromVersion, toVersion);
    const changes: string[] = [];

    for (const version of path) {
      const versionInfo = this.versions.get(version);
      if (versionInfo) {
        changes.push(...versionInfo.breaking);
      }
    }

    return changes;
  }

  /**
   * Check version compatibility
   */
  isCompatible(version: string): boolean {
    const versionInfo = this.versions.get(version);
    if (!versionInfo) {
      return false;
    }

    if (versionInfo.deprecated && versionInfo.sunsetDate) {
      return new Date() < versionInfo.sunsetDate;
    }

    return true;
  }

  /**
   * Get version statistics
   */
  getStatistics() {
    const allVersions = this.getAllVersions();
    const deprecated = allVersions.filter((v) => v.deprecated).length;
    const active = allVersions.length - deprecated;

    return {
      totalVersions: allVersions.length,
      activeVersions: active,
      deprecatedVersions: deprecated,
      currentVersion: this.currentVersion,
      totalEndpoints: this.endpoints.size,
      deprecatedEndpoints: Array.from(this.endpoints.values()).filter((e) => e.deprecated).length,
    };
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (error) {
        // Handle listener error
      }
    }
  }

  /**
   * Add listener
   */
  addListener(listener: (event: string, data: unknown) => void): void {
    this.listeners.add(listener);
  }

  /**
   * Remove listener
   */
  removeListener(listener: (event: string, data: unknown) => void): void {
    this.listeners.delete(listener);
  }
}
