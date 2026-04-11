/**
 * Phase 16 Week 4 - Security Orchestration & Compliance Automation Tests
 * Comprehensive test suite for orchestration, compliance, policy enforcement, threat response, and reporting
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SecurityOrchestrationEngine } from '../../engine/security/SecurityOrchestrationEngine';
import { ComplianceAutomationEngine } from '../../engine/security/ComplianceAutomationEngine';
import { SecurityPolicyEnforcer } from '../../engine/security/SecurityPolicyEnforcer';
import { ThreatResponseOrchestrator } from '../../engine/security/ThreatResponseOrchestrator';
import { SecurityReportingEngine } from '../../engine/security/SecurityReportingEngine';

describe('Phase 16 Week 4 - Security Orchestration & Compliance Automation', () => {
  let orchestrationEngine: SecurityOrchestrationEngine;
  let complianceEngine: ComplianceAutomationEngine;
  let policyEnforcer: SecurityPolicyEnforcer;
  let threatOrchestrator: ThreatResponseOrchestrator;
  let reportingEngine: SecurityReportingEngine;

  beforeEach(() => {
    orchestrationEngine = new SecurityOrchestrationEngine();
    complianceEngine = new ComplianceAutomationEngine();
    policyEnforcer = new SecurityPolicyEnforcer();
    threatOrchestrator = new ThreatResponseOrchestrator();
    reportingEngine = new SecurityReportingEngine();
  });

  describe('SecurityOrchestrationEngine', () => {
    it('should create orchestration workflow', () => {
      const workflow = orchestrationEngine.createWorkflow({
        name: 'Incident Response',
        description: 'Automated incident response workflow',
        enabled: true,
        triggers: [
          {
            type: 'alert',
            condition: (data) => (data.severity as string) === 'critical',
          },
        ],
        steps: [
          {
            id: 'step1',
            name: 'Isolate',
            action: 'isolate_system',
            parameters: { timeout: 300 },
            retryCount: 3,
            timeout: 30000,
          },
        ],
        errorHandling: {
          strategy: 'stop',
          notifyOnError: true,
        },
      });

      expect(workflow.id).toBeDefined();
      expect(workflow.name).toBe('Incident Response');
    });

    it('should execute orchestration workflow', async () => {
      const workflow = orchestrationEngine.createWorkflow({
        name: 'Test Workflow',
        description: 'Test',
        enabled: true,
        triggers: [
          {
            type: 'test',
            condition: () => true,
          },
        ],
        steps: [
          {
            id: 'step1',
            name: 'Test Action',
            action: 'test_action',
            parameters: {},
            retryCount: 1,
            timeout: 5000,
          },
        ],
        errorHandling: {
          strategy: 'continue',
          notifyOnError: false,
        },
      });

      orchestrationEngine.registerActionHandler('test_action', async () => ({
        success: true,
      }));

      const execution = await orchestrationEngine.executeWorkflow(workflow.id, {
        severity: 'critical',
      });

      expect(execution).toBeDefined();
      expect(execution?.status).toBe('completed');
    });

    it('should get orchestration statistics', async () => {
      const workflow = orchestrationEngine.createWorkflow({
        name: 'Test',
        description: 'Test',
        enabled: true,
        triggers: [{ type: 'test', condition: () => true }],
        steps: [
          {
            id: 'step1',
            name: 'Test',
            action: 'test',
            parameters: {},
            retryCount: 1,
            timeout: 5000,
          },
        ],
        errorHandling: { strategy: 'stop', notifyOnError: false },
      });

      orchestrationEngine.registerActionHandler('test', async () => ({ success: true }));
      await orchestrationEngine.executeWorkflow(workflow.id, {});

      const stats = orchestrationEngine.getStatistics();
      expect(stats.totalExecutions).toBeGreaterThan(0);
      expect(stats.successRate).toBeGreaterThan(0);
    });

    it('should export orchestration report', async () => {
      const workflow = orchestrationEngine.createWorkflow({
        name: 'Test',
        description: 'Test',
        enabled: true,
        triggers: [{ type: 'test', condition: () => true }],
        steps: [
          {
            id: 'step1',
            name: 'Test',
            action: 'test',
            parameters: {},
            retryCount: 1,
            timeout: 5000,
          },
        ],
        errorHandling: { strategy: 'stop', notifyOnError: false },
      });

      orchestrationEngine.registerActionHandler('test', async () => ({ success: true }));
      await orchestrationEngine.executeWorkflow(workflow.id, {});

      const report = orchestrationEngine.exportOrchestrationReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  describe('ComplianceAutomationEngine', () => {
    it('should create compliance framework', () => {
      const framework = complianceEngine.createFramework({
        name: 'GDPR',
        description: 'GDPR Compliance',
        enabled: true,
        requirements: [
          {
            id: 'req1',
            name: 'Data Protection',
            description: 'Protect user data',
            category: 'data',
            severity: 'critical',
            automatable: true,
          },
        ],
        automationRules: [
          {
            id: 'rule1',
            requirementId: 'req1',
            checkType: 'encryption_check',
            parameters: {},
            frequency: 'daily',
          },
        ],
      });

      expect(framework.id).toBeDefined();
      expect(framework.name).toBe('GDPR');
    });

    it('should execute compliance check', async () => {
      const framework = complianceEngine.createFramework({
        name: 'Test Framework',
        description: 'Test',
        enabled: true,
        requirements: [
          {
            id: 'req1',
            name: 'Test',
            description: 'Test',
            category: 'test',
            severity: 'high',
            automatable: true,
          },
        ],
        automationRules: [],
      });

      complianceEngine.registerCheckHandler('test_check', async () => ({
        compliant: true,
        evidence: ['Evidence 1'],
      }));

      const result = await complianceEngine.executeCheck(framework.id, 'req1', 'test_check', {});

      expect(result).toBeDefined();
      expect(result?.status).toBe('compliant');
    });

    it('should get compliance status', async () => {
      const framework = complianceEngine.createFramework({
        name: 'Test',
        description: 'Test',
        enabled: true,
        requirements: [
          {
            id: 'req1',
            name: 'Test',
            description: 'Test',
            category: 'test',
            severity: 'high',
            automatable: true,
          },
        ],
        automationRules: [],
      });

      complianceEngine.registerCheckHandler('test', async () => ({
        compliant: true,
        evidence: [],
      }));

      await complianceEngine.executeCheck(framework.id, 'req1', 'test', {});

      const status = complianceEngine.getComplianceStatus(framework.id);
      expect(status.frameworkId).toBe(framework.id);
      expect(status.compliant).toBeGreaterThanOrEqual(0);
    });

    it('should get remediation plan', async () => {
      const framework = complianceEngine.createFramework({
        name: 'Test',
        description: 'Test',
        enabled: true,
        requirements: [
          {
            id: 'req1',
            name: 'Test',
            description: 'Test',
            category: 'test',
            severity: 'critical',
            automatable: true,
          },
        ],
        automationRules: [],
      });

      complianceEngine.registerCheckHandler('test', async () => ({
        compliant: false,
        evidence: [],
        remediation: ['Fix 1', 'Fix 2'],
      }));

      await complianceEngine.executeCheck(framework.id, 'req1', 'test', {});

      const plan = complianceEngine.getRemediationPlan(framework.id);
      expect(Array.isArray(plan)).toBe(true);
    });

    it('should export compliance report', async () => {
      const framework = complianceEngine.createFramework({
        name: 'Test',
        description: 'Test',
        enabled: true,
        requirements: [
          {
            id: 'req1',
            name: 'Test',
            description: 'Test',
            category: 'test',
            severity: 'high',
            automatable: true,
          },
        ],
        automationRules: [],
      });

      complianceEngine.registerCheckHandler('test', async () => ({
        compliant: true,
        evidence: [],
      }));

      await complianceEngine.executeCheck(framework.id, 'req1', 'test', {});

      const report = complianceEngine.exportComplianceReport(framework.id, 'json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  describe('SecurityPolicyEnforcer', () => {
    it('should create security policy', () => {
      const policy = policyEnforcer.createPolicy({
        name: 'Access Control',
        description: 'Control access',
        enabled: true,
        priority: 1,
        rules: [
          {
            id: 'rule1',
            name: 'Admin Only',
            condition: (ctx) => (ctx.role as string) === 'admin',
            action: 'allow',
            severity: 'critical',
          },
        ],
        exceptions: [],
      });

      expect(policy.id).toBeDefined();
      expect(policy.name).toBe('Access Control');
    });

    it('should enforce policy', () => {
      const policy = policyEnforcer.createPolicy({
        name: 'Test Policy',
        description: 'Test',
        enabled: true,
        priority: 1,
        rules: [
          {
            id: 'rule1',
            name: 'Test Rule',
            condition: (ctx) => (ctx.action as string) === 'delete',
            action: 'deny',
            severity: 'high',
          },
        ],
        exceptions: [],
      });

      const result = policyEnforcer.enforcePolicy(policy.id, { action: 'delete' });

      expect(result).toBeDefined();
      expect(result.decision).toBe('deny');
    });

    it('should get policy violations', () => {
      const policy = policyEnforcer.createPolicy({
        name: 'Test',
        description: 'Test',
        enabled: true,
        priority: 1,
        rules: [
          {
            id: 'rule1',
            name: 'Test',
            condition: () => true,
            action: 'deny',
            severity: 'high',
          },
        ],
        exceptions: [],
      });

      policyEnforcer.enforcePolicy(policy.id, {});

      const violations = policyEnforcer.getPolicyViolations(policy.id);
      expect(Array.isArray(violations)).toBe(true);
    });

    it('should get enforcement statistics', () => {
      const policy = policyEnforcer.createPolicy({
        name: 'Test',
        description: 'Test',
        enabled: true,
        priority: 1,
        rules: [
          {
            id: 'rule1',
            name: 'Test',
            condition: () => true,
            action: 'allow',
            severity: 'high',
          },
        ],
        exceptions: [],
      });

      policyEnforcer.enforcePolicy(policy.id, {});

      const stats = policyEnforcer.getEnforcementStatistics(policy.id);
      expect(stats.totalEnforcements).toBeGreaterThan(0);
    });

    it('should export enforcement report', () => {
      const policy = policyEnforcer.createPolicy({
        name: 'Test',
        description: 'Test',
        enabled: true,
        priority: 1,
        rules: [
          {
            id: 'rule1',
            name: 'Test',
            condition: () => true,
            action: 'allow',
            severity: 'high',
          },
        ],
        exceptions: [],
      });

      policyEnforcer.enforcePolicy(policy.id, {});

      const report = policyEnforcer.exportEnforcementReport(policy.id, 'json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  describe('ThreatResponseOrchestrator', () => {
    it('should create response playbook', () => {
      const playbook = threatOrchestrator.createPlaybook({
        name: 'Ransomware Response',
        description: 'Respond to ransomware',
        threatType: 'ransomware',
        severity: 'critical',
        enabled: true,
        triggers: [
          {
            id: 'trigger1',
            condition: (threat) => (threat.type as string) === 'ransomware',
            priority: 1,
          },
        ],
        actions: [
          {
            id: 'action1',
            name: 'Isolate',
            type: 'isolate',
            parameters: {},
            parallel: false,
            timeout: 30000,
          },
        ],
      });

      expect(playbook.id).toBeDefined();
      expect(playbook.name).toBe('Ransomware Response');
    });

    it('should execute threat response', async () => {
      const playbook = threatOrchestrator.createPlaybook({
        name: 'Test Playbook',
        description: 'Test',
        threatType: 'test',
        severity: 'high',
        enabled: true,
        triggers: [
          {
            id: 'trigger1',
            condition: () => true,
            priority: 1,
          },
        ],
        actions: [
          {
            id: 'action1',
            name: 'Test Action',
            type: 'test_action',
            parameters: {},
            parallel: false,
            timeout: 5000,
          },
        ],
      });

      threatOrchestrator.registerActionHandler('test_action', async () => ({
        success: true,
      }));

      const execution = await threatOrchestrator.executeResponse(playbook.id, {
        type: 'test',
      });

      expect(execution).toBeDefined();
      expect(execution?.status).toBe('completed');
    });

    it('should get response statistics', async () => {
      const playbook = threatOrchestrator.createPlaybook({
        name: 'Test',
        description: 'Test',
        threatType: 'test',
        severity: 'high',
        enabled: true,
        triggers: [{ id: 'trigger1', condition: () => true, priority: 1 }],
        actions: [
          {
            id: 'action1',
            name: 'Test',
            type: 'test',
            parameters: {},
            parallel: false,
            timeout: 5000,
          },
        ],
      });

      threatOrchestrator.registerActionHandler('test', async () => ({ success: true }));
      await threatOrchestrator.executeResponse(playbook.id, {});

      const stats = threatOrchestrator.getStatistics();
      expect(stats.totalExecutions).toBeGreaterThan(0);
    });

    it('should get average response time', async () => {
      const playbook = threatOrchestrator.createPlaybook({
        name: 'Test',
        description: 'Test',
        threatType: 'test',
        severity: 'high',
        enabled: true,
        triggers: [{ id: 'trigger1', condition: () => true, priority: 1 }],
        actions: [
          {
            id: 'action1',
            name: 'Test',
            type: 'test',
            parameters: {},
            parallel: false,
            timeout: 5000,
          },
        ],
      });

      threatOrchestrator.registerActionHandler('test', async () => ({ success: true }));
      await threatOrchestrator.executeResponse(playbook.id, {});

      const avgTime = threatOrchestrator.getAverageResponseTime('test');
      expect(avgTime).toBeGreaterThanOrEqual(0);
    });

    it('should export response report', async () => {
      const playbook = threatOrchestrator.createPlaybook({
        name: 'Test',
        description: 'Test',
        threatType: 'test',
        severity: 'high',
        enabled: true,
        triggers: [{ id: 'trigger1', condition: () => true, priority: 1 }],
        actions: [
          {
            id: 'action1',
            name: 'Test',
            type: 'test',
            parameters: {},
            parallel: false,
            timeout: 5000,
          },
        ],
      });

      threatOrchestrator.registerActionHandler('test', async () => ({ success: true }));
      await threatOrchestrator.executeResponse(playbook.id, {});

      const report = threatOrchestrator.exportResponseReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  describe('SecurityReportingEngine', () => {
    it('should create report template', () => {
      const template = reportingEngine.createTemplate({
        name: 'Monthly Security Report',
        description: 'Monthly report',
        sections: [
          {
            id: 'section1',
            name: 'Summary',
            type: 'summary',
            dataSource: 'summary_provider',
            parameters: {},
          },
        ],
        frequency: 'monthly',
        recipients: ['admin@example.com'],
        format: 'pdf',
      });

      expect(template.id).toBeDefined();
      expect(template.name).toBe('Monthly Security Report');
    });

    it('should generate report', async () => {
      const template = reportingEngine.createTemplate({
        name: 'Test Report',
        description: 'Test',
        sections: [
          {
            id: 'section1',
            name: 'Test Section',
            type: 'summary',
            dataSource: 'test_provider',
            parameters: {},
          },
        ],
        frequency: 'daily',
        recipients: [],
        format: 'json',
      });

      reportingEngine.registerDataProvider('test_provider', async () => ({
        data: 'test',
      }));

      const report = await reportingEngine.generateReport(template.id);

      expect(report).toBeDefined();
      expect(report?.title).toBe('Test Report');
    });

    it('should get latest report', async () => {
      const template = reportingEngine.createTemplate({
        name: 'Test',
        description: 'Test',
        sections: [
          {
            id: 'section1',
            name: 'Test',
            type: 'summary',
            dataSource: 'test',
            parameters: {},
          },
        ],
        frequency: 'daily',
        recipients: [],
        format: 'json',
      });

      reportingEngine.registerDataProvider('test', async () => ({ data: 'test' }));
      await reportingEngine.generateReport(template.id);

      const report = reportingEngine.getLatestReport(template.id);
      expect(report).toBeDefined();
    });

    it('should get reporting statistics', async () => {
      const template = reportingEngine.createTemplate({
        name: 'Test',
        description: 'Test',
        sections: [
          {
            id: 'section1',
            name: 'Test',
            type: 'summary',
            dataSource: 'test',
            parameters: {},
          },
        ],
        frequency: 'daily',
        recipients: [],
        format: 'json',
      });

      reportingEngine.registerDataProvider('test', async () => ({ data: 'test' }));
      await reportingEngine.generateReport(template.id);

      const stats = reportingEngine.getStatistics();
      expect(stats.totalReports).toBeGreaterThan(0);
    });

    it('should get risk trend', async () => {
      const template = reportingEngine.createTemplate({
        name: 'Test',
        description: 'Test',
        sections: [
          {
            id: 'section1',
            name: 'Test',
            type: 'summary',
            dataSource: 'test',
            parameters: {},
          },
        ],
        frequency: 'daily',
        recipients: [],
        format: 'json',
      });

      reportingEngine.registerDataProvider('test', async () => ({ data: 'test' }));
      await reportingEngine.generateReport(template.id);

      const trend = reportingEngine.getRiskTrend(template.id, 30);
      expect(Array.isArray(trend)).toBe(true);
    });

    it('should export report', async () => {
      const template = reportingEngine.createTemplate({
        name: 'Test',
        description: 'Test',
        sections: [
          {
            id: 'section1',
            name: 'Test',
            type: 'summary',
            dataSource: 'test',
            parameters: {},
          },
        ],
        frequency: 'daily',
        recipients: [],
        format: 'json',
      });

      reportingEngine.registerDataProvider('test', async () => ({ data: 'test' }));
      const report = await reportingEngine.generateReport(template.id);

      if (report) {
        const exported = reportingEngine.exportReport(report.id, 'json');
        expect(exported).toBeDefined();
        expect(exported.length).toBeGreaterThan(0);
      }
    });

    it('should generate executive summary', async () => {
      const template = reportingEngine.createTemplate({
        name: 'Test',
        description: 'Test',
        sections: [
          {
            id: 'section1',
            name: 'Test',
            type: 'summary',
            dataSource: 'test',
            parameters: {},
          },
        ],
        frequency: 'daily',
        recipients: [],
        format: 'json',
      });

      reportingEngine.registerDataProvider('test', async () => ({ data: 'test' }));
      const report = await reportingEngine.generateReport(template.id);

      if (report) {
        const summary = reportingEngine.generateExecutiveSummary(report.id);
        expect(summary).toBeDefined();
        expect(summary.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Integration Tests', () => {
    it('should coordinate orchestration and compliance', async () => {
      const workflow = orchestrationEngine.createWorkflow({
        name: 'Compliance Check',
        description: 'Run compliance checks',
        enabled: true,
        triggers: [{ type: 'schedule', condition: () => true }],
        steps: [
          {
            id: 'step1',
            name: 'Check Compliance',
            action: 'check_compliance',
            parameters: {},
            retryCount: 1,
            timeout: 5000,
          },
        ],
        errorHandling: { strategy: 'stop', notifyOnError: false },
      });

      const framework = complianceEngine.createFramework({
        name: 'Test Framework',
        description: 'Test',
        enabled: true,
        requirements: [
          {
            id: 'req1',
            name: 'Test',
            description: 'Test',
            category: 'test',
            severity: 'high',
            automatable: true,
          },
        ],
        automationRules: [],
      });

      orchestrationEngine.registerActionHandler('check_compliance', async () => ({
        frameworkId: framework.id,
      }));

      complianceEngine.registerCheckHandler('test', async () => ({
        compliant: true,
        evidence: [],
      }));

      const execution = await orchestrationEngine.executeWorkflow(workflow.id, {});
      expect(execution?.status).toBe('completed');
    });

    it('should coordinate policy enforcement and threat response', async () => {
      const policy = policyEnforcer.createPolicy({
        name: 'Threat Response Policy',
        description: 'Enforce threat response',
        enabled: true,
        priority: 1,
        rules: [
          {
            id: 'rule1',
            name: 'Trigger Response',
            condition: (ctx) => (ctx.threatLevel as string) === 'critical',
            action: 'allow',
            severity: 'critical',
          },
        ],
        exceptions: [],
      });

      const playbook = threatOrchestrator.createPlaybook({
        name: 'Critical Threat Response',
        description: 'Respond to critical threats',
        threatType: 'critical',
        severity: 'critical',
        enabled: true,
        triggers: [
          {
            id: 'trigger1',
            condition: (threat) => (threat.level as string) === 'critical',
            priority: 1,
          },
        ],
        actions: [
          {
            id: 'action1',
            name: 'Respond',
            type: 'respond',
            parameters: {},
            parallel: false,
            timeout: 5000,
          },
        ],
      });

      const enforcement = policyEnforcer.enforcePolicy(policy.id, {
        threatLevel: 'critical',
      });

      threatOrchestrator.registerActionHandler('respond', async () => ({
        success: true,
      }));

      const response = await threatOrchestrator.executeResponse(playbook.id, {
        level: 'critical',
      });

      expect(enforcement.decision).toBe('allow');
      expect(response?.status).toBe('completed');
    });

    it('should coordinate all systems in full workflow', async () => {
      // Create all components
      const workflow = orchestrationEngine.createWorkflow({
        name: 'Full Security Workflow',
        description: 'Full workflow',
        enabled: true,
        triggers: [{ type: 'alert', condition: () => true }],
        steps: [
          {
            id: 'step1',
            name: 'Execute',
            action: 'execute',
            parameters: {},
            retryCount: 1,
            timeout: 5000,
          },
        ],
        errorHandling: { strategy: 'stop', notifyOnError: false },
      });

      const framework = complianceEngine.createFramework({
        name: 'Framework',
        description: 'Framework',
        enabled: true,
        requirements: [
          {
            id: 'req1',
            name: 'Req',
            description: 'Req',
            category: 'cat',
            severity: 'high',
            automatable: true,
          },
        ],
        automationRules: [],
      });

      const policy = policyEnforcer.createPolicy({
        name: 'Policy',
        description: 'Policy',
        enabled: true,
        priority: 1,
        rules: [
          {
            id: 'rule1',
            name: 'Rule',
            condition: () => true,
            action: 'allow',
            severity: 'high',
          },
        ],
        exceptions: [],
      });

      const playbook = threatOrchestrator.createPlaybook({
        name: 'Playbook',
        description: 'Playbook',
        threatType: 'test',
        severity: 'high',
        enabled: true,
        triggers: [{ id: 'trigger1', condition: () => true, priority: 1 }],
        actions: [
          {
            id: 'action1',
            name: 'Action',
            type: 'action',
            parameters: {},
            parallel: false,
            timeout: 5000,
          },
        ],
      });

      const template = reportingEngine.createTemplate({
        name: 'Report',
        description: 'Report',
        sections: [
          {
            id: 'section1',
            name: 'Section',
            type: 'summary',
            dataSource: 'provider',
            parameters: {},
          },
        ],
        frequency: 'daily',
        recipients: [],
        format: 'json',
      });

      // Register handlers
      orchestrationEngine.registerActionHandler('execute', async () => ({ success: true }));
      complianceEngine.registerCheckHandler('check', async () => ({
        compliant: true,
        evidence: [],
      }));
      threatOrchestrator.registerActionHandler('action', async () => ({ success: true }));
      reportingEngine.registerDataProvider('provider', async () => ({ data: 'test' }));

      // Execute all
      const execution = await orchestrationEngine.executeWorkflow(workflow.id, {});
      const compliance = await complianceEngine.executeCheck(framework.id, 'req1', 'check', {});
      const enforcement = policyEnforcer.enforcePolicy(policy.id, {});
      const response = await threatOrchestrator.executeResponse(playbook.id, {});
      const report = await reportingEngine.generateReport(template.id);

      expect(execution?.status).toBe('completed');
      expect(compliance?.status).toBe('compliant');
      expect(enforcement.decision).toBe('allow');
      expect(response?.status).toBe('completed');
      expect(report?.title).toBe('Report');
    });

    it('should handle full incident management workflow', async () => {
      // Setup all systems
      const workflow = orchestrationEngine.createWorkflow({
        name: 'Incident Management',
        description: 'Full incident management',
        enabled: true,
        triggers: [{ type: 'incident', condition: () => true }],
        steps: [
          {
            id: 'step1',
            name: 'Manage',
            action: 'manage_incident',
            parameters: {},
            retryCount: 1,
            timeout: 5000,
          },
        ],
        errorHandling: { strategy: 'continue', notifyOnError: true },
      });

      orchestrationEngine.registerActionHandler('manage_incident', async () => ({
        incidentId: 'inc-123',
      }));

      const execution = await orchestrationEngine.executeWorkflow(workflow.id, {});

      expect(execution).toBeDefined();
      expect(execution?.status).toBe('completed');

      const stats = orchestrationEngine.getStatistics();
      expect(stats.totalExecutions).toBeGreaterThan(0);
    });
  });
});
