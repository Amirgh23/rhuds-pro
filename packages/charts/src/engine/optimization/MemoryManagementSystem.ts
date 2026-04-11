/**
 * Memory Management System
 * Optimizes memory usage and detects memory leaks
 */

export interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  arrayBuffers: number;
}

export interface MemoryLeak {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  growthRate: number;
  estimatedLeakSize: number;
  firstDetected: number;
  lastDetected: number;
  recommendation: string;
}

export interface MemoryOptimization {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedSavings: number;
  effort: 'low' | 'medium' | 'high';
}

/**
 * Memory Management System
 * Tracks and optimizes memory usage
 */
export class MemoryManagementSystem {
  private snapshots: MemorySnapshot[] = [];
  private detectedLeaks: Map<string, MemoryLeak> = new Map();
  private objectRegistry: Map<string, number> = new Map();
  private thresholds = {
    heapUsagePercent: 85,
    growthRateThreshold: 0.1, // 10% growth
    leakDetectionWindow: 60000, // 1 minute
  };

  /**
   * Take a memory snapshot
   */
  public takeSnapshot(): MemorySnapshot {
    const memUsage = process.memoryUsage();

    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      arrayBuffers: memUsage.arrayBuffers || 0,
    };

    this.snapshots.push(snapshot);

    // Keep only last 1000 snapshots
    if (this.snapshots.length > 1000) {
      this.snapshots.shift();
    }

    // Analyze for leaks
    this.analyzeForLeaks();

    return snapshot;
  }

  /**
   * Analyze snapshots for memory leaks
   */
  private analyzeForLeaks(): void {
    if (this.snapshots.length < 2) return;

    const recent = this.snapshots.slice(-10);
    const oldest = recent[0];
    const newest = recent[recent.length - 1];

    const timeDiff = newest.timestamp - oldest.timestamp;
    const heapDiff = newest.heapUsed - oldest.heapUsed;
    const growthRate = heapDiff / oldest.heapUsed;

    // Detect potential leak
    if (
      growthRate > this.thresholds.growthRateThreshold &&
      timeDiff < this.thresholds.leakDetectionWindow
    ) {
      const leakId = `leak-${Date.now()}`;
      const leak: MemoryLeak = {
        id: leakId,
        name: `Memory Leak ${this.detectedLeaks.size + 1}`,
        severity: this.calculateLeakSeverity(growthRate, heapDiff),
        growthRate,
        estimatedLeakSize: heapDiff,
        firstDetected: oldest.timestamp,
        lastDetected: newest.timestamp,
        recommendation: this.getLeakRecommendation(growthRate),
      };

      this.detectedLeaks.set(leakId, leak);
    }
  }

  /**
   * Calculate leak severity
   */
  private calculateLeakSeverity(
    growthRate: number,
    heapDiff: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (growthRate > 0.5 || heapDiff > 100 * 1024 * 1024) return 'critical';
    if (growthRate > 0.3 || heapDiff > 50 * 1024 * 1024) return 'high';
    if (growthRate > 0.15 || heapDiff > 10 * 1024 * 1024) return 'medium';
    return 'low';
  }

  /**
   * Get leak recommendation
   */
  private getLeakRecommendation(growthRate: number): string {
    if (growthRate > 0.5) {
      return 'Critical memory leak detected. Check for circular references and ensure proper cleanup.';
    }
    if (growthRate > 0.3) {
      return 'Significant memory growth detected. Review event listeners and timers.';
    }
    return 'Moderate memory growth detected. Consider implementing memory pooling.';
  }

  /**
   * Register object for tracking
   */
  public registerObject(name: string, size: number): void {
    const current = this.objectRegistry.get(name) || 0;
    this.objectRegistry.set(name, current + size);
  }

  /**
   * Unregister object
   */
  public unregisterObject(name: string, size: number): void {
    const current = this.objectRegistry.get(name) || 0;
    const newSize = Math.max(0, current - size);
    if (newSize === 0) {
      this.objectRegistry.delete(name);
    } else {
      this.objectRegistry.set(name, newSize);
    }
  }

  /**
   * Get memory statistics
   */
  public getStatistics(): Record<string, unknown> {
    if (this.snapshots.length === 0) {
      return {
        snapshotCount: 0,
        detectedLeaks: 0,
        objectRegistry: Object.fromEntries(this.objectRegistry),
      };
    }

    const latest = this.snapshots[this.snapshots.length - 1];
    const heapUsagePercent = (latest.heapUsed / latest.heapTotal) * 100;

    return {
      snapshotCount: this.snapshots.length,
      latestSnapshot: latest,
      heapUsagePercent,
      detectedLeaks: this.detectedLeaks.size,
      objectRegistry: Object.fromEntries(this.objectRegistry),
      isHighMemoryUsage: heapUsagePercent > this.thresholds.heapUsagePercent,
    };
  }

  /**
   * Get detected leaks
   */
  public getDetectedLeaks(): MemoryLeak[] {
    return Array.from(this.detectedLeaks.values()).sort((a, b) => {
      const severityMap = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityMap[b.severity] - severityMap[a.severity];
    });
  }

  /**
   * Generate memory optimizations
   */
  public generateOptimizations(): MemoryOptimization[] {
    const optimizations: MemoryOptimization[] = [];

    // Check for high memory usage
    if (this.snapshots.length > 0) {
      const latest = this.snapshots[this.snapshots.length - 1];
      const heapUsagePercent = (latest.heapUsed / latest.heapTotal) * 100;

      if (heapUsagePercent > this.thresholds.heapUsagePercent) {
        optimizations.push({
          id: `opt-heap-${Date.now()}`,
          title: 'Reduce Heap Usage',
          description: 'Implement object pooling and lazy loading to reduce memory footprint',
          priority: 'high',
          estimatedSavings: latest.heapUsed * 0.2,
          effort: 'medium',
        });
      }
    }

    // Check for detected leaks
    for (const leak of this.getDetectedLeaks()) {
      optimizations.push({
        id: `opt-${leak.id}`,
        title: `Fix ${leak.name}`,
        description: leak.recommendation,
        priority: leak.severity === 'critical' ? 'critical' : 'high',
        estimatedSavings: leak.estimatedLeakSize,
        effort: 'high',
      });
    }

    // Check for large objects
    const largeObjects = Array.from(this.objectRegistry.entries())
      .filter(([, size]) => size > 10 * 1024 * 1024)
      .sort((a, b) => b[1] - a[1]);

    for (const [name, size] of largeObjects.slice(0, 3)) {
      optimizations.push({
        id: `opt-obj-${name}`,
        title: `Optimize ${name}`,
        description: `This object uses ${(size / 1024 / 1024).toFixed(2)}MB. Consider compression or lazy loading.`,
        priority: 'medium',
        estimatedSavings: size * 0.3,
        effort: 'medium',
      });
    }

    return optimizations;
  }

  /**
   * Get memory trend
   */
  public getMemoryTrend(windowSize: number = 10): Record<string, unknown> {
    if (this.snapshots.length < 2) {
      return { trend: 'insufficient_data' };
    }

    const recent = this.snapshots.slice(-windowSize);
    const heapUsages = recent.map((s) => s.heapUsed);
    const avgHeap = heapUsages.reduce((a, b) => a + b, 0) / heapUsages.length;
    const maxHeap = Math.max(...heapUsages);
    const minHeap = Math.min(...heapUsages);

    const trend = heapUsages[heapUsages.length - 1] > avgHeap ? 'increasing' : 'decreasing';

    return {
      trend,
      averageHeap: avgHeap,
      maxHeap,
      minHeap,
      currentHeap: heapUsages[heapUsages.length - 1],
      variance: this.calculateVariance(heapUsages),
    };
  }

  /**
   * Calculate variance
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Set threshold
   */
  public setThreshold(key: string, value: number): void {
    if (key in this.thresholds) {
      this.thresholds[key as keyof typeof this.thresholds] = value;
    }
  }

  /**
   * Clear old snapshots
   */
  public clearOldSnapshots(olderThanMs: number): void {
    const cutoffTime = Date.now() - olderThanMs;
    this.snapshots = this.snapshots.filter((s) => s.timestamp > cutoffTime);
  }

  /**
   * Export memory data
   */
  public exportData(): Record<string, unknown> {
    return {
      snapshots: this.snapshots,
      detectedLeaks: Array.from(this.detectedLeaks.values()),
      objectRegistry: Object.fromEntries(this.objectRegistry),
      statistics: this.getStatistics(),
      trend: this.getMemoryTrend(),
      optimizations: this.generateOptimizations(),
    };
  }
}
