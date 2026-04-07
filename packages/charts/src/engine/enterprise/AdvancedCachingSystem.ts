/**
 * Advanced Caching System
 * Multi-level caching for performance optimization
 *
 * سیستم کش پیشرفته
 * کش چند سطحی برای بهینه سازی عملکرد
 */

import { EventEmitter } from 'events';

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
  size: number;
}

export interface CacheStats {
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  totalSize: number;
  entryCount: number;
  avgHits: number;
}

export interface CacheConfig {
  l1Size: number; // In-memory cache size (MB)
  l2Size: number; // Secondary cache size (MB)
  l3Size: number; // Tertiary cache size (MB)
  defaultTTL: number; // Default time-to-live (ms)
  adaptiveTTL: boolean;
  compressionEnabled: boolean;
}

export class AdvancedCachingSystem extends EventEmitter {
  private l1Cache: Map<string, CacheEntry<any>> = new Map();
  private l2Cache: Map<string, CacheEntry<any>> = new Map();
  private l3Cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;
  private stats = {
    l1Hits: 0,
    l2Hits: 0,
    l3Hits: 0,
    misses: 0,
  };

  constructor(config?: Partial<CacheConfig>) {
    super();
    this.config = {
      l1Size: 50, // 50MB
      l2Size: 200, // 200MB
      l3Size: 500, // 500MB
      defaultTTL: 60 * 60 * 1000, // 1 hour
      adaptiveTTL: true,
      compressionEnabled: false,
      ...config,
    };
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    // Try L1 cache
    let entry = this.l1Cache.get(key);
    if (entry && !this.isExpired(entry)) {
      entry.hits++;
      this.stats.l1Hits++;
      this.emit('cache:hit', { level: 'L1', key });
      return entry.value;
    }

    // Try L2 cache
    entry = this.l2Cache.get(key);
    if (entry && !this.isExpired(entry)) {
      entry.hits++;
      this.stats.l2Hits++;
      this.promoteToL1(key, entry);
      this.emit('cache:hit', { level: 'L2', key });
      return entry.value;
    }

    // Try L3 cache
    entry = this.l3Cache.get(key);
    if (entry && !this.isExpired(entry)) {
      entry.hits++;
      this.stats.l3Hits++;
      this.promoteToL1(key, entry);
      this.emit('cache:hit', { level: 'L3', key });
      return entry.value;
    }

    this.stats.misses++;
    this.emit('cache:miss', { key });
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
      ttl: ttl || this.config.defaultTTL,
      hits: 0,
      size,
    };

    // Determine which cache level to use based on size
    if (size < this.config.l1Size * 1024 * 1024) {
      this.setInL1(key, entry);
    } else if (size < this.config.l2Size * 1024 * 1024) {
      this.setInL2(key, entry);
    } else if (size < this.config.l3Size * 1024 * 1024) {
      this.setInL3(key, entry);
    }

    this.emit('cache:set', { key, size });
  }

  /**
   * Set in L1 cache
   */
  private setInL1(key: string, entry: CacheEntry<any>): void {
    // Check if we need to evict
    const totalSize = Array.from(this.l1Cache.values()).reduce((sum, e) => sum + e.size, 0);
    if (totalSize + entry.size > this.config.l1Size * 1024 * 1024) {
      this.evictFromL1();
    }

    this.l1Cache.set(key, entry);
  }

  /**
   * Set in L2 cache
   */
  private setInL2(key: string, entry: CacheEntry<any>): void {
    const totalSize = Array.from(this.l2Cache.values()).reduce((sum, e) => sum + e.size, 0);
    if (totalSize + entry.size > this.config.l2Size * 1024 * 1024) {
      this.evictFromL2();
    }

    this.l2Cache.set(key, entry);
  }

  /**
   * Set in L3 cache
   */
  private setInL3(key: string, entry: CacheEntry<any>): void {
    const totalSize = Array.from(this.l3Cache.values()).reduce((sum, e) => sum + e.size, 0);
    if (totalSize + entry.size > this.config.l3Size * 1024 * 1024) {
      this.evictFromL3();
    }

    this.l3Cache.set(key, entry);
  }

  /**
   * Promote entry to L1
   */
  private promoteToL1(key: string, entry: CacheEntry<any>): void {
    this.l2Cache.delete(key);
    this.l3Cache.delete(key);
    this.setInL1(key, entry);
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Estimate size of value
   */
  private estimateSize(value: any): number {
    if (typeof value === 'string') {
      return value.length;
    } else if (typeof value === 'number') {
      return 8;
    } else if (typeof value === 'boolean') {
      return 1;
    } else if (Array.isArray(value)) {
      return value.reduce((sum, item) => sum + this.estimateSize(item), 0);
    } else if (typeof value === 'object') {
      return JSON.stringify(value).length;
    }
    return 0;
  }

  /**
   * Evict from L1 cache (LRU)
   */
  private evictFromL1(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.l1Cache.entries()) {
      if (entry.timestamp < lruTime) {
        lruTime = entry.timestamp;
        lruKey = key;
      }
    }

    if (lruKey) {
      const entry = this.l1Cache.get(lruKey)!;
      this.l1Cache.delete(lruKey);
      this.setInL2(lruKey, entry);
      this.emit('cache:evict', { level: 'L1', key: lruKey });
    }
  }

  /**
   * Evict from L2 cache
   */
  private evictFromL2(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.l2Cache.entries()) {
      if (entry.timestamp < lruTime) {
        lruTime = entry.timestamp;
        lruKey = key;
      }
    }

    if (lruKey) {
      const entry = this.l2Cache.get(lruKey)!;
      this.l2Cache.delete(lruKey);
      this.setInL3(lruKey, entry);
      this.emit('cache:evict', { level: 'L2', key: lruKey });
    }
  }

  /**
   * Evict from L3 cache
   */
  private evictFromL3(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.l3Cache.entries()) {
      if (entry.timestamp < lruTime) {
        lruTime = entry.timestamp;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.l3Cache.delete(lruKey);
      this.emit('cache:evict', { level: 'L3', key: lruKey });
    }
  }

  /**
   * Clear cache
   */
  clear(level?: 'L1' | 'L2' | 'L3' | 'all'): void {
    if (level === 'L1' || level === 'all') {
      this.l1Cache.clear();
    }
    if (level === 'L2' || level === 'all') {
      this.l2Cache.clear();
    }
    if (level === 'L3' || level === 'all') {
      this.l3Cache.clear();
    }

    this.emit('cache:cleared', { level: level || 'all' });
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalHits = this.stats.l1Hits + this.stats.l2Hits + this.stats.l3Hits;
    const totalRequests = totalHits + this.stats.misses;
    const hitRate = totalRequests > 0 ? totalHits / totalRequests : 0;

    const l1Size = Array.from(this.l1Cache.values()).reduce((sum, e) => sum + e.size, 0);
    const l2Size = Array.from(this.l2Cache.values()).reduce((sum, e) => sum + e.size, 0);
    const l3Size = Array.from(this.l3Cache.values()).reduce((sum, e) => sum + e.size, 0);
    const totalSize = l1Size + l2Size + l3Size;

    const entryCount = this.l1Cache.size + this.l2Cache.size + this.l3Cache.size;
    const avgHits = entryCount > 0 ? totalHits / entryCount : 0;

    return {
      totalHits,
      totalMisses: this.stats.misses,
      hitRate,
      totalSize,
      entryCount,
      avgHits,
    };
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void {
    this.l1Cache.delete(key);
    this.l2Cache.delete(key);
    this.l3Cache.delete(key);
    this.emit('cache:invalidated', { key });
  }

  /**
   * Invalidate by pattern
   */
  invalidatePattern(pattern: RegExp): void {
    let count = 0;

    for (const key of this.l1Cache.keys()) {
      if (pattern.test(key)) {
        this.l1Cache.delete(key);
        count++;
      }
    }

    for (const key of this.l2Cache.keys()) {
      if (pattern.test(key)) {
        this.l2Cache.delete(key);
        count++;
      }
    }

    for (const key of this.l3Cache.keys()) {
      if (pattern.test(key)) {
        this.l3Cache.delete(key);
        count++;
      }
    }

    this.emit('cache:pattern-invalidated', { pattern: pattern.source, count });
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): void {
    let count = 0;

    for (const [key, entry] of this.l1Cache.entries()) {
      if (this.isExpired(entry)) {
        this.l1Cache.delete(key);
        count++;
      }
    }

    for (const [key, entry] of this.l2Cache.entries()) {
      if (this.isExpired(entry)) {
        this.l2Cache.delete(key);
        count++;
      }
    }

    for (const [key, entry] of this.l3Cache.entries()) {
      if (this.isExpired(entry)) {
        this.l3Cache.delete(key);
        count++;
      }
    }

    this.emit('cache:cleanup', { count });
  }

  /**
   * Get cache info
   */
  getInfo(): {
    l1: { size: number; entries: number };
    l2: { size: number; entries: number };
    l3: { size: number; entries: number };
  } {
    const l1Size = Array.from(this.l1Cache.values()).reduce((sum, e) => sum + e.size, 0);
    const l2Size = Array.from(this.l2Cache.values()).reduce((sum, e) => sum + e.size, 0);
    const l3Size = Array.from(this.l3Cache.values()).reduce((sum, e) => sum + e.size, 0);

    return {
      l1: { size: l1Size, entries: this.l1Cache.size },
      l2: { size: l2Size, entries: this.l2Cache.size },
      l3: { size: l3Size, entries: this.l3Cache.size },
    };
  }
}
