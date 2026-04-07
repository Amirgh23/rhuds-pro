/**
 * Phase 11 Week 2 - Enterprise Features Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import UserStore, { User, CreateUserInput } from '../../engine/enterprise/UserStore';
import PermissionManager, { Permission, Role } from '../../engine/enterprise/PermissionManager';
import AuditStore, { AuditLog } from '../../engine/enterprise/AuditStore';

describe('Phase 11 Week 2 - Enterprise Features', () => {
  describe('User Store', () => {
    let store: UserStore;

    beforeEach(() => {
      store = new UserStore();
    });

    it('should create user', () => {
      const input: CreateUserInput = {
        email: 'user@example.com',
        name: 'Test User',
        roles: ['admin'],
      };

      const user = store.createUser(input);

      expect(user).toBeDefined();
      expect(user.email).toBe('user@example.com');
      expect(user.name).toBe('Test User');
      expect(user.roles).toContain('admin');
      expect(user.isActive).toBe(true);
    });

    it('should get user by ID', () => {
      const input: CreateUserInput = {
        email: 'user@example.com',
        name: 'Test User',
      };

      const created = store.createUser(input);
      const retrieved = store.getUser(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.email).toBe('user@example.com');
    });

    it('should get user by email', () => {
      const input: CreateUserInput = {
        email: 'user@example.com',
        name: 'Test User',
      };

      store.createUser(input);
      const retrieved = store.getUserByEmail('user@example.com');

      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Test User');
    });

    it('should update user', () => {
      const input: CreateUserInput = {
        email: 'user@example.com',
        name: 'Test User',
      };

      const created = store.createUser(input);
      const updated = store.updateUser(created.id, {
        name: 'Updated User',
        roles: ['editor'],
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Updated User');
      expect(updated?.roles).toContain('editor');
    });

    it('should delete user', () => {
      const input: CreateUserInput = {
        email: 'user@example.com',
        name: 'Test User',
      };

      const created = store.createUser(input);
      const deleted = store.deleteUser(created.id);

      expect(deleted).toBe(true);
      expect(store.getUser(created.id)).toBeNull();
    });

    it('should list users', () => {
      store.createUser({ email: 'user1@example.com', name: 'User 1' });
      store.createUser({ email: 'user2@example.com', name: 'User 2' });
      store.createUser({ email: 'user3@example.com', name: 'User 3' });

      const users = store.listUsers();

      expect(users.length).toBe(3);
    });

    it('should filter users by search', () => {
      store.createUser({ email: 'john@example.com', name: 'John Doe' });
      store.createUser({ email: 'jane@example.com', name: 'Jane Smith' });

      const results = store.listUsers({ search: 'john' });

      expect(results.length).toBe(1);
      expect(results[0].name).toBe('John Doe');
    });

    it('should filter users by role', () => {
      store.createUser({ email: 'admin@example.com', name: 'Admin', roles: ['admin'] });
      store.createUser({ email: 'editor@example.com', name: 'Editor', roles: ['editor'] });

      const results = store.listUsers({ roles: ['admin'] });

      expect(results.length).toBe(1);
      expect(results[0].roles).toContain('admin');
    });

    it('should get users by role', () => {
      store.createUser({ email: 'admin1@example.com', name: 'Admin 1', roles: ['admin'] });
      store.createUser({ email: 'admin2@example.com', name: 'Admin 2', roles: ['admin'] });
      store.createUser({ email: 'editor@example.com', name: 'Editor', roles: ['editor'] });

      const admins = store.getUsersByRole('admin');

      expect(admins.length).toBe(2);
    });

    it('should update last login', () => {
      const user = store.createUser({ email: 'user@example.com', name: 'User' });
      const beforeLogin = user.lastLogin;

      store.updateLastLogin(user.id);
      const updated = store.getUser(user.id);

      expect(updated?.lastLogin).toBeDefined();
      expect(updated?.lastLogin).not.toBe(beforeLogin);
    });

    it('should count users', () => {
      store.createUser({ email: 'user1@example.com', name: 'User 1' });
      store.createUser({ email: 'user2@example.com', name: 'User 2' });

      expect(store.getUserCount()).toBe(2);
    });

    it('should count active users', () => {
      const user1 = store.createUser({ email: 'user1@example.com', name: 'User 1' });
      store.createUser({ email: 'user2@example.com', name: 'User 2' });

      store.updateUser(user1.id, { isActive: false });

      expect(store.getActiveUserCount()).toBe(1);
    });
  });

  describe('Permission Manager', () => {
    let manager: PermissionManager;

    beforeEach(() => {
      manager = new PermissionManager();
    });

    it('should create permission', () => {
      const perm = manager.createPermission({
        name: 'read',
        description: 'Read permission',
        resource: 'chart',
        action: 'read',
      });

      expect(perm).toBeDefined();
      expect(perm.name).toBe('read');
      expect(perm.resource).toBe('chart');
    });

    it('should create role', () => {
      const role = manager.createRole({
        name: 'admin',
        description: 'Administrator role',
        permissions: [],
      });

      expect(role).toBeDefined();
      expect(role.name).toBe('admin');
    });

    it('should add permission to role', () => {
      const perm = manager.createPermission({
        name: 'read',
        description: 'Read',
        resource: 'chart',
        action: 'read',
      });

      const role = manager.createRole({
        name: 'viewer',
        description: 'Viewer',
        permissions: [],
      });

      const added = manager.addPermissionToRole(role.id, perm.id);

      expect(added).toBe(true);
      expect(role.permissions).toContain(perm.id);
    });

    it('should assign role to user', () => {
      const role = manager.createRole({
        name: 'admin',
        description: 'Admin',
        permissions: [],
      });

      const assigned = manager.assignRoleToUser('user1', role.id);

      expect(assigned).toBe(true);
    });

    it('should get user permissions', () => {
      const perm1 = manager.createPermission({
        name: 'read',
        description: 'Read',
        resource: 'chart',
        action: 'read',
      });

      const perm2 = manager.createPermission({
        name: 'write',
        description: 'Write',
        resource: 'chart',
        action: 'write',
      });

      const role = manager.createRole({
        name: 'editor',
        description: 'Editor',
        permissions: [perm1.id, perm2.id],
      });

      manager.assignRoleToUser('user1', role.id);
      const perms = manager.getUserPermissions('user1');

      expect(perms.has(perm1.id)).toBe(true);
      expect(perms.has(perm2.id)).toBe(true);
    });

    it('should check permission', () => {
      const perm = manager.createPermission({
        name: 'read',
        description: 'Read',
        resource: 'chart',
        action: 'read',
      });

      const role = manager.createRole({
        name: 'viewer',
        description: 'Viewer',
        permissions: [perm.id],
      });

      manager.assignRoleToUser('user1', role.id);
      const hasPermission = manager.hasPermission('user1', perm.id);

      expect(hasPermission).toBe(true);
    });

    it('should check access', () => {
      const perm = manager.createPermission({
        name: 'read',
        description: 'Read',
        resource: 'chart',
        action: 'read',
      });

      const role = manager.createRole({
        name: 'viewer',
        description: 'Viewer',
        permissions: [perm.id],
      });

      manager.assignRoleToUser('user1', role.id);
      const canAccess = manager.canAccess('user1', 'chart', 'read');

      expect(canAccess).toBe(true);
    });

    it('should get user roles', () => {
      const role1 = manager.createRole({
        name: 'admin',
        description: 'Admin',
        permissions: [],
      });

      const role2 = manager.createRole({
        name: 'editor',
        description: 'Editor',
        permissions: [],
      });

      manager.assignRoleToUser('user1', role1.id);
      manager.assignRoleToUser('user1', role2.id);

      const roles = manager.getUserRoles('user1');

      expect(roles.length).toBe(2);
    });

    it('should remove role from user', () => {
      const role = manager.createRole({
        name: 'admin',
        description: 'Admin',
        permissions: [],
      });

      manager.assignRoleToUser('user1', role.id);
      const removed = manager.removeRoleFromUser('user1', role.id);

      expect(removed).toBe(true);
      expect(manager.getUserRoles('user1').length).toBe(0);
    });

    it('should list permissions', () => {
      manager.createPermission({
        name: 'read',
        description: 'Read',
        resource: 'chart',
        action: 'read',
      });

      manager.createPermission({
        name: 'write',
        description: 'Write',
        resource: 'chart',
        action: 'write',
      });

      const perms = manager.listPermissions();

      expect(perms.length).toBe(2);
    });

    it('should list roles', () => {
      manager.createRole({
        name: 'admin',
        description: 'Admin',
        permissions: [],
      });

      manager.createRole({
        name: 'editor',
        description: 'Editor',
        permissions: [],
      });

      const roles = manager.listRoles();

      expect(roles.length).toBe(2);
    });
  });

  describe('Audit Store', () => {
    let store: AuditStore;

    beforeEach(() => {
      store = new AuditStore();
    });

    it('should add audit log', () => {
      const log = store.addLog({
        timestamp: new Date(),
        userId: 'user1',
        action: 'create',
        resource: 'chart',
        status: 'success',
      });

      expect(log).toBeDefined();
      expect(log.userId).toBe('user1');
      expect(log.action).toBe('create');
    });

    it('should get log by ID', () => {
      const added = store.addLog({
        timestamp: new Date(),
        userId: 'user1',
        action: 'create',
        resource: 'chart',
        status: 'success',
      });

      const retrieved = store.getLog(added.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.userId).toBe('user1');
    });

    it('should query logs', () => {
      store.addLog({
        timestamp: new Date(),
        userId: 'user1',
        action: 'create',
        resource: 'chart',
        status: 'success',
      });

      store.addLog({
        timestamp: new Date(),
        userId: 'user2',
        action: 'delete',
        resource: 'chart',
        status: 'failure',
      });

      const results = store.queryLogs({ userId: 'user1' });

      expect(results.length).toBe(1);
      expect(results[0].userId).toBe('user1');
    });

    it('should get logs by user', () => {
      store.addLog({
        timestamp: new Date(),
        userId: 'user1',
        action: 'create',
        resource: 'chart',
        status: 'success',
      });

      store.addLog({
        timestamp: new Date(),
        userId: 'user1',
        action: 'update',
        resource: 'chart',
        status: 'success',
      });

      const logs = store.getLogsByUser('user1');

      expect(logs.length).toBe(2);
    });

    it('should get statistics', () => {
      store.addLog({
        timestamp: new Date(),
        userId: 'user1',
        action: 'create',
        resource: 'chart',
        status: 'success',
      });

      store.addLog({
        timestamp: new Date(),
        userId: 'user2',
        action: 'delete',
        resource: 'chart',
        status: 'failure',
      });

      const stats = store.getStatistics();

      expect(stats.totalEvents).toBe(2);
      expect(stats.successCount).toBe(1);
      expect(stats.failureCount).toBe(1);
      expect(stats.uniqueUsers).toBe(2);
    });

    it('should get recent logs', () => {
      for (let i = 0; i < 5; i++) {
        store.addLog({
          timestamp: new Date(),
          userId: `user${i}`,
          action: 'create',
          resource: 'chart',
          status: 'success',
        });
      }

      const recent = store.getRecentLogs(3);

      expect(recent.length).toBe(3);
    });

    it('should delete old logs', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      store.addLog({
        timestamp: yesterday,
        userId: 'user1',
        action: 'create',
        resource: 'chart',
        status: 'success',
      });

      store.addLog({
        timestamp: now,
        userId: 'user2',
        action: 'create',
        resource: 'chart',
        status: 'success',
      });

      const deleted = store.deleteOldLogs(now);

      expect(deleted).toBe(1);
      expect(store.getLogCount()).toBe(1);
    });

    it('should export logs', () => {
      store.addLog({
        timestamp: new Date(),
        userId: 'user1',
        action: 'create',
        resource: 'chart',
        status: 'success',
      });

      const exported = store.exportLogs();

      expect(exported).toBeDefined();
      expect(exported).toContain('user1');
      expect(exported).toContain('create');
    });

    it('should count logs', () => {
      store.addLog({
        timestamp: new Date(),
        userId: 'user1',
        action: 'create',
        resource: 'chart',
        status: 'success',
      });

      store.addLog({
        timestamp: new Date(),
        userId: 'user2',
        action: 'delete',
        resource: 'chart',
        status: 'failure',
      });

      expect(store.getLogCount()).toBe(2);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large number of users', () => {
      const store = new UserStore();
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        store.createUser({
          email: `user${i}@example.com`,
          name: `User ${i}`,
        });
      }

      const end = performance.now();

      expect(end - start).toBeLessThan(500);
      expect(store.getUserCount()).toBe(1000);
    });

    it('should handle large number of permissions', () => {
      const manager = new PermissionManager();
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        manager.createPermission({
          name: `perm${i}`,
          description: `Permission ${i}`,
          resource: `resource${i % 10}`,
          action: `action${i % 5}`,
        });
      }

      const end = performance.now();

      expect(end - start).toBeLessThan(500);
      expect(manager.listPermissions().length).toBe(1000);
    });

    it('should handle large number of audit logs', () => {
      const store = new AuditStore();
      const start = performance.now();

      for (let i = 0; i < 10000; i++) {
        store.addLog({
          timestamp: new Date(),
          userId: `user${i % 100}`,
          action: `action${i % 10}`,
          resource: `resource${i % 5}`,
          status: i % 2 === 0 ? 'success' : 'failure',
        });
      }

      const end = performance.now();

      expect(end - start).toBeLessThan(1000);
      expect(store.getLogCount()).toBe(10000);
    });
  });
});
