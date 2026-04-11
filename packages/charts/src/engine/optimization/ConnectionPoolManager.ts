/**
 * Connection Pool Manager
 * Manages connection pooling for efficient resource reuse
 */

export interface PoolConfig {
  minConnections: number;
  maxConnections: number;
  connectionTimeout: number;
  idleTimeout: number;
  validationInterval: number;
}

export interface Connection<T = unknown> {
  id: string;
  resource: T;
  createdAt: number;
  lastUsedAt: number;
  isActive: boolean;
  usageCount: number;
}

export interface PoolStatistics {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
  totalAcquired: number;
  totalReleased: number;
  averageWaitTime: number;
}

/**
 * Connection Pool Manager
 * Manages a pool of reusable connections
 */
export class ConnectionPoolManager<T> {
  private config: PoolConfig;
  private connections: Map<string, Connection<T>> = new Map();
  private availableConnections: string[] = [];
  private waitingRequests: Array<{
    resolve: (connection: Connection<T>) => void;
    reject: (error: Error) => void;
    timestamp: number;
  }> = [];
  private resourceFactory: () => Promise<T>;
  private resourceValidator: (resource: T) => Promise<boolean>;
  private resourceDestroyer: (resource: T) => Promise<void>;
  private statistics = {
    totalAcquired: 0,
    totalReleased: 0,
    waitTimes: [] as number[],
  };

  constructor(
    config: PoolConfig,
    resourceFactory: () => Promise<T>,
    resourceValidator: (resource: T) => Promise<boolean>,
    resourceDestroyer: (resource: T) => Promise<void>
  ) {
    this.config = config;
    this.resourceFactory = resourceFactory;
    this.resourceValidator = resourceValidator;
    this.resourceDestroyer = resourceDestroyer;

    this.initializePool();
  }

  /**
   * Initialize the connection pool
   */
  private async initializePool(): Promise<void> {
    for (let i = 0; i < this.config.minConnections; i++) {
      try {
        const resource = await this.resourceFactory();
        const connection: Connection<T> = {
          id: `conn-${Date.now()}-${i}`,
          resource,
          createdAt: Date.now(),
          lastUsedAt: Date.now(),
          isActive: false,
          usageCount: 0,
        };
        this.connections.set(connection.id, connection);
        this.availableConnections.push(connection.id);
      } catch (error) {
        console.error('Failed to initialize connection:', error);
      }
    }

    // Start validation interval
    this.startValidationInterval();
  }

  /**
   * Acquire a connection from the pool
   */
  public async acquire(): Promise<Connection<T>> {
    const startTime = Date.now();

    // Try to get an available connection
    while (this.availableConnections.length > 0) {
      const connId = this.availableConnections.shift();
      if (!connId) continue;

      const connection = this.connections.get(connId);
      if (!connection) continue;

      // Validate connection
      try {
        const isValid = await this.resourceValidator(connection.resource);
        if (isValid) {
          connection.isActive = true;
          connection.lastUsedAt = Date.now();
          connection.usageCount++;
          this.statistics.totalAcquired++;

          const waitTime = Date.now() - startTime;
          this.statistics.waitTimes.push(waitTime);
          if (this.statistics.waitTimes.length > 1000) {
            this.statistics.waitTimes.shift();
          }

          return connection;
        }
      } catch (error) {
        // Connection is invalid, remove it
        await this.removeConnection(connId);
      }
    }

    // Create new connection if under limit
    if (this.connections.size < this.config.maxConnections) {
      try {
        const resource = await this.resourceFactory();
        const connection: Connection<T> = {
          id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          resource,
          createdAt: Date.now(),
          lastUsedAt: Date.now(),
          isActive: true,
          usageCount: 1,
        };
        this.connections.set(connection.id, connection);
        this.statistics.totalAcquired++;

        const waitTime = Date.now() - startTime;
        this.statistics.waitTimes.push(waitTime);
        if (this.statistics.waitTimes.length > 1000) {
          this.statistics.waitTimes.shift();
        }

        return connection;
      } catch (error) {
        throw new Error(`Failed to create connection: ${error}`);
      }
    }

    // Wait for available connection
    return new Promise<Connection<T>>((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = this.waitingRequests.findIndex((r) => r.resolve === resolve);
        if (index >= 0) {
          this.waitingRequests.splice(index, 1);
        }
        reject(new Error('Connection acquisition timeout'));
      }, this.config.connectionTimeout);

      this.waitingRequests.push({
        resolve: (conn) => {
          clearTimeout(timeout);
          resolve(conn);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
        timestamp: Date.now(),
      });
    });
  }

  /**
   * Release a connection back to the pool
   */
  public async release(connection: Connection<T>): Promise<void> {
    if (!this.connections.has(connection.id)) {
      return;
    }

    connection.isActive = false;
    connection.lastUsedAt = Date.now();
    this.statistics.totalReleased++;

    // Check if there are waiting requests
    if (this.waitingRequests.length > 0) {
      const request = this.waitingRequests.shift();
      if (request) {
        connection.isActive = true;
        connection.usageCount++;
        request.resolve(connection);
        return;
      }
    }

    // Return to available pool (only if not already there)
    if (!this.availableConnections.includes(connection.id)) {
      this.availableConnections.push(connection.id);
    }
  }

  /**
   * Remove a connection from the pool
   */
  private async removeConnection(connId: string): Promise<void> {
    const connection = this.connections.get(connId);
    if (connection) {
      try {
        await this.resourceDestroyer(connection.resource);
      } catch (error) {
        console.error('Error destroying connection:', error);
      }
      this.connections.delete(connId);
    }

    const index = this.availableConnections.indexOf(connId);
    if (index >= 0) {
      this.availableConnections.splice(index, 1);
    }
  }

  /**
   * Start validation interval
   */
  private startValidationInterval(): void {
    setInterval(async () => {
      const now = Date.now();
      const connectionsToRemove: string[] = [];

      for (const [connId, connection] of this.connections.entries()) {
        // Check idle timeout
        if (!connection.isActive && now - connection.lastUsedAt > this.config.idleTimeout) {
          connectionsToRemove.push(connId);
          continue;
        }

        // Validate connection
        if (!connection.isActive) {
          try {
            const isValid = await this.resourceValidator(connection.resource);
            if (!isValid) {
              connectionsToRemove.push(connId);
            }
          } catch (error) {
            connectionsToRemove.push(connId);
          }
        }
      }

      // Remove invalid connections
      for (const connId of connectionsToRemove) {
        await this.removeConnection(connId);
      }

      // Ensure minimum connections
      while (this.connections.size < this.config.minConnections) {
        try {
          const resource = await this.resourceFactory();
          const connection: Connection<T> = {
            id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            resource,
            createdAt: Date.now(),
            lastUsedAt: Date.now(),
            isActive: false,
            usageCount: 0,
          };
          this.connections.set(connection.id, connection);
          this.availableConnections.push(connection.id);
        } catch (error) {
          console.error('Failed to create connection during validation:', error);
        }
      }
    }, this.config.validationInterval);
  }

  /**
   * Get pool statistics
   */
  public getStatistics(): PoolStatistics {
    const activeConnections = Array.from(this.connections.values()).filter(
      (c) => c.isActive
    ).length;
    const idleConnections = this.availableConnections.length;
    const avgWaitTime =
      this.statistics.waitTimes.length > 0
        ? this.statistics.waitTimes.reduce((a, b) => a + b, 0) / this.statistics.waitTimes.length
        : 0;

    return {
      totalConnections: this.connections.size,
      activeConnections,
      idleConnections,
      waitingRequests: this.waitingRequests.length,
      totalAcquired: this.statistics.totalAcquired,
      totalReleased: this.statistics.totalReleased,
      averageWaitTime: avgWaitTime,
    };
  }

  /**
   * Drain the pool
   */
  public async drain(): Promise<void> {
    const connectionsToRemove = Array.from(this.connections.keys());

    for (const connId of connectionsToRemove) {
      await this.removeConnection(connId);
    }

    this.availableConnections = [];
    this.waitingRequests = [];
  }

  /**
   * Update pool configuration
   */
  public updateConfig(config: Partial<PoolConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get connection details
   */
  public getConnectionDetails(): Array<Record<string, unknown>> {
    return Array.from(this.connections.values()).map((conn) => ({
      id: conn.id,
      isActive: conn.isActive,
      createdAt: conn.createdAt,
      lastUsedAt: conn.lastUsedAt,
      usageCount: conn.usageCount,
      age: Date.now() - conn.createdAt,
    }));
  }
}
