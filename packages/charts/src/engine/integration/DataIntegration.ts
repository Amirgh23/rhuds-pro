/**
 * Data Integration System
 * Integrates all data systems with unified interface
 */

import { DataParser } from '../data/DataParser';
import { StreamingDataManager } from '../data/StreamingDataManager';
import { DataCache } from '../data/DataCache';
import { DataNormalizer } from '../data/DataNormalizer';

export interface DataConfig {
  streaming?: boolean;
  caching?: boolean;
  normalization?: boolean;
  compression?: boolean;
}

export interface DataPoint {
  x: number | string;
  y: number;
  [key: string]: any;
}

export interface Dataset {
  label: string;
  data: DataPoint[];
  [key: string]: any;
}

/**
 * Data Integration Manager
 * Manages all data systems and provides unified interface
 */
export class DataIntegration {
  private parser: DataParser;
  private streaming: StreamingDataManager;
  private cache: DataCache;
  private normalizer: DataNormalizer;
  private config: DataConfig;

  constructor(config: DataConfig = {}) {
    this.config = config;
    this.parser = new DataParser();
    this.streaming = new StreamingDataManager();
    this.cache = new DataCache();
    this.normalizer = new DataNormalizer();
  }

  /**
   * Parse and process data
   */
  public processData(rawData: any): Dataset[] {
    // Parse data
    let data = this.parser.parse(rawData);

    // Normalize if enabled
    if (this.config.normalization) {
      data = this.normalizer.normalize(data);
    }

    // Cache if enabled
    if (this.config.caching) {
      this.cache.set('processed_data', data);
    }

    return data;
  }

  /**
   * Enable streaming data
   */
  public enableStreaming(callback: (data: Dataset[]) => void): void {
    if (!this.config.streaming) {
      this.config.streaming = true;
    }

    this.streaming.on('data', (newData: any) => {
      const processed = this.processData(newData);
      callback(processed);
    });
  }

  /**
   * Add streaming data point
   */
  public addStreamingPoint(datasetIndex: number, point: DataPoint): void {
    this.streaming.addPoint(datasetIndex, point);
  }

  /**
   * Get cached data
   */
  public getCachedData(key: string): Dataset[] | null {
    return this.cache.get(key);
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Validate data
   */
  public validateData(data: Dataset[]): boolean {
    return this.parser.validate(data);
  }

  /**
   * Normalize data
   */
  public normalizeData(data: Dataset[]): Dataset[] {
    return this.normalizer.normalize(data);
  }

  /**
   * Compress data
   */
  public compressData(data: Dataset[]): string {
    return JSON.stringify(data);
  }

  /**
   * Decompress data
   */
  public decompressData(compressed: string): Dataset[] {
    return JSON.parse(compressed);
  }

  /**
   * Get data statistics
   */
  public getStatistics(data: Dataset[]): any {
    const stats: any = {};

    data.forEach((dataset) => {
      const values = dataset.data.map((d) => d.y);
      stats[dataset.label] = {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        count: values.length,
      };
    });

    return stats;
  }

  /**
   * Filter data
   */
  public filterData(data: Dataset[], predicate: (d: DataPoint) => boolean): Dataset[] {
    return data.map((dataset) => ({
      ...dataset,
      data: dataset.data.filter(predicate),
    }));
  }

  /**
   * Aggregate data
   */
  public aggregateData(data: Dataset[], groupSize: number): Dataset[] {
    return data.map((dataset) => ({
      ...dataset,
      data: this.aggregatePoints(dataset.data, groupSize),
    }));
  }

  /**
   * Aggregate data points
   */
  private aggregatePoints(points: DataPoint[], groupSize: number): DataPoint[] {
    const aggregated: DataPoint[] = [];

    for (let i = 0; i < points.length; i += groupSize) {
      const group = points.slice(i, i + groupSize);
      const avgY = group.reduce((sum, p) => sum + p.y, 0) / group.length;

      aggregated.push({
        x: group[0].x,
        y: avgY,
      });
    }

    return aggregated;
  }

  /**
   * Stop streaming
   */
  public stopStreaming(): void {
    this.streaming.stop();
  }

  /**
   * Destroy integration
   */
  public destroy(): void {
    this.stopStreaming();
    this.clearCache();
  }
}

export default DataIntegration;
