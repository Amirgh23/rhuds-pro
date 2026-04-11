/**
 * Event Broadcasting System
 * Broadcast events to multiple subscribers with filtering and delivery guarantees
 */

export interface BroadcastEvent<T = unknown> {
  id: string;
  type: string;
  data: T;
  timestamp: Date;
  source: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

export interface EventFilter {
  types?: string[];
  sources?: string[];
  priority?: string[];
  timeRange?: { start: Date; end: Date };
}

export interface EventHistory {
  events: BroadcastEvent[];
  maxSize: number;
  overflow: number;
}

/**
 * EventBroadcasting - Event publishing and subscription
 */
export class EventBroadcasting<T = unknown> {
  private subscribers: Map<string, Set<(event: BroadcastEvent<T>) => void>> = new Map();
  private globalSubscribers: Set<(event: BroadcastEvent<T>) => void> = new Set();
  private eventHistory: EventHistory = {
    events: [],
    maxSize: 1000,
    overflow: 0,
  };
  private eventSequence: number = 0;
  private filters: Map<string, EventFilter> = new Map();

  /**
   * Subscribe to event type
   */
  subscribe(type: string, callback: (event: BroadcastEvent<T>) => void): () => void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }

    this.subscribers.get(type)!.add(callback);

    return () => {
      this.subscribers.get(type)?.delete(callback);
    };
  }

  /**
   * Subscribe to all events
   */
  subscribeAll(callback: (event: BroadcastEvent<T>) => void): () => void {
    this.globalSubscribers.add(callback);

    return () => {
      this.globalSubscribers.delete(callback);
    };
  }

  /**
   * Publish event
   */
  publish(
    type: string,
    data: T,
    source: string,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): string {
    const event: BroadcastEvent<T> = {
      id: `event-${this.eventSequence++}`,
      type,
      data,
      timestamp: new Date(),
      source,
      priority,
    };

    // Store in history
    this.addToHistory(event);

    // Notify type-specific subscribers
    const typeSubscribers = this.subscribers.get(type);
    if (typeSubscribers) {
      typeSubscribers.forEach((subscriber) => {
        try {
          subscriber(event);
        } catch (error) {
          console.error('Subscriber error:', error);
        }
      });
    }

    // Notify global subscribers
    this.globalSubscribers.forEach((subscriber) => {
      try {
        subscriber(event);
      } catch (error) {
        console.error('Global subscriber error:', error);
      }
    });

    return event.id;
  }

  /**
   * Add to history
   */
  private addToHistory(event: BroadcastEvent<T>): void {
    if (this.eventHistory.events.length >= this.eventHistory.maxSize) {
      this.eventHistory.overflow++;
      this.eventHistory.events.shift();
    }

    this.eventHistory.events.push(event);
  }

  /**
   * Get event history
   */
  getHistory(filter?: EventFilter): BroadcastEvent<T>[] {
    let events = [...this.eventHistory.events];

    if (!filter) {
      return events;
    }

    if (filter.types && filter.types.length > 0) {
      events = events.filter((e) => filter.types!.includes(e.type));
    }

    if (filter.sources && filter.sources.length > 0) {
      events = events.filter((e) => filter.sources!.includes(e.source));
    }

    if (filter.priority && filter.priority.length > 0) {
      events = events.filter((e) => filter.priority!.includes(e.priority));
    }

    if (filter.timeRange) {
      events = events.filter(
        (e) => e.timestamp >= filter.timeRange!.start && e.timestamp <= filter.timeRange!.end
      );
    }

    return events;
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.eventHistory.events = [];
    this.eventHistory.overflow = 0;
  }

  /**
   * Set history size
   */
  setHistorySize(size: number): void {
    this.eventHistory.maxSize = size;
  }

  /**
   * Get subscriber count
   */
  getSubscriberCount(type?: string): number {
    if (type) {
      return this.subscribers.get(type)?.size || 0;
    }

    let total = this.globalSubscribers.size;
    this.subscribers.forEach((subscribers) => {
      total += subscribers.size;
    });

    return total;
  }

  /**
   * Register filter
   */
  registerFilter(name: string, filter: EventFilter): void {
    this.filters.set(name, filter);
  }

  /**
   * Get filtered history
   */
  getFilteredHistory(filterName: string): BroadcastEvent<T>[] {
    const filter = this.filters.get(filterName);
    if (!filter) {
      return [];
    }

    return this.getHistory(filter);
  }

  /**
   * Get event by ID
   */
  getEventById(id: string): BroadcastEvent<T> | undefined {
    return this.eventHistory.events.find((e) => e.id === id);
  }

  /**
   * Get events by type
   */
  getEventsByType(type: string): BroadcastEvent<T>[] {
    return this.eventHistory.events.filter((e) => e.type === type);
  }

  /**
   * Get events by source
   */
  getEventsBySource(source: string): BroadcastEvent<T>[] {
    return this.eventHistory.events.filter((e) => e.source === source);
  }

  /**
   * Get events by priority
   */
  getEventsByPriority(priority: string): BroadcastEvent<T>[] {
    return this.eventHistory.events.filter((e) => e.priority === priority);
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalEvents: number;
    overflow: number;
    subscriberCount: number;
    typeCount: number;
  } {
    return {
      totalEvents: this.eventHistory.events.length,
      overflow: this.eventHistory.overflow,
      subscriberCount: this.getSubscriberCount(),
      typeCount: this.subscribers.size,
    };
  }

  /**
   * Clear subscribers
   */
  clearSubscribers(type?: string): void {
    if (type) {
      this.subscribers.delete(type);
    } else {
      this.subscribers.clear();
      this.globalSubscribers.clear();
    }
  }
}

export default EventBroadcasting;
