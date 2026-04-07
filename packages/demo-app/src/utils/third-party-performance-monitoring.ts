/**
 * Third-Party Performance Monitoring
 * Monitors third-party script performance impact
 */

export interface ThirdPartyMetrics {
  totalScripts: number;
  totalLoadTime: number;
  averageLoadTime: number;
  maxLoadTime: number;
  minLoadTime: number;
  impactPercentage: number;
  errorCount: number;
  successCount: number;
}

export interface ScriptPerformance {
  id: string;
  name: string;
  loadTime: number;
  size: number;
  impact: number;
  status: 'success' | 'error' | 'timeout';
  timestamp: number;
}

/**
 * Third-Party Performance Monitor
 */
export class ThirdPartyPerformanceMonitor {
  private metrics: ThirdPartyMetrics;
  private scriptPerformance: Map<string, ScriptPerformance> = new Map();
  private subscribers: ((metrics: ThirdPartyMetrics) => void)[] = [];
  private baselinePageLoadTime: number = 0;

  constructor() {
    this.metrics = {
      totalScripts: 0,
      totalLoadTime: 0,
      averageLoadTime: 0,
      maxLoadTime: 0,
      minLoadTime: Infinity,
      impactPercentage: 0,
      errorCount: 0,
      successCount: 0,
    };

    // Get baseline page load time
    if (window.performance && window.performance.timing) {
      this.baselinePageLoadTime =
        window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    }
  }

  /**
   * Record script performance
   */
  recordScriptPerformance(performance: ScriptPerformance): void {
    this.scriptPerformance.set(performance.id, performance);

    this.metrics.totalScripts++;
    this.metrics.totalLoadTime += performance.loadTime;
    this.metrics.averageLoadTime = this.metrics.totalLoadTime / this.metrics.totalScripts;
    this.metrics.maxLoadTime = Math.max(this.metrics.maxLoadTime, performance.loadTime);
    this.metrics.minLoadTime = Math.min(this.metrics.minLoadTime, performance.loadTime);

    if (performance.status === 'success') {
      this.metrics.successCount++;
    } else {
      this.metrics.errorCount++;
    }

    // Calculate impact percentage
    this.calculateImpact();
    this.notifySubscribers();
  }

  /**
   * Calculate impact percentage
   */
  private calculateImpact(): void {
    if (this.baselinePageLoadTime === 0) return;

    const impactMs = this.metrics.totalLoadTime;
    this.metrics.impactPercentage = (impactMs / this.baselinePageLoadTime) * 100;
  }

  /**
   * Get script performance
   */
  getScriptPerformance(id: string): ScriptPerformance | undefined {
    return this.scriptPerformance.get(id);
  }

  /**
   * Get all script performance
   */
  getAllScriptPerformance(): ScriptPerformance[] {
    return Array.from(this.scriptPerformance.values());
  }

  /**
   * Get top slowest scripts
   */
  getTopSlowestScripts(limit: number = 5): ScriptPerformance[] {
    return Array.from(this.scriptPerformance.values())
      .sort((a, b) => b.loadTime - a.loadTime)
      .slice(0, limit);
  }

  /**
   * Get metrics
   */
  getMetrics(): ThirdPartyMetrics {
    return { ...this.metrics };
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    metrics: ThirdPartyMetrics;
    slowestScripts: ScriptPerformance[];
    successRate: number;
  } {
    return {
      metrics: this.getMetrics(),
      slowestScripts: this.getTopSlowestScripts(5),
      successRate:
        this.metrics.totalScripts > 0
          ? (this.metrics.successCount / this.metrics.totalScripts) * 100
          : 0,
    };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      totalScripts: 0,
      totalLoadTime: 0,
      averageLoadTime: 0,
      maxLoadTime: 0,
      minLoadTime: Infinity,
      impactPercentage: 0,
      errorCount: 0,
      successCount: 0,
    };
    this.scriptPerformance.clear();
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(callback: (metrics: ThirdPartyMetrics) => void): () => void {
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
   * Destroy monitor
   */
  destroy(): void {
    this.subscribers = [];
    this.scriptPerformance.clear();
  }
}

// Global instance
export const thirdPartyPerformanceMonitor = new ThirdPartyPerformanceMonitor();

/**
 * Record script performance
 */
export function recordScriptPerformance(performance: ScriptPerformance): void {
  thirdPartyPerformanceMonitor.recordScriptPerformance(performance);
}

/**
 * Get performance summary
 */
export function getPerformanceSummary() {
  return thirdPartyPerformanceMonitor.getPerformanceSummary();
}
