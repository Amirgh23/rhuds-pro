/**
 * Anomaly Detection System
 * Detect unusual patterns in data using statistical and ML methods
 */

export interface AnomalyScore {
  timestamp: Date;
  value: number;
  anomalyScore: number;
  isAnomaly: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AnomalyAlert {
  id: string;
  timestamp: Date;
  anomalyScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  rootCause?: string;
  suggestedAction?: string;
}

export interface AnomalyPattern {
  type: 'spike' | 'dip' | 'trend' | 'seasonal' | 'outlier';
  startTime: Date;
  endTime: Date;
  severity: number;
  description: string;
}

/**
 * AnomalyDetectionSystem - Detect unusual patterns in data
 */
export class AnomalyDetectionSystem {
  private baselineWindow: number = 30; // days
  private sensitivityThreshold: number = 2.5; // standard deviations
  private alerts: AnomalyAlert[] = [];

  /**
   * Detect anomalies using statistical methods
   */
  detectStatisticalAnomalies(
    data: Array<{ timestamp: Date; value: number }>,
    threshold: number = 2.5
  ): AnomalyScore[] {
    if (data.length < 2) return [];

    const values = data.map((d) => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, x) => sum + (x - mean) ** 2, 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return data.map((d, index) => {
      const zscore = (d.value - mean) / stdDev;
      const anomalyScore = Math.abs(zscore);
      const isAnomaly = anomalyScore > threshold;

      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (anomalyScore > 4) severity = 'critical';
      else if (anomalyScore > 3) severity = 'high';
      else if (anomalyScore > 2) severity = 'medium';

      return {
        timestamp: d.timestamp,
        value: d.value,
        anomalyScore,
        isAnomaly,
        severity,
      };
    });
  }

  /**
   * Detect anomalies using isolation forest algorithm
   */
  detectIsolationForestAnomalies(
    data: number[][],
    contamination: number = 0.1
  ): Array<{ index: number; anomalyScore: number; isAnomaly: boolean }> {
    if (data.length === 0) return [];

    const results = data.map((point, index) => {
      // Simplified isolation forest scoring
      let anomalyScore = 0;

      // Calculate distance to nearest neighbors
      let minDistance = Infinity;
      for (let i = 0; i < data.length; i++) {
        if (i === index) continue;

        const distance = Math.sqrt(point.reduce((sum, val, j) => sum + (val - data[i][j]) ** 2, 0));
        minDistance = Math.min(minDistance, distance);
      }

      anomalyScore = 1 / (1 + minDistance);

      return {
        index,
        anomalyScore,
        isAnomaly: anomalyScore > 1 - contamination,
      };
    });

    return results;
  }

  /**
   * Detect time series anomalies
   */
  detectTimeSeriesAnomalies(
    data: Array<{ timestamp: Date; value: number }>,
    windowSize: number = 7
  ): AnomalyScore[] {
    if (data.length < windowSize) {
      return this.detectStatisticalAnomalies(data);
    }

    const results: AnomalyScore[] = [];

    for (let i = windowSize; i < data.length; i++) {
      const window = data.slice(i - windowSize, i).map((d) => d.value);
      const current = data[i].value;

      const mean = window.reduce((a, b) => a + b, 0) / window.length;
      const variance = window.reduce((sum, x) => sum + (x - mean) ** 2, 0) / window.length;
      const stdDev = Math.sqrt(variance);

      const zscore = (current - mean) / stdDev;
      const anomalyScore = Math.abs(zscore);
      const isAnomaly = anomalyScore > this.sensitivityThreshold;

      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (anomalyScore > 4) severity = 'critical';
      else if (anomalyScore > 3) severity = 'high';
      else if (anomalyScore > 2) severity = 'medium';

      results.push({
        timestamp: data[i].timestamp,
        value: current,
        anomalyScore,
        isAnomaly,
        severity,
      });
    }

    return results;
  }

  /**
   * Detect pattern anomalies
   */
  detectPatternAnomalies(data: Array<{ timestamp: Date; value: number }>): AnomalyPattern[] {
    const patterns: AnomalyPattern[] = [];
    const values = data.map((d) => d.value);

    // Detect spikes
    for (let i = 1; i < values.length - 1; i++) {
      const prev = values[i - 1];
      const current = values[i];
      const next = values[i + 1];

      const change = Math.abs(current - prev) / Math.max(Math.abs(prev), 1);

      if (change > 0.5) {
        patterns.push({
          type: current > prev ? 'spike' : 'dip',
          startTime: data[i - 1].timestamp,
          endTime: data[i + 1].timestamp,
          severity: Math.min(1, change),
          description: `${current > prev ? 'Spike' : 'Dip'} detected: ${change.toFixed(2)}x change`,
        });
      }
    }

    // Detect trends
    if (values.length > 5) {
      const firstHalf = values.slice(0, Math.floor(values.length / 2));
      const secondHalf = values.slice(Math.floor(values.length / 2));

      const firstMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      const trendChange = Math.abs(secondMean - firstMean) / Math.max(firstMean, 1);

      if (trendChange > 0.3) {
        patterns.push({
          type: 'trend',
          startTime: data[0].timestamp,
          endTime: data[data.length - 1].timestamp,
          severity: Math.min(1, trendChange),
          description: `Trend change detected: ${trendChange.toFixed(2)}x`,
        });
      }
    }

    return patterns;
  }

  /**
   * Generate anomaly alert
   */
  generateAlert(anomalyScore: AnomalyScore, context?: Record<string, unknown>): AnomalyAlert {
    const alert: AnomalyAlert = {
      id: `alert-${Date.now()}`,
      timestamp: anomalyScore.timestamp,
      anomalyScore: anomalyScore.anomalyScore,
      severity: anomalyScore.severity,
      message: `Anomaly detected with severity: ${anomalyScore.severity}`,
    };

    // Suggest root cause and action based on severity
    if (anomalyScore.severity === 'critical') {
      alert.rootCause = 'Potential system failure or data corruption';
      alert.suggestedAction = 'Immediate investigation required';
    } else if (anomalyScore.severity === 'high') {
      alert.rootCause = 'Unusual pattern detected';
      alert.suggestedAction = 'Review recent changes and monitor closely';
    }

    this.alerts.push(alert);
    return alert;
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(hours: number = 24): AnomalyAlert[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.alerts.filter((a) => a.timestamp > cutoff);
  }

  /**
   * Analyze anomaly root cause
   */
  analyzeRootCause(
    anomaly: AnomalyScore,
    historicalData: Array<{ timestamp: Date; value: number }>
  ): string {
    const recentValues = historicalData
      .filter((d) => d.timestamp <= anomaly.timestamp)
      .slice(-10)
      .map((d) => d.value);

    if (recentValues.length === 0) return 'Insufficient data';

    const mean = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const variance =
      recentValues.reduce((sum, x) => sum + (x - mean) ** 2, 0) / recentValues.length;
    const stdDev = Math.sqrt(variance);

    if (anomaly.value > mean + 3 * stdDev) {
      return 'Extreme spike detected - possible system overload';
    } else if (anomaly.value < mean - 3 * stdDev) {
      return 'Extreme dip detected - possible system failure';
    } else if (anomaly.anomalyScore > 2) {
      return 'Significant deviation from baseline pattern';
    }

    return 'Unknown anomaly pattern';
  }

  /**
   * Set sensitivity threshold
   */
  setSensitivityThreshold(threshold: number): void {
    this.sensitivityThreshold = Math.max(1, Math.min(5, threshold));
  }

  /**
   * Get anomaly statistics
   */
  getAnomalyStatistics(anomalies: AnomalyScore[]): {
    totalAnomalies: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    averageScore: number;
  } {
    const critical = anomalies.filter((a) => a.severity === 'critical').length;
    const high = anomalies.filter((a) => a.severity === 'high').length;
    const medium = anomalies.filter((a) => a.severity === 'medium').length;
    const low = anomalies.filter((a) => a.severity === 'low').length;

    const avgScore =
      anomalies.reduce((sum, a) => sum + a.anomalyScore, 0) / Math.max(anomalies.length, 1);

    return {
      totalAnomalies: anomalies.length,
      criticalCount: critical,
      highCount: high,
      mediumCount: medium,
      lowCount: low,
      averageScore: avgScore,
    };
  }
}

export default AnomalyDetectionSystem;
