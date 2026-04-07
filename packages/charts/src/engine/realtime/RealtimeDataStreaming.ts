/**
 * Real-Time Data Streaming
 * Stream data from multiple sources with buffering and backpressure handling
 *
 * جریان داده های بلادرنگ
 * جریان داده از منابع متعدد با بافرینگ و مدیریت فشار
 */

import { EventEmitter } from 'events';

export interface StreamSource {
  id: string;
  name: string;
  type: 'http' | 'websocket' | 'mqtt' | 'kafka' | 'custom';
  url?: string;
  config?: Record<string, any>;
}

export interface StreamData {
  sourceId: string;
  timestamp: number;
  data: any;
  metadata?: Record<string, any>;
}

export interface StreamBuffer {
  sourceId: string;
  data: StreamData[];
  size: number;
  maxSize: number;
  overflow: number;
}

export interface StreamMetrics {
  sourceId: string;
  messagesReceived: number;
  messagesProcessed: number;
  messagesDropped: number;
  averageLatency: number;
  currentThroughput: number;
  bufferUtilization: number;
}

export class RealtimeDataStreaming extends EventEmitter {
  private sources: Map<string, StreamSource> = new Map();
  private buffers: Map<string, StreamBuffer> = new Map();
  private metrics: Map<string, StreamMetrics> = new Map();
  private activeStreams: Set<string> = new Set();
  private backpressureThreshold: number = 0.8;
  private bufferSize: number = 1000;

  constructor() {
    super();
  }

  /**
   * Register a data source
   */
  registerSource(source: StreamSource): void {
    this.sources.set(source.id, source);
    this.buffers.set(source.id, {
      sourceId: source.id,
      data: [],
      size: 0,
      maxSize: this.bufferSize,
      overflow: 0,
    });
    this.metrics.set(source.id, {
      sourceId: source.id,
      messagesReceived: 0,
      messagesProcessed: 0,
      messagesDropped: 0,
      averageLatency: 0,
      currentThroughput: 0,
      bufferUtilization: 0,
    });

    this.emit('source:registered', source);
  }

  /**
   * Start streaming from a source
   */
  startStream(sourceId: string): void {
    const source = this.sources.get(sourceId);
    if (!source) throw new Error(`Source ${sourceId} not found`);

    this.activeStreams.add(sourceId);
    this.emit('stream:started', { sourceId, source });
  }

  /**
   * Stop streaming from a source
   */
  stopStream(sourceId: string): void {
    this.activeStreams.delete(sourceId);
    this.emit('stream:stopped', { sourceId });
  }

  /**
   * Add data to stream
   */
  addData(sourceId: string, data: any, metadata?: Record<string, any>): boolean {
    const source = this.sources.get(sourceId);
    if (!source) throw new Error(`Source ${sourceId} not found`);

    const buffer = this.buffers.get(sourceId);
    if (!buffer) throw new Error(`Buffer for ${sourceId} not found`);

    const streamData: StreamData = {
      sourceId,
      timestamp: Date.now(),
      data,
      metadata,
    };

    // Check backpressure
    const utilization = buffer.size / buffer.maxSize;
    if (utilization > this.backpressureThreshold) {
      this.emit('backpressure:warning', { sourceId, utilization });

      // Drop oldest data if buffer is full
      if (buffer.size >= buffer.maxSize) {
        buffer.data.shift();
        buffer.overflow++;
        const metrics = this.metrics.get(sourceId);
        if (metrics) metrics.messagesDropped++;
        this.emit('data:dropped', { sourceId });
        return false;
      }
    }

    buffer.data.push(streamData);
    buffer.size++;

    // Update metrics
    const metrics = this.metrics.get(sourceId);
    if (metrics) {
      metrics.messagesReceived++;
      metrics.bufferUtilization = utilization;
    }

    this.emit('data:received', { sourceId, size: buffer.size });
    return true;
  }

  /**
   * Get buffered data
   */
  getBufferedData(sourceId: string, limit?: number): StreamData[] {
    const buffer = this.buffers.get(sourceId);
    if (!buffer) throw new Error(`Buffer for ${sourceId} not found`);

    const data = limit ? buffer.data.slice(-limit) : [...buffer.data];

    // Update metrics
    const metrics = this.metrics.get(sourceId);
    if (metrics) {
      metrics.messagesProcessed += data.length;
    }

    return data;
  }

  /**
   * Clear buffer
   */
  clearBuffer(sourceId: string): void {
    const buffer = this.buffers.get(sourceId);
    if (!buffer) throw new Error(`Buffer for ${sourceId} not found`);

    const clearedSize = buffer.size;
    buffer.data = [];
    buffer.size = 0;

    this.emit('buffer:cleared', { sourceId, clearedSize });
  }

  /**
   * Handle backpressure
   */
  handleBackpressure(sourceId: string): void {
    const buffer = this.buffers.get(sourceId);
    if (!buffer) return;

    // Reduce buffer size by 50%
    const newSize = Math.ceil(buffer.data.length / 2);
    buffer.data = buffer.data.slice(-newSize);
    buffer.size = newSize;

    this.emit('backpressure:handled', { sourceId, newSize });
  }

  /**
   * Validate data
   */
  validateData(data: any, schema?: Record<string, any>): boolean {
    if (!data) return false;

    if (schema) {
      for (const key of Object.keys(schema)) {
        if (!(key in data)) return false;
      }
    }

    return true;
  }

  /**
   * Transform data
   */
  transformData(data: any, transformer: (d: any) => any): any {
    try {
      return transformer(data);
    } catch (error) {
      this.emit('transform:error', { error, data });
      return null;
    }
  }

  /**
   * Get stream metrics
   */
  getMetrics(sourceId: string): StreamMetrics | null {
    return this.metrics.get(sourceId) || null;
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): StreamMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Set buffer size
   */
  setBufferSize(sourceId: string, size: number): void {
    const buffer = this.buffers.get(sourceId);
    if (!buffer) throw new Error(`Buffer for ${sourceId} not found`);

    buffer.maxSize = size;
    this.emit('buffer:resized', { sourceId, size });
  }

  /**
   * Set backpressure threshold
   */
  setBackpressureThreshold(threshold: number): void {
    this.backpressureThreshold = Math.max(0, Math.min(1, threshold));
    this.emit('backpressure:threshold-changed', { threshold: this.backpressureThreshold });
  }

  /**
   * Get active streams
   */
  getActiveStreams(): string[] {
    return Array.from(this.activeStreams);
  }

  /**
   * Get source info
   */
  getSourceInfo(sourceId: string): StreamSource | null {
    return this.sources.get(sourceId) || null;
  }

  /**
   * Get all sources
   */
  getAllSources(): StreamSource[] {
    return Array.from(this.sources.values());
  }

  /**
   * Error recovery
   */
  recoverFromError(sourceId: string): void {
    const buffer = this.buffers.get(sourceId);
    if (buffer) {
      buffer.overflow = 0;
    }

    this.emit('stream:recovered', { sourceId });
  }
}
