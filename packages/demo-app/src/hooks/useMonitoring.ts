/**
 * useMonitoring Hook
 * Integrates all monitoring systems (Sentry, Analytics, Logging, Alerts)
 */

import { useEffect, useRef } from 'react';
import { initializeSentry, captureException, addBreadcrumb } from '../config/sentry.config';
import {
  initializeAnalytics,
  trackPageView,
  trackPerformanceMetrics,
  trackUserEngagement,
} from '../config/analytics.config';
import {
  initializeLogging,
  logger,
  logPerformanceMetrics,
  logMemoryUsage,
} from '../config/logging.config';
import { initializeAlerts, alertManager } from '../config/alerts.config';

interface MonitoringOptions {
  enableSentry?: boolean;
  enableAnalytics?: boolean;
  enableLogging?: boolean;
  enableAlerts?: boolean;
  enablePerformanceTracking?: boolean;
  enableMemoryTracking?: boolean;
}

/**
 * useMonitoring Hook
 * Initialize and manage all monitoring systems
 */
export const useMonitoring = (options: MonitoringOptions = {}) => {
  const {
    enableSentry = true,
    enableAnalytics = true,
    enableLogging = true,
    enableAlerts = true,
    enablePerformanceTracking = true,
    enableMemoryTracking = true,
  } = options;

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Initialize Sentry
    if (enableSentry) {
      try {
        initializeSentry();
        logger.info('Sentry initialized', 'monitoring');
      } catch (error) {
        console.error('Failed to initialize Sentry:', error);
      }
    }

    // Initialize Analytics
    if (enableAnalytics) {
      try {
        initializeAnalytics();
        trackPageView(window.location.pathname, document.title);
        trackPerformanceMetrics();
        trackUserEngagement();
        logger.info('Analytics initialized', 'monitoring');
      } catch (error) {
        console.error('Failed to initialize Analytics:', error);
      }
    }

    // Initialize Logging
    if (enableLogging) {
      try {
        initializeLogging();
        logger.info('Logging initialized', 'monitoring');
      } catch (error) {
        console.error('Failed to initialize Logging:', error);
      }
    }

    // Initialize Alerts
    if (enableAlerts) {
      try {
        initializeAlerts();
        logger.info('Alerts initialized', 'monitoring');
      } catch (error) {
        console.error('Failed to initialize Alerts:', error);
      }
    }

    // Set up performance tracking
    if (enablePerformanceTracking) {
      const perfInterval = setInterval(() => {
        try {
          logPerformanceMetrics();
        } catch (error) {
          console.error('Failed to log performance metrics:', error);
        }
      }, 10000); // Every 10 seconds

      return () => clearInterval(perfInterval);
    }

    // Set up memory tracking
    if (enableMemoryTracking) {
      const memInterval = setInterval(() => {
        try {
          logMemoryUsage();

          // Check memory usage and trigger alerts
          if ('memory' in performance) {
            const memory = (performance as any).memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
            alertManager.checkMetrics('memory_usage', usedMB);
          }
        } catch (error) {
          console.error('Failed to log memory usage:', error);
        }
      }, 30000); // Every 30 seconds

      return () => clearInterval(memInterval);
    }
  }, [
    enableSentry,
    enableAnalytics,
    enableLogging,
    enableAlerts,
    enablePerformanceTracking,
    enableMemoryTracking,
  ]);

  return {
    logger,
    alertManager,
    captureException,
    addBreadcrumb,
  };
};

/**
 * usePageTracking Hook
 * Track page views and navigation
 */
export const usePageTracking = (pageName: string) => {
  useEffect(() => {
    trackPageView(window.location.pathname, pageName);
    logger.info(`Page viewed: ${pageName}`, 'navigation');
    addBreadcrumb(`Navigated to ${pageName}`, 'navigation');
  }, [pageName]);
};

/**
 * useErrorTracking Hook
 * Track errors and exceptions
 */
export const useErrorTracking = () => {
  return (error: Error, context?: string) => {
    logger.error(`Error: ${error.message}`, context || 'error', {}, error);
    captureException(error, { context });
    addBreadcrumb(`Error: ${error.message}`, 'error', 'error');
  };
};

/**
 * usePerformanceTracking Hook
 * Track performance metrics
 */
export const usePerformanceTracking = () => {
  useEffect(() => {
    // Track page load time
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      logger.info('Page loaded', 'performance', { pageLoadTime });
      alertManager.checkMetrics('page_load_time', pageLoadTime);
    });

    // Track navigation timing
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          logger.info(`Performance: ${entry.name}`, 'performance', {
            duration: entry.duration,
          });
          alertManager.checkMetrics(entry.name, entry.duration);
        }
      });

      observer.observe({
        entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'],
      });

      return () => observer.disconnect();
    }
  }, []);
};

/**
 * useUserTracking Hook
 * Track user interactions and engagement
 */
export const useUserTracking = () => {
  useEffect(() => {
    const trackInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      logger.debug(`User interaction: ${event.type}`, 'user', {
        element: target?.tagName,
        id: target?.id,
        class: target?.className,
      });
    };

    ['click', 'scroll', 'keypress', 'submit'].forEach((eventType) => {
      document.addEventListener(eventType, trackInteraction, true);
    });

    return () => {
      ['click', 'scroll', 'keypress', 'submit'].forEach((eventType) => {
        document.removeEventListener(eventType, trackInteraction, true);
      });
    };
  }, []);
};

/**
 * useNetworkTracking Hook
 * Track network requests
 */
export const useNetworkTracking = () => {
  useEffect(() => {
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = function (...args: any[]) {
      const startTime = performance.now();
      const url = args[0];
      const method = args[1]?.method || 'GET';

      return originalFetch.apply(this, args).then((response) => {
        const duration = performance.now() - startTime;
        logger.info('Network request', 'network', {
          method,
          url,
          status: response.status,
          duration,
        });
        alertManager.checkMetrics('api_response_time', duration);
        return response;
      });
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);
};

export default useMonitoring;
