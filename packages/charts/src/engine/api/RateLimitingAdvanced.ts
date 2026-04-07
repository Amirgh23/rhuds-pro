/**
 * Rate Limiting Advanced
 * محدودیت نرخ پیشرفته برای کنترل ترافیک
 *
 * Features:
 * - Token bucket algorithm
 * - Sliding window
 * - Per-user limits
 * - Dynamic adjustment
 */

import { EventEmitter } from 'events';

export interface RateLimitConfig {
  algorithm: 'token-bucket' | 'sliding-window' | 'fixed-window';
  requestsPerSecond: number;
  burstSize: number;
  windowSize: number;
}

export interface UserLimit {
  userId: string;
  limit: number;
  remaining: number;
  resetTime: number;
  tokens?: number;
  lastRefill?: number;
}

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export interface DynamicLimitRule {
  condition: (metrics: any) => boolean;
  newLimit: number;
  duration: number;
}

export class RateLimitingAdvanced extends EventEmitter {
  private config: RateLimitConfig;
  private userLimits: Map<string, UserLimit>;
  private globalTokens: number;
  private lastRefill: number;
  private dynamicRules: DynamicLimitRule[];
  private stats: {
    requestsAllowed: number;
    requestsBlocked: number;
    limitExceeded: number;
  };

  constructor(config: RateLimitConfig) {
    super();
    this.config = config;
    this.userLimits = new Map();
    this.globalTokens = config.burstSize;
    this.lastRefill = Date.now();
    this.dynamicRules = [];
    this.stats = {
      requestsAllowed: 0,
      requestsBlocked: 0,
      limitExceeded: 0,
    };

    this.initialize();
  }

  private initialize(): void {
    this.startRefillTimer();
    this.emit('initialized', { algorithm: this.config.algorithm });
  }

  /**
   * Check rate limit
   */
  public checkLimit(userId: string, endpoint?: string): RateLimitStatus {
    switch (this.config.algorithm) {
      case 'token-bucket':
        return this.checkTokenBucket(userId);
      case 'sliding-window':
        return this.checkSlidingWindow(userId);
      case 'fixed-window':
        return this.checkFixedWindow(userId);
      default:
        return this.checkTokenBucket(userId);
    }
  }

  /**
   * Check token bucket algorithm
   */
  private checkTokenBucket(userId: string): RateLimitStatus {
    const now = Date.now();
    let userLimit = this.userLimits.get(userId);

    if (!userLimit) {
      userLimit = {
        userId,
        limit: this.config.requestsPerSecond,
        remaining: this.config.requestsPerSecond,
        resetTime: now + 1000,
        tokens: this.config.burstSize,
        lastRefill: now,
      };
      this.userLimits.set(userId, userLimit);
    }

    // Refill tokens
    const timePassed = (now - (userLimit.lastRefill || now)) / 1000;
    const tokensToAdd = timePassed * this.config.requestsPerSecond;
    userLimit.tokens = Math.min(this.config.burstSize, (userLimit.tokens || 0) + tokensToAdd);
    userLimit.lastRefill = now;

    if (userLimit.tokens >= 1) {
      userLimit.tokens--;
      userLimit.remaining--;
      this.stats.requestsAllowed++;

      this.emit('request-allowed', { userId, remaining: userLimit.remaining });

      return {
        allowed: true,
        remaining: Math.floor(userLimit.remaining),
        resetTime: userLimit.resetTime,
      };
    } else {
      this.stats.requestsBlocked++;
      this.stats.limitExceeded++;

      const retryAfter = Math.ceil((1 - userLimit.tokens) / this.config.requestsPerSecond);

      this.emit('request-blocked', { userId, retryAfter });

      return {
        allowed: false,
        remaining: 0,
        resetTime: userLimit.resetTime,
        retryAfter,
      };
    }
  }

  /**
   * Check sliding window algorithm
   */
  private checkSlidingWindow(userId: string): RateLimitStatus {
    const now = Date.now();
    let userLimit = this.userLimits.get(userId);

    if (!userLimit) {
      userLimit = {
        userId,
        limit: this.config.requestsPerSecond,
        remaining: this.config.requestsPerSecond,
        resetTime: now + this.config.windowSize,
      };
      this.userLimits.set(userId, userLimit);
    }

    // Check if window has expired
    if (now > userLimit.resetTime) {
      userLimit.remaining = this.config.requestsPerSecond;
      userLimit.resetTime = now + this.config.windowSize;
    }

    if (userLimit.remaining > 0) {
      userLimit.remaining--;
      this.stats.requestsAllowed++;

      this.emit('request-allowed', { userId, remaining: userLimit.remaining });

      return {
        allowed: true,
        remaining: userLimit.remaining,
        resetTime: userLimit.resetTime,
      };
    } else {
      this.stats.requestsBlocked++;
      this.stats.limitExceeded++;

      const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);

      this.emit('request-blocked', { userId, retryAfter });

      return {
        allowed: false,
        remaining: 0,
        resetTime: userLimit.resetTime,
        retryAfter,
      };
    }
  }

  /**
   * Check fixed window algorithm
   */
  private checkFixedWindow(userId: string): RateLimitStatus {
    const now = Date.now();
    const windowStart = Math.floor(now / this.config.windowSize) * this.config.windowSize;
    const windowEnd = windowStart + this.config.windowSize;

    let userLimit = this.userLimits.get(userId);

    if (!userLimit || userLimit.resetTime !== windowEnd) {
      userLimit = {
        userId,
        limit: this.config.requestsPerSecond,
        remaining: this.config.requestsPerSecond,
        resetTime: windowEnd,
      };
      this.userLimits.set(userId, userLimit);
    }

    if (userLimit.remaining > 0) {
      userLimit.remaining--;
      this.stats.requestsAllowed++;

      this.emit('request-allowed', { userId, remaining: userLimit.remaining });

      return {
        allowed: true,
        remaining: userLimit.remaining,
        resetTime: userLimit.resetTime,
      };
    } else {
      this.stats.requestsBlocked++;
      this.stats.limitExceeded++;

      const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);

      this.emit('request-blocked', { userId, retryAfter });

      return {
        allowed: false,
        remaining: 0,
        resetTime: userLimit.resetTime,
        retryAfter,
      };
    }
  }

  /**
   * Add dynamic limit rule
   */
  public addDynamicRule(rule: DynamicLimitRule): void {
    this.dynamicRules.push(rule);
    this.emit('dynamic-rule-added', { rules: this.dynamicRules.length });
  }

  /**
   * Set user limit
   */
  public setUserLimit(userId: string, limit: number): void {
    const userLimit = this.userLimits.get(userId);

    if (userLimit) {
      userLimit.limit = limit;
      userLimit.remaining = limit;
    }

    this.emit('user-limit-set', { userId, limit });
  }

  /**
   * Get user limit
   */
  public getUserLimit(userId: string): UserLimit | undefined {
    return this.userLimits.get(userId);
  }

  /**
   * Reset user limit
   */
  public resetUserLimit(userId: string): void {
    const userLimit = this.userLimits.get(userId);

    if (userLimit) {
      userLimit.remaining = userLimit.limit;
      userLimit.resetTime = Date.now() + this.config.windowSize;

      if (this.config.algorithm === 'token-bucket') {
        userLimit.tokens = this.config.burstSize;
      }
    }

    this.emit('user-limit-reset', { userId });
  }

  /**
   * Start refill timer
   */
  private startRefillTimer(): void {
    setInterval(() => {
      this.refillGlobalTokens();
    }, 1000 / this.config.requestsPerSecond);
  }

  /**
   * Refill global tokens
   */
  private refillGlobalTokens(): void {
    this.globalTokens = Math.min(this.config.burstSize, this.globalTokens + 1);
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      allowRate:
        this.stats.requestsAllowed / (this.stats.requestsAllowed + this.stats.requestsBlocked) || 0,
      activeUsers: this.userLimits.size,
      globalTokens: this.globalTokens,
    };
  }

  /**
   * Get all user limits
   */
  public getAllUserLimits(): UserLimit[] {
    return Array.from(this.userLimits.values());
  }

  /**
   * Clear expired limits
   */
  public clearExpiredLimits(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [userId, limit] of this.userLimits) {
      if (limit.resetTime < now) {
        toDelete.push(userId);
      }
    }

    for (const userId of toDelete) {
      this.userLimits.delete(userId);
    }

    this.emit('expired-limits-cleared', { count: toDelete.length });
  }
}
