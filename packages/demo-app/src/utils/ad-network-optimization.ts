/**
 * Ad Network Optimization Utilities
 * Optimizes ad network scripts for better performance
 */

export interface AdConfig {
  enabled: boolean;
  lazyLoad: boolean;
  cacheAds: boolean;
  batchRequests: boolean;
  batchInterval: number;
  maxBatchSize: number;
  timeout: number;
}

export interface AdMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  cachedRequests: number;
  averageLoadTime: number;
  totalLoadTime: number;
  impressions: number;
  clicks: number;
}

export interface AdRequest {
  id: string;
  adUnit: string;
  timestamp: number;
  size: string;
  targeting?: Record<string, any>;
}

export interface AdResponse {
  id: string;
  adUnit: string;
  html: string;
  loadTime: number;
  cached: boolean;
}

/**
 * Ad Network Optimization Manager
 */
export class AdNetworkOptimizationManager {
  private config: AdConfig;
  private metrics: AdMetrics;
  private requestQueue: AdRequest[] = [];
  private adCache: Map<string, AdResponse> = new Map();
  private batchTimer: NodeJS.Timeout | null = null;
  private subscribers: ((metrics: AdMetrics) => void)[] = [];
  private loadedAds: Set<string> = new Set();

  constructor(config: Partial<AdConfig> = {}) {
    this.config = {
      enabled: true,
      lazyLoad: true,
      cacheAds: true,
      batchRequests: true,
      batchInterval: 3000, // 3 seconds
      maxBatchSize: 10,
      timeout: 5000, // 5 seconds
      ...config,
    };

    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      cachedRequests: 0,
      averageLoadTime: 0,
      totalLoadTime: 0,
      impressions: 0,
      clicks: 0,
    };
  }

  /**
   * Request ad
   */
  async requestAd(
    adUnit: string,
    size: string,
    targeting?: Record<string, any>
  ): Promise<AdResponse | null> {
    if (!this.config.enabled) return null;

    const request: AdRequest = {
      id: `ad-${Date.now()}-${Math.random()}`,
      adUnit,
      timestamp: Date.now(),
      size,
      targeting,
    };

    this.metrics.totalRequests++;

    // Check cache
    if (this.config.cacheAds) {
      const cacheKey = `${adUnit}:${size}`;
      const cached = this.adCache.get(cacheKey);
      if (cached) {
        this.metrics.cachedRequests++;
        this.metrics.impressions++;
        this.notifySubscribers();
        return cached;
      }
    }

    // Add to batch queue
    if (this.config.batchRequests) {
      this.requestQueue.push(request);

      // Send batch if max size reached
      if (this.requestQueue.length >= this.config.maxBatchSize) {
        await this.flushBatch();
      } else if (!this.batchTimer) {
        // Schedule batch send
        this.batchTimer = setTimeout(() => this.flushBatch(), this.config.batchInterval);
      }
    } else {
      // Send immediately
      return await this.sendRequest(request);
    }

    return null;
  }

  /**
   * Flush batch of requests
   */
  private async flushBatch(): Promise<void> {
    if (this.requestQueue.length === 0) return;

    const batch = this.requestQueue.splice(0, this.config.maxBatchSize);

    // Send batch
    await this.sendBatch(batch);

    // Clear timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // Schedule next batch if queue not empty
    if (this.requestQueue.length > 0) {
      this.batchTimer = setTimeout(() => this.flushBatch(), this.config.batchInterval);
    }
  }

  /**
   * Send single request
   */
  private async sendRequest(request: AdRequest): Promise<AdResponse | null> {
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch('/api/ads/request', {
        method: 'POST',
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.metrics.failedRequests++;
        this.notifySubscribers();
        return null;
      }

      const data = await response.json();
      const loadTime = performance.now() - startTime;

      const adResponse: AdResponse = {
        id: request.id,
        adUnit: request.adUnit,
        html: data.html,
        loadTime,
        cached: false,
      };

      // Cache ad
      if (this.config.cacheAds) {
        const cacheKey = `${request.adUnit}:${request.size}`;
        this.adCache.set(cacheKey, adResponse);
      }

      this.metrics.successfulRequests++;
      this.metrics.impressions++;
      this.metrics.totalLoadTime += loadTime;
      this.metrics.averageLoadTime = this.metrics.totalLoadTime / this.metrics.successfulRequests;

      this.notifySubscribers();
      return adResponse;
    } catch (error) {
      this.metrics.failedRequests++;
      this.notifySubscribers();
      return null;
    }
  }

  /**
   * Send batch of requests
   */
  private async sendBatch(batch: AdRequest[]): Promise<void> {
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch('/api/ads/batch', {
        method: 'POST',
        body: JSON.stringify(batch),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.metrics.failedRequests += batch.length;
        this.notifySubscribers();
        return;
      }

      const data = await response.json();
      const loadTime = performance.now() - startTime;

      // Process responses
      data.ads.forEach((ad: any, index: number) => {
        const request = batch[index];
        const adResponse: AdResponse = {
          id: request.id,
          adUnit: request.adUnit,
          html: ad.html,
          loadTime: loadTime / batch.length,
          cached: false,
        };

        // Cache ad
        if (this.config.cacheAds) {
          const cacheKey = `${request.adUnit}:${request.size}`;
          this.adCache.set(cacheKey, adResponse);
        }
      });

      this.metrics.successfulRequests += batch.length;
      this.metrics.impressions += batch.length;
      this.metrics.totalLoadTime += loadTime;
      this.metrics.averageLoadTime = this.metrics.totalLoadTime / this.metrics.successfulRequests;

      this.notifySubscribers();
    } catch (error) {
      this.metrics.failedRequests += batch.length;
      this.notifySubscribers();
    }
  }

  /**
   * Track click
   */
  trackClick(adId: string): void {
    this.metrics.clicks++;
    this.notifySubscribers();
  }

  /**
   * Get metrics
   */
  getMetrics(): AdMetrics {
    return { ...this.metrics };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.adCache.clear();
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      cachedRequests: 0,
      averageLoadTime: 0,
      totalLoadTime: 0,
      impressions: 0,
      clicks: 0,
    };
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(callback: (metrics: AdMetrics) => void): () => void {
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

  /**
   * Destroy manager
   */
  destroy(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    this.subscribers = [];
    this.adCache.clear();
  }
}

// Global instance
export const adNetworkOptimizationManager = new AdNetworkOptimizationManager();

/**
 * Request ad
 */
export async function requestAd(
  adUnit: string,
  size: string,
  targeting?: Record<string, any>
): Promise<AdResponse | null> {
  return adNetworkOptimizationManager.requestAd(adUnit, size, targeting);
}

/**
 * Track ad click
 */
export function trackAdClick(adId: string): void {
  adNetworkOptimizationManager.trackClick(adId);
}
