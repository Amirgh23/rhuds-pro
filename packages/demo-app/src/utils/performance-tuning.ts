/**
 * Performance Tuning Utilities
 * Fine-tunes all performance aspects
 */

export interface PerformanceTuningConfig {
  enableCacheOptimization: boolean;
  enableResourceOptimization: boolean;
  enablePredictiveCaching: boolean;
  enableAdaptiveCaching: boolean;
  cacheInvalidationInterval: number;
  metricsUpdateInterval: number;
  performanceThreshold: number;
}

export interface PerformanceTuningMetrics {
  pageLoadTime: number;
  tti: number;
  bundleSize: number;
  lighthouseScore: number;
  cacheHitRate: number;
  resourceOptimizationRate: number;
  predictionAccuracy: number;
  adaptationCount: number;
}

/**
 * Performance Tuning Manager
 */
export class PerformanceTuningManager {
  private config: PerformanceTuningConfig;
  private metrics: PerformanceTuningMetrics;
  private subscribers: ((metrics: PerformanceTuningMetrics) => void)[] = [];

  constructor(config: Partial<PerformanceTuningConfig> = {}) {
    this.config = {
      enableCacheOptimization: true,
      enableResourceOptimization: true,
      enablePredictiveCaching: true,
      enableAdaptiveCaching: true,
      cacheInvalidationInterval: 300000, // 5 minutes
      metricsUpdateInterval: 60000, // 1 minute
      performanceThreshold: 0.7, // 70%
      ...config,
    };

    this.metrics = {
      pageLoadTime: 0,
      tti: 0,
      bundleSize: 0,
      lighthouseScore: 0,
      cacheHitRate: 0,
      resourceOptimizationRate: 0,
      predictionAccuracy: 0,
      adaptationCount: 0,
    };

    this.initializeMetrics();
  }

  /**
   * Initialize metrics from performance API
   */
  private initializeMetrics(): void {
    if (typeof window === 'undefined') return;

    // Get page load time
    const perfData = window.performance.timing;
    this.metrics.pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

    // Get TTI (Time to Interactive)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            this.metrics.tti = entries[entries.length - 1].startTime;
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Ignore if not supported
      }
    }
  }

  /**
   * Update metrics
   */
  updateMetrics(newMetrics: Partial<PerformanceTuningMetrics>): void {
    this.metrics = { ...this.metrics, ...newMetrics };
    this.notifySubscribers();
  }

  /**
   * Get metrics
   */
  getMetrics(): PerformanceTuningMetrics {
    return { ...this.metrics };
  }

  /**
   * Get config
   */
  getConfig(): PerformanceTuningConfig {
    return { ...this.config };
  }

  /**
   * Update config
   */
  updateConfig(newConfig: Partial<PerformanceTuningConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Calculate performance score
   */
  calculatePerformanceScore(): number {
    const weights = {
      pageLoadTime: 0.25,
      tti: 0.25,
      bundleSize: 0.15,
      lighthouseScore: 0.2,
      cacheHitRate: 0.15,
    };

    // Normalize metrics to 0-1 scale
    const normalizedPageLoad = Math.max(0, 1 - this.metrics.pageLoadTime / 2000);
    const normalizedTTI = Math.max(0, 1 - this.metrics.tti / 3000);
    const normalizedBundle = Math.max(0, 1 - this.metrics.bundleSize / 100000);
    const normalizedLighthouse = this.metrics.lighthouseScore / 100;
    const normalizedCache = this.metrics.cacheHitRate / 100;

    const score =
      normalizedPageLoad * weights.pageLoadTime +
      normalizedTTI * weights.tti +
      normalizedBundle * weights.bundleSize +
      normalizedLighthouse * weights.lighthouseScore +
      normalizedCache * weights.cacheHitRate;

    return Math.min(100, Math.max(0, score * 100));
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const score = this.calculatePerformanceScore();

    if (score < this.config.performanceThreshold * 100) {
      if (this.metrics.pageLoadTime > 1000) {
        recommendations.push('Reduce page load time - consider code splitting');
      }
      if (this.metrics.tti > 2000) {
        recommendations.push('Improve Time to Interactive - optimize JavaScript');
      }
      if (this.metrics.bundleSize > 50000) {
        recommendations.push('Reduce bundle size - enable compression');
      }
      if (this.metrics.cacheHitRate < 70) {
        recommendations.push('Improve cache hit rate - warm cache on startup');
      }
    }

    return recommendations;
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(callback: (metrics: PerformanceTuningMetrics) => void): () => void {
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
export const performanceTuningManager = new PerformanceTuningManager();

/**
 * Calculate performance score
 */
export function calculatePerformanceScore(): number {
  return performanceTuningManager.calculatePerformanceScore();
}

/**
 * Get performance recommendations
 */
export function getPerformanceRecommendations(): string[] {
  return performanceTuningManager.getRecommendations();
}
