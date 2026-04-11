/**
 * Real-Time Data Streaming System
 * Stream data from multiple sources with buffering and error recovery
 */

export interface StreamSource<T> {
  id: string;
  name: string;
  type: 'api' | 'websocket' | 'file' | 'database' | 'custom';
  url?: string;
  config?: Record<string, unknown>;
}

export interface StreamData<T> {
  id: string;
  sourceId: string;
  timestamp: Date;
  data: T;
  sequence: number;
  metadata?: Record<string, unknown>;
}

export interface StreamBuffer<T> {
  sourceId: string;
  data: StreamData<T>[];
  maxSize: number;
  overflow: number;
}

export interface StreamMetrics {
  sourceId: string;
  itemsReceived: number;
  itemsProcessed: number;
  itemsDropped: number;
  averageLatency: number;
  errors: number;
  lastUpdate: Date;
}

/**
 * RealtimeDataStreaming - Stream data from multiple sources
 */
export class RealtimeDataStreaming<T = unknown> {
  private sources: Map<string, StreamSource<T>> = new Map();
  private buffers: Map<string, StreamBuffer<T>> = new Map();
  private metrics: Map<string, StreamMetrics> = new Map();
  private listeners: Map<string, Set<(data: StreamData<T>) => void>> = new Map();
  private errorHandlers: Map<string, Set<(error: Error) => void>> = new Map();
  private sequence: number = 0;

  /**
   * Register a data source
   */
  registerSource(source: StreamSource<T>): void {
    this.sources.set(source.id, source);
    this.buffers.set(source.id, {
      sourceId: source.id,
      data: [],
      maxSize: 1000,
      overflow: 0,
    });
    this.metrics.set(source.id, {
      sourceId: source.id,
      itemsReceived: 0,
      itemsProcessed: 0,
      itemsDropped: 0,
      averageLatency: 0,
      errors: 0,
      lastUpdate: new Date(),
    });
  }

  /**
   * Ingest data from a source
   */
  ingestData(sourceId: string, data: T, metadata?: Record<string, unknown>): void {
    const source = this.sources.get(sourceId);
    if (!source) throw new Error(`Source ${sourceId} not found`);

    const buffer = this.buffers.get(sourceId);
    if (!buffer) throw new Error(`Buffer for source ${sourceId} not found`);

    const streamData: StreamData<T> = {
      id: `${sourceId}-${this.sequence++}`,
      sourceId,
      timestamp: new Date(),
      data,
      sequence: this.sequence,
      metadata,
    };

    // Handle backpressure
    if (buffer.data.length >= buffer.maxSize) {
      buffer.overflow++;
      buffer.data.shift(); // Remove oldest item
    }

    buffer.data.push(streamData);

    // Update metrics
    const metrics = this.metrics.get(sourceId);
    if (metrics) {
      metrics.itemsReceived++;
      metrics.lastUpdate = new Date();
    }

    // Notify listeners
    this.notifyListeners(sourceId, streamData);
  }

  /**
   * Subscribe to data from a source
   */
  subscribe(sourceId: string, callback: (data: StreamData<T>) => void): () => void {
    if (!this.listeners.has(sourceId)) {
      this.listeners.set(sourceId, new Set());
    }

    this.listeners.get(sourceId)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(sourceId)?.delete(callback);
    };
  }

  /**
   * Subscribe to errors from a source
   */
  onError(sourceId: string, callback: (error: Error) => void): () => void {
    if (!this.errorHandlers.has(sourceId)) {
      this.errorHandlers.set(sourceId, new Set());
    }

    this.errorHandlers.get(sourceId)!.add(callback);

    return () => {
      this.errorHandlers.get(sourceId)?.delete(callback);
    };
  }

  /**
   * Get buffered data
   */
  getBufferedData(sourceId: string, limit?: number): StreamData<T>[] {
    const buffer = this.buffers.get(sourceId);
    if (!buffer) return [];

    if (limit) {
      return buffer.data.slice(-limit);
    }

    return [...buffer.data];
  }

  /**
   * Clear buffer
   */
  clearBuffer(sourceId: string): void {
    const buffer = this.buffers.get(sourceId);
    if (buffer) {
      buffer.data = [];
    }
  }

  /**
   * Set buffer size
   */
  setBufferSize(sourceId: string, size: number): void {
    const buffer = this.buffers.get(sourceId);
    if (buffer) {
      buffer.maxSize = size;
    }
  }

  /**
   * Get metrics for a source
   */
  getMetrics(sourceId: string): StreamMetrics | undefined {
    return this.metrics.get(sourceId);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): StreamMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Handle error
   */
  handleError(sourceId: string, error: Error): void {
    const metrics = this.metrics.get(sourceId);
    if (metrics) {
      metrics.errors++;
    }

    const handlers = this.errorHandlers.get(sourceId);
    if (handlers) {
      handlers.forEach((handler) => handler(error));
    }
  }

  /**
   * Validate data
   */
  validateData(data: T, schema?: Record<string, unknown>): boolean {
    if (!schema) return true;

    // Simple validation - can be extended
    if (typeof data !== 'object' || data === null) {
      return false;
    }

    return true;
  }

  /**
   * Transform data
   */
  transformData(data: T, transformer: (data: T) => T): T {
    try {
      return transformer(data);
    } catch (error) {
      throw new Error(`Data transformation failed: ${error}`);
    }
  }

  /**
   * Notify listeners
   */
  private notifyListeners(sourceId: string, data: StreamData<T>): void {
    const listeners = this.listeners.get(sourceId);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          this.handleError(sourceId, error as Error);
        }
      });
    }

    // Update processed count
    const metrics = this.metrics.get(sourceId);
    if (metrics) {
      metrics.itemsProcessed++;
    }
  }

  /**
   * Get source
   */
  getSource(sourceId: string): StreamSource<T> | undefined {
    return this.sources.get(sourceId);
  }

  /**
   * Get all sources
   */
  getAllSources(): StreamSource<T>[] {
    return Array.from(this.sources.values());
  }

  /**
   * Remove source
   */
  removeSource(sourceId: string): void {
    this.sources.delete(sourceId);
    this.buffers.delete(sourceId);
    this.metrics.delete(sourceId);
    this.listeners.delete(sourceId);
    this.errorHandlers.delete(sourceId);
  }

  /**
   * Get buffer statistics
   */
  getBufferStats(sourceId: string): {
    size: number;
    maxSize: number;
    overflow: number;
    utilization: number;
  } | null {
    const buffer = this.buffers.get(sourceId);
    if (!buffer) return null;

    return {
      size: buffer.data.length,
      maxSize: buffer.maxSize,
      overflow: buffer.overflow,
      utilization: buffer.data.length / buffer.maxSize,
    };
  }
}

export default RealtimeDataStreaming;
