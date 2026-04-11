/**
 * Access Control Manager
 * Manages role-based access control and permissions
 */

/**
 * Role
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: number;
}

/**
 * Permission
 */
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

/**
 * User role assignment
 */
export interface UserRoleAssignment {
  userId: string;
  roleId: string;
  assignedAt: number;
  expiresAt?: number;
}

/**
 * Access control policy
 */
export interface AccessControlPolicy {
  id: string;
  name: string;
  rules: AccessControlRule[];
  enabled: boolean;
}

/**
 * Access control rule
 */
export interface AccessControlRule {
  id: string;
  resource: string;
  action: string;
  allowedRoles: string[];
  denyRoles: string[];
}

/**
 * Access Control Manager
 * Manages RBAC and permissions
 */
export class AccessControlManager {
  private roles: Map<string, Role> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private userRoles: Map<string, UserRoleAssignment[]> = new Map();
  private policies: Map<string, AccessControlPolicy> = new Map();
  private accessLog: Array<{
    timestamp: number;
    userId: string;
    resource: string;
    action: string;
    allowed: boolean;
  }> = [];

  /**
   * Create role
   */
  createRole(name: string, description: string, permissions: string[] = []): Role {
    const id = `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const role: Role = {
      id,
      name,
      description,
      permissions,
      createdAt: Date.now(),
    };

    this.roles.set(id, role);
    return role;
  }

  /**
   * Create permission
   */
  createPermission(
    name: string,
    resource: string,
    action: string,
    description: string
  ): Permission {
    const id = `perm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const permission: Permission = {
      id,
      name,
      resource,
      action,
      description,
    };

    this.permissions.set(id, permission);
    return permission;
  }

  /**
   * Assign role to user
   */
  assignRoleToUser(userId: string, roleId: string, expiresInDays?: number): UserRoleAssignment {
    const role = this.roles.get(roleId);
    if (!role) {
      throw new Error(`Role not found: ${roleId}`);
    }

    const assignment: UserRoleAssignment = {
      userId,
      roleId,
      assignedAt: Date.now(),
      expiresAt: expiresInDays ? Date.now() + expiresInDays * 24 * 60 * 60 * 1000 : undefined,
    };

    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, []);
    }

    this.userRoles.get(userId)!.push(assignment);
    return assignment;
  }

  /**
   * Remove role from user
   */
  removeRoleFromUser(userId: string, roleId: string): boolean {
    const assignments = this.userRoles.get(userId);
    if (!assignments) return false;

    const index = assignments.findIndex((a) => a.roleId === roleId);
    if (index === -1) return false;

    assignments.splice(index, 1);
    return true;
  }

  /**
   * Check access
   */
  checkAccess(userId: string, resource: string, action: string): boolean {
    const assignments = this.userRoles.get(userId) || [];
    const now = Date.now();

    // Check if any role assignment is valid and has permission
    for (const assignment of assignments) {
      // Check expiration
      if (assignment.expiresAt && assignment.expiresAt < now) {
        continue;
      }

      const role = this.roles.get(assignment.roleId);
      if (!role) continue;

      // Check if role has permission
      const hasPermission = role.permissions.some((permId) => {
        const perm = this.permissions.get(permId);
        return perm && perm.resource === resource && perm.action === action;
      });

      if (hasPermission) {
        this.logAccess(userId, resource, action, true);
        return true;
      }
    }

    this.logAccess(userId, resource, action, false);
    return false;
  }

  /**
   * Log access attempt
   */
  private logAccess(userId: string, resource: string, action: string, allowed: boolean): void {
    this.accessLog.push({
      timestamp: Date.now(),
      userId,
      resource,
      action,
      allowed,
    });

    // Keep only last 10000 entries
    if (this.accessLog.length > 10000) {
      this.accessLog.shift();
    }
  }

  /**
   * Get user roles
   */
  getUserRoles(userId: string): Role[] {
    const assignments = this.userRoles.get(userId) || [];
    const now = Date.now();

    return assignments
      .filter((a) => !a.expiresAt || a.expiresAt >= now)
      .map((a) => this.roles.get(a.roleId))
      .filter((r) => r !== undefined) as Role[];
  }

  /**
   * Get user permissions
   */
  getUserPermissions(userId: string): Permission[] {
    const roles = this.getUserRoles(userId);
    const permissionIds = new Set<string>();

    for (const role of roles) {
      for (const permId of role.permissions) {
        permissionIds.add(permId);
      }
    }

    return Array.from(permissionIds)
      .map((id) => this.permissions.get(id))
      .filter((p) => p !== undefined) as Permission[];
  }

  /**
   * Create access control policy
   */
  createPolicy(name: string, rules: AccessControlRule[] = []): AccessControlPolicy {
    const id = `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const policy: AccessControlPolicy = {
      id,
      name,
      rules,
      enabled: true,
    };

    this.policies.set(id, policy);
    return policy;
  }

  /**
   * Add rule to policy
   */
  addRuleToPolicy(policyId: string, rule: AccessControlRule): boolean {
    const policy = this.policies.get(policyId);
    if (!policy) return false;

    policy.rules.push(rule);
    return true;
  }

  /**
   * Get role
   */
  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId);
  }

  /**
   * Get all roles
   */
  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  /**
   * Update role permissions
   */
  updateRolePermissions(roleId: string, permissions: string[]): boolean {
    const role = this.roles.get(roleId);
    if (!role) return false;

    role.permissions = permissions;
    return true;
  }

  /**
   * Get access log
   */
  getAccessLog(
    userId?: string,
    limit?: number
  ): Array<{
    timestamp: number;
    userId: string;
    resource: string;
    action: string;
    allowed: boolean;
  }> {
    let log = this.accessLog;

    if (userId) {
      log = log.filter((l) => l.userId === userId);
    }

    if (limit) {
      return log.slice(-limit);
    }

    return log;
  }

  /**
   * Get denied access attempts
   */
  getDeniedAccessAttempts(
    limit?: number
  ): Array<{
    timestamp: number;
    userId: string;
    resource: string;
    action: string;
    allowed: boolean;
  }> {
    const denied = this.accessLog.filter((l) => !l.allowed);

    if (limit) {
      return denied.slice(-limit);
    }

    return denied;
  }

  /**
   * Get access statistics
   */
  getAccessStatistics(): Record<string, unknown> {
    const total = this.accessLog.length;
    const allowed = this.accessLog.filter((l) => l.allowed).length;
    const denied = this.accessLog.filter((l) => !l.allowed).length;

    const uniqueUsers = new Set(this.accessLog.map((l) => l.userId)).size;
    const uniqueResources = new Set(this.accessLog.map((l) => l.resource)).size;

    return {
      total,
      allowed,
      denied,
      allowRate: total > 0 ? (allowed / total) * 100 : 0,
      denyRate: total > 0 ? (denied / total) * 100 : 0,
      uniqueUsers,
      uniqueResources,
    };
  }

  /**
   * Export access log
   */
  exportAccessLog(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.accessLog, null, 2);
    }

    // CSV format
    const headers = ['Timestamp', 'User ID', 'Resource', 'Action', 'Allowed'];
    const rows = this.accessLog.map((l) => [
      l.timestamp,
      l.userId,
      l.resource,
      l.action,
      l.allowed,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Cleanup expired role assignments
   */
  cleanupExpiredAssignments(): number {
    const now = Date.now();
    let removed = 0;

    for (const [userId, assignments] of this.userRoles) {
      const filtered = assignments.filter((a) => !a.expiresAt || a.expiresAt >= now);
      removed += assignments.length - filtered.length;
      this.userRoles.set(userId, filtered);
    }

    return removed;
  }
}
