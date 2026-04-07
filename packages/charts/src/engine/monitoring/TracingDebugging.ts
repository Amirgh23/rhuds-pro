/**
 * Tracing & Debugging
 * سیستم ردیابی و اشکال‌زدایی برای تحلیل عملکرد
 *
 * Features:
 * - Request tracing
 * - Performance tracing
 * - Error tracking
 * - Debug mode
 */

export interface Span {
  id: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'pending' | 'success' | 'error';
  tags: Record<string, any>;
  logs: SpanLog[];
}

export interface SpanLog {
  timestamp: number;
  message: string;
  level: 'debug' | 'info' | 'warn' | 'error';
}

export interface Trace {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  spans: Span[];
  status: 'pending' | 'success' | 'error';
}

export interface DebugInfo {
  enabled: boolean;
  level: 'verbose' | 'normal' | 'minimal';
  breakpoints: Map<string, boolean>;
  watchExpressions: Map<string, any>;
}

export class TracingDebugging {
  private traces: Map<string, Trace>;
  private spans: Map<string, Span>;
  private currentTraceId: string | null;
  private currentSpanId: string | null;
  private debugInfo: DebugInfo;
  private stats: {
    tracesCreated: number;
    spansCreated: number;
    errorsTracked: number;
    debugSessions: number;
  };

  constructor() {
    this.traces = new Map();
    this.spans = new Map();
    this.currentTraceId = null;
    this.currentSpanId = null;
    this.debugInfo = {
      enabled: false,
      level: 'normal',
      breakpoints: new Map(),
      watchExpressions: new Map(),
    };
    this.stats = {
      tracesCreated: 0,
      spansCreated: 0,
      errorsTracked: 0,
      debugSessions: 0,
    };
  }

  /**
   * Start trace
   */
  public startTrace(): string {
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const trace: Trace = {
      id: traceId,
      startTime: Date.now(),
      spans: [],
      status: 'pending',
    };

    this.traces.set(traceId, trace);
    this.currentTraceId = traceId;
    this.stats.tracesCreated++;

    return traceId;
  }

  /**
   * Start span
   */
  public startSpan(name: string, tags: Record<string, any> = {}): string {
    if (!this.currentTraceId) {
      this.startTrace();
    }

    const spanId = `span-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const parentSpanId = this.currentSpanId;

    const span: Span = {
      id: spanId,
      traceId: this.currentTraceId!,
      parentSpanId,
      name,
      startTime: Date.now(),
      status: 'pending',
      tags,
      logs: [],
    };

    this.spans.set(spanId, span);

    const trace = this.traces.get(this.currentTraceId!);
    if (trace) {
      trace.spans.push(span);
    }

    this.currentSpanId = spanId;
    this.stats.spansCreated++;

    return spanId;
  }

  /**
   * End span
   */
  public endSpan(spanId: string, status: 'success' | 'error' = 'success'): void {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;
    span.status = status;

    if (this.currentSpanId === spanId) {
      this.currentSpanId = span.parentSpanId || null;
    }
  }

  /**
   * Add span log
   */
  public addSpanLog(
    spanId: string,
    message: string,
    level: 'debug' | 'info' | 'warn' | 'error' = 'info'
  ): void {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.logs.push({
      timestamp: Date.now(),
      message,
      level,
    });
  }

  /**
   * End trace
   */
  public endTrace(traceId: string, status: 'success' | 'error' = 'success'): void {
    const trace = this.traces.get(traceId);
    if (!trace) return;

    trace.endTime = Date.now();
    trace.duration = trace.endTime - trace.startTime;
    trace.status = status;

    if (this.currentTraceId === traceId) {
      this.currentTraceId = null;
      this.currentSpanId = null;
    }
  }

  /**
   * Track error
   */
  public trackError(error: Error, context?: Record<string, any>): string {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    if (this.currentSpanId) {
      this.addSpanLog(this.currentSpanId, error.message, 'error');
    }

    this.stats.errorsTracked++;

    return errorId;
  }

  /**
   * Enable debug mode
   */
  public enableDebugMode(level: 'verbose' | 'normal' | 'minimal' = 'normal'): void {
    this.debugInfo.enabled = true;
    this.debugInfo.level = level;
    this.stats.debugSessions++;
  }

  /**
   * Disable debug mode
   */
  public disableDebugMode(): void {
    this.debugInfo.enabled = false;
  }

  /**
   * Set breakpoint
   */
  public setBreakpoint(location: string): void {
    this.debugInfo.breakpoints.set(location, true);
  }

  /**
   * Remove breakpoint
   */
  public removeBreakpoint(location: string): void {
    this.debugInfo.breakpoints.delete(location);
  }

  /**
   * Add watch expression
   */
  public addWatchExpression(name: string, expression: any): void {
    this.debugInfo.watchExpressions.set(name, expression);
  }

  /**
   * Get trace
   */
  public getTrace(traceId: string): Trace | undefined {
    return this.traces.get(traceId);
  }

  /**
   * Get span
   */
  public getSpan(spanId: string): Span | undefined {
    return this.spans.get(spanId);
  }

  /**
   * Get trace statistics
   */
  public getTraceStats(traceId: string) {
    const trace = this.traces.get(traceId);
    if (!trace) return null;

    const totalDuration = trace.duration || 0;
    const spanCount = trace.spans.length;
    const errorCount = trace.spans.filter((s) => s.status === 'error').length;

    return {
      traceId,
      totalDuration,
      spanCount,
      errorCount,
      status: trace.status,
    };
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      totalTraces: this.traces.size,
      totalSpans: this.spans.size,
      debugEnabled: this.debugInfo.enabled,
      breakpointCount: this.debugInfo.breakpoints.size,
    };
  }
}
