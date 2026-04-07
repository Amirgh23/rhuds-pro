/**
 * Performance Monitoring System
 * Metric tracking, performance alerts, and dashboard
 */

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface PerformanceAlert {
  id: string;
  metric: string;
  threshold: number;
  operator: '>' | '<' | '==' | '!=' | '>=' | '<=';
  isActive: boolean;
  createdAt: Date;
}

export interface PerformanceSnapshot {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  requestsPerSecond: number;
  errorRate: number;
}

/**
 * Performance Monitor
 */
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private alerts: Map<string, PerformanceAlert> = new Map();
  private snapshots: PerformanceSnapshot[] = [];
  private listeners: Map<string, Function[]> = new Map();
  private maxMetricsPerName: number = 10000;

  /**
   * Record metric
   */
  public recordMetric(
    name: string,
    value: number,
    unit: string = '',
    tags?: Record<string, string>
  ): void {
    const metric: PerformanceMetric = {
      id: this.generateId(),
      name,
      value,
      unit,
      timestamp: new Date(),
      tags,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricsList = this.metrics.get(name)!;
    metricsList.push(metric);

    // Keep only recent metrics
    if (metricsList.length > this.maxMetricsPerName) {
      metricsList.shift();
    }

    this.checkAlerts(name, value);
    this.emit('metric:recorded', { name, value });
  }

  /**
   * Get metrics
   */
  public getMetrics(name: string, limit: number = 100): PerformanceMetric[] {
    const metrics = this.metrics.get(name) || [];
    return metrics.slice(-limit);
  }

  /**
   * Get metric statistics
   */
  public getMetricStats(name: string): {
    count: number;
    min: number;
    max: number;
    average: number;
    latest: number;
  } | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const values = metrics.map((m) => m.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const latest = values[values.length - 1];

    return { count: values.length, min, max, average, latest };
  }

  /**
   * Create alert
   */
  public createAlert(
    metric: string,
    threshold: number,
    operator: '>' | '<' | '==' | '!=' | '>=' | '<='
  ): PerformanceAlert {
    const id = this.generateId();

    const alert: PerformanceAlert = {
      id,
      metric,
      threshold,
      operator,
      isActive: true,
      createdAt: new Date(),
    };

    this.alerts.set(id, alert);
    this.emit('alert:created', { alertId: id, metric });

    return alert;
  }

  /**
   * Get alert
   */
  public getAlert(alertId: string): PerformanceAlert | undefined {
    return this.alerts.get(alertId);
  }

  /**
   * List alerts
   */
  public listAlerts(metric?: string): PerformanceAlert[] {
    let alerts = Array.from(this.alerts.values());

    if (metric) {
      alerts = alerts.filter((a) => a.metric === metric);
    }

    return alerts;
  }

  /**
   * Delete alert
   */
  public deleteAlert(alertId: string): boolean {
    const deleted = this.alerts.delete(alertId);
    if (deleted) {
      this.emit('alert:deleted', { alertId });
    }
    return deleted;
  }

  /**
   * Check alerts
   */
  private checkAlerts(metricName: string, value: number): void {
    this.alerts.forEach((alert) => {
      if (alert.metric === metricName && alert.isActive) {
        const triggered = this.evaluateCondition(value, alert.threshold, alert.operator);

        if (triggered) {
          this.emit('alert:triggered', {
            alertId: alert.id,
            metric: metricName,
            value,
            threshold: alert.threshold,
          });
        }
      }
    });
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(value: number, threshold: number, operator: string): boolean {
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
   * Record snapshot
   */
  public recordSnapshot(snapshot: Omit<PerformanceSnapshot, 'timestamp'>): void {
    const fullSnapshot: PerformanceSnapshot = {
      ...snapshot,
      timestamp: new Date(),
    };

    this.snapshots.push(fullSnapshot);

    // Keep only recent snapshots (last 1000)
    if (this.snapshots.length > 1000) {
      this.snapshots.shift();
    }

    this.emit('snapshot:recorded', fullSnapshot);
  }

  /**
   * Get snapshots
   */
  public getSnapshots(limit: number = 100): PerformanceSnapshot[] {
    return this.snapshots.slice(-limit);
  }

  /**
   * Get current performance
   */
  public getCurrentPerformance(): PerformanceSnapshot | null {
    return this.snapshots.length > 0 ? this.snapshots[this.snapshots.length - 1] : null;
  }

  /**
   * Get performance trend
   */
  public getPerformanceTrend(minutes: number = 60): {
    cpuTrend: number[];
    memoryTrend: number[];
    responseTrend: number[];
  } {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    const recent = this.snapshots.filter((s) => s.timestamp > cutoff);

    return {
      cpuTrend: recent.map((s) => s.cpuUsage),
      memoryTrend: recent.map((s) => s.memoryUsage),
      responseTrend: recent.map((s) => s.responseTime),
    };
  }

  /**
   * Get dashboard data
   */
  public getDashboardData(): {
    current: PerformanceSnapshot | null;
    trend: any;
    alerts: PerformanceAlert[];
    metrics: Record<string, any>;
  } {
    return {
      current: this.getCurrentPerformance(),
      trend: this.getPerformanceTrend(),
      alerts: Array.from(this.alerts.values()).filter((a) => a.isActive),
      metrics: this.getMetricsOverview(),
    };
  }

  /**
   * Get metrics overview
   */
  private getMetricsOverview(): Record<string, any> {
    const overview: Record<string, any> = {};

    this.metrics.forEach((metrics, name) => {
      const stats = this.getMetricStats(name);
      if (stats) {
        overview[name] = stats;
      }
    });

    return overview;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Destroy manager
   */
  public destroy(): void {
    this.metrics.clear();
    this.alerts.clear();
    this.snapshots = [];
    this.listeners.clear();
  }
}

export default PerformanceMonitor;
