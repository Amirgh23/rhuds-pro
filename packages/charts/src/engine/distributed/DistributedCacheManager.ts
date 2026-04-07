/**
 * Distributed Cache Manager
 * مدیریت کش توزیع شده برای سیستم‌های چند گره
 *
 * Features:
 * - Redis/Memcached integration
 * - Cache invalidation strategies
 * - Distributed locking
 * - Replication management
 */

import { EventEmitter } from 'events';

export interface CacheConfig {
  backend: 'redis' | 'memcached';
  nodes: string[];
  ttl: number;
  maxSize: number;
  replicationFactor: number;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  ttl: number;
  timestamp: number;
  version: number;
  replicas: string[];
}

export interface InvalidationStrategy {
  type: 'ttl' | 'lru' | 'lfu' | 'fifo';
  threshold: number;
  checkInterval: number;
}

export interface DistributedLock {
  key: string;
  owner: string;
  acquiredAt: number;
  expiresAt: number;
  token: string;
}

export interface ReplicationConfig {
  factor: number;
  strategy: 'sync' | 'async';
  timeout: number;
}

export class DistributedCacheManager extends EventEmitter {
  private config: CacheConfig;
  private cache: Map<string, CacheEntry<any>>;
  private locks: Map<string, DistributedLock>;
  private invalidationStrategy: InvalidationStrategy;
  private replicationConfig: ReplicationConfig;
  private nodeConnections: Map<string, any>;
  private stats: {
    hits: number;
    misses: number;
    evictions: number;
    replications: number;
  };

  constructor(config: CacheConfig) {
    super();
    this.config = config;
    this.cache = new Map();
    this.locks = new Map();
    this.nodeConnections = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      replications: 0,
    };

    this.invalidationStrategy = {
      type: 'lru',
      threshold: config.maxSize * 0.8,
      checkInterval: 60000,
    };

    this.replicationConfig = {
      factor: config.replicationFactor,
      strategy: 'async',
      timeout: 5000,
    };

    this.initialize();
  }

  private initialize(): void {
    this.setupNodeConnections();
    this.startInvalidationCheck();
    this.emit('initialized', { timestamp: Date.now() });
  }

  private setupNodeConnections(): void {
    for (const node of this.config.nodes) {
      this.nodeConnections.set(node, {
        connected: true,
        lastHeartbeat: Date.now(),
        failureCount: 0,
      });
    }
  }

  private startInvalidationCheck(): void {
    setInterval(() => {
      this.performInvalidation();
    }, this.invalidationStrategy.checkInterval);
  }

  /**
   * Set cache value with replication
   */
  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      key,
      value,
      ttl: ttl || this.config.ttl,
      timestamp: Date.now(),
      version: 1,
      replicas: this.selectReplicaNodes(),
    };

    this.cache.set(key, entry);

    // Replicate to other nodes
    await this.replicateToNodes(entry);

    this.emit('set', { key, ttl: entry.ttl });
  }

  /**
   * Get cache value
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      this.emit('miss', { key });
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.emit('expired', { key });
      return null;
    }

    this.stats.hits++;
    this.emit('hit', { key });
    return entry.value as T;
  }

  /**
   * Delete cache entry
   */
  public async delete(key: string): Promise<void> {
    const entry = this.cache.get(key);
    this.cache.delete(key);

    if (entry) {
      await this.invalidateReplicas(key, entry.replicas);
    }

    this.emit('delete', { key });
  }

  /**
   * Acquire distributed lock
   */
  public async acquireLock(
    key: string,
    owner: string,
    ttl: number = 30000
  ): Promise<DistributedLock | null> {
    const existingLock = this.locks.get(key);

    if (existingLock && Date.now() < existingLock.expiresAt) {
      this.emit('lock-failed', { key, owner });
      return null;
    }

    const token = this.generateToken();
    const lock: DistributedLock = {
      key,
      owner,
      acquiredAt: Date.now(),
      expiresAt: Date.now() + ttl,
      token,
    };

    this.locks.set(key, lock);
    await this.replicateLock(lock);

    this.emit('lock-acquired', { key, owner, token });
    return lock;
  }

  /**
   * Release distributed lock
   */
  public async releaseLock(key: string, token: string): Promise<boolean> {
    const lock = this.locks.get(key);

    if (!lock || lock.token !== token) {
      this.emit('lock-release-failed', { key });
      return false;
    }

    this.locks.delete(key);
    await this.invalidateLockReplicas(key);

    this.emit('lock-released', { key });
    return true;
  }

  /**
   * Perform cache invalidation based on strategy
   */
  private performInvalidation(): void {
    if (this.cache.size <= this.invalidationStrategy.threshold) {
      return;
    }

    const entriesToEvict = this.selectEntriesToEvict();

    for (const entry of entriesToEvict) {
      this.cache.delete(entry.key);
      this.stats.evictions++;
      this.emit('evicted', { key: entry.key });
    }
  }

  /**
   * Select entries to evict based on strategy
   */
  private selectEntriesToEvict(): CacheEntry<any>[] {
    const entries = Array.from(this.cache.values());
    const toEvict = Math.ceil(entries.length * 0.2);

    switch (this.invalidationStrategy.type) {
      case 'lru':
        return entries.sort((a, b) => a.timestamp - b.timestamp).slice(0, toEvict);

      case 'lfu':
        return entries
          .sort((a, b) => (a as any).accessCount - (b as any).accessCount)
          .slice(0, toEvict);

      case 'fifo':
        return entries.slice(0, toEvict);

      default:
        return entries.slice(0, toEvict);
    }
  }

  /**
   * Select replica nodes for replication
   */
  private selectReplicaNodes(): string[] {
    const nodes = Array.from(this.nodeConnections.keys());
    const replicas: string[] = [];

    for (let i = 0; i < this.replicationConfig.factor && i < nodes.length; i++) {
      replicas.push(nodes[i]);
    }

    return replicas;
  }

  /**
   * Replicate entry to nodes
   */
  private async replicateToNodes(entry: CacheEntry<any>): Promise<void> {
    if (this.replicationConfig.strategy === 'sync') {
      await Promise.all(entry.replicas.map((node) => this.sendToNode(node, entry)));
    } else {
      entry.replicas.forEach((node) => {
        this.sendToNode(node, entry).catch((err) => {
          this.emit('replication-error', { node, error: err.message });
        });
      });
    }

    this.stats.replications++;
  }

  /**
   * Send data to node
   */
  private async sendToNode(node: string, entry: CacheEntry<any>): Promise<void> {
    const connection = this.nodeConnections.get(node);

    if (!connection || !connection.connected) {
      throw new Error(`Node ${node} not connected`);
    }

    // Simulate network send
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, Math.random() * 100);
    });
  }

  /**
   * Invalidate replicas
   */
  private async invalidateReplicas(key: string, replicas: string[]): Promise<void> {
    await Promise.all(
      replicas.map((node) => this.sendToNode(node, { key } as any).catch(() => {}))
    );
  }

  /**
   * Replicate lock to nodes
   */
  private async replicateLock(lock: DistributedLock): Promise<void> {
    const replicas = this.selectReplicaNodes();
    await Promise.all(
      replicas.map((node) => this.sendToNode(node, { key: lock.key, lock } as any).catch(() => {}))
    );
  }

  /**
   * Invalidate lock replicas
   */
  private async invalidateLockReplicas(key: string): Promise<void> {
    const replicas = this.selectReplicaNodes();
    await Promise.all(
      replicas.map((node) => this.sendToNode(node, { key } as any).catch(() => {}))
    );
  }

  /**
   * Generate unique token
   */
  private generateToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get cache statistics
   */
  public getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      locks: this.locks.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
    };
  }

  /**
   * Clear all cache
   */
  public async clear(): Promise<void> {
    this.cache.clear();
    this.locks.clear();
    this.emit('cleared', { timestamp: Date.now() });
  }
}
