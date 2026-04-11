/**
 * Security Metrics Collector
 * Collects and analyzes security metrics and KPIs
 */

/**
 * Security metric
 */
export interface SecurityMetric {
  id: string;
  timestamp: number;
  name: string;
  value: number;
  unit: string;
  category: string;
  threshold?: number;
  status: 'normal' | 'warning' | 'critical';
}

/**
 * Security KPI
 */
export interface SecurityKPI {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  trend: 'improving' | 'stable' | 'degrading';
  lastUpdated: number;
}

/**
 * Security dashboard
 */
export interface SecurityDashboard {
  id: string;
  timestamp: number;
  totalThreats: number;
  openIncidents: number;
  criticalVulnerabilities: number;
  complianceScore: number;
  mttr: number; // Mean Time To Respond
  mtbf: number; // Mean Time Between Failures
  securityScore: number;
}

/**
 * Security Metrics Collector
 * Collects and analyzes security metrics and KPIs
 */
export class SecurityMetricsCollector {
  private metrics: Map<string, SecurityMetric[]> = new Map();
  private kpis: Map<string, SecurityKPI> = new Map();
  private dashboards: SecurityDashboard[] = [];
  private alerts: Array<{ timestamp: number; metric: SecurityMetric; message: string }> = [];

  /**
   * Record metric
   */
  recordMetric(metric: Omit<SecurityMetric, 'id' | 'timestamp' | 'status'>): SecurityMetric {
    const id = `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const status = this.determineStatus(metric.value, metric.threshold);

    const securityMetric: SecurityMetric = {
      ...metric,
      id,
      timestamp: Date.now(),
      status,
    };

    const metrics = this.metrics.get(metric.category) || [];
    metrics.push(securityMetric);
    this.metrics.set(metric.category, metrics);

    // Check for alerts
    if (status !== 'normal') {
      this.alerts.push({
        timestamp: Date.now(),
        metric: securityMetric,
        message: `${metric.name} is ${status}: ${metric.value} ${metric.unit}`,
      });
    }

    return securityMetric;
  }

  /**
   * Determine metric status
   */
  private determineStatus(value: number, threshold?: number): 'normal' | 'warning' | 'critical' {
    if (!threshold) return 'normal';

    if (value >= threshold * 1.5) return 'critical';
    if (value >= threshold) return 'warning';
    return 'normal';
  }

  /**
   * Update KPI
   */
  updateKPI(kpi: Omit<SecurityKPI, 'id' | 'lastUpdated'>): SecurityKPI {
    const id = `kpi-${kpi.name.toLowerCase().replace(/\s+/g, '-')}`;

    const trend = this.calculateTrend(id, kpi.current, kpi.target);

    const securityKPI: SecurityKPI = {
      ...kpi,
      id,
      trend,
      lastUpdated: Date.now(),
    };

    this.kpis.set(id, securityKPI);
    return securityKPI;
  }

  /**
   * Calculate trend
   */
  private calculateTrend(
    kpiId: string,
    current: number,
    target: number
  ): 'improving' | 'stable' | 'degrading' {
    const existing = this.kpis.get(kpiId);
    if (!existing) return 'stable';

    const improvement = current - existing.current;

    if (current > target) {
      // Higher is worse
      if (improvement < -0.05 * target) return 'improving';
      if (improvement > 0.05 * target) return 'degrading';
    } else {
      // Lower is better
      if (improvement > 0.05 * target) return 'improving';
      if (improvement < -0.05 * target) return 'degrading';
    }

    return 'stable';
  }

  /**
   * Record dashboard snapshot
   */
  recordDashboard(dashboard: Omit<SecurityDashboard, 'id' | 'timestamp'>): SecurityDashboard {
    const id = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const securityDashboard: SecurityDashboard = {
      ...dashboard,
      id,
      timestamp: Date.now(),
    };

    this.dashboards.push(securityDashboard);
    return securityDashboard;
  }

  /**
   * Get metrics by category
   */
  getMetricsByCategory(category: string): SecurityMetric[] {
    return this.metrics.get(category) || [];
  }

  /**
   * Get metrics by status
   */
  getMetricsByStatus(status: 'normal' | 'warning' | 'critical'): SecurityMetric[] {
    const result: SecurityMetric[] = [];

    for (const metrics of this.metrics.values()) {
      result.push(...metrics.filter((m) => m.status === status));
    }

    return result;
  }

  /**
   * Get metric trend
   */
  getMetricTrend(name: string, limit?: number): SecurityMetric[] {
    const allMetrics: SecurityMetric[] = [];

    for (const metrics of this.metrics.values()) {
      allMetrics.push(...metrics.filter((m) => m.name === name));
    }

    allMetrics.sort((a, b) => a.timestamp - b.timestamp);

    if (limit) {
      return allMetrics.slice(-limit);
    }

    return allMetrics;
  }

  /**
   * Get KPI
   */
  getKPI(kpiId: string): SecurityKPI | undefined {
    return this.kpis.get(kpiId);
  }

  /**
   * Get all KPIs
   */
  getAllKPIs(): SecurityKPI[] {
    return Array.from(this.kpis.values());
  }

  /**
   * Get dashboard snapshot
   */
  getLatestDashboard(): SecurityDashboard | undefined {
    return this.dashboards[this.dashboards.length - 1];
  }

  /**
   * Get dashboard history
   */
  getDashboardHistory(limit?: number): SecurityDashboard[] {
    if (limit) {
      return this.dashboards.slice(-limit);
    }
    return [...this.dashboards];
  }

  /**
   * Get alerts
   */
  getAlerts(limit?: number): Array<{ timestamp: number; metric: SecurityMetric; message: string }> {
    if (limit) {
      return this.alerts.slice(-limit);
    }
    return [...this.alerts];
  }

  /**
   * Get critical alerts
   */
  getCriticalAlerts(): Array<{ timestamp: number; metric: SecurityMetric; message: string }> {
    return this.alerts.filter((a) => a.metric.status === 'critical');
  }

  /**
   * Calculate security score
   */
  calculateSecurityScore(): number {
    const kpis = this.getAllKPIs();
    if (kpis.length === 0) return 100;

    let totalScore = 0;
    let weight = 0;

    for (const kpi of kpis) {
      const kpiScore = Math.max(0, Math.min(100, (kpi.current / kpi.target) * 100));
      totalScore += kpiScore;
      weight++;
    }

    return weight > 0 ? totalScore / weight : 100;
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary(): Record<string, unknown> {
    const allMetrics: SecurityMetric[] = [];
    for (const metrics of this.metrics.values()) {
      allMetrics.push(...metrics);
    }

    const normalCount = allMetrics.filter((m) => m.status === 'normal').length;
    const warningCount = allMetrics.filter((m) => m.status === 'warning').length;
    const criticalCount = allMetrics.filter((m) => m.status === 'critical').length;

    const categories: Record<string, number> = {};
    for (const metric of allMetrics) {
      categories[metric.category] = (categories[metric.category] || 0) + 1;
    }

    return {
      totalMetrics: allMetrics.length,
      normalMetrics: normalCount,
      warningMetrics: warningCount,
      criticalMetrics: criticalCount,
      categories,
      securityScore: this.calculateSecurityScore(),
    };
  }

  /**
   * Export metrics report
   */
  exportMetricsReport(format: 'json' | 'csv' = 'json'): string {
    const allMetrics: SecurityMetric[] = [];
    for (const metrics of this.metrics.values()) {
      allMetrics.push(...metrics);
    }

    if (format === 'json') {
      return JSON.stringify(allMetrics, null, 2);
    }

    // CSV format
    const headers = ['ID', 'Timestamp', 'Name', 'Value', 'Unit', 'Category', 'Status'];
    const rows = allMetrics.map((m) => [
      m.id,
      m.timestamp,
      m.name,
      m.value,
      m.unit,
      m.category,
      m.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Generate metrics report
   */
  generateMetricsReport(): string {
    const summary = this.getMetricsSummary();
    const kpis = this.getAllKPIs();
    const dashboard = this.getLatestDashboard();

    let report = '# Security Metrics Report\n\n';

    report += `## Summary\n`;
    report += `- Total Metrics: ${summary.totalMetrics}\n`;
    report += `- Normal: ${summary.normalMetrics}\n`;
    report += `- Warning: ${summary.warningMetrics}\n`;
    report += `- Critical: ${summary.criticalMetrics}\n`;
    report += `- Security Score: ${(summary.securityScore as number).toFixed(2)}/100\n\n`;

    report += `## KPIs\n`;
    for (const kpi of kpis) {
      report += `- ${kpi.name}: ${kpi.current}/${kpi.target} ${kpi.unit} (${kpi.trend})\n`;
    }

    if (dashboard) {
      report += `\n## Latest Dashboard\n`;
      report += `- Total Threats: ${dashboard.totalThreats}\n`;
      report += `- Open Incidents: ${dashboard.openIncidents}\n`;
      report += `- Critical Vulnerabilities: ${dashboard.criticalVulnerabilities}\n`;
      report += `- Compliance Score: ${dashboard.complianceScore}%\n`;
      report += `- MTTR: ${dashboard.mttr} minutes\n`;
      report += `- MTBF: ${dashboard.mtbf} hours\n`;
    }

    return report;
  }
}
