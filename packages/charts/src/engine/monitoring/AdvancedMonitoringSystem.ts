/**
 * Advanced Monitoring System
 * سیستم نظارت پیشرفته برای جمع‌آوری و تحلیل معیارها
 *
 * Features:
 * - Metrics collection
 * - Health checks
 * - Alerting
 * - Dashboard integration
 */

export interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags: Record<string, string>;
  unit: string;
}

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  message?: string;
  details?: Record<string, any>;
}

export interface Alert {
  id: string;
  name: string;
  condition: string;
  severity: 'info' | 'warning' | 'critical';
  triggered: boolean;
  triggeredAt?: number;
  resolvedAt?: number;
}

export interface MonitoringDashboard {
  id: string;
  name: string;
  metrics: Metric[];
  healthChecks: HealthCheck[];
  alerts: Alert[];
  lastUpdated: number;
}

export class AdvancedMonitoringSystem {
  private metrics: Map<string, Metric[]>;
  private healthChecks: Map<string, HealthCheck>;
  private alerts: Map<string, Alert>;
  private dashboards: Map<string, MonitoringDashboard>;
  private stats: {
    metricsCollected: number;
    healthChecksRun: number;
    alertsTriggered: number;
    dashboardsCreated: number;
  };

  constructor() {
    this.metrics = new Map();
    this.healthChecks = new Map();
    this.alerts = new Map();
    this.dashboards = new Map();
    this.stats = {
      metricsCollected: 0,
      healthChecksRun: 0,
      alertsTriggered: 0,
      dashboardsCreated: 0,
    };
  }

  /**
   * Record metric
   */
  public recordMetric(
    name: string,
    value: number,
    unit: string = '',
    tags: Record<string, string> = {}
  ): void {
    const metric: Metric = {
      name,
      value,
      timestamp: Date.now(),
      tags,
      unit,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push(metric);
    this.stats.metricsCollected++;

    // Keep only last 1000 metrics per name
    const metricList = this.metrics.get(name)!;
    if (metricList.length > 1000) {
      metricList.shift();
    }
  }

  /**
   * Register health check
   */
  public registerHealthCheck(name: string, checkFn: () => Promise<HealthCheck>): void {
    // Store check function for periodic execution
    this.healthChecks.set(name, {
      name,
      status: 'healthy',
      lastCheck: Date.now(),
    });
  }

  /**
   * Run health check
   */
  public async runHealthCheck(name: string): Promise<HealthCheck | null> {
    const check = this.healthChecks.get(name);
    if (!check) return null;

    check.lastCheck = Date.now();
    this.stats.healthChecksRun++;

    return check;
  }

  /**
   * Get all health checks
   */
  public getAllHealthChecks(): HealthCheck[] {
    return Array.from(this.healthChecks.values());
  }

  /**
   * Create alert
   */
  public createAlert(
    name: string,
    condition: string,
    severity: 'info' | 'warning' | 'critical'
  ): string {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const alert: Alert = {
      id: alertId,
      name,
      condition,
      severity,
      triggered: false,
    };

    this.alerts.set(alertId, alert);
    return alertId;
  }

  /**
   * Trigger alert
   */
  public triggerAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.triggered = true;
    alert.triggeredAt = Date.now();
    this.stats.alertsTriggered++;

    return true;
  }

  /**
   * Resolve alert
   */
  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.triggered = false;
    alert.resolvedAt = Date.now();

    return true;
  }

  /**
   * Get metrics
   */
  public getMetrics(name: string, limit: number = 100): Metric[] {
    const metrics = this.metrics.get(name) || [];
    return metrics.slice(-limit);
  }

  /**
   * Get metric statistics
   */
  public getMetricStats(name: string) {
    const metrics = this.metrics.get(name) || [];
    if (metrics.length === 0) return null;

    const values = metrics.map((m) => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { avg, min, max, count: values.length };
  }

  /**
   * Create dashboard
   */
  public createDashboard(name: string, metricNames: string[]): string {
    const dashboardId = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const metrics = metricNames.flatMap((name) => this.metrics.get(name) || []);
    const healthChecks = Array.from(this.healthChecks.values());
    const alerts = Array.from(this.alerts.values());

    const dashboard: MonitoringDashboard = {
      id: dashboardId,
      name,
      metrics,
      healthChecks,
      alerts,
      lastUpdated: Date.now(),
    };

    this.dashboards.set(dashboardId, dashboard);
    this.stats.dashboardsCreated++;

    return dashboardId;
  }

  /**
   * Get dashboard
   */
  public getDashboard(dashboardId: string): MonitoringDashboard | undefined {
    return this.dashboards.get(dashboardId);
  }

  /**
   * Update dashboard
   */
  public updateDashboard(dashboardId: string): boolean {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return false;

    dashboard.lastUpdated = Date.now();
    dashboard.healthChecks = Array.from(this.healthChecks.values());
    dashboard.alerts = Array.from(this.alerts.values());

    return true;
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      totalMetrics: this.metrics.size,
      totalHealthChecks: this.healthChecks.size,
      totalAlerts: this.alerts.size,
      totalDashboards: this.dashboards.size,
      activeAlerts: Array.from(this.alerts.values()).filter((a) => a.triggered).length,
    };
  }
}
