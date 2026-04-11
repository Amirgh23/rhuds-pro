/**
 * Production Monitoring System
 * Monitors production environment health and performance
 */

/**
 * Health check result
 */
export interface HealthCheckResult {
  timestamp: number;
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean>;
  metrics: Record<string, number>;
  latency: number;
}

/**
 * Alert configuration
 */
export interface AlertConfig {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  operator: '>' | '<' | '==' | '!=' | '>=' | '<=';
  enabled: boolean;
  cooldown: number;
}

/**
 * Alert event
 */
export interface AlertEvent {
  id: string;
  configId: string;
  timestamp: number;
  value: number;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

/**
 * Production Monitoring System
 * Tracks health, performance, and alerts
 */
export class ProductionMonitoring {
  private healthChecks: Map<string, HealthCheckResult> = new Map();
  private alerts: Map<string, AlertConfig> = new Map();
  private alertHistory: AlertEvent[] = [];
  private lastAlertTime: Map<string, number> = new Map();
  private metrics: Map<string, number[]> = new Map();

  /**
   * Register health check
   */
  registerHealthCheck(name: string): string {
    const id = `health-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return id;
  }

  /**
   * Record health check result
   */
  recordHealthCheck(
    id: string,
    checks: Record<string, boolean>,
    metrics: Record<string, number>
  ): HealthCheckResult {
    const startTime = Date.now();
    const status = Object.values(checks).every((v) => v) ? 'healthy' : 'degraded';
    const latency = Date.now() - startTime;

    const result: HealthCheckResult = {
      timestamp: Date.now(),
      status,
      checks,
      metrics,
      latency,
    };

    this.healthChecks.set(id, result);
    return result;
  }

  /**
   * Create alert configuration
   */
  createAlert(config: Omit<AlertConfig, 'id'>): AlertConfig {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const alert: AlertConfig = { ...config, id };
    this.alerts.set(id, alert);
    return alert;
  }

  /**
   * Check metric against alert thresholds
   */
  checkMetric(metric: string, value: number): AlertEvent[] {
    const triggeredAlerts: AlertEvent[] = [];

    for (const [alertId, alert] of this.alerts) {
      if (!alert.enabled || alert.metric !== metric) continue;

      const shouldTrigger = this.evaluateThreshold(value, alert.threshold, alert.operator);

      if (shouldTrigger) {
        const lastAlert = this.lastAlertTime.get(alertId) || 0;
        const now = Date.now();

        if (now - lastAlert >= alert.cooldown) {
          const alertEvent: AlertEvent = {
            id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            configId: alertId,
            timestamp: now,
            value,
            message: `${alert.name}: ${metric}=${value} (threshold: ${alert.threshold})`,
            severity: value > alert.threshold * 1.5 ? 'critical' : 'warning',
          };

          triggeredAlerts.push(alertEvent);
          this.alertHistory.push(alertEvent);
          this.lastAlertTime.set(alertId, now);
        }
      }
    }

    return triggeredAlerts;
  }

  /**
   * Evaluate threshold condition
   */
  private evaluateThreshold(value: number, threshold: number, operator: string): boolean {
    switch (operator) {
      case '>':
        return value > threshold;
      case '<':
        return value < threshold;
      case '==':
        return value === threshold;
      case '!=':
        return value !== threshold;
      case '>=':
        return value >= threshold;
      case '<=':
        return value <= threshold;
      default:
        return false;
    }
  }

  /**
   * Record metric value
   */
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);

    // Keep only last 1000 values
    const values = this.metrics.get(name)!;
    if (values.length > 1000) {
      values.shift();
    }
  }

  /**
   * Get metric statistics
   */
  getMetricStats(name: string): Record<string, number> | undefined {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return undefined;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      count: values.length,
    };
  }

  /**
   * Get latest health check
   */
  getLatestHealthCheck(id: string): HealthCheckResult | undefined {
    return this.healthChecks.get(id);
  }

  /**
   * Get alert history
   */
  getAlertHistory(limit?: number): AlertEvent[] {
    if (limit) {
      return this.alertHistory.slice(-limit);
    }
    return [...this.alertHistory];
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): AlertConfig[] {
    return Array.from(this.alerts.values()).filter((a) => a.enabled);
  }

  /**
   * Update alert configuration
   */
  updateAlert(id: string, updates: Partial<AlertConfig>): boolean {
    const alert = this.alerts.get(id);
    if (!alert) return false;

    Object.assign(alert, updates);
    return true;
  }

  /**
   * Disable alert
   */
  disableAlert(id: string): boolean {
    const alert = this.alerts.get(id);
    if (!alert) return false;

    alert.enabled = false;
    return true;
  }

  /**
   * Get system health summary
   */
  getHealthSummary(): Record<string, unknown> {
    const allChecks = Array.from(this.healthChecks.values());
    const healthyCount = allChecks.filter((c) => c.status === 'healthy').length;
    const degradedCount = allChecks.filter((c) => c.status === 'degraded').length;
    const unhealthyCount = allChecks.filter((c) => c.status === 'unhealthy').length;

    const avgLatency =
      allChecks.length > 0
        ? allChecks.reduce((sum, c) => sum + c.latency, 0) / allChecks.length
        : 0;

    return {
      totalChecks: allChecks.length,
      healthy: healthyCount,
      degraded: degradedCount,
      unhealthy: unhealthyCount,
      avgLatency,
      recentAlerts: this.alertHistory.slice(-10),
    };
  }

  /**
   * Clear old data
   */
  clearOldData(olderThanMs: number): void {
    const cutoffTime = Date.now() - olderThanMs;

    // Clear old health checks
    for (const [id, check] of this.healthChecks) {
      if (check.timestamp < cutoffTime) {
        this.healthChecks.delete(id);
      }
    }

    // Clear old alerts
    this.alertHistory = this.alertHistory.filter((a) => a.timestamp >= cutoffTime);
  }
}
