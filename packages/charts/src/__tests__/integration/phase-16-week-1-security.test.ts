/**
 * Phase 16 Week 1 - Advanced Security & Compliance Tests
 * Comprehensive test suite for security and compliance features
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  SecurityAuditSystem,
  type AuditEvent,
  type AuditPolicy,
} from '../../engine/security/SecurityAuditSystem';
import { EncryptionManager, type EncryptionKey } from '../../engine/security/EncryptionManager';
import { ComplianceChecker } from '../../engine/security/ComplianceChecker';
import { VulnerabilityScanner } from '../../engine/security/VulnerabilityScanner';
import {
  AccessControlManager,
  type Role,
  type Permission,
} from '../../engine/security/AccessControlManager';

describe('Phase 16 Week 1 - Advanced Security & Compliance', () => {
  // ============================================================================
  // SecurityAuditSystem Tests
  // ============================================================================

  describe('SecurityAuditSystem', () => {
    let auditSystem: SecurityAuditSystem;

    beforeEach(() => {
      auditSystem = new SecurityAuditSystem();
    });

    it('should create audit policy', () => {
      const policy = auditSystem.createPolicy({
        name: 'User Access Policy',
        enabled: true,
        actions: ['login', 'logout'],
        resources: ['user'],
        retentionDays: 90,
        alertOnFailure: true,
      });

      expect(policy.id).toMatch(/^policy-/);
      expect(policy.name).toBe('User Access Policy');
    });

    it('should log audit event', () => {
      const event = auditSystem.logEvent({
        userId: 'user-123',
        action: 'login',
        resource: 'user',
        resourceId: 'user-123',
        status: 'success',
        details: { ipAddress: '192.168.1.1' },
      });

      expect(event.id).toMatch(/^event-/);
      expect(event.status).toBe('success');
      expect(event.userId).toBe('user-123');
    });

    it('should get events by user', () => {
      auditSystem.logEvent({
        userId: 'user-123',
        action: 'login',
        resource: 'user',
        resourceId: 'user-123',
        status: 'success',
        details: {},
      });

      auditSystem.logEvent({
        userId: 'user-123',
        action: 'logout',
        resource: 'user',
        resourceId: 'user-123',
        status: 'success',
        details: {},
      });

      const events = auditSystem.getEventsByUser('user-123');

      expect(events.length).toBe(2);
    });

    it('should get failed events', () => {
      auditSystem.logEvent({
        userId: 'user-123',
        action: 'login',
        resource: 'user',
        resourceId: 'user-123',
        status: 'success',
        details: {},
      });

      auditSystem.logEvent({
        userId: 'user-456',
        action: 'login',
        resource: 'user',
        resourceId: 'user-456',
        status: 'failure',
        details: { reason: 'Invalid password' },
      });

      const failed = auditSystem.getFailedEvents();

      expect(failed.length).toBe(1);
      expect(failed[0].status).toBe('failure');
    });

    it('should generate compliance report', () => {
      const startTime = Date.now() - 60000;
      const endTime = Date.now();

      auditSystem.logEvent({
        userId: 'user-123',
        action: 'login',
        resource: 'user',
        resourceId: 'user-123',
        status: 'success',
        details: {},
      });

      const report = auditSystem.generateComplianceReport(startTime, endTime);

      expect(report.id).toMatch(/^report-/);
      expect(report.totalEvents).toBeGreaterThan(0);
      expect(report.successfulEvents).toBeGreaterThan(0);
    });

    it('should get audit statistics', () => {
      auditSystem.logEvent({
        userId: 'user-123',
        action: 'login',
        resource: 'user',
        resourceId: 'user-123',
        status: 'success',
        details: {},
      });

      const stats = auditSystem.getStatistics();

      expect(stats.totalEvents).toBe(1);
      expect(stats.successful).toBe(1);
      expect(stats.uniqueUsers).toBe(1);
    });

    it('should export audit log as JSON', () => {
      auditSystem.logEvent({
        userId: 'user-123',
        action: 'login',
        resource: 'user',
        resourceId: 'user-123',
        status: 'success',
        details: {},
      });

      const exported = auditSystem.exportAuditLog('json');

      expect(exported).toContain('user-123');
      expect(exported).toContain('login');
    });

    it('should export audit log as CSV', () => {
      auditSystem.logEvent({
        userId: 'user-123',
        action: 'login',
        resource: 'user',
        resourceId: 'user-123',
        status: 'success',
        details: {},
      });

      const exported = auditSystem.exportAuditLog('csv');

      expect(exported).toContain('ID');
      expect(exported).toContain('user-123');
    });
  });

  // ============================================================================
  // EncryptionManager Tests
  // ============================================================================

  describe('EncryptionManager', () => {
    let encryptionManager: EncryptionManager;

    beforeEach(() => {
      encryptionManager = new EncryptionManager();
    });

    it('should generate encryption key', () => {
      const key = encryptionManager.generateKey('AES-256');

      expect(key.id).toMatch(/^key-/);
      expect(key.algorithm).toBe('AES-256');
      expect(key.active).toBe(true);
    });

    it('should encrypt data', () => {
      const key = encryptionManager.generateKey('AES-256');
      const encrypted = encryptionManager.encryptData('sensitive data', key.id);

      expect(encrypted.id).toMatch(/^encrypted-/);
      expect(encrypted.keyId).toBe(key.id);
      expect(encrypted.ciphertext).toBeDefined();
    });

    it('should decrypt data', () => {
      const key = encryptionManager.generateKey('AES-256');
      const encrypted = encryptionManager.encryptData('sensitive data', key.id);
      const decrypted = encryptionManager.decryptData(encrypted.id);

      expect(decrypted).toBe('sensitive data');
    });

    it('should create encryption policy', () => {
      const policy = encryptionManager.createPolicy({
        name: 'PII Encryption',
        algorithm: 'AES-256',
        dataTypes: ['email', 'phone', 'ssn'],
        enabled: true,
        keyRotationDays: 90,
      });

      expect(policy.id).toMatch(/^policy-/);
      expect(policy.dataTypes).toContain('email');
    });

    it('should rotate key', () => {
      const key1 = encryptionManager.generateKey('AES-256');
      const key2 = encryptionManager.rotateKey(key1.id, 'scheduled');

      expect(key2.id).not.toBe(key1.id);
      expect(key2.active).toBe(true);
      expect(key1.active).toBe(false);
    });

    it('should get active keys', () => {
      encryptionManager.generateKey('AES-256');
      encryptionManager.generateKey('AES-128');

      const activeKeys = encryptionManager.getActiveKeys();

      expect(activeKeys.length).toBe(2);
      expect(activeKeys.every((k) => k.active)).toBe(true);
    });

    it('should get encryption statistics', () => {
      encryptionManager.generateKey('AES-256');
      encryptionManager.generateKey('AES-256');
      encryptionManager.generateKey('AES-128');

      const stats = encryptionManager.getStatistics();

      expect(stats.totalKeys).toBe(3);
      expect(stats.activeKeys).toBe(3);
    });

    it('should validate policy compliance', () => {
      const key = encryptionManager.generateKey('AES-256');
      encryptionManager.createPolicy({
        name: 'PII Encryption',
        algorithm: 'AES-256',
        dataTypes: ['email'],
        enabled: true,
        keyRotationDays: 90,
      });

      const compliant = encryptionManager.validatePolicyCompliance('email', key.id);

      expect(compliant).toBe(true);
    });
  });

  // ============================================================================
  // ComplianceChecker Tests
  // ============================================================================

  describe('ComplianceChecker', () => {
    let complianceChecker: ComplianceChecker;

    beforeEach(() => {
      complianceChecker = new ComplianceChecker();
    });

    it('should run GDPR compliance check', () => {
      const result = complianceChecker.runComplianceCheck('GDPR', {
        dataMinimization: true,
        consentManagement: true,
        dataRetention: true,
      });

      expect(result.framework).toBe('GDPR');
      expect(result.passed).toBe(true);
      expect(result.score).toBe(100);
    });

    it('should detect GDPR violations', () => {
      const result = complianceChecker.runComplianceCheck('GDPR', {
        dataMinimization: false,
        consentManagement: false,
        dataRetention: true,
      });

      expect(result.passed).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should run HIPAA compliance check', () => {
      const result = complianceChecker.runComplianceCheck('HIPAA', {
        accessControls: true,
        encryption: true,
        auditControls: true,
      });

      expect(result.framework).toBe('HIPAA');
      expect(result.passed).toBe(true);
    });

    it('should run SOC2 compliance check', () => {
      const result = complianceChecker.runComplianceCheck('SOC2', {
        securityControls: true,
        availability: true,
        integrity: true,
      });

      expect(result.framework).toBe('SOC2');
      expect(result.passed).toBe(true);
    });

    it('should run PCI-DSS compliance check', () => {
      const result = complianceChecker.runComplianceCheck('PCI-DSS', {
        firewallConfig: true,
        defaultPasswords: false,
        encryption: true,
      });

      expect(result.framework).toBe('PCI-DSS');
      expect(result.passed).toBe(true);
    });

    it('should get compliance score', () => {
      complianceChecker.runComplianceCheck('GDPR', {
        dataMinimization: true,
        consentManagement: true,
        dataRetention: true,
      });

      const score = complianceChecker.getComplianceScore('GDPR');

      expect(score).toBe(100);
    });

    it('should get critical violations', () => {
      complianceChecker.runComplianceCheck('HIPAA', {
        accessControls: false,
        encryption: false,
        auditControls: true,
      });

      const critical = complianceChecker.getCriticalViolations();

      expect(critical.length).toBeGreaterThan(0);
    });

    it('should get compliance summary', () => {
      complianceChecker.runComplianceCheck('GDPR', {
        dataMinimization: true,
        consentManagement: true,
        dataRetention: true,
      });

      const summary = complianceChecker.getComplianceSummary();

      expect(summary.GDPR).toBeDefined();
    });

    it('should export compliance report', () => {
      complianceChecker.runComplianceCheck('GDPR', {
        dataMinimization: true,
        consentManagement: true,
        dataRetention: true,
      });

      const report = complianceChecker.exportComplianceReport('GDPR');

      expect(report).toContain('GDPR');
      expect(report).toContain('framework');
    });
  });

  // ============================================================================
  // VulnerabilityScanner Tests
  // ============================================================================

  describe('VulnerabilityScanner', () => {
    let scanner: VulnerabilityScanner;

    beforeEach(() => {
      scanner = new VulnerabilityScanner();
    });

    it('should run full scan', () => {
      const result = scanner.runFullScan();

      expect(result.id).toMatch(/^scan-/);
      expect(result.scanType).toBe('full');
      expect(result.vulnerabilities.length).toBeGreaterThan(0);
    });

    it('should calculate risk score', () => {
      const result = scanner.runFullScan();

      expect(result.riskScore).toBeGreaterThanOrEqual(0);
      expect(result.riskScore).toBeLessThanOrEqual(100);
    });

    it('should generate scan summary', () => {
      const result = scanner.runFullScan();

      expect(result.summary.total).toBeGreaterThan(0);
      expect(result.summary.byType).toBeDefined();
    });

    it('should get open vulnerabilities', () => {
      scanner.runFullScan();
      const open = scanner.getOpenVulnerabilities();

      expect(open.length).toBeGreaterThan(0);
      expect(open.every((v) => v.status === 'open')).toBe(true);
    });

    it('should get critical vulnerabilities', () => {
      scanner.runFullScan();
      const critical = scanner.getCriticalVulnerabilities();

      expect(critical.every((v) => v.severity === 'critical')).toBe(true);
    });

    it('should update vulnerability status', () => {
      const result = scanner.runFullScan();
      const vulnId = result.vulnerabilities[0].id;

      const updated = scanner.updateVulnerabilityStatus(vulnId, 'resolved');

      expect(updated).toBe(true);
    });

    it('should get vulnerability statistics', () => {
      scanner.runFullScan();
      const stats = scanner.getStatistics();

      expect(stats.total).toBeGreaterThan(0);
      expect(stats.open).toBeGreaterThanOrEqual(0);
    });

    it('should export vulnerability report as JSON', () => {
      scanner.runFullScan();
      const report = scanner.exportVulnerabilityReport('json');

      expect(report).toContain('id');
      expect(report).toContain('severity');
    });

    it('should export vulnerability report as CSV', () => {
      scanner.runFullScan();
      const report = scanner.exportVulnerabilityReport('csv');

      expect(report).toContain('ID');
      expect(report).toContain('Type');
    });

    it('should get scan history', () => {
      scanner.runFullScan();
      scanner.runFullScan();

      const history = scanner.getScanHistory();

      expect(history.length).toBe(2);
    });
  });

  // ============================================================================
  // AccessControlManager Tests
  // ============================================================================

  describe('AccessControlManager', () => {
    let acm: AccessControlManager;

    beforeEach(() => {
      acm = new AccessControlManager();
    });

    it('should create role', () => {
      const role = acm.createRole('Admin', 'Administrator role');

      expect(role.id).toMatch(/^role-/);
      expect(role.name).toBe('Admin');
    });

    it('should create permission', () => {
      const perm = acm.createPermission('read_users', 'user', 'read', 'Read user data');

      expect(perm.id).toMatch(/^perm-/);
      expect(perm.resource).toBe('user');
      expect(perm.action).toBe('read');
    });

    it('should assign role to user', () => {
      const role = acm.createRole('Admin', 'Administrator role');
      const assignment = acm.assignRoleToUser('user-123', role.id);

      expect(assignment.userId).toBe('user-123');
      expect(assignment.roleId).toBe(role.id);
    });

    it('should check access with permission', () => {
      const role = acm.createRole('Admin', 'Administrator role');
      const perm = acm.createPermission('read_users', 'user', 'read', 'Read user data');

      acm.updateRolePermissions(role.id, [perm.id]);
      acm.assignRoleToUser('user-123', role.id);

      const hasAccess = acm.checkAccess('user-123', 'user', 'read');

      expect(hasAccess).toBe(true);
    });

    it('should deny access without permission', () => {
      const role = acm.createRole('User', 'Regular user role');
      acm.assignRoleToUser('user-123', role.id);

      const hasAccess = acm.checkAccess('user-123', 'admin', 'delete');

      expect(hasAccess).toBe(false);
    });

    it('should get user roles', () => {
      const role1 = acm.createRole('Admin', 'Administrator role');
      const role2 = acm.createRole('User', 'Regular user role');

      acm.assignRoleToUser('user-123', role1.id);
      acm.assignRoleToUser('user-123', role2.id);

      const roles = acm.getUserRoles('user-123');

      expect(roles.length).toBe(2);
    });

    it('should get user permissions', () => {
      const role = acm.createRole('Admin', 'Administrator role');
      const perm1 = acm.createPermission('read_users', 'user', 'read', 'Read user data');
      const perm2 = acm.createPermission('write_users', 'user', 'write', 'Write user data');

      acm.updateRolePermissions(role.id, [perm1.id, perm2.id]);
      acm.assignRoleToUser('user-123', role.id);

      const perms = acm.getUserPermissions('user-123');

      expect(perms.length).toBe(2);
    });

    it('should get access log', () => {
      const role = acm.createRole('Admin', 'Administrator role');
      const perm = acm.createPermission('read_users', 'user', 'read', 'Read user data');

      acm.updateRolePermissions(role.id, [perm.id]);
      acm.assignRoleToUser('user-123', role.id);

      acm.checkAccess('user-123', 'user', 'read');
      acm.checkAccess('user-123', 'admin', 'delete');

      const log = acm.getAccessLog();

      expect(log.length).toBe(2);
    });

    it('should get denied access attempts', () => {
      const role = acm.createRole('User', 'Regular user role');
      acm.assignRoleToUser('user-123', role.id);

      acm.checkAccess('user-123', 'admin', 'delete');
      acm.checkAccess('user-123', 'admin', 'delete');

      const denied = acm.getDeniedAccessAttempts();

      expect(denied.length).toBe(2);
      expect(denied.every((d) => !d.allowed)).toBe(true);
    });

    it('should get access statistics', () => {
      const role = acm.createRole('Admin', 'Administrator role');
      const perm = acm.createPermission('read_users', 'user', 'read', 'Read user data');

      acm.updateRolePermissions(role.id, [perm.id]);
      acm.assignRoleToUser('user-123', role.id);

      acm.checkAccess('user-123', 'user', 'read');
      acm.checkAccess('user-123', 'admin', 'delete');

      const stats = acm.getAccessStatistics();

      expect(stats.total).toBe(2);
      expect(stats.allowed).toBe(1);
      expect(stats.denied).toBe(1);
    });

    it('should export access log as JSON', () => {
      const role = acm.createRole('Admin', 'Administrator role');
      acm.assignRoleToUser('user-123', role.id);
      acm.checkAccess('user-123', 'user', 'read');

      const exported = acm.exportAccessLog('json');

      expect(exported).toContain('user-123');
    });

    it('should export access log as CSV', () => {
      const role = acm.createRole('Admin', 'Administrator role');
      acm.assignRoleToUser('user-123', role.id);
      acm.checkAccess('user-123', 'user', 'read');

      const exported = acm.exportAccessLog('csv');

      expect(exported).toContain('Timestamp');
      expect(exported).toContain('user-123');
    });

    it('should cleanup expired role assignments', () => {
      const role = acm.createRole('Admin', 'Administrator role');
      acm.assignRoleToUser('user-123', role.id, -1); // Expired

      const removed = acm.cleanupExpiredAssignments();

      expect(removed).toBe(1);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Tests', () => {
    it('should coordinate audit and access control', () => {
      const auditSystem = new SecurityAuditSystem();
      const acm = new AccessControlManager();

      const role = acm.createRole('Admin', 'Administrator role');
      const perm = acm.createPermission('read_users', 'user', 'read', 'Read user data');
      acm.updateRolePermissions(role.id, [perm.id]);
      acm.assignRoleToUser('user-123', role.id);

      const hasAccess = acm.checkAccess('user-123', 'user', 'read');

      auditSystem.logEvent({
        userId: 'user-123',
        action: 'access_check',
        resource: 'user',
        resourceId: 'user-123',
        status: hasAccess ? 'success' : 'failure',
        details: { allowed: hasAccess },
      });

      const events = auditSystem.getEventsByUser('user-123');

      expect(events.length).toBe(1);
      expect(events[0].status).toBe('success');
    });

    it('should coordinate encryption and compliance', () => {
      const encryptionManager = new EncryptionManager();
      const complianceChecker = new ComplianceChecker();

      const key = encryptionManager.generateKey('AES-256');
      encryptionManager.createPolicy({
        name: 'PII Encryption',
        algorithm: 'AES-256',
        dataTypes: ['email'],
        enabled: true,
        keyRotationDays: 90,
      });

      const result = complianceChecker.runComplianceCheck('GDPR', {
        dataMinimization: true,
        consentManagement: true,
        dataRetention: true,
      });

      expect(result.passed).toBe(true);
      expect(key.active).toBe(true);
    });

    it('should coordinate vulnerability scanning and audit', () => {
      const scanner = new VulnerabilityScanner();
      const auditSystem = new SecurityAuditSystem();

      const scanResult = scanner.runFullScan();

      auditSystem.logEvent({
        userId: 'system',
        action: 'vulnerability_scan',
        resource: 'system',
        resourceId: 'system',
        status: 'success',
        details: {
          vulnerabilities: scanResult.vulnerabilities.length,
          riskScore: scanResult.riskScore,
        },
      });

      const events = auditSystem.getEventsByAction('vulnerability_scan');

      expect(events.length).toBe(1);
    });
  });
});
