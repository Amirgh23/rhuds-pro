/**
 * Security Response Optimizer
 * Response optimization and learning
 */

/**
 * Response metric
 */
export interface ResponseMetric {
  id: string;
  timestamp: number;
  responseId: string;
  metricType: 'latency' | 'effectiveness' | 'cost' | 'coverage' | 'accuracy';
  value: number;
  target: number;
  status: 'below-target' | 'on-target' | 'above-target';
}

/**
 * Optimization recommendation
 */
export interface OptimizationRecommendation {
  id: string;
  timestamp: number;
  type: 'automation' | 'parallelization' | 'prioritization' | 'resource-allocation' | 'workflow';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  estimatedImprovement: number;
  implementationCost: number;
  status: 'pending' | 'implemented' | 'rejected';
  metrics?: Record<string, unknown>;
}

/**
 * Security Response Optimizer
 * Response optimization and learning
 */
export class SecurityResponseOptimizer {
  private metrics: Map<string, ResponseMetric> = new Map();
  private metricHistory: ResponseMetric[] = [];
  private recommendations: Map<string, OptimizationRecommendation> = new Map();
  private recommendationHistory: OptimizationRecommendation[] = [];
  private learningData: Array<{
    responseId: string;
    metrics: Record<string, number>;
    outcome: 'success' | 'partial' | 'failure';
  }> = [];

  /**
   * Record response metric
   */
  recordMetric(
    responseId: string,
    metricType: string,
    value: number,
    target: number
  ): ResponseMetric {
    const id = `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const status =
      value < target ? 'below-target' : value === target ? 'on-target' : 'above-target';

    const metric: ResponseMetric = {
      id,
      timestamp: Date.now(),
      responseId,
      metricType: metricType as ResponseMetric['metricType'],
      value,
      target,
      status,
    };

    this.metrics.set(id, metric);
    this.metricHistory.push(metric);

    // Trigger optimization analysis
    this.analyzeOptimizationOpportunities();

    return metric;
  }

  /**
   * Analyze optimization opportunities
   */
  private analyzeOptimizationOpportunities(): void {
    const recentMetrics = this.metricHistory.slice(-100);

    // Analyze latency
    const latencyMetrics = recentMetrics.filter((m) => m.metricType === 'latency');
    if (latencyMetrics.length > 10) {
      const avgLatency =
        latencyMetrics.reduce((sum, m) => sum + m.value, 0) / latencyMetrics.length;
      const belowTarget = latencyMetrics.filter((m) => m.status === 'below-target').length;

      if (belowTarget / latencyMetrics.length > 0.3) {
        this.generateRecommendation(
          'parallelization',
          'high',
          'Consider parallelizing response actions to reduce latency',
          15
        );
      }
    }

    // Analyze effectiveness
    const effectivenessMetrics = recentMetrics.filter((m) => m.metricType === 'effectiveness');
    if (effectivenessMetrics.length > 10) {
      const avgEffectiveness =
        effectivenessMetrics.reduce((sum, m) => sum + m.value, 0) / effectivenessMetrics.length;

      if (avgEffectiveness < 0.8) {
        this.generateRecommendation(
          'workflow',
          'high',
          'Optimize response workflow for better effectiveness',
          20
        );
      }
    }

    // Analyze cost
    const costMetrics = recentMetrics.filter((m) => m.metricType === 'cost');
    if (costMetrics.length > 10) {
      const avgCost = costMetrics.reduce((sum, m) => sum + m.value, 0) / costMetrics.length;
      const aboveTarget = costMetrics.filter((m) => m.status === 'above-target').length;

      if (aboveTarget / costMetrics.length > 0.4) {
        this.generateRecommendation(
          'resource-allocation',
          'medium',
          'Optimize resource allocation to reduce response costs',
          25
        );
      }
    }
  }

  /**
   * Generate recommendation
   */
  private generateRecommendation(
    type: string,
    priority: string,
    description: string,
    estimatedImprovement: number
  ): void {
    const id = `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const recommendation: OptimizationRecommendation = {
      id,
      timestamp: Date.now(),
      type: type as OptimizationRecommendation['type'],
      priority: priority as OptimizationRecommendation['priority'],
      description,
      estimatedImprovement,
      implementationCost: Math.random() * 100,
      status: 'pending',
    };

    this.recommendations.set(id, recommendation);
    this.recommendationHistory.push(recommendation);
  }

  /**
   * Record learning data
   */
  recordLearningData(
    responseId: string,
    metrics: Record<string, number>,
    outcome: 'success' | 'partial' | 'failure'
  ): void {
    this.learningData.push({
      responseId,
      metrics,
      outcome,
    });
  }

  /**
   * Get metric
   */
  getMetric(metricId: string): ResponseMetric | undefined {
    return this.metrics.get(metricId);
  }

  /**
   * Get metrics by response
   */
  getMetricsByResponse(responseId: string): ResponseMetric[] {
    return this.metricHistory.filter((m) => m.responseId === responseId);
  }

  /**
   * Get metrics by type
   */
  getMetricsByType(metricType: string): ResponseMetric[] {
    return this.metricHistory
      .filter((m) => m.metricType === metricType)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);
  }

  /**
   * Get metric trend
   */
  getMetricTrend(
    metricType: string,
    hours = 24
  ): Array<{
    timestamp: number;
    avgValue: number;
    minValue: number;
    maxValue: number;
  }> {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    const metrics = this.metricHistory.filter(
      (m) => m.metricType === metricType && m.timestamp >= cutoffTime
    );

    const hourlyBuckets: Record<number, { values: number[]; timestamp: number }> = {};

    for (const metric of metrics) {
      const hourBucket = Math.floor(metric.timestamp / (60 * 60 * 1000)) * (60 * 60 * 1000);
      if (!hourlyBuckets[hourBucket]) {
        hourlyBuckets[hourBucket] = { values: [], timestamp: hourBucket };
      }
      hourlyBuckets[hourBucket].values.push(metric.value);
    }

    const trend = Object.values(hourlyBuckets).map((bucket) => ({
      timestamp: bucket.timestamp,
      avgValue: bucket.values.reduce((a, b) => a + b, 0) / bucket.values.length,
      minValue: Math.min(...bucket.values),
      maxValue: Math.max(...bucket.values),
    }));

    return trend.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get recommendation
   */
  getRecommendation(recommendationId: string): OptimizationRecommendation | undefined {
    return this.recommendations.get(recommendationId);
  }

  /**
   * Get pending recommendations
   */
  getPendingRecommendations(): OptimizationRecommendation[] {
    return this.recommendationHistory
      .filter((r) => r.status === 'pending')
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  /**
   * Implement recommendation
   */
  implementRecommendation(recommendationId: string): boolean {
    const recommendation = this.recommendations.get(recommendationId);
    if (!recommendation) return false;

    recommendation.status = 'implemented';
    return true;
  }

  /**
   * Get optimization statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalMetrics = this.metricHistory.length;
    const onTargetMetrics = this.metricHistory.filter((m) => m.status === 'on-target').length;
    const belowTargetMetrics = this.metricHistory.filter((m) => m.status === 'below-target').length;
    const aboveTargetMetrics = this.metricHistory.filter((m) => m.status === 'above-target').length;

    const totalRecommendations = this.recommendationHistory.length;
    const implementedRecommendations = this.recommendationHistory.filter(
      (r) => r.status === 'implemented'
    ).length;
    const pendingRecommendations = this.recommendationHistory.filter(
      (r) => r.status === 'pending'
    ).length;

    const avgEstimatedImprovement =
      totalRecommendations > 0
        ? this.recommendationHistory.reduce((sum, r) => sum + r.estimatedImprovement, 0) /
          totalRecommendations
        : 0;

    const metricTypeDistribution: Record<string, number> = {};
    for (const metric of this.metricHistory) {
      metricTypeDistribution[metric.metricType] =
        (metricTypeDistribution[metric.metricType] || 0) + 1;
    }

    const successRate =
      this.learningData.length > 0
        ? (this.learningData.filter((d) => d.outcome === 'success').length /
            this.learningData.length) *
          100
        : 0;

    return {
      totalMetrics,
      onTargetMetrics,
      belowTargetMetrics,
      aboveTargetMetrics,
      targetComplianceRate: (onTargetMetrics / totalMetrics) * 100,
      totalRecommendations,
      implementedRecommendations,
      pendingRecommendations,
      avgEstimatedImprovement,
      metricTypeDistribution,
      learningDataPoints: this.learningData.length,
      successRate,
    };
  }

  /**
   * Export optimization report
   */
  exportOptimizationReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          metrics: this.metricHistory.slice(-100),
          recommendations: this.recommendationHistory.slice(-50),
          statistics: this.getStatistics(),
          learningDataPoints: this.learningData.slice(-50),
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['MetricID', 'Type', 'Value', 'Target', 'Status'];
    const rows = this.metricHistory
      .slice(-100)
      .map((m) => [m.id, m.metricType, m.value, m.target, m.status]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
