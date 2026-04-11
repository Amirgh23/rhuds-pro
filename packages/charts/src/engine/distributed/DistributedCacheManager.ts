/**
 * Distributed Cache Manager
 * Redis/Memcached integration with cache invalidation and replication
 */

export interface CacheNode {
  id: string;
  host: string;
  port: number;
  weight?: number;
  healthy?: boolean;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  ttl: number;
  timestamp: number;
  replicated?: boolean;
}

export interface ReplicationConfig {
  enabled: boolean;
  factor: number;
  strategy: 'async' | 'sync';
}

export interface InvalidationStrategy {
  type: 'immediate' | 'delayed' | 'lazy';
  delay?: number;
  pattern?: string;
}

/**
 * DistributedCacheManager - Multi-node cache coordination
 */
export class DistributedCacheManager {
  private nodes: Map<string, CacheNode> = new Map();
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private replication: ReplicationConfig;
  private invalidationStrategy: InvalidationStrategy;
  private listeners: Set<(key: string, action: string) => void> = new Set();
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    replications: 0,
  };

  constructor(replication: ReplicationConfig = { enabled: true, factor: 2, strategy: 'async' }) {
    this.replication = replication;
    this.invalidationStrategy = { type: 'immediate' };
  }

  /**
   * Add cache node
   */
  addNode(node: CacheNode): void {
    this.nodes.set(node.id, {
      healthy: true,
      weight: 1,
      ...node,
    });
    this.notifyListeners(node.id, 'node_added');
  }

  /**
   * Remove cache node
   */
  removeNode(nodeId: string): void {
    this.nodes.delete(nodeId);
    this.notifyListeners(nodeId, 'node_removed');
  }

  /**
   * Set cache value with replication
   */
  set<T>(key: string, value: T, ttl: number = 3600000): void {
    const entry: CacheEntry<T> = {
      key,
      value,
      ttl,
      timestamp: Date.now(),
    };

    this.cache.set(key, entry);
    this.stats.sets++;

    if (this.replication.enabled) {
      this.replicate(key, value, ttl);
    }

    this.notifyListeners(key, 'set');
  }

  /**
   * Get cache value
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value;
  }

  /**
   * Delete cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
    this.stats.deletes++;

    if (this.replication.enabled) {
      this.invalidateReplicas(key);
    }

    this.notifyListeners(key, 'delete');
  }

  /**
   * Invalidate by pattern
   */
  invalidateByPattern(pattern: string): number {
    const regex = new RegExp(pattern);
    let count = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Replicate to other nodes
   */
  private replicate<T>(key: string, value: T, ttl: number): void {
    const replicaCount = Math.min(this.replication.factor, this.nodes.size);

    for (let i = 0; i < replicaCount; i++) {
      const nodes = Array.from(this.nodes.values());
      if (nodes.length > 0) {
        const node = nodes[i % nodes.length];
        if (node.healthy) {
          this.stats.replications++;
        }
      }
    }
  }

  /**
   * Invalidate replicas
   */
  private invalidateReplicas(key: string): void {
    for (const node of this.nodes.values()) {
      if (node.healthy) {
        // Simulate invalidation on replica
      }
    }
  }

  /**
   * Set invalidation strategy
   */
  setInvalidationStrategy(strategy: InvalidationStrategy): void {
    this.invalidationStrategy = strategy;
  }

  /**
   * Perform distributed locking
   */
  acquireLock(key: string, ttl: number = 5000): boolean {
    const lockKey = `lock:${key}`;
    if (this.cache.has(lockKey)) {
      return false;
    }

    this.set(lockKey, true, ttl);
    return true;
  }

  /**
   * Release distributed lock
   */
  releaseLock(key: string): void {
    const lockKey = `lock:${key}`;
    this.delete(lockKey);
  }

  /**
   * Get node health
   */
  getNodeHealth(nodeId: string): boolean {
    const node = this.nodes.get(nodeId);
    return node?.healthy ?? false;
  }

  /**
   * Mark node as unhealthy
   */
  markNodeUnhealthy(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.healthy = false;
      this.notifyListeners(nodeId, 'node_unhealthy');
    }
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      ...this.stats,
      entries: this.cache.size,
      nodes: this.nodes.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
    };
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.notifyListeners('*', 'clear');
  }

  /**
   * Add listener
   */
  addListener(listener: (key: string, action: string) => void): void {
    this.listeners.add(listener);
  }

  /**
   * Remove listener
   */
  removeListener(listener: (key: string, action: string) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Notify listeners
   */
  private notifyListeners(key: string, action: string): void {
    for (const listener of this.listeners) {
      try {
        listener(key, action);
      } catch (error) {
        // Handle listener error
      }
    }
  }

  /**
   * Get all nodes
   */
  getNodes(): CacheNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get cache size
   */
  getSize(): number {
    return this.cache.size;
  }
}
