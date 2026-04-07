/**
 * API Analytics Engine
 * موتور تجزیه و تحلیل API برای نظارت بر عملکرد
 *
 * Features:
 * - Request/response tracking
 * - Performance metrics
 * - Usage analytics
 * - Trend analysis
 */

import { EventEmitter } from 'events';

export interface APIRequest {
  id: string;
  timestamp: number;
  method: string;
  endpoint: string;
  version: string;
  userId?: string;
  statusCode?: number;
  responseTime?: number;
  requestSize: number;
  responseSize?: number;
  error?: string;
}

export interface APIMetrics {
  totalRequests: number;
  totalErrors: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  requestsPerSecond: number;
}

export interface EndpointStats {
  endpoint: string;
  method: string;
  requests: number;
  errors: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
}

export interface UsagePattern {
  hour: number;
  requests: number;
  errors: number;
  averageResponseTime: number;
}

export class APIAnalyticsEngine extends EventEmitter {
  private requests: APIRequest[];
  private metrics: Map<string, EndpointStats>;
  private usagePatterns: Map<number, UsagePattern>;
  private stats: {
    totalRequests: number;
    totalErrors: number;
    totalResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;
  };

  constructor() {
    super();
    this.requests = [];
    this.metrics = new Map();
    this.usagePatterns = new Map();
    this.stats = {
      totalRequests: 0,
      totalErrors: 0,
      totalResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity,
    };

    this.initialize();
  }

  private initialize(): void {
    this.startAnalysis();
    this.emit('initialized', { timestamp: Date.now() });
  }

  /**
   * Track API request
   */
  public trackRequest(request: APIRequest): void {
    this.requests.push(request);

    // Update stats
    this.stats.totalRequests++;

    if (request.error) {
      this.stats.totalErrors++;
    }

    if (request.responseTime) {
      this.stats.totalResponseTime += request.responseTime;
      this.stats.maxResponseTime = Math.max(this.stats.maxResponseTime, request.responseTime);
      this.stats.minResponseTime = Math.min(this.stats.minResponseTime, request.responseTime);
    }

    // Update endpoint stats
    this.updateEndpointStats(request);

    // Update usage patterns
    this.updateUsagePattern(request);

    this.emit('request-tracked', {
      endpoint: request.endpoint,
      responseTime: request.responseTime,
      statusCode: request.statusCode,
    });
  }

  /**
   * Update endpoint statistics
   */
  private updateEndpointStats(request: APIRequest): void {
    const key = `${request.method}:${request.endpoint}`;

    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        endpoint: request.endpoint,
        method: request.method,
        requests: 0,
        errors: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: Infinity,
      });
    }

    const stats = this.metrics.get(key)!;
    stats.requests++;

    if (request.error) {
      stats.errors++;
    }

    if (request.responseTime) {
      stats.averageResponseTime =
        (stats.averageResponseTime * (stats.requests - 1) + request.responseTime) / stats.requests;
      stats.maxResponseTime = Math.max(stats.maxResponseTime, request.responseTime);
      stats.minResponseTime = Math.min(stats.minResponseTime, request.responseTime);
    }
  }

  /**
   * Update usage pattern
   */
  private updateUsagePattern(request: APIRequest): void {
    const hour = new Date(request.timestamp).getHours();

    if (!this.usagePatterns.has(hour)) {
      this.usagePatterns.set(hour, {
        hour,
        requests: 0,
        errors: 0,
        averageResponseTime: 0,
      });
    }

    const pattern = this.usagePatterns.get(hour)!;
    pattern.requests++;

    if (request.error) {
      pattern.errors++;
    }

    if (request.responseTime) {
      pattern.averageResponseTime =
        (pattern.averageResponseTime * (pattern.requests - 1) + request.responseTime) /
        pattern.requests;
    }
  }

  /**
   * Get overall metrics
   */
  public getMetrics(): APIMetrics {
    const responseTimes = this.requests
      .filter((r) => r.responseTime)
      .map((r) => r.responseTime!)
      .sort((a, b) => a - b);

    const p95Index = Math.floor(responseTimes.length * 0.95);
    const p99Index = Math.floor(responseTimes.length * 0.99);

    return {
      totalRequests: this.stats.totalRequests,
      totalErrors: this.stats.totalErrors,
      averageResponseTime:
        this.stats.totalRequests > 0 ? this.stats.totalResponseTime / this.stats.totalRequests : 0,
      p95ResponseTime: responseTimes[p95Index] || 0,
      p99ResponseTime: responseTimes[p99Index] || 0,
      errorRate:
        this.stats.totalRequests > 0 ? this.stats.totalErrors / this.stats.totalRequests : 0,
      requestsPerSecond: this.calculateRPS(),
    };
  }

  /**
   * Get endpoint statistics
   */
  public getEndpointStats(endpoint: string, method: string): EndpointStats | undefined {
    const key = `${method}:${endpoint}`;
    return this.metrics.get(key);
  }

  /**
   * Get all endpoint statistics
   */
  public getAllEndpointStats(): EndpointStats[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get usage patterns
   */
  public getUsagePatterns(): UsagePattern[] {
    return Array.from(this.usagePatterns.values()).sort((a, b) => a.hour - b.hour);
  }

  /**
   * Get top endpoints by requests
   */
  public getTopEndpoints(limit: number = 10): EndpointStats[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.requests - a.requests)
      .slice(0, limit);
  }

  /**
   * Get slowest endpoints
   */
  public getSlowestEndpoints(limit: number = 10): EndpointStats[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.averageResponseTime - a.averageResponseTime)
      .slice(0, limit);
  }

  /**
   * Get error rate by endpoint
   */
  public getErrorRateByEndpoint(): Array<{ endpoint: string; errorRate: number }> {
    return Array.from(this.metrics.values())
      .map((stats) => ({
        endpoint: `${stats.method}:${stats.endpoint}`,
        errorRate: stats.requests > 0 ? stats.errors / stats.requests : 0,
      }))
      .sort((a, b) => b.errorRate - a.errorRate);
  }

  /**
   * Calculate requests per second
   */
  private calculateRPS(): number {
    if (this.requests.length === 0) {
      return 0;
    }

    const timeSpan =
      (this.requests[this.requests.length - 1].timestamp - this.requests[0].timestamp) / 1000;

    if (timeSpan === 0) {
      return 0;
    }

    return this.requests.length / timeSpan;
  }

  /**
   * Start analysis
   */
  private startAnalysis(): void {
    setInterval(() => {
      this.performAnalysis();
    }, 60000); // Every minute
  }

  /**
   * Perform analysis
   */
  private performAnalysis(): void {
    const metrics = this.getMetrics();

    this.emit('analysis-complete', {
      totalRequests: metrics.totalRequests,
      errorRate: metrics.errorRate,
      averageResponseTime: metrics.averageResponseTime,
      rps: metrics.requestsPerSecond,
    });

    // Clean old requests (keep last hour)
    const oneHourAgo = Date.now() - 3600000;
    this.requests = this.requests.filter((r) => r.timestamp > oneHourAgo);
  }

  /**
   * Get trend analysis
   */
  public getTrendAnalysis() {
    const patterns = this.getUsagePatterns();
    const avgRequests = patterns.reduce((sum, p) => sum + p.requests, 0) / patterns.length;
    const avgResponseTime =
      patterns.reduce((sum, p) => sum + p.averageResponseTime, 0) / patterns.length;

    return {
      averageRequestsPerHour: avgRequests,
      averageResponseTime: avgResponseTime,
      peakHour: patterns.reduce((max, p) => (p.requests > max.requests ? p : max)),
      lowestHour: patterns.reduce((min, p) => (p.requests < min.requests ? p : min)),
    };
  }

  /**
   * Get health status
   */
  public getHealthStatus() {
    const metrics = this.getMetrics();

    return {
      healthy: metrics.errorRate < 0.05 && metrics.averageResponseTime < 1000,
      errorRate: metrics.errorRate,
      averageResponseTime: metrics.averageResponseTime,
      p99ResponseTime: metrics.p99ResponseTime,
      warnings: this.generateWarnings(metrics),
    };
  }

  /**
   * Generate warnings
   */
  private generateWarnings(metrics: APIMetrics): string[] {
    const warnings: string[] = [];

    if (metrics.errorRate > 0.05) {
      warnings.push(`High error rate: ${(metrics.errorRate * 100).toFixed(2)}%`);
    }

    if (metrics.averageResponseTime > 1000) {
      warnings.push(`Slow average response time: ${metrics.averageResponseTime.toFixed(0)}ms`);
    }

    if (metrics.p99ResponseTime > 5000) {
      warnings.push(`High p99 response time: ${metrics.p99ResponseTime.toFixed(0)}ms`);
    }

    return warnings;
  }

  /**
   * Export analytics
   */
  public exportAnalytics() {
    return {
      metrics: this.getMetrics(),
      endpoints: this.getAllEndpointStats(),
      usagePatterns: this.getUsagePatterns(),
      trends: this.getTrendAnalysis(),
      health: this.getHealthStatus(),
      timestamp: Date.now(),
    };
  }

  /**
   * Clear analytics
   */
  public clear(): void {
    this.requests = [];
    this.metrics.clear();
    this.usagePatterns.clear();
    this.stats = {
      totalRequests: 0,
      totalErrors: 0,
      totalResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity,
    };

    this.emit('cleared', { timestamp: Date.now() });
  }
}
