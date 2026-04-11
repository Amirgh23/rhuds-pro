/**
 * Health Check System
 * Performs comprehensive health checks on system endpoints and services
 */

/**
 * Endpoint configuration
 */
export interface EndpointConfig {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'HEAD';
  timeout: number;
  expectedStatus: number;
  retries: number;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  endpoint: string;
  status: 'up' | 'down' | 'degraded';
  statusCode?: number;
  responseTime: number;
  timestamp: number;
  error?: string;
  retryCount: number;
}

/**
 * Service health status
 */
export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  uptime: number;
  downtime: number;
  checks: HealthCheckResponse[];
}

/**
 * Health Check System
 * Monitors endpoint and service health
 */
export class HealthCheckSystem {
  private endpoints: Map<string, EndpointConfig> = new Map();
  private healthHistory: Map<string, HealthCheckResponse[]> = new Map();
  private serviceHealth: Map<string, ServiceHealth> = new Map();
  private checkIntervals: Map<string, NodeJS.Timeout> = new Map();
  private startTimes: Map<string, number> = new Map();
  private downTimes: Map<string, number> = new Map();

  /**
   * Register endpoint
   */
  registerEndpoint(config: EndpointConfig): void {
    this.endpoints.set(config.name, config);
    this.healthHistory.set(config.name, []);
    this.startTimes.set(config.name, Date.now());
    this.downTimes.set(config.name, 0);
  }

  /**
   * Perform health check
   */
  async performHealthCheck(endpointName: string): Promise<HealthCheckResponse> {
    const config = this.endpoints.get(endpointName);
    if (!config) {
      throw new Error(`Endpoint ${endpointName} not found`);
    }

    let retryCount = 0;
    let lastError: string | undefined;

    for (let i = 0; i < config.retries; i++) {
      try {
        const startTime = Date.now();
        const response = await this.makeRequest(config);
        const responseTime = Date.now() - startTime;

        const result: HealthCheckResponse = {
          endpoint: endpointName,
          status: response.status === config.expectedStatus ? 'up' : 'degraded',
          statusCode: response.status,
          responseTime,
          timestamp: Date.now(),
          retryCount,
        };

        this.recordHealthCheck(endpointName, result);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        retryCount++;

        if (i < config.retries - 1) {
          await this.delay(Math.pow(2, i) * 100); // Exponential backoff
        }
      }
    }

    const result: HealthCheckResponse = {
      endpoint: endpointName,
      status: 'down',
      responseTime: 0,
      timestamp: Date.now(),
      error: lastError,
      retryCount,
    };

    this.recordHealthCheck(endpointName, result);
    return result;
  }

  /**
   * Make HTTP request
   */
  private async makeRequest(config: EndpointConfig): Promise<{ status: number }> {
    // Simulate HTTP request
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, config.timeout);

      // Simulate request
      setTimeout(() => {
        clearTimeout(timer);
        resolve({ status: 200 });
      }, Math.random() * 100);
    });
  }

  /**
   * Record health check result
   */
  private recordHealthCheck(endpointName: string, result: HealthCheckResponse): void {
    const history = this.healthHistory.get(endpointName) || [];
    history.push(result);

    // Keep only last 100 checks
    if (history.length > 100) {
      history.shift();
    }

    this.healthHistory.set(endpointName, history);
    this.updateServiceHealth(endpointName);
  }

  /**
   * Update service health status
   */
  private updateServiceHealth(endpointName: string): void {
    const history = this.healthHistory.get(endpointName) || [];
    if (history.length === 0) return;

    const recentChecks = history.slice(-10);
    const upCount = recentChecks.filter((c) => c.status === 'up').length;
    const downCount = recentChecks.filter((c) => c.status === 'down').length;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (downCount > 0) {
      status = downCount > upCount ? 'unhealthy' : 'degraded';
    }

    const startTime = this.startTimes.get(endpointName) || Date.now();
    const totalTime = Date.now() - startTime;
    const downTime = this.downTimes.get(endpointName) || 0;

    const health: ServiceHealth = {
      name: endpointName,
      status,
      lastCheck: Date.now(),
      uptime: totalTime - downTime,
      downtime: downTime,
      checks: recentChecks,
    };

    this.serviceHealth.set(endpointName, health);
  }

  /**
   * Start continuous health checks
   */
  startContinuousChecks(endpointName: string, intervalMs: number): void {
    if (this.checkIntervals.has(endpointName)) {
      return; // Already running
    }

    const interval = setInterval(async () => {
      try {
        await this.performHealthCheck(endpointName);
      } catch (error) {
        console.error(`Health check failed for ${endpointName}:`, error);
      }
    }, intervalMs);

    this.checkIntervals.set(endpointName, interval);
  }

  /**
   * Stop continuous health checks
   */
  stopContinuousChecks(endpointName: string): void {
    const interval = this.checkIntervals.get(endpointName);
    if (interval) {
      clearInterval(interval);
      this.checkIntervals.delete(endpointName);
    }
  }

  /**
   * Get service health
   */
  getServiceHealth(endpointName: string): ServiceHealth | undefined {
    return this.serviceHealth.get(endpointName);
  }

  /**
   * Get all service health
   */
  getAllServiceHealth(): ServiceHealth[] {
    return Array.from(this.serviceHealth.values());
  }

  /**
   * Get health check history
   */
  getHealthCheckHistory(endpointName: string, limit?: number): HealthCheckResponse[] {
    const history = this.healthHistory.get(endpointName) || [];
    if (limit) {
      return history.slice(-limit);
    }
    return [...history];
  }

  /**
   * Get uptime percentage
   */
  getUptimePercentage(endpointName: string): number {
    const health = this.serviceHealth.get(endpointName);
    if (!health) return 0;

    const totalTime = health.uptime + health.downtime;
    if (totalTime === 0) return 100;

    return (health.uptime / totalTime) * 100;
  }

  /**
   * Get system health summary
   */
  getSystemHealthSummary(): Record<string, unknown> {
    const allHealth = Array.from(this.serviceHealth.values());
    const healthyCount = allHealth.filter((h) => h.status === 'healthy').length;
    const degradedCount = allHealth.filter((h) => h.status === 'degraded').length;
    const unhealthyCount = allHealth.filter((h) => h.status === 'unhealthy').length;

    const avgResponseTime =
      allHealth.length > 0
        ? allHealth.reduce((sum, h) => {
            const avgCheck =
              h.checks.length > 0
                ? h.checks.reduce((s, c) => s + c.responseTime, 0) / h.checks.length
                : 0;
            return sum + avgCheck;
          }, 0) / allHealth.length
        : 0;

    return {
      totalServices: allHealth.length,
      healthy: healthyCount,
      degraded: degradedCount,
      unhealthy: unhealthyCount,
      avgResponseTime,
      services: allHealth.map((h) => ({
        name: h.name,
        status: h.status,
        uptime: h.uptime,
        downtime: h.downtime,
      })),
    };
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clear all checks
   */
  clearAllChecks(): void {
    for (const interval of this.checkIntervals.values()) {
      clearInterval(interval);
    }
    this.checkIntervals.clear();
    this.healthHistory.clear();
    this.serviceHealth.clear();
  }
}
