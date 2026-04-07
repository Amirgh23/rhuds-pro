/**
 * Real-time Collaboration Manager
 * Enables multiple users to collaborate on charts in real-time
 */

export interface CollaborationConfig {
  userId: string;
  userName: string;
  roomId: string;
  serverUrl?: string;
}

export interface CollaborationEvent {
  type: 'update' | 'delete' | 'create' | 'cursor' | 'selection';
  userId: string;
  userName: string;
  timestamp: number;
  data: any;
}

export interface UserCursor {
  userId: string;
  userName: string;
  x: number;
  y: number;
  color: string;
}

/**
 * Collaboration Manager for real-time chart collaboration
 */
export class CollaborationManager {
  private userId: string;
  private userName: string;
  private roomId: string;
  private serverUrl: string;
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private userCursors: Map<string, UserCursor> = new Map();
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor(config: CollaborationConfig) {
    this.userId = config.userId;
    this.userName = config.userName;
    this.roomId = config.roomId;
    this.serverUrl = config.serverUrl || 'wss://collab.rhuds.dev';
  }

  /**
   * Connect to collaboration server
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${this.serverUrl}/rooms/${this.roomId}`);

        this.ws.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;

          // Send join message
          this.send({
            type: 'join',
            userId: this.userId,
            userName: this.userName,
          });

          this.emit('connected', {});
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };

        this.ws.onerror = (error) => {
          this.emit('error', { error });
          reject(error);
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.emit('disconnected', {});
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Handle incoming message
   */
  private handleMessage(message: CollaborationEvent): void {
    switch (message.type) {
      case 'update':
        this.emit('update', message);
        break;
      case 'delete':
        this.emit('delete', message);
        break;
      case 'create':
        this.emit('create', message);
        break;
      case 'cursor':
        this.updateUserCursor(message.data);
        this.emit('cursor', message);
        break;
      case 'selection':
        this.emit('selection', message);
        break;
    }
  }

  /**
   * Update chart data
   */
  public updateData(data: any): void {
    this.send({
      type: 'update',
      userId: this.userId,
      userName: this.userName,
      timestamp: Date.now(),
      data,
    });
  }

  /**
   * Delete chart element
   */
  public deleteElement(elementId: string): void {
    this.send({
      type: 'delete',
      userId: this.userId,
      userName: this.userName,
      timestamp: Date.now(),
      data: { elementId },
    });
  }

  /**
   * Create chart element
   */
  public createElement(element: any): void {
    this.send({
      type: 'create',
      userId: this.userId,
      userName: this.userName,
      timestamp: Date.now(),
      data: element,
    });
  }

  /**
   * Update user cursor position
   */
  public updateCursor(x: number, y: number): void {
    this.send({
      type: 'cursor',
      userId: this.userId,
      userName: this.userName,
      timestamp: Date.now(),
      data: { x, y },
    });
  }

  /**
   * Update user cursor
   */
  private updateUserCursor(data: any): void {
    const cursor: UserCursor = {
      userId: data.userId,
      userName: data.userName,
      x: data.x,
      y: data.y,
      color: this.generateColorForUser(data.userId),
    };

    this.userCursors.set(data.userId, cursor);
  }

  /**
   * Generate color for user
   */
  private generateColorForUser(userId: string): string {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  /**
   * Get user cursors
   */
  public getUserCursors(): UserCursor[] {
    return Array.from(this.userCursors.values());
  }

  /**
   * Send message to server
   */
  private send(message: any): void {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(message));
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
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;

      setTimeout(() => {
        this.connect().catch(() => {
          // Reconnection failed, will retry
        });
      }, delay);
    }
  }

  /**
   * Disconnect from server
   */
  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  /**
   * Get connection status
   */
  public getStatus(): {
    isConnected: boolean;
    userId: string;
    roomId: string;
    userCount: number;
  } {
    return {
      isConnected: this.isConnected,
      userId: this.userId,
      roomId: this.roomId,
      userCount: this.userCursors.size + 1,
    };
  }

  /**
   * Destroy manager
   */
  public destroy(): void {
    this.disconnect();
    this.listeners.clear();
    this.userCursors.clear();
  }
}

export default CollaborationManager;
