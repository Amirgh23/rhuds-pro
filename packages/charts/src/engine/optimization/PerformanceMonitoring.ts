/**
 * Performance Monitoring
 * Monitors and tracks system performance metrics
 */

/**
 * Performance metric
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  threshold?: number;
}

/**
 * Performance alert
 */
export interface PerformanceAlert {
  id: string;
  metric: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
}

/**
 * Performance report
 */
export interface PerformanceReport {
  id: string;
  timestamp: number;
  metrics: PerformanceMetric[];
  alerts: PerformanceAlert[];
  summary: Record<string, number>;
}

/**
 * Performance Monitoring
 * Tracks and monitors system performance
 */
export class PerformanceMonitoring {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private alerts: Map<string, PerformanceAlert> = new Map();
  private reports: Map<string, PerformanceReport> = new Map();
  private thresholds: Map<string, number> = new Map();

  /**
   * Record metric
   */
  recordMetric(name: string, value: number, unit: string = 'ms'): PerformanceMetric {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      threshold: this.thresholds.get(name),
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(metric);

    // Check threshold
    if (metric.threshold && value > metric.threshold) {
      this.createAlert(
        name,
        'high',
        `Metric ${name} exceeded threshold: ${value} > ${metric.threshold}`
      );
    }

    return metric;
  }

  /**
   * Create alert
   */
  createAlert(
    metric: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    message: string
  ): PerformanceAlert {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const alert: PerformanceAlert = {
      id: alertId,
      metric,
      severity,
      message,
      timestamp: Date.now(),
      resolved: false,
    };

    this.alerts.set(alertId, alert);
    return alert;
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  /**
   * Set threshold
   */
  setThreshold(metric: string, threshold: number): void {
    this.thresholds.set(metric, threshold);
  }

  /**
   * Get metric history
   */
  getMetricHistory(name: string, limit?: number): PerformanceMetric[] {
    const history = this.metrics.get(name) || [];
    if (limit) {
      return history.slice(-limit);
    }
    return history;
  }

  /**
   * Get metric statistics
   */
  getMetricStats(name: string): Record<string, number> {
    const history = this.metrics.get(name) || [];
    if (history.length === 0) {
      return { count: 0, average: 0, min: 0, max: 0, stdDev: 0 };
    }

    const values = history.map((m) => m.value);
    const count = values.length;
    const average = values.reduce((a, b) => a + b, 0) / count;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const variance = values.reduce((sum, v) => sum + (v - average) ** 2, 0) / count;
    const stdDev = Math.sqrt(variance);

    return { count, average, min, max, stdDev };
  }

  /**
   * Generate report
   */
  generateReport(): PerformanceReport {
    const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const allMetrics: PerformanceMetric[] = [];
    const summary: Record<string, number> = {};

    for (const [name, metrics] of this.metrics) {
      allMetrics.push(...metrics);
      const stats = this.getMetricStats(name);
      summary[`${name}_avg`] = stats.average;
      summary[`${name}_max`] = stats.max;
      summary[`${name}_min`] = stats.min;
    }

    const activeAlerts = Array.from(this.alerts.values()).filter((a) => !a.resolved);

    const report: PerformanceReport = {
      id: reportId,
      timestamp: Date.now(),
      metrics: allMetrics,
      alerts: activeAlerts,
      summary,
    };

    this.reports.set(reportId, report);
    return report;
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): PerformanceAlert[] {
    return Array.from(this.alerts.values()).filter((a) => !a.resolved);
  }

  /**
   * Get alert by severity
   */
  getAlertsBySeverity(severity: 'low' | 'medium' | 'high' | 'critical'): PerformanceAlert[] {
    return Array.from(this.alerts.values()).filter((a) => a.severity === severity && !a.resolved);
  }

  /**
   * Get report
   */
  getReport(reportId: string): PerformanceReport | undefined {
    return this.reports.get(reportId);
  }

  /**
   * List all reports
   */
  listReports(): PerformanceReport[] {
    return Array.from(this.reports.values());
  }

  /**
   * Clear old metrics
   */
  clearOldMetrics(olderThanMs: number): number {
    const cutoff = Date.now() - olderThanMs;
    let count = 0;

    for (const [name, metrics] of this.metrics) {
      const filtered = metrics.filter((m) => m.timestamp > cutoff);
      if (filtered.length < metrics.length) {
        count += metrics.length - filtered.length;
        this.metrics.set(name, filtered);
      }
    }

    return count;
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, PerformanceMetric[]> {
    const result: Record<string, PerformanceMetric[]> = {};
    for (const [name, metrics] of this.metrics) {
      result[name] = metrics;
    }
    return result;
  }
}
