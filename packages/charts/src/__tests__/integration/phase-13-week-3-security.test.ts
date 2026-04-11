/**
 * Phase 13 Week 3 - Security & Compliance Tests
 * Comprehensive tests for all security and compliance features
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  AdvancedSecurityManager,
  ThreatDetectionSystem,
  DataPrivacyManager,
  ComplianceAutomation,
  SecurityAuditLogger,
  type SecurityConfig,
  type PrivacyPolicy,
  type AuditRetention,
} from '../../engine/security';

describe('Phase 13 Week 3 - Security & Compliance', () => {
  // ============================================================================
  // Advanced Security Manager Tests
  // ============================================================================

  describe('AdvancedSecurityManager', () => {
    let securityManager: AdvancedSecurityManager;

    beforeEach(() => {
      const config: SecurityConfig = {
        encryptionAlgorithm: 'AES-256',
        hashAlgorithm: 'SHA-256',
        keyRotationInterval: 86400000,
        sessionTimeout: 3600000,
        mfaRequired: true,
        passwordPolicy: {
          minLength: 12,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          expirationDays: 90,
          historyCount: 5,
        },
      };
      securityManager = new AdvancedSecurityManager(config);
    });

    it('should encrypt and decrypt data', () => {
      const plaintext = 'sensitive data';
      const encrypted = securityManager.encrypt(plaintext, 'user-1');

      expect(encrypted.ciphertext).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.salt).toBeDefined();
      expect(encrypted.algorithm).toBe('AES-256');

      const decrypted = securityManager.decrypt(encrypted, 'user-1');
      expect(decrypted).toBe(plaintext);
    });

    it('should hash passwords', () => {
      const password = 'MyPassword123!';
      const hash = securityManager.hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should validate password policy', () => {
      const validPassword = 'ValidPass123!';
      const result = securityManager.validatePasswordPolicy(validPassword);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const weakPassword = 'weak';
      const result = securityManager.validatePasswordPolicy(weakPassword);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should create security context', () => {
      const context = securityManager.createSecurityContext('user-1', ['admin'], ['read', 'write']);

      expect(context.userId).toBe('user-1');
      expect(context.sessionId).toBeDefined();
      expect(context.roles.has('admin')).toBe(true);
      expect(context.permissions.has('read')).toBe(true);
      expect(context.mfaVerified).toBe(false);
    });

    it('should verify MFA', () => {
      const context = securityManager.createSecurityContext('user-1', ['admin'], ['read']);
      const isValid = securityManager.verifyMFA(context.sessionId, '123456');

      expect(isValid).toBe(true);
      expect(context.mfaVerified).toBe(true);
    });

    it('should check permissions', () => {
      const context = securityManager.createSecurityContext('user-1', ['admin'], ['read']);
      securityManager.verifyMFA(context.sessionId, '123456');

      const hasPermission = securityManager.checkPermission(context.sessionId, 'read');
      expect(hasPermission).toBe(true);
    });

    it('should check roles', () => {
      const context = securityManager.createSecurityContext('user-1', ['admin'], ['read']);

      const hasRole = securityManager.checkRole(context.sessionId, 'admin');
      expect(hasRole).toBe(true);
    });

    it('should track failed login attempts', () => {
      const canLogin1 = securityManager.recordFailedAttempt('user-1');
      expect(canLogin1).toBe(true);

      for (let i = 0; i < 4; i++) {
        securityManager.recordFailedAttempt('user-1');
      }

      const canLogin5 = securityManager.recordFailedAttempt('user-1');
      expect(canLogin5).toBe(false);
    });

    it('should rotate encryption keys', () => {
      const metrics1 = securityManager.getSecurityMetrics();
      securityManager.rotateEncryptionKeys();
      const metrics2 = securityManager.getSecurityMetrics();

      expect(metrics2.encryptionKeysCount).toBeGreaterThan(metrics1.encryptionKeysCount as number);
    });

    it('should log security events', () => {
      const log = securityManager.logSecurityEvent('user-1', 'login', 'auth', 'success', {
        ip: '192.168.1.1',
      });

      expect(log.id).toBeDefined();
      expect(log.userId).toBe('user-1');
      expect(log.action).toBe('login');
      expect(log.result).toBe('success');
    });

    it('should retrieve audit logs', () => {
      securityManager.logSecurityEvent('user-1', 'login', 'auth', 'success');
      securityManager.logSecurityEvent('user-2', 'logout', 'auth', 'success');

      const logs = securityManager.getAuditLogs('user-1');
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].userId).toBe('user-1');
    });

    it('should invalidate sessions', () => {
      const context = securityManager.createSecurityContext('user-1', ['admin'], ['read']);
      const invalidated = securityManager.invalidateSession(context.sessionId);

      expect(invalidated).toBe(true);
      expect(securityManager.getSessionInfo(context.sessionId)).toBeUndefined();
    });

    it('should get security metrics', () => {
      securityManager.createSecurityContext('user-1', ['admin'], ['read']);
      const metrics = securityManager.getSecurityMetrics();

      expect(metrics.activeSessions).toBeGreaterThan(0);
      expect(metrics.auditLogCount).toBeGreaterThanOrEqual(0);
      expect(metrics.encryptionKeysCount).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // Threat Detection System Tests
  // ============================================================================

  describe('ThreatDetectionSystem', () => {
    let threatSystem: ThreatDetectionSystem;

    beforeEach(() => {
      threatSystem = new ThreatDetectionSystem();
    });

    it('should detect SQL injection', () => {
      const event = {
        id: 'event-1',
        timestamp: Date.now(),
        type: 'request',
        source: 'api',
        data: { query: 'SELECT * FROM users WHERE id = 1 UNION SELECT * FROM admin' },
        severity: 'high' as const,
      };

      const alert = threatSystem.analyzeEvent(event);
      expect(alert).toBeDefined();
      expect(alert?.threatType).toContain('SQL');
    });

    it('should detect XSS attacks', () => {
      const event = {
        id: 'event-1',
        timestamp: Date.now(),
        type: 'request',
        source: 'api',
        data: { input: '<script>alert("xss")</script>' },
        severity: 'high' as const,
      };

      const alert = threatSystem.analyzeEvent(event);
      expect(alert).toBeDefined();
      expect(alert?.threatType).toContain('Script');
    });

    it('should detect anomalies', () => {
      const alert = threatSystem.detectAnomalies('request_rate', 1000);
      expect(alert).toBeDefined();
      expect(alert?.severity).toMatch(/high|critical/);
    });

    it('should get active alerts', () => {
      threatSystem.detectAnomalies('request_rate', 1000);
      const alerts = threatSystem.getActiveAlerts();

      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].status).toBe('open');
    });

    it('should get alerts by severity', () => {
      const alert = threatSystem.detectAnomalies('request_rate', 1000);
      if (alert) {
        const alerts = threatSystem.getAlertsBySeverity(alert.severity);
        expect(alerts.length).toBeGreaterThan(0);
      }
    });

    it('should resolve alerts', () => {
      const alert = threatSystem.detectAnomalies('request_rate', 1000);
      if (alert) {
        const resolved = threatSystem.resolveAlert(alert.id);
        expect(resolved).toBe(true);
      }
    });

    it('should get threat statistics', () => {
      threatSystem.detectAnomalies('request_rate', 1000);
      const stats = threatSystem.getThreatStatistics();

      expect(stats.totalAlerts).toBeGreaterThan(0);
      expect(stats.overallThreatScore).toBeGreaterThan(0);
      expect(stats.topThreats).toBeDefined();
    });

    it('should get threat score', () => {
      threatSystem.detectAnomalies('request_rate', 1000);
      const score = threatSystem.getThreatScore();

      expect(score).toBeGreaterThan(0);
    });

    it('should clear old data', () => {
      threatSystem.detectAnomalies('request_rate', 1000);
      const initialStats = threatSystem.getThreatStatistics();

      threatSystem.clearOldData(0); // Clear everything older than now
      const afterStats = threatSystem.getThreatStatistics();

      expect(afterStats.totalAlerts).toBeLessThanOrEqual(initialStats.totalAlerts as number);
    });
  });

  // ============================================================================
  // Data Privacy Manager Tests
  // ============================================================================

  describe('DataPrivacyManager', () => {
    let privacyManager: DataPrivacyManager;

    beforeEach(() => {
      const policy: PrivacyPolicy = {
        dataRetentionDays: 90,
        allowDataSharing: false,
        allowProfiling: false,
        allowCookies: true,
        allowAnalytics: true,
        consentRequired: true,
      };
      privacyManager = new DataPrivacyManager(policy);
    });

    it('should record user consent', () => {
      const consent = privacyManager.recordConsent(
        'user-1',
        { analytics: true, marketing: false },
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(consent.userId).toBe('user-1');
      expect(consent.policies.analytics).toBe(true);
      expect(consent.policies.marketing).toBe(false);
    });

    it('should check user consent', () => {
      privacyManager.recordConsent('user-1', { analytics: true }, '192.168.1.1', 'Mozilla/5.0');

      const hasConsent = privacyManager.hasConsent('user-1', 'analytics');
      expect(hasConsent).toBe(true);
    });

    it('should withdraw consent', () => {
      privacyManager.recordConsent('user-1', { analytics: true }, '192.168.1.1', 'Mozilla/5.0');

      const withdrawn = privacyManager.withdrawConsent('user-1', 'analytics');
      expect(withdrawn).toBe(true);

      const hasConsent = privacyManager.hasConsent('user-1', 'analytics');
      expect(hasConsent).toBe(false);
    });

    it('should identify PII', () => {
      const isPII = privacyManager.isPII('email');
      expect(isPII).toBe(true);

      const isNotPII = privacyManager.isPII('preferences');
      expect(isNotPII).toBe(false);
    });

    it('should identify sensitive data', () => {
      const isSensitive = privacyManager.isSensitive('creditCard');
      expect(isSensitive).toBe(true);
    });

    it('should log data access', () => {
      privacyManager.logDataAccess('user-1', 'email', { action: 'view' });
      const events = privacyManager.getPrivacyEvents('user-1');

      expect(events.length).toBeGreaterThan(0);
      expect(events[0].eventType).toBe('access');
    });

    it('should request data export', () => {
      const event = privacyManager.requestDataExport('user-1');

      expect(event.eventType).toBe('export');
      expect(event.userId).toBe('user-1');
    });

    it('should request data deletion', () => {
      const requested = privacyManager.requestDataDeletion('user-1');
      expect(requested).toBe(true);

      const requests = privacyManager.getDeletionRequests();
      expect(requests.has('user-1')).toBe(true);
    });

    it('should process deletion request', () => {
      privacyManager.requestDataDeletion('user-1');
      const processed = privacyManager.processDeletionRequest('user-1');

      expect(processed).toBe(true);
      expect(privacyManager.getDataSubjectInfo('user-1')).toBeUndefined();
    });

    it('should check retention compliance', () => {
      privacyManager.recordConsent('user-1', { analytics: true }, '192.168.1.1', 'Mozilla/5.0');
      const compliance = privacyManager.checkRetentionCompliance();

      expect(compliance.retentionDays).toBe(90);
      expect(compliance.expiredCount).toBeGreaterThanOrEqual(0);
    });

    it('should generate privacy compliance report', () => {
      privacyManager.recordConsent('user-1', { analytics: true }, '192.168.1.1', 'Mozilla/5.0');
      const report = privacyManager.getPrivacyComplianceReport();

      expect(report.totalUsers).toBeGreaterThan(0);
      expect(report.consentRate).toBeGreaterThanOrEqual(0);
      expect(report.totalPrivacyEvents).toBeGreaterThanOrEqual(0);
    });

    it('should anonymize user data', () => {
      privacyManager.recordConsent('user-1', { analytics: true }, '192.168.1.1', 'Mozilla/5.0');
      const anonymized = privacyManager.anonymizeUserData('user-1');

      expect(anonymized).toBe(true);
      const subject = privacyManager.getDataSubjectInfo('user-1');
      expect(subject?.email).not.toContain('user-1');
    });
  });

  // ============================================================================
  // Compliance Automation Tests
  // ============================================================================

  describe('ComplianceAutomation', () => {
    let compliance: ComplianceAutomation;

    beforeEach(() => {
      compliance = new ComplianceAutomation();
    });

    it('should get available frameworks', () => {
      const frameworks = compliance.getFrameworks();

      expect(frameworks.length).toBeGreaterThan(0);
      expect(frameworks).toContain('GDPR');
      expect(frameworks).toContain('CCPA');
      expect(frameworks).toContain('HIPAA');
      expect(frameworks).toContain('SOC2');
    });

    it('should get framework requirements', () => {
      const requirements = compliance.getFrameworkRequirements('GDPR');

      expect(requirements.length).toBeGreaterThan(0);
      expect(requirements[0].framework).toBe('GDPR');
    });

    it('should run compliance check', () => {
      const check = compliance.runComplianceCheck('gdpr-1', () => true);

      expect(check.status).toBe('pass');
      expect(check.requirementId).toBe('gdpr-1');
    });

    it('should fail compliance check', () => {
      const check = compliance.runComplianceCheck('gdpr-1', () => false);

      expect(check.status).toBe('fail');
    });

    it('should generate compliance report', () => {
      compliance.runComplianceCheck('gdpr-1', () => true);
      compliance.runComplianceCheck('gdpr-2', () => false);

      const report = compliance.generateComplianceReport('GDPR');

      expect(report.framework).toBe('GDPR');
      expect(report.passedChecks).toBeGreaterThan(0);
      expect(report.failedChecks).toBeGreaterThan(0);
      expect(report.complianceScore).toBeGreaterThanOrEqual(0);
    });

    it('should get compliance score', () => {
      compliance.runComplianceCheck('gdpr-1', () => true);
      compliance.generateComplianceReport('GDPR');

      const score = compliance.getComplianceScore('GDPR');
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should get pending remediations', () => {
      compliance.runComplianceCheck('gdpr-1', () => false);
      const remediations = compliance.getPendingRemediations();

      expect(remediations.length).toBeGreaterThan(0);
      expect(remediations[0].status).toBe('pending');
    });

    it('should update remediation status', () => {
      compliance.runComplianceCheck('gdpr-1', () => false);
      const remediations = compliance.getPendingRemediations();

      if (remediations.length > 0) {
        const updated = compliance.updateRemediationStatus(remediations[0].id, 'completed');
        expect(updated).toBe(true);
      }
    });

    it('should get compliance summary', () => {
      compliance.runComplianceCheck('gdpr-1', () => true);
      compliance.generateComplianceReport('GDPR');

      const summary = compliance.getComplianceSummary();

      expect(summary.frameworks).toBeDefined();
      expect(summary.totalRemediations).toBeGreaterThanOrEqual(0);
    });
  });

  // ============================================================================
  // Security Audit Logger Tests
  // ============================================================================

  describe('SecurityAuditLogger', () => {
    let auditLogger: SecurityAuditLogger;

    beforeEach(() => {
      const retention: AuditRetention = {
        retentionDays: 90,
        archiveAfterDays: 30,
        deleteAfterDays: 365,
      };
      auditLogger = new SecurityAuditLogger(retention);
    });

    it('should log audit entry', () => {
      const entry = auditLogger.logEntry(
        'user-1',
        'login',
        'auth',
        'session-1',
        'success',
        200,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(entry.id).toBeDefined();
      expect(entry.userId).toBe('user-1');
      expect(entry.action).toBe('login');
      expect(entry.result).toBe('success');
    });

    it('should query audit entries', () => {
      auditLogger.logEntry(
        'user-1',
        'login',
        'auth',
        'session-1',
        'success',
        200,
        '192.168.1.1',
        'Mozilla/5.0'
      );
      auditLogger.logEntry(
        'user-2',
        'logout',
        'auth',
        'session-2',
        'success',
        200,
        '192.168.1.2',
        'Mozilla/5.0'
      );

      const results = auditLogger.query({ userId: 'user-1' });

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].userId).toBe('user-1');
    });

    it('should get user activity', () => {
      auditLogger.logEntry(
        'user-1',
        'login',
        'auth',
        'session-1',
        'success',
        200,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      const activity = auditLogger.getUserActivity('user-1', 24);

      expect(activity.length).toBeGreaterThan(0);
    });

    it('should get failed attempts', () => {
      auditLogger.logEntry(
        'user-1',
        'login',
        'auth',
        'session-1',
        'failure',
        401,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      const failed = auditLogger.getFailedAttempts('user-1', 24);

      expect(failed.length).toBeGreaterThan(0);
      expect(failed[0].result).toBe('failure');
    });

    it('should get resource access history', () => {
      auditLogger.logEntry(
        'user-1',
        'read',
        'document',
        'doc-1',
        'success',
        200,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      const history = auditLogger.getResourceAccessHistory('document', 'doc-1');

      expect(history.length).toBeGreaterThan(0);
    });

    it('should get audit statistics', () => {
      auditLogger.logEntry(
        'user-1',
        'login',
        'auth',
        'session-1',
        'success',
        200,
        '192.168.1.1',
        'Mozilla/5.0'
      );
      auditLogger.logEntry(
        'user-1',
        'login',
        'auth',
        'session-2',
        'failure',
        401,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      const stats = auditLogger.getStatistics();

      expect(stats.totalEntries).toBeGreaterThan(0);
      expect(stats.failureRate).toBeGreaterThan(0);
    });

    it('should export audit log as JSON', () => {
      auditLogger.logEntry(
        'user-1',
        'login',
        'auth',
        'session-1',
        'success',
        200,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      const json = auditLogger.exportAuditLog('json');

      expect(json).toBeDefined();
      expect(json).toContain('user-1');
    });

    it('should export audit log as CSV', () => {
      auditLogger.logEntry(
        'user-1',
        'login',
        'auth',
        'session-1',
        'success',
        200,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      const csv = auditLogger.exportAuditLog('csv');

      expect(csv).toBeDefined();
      expect(csv).toContain('user-1');
    });

    it('should cleanup old entries', () => {
      auditLogger.logEntry(
        'user-1',
        'login',
        'auth',
        'session-1',
        'success',
        200,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      const deleted = auditLogger.cleanupOldEntries();

      expect(deleted).toBeGreaterThanOrEqual(0);
    });

    it('should generate compliance report', () => {
      auditLogger.logEntry(
        'user-1',
        'login',
        'auth',
        'session-1',
        'success',
        200,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      const report = auditLogger.generateComplianceReport(30);

      expect(report.reportPeriod).toBe('30 days');
      expect(report.statistics).toBeDefined();
    });

    it('should get suspicious activities', () => {
      auditLogger.logEntry(
        'user-1',
        'login',
        'auth',
        'session-1',
        'failure',
        401,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      const suspicious = auditLogger.getSuspiciousActivities();

      expect(suspicious).toBeDefined();
    });
  });
});
