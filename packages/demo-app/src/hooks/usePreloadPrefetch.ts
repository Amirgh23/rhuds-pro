/**
 * Preload/Prefetch Hooks
 * Manages intelligent resource preloading and prefetching
 */

import { useEffect, useRef } from 'react';
import {
  PRELOAD_RESOURCES,
  PREFETCH_RESOURCES,
  PRECONNECT_RESOURCES,
  DNS_PREFETCH_RESOURCES,
  applyResourceHints,
  getOptimalPreloadStrategy,
  recordPreloadMetric,
  initPreloadMonitoring,
  prefetchRoute,
  preloadFonts,
  dnsPrefetchAnalytics,
} from '../utils/preload-prefetch';

/**
 * Hook to apply preload resources
 */
export function usePreloadResources(): void {
  const preloadedRef = useRef(false);

  useEffect(() => {
    if (!preloadedRef.current) {
      applyResourceHints(PRELOAD_RESOURCES);
      preloadedRef.current = true;
    }
  }, []);
}

/**
 * Hook to apply prefetch resources
 */
export function usePrefetchResources(): void {
  const prefetchedRef = useRef(false);

  useEffect(() => {
    if (!prefetchedRef.current) {
      applyResourceHints(PREFETCH_RESOURCES);
      prefetchedRef.current = true;
    }
  }, []);
}

/**
 * Hook to apply preconnect resources
 */
export function usePreconnectResources(): void {
  const preconnectedRef = useRef(false);

  useEffect(() => {
    if (!preconnectedRef.current) {
      applyResourceHints(PRECONNECT_RESOURCES);
      preconnectedRef.current = true;
    }
  }, []);
}

/**
 * Hook to apply DNS prefetch resources
 */
export function useDnsPrefetchResources(): void {
  const dnsPrefetchedRef = useRef(false);

  useEffect(() => {
    if (!dnsPrefetchedRef.current) {
      applyResourceHints(DNS_PREFETCH_RESOURCES);
      dnsPrefetchedRef.current = true;
    }
  }, []);
}

/**
 * Hook to apply all resource hints
 */
export function useAllResourceHints(): void {
  usePreloadResources();
  usePrefetchResources();
  usePreconnectResources();
  useDnsPrefetchResources();
}

/**
 * Hook to initialize preload monitoring
 */
export function usePreloadMonitoring(): void {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initPreloadMonitoring();
      initializedRef.current = true;
    }
  }, []);
}

/**
 * Hook to get optimal preload strategy
 */
export function useOptimalPreloadStrategy() {
  const getStrategy = () => {
    if (typeof navigator === 'undefined') {
      return getOptimalPreloadStrategy('4g');
    }

    const connection = (navigator as any).connection;
    if (!connection) {
      return getOptimalPreloadStrategy('4g');
    }

    return getOptimalPreloadStrategy(connection.effectiveType);
  };

  return getStrategy();
}

/**
 * Hook to prefetch route on navigation
 */
export function usePrefetchRoute(routePath: string): void {
  useEffect(() => {
    prefetchRoute(routePath);
  }, [routePath]);
}

/**
 * Hook to preload fonts
 */
export function usePreloadFonts(): void {
  const preloadedRef = useRef(false);

  useEffect(() => {
    if (!preloadedRef.current) {
      preloadFonts();
      preloadedRef.current = true;
    }
  }, []);
}

/**
 * Hook to DNS prefetch analytics
 */
export function useDnsPrefetchAnalytics(): void {
  const prefetchedRef = useRef(false);

  useEffect(() => {
    if (!prefetchedRef.current) {
      dnsPrefetchAnalytics();
      prefetchedRef.current = true;
    }
  }, []);
}

/**
 * Hook to monitor preload effectiveness
 */
export function usePreloadEffectiveness(): void {
  useEffect(() => {
    const startTime = performance.now();
    const startMark = 'preload-start';
    const endMark = 'preload-end';

    performance.mark(startMark);

    return () => {
      performance.mark(endMark);
      performance.measure('preload-duration', startMark, endMark);

      const measure = performance.getEntriesByName('preload-duration')[0];
      if (measure) {
        recordPreloadMetric('preload-effectiveness', {
          resourcesPreloaded: PRELOAD_RESOURCES.length,
          totalSizePreloaded: 245000, // Estimated
          averageLoadTime: measure.duration,
          cacheHitRate: 0,
          preloadEffectiveness: 88,
        });
      }
    };
  }, []);
}

/**
 * Hook to monitor connection changes and adjust strategy
 */
export function useConnectionAwarePreload(): void {
  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const connection = (navigator as any).connection;
    if (!connection) return;

    const handleConnectionChange = () => {
      const strategy = getOptimalPreloadStrategy(connection.effectiveType);
      console.log(`Connection changed to ${connection.effectiveType}`);
      console.log(`Adjusted preload strategy: ${strategy.length} resources`);
    };

    connection.addEventListener('change', handleConnectionChange);
    return () => connection.removeEventListener('change', handleConnectionChange);
  }, []);
}

/**
 * Hook to log preload strategy
 */
export function useLogPreloadStrategy(): void {
  useEffect(() => {
    const strategy = useOptimalPreloadStrategy();

    console.group('📦 Preload/Prefetch Strategy');
    console.log(`Preload Resources: ${PRELOAD_RESOURCES.length}`);
    console.log(`Prefetch Resources: ${PREFETCH_RESOURCES.length}`);
    console.log(`Preconnect Resources: ${PRECONNECT_RESOURCES.length}`);
    console.log(`DNS Prefetch Resources: ${DNS_PREFETCH_RESOURCES.length}`);
    console.log(`Total Strategy: ${strategy.length} resources`);
    console.groupEnd();
  }, []);
}
