/**
 * Threat Analytics Engine
 * Advanced threat analytics and analysis
 */

/**
 * Threat metric definition
 */
export interface ThreatMetric {
  id: string;
  threatId: string;
  type: string;
  value: number;
  timestamp: Date;
}

/**
 * Threat analysis result
 */
export interface ThreatAnalysisResult {
  id: string;
  threatId: string;
  type: string;
  severity: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  metrics: ThreatMetric[];
  insights: string[];
  timestamp: Date;
}

/**
 * Threat trend data
 */
export interface ThreatTrend {
  threatId: string;
  type: string;
  dataPoints: Array<{ timestamp: Date; value: number }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  changeRate: number;
}

/**
 * Analytics statistics
 */
export interface AnalyticsStatistics {
  totalThreats: number;
  totalMetrics: number;
  totalAnalyses: number;
  averageSeverity: number;
  increasingTrends: number;
  decreasingTrends: number;
  stableTrends: number;
}

/**
 * Threat Analytics Engine
 * Performs advanced threat analytics and trend analysis
 */
export class ThreatAnalyticsEngine {
  private metrics: Map<string, ThreatMetric[]> = new Map();
  private analyses: Map<string, ThreatAnalysisResult> = new Map();
  private trends: Map<string, ThreatTrend> = new Map();

  /**
   * Record threat metric
   */
  recordMetric(threatId: string, type: string, value: number): ThreatMetric {
    const id = `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metric: ThreatMetric = {
      id,
      threatId,
      type,
      value,
      timestamp: new Date(),
    };

    if (!this.metrics.has(threatId)) {
      this.metrics.set(threatId, []);
    }
    this.metrics.get(threatId)!.push(metric);

    return metric;
  }

  /**
   * Analyze threat
   */
  analyzeThreat(threatId: string, type: string): ThreatAnalysisResult {
    const id = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const threatMetrics = this.metrics.get(threatId) || [];

    const severity = threatMetrics.length > 0 ? Math.min(1, threatMetrics.length / 100) : 0;
    const trend = this.calculateTrend(threatMetrics);
    const insights = this.generateInsights(threatMetrics, severity);

    const analysis: ThreatAnalysisResult = {
      id,
      threatId,
      type,
      severity,
      trend,
      metrics: threatMetrics,
      insights,
      timestamp: new Date(),
    };

    this.analyses.set(id, analysis);
    return analysis;
  }

  /**
   * Calculate trend from metrics
   */
  private calculateTrend(metrics: ThreatMetric[]): 'increasing' | 'decreasing' | 'stable' {
    if (metrics.length < 2) return 'stable';

    const recent = metrics.slice(-10);
    const oldAvg = recent.slice(0, 5).reduce((sum, m) => sum + m.value, 0) / 5;
    const newAvg = recent.slice(-5).reduce((sum, m) => sum + m.value, 0) / 5;

    if (newAvg > oldAvg * 1.1) return 'increasing';
    if (newAvg < oldAvg * 0.9) return 'decreasing';
    return 'stable';
  }

  /**
   * Generate insights from metrics
   */
  private generateInsights(metrics: ThreatMetric[], severity: number): string[] {
    const insights: string[] = [];

    if (severity > 0.7) {
      insights.push('High severity threat detected');
    }

    if (metrics.length > 50) {
      insights.push('Sustained threat activity');
    }

    const trend = this.calculateTrend(metrics);
    if (trend === 'increasing') {
      insights.push('Threat activity is increasing');
    }

    return insights;
  }

  /**
   * Get threat metrics
   */
  getThreatMetrics(threatId: string): ThreatMetric[] {
    return this.metrics.get(threatId) || [];
  }

  /**
   * Get analysis
   */
  getAnalysis(analysisId: string): ThreatAnalysisResult | undefined {
    return this.analyses.get(analysisId);
  }

  /**
   * Get threat trend
   */
  getThreatTrend(threatId: string, type: string): ThreatTrend {
    const key = `${threatId}-${type}`;
    if (this.trends.has(key)) {
      return this.trends.get(key)!;
    }

    const metrics = this.metrics.get(threatId) || [];
    const dataPoints = metrics.map((m) => ({ timestamp: m.timestamp, value: m.value }));
    const trend = this.calculateTrend(metrics);

    const changeRate =
      dataPoints.length > 1
        ? (dataPoints[dataPoints.length - 1].value - dataPoints[0].value) / dataPoints[0].value
        : 0;

    const threatTrend: ThreatTrend = {
      threatId,
      type,
      dataPoints,
      trend,
      changeRate,
    };

    this.trends.set(key, threatTrend);
    return threatTrend;
  }

  /**
   * Get high severity analyses
   */
  getHighSeverityAnalyses(threshold: number): ThreatAnalysisResult[] {
    return Array.from(this.analyses.values()).filter((a) => a.severity >= threshold);
  }

  /**
   * Get analyses by trend
   */
  getAnalysesByTrend(trend: 'increasing' | 'decreasing' | 'stable'): ThreatAnalysisResult[] {
    return Array.from(this.analyses.values()).filter((a) => a.trend === trend);
  }

  /**
   * Get statistics
   */
  getStatistics(): AnalyticsStatistics {
    const allAnalyses = Array.from(this.analyses.values());
    const allMetrics = Array.from(this.metrics.values()).flat();

    return {
      totalThreats: this.metrics.size,
      totalMetrics: allMetrics.length,
      totalAnalyses: allAnalyses.length,
      averageSeverity:
        allAnalyses.length > 0
          ? allAnalyses.reduce((sum, a) => sum + a.severity, 0) / allAnalyses.length
          : 0,
      increasingTrends: allAnalyses.filter((a) => a.trend === 'increasing').length,
      decreasingTrends: allAnalyses.filter((a) => a.trend === 'decreasing').length,
      stableTrends: allAnalyses.filter((a) => a.trend === 'stable').length,
    };
  }

  /**
   * Export analytics report
   */
  exportAnalyticsReport(format: 'json' | 'csv'): string {
    const stats = this.getStatistics();
    const analyses = Array.from(this.analyses.values());

    if (format === 'json') {
      return JSON.stringify({ statistics: stats, analyses }, null, 2);
    }

    const rows = [
      ['Type', 'Value'],
      ['Total Threats', stats.totalThreats.toString()],
      ['Total Metrics', stats.totalMetrics.toString()],
      ['Total Analyses', stats.totalAnalyses.toString()],
      ['Average Severity', stats.averageSeverity.toFixed(2)],
      ['Increasing Trends', stats.increasingTrends.toString()],
      ['Decreasing Trends', stats.decreasingTrends.toString()],
      ['Stable Trends', stats.stableTrends.toString()],
    ];

    return rows.map((row) => row.join(',')).join('\n');
  }
}
