/**
 * useAdaptiveCaching Hook
 * Manages adaptive caching based on network conditions
 */

import { useEffect, useCallback, useState } from 'react';
import {
  adaptiveCachingManager,
  AdaptiveMetrics,
  AdaptiveCacheConfig,
  getAdaptiveCacheConfig,
} from '../utils/adaptive-caching';

export interface UseAdaptiveCachingOptions {
  enabled?: boolean;
  monitorInterval?: number;
}

/**
 * Hook for managing adaptive caching
 */
export function useAdaptiveCaching(options: UseAdaptiveCachingOptions = {}) {
  const { enabled = true, monitorInterval = 10000 } = options;

  const [metrics, setMetrics] = useState<AdaptiveMetrics>(adaptiveCachingManager.getMetrics());
  const [config, setConfig] = useState<AdaptiveCacheConfig>(adaptiveCachingManager.getConfig());

  // Update metrics
  const updateMetrics = useCallback(() => {
    setMetrics(adaptiveCachingManager.getMetrics());
    setConfig(adaptiveCachingManager.getConfig());
  }, []);

  // Subscribe to metrics updates
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = adaptiveCachingManager.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      setConfig(adaptiveCachingManager.getConfig());
    });

    return unsubscribe;
  }, [enabled]);

  // Monitor network changes
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      updateMetrics();
    }, monitorInterval);

    return () => clearInterval(interval);
  }, [enabled, monitorInterval, updateMetrics]);

  // Get metrics
  const getMetrics = useCallback(() => {
    return adaptiveCachingManager.getMetrics();
  }, []);

  // Get config
  const getConfig = useCallback(() => {
    return adaptiveCachingManager.getConfig();
  }, []);

  return {
    // Metrics
    metrics,
    config,
    updateMetrics,

    // Operations
    getMetrics,
    getConfig,

    // Config
    enabled,
  };
}

export default useAdaptiveCaching;
