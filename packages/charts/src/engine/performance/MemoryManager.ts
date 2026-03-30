/**
 * Memory Manager
 * Manages memory usage and cleanup
 */

import type { ChartElement } from '../elements/index';

export interface MemoryStats {
  elementCount: number;
  estimatedMemory: number;
  animationCallbacks: number;
  timestamp: number;
}

export class MemoryManager {
  private elementPool: ChartElement[] = [];
  private animationCallbacks: Set<() => void> = new Set();
  private stats: MemoryStats[] = [];
  private maxStatsHistory: number = 100;

  /**
   * Reuse element from pool
   */
  reuseElement<T extends ChartElement>(ElementClass: new () => T): T {
    if (this.elementPool.length > 0) {
      const element = this.elementPool.pop() as T;
      // Reset element state
      element.x = 0;
      element.y = 0;
      element.options = {};
      return element;
    }

    return new ElementClass();
  }

  /**
   * Return element to pool
   */
  returnElement(element: ChartElement): void {
    // Clear element data
    element.x = 0;
    element.y = 0;
    element.options = {};

    this.elementPool.push(element);
  }

  /**
   * Register animation callback
   */
  registerAnimationCallback(callback: () => void): void {
    this.animationCallbacks.add(callback);
  }

  /**
   * Unregister animation callback
   */
  unregisterAnimationCallback(callback: () => void): void {
    this.animationCallbacks.delete(callback);
  }

  /**
   * Get animation callback count
   */
  getAnimationCallbackCount(): number {
    return this.animationCallbacks.size;
  }

  /**
   * Clear animation callbacks
   */
  clearAnimationCallbacks(): void {
    this.animationCallbacks.clear();
  }

  /**
   * Record memory stats
   */
  recordStats(elementCount: number): void {
    const stats: MemoryStats = {
      elementCount,
      estimatedMemory: elementCount * 200, // Rough estimate
      animationCallbacks: this.animationCallbacks.size,
      timestamp: Date.now(),
    };

    this.stats.push(stats);

    // Keep only recent stats
    if (this.stats.length > this.maxStatsHistory) {
      this.stats.shift();
    }
  }

  /**
   * Get memory stats
   */
  getStats(): MemoryStats[] {
    return [...this.stats];
  }

  /**
   * Get latest stats
   */
  getLatestStats(): MemoryStats | undefined {
    return this.stats[this.stats.length - 1];
  }

  /**
   * Get average memory usage
   */
  getAverageMemoryUsage(): number {
    if (this.stats.length === 0) return 0;

    const total = this.stats.reduce((sum, s) => sum + s.estimatedMemory, 0);
    return total / this.stats.length;
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.elementPool = [];
    this.animationCallbacks.clear();
    this.stats = [];
  }

  /**
   * Get memory report
   */
  getMemoryReport(): string {
    const latest = this.getLatestStats();
    if (!latest) return 'No memory stats available';

    return `
Memory Report:
- Elements: ${latest.elementCount}
- Estimated Memory: ${(latest.estimatedMemory / 1024).toFixed(2)} KB
- Animation Callbacks: ${latest.animationCallbacks}
- Average Memory: ${(this.getAverageMemoryUsage() / 1024).toFixed(2)} KB
    `.trim();
  }
}

export default MemoryManager;
