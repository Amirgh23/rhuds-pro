/**
 * Data Cache Manager
 * مدیریت ذخیره‌سازی هوشمند داده‌ها
 */
export class DataCache {
  private cache: Map<string, any> = new Map();
  private timestamps: Map<string, number> = new Map();
  private ttl: number = 5 * 60 * 1000; // 5 minutes default
  private maxSize: number = 100;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(ttl?: number, maxSize?: number) {
    if (ttl) this.ttl = ttl;
    if (maxSize) this.maxSize = maxSize;
    this.startCleanup();
  }

  /**
   * Get cached data
   * داده‌های ذخیره‌شده را بازیابی می‌کند
   */
  get(key: string): any | null {
    const timestamp = this.timestamps.get(key);
    if (!timestamp) return null;

    // Check if expired
    if (Date.now() - timestamp > this.ttl) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  /**
   * Set cache data
   * داده را در کش ذخیره می‌کند
   */
  set(key: string, value: any): void {
    // Check size limit
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.timestamps.clear();
  }

  /**
   * Evict oldest entry
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, timestamp] of this.timestamps.entries()) {
      if (timestamp < oldestTime) {
        oldestTime = timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, timestamp] of this.timestamps.entries()) {
        if (now - timestamp > this.ttl) {
          this.delete(key);
        }
      }
    }, this.ttl / 2);
  }

  /**
   * Stop cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
    };
  }
}
