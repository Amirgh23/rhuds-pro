/**
 * usePredictiveCaching Hook
 * Manages predictive caching in React components
 */

import { useEffect, useCallback, useState } from 'react';
import {
  predictiveCachingManager,
  PredictionMetrics,
  recordUserBehavior,
  predictNextPath,
  UserBehavior,
} from '../utils/predictive-caching';

export interface UsePredictiveCachingOptions {
  enabled?: boolean;
  autoRecord?: boolean;
  recordInterval?: number;
}

/**
 * Hook for managing predictive caching
 */
export function usePredictiveCaching(options: UsePredictiveCachingOptions = {}) {
  const { enabled = true, autoRecord = true, recordInterval = 5000 } = options;

  const [metrics, setMetrics] = useState<PredictionMetrics>(predictiveCachingManager.getMetrics());
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  // Update metrics
  const updateMetrics = useCallback(() => {
    setMetrics(predictiveCachingManager.getMetrics());
  }, []);

  // Subscribe to metrics updates
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = predictiveCachingManager.subscribe((newMetrics) => {
      setMetrics(newMetrics);
    });

    return unsubscribe;
  }, [enabled]);

  // Record user behavior periodically
  useEffect(() => {
    if (!enabled || !autoRecord) return;

    const startTime = Date.now();

    const interval = setInterval(() => {
      const behavior: UserBehavior = {
        path: currentPath,
        timestamp: Date.now(),
        duration: Date.now() - startTime,
      };

      recordUserBehavior(behavior);
      updateMetrics();
    }, recordInterval);

    return () => clearInterval(interval);
  }, [enabled, autoRecord, currentPath, recordInterval, updateMetrics]);

  // Monitor path changes
  useEffect(() => {
    if (!enabled) return;

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [enabled]);

  // Record behavior
  const recordBehavior = useCallback(
    (behavior: UserBehavior) => {
      if (!enabled) return;
      recordUserBehavior(behavior);
      updateMetrics();
    },
    [enabled, updateMetrics]
  );

  // Predict next path
  const predict = useCallback(
    (path: string) => {
      if (!enabled) return null;
      return predictNextPath(path);
    },
    [enabled]
  );

  // Record prediction accuracy
  const recordAccuracy = useCallback(
    (predicted: string, actual: string) => {
      if (!enabled) return;
      predictiveCachingManager.recordPredictionAccuracy(predicted, actual);
      updateMetrics();
    },
    [enabled, updateMetrics]
  );

  // Get metrics
  const getMetrics = useCallback(() => {
    return predictiveCachingManager.getMetrics();
  }, []);

  // Reset
  const reset = useCallback(() => {
    predictiveCachingManager.reset();
    updateMetrics();
  }, [updateMetrics]);

  return {
    // Metrics
    metrics,
    updateMetrics,

    // Operations
    recordBehavior,
    predict,
    recordAccuracy,
    getMetrics,
    reset,

    // State
    currentPath,

    // Config
    enabled,
  };
}

export default usePredictiveCaching;
