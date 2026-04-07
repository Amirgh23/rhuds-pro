/**
 * Performance Alerts System
 * Monitors performance metrics and triggers alerts when thresholds are exceeded
 */

export interface AlertThreshold {
  metric: string;
  warning: number;
  critical: number;
  unit: string;
}

export interface PerformanceAlert {
  id: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'warning' | 'critical';
  timestamp: number;
  message: string;
}

export interface AlertConfig {
  enabled: boolean;
  thresholds: AlertThreshold[];
  checkInterval: number;
  maxAlerts: number;
  notificationEnabled: boolean;
}

class PerformanceAlertsSystem {
  private config: AlertConfig;
  private alerts: Map<string, PerformanceAlert> = new Map();
  private listeners: Set<(alert: PerformanceAlert) => void> = new Set();
  private checkInterval: NodeJS.Timeout | null = null;
  private previousMetrics: Map<string, number> = new Map();

  constructor(config: Partial<AlertConfig> = {}) {
    this.config = {
      enabled: true,
      thresholds: [
        { metric: 'pageLoad', warning: 1100, critical: 1500, unit: 'ms' },
        { metric: 'tti', warning: 2500, critical: 3500, unit: 'ms' },
        { metric: 'fcp', warning: 1800, critical: 2500, unit: 'ms' },
        { metric: 'lcp', warning: 2500, critical: 4000, unit: 'ms' },
        { metric: 'cls', warning: 0.1, critical: 0.25, unit: '' },
        { metric: 'fid', warning: 100, critical: 300, unit: 'ms' },
        { metric: 'bundleSize', warning: 35, critical: 50, unit: 'KB' },
        { metric: 'memoryUsage', warning: 80, critical: 95, unit: '%' },
        { metric: 'fps', warning: 50, critical: 30, unit: 'fps' },
        { metric: 'networkLatency', warning: 200, critical: 500, unit: 'ms' },
      ],
      checkInterval: 5000,
      maxAlerts: 20,
      notificationEnabled: true,
      ...config,
    };
  }

  /**
   * Start monitoring performance metrics
   */
  start(): void {
    if (!this.config.enabled) return;

    this.checkInterval = setInterval(() => {
      this.checkMetrics();
    }, this.config.checkInterval);
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check current metrics against thresholds
   */
  private checkMetrics(): void {
    try {
      const metrics = this.collectMetrics();

      for (const [metric, value] of Object.entries(metrics)) {
        const threshold = this.config.thresholds.find((t) => t.metric === metric);
        if (!threshold) continue;

        const previousValue = this.previousMetrics.get(metric);
        this.previousMetrics.set(metric, value);

        // Check for critical threshold
        if (value > threshold.critical) {
          this.triggerAlert(metric, value, threshold.critical, 'critical', threshold.unit);
        }
        // Check for warning threshold
        else if (value > threshold.warning) {
          this.triggerAlert(metric, value, threshold.warning, 'warning', threshold.unit);
        }
        // Clear alert if metric improved
        else if (previousValue && previousValue > threshold.warning) {
          this.clearAlert(metric);
        }
      }
    } catch (error) {
      console.error('Error checking metrics:', error);
    }
  }

  /**
   * Collect current performance metrics
   */
  private collectMetrics(): Record<string, number> {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find((e) => e.name === 'first-contentful-paint')?.startTime || 0;

    const memory = (performance as any).memory;
    const memoryUsage = memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0;

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
      pageLoad: navigation?.loadEventEnd - navigation?.fetchStart || 0,
      tti: navigation?.domInteractive - navigation?.fetchStart || 0,
      fcp: fcp,
      lcp: fcp, // Will be updated by observer
      cls: 0, // Will be updated by observer
      fid: 0, // Will be updated by observer
      bundleSize: bundleSize / 1024,
      memoryUsage: memoryUsage,
      fps: 60, // Will be updated by FPS monitor
      networkLatency: navigation?.responseStart - navigation?.fetchStart || 0,
    };
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(
    metric: string,
    value: number,
    threshold: number,
    severity: 'warning' | 'critical',
    unit: string
  ): void {
    const alertId = `${metric}-${severity}`;
    const existingAlert = this.alerts.get(alertId);

    // Don't trigger duplicate alerts
    if (existingAlert && Date.now() - existingAlert.timestamp < 10000) {
      return;
    }

    const alert: PerformanceAlert = {
      id: alertId,
      metric,
      value: Math.round(value * 100) / 100,
      threshold: Math.round(threshold * 100) / 100,
      severity,
      timestamp: Date.now(),
      message: `${metric} is ${severity}: ${value.toFixed(2)}${unit} (threshold: ${threshold.toFixed(2)}${unit})`,
    };

    this.alerts.set(alertId, alert);

    // Limit number of stored alerts
    if (this.alerts.size > this.config.maxAlerts) {
      const oldestAlert = Array.from(this.alerts.values()).sort(
        (a, b) => a.timestamp - b.timestamp
      )[0];
      this.alerts.delete(oldestAlert.id);
    }

    // Notify listeners
    this.listeners.forEach((listener) => listener(alert));

    // Send browser notification if enabled
    if (this.config.notificationEnabled && 'Notification' in window) {
      this.sendNotification(alert);
    }

    // Log alert
    console.warn(`[Performance Alert] ${alert.message}`);
  }

  /**
   * Clear an alert
   */
  private clearAlert(metric: string): void {
    const alertId = `${metric}-warning`;
    const criticalAlertId = `${metric}-critical`;

    this.alerts.delete(alertId);
    this.alerts.delete(criticalAlertId);
  }

  /**
   * Send browser notification
   */
  private sendNotification(alert: PerformanceAlert): void {
    try {
      if (Notification.permission === 'granted') {
        new Notification('Performance Alert', {
          body: alert.message,
          icon: '/favicon.ico',
          tag: alert.id,
          requireInteraction: alert.severity === 'critical',
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Subscribe to alerts
   */
  subscribe(listener: (alert: PerformanceAlert) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get all active alerts
   */
  getAlerts(): PerformanceAlert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity: 'warning' | 'critical'): PerformanceAlert[] {
    return Array.from(this.alerts.values()).filter((a) => a.severity === severity);
  }

  /**
   * Clear all alerts
   */
  clearAllAlerts(): void {
    this.alerts.clear();
  }

  /**
   * Update thresholds
   */
  updateThresholds(thresholds: AlertThreshold[]): void {
    this.config.thresholds = thresholds;
  }

  /**
   * Get current configuration
   */
  getConfig(): AlertConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AlertConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }
}

// Export singleton instance
export const performanceAlerts = new PerformanceAlertsSystem();

export default PerformanceAlertsSystem;
