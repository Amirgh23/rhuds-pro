/**
 * Data Synchronization Engine
 * موتور همگام‌سازی داده برای سنکرونایزیشن بلادرنگ
 *
 * Features:
 * - Real-time sync
 * - Conflict resolution
 * - Offline support
 * - Sync queuing
 */

export interface SyncItem {
  id: string;
  type: string;
  operation: 'create' | 'update' | 'delete';
  data: Record<string, any>;
  timestamp: number;
  synced: boolean;
  version: number;
}

export interface SyncConflict {
  id: string;
  itemId: string;
  localVersion: number;
  remoteVersion: number;
  localData: Record<string, any>;
  remoteData: Record<string, any>;
  resolution: 'local' | 'remote' | 'merged';
}

export interface SyncQueue {
  id: string;
  items: SyncItem[];
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
}

export class DataSyncEngine {
  private syncQueue: SyncItem[];
  private conflicts: Map<string, SyncConflict>;
  private syncHistory: Map<string, SyncQueue>;
  private offlineData: Map<string, SyncItem>;
  private stats: {
    itemsSynced: number;
    conflictsResolved: number;
    offlineOperations: number;
    syncErrors: number;
  };

  constructor() {
    this.syncQueue = [];
    this.conflicts = new Map();
    this.syncHistory = new Map();
    this.offlineData = new Map();
    this.stats = {
      itemsSynced: 0,
      conflictsResolved: 0,
      offlineOperations: 0,
      syncErrors: 0,
    };
  }

  /**
   * Queue sync item
   */
  public queueSync(
    type: string,
    operation: 'create' | 'update' | 'delete',
    data: Record<string, any>
  ): string {
    const itemId = `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const item: SyncItem = {
      id: itemId,
      type,
      operation,
      data,
      timestamp: Date.now(),
      synced: false,
      version: 1,
    };

    this.syncQueue.push(item);
    this.offlineData.set(itemId, item);

    this.stats.offlineOperations++;

    return itemId;
  }

  /**
   * Sync with server
   */
  public async syncWithServer(serverUrl: string): Promise<boolean> {
    if (this.syncQueue.length === 0) {
      return true;
    }

    const queueId = `queue-${Date.now()}`;
    const queue: SyncQueue = {
      id: queueId,
      items: [...this.syncQueue],
      status: 'syncing',
      createdAt: Date.now(),
    };

    this.syncHistory.set(queueId, queue);

    try {
      const response = await fetch(`${serverUrl}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.syncQueue),
      });

      if (!response.ok) {
        queue.status = 'failed';
        this.stats.syncErrors++;
        return false;
      }

      const result = await response.json();

      // Handle conflicts
      if (result.conflicts && result.conflicts.length > 0) {
        this.handleConflicts(result.conflicts);
      }

      // Mark items as synced
      for (const item of this.syncQueue) {
        item.synced = true;
        this.stats.itemsSynced++;
      }

      this.syncQueue = [];
      queue.status = 'completed';
      queue.completedAt = Date.now();

      return true;
    } catch (error) {
      queue.status = 'failed';
      this.stats.syncErrors++;
      return false;
    }
  }

  /**
   * Handle conflicts
   */
  private handleConflicts(conflicts: any[]): void {
    for (const conflict of conflicts) {
      const conflictId = `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const syncConflict: SyncConflict = {
        id: conflictId,
        itemId: conflict.itemId,
        localVersion: conflict.localVersion,
        remoteVersion: conflict.remoteVersion,
        localData: conflict.localData,
        remoteData: conflict.remoteData,
        resolution: 'local', // Default to local
      };

      this.conflicts.set(conflictId, syncConflict);
    }
  }

  /**
   * Resolve conflict
   */
  public resolveConflict(
    conflictId: string,
    resolution: 'local' | 'remote' | 'merged',
    mergedData?: Record<string, any>
  ): boolean {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) return false;

    conflict.resolution = resolution;

    if (resolution === 'merged' && mergedData) {
      // Update with merged data
      const item = this.offlineData.get(conflict.itemId);
      if (item) {
        item.data = mergedData;
      }
    }

    this.stats.conflictsResolved++;
    return true;
  }

  /**
   * Get pending syncs
   */
  public getPendingSyncs(): SyncItem[] {
    return this.syncQueue.filter((item) => !item.synced);
  }

  /**
   * Get conflicts
   */
  public getConflicts(): SyncConflict[] {
    return Array.from(this.conflicts.values());
  }

  /**
   * Get sync history
   */
  public getSyncHistory(limit: number = 10): SyncQueue[] {
    return Array.from(this.syncHistory.values()).slice(-limit);
  }

  /**
   * Clear offline data
   */
  public clearOfflineData(): void {
    this.offlineData.clear();
    this.syncQueue = [];
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      pendingItems: this.syncQueue.length,
      conflictCount: this.conflicts.size,
      offlineDataSize: this.offlineData.size,
    };
  }
}
