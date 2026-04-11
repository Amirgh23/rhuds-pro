/**
 * Advanced Caching System
 * Multi-level caching with LRU, TTL, and compression
 */

/**
 * Cache entry
 */
export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  timestamp: number;
  ttl?: number;
  hits: number;
  size: number;
  compressed: boolean;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  evictions: number;
  compressionRatio: number;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  maxSize: number;
  maxEntries: number;
  ttl?: number;
  compressionThreshold: number;
  enableCompression: boolean;
}

/**
 * Advanced Caching System
 * Multi-level caching with LRU eviction and TTL support
 */
export class AdvancedCachingSystem {
  private l1Cache: Map<string, CacheEntry> = new Map();
  private l2Cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalCompressed: 0,
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 50 * 1024 * 1024, // 50MB
      maxEntries: 10000,
      compressionThreshold: 1024, // 1KB
      enableCompression: true,
      ...config,
    };
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const serialized = JSON.stringify(value);
    const size = new Blob([serialized]).size;
    const compressed = this.config.enableCompression && size > this.config.compressionThreshold;

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
      size,
      compressed,
    };

    if (compressed) {
      this.stats.totalCompressed++;
    }

    // Try L1 cache first
    if (this.l1Cache.size < this.config.maxEntries) {
      this.l1Cache.set(key, entry);
    } else {
      // Move to L2 cache
      this.l2Cache.set(key, entry);
      this.evictLRU();
    }
  }

  /**
   * Get cache entry
   */
  get<T>(key: string): T | undefined {
    let entry = this.l1Cache.get(key);

    if (!entry) {
      entry = this.l2Cache.get(key);
      if (entry) {
        // Promote to L1
        this.l1Cache.set(key, entry);
        this.l2Cache.delete(key);
      }
    }

    if (entry) {
      // Check TTL
      if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
        this.delete(key);
        this.stats.misses++;
        return undefined;
      }

      entry.hits++;
      this.stats.hits++;
      return entry.value as T;
    }

    this.stats.misses++;
    return undefined;
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    const deleted1 = this.l1Cache.delete(key);
    const deleted2 = this.l2Cache.delete(key);
    return deleted1 || deleted2;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.l1Cache.clear();
    this.l2Cache.clear();
  }

  /**
   * Evict LRU entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruEntry: CacheEntry | null = null;

    // Find LRU in L1
    for (const [key, entry] of this.l1Cache) {
      if (!lruEntry || entry.hits < lruEntry.hits) {
        lruKey = key;
        lruEntry = entry;
      }
    }

    if (lruKey) {
      this.l1Cache.delete(lruKey);
      this.stats.evictions++;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalEntries = this.l1Cache.size + this.l2Cache.size;
    let totalSize = 0;

    for (const entry of this.l1Cache.values()) {
      totalSize += entry.size;
    }
    for (const entry of this.l2Cache.values()) {
      totalSize += entry.size;
    }

    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? this.stats.hits / total : 0;
    const missRate = total > 0 ? this.stats.misses / total : 0;

    return {
      totalEntries,
      totalSize,
      hitRate,
      missRate,
      evictions: this.stats.evictions,
      compressionRatio: this.stats.totalCompressed / Math.max(totalEntries, 1),
    };
  }

  /**
   * Warm cache with data
   */
  warmCache<T>(data: Record<string, T>, ttl?: number): void {
    for (const [key, value] of Object.entries(data)) {
      this.set(key, value, ttl);
    }
  }

  /**
   * Get cache size
   */
  getSize(): number {
    let size = 0;
    for (const entry of this.l1Cache.values()) {
      size += entry.size;
    }
    for (const entry of this.l2Cache.values()) {
      size += entry.size;
    }
    return size;
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return this.l1Cache.has(key) || this.l2Cache.has(key);
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(new Set([...this.l1Cache.keys(), ...this.l2Cache.keys()]));
  }

  /**
   * Invalidate by pattern
   */
  invalidateByPattern(pattern: RegExp): number {
    let count = 0;
    for (const key of this.keys()) {
      if (pattern.test(key)) {
        this.delete(key);
        count++;
      }
    }
    return count;
  }
}
