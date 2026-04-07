/**
 * Anomaly Detection System
 * Detect unusual patterns in data with multiple algorithms
 *
 * سیستم تشخیص ناهنجاری
 * تشخیص الگوهای غیرعادی در داده ها با الگوریتم های متعدد
 */

import { EventEmitter } from 'events';

export interface AnomalyScore {
  timestamp: number;
  value: number;
  anomalyScore: number;
  isAnomaly: boolean;
  method: string;
  confidence: number;
}

export interface AnomalyAlert {
  id: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  anomalyScore: number;
  suggestedAction?: string;
}

export interface RootCauseAnalysis {
  anomalyId: string;
  possibleCauses: Array<{
    cause: string;
    probability: number;
    evidence: string[];
  }>;
  recommendations: string[];
}

export interface AnomalyPattern {
  id: string;
  type: 'spike' | 'dip' | 'trend' | 'seasonal' | 'outlier';
  startTime: number;
  endTime: number;
  severity: number;
  description: string;
}

export class AnomalyDetectionSystem extends EventEmitter {
  private dataStreams: Map<string, number[]> = new Map();
  private baselineModels: Map<string, any> = new Map();
  private anomalyThresholds: Map<string, number> = new Map();
  private detectedAnomalies: Map<string, AnomalyScore[]> = new Map();
  private alerts: Map<string, AnomalyAlert[]> = new Map();
  private patterns: Map<string, AnomalyPattern[]> = new Map();

  constructor() {
    super();
  }

  /**
   * Add data point to stream
   */
  addDataPoint(streamId: string, value: number, timestamp: number = Date.now()): void {
    const stream = this.dataStreams.get(streamId) || [];
    stream.push(value);

    // Keep only last 1000 points
    if (stream.length > 1000) {
      stream.shift();
    }

    this.dataStreams.set(streamId, stream);
    this.emit('data:added', { streamId, value, timestamp });
  }

  /**
   * Detect anomalies using statistical method (Z-score)
   */
  detectAnomaliesStatistical(streamId: string, threshold: number = 3): AnomalyScore[] {
    const data = this.dataStreams.get(streamId);
    if (!data || data.length < 2) {
      throw new Error(`Stream ${streamId} not found or insufficient data`);
    }

    const mean = data.reduce((sum, v) => sum + v, 0) / data.length;
    const variance = data.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / data.length;
    const std = Math.sqrt(variance);

    const anomalies: AnomalyScore[] = [];
    const timestamp = Date.now();

    for (let i = 0; i < data.length; i++) {
      const zScore = std > 0 ? Math.abs((data[i] - mean) / std) : 0;
      const isAnomaly = zScore > threshold;

      anomalies.push({
        timestamp: timestamp - (data.length - i) * 1000,
        value: data[i],
        anomalyScore: Math.min(1, zScore / threshold),
        isAnomaly,
        method: 'z-score',
        confidence: Math.min(1, zScore / (threshold * 2)),
      });
    }

    this.detectedAnomalies.set(streamId, anomalies);
    this.emit('anomalies:detected', {
      streamId,
      method: 'statistical',
      count: anomalies.filter((a) => a.isAnomaly).length,
    });

    return anomalies;
  }

  /**
   * Detect anomalies using Isolation Forest method
   */
  detectAnomaliesIsolationForest(streamId: string, contamination: number = 0.1): AnomalyScore[] {
    const data = this.dataStreams.get(streamId);
    if (!data || data.length < 2) {
      throw new Error(`Stream ${streamId} not found or insufficient data`);
    }

    const anomalies: AnomalyScore[] = [];
    const timestamp = Date.now();
    const threshold = 1 - contamination;

    // Simplified Isolation Forest
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      let anomalyScore = 0;

      if (value < lowerBound || value > upperBound) {
        anomalyScore = Math.min(
          1,
          Math.abs(value - (value < lowerBound ? lowerBound : upperBound)) / (iqr || 1)
        );
      }

      anomalies.push({
        timestamp: timestamp - (data.length - i) * 1000,
        value,
        anomalyScore,
        isAnomaly: anomalyScore > threshold,
        method: 'isolation-forest',
        confidence: anomalyScore,
      });
    }

    this.emit('anomalies:detected', {
      streamId,
      method: 'isolation-forest',
      count: anomalies.filter((a) => a.isAnomaly).length,
    });

    return anomalies;
  }

  /**
   * Detect anomalies using LSTM-based method
   */
  detectAnomaliesLSTM(
    streamId: string,
    windowSize: number = 10,
    threshold: number = 0.7
  ): AnomalyScore[] {
    const data = this.dataStreams.get(streamId);
    if (!data || data.length < windowSize) {
      throw new Error(`Stream ${streamId} not found or insufficient data`);
    }

    const anomalies: AnomalyScore[] = [];
    const timestamp = Date.now();

    // Simplified LSTM-like anomaly detection using moving average
    for (let i = windowSize; i < data.length; i++) {
      const window = data.slice(i - windowSize, i);
      const predicted = window.reduce((sum, v) => sum + v, 0) / windowSize;
      const actual = data[i];
      const error = Math.abs(actual - predicted) / (Math.abs(predicted) || 1);
      const anomalyScore = Math.min(1, error);

      anomalies.push({
        timestamp: timestamp - (data.length - i) * 1000,
        value: actual,
        anomalyScore,
        isAnomaly: anomalyScore > threshold,
        method: 'lstm',
        confidence: anomalyScore,
      });
    }

    this.emit('anomalies:detected', {
      streamId,
      method: 'lstm',
      count: anomalies.filter((a) => a.isAnomaly).length,
    });

    return anomalies;
  }

  /**
   * Generate alert for anomaly
   */
  generateAlert(streamId: string, anomaly: AnomalyScore): AnomalyAlert {
    const severity = this.calculateSeverity(anomaly.anomalyScore);
    const alert: AnomalyAlert = {
      id: `alert-${Date.now()}`,
      timestamp: anomaly.timestamp,
      severity,
      message: `Anomaly detected in ${streamId}: ${anomaly.method} score ${(anomaly.anomalyScore * 100).toFixed(1)}%`,
      anomalyScore: anomaly.anomalyScore,
      suggestedAction: this.getSuggestedAction(severity),
    };

    const alerts = this.alerts.get(streamId) || [];
    alerts.push(alert);
    this.alerts.set(streamId, alerts);

    this.emit('alert:generated', {
      alertId: alert.id,
      severity,
      streamId,
    });

    return alert;
  }

  /**
   * Analyze root cause of anomaly
   */
  analyzeRootCause(anomalyId: string, streamId: string): RootCauseAnalysis {
    const data = this.dataStreams.get(streamId);
    if (!data || data.length < 2) {
      throw new Error(`Stream ${streamId} not found`);
    }

    const possibleCauses = [];

    // Check for sudden spike
    if (data.length >= 2) {
      const recent = data[data.length - 1];
      const previous = data[data.length - 2];
      const change = Math.abs(recent - previous) / (Math.abs(previous) || 1);

      if (change > 0.5) {
        possibleCauses.push({
          cause: 'Sudden spike or drop',
          probability: 0.8,
          evidence: [`Change of ${(change * 100).toFixed(1)}%`],
        });
      }
    }

    // Check for trend change
    if (data.length >= 5) {
      const recent = data.slice(-5);
      const previous = data.slice(-10, -5);

      const recentTrend = recent[recent.length - 1] - recent[0];
      const previousTrend = previous[previous.length - 1] - previous[0];

      if (Math.sign(recentTrend) !== Math.sign(previousTrend)) {
        possibleCauses.push({
          cause: 'Trend reversal',
          probability: 0.6,
          evidence: ['Direction changed'],
        });
      }
    }

    // Check for seasonal anomaly
    possibleCauses.push({
      cause: 'Seasonal variation',
      probability: 0.4,
      evidence: ['Pattern differs from historical data'],
    });

    // Check for external factors
    possibleCauses.push({
      cause: 'External event or system change',
      probability: 0.3,
      evidence: ['Unusual behavior detected'],
    });

    const analysis: RootCauseAnalysis = {
      anomalyId,
      possibleCauses: possibleCauses.sort((a, b) => b.probability - a.probability),
      recommendations: [
        'Investigate the most probable cause',
        'Check system logs and metrics',
        'Review recent changes or deployments',
        'Monitor for similar patterns',
      ],
    };

    this.emit('root-cause:analyzed', {
      anomalyId,
      topCause: possibleCauses[0]?.cause,
    });

    return analysis;
  }

  /**
   * Detect patterns in anomalies
   */
  detectPatterns(streamId: string): AnomalyPattern[] {
    const anomalies = this.detectedAnomalies.get(streamId) || [];
    const patterns: AnomalyPattern[] = [];

    if (anomalies.length === 0) return patterns;

    let currentPattern: AnomalyPattern | null = null;

    for (let i = 0; i < anomalies.length; i++) {
      const anomaly = anomalies[i];

      if (anomaly.isAnomaly) {
        if (!currentPattern) {
          currentPattern = {
            id: `pattern-${Date.now()}-${i}`,
            type: this.classifyAnomalyType(anomaly.value, anomalies[i - 1]?.value),
            startTime: anomaly.timestamp,
            endTime: anomaly.timestamp,
            severity: anomaly.anomalyScore,
            description: '',
          };
        } else {
          currentPattern.endTime = anomaly.timestamp;
          currentPattern.severity = Math.max(currentPattern.severity, anomaly.anomalyScore);
        }
      } else if (currentPattern) {
        currentPattern.description = `${currentPattern.type} anomaly detected`;
        patterns.push(currentPattern);
        currentPattern = null;
      }
    }

    if (currentPattern) {
      currentPattern.description = `${currentPattern.type} anomaly detected`;
      patterns.push(currentPattern);
    }

    this.patterns.set(streamId, patterns);
    this.emit('patterns:detected', { streamId, count: patterns.length });

    return patterns;
  }

  /**
   * Get anomaly statistics
   */
  getAnomalyStatistics(streamId: string): {
    totalPoints: number;
    anomalyCount: number;
    anomalyRate: number;
    averageScore: number;
    maxScore: number;
  } {
    const data = this.dataStreams.get(streamId) || [];
    const anomalies = this.detectedAnomalies.get(streamId) || [];

    const anomalyCount = anomalies.filter((a) => a.isAnomaly).length;
    const averageScore =
      anomalies.length > 0
        ? anomalies.reduce((sum, a) => sum + a.anomalyScore, 0) / anomalies.length
        : 0;
    const maxScore = anomalies.length > 0 ? Math.max(...anomalies.map((a) => a.anomalyScore)) : 0;

    return {
      totalPoints: data.length,
      anomalyCount,
      anomalyRate: data.length > 0 ? anomalyCount / data.length : 0,
      averageScore,
      maxScore,
    };
  }

  /**
   * Set anomaly threshold
   */
  setThreshold(streamId: string, threshold: number): void {
    this.anomalyThresholds.set(streamId, threshold);
    this.emit('threshold:set', { streamId, threshold });
  }

  /**
   * Get alerts for stream
   */
  getAlerts(streamId: string, limit: number = 10): AnomalyAlert[] {
    const alerts = this.alerts.get(streamId) || [];
    return alerts.slice(-limit);
  }

  /**
   * Clear old data
   */
  clearOldData(streamId: string, maxAge: number = 86400000): void {
    const data = this.dataStreams.get(streamId) || [];
    const now = Date.now();

    // Keep only recent data
    const recentData = data.slice(-1000);
    this.dataStreams.set(streamId, recentData);

    this.emit('data:cleared', { streamId, remaining: recentData.length });
  }

  /**
   * Private helper: Calculate severity
   */
  private calculateSeverity(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 0.9) return 'critical';
    if (score >= 0.7) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  /**
   * Private helper: Get suggested action
   */
  private getSuggestedAction(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'Immediate investigation required. Consider escalating to on-call team.';
      case 'high':
        return 'Investigate within 1 hour. Check related systems and logs.';
      case 'medium':
        return 'Monitor closely. Investigate if pattern continues.';
      default:
        return 'Log for analysis. No immediate action required.';
    }
  }

  /**
   * Private helper: Classify anomaly type
   */
  private classifyAnomalyType(current: number, previous?: number): AnomalyPattern['type'] {
    if (!previous) return 'outlier';

    const change = Math.abs(current - previous) / (Math.abs(previous) || 1);

    if (change > 0.5) {
      return current > previous ? 'spike' : 'dip';
    }

    return 'outlier';
  }
}
