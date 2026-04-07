/**
 * Analytics Optimization Utilities
 * Optimizes analytics scripts for better performance
 */

export interface AnalyticsConfig {
  enabled: boolean;
  deferNonCritical: boolean;
  batchRequests: boolean;
  batchInterval: number;
  deduplicateRequests: boolean;
  maxBatchSize: number;
}

export interface AnalyticsMetrics {
  totalRequests: number;
  batchedRequests: number;
  deferredRequests: number;
  deduplicatedRequests: number;
  averageLoadTime: number;
  totalLoadTime: number;
}

export interface TrackingEvent {
  id: string;
  type: string;
  timestamp: number;
  data: Record<string, any>;
  priority: 'critical' | 'high' | 'normal' | 'low';
}

/**
 * Analytics Optimization Manager
 */
export class AnalyticsOptimizationManager {
  private config: AnalyticsConfig;
  private metrics: AnalyticsMetrics;
  private eventQueue: TrackingEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private requestCache: Map<string, TrackingEvent> = new Map();
  private subscribers: ((metrics: AnalyticsMetrics) => void)[] = [];

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enabled: true,
      deferNonCritical: true,
      batchRequests: true,
      batchInterval: 5000, // 5 seconds
      deduplicateRequests: true,
      maxBatchSize: 50,
      ...config,
    };

    this.metrics = {
      totalRequests: 0,
      batchedRequests: 0,
      deferredRequests: 0,
      deduplicatedRequests: 0,
      averageLoadTime: 0,
      totalLoadTime: 0,
    };
  }

  /**
   * Track event with optimization
   */
  trackEvent(event: TrackingEvent): void {
    if (!this.config.enabled) return;

    this.metrics.totalRequests++;

    // Defer non-critical events
    if (this.config.deferNonCritical && event.priority !== 'critical') {
      this.metrics.deferredRequests++;
    }

    // Deduplicate requests
    if (this.config.deduplicateRequests) {
      const cacheKey = `${event.type}:${JSON.stringify(event.data)}`;
      if (this.requestCache.has(cacheKey)) {
        this.metrics.deduplicatedRequests++;
        return;
      }
      this.requestCache.set(cacheKey, event);
    }

    // Add to batch queue
    if (this.config.batchRequests) {
      this.eventQueue.push(event);

      // Send batch if max size reached
      if (this.eventQueue.length >= this.config.maxBatchSize) {
        this.flushBatch();
      } else if (!this.batchTimer) {
        // Schedule batch send
        this.batchTimer = setTimeout(() => this.flushBatch(), this.config.batchInterval);
      }
    } else {
      // Send immediately
      this.sendEvent(event);
    }

    this.notifySubscribers();
  }

  /**
   * Flush batch of events
   */
  private flushBatch(): void {
    if (this.eventQueue.length === 0) return;

    const batch = this.eventQueue.splice(0, this.config.maxBatchSize);
    this.metrics.batchedRequests += batch.length;

    // Send batch
    this.sendBatch(batch);

    // Clear timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // Schedule next batch if queue not empty
    if (this.eventQueue.length > 0) {
      this.batchTimer = setTimeout(() => this.flushBatch(), this.config.batchInterval);
    }
  }

  /**
   * Send single event
   */
  private sendEvent(event: TrackingEvent): void {
    const startTime = performance.now();

    // Send event asynchronously
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(event));
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify(event),
        keepalive: true,
      }).catch(() => {
        // Silently fail
      });
    }

    const loadTime = performance.now() - startTime;
    this.metrics.totalLoadTime += loadTime;
    this.metrics.averageLoadTime = this.metrics.totalLoadTime / this.metrics.totalRequests;
  }

  /**
   * Send batch of events
   */
  private sendBatch(batch: TrackingEvent[]): void {
    const startTime = performance.now();

    // Send batch asynchronously
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/batch', JSON.stringify(batch));
    } else {
      fetch('/api/analytics/batch', {
        method: 'POST',
        body: JSON.stringify(batch),
        keepalive: true,
      }).catch(() => {
        // Silently fail
      });
    }

    const loadTime = performance.now() - startTime;
    this.metrics.totalLoadTime += loadTime;
    this.metrics.averageLoadTime = this.metrics.totalLoadTime / this.metrics.totalRequests;
  }

  /**
   * Get metrics
   */
  getMetrics(): AnalyticsMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      totalRequests: 0,
      batchedRequests: 0,
      deferredRequests: 0,
      deduplicatedRequests: 0,
      averageLoadTime: 0,
      totalLoadTime: 0,
    };
    this.eventQueue = [];
    this.requestCache.clear();
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(callback: (metrics: AnalyticsMetrics) => void): () => void {
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
   * Flush all pending events
   */
  flush(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    this.flushBatch();
  }

  /**
   * Destroy manager
   */
  destroy(): void {
    this.flush();
    this.subscribers = [];
    this.requestCache.clear();
  }
}

// Global instance
export const analyticsOptimizationManager = new AnalyticsOptimizationManager();

/**
 * Track page view
 */
export function trackPageView(path: string, title: string): void {
  analyticsOptimizationManager.trackEvent({
    id: `pageview-${Date.now()}`,
    type: 'pageview',
    timestamp: Date.now(),
    data: { path, title },
    priority: 'high',
  });
}

/**
 * Track event
 */
export function trackEvent(eventName: string, data: Record<string, any>): void {
  analyticsOptimizationManager.trackEvent({
    id: `event-${Date.now()}`,
    type: eventName,
    timestamp: Date.now(),
    data,
    priority: 'normal',
  });
}

/**
 * Track user action
 */
export function trackUserAction(action: string, target: string): void {
  analyticsOptimizationManager.trackEvent({
    id: `action-${Date.now()}`,
    type: 'user_action',
    timestamp: Date.now(),
    data: { action, target },
    priority: 'low',
  });
}

/**
 * Flush pending analytics
 */
export function flushAnalytics(): void {
  analyticsOptimizationManager.flush();
}
