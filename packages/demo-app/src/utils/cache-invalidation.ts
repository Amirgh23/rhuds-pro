/**
 * Cache Invalidation Utilities
 * Implements smart cache invalidation strategies
 */

export interface InvalidationRule {
  id: string;
  pattern: RegExp | string;
  ttl?: number;
  priority?: number;
  enabled?: boolean;
}

export interface InvalidationEvent {
  type: 'manual' | 'time-based' | 'event-based' | 'pattern-based';
  timestamp: number;
  pattern?: string;
  count?: number;
  reason?: string;
}

/**
 * Cache invalidation manager
 */
export class CacheInvalidationManager {
  private rules: Map<string, InvalidationRule> = new Map();
  private events: InvalidationEvent[] = [];
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private listeners: Set<(event: InvalidationEvent) => void> = new Set();

  /**
   * Add invalidation rule
   */
  addRule(rule: InvalidationRule): void {
    this.rules.set(rule.id, {
      ...rule,
      enabled: rule.enabled !== false,
    });

    // Setup time-based invalidation if TTL is specified
    if (rule.ttl) {
      this.setupTimeBasedInvalidation(rule);
    }
  }

  /**
   * Remove invalidation rule
   */
  removeRule(id: string): boolean {
    const removed = this.rules.delete(id);
    if (removed && this.timers.has(id)) {
      clearTimeout(this.timers.get(id)!);
      this.timers.delete(id);
    }
    return removed;
  }

  /**
   * Get invalidation rule
   */
  getRule(id: string): InvalidationRule | undefined {
    return this.rules.get(id);
  }

  /**
   * Get all rules
   */
  getAllRules(): InvalidationRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Setup time-based invalidation
   */
  private setupTimeBasedInvalidation(rule: InvalidationRule): void {
    if (!rule.ttl) return;

    const timer = setTimeout(() => {
      this.invalidateByRule(rule.id);
      // Re-setup timer for recurring invalidation
      this.setupTimeBasedInvalidation(rule);
    }, rule.ttl * 1000);

    this.timers.set(rule.id, timer);
  }

  /**
   * Invalidate by rule
   */
  invalidateByRule(ruleId: string): number {
    const rule = this.getRule(ruleId);
    if (!rule || !rule.enabled) return 0;

    const pattern = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern;

    const count = this.invalidateByPattern(pattern);

    this.recordEvent({
      type: 'pattern-based',
      timestamp: Date.now(),
      pattern: rule.pattern.toString(),
      count,
      reason: `Rule: ${ruleId}`,
    });

    return count;
  }

  /**
   * Invalidate by pattern
   */
  invalidateByPattern(pattern: RegExp): number {
    // This would be implemented in the cache manager
    // For now, we just record the event
    this.recordEvent({
      type: 'pattern-based',
      timestamp: Date.now(),
      pattern: pattern.toString(),
    });

    return 0;
  }

  /**
   * Invalidate by prefix
   */
  invalidateByPrefix(prefix: string): number {
    const pattern = new RegExp(`^${prefix}`);
    return this.invalidateByPattern(pattern);
  }

  /**
   * Manual invalidation
   */
  invalidateManual(pattern: string | RegExp, reason?: string): number {
    const regexPattern = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    this.recordEvent({
      type: 'manual',
      timestamp: Date.now(),
      pattern: regexPattern.toString(),
      reason,
    });

    return 0;
  }

  /**
   * Record invalidation event
   */
  recordEvent(event: InvalidationEvent): void {
    this.events.push(event);

    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events.shift();
    }

    // Notify listeners
    this.listeners.forEach((listener) => listener(event));
  }

  /**
   * Get invalidation events
   */
  getEvents(limit: number = 10): InvalidationEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Clear events
   */
  clearEvents(): void {
    this.events = [];
  }

  /**
   * Subscribe to invalidation events
   */
  subscribe(listener: (event: InvalidationEvent) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get invalidation statistics
   */
  getStats(): {
    totalRules: number;
    enabledRules: number;
    totalEvents: number;
    eventsByType: Record<string, number>;
  } {
    const rules = this.getAllRules();
    const enabledRules = rules.filter((r) => r.enabled).length;

    const eventsByType: Record<string, number> = {
      manual: 0,
      'time-based': 0,
      'event-based': 0,
      'pattern-based': 0,
    };

    this.events.forEach((event) => {
      eventsByType[event.type]++;
    });

    return {
      totalRules: rules.length,
      enabledRules,
      totalEvents: this.events.length,
      eventsByType,
    };
  }

  /**
   * Clear all rules and timers
   */
  clear(): void {
    this.rules.clear();
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.events = [];
  }
}

/**
 * Global cache invalidation manager instance
 */
export const cacheInvalidationManager = new CacheInvalidationManager();

/**
 * Setup default invalidation rules
 */
export function setupDefaultInvalidationRules(): void {
  // Invalidate API cache every 5 minutes
  cacheInvalidationManager.addRule({
    id: 'api-cache-invalidation',
    pattern: '^/api/',
    ttl: 300,
    priority: 1,
  });

  // Invalidate HTML cache every 1 hour
  cacheInvalidationManager.addRule({
    id: 'html-cache-invalidation',
    pattern: '\\.html$',
    ttl: 3600,
    priority: 2,
  });

  // Invalidate image cache every 24 hours
  cacheInvalidationManager.addRule({
    id: 'image-cache-invalidation',
    pattern: '\\.(png|jpg|jpeg|gif|webp|svg)$',
    ttl: 86400,
    priority: 3,
  });
}

/**
 * Version-based cache invalidation
 */
export class VersionBasedInvalidation {
  private version: string;
  private previousVersion: string | null = null;

  constructor(initialVersion: string) {
    this.version = initialVersion;
  }

  /**
   * Update version
   */
  updateVersion(newVersion: string): boolean {
    if (newVersion === this.version) return false;

    this.previousVersion = this.version;
    this.version = newVersion;

    // Invalidate all caches on version change
    cacheInvalidationManager.invalidateManual(
      '.*',
      `Version changed from ${this.previousVersion} to ${newVersion}`
    );

    return true;
  }

  /**
   * Get current version
   */
  getVersion(): string {
    return this.version;
  }

  /**
   * Get previous version
   */
  getPreviousVersion(): string | null {
    return this.previousVersion;
  }
}

/**
 * Event-based cache invalidation
 */
export class EventBasedInvalidation<T = unknown> {
  private eventHandlers: Map<string, Set<(data?: T) => void>> = new Map();

  /**
   * Register event handler
   */
  on(event: string, handler: (data?: T) => void): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }

    this.eventHandlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  /**
   * Emit event
   */
  emit(event: string, data?: T): void {
    const handlers = this.eventHandlers.get(event);
    if (!handlers) return;

    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });

    // Record invalidation event
    cacheInvalidationManager.recordEvent({
      type: 'event-based',
      timestamp: Date.now(),
      reason: `Event: ${event}`,
    });
  }

  /**
   * Remove event handler
   */
  off(event: string, handler: (data?: T) => void): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.eventHandlers.clear();
  }
}

/**
 * Global event-based invalidation instance
 */
export const eventBasedInvalidation = new EventBasedInvalidation<unknown>();

export default cacheInvalidationManager;
