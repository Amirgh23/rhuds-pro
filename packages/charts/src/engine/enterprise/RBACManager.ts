/**
 * Role-Based Access Control (RBAC) Manager
 * Role creation, permission management, and access control
 */

export interface Role {
  name: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleAssignment {
  userId: string;
  roles: string[];
}

/**
 * RBAC Manager
 */
export class RBACManager {
  private roles: Map<string, Role> = new Map();
  private userRoles: Map<string, string[]> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Create role
   */
  public createRole(name: string, permissions: string[], description?: string): Role {
    const now = new Date();

    const role: Role = {
      name,
      description,
      permissions: [...new Set(permissions)], // Remove duplicates
      createdAt: now,
      updatedAt: now,
    };

    this.roles.set(name, role);
    this.emit('role:created', { name, permissionCount: permissions.length });

    return role;
  }

  /**
   * Get role
   */
  public getRole(name: string): Role | undefined {
    return this.roles.get(name);
  }

  /**
   * Update role
   */
  public updateRole(name: string, permissions: string[], description?: string): Role | undefined {
    const role = this.roles.get(name);
    if (!role) {
      return undefined;
    }

    role.permissions = [...new Set(permissions)];
    if (description !== undefined) {
      role.description = description;
    }
    role.updatedAt = new Date();

    this.emit('role:updated', { name, permissionCount: permissions.length });

    return role;
  }

  /**
   * Delete role
   */
  public deleteRole(name: string): boolean {
    const deleted = this.roles.delete(name);
    if (deleted) {
      // Remove role from all users
      this.userRoles.forEach((roles) => {
        const index = roles.indexOf(name);
        if (index > -1) {
          roles.splice(index, 1);
        }
      });
      this.emit('role:deleted', { name });
    }
    return deleted;
  }

  /**
   * List all roles
   */
  public listRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  /**
   * Assign role to user
   */
  public assignRole(userId: string, roleName: string): boolean {
    if (!this.roles.has(roleName)) {
      return false;
    }

    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, []);
    }

    const roles = this.userRoles.get(userId)!;
    if (!roles.includes(roleName)) {
      roles.push(roleName);
      this.emit('role:assigned', { userId, roleName });
    }

    return true;
  }

  /**
   * Revoke role from user
   */
  public revokeRole(userId: string, roleName: string): boolean {
    const roles = this.userRoles.get(userId);
    if (!roles) {
      return false;
    }

    const index = roles.indexOf(roleName);
    if (index > -1) {
      roles.splice(index, 1);
      this.emit('role:revoked', { userId, roleName });
      return true;
    }

    return false;
  }

  /**
   * Get user roles
   */
  public getUserRoles(userId: string): string[] {
    return this.userRoles.get(userId) || [];
  }

  /**
   * Get user permissions
   */
  public getUserPermissions(userId: string): string[] {
    const roles = this.userRoles.get(userId) || [];
    const permissions = new Set<string>();

    roles.forEach((roleName) => {
      const role = this.roles.get(roleName);
      if (role) {
        role.permissions.forEach((p) => permissions.add(p));
      }
    });

    return Array.from(permissions);
  }

  /**
   * Check if user has permission
   */
  public hasPermission(userId: string, permission: string): boolean {
    const permissions = this.getUserPermissions(userId);
    return permissions.includes(permission);
  }

  /**
   * Check if user has role
   */
  public hasRole(userId: string, roleName: string): boolean {
    const roles = this.userRoles.get(userId) || [];
    return roles.includes(roleName);
  }

  /**
   * Check if user has any of the roles
   */
  public hasAnyRole(userId: string, roleNames: string[]): boolean {
    const roles = this.userRoles.get(userId) || [];
    return roleNames.some((r) => roles.includes(r));
  }

  /**
   * Check if user has all roles
   */
  public hasAllRoles(userId: string, roleNames: string[]): boolean {
    const roles = this.userRoles.get(userId) || [];
    return roleNames.every((r) => roles.includes(r));
  }

  /**
   * Add permission to role
   */
  public addPermissionToRole(roleName: string, permission: string): boolean {
    const role = this.roles.get(roleName);
    if (!role) {
      return false;
    }

    if (!role.permissions.includes(permission)) {
      role.permissions.push(permission);
      role.updatedAt = new Date();
      this.emit('permission:added', { roleName, permission });
    }

    return true;
  }

  /**
   * Remove permission from role
   */
  public removePermissionFromRole(roleName: string, permission: string): boolean {
    const role = this.roles.get(roleName);
    if (!role) {
      return false;
    }

    const index = role.permissions.indexOf(permission);
    if (index > -1) {
      role.permissions.splice(index, 1);
      role.updatedAt = new Date();
      this.emit('permission:removed', { roleName, permission });
      return true;
    }

    return false;
  }

  /**
   * Get role hierarchy
   */
  public getRoleHierarchy(): Record<string, string[]> {
    const hierarchy: Record<string, string[]> = {};

    this.userRoles.forEach((roles, userId) => {
      hierarchy[userId] = roles;
    });

    return hierarchy;
  }

  /**
   * Get permission matrix
   */
  public getPermissionMatrix(): Record<string, Record<string, boolean>> {
    const matrix: Record<string, Record<string, boolean>> = {};

    this.roles.forEach((role, roleName) => {
      matrix[roleName] = {};
      const allPermissions = new Set<string>();

      this.roles.forEach((r) => {
        r.permissions.forEach((p) => allPermissions.add(p));
      });

      allPermissions.forEach((permission) => {
        matrix[roleName][permission] = role.permissions.includes(permission);
      });
    });

    return matrix;
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
    this.roles.clear();
    this.userRoles.clear();
    this.listeners.clear();
  }
}

export default RBACManager;
