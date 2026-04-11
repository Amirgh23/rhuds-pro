/**
 * Enterprise Monitoring
 * Advanced monitoring, alerting, and trend analysis
 */

export interface MetricConfig {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  unit?: string;
  threshold?: number;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'greater' | 'less' | 'equal';
  threshold: number;
  duration: number;
  enabled: boolean;
}

export interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface Alert {
  id: string;
  ruleId: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
  resolved: boolean;
}

export interface TrendAnalysis {
  metric: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercent: number;
  prediction: number;
}

/**
 * EnterpriseMonitoring - Advanced monitoring and alerting
 */
export class EnterpriseMonitoring {
  private metrics: Map<string, MetricData[]> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private metricConfigs: Map<string, MetricConfig> = new Map();
  private alertHistory: Alert[] = [];

  /**
   * Register metric
   */
  registerMetric(config: MetricConfig): void {
    this.metricConfigs.set(config.name, config);
    this.metrics.set(config.name, []);
  }

  /**
   * Record metric
   */
  recordMetric(data: MetricData): void {
    if (!this.metrics.has(data.name)) {
      this.metrics.set(data.name, []);
    }

    const metricData = this.metrics.get(data.name)!;
    metricData.push(data);

    // Keep only last 1000 data points
    if (metricData.length > 1000) {
      metricData.shift();
    }

    // Check alert rules
    this.checkAlertRules(data);
  }

  /**
   * Create alert rule
   */
  createAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule);
  }

  /**
   * Check alert rules
   */
  private checkAlertRules(data: MetricData): void {
    for (const rule of this.alertRules.values()) {
      if (!rule.enabled || rule.metric !== data.name) {
        continue;
      }

      const shouldAlert = this.evaluateCondition(data.value, rule.condition, rule.threshold);

      if (shouldAlert) {
        this.createAlert(rule, data);
      }
    }
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case 'greater':
        return value > threshold;
      case 'less':
        return value < threshold;
      case 'equal':
        return value === threshold;
      default:
        return false;
    }
  }

  /**
   * Create alert
   */
  private createAlert(rule: AlertRule, data: MetricData): void {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random()}`,
      ruleId: rule.id,
      metric: data.name,
      value: data.value,
      threshold: rule.threshold,
      timestamp: data.timestamp,
      resolved: false,
    };

    this.alerts.set(alert.id, alert);
    this.alertHistory.push(alert);

    // Keep only last 1000 alerts
    if (this.alertHistory.length > 1000) {
      this.alertHistory.shift();
    }
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter((a) => !a.resolved);
  }

  /**
   * Get metric data
   */
  getMetricData(name: string, limit?: number): MetricData[] {
    const data = this.metrics.get(name) || [];
    if (limit) {
      return data.slice(-limit);
    }
    return data;
  }

  /**
   * Analyze trend
   */
  analyzeTrend(metricName: string): TrendAnalysis | null {
    const data = this.metrics.get(metricName);
    if (!data || data.length < 2) {
      return null;
    }

    const recent = data.slice(-10);
    const older = data.slice(-20, -10);

    const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d.value, 0) / older.length;

    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
    let trend: 'increasing' | 'decreasing' | 'stable';

    if (changePercent > 5) {
      trend = 'increasing';
    } else if (changePercent < -5) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }

    // Simple linear prediction
    const slope = (recentAvg - olderAvg) / 10;
    const prediction = recentAvg + slope * 5;

    return {
      metric: metricName,
      trend,
      changePercent,
      prediction,
    };
  }

  /**
   * Get statistics
   */
  getStatistics(): Record<string, unknown> {
    const activeAlerts = this.getActiveAlerts();
    const totalMetrics = this.metrics.size;
    const totalAlerts = this.alertHistory.length;

    return {
      totalMetrics,
      totalAlerts,
      activeAlerts: activeAlerts.length,
      resolvedAlerts: totalAlerts - activeAlerts.length,
      alertRules: this.alertRules.size,
    };
  }

  /**
   * Get alert history
   */
  getAlertHistory(limit?: number): Alert[] {
    if (limit) {
      return this.alertHistory.slice(-limit);
    }
    return this.alertHistory;
  }

  /**
   * Get metric summary
   */
  getMetricSummary(metricName: string): Record<string, number> {
    const data = this.metrics.get(metricName) || [];
    if (data.length === 0) {
      return { count: 0, min: 0, max: 0, avg: 0 };
    }

    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    return {
      count: data.length,
      min,
      max,
      avg,
    };
  }

  /**
   * Clear old data
   */
  clearOldData(olderThanMs: number): number {
    const cutoffTime = Date.now() - olderThanMs;
    let removed = 0;

    for (const [name, data] of this.metrics.entries()) {
      const filtered = data.filter((d) => d.timestamp > cutoffTime);
      removed += data.length - filtered.length;
      this.metrics.set(name, filtered);
    }

    return removed;
  }
}
