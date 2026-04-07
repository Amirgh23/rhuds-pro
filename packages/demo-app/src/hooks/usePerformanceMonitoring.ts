/**
 * usePerformanceMonitoring Hook
 * Provides real-time performance monitoring capabilities
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  performanceMonitor,
  startPerformanceMonitoring,
  getPerformanceReport,
  PerformanceAlert,
  PerformanceMetricsSnapshot,
} from '../utils/performance-monitoring';

export interface UsePerformanceMonitoringOptions {
  enabled?: boolean;
  interval?: number;
  onAlert?: (alert: PerformanceAlert) => void;
}

export function usePerformanceMonitoring(options: UsePerformanceMonitoringOptions = {}) {
  const { enabled = true, interval = 5000, onAlert } = options;

  const [metrics, setMetrics] = useState<Partial<PerformanceMetricsSnapshot> | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [history, setHistory] = useState<PerformanceMetricsSnapshot[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const stopMonitoringRef = useRef<(() => void) | null>(null);

  // Initialize monitoring
  useEffect(() => {
    if (!enabled) return;

    // Get initial metrics
    const initialMetrics = performanceMonitor.getMetrics();
    setMetrics(initialMetrics);

    // Start monitoring
    stopMonitoringRef.current = startPerformanceMonitoring(interval);

    // Subscribe to alerts
    unsubscribeRef.current = performanceMonitor.onAlert((alert) => {
      setAlerts((prev) => [...prev.filter((a) => !a.resolved), alert]);
      onAlert?.(alert);
    });

    // Update metrics periodically
    const updateInterval = setInterval(() => {
      const currentMetrics = performanceMonitor.getMetrics();
      setMetrics(currentMetrics);
      setAlerts(performanceMonitor.getAlerts());
      setHistory(performanceMonitor.getHistory());
    }, interval);

    return () => {
      clearInterval(updateInterval);
      unsubscribeRef.current?.();
      stopMonitoringRef.current?.();
    };
  }, [enabled, interval, onAlert]);

  // Resolve alert
  const resolveAlert = useCallback((alertId: string) => {
    performanceMonitor.resolveAlert(alertId);
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  // Get summary
  const getSummary = useCallback(() => {
    return performanceMonitor.getSummary();
  }, []);

  // Get report
  const getReport = useCallback(() => {
    return getPerformanceReport();
  }, []);

  // Clear history
  const clearHistory = useCallback(() => {
    performanceMonitor.clearHistory();
    setHistory([]);
    setAlerts([]);
  }, []);

  return {
    metrics,
    alerts,
    history,
    resolveAlert,
    getSummary,
    getReport,
    clearHistory,
  };
}
