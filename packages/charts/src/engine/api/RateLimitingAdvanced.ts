/**
 * Rate Limiting Advanced
 * Advanced rate limiting strategies and quota management
 */

export interface RateLimitConfig {
  strategy: 'fixed-window' | 'sliding-window' | 'token-bucket' | 'leaky-bucket';
  requestsPerWindow: number;
  windowSize: number; // milliseconds
  burstSize?: number;
}

export interface RateLimitQuota {
  userId: string;
  endpoint: string;
  limit: number;
  remaining: number;
  resetTime: number;
}

export interface RateLimitRule {
  pattern: string;
  config: RateLimitConfig;
  priority: number;
}

/**
 * RateLimitingAdvanced - Advanced rate limiting
 */
export class RateLimitingAdvanced {
  private rules: Map<string, RateLimitRule> = new Map();
  private quotas: Map<string, RateLimitQuota> = new Map();
  private tokens: Map<string, number> = new Map();
  private listeners: Set<(event: string, data: unknown) => void> = new Set();
  private defaultConfig: RateLimitConfig = {
    strategy: 'token-bucket',
    requestsPerWindow: 100,
    windowSize: 60000,
    burstSize: 10,
  };

  constructor(defaultConfig?: RateLimitConfig) {
    if (defaultConfig) {
      this.defaultConfig = defaultConfig;
    }
  }

  /**
   * Register rate limit rule
   */
  registerRule(pattern: string, config: RateLimitConfig, priority: number = 0): void {
    this.rules.set(pattern, { pattern, config, priority });
    this.emit('rule_registered', { pattern, config });
  }

  /**
   * Get rule for endpoint
   */
  getRuleForEndpoint(endpoint: string): RateLimitRule | null {
    let bestRule: RateLimitRule | null = null;
    let bestPriority = -Infinity;

    for (const rule of this.rules.values()) {
      if (this.matchPattern(rule.pattern, endpoint) && rule.priority > bestPriority) {
        bestRule = rule;
        bestPriority = rule.priority;
      }
    }

    return bestRule;
  }

  /**
   * Match pattern
   */
  private matchPattern(pattern: string, endpoint: string): boolean {
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    return regex.test(endpoint);
  }

  /**
   * Check rate limit
   */
  checkRateLimit(userId: string, endpoint: string): boolean {
    const key = `${userId}:${endpoint}`;
    const rule = this.getRuleForEndpoint(endpoint);
    const config = rule?.config || this.defaultConfig;

    switch (config.strategy) {
      case 'fixed-window':
        return this.checkFixedWindow(key, config);
      case 'sliding-window':
        return this.checkSlidingWindow(key, config);
      case 'token-bucket':
        return this.checkTokenBucket(key, config);
      case 'leaky-bucket':
        return this.checkLeakyBucket(key, config);
      default:
        return true;
    }
  }

  /**
   * Check fixed window
   */
  private checkFixedWindow(key: string, config: RateLimitConfig): boolean {
    const quota = this.quotas.get(key);
    const now = Date.now();

    if (!quota || now > quota.resetTime) {
      this.quotas.set(key, {
        userId: key.split(':')[0],
        endpoint: key.split(':')[1],
        limit: config.requestsPerWindow,
        remaining: config.requestsPerWindow - 1,
        resetTime: now + config.windowSize,
      });
      return true;
    }

    if (quota.remaining > 0) {
      quota.remaining--;
      return true;
    }

    this.emit('rate_limit_exceeded', { key });
    return false;
  }

  /**
   * Check sliding window
   */
  private checkSlidingWindow(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.windowSize;

    if (!this.tokens.has(key)) {
      this.tokens.set(key, 0);
    }

    const count = this.tokens.get(key)!;

    if (count < config.requestsPerWindow) {
      this.tokens.set(key, count + 1);
      return true;
    }

    this.emit('rate_limit_exceeded', { key });
    return false;
  }

  /**
   * Check token bucket
   */
  private checkTokenBucket(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const refillKey = `${key}:refill`;
    const tokensKey = `${key}:tokens`;

    let tokens = this.tokens.get(tokensKey) || config.requestsPerWindow;
    const lastRefill = (this.tokens.get(refillKey) as number) || now;

    // Refill tokens based on time passed
    const timePassed = now - lastRefill;
    const refillRate = config.requestsPerWindow / config.windowSize;
    const tokensToAdd = timePassed * refillRate;
    tokens = Math.min(tokens + tokensToAdd, config.burstSize || config.requestsPerWindow);

    this.tokens.set(refillKey, now);

    if (tokens >= 1) {
      this.tokens.set(tokensKey, tokens - 1);
      return true;
    }

    this.emit('rate_limit_exceeded', { key });
    return false;
  }

  /**
   * Check leaky bucket
   */
  private checkLeakyBucket(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    let bucket = this.tokens.get(key) || 0;

    // Leak from bucket
    const lastLeak = (this.tokens.get(`${key}:leak`) as number) || now;
    const timePassed = now - lastLeak;
    const leakRate = config.requestsPerWindow / config.windowSize;
    bucket = Math.max(0, bucket - leakRate * timePassed);

    this.tokens.set(`${key}:leak`, now);

    if (bucket < (config.burstSize || config.requestsPerWindow)) {
      this.tokens.set(key, bucket + 1);
      return true;
    }

    this.emit('rate_limit_exceeded', { key });
    return false;
  }

  /**
   * Get quota
   */
  getQuota(userId: string, endpoint: string): RateLimitQuota | null {
    const key = `${userId}:${endpoint}`;
    return this.quotas.get(key) ?? null;
  }

  /**
   * Reset quota
   */
  resetQuota(userId: string, endpoint: string): void {
    const key = `${userId}:${endpoint}`;
    this.quotas.delete(key);
    this.tokens.delete(key);
    this.emit('quota_reset', { userId, endpoint });
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      totalRules: this.rules.size,
      totalQuotas: this.quotas.size,
      activeTokens: this.tokens.size,
    };
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (error) {
        // Handle listener error
      }
    }
  }

  /**
   * Add listener
   */
  addListener(listener: (event: string, data: unknown) => void): void {
    this.listeners.add(listener);
  }

  /**
   * Remove listener
   */
  removeListener(listener: (event: string, data: unknown) => void): void {
    this.listeners.delete(listener);
  }
}
