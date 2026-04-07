/**
 * Enterprise Monitoring
 * Advanced monitoring and alerting
 *
 * نظارت سازمانی
 * نظارت و هشدار پیشرفته
 */

import { EventEmitter } from 'events';

export interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'greater' | 'less' | 'equal';
  threshold: number;
  duration: number; // milliseconds
  enabled: boolean;
}

export interface Alert {
  id: string;
  ruleId: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
}

export interface Dashboard {
  id: string;
  name: string;
  metrics: string[];
  refreshInterval: number;
}

export interface MonitoringConfig {
  metricsRetention: number; // milliseconds
  alertCheckInterval: number;
  enablePredictiveAlerts: boolean;
  enableTrendAnalysis: boolean;
}

export class EnterpriseMonitoring extends EventEmitter {
  private metrics: Map<string, Metric[]> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private dashboards: Map<string, Dashboard> = new Map();
  private config: MonitoringConfig;
  private alertHistory: Alert[] = [];

  constructor(config?: Partial<MonitoringConfig>) {
    super();
    this.config = {
      metricsRetention: 24 * 60 * 60 * 1000, // 24 hours
      alertCheckInterval: 60000, // 1 minute
      enablePredictiveAlerts: true,
      enableTrendAnalysis: true,
      ...config,
    };

    this.startAlertChecking();
    this.startMetricsCleanup();
  }

  /**
   * Record metric
   */
  recordMetric(metric: Metric): void {
    if (!this.metrics.has(metric.name)) {
      this.metrics.set(metric.name, []);
    }

    this.metrics.get(metric.name)!.push(metric);
    this.emit('metric:recorded', { name: metric.name, value: metric.value });
  }

  /**
   * Create alert rule
   */
  createAlertRule(rule: Omit<AlertRule, 'enabled'>): void {
    const fullRule: AlertRule = {
      ...rule,
      enabled: true,
    };

    this.alertRules.set(rule.id, fullRule);
    this.emit('alert-rule:created', { id: rule.id, name: rule.name });
  }

  /**
   * Delete alert rule
   */
  deleteAlertRule(ruleId: string): void {
    this.alertRules.delete(ruleId);
    this.emit('alert-rule:deleted', { id: ruleId });
  }

  /**
   * Start alert checking
   */
  private startAlertChecking(): void {
    setInterval(() => {
      this.checkAlerts();
    }, this.config.alertCheckInterval);
  }

  /**
   * Check alerts
   */
  private checkAlerts(): void {
    for (const rule of this.alertRules.values()) {
      if (!rule.enabled) continue;

      const metricData = this.metrics.get(rule.metric);
      if (!metricData || metricData.length === 0) continue;

      const recentMetrics = metricData.filter((m) => Date.now() - m.timestamp < rule.duration);

      if (recentMetrics.length === 0) continue;

      const avgValue = recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;
      const triggered = this.evaluateCondition(avgValue, rule.condition, rule.threshold);

      if (triggered) {
        this.createAlert(rule, avgValue);
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
  private createAlert(rule: AlertRule, value: number): void {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const alert: Alert = {
      id: alertId,
      ruleId: rule.id,
      severity: value > rule.threshold * 1.5 ? 'critical' : 'warning',
      message: `${rule.name}: ${rule.metric} = ${value.toFixed(2)}`,
      timestamp: Date.now(),
      resolved: false,
    };

    this.alerts.set(alertId, alert);
    this.alertHistory.push(alert);

    this.emit('alert:triggered', alert);
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      this.emit('alert:resolved', { id: alertId });
    }
  }

  /**
   * Start metrics cleanup
   */
  private startMetricsCleanup(): void {
    setInterval(
      () => {
        this.cleanupOldMetrics();
      },
      60 * 60 * 1000
    ); // Every hour
  }

  /**
   * Cleanup old metrics
   */
  private cleanupOldMetrics(): void {
    const cutoffTime = Date.now() - this.config.metricsRetention;

    for (const [name, metricList] of this.metrics.entries()) {
      const filtered = metricList.filter((m) => m.timestamp > cutoffTime);
      if (filtered.length === 0) {
        this.metrics.delete(name);
      } else {
        this.metrics.set(name, filtered);
      }
    }

    this.emit('metrics:cleanup', {});
  }

  /**
   * Get metric data
   */
  getMetricData(name: string, duration?: number): Metric[] {
    const metrics = this.metrics.get(name) || [];

    if (!duration) {
      return metrics;
    }

    const cutoffTime = Date.now() - duration;
    return metrics.filter((m) => m.timestamp > cutoffTime);
  }

  /**
   * Get metric statistics
   */
  getMetricStats(
    name: string,
    duration?: number
  ): {
    min: number;
    max: number;
    avg: number;
    count: number;
  } {
    const metrics = this.getMetricData(name, duration);

    if (metrics.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0 };
    }

    const values = metrics.map((m) => m.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

    return { min, max, avg, count: metrics.length };
  }

  /**
   * Create dashboard
   */
  createDashboard(dashboard: Dashboard): void {
    this.dashboards.set(dashboard.id, dashboard);
    this.emit('dashboard:created', { id: dashboard.id, name: dashboard.name });
  }

  /**
   * Delete dashboard
   */
  deleteDashboard(dashboardId: string): void {
    this.dashboards.delete(dashboardId);
    this.emit('dashboard:deleted', { id: dashboardId });
  }

  /**
   * Get dashboard
   */
  getDashboard(dashboardId: string): Dashboard | null {
    return this.dashboards.get(dashboardId) || null;
  }

  /**
   * Get all dashboards
   */
  getAllDashboards(): Dashboard[] {
    return Array.from(this.dashboards.values());
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter((a) => !a.resolved);
  }

  /**
   * Get alert history
   */
  getAlertHistory(limit: number = 100): Alert[] {
    return this.alertHistory.slice(-limit);
  }

  /**
   * Get trend analysis
   */
  getTrendAnalysis(
    metricName: string,
    duration: number = 3600000
  ): {
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
  } {
    const metrics = this.getMetricData(metricName, duration);

    if (metrics.length < 2) {
      return { trend: 'stable', changePercent: 0 };
    }

    const firstValue = metrics[0].value;
    const lastValue = metrics[metrics.length - 1].value;
    const changePercent = ((lastValue - firstValue) / firstValue) * 100;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (changePercent > 5) {
      trend = 'up';
    } else if (changePercent < -5) {
      trend = 'down';
    }

    return { trend, changePercent };
  }

  /**
   * Get predictive alert
   */
  getPredictiveAlert(metricName: string): {
    predicted: boolean;
    predictedValue: number;
    confidence: number;
  } {
    const metrics = this.getMetricData(metricName, 3600000); // Last hour

    if (metrics.length < 10) {
      return { predicted: false, predictedValue: 0, confidence: 0 };
    }

    // Simple linear regression for prediction
    const values = metrics.map((m) => m.value);
    const n = values.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, i) => sum + (i + 1) * y, 0);
    const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const predictedValue = slope * (n + 1) + intercept;
    const confidence = Math.min(0.95, 0.5 + n / 100);

    return { predicted: true, predictedValue, confidence };
  }

  /**
   * Get monitoring summary
   */
  getMonitoringSummary(): {
    totalMetrics: number;
    activeAlerts: number;
    alertRules: number;
    dashboards: number;
  } {
    return {
      totalMetrics: this.metrics.size,
      activeAlerts: this.getActiveAlerts().length,
      alertRules: this.alertRules.size,
      dashboards: this.dashboards.size,
    };
  }
}
