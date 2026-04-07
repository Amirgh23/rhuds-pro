/**
 * Edge Performance Monitoring
 * Monitors edge caching and performance metrics
 */

export interface EdgeMetrics {
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  edgeLatency: number;
  originLatency: number;
  totalLatency: number;
  bandwidth: number;
  requests: number;
  timestamp: number;
}

export interface PerformanceComparison {
  withCache: EdgeMetrics;
  withoutCache: EdgeMetrics;
  improvement: {
    latency: number;
    bandwidth: number;
    percentage: number;
  };
}

/**
 * Edge performance monitor
 */
export class EdgePerformanceMonitor {
  private metrics: EdgeMetrics[] = [];
  private currentMetrics: EdgeMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    hitRate: 0,
    edgeLatency: 0,
    originLatency: 0,
    totalLatency: 0,
    bandwidth: 0,
    requests: 0,
    timestamp: Date.now(),
  };

  private listeners: Set<(metrics: EdgeMetrics) => void> = new Set();

  /**
   * Record cache hit
   */
  recordCacheHit(latency: number, bandwidth: number): void {
    this.currentMetrics.cacheHits++;
    this.currentMetrics.edgeLatency += latency;
    this.currentMetrics.bandwidth += bandwidth;
    this.updateMetrics();
  }

  /**
   * Record cache miss
   */
  recordCacheMiss(originLatency: number, bandwidth: number): void {
    this.currentMetrics.cacheMisses++;
    this.currentMetrics.originLatency += originLatency;
    this.currentMetrics.bandwidth += bandwidth;
    this.updateMetrics();
  }

  /**
   * Update metrics
   */
  private updateMetrics(): void {
    const total = this.currentMetrics.cacheHits + this.currentMetrics.cacheMisses;

    if (total > 0) {
      this.currentMetrics.hitRate = (this.currentMetrics.cacheHits / total) * 100;
      this.currentMetrics.edgeLatency =
        this.currentMetrics.edgeLatency / this.currentMetrics.cacheHits || 0;
      this.currentMetrics.originLatency =
        this.currentMetrics.originLatency / this.currentMetrics.cacheMisses || 0;
      this.currentMetrics.totalLatency =
        (this.currentMetrics.edgeLatency * this.currentMetrics.cacheHits +
          this.currentMetrics.originLatency * this.currentMetrics.cacheMisses) /
        total;
      this.currentMetrics.requests = total;
    }

    this.currentMetrics.timestamp = Date.now();

    // Notify listeners
    this.listeners.forEach((listener) => listener(this.currentMetrics));
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics(): EdgeMetrics {
    return { ...this.currentMetrics };
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(limit: number = 100): EdgeMetrics[] {
    return this.metrics.slice(-limit);
  }

  /**
   * Record metrics snapshot
   */
  recordSnapshot(): void {
    this.metrics.push({ ...this.currentMetrics });

    // Keep only last 1000 snapshots
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }
  }

  /**
   * Get average metrics
   */
  getAverageMetrics(): EdgeMetrics {
    if (this.metrics.length === 0) {
      return this.getCurrentMetrics();
    }

    const sum = this.metrics.reduce(
      (acc, m) => ({
        cacheHits: acc.cacheHits + m.cacheHits,
        cacheMisses: acc.cacheMisses + m.cacheMisses,
        hitRate: acc.hitRate + m.hitRate,
        edgeLatency: acc.edgeLatency + m.edgeLatency,
        originLatency: acc.originLatency + m.originLatency,
        totalLatency: acc.totalLatency + m.totalLatency,
        bandwidth: acc.bandwidth + m.bandwidth,
        requests: acc.requests + m.requests,
        timestamp: 0,
      }),
      {
        cacheHits: 0,
        cacheMisses: 0,
        hitRate: 0,
        edgeLatency: 0,
        originLatency: 0,
        totalLatency: 0,
        bandwidth: 0,
        requests: 0,
        timestamp: 0,
      }
    );

    const count = this.metrics.length;

    return {
      cacheHits: sum.cacheHits / count,
      cacheMisses: sum.cacheMisses / count,
      hitRate: sum.hitRate / count,
      edgeLatency: sum.edgeLatency / count,
      originLatency: sum.originLatency / count,
      totalLatency: sum.totalLatency / count,
      bandwidth: sum.bandwidth / count,
      requests: sum.requests / count,
      timestamp: Date.now(),
    };
  }

  /**
   * Compare performance with and without cache
   */
  comparePerformance(): PerformanceComparison {
    const current = this.getCurrentMetrics();
    const average = this.getAverageMetrics();

    const withCache: EdgeMetrics = {
      ...current,
      edgeLatency: current.edgeLatency,
      bandwidth: current.bandwidth,
    };

    const withoutCache: EdgeMetrics = {
      ...current,
      edgeLatency: current.originLatency,
      bandwidth: current.bandwidth * 1.5, // Estimate 50% more bandwidth without cache
    };

    const latencyImprovement = withoutCache.edgeLatency - withCache.edgeLatency;
    const bandwidthImprovement = withoutCache.bandwidth - withCache.bandwidth;
    const percentageImprovement = (latencyImprovement / withoutCache.edgeLatency) * 100;

    return {
      withCache,
      withoutCache,
      improvement: {
        latency: latencyImprovement,
        bandwidth: bandwidthImprovement,
        percentage: percentageImprovement,
      },
    };
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(listener: (metrics: EdgeMetrics) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get performance statistics
   */
  getStats(): {
    totalRequests: number;
    cacheHitRate: number;
    averageEdgeLatency: number;
    averageOriginLatency: number;
    averageTotalLatency: number;
    totalBandwidth: number;
    estimatedSavings: number;
  } {
    const average = this.getAverageMetrics();
    const comparison = this.comparePerformance();

    return {
      totalRequests: average.requests,
      cacheHitRate: average.hitRate,
      averageEdgeLatency: average.edgeLatency,
      averageOriginLatency: average.originLatency,
      averageTotalLatency: average.totalLatency,
      totalBandwidth: average.bandwidth,
      estimatedSavings: comparison.improvement.percentage,
    };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.currentMetrics = {
      cacheHits: 0,
      cacheMisses: 0,
      hitRate: 0,
      edgeLatency: 0,
      originLatency: 0,
      totalLatency: 0,
      bandwidth: 0,
      requests: 0,
      timestamp: Date.now(),
    };
    this.metrics = [];
  }
}

/**
 * Global edge performance monitor instance
 */
export const edgePerformanceMonitor = new EdgePerformanceMonitor();

/**
 * Measure request performance
 */
export async function measureRequestPerformance(
  url: string,
  options?: RequestInit
): Promise<{
  latency: number;
  bandwidth: number;
  cached: boolean;
}> {
  const startTime = performance.now();

  try {
    const response = await fetch(url, options);
    const endTime = performance.now();
    const latency = endTime - startTime;

    const cached = response.headers.get('X-Cache') === 'HIT';
    const contentLength = response.headers.get('Content-Length');
    const bandwidth = contentLength ? parseInt(contentLength) : 0;

    if (cached) {
      edgePerformanceMonitor.recordCacheHit(latency, bandwidth);
    } else {
      edgePerformanceMonitor.recordCacheMiss(latency, bandwidth);
    }

    return { latency, bandwidth, cached };
  } catch (error) {
    console.error('Failed to measure request performance:', error);
    return { latency: 0, bandwidth: 0, cached: false };
  }
}

/**
 * Monitor performance over time
 */
export function startPerformanceMonitoring(interval: number = 60000): () => void {
  const timer = setInterval(() => {
    edgePerformanceMonitor.recordSnapshot();
  }, interval);

  return () => clearInterval(timer);
}

export default edgePerformanceMonitor;
