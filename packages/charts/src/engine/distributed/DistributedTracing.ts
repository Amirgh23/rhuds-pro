/**
 * Distributed Tracing
 * Request correlation, span collection, and trace visualization
 */

export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Record<string, unknown>;
  logs: Array<{ timestamp: number; message: string }>;
  status: 'pending' | 'success' | 'error';
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
  maxSpans: number;
  exportInterval: number;
}

/**
 * DistributedTracing - Request tracing and analysis
 */
export class DistributedTracing {
  private traces: Map<string, Trace> = new Map();
  private spans: Map<string, Span> = new Map();
  private config: TracingConfig;
  private listeners: Set<(event: string, data: unknown) => void> = new Set();
  private stats = {
    tracesCreated: 0,
    spansCreated: 0,
    tracesCompleted: 0,
    errors: 0,
  };

  constructor(config: TracingConfig = { samplingRate: 0.1, maxSpans: 1000, exportInterval: 5000 }) {
    this.config = config;
  }

  /**
   * Start trace
   */
  startTrace(traceId?: string): string {
    const id = traceId || `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const trace: Trace = {
      traceId: id,
      spans: [],
      startTime: Date.now(),
      status: 'pending',
    };

    this.traces.set(id, trace);
    this.stats.tracesCreated++;
    this.emit('trace_started', trace);

    return id;
  }

  /**
   * Start span
   */
  startSpan(traceId: string, operationName: string, parentSpanId?: string): string {
    const spanId = `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const span: Span = {
      traceId,
      spanId,
      parentSpanId,
      operationName,
      startTime: Date.now(),
      tags: {},
      logs: [],
      status: 'pending',
    };

    this.spans.set(spanId, span);

    const trace = this.traces.get(traceId);
    if (trace) {
      trace.spans.push(span);
    }

    this.stats.spansCreated++;
    this.emit('span_started', span);

    return spanId;
  }

  /**
   * End span
   */
  endSpan(spanId: string, status: 'success' | 'error' = 'success'): void {
    const span = this.spans.get(spanId);

    if (!span) {
      return;
    }

    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;
    span.status = status;

    if (status === 'error') {
      this.stats.errors++;
    }

    this.emit('span_ended', span);

    // Check if trace is complete
    const trace = this.traces.get(span.traceId);
    if (trace) {
      this.checkTraceCompletion(trace);
    }
  }

  /**
   * Add tag to span
   */
  addTag(spanId: string, key: string, value: unknown): void {
    const span = this.spans.get(spanId);

    if (span) {
      span.tags[key] = value;
      this.emit('tag_added', { spanId, key, value });
    }
  }

  /**
   * Add log to span
   */
  addLog(spanId: string, message: string): void {
    const span = this.spans.get(spanId);

    if (span) {
      span.logs.push({
        timestamp: Date.now(),
        message,
      });

      this.emit('log_added', { spanId, message });
    }
  }

  /**
   * Check trace completion
   */
  private checkTraceCompletion(trace: Trace): void {
    const allSpansEnded = trace.spans.every((s) => s.endTime);

    if (allSpansEnded && trace.spans.length > 0) {
      trace.endTime = Math.max(...trace.spans.map((s) => s.endTime || 0));
      trace.duration = trace.endTime - trace.startTime;
      trace.status = trace.spans.some((s) => s.status === 'error') ? 'error' : 'success';

      this.stats.tracesCompleted++;
      this.emit('trace_completed', trace);
    }
  }

  /**
   * Get trace
   */
  getTrace(traceId: string): Trace | null {
    return this.traces.get(traceId) ?? null;
  }

  /**
   * Get span
   */
  getSpan(spanId: string): Span | null {
    return this.spans.get(spanId) ?? null;
  }

  /**
   * Analyze trace performance
   */
  analyzeTracePerformance(traceId: string): {
    totalDuration: number;
    spanCount: number;
    criticalPath: number;
    slowestSpan: Span | null;
  } | null {
    const trace = this.traces.get(traceId);

    if (!trace || trace.spans.length === 0) {
      return null;
    }

    const totalDuration = trace.duration || 0;
    const slowestSpan = trace.spans.reduce((max, span) => {
      const spanDuration = span.duration || 0;
      const maxDuration = max.duration || 0;
      return spanDuration > maxDuration ? span : max;
    });

    // Calculate critical path (longest chain of dependent spans)
    let criticalPath = 0;
    for (const span of trace.spans) {
      let pathLength = span.duration || 0;
      let current = span;

      while (current.parentSpanId) {
        const parent = this.spans.get(current.parentSpanId);
        if (parent) {
          pathLength += parent.duration || 0;
          current = parent;
        } else {
          break;
        }
      }

      criticalPath = Math.max(criticalPath, pathLength);
    }

    return {
      totalDuration,
      spanCount: trace.spans.length,
      criticalPath,
      slowestSpan,
    };
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      ...this.stats,
      activeTraces: this.traces.size,
      activeSpans: this.spans.size,
      errorRate: this.stats.errors / (this.stats.spansCreated || 1),
    };
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (error) {
        // Handle listener error
      }
    }
  }

  /**
   * Add listener
   */
  addListener(listener: (event: string, data: unknown) => void): void {
    this.listeners.add(listener);
  }

  /**
   * Remove listener
   */
  removeListener(listener: (event: string, data: unknown) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Export traces
   */
  exportTraces(): Trace[] {
    return Array.from(this.traces.values());
  }

  /**
   * Clear old traces
   */
  clearOldTraces(maxAge: number = 3600000): number {
    const now = Date.now();
    let cleared = 0;

    for (const [traceId, trace] of this.traces.entries()) {
      if (now - trace.startTime > maxAge) {
        this.traces.delete(traceId);
        cleared++;
      }
    }

    return cleared;
  }
}
