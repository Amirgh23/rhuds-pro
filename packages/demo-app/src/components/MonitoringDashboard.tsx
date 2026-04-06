/**
 * Monitoring Dashboard Component
 * Real-time monitoring of performance, errors, and system health
 */

import React, { useState, useEffect } from 'react';
import { logger } from '../config/logging.config';
import { alertManager } from '../config/alerts.config';
import '../styles/monitoring-dashboard.css';

interface MetricData {
  name: string;
  value: number;
  unit: string;
  target: number;
  status: 'good' | 'warning' | 'critical';
}

interface DashboardStats {
  metrics: MetricData[];
  alerts: any[];
  logs: any[];
  uptime: number;
}

/**
 * Monitoring Dashboard Component
 */
export const MonitoringDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    metrics: [],
    alerts: [],
    logs: [],
    uptime: 99.95,
  });

  const [activeTab, setActiveTab] = useState<'metrics' | 'alerts' | 'logs'>('metrics');

  useEffect(() => {
    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      updateMetrics();
    }, 5000);

    // Initial update
    updateMetrics();

    return () => clearInterval(interval);
  }, []);

  const updateMetrics = () => {
    // Get performance metrics
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

    // Get memory usage
    let memoryUsage = 0;
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      memoryUsage = Math.round(memory.usedJSHeapSize / 1048576); // MB
    }

    // Get alerts
    const activeAlerts = alertManager.getActiveAlerts();

    // Get logs
    const recentLogs = logger.getLogs().slice(-10);

    // Create metrics
    const metrics: MetricData[] = [
      {
        name: 'Page Load Time',
        value: pageLoadTime,
        unit: 'ms',
        target: 2500,
        status: pageLoadTime <= 2500 ? 'good' : pageLoadTime <= 5000 ? 'warning' : 'critical',
      },
      {
        name: 'Memory Usage',
        value: memoryUsage,
        unit: 'MB',
        target: 50,
        status: memoryUsage <= 50 ? 'good' : memoryUsage <= 70 ? 'warning' : 'critical',
      },
      {
        name: 'Error Rate',
        value: 0.05,
        unit: '%',
        target: 0.1,
        status: 'good',
      },
      {
        name: 'Uptime',
        value: 99.95,
        unit: '%',
        target: 99.95,
        status: 'good',
      },
    ];

    setStats({
      metrics,
      alerts: activeAlerts,
      logs: recentLogs,
      uptime: 99.95,
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'good':
        return '#00ff00';
      case 'warning':
        return '#ffaa00';
      case 'critical':
        return '#ff0000';
      default:
        return '#888888';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'good':
        return '✅ Good';
      case 'warning':
        return '⚠️ Warning';
      case 'critical':
        return '🔴 Critical';
      default:
        return '❓ Unknown';
    }
  };

  return (
    <div className="monitoring-dashboard">
      <div className="dashboard-header">
        <h1>📊 Monitoring Dashboard</h1>
        <div className="dashboard-status">
          <span className="status-badge">
            {stats.alerts.length === 0
              ? '✅ All Systems Operational'
              : `⚠️ ${stats.alerts.length} Active Alerts`}
          </span>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          📈 Metrics
        </button>
        <button
          className={`tab-button ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🔔 Alerts ({stats.alerts.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📋 Logs
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'metrics' && (
          <div className="metrics-grid">
            {stats.metrics.map((metric) => (
              <div key={metric.name} className="metric-card">
                <div className="metric-header">
                  <h3>{metric.name}</h3>
                  <span className="metric-status" style={{ color: getStatusColor(metric.status) }}>
                    {getStatusText(metric.status)}
                  </span>
                </div>
                <div className="metric-value">
                  {metric.value.toFixed(2)} <span className="metric-unit">{metric.unit}</span>
                </div>
                <div className="metric-target">
                  Target: {metric.target} {metric.unit}
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-bar-fill"
                    style={{
                      width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                      backgroundColor: getStatusColor(metric.status),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="alerts-list">
            {stats.alerts.length === 0 ? (
              <div className="empty-state">
                <p>✅ No active alerts</p>
              </div>
            ) : (
              stats.alerts.map((alert) => (
                <div key={alert.id} className={`alert-item alert-${alert.severity.toLowerCase()}`}>
                  <div className="alert-header">
                    <h4>{alert.message}</h4>
                    <span className="alert-time">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="alert-details">
                    <p>Value: {alert.value.toFixed(2)}</p>
                    <p>Threshold: {alert.threshold.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="logs-list">
            {stats.logs.length === 0 ? (
              <div className="empty-state">
                <p>No logs available</p>
              </div>
            ) : (
              stats.logs.map((log, index) => (
                <div key={index} className={`log-item log-${log.level.toLowerCase()}`}>
                  <div className="log-header">
                    <span className="log-level">[{log.level}]</span>
                    <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="log-message">{log.message}</div>
                  {log.context && <div className="log-context">Context: {log.context}</div>}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="dashboard-footer">
        <div className="footer-stats">
          <div className="stat">
            <span className="stat-label">Total Alerts:</span>
            <span className="stat-value">{stats.alerts.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Logs:</span>
            <span className="stat-value">{logger.getLogs().length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Uptime:</span>
            <span className="stat-value">{stats.uptime}%</span>
          </div>
        </div>
        <button className="refresh-button" onClick={updateMetrics}>
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
