/**
 * Logging Configuration
 * Centralized logging and log aggregation setup
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, any>;
  stack?: string;
}

/**
 * Logger class for centralized logging
 */
class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private logEndpoint = import.meta.env.VITE_LOG_ENDPOINT || '/api/logs';

  /**
   * Log message
   */
  private log(level: LogLevel, message: string, context?: string, data?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
    };

    // Add to local storage
    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      const style = this.getConsoleStyle(level);
      console.log(`%c[${level}] ${message}`, style, data || '');
    }

    // Send to server
    this.sendLog(entry);

    return entry;
  }

  /**
   * Get console style for log level
   */
  private getConsoleStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: 'color: #888; font-weight: normal;',
      [LogLevel.INFO]: 'color: #0066cc; font-weight: bold;',
      [LogLevel.WARN]: 'color: #ff9900; font-weight: bold;',
      [LogLevel.ERROR]: 'color: #cc0000; font-weight: bold;',
      [LogLevel.CRITICAL]: 'color: #cc0000; font-weight: bold; background: #ffcccc;',
    };
    return styles[level];
  }

  /**
   * Send log to server
   */
  private async sendLog(entry: LogEntry) {
    try {
      // Only send errors and critical logs to server
      if (entry.level === LogLevel.ERROR || entry.level === LogLevel.CRITICAL) {
        await fetch(this.logEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry),
        });
      }
    } catch (e) {
      // Silently fail if logging fails
    }
  }

  /**
   * Debug log
   */
  debug(message: string, context?: string, data?: Record<string, any>) {
    return this.log(LogLevel.DEBUG, message, context, data);
  }

  /**
   * Info log
   */
  info(message: string, context?: string, data?: Record<string, any>) {
    return this.log(LogLevel.INFO, message, context, data);
  }

  /**
   * Warn log
   */
  warn(message: string, context?: string, data?: Record<string, any>) {
    return this.log(LogLevel.WARN, message, context, data);
  }

  /**
   * Error log
   */
  error(message: string, context?: string, data?: Record<string, any>, error?: Error) {
    const entry = this.log(LogLevel.ERROR, message, context, data);
    if (error) {
      entry.stack = error.stack;
    }
    return entry;
  }

  /**
   * Critical log
   */
  critical(message: string, context?: string, data?: Record<string, any>, error?: Error) {
    const entry = this.log(LogLevel.CRITICAL, message, context, data);
    if (error) {
      entry.stack = error.stack;
    }
    return entry;
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Get logs by context
   */
  getLogsByContext(context: string): LogEntry[] {
    return this.logs.filter((log) => log.context === context);
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Export logs
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get log statistics
   */
  getStatistics() {
    const stats = {
      total: this.logs.length,
      debug: this.logs.filter((l) => l.level === LogLevel.DEBUG).length,
      info: this.logs.filter((l) => l.level === LogLevel.INFO).length,
      warn: this.logs.filter((l) => l.level === LogLevel.WARN).length,
      error: this.logs.filter((l) => l.level === LogLevel.ERROR).length,
      critical: this.logs.filter((l) => l.level === LogLevel.CRITICAL).length,
    };
    return stats;
  }
}

// Create singleton instance
export const logger = new Logger();

/**
 * Initialize logging
 */
export const initializeLogging = () => {
  // Set up global error handler
  window.addEventListener('error', (event) => {
    logger.error(
      'Uncaught error',
      'global',
      {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      event.error
    );
  });

  // Set up unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', 'global', {
      reason: event.reason,
    });
  });

  logger.info('Logging initialized', 'system');
};

/**
 * Log performance metrics
 */
export const logPerformanceMetrics = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        logger.info(`Performance: ${entry.name}`, 'performance', {
          duration: entry.duration,
          startTime: entry.startTime,
        });
      }
    });

    observer.observe({
      entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'],
    });
  }
};

/**
 * Log memory usage
 */
export const logMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    logger.info('Memory usage', 'performance', {
      usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // MB
      totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576), // MB
      jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
    });
  }
};

/**
 * Log network requests
 */
export const logNetworkRequest = (
  method: string,
  url: string,
  status: number,
  duration: number,
  size?: number
) => {
  logger.info('Network request', 'network', {
    method,
    url,
    status,
    duration,
    size,
  });
};

/**
 * Log user action
 */
export const logUserAction = (action: string, data?: Record<string, any>) => {
  logger.info(`User action: ${action}`, 'user', data);
};

/**
 * Log component lifecycle
 */
export const logComponentLifecycle = (
  componentName: string,
  event: 'mount' | 'update' | 'unmount',
  data?: Record<string, any>
) => {
  logger.debug(`Component ${event}: ${componentName}`, 'component', data);
};

export default logger;
