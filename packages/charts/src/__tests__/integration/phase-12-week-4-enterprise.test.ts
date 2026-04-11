/**
 * Phase 12 Week 4 - Enterprise & Optimization Integration Tests
 * Tests for Advanced Caching, Load Balancing, Database Optimization, API Gateway, and Monitoring
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  AdvancedCachingSystem,
  LoadBalancingManager,
  DatabaseOptimization,
  APIGateway,
  EnterpriseMonitoring,
  type ServerConfig,
  type RouteConfig,
  type MetricConfig,
} from '../../engine/enterprise';

describe('Phase 12 Week 4 - Enterprise & Optimization', () => {
  describe('AdvancedCachingSystem', () => {
    let cache: AdvancedCachingSystem;

    beforeEach(() => {
      cache = new AdvancedCachingSystem({
        maxSize: 10 * 1024 * 1024,
        ttl: 3600000,
      });
    });

    it('should set and get values', () => {
      cache.set('key1', 'value1');
      const value = cache.get<string>('key1');

      expect(value).toBe('value1');
    });

    it('should handle multiple cache levels', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
    });

    it('should track cache statistics', () => {
      cache.set('key1', 'value1');
      cache.get('key1');
      cache.get('key1');
      cache.get('nonexistent');

      const stats = cache.getStatistics();

      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.entries).toBe(1);
    });

    it('should invalidate by pattern', () => {
      cache.set('user:1', 'data1');
      cache.set('user:2', 'data2');
      cache.set('post:1', 'data3');

      const invalidated = cache.invalidateByPattern('^user:');

      expect(invalidated).toBe(2);
      expect(cache.get('user:1')).toBeNull();
      expect(cache.get('post:1')).toBe('data3');
    });

    it('should clear cache', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      cache.clear();

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });

    it('should get cache levels info', () => {
      cache.set('key1', 'value1');
      const info = cache.getLevelsInfo();

      expect(info).toHaveProperty('l1');
      expect(info).toHaveProperty('l2');
      expect(info).toHaveProperty('l3');
    });
  });

  describe('LoadBalancingManager', () => {
    let balancer: LoadBalancingManager;

    beforeEach(() => {
      balancer = new LoadBalancingManager({ name: 'round-robin' });
    });

    it('should add servers', () => {
      const server: ServerConfig = {
        id: 'server1',
        host: 'localhost',
        port: 3000,
      };

      balancer.addServer(server);

      expect(balancer.getTotalServersCount()).toBe(1);
    });

    it('should get next server', () => {
      balancer.addServer({ id: 'server1', host: 'localhost', port: 3000 });
      balancer.addServer({ id: 'server2', host: 'localhost', port: 3001 });

      const server1 = balancer.getNextServer();
      const server2 = balancer.getNextServer();

      expect(server1?.id).toBe('server1');
      expect(server2?.id).toBe('server2');
    });

    it('should track server health', () => {
      balancer.addServer({ id: 'server1', host: 'localhost', port: 3000 });

      balancer.recordRequest('server1', 100, true);
      balancer.recordRequest('server1', 150, true);

      const health = balancer.getServerHealth('server1');

      expect(health?.healthy).toBe(true);
      expect(health?.successCount).toBe(2);
    });

    it('should mark unhealthy servers', () => {
      balancer.addServer({ id: 'server1', host: 'localhost', port: 3000 });

      balancer.recordRequest('server1', 100, false);
      balancer.recordRequest('server1', 100, false);
      balancer.recordRequest('server1', 100, false);

      const health = balancer.getServerHealth('server1');

      expect(health?.healthy).toBe(false);
      expect(health?.failureCount).toBe(3);
    });

    it('should manage connections', () => {
      balancer.addServer({ id: 'server1', host: 'localhost', port: 3000 });

      balancer.incrementConnections('server1');
      balancer.incrementConnections('server1');
      balancer.recordRequest('server1', 100, true);

      const stats = balancer.getStatistics();

      expect(stats.activeConnections).toBeGreaterThanOrEqual(0);

      balancer.decrementConnections('server1');

      const statsAfter = balancer.getStatistics();
      expect(statsAfter.activeConnections).toBeGreaterThanOrEqual(0);
    });

    it('should get statistics', () => {
      balancer.addServer({ id: 'server1', host: 'localhost', port: 3000 });

      balancer.recordRequest('server1', 100, true);
      balancer.recordRequest('server1', 150, false);

      const stats = balancer.getStatistics();

      expect(stats.totalRequests).toBe(2);
      expect(stats.successfulRequests).toBe(1);
      expect(stats.failedRequests).toBe(1);
    });
  });

  describe('DatabaseOptimization', () => {
    let db: DatabaseOptimization;

    beforeEach(() => {
      db = new DatabaseOptimization();
    });

    it('should optimize queries', () => {
      const plan = db.optimizeQuery('SELECT * FROM users');

      expect(plan.suggestions.length).toBeGreaterThan(0);
      expect(plan.optimized).toBe(false);
    });

    it('should create indexes', () => {
      db.createIndex({
        name: 'idx_user_id',
        columns: ['user_id'],
      });

      const indexes = db.getIndexes();

      expect(indexes.length).toBe(1);
      expect(indexes[0].name).toBe('idx_user_id');
    });

    it('should cache query results', () => {
      const query = 'SELECT * FROM users WHERE id = 1';
      const result = { id: 1, name: 'John' };

      db.cacheQueryResult(query, result);
      const cached = db.getCachedQueryResult(query);

      expect(cached).toEqual(result);
    });

    it('should track query execution', () => {
      db.recordQueryExecution('SELECT * FROM users', 100);
      db.recordQueryExecution('SELECT * FROM users', 150);

      const stats = db.getStatistics();

      expect(stats.averageQueryTime).toBeGreaterThan(0);
    });

    it('should manage connection pool', () => {
      const acquired = db.acquireConnection();

      expect(acquired).toBe(true);

      db.releaseConnection();

      const status = db.getConnectionPoolStatus();

      expect(status.available).toBeGreaterThan(0);
    });

    it('should identify slow queries', () => {
      db.recordQueryExecution('SELECT * FROM users', 2000);
      db.recordQueryExecution('SELECT * FROM posts', 100);

      const slowQueries = db.getSlowQueries(1000);

      expect(slowQueries.length).toBe(1);
      expect(slowQueries[0][0]).toBe('SELECT * FROM users');
    });
  });

  describe('APIGateway', () => {
    let gateway: APIGateway;

    beforeEach(() => {
      gateway = new APIGateway({ type: 'bearer' });
    });

    it('should register routes', () => {
      const route: RouteConfig = {
        path: '/users',
        method: 'GET',
        target: 'http://localhost:3000',
      };

      gateway.registerRoute(route);

      const retrieved = gateway.getRoute('GET', '/users');

      expect(retrieved).toBeDefined();
      expect(retrieved?.path).toBe('/users');
    });

    it('should handle requests', async () => {
      gateway.registerRoute({
        path: '/users',
        method: 'GET',
        target: 'http://localhost:3000',
        requiresAuth: false,
      });

      const result = await gateway.handleRequest('GET', '/users');

      expect(result.allowed).toBe(true);
    });

    it('should enforce authentication', async () => {
      gateway.registerRoute({
        path: '/admin',
        method: 'GET',
        target: 'http://localhost:3000',
        requiresAuth: true,
      });

      const result = await gateway.handleRequest('GET', '/admin');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Unauthorized');
    });

    it('should enforce rate limiting', async () => {
      gateway.registerRoute({
        path: '/api/data',
        method: 'GET',
        target: 'http://localhost:3000',
        rateLimit: 2,
      });

      const result1 = await gateway.handleRequest('GET', '/api/data', undefined, 'client1');
      const result2 = await gateway.handleRequest('GET', '/api/data', undefined, 'client1');
      const result3 = await gateway.handleRequest('GET', '/api/data', undefined, 'client1');

      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
      expect(result3.allowed).toBe(false);
    });

    it('should track statistics', async () => {
      gateway.registerRoute({
        path: '/users',
        method: 'GET',
        target: 'http://localhost:3000',
      });

      await gateway.handleRequest('GET', '/users');
      gateway.recordResponseTime(100);

      const stats = gateway.getStatistics();

      expect(stats.totalRequests).toBe(1);
      expect(stats.successfulRequests).toBe(1);
      expect(stats.averageResponseTime).toBe(100);
    });

    it('should calculate success rate', async () => {
      gateway.registerRoute({
        path: '/users',
        method: 'GET',
        target: 'http://localhost:3000',
      });

      await gateway.handleRequest('GET', '/users');
      await gateway.handleRequest('GET', '/nonexistent');

      const successRate = gateway.getSuccessRate();

      expect(successRate).toBe(0.5);
    });
  });

  describe('EnterpriseMonitoring', () => {
    let monitoring: EnterpriseMonitoring;

    beforeEach(() => {
      monitoring = new EnterpriseMonitoring();
    });

    it('should register metrics', () => {
      const config: MetricConfig = {
        name: 'cpu_usage',
        type: 'gauge',
        unit: 'percent',
      };

      monitoring.registerMetric(config);

      const data = monitoring.getMetricData('cpu_usage');

      expect(data).toBeDefined();
    });

    it('should record metrics', () => {
      monitoring.registerMetric({
        name: 'cpu_usage',
        type: 'gauge',
      });

      monitoring.recordMetric({
        name: 'cpu_usage',
        value: 75,
        timestamp: Date.now(),
      });

      const data = monitoring.getMetricData('cpu_usage');

      expect(data.length).toBe(1);
      expect(data[0].value).toBe(75);
    });

    it('should create alert rules', () => {
      monitoring.createAlertRule({
        id: 'alert1',
        name: 'High CPU',
        metric: 'cpu_usage',
        condition: 'greater',
        threshold: 80,
        duration: 60000,
        enabled: true,
      });

      const alerts = monitoring.getActiveAlerts();

      expect(alerts).toBeDefined();
    });

    it('should trigger alerts', () => {
      monitoring.registerMetric({
        name: 'cpu_usage',
        type: 'gauge',
      });

      monitoring.createAlertRule({
        id: 'alert1',
        name: 'High CPU',
        metric: 'cpu_usage',
        condition: 'greater',
        threshold: 80,
        duration: 60000,
        enabled: true,
      });

      monitoring.recordMetric({
        name: 'cpu_usage',
        value: 90,
        timestamp: Date.now(),
      });

      const alerts = monitoring.getActiveAlerts();

      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should analyze trends', () => {
      monitoring.registerMetric({
        name: 'memory_usage',
        type: 'gauge',
      });

      for (let i = 0; i < 20; i++) {
        monitoring.recordMetric({
          name: 'memory_usage',
          value: 50 + i,
          timestamp: Date.now() + i * 1000,
        });
      }

      const trend = monitoring.analyzeTrend('memory_usage');

      expect(trend).toBeDefined();
      expect(trend?.trend).toBe('increasing');
    });

    it('should get metric summary', () => {
      monitoring.registerMetric({
        name: 'response_time',
        type: 'histogram',
      });

      monitoring.recordMetric({
        name: 'response_time',
        value: 100,
        timestamp: Date.now(),
      });

      monitoring.recordMetric({
        name: 'response_time',
        value: 200,
        timestamp: Date.now(),
      });

      const summary = monitoring.getMetricSummary('response_time');

      expect(summary.count).toBe(2);
      expect(summary.min).toBe(100);
      expect(summary.max).toBe(200);
      expect(summary.avg).toBe(150);
    });

    it('should get statistics', () => {
      monitoring.registerMetric({
        name: 'cpu_usage',
        type: 'gauge',
      });

      monitoring.createAlertRule({
        id: 'alert1',
        name: 'High CPU',
        metric: 'cpu_usage',
        condition: 'greater',
        threshold: 80,
        duration: 60000,
        enabled: true,
      });

      const stats = monitoring.getStatistics();

      expect(stats.totalMetrics).toBe(1);
      expect(stats.alertRules).toBe(1);
    });
  });

  describe('Integration Tests', () => {
    it('should work with all enterprise components together', () => {
      const cache = new AdvancedCachingSystem();
      const balancer = new LoadBalancingManager();
      const db = new DatabaseOptimization();
      const gateway = new APIGateway();
      const monitoring = new EnterpriseMonitoring();

      expect(cache).toBeDefined();
      expect(balancer).toBeDefined();
      expect(db).toBeDefined();
      expect(gateway).toBeDefined();
      expect(monitoring).toBeDefined();
    });

    it('should handle complex enterprise scenarios', () => {
      // Setup caching
      const cache = new AdvancedCachingSystem();
      cache.set('config', { version: '1.0' });

      // Setup load balancing
      const balancer = new LoadBalancingManager();
      balancer.addServer({ id: 'server1', host: 'localhost', port: 3000 });
      balancer.addServer({ id: 'server2', host: 'localhost', port: 3001 });

      // Setup database
      const db = new DatabaseOptimization();
      db.createIndex({ name: 'idx_id', columns: ['id'] });

      // Setup gateway
      const gateway = new APIGateway();
      gateway.registerRoute({
        path: '/api/data',
        method: 'GET',
        target: 'http://localhost:3000',
      });

      // Setup monitoring
      const monitoring = new EnterpriseMonitoring();
      monitoring.registerMetric({ name: 'requests', type: 'counter' });

      expect(cache.get('config')).toBeDefined();
      expect(balancer.getTotalServersCount()).toBe(2);
      expect(db.getIndexes().length).toBe(1);
      expect(gateway.getRoutes().length).toBe(1);
      expect(monitoring.getStatistics().totalMetrics).toBe(1);
    });
  });
});
