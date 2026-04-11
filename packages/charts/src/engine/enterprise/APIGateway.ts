/**
 * API Gateway
 * Centralized API management with routing, rate limiting, and authentication
 */

export interface RouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  target: string;
  rateLimit?: number;
  requiresAuth?: boolean;
  timeout?: number;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  burstSize?: number;
}

export interface AuthConfig {
  type: 'bearer' | 'api-key' | 'oauth2';
  secret?: string;
  issuer?: string;
}

export interface GatewayStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  rateLimitedRequests: number;
  unauthorizedRequests: number;
  averageResponseTime: number;
}

/**
 * APIGateway - Centralized API management
 */
export class APIGateway {
  private routes: Map<string, RouteConfig> = new Map();
  private rateLimiters: Map<string, { count: number; resetTime: number }> = new Map();
  private authConfig: AuthConfig;
  private stats: GatewayStats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    rateLimitedRequests: 0,
    unauthorizedRequests: 0,
    averageResponseTime: 0,
  };
  private responseTimes: number[] = [];

  constructor(authConfig: AuthConfig = { type: 'bearer' }) {
    this.authConfig = authConfig;
  }

  /**
   * Register route
   */
  registerRoute(config: RouteConfig): void {
    const key = `${config.method}:${config.path}`;
    this.routes.set(key, config);
  }

  /**
   * Get route
   */
  getRoute(method: string, path: string): RouteConfig | undefined {
    const key = `${method}:${path}`;
    return this.routes.get(key);
  }

  /**
   * Handle request
   */
  async handleRequest(
    method: string,
    path: string,
    token?: string,
    clientId?: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    this.stats.totalRequests++;

    const route = this.getRoute(method, path);
    if (!route) {
      this.stats.failedRequests++;
      return { allowed: false, reason: 'Route not found' };
    }

    // Check authentication
    if (route.requiresAuth && !this.validateAuth(token)) {
      this.stats.unauthorizedRequests++;
      return { allowed: false, reason: 'Unauthorized' };
    }

    // Check rate limit
    const clientKey = clientId || 'anonymous';
    if (!this.checkRateLimit(clientKey, route.rateLimit)) {
      this.stats.rateLimitedRequests++;
      return { allowed: false, reason: 'Rate limit exceeded' };
    }

    this.stats.successfulRequests++;
    return { allowed: true };
  }

  /**
   * Validate authentication
   */
  private validateAuth(token?: string): boolean {
    if (!token) {
      return false;
    }

    switch (this.authConfig.type) {
      case 'bearer':
        return token.startsWith('Bearer ');
      case 'api-key':
        return token === this.authConfig.secret;
      case 'oauth2':
        return this.validateOAuth2Token(token);
      default:
        return false;
    }
  }

  /**
   * Validate OAuth2 token
   */
  private validateOAuth2Token(token: string): boolean {
    try {
      const parts = token.split('.');
      return parts.length === 3;
    } catch {
      return false;
    }
  }

  /**
   * Check rate limit
   */
  private checkRateLimit(clientId: string, limit?: number): boolean {
    if (!limit) {
      return true;
    }

    const now = Date.now();
    const limiter = this.rateLimiters.get(clientId);

    if (!limiter || now > limiter.resetTime) {
      this.rateLimiters.set(clientId, {
        count: 1,
        resetTime: now + 60000, // 1 minute
      });
      return true;
    }

    if (limiter.count < limit) {
      limiter.count++;
      return true;
    }

    return false;
  }

  /**
   * Record response time
   */
  recordResponseTime(responseTime: number): void {
    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }

    this.stats.averageResponseTime =
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }

  /**
   * Get statistics
   */
  getStatistics(): GatewayStats {
    return { ...this.stats };
  }

  /**
   * Get routes
   */
  getRoutes(): RouteConfig[] {
    return Array.from(this.routes.values());
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(clientId: string): Record<string, unknown> {
    const limiter = this.rateLimiters.get(clientId);
    if (!limiter) {
      return { limited: false, count: 0 };
    }

    return {
      limited: false,
      count: limiter.count,
      resetTime: new Date(limiter.resetTime).toISOString(),
    };
  }

  /**
   * Reset rate limiter
   */
  resetRateLimiter(clientId: string): void {
    this.rateLimiters.delete(clientId);
  }

  /**
   * Get success rate
   */
  getSuccessRate(): number {
    if (this.stats.totalRequests === 0) {
      return 0;
    }

    return this.stats.successfulRequests / this.stats.totalRequests;
  }

  /**
   * Get error rate
   */
  getErrorRate(): number {
    if (this.stats.totalRequests === 0) {
      return 0;
    }

    return this.stats.failedRequests / this.stats.totalRequests;
  }
}
