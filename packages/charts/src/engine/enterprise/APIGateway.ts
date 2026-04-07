/**
 * API Gateway
 * Centralized API management
 *
 * درگاه API
 * مدیریت متمرکز API
 */

import { EventEmitter } from 'events';

export interface APIRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: (req: any) => Promise<any>;
  rateLimit?: number;
  requiresAuth?: boolean;
  version?: string;
}

export interface APIRequest {
  id: string;
  path: string;
  method: string;
  timestamp: number;
  clientId: string;
  authenticated: boolean;
}

export interface APIResponse {
  status: number;
  data: any;
  timestamp: number;
  executionTime: number;
}

export interface APIGatewayConfig {
  enableRateLimit: boolean;
  enableCaching: boolean;
  enableVersioning: boolean;
  defaultVersion: string;
  requestTimeout: number;
  maxRequestSize: number;
}

export class APIGateway extends EventEmitter {
  private routes: Map<string, APIRoute> = new Map();
  private rateLimitMap: Map<string, number[]> = new Map();
  private responseCache: Map<string, APIResponse> = new Map();
  private config: APIGatewayConfig;
  private requestLog: APIRequest[] = [];

  constructor(config?: Partial<APIGatewayConfig>) {
    super();
    this.config = {
      enableRateLimit: true,
      enableCaching: true,
      enableVersioning: true,
      defaultVersion: 'v1',
      requestTimeout: 30000,
      maxRequestSize: 10 * 1024 * 1024, // 10MB
      ...config,
    };
  }

  /**
   * Register route
   */
  registerRoute(route: APIRoute): void {
    const key = `${route.method}:${route.path}`;
    this.routes.set(key, route);
    this.emit('route:registered', { path: route.path, method: route.method });
  }

  /**
   * Handle request
   */
  async handleRequest(req: any): Promise<APIResponse> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    // Log request
    const apiRequest: APIRequest = {
      id: requestId,
      path: req.path,
      method: req.method,
      timestamp: startTime,
      clientId: req.clientId || 'unknown',
      authenticated: req.authenticated || false,
    };

    this.requestLog.push(apiRequest);

    try {
      // Check rate limit
      if (this.config.enableRateLimit) {
        if (!this.checkRateLimit(req.clientId)) {
          this.emit('request:rate-limited', { clientId: req.clientId });
          return {
            status: 429,
            data: { error: 'Too many requests' },
            timestamp: Date.now(),
            executionTime: Date.now() - startTime,
          };
        }
      }

      // Check cache
      const cacheKey = this.generateCacheKey(req);
      if (this.config.enableCaching && req.method === 'GET') {
        const cached = this.responseCache.get(cacheKey);
        if (cached) {
          this.emit('request:cache-hit', { path: req.path });
          return cached;
        }
      }

      // Find route
      const routeKey = `${req.method}:${req.path}`;
      const route = this.routes.get(routeKey);

      if (!route) {
        this.emit('request:not-found', { path: req.path, method: req.method });
        return {
          status: 404,
          data: { error: 'Route not found' },
          timestamp: Date.now(),
          executionTime: Date.now() - startTime,
        };
      }

      // Check authentication
      if (route.requiresAuth && !req.authenticated) {
        this.emit('request:unauthorized', { path: req.path });
        return {
          status: 401,
          data: { error: 'Unauthorized' },
          timestamp: Date.now(),
          executionTime: Date.now() - startTime,
        };
      }

      // Execute handler
      const data = await route.handler(req);

      const response: APIResponse = {
        status: 200,
        data,
        timestamp: Date.now(),
        executionTime: Date.now() - startTime,
      };

      // Cache response
      if (this.config.enableCaching && req.method === 'GET') {
        this.responseCache.set(cacheKey, response);
      }

      this.emit('request:completed', {
        path: req.path,
        status: 200,
        executionTime: response.executionTime,
      });

      return response;
    } catch (error) {
      this.emit('request:error', { path: req.path, error: (error as Error).message });

      return {
        status: 500,
        data: { error: 'Internal server error' },
        timestamp: Date.now(),
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Check rate limit
   */
  private checkRateLimit(clientId: string): boolean {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    let requests = this.rateLimitMap.get(clientId) || [];
    requests = requests.filter((timestamp) => timestamp > windowStart);

    if (requests.length >= 100) {
      // 100 requests per minute
      return false;
    }

    requests.push(now);
    this.rateLimitMap.set(clientId, requests);

    return true;
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(req: any): string {
    return `${req.method}:${req.path}:${JSON.stringify(req.query || {})}`;
  }

  /**
   * Generate request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get route
   */
  getRoute(method: string, path: string): APIRoute | null {
    const key = `${method}:${path}`;
    return this.routes.get(key) || null;
  }

  /**
   * Get all routes
   */
  getAllRoutes(): APIRoute[] {
    return Array.from(this.routes.values());
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.responseCache.clear();
    this.emit('cache:cleared', {});
  }

  /**
   * Get request statistics
   */
  getRequestStats(): {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    avgResponseTime: number;
  } {
    const totalRequests = this.requestLog.length;
    const successfulRequests = this.requestLog.filter((r) => r.authenticated).length;
    const failedRequests = totalRequests - successfulRequests;
    const avgResponseTime = 0; // Would calculate from actual response times

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      avgResponseTime,
    };
  }

  /**
   * Get request log
   */
  getRequestLog(limit: number = 100): APIRequest[] {
    return this.requestLog.slice(-limit);
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(clientId: string): { remaining: number; resetTime: number } {
    const now = Date.now();
    const windowStart = now - 60000;

    const requests = (this.rateLimitMap.get(clientId) || []).filter(
      (timestamp) => timestamp > windowStart
    );

    return {
      remaining: Math.max(0, 100 - requests.length),
      resetTime: requests.length > 0 ? requests[0] + 60000 : now,
    };
  }

  /**
   * Enable versioning
   */
  enableVersioning(version: string): void {
    this.config.enableVersioning = true;
    this.config.defaultVersion = version;
    this.emit('versioning:enabled', { version });
  }

  /**
   * Disable versioning
   */
  disableVersioning(): void {
    this.config.enableVersioning = false;
    this.emit('versioning:disabled', {});
  }

  /**
   * Get API documentation
   */
  getDocumentation(): any {
    const routes = Array.from(this.routes.values()).map((route) => ({
      path: route.path,
      method: route.method,
      requiresAuth: route.requiresAuth,
      version: route.version || this.config.defaultVersion,
    }));

    return {
      version: this.config.defaultVersion,
      routes,
      totalRoutes: routes.length,
    };
  }
}
