/**
 * usePerformanceTuning Hook
 * Manages performance tuning in React components
 */

import { useEffect, useCallback, useState } from 'react';
import {
  performanceTuningManager,
  PerformanceTuningMetrics,
  PerformanceTuningConfig,
  calculatePerformanceScore,
  getPerformanceRecommendations,
} from '../utils/performance-tuning';

export interface UsePerformanceTuningOptions {
  enabled?: boolean;
  autoUpdate?: boolean;
  updateInterval?: number;
}

/**
 * Hook for managing performance tuning
 */
export function usePerformanceTuning(options: UsePerformanceTuningOptions = {}) {
  const { enabled = true, autoUpdate = true, updateInterval = 60000 } = options;

  const [metrics, setMetrics] = useState<PerformanceTuningMetrics>(
    performanceTuningManager.getMetrics()
  );
  const [config, setConfig] = useState<PerformanceTuningConfig>(
    performanceTuningManager.getConfig()
  );
  const [score, setScore] = useState<number>(calculatePerformanceScore());
  const [recommendations, setRecommendations] = useState<string[]>(getPerformanceRecommendations());

  // Update metrics
  const updateMetrics = useCallback(() => {
    setMetrics(performanceTuningManager.getMetrics());
    setScore(calculatePerformanceScore());
    setRecommendations(getPerformanceRecommendations());
  }, []);

  // Subscribe to metrics updates
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = performanceTuningManager.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      setScore(calculatePerformanceScore());
      setRecommendations(getPerformanceRecommendations());
    });

    return unsubscribe;
  }, [enabled]);

  // Auto-update metrics
  useEffect(() => {
    if (!enabled || !autoUpdate) return;

    const interval = setInterval(() => {
      updateMetrics();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [enabled, autoUpdate, updateInterval, updateMetrics]);

  // Get metrics
  const getMetrics = useCallback(() => {
    return performanceTuningManager.getMetrics();
  }, []);

  // Get config
  const getConfig = useCallback(() => {
    return performanceTuningManager.getConfig();
  }, []);

  // Update config
  const updateConfig = useCallback((newConfig: Partial<PerformanceTuningConfig>) => {
    performanceTuningManager.updateConfig(newConfig);
    setConfig(performanceTuningManager.getConfig());
  }, []);

  // Update metrics manually
  const setMetricsManually = useCallback(
    (newMetrics: Partial<PerformanceTuningMetrics>) => {
      performanceTuningManager.updateMetrics(newMetrics);
      updateMetrics();
    },
    [updateMetrics]
  );

  // Get performance score
  const getScore = useCallback(() => {
    return calculatePerformanceScore();
  }, []);

  // Get recommendations
  const getRecommendations = useCallback(() => {
    return getPerformanceRecommendations();
  }, []);

  return {
    // Metrics
    metrics,
    config,
    score,
    recommendations,
    updateMetrics,

    // Operations
    getMetrics,
    getConfig,
    updateConfig,
    setMetricsManually,
    getScore,
    getRecommendations,

    // Config
    enabled,
  };
}

export default usePerformanceTuning;
