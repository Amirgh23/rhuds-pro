/**
 * Cloudflare Workers Cache Strategy
 * Handles edge caching for RHUDS Pro application
 */

interface CacheConfig {
  ttl: number;
  staleWhileRevalidate?: number;
  immutable?: boolean;
  cacheKey?: string;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  timestamp: number;
}

// Cache configurations for different content types
const CACHE_CONFIGS: Record<string, CacheConfig> = {
  // Static assets - cache forever
  static: {
    ttl: 31536000, // 1 year
    immutable: true,
  },
  // HTML pages - cache with revalidation
  html: {
    ttl: 3600, // 1 hour
    staleWhileRevalidate: 86400, // 24 hours
  },
  // API responses - short cache
  api: {
    ttl: 300, // 5 minutes
    staleWhileRevalidate: 3600, // 1 hour
  },
  // Images - long cache
  images: {
    ttl: 2592000, // 30 days
    immutable: true,
  },
  // Fonts - cache forever
  fonts: {
    ttl: 31536000, // 1 year
    immutable: true,
  },
  // Scripts - long cache
  scripts: {
    ttl: 2592000, // 30 days
    immutable: true,
  },
};

// Cache metrics storage
let cacheMetrics: CacheMetrics = {
  hits: 0,
  misses: 0,
  timestamp: Date.now(),
};

/**
 * Determine cache configuration based on URL
 */
function getCacheConfig(url: string): CacheConfig {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;

  // Static assets
  if (/\.(js|css|woff2?|ttf|eot)$/i.test(pathname)) {
    return CACHE_CONFIGS.static;
  }

  // Images
  if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(pathname)) {
    return CACHE_CONFIGS.images;
  }

  // Fonts
  if (/\.(woff2?|ttf|eot|otf)$/i.test(pathname)) {
    return CACHE_CONFIGS.fonts;
  }

  // API endpoints
  if (pathname.startsWith('/api/')) {
    return CACHE_CONFIGS.api;
  }

  // HTML pages
  if (pathname.endsWith('.html') || pathname === '/' || !pathname.includes('.')) {
    return CACHE_CONFIGS.html;
  }

  // Default to HTML config
  return CACHE_CONFIGS.html;
}

/**
 * Generate cache key from request
 */
function generateCacheKey(request: Request): string {
  const url = new URL(request.url);
  const key = `${request.method}:${url.pathname}${url.search}`;
  return key;
}

/**
 * Build cache control header
 */
function buildCacheControlHeader(config: CacheConfig): string {
  const parts: string[] = [];

  if (config.immutable) {
    parts.push('public');
    parts.push('immutable');
  } else {
    parts.push('public');
  }

  parts.push(`max-age=${config.ttl}`);

  if (config.staleWhileRevalidate) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  return parts.join(', ');
}

/**
 * Handle cache hit/miss recording
 */
function recordCacheMetric(hit: boolean): void {
  if (hit) {
    cacheMetrics.hits++;
  } else {
    cacheMetrics.misses++;
  }
}

/**
 * Get cache hit rate
 */
function getCacheHitRate(): number {
  const total = cacheMetrics.hits + cacheMetrics.misses;
  if (total === 0) return 0;
  return (cacheMetrics.hits / total) * 100;
}

/**
 * Main request handler
 */
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return fetch(request);
    }

    const url = new URL(request.url);
    const cacheKey = generateCacheKey(request);
    const cacheConfig = getCacheConfig(url.toString());

    // Try to get from cache
    const cache = caches.default;
    let response = await cache.match(cacheKey);

    if (response) {
      // Cache hit
      recordCacheMetric(true);

      // Add cache hit header
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('X-Cache', 'HIT');
      newResponse.headers.set('X-Cache-Hit-Rate', getCacheHitRate().toFixed(2));

      return newResponse;
    }

    // Cache miss - fetch from origin
    recordCacheMetric(false);

    try {
      response = await fetch(request);

      // Only cache successful responses
      if (response.status === 200) {
        // Create new response with cache headers
        const newResponse = new Response(response.body, response);

        // Set cache control headers
        newResponse.headers.set('Cache-Control', buildCacheControlHeader(cacheConfig));
        newResponse.headers.set('X-Cache', 'MISS');
        newResponse.headers.set('X-Cache-Hit-Rate', getCacheHitRate().toFixed(2));

        // Cache the response
        ctx.waitUntil(cache.put(cacheKey, newResponse.clone()));

        return newResponse;
      }

      return response;
    } catch (error) {
      // Return error response
      return new Response('Service Unavailable', {
        status: 503,
        headers: {
          'Content-Type': 'text/plain',
          'X-Cache': 'ERROR',
        },
      });
    }
  },

  /**
   * Scheduled handler for cache maintenance
   */
  async scheduled(event: any, env: any, ctx: any): Promise<void> {
    // Reset metrics every 6 hours
    cacheMetrics = {
      hits: 0,
      misses: 0,
      timestamp: Date.now(),
    };

    console.log('Cache metrics reset');
  },
};

/**
 * Export cache metrics for monitoring
 */
export function getCacheMetrics(): CacheMetrics {
  return cacheMetrics;
}

/**
 * Export cache configuration
 */
export function getCacheConfigs(): Record<string, CacheConfig> {
  return CACHE_CONFIGS;
}
