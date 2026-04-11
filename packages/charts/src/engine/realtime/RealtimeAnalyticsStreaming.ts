/**
 * Real-time Analytics Streaming
 * Streams analytics data in real-time
 */

/**
 * Stream event
 */
export interface StreamEvent<T = Record<string, unknown>> {
  id: string;
  timestamp: number;
  data: T;
  source: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Stream configuration
 */
export interface StreamConfig {
  batchSize: number;
  flushInterval: number;
  maxBufferSize: number;
  compression: boolean;
  encryption: boolean;
}

/**
 * Stream statistics
 */
export interface StreamStats {
  eventsProcessed: number;
  eventsBatched: number;
  averageLatency: number;
  peakThroughput: number;
  errorCount: number;
  lastUpdate: number;
}

/**
 * Real-time Analytics Streaming
 * Handles streaming of analytics data
 */
export class RealtimeAnalyticsStreaming {
  private streams: Map<string, StreamEvent[]> = new Map();
  private stats: Map<string, StreamStats> = new Map();
  private listeners: Map<string, Set<(event: StreamEvent) => void>> = new Map();
  private config: StreamConfig;

  constructor(config: Partial<StreamConfig> = {}) {
    this.config = {
      batchSize: 100,
      flushInterval: 1000,
      maxBufferSize: 10000,
      compression: false,
      encryption: false,
      ...config,
    };
  }

  /**
   * Create stream
   */
  createStream(streamId: string): void {
    if (!this.streams.has(streamId)) {
      this.streams.set(streamId, []);
      this.stats.set(streamId, {
        eventsProcessed: 0,
        eventsBatched: 0,
        averageLatency: 0,
        peakThroughput: 0,
        errorCount: 0,
        lastUpdate: Date.now(),
      });
      this.listeners.set(streamId, new Set());
    }
  }

  /**
   * Push event to stream
   */
  pushEvent<T extends Record<string, unknown>>(
    streamId: string,
    data: T,
    source: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): StreamEvent<T> {
    if (!this.streams.has(streamId)) {
      this.createStream(streamId);
    }

    const event: StreamEvent<T> = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      data,
      source,
      priority,
    };

    const buffer = this.streams.get(streamId)!;
    buffer.push(event);

    // Update stats
    const stat = this.stats.get(streamId)!;
    stat.eventsProcessed++;
    stat.lastUpdate = Date.now();

    // Notify listeners
    const listeners = this.listeners.get(streamId);
    if (listeners) {
      for (const listener of listeners) {
        listener(event);
      }
    }

    // Check if buffer needs flushing
    if (buffer.length >= this.config.batchSize) {
      this.flushStream(streamId);
    }

    return event;
  }

  /**
   * Flush stream buffer
   */
  flushStream(streamId: string): StreamEvent[] {
    const buffer = this.streams.get(streamId);
    if (!buffer || buffer.length === 0) {
      return [];
    }

    const events = [...buffer];
    buffer.length = 0;

    // Update stats
    const stat = this.stats.get(streamId)!;
    stat.eventsBatched += events.length;

    return events;
  }

  /**
   * Subscribe to stream
   */
  subscribe(streamId: string, listener: (event: StreamEvent) => void): () => void {
    if (!this.listeners.has(streamId)) {
      this.createStream(streamId);
    }

    const listeners = this.listeners.get(streamId)!;
    listeners.add(listener);

    // Return unsubscribe function
    return () => {
      listeners.delete(listener);
    };
  }

  /**
   * Get stream events
   */
  getStreamEvents(streamId: string, limit?: number): StreamEvent[] {
    const buffer = this.streams.get(streamId) || [];
    if (limit) {
      return buffer.slice(-limit);
    }
    return [...buffer];
  }

  /**
   * Get stream statistics
   */
  getStreamStats(streamId: string): StreamStats | undefined {
    return this.stats.get(streamId);
  }

  /**
   * Filter stream events
   */
  filterStreamEvents(streamId: string, predicate: (event: StreamEvent) => boolean): StreamEvent[] {
    const buffer = this.streams.get(streamId) || [];
    return buffer.filter(predicate);
  }

  /**
   * Aggregate stream events
   */
  aggregateStreamEvents<T extends Record<string, unknown>>(
    streamId: string,
    aggregator: (events: StreamEvent[]) => T
  ): T {
    const buffer = this.streams.get(streamId) || [];
    return aggregator(buffer);
  }

  /**
   * Get high priority events
   */
  getHighPriorityEvents(streamId: string): StreamEvent[] {
    const buffer = this.streams.get(streamId) || [];
    return buffer.filter((e) => e.priority === 'high' || e.priority === 'critical');
  }

  /**
   * Clear stream
   */
  clearStream(streamId: string): void {
    const buffer = this.streams.get(streamId);
    if (buffer) {
      buffer.length = 0;
    }
  }

  /**
   * Delete stream
   */
  deleteStream(streamId: string): boolean {
    this.streams.delete(streamId);
    this.stats.delete(streamId);
    this.listeners.delete(streamId);
    return true;
  }

  /**
   * Get all streams
   */
  getAllStreams(): string[] {
    return Array.from(this.streams.keys());
  }

  /**
   * Get all statistics
   */
  getAllStats(): Record<string, StreamStats> {
    const result: Record<string, StreamStats> = {};
    for (const [streamId, stat] of this.stats) {
      result[streamId] = stat;
    }
    return result;
  }
}
