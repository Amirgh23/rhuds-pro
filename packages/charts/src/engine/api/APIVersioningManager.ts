/**
 * API Versioning Manager
 * مدیریت نسخه‌های API برای سازگاری عقب‌رو
 *
 * Features:
 * - Version routing
 * - Backward compatibility
 * - Deprecation handling
 * - Migration tools
 */

import { EventEmitter } from 'events';

export interface APIVersion {
  version: string;
  major: number;
  minor: number;
  patch: number;
  releaseDate: Date;
  deprecated: boolean;
  deprecationDate?: Date;
  sunsetDate?: Date;
  status: 'active' | 'deprecated' | 'sunset';
}

export interface VersionRoute {
  path: string;
  version: string;
  handler: (request: any) => Promise<any>;
  transformRequest?: (request: any) => any;
  transformResponse?: (response: any) => any;
}

export interface DeprecationPolicy {
  warningPeriod: number; // days
  sunsetPeriod: number; // days
  notifyClients: boolean;
  gracefulDegradation: boolean;
}

export interface MigrationGuide {
  fromVersion: string;
  toVersion: string;
  breaking: string[];
  deprecated: string[];
  newFeatures: string[];
  migrationSteps: string[];
}

export class APIVersioningManager extends EventEmitter {
  private versions: Map<string, APIVersion>;
  private routes: Map<string, VersionRoute[]>;
  private deprecationPolicy: DeprecationPolicy;
  private migrationGuides: Map<string, MigrationGuide>;
  private stats: {
    requestsV1: number;
    requestsV2: number;
    requestsV3: number;
    deprecatedCalls: number;
    migrations: number;
  };

  constructor(deprecationPolicy?: DeprecationPolicy) {
    super();
    this.versions = new Map();
    this.routes = new Map();
    this.migrationGuides = new Map();
    this.deprecationPolicy = deprecationPolicy || {
      warningPeriod: 90,
      sunsetPeriod: 180,
      notifyClients: true,
      gracefulDegradation: true,
    };
    this.stats = {
      requestsV1: 0,
      requestsV2: 0,
      requestsV3: 0,
      deprecatedCalls: 0,
      migrations: 0,
    };

    this.initialize();
  }

  private initialize(): void {
    this.registerDefaultVersions();
    this.emit('initialized', { timestamp: Date.now() });
  }

  /**
   * Register default API versions
   */
  private registerDefaultVersions(): void {
    this.registerVersion('1.0.0', new Date('2024-01-01'));
    this.registerVersion('2.0.0', new Date('2024-06-01'));
    this.registerVersion('3.0.0', new Date('2025-01-01'));
  }

  /**
   * Register API version
   */
  public registerVersion(version: string, releaseDate: Date): void {
    const [major, minor, patch] = version.split('.').map(Number);

    const apiVersion: APIVersion = {
      version,
      major,
      minor,
      patch,
      releaseDate,
      deprecated: false,
      status: 'active',
    };

    this.versions.set(version, apiVersion);
    this.emit('version-registered', { version, releaseDate });
  }

  /**
   * Register API route for version
   */
  public registerRoute(
    path: string,
    version: string,
    handler: (request: any) => Promise<any>,
    transformRequest?: (request: any) => any,
    transformResponse?: (response: any) => any
  ): void {
    if (!this.routes.has(path)) {
      this.routes.set(path, []);
    }

    const route: VersionRoute = {
      path,
      version,
      handler,
      transformRequest,
      transformResponse,
    };

    this.routes.get(path)!.push(route);
    this.emit('route-registered', { path, version });
  }

  /**
   * Route request to appropriate version handler
   */
  public async routeRequest(path: string, version: string, request: any): Promise<any> {
    const routes = this.routes.get(path);

    if (!routes) {
      throw new Error(`No routes found for path: ${path}`);
    }

    // Find matching route for version
    let route = routes.find((r) => r.version === version);

    if (!route) {
      // Try to find compatible version
      route = this.findCompatibleRoute(routes, version);
    }

    if (!route) {
      throw new Error(`No compatible route found for ${path} version ${version}`);
    }

    // Check if version is deprecated
    const apiVersion = this.versions.get(route.version);
    if (apiVersion?.deprecated) {
      this.stats.deprecatedCalls++;
      this.emit('deprecated-version-used', {
        path,
        version: route.version,
        sunsetDate: apiVersion.sunsetDate,
      });
    }

    // Transform request if needed
    let transformedRequest = request;
    if (route.transformRequest) {
      transformedRequest = route.transformRequest(request);
    }

    // Execute handler
    let response = await route.handler(transformedRequest);

    // Transform response if needed
    if (route.transformResponse) {
      response = route.transformResponse(response);
    }

    // Track version usage
    this.trackVersionUsage(route.version);

    return response;
  }

  /**
   * Find compatible route for version
   */
  private findCompatibleRoute(
    routes: VersionRoute[],
    requestedVersion: string
  ): VersionRoute | undefined {
    const [reqMajor, reqMinor] = requestedVersion.split('.').map(Number);

    // Find latest version with same major version
    const compatibleRoutes = routes.filter((r) => {
      const [major] = r.version.split('.').map(Number);
      return major === reqMajor;
    });

    if (compatibleRoutes.length === 0) {
      return undefined;
    }

    // Return latest compatible version
    return compatibleRoutes.sort((a, b) => {
      const aVersion = this.versions.get(a.version);
      const bVersion = this.versions.get(b.version);
      return (bVersion?.releaseDate.getTime() || 0) - (aVersion?.releaseDate.getTime() || 0);
    })[0];
  }

  /**
   * Deprecate API version
   */
  public deprecateVersion(version: string): void {
    const apiVersion = this.versions.get(version);

    if (!apiVersion) {
      return;
    }

    apiVersion.deprecated = true;
    apiVersion.deprecationDate = new Date();
    apiVersion.sunsetDate = new Date(
      Date.now() + this.deprecationPolicy.sunsetPeriod * 24 * 60 * 60 * 1000
    );
    apiVersion.status = 'deprecated';

    this.emit('version-deprecated', {
      version,
      sunsetDate: apiVersion.sunsetDate,
    });
  }

  /**
   * Sunset API version
   */
  public sunsetVersion(version: string): void {
    const apiVersion = this.versions.get(version);

    if (!apiVersion) {
      return;
    }

    apiVersion.status = 'sunset';
    this.emit('version-sunset', { version });
  }

  /**
   * Add migration guide
   */
  public addMigrationGuide(guide: MigrationGuide): void {
    const key = `${guide.fromVersion}->${guide.toVersion}`;
    this.migrationGuides.set(key, guide);
    this.emit('migration-guide-added', { from: guide.fromVersion, to: guide.toVersion });
  }

  /**
   * Get migration guide
   */
  public getMigrationGuide(fromVersion: string, toVersion: string): MigrationGuide | undefined {
    const key = `${fromVersion}->${toVersion}`;
    return this.migrationGuides.get(key);
  }

  /**
   * Get all migration guides
   */
  public getAllMigrationGuides(): MigrationGuide[] {
    return Array.from(this.migrationGuides.values());
  }

  /**
   * Track version usage
   */
  private trackVersionUsage(version: string): void {
    if (version.startsWith('1.')) {
      this.stats.requestsV1++;
    } else if (version.startsWith('2.')) {
      this.stats.requestsV2++;
    } else if (version.startsWith('3.')) {
      this.stats.requestsV3++;
    }
  }

  /**
   * Get version info
   */
  public getVersionInfo(version: string): APIVersion | undefined {
    return this.versions.get(version);
  }

  /**
   * Get all versions
   */
  public getAllVersions(): APIVersion[] {
    return Array.from(this.versions.values()).sort((a, b) => {
      return b.releaseDate.getTime() - a.releaseDate.getTime();
    });
  }

  /**
   * Get active versions
   */
  public getActiveVersions(): APIVersion[] {
    return this.getAllVersions().filter((v) => v.status === 'active');
  }

  /**
   * Get deprecated versions
   */
  public getDeprecatedVersions(): APIVersion[] {
    return this.getAllVersions().filter((v) => v.status === 'deprecated');
  }

  /**
   * Check version compatibility
   */
  public isCompatible(version1: string, version2: string): boolean {
    const [major1] = version1.split('.').map(Number);
    const [major2] = version2.split('.').map(Number);
    return major1 === major2;
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      totalVersions: this.versions.size,
      activeVersions: this.getActiveVersions().length,
      deprecatedVersions: this.getDeprecatedVersions().length,
      totalRoutes: this.routes.size,
    };
  }
}
