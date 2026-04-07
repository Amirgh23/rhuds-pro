/**
 * Phase 13 Week 1 - Distributed Systems Integration Tests
 * تست‌های ادغام سیستم‌های توزیع شده
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DistributedCacheManager } from '../../engine/distributed/DistributedCacheManager';
import { ClusterCoordinator } from '../../engine/distributed/ClusterCoordinator';
import { MessageQueueIntegration } from '../../engine/distributed/MessageQueueIntegration';
import { DistributedTracing } from '../../engine/distributed/DistributedTracing';
import { ServiceMeshIntegration } from '../../engine/distributed/ServiceMeshIntegration';

describe('Phase 13 Week 1 - Distributed Systems', () => {
  describe('DistributedCacheManager', () => {
    let cacheManager: DistributedCacheManager;

    beforeEach(() => {
      cacheManager = new DistributedCacheManager({
        backend: 'redis',
        nodes: ['node1', 'node2', 'node3'],
        ttl: 60000,
        maxSize: 1000,
        replicationFactor: 2,
      });
    });

    afterEach(() => {
      cacheManager.clear();
    });

    it('should set and get cache values', async () => {
      await cacheManager.set('key1', { data: 'value1' });
      const value = cacheManager.get('key1');

      expect(value).toEqual({ data: 'value1' });
    });

    it('should handle cache expiration', async () => {
      await cacheManager.set('key1', 'value1', 100);

      await new Promise((resolve) => setTimeout(resolve, 150));

      const value = cacheManager.get('key1');
      expect(value).toBeNull();
    });

    it('should acquire and release distributed locks', async () => {
      const lock = await cacheManager.acquireLock('resource1', 'owner1', 5000);

      expect(lock).toBeDefined();
      expect(lock?.owner).toBe('owner1');

      const released = await cacheManager.releaseLock('resource1', lock!.token);
      expect(released).toBe(true);
    });

    it('should prevent lock acquisition when locked', async () => {
      const lock1 = await cacheManager.acquireLock('resource1', 'owner1', 5000);
      const lock2 = await cacheManager.acquireLock('resource1', 'owner2', 5000);

      expect(lock1).toBeDefined();
      expect(lock2).toBeNull();
    });

    it('should track cache statistics', async () => {
      await cacheManager.set('key1', 'value1');
      cacheManager.get('key1');
      cacheManager.get('key2');

      const stats = cacheManager.getStats();

      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.size).toBe(1);
    });

    it('should emit events on cache operations', (done) => {
      cacheManager.on('set', (data) => {
        expect(data.key).toBe('key1');
        done();
      });

      cacheManager.set('key1', 'value1');
    });
  });

  describe('ClusterCoordinator', () => {
    let coordinator: ClusterCoordinator;

    beforeEach(() => {
      coordinator = new ClusterCoordinator(
        'node1',
        {
          algorithm: 'raft',
          heartbeatInterval: 150,
          electionTimeout: 300,
          quorumSize: 2,
        },
        {
          interval: 1000,
          timeout: 500,
          maxFailures: 3,
        }
      );
    });

    afterEach(() => {
      coordinator.shutdown();
    });

    it('should register and deregister nodes', () => {
      coordinator.registerNode({
        id: 'node2',
        address: 'localhost',
        port: 8001,
        status: 'healthy',
        lastHeartbeat: Date.now(),
        metadata: {},
      });

      const node = coordinator.getNodeInfo('node2');
      expect(node).toBeDefined();
      expect(node?.id).toBe('node2');

      coordinator.deregisterNode('node2');
      expect(coordinator.getNodeInfo('node2')).toBeUndefined();
    });

    it('should track cluster status', () => {
      coordinator.registerNode({
        id: 'node2',
        address: 'localhost',
        port: 8001,
        status: 'healthy',
        lastHeartbeat: Date.now(),
        metadata: {},
      });

      const status = coordinator.getClusterStatus();

      expect(status.nodeId).toBe('node1');
      expect(status.totalNodes).toBe(1);
    });

    it('should append and commit logs', () => {
      const index1 = coordinator.appendLog({ action: 'set', key: 'key1' });
      const index2 = coordinator.appendLog({ action: 'set', key: 'key2' });

      expect(index1).toBe(0);
      expect(index2).toBe(1);

      coordinator.commitLog(1);
      const status = coordinator.getClusterStatus();
      expect(status.committed).toBe(1);
    });

    it('should emit events on cluster changes', (done) => {
      coordinator.on('node-registered', (data) => {
        expect(data.id).toBe('node2');
        done();
      });

      coordinator.registerNode({
        id: 'node2',
        address: 'localhost',
        port: 8001,
        status: 'healthy',
        lastHeartbeat: Date.now(),
        metadata: {},
      });
    });
  });

  describe('MessageQueueIntegration', () => {
    let queue: MessageQueueIntegration;

    beforeEach(() => {
      queue = new MessageQueueIntegration({
        broker: 'rabbitmq',
        brokerUrl: 'amqp://localhost',
        topics: ['events', 'commands'],
        consumerGroup: 'test-group',
        batchSize: 10,
        batchTimeout: 100,
      });
    });

    afterEach(() => {
      queue.shutdown();
    });

    it('should publish messages', async () => {
      const messageId = await queue.publish('events', { type: 'test' });

      expect(messageId).toBeDefined();
      expect(messageId).toMatch(/^msg-/);
    });

    it('should register and route messages', async () => {
      let processed = false;

      queue.registerRoute('events', async (message) => {
        processed = true;
      });

      await queue.publish('events', { type: 'test' });

      await new Promise((resolve) => setTimeout(resolve, 200));

      expect(processed).toBe(true);
    });

    it('should handle message retries', async () => {
      let attempts = 0;

      queue.registerRoute('events', async (message) => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Temporary failure');
        }
      });

      await queue.publish('events', { type: 'test' });

      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(attempts).toBeGreaterThanOrEqual(1);
    });

    it('should send failed messages to dead letter queue', async () => {
      queue.registerRoute('events', async (message) => {
        throw new Error('Permanent failure');
      });

      await queue.publish('events', { type: 'test' });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const dlMessages = queue.getDeadLetterMessages();
      expect(dlMessages.length).toBeGreaterThan(0);
    });

    it('should track queue statistics', async () => {
      await queue.publish('events', { type: 'test' });

      const stats = queue.getStats();

      expect(stats.published).toBe(1);
      expect(stats.bufferSize).toBeGreaterThanOrEqual(0);
    });
  });

  describe('DistributedTracing', () => {
    let tracing: DistributedTracing;

    beforeEach(() => {
      tracing = new DistributedTracing({
        samplingRate: 1.0,
        maxSpansPerTrace: 100,
        maxLogSize: 50,
        retentionTime: 3600000,
      });
    });

    it('should create traces and spans', () => {
      const traceId = tracing.startTrace();
      const spanId = tracing.startSpan(traceId, 'operation1', 'service1');

      expect(traceId).toBeDefined();
      expect(spanId).toBeDefined();

      tracing.endSpan(spanId);
      tracing.completeTrace(traceId);

      const trace = tracing.getTrace(traceId);
      expect(trace).toBeDefined();
      expect(trace?.spans.length).toBe(1);
    });

    it('should track span hierarchy', () => {
      const traceId = tracing.startTrace();
      const span1 = tracing.startSpan(traceId, 'operation1', 'service1');
      const span2 = tracing.startSpan(traceId, 'operation2', 'service2', span1);

      tracing.endSpan(span2);
      tracing.endSpan(span1);
      tracing.completeTrace(traceId);

      const trace = tracing.getTrace(traceId);
      expect(trace?.spans.length).toBe(2);
      expect(trace?.spans[1].parentSpanId).toBe(span1);
    });

    it('should add tags and logs to spans', () => {
      const traceId = tracing.startTrace();
      const spanId = tracing.startSpan(traceId, 'operation1', 'service1');

      tracing.addTag('userId', '123');
      tracing.addLog('Processing started', 'info');

      tracing.endSpan(spanId);
      tracing.completeTrace(traceId);

      const trace = tracing.getTrace(traceId);
      expect(trace?.spans[0].tags.userId).toBe('123');
      expect(trace?.spans[0].logs.length).toBe(1);
    });

    it('should propagate span context', () => {
      const traceId = tracing.startTrace();
      const spanId = tracing.startSpan(traceId, 'operation1', 'service1');

      const context = tracing.getSpanContext();

      expect(context?.traceId).toBe(traceId);
      expect(context?.spanId).toBe(spanId);

      tracing.endSpan(spanId);
    });

    it('should analyze trace performance', () => {
      const traceId = tracing.startTrace();
      const span1 = tracing.startSpan(traceId, 'operation1', 'service1');

      setTimeout(() => {
        tracing.endSpan(span1);
      }, 50);

      tracing.completeTrace(traceId);

      const analysis = tracing.analyzeTrace(traceId);

      expect(analysis).toBeDefined();
      expect(analysis?.spanCount).toBe(1);
      expect(analysis?.totalDuration).toBeGreaterThan(0);
    });
  });

  describe('ServiceMeshIntegration', () => {
    let mesh: ServiceMeshIntegration;

    beforeEach(() => {
      mesh = new ServiceMeshIntegration({
        meshType: 'istio',
        namespace: 'default',
        controlPlaneUrl: 'http://localhost:15000',
        enableMTLS: true,
      });
    });

    it('should create virtual services', () => {
      mesh.createVirtualService({
        name: 'api-service',
        hosts: ['api.example.com'],
        http: [
          {
            route: [
              {
                destination: { host: 'api-v1', port: 8080 },
                weight: 80,
              },
              {
                destination: { host: 'api-v2', port: 8080 },
                weight: 20,
              },
            ],
          },
        ],
      });

      const status = mesh.getMeshStatus();
      expect(status.virtualServices).toBe(1);
    });

    it('should create destination rules', () => {
      mesh.createDestinationRule({
        name: 'api-rule',
        host: 'api-service',
        trafficPolicy: {
          connectionPool: {
            tcp: { maxConnections: 100 },
            http: { http1MaxPendingRequests: 100 },
          },
        },
      });

      const status = mesh.getMeshStatus();
      expect(status.destinationRules).toBe(1);
    });

    it('should route requests', async () => {
      mesh.createVirtualService({
        name: 'api-service',
        hosts: ['api.example.com'],
        http: [
          {
            route: [
              {
                destination: { host: 'api-v1', port: 8080 },
              },
            ],
          },
        ],
      });

      const result = await mesh.routeRequest('api-service', 'api-v1', {
        uri: '/api/test',
        method: 'GET',
      });

      expect(result).toBeDefined();
      expect(result.status).toBe(200);
    });

    it('should handle circuit breaker', async () => {
      mesh.createDestinationRule({
        name: 'api-rule',
        host: 'api-service',
        trafficPolicy: {
          outlierDetection: {
            consecutive5xxErrors: 1,
            interval: '30s',
            baseEjectionTime: '30s',
          },
        },
      });

      mesh.createVirtualService({
        name: 'api-service',
        hosts: ['api.example.com'],
        http: [
          {
            route: [
              {
                destination: { host: 'api-v1', port: 8080 },
              },
            ],
          },
        ],
      });

      const status = mesh.getMeshStatus();
      expect(status.circuitBreakers).toBe(1);
    });

    it('should get mesh status', () => {
      mesh.createVirtualService({
        name: 'api-service',
        hosts: ['api.example.com'],
        http: [
          {
            route: [
              {
                destination: { host: 'api-v1', port: 8080 },
              },
            ],
          },
        ],
      });

      const status = mesh.getMeshStatus();

      expect(status.meshType).toBe('istio');
      expect(status.virtualServices).toBe(1);
      expect(status.stats.requestsRouted).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Integration Tests', () => {
    it('should work together in a distributed system', async () => {
      const cache = new DistributedCacheManager({
        backend: 'redis',
        nodes: ['node1', 'node2'],
        ttl: 60000,
        maxSize: 1000,
        replicationFactor: 2,
      });

      const coordinator = new ClusterCoordinator(
        'node1',
        {
          algorithm: 'raft',
          heartbeatInterval: 150,
          electionTimeout: 300,
          quorumSize: 2,
        },
        {
          interval: 1000,
          timeout: 500,
          maxFailures: 3,
        }
      );

      const queue = new MessageQueueIntegration({
        broker: 'rabbitmq',
        brokerUrl: 'amqp://localhost',
        topics: ['events'],
        consumerGroup: 'test-group',
        batchSize: 10,
        batchTimeout: 100,
      });

      const tracing = new DistributedTracing({
        samplingRate: 1.0,
        maxSpansPerTrace: 100,
        maxLogSize: 50,
        retentionTime: 3600000,
      });

      // Simulate distributed operation
      const traceId = tracing.startTrace();
      const spanId = tracing.startSpan(traceId, 'distributed-op', 'system');

      await cache.set('distributed-key', { value: 'test' });
      const value = cache.get('distributed-key');

      await queue.publish('events', { type: 'distributed-event' });

      tracing.endSpan(spanId);
      tracing.completeTrace(traceId);

      expect(value).toEqual({ value: 'test' });

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);

      coordinator.shutdown();
      queue.shutdown();
    });
  });
});
