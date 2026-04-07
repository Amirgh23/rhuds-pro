/**
 * Production Monitoring System
 * Advanced monitoring for production environment
 */

export interface ProductionMetrics {
  pageLoadTime: number;
  tti: number;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  errorRate: number;
  userCount: number;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
}

export interface AlertRule {
  metric: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'log' | 'notify' | 'escalate';
}

export interface ProductionAlert {
  id: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  message: string;
}

class ProductionMonitoringSystem {
  private metrics: ProductionMetrics | null = null;
  private alerts: Map<string, ProductionAlert> = new Map();
  private alertRules: AlertRule[] = [];
  private listeners: Set<(alert: ProductionAlert) => void> = new Set();
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Initialize default alert rules
   */
  private initializeDefaultRules(): void {
    this.alertRules = [
      {
        metric: 'pageLoadTime',
        threshold: 1500,
        severity: 'high',
        action: 'notify',
      },
      {
        metric: 'tti',
        threshold: 3000,
        severity: 'high',
        action: 'notify',
      },
      {
        metric: 'errorRate',
        threshold: 5,
        severity: 'critical',
        action: 'escalate',
      },
      {
        metric: 'bounceRate',
        threshold: 60,
        severity: 'medium',
        action: 'notify',
      },
      {
        metric: 'conversionRate',
        threshold: 1,
        severity: 'medium',
        action: 'log',
      },
    ];
  }

  /**
   * Start monitoring
   */
  start(): void {
    this.checkInterval = setInterval(() => {
      this.checkMetrics();
    }, 60000); // Check every minute
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
   * Check metrics against rules
   */
  private checkMetrics(): void {
    if (!this.metrics) return;

    for (const rule of this.alertRules) {
      const value = (this.metrics as any)[rule.metric];
      if (value === undefined) continue;

      if (value > rule.threshold) {
        this.triggerAlert(rule, value);
      }
    }
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(rule: AlertRule, value: number): void {
    const alertId = `${rule.metric}-${Date.now()}`;
    const alert: ProductionAlert = {
      id: alertId,
      metric: rule.metric,
      value: Math.round(value * 100) / 100,
      threshold: rule.threshold,
      severity: rule.severity,
      timestamp: Date.now(),
      message: `${rule.metric} exceeded threshold: ${value.toFixed(2)} > ${rule.threshold}`,
    };

    this.alerts.set(alertId, alert);

    // Execute action
    this.executeAction(rule.action, alert);

    // Notify listeners
    this.listeners.forEach((listener) => listener(alert));
  }

  /**
   * Execute alert action
   */
  private executeAction(action: string, alert: ProductionAlert): void {
    switch (action) {
      case 'log':
        console.log(`[Production Alert] ${alert.message}`);
        break;
      case 'notify':
        this.sendNotification(alert);
        break;
      case 'escalate':
        this.escalateAlert(alert);
        break;
    }
  }

  /**
   * Send notification
   */
  private sendNotification(alert: ProductionAlert): void {
    // Send to monitoring service
    console.warn(`[Production Alert - ${alert.severity}] ${alert.message}`);
  }

  /**
   * Escalate alert
   */
  private escalateAlert(alert: ProductionAlert): void {
    // Send to incident management system
    console.error(`[Production Alert - ESCALATED] ${alert.message}`);
  }

  /**
   * Update metrics
   */
  updateMetrics(metrics: Partial<ProductionMetrics>): void {
    this.metrics = { ...this.metrics, ...metrics } as ProductionMetrics;
  }

  /**
   * Get current metrics
   */
  getMetrics(): ProductionMetrics | null {
    return this.metrics;
  }

  /**
   * Get alerts
   */
  getAlerts(): ProductionAlert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Subscribe to alerts
   */
  subscribe(listener: (alert: ProductionAlert) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Add alert rule
   */
  addAlertRule(rule: AlertRule): void {
    this.alertRules.push(rule);
  }

  /**
   * Remove alert rule
   */
  removeAlertRule(metric: string): void {
    this.alertRules = this.alertRules.filter((r) => r.metric !== metric);
  }

  /**
   * Get alert rules
   */
  getAlertRules(): AlertRule[] {
    return [...this.alertRules];
  }

  /**
   * Clear alerts
   */
  clearAlerts(): void {
    this.alerts.clear();
  }

  /**
   * Export metrics
   */
  export(): Record<string, any> {
    return {
      metrics: this.metrics,
      alerts: Array.from(this.alerts.values()),
      rules: this.alertRules,
      exportedAt: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const productionMonitoring = new ProductionMonitoringSystem();

export default ProductionMonitoringSystem;
