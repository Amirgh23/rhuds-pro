/**
 * Load Balancing Manager
 * Distributes load across servers with health checks and failover
 */

export interface ServerConfig {
  id: string;
  host: string;
  port: number;
  weight?: number;
  maxConnections?: number;
}

export interface ServerHealth {
  id: string;
  healthy: boolean;
  responseTime: number;
  lastCheck: number;
  failureCount: number;
  successCount: number;
}

export interface LoadBalancingStrategy {
  name: 'round-robin' | 'weighted' | 'least-connections' | 'ip-hash';
  config?: Record<string, unknown>;
}

export interface BalancerStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  activeConnections: number;
}

/**
 * LoadBalancingManager - Intelligent load distribution
 */
export class LoadBalancingManager {
  private servers: Map<string, ServerConfig> = new Map();
  private health: Map<string, ServerHealth> = new Map();
  private strategy: LoadBalancingStrategy;
  private currentIndex: number = 0;
  private stats: BalancerStats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    activeConnections: 0,
  };
  private connectionCounts: Map<string, number> = new Map();
  private responseTimes: number[] = [];

  constructor(strategy: LoadBalancingStrategy = { name: 'round-robin' }) {
    this.strategy = strategy;
  }

  /**
   * Add server to pool
   */
  addServer(config: ServerConfig): void {
    this.servers.set(config.id, {
      weight: 1,
      maxConnections: 100,
      ...config,
    });

    this.health.set(config.id, {
      id: config.id,
      healthy: true,
      responseTime: 0,
      lastCheck: Date.now(),
      failureCount: 0,
      successCount: 0,
    });

    this.connectionCounts.set(config.id, 0);
  }

  /**
   * Remove server from pool
   */
  removeServer(serverId: string): void {
    this.servers.delete(serverId);
    this.health.delete(serverId);
    this.connectionCounts.delete(serverId);
  }

  /**
   * Get next server based on strategy
   */
  getNextServer(): ServerConfig | null {
    const healthyServers = Array.from(this.servers.values()).filter(
      (server) => this.health.get(server.id)?.healthy
    );

    if (healthyServers.length === 0) {
      return null;
    }

    switch (this.strategy.name) {
      case 'round-robin':
        return this.roundRobin(healthyServers);
      case 'weighted':
        return this.weightedSelection(healthyServers);
      case 'least-connections':
        return this.leastConnections(healthyServers);
      case 'ip-hash':
        return this.ipHash(healthyServers);
      default:
        return healthyServers[0];
    }
  }

  /**
   * Round-robin selection
   */
  private roundRobin(servers: ServerConfig[]): ServerConfig {
    const server = servers[this.currentIndex % servers.length];
    this.currentIndex++;
    return server;
  }

  /**
   * Weighted selection
   */
  private weightedSelection(servers: ServerConfig[]): ServerConfig {
    const totalWeight = servers.reduce((sum, s) => sum + (s.weight || 1), 0);
    let random = Math.random() * totalWeight;

    for (const server of servers) {
      random -= server.weight || 1;
      if (random <= 0) {
        return server;
      }
    }

    return servers[0];
  }

  /**
   * Least connections selection
   */
  private leastConnections(servers: ServerConfig[]): ServerConfig {
    let minConnections = Infinity;
    let selectedServer = servers[0];

    for (const server of servers) {
      const connections = this.connectionCounts.get(server.id) || 0;
      if (connections < minConnections) {
        minConnections = connections;
        selectedServer = server;
      }
    }

    return selectedServer;
  }

  /**
   * IP hash selection
   */
  private ipHash(servers: ServerConfig[]): ServerConfig {
    const hash = Math.floor(Math.random() * servers.length);
    return servers[hash];
  }

  /**
   * Record request
   */
  recordRequest(serverId: string, responseTime: number, success: boolean): void {
    this.stats.totalRequests++;
    this.stats.activeConnections = Array.from(this.connectionCounts.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    if (success) {
      this.stats.successfulRequests++;
    } else {
      this.stats.failedRequests++;
    }

    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }

    this.stats.averageResponseTime =
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;

    const health = this.health.get(serverId);
    if (health) {
      health.responseTime = responseTime;
      health.lastCheck = Date.now();

      if (success) {
        health.successCount++;
        health.failureCount = 0;
      } else {
        health.failureCount++;
        if (health.failureCount >= 3) {
          health.healthy = false;
        }
      }
    }
  }

  /**
   * Increment connection count
   */
  incrementConnections(serverId: string): void {
    const current = this.connectionCounts.get(serverId) || 0;
    this.connectionCounts.set(serverId, current + 1);
  }

  /**
   * Decrement connection count
   */
  decrementConnections(serverId: string): void {
    const current = this.connectionCounts.get(serverId) || 0;
    this.connectionCounts.set(serverId, Math.max(0, current - 1));
  }

  /**
   * Health check
   */
  performHealthCheck(serverId: string, healthy: boolean): void {
    const health = this.health.get(serverId);
    if (health) {
      health.healthy = healthy;
      health.lastCheck = Date.now();

      if (healthy) {
        health.failureCount = 0;
      } else {
        health.failureCount++;
      }
    }
  }

  /**
   * Get server health
   */
  getServerHealth(serverId: string): ServerHealth | undefined {
    return this.health.get(serverId);
  }

  /**
   * Get all servers health
   */
  getAllServersHealth(): ServerHealth[] {
    return Array.from(this.health.values());
  }

  /**
   * Get statistics
   */
  getStatistics(): BalancerStats {
    return { ...this.stats };
  }

  /**
   * Get healthy servers count
   */
  getHealthyServersCount(): number {
    return Array.from(this.health.values()).filter((h) => h.healthy).length;
  }

  /**
   * Get total servers count
   */
  getTotalServersCount(): number {
    return this.servers.size;
  }
}
