/**
 * Message Queue Integration
 * ادغام صف پیام برای سیستم‌های توزیع شده
 *
 * Features:
 * - RabbitMQ/Kafka support
 * - Message routing
 * - Dead letter handling
 * - Acknowledgment management
 */

import { EventEmitter } from 'events';

export interface Message<T = any> {
  id: string;
  topic: string;
  payload: T;
  timestamp: number;
  retries: number;
  maxRetries: number;
  headers: Record<string, string>;
  correlationId?: string;
}

export interface QueueConfig {
  broker: 'rabbitmq' | 'kafka';
  brokerUrl: string;
  topics: string[];
  consumerGroup: string;
  batchSize: number;
  batchTimeout: number;
}

export interface RoutingRule {
  pattern: string;
  handler: (message: Message) => Promise<void>;
  priority: number;
  retryPolicy: RetryPolicy;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelay: number;
  maxDelay: number;
}

export interface DeadLetterConfig {
  enabled: boolean;
  topic: string;
  maxAge: number;
}

export class MessageQueueIntegration extends EventEmitter {
  private config: QueueConfig;
  private routingRules: Map<string, RoutingRule>;
  private deadLetterConfig: DeadLetterConfig;
  private messageBuffer: Message[];
  private processingMessages: Set<string>;
  private deadLetterQueue: Message[];
  private batchTimer: NodeJS.Timeout | null;
  private stats: {
    published: number;
    consumed: number;
    failed: number;
    deadLettered: number;
  };

  constructor(config: QueueConfig, deadLetterConfig?: DeadLetterConfig) {
    super();
    this.config = config;
    this.routingRules = new Map();
    this.deadLetterConfig = deadLetterConfig || {
      enabled: true,
      topic: 'dead-letter-queue',
      maxAge: 86400000, // 24 hours
    };
    this.messageBuffer = [];
    this.processingMessages = new Set();
    this.deadLetterQueue = [];
    this.batchTimer = null;
    this.stats = {
      published: 0,
      consumed: 0,
      failed: 0,
      deadLettered: 0,
    };

    this.initialize();
  }

  private initialize(): void {
    this.connectToBroker();
    this.startBatchProcessor();
    this.emit('initialized', { broker: this.config.broker });
  }

  /**
   * Connect to message broker
   */
  private connectToBroker(): void {
    // Simulate broker connection
    this.emit('connected', {
      broker: this.config.broker,
      url: this.config.brokerUrl,
    });
  }

  /**
   * Register routing rule
   */
  public registerRoute(
    pattern: string,
    handler: (message: Message) => Promise<void>,
    priority: number = 0,
    retryPolicy?: RetryPolicy
  ): void {
    const rule: RoutingRule = {
      pattern,
      handler,
      priority,
      retryPolicy: retryPolicy || {
        maxRetries: 3,
        backoffMultiplier: 2,
        initialDelay: 1000,
        maxDelay: 30000,
      },
    };

    this.routingRules.set(pattern, rule);
    this.emit('route-registered', { pattern, priority });
  }

  /**
   * Publish message
   */
  public async publish<T>(
    topic: string,
    payload: T,
    headers?: Record<string, string>,
    correlationId?: string
  ): Promise<string> {
    const messageId = this.generateMessageId();
    const message: Message<T> = {
      id: messageId,
      topic,
      payload,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3,
      headers: headers || {},
      correlationId,
    };

    this.messageBuffer.push(message);
    this.stats.published++;

    this.emit('message-published', {
      messageId,
      topic,
      timestamp: message.timestamp,
    });

    return messageId;
  }

  /**
   * Subscribe to topic
   */
  public subscribe(topic: string): void {
    // Simulate subscription
    this.emit('subscribed', { topic });
  }

  /**
   * Unsubscribe from topic
   */
  public unsubscribe(topic: string): void {
    this.emit('unsubscribed', { topic });
  }

  /**
   * Start batch processor
   */
  private startBatchProcessor(): void {
    this.batchTimer = setInterval(() => {
      this.processBatch();
    }, this.config.batchTimeout);
  }

  /**
   * Process batch of messages
   */
  private async processBatch(): Promise<void> {
    if (this.messageBuffer.length === 0) {
      return;
    }

    const batch = this.messageBuffer.splice(
      0,
      Math.min(this.config.batchSize, this.messageBuffer.length)
    );

    for (const message of batch) {
      this.processMessage(message).catch((err) => {
        this.emit('batch-processing-error', { error: err.message });
      });
    }
  }

  /**
   * Process individual message
   */
  private async processMessage(message: Message): Promise<void> {
    if (this.processingMessages.has(message.id)) {
      return;
    }

    this.processingMessages.add(message.id);

    try {
      const rule = this.findMatchingRoute(message.topic);

      if (!rule) {
        throw new Error(`No route found for topic: ${message.topic}`);
      }

      await rule.handler(message);
      this.stats.consumed++;

      this.emit('message-processed', {
        messageId: message.id,
        topic: message.topic,
      });
    } catch (error) {
      await this.handleMessageError(message, error as Error);
    } finally {
      this.processingMessages.delete(message.id);
    }
  }

  /**
   * Find matching route for topic
   */
  private findMatchingRoute(topic: string): RoutingRule | undefined {
    const rules = Array.from(this.routingRules.values())
      .filter((rule) => this.matchPattern(rule.pattern, topic))
      .sort((a, b) => b.priority - a.priority);

    return rules[0];
  }

  /**
   * Match pattern against topic
   */
  private matchPattern(pattern: string, topic: string): boolean {
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    return regex.test(topic);
  }

  /**
   * Handle message error
   */
  private async handleMessageError(message: Message, error: Error): Promise<void> {
    const rule = this.findMatchingRoute(message.topic);
    const retryPolicy = rule?.retryPolicy || {
      maxRetries: 3,
      backoffMultiplier: 2,
      initialDelay: 1000,
      maxDelay: 30000,
    };

    if (message.retries < retryPolicy.maxRetries) {
      message.retries++;
      const delay = Math.min(
        retryPolicy.initialDelay * Math.pow(retryPolicy.backoffMultiplier, message.retries - 1),
        retryPolicy.maxDelay
      );

      setTimeout(() => {
        this.messageBuffer.push(message);
      }, delay);

      this.emit('message-retry', {
        messageId: message.id,
        attempt: message.retries,
        delay,
      });
    } else {
      await this.sendToDeadLetter(message, error);
    }

    this.stats.failed++;
  }

  /**
   * Send message to dead letter queue
   */
  private async sendToDeadLetter(message: Message, error: Error): Promise<void> {
    if (!this.deadLetterConfig.enabled) {
      return;
    }

    const dlMessage: Message = {
      ...message,
      topic: this.deadLetterConfig.topic,
      headers: {
        ...message.headers,
        'x-original-topic': message.topic,
        'x-error': error.message,
        'x-dead-lettered-at': new Date().toISOString(),
      },
    };

    this.deadLetterQueue.push(dlMessage);
    this.stats.deadLettered++;

    this.emit('message-dead-lettered', {
      messageId: message.id,
      originalTopic: message.topic,
      error: error.message,
    });
  }

  /**
   * Get dead letter messages
   */
  public getDeadLetterMessages(): Message[] {
    const now = Date.now();
    return this.deadLetterQueue.filter((msg) => now - msg.timestamp < this.deadLetterConfig.maxAge);
  }

  /**
   * Requeue dead letter message
   */
  public async requeueDeadLetter(messageId: string): Promise<boolean> {
    const index = this.deadLetterQueue.findIndex((msg) => msg.id === messageId);

    if (index === -1) {
      return false;
    }

    const message = this.deadLetterQueue.splice(index, 1)[0];
    message.topic = message.headers['x-original-topic'] || message.topic;
    message.retries = 0;

    this.messageBuffer.push(message);
    this.emit('dead-letter-requeued', { messageId });

    return true;
  }

  /**
   * Acknowledge message
   */
  public async acknowledge(messageId: string): Promise<void> {
    this.emit('message-acknowledged', { messageId });
  }

  /**
   * Negative acknowledge message
   */
  public async nack(messageId: string): Promise<void> {
    this.emit('message-nacked', { messageId });
  }

  /**
   * Generate message ID
   */
  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get queue statistics
   */
  public getStats() {
    return {
      ...this.stats,
      bufferSize: this.messageBuffer.length,
      processingCount: this.processingMessages.size,
      deadLetterSize: this.deadLetterQueue.length,
      routeCount: this.routingRules.size,
    };
  }

  /**
   * Shutdown queue
   */
  public shutdown(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }

    this.emit('shutdown', { timestamp: Date.now() });
  }
}
