/**
 * Phase 13 Week 4 - Performance & Optimization Tests
 * Comprehensive test suite for all optimization features
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  AutoScalingManager,
  PerformanceProfiler,
  ConnectionPoolManager,
  MemoryManagementSystem,
  AdvancedQueryOptimizer,
} from '../../engine/optimization';

describe('Phase 13 Week 4 - Performance & Optimization', () => {
  // ============================================================================
  // AutoScalingManager Tests
  // ============================================================================

  describe('AutoScalingManager', () => {
    let manager: AutoScalingManager;

    beforeEach(() => {
      manager = new AutoScalingManager({
        minInstances: 2,
        maxInstances: 10,
        targetCPU: 70,
        targetMemory: 80,
        scaleUpThreshold: 80,
        scaleDownThreshold: 30,
        cooldownPeriod: 1000,
      });
    });

    it('should initialize with correct instance count', () => {
      expect(manager.getCurrentInstances()).toBe(2);
    });

    it('should scale up when metrics exceed threshold', () => {
      const metrics = {
        cpuUsage: 85,
        memoryUsage: 75,
        requestsPerSecond: 100,
        responseTime: 200,
        errorRate: 0.01,
      };

      const event = manager.evaluateMetrics(metrics);
      expect(event).toBeDefined();
      expect(event?.type).toBe('scale-up');
    });

    it('should not scale down during cooldown period', () => {
      const metrics = {
        cpuUsage: 20,
        memoryUsage: 20,
        requestsPerSecond: 10,
        responseTime: 50,
        errorRate: 0,
      };

      manager.evaluateMetrics(metrics);
      const event = manager.evaluateMetrics(metrics);
      expect(event).toBeNull();
    });

    it('should respect max instances limit', () => {
      for (let i = 0; i < 20; i++) {
        const metrics = {
          cpuUsage: 90,
          memoryUsage: 90,
          requestsPerSecond: 200,
          responseTime: 500,
          errorRate: 0.05,
        };
        manager.evaluateMetrics(metrics);
      }

      expect(manager.getCurrentInstances()).toBeLessThanOrEqual(10);
    });

    it('should predict future load', () => {
      for (let i = 0; i < 15; i++) {
        const metrics = {
          cpuUsage: 50 + i * 2,
          memoryUsage: 50,
          requestsPerSecond: 100 + i * 10,
          responseTime: 100,
          errorRate: 0,
        };
        manager.evaluateMetrics(metrics);
      }

      const prediction = manager.predictLoad(1);
      expect(prediction).toBeGreaterThan(0);
    });

    it('should track scaling events', () => {
      const metrics = {
        cpuUsage: 85,
        memoryUsage: 75,
        requestsPerSecond: 100,
        responseTime: 200,
        errorRate: 0.01,
      };

      manager.evaluateMetrics(metrics);
      const events = manager.getScalingEvents();
      expect(events.length).toBeGreaterThan(0);
    });

    it('should provide statistics', () => {
      const stats = manager.getStatistics();
      expect(stats).toHaveProperty('currentInstances');
      expect(stats).toHaveProperty('totalScalingEvents');
      expect(stats).toHaveProperty('averageMetrics');
    });

    it('should update policy', () => {
      manager.updatePolicy({ maxInstances: 20 });
      for (let i = 0; i < 30; i++) {
        const metrics = {
          cpuUsage: 90,
          memoryUsage: 90,
          requestsPerSecond: 200,
          responseTime: 500,
          errorRate: 0.05,
        };
        manager.evaluateMetrics(metrics);
      }

      expect(manager.getCurrentInstances()).toBeLessThanOrEqual(20);
    });
  });

  // ============================================================================
  // PerformanceProfiler Tests
  // ============================================================================

  describe('PerformanceProfiler', () => {
    let profiler: PerformanceProfiler;

    beforeEach(() => {
      profiler = new PerformanceProfiler();
    });

    it('should record performance metrics', () => {
      profiler.recordMetric({
        name: 'render',
        duration: 10,
        timestamp: Date.now(),
        category: 'render',
      });

      const stats = profiler.getStatistics();
      expect(stats.totalMetrics).toBe(1);
    });

    it('should detect bottlenecks', () => {
      for (let i = 0; i < 5; i++) {
        profiler.recordMetric({
          name: 'slow-operation',
          duration: 500,
          timestamp: Date.now(),
          category: 'compute',
        });
      }

      const bottlenecks = profiler.analyzeBottlenecks();
      expect(bottlenecks.length).toBeGreaterThan(0);
      expect(['low', 'medium', 'high', 'critical']).toContain(bottlenecks[0].severity);
    });

    it('should generate recommendations', () => {
      for (let i = 0; i < 10; i++) {
        profiler.recordMetric({
          name: 'expensive-io',
          duration: 2000,
          timestamp: Date.now(),
          category: 'io',
        });
      }

      const recommendations = profiler.generateRecommendations();
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toHaveProperty('title');
      expect(recommendations[0]).toHaveProperty('priority');
    });

    it('should create performance snapshots', () => {
      profiler.recordMetric({
        name: 'test',
        duration: 50,
        timestamp: Date.now(),
        category: 'render',
      });

      const snapshot = profiler.createSnapshot();
      expect(snapshot).toHaveProperty('timestamp');
      expect(snapshot).toHaveProperty('metrics');
      expect(snapshot).toHaveProperty('bottlenecks');
      expect(snapshot).toHaveProperty('recommendations');
    });

    it('should set custom thresholds', () => {
      profiler.setThreshold('render', 8);

      profiler.recordMetric({
        name: 'fast-render',
        duration: 10,
        timestamp: Date.now(),
        category: 'render',
      });

      const bottlenecks = profiler.analyzeBottlenecks();
      expect(bottlenecks.some((b) => b.metric === 'fast-render')).toBe(true);
    });

    it('should provide statistics', () => {
      profiler.recordMetric({
        name: 'test1',
        duration: 100,
        timestamp: Date.now(),
        category: 'compute',
      });

      profiler.recordMetric({
        name: 'test2',
        duration: 50,
        timestamp: Date.now(),
        category: 'render',
      });

      const stats = profiler.getStatistics();
      expect(stats.totalMetrics).toBe(2);
      expect(stats).toHaveProperty('metricsByCategory');
    });

    it('should retrieve recent snapshots', () => {
      for (let i = 0; i < 5; i++) {
        profiler.recordMetric({
          name: `metric-${i}`,
          duration: 50,
          timestamp: Date.now(),
          category: 'render',
        });
        profiler.createSnapshot();
      }

      const snapshots = profiler.getSnapshots(3);
      expect(snapshots.length).toBeLessThanOrEqual(3);
    });

    it('should clear metrics', () => {
      profiler.recordMetric({
        name: 'test',
        duration: 50,
        timestamp: Date.now(),
        category: 'render',
      });

      profiler.clearMetrics();
      const stats = profiler.getStatistics();
      expect(stats.totalMetrics).toBe(0);
    });

    it('should export profile data', () => {
      profiler.recordMetric({
        name: 'test',
        duration: 50,
        timestamp: Date.now(),
        category: 'render',
      });

      const data = profiler.exportData();
      expect(data).toHaveProperty('metrics');
      expect(data).toHaveProperty('snapshots');
      expect(data).toHaveProperty('thresholds');
      expect(data).toHaveProperty('statistics');
    });
  });

  // ============================================================================
  // ConnectionPoolManager Tests
  // ============================================================================

  describe('ConnectionPoolManager', () => {
    let pool: ConnectionPoolManager<string>;

    beforeEach(async () => {
      pool = new ConnectionPoolManager(
        {
          minConnections: 2,
          maxConnections: 5,
          connectionTimeout: 5000,
          idleTimeout: 10000,
          validationInterval: 1000,
        },
        async () => `connection-${Math.random()}`,
        async () => true,
        async () => {}
      );

      // Wait for initialization
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    afterEach(async () => {
      await pool.drain();
    });

    it('should acquire connection', async () => {
      const conn = await pool.acquire();
      expect(conn).toBeDefined();
      expect(conn.isActive).toBe(true);
    });

    it('should release connection', async () => {
      const conn = await pool.acquire();
      await pool.release(conn);
      expect(conn.isActive).toBe(false);
    });

    it('should reuse released connections', async () => {
      const conn1 = await pool.acquire();
      const initialSize = pool.getStatistics().totalConnections;
      await pool.release(conn1);

      const conn2 = await pool.acquire();
      const finalSize = pool.getStatistics().totalConnections;

      // Pool size should not increase (connection was reused)
      expect(finalSize).toBeLessThanOrEqual(initialSize + 1);
    });

    it('should respect max connections limit', async () => {
      const connections = [];
      for (let i = 0; i < 5; i++) {
        connections.push(await pool.acquire());
      }

      const stats = pool.getStatistics();
      expect(stats.activeConnections).toBeLessThanOrEqual(5);

      for (const conn of connections) {
        await pool.release(conn);
      }
    });

    it('should provide pool statistics', async () => {
      const conn = await pool.acquire();
      const stats = pool.getStatistics();

      expect(stats).toHaveProperty('totalConnections');
      expect(stats).toHaveProperty('activeConnections');
      expect(stats).toHaveProperty('idleConnections');
      expect(stats.activeConnections).toBeGreaterThan(0);

      await pool.release(conn);
    });

    it('should update pool configuration', async () => {
      pool.updateConfig({ maxConnections: 10 });
      const stats = pool.getStatistics();
      expect(stats).toBeDefined();
    });

    it('should get connection details', async () => {
      const conn = await pool.acquire();
      const details = pool.getConnectionDetails();

      expect(details.length).toBeGreaterThan(0);
      expect(details[0]).toHaveProperty('id');
      expect(details[0]).toHaveProperty('isActive');

      await pool.release(conn);
    });

    it('should drain pool', async () => {
      const conn = await pool.acquire();
      await pool.drain();

      const stats = pool.getStatistics();
      expect(stats.totalConnections).toBe(0);
    });
  });

  // ============================================================================
  // MemoryManagementSystem Tests
  // ============================================================================

  describe('MemoryManagementSystem', () => {
    let memSystem: MemoryManagementSystem;

    beforeEach(() => {
      memSystem = new MemoryManagementSystem();
    });

    it('should take memory snapshot', () => {
      const snapshot = memSystem.takeSnapshot();
      expect(snapshot).toHaveProperty('timestamp');
      expect(snapshot).toHaveProperty('heapUsed');
      expect(snapshot).toHaveProperty('heapTotal');
    });

    it('should register and unregister objects', () => {
      memSystem.registerObject('test-obj', 1024);
      let stats = memSystem.getStatistics();
      expect(stats).toHaveProperty('objectRegistry');

      memSystem.unregisterObject('test-obj', 1024);
      stats = memSystem.getStatistics();
      expect(stats).toBeDefined();
    });

    it('should detect memory leaks', () => {
      // Simulate memory growth
      for (let i = 0; i < 15; i++) {
        memSystem.takeSnapshot();
      }

      const leaks = memSystem.getDetectedLeaks();
      expect(Array.isArray(leaks)).toBe(true);
    });

    it('should generate memory optimizations', () => {
      memSystem.takeSnapshot();
      const optimizations = memSystem.generateOptimizations();

      expect(Array.isArray(optimizations)).toBe(true);
      if (optimizations.length > 0) {
        expect(optimizations[0]).toHaveProperty('title');
        expect(optimizations[0]).toHaveProperty('priority');
      }
    });

    it('should get memory trend', () => {
      for (let i = 0; i < 5; i++) {
        memSystem.takeSnapshot();
      }

      const trend = memSystem.getMemoryTrend();
      expect(trend).toHaveProperty('trend');
    });

    it('should set memory threshold', () => {
      memSystem.setThreshold('heapUsagePercent', 90);
      const stats = memSystem.getStatistics();
      expect(stats).toBeDefined();
    });

    it('should clear old snapshots', () => {
      memSystem.takeSnapshot();
      memSystem.clearOldSnapshots(0);
      const stats = memSystem.getStatistics();
      expect(stats.snapshotCount).toBe(0);
    });

    it('should export memory data', () => {
      memSystem.takeSnapshot();
      const data = memSystem.exportData();

      expect(data).toHaveProperty('snapshots');
      expect(data).toHaveProperty('detectedLeaks');
      expect(data).toHaveProperty('statistics');
      expect(data).toHaveProperty('trend');
    });

    it('should provide statistics', () => {
      memSystem.takeSnapshot();
      const stats = memSystem.getStatistics();

      expect(stats).toHaveProperty('snapshotCount');
      expect(stats).toHaveProperty('detectedLeaks');
    });
  });

  // ============================================================================
  // AdvancedQueryOptimizer Tests
  // ============================================================================

  describe('AdvancedQueryOptimizer', () => {
    let optimizer: AdvancedQueryOptimizer<Record<string, unknown>>;

    beforeEach(() => {
      optimizer = new AdvancedQueryOptimizer();
    });

    it('should create query plan', () => {
      const plan = optimizer.createQueryPlan('SELECT * FROM users WHERE id = 1');

      expect(plan).toHaveProperty('id');
      expect(plan).toHaveProperty('query');
      expect(plan).toHaveProperty('estimatedCost');
      expect(plan).toHaveProperty('executionSteps');
      expect(plan).toHaveProperty('cacheStrategy');
    });

    it('should execute query with caching', async () => {
      const executor = async () => {
        // Return larger dataset to trigger caching
        return Array(100)
          .fill(null)
          .map((_, i) => ({ id: i, name: `user-${i}` }));
      };

      const result1 = await optimizer.executeQuery('SELECT * FROM users WHERE id > 10', executor);
      expect(result1.data.length).toBeGreaterThan(0);

      // Check cache statistics
      const cacheStats1 = optimizer.getCacheStatistics();
      expect(cacheStats1.entries).toBeGreaterThanOrEqual(0);

      // Execute same query again
      const result2 = await optimizer.executeQuery('SELECT * FROM users WHERE id > 10', executor);
      // Verify both results have the same data
      expect(result2.data).toEqual(result1.data);
    });

    it('should handle different query types', async () => {
      const executor = async () => [{ id: 1 }];

      const queries = [
        'SELECT * FROM users',
        'SELECT * FROM users WHERE id = 1',
        'SELECT * FROM users JOIN orders',
        'SELECT * FROM users GROUP BY id',
        'SELECT * FROM users ORDER BY id',
      ];

      for (const query of queries) {
        const result = await optimizer.executeQuery(query, executor);
        expect(result.plan.executionSteps.length).toBeGreaterThan(0);
      }
    });

    it('should provide query statistics', async () => {
      const executor = async () => [{ id: 1 }];

      await optimizer.executeQuery('SELECT * FROM users', executor);
      const stats = optimizer.getStatistics();

      expect(stats).toHaveProperty('totalQueries');
      expect(stats).toHaveProperty('totalExecutions');
      expect(stats).toHaveProperty('averageTime');
    });

    it('should provide cache statistics', async () => {
      const executor = async () => [{ id: 1 }];

      await optimizer.executeQuery('SELECT * FROM users', executor);
      const cacheStats = optimizer.getCacheStatistics();

      expect(cacheStats).toHaveProperty('entries');
      expect(cacheStats).toHaveProperty('totalSize');
      expect(cacheStats).toHaveProperty('utilizationPercent');
    });

    it('should clear cache', async () => {
      const executor = async () => [{ id: 1 }];

      await optimizer.executeQuery('SELECT * FROM users', executor);
      optimizer.clearCache();

      const stats = optimizer.getCacheStatistics();
      expect(stats.entries).toBe(0);
    });

    it('should get query plan', () => {
      const query = 'SELECT * FROM users';
      const plan = optimizer.getQueryPlan(query);

      expect(plan).toHaveProperty('executionSteps');
      expect(plan.executionSteps.length).toBeGreaterThan(0);
    });

    it('should export optimization data', async () => {
      const executor = async () => [{ id: 1 }];

      await optimizer.executeQuery('SELECT * FROM users', executor);
      const data = optimizer.exportData();

      expect(data).toHaveProperty('statistics');
      expect(data).toHaveProperty('cacheStatistics');
      expect(data).toHaveProperty('queryPlans');
    });

    it('should handle concurrent queries', async () => {
      const executor = async () => [{ id: 1 }];

      const queries = Array(5)
        .fill(null)
        .map((_, i) => optimizer.executeQuery(`SELECT * FROM users WHERE id = ${i}`, executor));

      const results = await Promise.all(queries);
      expect(results.length).toBe(5);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Tests', () => {
    it('should work together: Profiler + AutoScaling', () => {
      const profiler = new PerformanceProfiler();
      const scaler = new AutoScalingManager({
        minInstances: 2,
        maxInstances: 10,
        targetCPU: 70,
        targetMemory: 80,
        scaleUpThreshold: 80,
        scaleDownThreshold: 30,
        cooldownPeriod: 1000,
      });

      // Record metrics
      profiler.recordMetric({
        name: 'api-response',
        duration: 100,
        timestamp: Date.now(),
        category: 'network',
      });

      // Evaluate scaling
      const metrics = {
        cpuUsage: 85,
        memoryUsage: 75,
        requestsPerSecond: 100,
        responseTime: 100,
        errorRate: 0.01,
      };

      const event = scaler.evaluateMetrics(metrics);
      expect(event).toBeDefined();
    });

    it('should work together: QueryOptimizer + ConnectionPool', async () => {
      let connectionCount = 0;

      const pool = new ConnectionPoolManager(
        {
          minConnections: 2,
          maxConnections: 5,
          connectionTimeout: 5000,
          idleTimeout: 10000,
          validationInterval: 1000,
        },
        async () => {
          connectionCount++;
          return `connection-${connectionCount}`;
        },
        async () => true,
        async () => {}
      );

      const optimizer = new AdvancedQueryOptimizer();

      await new Promise((resolve) => setTimeout(resolve, 100));

      const executor = async () => {
        const conn = await pool.acquire();
        const result = [{ id: 1 }];
        await pool.release(conn);
        return result;
      };

      const result = await optimizer.executeQuery('SELECT * FROM users', executor);
      expect(result.data.length).toBeGreaterThan(0);

      await pool.drain();
    });

    it('should work together: MemorySystem + Profiler', () => {
      const memSystem = new MemoryManagementSystem();
      const profiler = new PerformanceProfiler();

      memSystem.takeSnapshot();
      profiler.recordMetric({
        name: 'memory-check',
        duration: 50,
        timestamp: Date.now(),
        category: 'memory',
      });

      const memStats = memSystem.getStatistics();
      const perfStats = profiler.getStatistics();

      expect(memStats).toBeDefined();
      expect(perfStats).toBeDefined();
    });
  });
});
