/**
 * Live Dashboard Updates
 * Real-time dashboard updates with automatic refresh and change detection
 */

export interface DashboardData {
  id: string;
  timestamp: Date;
  values: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface DashboardUpdate {
  id: string;
  timestamp: Date;
  changes: Record<string, { old: unknown; new: unknown }>;
  type: 'update' | 'create' | 'delete';
}

export interface UpdateBatch {
  updates: DashboardUpdate[];
  timestamp: Date;
  batchSize: number;
}

/**
 * LiveDashboardUpdates - Real-time dashboard updates
 */
export class LiveDashboardUpdates {
  private dashboards: Map<string, DashboardData> = new Map();
  private updateListeners: Map<string, Set<(update: DashboardUpdate) => void>> = new Map();
  private batchListeners: Set<(batch: UpdateBatch) => void> = new Set();
  private changeDetectors: Map<string, (old: unknown, new_: unknown) => boolean> = new Map();
  private updateQueue: DashboardUpdate[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private batchInterval: number = 100; // ms

  /**
   * Register dashboard
   */
  registerDashboard(id: string, data: DashboardData): void {
    this.dashboards.set(id, data);
  }

  /**
   * Update dashboard data
   */
  updateDashboard(id: string, values: Record<string, unknown>): void {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) {
      throw new Error(`Dashboard ${id} not found`);
    }

    const changes: Record<string, { old: unknown; new: unknown }> = {};
    let hasChanges = false;

    for (const [key, newValue] of Object.entries(values)) {
      const oldValue = dashboard.values[key];

      if (this.hasChanged(key, oldValue, newValue)) {
        changes[key] = { old: oldValue, new: newValue };
        dashboard.values[key] = newValue;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      const update: DashboardUpdate = {
        id: `${id}-${Date.now()}`,
        timestamp: new Date(),
        changes,
        type: 'update',
      };

      this.queueUpdate(id, update);
    }

    dashboard.timestamp = new Date();
  }

  /**
   * Subscribe to dashboard updates
   */
  subscribe(id: string, callback: (update: DashboardUpdate) => void): () => void {
    if (!this.updateListeners.has(id)) {
      this.updateListeners.set(id, new Set());
    }

    this.updateListeners.get(id)!.add(callback);

    return () => {
      this.updateListeners.get(id)?.delete(callback);
    };
  }

  /**
   * Subscribe to batch updates
   */
  onBatch(callback: (batch: UpdateBatch) => void): () => void {
    this.batchListeners.add(callback);

    return () => {
      this.batchListeners.delete(callback);
    };
  }

  /**
   * Register change detector
   */
  registerChangeDetector(key: string, detector: (old: unknown, new_: unknown) => boolean): void {
    this.changeDetectors.set(key, detector);
  }

  /**
   * Check if value has changed
   */
  private hasChanged(key: string, oldValue: unknown, newValue: unknown): boolean {
    const detector = this.changeDetectors.get(key);

    if (detector) {
      return detector(oldValue, newValue);
    }

    // Default comparison
    if (typeof oldValue === 'object' && typeof newValue === 'object') {
      return JSON.stringify(oldValue) !== JSON.stringify(newValue);
    }

    return oldValue !== newValue;
  }

  /**
   * Queue update
   */
  private queueUpdate(dashboardId: string, update: DashboardUpdate): void {
    this.updateQueue.push(update);

    // Notify immediate listeners
    const listeners = this.updateListeners.get(dashboardId);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(update);
        } catch (error) {
          console.error('Update listener error:', error);
        }
      });
    }

    // Schedule batch processing
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.processBatch(), this.batchInterval);
    }
  }

  /**
   * Process batch
   */
  private processBatch(): void {
    if (this.updateQueue.length === 0) {
      this.batchTimer = null;
      return;
    }

    const batch: UpdateBatch = {
      updates: [...this.updateQueue],
      timestamp: new Date(),
      batchSize: this.updateQueue.length,
    };

    this.updateQueue = [];

    // Notify batch listeners
    this.batchListeners.forEach((listener) => {
      try {
        listener(batch);
      } catch (error) {
        console.error('Batch listener error:', error);
      }
    });

    this.batchTimer = null;
  }

  /**
   * Get dashboard data
   */
  getDashboard(id: string): DashboardData | undefined {
    return this.dashboards.get(id);
  }

  /**
   * Get all dashboards
   */
  getAllDashboards(): DashboardData[] {
    return Array.from(this.dashboards.values());
  }

  /**
   * Set batch interval
   */
  setBatchInterval(interval: number): void {
    this.batchInterval = interval;
  }

  /**
   * Force batch processing
   */
  flushBatch(): UpdateBatch | null {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.updateQueue.length === 0) {
      return null;
    }

    const batch: UpdateBatch = {
      updates: [...this.updateQueue],
      timestamp: new Date(),
      batchSize: this.updateQueue.length,
    };

    this.updateQueue = [];

    // Notify batch listeners
    this.batchListeners.forEach((listener) => {
      try {
        listener(batch);
      } catch (error) {
        console.error('Batch listener error:', error);
      }
    });

    return batch;
  }

  /**
   * Get pending updates count
   */
  getPendingUpdatesCount(): number {
    return this.updateQueue.length;
  }

  /**
   * Clear dashboard
   */
  clearDashboard(id: string): void {
    this.dashboards.delete(id);
    this.updateListeners.delete(id);
  }

  /**
   * Clear all dashboards
   */
  clearAll(): void {
    this.dashboards.clear();
    this.updateListeners.clear();
    this.updateQueue = [];

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }

  /**
   * Get update statistics
   */
  getStatistics(): {
    dashboardCount: number;
    pendingUpdates: number;
    listenerCount: number;
  } {
    let listenerCount = 0;
    this.updateListeners.forEach((listeners) => {
      listenerCount += listeners.size;
    });

    return {
      dashboardCount: this.dashboards.size,
      pendingUpdates: this.updateQueue.length,
      listenerCount,
    };
  }
}

export default LiveDashboardUpdates;
