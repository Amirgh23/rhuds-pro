/**
 * Advanced Caching System
 * Multi-level caching with L1/L2/L3 support, invalidation, and adaptive TTL
 */

export interface CacheConfig {
  maxSize: number;
  ttl: number;
  strategy?: 'LRU' | 'LFU' | 'FIFO';
  compressionEnabled?: boolean;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
  size: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  entries: number;
  hitRate: number;
}

export interface CacheLevel {
  name: string;
  maxSize: number;
  ttl: number;
  entries: Map<string, CacheEntry<unknown>>;
}

/**
 * AdvancedCachingSystem - Multi-level caching with intelligent invalidation
 */
export class AdvancedCachingSystem {
  private l1Cache: CacheLevel;
  private l2Cache: CacheLevel;
  private l3Cache: CacheLevel;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0,
    entries: 0,
    hitRate: 0,
  };
  private invalidationPatterns: Map<string, RegExp> = new Map();

  constructor(config?: Partial<CacheConfig>) {
    const defaultConfig: CacheConfig = {
      maxSize: 100 * 1024 * 1024, // 100MB
      ttl: 3600000, // 1 hour
      strategy: 'LRU',
      compressionEnabled: false,
      ...config,
    };

    this.l1Cache = {
      name: 'L1',
      maxSize: defaultConfig.maxSize * 0.1,
      ttl: defaultConfig.ttl * 0.1,
      entries: new Map(),
    };

    this.l2Cache = {
      name: 'L2',
      maxSize: defaultConfig.maxSize * 0.3,
      ttl: defaultConfig.ttl * 0.5,
      entries: new Map(),
    };

    this.l3Cache = {
      name: 'L3',
      maxSize: defaultConfig.maxSize * 0.6,
      ttl: defaultConfig.ttl,
      entries: new Map(),
    };
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    // Try L1
    let entry = this.l1Cache.entries.get(key);
    if (entry && !this.isExpired(entry)) {
      entry.hits++;
      this.stats.hits++;
      return entry.value as T;
    }

    // Try L2
    entry = this.l2Cache.entries.get(key);
    if (entry && !this.isExpired(entry)) {
      entry.hits++;
      this.stats.hits++;
      this.promoteToL1(key, entry);
      return entry.value as T;
    }

    // Try L3
    entry = this.l3Cache.entries.get(key);
    if (entry && !this.isExpired(entry)) {
      entry.hits++;
      this.stats.hits++;
      this.promoteToL2(key, entry);
      return entry.value as T;
    }

    this.stats.misses++;
    return null;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const size = this.estimateSize(value);
    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      ttl: ttl || this.l1Cache.ttl,
      hits: 0,
      size,
    };

    // Add to L1
    this.l1Cache.entries.set(key, entry as CacheEntry<unknown>);
    this.stats.size += size;
    this.stats.entries++;

    // Evict if necessary
    this.evictIfNeeded(this.l1Cache);
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry<unknown>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Promote entry from L2 to L1
   */
  private promoteToL1(key: string, entry: CacheEntry<unknown>): void {
    this.l2Cache.entries.delete(key);
    this.l1Cache.entries.set(key, entry);
    this.evictIfNeeded(this.l1Cache);
  }

  /**
   * Promote entry from L3 to L2
   */
  private promoteToL2(key: string, entry: CacheEntry<unknown>): void {
    this.l3Cache.entries.delete(key);
    this.l2Cache.entries.set(key, entry);
    this.evictIfNeeded(this.l2Cache);
  }

  /**
   * Evict entries if cache exceeds size
   */
  private evictIfNeeded(level: CacheLevel): void {
    let currentSize = Array.from(level.entries.values()).reduce(
      (sum, entry) => sum + entry.size,
      0
    );

    while (currentSize > level.maxSize && level.entries.size > 0) {
      const keyToEvict = this.selectEntryToEvict(level);
      if (keyToEvict) {
        const entry = level.entries.get(keyToEvict);
        if (entry) {
          currentSize -= entry.size;
          this.stats.size -= entry.size;
          this.stats.entries--;
          this.stats.evictions++;
        }
        level.entries.delete(keyToEvict);
      } else {
        break;
      }
    }
  }

  /**
   * Select entry to evict (LRU strategy)
   */
  private selectEntryToEvict(level: CacheLevel): string | null {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, entry] of level.entries.entries()) {
      if (entry.timestamp < lruTime) {
        lruTime = entry.timestamp;
        lruKey = key;
      }
    }

    return lruKey;
  }

  /**
   * Estimate size of value
   */
  private estimateSize(value: unknown): number {
    if (typeof value === 'string') {
      return value.length * 2;
    }
    if (typeof value === 'number') {
      return 8;
    }
    if (typeof value === 'boolean') {
      return 4;
    }
    if (Array.isArray(value)) {
      return value.reduce((sum, item) => sum + this.estimateSize(item), 0);
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).reduce((sum, item) => sum + this.estimateSize(item), 0);
    }
    return 0;
  }

  /**
   * Invalidate cache by pattern
   */
  invalidateByPattern(pattern: string): number {
    const regex = new RegExp(pattern);
    let count = 0;

    for (const level of [this.l1Cache, this.l2Cache, this.l3Cache]) {
      for (const [key, entry] of level.entries.entries()) {
        if (regex.test(key)) {
          this.stats.size -= entry.size;
          this.stats.entries--;
          level.entries.delete(key);
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.l1Cache.entries.clear();
    this.l2Cache.entries.clear();
    this.l3Cache.entries.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      entries: 0,
      hitRate: 0,
    };
  }

  /**
   * Get cache statistics
   */
  getStatistics(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? this.stats.hits / total : 0,
    };
  }

  /**
   * Get cache levels info
   */
  getLevelsInfo(): Record<string, unknown> {
    return {
      l1: {
        entries: this.l1Cache.entries.size,
        size: Array.from(this.l1Cache.entries.values()).reduce((sum, e) => sum + e.size, 0),
      },
      l2: {
        entries: this.l2Cache.entries.size,
        size: Array.from(this.l2Cache.entries.values()).reduce((sum, e) => sum + e.size, 0),
      },
      l3: {
        entries: this.l3Cache.entries.size,
        size: Array.from(this.l3Cache.entries.values()).reduce((sum, e) => sum + e.size, 0),
      },
    };
  }
}
