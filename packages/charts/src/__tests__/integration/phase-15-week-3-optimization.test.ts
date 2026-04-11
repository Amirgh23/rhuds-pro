/**
 * Phase 15 Week 3 - Advanced Optimization & Performance Tests
 * Tests for caching, query optimization, and performance monitoring
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AdvancedCachingSystem } from '../../engine/optimization/AdvancedCachingSystem';
import { QueryOptimization } from '../../engine/optimization/QueryOptimization';
import { PerformanceMonitoring } from '../../engine/optimization/PerformanceMonitoring';

describe('Phase 15 Week 3 - Advanced Optimization & Performance', () => {
  let caching: AdvancedCachingSystem;
  let queryOpt: QueryOptimization;
  let monitoring: PerformanceMonitoring;

  beforeEach(() => {
    caching = new AdvancedCachingSystem();
    queryOpt = new QueryOptimization();
    monitoring = new PerformanceMonitoring();
  });

  describe('AdvancedCachingSystem', () => {
    it('should set and get cache entry', () => {
      caching.set('key1', { value: 42 });
      const result = caching.get('key1');

      expect(result).toBeDefined();
      expect(result?.value).toBe(42);
    });

    it('should handle TTL expiration', (done) => {
      caching.set('key1', { value: 42 }, 100);
      const result1 = caching.get('key1');
      expect(result1).toBeDefined();

      setTimeout(() => {
        const result2 = caching.get('key1');
        expect(result2).toBeUndefined();
        done();
      }, 150);
    });

    it('should delete cache entry', () => {
      caching.set('key1', { value: 42 });
      const deleted = caching.delete('key1');

      expect(deleted).toBe(true);
      expect(caching.get('key1')).toBeUndefined();
    });

    it('should track cache statistics', () => {
      caching.set('key1', { value: 1 });
      caching.set('key2', { value: 2 });

      caching.get('key1');
      caching.get('key1');
      caching.get('key3');

      const stats = caching.getStats();
      expect(stats.totalEntries).toBe(2);
      expect(stats.hitRate).toBeGreaterThan(0);
    });

    it('should warm cache with data', () => {
      const data = { key1: 'value1', key2: 'value2', key3: 'value3' };
      caching.warmCache(data);

      expect(caching.get('key1')).toBe('value1');
      expect(caching.get('key2')).toBe('value2');
      expect(caching.get('key3')).toBe('value3');
    });

    it('should check if key exists', () => {
      caching.set('key1', { value: 42 });

      expect(caching.has('key1')).toBe(true);
      expect(caching.has('key2')).toBe(false);
    });

    it('should get all keys', () => {
      caching.set('key1', { value: 1 });
      caching.set('key2', { value: 2 });
      caching.set('key3', { value: 3 });

      const keys = caching.keys();
      expect(keys.length).toBe(3);
      expect(keys).toContain('key1');
    });

    it('should invalidate by pattern', () => {
      caching.set('user:1', { id: 1 });
      caching.set('user:2', { id: 2 });
      caching.set('post:1', { id: 1 });

      const invalidated = caching.invalidateByPattern(/^user:/);
      expect(invalidated).toBe(2);
      expect(caching.has('user:1')).toBe(false);
      expect(caching.has('post:1')).toBe(true);
    });

    it('should clear all cache', () => {
      caching.set('key1', { value: 1 });
      caching.set('key2', { value: 2 });

      caching.clear();
      expect(caching.keys().length).toBe(0);
    });

    it('should get cache size', () => {
      caching.set('key1', { value: 'test' });
      const size = caching.getSize();

      expect(size).toBeGreaterThan(0);
    });
  });

  describe('QueryOptimization', () => {
    it('should create index', () => {
      const index = queryOpt.createIndex('idx_name', ['name']);

      expect(index).toBeDefined();
      expect(index.name).toBe('idx_name');
      expect(index.columns).toContain('name');
    });

    it('should analyze query', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];

      const plan = queryOpt.analyzeQuery('SELECT * FROM users', data);

      expect(plan).toBeDefined();
      expect(plan.steps.length).toBeGreaterThan(0);
      expect(plan.estimatedCost).toBeGreaterThan(0);
    });

    it('should execute query with optimization', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];

      const result = queryOpt.executeQuery('SELECT * FROM users', data);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should cache query results', () => {
      const data = [{ id: 1, name: 'Alice' }];
      const query = 'SELECT * FROM users';

      queryOpt.executeQuery(query, data);
      const cacheSize1 = queryOpt.getCacheSize();

      queryOpt.executeQuery(query, data);
      const cacheSize2 = queryOpt.getCacheSize();

      expect(cacheSize2).toBe(cacheSize1);
    });

    it('should get query statistics', () => {
      const data = [{ id: 1, name: 'Alice' }];

      queryOpt.executeQuery('SELECT * FROM users', data);
      queryOpt.executeQuery('SELECT * FROM users WHERE id = 1', data);

      const stats = queryOpt.getQueryStats();

      expect(stats.totalQueries).toBeGreaterThan(0);
      expect(stats.averageExecutionTime).toBeGreaterThanOrEqual(0);
    });

    it('should list indexes', () => {
      queryOpt.createIndex('idx1', ['col1']);
      queryOpt.createIndex('idx2', ['col2']);

      const indexes = queryOpt.listIndexes();
      expect(indexes.length).toBeGreaterThanOrEqual(2);
    });

    it('should drop index', () => {
      queryOpt.createIndex('idx1', ['col1']);
      const dropped = queryOpt.dropIndex('idx1');

      expect(dropped).toBe(true);
      expect(queryOpt.getIndex('idx1')).toBeUndefined();
    });

    it('should clear query cache', () => {
      const data = [{ id: 1, name: 'Alice' }];
      queryOpt.executeQuery('SELECT * FROM users', data);

      queryOpt.clearCache();
      expect(queryOpt.getCacheSize()).toBe(0);
    });
  });

  describe('PerformanceMonitoring', () => {
    it('should record metric', () => {
      const metric = monitoring.recordMetric('response_time', 150, 'ms');

      expect(metric).toBeDefined();
      expect(metric.name).toBe('response_time');
      expect(metric.value).toBe(150);
    });

    it('should create alert', () => {
      const alert = monitoring.createAlert('cpu_usage', 'high', 'CPU usage is high');

      expect(alert).toBeDefined();
      expect(alert.severity).toBe('high');
      expect(alert.resolved).toBe(false);
    });

    it('should resolve alert', () => {
      const alert = monitoring.createAlert('cpu_usage', 'high', 'CPU usage is high');
      const resolved = monitoring.resolveAlert(alert.id);

      expect(resolved).toBe(true);
    });

    it('should set threshold', () => {
      monitoring.setThreshold('response_time', 200);
      monitoring.recordMetric('response_time', 250);

      const alerts = monitoring.getActiveAlerts();
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should get metric history', () => {
      monitoring.recordMetric('response_time', 100);
      monitoring.recordMetric('response_time', 150);
      monitoring.recordMetric('response_time', 200);

      const history = monitoring.getMetricHistory('response_time');
      expect(history.length).toBe(3);
    });

    it('should get metric statistics', () => {
      monitoring.recordMetric('response_time', 100);
      monitoring.recordMetric('response_time', 150);
      monitoring.recordMetric('response_time', 200);

      const stats = monitoring.getMetricStats('response_time');

      expect(stats.count).toBe(3);
      expect(stats.average).toBe(150);
      expect(stats.min).toBe(100);
      expect(stats.max).toBe(200);
    });

    it('should generate performance report', () => {
      monitoring.recordMetric('response_time', 100);
      monitoring.recordMetric('cpu_usage', 50);
      monitoring.createAlert('memory', 'medium', 'Memory usage is moderate');

      const report = monitoring.generateReport();

      expect(report).toBeDefined();
      expect(report.metrics.length).toBeGreaterThan(0);
      expect(report.summary).toBeDefined();
    });

    it('should get active alerts', () => {
      monitoring.createAlert('cpu', 'high', 'CPU high');
      monitoring.createAlert('memory', 'low', 'Memory low');

      const alerts = monitoring.getActiveAlerts();
      expect(alerts.length).toBe(2);
    });

    it('should get alerts by severity', () => {
      monitoring.createAlert('cpu', 'high', 'CPU high');
      monitoring.createAlert('memory', 'low', 'Memory low');
      monitoring.createAlert('disk', 'critical', 'Disk critical');

      const criticalAlerts = monitoring.getAlertsBySeverity('critical');
      expect(criticalAlerts.length).toBe(1);
    });

    it('should list all reports', () => {
      monitoring.generateReport();
      monitoring.generateReport();

      const reports = monitoring.listReports();
      expect(reports.length).toBe(2);
    });

    it('should clear old metrics', () => {
      monitoring.recordMetric('response_time', 100);

      const cleared = monitoring.clearOldMetrics(1000);
      expect(cleared).toBeGreaterThanOrEqual(0);
    });

    it('should get all metrics', () => {
      monitoring.recordMetric('response_time', 100);
      monitoring.recordMetric('cpu_usage', 50);

      const allMetrics = monitoring.getAllMetrics();
      expect(Object.keys(allMetrics).length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Integration Tests', () => {
    it('should integrate caching with query optimization', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];

      const query = 'SELECT * FROM users';
      const result1 = queryOpt.executeQuery(query, data);

      caching.set(query, result1);
      const cachedResult = caching.get(query);

      expect(cachedResult).toEqual(result1);
    });

    it('should monitor query performance', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];

      const startTime = Date.now();
      queryOpt.executeQuery('SELECT * FROM users', data);
      const executionTime = Date.now() - startTime;

      monitoring.recordMetric('query_execution_time', executionTime);

      const history = monitoring.getMetricHistory('query_execution_time');
      expect(history.length).toBeGreaterThan(0);
    });

    it('should optimize and monitor cache performance', () => {
      caching.set('key1', { value: 1 });
      caching.set('key2', { value: 2 });

      caching.get('key1');
      caching.get('key1');
      caching.get('key3');

      const stats = caching.getStats();
      monitoring.recordMetric('cache_hit_rate', stats.hitRate * 100);

      const metrics = monitoring.getMetricHistory('cache_hit_rate');
      expect(metrics.length).toBeGreaterThan(0);
    });

    it('should handle complete optimization workflow', () => {
      // Create indexes
      queryOpt.createIndex('idx_id', ['id']);
      queryOpt.createIndex('idx_name', ['name']);

      // Prepare data
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];

      // Execute query
      const query = 'SELECT * FROM users WHERE id > 1';
      const result = queryOpt.executeQuery(query, data);

      // Cache result
      caching.set(query, result);

      // Monitor performance
      const stats = queryOpt.getQueryStats();
      monitoring.recordMetric('query_cache_hit_rate', stats.cacheHitRate * 100);

      // Generate report
      const report = monitoring.generateReport();

      expect(result).toBeDefined();
      expect(caching.get(query)).toEqual(result);
      expect(report.metrics.length).toBeGreaterThan(0);
    });
  });
});
