/**
 * Data Aggregation System
 * Group by, aggregate functions, and time-based aggregation
 */

export type AggregateFunction = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'median' | 'stddev';

export interface AggregationConfig {
  groupBy?: string | string[];
  aggregations: Array<{
    field: string;
    function: AggregateFunction;
    alias?: string;
  }>;
  timeField?: string;
  timeBucket?: 'hour' | 'day' | 'week' | 'month' | 'year';
}

export interface AggregationResult {
  groups: Record<string, any>;
  aggregations: Record<string, number>;
  count: number;
}

/**
 * Data Aggregator
 */
export class DataAggregator {
  private groupByFields: string[] = [];
  private aggregations: Array<{
    field: string;
    function: AggregateFunction;
    alias: string;
  }> = [];
  private timeField?: string;
  private timeBucket?: 'hour' | 'day' | 'week' | 'month' | 'year';
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Set group by fields
   */
  public groupBy(fields: string | string[]): void {
    this.groupByFields = Array.isArray(fields) ? fields : [fields];
    this.emit('groupby:set', { fields: this.groupByFields });
  }

  /**
   * Add aggregation
   */
  public aggregate(field: string, func: AggregateFunction, alias?: string): void {
    this.aggregations.push({
      field,
      function: func,
      alias: alias || `${func}_${field}`,
    });
    this.emit('aggregation:added', { field, function: func });
  }

  /**
   * Set time-based aggregation
   */
  public setTimeAggregation(
    timeField: string,
    bucket: 'hour' | 'day' | 'week' | 'month' | 'year'
  ): void {
    this.timeField = timeField;
    this.timeBucket = bucket;
    this.emit('time:set', { timeField, bucket });
  }

  /**
   * Execute aggregation
   */
  public execute(data: any[]): AggregationResult[] {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const startTime = performance.now();

    let results: AggregationResult[] = [];

    if (this.timeField && this.timeBucket) {
      results = this.executeTimeAggregation(data);
    } else if (this.groupByFields.length > 0) {
      results = this.executeGroupAggregation(data);
    } else {
      results = [this.executeSimpleAggregation(data)];
    }

    const duration = performance.now() - startTime;
    this.emit('aggregation:complete', { resultCount: results.length, duration });

    return results;
  }

  /**
   * Execute simple aggregation
   */
  private executeSimpleAggregation(data: any[]): AggregationResult {
    const aggregations: Record<string, number> = {};

    this.aggregations.forEach((agg) => {
      const values = data
        .map((item) => this.getNestedValue(item, agg.field))
        .filter((v) => v !== null && v !== undefined);
      aggregations[agg.alias] = this.calculateAggregate(values, agg.function);
    });

    return {
      groups: {},
      aggregations,
      count: data.length,
    };
  }

  /**
   * Execute group aggregation
   */
  private executeGroupAggregation(data: any[]): AggregationResult[] {
    const groups = new Map<string, any[]>();

    // Group data
    data.forEach((item) => {
      const groupKey = this.groupByFields
        .map((field) => this.getNestedValue(item, field))
        .join('|');
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    });

    // Aggregate each group
    const results: AggregationResult[] = [];

    groups.forEach((groupData, groupKey) => {
      const groupValues: Record<string, any> = {};
      const keys = groupKey.split('|');

      this.groupByFields.forEach((field, index) => {
        groupValues[field] = keys[index];
      });

      const aggregations: Record<string, number> = {};

      this.aggregations.forEach((agg) => {
        const values = groupData
          .map((item) => this.getNestedValue(item, agg.field))
          .filter((v) => v !== null && v !== undefined);
        aggregations[agg.alias] = this.calculateAggregate(values, agg.function);
      });

      results.push({
        groups: groupValues,
        aggregations,
        count: groupData.length,
      });
    });

    return results;
  }

  /**
   * Execute time-based aggregation
   */
  private executeTimeAggregation(data: any[]): AggregationResult[] {
    const timeBuckets = new Map<string, any[]>();

    // Bucket data by time
    data.forEach((item) => {
      const timestamp = this.getNestedValue(item, this.timeField!);
      if (!timestamp) return;

      const bucketKey = this.getTimeBucketKey(new Date(timestamp), this.timeBucket!);
      if (!timeBuckets.has(bucketKey)) {
        timeBuckets.set(bucketKey, []);
      }
      timeBuckets.get(bucketKey)!.push(item);
    });

    // Aggregate each bucket
    const results: AggregationResult[] = [];

    timeBuckets.forEach((bucketData, bucketKey) => {
      const aggregations: Record<string, number> = {};

      this.aggregations.forEach((agg) => {
        const values = bucketData
          .map((item) => this.getNestedValue(item, agg.field))
          .filter((v) => v !== null && v !== undefined);
        aggregations[agg.alias] = this.calculateAggregate(values, agg.function);
      });

      results.push({
        groups: { [this.timeField!]: bucketKey },
        aggregations,
        count: bucketData.length,
      });
    });

    return results.sort((a, b) => {
      const aTime = new Date(a.groups[this.timeField!]).getTime();
      const bTime = new Date(b.groups[this.timeField!]).getTime();
      return aTime - bTime;
    });
  }

  /**
   * Calculate aggregate
   */
  private calculateAggregate(values: number[], func: AggregateFunction): number {
    if (values.length === 0) return 0;

    switch (func) {
      case 'sum':
        return values.reduce((a, b) => a + b, 0);
      case 'avg':
        return values.reduce((a, b) => a + b, 0) / values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      case 'count':
        return values.length;
      case 'median':
        return this.calculateMedian(values);
      case 'stddev':
        return this.calculateStdDev(values);
      default:
        return 0;
    }
  }

  /**
   * Calculate median
   */
  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /**
   * Calculate standard deviation
   */
  private calculateStdDev(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Get time bucket key
   */
  private getTimeBucketKey(date: Date, bucket: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');

    switch (bucket) {
      case 'hour':
        return `${year}-${month}-${day} ${hour}:00`;
      case 'day':
        return `${year}-${month}-${day}`;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return `${weekStart.getFullYear()}-W${String(Math.ceil((date.getDate() - date.getDay() + 1) / 7)).padStart(2, '0')}`;
      case 'month':
        return `${year}-${month}`;
      case 'year':
        return `${year}`;
      default:
        return date.toISOString();
    }
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Destroy aggregator
   */
  public destroy(): void {
    this.groupByFields = [];
    this.aggregations = [];
    this.listeners.clear();
  }
}

export default DataAggregator;
