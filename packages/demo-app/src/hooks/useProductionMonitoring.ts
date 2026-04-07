import { useEffect, useCallback } from 'react';
import { productionMonitoring, ProductionAlert, AlertRule } from '../utils/production-monitoring';

/**
 * Hook for production monitoring
 */
export const useProductionMonitoring = (autoStart = true) => {
  useEffect(() => {
    if (!autoStart) return;

    // Start monitoring
    productionMonitoring.start();

    // Collect initial metrics
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find((e) => e.name === 'first-contentful-paint')?.startTime || 0;

      const memory = (performance as any).memory;
      const memoryUsage = memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0;

      productionMonitoring.updateMetrics({
        pageLoadTime: navigation?.loadEventEnd - navigation?.fetchStart || 0,
        tti: navigation?.domInteractive - navigation?.fetchStart || 0,
        fcp: fcp,
        lcp: fcp,
        cls: 0,
        fid: 0,
        errorRate: 0,
        userCount: 1,
        sessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0,
      });
    };

    collectMetrics();

    return () => {
      productionMonitoring.stop();
    };
  }, [autoStart]);

  const start = useCallback(() => {
    productionMonitoring.start();
  }, []);

  const stop = useCallback(() => {
    productionMonitoring.stop();
  }, []);

  const updateMetrics = useCallback((metrics) => {
    productionMonitoring.updateMetrics(metrics);
  }, []);

  const getMetrics = useCallback(() => {
    return productionMonitoring.getMetrics();
  }, []);

  const getAlerts = useCallback(() => {
    return productionMonitoring.getAlerts();
  }, []);

  const addAlertRule = useCallback((rule: AlertRule) => {
    productionMonitoring.addAlertRule(rule);
  }, []);

  const removeAlertRule = useCallback((metric: string) => {
    productionMonitoring.removeAlertRule(metric);
  }, []);

  const getAlertRules = useCallback(() => {
    return productionMonitoring.getAlertRules();
  }, []);

  const clearAlerts = useCallback(() => {
    productionMonitoring.clearAlerts();
  }, []);

  const exportMetrics = useCallback(() => {
    return productionMonitoring.export();
  }, []);

  return {
    start,
    stop,
    updateMetrics,
    getMetrics,
    getAlerts,
    addAlertRule,
    removeAlertRule,
    getAlertRules,
    clearAlerts,
    exportMetrics,
  };
};

export default useProductionMonitoring;
