/**
 * Message Queue Integration
 * RabbitMQ/Kafka support with routing and dead letter handling
 */

export interface Message<T = unknown> {
  id: string;
  topic: string;
  payload: T;
  timestamp: number;
  retries: number;
  maxRetries: number;
  headers?: Record<string, string>;
}

export interface QueueConfig {
  type: 'rabbitmq' | 'kafka';
  host: string;
  port: number;
  username?: string;
  password?: string;
}

export interface RoutingRule {
  pattern: string;
  handler: (message: Message) => Promise<void>;
  deadLetterQueue?: string;
}

export interface DeadLetterMessage extends Message {
  reason: string;
  failedAt: number;
}

/**
 * MessageQueueIntegration - Distributed message handling
 */
export class MessageQueueIntegration {
  private config: QueueConfig;
  private routes: Map<string, RoutingRule> = new Map();
  private deadLetterQueue: Map<string, DeadLetterMessage> = new Map();
  private listeners: Set<(event: string, data: unknown) => void> = new Set();
  private stats = {
    published: 0,
    consumed: 0,
    failed: 0,
    deadLettered: 0,
  };

  constructor(config: QueueConfig) {
    this.config = config;
  }

  /**
   * Register routing rule
   */
  registerRoute(
    pattern: string,
    handler: (message: Message) => Promise<void>,
    deadLetterQueue?: string
  ): void {
    this.routes.set(pattern, {
      pattern,
      handler,
      deadLetterQueue,
    });

    this.emit('route_registered', { pattern });
  }

  /**
   * Publish message
   */
  async publish<T>(topic: string, payload: T, headers?: Record<string, string>): Promise<string> {
    const message: Message<T> = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      topic,
      payload,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3,
      headers,
    };

    this.stats.published++;
    this.emit('message_published', message);

    return message.id;
  }

  /**
   * Consume message
   */
  async consume(topic: string): Promise<Message | null> {
    const route = this.routes.get(topic);

    if (!route) {
      return null;
    }

    // Simulate message consumption
    const message: Message = {
      id: `msg_${Date.now()}`,
      topic,
      payload: {},
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3,
    };

    try {
      await route.handler(message);
      this.stats.consumed++;
      this.emit('message_consumed', message);
      return message;
    } catch (error) {
      return this.handleMessageFailure(message, route, error as Error);
    }
  }

  /**
   * Handle message failure
   */
  private async handleMessageFailure(
    message: Message,
    route: RoutingRule,
    error: Error
  ): Promise<Message | null> {
    message.retries++;

    if (message.retries < message.maxRetries) {
      // Retry
      this.emit('message_retry', { message, attempt: message.retries });
      return this.consume(message.topic);
    }

    // Send to dead letter queue
    const dlqMessage: DeadLetterMessage = {
      ...message,
      reason: error.message,
      failedAt: Date.now(),
    };

    const dlqName = route.deadLetterQueue || `${message.topic}.dlq`;
    this.deadLetterQueue.set(dlqMessage.id, dlqMessage);
    this.stats.deadLettered++;

    this.emit('message_dead_lettered', dlqMessage);
    return null;
  }

  /**
   * Get dead letter messages
   */
  getDeadLetterMessages(): DeadLetterMessage[] {
    return Array.from(this.deadLetterQueue.values());
  }

  /**
   * Retry dead letter message
   */
  async retryDeadLetterMessage(messageId: string): Promise<boolean> {
    const dlqMessage = this.deadLetterQueue.get(messageId);

    if (!dlqMessage) {
      return false;
    }

    const message: Message = {
      ...dlqMessage,
      retries: 0,
    };

    this.deadLetterQueue.delete(messageId);

    try {
      const route = this.routes.get(message.topic);
      if (route) {
        await route.handler(message);
        this.stats.consumed++;
        this.emit('dlq_message_retried', message);
        return true;
      }
    } catch (error) {
      // Re-queue to DLQ
      this.deadLetterQueue.set(messageId, dlqMessage);
    }

    return false;
  }

  /**
   * Acknowledge message
   */
  acknowledgeMessage(messageId: string): void {
    this.emit('message_acknowledged', messageId);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      ...this.stats,
      routes: this.routes.size,
      deadLetterCount: this.deadLetterQueue.size,
      failureRate: this.stats.failed / (this.stats.published || 1),
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

  /**
   * Connect to queue
   */
  async connect(): Promise<void> {
    this.emit('connecting', this.config);
    // Simulate connection
    this.emit('connected', this.config);
  }

  /**
   * Disconnect from queue
   */
  async disconnect(): Promise<void> {
    this.emit('disconnecting', null);
    // Simulate disconnection
    this.emit('disconnected', null);
  }
}
