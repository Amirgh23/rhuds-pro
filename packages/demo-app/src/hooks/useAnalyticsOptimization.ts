/**
 * useAnalyticsOptimization Hook
 * Manages analytics optimization in React components
 */

import { useEffect, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  analyticsOptimizationManager,
  AnalyticsMetrics,
  trackPageView,
  trackEvent,
  trackUserAction,
  flushAnalytics,
} from '../utils/analytics-optimization';

export interface UseAnalyticsOptimizationOptions {
  enabled?: boolean;
  trackPageViews?: boolean;
  trackUserActions?: boolean;
  autoFlush?: boolean;
  flushInterval?: number;
}

/**
 * Hook for analytics optimization
 */
export function useAnalyticsOptimization(options: UseAnalyticsOptimizationOptions = {}) {
  const {
    enabled = true,
    trackPageViews = true,
    trackUserActions = true,
    autoFlush = true,
    flushInterval = 30000, // 30 seconds
  } = options;

  const location = useLocation();
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(
    analyticsOptimizationManager.getMetrics()
  );

  // Update metrics
  const updateMetrics = useCallback(() => {
    if (!enabled) return;
    setMetrics(analyticsOptimizationManager.getMetrics());
  }, [enabled]);

  // Subscribe to metrics updates
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = analyticsOptimizationManager.subscribe(() => {
      updateMetrics();
    });

    return unsubscribe;
  }, [enabled, updateMetrics]);

  // Track page views
  useEffect(() => {
    if (!enabled || !trackPageViews) return;

    trackPageView(location.pathname, document.title);
  }, [enabled, trackPageViews, location.pathname]);

  // Auto-flush analytics
  useEffect(() => {
    if (!enabled || !autoFlush) return;

    const interval = setInterval(() => {
      flushAnalytics();
    }, flushInterval);

    return () => clearInterval(interval);
  }, [enabled, autoFlush, flushInterval]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (enabled) {
        flushAnalytics();
      }
    };
  }, [enabled]);

  // Track event
  const track = useCallback(
    (eventName: string, data?: Record<string, any>) => {
      if (!enabled) return;
      trackEvent(eventName, data || {});
    },
    [enabled]
  );

  // Track user action
  const trackAction = useCallback(
    (action: string, target: string) => {
      if (!enabled || !trackUserActions) return;
      trackUserAction(action, target);
    },
    [enabled, trackUserActions]
  );

  // Flush analytics
  const flush = useCallback(() => {
    if (!enabled) return;
    flushAnalytics();
  }, [enabled]);

  // Get metrics
  const getMetrics = useCallback(() => {
    return analyticsOptimizationManager.getMetrics();
  }, []);

  return {
    // Metrics
    metrics,
    updateMetrics,

    // Operations
    track,
    trackAction,
    flush,
    getMetrics,

    // Config
    enabled,
  };
}

/**
 * Hook for tracking page views
 */
export function usePageViewTracking() {
  const { track } = useAnalyticsOptimization({
    enabled: true,
    trackPageViews: true,
  });

  return { track };
}

/**
 * Hook for tracking user actions
 */
export function useUserActionTracking() {
  const { trackAction } = useAnalyticsOptimization({
    enabled: true,
    trackUserActions: true,
  });

  return { trackAction };
}

/**
 * Hook for analytics metrics
 */
export function useAnalyticsMetrics() {
  const { metrics, updateMetrics } = useAnalyticsOptimization({
    enabled: true,
  });

  useEffect(() => {
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    metrics,
    totalRequests: metrics.totalRequests,
    batchedRequests: metrics.batchedRequests,
    deferredRequests: metrics.deferredRequests,
    deduplicatedRequests: metrics.deduplicatedRequests,
    averageLoadTime: metrics.averageLoadTime,
  };
}

export default useAnalyticsOptimization;
