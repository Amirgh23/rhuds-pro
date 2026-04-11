/**
 * Security Dashboard Generator
 * Generates comprehensive security dashboards
 */

/**
 * Dashboard widget
 */
export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'alert' | 'status';
  title: string;
  data: Record<string, unknown>;
  refreshInterval: number;
}

/**
 * Security dashboard
 */
export interface SecurityDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
}

/**
 * Dashboard view
 */
export interface DashboardView {
  id: string;
  dashboardId: string;
  timestamp: number;
  data: Record<string, unknown>;
}

/**
 * Security Dashboard Generator
 * Generates comprehensive security dashboards
 */
export class SecurityDashboardGenerator {
  private dashboards: Map<string, SecurityDashboard> = new Map();
  private views: Map<string, DashboardView[]> = new Map();
  private templates: Map<string, Omit<SecurityDashboard, 'id' | 'createdAt' | 'updatedAt'>> =
    new Map();

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialize default templates
   */
  private initializeTemplates(): void {
    this.templates.set('executive', {
      name: 'Executive Dashboard',
      description: 'High-level security overview for executives',
      widgets: [
        {
          id: 'widget-1',
          type: 'metric',
          title: 'Security Score',
          data: { value: 0, unit: '%', target: 100 },
          refreshInterval: 300000,
        },
        {
          id: 'widget-2',
          type: 'metric',
          title: 'Open Incidents',
          data: { value: 0, unit: 'incidents', trend: 'stable' },
          refreshInterval: 60000,
        },
        {
          id: 'widget-3',
          type: 'chart',
          title: 'Threat Trends',
          data: { type: 'line', series: [] },
          refreshInterval: 600000,
        },
        {
          id: 'widget-4',
          type: 'alert',
          title: 'Critical Alerts',
          data: { alerts: [] },
          refreshInterval: 30000,
        },
      ],
      isPublic: false,
    });

    this.templates.set('soc', {
      name: 'SOC Dashboard',
      description: 'Detailed dashboard for Security Operations Center',
      widgets: [
        {
          id: 'widget-1',
          type: 'table',
          title: 'Active Threats',
          data: { columns: ['ID', 'Type', 'Severity', 'Status'], rows: [] },
          refreshInterval: 30000,
        },
        {
          id: 'widget-2',
          type: 'table',
          title: 'Incidents',
          data: { columns: ['ID', 'Title', 'Severity', 'Status'], rows: [] },
          refreshInterval: 30000,
        },
        {
          id: 'widget-3',
          type: 'chart',
          title: 'Event Distribution',
          data: { type: 'pie', series: [] },
          refreshInterval: 300000,
        },
        {
          id: 'widget-4',
          type: 'status',
          title: 'System Status',
          data: { systems: [] },
          refreshInterval: 60000,
        },
      ],
      isPublic: false,
    });

    this.templates.set('compliance', {
      name: 'Compliance Dashboard',
      description: 'Compliance and audit dashboard',
      widgets: [
        {
          id: 'widget-1',
          type: 'metric',
          title: 'Compliance Score',
          data: { value: 0, unit: '%', frameworks: [] },
          refreshInterval: 600000,
        },
        {
          id: 'widget-2',
          type: 'table',
          title: 'Violations',
          data: { columns: ['Framework', 'Violation', 'Severity', 'Status'], rows: [] },
          refreshInterval: 300000,
        },
        {
          id: 'widget-3',
          type: 'chart',
          title: 'Compliance Trends',
          data: { type: 'line', series: [] },
          refreshInterval: 600000,
        },
      ],
      isPublic: false,
    });
  }

  /**
   * Create dashboard from template
   */
  createDashboardFromTemplate(templateName: string, customName?: string): SecurityDashboard | null {
    const template = this.templates.get(templateName);
    if (!template) return null;

    const id = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const dashboard: SecurityDashboard = {
      id,
      name: customName || template.name,
      description: template.description,
      widgets: template.widgets,
      createdAt: now,
      updatedAt: now,
      isPublic: template.isPublic,
    };

    this.dashboards.set(id, dashboard);
    return dashboard;
  }

  /**
   * Create custom dashboard
   */
  createDashboard(
    dashboard: Omit<SecurityDashboard, 'id' | 'createdAt' | 'updatedAt'>
  ): SecurityDashboard {
    const id = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const securityDashboard: SecurityDashboard = {
      ...dashboard,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.dashboards.set(id, securityDashboard);
    return securityDashboard;
  }

  /**
   * Add widget to dashboard
   */
  addWidget(dashboardId: string, widget: Omit<DashboardWidget, 'id'>): DashboardWidget | null {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return null;

    const id = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const dashboardWidget: DashboardWidget = { ...widget, id };

    dashboard.widgets.push(dashboardWidget);
    dashboard.updatedAt = Date.now();

    return dashboardWidget;
  }

  /**
   * Remove widget from dashboard
   */
  removeWidget(dashboardId: string, widgetId: string): boolean {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return false;

    const index = dashboard.widgets.findIndex((w) => w.id === widgetId);
    if (index === -1) return false;

    dashboard.widgets.splice(index, 1);
    dashboard.updatedAt = Date.now();

    return true;
  }

  /**
   * Update widget
   */
  updateWidget(dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>): boolean {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return false;

    const widget = dashboard.widgets.find((w) => w.id === widgetId);
    if (!widget) return false;

    Object.assign(widget, updates);
    dashboard.updatedAt = Date.now();

    return true;
  }

  /**
   * Record dashboard view
   */
  recordView(dashboardId: string, data: Record<string, unknown>): DashboardView {
    const id = `view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const view: DashboardView = {
      id,
      dashboardId,
      timestamp: Date.now(),
      data,
    };

    const views = this.views.get(dashboardId) || [];
    views.push(view);
    this.views.set(dashboardId, views);

    return view;
  }

  /**
   * Get dashboard
   */
  getDashboard(dashboardId: string): SecurityDashboard | undefined {
    return this.dashboards.get(dashboardId);
  }

  /**
   * Get all dashboards
   */
  getAllDashboards(): SecurityDashboard[] {
    return Array.from(this.dashboards.values());
  }

  /**
   * Get public dashboards
   */
  getPublicDashboards(): SecurityDashboard[] {
    return Array.from(this.dashboards.values()).filter((d) => d.isPublic);
  }

  /**
   * Get dashboard views
   */
  getDashboardViews(dashboardId: string, limit?: number): DashboardView[] {
    const views = this.views.get(dashboardId) || [];

    if (limit) {
      return views.slice(-limit);
    }

    return views;
  }

  /**
   * Get templates
   */
  getTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Get template
   */
  getTemplate(
    templateName: string
  ): Omit<SecurityDashboard, 'id' | 'createdAt' | 'updatedAt'> | undefined {
    return this.templates.get(templateName);
  }

  /**
   * Delete dashboard
   */
  deleteDashboard(dashboardId: string): boolean {
    return this.dashboards.delete(dashboardId);
  }

  /**
   * Export dashboard
   */
  exportDashboard(dashboardId: string, format: 'json' | 'html' = 'json'): string | null {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return null;

    if (format === 'json') {
      return JSON.stringify(dashboard, null, 2);
    }

    // HTML format
    let html = `<!DOCTYPE html>
<html>
<head>
  <title>${dashboard.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .dashboard { max-width: 1200px; margin: 0 auto; }
    .widget { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .widget-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="dashboard">
    <h1>${dashboard.name}</h1>
    <p>${dashboard.description}</p>`;

    for (const widget of dashboard.widgets) {
      html += `
    <div class="widget">
      <div class="widget-title">${widget.title}</div>
      <div class="widget-content">${JSON.stringify(widget.data)}</div>
    </div>`;
    }

    html += `
  </div>
</body>
</html>`;

    return html;
  }

  /**
   * Get dashboard statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalDashboards = this.dashboards.size;
    const publicDashboards = Array.from(this.dashboards.values()).filter((d) => d.isPublic).length;
    const totalViews = Array.from(this.views.values()).reduce(
      (sum, views) => sum + views.length,
      0
    );
    const totalWidgets = Array.from(this.dashboards.values()).reduce(
      (sum, d) => sum + d.widgets.length,
      0
    );

    const widgetTypes: Record<string, number> = {};
    for (const dashboard of this.dashboards.values()) {
      for (const widget of dashboard.widgets) {
        widgetTypes[widget.type] = (widgetTypes[widget.type] || 0) + 1;
      }
    }

    return {
      totalDashboards,
      publicDashboards,
      totalViews,
      totalWidgets,
      widgetTypes,
      templates: this.templates.size,
    };
  }
}
