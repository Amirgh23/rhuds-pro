# Phase 11 Week 2 - Quick Reference Guide

**تاریخ**: 1 جولای 2026  
**هفته**: 2 از 4  
**فیچرهای تکمیل شده**: 5 از 15

---

## 🚀 شروع سریع

### User Store

```typescript
import UserStore from '@rhuds/charts';

// Create store
const store = new UserStore();

// Create user
const user = store.createUser({
  email: 'user@example.com',
  name: 'John Doe',
  roles: ['admin'],
});

// Get user
const retrieved = store.getUser(user.id);

// Update user
store.updateUser(user.id, {
  name: 'Jane Doe',
  roles: ['editor'],
});

// List users
const users = store.listUsers({
  roles: ['admin'],
  isActive: true,
});

// Delete user
store.deleteUser(user.id);

// Get users by role
const admins = store.getUsersByRole('admin');

// Update last login
store.updateLastLogin(user.id);

// Get counts
const total = store.getUserCount();
const active = store.getActiveUserCount();
```

### Permission Manager

```typescript
import PermissionManager from '@rhuds/charts';

// Create manager
const manager = new PermissionManager();

// Create permission
const readPerm = manager.createPermission({
  name: 'read',
  description: 'Read permission',
  resource: 'chart',
  action: 'read',
});

// Create role
const viewerRole = manager.createRole({
  name: 'viewer',
  description: 'Viewer role',
  permissions: [],
});

// Add permission to role
manager.addPermissionToRole(viewerRole.id, readPerm.id);

// Assign role to user
manager.assignRoleToUser('user1', viewerRole.id);

// Check permission
const hasPermission = manager.hasPermission('user1', readPerm.id);

// Check access
const canAccess = manager.canAccess('user1', 'chart', 'read');

// Get user permissions
const permissions = manager.getUserPermissions('user1');

// Get user roles
const roles = manager.getUserRoles('user1');

// Remove role from user
manager.removeRoleFromUser('user1', viewerRole.id);

// List permissions and roles
const allPerms = manager.listPermissions();
const allRoles = manager.listRoles();
```

### Audit Store

```typescript
import AuditStore from '@rhuds/charts';

// Create store
const auditStore = new AuditStore();

// Add audit log
const log = auditStore.addLog({
  timestamp: new Date(),
  userId: 'user1',
  action: 'create',
  resource: 'chart',
  status: 'success',
  changes: { name: 'New Chart' },
});

// Get log by ID
const retrieved = auditStore.getLog(log.id);

// Query logs
const logs = auditStore.queryLogs({
  userId: 'user1',
  action: 'create',
  status: 'success',
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  limit: 100,
});

// Get logs by user
const userLogs = auditStore.getLogsByUser('user1');

// Get logs by resource
const chartLogs = auditStore.getLogsByResource('chart');

// Get logs by action
const createLogs = auditStore.getLogsByAction('create');

// Get statistics
const stats = auditStore.getStatistics();

// Get recent logs
const recent = auditStore.getRecentLogs(50);

// Get logs for date range
const rangeLogs = auditStore.getLogsByDateRange(
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  new Date()
);

// Delete old logs
const deleted = auditStore.deleteOldLogs(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));

// Export logs
const exported = auditStore.exportLogs();

// Get log count
const count = auditStore.getLogCount();
```

---

## 📚 Common Patterns

### User Management Pattern

```typescript
// Create and manage users
const store = new UserStore();

// Create admin user
const admin = store.createUser({
  email: 'admin@example.com',
  name: 'Administrator',
  roles: ['admin'],
});

// Create editor user
const editor = store.createUser({
  email: 'editor@example.com',
  name: 'Editor',
  roles: ['editor'],
});

// Create viewer user
const viewer = store.createUser({
  email: 'viewer@example.com',
  name: 'Viewer',
  roles: ['viewer'],
});

// List all users
const allUsers = store.listUsers();

// List users by role
const admins = store.listUsers({ roles: ['admin'] });
const editors = store.listUsers({ roles: ['editor'] });
```

### RBAC Pattern

```typescript
// Setup RBAC
const manager = new PermissionManager();

// Create permissions
const readPerm = manager.createPermission({
  name: 'read',
  description: 'Read charts',
  resource: 'chart',
  action: 'read',
});

const writePerm = manager.createPermission({
  name: 'write',
  description: 'Write charts',
  resource: 'chart',
  action: 'write',
});

const deletePerm = manager.createPermission({
  name: 'delete',
  description: 'Delete charts',
  resource: 'chart',
  action: 'delete',
});

// Create roles
const viewerRole = manager.createRole({
  name: 'viewer',
  description: 'Can view charts',
  permissions: [readPerm.id],
});

const editorRole = manager.createRole({
  name: 'editor',
  description: 'Can edit charts',
  permissions: [readPerm.id, writePerm.id],
});

const adminRole = manager.createRole({
  name: 'admin',
  description: 'Full access',
  permissions: [readPerm.id, writePerm.id, deletePerm.id],
});

// Assign roles to users
manager.assignRoleToUser('user1', viewerRole.id);
manager.assignRoleToUser('user2', editorRole.id);
manager.assignRoleToUser('user3', adminRole.id);

// Check access
if (manager.canAccess('user1', 'chart', 'read')) {
  // User can read charts
}

if (manager.canAccess('user2', 'chart', 'write')) {
  // User can write charts
}

if (manager.canAccess('user3', 'chart', 'delete')) {
  // User can delete charts
}
```

### Audit Logging Pattern

```typescript
// Setup audit logging
const auditStore = new AuditStore();

// Log user actions
function logAction(userId, action, resource, status, changes) {
  auditStore.addLog({
    timestamp: new Date(),
    userId,
    action,
    resource,
    status,
    changes,
  });
}

// Log chart creation
logAction('user1', 'create', 'chart', 'success', {
  name: 'Sales Chart',
  type: 'bar',
});

// Log chart update
logAction('user1', 'update', 'chart', 'success', {
  name: 'Updated Sales Chart',
});

// Log chart deletion
logAction('user1', 'delete', 'chart', 'success', {
  chartId: 'chart_123',
});

// Get audit trail for user
const userAudit = auditStore.queryLogs({ userId: 'user1' });

// Get statistics
const stats = auditStore.getStatistics();
console.log(`Total events: ${stats.totalEvents}`);
console.log(`Success rate: ${((stats.successCount / stats.totalEvents) * 100).toFixed(2)}%`);
```

---

## 🔗 Related Files

- `packages/charts/src/engine/enterprise/UserStore.ts`
- `packages/charts/src/engine/enterprise/PermissionManager.ts`
- `packages/charts/src/engine/enterprise/AuditStore.ts`
- `packages/charts/src/__tests__/integration/phase-11-week-2-enterprise.test.ts`

---

## 📞 Support

For issues or questions:

1. Check the test files for examples
2. Review the implementation summary
3. Check the inline documentation
4. Open an issue on GitHub

---

**تاریخ**: 1 جولای 2026  
**وضعیت**: ✅ COMPLETE  
**فیچرهای**: 5 از 15
