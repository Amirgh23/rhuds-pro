/**
 * Security Audit System
 * Comprehensive audit logging and compliance tracking
 */

/**
 * Audit event
 */
export interface AuditEvent {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  status: 'success' | 'failure';
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, { before: unknown; after: unknown }>;
}

/**
 * Audit policy
 */
export interface AuditPolicy {
  id: string;
  name: string;
  enabled: boolean;
  actions: string[];
  resources: string[];
  retentionDays: number;
  alertOnFailure: boolean;
}

/**
 * Compliance report
 */
export interface ComplianceReport {
  id: string;
  timestamp: number;
  period: { start: number; end: number };
  totalEvents: number;
  successfulEvents: number;
  failedEvents: number;
  uniqueUsers: number;
  affectedResources: string[];
  summary: Record<string, unknown>;
}

/**
 * Security Audit System
 * Tracks and logs all security-relevant events
 */
export class SecurityAuditSystem {
  private events: Map<string, AuditEvent> = new Map();
  private policies: Map<string, AuditPolicy> = new Map();
  private eventHistory: AuditEvent[] = [];
  private alerts: Array<{ timestamp: number; event: AuditEvent; message: string }> = [];

  /**
   * Create audit policy
   */
  createPolicy(policy: Omit<AuditPolicy, 'id'>): AuditPolicy {
    const id = `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const auditPolicy: AuditPolicy = { ...policy, id };
    this.policies.set(id, auditPolicy);
    return auditPolicy;
  }

  /**
   * Log audit event
   */
  logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const auditEvent: AuditEvent = {
      ...event,
      id,
      timestamp: Date.now(),
    };

    this.events.set(id, auditEvent);
    this.eventHistory.push(auditEvent);

    // Check policies and trigger alerts
    this.checkPolicies(auditEvent);

    return auditEvent;
  }

  /**
   * Check policies against event
   */
  private checkPolicies(event: AuditEvent): void {
    for (const policy of this.policies.values()) {
      if (!policy.enabled) continue;

      const actionMatches = policy.actions.length === 0 || policy.actions.includes(event.action);
      const resourceMatches =
        policy.resources.length === 0 || policy.resources.includes(event.resource);

      if (actionMatches && resourceMatches) {
        if (policy.alertOnFailure && event.status === 'failure') {
          this.alerts.push({
            timestamp: Date.now(),
            event,
            message: `Policy violation: ${policy.name} - ${event.action} on ${event.resource} failed`,
          });
        }
      }
    }
  }

  /**
   * Get audit event
   */
  getEvent(eventId: string): AuditEvent | undefined {
    return this.events.get(eventId);
  }

  /**
   * Get events by user
   */
  getEventsByUser(userId: string, limit?: number): AuditEvent[] {
    const userEvents = this.eventHistory.filter((e) => e.userId === userId);
    if (limit) {
      return userEvents.slice(-limit);
    }
    return userEvents;
  }

  /**
   * Get events by resource
   */
  getEventsByResource(resource: string, resourceId?: string, limit?: number): AuditEvent[] {
    let filtered = this.eventHistory.filter((e) => e.resource === resource);
    if (resourceId) {
      filtered = filtered.filter((e) => e.resourceId === resourceId);
    }
    if (limit) {
      return filtered.slice(-limit);
    }
    return filtered;
  }

  /**
   * Get events by action
   */
  getEventsByAction(action: string, limit?: number): AuditEvent[] {
    const actionEvents = this.eventHistory.filter((e) => e.action === action);
    if (limit) {
      return actionEvents.slice(-limit);
    }
    return actionEvents;
  }

  /**
   * Get failed events
   */
  getFailedEvents(limit?: number): AuditEvent[] {
    const failed = this.eventHistory.filter((e) => e.status === 'failure');
    if (limit) {
      return failed.slice(-limit);
    }
    return failed;
  }

  /**
   * Get events in time range
   */
  getEventsByTimeRange(startTime: number, endTime: number): AuditEvent[] {
    return this.eventHistory.filter((e) => e.timestamp >= startTime && e.timestamp <= endTime);
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(startTime: number, endTime: number): ComplianceReport {
    const events = this.getEventsByTimeRange(startTime, endTime);
    const successful = events.filter((e) => e.status === 'success').length;
    const failed = events.filter((e) => e.status === 'failure').length;
    const uniqueUsers = new Set(events.map((e) => e.userId)).size;
    const affectedResources = Array.from(new Set(events.map((e) => e.resource)));

    const summary: Record<string, unknown> = {
      successRate: events.length > 0 ? (successful / events.length) * 100 : 0,
      failureRate: events.length > 0 ? (failed / events.length) * 100 : 0,
      eventsByAction: this.groupBy(events, 'action'),
      eventsByResource: this.groupBy(events, 'resource'),
    };

    return {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      period: { start: startTime, end: endTime },
      totalEvents: events.length,
      successfulEvents: successful,
      failedEvents: failed,
      uniqueUsers,
      affectedResources,
      summary,
    };
  }

  /**
   * Group events by field
   */
  private groupBy(events: AuditEvent[], field: keyof AuditEvent): Record<string, number> {
    const grouped: Record<string, number> = {};
    for (const event of events) {
      const key = String(event[field]);
      grouped[key] = (grouped[key] || 0) + 1;
    }
    return grouped;
  }

  /**
   * Get audit alerts
   */
  getAlerts(limit?: number): Array<{ timestamp: number; event: AuditEvent; message: string }> {
    if (limit) {
      return this.alerts.slice(-limit);
    }
    return [...this.alerts];
  }

  /**
   * Clear old events
   */
  clearOldEvents(olderThanMs: number): void {
    const cutoffTime = Date.now() - olderThanMs;

    for (const [id, event] of this.events) {
      if (event.timestamp < cutoffTime) {
        this.events.delete(id);
      }
    }

    this.eventHistory = this.eventHistory.filter((e) => e.timestamp >= cutoffTime);
  }

  /**
   * Get audit statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalEvents = this.eventHistory.length;
    const successful = this.eventHistory.filter((e) => e.status === 'success').length;
    const failed = this.eventHistory.filter((e) => e.status === 'failure').length;
    const uniqueUsers = new Set(this.eventHistory.map((e) => e.userId)).size;
    const uniqueResources = new Set(this.eventHistory.map((e) => e.resource)).size;

    return {
      totalEvents,
      successful,
      failed,
      successRate: totalEvents > 0 ? (successful / totalEvents) * 100 : 0,
      failureRate: totalEvents > 0 ? (failed / totalEvents) * 100 : 0,
      uniqueUsers,
      uniqueResources,
      alertCount: this.alerts.length,
    };
  }

  /**
   * Update policy
   */
  updatePolicy(id: string, updates: Partial<AuditPolicy>): boolean {
    const policy = this.policies.get(id);
    if (!policy) return false;

    Object.assign(policy, updates);
    return true;
  }

  /**
   * Delete policy
   */
  deletePolicy(id: string): boolean {
    return this.policies.delete(id);
  }

  /**
   * Get all policies
   */
  getPolicies(): AuditPolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Export audit log
   */
  exportAuditLog(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.eventHistory, null, 2);
    }

    // CSV format
    const headers = ['ID', 'Timestamp', 'User ID', 'Action', 'Resource', 'Status'];
    const rows = this.eventHistory.map((e) => [
      e.id,
      e.timestamp,
      e.userId,
      e.action,
      e.resource,
      e.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
