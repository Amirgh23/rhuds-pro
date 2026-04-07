import { useEffect, useCallback, useRef } from 'react';
import { customMetrics, CustomMetric } from '../utils/custom-metrics';

/**
 * Hook for tracking custom metrics
 */
export const useCustomMetrics = () => {
  const recordMetric = useCallback(
    (name: string, value: number, unit = '', tags?: Record<string, string>) => {
      customMetrics.recordMetric(name, value, unit, tags);
    },
    []
  );

  const recordComponentRender = useCallback((componentName: string, renderTime: number) => {
    customMetrics.recordComponentRender(componentName, renderTime);
  }, []);

  const recordApiCall = useCallback((endpoint: string, duration: number, status: number) => {
    customMetrics.recordApiCall(endpoint, duration, status);
  }, []);

  const recordUserInteraction = useCallback((action: string, duration: number) => {
    customMetrics.recordUserInteraction(action, duration);
  }, []);

  const recordMemoryUsage = useCallback(() => {
    customMetrics.recordMemoryUsage();
  }, []);

  const recordAnimationFrame = useCallback((duration: number) => {
    customMetrics.recordAnimationFrame(duration);
  }, []);

  const getMetrics = useCallback((name: string) => {
    return customMetrics.getMetrics(name);
  }, []);

  const getAllMetrics = useCallback(() => {
    return customMetrics.getAllMetrics();
  }, []);

  const getMetricsStats = useCallback((name: string) => {
    return customMetrics.getMetricsStats(name);
  }, []);

  const getMetricsInRange = useCallback((name: string, startTime: number, endTime: number) => {
    return customMetrics.getMetricsInRange(name, startTime, endTime);
  }, []);

  const createSnapshot = useCallback(() => {
    return customMetrics.createSnapshot();
  }, []);

  const getSnapshots = useCallback(() => {
    return customMetrics.getSnapshots();
  }, []);

  const getSummary = useCallback(() => {
    return customMetrics.getSummary();
  }, []);

  const exportMetrics = useCallback(() => {
    return customMetrics.export();
  }, []);

  const clearMetrics = useCallback((name?: string) => {
    if (name) {
      customMetrics.clearMetrics(name);
    } else {
      customMetrics.clear();
    }
  }, []);

  return {
    recordMetric,
    recordComponentRender,
    recordApiCall,
    recordUserInteraction,
    recordMemoryUsage,
    recordAnimationFrame,
    getMetrics,
    getAllMetrics,
    getMetricsStats,
    getMetricsInRange,
    createSnapshot,
    getSnapshots,
    getSummary,
    exportMetrics,
    clearMetrics,
  };
};

/**
 * Hook for measuring component render time
 */
export const useMeasureRender = (componentName: string) => {
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - startTimeRef.current;
    customMetrics.recordComponentRender(componentName, renderTime);
  }, [componentName]);
};

/**
 * Hook for measuring API calls
 */
export const useMeasureApiCall = () => {
  const measureCall = useCallback(async <T>(endpoint: string, fn: () => Promise<T>): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      customMetrics.recordApiCall(endpoint, duration, 200);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      customMetrics.recordApiCall(endpoint, duration, 500);
      throw error;
    }
  }, []);

  return { measureCall };
};

/**
 * Hook for measuring user interactions
 */
export const useMeasureInteraction = () => {
  const measureInteraction = useCallback((action: string, fn: () => void) => {
    const startTime = performance.now();
    fn();
    const duration = performance.now() - startTime;
    customMetrics.recordUserInteraction(action, duration);
  }, []);

  const measureInteractionAsync = useCallback(async (action: string, fn: () => Promise<void>) => {
    const startTime = performance.now();
    await fn();
    const duration = performance.now() - startTime;
    customMetrics.recordUserInteraction(action, duration);
  }, []);

  return { measureInteraction, measureInteractionAsync };
};

/**
 * Hook for periodic memory monitoring
 */
export const useMemoryMonitoring = (interval = 5000) => {
  useEffect(() => {
    const timer = setInterval(() => {
      customMetrics.recordMemoryUsage();
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);
};

export default useCustomMetrics;
