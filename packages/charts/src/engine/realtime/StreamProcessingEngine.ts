/**
 * Stream Processing Engine
 * Process streaming data in real-time
 *
 * موتور پردازش جریان
 * پردازش داده های جریانی بلادرنگ
 */

import { EventEmitter } from 'events';

export interface StreamTransformation {
  id: string;
  name: string;
  type: 'map' | 'filter' | 'aggregate' | 'window' | 'join' | 'custom';
  config: Record<string, any>;
}

export interface StreamWindow {
  type: 'tumbling' | 'sliding' | 'session';
  size: number;
  slide?: number;
  timeout?: number;
}

export interface AggregationResult {
  timestamp: number;
  count: number;
  sum?: number;
  average?: number;
  min?: number;
  max?: number;
  values: any[];
}

export interface ProcessingMetrics {
  itemsProcessed: number;
  itemsFiltered: number;
  aggregations: number;
  averageProcessingTime: number;
  errors: number;
}

export class StreamProcessingEngine extends EventEmitter {
  private transformations: Map<string, StreamTransformation> = new Map();
  private windows: Map<string, any[]> = new Map();
  private aggregations: Map<string, AggregationResult> = new Map();
  private metrics: ProcessingMetrics = {
    itemsProcessed: 0,
    itemsFiltered: 0,
    aggregations: 0,
    averageProcessingTime: 0,
    errors: 0,
  };
  private processingTimes: number[] = [];

  constructor() {
    super();
  }

  /**
   * Add transformation
   */
  addTransformation(transformation: StreamTransformation): void {
    this.transformations.set(transformation.id, transformation);
    this.emit('transformation:added', transformation);
  }

  /**
   * Remove transformation
   */
  removeTransformation(transformationId: string): void {
    this.transformations.delete(transformationId);
    this.emit('transformation:removed', { transformationId });
  }

  /**
   * Process item through transformations
   */
  processItem(item: any): any {
    const startTime = Date.now();
    let result = item;

    try {
      for (const transformation of this.transformations.values()) {
        result = this.applyTransformation(result, transformation);

        if (result === null) {
          this.metrics.itemsFiltered++;
          this.emit('item:filtered', { item });
          return null;
        }
      }

      this.metrics.itemsProcessed++;
      const processingTime = Date.now() - startTime;
      this.processingTimes.push(processingTime);

      if (this.processingTimes.length > 100) {
        this.processingTimes.shift();
      }

      this.metrics.averageProcessingTime =
        this.processingTimes.reduce((a, b) => a + b, 0) / this.processingTimes.length;

      this.emit('item:processed', { item: result, processingTime });
      return result;
    } catch (error) {
      this.metrics.errors++;
      this.emit('processing:error', { error, item });
      return null;
    }
  }

  /**
   * Apply transformation
   */
  private applyTransformation(item: any, transformation: StreamTransformation): any {
    switch (transformation.type) {
      case 'map':
        return this.mapTransformation(item, transformation.config);

      case 'filter':
        return this.filterTransformation(item, transformation.config);

      case 'aggregate':
        return this.aggregateTransformation(item, transformation.config);

      case 'window':
        return this.windowTransformation(item, transformation.config);

      case 'join':
        return this.joinTransformation(item, transformation.config);

      case 'custom':
        return this.customTransformation(item, transformation.config);

      default:
        return item;
    }
  }

  /**
   * Map transformation
   */
  private mapTransformation(item: any, config: Record<string, any>): any {
    const { mapper } = config;
    if (typeof mapper === 'function') {
      return mapper(item);
    }

    // Simple field mapping
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(config)) {
      if (key !== 'mapper' && typeof value === 'string') {
        result[key] = item[value];
      }
    }

    return result;
  }

  /**
   * Filter transformation
   */
  private filterTransformation(item: any, config: Record<string, any>): any {
    const { predicate } = config;
    if (typeof predicate === 'function') {
      return predicate(item) ? item : null;
    }

    // Simple field-based filtering
    for (const [key, value] of Object.entries(config)) {
      if (key !== 'predicate' && item[key] !== value) {
        return null;
      }
    }

    return item;
  }

  /**
   * Aggregate transformation
   */
  private aggregateTransformation(item: any, config: Record<string, any>): any {
    const { field, operation, windowId } = config;
    const wId = windowId || 'default';

    if (!this.aggregations.has(wId)) {
      this.aggregations.set(wId, {
        timestamp: Date.now(),
        count: 0,
        values: [],
      });
    }

    const agg = this.aggregations.get(wId)!;
    const value = field ? item[field] : item;

    agg.count++;
    agg.values.push(value);

    if (typeof value === 'number') {
      agg.sum = (agg.sum || 0) + value;
      agg.average = agg.sum / agg.count;
      agg.min = Math.min(agg.min || value, value);
      agg.max = Math.max(agg.max || value, value);
    }

    this.metrics.aggregations++;
    this.emit('aggregation:updated', { windowId: wId, result: agg });

    return agg;
  }

  /**
   * Window transformation
   */
  private windowTransformation(item: any, config: Record<string, any>): any {
    const { windowId, windowConfig } = config;
    const wId = windowId || 'default';

    if (!this.windows.has(wId)) {
      this.windows.set(wId, []);
    }

    const window = this.windows.get(wId)!;
    window.push(item);

    // Check window size
    if (windowConfig.type === 'tumbling' && window.length >= windowConfig.size) {
      const result = [...window];
      this.windows.set(wId, []);
      this.emit('window:complete', { windowId: wId, items: result });
      return result;
    }

    return item;
  }

  /**
   * Join transformation
   */
  private joinTransformation(item: any, config: Record<string, any>): any {
    const { joinKey, otherStream } = config;

    // Simple join implementation
    if (otherStream && Array.isArray(otherStream)) {
      const joinedItem = otherStream.find((o) => o[joinKey] === item[joinKey]);
      if (joinedItem) {
        return { ...item, ...joinedItem };
      }
    }

    return item;
  }

  /**
   * Custom transformation
   */
  private customTransformation(item: any, config: Record<string, any>): any {
    const { transformer } = config;
    if (typeof transformer === 'function') {
      return transformer(item);
    }

    return item;
  }

  /**
   * Get metrics
   */
  getMetrics(): ProcessingMetrics {
    return { ...this.metrics };
  }

  /**
   * Get aggregation result
   */
  getAggregation(windowId: string): AggregationResult | null {
    return this.aggregations.get(windowId) || null;
  }

  /**
   * Get window data
   */
  getWindow(windowId: string): any[] {
    return this.windows.get(windowId) || [];
  }

  /**
   * Clear window
   */
  clearWindow(windowId: string): void {
    this.windows.delete(windowId);
    this.emit('window:cleared', { windowId });
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      itemsProcessed: 0,
      itemsFiltered: 0,
      aggregations: 0,
      averageProcessingTime: 0,
      errors: 0,
    };
    this.processingTimes = [];
    this.emit('metrics:reset', {});
  }

  /**
   * Get all transformations
   */
  getTransformations(): StreamTransformation[] {
    return Array.from(this.transformations.values());
  }

  /**
   * Create pipeline
   */
  createPipeline(transformations: StreamTransformation[]): string {
    const pipelineId = `pipeline-${Date.now()}`;

    for (const transformation of transformations) {
      this.addTransformation({
        ...transformation,
        id: `${pipelineId}-${transformation.id}`,
      });
    }

    this.emit('pipeline:created', { pipelineId, count: transformations.length });
    return pipelineId;
  }

  /**
   * Process batch
   */
  processBatch(items: any[]): any[] {
    return items.map((item) => this.processItem(item)).filter((item) => item !== null);
  }
}
