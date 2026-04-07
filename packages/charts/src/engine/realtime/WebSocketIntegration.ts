/**
 * WebSocket Integration
 * WebSocket support for real-time communication
 *
 * ادغام وب سوکت
 * پشتیبانی وب سوکت برای ارتباط بلادرنگ
 */

import { EventEmitter } from 'events';

export interface WebSocketConfig {
  url: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  messageTimeout?: number;
}

export interface WebSocketMessage {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  binary?: boolean;
}

export interface ConnectionState {
  connected: boolean;
  reconnectAttempts: number;
  lastConnectedAt?: number;
  lastDisconnectedAt?: number;
  messagesSent: number;
  messagesReceived: number;
}

export class WebSocketIntegration extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private state: ConnectionState;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private pendingMessages: Map<string, any> = new Map();
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig) {
    super();
    this.config = {
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      messageTimeout: 5000,
      ...config,
    };

    this.state = {
      connected: false,
      reconnectAttempts: 0,
      messagesSent: 0,
      messagesReceived: 0,
    };
  }

  /**
   * Connect to WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          this.state.connected = true;
          this.state.reconnectAttempts = 0;
          this.state.lastConnectedAt = Date.now();

          this.startHeartbeat();
          this.emit('connected', { url: this.config.url });
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          this.emit('error', { error });
          reject(error);
        };

        this.ws.onclose = () => {
          this.state.connected = false;
          this.state.lastDisconnectedAt = Date.now();
          this.stopHeartbeat();

          this.emit('disconnected', {});

          if (
            this.config.reconnect &&
            this.state.reconnectAttempts < (this.config.maxReconnectAttempts || 5)
          ) {
            this.scheduleReconnect();
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.state.connected = false;
    this.emit('disconnected', {});
  }

  /**
   * Send message
   */
  send(type: string, data: any, binary: boolean = false): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.state.connected) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const messageId = `msg-${Date.now()}-${Math.random()}`;
      const message: WebSocketMessage = {
        id: messageId,
        type,
        data,
        timestamp: Date.now(),
        binary,
      };

      try {
        const payload = binary ? data : JSON.stringify(message);
        this.ws?.send(payload);

        this.state.messagesSent++;
        this.emit('message:sent', { messageId, type });

        // Set timeout for response
        const timeout = setTimeout(() => {
          this.pendingMessages.delete(messageId);
          reject(new Error(`Message ${messageId} timeout`));
        }, this.config.messageTimeout || 5000);

        this.pendingMessages.set(messageId, { resolve, reject, timeout });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Subscribe to message type
   */
  subscribe(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
    this.emit('subscribed', { type });
  }

  /**
   * Unsubscribe from message type
   */
  unsubscribe(type: string): void {
    this.messageHandlers.delete(type);
    this.emit('unsubscribed', { type });
  }

  /**
   * Register message handler
   */
  on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  /**
   * Get connection state
   */
  getState(): ConnectionState {
    return { ...this.state };
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.state.connected;
  }

  /**
   * Private helper: Handle incoming message
   */
  private handleMessage(rawData: any): void {
    try {
      const message: WebSocketMessage = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

      this.state.messagesReceived++;
      this.emit('message:received', { type: message.type, id: message.id });

      // Handle pending message response
      if (this.pendingMessages.has(message.id)) {
        const pending = this.pendingMessages.get(message.id);
        clearTimeout(pending.timeout);
        pending.resolve(message.data);
        this.pendingMessages.delete(message.id);
      }

      // Call registered handler
      const handler = this.messageHandlers.get(message.type);
      if (handler) {
        handler(message.data);
      }
    } catch (error) {
      this.emit('message:error', { error });
    }
  }

  /**
   * Private helper: Start heartbeat
   */
  private startHeartbeat(): void {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);

    this.heartbeatTimer = setInterval(() => {
      if (this.state.connected) {
        this.send('heartbeat', { timestamp: Date.now() }).catch(() => {
          // Heartbeat failed, will trigger reconnect
        });
      }
    }, this.config.heartbeatInterval || 30000);
  }

  /**
   * Private helper: Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Private helper: Schedule reconnect
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    this.state.reconnectAttempts++;
    const delay = (this.config.reconnectInterval || 3000) * this.state.reconnectAttempts;

    this.emit('reconnect:scheduled', { attempt: this.state.reconnectAttempts, delay });

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(() => {
        // Reconnect failed, will schedule another attempt
      });
    }, delay);
  }
}
