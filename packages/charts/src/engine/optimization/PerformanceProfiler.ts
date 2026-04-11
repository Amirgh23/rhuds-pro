/**
 * Performance Profiler
 * Comprehensive performance profiling and bottleneck detection
 */

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  category: 'render' | 'compute' | 'io' | 'memory' | 'network';
  metadata?: Record<string, unknown>;
}

export interface BottleneckAnalysis {
  id: string;
  metric: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  duration: number;
  frequency: number;
  impact: number;
  recommendation: string;
}

export interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedImprovement: number;
  effort: 'low' | 'medium' | 'high';
  category: string;
}

export interface ProfileSnapshot {
  timestamp: number;
  metrics: PerformanceMetric[];
  bottlenecks: BottleneckAnalysis[];
  recommendations: OptimizationRecommendation[];
  summary: Record<string, unknown>;
}

/**
 * Performance Profiler
 * Profiles application performance and identifies bottlenecks
 */
export class PerformanceProfiler {
  private metrics: PerformanceMetric[] = [];
  private snapshots: ProfileSnapshot[] = [];
  private thresholds: Record<string, number> = {
    render: 16, // 60fps
    compute: 100,
    io: 1000,
    memory: 50 * 1024 * 1024, // 50MB
    network: 5000,
  };

  /**
   * Record a performance metric
   */
  public recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }
  }

  /**
   * Analyze metrics for bottlenecks
   */
  public analyzeBottlenecks(): BottleneckAnalysis[] {
    const bottlenecks: BottleneckAnalysis[] = [];
    const metricsByName = this.groupMetricsByName();

    for (const [name, metrics] of Object.entries(metricsByName)) {
      const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
      const maxDuration = Math.max(...metrics.map((m) => m.duration));
      const category = metrics[0]?.category || 'compute';

      const threshold = this.thresholds[category] || 100;

      if (maxDuration > threshold) {
        const frequency = metrics.length;
        const impact = (maxDuration / threshold) * frequency;

        let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
        if (impact > 1000) severity = 'critical';
        else if (impact > 500) severity = 'high';
        else if (impact > 200) severity = 'medium';

        bottlenecks.push({
          id: `bottleneck-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          metric: name,
          severity,
          duration: maxDuration,
          frequency,
          impact,
          recommendation: this.getRecommendation(name, category, maxDuration),
        });
      }
    }

    return bottlenecks.sort((a, b) => b.impact - a.impact);
  }

  /**
   * Generate optimization recommendations
   */
  public generateRecommendations(): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    const bottlenecks = this.analyzeBottlenecks();

    for (const bottleneck of bottlenecks) {
      const recommendation = this.createRecommendation(bottleneck);
      recommendations.push(recommendation);
    }

    // Add general recommendations
    recommendations.push(...this.getGeneralRecommendations());

    return recommendations.sort((a, b) => {
      const priorityMap = { critical: 4, high: 3, medium: 2, low: 1 };
      return (
        priorityMap[b.priority as keyof typeof priorityMap] -
        priorityMap[a.priority as keyof typeof priorityMap]
      );
    });
  }

  /**
   * Create a recommendation from bottleneck
   */
  private createRecommendation(bottleneck: BottleneckAnalysis): OptimizationRecommendation {
    const priorityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      low: 'low',
      medium: 'medium',
      high: 'high',
      critical: 'critical',
    };

    return {
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `Optimize ${bottleneck.metric}`,
      description: bottleneck.recommendation,
      priority: priorityMap[bottleneck.severity] || 'medium',
      estimatedImprovement: Math.min(bottleneck.impact * 0.3, 100),
      effort: bottleneck.severity === 'critical' ? 'high' : 'medium',
      category: 'performance',
    };
  }

  /**
   * Get general recommendations
   */
  private getGeneralRecommendations(): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // Check memory usage
    if (this.metrics.length > 0) {
      const memoryMetrics = this.metrics.filter((m) => m.category === 'memory');
      if (memoryMetrics.length > 0) {
        const avgMemory =
          memoryMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / memoryMetrics.length;
        if (avgMemory > 30 * 1024 * 1024) {
          recommendations.push({
            id: `rec-memory-${Date.now()}`,
            title: 'Reduce Memory Usage',
            description: 'Consider implementing memory pooling or lazy loading',
            priority: 'high',
            estimatedImprovement: 20,
            effort: 'medium',
            category: 'memory',
          });
        }
      }
    }

    // Check render performance
    const renderMetrics = this.metrics.filter((m) => m.category === 'render');
    if (renderMetrics.length > 0) {
      const slowRenders = renderMetrics.filter((m) => m.duration > 16).length;
      if (slowRenders / renderMetrics.length > 0.1) {
        recommendations.push({
          id: `rec-render-${Date.now()}`,
          title: 'Improve Render Performance',
          description: 'Consider using React.memo, useMemo, or useCallback',
          priority: 'medium',
          estimatedImprovement: 15,
          effort: 'medium',
          category: 'rendering',
        });
      }
    }

    return recommendations;
  }

  /**
   * Get recommendation for a specific metric
   */
  private getRecommendation(name: string, category: string, duration: number): string {
    const recommendations: Record<string, string> = {
      render: 'Consider optimizing component rendering with React.memo or useMemo',
      compute: 'Consider breaking computation into smaller chunks or using Web Workers',
      io: 'Consider implementing caching or batching I/O operations',
      memory: 'Consider implementing memory pooling or garbage collection optimization',
      network: 'Consider implementing request batching or compression',
    };

    return recommendations[category] || 'Consider optimizing this operation';
  }

  /**
   * Group metrics by name
   */
  private groupMetricsByName(): Record<string, PerformanceMetric[]> {
    const grouped: Record<string, PerformanceMetric[]> = {};

    for (const metric of this.metrics) {
      if (!grouped[metric.name]) {
        grouped[metric.name] = [];
      }
      grouped[metric.name].push(metric);
    }

    return grouped;
  }

  /**
   * Create a performance snapshot
   */
  public createSnapshot(): ProfileSnapshot {
    const bottlenecks = this.analyzeBottlenecks();
    const recommendations = this.generateRecommendations();

    const summary = {
      totalMetrics: this.metrics.length,
      bottleneckCount: bottlenecks.length,
      recommendationCount: recommendations.length,
      averageDuration:
        this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length || 0,
      maxDuration: Math.max(...this.metrics.map((m) => m.duration), 0),
      minDuration: Math.min(...this.metrics.map((m) => m.duration), 0),
    };

    const snapshot: ProfileSnapshot = {
      timestamp: Date.now(),
      metrics: [...this.metrics],
      bottlenecks,
      recommendations,
      summary,
    };

    this.snapshots.push(snapshot);

    // Keep only last 100 snapshots
    if (this.snapshots.length > 100) {
      this.snapshots.shift();
    }

    return snapshot;
  }

  /**
   * Get performance statistics
   */
  public getStatistics(): Record<string, unknown> {
    const metricsByCategory = this.groupMetricsByCategory();

    return {
      totalMetrics: this.metrics.length,
      totalSnapshots: this.snapshots.length,
      metricsByCategory: Object.entries(metricsByCategory).reduce(
        (acc, [category, metrics]) => ({
          ...acc,
          [category]: {
            count: metrics.length,
            avgDuration: metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length,
            maxDuration: Math.max(...metrics.map((m) => m.duration)),
          },
        }),
        {}
      ),
      bottlenecks: this.analyzeBottlenecks().length,
      recommendations: this.generateRecommendations().length,
    };
  }

  /**
   * Group metrics by category
   */
  private groupMetricsByCategory(): Record<string, PerformanceMetric[]> {
    const grouped: Record<string, PerformanceMetric[]> = {};

    for (const metric of this.metrics) {
      if (!grouped[metric.category]) {
        grouped[metric.category] = [];
      }
      grouped[metric.category].push(metric);
    }

    return grouped;
  }

  /**
   * Set performance threshold
   */
  public setThreshold(category: string, threshold: number): void {
    this.thresholds[category] = threshold;
  }

  /**
   * Get recent snapshots
   */
  public getSnapshots(limit: number = 10): ProfileSnapshot[] {
    return this.snapshots.slice(-limit);
  }

  /**
   * Clear metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Export profile data
   */
  public exportData(): Record<string, unknown> {
    return {
      metrics: this.metrics,
      snapshots: this.snapshots,
      thresholds: this.thresholds,
      statistics: this.getStatistics(),
    };
  }
}
