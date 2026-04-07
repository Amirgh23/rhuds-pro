/**
 * Distributed Logging
 * سیستم ثبت‌کردن توزیع‌شده برای جمع‌آوری و تحلیل لاگ‌ها
 *
 * Features:
 * - Log aggregation
 * - Log analysis
 * - Log retention
 * - Log search
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  source: string;
  context?: Record<string, any>;
  stackTrace?: string;
  userId?: string;
  sessionId?: string;
}

export interface LogQuery {
  level?: LogLevel;
  source?: string;
  startTime?: number;
  endTime?: number;
  message?: string;
  limit?: number;
}

export interface LogStats {
  totalLogs: number;
  logsByLevel: Record<LogLevel, number>;
  logsBySource: Record<string, number>;
  averageLogsPerSecond: number;
}

export class DistributedLogging {
  private logs: LogEntry[];
  private logIndex: Map<string, LogEntry[]>;
  private retentionPolicy: { maxLogs: number; maxAge: number };
  private stats: {
    logsRecorded: number;
    logsSearched: number;
    logsArchived: number;
  };

  constructor(maxLogs: number = 100000, maxAge: number = 7 * 24 * 60 * 60 * 1000) {
    this.logs = [];
    this.logIndex = new Map();
    this.retentionPolicy = { maxLogs, maxAge };
    this.stats = {
      logsRecorded: 0,
      logsSearched: 0,
      logsArchived: 0,
    };
  }

  /**
   * Log message
   */
  public log(
    level: LogLevel,
    message: string,
    source: string,
    context?: Record<string, any>,
    stackTrace?: string,
    userId?: string,
    sessionId?: string
  ): string {
    const logId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const entry: LogEntry = {
      id: logId,
      timestamp: Date.now(),
      level,
      message,
      source,
      context,
      stackTrace,
      userId,
      sessionId,
    };

    this.logs.push(entry);
    this.stats.logsRecorded++;

    // Index by source
    if (!this.logIndex.has(source)) {
      this.logIndex.set(source, []);
    }
    this.logIndex.get(source)!.push(entry);

    // Apply retention policy
    this.enforceRetention();

    return logId;
  }

  /**
   * Enforce retention policy
   */
  private enforceRetention(): void {
    const now = Date.now();

    // Remove old logs
    this.logs = this.logs.filter((log) => now - log.timestamp < this.retentionPolicy.maxAge);

    // Remove excess logs
    if (this.logs.length > this.retentionPolicy.maxLogs) {
      const excess = this.logs.length - this.retentionPolicy.maxLogs;
      this.logs.splice(0, excess);
      this.stats.logsArchived += excess;
    }

    // Rebuild index
    this.rebuildIndex();
  }

  /**
   * Rebuild index
   */
  private rebuildIndex(): void {
    this.logIndex.clear();
    for (const log of this.logs) {
      if (!this.logIndex.has(log.source)) {
        this.logIndex.set(log.source, []);
      }
      this.logIndex.get(log.source)!.push(log);
    }
  }

  /**
   * Search logs
   */
  public searchLogs(query: LogQuery): LogEntry[] {
    let results = [...this.logs];

    if (query.level) {
      results = results.filter((log) => log.level === query.level);
    }

    if (query.source) {
      results = results.filter((log) => log.source === query.source);
    }

    if (query.startTime) {
      results = results.filter((log) => log.timestamp >= query.startTime!);
    }

    if (query.endTime) {
      results = results.filter((log) => log.timestamp <= query.endTime!);
    }

    if (query.message) {
      results = results.filter((log) => log.message.includes(query.message!));
    }

    this.stats.logsSearched++;

    const limit = query.limit || 100;
    return results.slice(-limit);
  }

  /**
   * Get logs by level
   */
  public getLogsByLevel(level: LogLevel, limit: number = 100): LogEntry[] {
    return this.logs.filter((log) => log.level === level).slice(-limit);
  }

  /**
   * Get logs by source
   */
  public getLogsBySource(source: string, limit: number = 100): LogEntry[] {
    return (this.logIndex.get(source) || []).slice(-limit);
  }

  /**
   * Get log statistics
   */
  public getLogStats(): LogStats {
    const logsByLevel: Record<LogLevel, number> = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
      fatal: 0,
    };

    const logsBySource: Record<string, number> = {};

    for (const log of this.logs) {
      logsByLevel[log.level]++;
      logsBySource[log.source] = (logsBySource[log.source] || 0) + 1;
    }

    return {
      totalLogs: this.logs.length,
      logsByLevel,
      logsBySource,
      averageLogsPerSecond: this.logs.length / (this.retentionPolicy.maxAge / 1000),
    };
  }

  /**
   * Export logs
   */
  public exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    }

    // CSV format
    const headers = ['ID', 'Timestamp', 'Level', 'Message', 'Source', 'User ID', 'Session ID'];
    const rows = this.logs.map((log) => [
      log.id,
      new Date(log.timestamp).toISOString(),
      log.level,
      log.message,
      log.source,
      log.userId || '',
      log.sessionId || '',
    ]);

    return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  }

  /**
   * Clear logs
   */
  public clearLogs(): void {
    this.logs = [];
    this.logIndex.clear();
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      totalLogs: this.logs.length,
      totalSources: this.logIndex.size,
    };
  }
}
