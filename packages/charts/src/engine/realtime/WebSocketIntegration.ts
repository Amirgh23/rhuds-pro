/**
 * WebSocket Integration
 * Real-time communication with connection management and message routing
 */

export interface WebSocketConfig {
  url: string;
  reconnect: boolean;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  messageTimeout: number;
}

export interface WebSocketMessage<T = unknown> {
  id: string;
  type: string;
  data: T;
  timestamp: Date;
  sequence: number;
}

export interface ConnectionState {
  connected: boolean;
  connecting: boolean;
  reconnectAttempts: number;
  lastConnected?: Date;
  lastError?: Error;
}

/**
 * WebSocketIntegration - WebSocket communication
 */
export class WebSocketIntegration<T = unknown> {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private state: ConnectionState = {
    connected: false,
    connecting: false,
    reconnectAttempts: 0,
  };
  private messageHandlers: Map<string, Set<(msg: WebSocketMessage<T>) => void>> = new Map();
  private errorHandlers: Set<(error: Error) => void> = new Set();
  private connectionHandlers: Set<() => void> = new Set();
  private disconnectionHandlers: Set<() => void> = new Set();
  private sequence: number = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      messageTimeout: 5000,
      ...config,
    };
  }

  /**
   * Connect to WebSocket
   */
  async connect(): Promise<void> {
    if (this.state.connected || this.state.connecting) {
      return;
    }

    this.state.connecting = true;

    try {
      this.ws = new WebSocket(this.config.url);

      this.ws.onopen = () => this.handleOpen();
      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onerror = (event) => this.handleError(event);
      this.ws.onclose = () => this.handleClose();
    } catch (error) {
      this.state.connecting = false;
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.state.connected = false;
    this.state.connecting = false;
  }

  /**
   * Send message
   */
  send(type: string, data: T): void {
    if (!this.state.connected) {
      throw new Error('WebSocket not connected');
    }

    const message: WebSocketMessage<T> = {
      id: `msg-${this.sequence++}`,
      type,
      data,
      timestamp: new Date(),
      sequence: this.sequence,
    };

    this.ws?.send(JSON.stringify(message));
  }

  /**
   * Subscribe to message type
   */
  on(type: string, callback: (msg: WebSocketMessage<T>) => void): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }

    this.messageHandlers.get(type)!.add(callback);

    return () => {
      this.messageHandlers.get(type)?.delete(callback);
    };
  }

  /**
   * Subscribe to errors
   */
  onError(callback: (error: Error) => void): () => void {
    this.errorHandlers.add(callback);

    return () => {
      this.errorHandlers.delete(callback);
    };
  }

  /**
   * Subscribe to connection
   */
  onConnect(callback: () => void): () => void {
    this.connectionHandlers.add(callback);

    return () => {
      this.connectionHandlers.delete(callback);
    };
  }

  /**
   * Subscribe to disconnection
   */
  onDisconnect(callback: () => void): () => void {
    this.disconnectionHandlers.add(callback);

    return () => {
      this.disconnectionHandlers.delete(callback);
    };
  }

  /**
   * Get connection state
   */
  getState(): ConnectionState {
    return { ...this.state };
  }

  /**
   * Is connected
   */
  isConnected(): boolean {
    return this.state.connected;
  }

  /**
   * Handle open
   */
  private handleOpen(): void {
    this.state.connected = true;
    this.state.connecting = false;
    this.state.reconnectAttempts = 0;
    this.state.lastConnected = new Date();

    // Start heartbeat
    this.startHeartbeat();

    // Notify listeners
    this.connectionHandlers.forEach((handler) => handler());
  }

  /**
   * Handle message
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage<T> = JSON.parse(event.data);

      // Handle heartbeat response
      if (message.type === 'pong') {
        return;
      }

      // Notify handlers
      const handlers = this.messageHandlers.get(message.type);
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(message);
          } catch (error) {
            this.notifyError(error as Error);
          }
        });
      }
    } catch (error) {
      this.notifyError(error as Error);
    }
  }

  /**
   * Handle error
   */
  private handleError(event: Event): void {
    const error = new Error('WebSocket error');
    this.state.lastError = error;
    this.notifyError(error);
  }

  /**
   * Handle close
   */
  private handleClose(): void {
    this.state.connected = false;
    this.state.connecting = false;

    // Stop heartbeat
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    // Notify listeners
    this.disconnectionHandlers.forEach((handler) => handler());

    // Attempt reconnection
    if (this.config.reconnect && this.state.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.state.reconnectAttempts++;
      this.reconnectTimer = setTimeout(() => {
        this.connect().catch((error) => this.notifyError(error));
      }, this.config.reconnectInterval);
    }
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.state.connected) {
        try {
          this.send('ping', {} as T);
        } catch (error) {
          this.notifyError(error as Error);
        }
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Notify error
   */
  private notifyError(error: Error): void {
    this.errorHandlers.forEach((handler) => handler(error));
  }

  /**
   * Get message handlers count
   */
  getHandlerCount(type?: string): number {
    if (type) {
      return this.messageHandlers.get(type)?.size || 0;
    }

    let total = 0;
    this.messageHandlers.forEach((handlers) => {
      total += handlers.size;
    });

    return total;
  }

  /**
   * Clear handlers
   */
  clearHandlers(type?: string): void {
    if (type) {
      this.messageHandlers.delete(type);
    } else {
      this.messageHandlers.clear();
    }
  }
}

export default WebSocketIntegration;
