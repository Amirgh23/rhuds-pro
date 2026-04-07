/**
 * WebSocket Client
 * کلاینت WebSocket برای ارتباط Real-time
 *
 * Features:
 * - Connection management
 * - Event subscription
 * - Message handling
 * - Reconnection logic
 */

import { EventEmitter } from 'events';

export interface WebSocketClientConfig {
  url: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  heartbeatInterval?: number;
}

export interface WebSocketMessage {
  type: string;
  event: string;
  data?: any;
  timestamp?: number;
}

export class WebSocketClient extends EventEmitter {
  private url: string;
  private connected: boolean;
  private reconnectAttempts: number;
  private reconnectDelay: number;
  private heartbeatInterval: number;
  private currentAttempt: number;
  private heartbeatTimer?: NodeJS.Timeout;
  private subscriptions: Map<string, (data: any) => void>;
  private stats: {
    messagesReceived: number;
    messagesSent: number;
    reconnectAttempts: number;
    connectionTime: number;
  };

  constructor(config: WebSocketClientConfig) {
    super();
    this.url = config.url;
    this.reconnectAttempts = config.reconnectAttempts || 5;
    this.reconnectDelay = config.reconnectDelay || 1000;
    this.heartbeatInterval = config.heartbeatInterval || 30000;
    this.currentAttempt = 0;
    this.connected = false;
    this.subscriptions = new Map();
    this.stats = {
      messagesReceived: 0,
      messagesSent: 0,
      reconnectAttempts: 0,
      connectionTime: 0,
    };
  }

  async connect(): Promise<boolean> {
    try {
      // Simulate connection
      this.connected = true;
      this.currentAttempt = 0;
      this.stats.connectionTime = Date.now();

      this.startHeartbeat();
      this.emit('connected', { url: this.url, timestamp: Date.now() });

      return true;
    } catch (error) {
      this.handleConnectionError(error as Error);
      return false;
    }
  }

  disconnect(): void {
    this.connected = false;
    this.stopHeartbeat();
    this.emit('disconnected', { timestamp: Date.now() });
  }

  private handleConnectionError(error: Error): void {
    this.currentAttempt++;
    this.stats.reconnectAttempts++;

    if (this.currentAttempt < this.reconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, this.currentAttempt - 1);
      this.emit('reconnecting', { attempt: this.currentAttempt, delay });

      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      this.emit('connection-failed', { error: error.message, attempts: this.currentAttempt });
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.connected) {
        this.send('ping', {});
      }
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  send(event: string, data?: any): boolean {
    if (!this.connected) {
      this.emit('send-error', { event, error: 'Not connected' });
      return false;
    }

    const message: WebSocketMessage = {
      type: 'message',
      event,
      data,
      timestamp: Date.now(),
    };

    this.stats.messagesSent++;
    this.emit('message-sent', { event, data });

    return true;
  }

  subscribe(channel: string, callback: (data: any) => void): string {
    const subscriptionId = `sub-${channel}-${Date.now()}`;
    this.subscriptions.set(subscriptionId, callback);

    // Send subscription message
    this.send('subscribe', { channel });

    this.emit('subscribed', { channel, subscriptionId });

    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): boolean {
    const callback = this.subscriptions.get(subscriptionId);
    if (!callback) {
      return false;
    }

    this.subscriptions.delete(subscriptionId);

    // Extract channel from subscriptionId
    const channel = subscriptionId.split('-')[1];
    this.send('unsubscribe', { channel });

    this.emit('unsubscribed', { subscriptionId });

    return true;
  }

  handleMessage(message: WebSocketMessage): void {
    try {
      this.stats.messagesReceived++;

      // Handle pong
      if (message.event === 'pong') {
        this.emit('pong', { timestamp: message.timestamp });
        return;
      }

      // Emit event
      this.emit(message.event, message.data);

      // Call subscribed callbacks
      for (const callback of this.subscriptions.values()) {
        callback(message.data);
      }
    } catch (error) {
      this.emit('message-error', { error: (error as Error).message });
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  getSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  getStats() {
    return {
      ...this.stats,
      connected: this.connected,
      subscriptionCount: this.subscriptions.size,
    };
  }
}
