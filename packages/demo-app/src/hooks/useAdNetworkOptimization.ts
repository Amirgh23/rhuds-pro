/**
 * useAdNetworkOptimization Hook
 * Manages ad network optimization in React components
 */

import { useEffect, useCallback, useState } from 'react';
import {
  adNetworkOptimizationManager,
  AdMetrics,
  AdResponse,
  requestAd,
  trackAdClick,
} from '../utils/ad-network-optimization';

export interface UseAdNetworkOptimizationOptions {
  enabled?: boolean;
  lazyLoad?: boolean;
  cacheAds?: boolean;
  batchRequests?: boolean;
}

/**
 * Hook for ad network optimization
 */
export function useAdNetworkOptimization(options: UseAdNetworkOptimizationOptions = {}) {
  const { enabled = true, lazyLoad = true, cacheAds = true, batchRequests = true } = options;

  const [metrics, setMetrics] = useState<AdMetrics>(adNetworkOptimizationManager.getMetrics());
  const [loadingAds, setLoadingAds] = useState<Set<string>>(new Set());

  // Update metrics
  const updateMetrics = useCallback(() => {
    if (!enabled) return;
    setMetrics(adNetworkOptimizationManager.getMetrics());
  }, [enabled]);

  // Subscribe to metrics updates
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = adNetworkOptimizationManager.subscribe(() => {
      updateMetrics();
    });

    return unsubscribe;
  }, [enabled, updateMetrics]);

  // Request ad
  const requestAdUnit = useCallback(
    async (
      adUnit: string,
      size: string,
      targeting?: Record<string, any>
    ): Promise<AdResponse | null> => {
      if (!enabled) return null;

      setLoadingAds((prev) => new Set([...prev, adUnit]));

      try {
        const response = await requestAd(adUnit, size, targeting);
        return response;
      } finally {
        setLoadingAds((prev) => {
          const next = new Set(prev);
          next.delete(adUnit);
          return next;
        });
      }
    },
    [enabled]
  );

  // Track click
  const trackClick = useCallback(
    (adId: string) => {
      if (!enabled) return;
      trackAdClick(adId);
    },
    [enabled]
  );

  // Clear cache
  const clearCache = useCallback(() => {
    if (!enabled) return;
    adNetworkOptimizationManager.clearCache();
    updateMetrics();
  }, [enabled, updateMetrics]);

  // Get metrics
  const getMetrics = useCallback(() => {
    return adNetworkOptimizationManager.getMetrics();
  }, []);

  return {
    // Metrics
    metrics,
    updateMetrics,
    loadingAds,

    // Operations
    requestAd: requestAdUnit,
    trackClick,
    clearCache,
    getMetrics,

    // Config
    enabled,
  };
}

/**
 * Hook for ad metrics
 */
export function useAdMetrics() {
  const { metrics, updateMetrics } = useAdNetworkOptimization({
    enabled: true,
  });

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    metrics,
    totalRequests: metrics.totalRequests,
    successfulRequests: metrics.successfulRequests,
    failedRequests: metrics.failedRequests,
    cachedRequests: metrics.cachedRequests,
    averageLoadTime: metrics.averageLoadTime,
    impressions: metrics.impressions,
    clicks: metrics.clicks,
  };
}

/**
 * Hook for requesting ads
 */
export function useRequestAd() {
  const { requestAd, trackClick, loadingAds } = useAdNetworkOptimization({
    enabled: true,
    lazyLoad: true,
    cacheAds: true,
  });

  return {
    requestAd,
    trackClick,
    loadingAds,
  };
}

export default useAdNetworkOptimization;
