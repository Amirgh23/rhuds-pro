/**
 * Live Dashboard Updates
 * Real-time dashboard updates with automatic refresh
 *
 * به روزرسانی های بلادرنگ داشبورد
 * به روزرسانی های بلادرنگ داشبورد با تازه سازی خودکار
 */

import { EventEmitter } from 'events';

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  data: any;
  lastUpdated: number;
  refreshInterval?: number;
  autoRefresh?: boolean;
}

export interface DashboardUpdate {
  widgetId: string;
  data: any;
  timestamp: number;
  changeDetected: boolean;
}

export interface DashboardState {
  widgets: Map<string, DashboardWidget>;
  updateQueue: DashboardUpdate[];
  batchSize: number;
  batchInterval: number;
}

export class LiveDashboardUpdates extends EventEmitter {
  private widgets: Map<string, DashboardWidget> = new Map();
  private updateQueue: DashboardUpdate[] = [];
  private refreshTimers: Map<string, NodeJS.Timeout> = new Map();
  private batchTimer: NodeJS.Timeout | null = null;
  private batchSize: number = 10;
  private batchInterval: number = 100;
  private changeDetectionEnabled: boolean = true;

  constructor() {
    super();
  }

  /**
   * Register widget
   */
  registerWidget(widget: DashboardWidget): void {
    this.widgets.set(widget.id, {
      ...widget,
      lastUpdated: Date.now(),
    });

    if (widget.autoRefresh && widget.refreshInterval) {
      this.setupAutoRefresh(widget.id, widget.refreshInterval);
    }

    this.emit('widget:registered', widget);
  }

  /**
   * Update widget data
   */
  updateWidget(widgetId: string, data: any): void {
    const widget = this.widgets.get(widgetId);
    if (!widget) throw new Error(`Widget ${widgetId} not found`);

    const changeDetected = this.changeDetectionEnabled && this.detectChange(widget.data, data);

    const update: DashboardUpdate = {
      widgetId,
      data,
      timestamp: Date.now(),
      changeDetected,
    };

    widget.data = data;
    widget.lastUpdated = Date.now();

    this.updateQueue.push(update);
    this.emit('widget:updated', update);

    // Batch updates
    if (this.updateQueue.length >= this.batchSize) {
      this.flushUpdates();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.flushUpdates(), this.batchInterval);
    }
  }

  /**
   * Batch update multiple widgets
   */
  batchUpdate(updates: Array<{ widgetId: string; data: any }>): void {
    for (const update of updates) {
      this.updateWidget(update.widgetId, update.data);
    }
  }

  /**
   * Get widget data
   */
  getWidget(widgetId: string): DashboardWidget | null {
    return this.widgets.get(widgetId) || null;
  }

  /**
   * Get all widgets
   */
  getAllWidgets(): DashboardWidget[] {
    return Array.from(this.widgets.values());
  }

  /**
   * Remove widget
   */
  removeWidget(widgetId: string): void {
    this.widgets.delete(widgetId);
    this.stopAutoRefresh(widgetId);
    this.emit('widget:removed', { widgetId });
  }

  /**
   * Setup auto refresh
   */
  setupAutoRefresh(widgetId: string, interval: number): void {
    this.stopAutoRefresh(widgetId);

    const timer = setInterval(() => {
      this.emit('widget:refresh-requested', { widgetId });
    }, interval);

    this.refreshTimers.set(widgetId, timer);
  }

  /**
   * Stop auto refresh
   */
  stopAutoRefresh(widgetId: string): void {
    const timer = this.refreshTimers.get(widgetId);
    if (timer) {
      clearInterval(timer);
      this.refreshTimers.delete(widgetId);
    }
  }

  /**
   * Enable change detection
   */
  enableChangeDetection(enabled: boolean): void {
    this.changeDetectionEnabled = enabled;
  }

  /**
   * Detect data change
   */
  private detectChange(oldData: any, newData: any): boolean {
    if (typeof oldData !== typeof newData) return true;

    if (typeof oldData === 'object' && oldData !== null && newData !== null) {
      const oldKeys = Object.keys(oldData);
      const newKeys = Object.keys(newData);

      if (oldKeys.length !== newKeys.length) return true;

      for (const key of oldKeys) {
        if (oldData[key] !== newData[key]) return true;
      }

      return false;
    }

    return oldData !== newData;
  }

  /**
   * Flush update queue
   */
  private flushUpdates(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.updateQueue.length === 0) return;

    const updates = [...this.updateQueue];
    this.updateQueue = [];

    this.emit('updates:flushed', {
      count: updates.length,
      timestamp: Date.now(),
      updates,
    });
  }

  /**
   * Set batch configuration
   */
  setBatchConfig(size: number, interval: number): void {
    this.batchSize = size;
    this.batchInterval = interval;
  }

  /**
   * Get dashboard state
   */
  getState(): {
    widgetCount: number;
    queuedUpdates: number;
    activeRefreshes: number;
  } {
    return {
      widgetCount: this.widgets.size,
      queuedUpdates: this.updateQueue.length,
      activeRefreshes: this.refreshTimers.size,
    };
  }

  /**
   * Clear all widgets
   */
  clearAll(): void {
    this.widgets.clear();
    this.updateQueue = [];
    this.refreshTimers.forEach((timer) => clearInterval(timer));
    this.refreshTimers.clear();

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    this.emit('dashboard:cleared', {});
  }

  /**
   * Get update history
   */
  getUpdateHistory(widgetId: string, limit: number = 10): DashboardUpdate[] {
    // This would typically be stored separately
    // For now, return empty array
    return [];
  }

  /**
   * Optimize rendering
   */
  optimizeRendering(widgetId: string): void {
    const widget = this.widgets.get(widgetId);
    if (!widget) return;

    // Reduce refresh interval for better performance
    if (widget.refreshInterval && widget.refreshInterval > 100) {
      widget.refreshInterval = Math.max(100, widget.refreshInterval / 2);
      this.setupAutoRefresh(widgetId, widget.refreshInterval);
    }

    this.emit('widget:optimized', { widgetId });
  }
}
