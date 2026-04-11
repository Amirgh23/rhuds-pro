/**
 * Security Audit Logger
 * Comprehensive audit logging for security events and compliance
 */

export interface AuditEntry {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  result: 'success' | 'failure';
  statusCode: number;
  ipAddress: string;
  userAgent: string;
  details: Record<string, unknown>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface AuditFilter {
  userId?: string;
  action?: string;
  resource?: string;
  result?: 'success' | 'failure';
  severity?: 'info' | 'warning' | 'error' | 'critical';
  startTime?: number;
  endTime?: number;
}

export interface AuditStatistics {
  totalEntries: number;
  entriesByAction: Record<string, number>;
  entriesByResource: Record<string, number>;
  entriesByResult: Record<string, number>;
  entriesBySeverity: Record<string, number>;
  failureRate: number;
  criticalEvents: number;
}

export interface AuditRetention {
  retentionDays: number;
  archiveAfterDays: number;
  deleteAfterDays: number;
}

/**
 * Security Audit Logger
 * Logs and manages security audit trails
 */
export class SecurityAuditLogger {
  private entries: AuditEntry[] = [];
  private retention: AuditRetention;
  private indexByUserId: Map<string, AuditEntry[]> = new Map();
  private indexByAction: Map<string, AuditEntry[]> = new Map();
  private indexByResource: Map<string, AuditEntry[]> = new Map();
  private alertThresholds: Map<string, number> = new Map();
  private suspiciousPatterns: Map<string, number> = new Map();

  constructor(
    retention: AuditRetention = { retentionDays: 90, archiveAfterDays: 30, deleteAfterDays: 365 }
  ) {
    this.retention = retention;
    this.initializeAlertThresholds();
  }

  /**
   * Initialize alert thresholds
   */
  private initializeAlertThresholds(): void {
    this.alertThresholds.set('failed_login_attempts', 5);
    this.alertThresholds.set('failed_auth_rate', 0.3);
    this.alertThresholds.set('privilege_escalation', 1);
    this.alertThresholds.set('data_export_size', 1000000); // 1MB
    this.alertThresholds.set('bulk_deletion', 100);
  }

  /**
   * Log audit entry
   */
  public logEntry(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    result: 'success' | 'failure',
    statusCode: number,
    ipAddress: string,
    userAgent: string,
    details: Record<string, unknown> = {},
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info'
  ): AuditEntry {
    const entry: AuditEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      userId,
      action,
      resource,
      resourceId,
      result,
      statusCode,
      ipAddress,
      userAgent,
      details,
      severity,
    };

    this.entries.push(entry);
    this.updateIndices(entry);
    this.detectSuspiciousPatterns(entry);

    return entry;
  }

  /**
   * Update indices for fast lookup
   */
  private updateIndices(entry: AuditEntry): void {
    // Index by user ID
    if (!this.indexByUserId.has(entry.userId)) {
      this.indexByUserId.set(entry.userId, []);
    }
    this.indexByUserId.get(entry.userId)!.push(entry);

    // Index by action
    if (!this.indexByAction.has(entry.action)) {
      this.indexByAction.set(entry.action, []);
    }
    this.indexByAction.get(entry.action)!.push(entry);

    // Index by resource
    if (!this.indexByResource.has(entry.resource)) {
      this.indexByResource.set(entry.resource, []);
    }
    this.indexByResource.get(entry.resource)!.push(entry);
  }

  /**
   * Detect suspicious patterns
   */
  private detectSuspiciousPatterns(entry: AuditEntry): void {
    // Track failed login attempts
    if (entry.action === 'login' && entry.result === 'failure') {
      const key = `failed_login_${entry.userId}`;
      const count = (this.suspiciousPatterns.get(key) || 0) + 1;
      this.suspiciousPatterns.set(key, count);

      if (count >= this.alertThresholds.get('failed_login_attempts')!) {
        entry.severity = 'critical';
      }
    }

    // Track privilege escalation
    if (entry.action === 'privilege_change' && entry.result === 'success') {
      entry.severity = 'warning';
    }

    // Track bulk operations
    if ((entry.action === 'delete' || entry.action === 'export') && entry.details.count) {
      const count = entry.details.count as number;
      if (count > this.alertThresholds.get('bulk_deletion')!) {
        entry.severity = 'warning';
      }
    }
  }

  /**
   * Query audit entries
   */
  public query(filter: AuditFilter): AuditEntry[] {
    let results = this.entries;

    if (filter.userId) {
      results = this.indexByUserId.get(filter.userId) || [];
    }

    if (filter.action) {
      results = results.filter((e) => e.action === filter.action);
    }

    if (filter.resource) {
      results = results.filter((e) => e.resource === filter.resource);
    }

    if (filter.result) {
      results = results.filter((e) => e.result === filter.result);
    }

    if (filter.severity) {
      results = results.filter((e) => e.severity === filter.severity);
    }

    if (filter.startTime) {
      results = results.filter((e) => e.timestamp >= filter.startTime!);
    }

    if (filter.endTime) {
      results = results.filter((e) => e.timestamp <= filter.endTime!);
    }

    return results;
  }

  /**
   * Get user activity
   */
  public getUserActivity(userId: string, hours: number = 24): AuditEntry[] {
    const startTime = Date.now() - hours * 60 * 60 * 1000;
    return this.query({
      userId,
      startTime,
    });
  }

  /**
   * Get failed attempts
   */
  public getFailedAttempts(userId: string, hours: number = 24): AuditEntry[] {
    const startTime = Date.now() - hours * 60 * 60 * 1000;
    return this.query({
      userId,
      result: 'failure',
      startTime,
    });
  }

  /**
   * Get resource access history
   */
  public getResourceAccessHistory(resource: string, resourceId: string): AuditEntry[] {
    return this.entries.filter((e) => e.resource === resource && e.resourceId === resourceId);
  }

  /**
   * Get audit statistics
   */
  public getStatistics(filter?: AuditFilter): AuditStatistics {
    const entries = filter ? this.query(filter) : this.entries;

    const entriesByAction: Record<string, number> = {};
    const entriesByResource: Record<string, number> = {};
    const entriesByResult: Record<string, number> = {};
    const entriesBySeverity: Record<string, number> = {};

    let failureCount = 0;
    let criticalCount = 0;

    for (const entry of entries) {
      entriesByAction[entry.action] = (entriesByAction[entry.action] || 0) + 1;
      entriesByResource[entry.resource] = (entriesByResource[entry.resource] || 0) + 1;
      entriesByResult[entry.result] = (entriesByResult[entry.result] || 0) + 1;
      entriesBySeverity[entry.severity] = (entriesBySeverity[entry.severity] || 0) + 1;

      if (entry.result === 'failure') failureCount++;
      if (entry.severity === 'critical') criticalCount++;
    }

    const failureRate = entries.length > 0 ? failureCount / entries.length : 0;

    return {
      totalEntries: entries.length,
      entriesByAction,
      entriesByResource,
      entriesByResult,
      entriesBySeverity,
      failureRate,
      criticalEvents: criticalCount,
    };
  }

  /**
   * Export audit log
   */
  public exportAuditLog(format: 'json' | 'csv', filter?: AuditFilter): string {
    const entries = filter ? this.query(filter) : this.entries;

    if (format === 'json') {
      return JSON.stringify(entries, null, 2);
    }

    // CSV format
    const headers = [
      'ID',
      'Timestamp',
      'User ID',
      'Action',
      'Resource',
      'Result',
      'Status Code',
      'IP Address',
      'Severity',
    ];
    const rows = entries.map((e) => [
      e.id,
      new Date(e.timestamp).toISOString(),
      e.userId,
      e.action,
      e.resource,
      e.result,
      e.statusCode,
      e.ipAddress,
      e.severity,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    return csv;
  }

  /**
   * Cleanup old entries
   */
  public cleanupOldEntries(): number {
    const cutoffTime = Date.now() - this.retention.deleteAfterDays * 24 * 60 * 60 * 1000;
    const initialLength = this.entries.length;

    this.entries = this.entries.filter((e) => e.timestamp > cutoffTime);

    // Rebuild indices
    this.indexByUserId.clear();
    this.indexByAction.clear();
    this.indexByResource.clear();

    for (const entry of this.entries) {
      this.updateIndices(entry);
    }

    return initialLength - this.entries.length;
  }

  /**
   * Get retention policy
   */
  public getRetentionPolicy(): AuditRetention {
    return { ...this.retention };
  }

  /**
   * Update retention policy
   */
  public updateRetentionPolicy(retention: Partial<AuditRetention>): void {
    this.retention = { ...this.retention, ...retention };
  }

  /**
   * Get suspicious activities
   */
  public getSuspiciousActivities(): Record<string, number> {
    return Object.fromEntries(this.suspiciousPatterns);
  }

  /**
   * Generate compliance report
   */
  public generateComplianceReport(days: number = 30): Record<string, unknown> {
    const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
    const stats = this.getStatistics({ startTime });

    return {
      reportPeriod: `${days} days`,
      generatedAt: new Date().toISOString(),
      statistics: stats,
      retentionPolicy: this.retention,
      totalEntriesAudited: this.entries.length,
      entriesInPeriod: stats.totalEntries,
    };
  }

  /**
   * Generate ID
   */
  private generateId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get total entries
   */
  public getTotalEntries(): number {
    return this.entries.length;
  }

  /**
   * Clear all entries (use with caution)
   */
  public clearAllEntries(): number {
    const count = this.entries.length;
    this.entries = [];
    this.indexByUserId.clear();
    this.indexByAction.clear();
    this.indexByResource.clear();
    return count;
  }
}
