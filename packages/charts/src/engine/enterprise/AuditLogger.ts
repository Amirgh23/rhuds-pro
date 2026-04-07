/**
 * Audit Logging System
 * Track user actions, data changes, and system events
 */

export type AuditAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'export'
  | 'import'
  | 'login'
  | 'logout'
  | 'permission_change'
  | 'role_change'
  | 'config_change'
  | 'other';

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  changes?: Record<string, any>;
  status: 'success' | 'failure';
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface AuditQuery {
  userId?: string;
  action?: AuditAction;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'success' | 'failure';
  limit?: number;
  offset?: number;
}

/**
 * Audit Logger
 */
export class AuditLogger {
  private logs: AuditLog[] = [];
  private maxLogs: number = 10000;
  private listeners: Map<string, Function[]> = new Map();

  constructor(maxLogs: number = 10000) {
    this.maxLogs = maxLogs;
  }

  /**
   * Log action
   */
  public log(
    userId: string,
    action: AuditAction,
    resource: string,
    options: {
      resourceId?: string;
      changes?: Record<string, any>;
      status?: 'success' | 'failure';
      errorMessage?: string;
      ipAddress?: string;
      userAgent?: string;
      metadata?: Record<string, any>;
    } = {}
  ): AuditLog {
    const log: AuditLog = {
      id: this.generateId(),
      timestamp: new Date(),
      userId,
      action,
      resource,
      resourceId: options.resourceId,
      changes: options.changes,
      status: options.status || 'success',
      errorMessage: options.errorMessage,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      metadata: options.metadata,
    };

    this.logs.push(log);

    // Maintain max logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.emit('log:created', { action, resource, status: log.status });

    return log;
  }

  /**
   * Query logs
   */
  public query(query: AuditQuery): AuditLog[] {
    let results = [...this.logs];

    if (query.userId) {
      results = results.filter((l) => l.userId === query.userId);
    }

    if (query.action) {
      results = results.filter((l) => l.action === query.action);
    }

    if (query.resource) {
      results = results.filter((l) => l.resource === query.resource);
    }

    if (query.status) {
      results = results.filter((l) => l.status === query.status);
    }

    if (query.startDate) {
      results = results.filter((l) => l.timestamp >= query.startDate!);
    }

    if (query.endDate) {
      results = results.filter((l) => l.timestamp <= query.endDate!);
    }

    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 100;

    return results.slice(offset, offset + limit);
  }

  /**
   * Get logs by user
   */
  public getLogsByUser(userId: string, limit: number = 100): AuditLog[] {
    return this.query({ userId, limit });
  }

  /**
   * Get logs by action
   */
  public getLogsByAction(action: AuditAction, limit: number = 100): AuditLog[] {
    return this.query({ action, limit });
  }

  /**
   * Get logs by resource
   */
  public getLogsByResource(resource: string, limit: number = 100): AuditLog[] {
    return this.query({ resource, limit });
  }

  /**
   * Get logs by date range
   */
  public getLogsByDateRange(startDate: Date, endDate: Date, limit: number = 100): AuditLog[] {
    return this.query({ startDate, endDate, limit });
  }

  /**
   * Get user activity summary
   */
  public getUserActivitySummary(userId: string): Record<AuditAction, number> {
    const summary: Record<AuditAction, number> = {
      create: 0,
      read: 0,
      update: 0,
      delete: 0,
      export: 0,
      import: 0,
      login: 0,
      logout: 0,
      permission_change: 0,
      role_change: 0,
      config_change: 0,
      other: 0,
    };

    const logs = this.getLogsByUser(userId, this.maxLogs);
    logs.forEach((log) => {
      summary[log.action]++;
    });

    return summary;
  }

  /**
   * Get resource change history
   */
  public getResourceChangeHistory(resource: string, resourceId: string): AuditLog[] {
    return this.logs.filter((l) => l.resource === resource && l.resourceId === resourceId);
  }

  /**
   * Get failed actions
   */
  public getFailedActions(limit: number = 100): AuditLog[] {
    return this.query({ status: 'failure', limit });
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    totalLogs: number;
    successCount: number;
    failureCount: number;
    uniqueUsers: number;
    actionCounts: Record<AuditAction, number>;
  } {
    const actionCounts: Record<AuditAction, number> = {
      create: 0,
      read: 0,
      update: 0,
      delete: 0,
      export: 0,
      import: 0,
      login: 0,
      logout: 0,
      permission_change: 0,
      role_change: 0,
      config_change: 0,
      other: 0,
    };

    const uniqueUsers = new Set<string>();
    let successCount = 0;
    let failureCount = 0;

    this.logs.forEach((log) => {
      uniqueUsers.add(log.userId);
      actionCounts[log.action]++;
      if (log.status === 'success') {
        successCount++;
      } else {
        failureCount++;
      }
    });

    return {
      totalLogs: this.logs.length,
      successCount,
      failureCount,
      uniqueUsers: uniqueUsers.size,
      actionCounts,
    };
  }

  /**
   * Export logs
   */
  public exportLogs(query?: AuditQuery): string {
    const logs = query ? this.query(query) : this.logs;
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Clear old logs
   */
  public clearOldLogs(beforeDate: Date): number {
    const initialLength = this.logs.length;
    this.logs = this.logs.filter((l) => l.timestamp >= beforeDate);
    const removed = initialLength - this.logs.length;
    this.emit('logs:cleared', { removed });
    return removed;
  }

  /**
   * Generate ID
   */
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
   * Destroy logger
   */
  public destroy(): void {
    this.logs = [];
    this.listeners.clear();
  }
}

export default AuditLogger;
