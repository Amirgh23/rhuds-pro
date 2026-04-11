/**
 * Security Dashboard Engine
 * Comprehensive security dashboards and visualization
 */

/**
 * Dashboard widget definition
 */
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  data: Record<string, unknown>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

/**
 * Dashboard definition
 */
export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Dashboard metrics
 */
export interface DashboardMetrics {
  totalIncidents: number;
  activeAlerts: number;
  threatLevel: 'critical' | 'high' | 'medium' | 'low';
  complianceScore: number;
  mttr: number;
  mtbf: number;
}

/**
 * Dashboard statistics
 */
export interface DashboardStatistics {
  totalDashboards: number;
  totalWidgets: number;
  averageWidgetsPerDashboard: number;
  lastUpdated: Date;
}

/**
 * Security Dashboard Engine
 * Creates and manages security dashboards
 */
export class SecurityDashboardEngine {
  private dashboards: Map<string, Dashboard> = new Map();
  private widgets: Map<string, DashboardWidget> = new Map();
  private metrics: Map<string, DashboardMetrics> = new Map();

  /**
   * Create dashboard
   */
  createDashboard(name: string, description: string): Dashboard {
    const id = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const dashboard: Dashboard = {
      id,
      name,
      description,
      widgets: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.dashboards.set(id, dashboard);
    return dashboard;
  }

  /**
   * Add widget to dashboard
   */
  addWidget(dashboardId: string, widget: Omit<DashboardWidget, 'id'>): DashboardWidget {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    const id = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullWidget: DashboardWidget = { ...widget, id };

    this.widgets.set(id, fullWidget);
    dashboard.widgets.push(fullWidget);
    dashboard.updatedAt = new Date();

    return fullWidget;
  }

  /**
   * Remove widget from dashboard
   */
  removeWidget(dashboardId: string, widgetId: string): void {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return;

    dashboard.widgets = dashboard.widgets.filter((w) => w.id !== widgetId);
    this.widgets.delete(widgetId);
    dashboard.updatedAt = new Date();
  }

  /**
   * Update widget
   */
  updateWidget(dashboardId: string, widgetId: string, data: Partial<DashboardWidget>): void {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return;

    const widget = dashboard.widgets.find((w) => w.id === widgetId);
    if (!widget) return;

    Object.assign(widget, data);
    dashboard.updatedAt = new Date();
  }

  /**
   * Get dashboard
   */
  getDashboard(dashboardId: string): Dashboard | undefined {
    return this.dashboards.get(dashboardId);
  }

  /**
   * Get all dashboards
   */
  getAllDashboards(): Dashboard[] {
    return Array.from(this.dashboards.values());
  }

  /**
   * Record dashboard metrics
   */
  recordMetrics(dashboardId: string, metrics: DashboardMetrics): void {
    this.metrics.set(dashboardId, metrics);
  }

  /**
   * Get dashboard metrics
   */
  getMetrics(dashboardId: string): DashboardMetrics | undefined {
    return this.metrics.get(dashboardId);
  }

  /**
   * Get threat level
   */
  getThreatLevel(): 'critical' | 'high' | 'medium' | 'low' {
    const allMetrics = Array.from(this.metrics.values());
    if (allMetrics.length === 0) return 'low';

    const maxLevel = allMetrics.reduce((max, m) => {
      const levels = { critical: 4, high: 3, medium: 2, low: 1 };
      return Math.max(max, levels[m.threatLevel]);
    }, 0);

    const levelMap: Record<number, 'critical' | 'high' | 'medium' | 'low'> = {
      4: 'critical',
      3: 'high',
      2: 'medium',
      1: 'low',
    };

    return levelMap[maxLevel] || 'low';
  }

  /**
   * Get average compliance score
   */
  getAverageComplianceScore(): number {
    const allMetrics = Array.from(this.metrics.values());
    if (allMetrics.length === 0) return 0;

    return allMetrics.reduce((sum, m) => sum + m.complianceScore, 0) / allMetrics.length;
  }

  /**
   * Get total active alerts
   */
  getTotalActiveAlerts(): number {
    const allMetrics = Array.from(this.metrics.values());
    return allMetrics.reduce((sum, m) => sum + m.activeAlerts, 0);
  }

  /**
   * Get statistics
   */
  getStatistics(): DashboardStatistics {
    const allDashboards = Array.from(this.dashboards.values());
    const totalWidgets = allDashboards.reduce((sum, d) => sum + d.widgets.length, 0);

    return {
      totalDashboards: allDashboards.length,
      totalWidgets,
      averageWidgetsPerDashboard:
        allDashboards.length > 0 ? totalWidgets / allDashboards.length : 0,
      lastUpdated: new Date(),
    };
  }

  /**
   * Export dashboard report
   */
  exportDashboardReport(dashboardId: string, format: 'json' | 'csv'): string {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return '';

    const metrics = this.metrics.get(dashboardId);

    if (format === 'json') {
      return JSON.stringify({ dashboard, metrics }, null, 2);
    }

    const rows = [
      ['Property', 'Value'],
      ['Dashboard Name', dashboard.name],
      ['Description', dashboard.description],
      ['Total Widgets', dashboard.widgets.length.toString()],
      ['Created At', dashboard.createdAt.toISOString()],
      ['Updated At', dashboard.updatedAt.toISOString()],
    ];

    if (metrics) {
      rows.push(
        ['Total Incidents', metrics.totalIncidents.toString()],
        ['Active Alerts', metrics.activeAlerts.toString()],
        ['Threat Level', metrics.threatLevel],
        ['Compliance Score', metrics.complianceScore.toFixed(2)],
        ['MTTR', metrics.mttr.toString()],
        ['MTBF', metrics.mtbf.toString()]
      );
    }

    return rows.map((row) => row.join(',')).join('\n');
  }
}
