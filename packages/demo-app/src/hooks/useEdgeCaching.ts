/**
 * useEdgeCaching Hook
 * Manages edge caching in React components
 */

import { useEffect, useCallback, useState } from 'react';
import {
  edgeCacheManager,
  CacheMetrics,
  getCacheConfigForUrl,
  invalidateCacheByPattern,
  invalidateCacheByPrefix,
  warmCache,
} from '../utils/edge-caching';

export interface UseEdgeCachingOptions {
  enabled?: boolean;
  autoWarm?: boolean;
  warmUrls?: string[];
  pruneInterval?: number;
}

/**
 * Hook for managing edge caching
 */
export function useEdgeCaching(options: UseEdgeCachingOptions = {}) {
  const {
    enabled = true,
    autoWarm = true,
    warmUrls = [],
    pruneInterval = 60000, // 1 minute
  } = options;

  const [metrics, setMetrics] = useState<CacheMetrics>(edgeCacheManager.getMetrics());

  // Update metrics
  const updateMetrics = useCallback(() => {
    setMetrics(edgeCacheManager.getMetrics());
  }, []);

  // Warm cache on mount
  useEffect(() => {
    if (!enabled || !autoWarm || warmUrls.length === 0) return;

    warmCache(warmUrls).catch((error) => {
      console.error('Failed to warm cache:', error);
    });
  }, [enabled, autoWarm, warmUrls]);

  // Prune expired entries periodically
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const pruned = edgeCacheManager.prune();
      if (pruned > 0) {
        updateMetrics();
      }
    }, pruneInterval);

    return () => clearInterval(interval);
  }, [enabled, pruneInterval, updateMetrics]);

  // Get cache entry
  const get = useCallback(
    (key: string) => {
      if (!enabled) return null;
      const value = edgeCacheManager.get(key);
      updateMetrics();
      return value;
    },
    [enabled, updateMetrics]
  );

  // Set cache entry
  const set = useCallback(
    (key: string, value: any, ttl?: number) => {
      if (!enabled) return;
      edgeCacheManager.set(key, value, ttl);
      updateMetrics();
    },
    [enabled, updateMetrics]
  );

  // Delete cache entry
  const deleteEntry = useCallback(
    (key: string) => {
      if (!enabled) return false;
      const result = edgeCacheManager.delete(key);
      updateMetrics();
      return result;
    },
    [enabled, updateMetrics]
  );

  // Clear cache
  const clear = useCallback(() => {
    if (!enabled) return;
    edgeCacheManager.clear();
    updateMetrics();
  }, [enabled, updateMetrics]);

  // Invalidate by pattern
  const invalidateByPattern = useCallback(
    (pattern: RegExp) => {
      if (!enabled) return 0;
      const count = invalidateCacheByPattern(pattern);
      updateMetrics();
      return count;
    },
    [enabled, updateMetrics]
  );

  // Invalidate by prefix
  const invalidateByPrefix = useCallback(
    (prefix: string) => {
      if (!enabled) return 0;
      const count = invalidateCacheByPrefix(prefix);
      updateMetrics();
      return count;
    },
    [enabled, updateMetrics]
  );

  // Get cache stats
  const getStats = useCallback(() => {
    return edgeCacheManager.getStats();
  }, []);

  // Get cache size
  const getSize = useCallback(() => {
    return edgeCacheManager.getSize();
  }, []);

  // Get cache entries
  const getEntries = useCallback(() => {
    return edgeCacheManager.getEntries();
  }, []);

  return {
    // Metrics
    metrics,
    updateMetrics,

    // Cache operations
    get,
    set,
    delete: deleteEntry,
    clear,

    // Invalidation
    invalidateByPattern,
    invalidateByPrefix,

    // Stats
    getStats,
    getSize,
    getEntries,

    // Config
    enabled,
  };
}

/**
 * Hook for fetching with edge caching
 */
export function useFetchWithEdgeCache() {
  const { get, set } = useEdgeCaching({ enabled: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(
    async (url: string, options?: RequestInit) => {
      const cacheKey = `${url}:${JSON.stringify(options || {})}`;

      // Check cache first
      const cached = get(cacheKey);
      if (cached) {
        return cached;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await window.fetch(url, options);
        const data = await response.text();

        // Cache the response
        const config = getCacheConfigForUrl(url);
        set(cacheKey, data, config.ttl);

        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [get, set]
  );

  return { fetch, loading, error };
}

/**
 * Hook for cache invalidation
 */
export function useCacheInvalidation() {
  const { invalidateByPattern, invalidateByPrefix, clear } = useEdgeCaching({
    enabled: true,
  });

  const invalidate = useCallback(
    (pattern: string | RegExp) => {
      if (typeof pattern === 'string') {
        return invalidateByPrefix(pattern);
      }
      return invalidateByPattern(pattern);
    },
    [invalidateByPattern, invalidateByPrefix]
  );

  return {
    invalidate,
    invalidateByPattern,
    invalidateByPrefix,
    clear,
  };
}

/**
 * Hook for cache statistics
 */
export function useCacheStats() {
  const { metrics, getStats, getSize, getEntries, updateMetrics } = useEdgeCaching({
    enabled: true,
  });

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    metrics,
    stats: getStats(),
    size: getSize(),
    entries: getEntries(),
  };
}

export default useEdgeCaching;
