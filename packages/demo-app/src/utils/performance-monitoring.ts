/**
 * Performance Monitoring Utilities
 * Tracks and reports performance metrics for real-time monitoring
 */

export interface PerformanceAlert {
  id: string;
  type: 'performance' | 'error' | 'warning';
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
  resolved?: boolean;
}

export interface PerformanceMetricsSnapshot {
  pageLoad: number;
  tti: number;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  bundleSize: number;
  memoryUsage: number;
  fps: number;
  networkLatency: number;
  timestamp: number;
}

class PerformanceMonitor {
  private alerts: Map<string, PerformanceAlert> = new Map();
  private metricsHistory: PerformanceMetricsSnapshot[] = [];
  private maxHistorySize = 300; // 5 minutes at 1 sample/sec
  private alertCallbacks: ((alert: PerformanceAlert) => void)[] = [];

  /**
   * Get current performance metrics
   */
  getMetrics(): Partial<PerformanceMetricsSnapshot> {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find((e) => e.name === 'first-contentful-paint')?.startTime || 0;

    const pageLoad = navigation?.loadEventEnd - navigation?.fetchStart || 0;
    const tti = navigation?.domInteractive - navigation?.fetchStart || 0;
    const networkLatency = navigation?.responseStart - navigation?.fetchStart || 0;

    // Get memory usage
    const memory = (performance as any).memory;
    const memoryUsage = memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0;

    // Get bundle size
    let bundleSize = 0;
    const resources = performance.getEntriesByType('resource');
    resources.forEach((resource) => {
      if (
        resource.name.includes('.js') ||
        resource.name.includes('.css') ||
        resource.name.includes('.wasm')
      ) {
        bundleSize += (resource as PerformanceResourceTiming).transferSize || 0;
      }
    });

    return {
      pageLoad: Math.round(pageLoad),
      tti: Math.round(tti),
      fcp: Math.round(fcp),
      bundleSize: Math.round(bundleSize / 1024),
      memoryUsage: Math.round(memoryUsage),
      networkLatency: Math.round(networkLatency),
      timestamp: Date.now(),
    };
  }

  /**
   * Check metrics against thresholds and create alerts
   */
  checkThresholds(metrics: Partial<PerformanceMetricsSnapshot>): PerformanceAlert[] {
    const newAlerts: PerformanceAlert[] = [];

    const thresholds = {
      pageLoad: 1100,
      tti: 2500,
      fcp: 1800,
      lcp: 2500,
      cls: 0.1,
      fid: 100,
      bundleSize: 35,
      memoryUsage: 80,
      fps: 50,
      networkLatency: 200,
    };

    Object.entries(metrics).forEach(([key, value]) => {
      if (value === undefined || key === 'timestamp') return;

      const threshold = thresholds[key as keyof typeof thresholds];
      if (!threshold) return;

      if (value > threshold) {
        const alertId = `${key}-${Date.now()}`;
        const alert: PerformanceAlert = {
          id: alertId,
          type: value > threshold * 1.5 ? 'performance' : 'warning',
          metric: key,
          value: value as number,
          threshold,
          timestamp: Date.now(),
        };

        newAlerts.push(alert);
        this.alerts.set(alertId, alert);
        this.notifyAlertCallbacks(alert);
      }
    });

    return newAlerts;
  }

  /**
   * Record metrics snapshot
   */
  recordMetrics(metrics: PerformanceMetricsSnapshot): void {
    this.metricsHistory.push(metrics);
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.shift();
    }
  }

  /**
   * Get metrics history
   */
  getHistory(): PerformanceMetricsSnapshot[] {
    return [...this.metricsHistory];
  }

  /**
   * Get active alerts
   */
  getAlerts(): PerformanceAlert[] {
    return Array.from(this.alerts.values()).filter((a) => !a.resolved);
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
   * Subscribe to alert notifications
   */
  onAlert(callback: (alert: PerformanceAlert) => void): () => void {
    this.alertCallbacks.push(callback);
    return () => {
      this.alertCallbacks = this.alertCallbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify alert callbacks
   */
  private notifyAlertCallbacks(alert: PerformanceAlert): void {
    this.alertCallbacks.forEach((cb) => {
      try {
        cb(alert);
      } catch (error) {
        console.error('Error in alert callback:', error);
      }
    });
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const metrics = this.getMetrics();
    const alerts = this.getAlerts();

    return {
      metrics,
      alerts,
      alertCount: alerts.length,
      criticalCount: alerts.filter((a) => a.type === 'performance').length,
      warningCount: alerts.filter((a) => a.type === 'warning').length,
    };
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.metricsHistory = [];
    this.alerts.clear();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Start monitoring performance
 */
export function startPerformanceMonitoring(interval: number = 5000): () => void {
  const intervalId = setInterval(() => {
    const metrics = performanceMonitor.getMetrics() as PerformanceMetricsSnapshot;
    performanceMonitor.recordMetrics(metrics);
    performanceMonitor.checkThresholds(metrics);
  }, interval);

  return () => clearInterval(intervalId);
}

/**
 * Get performance report
 */
export function getPerformanceReport() {
  const history = performanceMonitor.getHistory();
  if (history.length === 0) return null;

  const pageLoads = history.map((h) => h.pageLoad);
  const ttis = history.map((h) => h.tti);
  const bundleSizes = history.map((h) => h.bundleSize);

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const min = (arr: number[]) => Math.min(...arr);
  const max = (arr: number[]) => Math.max(...arr);

  return {
    pageLoad: {
      avg: Math.round(avg(pageLoads)),
      min: Math.round(min(pageLoads)),
      max: Math.round(max(pageLoads)),
    },
    tti: {
      avg: Math.round(avg(ttis)),
      min: Math.round(min(ttis)),
      max: Math.round(max(ttis)),
    },
    bundleSize: {
      avg: Math.round(avg(bundleSizes)),
      min: Math.round(min(bundleSizes)),
      max: Math.round(max(bundleSizes)),
    },
    sampleCount: history.length,
    timeRange: {
      start: history[0].timestamp,
      end: history[history.length - 1].timestamp,
    },
  };
}
