# Phase 13 Week 1 - Quick API Reference

## DistributedCacheManager

```typescript
import { DistributedCacheManager } from '@rhuds/charts';

const cache = new DistributedCacheManager();

// Node Management
cache.addNode({ id: 'node1', host: 'localhost', port: 6379 });
cache.getNodes(): CacheNode[];

// Cache Operations
cache.set<T>(key: string, value: T): void;
cache.get<T>(key: string): T | undefined;
cache.delete(key: string): boolean;
cache.clear(): void;

// Pattern-based Operations
cache.invalidateByPattern(pattern: string): number; // Returns count invalidated

// Distributed Locking
cache.acquireLock(resource: string): boolean;
cache.releaseLock(resource: string): void;

// Replication
cache.replicate(key: string, nodes: string[]): void;

// Statistics
cache.getStatistics(): {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
};
```

## ClusterCoordinator

```typescript
import { ClusterCoordinator } from '@rhuds/charts';

const coordinator = new ClusterCoordinator({
  algorithm: 'raft',
  heartbeatInterval: 1000,
  electionTimeout: 3000,
});

// Node Management
coordinator.addNode({ id: 'node1', host: 'localhost', port: 3000 });
coordinator.removeNode(nodeId: string): void;
coordinator.getNode(nodeId: string): ClusterNode | null;

// Leader Election
coordinator.startElection(): void;
coordinator.getLeader(): ClusterNode | null;

// Health Management
coordinator.sendHeartbeat(): void;
coordinator.checkNodeHealth(): void;
coordinator.markNodeUnhealthy(nodeId: string): void;
coordinator.markNodeHealthy(nodeId: string): void;

// Node Queries
coordinator.getHealthyNodes(): ClusterNode[];
coordinator.getClusterState(): ClusterState;

// Monitoring
coordinator.start(): void;
coordinator.stop(): void;
coordinator.addListener(listener: (event: string, data: unknown) => void): void;
coordinator.removeListener(listener: (event: string, data: unknown) => void): void;

// Statistics
coordinator.getStatistics(): {
  totalNodes: number;
  healthyNodes: number;
  leader: string | null;
  term: number;
  lastElection: number;
  uptime: number;
};
```

## MessageQueueIntegration

```typescript
import { MessageQueueIntegration } from '@rhuds/charts';

const queue = new MessageQueueIntegration({
  type: 'rabbitmq' | 'kafka',
  host: 'localhost',
  port: 5672,
});

// Route Management
queue.registerRoute(
  route: string,
  handler: (message: unknown) => Promise<void>
): void;

// Publishing
queue.publish(route: string, message: unknown): Promise<string>; // Returns messageId

// Subscription
queue.subscribe(route: string): Promise<void>;

// Dead Letter Handling
queue.handleDeadLetter(
  route: string,
  handler: (message: unknown) => Promise<void>
): void;

// Acknowledgment
queue.acknowledge(messageId: string): void;
queue.nack(messageId: string): void;

// Statistics
queue.getStatistics(): {
  routes: number;
  published: number;
  consumed: number;
  deadLetters: number;
};
```

## DistributedTracing

```typescript
import { DistributedTracing } from '@rhuds/charts';

const tracing = new DistributedTracing();

// Trace Management
tracing.startTrace(): string; // Returns traceId
tracing.getTrace(traceId: string): Trace | null;

// Span Management
tracing.startSpan(traceId: string, operation: string): string; // Returns spanId
tracing.endSpan(spanId: string, status: 'success' | 'error'): void;
tracing.getSpan(spanId: string): Span | null;

// Span Metadata
tracing.addTag(spanId: string, key: string, value: unknown): void;
tracing.addLog(spanId: string, message: string): void;

// Context Propagation
tracing.getContext(traceId: string): Record<string, unknown>;
tracing.setContext(traceId: string, context: Record<string, unknown>): void;

// Statistics
tracing.getStatistics(): {
  tracesCreated: number;
  spansCreated: number;
  averageSpanDuration: number;
  errorRate: number;
};
```

## ServiceMeshIntegration

```typescript
import { ServiceMeshIntegration } from '@rhuds/charts';

const mesh = new ServiceMeshIntegration();

// Service Management
mesh.registerService(service: {
  name: string;
  namespace: string;
  port: number;
  protocol: 'http' | 'grpc' | 'tcp';
  replicas: number;
}): void;

mesh.getService(name: string): Service | null;
mesh.deregisterService(name: string): void;

// Traffic Management
mesh.applyTrafficPolicy(service: string, policy: TrafficPolicy): void;
mesh.getTrafficPolicy(service: string): TrafficPolicy | null;

// Circuit Breaker
mesh.configureCircuitBreaker(service: string, config: {
  enabled: boolean;
  threshold: number;
  timeout: number;
  halfOpenRequests: number;
}): void;

mesh.checkCircuitBreakerStatus(service: string): 'closed' | 'open' | 'half-open';

// Load Balancing
mesh.loadBalanceRequest(service: string): string; // Returns endpoint

// Retry Policies
mesh.configureRetryPolicy(service: string, policy: {
  maxRetries: number;
  backoffMs: number;
  retryableStatusCodes: number[];
}): void;

// Statistics
mesh.getStatistics(): {
  totalServices: number;
  activeConnections: number;
  requestsPerSecond: number;
  errorRate: number;
};
```

## Common Patterns

### Distributed Cache with Locking

```typescript
const cache = new DistributedCacheManager();

if (cache.acquireLock('resource')) {
  try {
    cache.set('key', 'value');
  } finally {
    cache.releaseLock('resource');
  }
}
```

### Cluster Monitoring

```typescript
const coordinator = new ClusterCoordinator();

coordinator.addListener((event, data) => {
  if (event === 'node_unhealthy') {
    console.log('Node unhealthy:', data);
  }
});

coordinator.start();
```

### Message Processing

```typescript
const queue = new MessageQueueIntegration({ type: 'rabbitmq' });

queue.registerRoute('user.created', async (message) => {
  try {
    // Process message
    queue.acknowledge(message.id);
  } catch (error) {
    queue.nack(message.id);
  }
});
```

### Request Tracing

```typescript
const tracing = new DistributedTracing();

const traceId = tracing.startTrace();
const spanId = tracing.startSpan(traceId, 'api_call');

tracing.addTag(spanId, 'userId', 123);
tracing.addLog(spanId, 'Request started');

// ... do work ...

tracing.endSpan(spanId, 'success');
```

### Service Mesh Setup

```typescript
const mesh = new ServiceMeshIntegration();

mesh.registerService({
  name: 'api-service',
  namespace: 'production',
  port: 3000,
  protocol: 'http',
  replicas: 3,
});

mesh.applyTrafficPolicy('api-service', {
  loadBalancer: 'round-robin',
  connectionPool: {
    tcp: { maxConnections: 100 },
    http: { http1MaxPendingRequests: 100 },
  },
});

mesh.configureCircuitBreaker('api-service', {
  enabled: true,
  threshold: 0.5,
  timeout: 30000,
  halfOpenRequests: 3,
});
```

---

**All components are production-ready and fully tested.**
