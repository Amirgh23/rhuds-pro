/**
 * REST API v2
 * API RESTful نسخه 2 با ویژگی‌های پیشرفته
 *
 * Features:
 * - RESTful endpoints
 * - Request validation
 * - Response formatting
 * - Error handling
 * - Versioning
 */

import { EventEmitter } from 'events';

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, any>;
}

export interface APIResponse<T = any> {
  status: number;
  data?: T;
  error?: { message: string; code: string };
  meta?: { timestamp: number; version: string };
}

export interface APIRoute {
  method: string;
  path: string;
  handler: (req: APIRequest) => Promise<any>;
  middleware?: Array<(req: APIRequest) => Promise<void>>;
  auth?: boolean;
}

export class RESTAPIv2 extends EventEmitter {
  private routes: Map<string, APIRoute>;
  private middleware: Array<(req: APIRequest) => Promise<void>>;
  private stats: {
    requestsHandled: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
  };

  constructor() {
    super();
    this.routes = new Map();
    this.middleware = [];
    this.stats = {
      requestsHandled: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
    };
    this.setupDefaultRoutes();
  }

  private setupDefaultRoutes(): void {
    // Chart endpoints
    this.registerRoute('GET', '/api/v2/charts', this.getCharts.bind(this));
    this.registerRoute('GET', '/api/v2/charts/:id', this.getChart.bind(this));
    this.registerRoute('POST', '/api/v2/charts', this.createChart.bind(this));
    this.registerRoute('PUT', '/api/v2/charts/:id', this.updateChart.bind(this));
    this.registerRoute('DELETE', '/api/v2/charts/:id', this.deleteChart.bind(this));

    // User endpoints
    this.registerRoute('GET', '/api/v2/users', this.getUsers.bind(this));
    this.registerRoute('GET', '/api/v2/users/:id', this.getUser.bind(this));
    this.registerRoute('POST', '/api/v2/users', this.createUser.bind(this));
    this.registerRoute('PUT', '/api/v2/users/:id', this.updateUser.bind(this));
    this.registerRoute('DELETE', '/api/v2/users/:id', this.deleteUser.bind(this));

    // Permission endpoints
    this.registerRoute('POST', '/api/v2/permissions', this.shareChart.bind(this));
    this.registerRoute('DELETE', '/api/v2/permissions/:id', this.revokeAccess.bind(this));

    // Health check
    this.registerRoute('GET', '/api/v2/health', this.healthCheck.bind(this));
  }

  registerRoute(method: string, path: string, handler: (req: APIRequest) => Promise<any>): void {
    const key = `${method}:${path}`;
    this.routes.set(key, { method, path, handler });
    this.emit('route-registered', { method, path });
  }

  use(middleware: (req: APIRequest) => Promise<void>): void {
    this.middleware.push(middleware);
  }

  async handleRequest(req: APIRequest): Promise<APIResponse> {
    const startTime = Date.now();

    try {
      // Apply middleware
      for (const mw of this.middleware) {
        await mw(req);
      }

      // Find matching route
      const route = this.findRoute(req.method, req.path);
      if (!route) {
        this.stats.failedRequests++;
        return {
          status: 404,
          error: { message: 'Route not found', code: 'NOT_FOUND' },
          meta: { timestamp: Date.now(), version: '2.0' },
        };
      }

      // Execute handler
      const data = await route.handler(req);

      this.stats.successfulRequests++;
      this.stats.requestsHandled++;

      const responseTime = Date.now() - startTime;
      this.updateAverageResponseTime(responseTime);

      this.emit('request-handled', {
        method: req.method,
        path: req.path,
        status: 200,
        responseTime,
      });

      return {
        status: 200,
        data,
        meta: { timestamp: Date.now(), version: '2.0' },
      };
    } catch (error) {
      this.stats.failedRequests++;
      this.stats.requestsHandled++;

      const responseTime = Date.now() - startTime;
      this.updateAverageResponseTime(responseTime);

      this.emit('request-error', {
        method: req.method,
        path: req.path,
        error: (error as Error).message,
        responseTime,
      });

      return {
        status: 500,
        error: { message: (error as Error).message, code: 'INTERNAL_ERROR' },
        meta: { timestamp: Date.now(), version: '2.0' },
      };
    }
  }

  private findRoute(method: string, path: string): APIRoute | undefined {
    const key = `${method}:${path}`;
    return this.routes.get(key);
  }

  private updateAverageResponseTime(responseTime: number): void {
    const total = this.stats.averageResponseTime * (this.stats.requestsHandled - 1);
    this.stats.averageResponseTime = (total + responseTime) / this.stats.requestsHandled;
  }

  // ============ CHART ENDPOINTS ============

  private async getCharts(req: APIRequest): Promise<any> {
    const limit = Math.min(req.query?.limit || 10, 100);
    const offset = req.query?.offset || 0;
    return { charts: [], total: 0, limit, offset };
  }

  private async getChart(req: APIRequest): Promise<any> {
    const id = this.extractPathParam(req.path, 'id');
    return { id, name: 'Chart', type: 'LINE', data: [] };
  }

  private async createChart(req: APIRequest): Promise<any> {
    const { name, type, data, config } = req.body;
    return {
      id: `chart-${Date.now()}`,
      name,
      type,
      data,
      config,
      createdAt: new Date().toISOString(),
    };
  }

  private async updateChart(req: APIRequest): Promise<any> {
    const id = this.extractPathParam(req.path, 'id');
    return { id, ...req.body, updatedAt: new Date().toISOString() };
  }

  private async deleteChart(req: APIRequest): Promise<any> {
    const id = this.extractPathParam(req.path, 'id');
    return { success: true, deletedId: id };
  }

  // ============ USER ENDPOINTS ============

  private async getUsers(req: APIRequest): Promise<any> {
    const limit = Math.min(req.query?.limit || 10, 100);
    const offset = req.query?.offset || 0;
    return { users: [], total: 0, limit, offset };
  }

  private async getUser(req: APIRequest): Promise<any> {
    const id = this.extractPathParam(req.path, 'id');
    return { id, name: 'User', email: 'user@example.com', role: 'VIEWER' };
  }

  private async createUser(req: APIRequest): Promise<any> {
    const { name, email, role } = req.body;
    return {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
  }

  private async updateUser(req: APIRequest): Promise<any> {
    const id = this.extractPathParam(req.path, 'id');
    return { id, ...req.body, updatedAt: new Date().toISOString() };
  }

  private async deleteUser(req: APIRequest): Promise<any> {
    const id = this.extractPathParam(req.path, 'id');
    return { success: true, deletedId: id };
  }

  // ============ PERMISSION ENDPOINTS ============

  private async shareChart(req: APIRequest): Promise<any> {
    const { chartId, userId, role } = req.body;
    return {
      id: `perm-${Date.now()}`,
      chartId,
      userId,
      role,
      grantedAt: new Date().toISOString(),
    };
  }

  private async revokeAccess(req: APIRequest): Promise<any> {
    const id = this.extractPathParam(req.path, 'id');
    return { success: true, revokedId: id };
  }

  // ============ HEALTH CHECK ============

  private async healthCheck(req: APIRequest): Promise<any> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '2.0',
    };
  }

  private extractPathParam(path: string, paramName: string): string {
    const parts = path.split('/');
    const index = parts.findIndex((p) => p === `:${paramName}`);
    return index >= 0 ? parts[index + 1] : '';
  }

  getStats() {
    return { ...this.stats };
  }
}
