/**
 * Analytics Engine
 * API usage analytics and insights
 */

export interface APIMetric {
  endpoint: string;
  method: string;
  timestamp: number;
  duration: number;
  statusCode: number;
  userId?: string;
  requestSize: number;
  responseSize: number;
}

export interface AnalyticsReport {
  period: { start: Date; end: Date };
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  topEndpoints: Array<{ endpoint: string; count: number }>;
  topUsers: Array<{ userId: string; count: number }>;
  statusCodeDistribution: Record<number, number>;
}

/**
 * AnalyticsEngine - Track and analyze API usage
 */
export class AnalyticsEngine {
  private metrics: APIMetric[] = [];
  private aggregations: Map<string, Record<string, number>> = new Map();
  private listeners: Set<(event: string, data: unknown) => void> = new Set();
  private maxMetrics: number = 10000;

  constructor(maxMetrics: number = 10000) {
    this.maxMetrics = maxMetrics;
  }

  /**
   * Record metric
   */
  recordMetric(metric: APIMetric): void {
    this.metrics.push(metric);

    // Maintain max size
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    this.updateAggregations(metric);
    this.emit('metric_recorded', metric);
  }

  /**
   * Update aggregations
   */
  private updateAggregations(metric: APIMetric): void {
    const key = metric.endpoint;

    if (!this.aggregations.has(key)) {
      this.aggregations.set(key, {
        count: 0,
        totalDuration: 0,
        errors: 0,
        totalRequestSize: 0,
        totalResponseSize: 0,
      });
    }

    const agg = this.aggregations.get(key)!;
    agg.count++;
    agg.totalDuration += metric.duration;
    if (metric.statusCode >= 400) {
      agg.errors++;
    }
    agg.totalRequestSize += metric.requestSize;
    agg.totalResponseSize += metric.responseSize;
  }

  /**
   * Get metrics for period
   */
  getMetricsForPeriod(start: Date, end: Date): APIMetric[] {
    const startTime = start.getTime();
    const endTime = end.getTime();

    return this.metrics.filter((m) => m.timestamp >= startTime && m.timestamp <= endTime);
  }

  /**
   * Generate report
   */
  generateReport(start: Date, end: Date): AnalyticsReport {
    const metrics = this.getMetricsForPeriod(start, end);

    if (metrics.length === 0) {
      return {
        period: { start, end },
        totalRequests: 0,
        averageResponseTime: 0,
        errorRate: 0,
        topEndpoints: [],
        topUsers: [],
        statusCodeDistribution: {},
      };
    }

    const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);
    const errors = metrics.filter((m) => m.statusCode >= 400).length;
    const statusCodes: Record<number, number> = {};

    for (const metric of metrics) {
      statusCodes[metric.statusCode] = (statusCodes[metric.statusCode] || 0) + 1;
    }

    // Top endpoints
    const endpointCounts: Record<string, number> = {};
    for (const metric of metrics) {
      endpointCounts[metric.endpoint] = (endpointCounts[metric.endpoint] || 0) + 1;
    }

    const topEndpoints = Object.entries(endpointCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }));

    // Top users
    const userCounts: Record<string, number> = {};
    for (const metric of metrics) {
      if (metric.userId) {
        userCounts[metric.userId] = (userCounts[metric.userId] || 0) + 1;
      }
    }

    const topUsers = Object.entries(userCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([userId, count]) => ({ userId, count }));

    return {
      period: { start, end },
      totalRequests: metrics.length,
      averageResponseTime: totalDuration / metrics.length,
      errorRate: errors / metrics.length,
      topEndpoints,
      topUsers,
      statusCodeDistribution: statusCodes,
    };
  }

  /**
   * Get endpoint statistics
   */
  getEndpointStats(endpoint: string): Record<string, number> | null {
    return this.aggregations.get(endpoint) ?? null;
  }

  /**
   * Get all endpoint statistics
   */
  getAllEndpointStats(): Record<string, Record<string, number>> {
    const result: Record<string, Record<string, number>> = {};

    for (const [endpoint, stats] of this.aggregations) {
      result[endpoint] = stats;
    }

    return result;
  }

  /**
   * Get error rate
   */
  getErrorRate(endpoint?: string): number {
    let metrics = this.metrics;

    if (endpoint) {
      metrics = metrics.filter((m) => m.endpoint === endpoint);
    }

    if (metrics.length === 0) {
      return 0;
    }

    const errors = metrics.filter((m) => m.statusCode >= 400).length;
    return errors / metrics.length;
  }

  /**
   * Get average response time
   */
  getAverageResponseTime(endpoint?: string): number {
    let metrics = this.metrics;

    if (endpoint) {
      metrics = metrics.filter((m) => m.endpoint === endpoint);
    }

    if (metrics.length === 0) {
      return 0;
    }

    const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);
    return totalDuration / metrics.length;
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      totalMetrics: this.metrics.length,
      totalEndpoints: this.aggregations.size,
      averageResponseTime: this.getAverageResponseTime(),
      errorRate: this.getErrorRate(),
      oldestMetric: this.metrics.length > 0 ? this.metrics[0].timestamp : 0,
      newestMetric: this.metrics.length > 0 ? this.metrics[this.metrics.length - 1].timestamp : 0,
    };
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.aggregations.clear();
    this.emit('metrics_cleared', {});
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
