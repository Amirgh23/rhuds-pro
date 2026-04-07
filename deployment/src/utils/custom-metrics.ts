/**
 * Custom Metrics Tracking System
 * Tracks application-specific performance metrics
 */

export interface CustomMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface MetricsSnapshot {
  timestamp: number;
  metrics: Record<string, number>;
}

class CustomMetricsTracker {
  private metrics: Map<string, CustomMetric[]> = new Map();
  private snapshots: MetricsSnapshot[] = [];
  private listeners: Set<(metric: CustomMetric) => void> = new Set();
  private maxHistorySize = 1000;

  /**
   * Record a custom metric
   */
  recordMetric(name: string, value: number, unit = '', tags?: Record<string, string>): void {
    const metric: CustomMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags,
    };

    // Store metric
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricHistory = this.metrics.get(name)!;
    metricHistory.push(metric);

    // Limit history size
    if (metricHistory.length > this.maxHistorySize) {
      metricHistory.shift();
    }

    // Notify listeners
    this.listeners.forEach((listener) => listener(metric));
  }

  /**
   * Record component render time
   */
  recordComponentRender(componentName: string, renderTime: number): void {
    this.recordMetric(`component.render.${componentName}`, renderTime, 'ms', {
      type: 'component_render',
    });
  }

  /**
   * Record API call duration
   */
  recordApiCall(endpoint: string, duration: number, status: number): void {
    this.recordMetric(`api.${endpoint}`, duration, 'ms', {
      type: 'api_call',
      status: status.toString(),
    });
  }

  /**
   * Record user interaction
   */
  recordUserInteraction(action: string, duration: number): void {
    this.recordMetric(`interaction.${action}`, duration, 'ms', {
      type: 'user_interaction',
    });
  }

  /**
   * Record memory usage
   */
  recordMemoryUsage(): void {
    const memory = (performance as any).memory;
    if (memory) {
      const usedMemory = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      this.recordMetric('memory.used', usedMemory, 'MB', {
        type: 'memory',
      });
    }
  }

  /**
   * Record animation frame time
   */
  recordAnimationFrame(duration: number): void {
    this.recordMetric('animation.frame', duration, 'ms', {
      type: 'animation',
    });
  }

  /**
   * Get metrics for a specific name
   */
  getMetrics(name: string): CustomMetric[] {
    return this.metrics.get(name) || [];
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, CustomMetric[]> {
    const result: Record<string, CustomMetric[]> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Get metrics statistics
   */
  getMetricsStats(name: string) {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) {
      return null;
    }

    const values = metrics.map((m) => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)];

    return {
      count: values.length,
      sum,
      avg: Math.round(avg * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      median: Math.round(median * 100) / 100,
      unit: metrics[0].unit,
    };
  }

  /**
   * Get metrics for a time range
   */
  getMetricsInRange(name: string, startTime: number, endTime: number): CustomMetric[] {
    const metrics = this.getMetrics(name);
    return metrics.filter((m) => m.timestamp >= startTime && m.timestamp <= endTime);
  }

  /**
   * Create a snapshot of current metrics
   */
  createSnapshot(): MetricsSnapshot {
    const snapshot: MetricsSnapshot = {
      timestamp: Date.now(),
      metrics: {},
    };

    this.metrics.forEach((metricList, name) => {
      if (metricList.length > 0) {
        const lastMetric = metricList[metricList.length - 1];
        snapshot.metrics[name] = lastMetric.value;
      }
    });

    this.snapshots.push(snapshot);

    // Limit snapshots
    if (this.snapshots.length > 100) {
      this.snapshots.shift();
    }

    return snapshot;
  }

  /**
   * Get snapshots
   */
  getSnapshots(): MetricsSnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Subscribe to metric updates
   */
  subscribe(listener: (metric: CustomMetric) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.snapshots = [];
  }

  /**
   * Clear metrics for a specific name
   */
  clearMetrics(name: string): void {
    this.metrics.delete(name);
  }

  /**
   * Export metrics as JSON
   */
  export(): Record<string, any> {
    const data: Record<string, any> = {};

    this.metrics.forEach((metricList, name) => {
      data[name] = metricList.map((m) => ({
        value: m.value,
        unit: m.unit,
        timestamp: m.timestamp,
        tags: m.tags,
      }));
    });

    return {
      metrics: data,
      snapshots: this.snapshots,
      exportedAt: new Date().toISOString(),
    };
  }

  /**
   * Get metrics summary
   */
  getSummary(): Record<string, any> {
    const summary: Record<string, any> = {};

    this.metrics.forEach((metricList, name) => {
      if (metricList.length > 0) {
        const stats = this.getMetricsStats(name);
        summary[name] = stats;
      }
    });

    return summary;
  }
}

// Export singleton instance
export const customMetrics = new CustomMetricsTracker();

export default CustomMetricsTracker;
