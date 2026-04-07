/**
 * Load Balancing Manager
 * Distribute load across servers
 *
 * مدیر توازن بار
 * توزیع بار در سرورها
 */

import { EventEmitter } from 'events';

export interface Server {
  id: string;
  host: string;
  port: number;
  weight: number;
  healthy: boolean;
  activeConnections: number;
  totalRequests: number;
  responseTime: number;
  lastHealthCheck: number;
}

export interface LoadBalancingConfig {
  algorithm: 'round-robin' | 'weighted' | 'least-connections' | 'response-time';
  healthCheckInterval: number;
  healthCheckTimeout: number;
  sessionPersistence: boolean;
  maxRetries: number;
}

export class LoadBalancingManager extends EventEmitter {
  private servers: Map<string, Server> = new Map();
  private config: LoadBalancingConfig;
  private currentIndex: number = 0;
  private sessions: Map<string, string> = new Map(); // sessionId -> serverId

  constructor(config?: Partial<LoadBalancingConfig>) {
    super();
    this.config = {
      algorithm: 'round-robin',
      healthCheckInterval: 30000, // 30 seconds
      healthCheckTimeout: 5000, // 5 seconds
      sessionPersistence: true,
      maxRetries: 3,
      ...config,
    };

    this.startHealthChecks();
  }

  /**
   * Add server
   */
  addServer(
    server: Omit<
      Server,
      'healthy' | 'activeConnections' | 'totalRequests' | 'responseTime' | 'lastHealthCheck'
    >
  ): void {
    const fullServer: Server = {
      ...server,
      healthy: true,
      activeConnections: 0,
      totalRequests: 0,
      responseTime: 0,
      lastHealthCheck: Date.now(),
    };

    this.servers.set(server.id, fullServer);
    this.emit('server:added', { id: server.id });
  }

  /**
   * Remove server
   */
  removeServer(serverId: string): void {
    this.servers.delete(serverId);
    this.emit('server:removed', { id: serverId });
  }

  /**
   * Get next server
   */
  getNextServer(sessionId?: string): Server | null {
    const healthyServers = Array.from(this.servers.values()).filter((s) => s.healthy);

    if (healthyServers.length === 0) {
      this.emit('error', { message: 'No healthy servers available' });
      return null;
    }

    // Check session persistence
    if (sessionId && this.config.sessionPersistence) {
      const serverId = this.sessions.get(sessionId);
      if (serverId) {
        const server = this.servers.get(serverId);
        if (server && server.healthy) {
          return server;
        }
      }
    }

    let selectedServer: Server;

    switch (this.config.algorithm) {
      case 'round-robin':
        selectedServer = this.roundRobin(healthyServers);
        break;
      case 'weighted':
        selectedServer = this.weighted(healthyServers);
        break;
      case 'least-connections':
        selectedServer = this.leastConnections(healthyServers);
        break;
      case 'response-time':
        selectedServer = this.responseTime(healthyServers);
        break;
      default:
        selectedServer = healthyServers[0];
    }

    // Store session
    if (sessionId && this.config.sessionPersistence) {
      this.sessions.set(sessionId, selectedServer.id);
    }

    selectedServer.activeConnections++;
    selectedServer.totalRequests++;

    this.emit('server:selected', { id: selectedServer.id, algorithm: this.config.algorithm });

    return selectedServer;
  }

  /**
   * Round-robin algorithm
   */
  private roundRobin(servers: Server[]): Server {
    const server = servers[this.currentIndex % servers.length];
    this.currentIndex++;
    return server;
  }

  /**
   * Weighted algorithm
   */
  private weighted(servers: Server[]): Server {
    const totalWeight = servers.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;

    for (const server of servers) {
      random -= server.weight;
      if (random <= 0) {
        return server;
      }
    }

    return servers[0];
  }

  /**
   * Least connections algorithm
   */
  private leastConnections(servers: Server[]): Server {
    return servers.reduce((min, server) =>
      server.activeConnections < min.activeConnections ? server : min
    );
  }

  /**
   * Response time algorithm
   */
  private responseTime(servers: Server[]): Server {
    return servers.reduce((best, server) =>
      server.responseTime < best.responseTime ? server : best
    );
  }

  /**
   * Release connection
   */
  releaseConnection(serverId: string, responseTime: number): void {
    const server = this.servers.get(serverId);
    if (server) {
      server.activeConnections = Math.max(0, server.activeConnections - 1);
      server.responseTime = (server.responseTime + responseTime) / 2;
      this.emit('connection:released', { id: serverId, responseTime });
    }
  }

  /**
   * Start health checks
   */
  private startHealthChecks(): void {
    setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheckInterval);
  }

  /**
   * Perform health checks
   */
  private performHealthChecks(): void {
    for (const server of this.servers.values()) {
      this.checkServerHealth(server);
    }
  }

  /**
   * Check server health
   */
  private checkServerHealth(server: Server): void {
    const startTime = Date.now();

    // Simulate health check (in real implementation, would make HTTP request)
    setTimeout(() => {
      const responseTime = Date.now() - startTime;
      const healthy = responseTime < this.config.healthCheckTimeout;

      if (healthy !== server.healthy) {
        server.healthy = healthy;
        this.emit('server:health-changed', {
          id: server.id,
          healthy,
          responseTime,
        });
      }

      server.lastHealthCheck = Date.now();
    }, Math.random() * this.config.healthCheckTimeout);
  }

  /**
   * Get server stats
   */
  getServerStats(serverId: string): Server | null {
    return this.servers.get(serverId) || null;
  }

  /**
   * Get all servers
   */
  getAllServers(): Server[] {
    return Array.from(this.servers.values());
  }

  /**
   * Get healthy servers
   */
  getHealthyServers(): Server[] {
    return Array.from(this.servers.values()).filter((s) => s.healthy);
  }

  /**
   * Get load distribution
   */
  getLoadDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};

    for (const server of this.servers.values()) {
      distribution[server.id] = server.activeConnections;
    }

    return distribution;
  }

  /**
   * Update server weight
   */
  updateServerWeight(serverId: string, weight: number): void {
    const server = this.servers.get(serverId);
    if (server) {
      server.weight = weight;
      this.emit('server:weight-updated', { id: serverId, weight });
    }
  }

  /**
   * Clear sessions
   */
  clearSessions(): void {
    this.sessions.clear();
    this.emit('sessions:cleared', {});
  }

  /**
   * Get session info
   */
  getSessionInfo(sessionId: string): string | null {
    return this.sessions.get(sessionId) || null;
  }
}
