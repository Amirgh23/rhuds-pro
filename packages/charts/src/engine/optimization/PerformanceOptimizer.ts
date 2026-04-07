/**
 * Performance Optimizer
 * Caching, lazy loading, and rendering optimization
 */

export interface CacheEntry {
  id: string;
  key: string;
  value: any;
  timestamp: Date;
  ttl?: number;
  hits: number;
}

export interface OptimizationProfile {
  id: string;
  name: string;
  cacheSize: number;
  lazyLoadThreshold: number;
  renderBatchSize: number;
  compressionEnabled: boolean;
}

export interface PerformanceMetrics {
  renderTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  dataSize: number;
}

/**
 * Performance Optimizer
 */
export class PerformanceOptimizer {
  private cache: Map<string, CacheEntry> = new Map();
  private profiles: Map<string, OptimizationProfile> = new Map();
  private metrics: PerformanceMetrics[] = [];
  private listeners: Map<string, Function[]> = new Map();
  private maxCacheSize: number = 1000;

  constructor() {
    this.initializeDefaultProfiles();
  }

  /**
   * Initialize default profiles
   */
  private initializeDefaultProfiles(): void {
    const defaultProfile: OptimizationProfile = {
      id: 'default',
      name: 'Default Profile',
      cacheSize: 1000,
      lazyLoadThreshold: 100,
      renderBatchSize: 50,
      compressionEnabled: true,
    };

    const aggressiveProfile: OptimizationProfile = {
      id: 'aggressive',
      name: 'Aggressive Profile',
      cacheSize: 5000,
      lazyLoadThreshold: 50,
      renderBatchSize: 100,
      compressionEnabled: true,
    };

    this.profiles.set('default', defaultProfile);
    this.profiles.set('aggressive', aggressiveProfile);
  }

  /**
   * Cache data
   */
  public cache(key: string, value: any, ttl?: number): CacheEntry {
    const id = this.generateId();

    const entry: CacheEntry = {
      id,
      key,
      value,
      timestamp: new Date(),
      ttl,
      hits: 0,
    };

    this.cache.set(key, entry);

    // Enforce cache size limit
    if (this.cache.size > this.maxCacheSize) {
      const oldestKey = Array.from(this.cache.entries()).sort(
        (a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime()
      )[0][0];
      this.cache.delete(oldestKey);
    }

    this.emit('cache:stored', { key, size: this.cache.size });

    return entry;
  }

  /**
   * Get from cache
   */
  public getFromCache(key: string): any | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check TTL
    if (entry.ttl && Date.now() - entry.timestamp.getTime() > entry.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    entry.hits++;
    this.emit('cache:hit', { key, hits: entry.hits });

    return entry.value;
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
    this.emit('cache:cleared', {});
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    size: number;
    entries: number;
    hitRate: number;
    totalHits: number;
  } {
    const entries = Array.from(this.cache.values());
    const totalHits = entries.reduce((sum, e) => sum + e.hits, 0);
    const hitRate = entries.length > 0 ? totalHits / entries.length : 0;

    return {
      size: this.cache.size,
      entries: entries.length,
      hitRate,
      totalHits,
    };
  }

  /**
   * Create profile
   */
  public createProfile(
    name: string,
    cacheSize: number,
    lazyLoadThreshold: number,
    renderBatchSize: number,
    compressionEnabled: boolean
  ): OptimizationProfile {
    const id = this.generateId();

    const profile: OptimizationProfile = {
      id,
      name,
      cacheSize,
      lazyLoadThreshold,
      renderBatchSize,
      compressionEnabled,
    };

    this.profiles.set(id, profile);
    this.emit('profile:created', { profileId: id, name });

    return profile;
  }

  /**
   * Get profile
   */
  public getProfile(profileId: string): OptimizationProfile | undefined {
    return this.profiles.get(profileId);
  }

  /**
   * List profiles
   */
  public listProfiles(): OptimizationProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Apply profile
   */
  public applyProfile(profileId: string): boolean {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      return false;
    }

    this.maxCacheSize = profile.cacheSize;
    this.emit('profile:applied', { profileId });

    return true;
  }

  /**
   * Record metrics
   */
  public recordMetrics(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics);

    // Keep only recent metrics
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }

    this.emit('metrics:recorded', metrics);
  }

  /**
   * Get metrics
   */
  public getMetrics(limit: number = 100): PerformanceMetrics[] {
    return this.metrics.slice(-limit);
  }

  /**
   * Get average metrics
   */
  public getAverageMetrics(): PerformanceMetrics | null {
    if (this.metrics.length === 0) {
      return null;
    }

    const avg = {
      renderTime: 0,
      cacheHitRate: 0,
      memoryUsage: 0,
      dataSize: 0,
    };

    this.metrics.forEach((m) => {
      avg.renderTime += m.renderTime;
      avg.cacheHitRate += m.cacheHitRate;
      avg.memoryUsage += m.memoryUsage;
      avg.dataSize += m.dataSize;
    });

    const count = this.metrics.length;

    return {
      renderTime: avg.renderTime / count,
      cacheHitRate: avg.cacheHitRate / count,
      memoryUsage: avg.memoryUsage / count,
      dataSize: avg.dataSize / count,
    };
  }

  /**
   * Optimize data
   */
  public optimizeData(data: any[], batchSize: number = 50): any[][] {
    const batches: any[][] = [];

    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    this.emit('data:optimized', { batchCount: batches.length });

    return batches;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Destroy manager
   */
  public destroy(): void {
    this.cache.clear();
    this.profiles.clear();
    this.metrics = [];
    this.listeners.clear();
  }
}

export default PerformanceOptimizer;
