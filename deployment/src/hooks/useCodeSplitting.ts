/**
 * Code Splitting Hooks
 * Provides prefetch, preload, and chunk monitoring capabilities
 */

import { useEffect, useRef, useCallback } from 'react';
import { prefetchChunk, preloadChunk, recordChunkMetric } from '../utils/code-splitting';

/**
 * Hook to prefetch a chunk on route hover or idle time
 */
export function usePrefetchChunk(
  chunkName: string,
  trigger: 'hover' | 'idle' | 'immediate' = 'idle'
): void {
  const prefetchedRef = useRef(false);

  useEffect(() => {
    if (prefetchedRef.current) return;

    if (trigger === 'immediate') {
      prefetchChunk(chunkName);
      prefetchedRef.current = true;
      return;
    }

    if (trigger === 'idle') {
      // Use requestIdleCallback if available, otherwise use setTimeout
      const callback = () => {
        if (!prefetchedRef.current) {
          prefetchChunk(chunkName);
          prefetchedRef.current = true;
        }
      };

      if ('requestIdleCallback' in window) {
        const id = (window as any).requestIdleCallback(callback, { timeout: 2000 });
        return () => (window as any).cancelIdleCallback(id);
      } else {
        const id = setTimeout(callback, 2000);
        return () => clearTimeout(id);
      }
    }
  }, [chunkName, trigger]);
}

/**
 * Hook to preload a chunk immediately
 */
export function usePreloadChunk(chunkName: string): void {
  const preloadedRef = useRef(false);

  useEffect(() => {
    if (!preloadedRef.current) {
      preloadChunk(chunkName);
      preloadedRef.current = true;
    }
  }, [chunkName]);
}

/**
 * Hook to monitor chunk loading performance
 */
export function useChunkMetrics(chunkName: string): void {
  useEffect(() => {
    const startTime = performance.now();
    const startMark = `chunk-load-start-${chunkName}`;
    const endMark = `chunk-load-end-${chunkName}`;

    performance.mark(startMark);

    return () => {
      performance.mark(endMark);
      performance.measure(`chunk-load-${chunkName}`, startMark, endMark);

      const measure = performance.getEntriesByName(`chunk-load-${chunkName}`)[0];
      if (measure) {
        recordChunkMetric({
          chunkName,
          loadTime: measure.duration,
          size: 0, // Size would be determined from network tab
          cached: false,
        });
      }
    };
  }, [chunkName]);
}

/**
 * Hook to prefetch chunks on route hover
 */
export function usePrefetchOnHover(chunkNames: string[]): (e: React.MouseEvent) => void {
  return useCallback(
    (e: React.MouseEvent) => {
      chunkNames.forEach((name) => {
        prefetchChunk(name);
      });
    },
    [chunkNames]
  );
}

/**
 * Hook to prefetch chunks on network connection change
 */
export function usePrefetchOnConnection(chunkNames: string[]): void {
  useEffect(() => {
    if (!('connection' in navigator)) return;

    const connection = (navigator as any).connection;
    if (!connection) return;

    const handleConnectionChange = () => {
      const effectiveType = connection.effectiveType;

      // Only prefetch on fast connections (4g)
      if (effectiveType === '4g') {
        chunkNames.forEach((name) => {
          prefetchChunk(name);
        });
      }
    };

    connection.addEventListener('change', handleConnectionChange);
    return () => connection.removeEventListener('change', handleConnectionChange);
  }, [chunkNames]);
}

/**
 * Hook to manage chunk preloading strategy
 */
export function useChunkPreloadStrategy(
  chunkName: string,
  strategy: 'preload' | 'prefetch' | 'lazy' = 'lazy'
): void {
  useEffect(() => {
    if (strategy === 'preload') {
      preloadChunk(chunkName);
    } else if (strategy === 'prefetch') {
      prefetchChunk(chunkName);
    }
  }, [chunkName, strategy]);
}

/**
 * Hook to track route transitions and prefetch next route
 */
export function usePrefetchNextRoute(nextChunkName: string | null): void {
  useEffect(() => {
    if (nextChunkName) {
      prefetchChunk(nextChunkName);
    }
  }, [nextChunkName]);
}
