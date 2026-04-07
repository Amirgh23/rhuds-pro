/**
 * Advanced Analytics Engine
 * Real-time analytics, dashboards, and insights
 */

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  timestamp: Date;
  dimensions?: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface AnalyticsDashboard {
  id: string;
  name: string;
  widgets: AnalyticsWidget[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface AnalyticsWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'gauge';
  title: string;
  config: Record<string, any>;
  data?: any[];
}

export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'forecast';
  title: string;
  description: string;
  confidence: number;
  timestamp: Date;
}

/**
 * Advanced Analytics Engine
 */
export class AdvancedAnalyticsEngine {
  private metrics: Map<string, AnalyticsMetric[]> = new Map();
  private dashboards: Map<string, AnalyticsDashboard> = new Map();
  private insights: Map<string, AnalyticsInsight[]> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Record metric
   */
  public recordMetric(
    name: string,
    value: number,
    dimensions?: Record<string, string>,
    metadata?: Record<string, any>
  ): AnalyticsMetric {
    const id = this.generateId();

    const metric: AnalyticsMetric = {
      id,
      name,
      value,
      timestamp: new Date(),
      dimensions,
      metadata,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push(metric);
    this.emit('metric:recorded', { name, value });

    return metric;
  }

  /**
   * Get metrics
   */
  public getMetrics(name: string, limit: number = 100): AnalyticsMetric[] {
    const metrics = this.metrics.get(name) || [];
    return metrics.slice(-limit);
  }

  /**
   * Analyze metrics
   */
  public analyzeMetrics(name: string): {
    count: number;
    min: number;
    max: number;
    average: number;
    median: number;
    stdDev: number;
  } | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const values = metrics.map((m) => m.value).sort((a, b) => a - b);
    const count = values.length;
    const min = values[0];
    const max = values[count - 1];
    const average = values.reduce((a, b) => a + b, 0) / count;
    const median =
      count % 2 === 0
        ? (values[count / 2 - 1] + values[count / 2]) / 2
        : values[Math.floor(count / 2)];

    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / count;
    const stdDev = Math.sqrt(variance);

    return { count, min, max, average, median, stdDev };
  }

  /**
   * Create dashboard
   */
  public createDashboard(name: string, isPublic: boolean = false): AnalyticsDashboard {
    const id = this.generateId();

    const dashboard: AnalyticsDashboard = {
      id,
      name,
      widgets: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic,
    };

    this.dashboards.set(id, dashboard);
    this.emit('dashboard:created', { dashboardId: id, name });

    return dashboard;
  }

  /**
   * Add widget to dashboard
   */
  public addWidget(dashboardId: string, widget: AnalyticsWidget): AnalyticsDashboard | undefined {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      return undefined;
    }

    dashboard.widgets.push(widget);
    dashboard.updatedAt = new Date();

    this.emit('widget:added', { dashboardId, widgetId: widget.id });

    return dashboard;
  }

  /**
   * Get dashboard
   */
  public getDashboard(dashboardId: string): AnalyticsDashboard | undefined {
    return this.dashboards.get(dashboardId);
  }

  /**
   * List dashboards
   */
  public listDashboards(filter?: { isPublic?: boolean }): AnalyticsDashboard[] {
    let dashboards = Array.from(this.dashboards.values());

    if (filter?.isPublic !== undefined) {
      dashboards = dashboards.filter((d) => d.isPublic === filter.isPublic);
    }

    return dashboards;
  }

  /**
   * Generate insight
   */
  public generateInsight(
    type: 'trend' | 'anomaly' | 'correlation' | 'forecast',
    title: string,
    description: string,
    confidence: number
  ): AnalyticsInsight {
    const id = this.generateId();

    const insight: AnalyticsInsight = {
      id,
      type,
      title,
      description,
      confidence,
      timestamp: new Date(),
    };

    if (!this.insights.has(type)) {
      this.insights.set(type, []);
    }

    this.insights.get(type)!.push(insight);
    this.emit('insight:generated', { insightId: id, type, confidence });

    return insight;
  }

  /**
   * Get insights
   */
  public getInsights(type?: string, limit: number = 50): AnalyticsInsight[] {
    let insights: AnalyticsInsight[] = [];

    if (type) {
      insights = this.insights.get(type) || [];
    } else {
      this.insights.forEach((typeInsights) => {
        insights.push(...typeInsights);
      });
    }

    return insights.slice(-limit).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    totalMetrics: number;
    totalDashboards: number;
    totalInsights: number;
    insightsByType: Record<string, number>;
  } {
    let totalMetrics = 0;
    this.metrics.forEach((metrics) => {
      totalMetrics += metrics.length;
    });

    let totalInsights = 0;
    const insightsByType: Record<string, number> = {};
    this.insights.forEach((typeInsights, type) => {
      totalInsights += typeInsights.length;
      insightsByType[type] = typeInsights.length;
    });

    return {
      totalMetrics,
      totalDashboards: this.dashboards.size,
      totalInsights,
      insightsByType,
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Destroy manager
   */
  public destroy(): void {
    this.metrics.clear();
    this.dashboards.clear();
    this.insights.clear();
    this.listeners.clear();
  }
}

export default AdvancedAnalyticsEngine;
