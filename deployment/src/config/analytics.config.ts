/**
 * Google Analytics Configuration
 * Performance monitoring and user behavior tracking
 */

/**
 * Initialize Google Analytics
 */
export const initializeAnalytics = () => {
  const GA_ID = import.meta.env.VITE_GA_ID || 'G-XXXXXXXXXX';

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', GA_ID, {
    page_path: window.location.pathname,
    send_page_view: true,
  });

  // Store gtag globally
  (window as any).gtag = gtag;
};

/**
 * Track page view
 */
export const trackPageView = (path: string, title?: string) => {
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }
};

/**
 * Track event
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', eventName, eventParams || {});
  }
};

/**
 * Track performance metrics
 */
export const trackPerformanceMetrics = () => {
  if ('PerformanceObserver' in window) {
    // Track Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const gtag = (window as any).gtag;
        if (gtag) {
          gtag('event', entry.name, {
            value: Math.round(entry.duration),
            event_category: 'web_vitals',
          });
        }
      }
    });

    // Observe paint entries
    observer.observe({
      entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'],
    });
  }

  // Track page load time
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

    const gtag = (window as any).gtag;
    if (gtag) {
      gtag('event', 'page_load_time', {
        value: Math.round(pageLoadTime),
        event_category: 'performance',
      });
    }
  });
};

/**
 * Track user engagement
 */
export const trackUserEngagement = () => {
  let engagementTimeout: NodeJS.Timeout;

  const recordEngagement = () => {
    const gtag = (window as any).gtag;
    if (gtag) {
      gtag('event', 'user_engagement', {
        event_category: 'engagement',
      });
    }
  };

  // Track user interactions
  ['click', 'scroll', 'keypress'].forEach((event) => {
    document.addEventListener(event, () => {
      clearTimeout(engagementTimeout);
      engagementTimeout = setTimeout(recordEngagement, 5000);
    });
  });
};

/**
 * Track error
 */
export const trackError = (error: Error, context?: string) => {
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', 'exception', {
      description: `${context || 'Error'}: ${error.message}`,
      fatal: false,
    });
  }
};

/**
 * Track conversion
 */
export const trackConversion = (conversionId: string, value?: number) => {
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', 'conversion', {
      conversion_id: conversionId,
      value: value || 1,
    });
  }
};

/**
 * Set user ID
 */
export const setUserId = (userId: string) => {
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('config', {
      user_id: userId,
    });
  }
};

/**
 * Set user properties
 */
export const setUserProperties = (properties: Record<string, any>) => {
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('set', {
      user_properties: properties,
    });
  }
};

/**
 * Track custom metric
 */
export const trackCustomMetric = (
  metricName: string,
  value: number,
  category: string = 'custom'
) => {
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', metricName, {
      value,
      event_category: category,
    });
  }
};

/**
 * Track memory usage
 */
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const gtag = (window as any).gtag;
    if (gtag) {
      gtag('event', 'memory_usage', {
        used_memory: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total_memory: Math.round(memory.totalJSHeapSize / 1048576), // MB
        event_category: 'performance',
      });
    }
  }
};

/**
 * Track CPU usage
 */
export const trackCPUUsage = () => {
  const startTime = performance.now();
  const startCPU = (performance as any).cpuUsage?.();

  setTimeout(() => {
    const endTime = performance.now();
    const endCPU = (performance as any).cpuUsage?.();

    if (startCPU && endCPU) {
      const cpuUsage = ((endCPU.user - startCPU.user) / (endTime - startTime)) * 100;
      const gtag = (window as any).gtag;
      if (gtag) {
        gtag('event', 'cpu_usage', {
          value: Math.round(cpuUsage),
          event_category: 'performance',
        });
      }
    }
  }, 1000);
};

/**
 * Track frame rate
 */
export const trackFrameRate = () => {
  let frameCount = 0;
  let lastTime = performance.now();

  const countFrames = () => {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
      const gtag = (window as any).gtag;
      if (gtag) {
        gtag('event', 'frame_rate', {
          value: frameCount,
          event_category: 'performance',
        });
      }
      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(countFrames);
  };

  requestAnimationFrame(countFrames);
};

export default {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackPerformanceMetrics,
  trackUserEngagement,
  trackError,
  trackConversion,
  setUserId,
  setUserProperties,
  trackCustomMetric,
  trackMemoryUsage,
  trackCPUUsage,
  trackFrameRate,
};
