/**
 * Edge Caching Utilities
 * Implements edge caching strategies using Cloudflare Workers
 */

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  sMaxAge?: number; // Shared max age for CDN
  private?: boolean; // Private cache only
  public?: boolean; // Public cache
  immutable?: boolean; // Immutable content
  staleWhileRevalidate?: number; // Stale-while-revalidate in seconds
  staleIfError?: number; // Stale-if-error in seconds
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
  averageLatency: number;
  edgeLatency: number;
  originLatency: number;
}

export interface CacheEntry {
  key: string;
  value: any;
  timestamp: number;
  ttl: number;
  hits: number;
  lastAccessed: number;
}

/**
 * Default cache configurations for different content types
 */
export const CACHE_CONFIGS = {
  // Static assets - cache for 1 year
  static: {
    ttl: 31536000,
    sMaxAge: 31536000,
    public: true,
    immutable: true,
  } as CacheConfig,

  // HTML pages - cache for 1 hour with stale-while-revalidate
  html: {
    ttl: 3600,
    sMaxAge: 3600,
    public: true,
    staleWhileRevalidate: 86400,
    staleIfError: 604800,
  } as CacheConfig,

  // API responses - cache for 5 minutes
  api: {
    ttl: 300,
    sMaxAge: 300,
    public: true,
    staleWhileRevalidate: 3600,
  } as CacheConfig,

  // Images - cache for 30 days
  images: {
    ttl: 2592000,
    sMaxAge: 2592000,
    public: true,
    immutable: true,
  } as CacheConfig,

  // Fonts - cache for 1 year
  fonts: {
    ttl: 31536000,
    sMaxAge: 31536000,
    public: true,
    immutable: true,
  } as CacheConfig,

  // CSS/JS - cache for 30 days
  scripts: {
    ttl: 2592000,
    sMaxAge: 2592000,
    public: true,
    immutable: true,
  } as CacheConfig,
};

/**
 * Generate cache control header
 */
export function generateCacheControlHeader(config: CacheConfig): string {
  const parts: string[] = [];

  if (config.public) parts.push('public');
  if (config.private) parts.push('private');
  if (config.immutable) parts.push('immutable');

  parts.push(`max-age=${config.ttl}`);

  if (config.sMaxAge) {
    parts.push(`s-maxage=${config.sMaxAge}`);
  }

  if (config.staleWhileRevalidate) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  if (config.staleIfError) {
    parts.push(`stale-if-error=${config.staleIfError}`);
  }

  return parts.join(', ');
}

/**
 * Get cache config for URL
 */
export function getCacheConfigForUrl(url: string): CacheConfig {
  if (url.match(/\.(js|css)$/)) return CACHE_CONFIGS.scripts;
  if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return CACHE_CONFIGS.images;
  if (url.match(/\.(woff|woff2|ttf|eot)$/)) return CACHE_CONFIGS.fonts;
  if (url.match(/\.html$/)) return CACHE_CONFIGS.html;
  if (url.match(/^\/api\//)) return CACHE_CONFIGS.api;
  return CACHE_CONFIGS.static;
}

/**
 * Edge cache manager
 */
export class EdgeCacheManager {
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalRequests: 0,
    averageLatency: 0,
    edgeLatency: 0,
    originLatency: 0,
  };

  private cache: Map<string, CacheEntry> = new Map();

  /**
   * Get from cache
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.metrics.misses++;
      this.updateMetrics();
      return null;
    }

    // Check if expired
    const now = Date.now();
    const age = (now - entry.timestamp) / 1000;

    if (age > entry.ttl) {
      this.cache.delete(key);
      this.metrics.misses++;
      this.updateMetrics();
      return null;
    }

    // Update metrics
    entry.hits++;
    entry.lastAccessed = now;
    this.metrics.hits++;
    this.updateMetrics();

    return entry.value;
  }

  /**
   * Set in cache
   */
  set(key: string, value: any, ttl: number = 3600): void {
    this.cache.set(key, {
      key,
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Delete from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache metrics
   */
  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  /**
   * Update metrics
   */
  private updateMetrics(): void {
    this.metrics.totalRequests = this.metrics.hits + this.metrics.misses;
    this.metrics.hitRate =
      this.metrics.totalRequests > 0 ? (this.metrics.hits / this.metrics.totalRequests) * 100 : 0;
  }

  /**
   * Get cache size
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * Get cache entries
   */
  getEntries(): CacheEntry[] {
    return Array.from(this.cache.values());
  }

  /**
   * Prune expired entries
   */
  prune(): number {
    const now = Date.now();
    let pruned = 0;

    for (const [key, entry] of this.cache.entries()) {
      const age = (now - entry.timestamp) / 1000;
      if (age > entry.ttl) {
        this.cache.delete(key);
        pruned++;
      }
    }

    return pruned;
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    entries: number;
    hitRate: number;
    totalRequests: number;
    averageHits: number;
  } {
    const entries = this.getEntries();
    const averageHits =
      entries.length > 0 ? entries.reduce((sum, e) => sum + e.hits, 0) / entries.length : 0;

    return {
      size: this.cache.size,
      entries: entries.length,
      hitRate: this.metrics.hitRate,
      totalRequests: this.metrics.totalRequests,
      averageHits,
    };
  }
}

/**
 * Global edge cache manager instance
 */
export const edgeCacheManager = new EdgeCacheManager();

/**
 * Fetch with edge caching
 */
export async function fetchWithEdgeCache(url: string, options?: RequestInit): Promise<Response> {
  const cacheKey = `${url}:${JSON.stringify(options || {})}`;
  const cached = edgeCacheManager.get(cacheKey);

  if (cached) {
    return new Response(cached, {
      headers: {
        'X-Cache': 'HIT',
        'X-Cache-Key': cacheKey,
      },
    });
  }

  const response = await fetch(url, options);
  const config = getCacheConfigForUrl(url);

  if (response.ok) {
    const cloned = response.clone();
    const data = await cloned.text();
    edgeCacheManager.set(cacheKey, data, config.ttl);
  }

  return response;
}

/**
 * Invalidate cache by pattern
 */
export function invalidateCacheByPattern(pattern: RegExp): number {
  const entries = edgeCacheManager.getEntries();
  let invalidated = 0;

  for (const entry of entries) {
    if (pattern.test(entry.key)) {
      edgeCacheManager.delete(entry.key);
      invalidated++;
    }
  }

  return invalidated;
}

/**
 * Invalidate cache by prefix
 */
export function invalidateCacheByPrefix(prefix: string): number {
  return invalidateCacheByPattern(new RegExp(`^${prefix}`));
}

/**
 * Warm cache with URLs
 */
export async function warmCache(urls: string[]): Promise<void> {
  for (const url of urls) {
    try {
      await fetchWithEdgeCache(url);
    } catch (error) {
      console.error(`Failed to warm cache for ${url}:`, error);
    }
  }
}

export default edgeCacheManager;
