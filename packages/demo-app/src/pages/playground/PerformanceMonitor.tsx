import React, { useEffect, useState } from 'react';
import { PerformanceMetrics } from './hooks/usePerformanceMonitor';
import './PerformanceMonitor.css';

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
  isVisible: boolean;
}

export function PerformanceMonitor({ metrics, isVisible }: PerformanceMonitorProps) {
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    setHistory((prev) => {
      const newHistory = [...prev, metrics.fps];
      return newHistory.slice(-60); // Keep last 60 frames
    });
  }, [metrics.fps]);

  if (!isVisible) return null;

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return '#6BCB77'; // Green
    if (fps >= 30) return '#FFD93D'; // Yellow
    return '#FF6B6B'; // Red
  };

  const getMemoryColor = (memory?: number) => {
    if (!memory) return '#A8DADC';
    if (memory < 50) return '#6BCB77';
    if (memory < 100) return '#FFD93D';
    return '#FF6B6B';
  };

  return (
    <div className="performance-monitor">
      <div className="perf-header">
        <span className="perf-title">⚡ Performance</span>
      </div>

      <div className="perf-metrics">
        <div className="metric">
          <span className="metric-label">FPS</span>
          <span className="metric-value" style={{ color: getPerformanceColor(metrics.fps) }}>
            {Math.round(metrics.fps)}
          </span>
        </div>

        <div className="metric">
          <span className="metric-label">Render</span>
          <span className="metric-value">{metrics.renderTime.toFixed(2)}ms</span>
        </div>

        {metrics.memoryUsage && (
          <div className="metric">
            <span className="metric-label">Memory</span>
            <span className="metric-value" style={{ color: getMemoryColor(metrics.memoryUsage) }}>
              {metrics.memoryUsage.toFixed(1)}MB
            </span>
          </div>
        )}
      </div>

      <div className="perf-chart">
        <div className="chart-bars">
          {history.map((fps, idx) => (
            <div
              key={idx}
              className="chart-bar"
              style={{
                height: `${(fps / 60) * 100}%`,
                backgroundColor: getPerformanceColor(fps),
              }}
              title={`${Math.round(fps)} FPS`}
            />
          ))}
        </div>
        <div className="chart-labels">
          <span>60</span>
          <span>30</span>
          <span>0</span>
        </div>
      </div>

      <div className="perf-status">
        {metrics.fps >= 55 && <span className="status-good">✓ Excellent performance</span>}
        {metrics.fps >= 30 && metrics.fps < 55 && (
          <span className="status-warning">⚠ Good performance</span>
        )}
        {metrics.fps < 30 && <span className="status-bad">✗ Poor performance</span>}
      </div>
    </div>
  );
}
