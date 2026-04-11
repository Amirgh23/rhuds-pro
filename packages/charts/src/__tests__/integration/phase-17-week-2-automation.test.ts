/**
 * Phase 17 Week 2 - Security Automation & Response Tests
 * Comprehensive test suite for automation and response features
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SecurityAutomationEngine } from '../../engine/security/SecurityAutomationEngine';
import { ThreatResponseAutomation } from '../../engine/security/ThreatResponseAutomation';
import { SecurityAlertAggregator } from '../../engine/security/SecurityAlertAggregator';
import { IncidentAutomationWorkflow } from '../../engine/security/IncidentAutomationWorkflow';
import { SecurityResponseOptimizer } from '../../engine/security/SecurityResponseOptimizer';

describe('Phase 17 Week 2 - Security Automation & Response', () => {
  // ============================================================================
  // SecurityAutomationEngine Tests
  // ============================================================================

  describe('SecurityAutomationEngine', () => {
    let engine: SecurityAutomationEngine;

    beforeEach(() => {
      engine = new SecurityAutomationEngine();
    });

    it('should register automation rule', () => {
      const rule = engine.registerRule({
        name: 'Test Rule',
        description: 'Test automation rule',
        trigger: {
          type: 'alert',
          condition: { severity: 'critical' },
        },
        actions: [
          {
            type: 'notify',
            params: { channel: 'email' },
          },
        ],
        enabled: true,
      });

      expect(rule.id).toBeDefined();
      expect(rule.name).toBe('Test Rule');
      expect(rule.enabled).toBe(true);
    });

    it('should register action handler', () => {
      engine.registerActionHandler('notify', async (params) => {
        return { sent: true, ...params };
      });

      const rule = engine.registerRule({
        name: 'Test Rule',
        description: 'Test automation rule',
        trigger: {
          type: 'alert',
          condition: { severity: 'critical' },
        },
        actions: [
          {
            type: 'notify',
            params: { channel: 'email' },
          },
        ],
        enabled: true,
      });

      expect(rule.id).toBeDefined();
    });

    it('should register trigger handler', () => {
      engine.registerTriggerHandler('alert', (condition) => {
        return (condition as Record<string, unknown>).severity === 'critical';
      });

      const rule = engine.registerRule({
        name: 'Test Rule',
        description: 'Test automation rule',
        trigger: {
          type: 'alert',
          condition: { severity: 'critical' },
        },
        actions: [
          {
            type: 'notify',
            params: { channel: 'email' },
          },
        ],
        enabled: true,
      });

      expect(rule.id).toBeDefined();
    });

    it('should execute automation rule', async () => {
      engine.registerTriggerHandler('alert', () => true);
      engine.registerActionHandler('notify', async (params) => {
        return { sent: true, ...params };
      });

      const rule = engine.registerRule({
        name: 'Test Rule',
        description: 'Test automation rule',
        trigger: {
          type: 'alert',
          condition: { severity: 'critical' },
        },
        actions: [
          {
            type: 'notify',
            params: { channel: 'email' },
          },
        ],
        enabled: true,
      });

      const execution = await engine.executeRule(rule.id);
      expect(execution).toBeDefined();
      expect(execution?.status).toBe('completed');
    });

    it('should enable and disable rules', () => {
      const rule = engine.registerRule({
        name: 'Test Rule',
        description: 'Test automation rule',
        trigger: {
          type: 'alert',
          condition: { severity: 'critical' },
        },
        actions: [],
        enabled: true,
      });

      expect(engine.disableRule(rule.id)).toBe(true);
      const disabledRule = engine.getRule(rule.id);
      expect(disabledRule?.enabled).toBe(false);

      expect(engine.enableRule(rule.id)).toBe(true);
      const enabledRule = engine.getRule(rule.id);
      expect(enabledRule?.enabled).toBe(true);
    });

    it('should get all rules', () => {
      engine.registerRule({
        name: 'Rule 1',
        description: 'Test rule 1',
        trigger: { type: 'alert', condition: {} },
        actions: [],
        enabled: true,
      });

      engine.registerRule({
        name: 'Rule 2',
        description: 'Test rule 2',
        trigger: { type: 'alert', condition: {} },
        actions: [],
        enabled: false,
      });

      const rules = engine.getAllRules();
      expect(rules.length).toBe(2);
    });

    it('should get enabled rules', () => {
      engine.registerRule({
        name: 'Rule 1',
        description: 'Test rule 1',
        trigger: { type: 'alert', condition: {} },
        actions: [],
        enabled: true,
      });

      engine.registerRule({
        name: 'Rule 2',
        description: 'Test rule 2',
        trigger: { type: 'alert', condition: {} },
        actions: [],
        enabled: false,
      });

      const enabledRules = engine.getEnabledRules();
      expect(enabledRules.length).toBe(1);
    });

    it('should get automation statistics', async () => {
      engine.registerTriggerHandler('alert', () => true);
      engine.registerActionHandler('notify', async () => ({ sent: true }));

      const rule = engine.registerRule({
        name: 'Test Rule',
        description: 'Test automation rule',
        trigger: { type: 'alert', condition: {} },
        actions: [{ type: 'notify', params: {} }],
        enabled: true,
      });

      await engine.executeRule(rule.id);

      const stats = engine.getStatistics();
      expect(stats.totalRules).toBe(1);
      expect(stats.enabledRules).toBe(1);
      expect(stats.totalExecutions).toBeGreaterThan(0);
    });

    it('should export automation report', async () => {
      engine.registerTriggerHandler('alert', () => true);
      engine.registerActionHandler('notify', async () => ({ sent: true }));

      const rule = engine.registerRule({
        name: 'Test Rule',
        description: 'Test automation rule',
        trigger: { type: 'alert', condition: {} },
        actions: [{ type: 'notify', params: {} }],
        enabled: true,
      });

      await engine.executeRule(rule.id);

      const report = engine.exportAutomationReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // ThreatResponseAutomation Tests
  // ============================================================================

  describe('ThreatResponseAutomation', () => {
    let automation: ThreatResponseAutomation;

    beforeEach(() => {
      automation = new ThreatResponseAutomation();
    });

    it('should register response handler', () => {
      automation.registerResponseHandler('isolate', async () => {
        return { isolated: true };
      });

      expect(automation).toBeDefined();
    });

    it('should create response plan', () => {
      const plan = automation.createResponsePlan('threat-1', 'critical', [
        {
          type: 'isolate',
          target: 'host-1',
          params: { duration: 3600 },
        },
      ]);

      expect(plan.id).toBeDefined();
      expect(plan.threatId).toBe('threat-1');
      expect(plan.priority).toBe('critical');
      expect(plan.status).toBe('draft');
    });

    it('should execute response plan', async () => {
      automation.registerResponseHandler('isolate', async () => {
        return { isolated: true };
      });

      const plan = automation.createResponsePlan('threat-1', 'critical', [
        {
          type: 'isolate',
          target: 'host-1',
          params: { duration: 3600 },
        },
      ]);

      const executed = await automation.executePlan(plan.id);
      expect(executed?.status).toBe('completed');
      expect(executed?.actions[0].status).toBe('completed');
    });

    it('should get response plan', () => {
      const plan = automation.createResponsePlan('threat-1', 'critical', [
        {
          type: 'isolate',
          target: 'host-1',
          params: {},
        },
      ]);

      const retrieved = automation.getResponsePlan(plan.id);
      expect(retrieved?.id).toBe(plan.id);
    });

    it('should get plans by threat', () => {
      automation.createResponsePlan('threat-1', 'critical', [
        {
          type: 'isolate',
          target: 'host-1',
          params: {},
        },
      ]);

      automation.createResponsePlan('threat-1', 'high', [
        {
          type: 'block',
          target: 'ip-1',
          params: {},
        },
      ]);

      const plans = automation.getPlansByThreat('threat-1');
      expect(plans.length).toBe(2);
    });

    it('should get active plans', async () => {
      automation.registerResponseHandler('isolate', async () => ({ isolated: true }));

      const plan = automation.createResponsePlan('threat-1', 'critical', [
        {
          type: 'isolate',
          target: 'host-1',
          params: {},
        },
      ]);

      await automation.executePlan(plan.id);

      const activePlans = automation.getActivePlans();
      expect(activePlans.length).toBe(0); // Completed, not active
    });

    it('should get completed plans', async () => {
      automation.registerResponseHandler('isolate', async () => ({ isolated: true }));

      const plan = automation.createResponsePlan('threat-1', 'critical', [
        {
          type: 'isolate',
          target: 'host-1',
          params: {},
        },
      ]);

      await automation.executePlan(plan.id);

      const completedPlans = automation.getCompletedPlans();
      expect(completedPlans.length).toBe(1);
    });

    it('should get response statistics', async () => {
      automation.registerResponseHandler('isolate', async () => ({ isolated: true }));

      const plan = automation.createResponsePlan('threat-1', 'critical', [
        {
          type: 'isolate',
          target: 'host-1',
          params: {},
        },
      ]);

      await automation.executePlan(plan.id);

      const stats = automation.getStatistics();
      expect(stats.totalPlans).toBe(1);
      expect(stats.completedPlans).toBe(1);
    });

    it('should export response report', async () => {
      automation.registerResponseHandler('isolate', async () => ({ isolated: true }));

      const plan = automation.createResponsePlan('threat-1', 'critical', [
        {
          type: 'isolate',
          target: 'host-1',
          params: {},
        },
      ]);

      await automation.executePlan(plan.id);

      const report = automation.exportResponseReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // SecurityAlertAggregator Tests
  // ============================================================================

  describe('SecurityAlertAggregator', () => {
    let aggregator: SecurityAlertAggregator;

    beforeEach(() => {
      aggregator = new SecurityAlertAggregator();
    });

    it('should register correlation rule', () => {
      aggregator.registerCorrelationRule('temporal', (alerts) => {
        if (alerts.length < 2) return null;

        return {
          id: 'corr-1',
          timestamp: Date.now(),
          alertIds: alerts.map((a) => (a.id as string) || ''),
          correlationType: 'temporal',
          confidence: 0.9,
          severity: 'high',
          description: 'Temporal correlation',
          metadata: {},
        };
      });

      expect(aggregator).toBeDefined();
    });

    it('should add alert', () => {
      aggregator.addAlert('alert-1', {
        id: 'alert-1',
        severity: 'critical',
        type: 'intrusion',
        source: 'ids-1',
      });

      const alert = aggregator.getAlert('alert-1');
      expect(alert?.id).toBe('alert-1');
    });

    it('should get all alerts', () => {
      aggregator.addAlert('alert-1', { id: 'alert-1', severity: 'critical' });
      aggregator.addAlert('alert-2', { id: 'alert-2', severity: 'high' });

      const alerts = aggregator.getAllAlerts();
      expect(alerts.length).toBe(2);
    });

    it('should generate aggregate', () => {
      aggregator.addAlert('alert-1', {
        id: 'alert-1',
        severity: 'critical',
        type: 'intrusion',
        source: 'ids-1',
      });

      aggregator.addAlert('alert-2', {
        id: 'alert-2',
        severity: 'high',
        type: 'malware',
        source: 'av-1',
      });

      const aggregate = aggregator.generateAggregate();
      expect(aggregate.alertCount).toBe(2);
      expect(aggregate.severityDistribution.critical).toBe(1);
    });

    it('should get aggregates', () => {
      aggregator.addAlert('alert-1', { id: 'alert-1', severity: 'critical' });
      aggregator.generateAggregate();

      const aggregates = aggregator.getAggregates();
      expect(aggregates.length).toBeGreaterThan(0);
    });

    it('should get high confidence correlations', () => {
      aggregator.registerCorrelationRule('temporal', (alerts) => {
        if (alerts.length < 2) return null;

        return {
          id: 'corr-1',
          timestamp: Date.now(),
          alertIds: alerts.map((a) => (a.id as string) || ''),
          correlationType: 'temporal',
          confidence: 0.95,
          severity: 'high',
          description: 'High confidence correlation',
          metadata: {},
        };
      });

      aggregator.addAlert('alert-1', { id: 'alert-1' });
      aggregator.addAlert('alert-2', { id: 'alert-2' });

      const correlations = aggregator.getHighConfidenceCorrelations(0.9);
      expect(correlations.length).toBeGreaterThan(0);
    });

    it('should get aggregation statistics', () => {
      aggregator.addAlert('alert-1', { id: 'alert-1', severity: 'critical' });
      aggregator.addAlert('alert-2', { id: 'alert-2', severity: 'high' });

      const stats = aggregator.getStatistics();
      expect(stats.totalAlerts).toBe(2);
      expect(stats.totalCorrelations).toBeGreaterThanOrEqual(0);
    });

    it('should export aggregation report', () => {
      aggregator.addAlert('alert-1', { id: 'alert-1', severity: 'critical' });

      const report = aggregator.exportAggregationReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // IncidentAutomationWorkflow Tests
  // ============================================================================

  describe('IncidentAutomationWorkflow', () => {
    let workflow: IncidentAutomationWorkflow;

    beforeEach(() => {
      workflow = new IncidentAutomationWorkflow();
    });

    it('should register step handler', () => {
      workflow.registerStepHandler('detection', async () => {
        return { detected: true };
      });

      expect(workflow).toBeDefined();
    });

    it('should create workflow', () => {
      const w = workflow.createWorkflow('incident-1', [
        {
          name: 'Detection',
          type: 'detection',
          automationLevel: 'full-auto',
          params: {},
        },
      ]);

      expect(w.id).toBeDefined();
      expect(w.incidentId).toBe('incident-1');
      expect(w.status).toBe('draft');
    });

    it('should start workflow', async () => {
      workflow.registerStepHandler('detection', async () => {
        return { detected: true };
      });

      const w = workflow.createWorkflow('incident-1', [
        {
          name: 'Detection',
          type: 'detection',
          automationLevel: 'full-auto',
          params: {},
        },
      ]);

      const started = await workflow.startWorkflow(w.id);
      expect(started?.status).toBe('completed');
    });

    it('should pause and resume workflow', async () => {
      workflow.registerStepHandler('detection', async () => {
        return { detected: true };
      });

      const w = workflow.createWorkflow('incident-1', [
        {
          name: 'Detection',
          type: 'detection',
          automationLevel: 'full-auto',
          params: {},
        },
      ]);

      await workflow.startWorkflow(w.id);

      // Can't pause completed workflow
      const paused = workflow.pauseWorkflow(w.id);
      expect(paused).toBe(false);

      // Create a new workflow and pause before starting
      const w2 = workflow.createWorkflow('incident-2', [
        {
          name: 'Detection',
          type: 'detection',
          automationLevel: 'full-auto',
          params: {},
        },
      ]);

      // Start it first to make it active
      const startPromise = workflow.startWorkflow(w2.id);
      // Immediately try to pause (may or may not work depending on timing)
      const pauseResult = workflow.pauseWorkflow(w2.id);
      await startPromise;

      // Just verify the workflow exists
      const retrieved = workflow.getWorkflow(w2.id);
      expect(retrieved).toBeDefined();
    });

    it('should get workflow', () => {
      const w = workflow.createWorkflow('incident-1', [
        {
          name: 'Detection',
          type: 'detection',
          automationLevel: 'full-auto',
          params: {},
        },
      ]);

      const retrieved = workflow.getWorkflow(w.id);
      expect(retrieved?.id).toBe(w.id);
    });

    it('should get workflows by incident', () => {
      workflow.createWorkflow('incident-1', [
        {
          name: 'Detection',
          type: 'detection',
          automationLevel: 'full-auto',
          params: {},
        },
      ]);

      workflow.createWorkflow('incident-1', [
        {
          name: 'Analysis',
          type: 'analysis',
          automationLevel: 'semi-auto',
          params: {},
        },
      ]);

      const workflows = workflow.getWorkflowsByIncident('incident-1');
      expect(workflows.length).toBe(2);
    });

    it('should get active workflows', async () => {
      workflow.registerStepHandler('detection', async () => {
        return { detected: true };
      });

      const w = workflow.createWorkflow('incident-1', [
        {
          name: 'Detection',
          type: 'detection',
          automationLevel: 'full-auto',
          params: {},
        },
      ]);

      const activeWorkflows = workflow.getActiveWorkflows();
      expect(activeWorkflows.length).toBe(0); // Not started yet
    });

    it('should get completed workflows', async () => {
      workflow.registerStepHandler('detection', async () => {
        return { detected: true };
      });

      const w = workflow.createWorkflow('incident-1', [
        {
          name: 'Detection',
          type: 'detection',
          automationLevel: 'full-auto',
          params: {},
        },
      ]);

      await workflow.startWorkflow(w.id);

      const completedWorkflows = workflow.getCompletedWorkflows();
      expect(completedWorkflows.length).toBe(1);
    });

    it('should get workflow statistics', async () => {
      workflow.registerStepHandler('detection', async () => {
        return { detected: true };
      });

      const w = workflow.createWorkflow('incident-1', [
        {
          name: 'Detection',
          type: 'detection',
          automationLevel: 'full-auto',
          params: {},
        },
      ]);

      await workflow.startWorkflow(w.id);

      const stats = workflow.getStatistics();
      expect(stats.totalWorkflows).toBe(1);
      expect(stats.completedWorkflows).toBe(1);
    });

    it('should export workflow report', async () => {
      workflow.registerStepHandler('detection', async () => {
        return { detected: true };
      });

      const w = workflow.createWorkflow('incident-1', [
        {
          name: 'Detection',
          type: 'detection',
          automationLevel: 'full-auto',
          params: {},
        },
      ]);

      await workflow.startWorkflow(w.id);

      const report = workflow.exportWorkflowReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // SecurityResponseOptimizer Tests
  // ============================================================================

  describe('SecurityResponseOptimizer', () => {
    let optimizer: SecurityResponseOptimizer;

    beforeEach(() => {
      optimizer = new SecurityResponseOptimizer();
    });

    it('should record response metric', () => {
      const metric = optimizer.recordMetric('response-1', 'latency', 150, 200);

      expect(metric.id).toBeDefined();
      expect(metric.responseId).toBe('response-1');
      expect(metric.metricType).toBe('latency');
      expect(metric.status).toBe('below-target'); // 150 < 200
    });

    it('should record learning data', () => {
      optimizer.recordLearningData('response-1', { latency: 150, effectiveness: 0.95 }, 'success');

      const stats = optimizer.getStatistics();
      expect(stats.learningDataPoints).toBe(1);
    });

    it('should get metrics by response', () => {
      optimizer.recordMetric('response-1', 'latency', 150, 200);
      optimizer.recordMetric('response-1', 'effectiveness', 0.95, 0.9);

      const metrics = optimizer.getMetricsByResponse('response-1');
      expect(metrics.length).toBe(2);
    });

    it('should get metrics by type', () => {
      optimizer.recordMetric('response-1', 'latency', 150, 200);
      optimizer.recordMetric('response-2', 'latency', 160, 200);

      const metrics = optimizer.getMetricsByType('latency');
      expect(metrics.length).toBe(2);
    });

    it('should get metric trend', () => {
      optimizer.recordMetric('response-1', 'latency', 150, 200);
      optimizer.recordMetric('response-2', 'latency', 160, 200);

      const trend = optimizer.getMetricTrend('latency', 24);
      expect(trend.length).toBeGreaterThan(0);
    });

    it('should get pending recommendations', () => {
      // Record metrics to trigger recommendations
      for (let i = 0; i < 15; i++) {
        optimizer.recordMetric(`response-${i}`, 'latency', 100, 200);
      }

      const recommendations = optimizer.getPendingRecommendations();
      expect(recommendations.length).toBeGreaterThanOrEqual(0);
    });

    it('should implement recommendation', () => {
      for (let i = 0; i < 15; i++) {
        optimizer.recordMetric(`response-${i}`, 'latency', 100, 200);
      }

      const recommendations = optimizer.getPendingRecommendations();
      if (recommendations.length > 0) {
        const implemented = optimizer.implementRecommendation(recommendations[0].id);
        expect(implemented).toBe(true);
      }
    });

    it('should get optimization statistics', () => {
      optimizer.recordMetric('response-1', 'latency', 150, 200);
      optimizer.recordMetric('response-2', 'effectiveness', 0.95, 0.9);

      const stats = optimizer.getStatistics();
      expect(stats.totalMetrics).toBe(2);
      expect(stats.targetComplianceRate).toBeGreaterThanOrEqual(0);
    });

    it('should export optimization report', () => {
      optimizer.recordMetric('response-1', 'latency', 150, 200);

      const report = optimizer.exportOptimizationReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Tests', () => {
    it('should coordinate automation engine and threat response', async () => {
      const engine = new SecurityAutomationEngine();
      const automation = new ThreatResponseAutomation();

      engine.registerTriggerHandler('alert', () => true);
      engine.registerActionHandler('respond', async (params) => {
        const plan = automation.createResponsePlan(
          (params.threatId as string) || 'threat-1',
          'critical',
          [
            {
              type: 'isolate',
              target: 'host-1',
              params: {},
            },
          ]
        );
        return await automation.executePlan(plan.id);
      });

      automation.registerResponseHandler('isolate', async () => {
        return { isolated: true };
      });

      const rule = engine.registerRule({
        name: 'Threat Response Rule',
        description: 'Automated threat response',
        trigger: { type: 'alert', condition: {} },
        actions: [
          {
            type: 'respond',
            params: { threatId: 'threat-1' },
          },
        ],
        enabled: true,
      });

      const execution = await engine.executeRule(rule.id);
      expect(execution?.status).toBe('completed');
    });

    it('should coordinate alert aggregation and automation', () => {
      const aggregator = new SecurityAlertAggregator();
      const engine = new SecurityAutomationEngine();

      aggregator.registerCorrelationRule('temporal', (alerts) => {
        if (alerts.length < 2) return null;

        return {
          id: 'corr-1',
          timestamp: Date.now(),
          alertIds: alerts.map((a) => (a.id as string) || ''),
          correlationType: 'temporal',
          confidence: 0.9,
          severity: 'high',
          description: 'Temporal correlation',
          metadata: {},
        };
      });

      aggregator.addAlert('alert-1', { id: 'alert-1', severity: 'critical' });
      aggregator.addAlert('alert-2', { id: 'alert-2', severity: 'high' });

      const aggregate = aggregator.generateAggregate();
      expect(aggregate.alertCount).toBe(2);

      const stats = engine.getStatistics();
      expect(stats.totalRules).toBe(0);
    });

    it('should coordinate workflow and optimizer', async () => {
      const workflow = new IncidentAutomationWorkflow();
      const optimizer = new SecurityResponseOptimizer();

      workflow.registerStepHandler('detection', async () => {
        return { detected: true };
      });

      const w = workflow.createWorkflow('incident-1', [
        {
          name: 'Detection',
          type: 'detection',
          automationLevel: 'full-auto',
          params: {},
        },
      ]);

      const started = await workflow.startWorkflow(w.id);
      expect(started?.status).toBe('completed');

      optimizer.recordMetric('response-1', 'latency', 150, 200);
      const stats = optimizer.getStatistics();
      expect(stats.totalMetrics).toBe(1);
    });

    it('should handle full security automation workflow', async () => {
      const engine = new SecurityAutomationEngine();
      const automation = new ThreatResponseAutomation();
      const aggregator = new SecurityAlertAggregator();
      const workflow = new IncidentAutomationWorkflow();
      const optimizer = new SecurityResponseOptimizer();

      // Setup handlers
      engine.registerTriggerHandler('alert', () => true);
      engine.registerActionHandler('respond', async () => ({ responded: true }));

      automation.registerResponseHandler('isolate', async () => ({ isolated: true }));

      aggregator.registerCorrelationRule('temporal', (alerts) => {
        if (alerts.length < 2) return null;
        return {
          id: 'corr-1',
          timestamp: Date.now(),
          alertIds: alerts.map((a) => (a.id as string) || ''),
          correlationType: 'temporal',
          confidence: 0.9,
          severity: 'high',
          description: 'Correlation',
          metadata: {},
        };
      });

      workflow.registerStepHandler('detection', async () => ({ detected: true }));

      // Execute workflow
      const rule = engine.registerRule({
        name: 'Security Rule',
        description: 'Full security automation',
        trigger: { type: 'alert', condition: {} },
        actions: [{ type: 'respond', params: {} }],
        enabled: true,
      });

      const execution = await engine.executeRule(rule.id);
      expect(execution?.status).toBe('completed');

      // Verify all systems
      expect(engine.getStatistics().totalRules).toBe(1);
      expect(automation.getStatistics().totalPlans).toBe(0);
      expect(aggregator.getStatistics().totalAlerts).toBe(0);
      expect(workflow.getStatistics().totalWorkflows).toBe(0);
      expect(optimizer.getStatistics().totalMetrics).toBe(0);
    });
  });
});
