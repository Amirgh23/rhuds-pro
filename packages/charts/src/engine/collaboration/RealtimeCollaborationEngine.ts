/**
 * Real-time Collaboration Engine
 * Multi-user editing, presence, and synchronization
 */

export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
  isActive: boolean;
  joinedAt: Date;
}

export interface CollaborationChange {
  id: string;
  userId: string;
  type: 'insert' | 'delete' | 'update';
  path: string;
  value: any;
  timestamp: Date;
}

export interface CollaborationSession {
  id: string;
  name: string;
  users: Map<string, CollaborationUser>;
  changes: CollaborationChange[];
  createdAt: Date;
  isActive: boolean;
}

/**
 * Real-time Collaboration Engine
 */
export class RealtimeCollaborationEngine {
  private sessions: Map<string, CollaborationSession> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Create session
   */
  public createSession(name: string): CollaborationSession {
    const id = this.generateId();

    const session: CollaborationSession = {
      id,
      name,
      users: new Map(),
      changes: [],
      createdAt: new Date(),
      isActive: true,
    };

    this.sessions.set(id, session);
    this.emit('session:created', { sessionId: id, name });

    return session;
  }

  /**
   * Get session
   */
  public getSession(sessionId: string): CollaborationSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Join session
   */
  public joinSession(
    sessionId: string,
    userId: string,
    userName: string
  ): CollaborationUser | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return undefined;
    }

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    const color = colors[session.users.size % colors.length];

    const user: CollaborationUser = {
      id: userId,
      name: userName,
      color,
      isActive: true,
      joinedAt: new Date(),
    };

    session.users.set(userId, user);
    this.emit('user:joined', { sessionId, userId, userName });

    return user;
  }

  /**
   * Leave session
   */
  public leaveSession(sessionId: string, userId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    const deleted = session.users.delete(userId);
    if (deleted) {
      this.emit('user:left', { sessionId, userId });
    }

    return deleted;
  }

  /**
   * Update cursor
   */
  public updateCursor(sessionId: string, userId: string, x: number, y: number): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    const user = session.users.get(userId);
    if (user) {
      user.cursor = { x, y };
      this.emit('cursor:updated', { sessionId, userId, x, y });
    }
  }

  /**
   * Apply change
   */
  public applyChange(
    sessionId: string,
    userId: string,
    type: 'insert' | 'delete' | 'update',
    path: string,
    value: any
  ): CollaborationChange {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const id = this.generateId();

    const change: CollaborationChange = {
      id,
      userId,
      type,
      path,
      value,
      timestamp: new Date(),
    };

    session.changes.push(change);
    this.emit('change:applied', { sessionId, changeId: id, type });

    return change;
  }

  /**
   * Get changes
   */
  public getChanges(sessionId: string, since?: Date): CollaborationChange[] {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return [];
    }

    let changes = session.changes;

    if (since) {
      changes = changes.filter((c) => c.timestamp > since);
    }

    return changes;
  }

  /**
   * Get session users
   */
  public getSessionUsers(sessionId: string): CollaborationUser[] {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return [];
    }

    return Array.from(session.users.values());
  }

  /**
   * List sessions
   */
  public listSessions(filter?: { isActive?: boolean }): CollaborationSession[] {
    let sessions = Array.from(this.sessions.values());

    if (filter?.isActive !== undefined) {
      sessions = sessions.filter((s) => s.isActive === filter.isActive);
    }

    return sessions;
  }

  /**
   * Close session
   */
  public closeSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    session.isActive = false;
    this.emit('session:closed', { sessionId });

    return true;
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    totalSessions: number;
    activeSessions: number;
    totalUsers: number;
    totalChanges: number;
  } {
    const sessions = Array.from(this.sessions.values());
    const activeSessions = sessions.filter((s) => s.isActive).length;

    let totalUsers = 0;
    let totalChanges = 0;

    sessions.forEach((session) => {
      totalUsers += session.users.size;
      totalChanges += session.changes.length;
    });

    return {
      totalSessions: sessions.length,
      activeSessions,
      totalUsers,
      totalChanges,
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    this.sessions.clear();
    this.listeners.clear();
  }
}

export default RealtimeCollaborationEngine;
