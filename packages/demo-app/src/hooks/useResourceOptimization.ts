/**
 * useResourceOptimization Hook
 * Manages resource optimization in React components
 */

import { useEffect, useCallback, useState } from 'react';
import {
  resourceOptimizationManager,
  ResourceMetrics,
  optimizeResource,
} from '../utils/resource-optimization';

export interface UseResourceOptimizationOptions {
  enabled?: boolean;
  autoOptimize?: boolean;
  resetInterval?: number;
}

/**
 * Hook for managing resource optimization
 */
export function useResourceOptimization(options: UseResourceOptimizationOptions = {}) {
  const { enabled = true, autoOptimize = true, resetInterval = 300000 } = options;

  const [metrics, setMetrics] = useState<ResourceMetrics>(resourceOptimizationManager.getMetrics());

  // Update metrics
  const updateMetrics = useCallback(() => {
    setMetrics(resourceOptimizationManager.getMetrics());
  }, []);

  // Subscribe to metrics updates
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = resourceOptimizationManager.subscribe((newMetrics) => {
      setMetrics(newMetrics);
    });

    return unsubscribe;
  }, [enabled]);

  // Reset metrics periodically
  useEffect(() => {
    if (!enabled || !autoOptimize) return;

    const interval = setInterval(() => {
      resourceOptimizationManager.reset();
      updateMetrics();
    }, resetInterval);

    return () => clearInterval(interval);
  }, [enabled, autoOptimize, resetInterval, updateMetrics]);

  // Optimize resource
  const optimize = useCallback(
    (url: string, size: number, type: string) => {
      if (!enabled) return { optimized: false, newSize: size };
      return optimizeResource(url, size, type);
    },
    [enabled]
  );

  // Get metrics
  const getMetrics = useCallback(() => {
    return resourceOptimizationManager.getMetrics();
  }, []);

  // Reset
  const reset = useCallback(() => {
    resourceOptimizationManager.reset();
    updateMetrics();
  }, [updateMetrics]);

  return {
    // Metrics
    metrics,
    updateMetrics,

    // Operations
    optimize,
    getMetrics,
    reset,

    // Config
    enabled,
  };
}

export default useResourceOptimization;
