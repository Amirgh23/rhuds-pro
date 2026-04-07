/**
 * Predictive Caching Utilities
 * Implements ML-based predictive caching
 */

export interface UserBehavior {
  path: string;
  timestamp: number;
  duration: number;
  nextPath?: string;
}

export interface PredictionMetrics {
  totalPredictions: number;
  accuratePredictions: number;
  accuracy: number;
  cacheHits: number;
  cacheMisses: number;
}

/**
 * Predictive Caching Manager
 */
export class PredictiveCachingManager {
  private userBehavior: UserBehavior[] = [];
  private predictions: Map<string, string[]> = new Map();
  private metrics: PredictionMetrics;
  private subscribers: ((metrics: PredictionMetrics) => void)[] = [];

  constructor() {
    this.metrics = {
      totalPredictions: 0,
      accuratePredictions: 0,
      accuracy: 0,
      cacheHits: 0,
      cacheMisses: 0,
    };
  }

  /**
   * Record user behavior
   */
  recordBehavior(behavior: UserBehavior): void {
    this.userBehavior.push(behavior);

    // Update predictions based on behavior
    if (this.userBehavior.length > 1) {
      const prev = this.userBehavior[this.userBehavior.length - 2];
      const current = behavior;

      if (!this.predictions.has(prev.path)) {
        this.predictions.set(prev.path, []);
      }

      const nextPaths = this.predictions.get(prev.path)!;
      if (!nextPaths.includes(current.path)) {
        nextPaths.push(current.path);
      }
    }

    // Keep only recent behavior
    if (this.userBehavior.length > 100) {
      this.userBehavior.shift();
    }
  }

  /**
   * Predict next path
   */
  predictNextPath(currentPath: string): string | null {
    const nextPaths = this.predictions.get(currentPath);
    if (!nextPaths || nextPaths.length === 0) {
      return null;
    }

    this.metrics.totalPredictions++;

    // Return most likely next path
    return nextPaths[0];
  }

  /**
   * Record prediction accuracy
   */
  recordPredictionAccuracy(predicted: string, actual: string): void {
    if (predicted === actual) {
      this.metrics.accuratePredictions++;
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }

    this.metrics.accuracy =
      this.metrics.totalPredictions > 0
        ? (this.metrics.accuratePredictions / this.metrics.totalPredictions) * 100
        : 0;

    this.notifySubscribers();
  }

  /**
   * Get metrics
   */
  getMetrics(): PredictionMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.userBehavior = [];
    this.predictions.clear();
    this.metrics = {
      totalPredictions: 0,
      accuratePredictions: 0,
      accuracy: 0,
      cacheHits: 0,
      cacheMisses: 0,
    };
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(callback: (metrics: PredictionMetrics) => void): () => void {
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
export const predictiveCachingManager = new PredictiveCachingManager();

/**
 * Record user behavior
 */
export function recordUserBehavior(behavior: UserBehavior): void {
  predictiveCachingManager.recordBehavior(behavior);
}

/**
 * Predict next path
 */
export function predictNextPath(currentPath: string): string | null {
  return predictiveCachingManager.predictNextPath(currentPath);
}
