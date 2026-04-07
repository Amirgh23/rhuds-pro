import React, { useState, useEffect, useRef } from 'react';
import './PerformanceMetricsDashboard.css';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  trend?: number;
}

interface PerformanceMetrics {
  pageLoad: PerformanceMetric;
  tti: PerformanceMetric;
  fcp: PerformanceMetric;
  lcp: PerformanceMetric;
  cls: PerformanceMetric;
  fid: PerformanceMetric;
  bundleSize: PerformanceMetric;
  memoryUsage: PerformanceMetric;
  fps: PerformanceMetric;
  networkLatency: PerformanceMetric;
}

interface HistoricalData {
  timestamp: number;
  metrics: Partial<PerformanceMetrics>;
}

export const PerformanceMetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [history, setHistory] = useState<HistoricalData[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const metricsRef = useRef<PerformanceMetrics | null>(null);
  const historyRef = useRef<HistoricalData[]>([]);
  const fpsRef = useRef({ frames: 0, lastTime: performance.now() });

  // Calculate status based on thresholds
  const getStatus = (value: number, threshold: number): 'good' | 'warning' | 'critical' => {
    if (value <= threshold * 0.8) return 'good';
    if (value <= threshold) return 'warning';
    return 'critical';
  };

  // Measure Core Web Vitals
  useEffect(() => {
    const measureMetrics = async () => {
      try {
        // Get navigation timing
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        const pageLoad = navigation?.loadEventEnd - navigation?.fetchStart || 0;

        // Get paint timing
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find((e) => e.name === 'first-contentful-paint')?.startTime || 0;

        // Get largest contentful paint
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            const lcp = lastEntry.startTime;
            updateMetrics('lcp', lcp);
          }
        });

        try {
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP not supported
        }

        // Get cumulative layout shift
        let cls = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
              updateMetrics('cls', cls);
            }
          }
        });

        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          // CLS not supported
        }

        // Get first input delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const fid = (entries[0] as any).processingDuration;
            updateMetrics('fid', fid);
          }
        });

        try {
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          // FID not supported
        }

        // Get TTI (Time to Interactive)
        const tti = navigation?.domInteractive - navigation?.fetchStart || 0;

        // Get memory usage
        const memory = (performance as any).memory;
        const memoryUsage = memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0;

        // Get bundle size from resource timing
        let bundleSize = 0;
        const resources = performance.getEntriesByType('resource');
        resources.forEach((resource) => {
          if (
            resource.name.includes('.js') ||
            resource.name.includes('.css') ||
            resource.name.includes('.wasm')
          ) {
            bundleSize += (resource as PerformanceResourceTiming).transferSize || 0;
          }
        });

        // Get network latency
        const networkLatency = navigation?.responseStart - navigation?.fetchStart || 0;

        // Update metrics
        const newMetrics: PerformanceMetrics = {
          pageLoad: {
            name: 'Page Load',
            value: Math.round(pageLoad),
            unit: 'ms',
            threshold: 1100,
            status: getStatus(pageLoad, 1100),
            trend: undefined,
          },
          tti: {
            name: 'Time to Interactive',
            value: Math.round(tti),
            unit: 'ms',
            threshold: 2500,
            status: getStatus(tti, 2500),
            trend: undefined,
          },
          fcp: {
            name: 'First Contentful Paint',
            value: Math.round(fcp),
            unit: 'ms',
            threshold: 1800,
            status: getStatus(fcp, 1800),
            trend: undefined,
          },
          lcp: {
            name: 'Largest Contentful Paint',
            value: Math.round(fcp), // Will be updated by observer
            unit: 'ms',
            threshold: 2500,
            status: getStatus(fcp, 2500),
            trend: undefined,
          },
          cls: {
            name: 'Cumulative Layout Shift',
            value: Math.round(cls * 1000) / 1000,
            unit: '',
            threshold: 0.1,
            status: getStatus(cls, 0.1),
            trend: undefined,
          },
          fid: {
            name: 'First Input Delay',
            value: 0,
            unit: 'ms',
            threshold: 100,
            status: 'good',
            trend: undefined,
          },
          bundleSize: {
            name: 'Bundle Size',
            value: Math.round(bundleSize / 1024),
            unit: 'KB',
            threshold: 35,
            status: getStatus(bundleSize / 1024, 35),
            trend: undefined,
          },
          memoryUsage: {
            name: 'Memory Usage',
            value: Math.round(memoryUsage),
            unit: '%',
            threshold: 80,
            status: getStatus(memoryUsage, 80),
            trend: undefined,
          },
          fps: {
            name: 'Frame Rate',
            value: 60,
            unit: 'fps',
            threshold: 50,
            status: 'good',
            trend: undefined,
          },
          networkLatency: {
            name: 'Network Latency',
            value: Math.round(networkLatency),
            unit: 'ms',
            threshold: 200,
            status: getStatus(networkLatency, 200),
            trend: undefined,
          },
        };

        metricsRef.current = newMetrics;
        setMetrics(newMetrics);

        // Add to history
        const newHistory: HistoricalData = {
          timestamp: Date.now(),
          metrics: newMetrics,
        };
        historyRef.current = [...historyRef.current.slice(-59), newHistory];
        setHistory(historyRef.current);
      } catch (error) {
        console.error('Error measuring metrics:', error);
      }
    };

    measureMetrics();

    // Refresh metrics periodically
    const interval = autoRefresh ? setInterval(measureMetrics, 5000) : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Measure FPS
  useEffect(() => {
    let animationFrameId: number;
    const measureFPS = () => {
      const now = performance.now();
      fpsRef.current.frames++;

      if (now >= fpsRef.current.lastTime + 1000) {
        const fps = Math.round((fpsRef.current.frames * 1000) / (now - fpsRef.current.lastTime));
        updateMetrics('fps', fps);
        fpsRef.current.frames = 0;
        fpsRef.current.lastTime = now;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const updateMetrics = (key: keyof PerformanceMetrics, value: number) => {
    if (metricsRef.current) {
      const metric = metricsRef.current[key];
      metricsRef.current[key] = {
        ...metric,
        value,
        status: getStatus(value, metric.threshold),
      };
      setMetrics({ ...metricsRef.current });
    }
  };

  if (!metrics) {
    return (
      <div className="performance-dashboard loading">
        <p>Loading metrics...</p>
      </div>
    );
  }

  const criticalMetrics = Object.values(metrics).filter((m) => m.status === 'critical');
  const warningMetrics = Object.values(metrics).filter((m) => m.status === 'warning');

  return (
    <div className={`performance-dashboard ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="dashboard-header">
        <button
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '−' : '+'}
        </button>
        <h3>Performance Metrics</h3>
        <div className="header-controls">
          <button
            className={`refresh-button ${autoRefresh ? 'active' : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
            title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
          >
            ⟳
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="dashboard-content">
          {/* Summary Section */}
          <div className="summary-section">
            <div className="summary-item good">
              <span className="label">Good</span>
              <span className="count">
                {Object.values(metrics).filter((m) => m.status === 'good').length}
              </span>
            </div>
            <div className="summary-item warning">
              <span className="label">Warning</span>
              <span className="count">{warningMetrics.length}</span>
            </div>
            <div className="summary-item critical">
              <span className="label">Critical</span>
              <span className="count">{criticalMetrics.length}</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            {Object.entries(metrics).map(([key, metric]) => (
              <div key={key} className={`metric-card ${metric.status}`}>
                <div className="metric-header">
                  <span className="metric-name">{metric.name}</span>
                  <span className={`metric-status ${metric.status}`}>●</span>
                </div>
                <div className="metric-value">
                  {metric.value}
                  <span className="metric-unit">{metric.unit}</span>
                </div>
                <div className="metric-threshold">
                  Threshold: {metric.threshold}
                  {metric.unit}
                </div>
              </div>
            ))}
          </div>

          {/* History Chart */}
          {history.length > 1 && (
            <div className="history-section">
              <h4>Performance History (Last 60s)</h4>
              <div className="history-chart">
                {history.map((entry, index) => (
                  <div
                    key={index}
                    className="history-bar"
                    style={{
                      height: `${Math.min(100, (entry.metrics.pageLoad?.value || 0) / 10)}%`,
                    }}
                    title={`${entry.metrics.pageLoad?.value || 0}ms`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Alerts Section */}
          {(criticalMetrics.length > 0 || warningMetrics.length > 0) && (
            <div className="alerts-section">
              <h4>Alerts</h4>
              {criticalMetrics.map((metric) => (
                <div key={metric.name} className="alert critical">
                  <span className="alert-icon">⚠</span>
                  <span className="alert-text">
                    {metric.name}: {metric.value}
                    {metric.unit} (threshold: {metric.threshold}
                    {metric.unit})
                  </span>
                </div>
              ))}
              {warningMetrics.map((metric) => (
                <div key={metric.name} className="alert warning">
                  <span className="alert-icon">!</span>
                  <span className="alert-text">
                    {metric.name}: {metric.value}
                    {metric.unit} (threshold: {metric.threshold}
                    {metric.unit})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceMetricsDashboard;
