/**
 * Distributed Tracing
 * ردیابی توزیع شده برای تجزیه و تحلیل درخواست‌ها
 *
 * Features:
 * - Request correlation
 * - Span collection
 * - Trace visualization
 * - Performance analysis
 */

import { EventEmitter } from 'events';

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  serviceName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'pending' | 'success' | 'error';
  tags: Record<string, any>;
  logs: Array<{ timestamp: number; message: string; level: string }>;
  error?: Error;
}

export interface Trace {
  traceId: string;
  spans: Span[];
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'pending' | 'success' | 'error';
}

export interface TracingConfig {
  samplingRate: number;
  maxSpansPerTrace: number;
  maxLogSize: number;
  retentionTime: number;
}

export interface SpanContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
}

export class DistributedTracing extends EventEmitter {
  private config: TracingConfig;
  private traces: Map<string, Trace>;
  private activeSpans: Map<string, Span>;
  private spanStack: Span[];
  private stats: {
    tracesCreated: number;
    spansCreated: number;
    tracesCompleted: number;
    errors: number;
  };

  constructor(config: TracingConfig) {
    super();
    this.config = config;
    this.traces = new Map();
    this.activeSpans = new Map();
    this.spanStack = [];
    this.stats = {
      tracesCreated: 0,
      spansCreated: 0,
      tracesCompleted: 0,
      errors: 0,
    };

    this.initialize();
  }

  private initialize(): void {
    this.startCleanup();
    this.emit('initialized', { samplingRate: this.config.samplingRate });
  }

  /**
   * Start a new trace
   */
  public startTrace(): string {
    if (Math.random() > this.config.samplingRate) {
      return '';
    }

    const traceId = this.generateTraceId();
    const trace: Trace = {
      traceId,
      spans: [],
      startTime: Date.now(),
      status: 'pending',
    };

    this.traces.set(traceId, trace);
    this.stats.tracesCreated++;

    this.emit('trace-started', { traceId });
    return traceId;
  }

  /**
   * Start a new span
   */
  public startSpan(
    traceId: string,
    operationName: string,
    serviceName: string,
    parentSpanId?: string
  ): string {
    const spanId = this.generateSpanId();
    const span: Span = {
      traceId,
      spanId,
      parentSpanId,
      operationName,
      serviceName,
      startTime: Date.now(),
      status: 'pending',
      tags: {},
      logs: [],
    };

    const trace = this.traces.get(traceId);
    if (trace && trace.spans.length < this.config.maxSpansPerTrace) {
      trace.spans.push(span);
    }

    this.activeSpans.set(spanId, span);
    this.spanStack.push(span);
    this.stats.spansCreated++;

    this.emit('span-started', {
      traceId,
      spanId,
      operationName,
      serviceName,
    });

    return spanId;
  }

  /**
   * End a span
   */
  public endSpan(spanId: string, status: 'success' | 'error' = 'success', error?: Error): void {
    const span = this.activeSpans.get(spanId);

    if (!span) {
      return;
    }

    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;
    span.status = status;

    if (error) {
      span.error = error;
      this.stats.errors++;
    }

    this.activeSpans.delete(spanId);

    if (this.spanStack.length > 0 && this.spanStack[this.spanStack.length - 1].spanId === spanId) {
      this.spanStack.pop();
    }

    this.emit('span-ended', {
      traceId: span.traceId,
      spanId,
      duration: span.duration,
      status,
    });
  }

  /**
   * Add tag to current span
   */
  public addTag(key: string, value: any): void {
    const currentSpan = this.spanStack[this.spanStack.length - 1];

    if (currentSpan) {
      currentSpan.tags[key] = value;
    }
  }

  /**
   * Add log to current span
   */
  public addLog(message: string, level: string = 'info'): void {
    const currentSpan = this.spanStack[this.spanStack.length - 1];

    if (currentSpan && currentSpan.logs.length < this.config.maxLogSize) {
      currentSpan.logs.push({
        timestamp: Date.now(),
        message,
        level,
      });
    }
  }

  /**
   * Get span context for propagation
   */
  public getSpanContext(): SpanContext | null {
    const currentSpan = this.spanStack[this.spanStack.length - 1];

    if (!currentSpan) {
      return null;
    }

    return {
      traceId: currentSpan.traceId,
      spanId: currentSpan.spanId,
      parentSpanId: currentSpan.parentSpanId,
    };
  }

  /**
   * Extract span context from headers
   */
  public extractSpanContext(headers: Record<string, string>): SpanContext | null {
    const traceId = headers['x-trace-id'];
    const spanId = headers['x-span-id'];
    const parentSpanId = headers['x-parent-span-id'];

    if (!traceId || !spanId) {
      return null;
    }

    return {
      traceId,
      spanId,
      parentSpanId,
    };
  }

  /**
   * Inject span context into headers
   */
  public injectSpanContext(headers: Record<string, string>): void {
    const context = this.getSpanContext();

    if (context) {
      headers['x-trace-id'] = context.traceId;
      headers['x-span-id'] = context.spanId;
      if (context.parentSpanId) {
        headers['x-parent-span-id'] = context.parentSpanId;
      }
    }
  }

  /**
   * Complete a trace
   */
  public completeTrace(traceId: string, status: 'success' | 'error' = 'success'): void {
    const trace = this.traces.get(traceId);

    if (!trace) {
      return;
    }

    trace.endTime = Date.now();
    trace.duration = trace.endTime - trace.startTime;
    trace.status = status;

    this.stats.tracesCompleted++;

    this.emit('trace-completed', {
      traceId,
      duration: trace.duration,
      spanCount: trace.spans.length,
      status,
    });
  }

  /**
   * Get trace
   */
  public getTrace(traceId: string): Trace | undefined {
    return this.traces.get(traceId);
  }

  /**
   * Get trace with visualization data
   */
  public getTraceVisualization(traceId: string) {
    const trace = this.traces.get(traceId);

    if (!trace) {
      return null;
    }

    const spansByService = new Map<string, Span[]>();

    for (const span of trace.spans) {
      if (!spansByService.has(span.serviceName)) {
        spansByService.set(span.serviceName, []);
      }
      spansByService.get(span.serviceName)!.push(span);
    }

    const timeline = trace.spans
      .sort((a, b) => a.startTime - b.startTime)
      .map((span) => ({
        spanId: span.spanId,
        operationName: span.operationName,
        serviceName: span.serviceName,
        startTime: span.startTime,
        duration: span.duration || 0,
        status: span.status,
      }));

    return {
      traceId,
      duration: trace.duration,
      spanCount: trace.spans.length,
      serviceCount: spansByService.size,
      timeline,
      services: Array.from(spansByService.keys()),
    };
  }

  /**
   * Analyze trace performance
   */
  public analyzeTrace(traceId: string) {
    const trace = this.traces.get(traceId);

    if (!trace) {
      return null;
    }

    const analysis = {
      totalDuration: trace.duration || 0,
      spanCount: trace.spans.length,
      errorCount: trace.spans.filter((s) => s.status === 'error').length,
      slowestSpan: null as Span | null,
      fastestSpan: null as Span | null,
      averageSpanDuration: 0,
      criticalPath: [] as Span[],
    };

    let totalDuration = 0;
    let slowestDuration = 0;
    let fastestDuration = Infinity;

    for (const span of trace.spans) {
      const duration = span.duration || 0;
      totalDuration += duration;

      if (duration > slowestDuration) {
        slowestDuration = duration;
        analysis.slowestSpan = span;
      }

      if (duration < fastestDuration) {
        fastestDuration = duration;
        analysis.fastestSpan = span;
      }
    }

    analysis.averageSpanDuration = totalDuration / trace.spans.length;

    // Calculate critical path
    const rootSpans = trace.spans.filter((s) => !s.parentSpanId);
    for (const span of rootSpans) {
      analysis.criticalPath.push(span);
    }

    return analysis;
  }

  /**
   * Start cleanup timer
   */
  private startCleanup(): void {
    setInterval(() => {
      this.cleanupOldTraces();
    }, 60000); // Every minute
  }

  /**
   * Cleanup old traces
   */
  private cleanupOldTraces(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [traceId, trace] of this.traces) {
      if (trace.endTime && now - trace.endTime > this.config.retentionTime) {
        toDelete.push(traceId);
      }
    }

    for (const traceId of toDelete) {
      this.traces.delete(traceId);
    }

    if (toDelete.length > 0) {
      this.emit('traces-cleaned', { count: toDelete.length });
    }
  }

  /**
   * Generate trace ID
   */
  private generateTraceId(): string {
    return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate span ID
   */
  private generateSpanId(): string {
    return `span-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      activeTraces: this.traces.size,
      activeSpans: this.activeSpans.size,
    };
  }
}
