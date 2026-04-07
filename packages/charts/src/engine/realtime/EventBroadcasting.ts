/**
 * Event Broadcasting
 * Broadcast events to multiple subscribers
 *
 * پخش رویدادها
 * پخش رویدادها به چندین مشترک
 */

import { EventEmitter } from 'events';

export interface BroadcastEvent {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  source: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

export interface Subscriber {
  id: string;
  eventTypes: string[];
  handler: (event: BroadcastEvent) => void;
  filter?: (event: BroadcastEvent) => boolean;
  active: boolean;
}

export interface BroadcastMetrics {
  eventsBroadcasted: number;
  subscribersCount: number;
  averageDeliveryTime: number;
  failedDeliveries: number;
}

export class EventBroadcasting extends EventEmitter {
  private subscribers: Map<string, Subscriber> = new Map();
  private eventHistory: BroadcastEvent[] = [];
  private maxHistorySize: number = 1000;
  private metrics: BroadcastMetrics = {
    eventsBroadcasted: 0,
    subscribersCount: 0,
    averageDeliveryTime: 0,
    failedDeliveries: 0,
  };
  private deliveryTimes: number[] = [];

  constructor() {
    super();
  }

  /**
   * Subscribe to events
   */
  subscribe(
    subscriberId: string,
    eventTypes: string[],
    handler: (event: BroadcastEvent) => void,
    filter?: (event: BroadcastEvent) => boolean
  ): void {
    const subscriber: Subscriber = {
      id: subscriberId,
      eventTypes,
      handler,
      filter,
      active: true,
    };

    this.subscribers.set(subscriberId, subscriber);
    this.metrics.subscribersCount = this.subscribers.size;

    this.emit('subscriber:added', { subscriberId, eventTypes });
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriberId: string): void {
    this.subscribers.delete(subscriberId);
    this.metrics.subscribersCount = this.subscribers.size;

    this.emit('subscriber:removed', { subscriberId });
  }

  /**
   * Broadcast event
   */
  broadcast(type: string, data: any, source: string, priority: string = 'normal'): void {
    const event: BroadcastEvent = {
      id: `event-${Date.now()}-${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
      source,
      priority: priority as any,
    };

    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    this.metrics.eventsBroadcasted++;

    // Deliver to subscribers
    const startTime = Date.now();
    let deliveredCount = 0;

    for (const subscriber of this.subscribers.values()) {
      if (!subscriber.active) continue;

      // Check if subscriber is interested in this event type
      if (!subscriber.eventTypes.includes(type) && !subscriber.eventTypes.includes('*')) {
        continue;
      }

      // Apply filter if present
      if (subscriber.filter && !subscriber.filter(event)) {
        continue;
      }

      try {
        subscriber.handler(event);
        deliveredCount++;
      } catch (error) {
        this.metrics.failedDeliveries++;
        this.emit('delivery:failed', { subscriberId: subscriber.id, error });
      }
    }

    const deliveryTime = Date.now() - startTime;
    this.deliveryTimes.push(deliveryTime);
    if (this.deliveryTimes.length > 100) {
      this.deliveryTimes.shift();
    }

    this.metrics.averageDeliveryTime =
      this.deliveryTimes.reduce((a, b) => a + b, 0) / this.deliveryTimes.length;

    this.emit('event:broadcasted', {
      eventId: event.id,
      type,
      deliveredCount,
      deliveryTime,
    });
  }

  /**
   * Pause subscriber
   */
  pauseSubscriber(subscriberId: string): void {
    const subscriber = this.subscribers.get(subscriberId);
    if (subscriber) {
      subscriber.active = false;
      this.emit('subscriber:paused', { subscriberId });
    }
  }

  /**
   * Resume subscriber
   */
  resumeSubscriber(subscriberId: string): void {
    const subscriber = this.subscribers.get(subscriberId);
    if (subscriber) {
      subscriber.active = true;
      this.emit('subscriber:resumed', { subscriberId });
    }
  }

  /**
   * Get event history
   */
  getEventHistory(type?: string, limit: number = 100): BroadcastEvent[] {
    let history = this.eventHistory;

    if (type) {
      history = history.filter((e) => e.type === type);
    }

    return history.slice(-limit);
  }

  /**
   * Get metrics
   */
  getMetrics(): BroadcastMetrics {
    return { ...this.metrics };
  }

  /**
   * Get subscribers
   */
  getSubscribers(): Subscriber[] {
    return Array.from(this.subscribers.values());
  }

  /**
   * Get subscriber info
   */
  getSubscriber(subscriberId: string): Subscriber | null {
    return this.subscribers.get(subscriberId) || null;
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.eventHistory = [];
    this.emit('history:cleared', {});
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      eventsBroadcasted: 0,
      subscribersCount: this.subscribers.size,
      averageDeliveryTime: 0,
      failedDeliveries: 0,
    };
    this.deliveryTimes = [];
    this.emit('metrics:reset', {});
  }

  /**
   * Broadcast with priority queue
   */
  broadcastPrioritized(
    type: string,
    data: any,
    source: string,
    priority: 'low' | 'normal' | 'high' | 'critical'
  ): void {
    // In a real implementation, this would use a priority queue
    // For now, just broadcast immediately with priority
    this.broadcast(type, data, source, priority);
  }

  /**
   * Get subscribers for event type
   */
  getSubscribersForType(eventType: string): Subscriber[] {
    return Array.from(this.subscribers.values()).filter(
      (s) => s.eventTypes.includes(eventType) || s.eventTypes.includes('*')
    );
  }

  /**
   * Update subscriber filter
   */
  updateSubscriberFilter(subscriberId: string, filter: (event: BroadcastEvent) => boolean): void {
    const subscriber = this.subscribers.get(subscriberId);
    if (subscriber) {
      subscriber.filter = filter;
      this.emit('subscriber:filter-updated', { subscriberId });
    }
  }
}
