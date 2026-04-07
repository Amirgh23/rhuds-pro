/**
 * Audit Store
 * Persistent storage for audit logs
 */

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, any>;
  status: 'success' | 'failure';
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface AuditQueryFilters {
  userId?: string;
  action?: string;
  resource?: string;
  status?: 'success' | 'failure';
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface AuditStatistics {
  totalEvents: number;
  successCount: number;
  failureCount: number;
  uniqueUsers: number;
  uniqueResources: number;
  eventsByAction: Record<string, number>;
  eventsByResource: Record<string, number>;
  eventsByUser: Record<string, number>;
}

/**
 * Audit Store for managing audit logs
 */
export class AuditStore {
  private logs: AuditLog[] = [];
  private logIndex: Map<string, AuditLog> = new Map();
  private userIndex: Map<string, AuditLog[]> = new Map();
  private resourceIndex: Map<string, AuditLog[]> = new Map();
  private actionIndex: Map<string, AuditLog[]> = new Map();

  /**
   * Add audit log
   */
  addLog(log: Omit<AuditLog, 'id'>): AuditLog {
    const id = this.generateId();
    const auditLog: AuditLog = {
      ...log,
      id,
    };

    this.logs.push(auditLog);
    this.logIndex.set(id, auditLog);

    // Update indexes
    this.addToIndex(this.userIndex, log.userId, auditLog);
    this.addToIndex(this.resourceIndex, log.resource, auditLog);
    this.addToIndex(this.actionIndex, log.action, auditLog);

    return auditLog;
  }

  /**
   * Get log by ID
   */
  getLog(logId: string): AuditLog | null {
    return this.logIndex.get(logId) || null;
  }

  /**
   * Query logs
   */
  queryLogs(filters: AuditQueryFilters): AuditLog[] {
    let results = [...this.logs];

    // Filter by user
    if (filters.userId) {
      results = results.filter((log) => log.userId === filters.userId);
    }

    // Filter by action
    if (filters.action) {
      results = results.filter((log) => log.action === filters.action);
    }

    // Filter by resource
    if (filters.resource) {
      results = results.filter((log) => log.resource === filters.resource);
    }

    // Filter by status
    if (filters.status) {
      results = results.filter((log) => log.status === filters.status);
    }

    // Filter by date range
    if (filters.startDate) {
      results = results.filter((log) => log.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      results = results.filter((log) => log.timestamp <= filters.endDate!);
    }

    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 100;

    return results.slice(offset, offset + limit);
  }

  /**
   * Get logs by user
   */
  getLogsByUser(userId: string): AuditLog[] {
    return this.userIndex.get(userId) || [];
  }

  /**
   * Get logs by resource
   */
  getLogsByResource(resource: string): AuditLog[] {
    return this.resourceIndex.get(resource) || [];
  }

  /**
   * Get logs by action
   */
  getLogsByAction(action: string): AuditLog[] {
    return this.actionIndex.get(action) || [];
  }

  /**
   * Get statistics
   */
  getStatistics(filters?: AuditQueryFilters): AuditStatistics {
    const logs = filters ? this.queryLogs(filters) : this.logs;

    const stats: AuditStatistics = {
      totalEvents: logs.length,
      successCount: 0,
      failureCount: 0,
      uniqueUsers: 0,
      uniqueResources: 0,
      eventsByAction: {},
      eventsByResource: {},
      eventsByUser: {},
    };

    const users = new Set<string>();
    const resources = new Set<string>();

    for (const log of logs) {
      // Count by status
      if (log.status === 'success') {
        stats.successCount++;
      } else {
        stats.failureCount++;
      }

      // Track unique users and resources
      users.add(log.userId);
      resources.add(log.resource);

      // Count by action
      stats.eventsByAction[log.action] = (stats.eventsByAction[log.action] || 0) + 1;

      // Count by resource
      stats.eventsByResource[log.resource] = (stats.eventsByResource[log.resource] || 0) + 1;

      // Count by user
      stats.eventsByUser[log.userId] = (stats.eventsByUser[log.userId] || 0) + 1;
    }

    stats.uniqueUsers = users.size;
    stats.uniqueResources = resources.size;

    return stats;
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 100): AuditLog[] {
    return this.logs.slice(-count).reverse();
  }

  /**
   * Get logs for date range
   */
  getLogsByDateRange(startDate: Date, endDate: Date): AuditLog[] {
    return this.logs.filter((log) => log.timestamp >= startDate && log.timestamp <= endDate);
  }

  /**
   * Delete old logs
   */
  deleteOldLogs(beforeDate: Date): number {
    const initialLength = this.logs.length;

    // Filter out old logs
    const newLogs = this.logs.filter((log) => log.timestamp >= beforeDate);

    // Rebuild indexes
    this.logs = newLogs;
    this.logIndex.clear();
    this.userIndex.clear();
    this.resourceIndex.clear();
    this.actionIndex.clear();

    for (const log of newLogs) {
      this.logIndex.set(log.id, log);
      this.addToIndex(this.userIndex, log.userId, log);
      this.addToIndex(this.resourceIndex, log.resource, log);
      this.addToIndex(this.actionIndex, log.action, log);
    }

    return initialLength - newLogs.length;
  }

  /**
   * Export logs
   */
  exportLogs(filters?: AuditQueryFilters): string {
    const logs = filters ? this.queryLogs(filters) : this.logs;
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Get log count
   */
  getLogCount(): number {
    return this.logs.length;
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
    this.logIndex.clear();
    this.userIndex.clear();
    this.resourceIndex.clear();
    this.actionIndex.clear();
  }

  /**
   * Add to index helper
   */
  private addToIndex(index: Map<string, AuditLog[]>, key: string, log: AuditLog): void {
    if (!index.has(key)) {
      index.set(key, []);
    }
    index.get(key)!.push(log);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default AuditStore;
