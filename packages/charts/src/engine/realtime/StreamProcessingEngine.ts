/**
 * Stream Processing Engine
 * Process streaming data with transformations, windowing, and aggregations
 */

export interface StreamWindow<T> {
  id: string;
  type: 'tumbling' | 'sliding' | 'session';
  size: number;
  stride?: number;
  timeout?: number;
  data: T[];
  startTime: Date;
  endTime?: Date;
}

export interface AggregationResult<T> {
  count: number;
  sum?: number;
  average?: number;
  min?: number;
  max?: number;
  values: T[];
}

export interface JoinResult<T, U> {
  left: T;
  right: U;
  timestamp: Date;
}

/**
 * StreamProcessingEngine - Process streaming data
 */
export class StreamProcessingEngine<T = unknown> {
  private windows: Map<string, StreamWindow<T>> = new Map();
  private transformers: Map<string, (data: T) => T> = new Map();
  private aggregators: Map<string, (data: T[]) => AggregationResult<T>> = new Map();
  private windowSequence: number = 0;

  /**
   * Create tumbling window
   */
  createTumblingWindow(size: number): string {
    const windowId = `window-${this.windowSequence++}`;
    const window: StreamWindow<T> = {
      id: windowId,
      type: 'tumbling',
      size,
      data: [],
      startTime: new Date(),
    };

    this.windows.set(windowId, window);
    return windowId;
  }

  /**
   * Create sliding window
   */
  createSlidingWindow(size: number, stride: number): string {
    const windowId = `window-${this.windowSequence++}`;
    const window: StreamWindow<T> = {
      id: windowId,
      type: 'sliding',
      size,
      stride,
      data: [],
      startTime: new Date(),
    };

    this.windows.set(windowId, window);
    return windowId;
  }

  /**
   * Create session window
   */
  createSessionWindow(timeout: number): string {
    const windowId = `window-${this.windowSequence++}`;
    const window: StreamWindow<T> = {
      id: windowId,
      type: 'session',
      size: 0,
      timeout,
      data: [],
      startTime: new Date(),
    };

    this.windows.set(windowId, window);
    return windowId;
  }

  /**
   * Add data to window
   */
  addToWindow(windowId: string, data: T): T[] | null {
    const window = this.windows.get(windowId);
    if (!window) {
      throw new Error(`Window ${windowId} not found`);
    }

    window.data.push(data);

    // Check if window is full
    if (window.type === 'tumbling' && window.data.length >= window.size) {
      const result = [...window.data];
      window.data = [];
      window.startTime = new Date();
      return result;
    }

    if (window.type === 'sliding' && window.data.length >= window.size) {
      const result = [...window.data];
      window.data = window.data.slice(window.stride || 1);
      return result;
    }

    return null;
  }

  /**
   * Transform data
   */
  transform(data: T, transformerId: string): T {
    const transformer = this.transformers.get(transformerId);
    if (!transformer) {
      throw new Error(`Transformer ${transformerId} not found`);
    }

    return transformer(data);
  }

  /**
   * Register transformer
   */
  registerTransformer(id: string, transformer: (data: T) => T): void {
    this.transformers.set(id, transformer);
  }

  /**
   * Aggregate window data
   */
  aggregate(windowId: string, aggregatorId?: string): AggregationResult<T> {
    const window = this.windows.get(windowId);
    if (!window) {
      throw new Error(`Window ${windowId} not found`);
    }

    if (aggregatorId) {
      const aggregator = this.aggregators.get(aggregatorId);
      if (!aggregator) {
        throw new Error(`Aggregator ${aggregatorId} not found`);
      }

      return aggregator(window.data);
    }

    // Default aggregation
    return this.defaultAggregate(window.data);
  }

  /**
   * Default aggregation
   */
  private defaultAggregate(data: T[]): AggregationResult<T> {
    const result: AggregationResult<T> = {
      count: data.length,
      values: data,
    };

    // Try numeric aggregation
    const numericValues = data
      .map((d) => {
        if (typeof d === 'number') return d;
        if (typeof d === 'object' && d !== null && 'value' in d) {
          return (d as Record<string, unknown>).value as number;
        }
        return null;
      })
      .filter((v) => v !== null) as number[];

    if (numericValues.length > 0) {
      result.sum = numericValues.reduce((a, b) => a + b, 0);
      result.average = result.sum / numericValues.length;
      result.min = Math.min(...numericValues);
      result.max = Math.max(...numericValues);
    }

    return result;
  }

  /**
   * Register aggregator
   */
  registerAggregator(id: string, aggregator: (data: T[]) => AggregationResult<T>): void {
    this.aggregators.set(id, aggregator);
  }

  /**
   * Join two streams
   */
  join<U>(
    leftData: T[],
    rightData: U[],
    joinKey: (left: T, right: U) => boolean
  ): JoinResult<T, U>[] {
    const results: JoinResult<T, U>[] = [];

    for (const left of leftData) {
      for (const right of rightData) {
        if (joinKey(left, right)) {
          results.push({
            left,
            right,
            timestamp: new Date(),
          });
        }
      }
    }

    return results;
  }

  /**
   * Filter stream
   */
  filter(data: T[], predicate: (item: T) => boolean): T[] {
    return data.filter(predicate);
  }

  /**
   * Map stream
   */
  map<U>(data: T[], mapper: (item: T) => U): U[] {
    return data.map(mapper);
  }

  /**
   * Reduce stream
   */
  reduce(data: T[], reducer: (acc: T, item: T) => T, initial: T): T {
    return data.reduce(reducer, initial);
  }

  /**
   * Get window
   */
  getWindow(windowId: string): StreamWindow<T> | undefined {
    return this.windows.get(windowId);
  }

  /**
   * Get all windows
   */
  getAllWindows(): StreamWindow<T>[] {
    return Array.from(this.windows.values());
  }

  /**
   * Close window
   */
  closeWindow(windowId: string): T[] {
    const window = this.windows.get(windowId);
    if (!window) {
      throw new Error(`Window ${windowId} not found`);
    }

    const data = [...window.data];
    window.endTime = new Date();

    return data;
  }

  /**
   * Delete window
   */
  deleteWindow(windowId: string): void {
    this.windows.delete(windowId);
  }

  /**
   * Get window statistics
   */
  getWindowStats(windowId: string): {
    id: string;
    type: string;
    size: number;
    dataCount: number;
    duration: number;
  } | null {
    const window = this.windows.get(windowId);
    if (!window) return null;

    const endTime = window.endTime || new Date();
    const duration = endTime.getTime() - window.startTime.getTime();

    return {
      id: window.id,
      type: window.type,
      size: window.size,
      dataCount: window.data.length,
      duration,
    };
  }

  /**
   * Clear all windows
   */
  clearWindows(): void {
    this.windows.clear();
  }

  /**
   * Get transformer count
   */
  getTransformerCount(): number {
    return this.transformers.size;
  }

  /**
   * Get aggregator count
   */
  getAggregatorCount(): number {
    return this.aggregators.size;
  }
}

export default StreamProcessingEngine;
