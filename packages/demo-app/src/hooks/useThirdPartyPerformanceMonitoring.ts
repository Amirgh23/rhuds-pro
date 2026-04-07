/**
 * useThirdPartyPerformanceMonitoring Hook
 * Monitors third-party script performance impact
 */

import { useEffect, useCallback, useState } from 'react';
import {
  thirdPartyPerformanceMonitor,
  ThirdPartyMetrics,
  ScriptPerformance,
  recordScriptPerformance,
  getPerformanceSummary,
} from '../utils/third-party-performance-monitoring';

export interface UseThirdPartyPerformanceMonitoringOptions {
  enabled?: boolean;
  autoStart?: boolean;
  snapshotInterval?: number;
}

/**
 * Hook for third-party performance monitoring
 */
export function useThirdPartyPerformanceMonitoring(
  options: UseThirdPartyPerformanceMonitoringOptions = {}
) {
  const { enabled = true, autoStart = true, snapshotInterval = 60000 } = options;

  const [metrics, setMetrics] = useState<ThirdPartyMetrics>(
    thirdPartyPerformanceMonitor.getMetrics()
  );
  const [summary, setSummary] = useState(getPerformanceSummary());

  // Update metrics
  const updateMetrics = useCallback(() => {
    if (!enabled) return;

    setMetrics(thirdPartyPerformanceMonitor.getMetrics());
    setSummary(getPerformanceSummary());
  }, [enabled]);

  // Subscribe to metrics updates
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = thirdPartyPerformanceMonitor.subscribe(() => {
      updateMetrics();
    });

    return unsubscribe;
  }, [enabled, updateMetrics]);

  // Auto-start monitoring
  useEffect(() => {
    if (!enabled || !autoStart) return;

    const interval = setInterval(() => {
      updateMetrics();
    }, snapshotInterval);

    return () => clearInterval(interval);
  }, [enabled, autoStart, snapshotInterval, updateMetrics]);

  // Record script performance
  const recordPerformance = useCallback(
    (performance: ScriptPerformance) => {
      if (!enabled) return;
      recordScriptPerformance(performance);
      updateMetrics();
    },
    [enabled, updateMetrics]
  );

  // Get script performance
  const getScriptPerformance = useCallback((id: string) => {
    return thirdPartyPerformanceMonitor.getScriptPerformance(id);
  }, []);

  // Get all script performance
  const getAllScriptPerformance = useCallback(() => {
    return thirdPartyPerformanceMonitor.getAllScriptPerformance();
  }, []);

  // Get top slowest scripts
  const getTopSlowestScripts = useCallback((limit?: number) => {
    return thirdPartyPerformanceMonitor.getTopSlowestScripts(limit);
  }, []);

  // Reset metrics
  const reset = useCallback(() => {
    if (!enabled) return;
    thirdPartyPerformanceMonitor.reset();
    updateMetrics();
  }, [enabled, updateMetrics]);

  return {
    // Metrics
    metrics,
    summary,
    updateMetrics,

    // Operations
    recordPerformance,
    getScriptPerformance,
    getAllScriptPerformance,
    getTopSlowestScripts,
    reset,

    // Config
    enabled,
  };
}

/**
 * Hook for third-party impact monitoring
 */
export function useThirdPartyImpactMonitoring() {
  const { metrics, updateMetrics } = useThirdPartyPerformanceMonitoring({
    enabled: true,
  });

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    impactPercentage: metrics.impactPercentage,
    totalLoadTime: metrics.totalLoadTime,
    averageLoadTime: metrics.averageLoadTime,
    errorCount: metrics.errorCount,
    successCount: metrics.successCount,
  };
}

/**
 * Hook for slowest scripts monitoring
 */
export function useSlowestScriptsMonitoring() {
  const { getTopSlowestScripts, updateMetrics } = useThirdPartyPerformanceMonitoring({
    enabled: true,
  });

  const [slowestScripts, setSlowestScripts] = useState<ScriptPerformance[]>([]);

  useEffect(() => {
    setSlowestScripts(getTopSlowestScripts(5));
  }, [getTopSlowestScripts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlowestScripts(getTopSlowestScripts(5));
      updateMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, [getTopSlowestScripts, updateMetrics]);

  return {
    slowestScripts,
  };
}

export default useThirdPartyPerformanceMonitoring;
