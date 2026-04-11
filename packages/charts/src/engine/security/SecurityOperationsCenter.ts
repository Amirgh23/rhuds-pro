/**
 * Security Operations Center
 * Central hub for security monitoring and incident management
 */

/**
 * Security alert
 */
export interface SecurityAlert {
  id: string;
  timestamp: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  source: string;
  message: string;
  context: Record<string, unknown>;
  status: 'new' | 'acknowledged' | 'investigating' | 'resolved';
  assignedTo?: string;
  tags: string[];
}

/**
 * SOC dashboard
 */
export interface SOCDashboard {
  id: string;
  timestamp: number;
  alertCount: number;
  criticalCount: number;
  averageResponseTime: number;
  mttr: number;
  uptime: number;
  threatLevel: 'critical' | 'high' | 'medium' | 'low';
  activeIncidents: number;
  resolvedIncidents: number;
}

/**
 * Security Operations Center
 * Central hub for security monitoring and incident management
 */
export class SecurityOperationsCenter {
  private alerts: Map<string, SecurityAlert> = new Map();
  private alertHistory: SecurityAlert[] = [];
  private dashboardSnapshots: SOCDashboard[] = [];
  private alertHandlers: Array<(alert: SecurityAlert) => void> = [];
  private escalationRules: Map<string, (alert: SecurityAlert) => boolean> = new Map();

  /**
   * Create security alert
   */
  createAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp' | 'status'>): SecurityAlert {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const securityAlert: SecurityAlert = {
      ...alert,
      id,
      timestamp: Date.now(),
      status: 'new',
    };

    this.alerts.set(id, securityAlert);
    this.alertHistory.push(securityAlert);
    this.notifyAlertHandlers(securityAlert);

    // Check escalation rules
    this.evaluateEscalation(securityAlert);

    return securityAlert;
  }

  /**
   * Register alert handler
   */
  onAlert(handler: (alert: SecurityAlert) => void): void {
    this.alertHandlers.push(handler);
  }

  /**
   * Notify alert handlers
   */
  private notifyAlertHandlers(alert: SecurityAlert): void {
    for (const handler of this.alertHandlers) {
      try {
        handler(alert);
      } catch {
        // Ignore handler errors
      }
    }
  }

  /**
   * Register escalation rule
   */
  registerEscalationRule(ruleId: string, rule: (alert: SecurityAlert) => boolean): void {
    this.escalationRules.set(ruleId, rule);
  }

  /**
   * Evaluate escalation
   */
  private evaluateEscalation(alert: SecurityAlert): void {
    for (const [, rule] of this.escalationRules) {
      try {
        if (rule(alert)) {
          alert.status = 'investigating';
          break;
        }
      } catch {
        // Ignore rule errors
      }
    }
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string, assignedTo?: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.status = 'acknowledged';
    if (assignedTo) {
      alert.assignedTo = assignedTo;
    }

    return true;
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.status = 'resolved';
    return true;
  }

  /**
   * Get alert
   */
  getAlert(alertId: string): SecurityAlert | undefined {
    return this.alerts.get(alertId);
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): SecurityAlert[] {
    return Array.from(this.alerts.values()).filter((a) => a.status !== 'resolved');
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity: string): SecurityAlert[] {
    return this.alertHistory
      .filter((a) => a.severity === severity)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);
  }

  /**
   * Get alerts by type
   */
  getAlertsByType(type: string): SecurityAlert[] {
    return this.alertHistory
      .filter((a) => a.type === type)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);
  }

  /**
   * Get alerts by status
   */
  getAlertsByStatus(status: string): SecurityAlert[] {
    return this.alertHistory
      .filter((a) => a.status === status)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);
  }

  /**
   * Get SOC dashboard
   */
  getSOCDashboard(): SOCDashboard {
    const activeAlerts = this.getActiveAlerts();
    const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical');
    const resolvedAlerts = this.alertHistory.filter((a) => a.status === 'resolved');

    // Calculate average response time
    let totalResponseTime = 0;
    let responseCount = 0;

    for (const alert of resolvedAlerts) {
      const createdAlert = this.alertHistory.find((a) => a.id === alert.id);
      if (createdAlert) {
        totalResponseTime += alert.timestamp - createdAlert.timestamp;
        responseCount++;
      }
    }

    const avgResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0;

    // Determine threat level
    let threatLevel: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (criticalAlerts.length > 5) {
      threatLevel = 'critical';
    } else if (criticalAlerts.length > 2 || activeAlerts.length > 20) {
      threatLevel = 'high';
    } else if (criticalAlerts.length > 0 || activeAlerts.length > 10) {
      threatLevel = 'medium';
    }

    const dashboard: SOCDashboard = {
      id: `dashboard-${Date.now()}`,
      timestamp: Date.now(),
      alertCount: activeAlerts.length,
      criticalCount: criticalAlerts.length,
      averageResponseTime: avgResponseTime,
      mttr: avgResponseTime,
      uptime: 99.9,
      threatLevel,
      activeIncidents: activeAlerts.filter((a) => a.status === 'investigating').length,
      resolvedIncidents: resolvedAlerts.length,
    };

    this.dashboardSnapshots.push(dashboard);
    return dashboard;
  }

  /**
   * Get SOC statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalAlerts = this.alertHistory.length;
    const activeAlerts = this.getActiveAlerts();
    const resolvedAlerts = this.alertHistory.filter((a) => a.status === 'resolved');

    const severityDistribution: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const alert of this.alertHistory) {
      severityDistribution[alert.severity]++;
    }

    const typeDistribution: Record<string, number> = {};
    for (const alert of this.alertHistory) {
      typeDistribution[alert.type] = (typeDistribution[alert.type] || 0) + 1;
    }

    const statusDistribution: Record<string, number> = {
      new: 0,
      acknowledged: 0,
      investigating: 0,
      resolved: 0,
    };

    for (const alert of this.alertHistory) {
      statusDistribution[alert.status]++;
    }

    return {
      totalAlerts,
      activeAlerts: activeAlerts.length,
      resolvedAlerts: resolvedAlerts.length,
      severityDistribution,
      typeDistribution,
      statusDistribution,
      resolutionRate: totalAlerts > 0 ? (resolvedAlerts.length / totalAlerts) * 100 : 0,
    };
  }

  /**
   * Get alert timeline
   */
  getAlertTimeline(hours = 24): Array<{
    timestamp: number;
    count: number;
    critical: number;
  }> {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    const timeline: Array<{
      timestamp: number;
      count: number;
      critical: number;
    }> = [];

    const hourlyBuckets: Record<number, { count: number; critical: number }> = {};

    for (const alert of this.alertHistory) {
      if (alert.timestamp >= cutoffTime) {
        const hourBucket = Math.floor(alert.timestamp / (60 * 60 * 1000)) * (60 * 60 * 1000);
        if (!hourlyBuckets[hourBucket]) {
          hourlyBuckets[hourBucket] = { count: 0, critical: 0 };
        }
        hourlyBuckets[hourBucket].count++;
        if (alert.severity === 'critical') {
          hourlyBuckets[hourBucket].critical++;
        }
      }
    }

    for (const [timestamp, data] of Object.entries(hourlyBuckets)) {
      timeline.push({
        timestamp: parseInt(timestamp),
        count: data.count,
        critical: data.critical,
      });
    }

    return timeline.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Export SOC report
   */
  exportSOCReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          dashboard: this.getSOCDashboard(),
          statistics: this.getStatistics(),
          alerts: this.alertHistory.slice(-100),
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['ID', 'Timestamp', 'Severity', 'Type', 'Status', 'Message'];
    const rows = this.alertHistory
      .slice(-100)
      .map((a) => [a.id, a.timestamp, a.severity, a.type, a.status, a.message]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
