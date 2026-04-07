/**
 * Webhook & Event System
 * سیستم وبهوک و رویداد برای ارتباط بین سیستم‌ها
 *
 * Features:
 * - Webhook management
 * - Event routing
 * - Retry logic
 * - Event filtering
 */

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  retryPolicy: RetryPolicy;
  headers?: Record<string, string>;
  createdAt: number;
}

export interface RetryPolicy {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface WebhookEvent {
  id: string;
  type: string;
  timestamp: number;
  data: Record<string, any>;
  source: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  eventId: string;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempts: number;
  lastAttempt?: number;
  nextRetry?: number;
  response?: string;
}

export class WebhookEventSystem {
  private webhooks: Map<string, Webhook>;
  private events: Map<string, WebhookEvent>;
  private deliveries: Map<string, WebhookDelivery>;
  private stats: {
    webhooksCreated: number;
    eventsPublished: number;
    deliveriesSuccessful: number;
    deliveriesFailed: number;
  };

  constructor() {
    this.webhooks = new Map();
    this.events = new Map();
    this.deliveries = new Map();
    this.stats = {
      webhooksCreated: 0,
      eventsPublished: 0,
      deliveriesSuccessful: 0,
      deliveriesFailed: 0,
    };
  }

  /**
   * Register webhook
   */
  public registerWebhook(url: string, events: string[], retryPolicy?: RetryPolicy): string {
    const webhookId = `webhook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const webhook: Webhook = {
      id: webhookId,
      url,
      events,
      active: true,
      retryPolicy: retryPolicy || {
        maxRetries: 5,
        initialDelay: 1000,
        maxDelay: 60000,
        backoffMultiplier: 2,
      },
      createdAt: Date.now(),
    };

    this.webhooks.set(webhookId, webhook);
    this.stats.webhooksCreated++;

    return webhookId;
  }

  /**
   * Publish event
   */
  public publishEvent(type: string, data: Record<string, any>, source: string = 'system'): string {
    const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const event: WebhookEvent = {
      id: eventId,
      type,
      timestamp: Date.now(),
      data,
      source,
    };

    this.events.set(eventId, event);
    this.stats.eventsPublished++;

    // Trigger deliveries
    this.triggerDeliveries(event);

    return eventId;
  }

  /**
   * Trigger deliveries
   */
  private triggerDeliveries(event: WebhookEvent): void {
    for (const webhook of this.webhooks.values()) {
      if (!webhook.active) continue;

      // Check if webhook is interested in this event
      if (!webhook.events.includes(event.type) && !webhook.events.includes('*')) {
        continue;
      }

      // Create delivery
      const deliveryId = `delivery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const delivery: WebhookDelivery = {
        id: deliveryId,
        webhookId: webhook.id,
        eventId: event.id,
        status: 'pending',
        attempts: 0,
      };

      this.deliveries.set(deliveryId, delivery);

      // Attempt delivery
      this.attemptDelivery(delivery, webhook, event);
    }
  }

  /**
   * Attempt delivery
   */
  private async attemptDelivery(
    delivery: WebhookDelivery,
    webhook: Webhook,
    event: WebhookEvent
  ): Promise<void> {
    delivery.attempts++;
    delivery.lastAttempt = Date.now();

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...webhook.headers,
        },
        body: JSON.stringify(event),
      });

      if (response.ok) {
        delivery.status = 'success';
        this.stats.deliveriesSuccessful++;
      } else {
        this.scheduleRetry(delivery, webhook);
      }

      delivery.response = await response.text();
    } catch (error) {
      this.scheduleRetry(delivery, webhook);
    }
  }

  /**
   * Schedule retry
   */
  private scheduleRetry(delivery: WebhookDelivery, webhook: Webhook): void {
    if (delivery.attempts >= webhook.retryPolicy.maxRetries) {
      delivery.status = 'failed';
      this.stats.deliveriesFailed++;
      return;
    }

    delivery.status = 'retrying';

    // Calculate delay
    const delay = Math.min(
      webhook.retryPolicy.initialDelay *
        Math.pow(webhook.retryPolicy.backoffMultiplier, delivery.attempts - 1),
      webhook.retryPolicy.maxDelay
    );

    delivery.nextRetry = Date.now() + delay;

    // Schedule retry
    setTimeout(() => {
      const event = this.events.get(delivery.eventId);
      if (event) {
        this.attemptDelivery(delivery, webhook, event);
      }
    }, delay);
  }

  /**
   * Get webhook
   */
  public getWebhook(webhookId: string): Webhook | undefined {
    return this.webhooks.get(webhookId);
  }

  /**
   * Update webhook
   */
  public updateWebhook(webhookId: string, updates: Partial<Webhook>): boolean {
    const webhook = this.webhooks.get(webhookId);
    if (!webhook) return false;

    Object.assign(webhook, updates);
    return true;
  }

  /**
   * Delete webhook
   */
  public deleteWebhook(webhookId: string): boolean {
    return this.webhooks.delete(webhookId);
  }

  /**
   * Get deliveries
   */
  public getDeliveries(webhookId: string, limit: number = 10): WebhookDelivery[] {
    return Array.from(this.deliveries.values())
      .filter((d) => d.webhookId === webhookId)
      .slice(-limit);
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      totalWebhooks: this.webhooks.size,
      totalEvents: this.events.size,
      totalDeliveries: this.deliveries.size,
      activeWebhooks: Array.from(this.webhooks.values()).filter((w) => w.active).length,
    };
  }
}
