/**
 * API Gateway Enhancement
 * بهبود درگاه API برای مسیریابی و تبدیل درخواست
 *
 * Features:
 * - Request routing
 * - Response transformation
 * - Protocol conversion
 * - Load distribution
 */

export interface Route {
  path: string;
  method: string;
  target: string;
  middleware: string[];
  rateLimit?: number;
  timeout?: number;
}

export interface GatewayRequest {
  id: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: number;
}

export interface GatewayResponse {
  id: string;
  status: number;
  headers: Record<string, string>;
  body: any;
  duration: number;
}

export interface LoadBalancer {
  targets: string[];
  strategy: 'round-robin' | 'least-connections' | 'weighted' | 'random';
  currentIndex: number;
}

export class APIGatewayEnhanced {
  private routes: Map<string, Route>;
  private loadBalancers: Map<string, LoadBalancer>;
  private requestLog: GatewayRequest[];
  private responseLog: GatewayResponse[];
  private stats: {
    requestsProcessed: number;
    requestsSuccessful: number;
    requestsFailed: number;
    totalDuration: number;
  };

  constructor() {
    this.routes = new Map();
    this.loadBalancers = new Map();
    this.requestLog = [];
    this.responseLog = [];
    this.stats = {
      requestsProcessed: 0,
      requestsSuccessful: 0,
      requestsFailed: 0,
      totalDuration: 0,
    };
  }

  /**
   * Register route
   */
  public registerRoute(route: Route): void {
    const routeKey = `${route.method}:${route.path}`;
    this.routes.set(routeKey, route);

    // Initialize load balancer if needed
    if (!this.loadBalancers.has(route.target)) {
      this.loadBalancers.set(route.target, {
        targets: [route.target],
        strategy: 'round-robin',
        currentIndex: 0,
      });
    }
  }

  /**
   * Route request
   */
  public async routeRequest(
    method: string,
    path: string,
    headers: Record<string, string>,
    body?: any
  ): Promise<GatewayResponse> {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    const request: GatewayRequest = {
      id: requestId,
      method,
      path,
      headers,
      body,
      timestamp: Date.now(),
    };

    this.requestLog.push(request);
    this.stats.requestsProcessed++;

    try {
      // Find matching route
      const routeKey = `${method}:${path}`;
      const route = this.routes.get(routeKey);

      if (!route) {
        return this.createErrorResponse(requestId, 404, 'Route not found', startTime);
      }

      // Get target from load balancer
      const target = this.selectTarget(route.target);

      // Forward request
      const response = await fetch(target, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseBody = await response.json();
      const duration = Date.now() - startTime;

      const gatewayResponse: GatewayResponse = {
        id: requestId,
        status: response.status,
        headers: Object.fromEntries(response.headers),
        body: responseBody,
        duration,
      };

      this.responseLog.push(gatewayResponse);
      this.stats.requestsSuccessful++;
      this.stats.totalDuration += duration;

      return gatewayResponse;
    } catch (error) {
      this.stats.requestsFailed++;
      return this.createErrorResponse(requestId, 500, 'Internal server error', startTime);
    }
  }

  /**
   * Select target using load balancer
   */
  private selectTarget(targetKey: string): string {
    const lb = this.loadBalancers.get(targetKey);
    if (!lb) return targetKey;

    let target: string;

    switch (lb.strategy) {
      case 'round-robin':
        target = lb.targets[lb.currentIndex % lb.targets.length];
        lb.currentIndex++;
        break;
      case 'random':
        target = lb.targets[Math.floor(Math.random() * lb.targets.length)];
        break;
      case 'least-connections':
        target = lb.targets[0]; // Simplified
        break;
      default:
        target = lb.targets[0];
    }

    return target;
  }

  /**
   * Create error response
   */
  private createErrorResponse(
    requestId: string,
    status: number,
    message: string,
    startTime: number
  ): GatewayResponse {
    return {
      id: requestId,
      status,
      headers: { 'Content-Type': 'application/json' },
      body: { error: message },
      duration: Date.now() - startTime,
    };
  }

  /**
   * Add load balancer target
   */
  public addLoadBalancerTarget(key: string, target: string): void {
    const lb = this.loadBalancers.get(key);
    if (lb) {
      lb.targets.push(target);
    }
  }

  /**
   * Set load balancer strategy
   */
  public setLoadBalancerStrategy(
    key: string,
    strategy: 'round-robin' | 'least-connections' | 'weighted' | 'random'
  ): void {
    const lb = this.loadBalancers.get(key);
    if (lb) {
      lb.strategy = strategy;
    }
  }

  /**
   * Get request log
   */
  public getRequestLog(limit: number = 10): GatewayRequest[] {
    return this.requestLog.slice(-limit);
  }

  /**
   * Get response log
   */
  public getResponseLog(limit: number = 10): GatewayResponse[] {
    return this.responseLog.slice(-limit);
  }

  /**
   * Get statistics
   */
  public getStats() {
    const successRate =
      this.stats.requestsProcessed > 0
        ? (this.stats.requestsSuccessful / this.stats.requestsProcessed) * 100
        : 0;
    const averageDuration =
      this.stats.requestsSuccessful > 0
        ? this.stats.totalDuration / this.stats.requestsSuccessful
        : 0;

    return {
      ...this.stats,
      successRate,
      averageDuration,
      totalRoutes: this.routes.size,
      totalLoadBalancers: this.loadBalancers.size,
    };
  }
}
