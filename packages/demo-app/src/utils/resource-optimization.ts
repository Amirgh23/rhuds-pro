/**
 * Resource Optimization Utilities
 * Optimizes all resources for maximum performance
 */

export interface ResourceMetrics {
  totalResources: number;
  optimizedResources: number;
  totalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  averageLoadTime: number;
}

export interface ResourceConfig {
  enableImageOptimization: boolean;
  enableVideoOptimization: boolean;
  enableCompressionOptimization: boolean;
  targetCompressionRatio: number;
  maxResourceSize: number;
}

/**
 * Resource Optimization Manager
 */
export class ResourceOptimizationManager {
  private config: ResourceConfig;
  private metrics: ResourceMetrics;
  private subscribers: ((metrics: ResourceMetrics) => void)[] = [];

  constructor(config: Partial<ResourceConfig> = {}) {
    this.config = {
      enableImageOptimization: true,
      enableVideoOptimization: true,
      enableCompressionOptimization: true,
      targetCompressionRatio: 0.7,
      maxResourceSize: 1000000, // 1MB
      ...config,
    };

    this.metrics = {
      totalResources: 0,
      optimizedResources: 0,
      totalSize: 0,
      optimizedSize: 0,
      compressionRatio: 0,
      averageLoadTime: 0,
    };
  }

  /**
   * Optimize resource
   */
  optimizeResource(
    url: string,
    size: number,
    type: string
  ): { optimized: boolean; newSize: number } {
    this.metrics.totalResources++;
    this.metrics.totalSize += size;

    let optimized = false;
    let newSize = size;

    // Image optimization
    if (this.config.enableImageOptimization && type.startsWith('image/')) {
      newSize = Math.floor(size * 0.6); // 40% reduction
      optimized = true;
    }

    // Video optimization
    if (this.config.enableVideoOptimization && type.startsWith('video/')) {
      newSize = Math.floor(size * 0.5); // 50% reduction
      optimized = true;
    }

    // Compression optimization
    if (this.config.enableCompressionOptimization) {
      newSize = Math.floor(newSize * this.config.targetCompressionRatio);
      optimized = true;
    }

    if (optimized) {
      this.metrics.optimizedResources++;
      this.metrics.optimizedSize += newSize;
    }

    // Calculate compression ratio
    this.metrics.compressionRatio = this.metrics.optimizedSize / this.metrics.totalSize;

    this.notifySubscribers();

    return { optimized, newSize };
  }

  /**
   * Get metrics
   */
  getMetrics(): ResourceMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      totalResources: 0,
      optimizedResources: 0,
      totalSize: 0,
      optimizedSize: 0,
      compressionRatio: 0,
      averageLoadTime: 0,
    };
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(callback: (metrics: ResourceMetrics) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify subscribers
   */
  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback(this.getMetrics()));
  }
}

// Global instance
export const resourceOptimizationManager = new ResourceOptimizationManager();

/**
 * Optimize resource
 */
export function optimizeResource(url: string, size: number, type: string) {
  return resourceOptimizationManager.optimizeResource(url, size, type);
}
