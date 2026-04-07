/**
 * User Management System
 * User creation, updates, deletion, and role assignment
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface UserCreateRequest {
  email: string;
  name: string;
  role: string;
  permissions?: string[];
}

export interface UserUpdateRequest {
  name?: string;
  role?: string;
  permissions?: string[];
  isActive?: boolean;
}

/**
 * User Manager
 */
export class UserManager {
  private users: Map<string, User> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Create user
   */
  public createUser(request: UserCreateRequest): User {
    const id = this.generateId();
    const now = new Date();

    const user: User = {
      id,
      email: request.email,
      name: request.name,
      role: request.role,
      permissions: request.permissions || [],
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };

    this.users.set(id, user);
    this.emit('user:created', { userId: id, email: request.email });

    return user;
  }

  /**
   * Get user by ID
   */
  public getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  /**
   * Get user by email
   */
  public getUserByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  /**
   * Update user
   */
  public updateUser(userId: string, request: UserUpdateRequest): User | undefined {
    const user = this.users.get(userId);
    if (!user) {
      return undefined;
    }

    if (request.name !== undefined) user.name = request.name;
    if (request.role !== undefined) user.role = request.role;
    if (request.permissions !== undefined) user.permissions = request.permissions;
    if (request.isActive !== undefined) user.isActive = request.isActive;

    user.updatedAt = new Date();

    this.emit('user:updated', { userId, changes: request });

    return user;
  }

  /**
   * Delete user
   */
  public deleteUser(userId: string): boolean {
    const deleted = this.users.delete(userId);
    if (deleted) {
      this.emit('user:deleted', { userId });
    }
    return deleted;
  }

  /**
   * List all users
   */
  public listUsers(filter?: { role?: string; isActive?: boolean }): User[] {
    let users = Array.from(this.users.values());

    if (filter?.role) {
      users = users.filter((u) => u.role === filter.role);
    }

    if (filter?.isActive !== undefined) {
      users = users.filter((u) => u.isActive === filter.isActive);
    }

    return users;
  }

  /**
   * Update last login
   */
  public updateLastLogin(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      user.lastLogin = new Date();
      this.emit('user:login', { userId, timestamp: user.lastLogin });
    }
  }

  /**
   * Check if user has permission
   */
  public hasPermission(userId: string, permission: string): boolean {
    const user = this.users.get(userId);
    if (!user || !user.isActive) {
      return false;
    }
    return user.permissions.includes(permission);
  }

  /**
   * Add permission to user
   */
  public addPermission(userId: string, permission: string): boolean {
    const user = this.users.get(userId);
    if (!user) {
      return false;
    }

    if (!user.permissions.includes(permission)) {
      user.permissions.push(permission);
      user.updatedAt = new Date();
      this.emit('permission:added', { userId, permission });
    }

    return true;
  }

  /**
   * Remove permission from user
   */
  public removePermission(userId: string, permission: string): boolean {
    const user = this.users.get(userId);
    if (!user) {
      return false;
    }

    const index = user.permissions.indexOf(permission);
    if (index > -1) {
      user.permissions.splice(index, 1);
      user.updatedAt = new Date();
      this.emit('permission:removed', { userId, permission });
    }

    return true;
  }

  /**
   * Get user count
   */
  public getUserCount(): number {
    return this.users.size;
  }

  /**
   * Get active user count
   */
  public getActiveUserCount(): number {
    return Array.from(this.users.values()).filter((u) => u.isActive).length;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    this.users.clear();
    this.listeners.clear();
  }
}

export default UserManager;
