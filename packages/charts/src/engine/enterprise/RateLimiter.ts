/**
 * API Rate Limiting System
 * Limit API calls and resource usage
 */

export interface RateLimit {
  name: string;
  limit: number;
  window: number; // in milliseconds
  currentCount: number;
  resetTime: number;
}

export interface RateLimitConfig {
  name: string;
  limit: number;
  window: string; // '1minute', '1hour', '1day'
}

/**
 * Rate Limiter
 */
export class RateLimiter {
  private limits: Map<string, RateLimit> = new Map();
  private requestHistory: Map<string, number[]> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Set rate limit
   */
  public setLimit(name: string, limit: number, window: string): void {
    const windowMs = this.parseWindow(window);

    this.limits.set(name, {
      name,
      limit,
      window: windowMs,
      currentCount: 0,
      resetTime: Date.now() + windowMs,
    });

    this.emit('limit:set', { name, limit, window });
  }

  /**
   * Check if request is allowed
   */
  public isAllowed(name: string): boolean {
    const limit = this.limits.get(name);
    if (!limit) {
      return true; // No limit set
    }

    const now = Date.now();

    // Reset if window has passed
    if (now >= limit.resetTime) {
      limit.currentCount = 0;
      limit.resetTime = now + limit.window;
    }

    // Check if limit exceeded
    if (limit.currentCount >= limit.limit) {
      this.emit('limit:exceeded', { name, limit: limit.limit });
      return false;
    }

    return true;
  }

  /**
   * Record request
   */
  public recordRequest(name: string): boolean {
    if (!this.isAllowed(name)) {
      return false;
    }

    const limit = this.limits.get(name);
    if (limit) {
      limit.currentCount++;
    }

    // Track request history
    if (!this.requestHistory.has(name)) {
      this.requestHistory.set(name, []);
    }

    this.requestHistory.get(name)!.push(Date.now());

    this.emit('request:recorded', { name });

    return true;
  }

  /**
   * Get remaining requests
   */
  public getRemaining(name: string): number {
    const limit = this.limits.get(name);
    if (!limit) {
      return Infinity;
    }

    const now = Date.now();

    // Reset if window has passed
    if (now >= limit.resetTime) {
      limit.currentCount = 0;
      limit.resetTime = now + limit.window;
    }

    return Math.max(0, limit.limit - limit.currentCount);
  }

  /**
   * Get reset time
   */
  public getResetTime(name: string): number {
    const limit = this.limits.get(name);
    if (!limit) {
      return 0;
    }

    const now = Date.now();

    // Reset if window has passed
    if (now >= limit.resetTime) {
      limit.currentTime = now + limit.window;
    }

    return limit.resetTime;
  }

  /**
   * Get request count
   */
  public getRequestCount(name: string): number {
    const limit = this.limits.get(name);
    if (!limit) {
      return 0;
    }

    const now = Date.now();

    // Reset if window has passed
    if (now >= limit.resetTime) {
      limit.currentCount = 0;
      limit.resetTime = now + limit.window;
    }

    return limit.currentCount;
  }

  /**
   * Get request history
   */
  public getRequestHistory(name: string, windowMs?: number): number[] {
    const history = this.requestHistory.get(name) || [];
    const now = Date.now();
    const window = windowMs || 3600000; // Default 1 hour

    return history.filter((time) => now - time <= window);
  }

  /**
   * Get average request rate
   */
  public getAverageRate(name: string, windowMs: number = 3600000): number {
    const history = this.getRequestHistory(name, windowMs);
    if (history.length === 0) {
      return 0;
    }

    return (history.length / windowMs) * 1000; // Requests per second
  }

  /**
   * Reset limit
   */
  public resetLimit(name: string): void {
    const limit = this.limits.get(name);
    if (limit) {
      limit.currentCount = 0;
      limit.resetTime = Date.now() + limit.window;
      this.emit('limit:reset', { name });
    }
  }

  /**
   * Remove limit
   */
  public removeLimit(name: string): void {
    this.limits.delete(name);
    this.requestHistory.delete(name);
    this.emit('limit:removed', { name });
  }

  /**
   * Get all limits
   */
  public getAllLimits(): RateLimit[] {
    return Array.from(this.limits.values());
  }

  /**
   * Get statistics
   */
  public getStatistics(): Record<string, any> {
    const stats: Record<string, any> = {};

    this.limits.forEach((limit, name) => {
      const history = this.getRequestHistory(name);
      stats[name] = {
        limit: limit.limit,
        current: limit.currentCount,
        remaining: this.getRemaining(name),
        resetTime: limit.resetTime,
        averageRate: this.getAverageRate(name),
        totalRequests: history.length,
      };
    });

    return stats;
  }

  /**
   * Parse window string
   */
  private parseWindow(window: string): number {
    const match = window.match(/(\d+)(minute|hour|day)/);
    if (!match) {
      return 60000; // Default 1 minute
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'minute':
        return value * 60 * 1000;
      case 'hour':
        return value * 60 * 60 * 1000;
      case 'day':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 60000;
    }
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Destroy limiter
   */
  public destroy(): void {
    this.limits.clear();
    this.requestHistory.clear();
    this.listeners.clear();
  }
}

export default RateLimiter;
