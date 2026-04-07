import { useEffect, useState, useCallback } from 'react';
import { performanceAlerts, PerformanceAlert, AlertConfig } from '../utils/performance-alerts';

/**
 * Hook for using the performance alerts system
 */
export const usePerformanceAlerts = (autoStart = true) => {
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!autoStart) return;

    // Start monitoring
    performanceAlerts.start();
    setIsRunning(true);

    // Subscribe to alerts
    const unsubscribe = performanceAlerts.subscribe((alert) => {
      setAlerts((prev) => {
        const updated = [alert, ...prev];
        // Keep only last 50 alerts
        return updated.slice(0, 50);
      });
    });

    return () => {
      unsubscribe();
      performanceAlerts.stop();
      setIsRunning(false);
    };
  }, [autoStart]);

  const start = useCallback(() => {
    performanceAlerts.start();
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    performanceAlerts.stop();
    setIsRunning(false);
  }, []);

  const clearAlerts = useCallback(() => {
    performanceAlerts.clearAllAlerts();
    setAlerts([]);
  }, []);

  const getAlerts = useCallback(() => {
    return performanceAlerts.getAlerts();
  }, []);

  const getAlertsBySeverity = useCallback((severity: 'warning' | 'critical') => {
    return performanceAlerts.getAlertsBySeverity(severity);
  }, []);

  const updateThresholds = useCallback((thresholds) => {
    performanceAlerts.updateThresholds(thresholds);
  }, []);

  const updateConfig = useCallback((config: Partial<AlertConfig>) => {
    performanceAlerts.updateConfig(config);
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    return performanceAlerts.requestNotificationPermission();
  }, []);

  return {
    alerts,
    isRunning,
    start,
    stop,
    clearAlerts,
    getAlerts,
    getAlertsBySeverity,
    updateThresholds,
    updateConfig,
    requestNotificationPermission,
  };
};

export default usePerformanceAlerts;
