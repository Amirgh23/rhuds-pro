/**
 * Post-Incident Analyzer
 * Analyzes incidents after resolution for lessons learned
 */

/**
 * Incident analysis
 */
export interface IncidentAnalysis {
  id: string;
  timestamp: number;
  incidentId: string;
  rootCause: string;
  contributingFactors: string[];
  timeline: Array<{ timestamp: number; event: string }>;
  impactAssessment: {
    systemsAffected: string[];
    dataExposed: boolean;
    usersImpacted: number;
    downtimeMinutes: number;
  };
  lessonsLearned: string[];
  recommendations: Array<{
    priority: 'critical' | 'high' | 'medium' | 'low';
    action: string;
    owner: string;
    dueDate: number;
  }>;
  preventiveMeasures: string[];
}

/**
 * Incident metric
 */
export interface IncidentMetric {
  id: string;
  timestamp: number;
  incidentId: string;
  metricType: string;
  value: number;
  unit: string;
}

/**
 * Post-Incident Analyzer
 * Analyzes incidents after resolution for lessons learned
 */
export class PostIncidentAnalyzer {
  private analyses: Map<string, IncidentAnalysis> = new Map();
  private metrics: Map<string, IncidentMetric[]> = new Map();
  private analysisHistory: IncidentAnalysis[] = [];
  private trends: Map<string, number[]> = new Map();

  /**
   * Create incident analysis
   */
  createAnalysis(analysis: Omit<IncidentAnalysis, 'id' | 'timestamp'>): IncidentAnalysis {
    const id = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const incidentAnalysis: IncidentAnalysis = {
      ...analysis,
      id,
      timestamp: Date.now(),
    };

    this.analyses.set(id, incidentAnalysis);
    this.analysisHistory.push(incidentAnalysis);

    return incidentAnalysis;
  }

  /**
   * Add metric
   */
  addMetric(metric: Omit<IncidentMetric, 'id' | 'timestamp'>): IncidentMetric {
    const id = `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const incidentMetric: IncidentMetric = {
      ...metric,
      id,
      timestamp: Date.now(),
    };

    const metrics = this.metrics.get(metric.incidentId) || [];
    metrics.push(incidentMetric);
    this.metrics.set(metric.incidentId, metrics);

    // Track trend
    const trendKey = `${metric.metricType}`;
    const trend = this.trends.get(trendKey) || [];
    trend.push(metric.value);
    this.trends.set(trendKey, trend);

    return incidentMetric;
  }

  /**
   * Get analysis
   */
  getAnalysis(analysisId: string): IncidentAnalysis | undefined {
    return this.analyses.get(analysisId);
  }

  /**
   * Get analysis by incident
   */
  getAnalysisByIncident(incidentId: string): IncidentAnalysis | undefined {
    return this.analysisHistory.find((a) => a.incidentId === incidentId);
  }

  /**
   * Get metrics for incident
   */
  getMetrics(incidentId: string): IncidentMetric[] {
    return this.metrics.get(incidentId) || [];
  }

  /**
   * Get root causes
   */
  getRootCauses(): Record<string, number> {
    const causes: Record<string, number> = {};

    for (const analysis of this.analysisHistory) {
      causes[analysis.rootCause] = (causes[analysis.rootCause] || 0) + 1;
    }

    return causes;
  }

  /**
   * Get contributing factors
   */
  getContributingFactors(): Record<string, number> {
    const factors: Record<string, number> = {};

    for (const analysis of this.analysisHistory) {
      for (const factor of analysis.contributingFactors) {
        factors[factor] = (factors[factor] || 0) + 1;
      }
    }

    return factors;
  }

  /**
   * Get recommendations
   */
  getRecommendations(priority?: 'critical' | 'high' | 'medium' | 'low'): Array<{
    priority: 'critical' | 'high' | 'medium' | 'low';
    action: string;
    owner: string;
    dueDate: number;
  }> {
    const recommendations: Array<{
      priority: 'critical' | 'high' | 'medium' | 'low';
      action: string;
      owner: string;
      dueDate: number;
    }> = [];

    for (const analysis of this.analysisHistory) {
      for (const rec of analysis.recommendations) {
        if (!priority || rec.priority === priority) {
          recommendations.push(rec);
        }
      }
    }

    return recommendations;
  }

  /**
   * Get trend analysis
   */
  getTrendAnalysis(metricType: string): Record<string, unknown> {
    const values = this.trends.get(metricType) || [];

    if (values.length === 0) {
      return { count: 0, average: 0, min: 0, max: 0, trend: 'stable' };
    }

    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Determine trend
    let trend = 'stable';
    if (values.length > 1) {
      const recent = values.slice(-5);
      const older = values.slice(0, Math.max(1, values.length - 5));
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

      if (recentAvg > olderAvg * 1.1) {
        trend = 'increasing';
      } else if (recentAvg < olderAvg * 0.9) {
        trend = 'decreasing';
      }
    }

    return {
      count: values.length,
      average,
      min,
      max,
      trend,
      values: values.slice(-10), // Last 10 values
    };
  }

  /**
   * Get impact summary
   */
  getImpactSummary(): Record<string, unknown> {
    let totalDowntime = 0;
    let totalUsersImpacted = 0;
    let dataExposureCount = 0;
    const affectedSystems: Set<string> = new Set();

    for (const analysis of this.analysisHistory) {
      totalDowntime += analysis.impactAssessment.downtimeMinutes;
      totalUsersImpacted += analysis.impactAssessment.usersImpacted;
      if (analysis.impactAssessment.dataExposed) {
        dataExposureCount++;
      }
      for (const system of analysis.impactAssessment.systemsAffected) {
        affectedSystems.add(system);
      }
    }

    return {
      totalIncidents: this.analysisHistory.length,
      totalDowntimeMinutes: totalDowntime,
      totalUsersImpacted,
      dataExposureIncidents: dataExposureCount,
      uniqueSystemsAffected: affectedSystems.size,
      avgDowntimePerIncident:
        this.analysisHistory.length > 0 ? totalDowntime / this.analysisHistory.length : 0,
    };
  }

  /**
   * Get lessons learned
   */
  getLessonsLearned(): Record<string, number> {
    const lessons: Record<string, number> = {};

    for (const analysis of this.analysisHistory) {
      for (const lesson of analysis.lessonsLearned) {
        lessons[lesson] = (lessons[lesson] || 0) + 1;
      }
    }

    return lessons;
  }

  /**
   * Get preventive measures
   */
  getPreventiveMeasures(): Record<string, number> {
    const measures: Record<string, number> = {};

    for (const analysis of this.analysisHistory) {
      for (const measure of analysis.preventiveMeasures) {
        measures[measure] = (measures[measure] || 0) + 1;
      }
    }

    return measures;
  }

  /**
   * Get analysis statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalAnalyses = this.analysisHistory.length;
    const rootCauses = this.getRootCauses();
    const contributingFactors = this.getContributingFactors();
    const impact = this.getImpactSummary();

    return {
      totalAnalyses,
      rootCauses,
      contributingFactors,
      impact,
      metricsCount: this.metrics.size,
      trendsTracked: this.trends.size,
    };
  }

  /**
   * Export analysis report
   */
  exportAnalysisReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.analysisHistory, null, 2);
    }

    // CSV format
    const headers = [
      'ID',
      'Timestamp',
      'Incident ID',
      'Root Cause',
      'Systems Affected',
      'Users Impacted',
      'Downtime Minutes',
    ];
    const rows = this.analysisHistory.map((a) => [
      a.id,
      a.timestamp,
      a.incidentId,
      a.rootCause,
      a.impactAssessment.systemsAffected.join(';'),
      a.impactAssessment.usersImpacted,
      a.impactAssessment.downtimeMinutes,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Generate executive summary
   */
  generateExecutiveSummary(): string {
    const stats = this.getStatistics();
    const impact = this.getImpactSummary();
    const rootCauses = this.getRootCauses();

    let summary = '# Post-Incident Analysis Executive Summary\n\n';
    summary += `## Overview\n`;
    summary += `- Total Incidents Analyzed: ${stats.totalAnalyses}\n`;
    summary += `- Total Downtime: ${impact.totalDowntimeMinutes} minutes\n`;
    summary += `- Total Users Impacted: ${impact.totalUsersImpacted}\n`;
    summary += `- Data Exposure Incidents: ${impact.dataExposureIncidents}\n\n`;

    summary += `## Root Causes\n`;
    for (const [cause, count] of Object.entries(rootCauses)) {
      summary += `- ${cause}: ${count} incidents\n`;
    }

    summary += `\n## Key Metrics\n`;
    summary += `- Average Downtime per Incident: ${impact.avgDowntimePerIncident?.toFixed(2)} minutes\n`;
    summary += `- Unique Systems Affected: ${impact.uniqueSystemsAffected}\n`;

    return summary;
  }
}
