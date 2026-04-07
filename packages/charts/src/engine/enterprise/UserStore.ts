/**
 * User Store
 * Persistent storage for user data
 */

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface CreateUserInput {
  email: string;
  name: string;
  roles?: string[];
}

export interface UpdateUserInput {
  name?: string;
  roles?: string[];
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export interface UserFilters {
  search?: string;
  roles?: string[];
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * User Store for managing user data
 */
export class UserStore {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map();
  private roleIndex: Map<string, Set<string>> = new Map();

  /**
   * Create user
   */
  createUser(input: CreateUserInput): User {
    const id = this.generateId();
    const now = new Date();

    const user: User = {
      id,
      email: input.email,
      name: input.name,
      roles: input.roles || [],
      permissions: [],
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };

    this.users.set(id, user);
    this.emailIndex.set(input.email, id);

    // Update role index
    for (const role of user.roles) {
      if (!this.roleIndex.has(role)) {
        this.roleIndex.set(role, new Set());
      }
      this.roleIndex.get(role)!.add(id);
    }

    return user;
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  /**
   * Get user by email
   */
  getUserByEmail(email: string): User | null {
    const userId = this.emailIndex.get(email);
    return userId ? this.users.get(userId) || null : null;
  }

  /**
   * Update user
   */
  updateUser(userId: string, updates: UpdateUserInput): User | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const updated: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    // Update role index if roles changed
    if (updates.roles) {
      // Remove from old roles
      for (const role of user.roles) {
        this.roleIndex.get(role)?.delete(userId);
      }

      // Add to new roles
      for (const role of updates.roles) {
        if (!this.roleIndex.has(role)) {
          this.roleIndex.set(role, new Set());
        }
        this.roleIndex.get(role)!.add(userId);
      }
    }

    this.users.set(userId, updated);
    return updated;
  }

  /**
   * Delete user
   */
  deleteUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    // Remove from email index
    this.emailIndex.delete(user.email);

    // Remove from role index
    for (const role of user.roles) {
      this.roleIndex.get(role)?.delete(userId);
    }

    // Soft delete
    this.users.delete(userId);
    return true;
  }

  /**
   * List users
   */
  listUsers(filters?: UserFilters): User[] {
    let results = Array.from(this.users.values());

    if (!filters) return results;

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(
        (u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)
      );
    }

    // Filter by roles
    if (filters.roles && filters.roles.length > 0) {
      results = results.filter((u) => filters.roles!.some((role) => u.roles.includes(role)));
    }

    // Filter by active status
    if (filters.isActive !== undefined) {
      results = results.filter((u) => u.isActive === filters.isActive);
    }

    // Filter by creation date
    if (filters.createdAfter) {
      results = results.filter((u) => u.createdAt >= filters.createdAfter!);
    }

    if (filters.createdBefore) {
      results = results.filter((u) => u.createdAt <= filters.createdBefore!);
    }

    return results;
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: string): User[] {
    const userIds = this.roleIndex.get(role);
    if (!userIds) return [];

    return Array.from(userIds)
      .map((id) => this.users.get(id))
      .filter((u) => u !== undefined) as User[];
  }

  /**
   * Update last login
   */
  updateLastLogin(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      user.lastLogin = new Date();
      user.updatedAt = new Date();
    }
  }

  /**
   * Get user count
   */
  getUserCount(): number {
    return this.users.size;
  }

  /**
   * Get active user count
   */
  getActiveUserCount(): number {
    return Array.from(this.users.values()).filter((u) => u.isActive).length;
  }

  /**
   * Clear all users
   */
  clear(): void {
    this.users.clear();
    this.emailIndex.clear();
    this.roleIndex.clear();
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default UserStore;
