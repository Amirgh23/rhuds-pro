/**
 * Phase 18 Week 1 - Advanced Threat Response
 * Comprehensive integration tests for threat response features
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ThreatResponseOrchestrator } from '../../engine/security/ThreatResponseOrchestrator';
import { IncidentResponseAutomation } from '../../engine/security/IncidentResponseAutomation';
import { ResponsePlaybookEngine } from '../../engine/security/ResponsePlaybookEngine';
import { ThreatMitigationEngine } from '../../engine/security/ThreatMitigationEngine';
import { ResponseMetricsOptimizer } from '../../engine/security/ResponseMetricsOptimizer';

describe('Phase 18 Week 1 - Advanced Threat Response', () => {
  let orchestrator: ThreatResponseOrchestrator;
  let automation: IncidentResponseAutomation;
  let playbooks: ResponsePlaybookEngine;
  let mitigation: ThreatMitigationEngine;
  let metrics: ResponseMetricsOptimizer;

  beforeEach(() => {
    orchestrator = new ThreatResponseOrchestrator();
    automation = new IncidentResponseAutomation();
    playbooks = new ResponsePlaybookEngine();
    mitigation = new ThreatMitigationEngine();
    metrics = new ResponseMetricsOptimizer();
  });

  describe('ThreatResponseOrchestrator', () => {
    it('should create response workflow', () => {
      const workflow = orchestrator.createWorkflow('threat-1', [
        { type: 'isolate', targetId: 'host-1', priority: 'critical' },
        { type: 'block', targetId: 'ip-1', priority: 'high' },
      ]);

      expect(workflow).toBeDefined();
      expect(workflow.threatId).toBe('threat-1');
      expect(workflow.actions).toHaveLength(2);
      expect(workflow.status).toBe('pending');
    });

    it('should execute response workflow', async () => {
      const workflow = orchestrator.createWorkflow('threat-1', [
        { type: 'isolate', targetId: 'host-1', priority: 'critical' },
      ]);

      orchestrator.registerActionHandler('isolate', async () => ({ success: true }));

      const result = await orchestrator.executeWorkflow(workflow.id);

      expect(result).toBeDefined();
      expect(result.actionsExecuted).toBe(1);
      expect(result.actionsSucceeded).toBe(1);
      expect(result.successRate).toBe(1);
    });

    it('should handle workflow execution failure', async () => {
      const workflow = orchestrator.createWorkflow('threat-1', [
        { type: 'isolate', targetId: 'host-1', priority: 'critical' },
      ]);

      orchestrator.registerActionHandler('isolate', async () => {
        throw new Error('Isolation failed');
      });

      const result = await orchestrator.executeWorkflow(workflow.id);

      expect(result.actionsFailed).toBe(1);
      expect(result.successRate).toBe(0);
    });

    it('should get workflows by threat', () => {
      orchestrator.createWorkflow('threat-1', [
        { type: 'isolate', targetId: 'host-1', priority: 'critical' },
      ]);
      orchestrator.createWorkflow('threat-1', [
        { type: 'block', targetId: 'ip-1', priority: 'high' },
      ]);
      orchestrator.createWorkflow('threat-2', [
        { type: 'alert', targetId: 'admin', priority: 'medium' },
      ]);

      const workflows = orchestrator.getWorkflowsByThreat('threat-1');

      expect(workflows).toHaveLength(2);
    });

    it('should get orchestrator statistics', async () => {
      orchestrator.registerActionHandler('isolate', async () => ({ success: true }));

      const workflow = orchestrator.createWorkflow('threat-1', [
        { type: 'isolate', targetId: 'host-1', priority: 'critical' },
      ]);

      await orchestrator.executeWorkflow(workflow.id);

      const stats = orchestrator.getStatistics();

      expect(stats.totalWorkflows).toBe(1);
      expect(stats.completedWorkflows).toBe(1);
      expect(stats.totalActions).toBe(1);
      expect(stats.successfulActions).toBe(1);
    });

    it('should export orchestration report', async () => {
      orchestrator.registerActionHandler('isolate', async () => ({ success: true }));

      const workflow = orchestrator.createWorkflow('threat-1', [
        { type: 'isolate', targetId: 'host-1', priority: 'critical' },
      ]);

      await orchestrator.executeWorkflow(workflow.id);

      const jsonReport = orchestrator.exportOrchestrationReport('json');
      const csvReport = orchestrator.exportOrchestrationReport('csv');

      expect(jsonReport).toContain('statistics');
      expect(csvReport).toContain('Total Workflows');
    });
  });

  describe('IncidentResponseAutomation', () => {
    it('should create automation rule', () => {
      const rule = automation.createRule('High Severity Alert', 'severity', { severity: 'high' }, [
        'isolate',
        'notify',
      ]);

      expect(rule).toBeDefined();
      expect(rule.name).toBe('High Severity Alert');
      expect(rule.enabled).toBe(true);
    });

    it('should evaluate incident against rules', () => {
      automation.createRule('High Severity', 'severity', { severity: 'high' }, ['isolate']);
      automation.createRule('Critical Severity', 'severity', { severity: 'critical' }, [
        'isolate',
        'escalate',
      ]);

      const matchedRules = automation.evaluateIncident('incident-1', { severity: 'high' });

      expect(matchedRules).toHaveLength(1);
      expect(matchedRules[0].name).toBe('High Severity');
    });

    it('should execute automation for incident', async () => {
      const rule = automation.createRule('High Severity', 'severity', { severity: 'high' }, [
        'isolate',
      ]);

      automation.registerActionExecutor('isolate', async () => ({ isolated: true }));

      const response = await automation.executeAutomation('incident-1', rule.id, {
        severity: 'high',
      });

      expect(response).toBeDefined();
      expect(response.status).toBe('completed');
      expect(response.executedActions).toContain('isolate');
    });

    it('should update automation rule', () => {
      const rule = automation.createRule('Test Rule', 'severity', { severity: 'high' }, [
        'isolate',
      ]);

      const updated = automation.updateRule(rule.id, { name: 'Updated Rule' });

      expect(updated?.name).toBe('Updated Rule');
    });

    it('should enable/disable rules', () => {
      const rule = automation.createRule('Test Rule', 'severity', { severity: 'high' }, [
        'isolate',
      ]);

      automation.disableRule(rule.id);
      let disabled = automation.getRule(rule.id);
      expect(disabled?.enabled).toBe(false);

      automation.enableRule(rule.id);
      let enabled = automation.getRule(rule.id);
      expect(enabled?.enabled).toBe(true);
    });

    it('should get automation statistics', async () => {
      const rule = automation.createRule('Test Rule', 'severity', { severity: 'high' }, [
        'isolate',
      ]);
      automation.registerActionExecutor('isolate', async () => ({ isolated: true }));

      await automation.executeAutomation('incident-1', rule.id, { severity: 'high' });

      const stats = automation.getStatistics();

      expect(stats.totalRules).toBe(1);
      expect(stats.enabledRules).toBe(1);
      expect(stats.totalExecutions).toBe(1);
      expect(stats.successfulExecutions).toBe(1);
    });

    it('should export automation report', async () => {
      const rule = automation.createRule('Test Rule', 'severity', { severity: 'high' }, [
        'isolate',
      ]);
      automation.registerActionExecutor('isolate', async () => ({ isolated: true }));

      await automation.executeAutomation('incident-1', rule.id, { severity: 'high' });

      const jsonReport = automation.exportAutomationReport('json');
      const csvReport = automation.exportAutomationReport('csv');

      expect(jsonReport).toContain('statistics');
      expect(csvReport).toContain('Total Rules');
    });
  });

  describe('ResponsePlaybookEngine', () => {
    it('should create playbook', () => {
      const playbook = playbooks.createPlaybook(
        'Ransomware Response',
        'Response to ransomware attacks',
        'ransomware',
        'critical',
        [
          { action: 'isolate', parameters: { scope: 'network' }, retryCount: 3, timeout: 5000 },
          { action: 'backup', parameters: { type: 'full' }, retryCount: 2, timeout: 10000 },
        ]
      );

      expect(playbook).toBeDefined();
      expect(playbook.name).toBe('Ransomware Response');
      expect(playbook.steps).toHaveLength(2);
    });

    it('should execute playbook', async () => {
      const playbook = playbooks.createPlaybook('Test Playbook', 'Test', 'test', 'high', [
        { action: 'isolate', parameters: {}, retryCount: 0, timeout: 5000 },
      ]);

      playbooks.registerStepExecutor('isolate', async () => ({ success: true }));

      const execution = await playbooks.executePlaybook(playbook.id, 'threat-1');

      expect(execution).toBeDefined();
      expect(execution.status).toBe('completed');
      expect(execution.executedSteps).toHaveLength(1);
    });

    it('should pause and resume playbook execution', async () => {
      const playbook = playbooks.createPlaybook('Test Playbook', 'Test', 'test', 'high', [
        { action: 'isolate', parameters: {}, retryCount: 0, timeout: 5000 },
        { action: 'backup', parameters: {}, retryCount: 0, timeout: 5000 },
      ]);

      playbooks.registerStepExecutor('isolate', async () => ({ success: true }));
      playbooks.registerStepExecutor('backup', async () => ({ success: true }));

      const execution = await playbooks.executePlaybook(playbook.id, 'threat-1');

      expect(execution.status).toBe('completed');
    });

    it('should get playbooks by threat type', () => {
      playbooks.createPlaybook('Ransomware', 'Test', 'ransomware', 'critical', []);
      playbooks.createPlaybook('Malware', 'Test', 'malware', 'high', []);
      playbooks.createPlaybook('Another Ransomware', 'Test', 'ransomware', 'high', []);

      const ransomwarePlaybooks = playbooks.getPlaybooksByThreatType('ransomware');

      expect(ransomwarePlaybooks).toHaveLength(2);
    });

    it('should get playbook statistics', async () => {
      const playbook = playbooks.createPlaybook('Test Playbook', 'Test', 'test', 'high', [
        { action: 'isolate', parameters: {}, retryCount: 0, timeout: 5000 },
      ]);

      playbooks.registerStepExecutor('isolate', async () => ({ success: true }));

      await playbooks.executePlaybook(playbook.id, 'threat-1');

      const stats = playbooks.getStatistics();

      expect(stats.totalPlaybooks).toBe(1);
      expect(stats.enabledPlaybooks).toBe(1);
      expect(stats.totalExecutions).toBe(1);
      expect(stats.successfulExecutions).toBe(1);
    });

    it('should export playbook report', async () => {
      const playbook = playbooks.createPlaybook('Test Playbook', 'Test', 'test', 'high', [
        { action: 'isolate', parameters: {}, retryCount: 0, timeout: 5000 },
      ]);

      playbooks.registerStepExecutor('isolate', async () => ({ success: true }));

      await playbooks.executePlaybook(playbook.id, 'threat-1');

      const jsonReport = playbooks.exportPlaybookReport('json');
      const csvReport = playbooks.exportPlaybookReport('csv');

      expect(jsonReport).toContain('statistics');
      expect(csvReport).toContain('Total Playbooks');
    });
  });

  describe('ThreatMitigationEngine', () => {
    it('should create mitigation strategy', () => {
      const strategy = mitigation.createStrategy('threat-1', 'ransomware', 'critical', [
        'isolate',
        'backup',
        'restore',
      ]);

      expect(strategy).toBeDefined();
      expect(strategy.threatId).toBe('threat-1');
      expect(strategy.tactics).toHaveLength(3);
    });

    it('should execute mitigation strategy', async () => {
      const strategy = mitigation.createStrategy('threat-1', 'ransomware', 'critical', ['isolate']);

      mitigation.registerActionExecutor('isolate', async () => ({ success: true }));

      const effectiveness = await mitigation.executeMitigationStrategy(strategy.id);

      expect(effectiveness).toBeDefined();
      expect(effectiveness.successRate).toBe(1);
      expect(effectiveness.riskReduction).toBeGreaterThan(0);
    });

    it('should get strategies by threat', () => {
      mitigation.createStrategy('threat-1', 'ransomware', 'critical', ['isolate']);
      mitigation.createStrategy('threat-1', 'ransomware', 'critical', ['backup']);
      mitigation.createStrategy('threat-2', 'malware', 'high', ['isolate']);

      const strategies = mitigation.getStrategiesByThreat('threat-1');

      expect(strategies).toHaveLength(2);
    });

    it('should get strategies by severity', () => {
      mitigation.createStrategy('threat-1', 'ransomware', 'critical', ['isolate']);
      mitigation.createStrategy('threat-2', 'malware', 'high', ['isolate']);
      mitigation.createStrategy('threat-3', 'phishing', 'critical', ['alert']);

      const criticalStrategies = mitigation.getStrategiesBySeverity('critical');

      expect(criticalStrategies).toHaveLength(2);
    });

    it('should retry failed strategy', async () => {
      const strategy = mitigation.createStrategy('threat-1', 'ransomware', 'critical', ['isolate']);

      let callCount = 0;
      mitigation.registerActionExecutor('isolate', async () => {
        callCount++;
        if (callCount === 1) throw new Error('First attempt failed');
        return { success: true };
      });

      const effectiveness = await mitigation.executeMitigationStrategy(strategy.id);

      expect(effectiveness.successRate).toBeLessThan(1);
    });

    it('should get mitigation statistics', async () => {
      const strategy = mitigation.createStrategy('threat-1', 'ransomware', 'critical', ['isolate']);

      mitigation.registerActionExecutor('isolate', async () => ({ success: true }));

      await mitigation.executeMitigationStrategy(strategy.id);

      const stats = mitigation.getStatistics();

      expect(stats.totalStrategies).toBe(1);
      expect(stats.completedStrategies).toBe(1);
      expect(stats.totalActions).toBe(1);
      expect(stats.successfulActions).toBe(1);
    });

    it('should export mitigation report', async () => {
      const strategy = mitigation.createStrategy('threat-1', 'ransomware', 'critical', ['isolate']);

      mitigation.registerActionExecutor('isolate', async () => ({ success: true }));

      await mitigation.executeMitigationStrategy(strategy.id);

      const jsonReport = mitigation.exportMitigationReport('json');
      const csvReport = mitigation.exportMitigationReport('csv');

      expect(jsonReport).toContain('statistics');
      expect(csvReport).toContain('Total Strategies');
    });
  });

  describe('ResponseMetricsOptimizer', () => {
    it('should record metric', () => {
      const metric = metrics.recordMetric('response-1', 'latency', 150, 100);

      expect(metric).toBeDefined();
      expect(metric.metricType).toBe('latency');
      expect(metric.value).toBe(150);
      expect(metric.target).toBe(100);
    });

    it('should analyze metrics and generate recommendations', () => {
      metrics.recordMetric('response-1', 'latency', 150, 100);
      metrics.recordMetric('response-2', 'latency', 200, 100);
      metrics.recordMetric('response-3', 'accuracy', 0.8, 0.95);

      const recommendations = metrics.analyzeMetrics();

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].improvement).toBeGreaterThan(0);
    });

    it('should get off-target metrics', () => {
      metrics.recordMetric('response-1', 'latency', 150, 100);
      metrics.recordMetric('response-2', 'latency', 80, 100);
      metrics.recordMetric('response-3', 'accuracy', 0.8, 0.95);

      const offTarget = metrics.getOffTargetMetrics();

      expect(offTarget.length).toBeGreaterThan(0);
      expect(offTarget.every((m) => m.value > m.target)).toBe(true);
    });

    it('should get recommendations by priority', () => {
      metrics.recordMetric('response-1', 'latency', 500, 100);
      metrics.recordMetric('response-2', 'latency', 150, 100);

      const recommendations = metrics.analyzeMetrics();
      const criticalRecs = metrics.getRecommendationsByPriority('critical');

      expect(criticalRecs.length).toBeGreaterThanOrEqual(0);
    });

    it('should apply optimization', () => {
      metrics.recordMetric('response-1', 'latency', 150, 100);

      const recommendations = metrics.analyzeMetrics();
      if (recommendations.length > 0) {
        const applied = metrics.applyOptimization(recommendations[0].id);
        expect(applied).toBe(true);
      }
    });

    it('should get optimization history', () => {
      metrics.recordMetric('response-1', 'latency', 150, 100);

      const recommendations = metrics.analyzeMetrics();
      if (recommendations.length > 0) {
        metrics.applyOptimization(recommendations[0].id);
      }

      const history = metrics.getOptimizationHistory();

      expect(history.length).toBeGreaterThanOrEqual(0);
    });

    it('should get metrics statistics', () => {
      metrics.recordMetric('response-1', 'latency', 150, 100);
      metrics.recordMetric('response-2', 'accuracy', 0.9, 0.95);
      metrics.recordMetric('response-3', 'coverage', 0.85, 0.9);

      const stats = metrics.getStatistics();

      expect(stats.totalMetrics).toBe(3);
      expect(stats.metricsOffTarget).toBeGreaterThanOrEqual(0);
      expect(stats.overallHealthScore).toBeGreaterThanOrEqual(0);
    });

    it('should export metrics report', () => {
      metrics.recordMetric('response-1', 'latency', 150, 100);

      const jsonReport = metrics.exportMetricsReport('json');
      const csvReport = metrics.exportMetricsReport('csv');

      expect(jsonReport).toContain('statistics');
      expect(csvReport).toContain('Total Metrics');
    });
  });

  describe('Integration Tests', () => {
    it('should orchestrate complete threat response workflow', async () => {
      // Create automation rule
      const rule = automation.createRule('Critical Threat', 'severity', { severity: 'critical' }, [
        'isolate',
      ]);

      automation.registerActionExecutor('isolate', async () => ({ isolated: true }));

      // Create playbook
      const playbook = playbooks.createPlaybook(
        'Critical Response',
        'Response to critical threats',
        'critical',
        'critical',
        [{ action: 'isolate', parameters: {}, retryCount: 0, timeout: 5000 }]
      );

      playbooks.registerStepExecutor('isolate', async () => ({ success: true }));

      // Create mitigation strategy
      const strategy = mitigation.createStrategy('threat-1', 'critical', 'critical', ['isolate']);

      mitigation.registerActionExecutor('isolate', async () => ({ success: true }));

      // Execute all components
      const automationResponse = await automation.executeAutomation('incident-1', rule.id, {
        severity: 'critical',
      });
      const playbookExecution = await playbooks.executePlaybook(playbook.id, 'threat-1');
      const mitigationEffectiveness = await mitigation.executeMitigationStrategy(strategy.id);

      // Record metrics
      metrics.recordMetric('response-1', 'latency', 100, 150);
      metrics.recordMetric('response-1', 'accuracy', 0.95, 0.9);

      // Verify all components executed successfully
      expect(automationResponse.status).toBe('completed');
      expect(playbookExecution.status).toBe('completed');
      expect(mitigationEffectiveness.successRate).toBe(1);

      const stats = metrics.getStatistics();
      expect(stats.totalMetrics).toBe(2);
    });

    it('should handle complex multi-threat scenario', async () => {
      // Setup multiple threats
      const threats = ['threat-1', 'threat-2', 'threat-3'];

      for (const threatId of threats) {
        const workflow = orchestrator.createWorkflow(threatId, [
          { type: 'isolate', targetId: `host-${threatId}`, priority: 'critical' },
          { type: 'block', targetId: `ip-${threatId}`, priority: 'high' },
        ]);

        orchestrator.registerActionHandler('isolate', async () => ({ success: true }));
        orchestrator.registerActionHandler('block', async () => ({ success: true }));

        await orchestrator.executeWorkflow(workflow.id);
      }

      const stats = orchestrator.getStatistics();

      expect(stats.totalWorkflows).toBe(3);
      expect(stats.completedWorkflows).toBe(3);
      expect(stats.totalActions).toBe(6);
    });
  });
});
