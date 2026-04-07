/**
 * useEdgePerformanceMonitoring Hook
 * Monitors edge caching performance in React components
 */

import { useEffect, useCallback, useState } from 'react';
import {
  edgePerformanceMonitor,
  EdgeMetrics,
  PerformanceComparison,
  measureRequestPerformance,
  startPerformanceMonitoring,
} from '../utils/edge-performance-monitoring';

export interface UseEdgePerformanceMonitoringOptions {
  enabled?: boolean;
  autoStart?: boolean;
  snapshotInterval?: number;
}

/**
 * Hook for monitoring edge performance
 */
export function useEdgePerformanceMonitoring(options: UseEdgePerformanceMonitoringOptions = {}) {
  const { enabled = true, autoStart = true, snapshotInterval = 60000 } = options;

  const [metrics, setMetrics] = useState<EdgeMetrics>(edgePerformanceMonitor.getCurrentMetrics());

  const [stats, setStats] = useState(edgePerformanceMonitor.getStats());

  const [comparison, setComparison] = useState<PerformanceComparison>(
    edgePerformanceMonitor.comparePerformance()
  );

  // Update metrics
  const updateMetrics = useCallback(() => {
    if (!enabled) return;

    setMetrics(edgePerformanceMonitor.getCurrentMetrics());
    setStats(edgePerformanceMonitor.getStats());
    setComparison(edgePerformanceMonitor.comparePerformance());
  }, [enabled]);

  // Subscribe to metrics updates
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = edgePerformanceMonitor.subscribe(() => {
      updateMetrics();
    });

    return unsubscribe;
  }, [enabled, updateMetrics]);

  // Start performance monitoring
  useEffect(() => {
    if (!enabled || !autoStart) return;

    const stopMonitoring = startPerformanceMonitoring(snapshotInterval);
    return stopMonitoring;
  }, [enabled, autoStart, snapshotInterval]);

  // Measure request performance
  const measureRequest = useCallback(
    async (url: string, options?: RequestInit) => {
      if (!enabled) return null;

      return measureRequestPerformance(url, options);
    },
    [enabled]
  );

  // Get metrics history
  const getHistory = useCallback(
    (limit?: number) => {
      if (!enabled) return [];

      return edgePerformanceMonitor.getMetricsHistory(limit);
    },
    [enabled]
  );

  // Get average metrics
  const getAverage = useCallback(() => {
    if (!enabled) return null;

    return edgePerformanceMonitor.getAverageMetrics();
  }, [enabled]);

  // Record snapshot
  const recordSnapshot = useCallback(() => {
    if (!enabled) return;

    edgePerformanceMonitor.recordSnapshot();
    updateMetrics();
  }, [enabled, updateMetrics]);

  // Reset metrics
  const reset = useCallback(() => {
    if (!enabled) return;

    edgePerformanceMonitor.reset();
    updateMetrics();
  }, [enabled, updateMetrics]);

  return {
    // Current metrics
    metrics,
    stats,
    comparison,

    // Operations
    measureRequest,
    getHistory,
    getAverage,
    recordSnapshot,
    reset,
    updateMetrics,

    // Config
    enabled,
  };
}

/**
 * Hook for cache hit rate monitoring
 */
export function useCacheHitRate() {
  const { metrics, updateMetrics } = useEdgePerformanceMonitoring({
    enabled: true,
  });

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    hitRate: metrics.hitRate,
    hits: metrics.cacheHits,
    misses: metrics.cacheMisses,
    requests: metrics.requests,
  };
}

/**
 * Hook for latency monitoring
 */
export function useLatencyMonitoring() {
  const { metrics, comparison, updateMetrics } = useEdgePerformanceMonitoring({
    enabled: true,
  });

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    edgeLatency: metrics.edgeLatency,
    originLatency: metrics.originLatency,
    totalLatency: metrics.totalLatency,
    improvement: comparison.improvement.latency,
    improvementPercentage: comparison.improvement.percentage,
  };
}

/**
 * Hook for bandwidth monitoring
 */
export function useBandwidthMonitoring() {
  const { metrics, comparison, updateMetrics } = useEdgePerformanceMonitoring({
    enabled: true,
  });

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    bandwidth: metrics.bandwidth,
    savedBandwidth: comparison.improvement.bandwidth,
    withCache: comparison.withCache.bandwidth,
    withoutCache: comparison.withoutCache.bandwidth,
  };
}

/**
 * Hook for performance comparison
 */
export function usePerformanceComparison() {
  const { comparison, updateMetrics } = useEdgePerformanceMonitoring({
    enabled: true,
  });

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    withCache: comparison.withCache,
    withoutCache: comparison.withoutCache,
    improvement: comparison.improvement,
  };
}

export default useEdgePerformanceMonitoring;
