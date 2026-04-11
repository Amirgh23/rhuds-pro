/**
 * Anomaly Detection Engine
 * Advanced anomaly detection and analysis
 */

/**
 * Baseline profile
 */
export interface BaselineProfile {
  id: string;
  name: string;
  timestamp: number;
  metrics: Record<
    string,
    {
      mean: number;
      stdDev: number;
      min: number;
      max: number;
    }
  >;
  sampleCount: number;
}

/**
 * Anomaly detection result
 */
export interface AnomalyResult {
  id: string;
  timestamp: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  anomalyScore: number;
  deviations: Array<{
    metric: string;
    value: number;
    expectedRange: [number, number];
    deviation: number;
  }>;
  context: Record<string, unknown>;
}

/**
 * Anomaly Detection Engine
 * Advanced anomaly detection and analysis
 */
export class AnomalyDetectionEngine {
  private baselineProfiles: Map<string, BaselineProfile> = new Map();
  private anomalies: Map<string, AnomalyResult> = new Map();
  private anomalyHistory: AnomalyResult[] = [];
  private dataPoints: Array<Record<string, number>> = [];

  /**
   * Create baseline profile
   */
  createBaselineProfile(name: string, dataPoints: Array<Record<string, number>>): BaselineProfile {
    const id = `baseline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const metrics: Record<
      string,
      {
        mean: number;
        stdDev: number;
        min: number;
        max: number;
      }
    > = {};

    // Calculate metrics for each field
    const fields = new Set<string>();
    for (const point of dataPoints) {
      for (const key of Object.keys(point)) {
        fields.add(key);
      }
    }

    for (const field of fields) {
      const values = dataPoints.map((p) => p[field]).filter((v) => typeof v === 'number');

      if (values.length > 0) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        metrics[field] = {
          mean,
          stdDev,
          min: Math.min(...values),
          max: Math.max(...values),
        };
      }
    }

    const profile: BaselineProfile = {
      id,
      name,
      timestamp: Date.now(),
      metrics,
      sampleCount: dataPoints.length,
    };

    this.baselineProfiles.set(id, profile);
    return profile;
  }

  /**
   * Record data point
   */
  recordDataPoint(data: Record<string, number>): void {
    this.dataPoints.push(data);
  }

  /**
   * Detect anomalies
   */
  detectAnomalies(
    baselineId: string,
    data: Record<string, number>,
    threshold = 2.5
  ): AnomalyResult | null {
    const baseline = this.baselineProfiles.get(baselineId);
    if (!baseline) return null;

    const resultId = `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const deviations: AnomalyResult['deviations'] = [];
    let totalDeviation = 0;

    for (const [metric, value] of Object.entries(data)) {
      if (typeof value !== 'number') continue;

      const profile = baseline.metrics[metric];
      if (!profile) continue;

      const zScore = Math.abs((value - profile.mean) / (profile.stdDev || 1));
      const deviation = zScore;

      if (zScore > threshold) {
        deviations.push({
          metric,
          value,
          expectedRange: [profile.mean - profile.stdDev * 2, profile.mean + profile.stdDev * 2],
          deviation,
        });
        totalDeviation += deviation;
      }
    }

    if (deviations.length === 0) return null;

    const anomalyScore = Math.min(totalDeviation / deviations.length, 1.0);

    let severity: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (anomalyScore > 0.8) {
      severity = 'critical';
    } else if (anomalyScore > 0.6) {
      severity = 'high';
    } else if (anomalyScore > 0.4) {
      severity = 'medium';
    }

    const result: AnomalyResult = {
      id: resultId,
      timestamp: Date.now(),
      severity,
      anomalyScore,
      deviations,
      context: { baselineId, dataPoint: data },
    };

    this.anomalies.set(resultId, result);
    this.anomalyHistory.push(result);
    return result;
  }

  /**
   * Get baseline profile
   */
  getBaselineProfile(baselineId: string): BaselineProfile | undefined {
    return this.baselineProfiles.get(baselineId);
  }

  /**
   * Get all baseline profiles
   */
  getAllBaselineProfiles(): BaselineProfile[] {
    return Array.from(this.baselineProfiles.values());
  }

  /**
   * Get anomaly
   */
  getAnomaly(anomalyId: string): AnomalyResult | undefined {
    return this.anomalies.get(anomalyId);
  }

  /**
   * Get anomalies by severity
   */
  getAnomaliesBySeverity(severity: string, limit = 100): AnomalyResult[] {
    return this.anomalyHistory
      .filter((a) => a.severity === severity)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(-limit);
  }

  /**
   * Get high anomaly score results
   */
  getHighAnomalyScores(minScore = 0.7, limit = 100): AnomalyResult[] {
    return this.anomalyHistory
      .filter((a) => a.anomalyScore >= minScore)
      .sort((a, b) => b.anomalyScore - a.anomalyScore)
      .slice(-limit);
  }

  /**
   * Get anomaly history
   */
  getAnomalyHistory(limit = 100): AnomalyResult[] {
    return this.anomalyHistory.slice(-limit);
  }

  /**
   * Get anomaly statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalAnomalies = this.anomalyHistory.length;
    const totalDataPoints = this.dataPoints.length;

    const severityDistribution: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const anomaly of this.anomalyHistory) {
      severityDistribution[anomaly.severity]++;
    }

    const avgAnomalyScore =
      totalAnomalies > 0
        ? this.anomalyHistory.reduce((sum, a) => sum + a.anomalyScore, 0) / totalAnomalies
        : 0;

    const anomalyRate = totalDataPoints > 0 ? (totalAnomalies / totalDataPoints) * 100 : 0;

    const deviationMetrics: Record<string, number> = {};
    for (const anomaly of this.anomalyHistory) {
      for (const deviation of anomaly.deviations) {
        deviationMetrics[deviation.metric] = (deviationMetrics[deviation.metric] || 0) + 1;
      }
    }

    return {
      totalAnomalies,
      totalDataPoints,
      anomalyRate,
      avgAnomalyScore,
      severityDistribution,
      deviationMetrics,
      baselineProfileCount: this.baselineProfiles.size,
    };
  }

  /**
   * Export anomaly report
   */
  exportAnomalyReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          baselineProfiles: Array.from(this.baselineProfiles.values()),
          statistics: this.getStatistics(),
          recentAnomalies: this.anomalyHistory.slice(-50),
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['AnomalyID', 'Severity', 'AnomalyScore', 'DeviationCount', 'Timestamp'];
    const rows = this.anomalyHistory
      .slice(-100)
      .map((a) => [a.id, a.severity, a.anomalyScore, a.deviations.length, a.timestamp]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
