/**
 * Webhook Manager
 * Register and trigger webhooks for events
 */

export interface Webhook {
  id: string;
  event: string;
  url: string;
  active: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  failureCount: number;
  retryCount: number;
}

export interface WebhookPayload {
  event: string;
  timestamp: Date;
  data: any;
}

/**
 * Webhook Manager
 */
export class WebhookManager {
  private webhooks: Map<string, Webhook[]> = new Map();
  private listeners: Map<string, Function[]> = new Map();
  private maxRetries: number = 3;

  /**
   * Register webhook
   */
  public register(event: string, url: string): Webhook {
    const webhook: Webhook = {
      id: this.generateId(),
      event,
      url,
      active: true,
      createdAt: new Date(),
      failureCount: 0,
      retryCount: 0,
    };

    if (!this.webhooks.has(event)) {
      this.webhooks.set(event, []);
    }

    this.webhooks.get(event)!.push(webhook);
    this.emit('webhook:registered', { event, url });

    return webhook;
  }

  /**
   * Unregister webhook
   */
  public unregister(webhookId: string): boolean {
    for (const [event, webhooks] of this.webhooks.entries()) {
      const index = webhooks.findIndex((w) => w.id === webhookId);
      if (index > -1) {
        webhooks.splice(index, 1);
        this.emit('webhook:unregistered', { webhookId, event });
        return true;
      }
    }
    return false;
  }

  /**
   * Trigger webhook
   */
  public async trigger(event: string, data: any): Promise<void> {
    const webhooks = this.webhooks.get(event) || [];

    const payload: WebhookPayload = {
      event,
      timestamp: new Date(),
      data,
    };

    for (const webhook of webhooks) {
      if (!webhook.active) {
        continue;
      }

      await this.sendWebhook(webhook, payload);
    }

    this.emit('webhooks:triggered', { event, count: webhooks.length });
  }

  /**
   * Send webhook
   */
  private async sendWebhook(webhook: Webhook, payload: WebhookPayload): Promise<void> {
    let retries = 0;

    while (retries <= this.maxRetries) {
      try {
        // Simulate HTTP request
        const response = await this.makeRequest(webhook.url, payload);

        if (response.ok) {
          webhook.lastTriggered = new Date();
          webhook.failureCount = 0;
          webhook.retryCount = 0;
          this.emit('webhook:success', { webhookId: webhook.id, event: webhook.event });
          return;
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        retries++;
        webhook.retryCount = retries;

        if (retries > this.maxRetries) {
          webhook.failureCount++;
          this.emit('webhook:failed', {
            webhookId: webhook.id,
            event: webhook.event,
            error: String(error),
          });
        } else {
          // Exponential backoff
          await this.delay(Math.pow(2, retries) * 1000);
        }
      }
    }
  }

  /**
   * Make HTTP request
   */
  private async makeRequest(url: string, payload: WebhookPayload): Promise<Response> {
    // In a real implementation, use fetch or axios
    // For now, simulate the request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: Math.random() > 0.1, // 90% success rate
          status: Math.random() > 0.1 ? 200 : 500,
        } as Response);
      }, 100);
    });
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get webhooks for event
   */
  public getWebhooks(event: string): Webhook[] {
    return this.webhooks.get(event) || [];
  }

  /**
   * Get all webhooks
   */
  public getAllWebhooks(): Webhook[] {
    const all: Webhook[] = [];
    this.webhooks.forEach((webhooks) => {
      all.push(...webhooks);
    });
    return all;
  }

  /**
   * Update webhook
   */
  public updateWebhook(webhookId: string, updates: Partial<Webhook>): Webhook | undefined {
    for (const webhooks of this.webhooks.values()) {
      const webhook = webhooks.find((w) => w.id === webhookId);
      if (webhook) {
        Object.assign(webhook, updates);
        this.emit('webhook:updated', { webhookId });
        return webhook;
      }
    }
    return undefined;
  }

  /**
   * Disable webhook
   */
  public disableWebhook(webhookId: string): boolean {
    const webhook = this.updateWebhook(webhookId, { active: false });
    if (webhook) {
      this.emit('webhook:disabled', { webhookId });
      return true;
    }
    return false;
  }

  /**
   * Enable webhook
   */
  public enableWebhook(webhookId: string): boolean {
    const webhook = this.updateWebhook(webhookId, { active: true });
    if (webhook) {
      this.emit('webhook:enabled', { webhookId });
      return true;
    }
    return false;
  }

  /**
   * Get webhook statistics
   */
  public getStatistics(): Record<string, any> {
    const stats: Record<string, any> = {
      totalWebhooks: 0,
      activeWebhooks: 0,
      failedWebhooks: 0,
      eventCounts: {},
    };

    this.webhooks.forEach((webhooks, event) => {
      stats.totalWebhooks += webhooks.length;
      stats.activeWebhooks += webhooks.filter((w) => w.active).length;
      stats.failedWebhooks += webhooks.filter((w) => w.failureCount > 0).length;
      stats.eventCounts[event] = webhooks.length;
    });

    return stats;
  }

  /**
   * Generate ID
   */
  private generateId(): string {
    return `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
   * Destroy manager
   */
  public destroy(): void {
    this.webhooks.clear();
    this.listeners.clear();
  }
}

export default WebhookManager;
