/**
 * WebSocket Server
 * سرور WebSocket برای ارتباط Real-time
 *
 * Features:
 * - WebSocket connections
 * - Event broadcasting
 * - Connection management
 * - Message routing
 */

import { EventEmitter } from 'events';

export interface WebSocketMessage {
  type: string;
  event: string;
  data?: any;
  clientId?: string;
  timestamp?: number;
}

export interface WebSocketClient {
  id: string;
  connected: boolean;
  lastHeartbeat: number;
  subscriptions: Set<string>;
}

export class WebSocketServer extends EventEmitter {
  private clients: Map<string, WebSocketClient>;
  private messageHandlers: Map<string, (msg: WebSocketMessage) => Promise<void>>;
  private stats: {
    connectionsActive: number;
    connectionsPeak: number;
    messagesReceived: number;
    messagesSent: number;
    broadcastsExecuted: number;
  };

  constructor() {
    super();
    this.clients = new Map();
    this.messageHandlers = new Map();
    this.stats = {
      connectionsActive: 0,
      connectionsPeak: 0,
      messagesReceived: 0,
      messagesSent: 0,
      broadcastsExecuted: 0,
    };
    this.setupDefaultHandlers();
  }

  private setupDefaultHandlers(): void {
    this.registerMessageHandler('subscribe', this.handleSubscribe.bind(this));
    this.registerMessageHandler('unsubscribe', this.handleUnsubscribe.bind(this));
    this.registerMessageHandler('ping', this.handlePing.bind(this));
    this.registerMessageHandler('chart-update', this.handleChartUpdate.bind(this));
    this.registerMessageHandler('user-action', this.handleUserAction.bind(this));
  }

  registerMessageHandler(event: string, handler: (msg: WebSocketMessage) => Promise<void>): void {
    this.messageHandlers.set(event, handler);
    this.emit('handler-registered', { event });
  }

  addClient(clientId: string): WebSocketClient {
    const client: WebSocketClient = {
      id: clientId,
      connected: true,
      lastHeartbeat: Date.now(),
      subscriptions: new Set(),
    };

    this.clients.set(clientId, client);
    this.stats.connectionsActive++;
    this.stats.connectionsPeak = Math.max(this.stats.connectionsPeak, this.stats.connectionsActive);

    this.emit('client-connected', { clientId, totalClients: this.clients.size });

    return client;
  }

  removeClient(clientId: string): boolean {
    const removed = this.clients.delete(clientId);
    if (removed) {
      this.stats.connectionsActive--;
      this.emit('client-disconnected', { clientId, totalClients: this.clients.size });
    }
    return removed;
  }

  async handleMessage(clientId: string, message: WebSocketMessage): Promise<void> {
    try {
      const client = this.clients.get(clientId);
      if (!client) {
        this.emit('message-error', { clientId, error: 'Client not found' });
        return;
      }

      client.lastHeartbeat = Date.now();
      this.stats.messagesReceived++;

      const handler = this.messageHandlers.get(message.event);
      if (handler) {
        message.clientId = clientId;
        message.timestamp = Date.now();
        await handler(message);
      } else {
        this.emit('message-unhandled', { clientId, event: message.event });
      }
    } catch (error) {
      this.emit('message-error', { clientId, error: (error as Error).message });
    }
  }

  private async handleSubscribe(msg: WebSocketMessage): Promise<void> {
    const client = this.clients.get(msg.clientId!);
    if (client && msg.data?.channel) {
      client.subscriptions.add(msg.data.channel);
      this.emit('subscription-added', { clientId: msg.clientId, channel: msg.data.channel });
    }
  }

  private async handleUnsubscribe(msg: WebSocketMessage): Promise<void> {
    const client = this.clients.get(msg.clientId!);
    if (client && msg.data?.channel) {
      client.subscriptions.delete(msg.data.channel);
      this.emit('subscription-removed', { clientId: msg.clientId, channel: msg.data.channel });
    }
  }

  private async handlePing(msg: WebSocketMessage): Promise<void> {
    this.send(msg.clientId!, 'pong', { timestamp: Date.now() });
  }

  private async handleChartUpdate(msg: WebSocketMessage): Promise<void> {
    this.broadcast('chart-updated', msg.data, ['chart-updates']);
  }

  private async handleUserAction(msg: WebSocketMessage): Promise<void> {
    this.broadcast('user-action-received', msg.data, ['user-actions']);
  }

  send(clientId: string, event: string, data?: any): boolean {
    const client = this.clients.get(clientId);
    if (!client || !client.connected) {
      return false;
    }

    const message: WebSocketMessage = {
      type: 'message',
      event,
      data,
      timestamp: Date.now(),
    };

    this.stats.messagesSent++;
    this.emit('message-sent', { clientId, event, data });

    return true;
  }

  broadcast(event: string, data?: any, channels?: string[]): number {
    let count = 0;

    for (const [clientId, client] of this.clients) {
      if (!client.connected) continue;

      // If channels specified, only send to subscribed clients
      if (channels && channels.length > 0) {
        const isSubscribed = channels.some((ch) => client.subscriptions.has(ch));
        if (!isSubscribed) continue;
      }

      const message: WebSocketMessage = {
        type: 'broadcast',
        event,
        data,
        timestamp: Date.now(),
      };

      this.stats.messagesSent++;
      this.emit('message-sent', { clientId, event, data });
      count++;
    }

    this.stats.broadcastsExecuted++;
    this.emit('broadcast-executed', { event, recipientCount: count, channels });

    return count;
  }

  broadcastToChannel(channel: string, event: string, data?: any): number {
    return this.broadcast(event, data, [channel]);
  }

  getClient(clientId: string): WebSocketClient | undefined {
    return this.clients.get(clientId);
  }

  getAllClients(): WebSocketClient[] {
    return Array.from(this.clients.values());
  }

  getConnectedClients(): number {
    return this.stats.connectionsActive;
  }

  checkHeartbeat(timeoutMs: number = 30000): number {
    let disconnected = 0;
    const now = Date.now();

    for (const [clientId, client] of this.clients) {
      if (now - client.lastHeartbeat > timeoutMs) {
        this.removeClient(clientId);
        disconnected++;
      }
    }

    return disconnected;
  }

  getStats() {
    return { ...this.stats };
  }
}
