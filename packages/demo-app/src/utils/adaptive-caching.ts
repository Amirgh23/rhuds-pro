/**
 * Adaptive Caching Utilities
 * Implements adaptive cache strategies based on network conditions
 */

export type NetworkType = '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
export type CacheStrategy = 'aggressive' | 'balanced' | 'conservative';

export interface NetworkInfo {
  type: NetworkType;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface AdaptiveCacheConfig {
  strategy: CacheStrategy;
  maxCacheSize: number;
  ttl: number;
  staleWhileRevalidate: number;
}

export interface AdaptiveMetrics {
  networkType: NetworkType;
  strategy: CacheStrategy;
  cacheSize: number;
  hitRate: number;
  adaptations: number;
}

/**
 * Adaptive Caching Manager
 */
export class AdaptiveCachingManager {
  private networkInfo: NetworkInfo;
  private strategy: CacheStrategy = 'balanced';
  private config: AdaptiveCacheConfig;
  private metrics: AdaptiveMetrics;
  private subscribers: ((metrics: AdaptiveMetrics) => void)[] = [];

  constructor() {
    this.networkInfo = this.getNetworkInfo();
    this.config = this.getConfigForStrategy(this.strategy);
    this.metrics = {
      networkType: this.networkInfo.type,
      strategy: this.strategy,
      cacheSize: 0,
      hitRate: 0,
      adaptations: 0,
    };

    // Monitor network changes
    this.monitorNetworkChanges();
  }

  /**
   * Get network info
   */
  private getNetworkInfo(): NetworkInfo {
    const connection = (navigator as any).connection || (navigator as any).mozConnection;

    return {
      type: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: (navigator as any).connection?.saveData || false,
    };
  }

  /**
   * Monitor network changes
   */
  private monitorNetworkChanges(): void {
    const connection = (navigator as any).connection || (navigator as any).mozConnection;
    if (!connection) return;

    connection.addEventListener('change', () => {
      this.networkInfo = this.getNetworkInfo();
      this.adaptStrategy();
    });
  }

  /**
   * Adapt strategy based on network
   */
  private adaptStrategy(): void {
    const newStrategy = this.determineStrategy();

    if (newStrategy !== this.strategy) {
      this.strategy = newStrategy;
      this.config = this.getConfigForStrategy(this.strategy);
      this.metrics.strategy = this.strategy;
      this.metrics.adaptations++;
      this.notifySubscribers();
    }
  }

  /**
   * Determine strategy based on network
   */
  private determineStrategy(): CacheStrategy {
    if (this.networkInfo.saveData) {
      return 'aggressive';
    }

    switch (this.networkInfo.effectiveType) {
      case '4g':
        return 'balanced';
      case '3g':
        return 'conservative';
      case '2g':
      case 'slow-2g':
        return 'aggressive';
      default:
        return 'balanced';
    }
  }

  /**
   * Get config for strategy
   */
  private getConfigForStrategy(strategy: CacheStrategy): AdaptiveCacheConfig {
    switch (strategy) {
      case 'aggressive':
        return {
          strategy: 'aggressive',
          maxCacheSize: 50 * 1024 * 1024, // 50MB
          ttl: 86400000, // 24 hours
          staleWhileRevalidate: 604800000, // 7 days
        };
      case 'conservative':
        return {
          strategy: 'conservative',
          maxCacheSize: 10 * 1024 * 1024, // 10MB
          ttl: 3600000, // 1 hour
          staleWhileRevalidate: 86400000, // 24 hours
        };
      case 'balanced':
      default:
        return {
          strategy: 'balanced',
          maxCacheSize: 25 * 1024 * 1024, // 25MB
          ttl: 21600000, // 6 hours
          staleWhileRevalidate: 259200000, // 3 days
        };
    }
  }

  /**
   * Get metrics
   */
  getMetrics(): AdaptiveMetrics {
    return { ...this.metrics };
  }

  /**
   * Get config
   */
  getConfig(): AdaptiveCacheConfig {
    return { ...this.config };
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(callback: (metrics: AdaptiveMetrics) => void): () => void {
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
export const adaptiveCachingManager = new AdaptiveCachingManager();

/**
 * Get adaptive cache config
 */
export function getAdaptiveCacheConfig(): AdaptiveCacheConfig {
  return adaptiveCachingManager.getConfig();
}
