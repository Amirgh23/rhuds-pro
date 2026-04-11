/**
 * Security Metrics Aggregator
 * Aggregates and analyzes security metrics
 */

/**
 * Security metric
 */
export interface SecurityMetric {
  id: string;
  timestamp: number;
  name: string;
  value: number;
  unit: string;
  category: string;
  source: string;
  tags: string[];
}

/**
 * Metric aggregate
 */
export interface MetricAggregate {
  name: string;
  count: number;
  sum: number;
  avg: number;
  min: number;
  max: number;
  stdDev: number;
}

/**
 * Security Metrics Aggregator
 * Aggregates and analyzes security metrics
 */
export class SecurityMetricsAggregator {
  private metrics: Map<string, SecurityMetric> = new Map();
  private metricHistory: SecurityMetric[] = [];
  private aggregates: Map<string, MetricAggregate> = new Map();

  /**
   * Record metric
   */
  recordMetric(metric: Omit<SecurityMetric, 'id' | 'timestamp'>): SecurityMetric {
    const id = `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const securityMetric: SecurityMetric = {
      ...metric,
      id,
      timestamp: Date.now(),
    };

    this.metrics.set(id, securityMetric);
    this.metricHistory.push(securityMetric);

    // Update aggregates
    this.updateAggregate(metric.name);

    return securityMetric;
  }

  /**
   * Update aggregate
   */
  private updateAggregate(metricName: string): void {
    const relevantMetrics = this.metricHistory.filter((m) => m.name === metricName);

    if (relevantMetrics.length === 0) return;

    const values = relevantMetrics.map((m) => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Calculate standard deviation
    const squaredDiffs = values.map((v) => Math.pow(v - avg, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(variance);

    this.aggregates.set(metricName, {
      name: metricName,
      count: values.length,
      sum,
      avg,
      min,
      max,
      stdDev,
    });
  }

  /**
   * Get metrics by category
   */
  getMetricsByCategory(category: string, limit = 100): SecurityMetric[] {
    return this.metricHistory
      .filter((m) => m.category === category)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get metrics by source
   */
  getMetricsBySource(source: string, limit = 100): SecurityMetric[] {
    return this.metricHistory
      .filter((m) => m.source === source)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string, limit = 100): SecurityMetric[] {
    return this.metricHistory
      .filter((m) => m.name === name)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get metrics by time range
   */
  getMetricsByTimeRange(startTime: number, endTime: number): SecurityMetric[] {
    return this.metricHistory
      .filter((m) => m.timestamp >= startTime && m.timestamp <= endTime)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get metric aggregate
   */
  getMetricAggregate(metricName: string): MetricAggregate | undefined {
    return this.aggregates.get(metricName);
  }

  /**
   * Get all aggregates
   */
  getAllAggregates(): MetricAggregate[] {
    return Array.from(this.aggregates.values());
  }

  /**
   * Get metric trend
   */
  getMetricTrend(
    metricName: string,
    hours = 24
  ): Array<{
    timestamp: number;
    value: number;
    avg: number;
  }> {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    const relevantMetrics = this.metricHistory.filter(
      (m) => m.name === metricName && m.timestamp >= cutoffTime
    );

    const hourlyBuckets: Record<number, number[]> = {};

    for (const metric of relevantMetrics) {
      const hourBucket = Math.floor(metric.timestamp / (60 * 60 * 1000)) * (60 * 60 * 1000);
      if (!hourlyBuckets[hourBucket]) {
        hourlyBuckets[hourBucket] = [];
      }
      hourlyBuckets[hourBucket].push(metric.value);
    }

    const trend: Array<{
      timestamp: number;
      value: number;
      avg: number;
    }> = [];

    for (const [timestamp, values] of Object.entries(hourlyBuckets)) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      trend.push({
        timestamp: parseInt(timestamp),
        value: values[values.length - 1],
        avg,
      });
    }

    return trend.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get anomalies
   */
  getAnomalies(metricName: string, stdDevThreshold = 2): SecurityMetric[] {
    const aggregate = this.aggregates.get(metricName);
    if (!aggregate) return [];

    const relevantMetrics = this.metricHistory.filter((m) => m.name === metricName);

    return relevantMetrics.filter((m) => {
      const zScore = Math.abs((m.value - aggregate.avg) / aggregate.stdDev);
      return zScore > stdDevThreshold;
    });
  }

  /**
   * Get security metrics statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalMetrics = this.metricHistory.length;

    const categoryDistribution: Record<string, number> = {};
    for (const metric of this.metricHistory) {
      categoryDistribution[metric.category] = (categoryDistribution[metric.category] || 0) + 1;
    }

    const sourceDistribution: Record<string, number> = {};
    for (const metric of this.metricHistory) {
      sourceDistribution[metric.source] = (sourceDistribution[metric.source] || 0) + 1;
    }

    const metricNames = new Set(this.metricHistory.map((m) => m.name));

    return {
      totalMetrics,
      uniqueMetrics: metricNames.size,
      categoryDistribution,
      sourceDistribution,
      aggregateCount: this.aggregates.size,
    };
  }

  /**
   * Export metrics report
   */
  exportMetricsReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          statistics: this.getStatistics(),
          aggregates: this.getAllAggregates(),
          metrics: this.metricHistory.slice(-100),
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['Timestamp', 'Name', 'Value', 'Unit', 'Category', 'Source'];
    const rows = this.metricHistory
      .slice(-100)
      .map((m) => [m.timestamp, m.name, m.value, m.unit, m.category, m.source]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Get metric
   */
  getMetric(metricId: string): SecurityMetric | undefined {
    return this.metrics.get(metricId);
  }

  /**
   * Get metric history
   */
  getMetricHistory(limit = 100): SecurityMetric[] {
    return this.metricHistory.slice(-limit);
  }
}
