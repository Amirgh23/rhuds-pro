/**
 * Distributed Systems Module
 * Clustering, caching, messaging, tracing, and service mesh
 */

export { DistributedCacheManager } from './DistributedCacheManager';
export type {
  CacheNode,
  CacheEntry,
  ReplicationConfig,
  InvalidationStrategy,
} from './DistributedCacheManager';

export { ClusterCoordinator } from './ClusterCoordinator';
export type { ClusterNode, ClusterState, ConsensusConfig } from './ClusterCoordinator';

export { MessageQueueIntegration } from './MessageQueueIntegration';
export type {
  Message,
  QueueConfig,
  RoutingRule,
  DeadLetterMessage,
} from './MessageQueueIntegration';

export { DistributedTracing } from './DistributedTracing';
export type { Span, Trace, TracingConfig } from './DistributedTracing';

export { ServiceMeshIntegration } from './ServiceMeshIntegration';
export type {
  ServiceConfig,
  TrafficPolicy,
  CircuitBreakerConfig,
  RetryPolicy,
} from './ServiceMeshIntegration';
