/**
 * Alerts Configuration
 * Alert rules, thresholds, and notification channels
 */

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export enum AlertChannel {
  EMAIL = 'EMAIL',
  SLACK = 'SLACK',
  PAGERDUTY = 'PAGERDUTY',
  SMS = 'SMS',
  WEBHOOK = 'WEBHOOK',
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  duration: number; // seconds
  severity: AlertSeverity;
  channels: AlertChannel[];
  enabled: boolean;
}

export interface Alert {
  id: string;
  ruleId: string;
  timestamp: string;
  severity: AlertSeverity;
  message: string;
  value: number;
  threshold: number;
  acknowledged: boolean;
  resolvedAt?: string;
}

/**
 * Alert rules configuration
 */
export const ALERT_RULES: AlertRule[] = [
  // Performance Alerts
  {
    id: 'page-load-time-high',
    name: 'High Page Load Time',
    description: 'Page load time exceeds 5 seconds',
    metric: 'page_load_time',
    threshold: 5000,
    operator: 'gt',
    duration: 60,
    severity: AlertSeverity.WARNING,
    channels: [AlertChannel.EMAIL, AlertChannel.SLACK],
    enabled: true,
  },
  {
    id: 'tti-high',
    name: 'High Time to Interactive',
    description: 'TTI exceeds 7 seconds',
    metric: 'tti',
    threshold: 7000,
    operator: 'gt',
    duration: 60,
    severity: AlertSeverity.WARNING,
    channels: [AlertChannel.EMAIL, AlertChannel.SLACK],
    enabled: true,
  },
  {
    id: 'fcp-high',
    name: 'High First Contentful Paint',
    description: 'FCP exceeds 2 seconds',
    metric: 'fcp',
    threshold: 2000,
    operator: 'gt',
    duration: 60,
    severity: AlertSeverity.WARNING,
    channels: [AlertChannel.EMAIL],
    enabled: true,
  },

  // Memory Alerts
  {
    id: 'memory-usage-high',
    name: 'High Memory Usage',
    description: 'Memory usage exceeds 70MB',
    metric: 'memory_usage',
    threshold: 70,
    operator: 'gt',
    duration: 120,
    severity: AlertSeverity.WARNING,
    channels: [AlertChannel.EMAIL, AlertChannel.SLACK],
    enabled: true,
  },
  {
    id: 'memory-usage-critical',
    name: 'Critical Memory Usage',
    description: 'Memory usage exceeds 100MB',
    metric: 'memory_usage',
    threshold: 100,
    operator: 'gt',
    duration: 30,
    severity: AlertSeverity.CRITICAL,
    channels: [AlertChannel.EMAIL, AlertChannel.SLACK, AlertChannel.PAGERDUTY],
    enabled: true,
  },

  // CPU Alerts
  {
    id: 'cpu-usage-high',
    name: 'High CPU Usage',
    description: 'CPU usage exceeds 50%',
    metric: 'cpu_usage',
    threshold: 50,
    operator: 'gt',
    duration: 120,
    severity: AlertSeverity.WARNING,
    channels: [AlertChannel.EMAIL, AlertChannel.SLACK],
    enabled: true,
  },
  {
    id: 'cpu-usage-critical',
    name: 'Critical CPU Usage',
    description: 'CPU usage exceeds 80%',
    metric: 'cpu_usage',
    threshold: 80,
    operator: 'gt',
    duration: 30,
    severity: AlertSeverity.CRITICAL,
    channels: [AlertChannel.EMAIL, AlertChannel.SLACK, AlertChannel.PAGERDUTY],
    enabled: true,
  },

  // Frame Rate Alerts
  {
    id: 'frame-rate-low',
    name: 'Low Frame Rate',
    description: 'Frame rate drops below 50 FPS',
    metric: 'frame_rate',
    threshold: 50,
    operator: 'lt',
    duration: 60,
    severity: AlertSeverity.WARNING,
    channels: [AlertChannel.EMAIL],
    enabled: true,
  },

  // Error Alerts
  {
    id: 'error-rate-high',
    name: 'High Error Rate',
    description: 'Error rate exceeds 0.5%',
    metric: 'error_rate',
    threshold: 0.5,
    operator: 'gt',
    duration: 60,
    severity: AlertSeverity.WARNING,
    channels: [AlertChannel.EMAIL, AlertChannel.SLACK],
    enabled: true,
  },
  {
    id: 'error-rate-critical',
    name: 'Critical Error Rate',
    description: 'Error rate exceeds 1%',
    metric: 'error_rate',
    threshold: 1,
    operator: 'gt',
    duration: 30,
    severity: AlertSeverity.CRITICAL,
    channels: [AlertChannel.EMAIL, AlertChannel.SLACK, AlertChannel.PAGERDUTY],
    enabled: true,
  },
  {
    id: 'critical-error-detected',
    name: 'Critical Error Detected',
    description: 'A critical error has been detected',
    metric: 'critical_error_count',
    threshold: 0,
    operator: 'gt',
    duration: 0,
    severity: AlertSeverity.CRITICAL,
    channels: [AlertChannel.EMAIL, AlertChannel.SLACK, AlertChannel.PAGERDUTY],
    enabled: true,
  },

  // Uptime Alerts
  {
    id: 'uptime-low',
    name: 'Low Uptime',
    description: 'Uptime drops below 99%',
    metric: 'uptime',
    threshold: 99,
    operator: 'lt',
    duration: 300,
    severity: AlertSeverity.CRITICAL,
    channels: [AlertChannel.EMAIL, AlertChannel.SLACK, AlertChannel.PAGERDUTY],
    enabled: true,
  },

  // API Response Time Alerts
  {
    id: 'api-response-time-high',
    name: 'High API Response Time',
    description: 'API response time exceeds 3 seconds',
    metric: 'api_response_time',
    threshold: 3000,
    operator: 'gt',
    duration: 60,
    severity: AlertSeverity.WARNING,
    channels: [AlertChannel.EMAIL, AlertChannel.SLACK],
    enabled: true,
  },

  // User Satisfaction Alerts
  {
    id: 'user-satisfaction-low',
    name: 'Low User Satisfaction',
    description: 'User satisfaction drops below 4.0/5',
    metric: 'user_satisfaction',
    threshold: 4.0,
    operator: 'lt',
    duration: 3600,
    severity: AlertSeverity.WARNING,
    channels: [AlertChannel.EMAIL],
    enabled: true,
  },
];

/**
 * Alert manager class
 */
class AlertManager {
  private alerts: Alert[] = [];
  private alertRules: AlertRule[] = ALERT_RULES;
  private metrics: Record<string, number[]> = {};

  /**
   * Check metrics against alert rules
   */
  checkMetrics(metricName: string, value: number) {
    // Store metric value
    if (!this.metrics[metricName]) {
      this.metrics[metricName] = [];
    }
    this.metrics[metricName].push(value);

    // Keep only recent values
    if (this.metrics[metricName].length > 100) {
      this.metrics[metricName] = this.metrics[metricName].slice(-100);
    }

    // Check against rules
    const applicableRules = this.alertRules.filter(
      (rule) => rule.metric === metricName && rule.enabled
    );

    for (const rule of applicableRules) {
      if (this.shouldTriggerAlert(rule, value)) {
        this.triggerAlert(rule, value);
      }
    }
  }

  /**
   * Check if alert should be triggered
   */
  private shouldTriggerAlert(rule: AlertRule, value: number): boolean {
    switch (rule.operator) {
      case 'gt':
        return value > rule.threshold;
      case 'lt':
        return value < rule.threshold;
      case 'eq':
        return value === rule.threshold;
      case 'gte':
        return value >= rule.threshold;
      case 'lte':
        return value <= rule.threshold;
      default:
        return false;
    }
  }

  /**
   * Trigger alert
   */
  private triggerAlert(rule: AlertRule, value: number) {
    // Check if alert already exists
    const existingAlert = this.alerts.find((a) => a.ruleId === rule.id && !a.resolvedAt);

    if (existingAlert) {
      return; // Alert already triggered
    }

    const alert: Alert = {
      id: `${rule.id}-${Date.now()}`,
      ruleId: rule.id,
      timestamp: new Date().toISOString(),
      severity: rule.severity,
      message: rule.description,
      value,
      threshold: rule.threshold,
      acknowledged: false,
    };

    this.alerts.push(alert);

    // Send notifications
    this.sendNotifications(rule, alert);
  }

  /**
   * Send notifications
   */
  private sendNotifications(rule: AlertRule, alert: Alert) {
    for (const channel of rule.channels) {
      this.sendNotification(channel, rule, alert);
    }
  }

  /**
   * Send notification to channel
   */
  private sendNotification(channel: AlertChannel, rule: AlertRule, alert: Alert) {
    const message = `[${alert.severity}] ${rule.name}: ${rule.description} (Value: ${alert.value}, Threshold: ${alert.threshold})`;

    switch (channel) {
      case AlertChannel.EMAIL:
        this.sendEmailNotification(message);
        break;
      case AlertChannel.SLACK:
        this.sendSlackNotification(message, alert.severity);
        break;
      case AlertChannel.PAGERDUTY:
        this.sendPagerDutyNotification(message, alert.severity);
        break;
      case AlertChannel.SMS:
        this.sendSMSNotification(message);
        break;
      case AlertChannel.WEBHOOK:
        this.sendWebhookNotification(message, alert);
        break;
    }
  }

  /**
   * Send email notification
   */
  private sendEmailNotification(message: string) {
    // Implementation would send email
    console.log('Email notification:', message);
  }

  /**
   * Send Slack notification
   */
  private sendSlackNotification(message: string, severity: AlertSeverity) {
    // Implementation would send to Slack
    console.log('Slack notification:', message, severity);
  }

  /**
   * Send PagerDuty notification
   */
  private sendPagerDutyNotification(message: string, severity: AlertSeverity) {
    // Implementation would send to PagerDuty
    console.log('PagerDuty notification:', message, severity);
  }

  /**
   * Send SMS notification
   */
  private sendSMSNotification(message: string) {
    // Implementation would send SMS
    console.log('SMS notification:', message);
  }

  /**
   * Send webhook notification
   */
  private sendWebhookNotification(message: string, alert: Alert) {
    // Implementation would send to webhook
    console.log('Webhook notification:', message, alert);
  }

  /**
   * Get all alerts
   */
  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): Alert[] {
    return this.alerts.filter((a) => !a.resolvedAt);
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.resolvedAt = new Date().toISOString();
    }
  }

  /**
   * Get alert statistics
   */
  getStatistics() {
    const active = this.getActiveAlerts();
    return {
      total: this.alerts.length,
      active: active.length,
      critical: active.filter((a) => a.severity === AlertSeverity.CRITICAL).length,
      warning: active.filter((a) => a.severity === AlertSeverity.WARNING).length,
      info: active.filter((a) => a.severity === AlertSeverity.INFO).length,
    };
  }
}

// Create singleton instance
export const alertManager = new AlertManager();

/**
 * Initialize alerts
 */
export const initializeAlerts = () => {
  // Set up periodic metric checks
  setInterval(() => {
    // This would be called with actual metrics
    // alertManager.checkMetrics('page_load_time', currentPageLoadTime);
  }, 5000);
};

export default alertManager;
