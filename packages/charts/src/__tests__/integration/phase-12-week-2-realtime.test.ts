/**
 * Phase 12 Week 2 - Real-Time Capabilities Integration Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RealtimeDataStreaming } from '../../engine/realtime/RealtimeDataStreaming';
import { WebSocketIntegration } from '../../engine/realtime/WebSocketIntegration';
import { LiveDashboardUpdates } from '../../engine/realtime/LiveDashboardUpdates';
import { EventBroadcasting } from '../../engine/realtime/EventBroadcasting';
import { StreamProcessingEngine } from '../../engine/realtime/StreamProcessingEngine';

describe('Phase 12 Week 2 - Real-Time Capabilities', () => {
  describe('RealtimeDataStreaming', () => {
    let streaming: RealtimeDataStreaming<{ value: number }>;

    beforeEach(() => {
      streaming = new RealtimeDataStreaming();
    });

    it('should register data sources', () => {
      streaming.registerSource({
        id: 'source-1',
        name: 'Test Source',
        type: 'api',
        url: 'http://example.com/api',
      });

      const source = streaming.getSource('source-1');
      expect(source).toBeDefined();
      expect(source?.name).toBe('Test Source');
    });

    it('should ingest data', () => {
      streaming.registerSource({
        id: 'source-1',
        name: 'Test Source',
        type: 'api',
      });

      streaming.ingestData('source-1', { value: 42 });
      const buffered = streaming.getBufferedData('source-1');

      expect(buffered.length).toBe(1);
      expect(buffered[0].data.value).toBe(42);
    });

    it('should subscribe to data', (done) => {
      streaming.registerSource({
        id: 'source-1',
        name: 'Test Source',
        type: 'api',
      });

      streaming.subscribe('source-1', (data) => {
        expect(data.data.value).toBe(42);
        done();
      });

      streaming.ingestData('source-1', { value: 42 });
    });

    it('should handle backpressure', () => {
      streaming.registerSource({
        id: 'source-1',
        name: 'Test Source',
        type: 'api',
      });

      streaming.setBufferSize('source-1', 5);

      for (let i = 0; i < 10; i++) {
        streaming.ingestData('source-1', { value: i });
      }

      const buffered = streaming.getBufferedData('source-1');
      expect(buffered.length).toBeLessThanOrEqual(5);
    });

    it('should track metrics', () => {
      streaming.registerSource({
        id: 'source-1',
        name: 'Test Source',
        type: 'api',
      });

      streaming.ingestData('source-1', { value: 42 });
      const metrics = streaming.getMetrics('source-1');

      expect(metrics?.itemsReceived).toBe(1);
      expect(metrics?.itemsProcessed).toBe(1);
    });

    it('should get buffer statistics', () => {
      streaming.registerSource({
        id: 'source-1',
        name: 'Test Source',
        type: 'api',
      });

      streaming.ingestData('source-1', { value: 42 });
      const stats = streaming.getBufferStats('source-1');

      expect(stats?.size).toBe(1);
      expect(stats?.utilization).toBeGreaterThan(0);
    });
  });

  describe('WebSocketIntegration', () => {
    let ws: WebSocketIntegration<{ value: number }>;

    beforeEach(() => {
      ws = new WebSocketIntegration({
        url: 'ws://localhost:8080',
        reconnect: true,
        reconnectInterval: 1000,
        maxReconnectAttempts: 3,
        heartbeatInterval: 30000,
        messageTimeout: 5000,
      });
    });

    it('should have initial state', () => {
      const state = ws.getState();

      expect(state.connected).toBe(false);
      expect(state.connecting).toBe(false);
      expect(state.reconnectAttempts).toBe(0);
    });

    it('should register message handlers', () => {
      const handler = vi.fn();
      ws.on('test', handler);

      expect(ws.getHandlerCount('test')).toBe(1);
    });

    it('should register error handlers', () => {
      const handler = vi.fn();
      ws.onError(handler);

      expect(ws.getHandlerCount()).toBeGreaterThan(0);
    });

    it('should register connection handlers', () => {
      const handler = vi.fn();
      ws.onConnect(handler);

      expect(ws.getHandlerCount()).toBeGreaterThan(0);
    });

    it('should register disconnection handlers', () => {
      const handler = vi.fn();
      ws.onDisconnect(handler);

      expect(ws.getHandlerCount()).toBeGreaterThan(0);
    });

    it('should clear handlers', () => {
      ws.on('test', () => {});
      ws.on('test', () => {});

      expect(ws.getHandlerCount('test')).toBe(2);

      ws.clearHandlers('test');

      expect(ws.getHandlerCount('test')).toBe(0);
    });
  });

  describe('LiveDashboardUpdates', () => {
    let dashboard: LiveDashboardUpdates;

    beforeEach(() => {
      dashboard = new LiveDashboardUpdates();
    });

    it('should register dashboards', () => {
      dashboard.registerDashboard('dash-1', {
        id: 'dash-1',
        timestamp: new Date(),
        values: { count: 0 },
      });

      const dash = dashboard.getDashboard('dash-1');
      expect(dash).toBeDefined();
      expect(dash?.values.count).toBe(0);
    });

    it('should detect changes', (done) => {
      dashboard.registerDashboard('dash-1', {
        id: 'dash-1',
        timestamp: new Date(),
        values: { count: 0 },
      });

      dashboard.subscribe('dash-1', (update) => {
        expect(update.changes.count).toBeDefined();
        expect(update.changes.count.new).toBe(5);
        done();
      });

      dashboard.updateDashboard('dash-1', { count: 5 });
    });

    it('should batch updates', (done) => {
      dashboard.registerDashboard('dash-1', {
        id: 'dash-1',
        timestamp: new Date(),
        values: { count: 0 },
      });

      dashboard.setBatchInterval(50);

      dashboard.onBatch((batch) => {
        expect(batch.updates.length).toBeGreaterThan(0);
        done();
      });

      dashboard.updateDashboard('dash-1', { count: 1 });
      dashboard.updateDashboard('dash-1', { count: 2 });
    });

    it('should register change detectors', () => {
      dashboard.registerChangeDetector('count', (old, new_) => {
        return Math.abs((old as number) - (new_ as number)) > 10;
      });

      dashboard.registerDashboard('dash-1', {
        id: 'dash-1',
        timestamp: new Date(),
        values: { count: 0 },
      });

      let updateCount = 0;
      dashboard.subscribe('dash-1', () => {
        updateCount++;
      });

      dashboard.updateDashboard('dash-1', { count: 5 }); // No update
      dashboard.updateDashboard('dash-1', { count: 15 }); // Update

      expect(updateCount).toBe(1);
    });

    it('should get statistics', () => {
      dashboard.registerDashboard('dash-1', {
        id: 'dash-1',
        timestamp: new Date(),
        values: { count: 0 },
      });

      const stats = dashboard.getStatistics();

      expect(stats.dashboardCount).toBe(1);
      expect(stats.pendingUpdates).toBeGreaterThanOrEqual(0);
    });
  });

  describe('EventBroadcasting', () => {
    let events: EventBroadcasting<{ message: string }>;

    beforeEach(() => {
      events = new EventBroadcasting();
    });

    it('should publish events', () => {
      const eventId = events.publish('test', { message: 'hello' }, 'source-1');

      expect(eventId).toBeDefined();
      expect(eventId).toContain('event-');
    });

    it('should subscribe to events', (done) => {
      events.subscribe('test', (event) => {
        expect(event.data.message).toBe('hello');
        done();
      });

      events.publish('test', { message: 'hello' }, 'source-1');
    });

    it('should subscribe to all events', (done) => {
      events.subscribeAll((event) => {
        expect(event.type).toBe('test');
        done();
      });

      events.publish('test', { message: 'hello' }, 'source-1');
    });

    it('should maintain event history', () => {
      events.publish('test', { message: 'hello' }, 'source-1');
      events.publish('test', { message: 'world' }, 'source-1');

      const history = events.getHistory();

      expect(history.length).toBe(2);
    });

    it('should filter event history', () => {
      events.publish('test1', { message: 'hello' }, 'source-1');
      events.publish('test2', { message: 'world' }, 'source-2');

      const filtered = events.getHistory({
        types: ['test1'],
      });

      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('test1');
    });

    it('should get events by type', () => {
      events.publish('test1', { message: 'hello' }, 'source-1');
      events.publish('test1', { message: 'world' }, 'source-1');
      events.publish('test2', { message: 'foo' }, 'source-1');

      const test1Events = events.getEventsByType('test1');

      expect(test1Events.length).toBe(2);
    });

    it('should get statistics', () => {
      events.publish('test', { message: 'hello' }, 'source-1');

      const stats = events.getStatistics();

      expect(stats.totalEvents).toBe(1);
      expect(stats.subscriberCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('StreamProcessingEngine', () => {
    let engine: StreamProcessingEngine<number>;

    beforeEach(() => {
      engine = new StreamProcessingEngine();
    });

    it('should create tumbling windows', () => {
      const windowId = engine.createTumblingWindow(5);

      expect(windowId).toBeDefined();
      expect(windowId).toContain('window-');
    });

    it('should create sliding windows', () => {
      const windowId = engine.createSlidingWindow(5, 2);

      expect(windowId).toBeDefined();
    });

    it('should create session windows', () => {
      const windowId = engine.createSessionWindow(5000);

      expect(windowId).toBeDefined();
    });

    it('should add data to windows', () => {
      const windowId = engine.createTumblingWindow(3);

      engine.addToWindow(windowId, 1);
      engine.addToWindow(windowId, 2);
      const result = engine.addToWindow(windowId, 3);

      expect(result).toBeDefined();
      expect(result?.length).toBe(3);
    });

    it('should register transformers', () => {
      engine.registerTransformer('double', (x) => x * 2);

      const result = engine.transform(5, 'double');

      expect(result).toBe(10);
    });

    it('should aggregate window data', () => {
      const windowId = engine.createTumblingWindow(3);

      engine.addToWindow(windowId, 1);
      engine.addToWindow(windowId, 2);
      engine.addToWindow(windowId, 3);

      const result = engine.aggregate(windowId);

      expect(result.count).toBe(3);
      expect(result.sum).toBe(6);
      expect(result.average).toBe(2);
    });

    it('should filter streams', () => {
      const data = [1, 2, 3, 4, 5];
      const filtered = engine.filter(data, (x) => x > 2);

      expect(filtered.length).toBe(3);
      expect(filtered[0]).toBe(3);
    });

    it('should map streams', () => {
      const data = [1, 2, 3];
      const mapped = engine.map(data, (x) => x * 2);

      expect(mapped.length).toBe(3);
      expect(mapped[0]).toBe(2);
    });

    it('should reduce streams', () => {
      const data = [1, 2, 3, 4, 5];
      const result = engine.reduce(data, (acc, x) => acc + x, 0);

      expect(result).toBe(15);
    });

    it('should get window statistics', () => {
      const windowId = engine.createTumblingWindow(5);

      engine.addToWindow(windowId, 1);
      engine.addToWindow(windowId, 2);

      const stats = engine.getWindowStats(windowId);

      expect(stats?.dataCount).toBe(2);
      expect(stats?.type).toBe('tumbling');
    });
  });

  describe('Integration Tests', () => {
    it('should integrate all real-time modules', () => {
      const streaming = new RealtimeDataStreaming();
      const ws = new WebSocketIntegration({
        url: 'ws://localhost:8080',
      });
      const dashboard = new LiveDashboardUpdates();
      const events = new EventBroadcasting();
      const engine = new StreamProcessingEngine();

      expect(streaming).toBeDefined();
      expect(ws).toBeDefined();
      expect(dashboard).toBeDefined();
      expect(events).toBeDefined();
      expect(engine).toBeDefined();
    });

    it('should handle complex real-time workflows', () => {
      const streaming = new RealtimeDataStreaming<{ value: number }>();
      const engine = new StreamProcessingEngine<number>();

      // Register source
      streaming.registerSource({
        id: 'source-1',
        name: 'Test Source',
        type: 'api',
      });

      // Create window
      const windowId = engine.createTumblingWindow(3);

      // Subscribe to data
      streaming.subscribe('source-1', (data) => {
        const result = engine.addToWindow(windowId, data.data.value);

        if (result) {
          const aggregated = engine.aggregate(windowId);
          expect(aggregated.count).toBe(3);
        }
      });

      // Ingest data
      streaming.ingestData('source-1', { value: 1 });
      streaming.ingestData('source-1', { value: 2 });
      streaming.ingestData('source-1', { value: 3 });
    });
  });
});
