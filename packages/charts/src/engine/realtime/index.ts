/**
 * Real-Time Module
 * Real-time data streaming, WebSocket integration, and live updates
 */

export { RealtimeDataStreaming } from './RealtimeDataStreaming';
export type {
  StreamSource,
  StreamData,
  StreamBuffer,
  StreamMetrics,
} from './RealtimeDataStreaming';

export { WebSocketIntegration } from './WebSocketIntegration';
export type { WebSocketConfig, WebSocketMessage, ConnectionState } from './WebSocketIntegration';

export { LiveDashboardUpdates } from './LiveDashboardUpdates';
export type { DashboardData, DashboardUpdate, UpdateBatch } from './LiveDashboardUpdates';

export { EventBroadcasting } from './EventBroadcasting';
export type { BroadcastEvent, EventFilter, EventHistory } from './EventBroadcasting';

export { StreamProcessingEngine } from './StreamProcessingEngine';
export type { StreamWindow, AggregationResult, JoinResult } from './StreamProcessingEngine';
