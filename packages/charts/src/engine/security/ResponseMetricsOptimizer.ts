/**
 * Response Metrics Optimizer
 * Optimizes response metrics and performance based on historical data
 */

/**
 * Response metric definition
 */
export interface ResponseMetric {
  id: string;
  responseId: string;
  metricType: 'latency' | 'accuracy' | 'coverage' | 'efficiency' | 'cost';
  value: number;
  target: number;
  timestamp: Date;
}

/**
 * Performance baseline
 */
export interface PerformanceBaseline {
  metricType: string;
  average: number;
  minimum: number;
  maximum: number;
  standardDeviation: number;
  sampleSize: number;
}

/**
 * Optimization recommendation
 */
export interface OptimizationRecommendation {
  id: string;
  metricType: string;
  currentValue: number;
  targetValue: number;
  improvement: number;
  recommendation: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedImpact: number;
}

/**
 * Metrics statistics
 */
export interface MetricsStatistics {
  totalMetrics: number;
  metricsOnTarget: number;
  metricsOffTarget: number;
  averageLatency: number;
  averageAccuracy: number;
  averageCoverage: number;
  averageEfficiency: number;
  averageCost: number;
  overallHealthScore: number;
}

/**
 * Response Metrics Optimizer
 * Optimizes response metrics and provides recommendations
 */
export class ResponseMetricsOptimizer {
  private metrics: Map<string, ResponseMetric> = new Map();
  private baselines: Map<string, PerformanceBaseline> = new Map();
  private recommendations: Map<string, OptimizationRecommendation> = new Map();
  private optimizationHistory: Array<{ timestamp: Date; metric: string; improvement: number }> = [];

  /**
   * Record metric
   */
  recordMetric(
    responseId: string,
    metricType: string,
    value: number,
    target: number
  ): ResponseMetric {
    const id = `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metric: ResponseMetric = {
      id,
      responseId,
      metricType: metricType as 'latency' | 'accuracy' | 'coverage' | 'efficiency' | 'cost',
      value,
      target,
      timestamp: new Date(),
    };

    this.metrics.set(id, metric);

    // Update baseline
    this.updateBaseline(metricType, value);

    return metric;
  }

  /**
   * Update performance baseline
   */
  private updateBaseline(metricType: string, value: number): void {
    const existing = this.baselines.get(metricType);
    const metricsOfType = Array.from(this.metrics.values()).filter(
      (m) => m.metricType === metricType
    );

    if (metricsOfType.length === 0) return;

    const values = metricsOfType.map((m) => m.value);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);

    const variance = values.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    this.baselines.set(metricType, {
      metricType,
      average,
      minimum,
      maximum,
      standardDeviation,
      sampleSize: values.length,
    });
  }

  /**
   * Analyze metrics and generate recommendations
   */
  analyzeMetrics(): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    const metricsMap = new Map<string, ResponseMetric[]>();

    // Group metrics by type
    Array.from(this.metrics.values()).forEach((metric) => {
      if (!metricsMap.has(metric.metricType)) {
        metricsMap.set(metric.metricType, []);
      }
      metricsMap.get(metric.metricType)!.push(metric);
    });

    // Analyze each metric type
    metricsMap.forEach((metrics, metricType) => {
      const baseline = this.baselines.get(metricType);
      if (!baseline) return;

      const offTargetMetrics = metrics.filter((m) => m.value > m.target);
      if (offTargetMetrics.length === 0) return;

      const avgOffTarget =
        offTargetMetrics.reduce((sum, m) => sum + m.value, 0) / offTargetMetrics.length;
      const avgTarget =
        offTargetMetrics.reduce((sum, m) => sum + m.target, 0) / offTargetMetrics.length;
      const improvement = ((avgOffTarget - avgTarget) / avgOffTarget) * 100;

      const priority =
        improvement > 30
          ? 'critical'
          : improvement > 15
            ? 'high'
            : improvement > 5
              ? 'medium'
              : 'low';

      const recommendation: OptimizationRecommendation = {
        id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        metricType,
        currentValue: avgOffTarget,
        targetValue: avgTarget,
        improvement,
        recommendation: `Optimize ${metricType} by reducing from ${avgOffTarget.toFixed(2)} to ${avgTarget.toFixed(2)}`,
        priority,
        estimatedImpact: improvement / 100,
      };

      this.recommendations.set(recommendation.id, recommendation);
      recommendations.push(recommendation);
    });

    return recommendations;
  }

  /**
   * Get metric
   */
  getMetric(metricId: string): ResponseMetric | undefined {
    return this.metrics.get(metricId);
  }

  /**
   * Get baseline
   */
  getBaseline(metricType: string): PerformanceBaseline | undefined {
    return this.baselines.get(metricType);
  }

  /**
   * Get recommendation
   */
  getRecommendation(recommendationId: string): OptimizationRecommendation | undefined {
    return this.recommendations.get(recommendationId);
  }

  /**
   * Get metrics by response
   */
  getMetricsByResponse(responseId: string): ResponseMetric[] {
    return Array.from(this.metrics.values()).filter((m) => m.responseId === responseId);
  }

  /**
   * Get metrics by type
   */
  getMetricsByType(metricType: string): ResponseMetric[] {
    return Array.from(this.metrics.values()).filter((m) => m.metricType === metricType);
  }

  /**
   * Get off-target metrics
   */
  getOffTargetMetrics(): ResponseMetric[] {
    return Array.from(this.metrics.values()).filter((m) => m.value > m.target);
  }

  /**
   * Get recommendations by priority
   */
  getRecommendationsByPriority(priority: string): OptimizationRecommendation[] {
    return Array.from(this.recommendations.values()).filter((r) => r.priority === priority);
  }

  /**
   * Apply optimization
   */
  applyOptimization(recommendationId: string): boolean {
    const recommendation = this.recommendations.get(recommendationId);
    if (!recommendation) return false;

    this.optimizationHistory.push({
      timestamp: new Date(),
      metric: recommendation.metricType,
      improvement: recommendation.improvement,
    });

    return true;
  }

  /**
   * Get optimization history
   */
  getOptimizationHistory(): Array<{ timestamp: Date; metric: string; improvement: number }> {
    return [...this.optimizationHistory];
  }

  /**
   * Get statistics
   */
  getStatistics(): MetricsStatistics {
    const allMetrics = Array.from(this.metrics.values());
    const onTargetMetrics = allMetrics.filter((m) => m.value <= m.target);
    const offTargetMetrics = allMetrics.filter((m) => m.value > m.target);

    const latencyMetrics = allMetrics.filter((m) => m.metricType === 'latency');
    const accuracyMetrics = allMetrics.filter((m) => m.metricType === 'accuracy');
    const coverageMetrics = allMetrics.filter((m) => m.metricType === 'coverage');
    const efficiencyMetrics = allMetrics.filter((m) => m.metricType === 'efficiency');
    const costMetrics = allMetrics.filter((m) => m.metricType === 'cost');

    const avg = (metrics: ResponseMetric[]): number =>
      metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length : 0;

    const onTargetRate =
      allMetrics.length > 0 ? (onTargetMetrics.length / allMetrics.length) * 100 : 100;
    const healthScore = Math.max(0, 100 - (offTargetMetrics.length / allMetrics.length) * 50);

    return {
      totalMetrics: allMetrics.length,
      metricsOnTarget: onTargetMetrics.length,
      metricsOffTarget: offTargetMetrics.length,
      averageLatency: avg(latencyMetrics),
      averageAccuracy: avg(accuracyMetrics),
      averageCoverage: avg(coverageMetrics),
      averageEfficiency: avg(efficiencyMetrics),
      averageCost: avg(costMetrics),
      overallHealthScore: healthScore,
    };
  }

  /**
   * Export metrics report
   */
  exportMetricsReport(format: 'json' | 'csv'): string {
    const stats = this.getStatistics();
    const recommendations = Array.from(this.recommendations.values());

    if (format === 'json') {
      return JSON.stringify({ statistics: stats, recommendations }, null, 2);
    }

    const rows = [
      ['Metric', 'Value'],
      ['Total Metrics', stats.totalMetrics.toString()],
      ['Metrics On Target', stats.metricsOnTarget.toString()],
      ['Metrics Off Target', stats.metricsOffTarget.toString()],
      ['Average Latency', stats.averageLatency.toFixed(2)],
      ['Average Accuracy', stats.averageAccuracy.toFixed(2)],
      ['Average Coverage', stats.averageCoverage.toFixed(2)],
      ['Average Efficiency', stats.averageEfficiency.toFixed(2)],
      ['Average Cost', stats.averageCost.toFixed(2)],
      ['Overall Health Score', stats.overallHealthScore.toFixed(2)],
    ];

    return rows.map((row) => row.join(',')).join('\n');
  }
}
