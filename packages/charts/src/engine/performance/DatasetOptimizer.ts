/**
 * Dataset Optimizer
 * Optimizes rendering for large datasets
 */

import type { ChartElement } from '../elements/index';

export interface OptimizationConfig {
  enableCaching?: boolean;
  enableBatching?: boolean;
  batchSize?: number;
  enableHitDetectionOptimization?: boolean;
  maxVisibleElements?: number;
}

export class DatasetOptimizer {
  private elementCache: Map<string, ChartElement[]> = new Map();
  private config: OptimizationConfig = {
    enableCaching: true,
    enableBatching: true,
    batchSize: 100,
    enableHitDetectionOptimization: true,
    maxVisibleElements: 5000,
  };

  constructor(config: OptimizationConfig = {}) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Cache elements
   */
  cacheElements(key: string, elements: ChartElement[]): void {
    if (!this.config.enableCaching) return;

    this.elementCache.set(key, elements);
  }

  /**
   * Get cached elements
   */
  getCachedElements(key: string): ChartElement[] | undefined {
    if (!this.config.enableCaching) return undefined;

    return this.elementCache.get(key);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.elementCache.clear();
  }

  /**
   * Batch render elements
   */
  batchRender(
    ctx: CanvasRenderingContext2D,
    elements: ChartElement[],
    callback: (element: ChartElement) => void
  ): void {
    if (!this.config.enableBatching) {
      elements.forEach(callback);
      return;
    }

    const batchSize = this.config.batchSize || 100;

    for (let i = 0; i < elements.length; i += batchSize) {
      const batch = elements.slice(i, i + batchSize);
      batch.forEach(callback);

      // Allow browser to process
      if (i + batchSize < elements.length) {
        ctx.save();
        ctx.restore();
      }
    }
  }

  /**
   * Optimize hit detection for large datasets
   */
  optimizeHitDetection(elements: ChartElement[], x: number, y: number): ChartElement | undefined {
    if (!this.config.enableHitDetectionOptimization) {
      // Linear search
      for (let i = elements.length - 1; i >= 0; i--) {
        if (elements[i].inRange(x, y)) {
          return elements[i];
        }
      }
      return undefined;
    }

    // Spatial partitioning for faster hit detection
    // For now, use simple optimization: check visible elements first
    const visibleElements = elements.slice(
      -Math.min(elements.length, this.config.maxVisibleElements || 5000)
    );

    for (let i = visibleElements.length - 1; i >= 0; i--) {
      if (visibleElements[i].inRange(x, y)) {
        return visibleElements[i];
      }
    }

    return undefined;
  }

  /**
   * Get memory usage estimate
   */
  getMemoryUsage(elements: ChartElement[]): number {
    // Rough estimate: ~200 bytes per element
    return elements.length * 200;
  }

  /**
   * Check if dataset is large
   */
  isLargeDataset(elements: ChartElement[]): boolean {
    return elements.length > 1000;
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(elements: ChartElement[]): string[] {
    const recommendations: string[] = [];

    if (this.isLargeDataset(elements)) {
      recommendations.push('Large dataset detected. Consider enabling caching and batching.');

      if (elements.length > 10000) {
        recommendations.push('Very large dataset (>10k elements). Consider data aggregation.');
      }

      if (elements.length > 50000) {
        recommendations.push(
          'Extremely large dataset (>50k elements). Consider server-side rendering.'
        );
      }
    }

    return recommendations;
  }
}

export default DatasetOptimizer;
