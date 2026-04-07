# Phase 13 Week 1 - Quick Reference Guide

**راهنمای سریع برای سیستم‌های توزیع شده**

---

## 🚀 Quick Start

### Distributed Cache Manager

```typescript
import { DistributedCacheManager } from './engine/distributed/DistributedCacheManager';

const cache = new DistributedCacheManager({
  backend: 'redis',
  nodes: ['node1', 'node2', 'node3'],
  ttl: 60000,
  maxSize: 1000,
  replicationFactor: 2,
});

// Set value
await cache.set('key1', { data: 'value' }, 60000);

// Get value
const value = cache.get('key1');

// Acquire lock
const lock = await cache.acquireLock('resource', 'owner', 5000);

// Release lock
await cache.releaseLock('resource', lock.token);

// Get stats
const stats = cache.getStats();
```

### Cluster Coordinator

```typescript
import { ClusterCoordinator } from './engine/distributed/ClusterCoordinator';

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

// Register node
coordinator.registerNode({
  id: 'node2',
  address: 'localhost',
  port: 8001,
  status: 'healthy',
  lastHeartbeat: Date.now(),
  metadata: {},
});

// Get cluster status
const status = coordinator.getClusterStatus();

// Append log
const index = coordinator.appendLog({ action: 'set', key: 'key1' });

// Commit log
coordinator.commitLog(index);
```

### Message Queue Integration

```typescript
import { MessageQueueIntegration } from './engine/distributed/MessageQueueIntegration';

const queue = new MessageQueueIntegration({
  broker: 'rabbitmq',
  brokerUrl: 'amqp://localhost',
  topics: ['events', 'commands'],
  consumerGroup: 'test-group',
  batchSize: 10,
  batchTimeout: 100,
});

// Register route
queue.registerRoute(
  'events',
  async (message) => {
    console.log('Processing:', message);
  },
  0,
  {
    maxRetries: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
    maxDelay: 30000,
  }
);

// Publish message
const messageId = await queue.publish('events', { type: 'test' });

// Get dead letter messages
const dlMessages = queue.getDeadLetterMessages();

// Requeue dead letter
await queue.requeueDeadLetter(messageId);
```

### Distributed Tracing

```typescript
import { DistributedTracing } from './engine/distributed/DistributedTracing';

const tracing = new DistributedTracing({
  samplingRate: 1.0,
  maxSpansPerTrace: 100,
  maxLogSize: 50,
  retentionTime: 3600000,
});

// Start trace
const traceId = tracing.startTrace();

// Start span
const spanId = tracing.startSpan(traceId, 'operation1', 'service1');

// Add tag
tracing.addTag('userId', '123');

// Add log
tracing.addLog('Processing started', 'info');

// End span
tracing.endSpan(spanId, 'success');

// Complete trace
tracing.completeTrace(traceId);

// Get trace visualization
const viz = tracing.getTraceVisualization(traceId);

// Analyze trace
const analysis = tracing.analyzeTrace(traceId);
```

### Service Mesh Integration

```typescript
import { ServiceMeshIntegration } from './engine/distributed/ServiceMeshIntegration';

const mesh = new ServiceMeshIntegration({
  meshType: 'istio',
  namespace: 'default',
  controlPlaneUrl: 'http://localhost:15000',
  enableMTLS: true,
});

// Create virtual service
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

// Create destination rule
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

// Route request
const result = await mesh.routeRequest('api-service', 'api-v1', {
  uri: '/api/test',
  method: 'GET',
});

// Get mesh status
const status = mesh.getMeshStatus();
```

---

## 📊 Performance Targets

| Operation       | Target | Actual |
| --------------- | ------ | ------ |
| Cache Set       | < 50ms | ✅     |
| Cache Get       | < 10ms | ✅     |
| Lock Acquire    | < 50ms | ✅     |
| Node Register   | < 50ms | ✅     |
| Message Publish | < 50ms | ✅     |
| Trace Start     | < 10ms | ✅     |
| Route Request   | < 50ms | ✅     |

---

## 🔧 Configuration Examples

### High-Performance Cache

```typescript
const cache = new DistributedCacheManager({
  backend: 'redis',
  nodes: ['redis1', 'redis2', 'redis3'],
  ttl: 300000, // 5 minutes
  maxSize: 10000,
  replicationFactor: 3,
});
```

### Production Cluster

```typescript
const coordinator = new ClusterCoordinator(
  'node1',
  {
    algorithm: 'raft',
    heartbeatInterval: 100,
    electionTimeout: 500,
    quorumSize: 3,
  },
  {
    interval: 5000,
    timeout: 2000,
    maxFailures: 5,
  }
);
```

### Reliable Message Queue

```typescript
const queue = new MessageQueueIntegration({
  broker: 'rabbitmq',
  brokerUrl: 'amqp://rabbitmq:5672',
  topics: ['events', 'commands', 'notifications'],
  consumerGroup: 'production-group',
  batchSize: 100,
  batchTimeout: 1000,
});
```

### Comprehensive Tracing

```typescript
const tracing = new DistributedTracing({
  samplingRate: 0.1, // 10% sampling
  maxSpansPerTrace: 1000,
  maxLogSize: 100,
  retentionTime: 86400000, // 24 hours
});
```

### Production Mesh

```typescript
const mesh = new ServiceMeshIntegration({
  meshType: 'istio',
  namespace: 'production',
  controlPlaneUrl: 'http://istiod:15000',
  enableMTLS: true,
});
```

---

## 🎯 Common Patterns

### Distributed Lock Pattern

```typescript
const lock = await cache.acquireLock('critical-section', 'worker-1', 10000);

if (lock) {
  try {
    // Critical section
    await performCriticalOperation();
  } finally {
    await cache.releaseLock('critical-section', lock.token);
  }
}
```

### Message Processing Pattern

```typescript
queue.registerRoute('orders', async (message) => {
  const order = message.payload;

  // Process order
  await processOrder(order);

  // Publish event
  await queue.publish('order-processed', { orderId: order.id });
});
```

### Trace Propagation Pattern

```typescript
// In service A
const traceId = tracing.startTrace();
const spanId = tracing.startSpan(traceId, 'operation', 'service-a');

const headers = {};
tracing.injectSpanContext(headers);

// Send to service B with headers
await callServiceB(headers);

tracing.endSpan(spanId);
```

### Circuit Breaker Pattern

```typescript
mesh.createDestinationRule({
  name: 'api-rule',
  host: 'api-service',
  trafficPolicy: {
    outlierDetection: {
      consecutive5xxErrors: 5,
      interval: '30s',
      baseEjectionTime: '30s',
      maxEjectionPercent: 50,
    },
  },
});
```

---

## 📈 Monitoring

### Cache Statistics

```typescript
const stats = cache.getStats();
console.log(`Hit Rate: ${stats.hitRate * 100}%`);
console.log(`Size: ${stats.size}/${cache.config.maxSize}`);
console.log(`Evictions: ${stats.evictions}`);
```

### Cluster Status

```typescript
const status = coordinator.getClusterStatus();
console.log(`Leader: ${status.leader}`);
console.log(`Healthy Nodes: ${status.healthyNodes}/${status.totalNodes}`);
console.log(`Committed: ${status.committed}`);
```

### Queue Statistics

```typescript
const stats = queue.getStats();
console.log(`Published: ${stats.published}`);
console.log(`Consumed: ${stats.consumed}`);
console.log(`Dead Lettered: ${stats.deadLettered}`);
console.log(`Buffer Size: ${stats.bufferSize}`);
```

### Trace Analysis

```typescript
const analysis = tracing.analyzeTrace(traceId);
console.log(`Total Duration: ${analysis.totalDuration}ms`);
console.log(`Span Count: ${analysis.spanCount}`);
console.log(`Error Count: ${analysis.errorCount}`);
console.log(`Slowest Span: ${analysis.slowestSpan?.operationName}`);
```

### Mesh Status

```typescript
const status = mesh.getMeshStatus();
console.log(`Virtual Services: ${status.virtualServices}`);
console.log(`Destination Rules: ${status.destinationRules}`);
console.log(`Requests Routed: ${status.stats.requestsRouted}`);
console.log(`Circuit Breaker Trips: ${status.stats.circuitBreakerTrips}`);
```

---

## 🐛 Troubleshooting

### Cache Not Working

```typescript
// Check connection
const stats = cache.getStats();
if (stats.misses > stats.hits) {
  console.log('Cache hit rate is low');
}

// Clear cache
await cache.clear();
```

### Cluster Not Converging

```typescript
// Check node status
const status = coordinator.getClusterStatus();
console.log(`Healthy Nodes: ${status.healthyNodes}`);

// Check if quorum is reached
if (status.healthyNodes < coordinator.consensusConfig.quorumSize) {
  console.log('Quorum not reached');
}
```

### Messages Not Processing

```typescript
// Check dead letter queue
const dlMessages = queue.getDeadLetterMessages();
console.log(`Dead Letters: ${dlMessages.length}`);

// Requeue messages
for (const msg of dlMessages) {
  await queue.requeueDeadLetter(msg.id);
}
```

### Trace Not Showing

```typescript
// Check sampling rate
if (Math.random() > tracing.config.samplingRate) {
  console.log('Trace not sampled');
}

// Check trace exists
const trace = tracing.getTrace(traceId);
if (!trace) {
  console.log('Trace not found');
}
```

### Routing Failures

```typescript
// Check virtual service exists
const status = mesh.getMeshStatus();
console.log(`Virtual Services: ${status.virtualServices}`);

// Check service status
const svcStatus = mesh.getServiceStatus('api-v1');
console.log(`Service Healthy: ${svcStatus.healthy}`);
```

---

## 📚 Files Reference

| File                                  | Purpose              | Lines |
| ------------------------------------- | -------------------- | ----- |
| `DistributedCacheManager.ts`          | Cache management     | 280+  |
| `ClusterCoordinator.ts`               | Cluster coordination | 320+  |
| `MessageQueueIntegration.ts`          | Message queue        | 300+  |
| `DistributedTracing.ts`               | Request tracing      | 350+  |
| `ServiceMeshIntegration.ts`           | Service mesh         | 350+  |
| `phase-13-week-1-distributed.test.ts` | Tests                | 500+  |

---

## 🔗 Related Resources

- `PHASE_13_PLANNING.md` - Full roadmap
- `PHASE_13_WEEK_1_COMPLETION.md` - Detailed completion report
- `ARCHITECTURE.md` - System architecture
- `BEST_PRACTICES_FA.md` - Best practices

---

**Last Updated**: 8 آپریل 2026  
**Status**: ✅ COMPLETE
