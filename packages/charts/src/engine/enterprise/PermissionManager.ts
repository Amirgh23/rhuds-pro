/**
 * Permission Manager
 * Manages permissions and access control
 */

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  createdAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  parentRole?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleAssignment {
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy: string;
}

/**
 * Permission Manager for RBAC
 */
export class PermissionManager {
  private permissions: Map<string, Permission> = new Map();
  private roles: Map<string, Role> = new Map();
  private roleAssignments: Map<string, Set<string>> = new Map(); // userId -> roleIds
  private permissionCache: Map<string, Set<string>> = new Map(); // userId -> permissions

  /**
   * Create permission
   */
  createPermission(data: Omit<Permission, 'id' | 'createdAt'>): Permission {
    const id = this.generateId('perm');
    const permission: Permission = {
      ...data,
      id,
      createdAt: new Date(),
    };

    this.permissions.set(id, permission);
    return permission;
  }

  /**
   * Create role
   */
  createRole(data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Role {
    const id = this.generateId('role');
    const role: Role = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.roles.set(id, role);
    return role;
  }

  /**
   * Add permission to role
   */
  addPermissionToRole(roleId: string, permissionId: string): boolean {
    const role = this.roles.get(roleId);
    const permission = this.permissions.get(permissionId);

    if (!role || !permission) return false;

    if (!role.permissions.includes(permissionId)) {
      role.permissions.push(permissionId);
      role.updatedAt = new Date();
      this.invalidatePermissionCache();
    }

    return true;
  }

  /**
   * Remove permission from role
   */
  removePermissionFromRole(roleId: string, permissionId: string): boolean {
    const role = this.roles.get(roleId);
    if (!role) return false;

    const index = role.permissions.indexOf(permissionId);
    if (index > -1) {
      role.permissions.splice(index, 1);
      role.updatedAt = new Date();
      this.invalidatePermissionCache();
      return true;
    }

    return false;
  }

  /**
   * Assign role to user
   */
  assignRoleToUser(userId: string, roleId: string): boolean {
    const role = this.roles.get(roleId);
    if (!role) return false;

    if (!this.roleAssignments.has(userId)) {
      this.roleAssignments.set(userId, new Set());
    }

    this.roleAssignments.get(userId)!.add(roleId);
    this.permissionCache.delete(userId);

    return true;
  }

  /**
   * Remove role from user
   */
  removeRoleFromUser(userId: string, roleId: string): boolean {
    const roles = this.roleAssignments.get(userId);
    if (!roles) return false;

    const removed = roles.delete(roleId);
    if (removed) {
      this.permissionCache.delete(userId);
    }

    return removed;
  }

  /**
   * Get user permissions
   */
  getUserPermissions(userId: string): Set<string> {
    // Check cache
    if (this.permissionCache.has(userId)) {
      return this.permissionCache.get(userId)!;
    }

    const permissions = new Set<string>();
    const roleIds = this.roleAssignments.get(userId);

    if (roleIds) {
      for (const roleId of roleIds) {
        const role = this.roles.get(roleId);
        if (role) {
          for (const permId of role.permissions) {
            permissions.add(permId);
          }

          // Add parent role permissions
          if (role.parentRole) {
            const parentPerms = this.getRolePermissions(role.parentRole);
            parentPerms.forEach((p) => permissions.add(p));
          }
        }
      }
    }

    this.permissionCache.set(userId, permissions);
    return permissions;
  }

  /**
   * Get role permissions
   */
  getRolePermissions(roleId: string): Set<string> {
    const role = this.roles.get(roleId);
    if (!role) return new Set();

    const permissions = new Set(role.permissions);

    // Add parent role permissions
    if (role.parentRole) {
      const parentPerms = this.getRolePermissions(role.parentRole);
      parentPerms.forEach((p) => permissions.add(p));
    }

    return permissions;
  }

  /**
   * Check if user has permission
   */
  hasPermission(userId: string, permissionId: string): boolean {
    const permissions = this.getUserPermissions(userId);
    return permissions.has(permissionId);
  }

  /**
   * Check if user can perform action on resource
   */
  canAccess(userId: string, resource: string, action: string): boolean {
    const permissions = this.getUserPermissions(userId);

    for (const permId of permissions) {
      const perm = this.permissions.get(permId);
      if (perm && perm.resource === resource && perm.action === action) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get user roles
   */
  getUserRoles(userId: string): Role[] {
    const roleIds = this.roleAssignments.get(userId);
    if (!roleIds) return [];

    return Array.from(roleIds)
      .map((id) => this.roles.get(id))
      .filter((r) => r !== undefined) as Role[];
  }

  /**
   * Get permission
   */
  getPermission(permissionId: string): Permission | null {
    return this.permissions.get(permissionId) || null;
  }

  /**
   * Get role
   */
  getRole(roleId: string): Role | null {
    return this.roles.get(roleId) || null;
  }

  /**
   * List all permissions
   */
  listPermissions(): Permission[] {
    return Array.from(this.permissions.values());
  }

  /**
   * List all roles
   */
  listRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  /**
   * Delete permission
   */
  deletePermission(permissionId: string): boolean {
    if (!this.permissions.has(permissionId)) return false;

    // Remove from all roles
    for (const role of this.roles.values()) {
      const index = role.permissions.indexOf(permissionId);
      if (index > -1) {
        role.permissions.splice(index, 1);
      }
    }

    this.permissions.delete(permissionId);
    this.invalidatePermissionCache();

    return true;
  }

  /**
   * Delete role
   */
  deleteRole(roleId: string): boolean {
    if (!this.roles.has(roleId)) return false;

    // Remove from all users
    for (const roleIds of this.roleAssignments.values()) {
      roleIds.delete(roleId);
    }

    // Remove as parent role
    for (const role of this.roles.values()) {
      if (role.parentRole === roleId) {
        role.parentRole = undefined;
      }
    }

    this.roles.delete(roleId);
    this.invalidatePermissionCache();

    return true;
  }

  /**
   * Invalidate permission cache
   */
  private invalidatePermissionCache(): void {
    this.permissionCache.clear();
  }

  /**
   * Generate unique ID
   */
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.permissions.clear();
    this.roles.clear();
    this.roleAssignments.clear();
    this.permissionCache.clear();
  }
}

export default PermissionManager;
