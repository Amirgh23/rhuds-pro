/**
 * Phase 16 Week 3 - Security Incident Management Tests
 * Comprehensive test suite for incident management and security dashboards
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IncidentEscalationManager } from '../../engine/security/IncidentEscalationManager';
import { PostIncidentAnalyzer } from '../../engine/security/PostIncidentAnalyzer';
import { SecurityMetricsCollector } from '../../engine/security/SecurityMetricsCollector';
import { ThreatHuntingEngine } from '../../engine/security/ThreatHuntingEngine';
import { SecurityDashboardGenerator } from '../../engine/security/SecurityDashboardGenerator';

describe('Phase 16 Week 3 - Security Incident Management', () => {
  let escalationManager: IncidentEscalationManager;
  let analyzer: PostIncidentAnalyzer;
  let metricsCollector: SecurityMetricsCollector;
  let huntingEngine: ThreatHuntingEngine;
  let dashboardGenerator: SecurityDashboardGenerator;

  beforeEach(() => {
    escalationManager = new IncidentEscalationManager();
    analyzer = new PostIncidentAnalyzer();
    metricsCollector = new SecurityMetricsCollector();
    huntingEngine = new ThreatHuntingEngine();
    dashboardGenerator = new SecurityDashboardGenerator();
  });

  describe('IncidentEscalationManager', () => {
    it('should create escalation trigger', () => {
      const trigger = escalationManager.createTrigger({
        name: 'High Severity',
        enabled: true,
        condition: (incident) => (incident.severity as string) === 'critical',
        targetLevel: 'level2',
        delayMinutes: 15,
        notifyUsers: ['manager@example.com'],
      });

      expect(trigger.id).toBeDefined();
      expect(trigger.name).toBe('High Severity');
    });

    it('should evaluate escalation triggers', () => {
      escalationManager.createTrigger({
        name: 'Critical',
        enabled: true,
        condition: (incident) => (incident.severity as string) === 'critical',
        targetLevel: 'level3',
        delayMinutes: 5,
        notifyUsers: ['director@example.com'],
      });

      const level = escalationManager.evaluateTriggers('incident1', { severity: 'critical' });
      expect(level).toBe('level3');
    });

    it('should escalate incident', () => {
      escalationManager.createWorkflow({
        name: 'Standard Escalation',
        enabled: true,
        levels: [
          {
            level: 'level1',
            timeoutMinutes: 30,
            assignees: ['analyst@example.com'],
            actions: ['investigate'],
          },
          {
            level: 'level2',
            timeoutMinutes: 15,
            assignees: ['manager@example.com'],
            actions: ['escalate'],
          },
        ],
        maxLevel: 'level2',
      });

      const escalation = escalationManager.escalateIncident(
        'incident1',
        'level1',
        'level2',
        'No progress',
        'system'
      );

      expect(escalation).toBeDefined();
      expect(escalation?.toLevel).toBe('level2');
    });

    it('should get escalation level', () => {
      escalationManager.createWorkflow({
        name: 'Test',
        enabled: true,
        levels: [
          {
            level: 'level1',
            timeoutMinutes: 30,
            assignees: [],
            actions: [],
          },
        ],
        maxLevel: 'level1',
      });

      escalationManager.escalateIncident('incident1', 'level1', 'level1', 'Test', 'system');

      const level = escalationManager.getEscalationLevel('incident1');
      expect(level).toBe('level1');
    });

    it('should get escalation statistics', () => {
      escalationManager.createTrigger({
        name: 'Test',
        enabled: true,
        condition: () => true,
        targetLevel: 'level1',
        delayMinutes: 10,
        notifyUsers: [],
      });

      const stats = escalationManager.getStatistics();
      expect(stats.triggerCount).toBe(1);
    });
  });

  describe('PostIncidentAnalyzer', () => {
    it('should create incident analysis', () => {
      const analysis = analyzer.createAnalysis({
        incidentId: 'incident1',
        rootCause: 'Misconfiguration',
        contributingFactors: ['Lack of monitoring', 'No alerting'],
        timeline: [{ timestamp: Date.now(), event: 'Incident detected' }],
        impactAssessment: {
          systemsAffected: ['web_server'],
          dataExposed: false,
          usersImpacted: 100,
          downtimeMinutes: 30,
        },
        lessonsLearned: ['Need better monitoring'],
        recommendations: [
          {
            priority: 'high',
            action: 'Implement monitoring',
            owner: 'ops_team',
            dueDate: Date.now() + 86400000,
          },
        ],
        preventiveMeasures: ['Add monitoring', 'Improve alerting'],
      });

      expect(analysis.id).toBeDefined();
      expect(analysis.rootCause).toBe('Misconfiguration');
    });

    it('should add metric', () => {
      const metric = analyzer.addMetric({
        incidentId: 'incident1',
        metricType: 'response_time',
        value: 15,
        unit: 'minutes',
      });

      expect(metric.id).toBeDefined();
      expect(metric.value).toBe(15);
    });

    it('should get root causes', () => {
      analyzer.createAnalysis({
        incidentId: 'incident1',
        rootCause: 'Misconfiguration',
        contributingFactors: [],
        timeline: [],
        impactAssessment: {
          systemsAffected: [],
          dataExposed: false,
          usersImpacted: 0,
          downtimeMinutes: 0,
        },
        lessonsLearned: [],
        recommendations: [],
        preventiveMeasures: [],
      });

      const causes = analyzer.getRootCauses();
      expect(causes['Misconfiguration']).toBe(1);
    });

    it('should get impact summary', () => {
      analyzer.createAnalysis({
        incidentId: 'incident1',
        rootCause: 'Test',
        contributingFactors: [],
        timeline: [],
        impactAssessment: {
          systemsAffected: ['system1'],
          dataExposed: true,
          usersImpacted: 50,
          downtimeMinutes: 20,
        },
        lessonsLearned: [],
        recommendations: [],
        preventiveMeasures: [],
      });

      const summary = analyzer.getImpactSummary();
      expect(summary.totalDowntimeMinutes).toBe(20);
      expect(summary.totalUsersImpacted).toBe(50);
      expect(summary.dataExposureIncidents).toBe(1);
    });

    it('should generate executive summary', () => {
      analyzer.createAnalysis({
        incidentId: 'incident1',
        rootCause: 'Test',
        contributingFactors: [],
        timeline: [],
        impactAssessment: {
          systemsAffected: [],
          dataExposed: false,
          usersImpacted: 0,
          downtimeMinutes: 0,
        },
        lessonsLearned: [],
        recommendations: [],
        preventiveMeasures: [],
      });

      const summary = analyzer.generateExecutiveSummary();
      expect(summary).toContain('Post-Incident Analysis');
    });
  });

  describe('SecurityMetricsCollector', () => {
    it('should record metric', () => {
      const metric = metricsCollector.recordMetric({
        name: 'Threat Count',
        value: 5,
        unit: 'threats',
        category: 'threats',
        threshold: 10,
      });

      expect(metric.id).toBeDefined();
      expect(metric.status).toBe('normal');
    });

    it('should determine metric status', () => {
      const critical = metricsCollector.recordMetric({
        name: 'Failed Logins',
        value: 150,
        unit: 'attempts',
        category: 'authentication',
        threshold: 100,
      });

      expect(critical.status).toBe('critical');
    });

    it('should update KPI', () => {
      const kpi = metricsCollector.updateKPI({
        name: 'MTTR',
        description: 'Mean Time To Respond',
        target: 30,
        current: 25,
        unit: 'minutes',
      });

      expect(kpi.id).toBeDefined();
      expect(kpi.current).toBe(25);
    });

    it('should record dashboard snapshot', () => {
      const dashboard = metricsCollector.recordDashboard({
        totalThreats: 10,
        openIncidents: 2,
        criticalVulnerabilities: 1,
        complianceScore: 95,
        mttr: 25,
        mtbf: 720,
        securityScore: 92,
      });

      expect(dashboard.id).toBeDefined();
      expect(dashboard.securityScore).toBe(92);
    });

    it('should get metrics by status', () => {
      metricsCollector.recordMetric({
        name: 'Test',
        value: 150,
        unit: 'count',
        category: 'test',
        threshold: 100,
      });

      const critical = metricsCollector.getMetricsByStatus('critical');
      expect(critical.length).toBeGreaterThan(0);
    });

    it('should calculate security score', () => {
      metricsCollector.updateKPI({
        name: 'Test KPI',
        description: 'Test',
        target: 100,
        current: 80,
        unit: 'score',
      });

      const score = metricsCollector.calculateSecurityScore();
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should get metrics summary', () => {
      metricsCollector.recordMetric({
        name: 'Test',
        value: 50,
        unit: 'count',
        category: 'test',
      });

      const summary = metricsCollector.getMetricsSummary();
      expect(summary.totalMetrics).toBeGreaterThan(0);
    });
  });

  describe('ThreatHuntingEngine', () => {
    it('should create hunt query', () => {
      const query = huntingEngine.createQuery({
        name: 'Suspicious Login',
        description: 'Find suspicious login attempts',
        query: 'failed_attempts > 5',
        dataSource: 'auth_logs',
        enabled: true,
        frequency: 'hourly',
      });

      expect(query.id).toBeDefined();
      expect(query.name).toBe('Suspicious Login');
    });

    it('should execute hunt query', () => {
      const query = huntingEngine.createQuery({
        name: 'Test Query',
        description: 'Test',
        query: 'severity = critical',
        dataSource: 'events',
        enabled: true,
        frequency: 'manual',
      });

      const result = huntingEngine.executeQuery(query.id, [
        { severity: 'critical', event: 'test' },
      ]);

      expect(result).toBeDefined();
      expect(result?.matchCount).toBeGreaterThan(0);
    });

    it('should create hunt campaign', () => {
      const campaign = huntingEngine.createCampaign({
        name: 'APT Detection',
        description: 'Hunt for APT indicators',
        startDate: Date.now(),
        queries: [],
        status: 'active',
        findings: [],
      });

      expect(campaign.id).toBeDefined();
      expect(campaign.status).toBe('active');
    });

    it('should add finding', () => {
      const campaign = huntingEngine.createCampaign({
        name: 'Test Campaign',
        description: 'Test',
        startDate: Date.now(),
        queries: [],
        status: 'active',
        findings: [],
      });

      const findingId = huntingEngine.addFinding(
        campaign.id,
        'Suspicious activity detected',
        'high'
      );
      expect(findingId).toBeDefined();
    });

    it('should get critical findings', () => {
      const campaign = huntingEngine.createCampaign({
        name: 'Test',
        description: 'Test',
        startDate: Date.now(),
        queries: [],
        status: 'active',
        findings: [],
      });

      huntingEngine.addFinding(campaign.id, 'Critical threat', 'critical');

      const critical = huntingEngine.getCriticalFindings();
      expect(critical.length).toBeGreaterThan(0);
    });

    it('should get hunt statistics', () => {
      huntingEngine.createQuery({
        name: 'Test',
        description: 'Test',
        query: 'test',
        dataSource: 'test',
        enabled: true,
        frequency: 'manual',
      });

      const stats = huntingEngine.getStatistics();
      expect(stats.totalQueries).toBe(1);
    });
  });

  describe('SecurityDashboardGenerator', () => {
    it('should create dashboard from template', () => {
      const dashboard = dashboardGenerator.createDashboardFromTemplate('executive');
      expect(dashboard).toBeDefined();
      expect(dashboard?.name).toBe('Executive Dashboard');
    });

    it('should create custom dashboard', () => {
      const dashboard = dashboardGenerator.createDashboard({
        name: 'Custom Dashboard',
        description: 'Custom security dashboard',
        widgets: [],
        isPublic: false,
      });

      expect(dashboard.id).toBeDefined();
      expect(dashboard.name).toBe('Custom Dashboard');
    });

    it('should add widget to dashboard', () => {
      const dashboard = dashboardGenerator.createDashboard({
        name: 'Test',
        description: 'Test',
        widgets: [],
        isPublic: false,
      });

      const widget = dashboardGenerator.addWidget(dashboard.id, {
        type: 'metric',
        title: 'Test Metric',
        data: { value: 100 },
        refreshInterval: 60000,
      });

      expect(widget).toBeDefined();
      expect(widget?.title).toBe('Test Metric');
    });

    it('should remove widget from dashboard', () => {
      const dashboard = dashboardGenerator.createDashboard({
        name: 'Test',
        description: 'Test',
        widgets: [],
        isPublic: false,
      });

      const widget = dashboardGenerator.addWidget(dashboard.id, {
        type: 'metric',
        title: 'Test',
        data: {},
        refreshInterval: 60000,
      });

      const removed = dashboardGenerator.removeWidget(dashboard.id, widget!.id);
      expect(removed).toBe(true);
    });

    it('should record dashboard view', () => {
      const dashboard = dashboardGenerator.createDashboard({
        name: 'Test',
        description: 'Test',
        widgets: [],
        isPublic: false,
      });

      const view = dashboardGenerator.recordView(dashboard.id, { data: 'test' });
      expect(view.id).toBeDefined();
    });

    it('should get templates', () => {
      const templates = dashboardGenerator.getTemplates();
      expect(templates.length).toBeGreaterThan(0);
      expect(templates).toContain('executive');
    });

    it('should export dashboard', () => {
      const dashboard = dashboardGenerator.createDashboard({
        name: 'Test',
        description: 'Test',
        widgets: [],
        isPublic: false,
      });

      const json = dashboardGenerator.exportDashboard(dashboard.id, 'json');
      expect(json).toContain('Test');

      const html = dashboardGenerator.exportDashboard(dashboard.id, 'html');
      expect(html).toContain('<html>');
    });

    it('should get dashboard statistics', () => {
      dashboardGenerator.createDashboard({
        name: 'Test',
        description: 'Test',
        widgets: [],
        isPublic: false,
      });

      const stats = dashboardGenerator.getStatistics();
      expect(stats.totalDashboards).toBe(1);
    });
  });

  describe('Integration Tests', () => {
    it('should coordinate escalation and analysis', () => {
      // Create escalation workflow
      escalationManager.createWorkflow({
        name: 'Test',
        enabled: true,
        levels: [
          {
            level: 'level1',
            timeoutMinutes: 30,
            assignees: [],
            actions: [],
          },
        ],
        maxLevel: 'level1',
      });

      // Escalate incident
      const escalation = escalationManager.escalateIncident(
        'incident1',
        'level1',
        'level1',
        'Test',
        'system'
      );

      // Analyze incident
      const analysis = analyzer.createAnalysis({
        incidentId: 'incident1',
        rootCause: 'Test',
        contributingFactors: [],
        timeline: [],
        impactAssessment: {
          systemsAffected: [],
          dataExposed: false,
          usersImpacted: 0,
          downtimeMinutes: 0,
        },
        lessonsLearned: [],
        recommendations: [],
        preventiveMeasures: [],
      });

      expect(escalation).toBeDefined();
      expect(analysis).toBeDefined();
    });

    it('should coordinate metrics and dashboards', () => {
      // Record metrics
      metricsCollector.recordMetric({
        name: 'Threats',
        value: 10,
        unit: 'count',
        category: 'threats',
      });

      // Create dashboard
      const dashboard = dashboardGenerator.createDashboardFromTemplate('executive');

      // Record view
      const view = dashboardGenerator.recordView(dashboard!.id, {
        threats: 10,
      });

      expect(view).toBeDefined();
      expect(dashboard).toBeDefined();
    });

    it('should coordinate hunting and metrics', () => {
      // Create hunt query
      const query = huntingEngine.createQuery({
        name: 'Test',
        description: 'Test',
        query: 'test',
        dataSource: 'test',
        enabled: true,
        frequency: 'manual',
      });

      // Execute query
      const result = huntingEngine.executeQuery(query.id, []);

      // Record metric
      const metric = metricsCollector.recordMetric({
        name: 'Hunt Results',
        value: result?.matchCount || 0,
        unit: 'matches',
        category: 'hunting',
      });

      expect(result).toBeDefined();
      expect(metric).toBeDefined();
    });

    it('should handle full incident management workflow', () => {
      // 1. Create escalation trigger
      escalationManager.createTrigger({
        name: 'Critical',
        enabled: true,
        condition: (incident) => (incident.severity as string) === 'critical',
        targetLevel: 'level2',
        delayMinutes: 5,
        notifyUsers: [],
      });

      // 2. Escalate incident
      escalationManager.createWorkflow({
        name: 'Test',
        enabled: true,
        levels: [
          {
            level: 'level1',
            timeoutMinutes: 30,
            assignees: [],
            actions: [],
          },
          {
            level: 'level2',
            timeoutMinutes: 15,
            assignees: [],
            actions: [],
          },
        ],
        maxLevel: 'level2',
      });

      const escalation = escalationManager.escalateIncident(
        'incident1',
        'level1',
        'level2',
        'Critical threat',
        'system'
      );

      // 3. Analyze incident
      const analysis = analyzer.createAnalysis({
        incidentId: 'incident1',
        rootCause: 'Misconfiguration',
        contributingFactors: ['Lack of monitoring'],
        timeline: [{ timestamp: Date.now(), event: 'Detected' }],
        impactAssessment: {
          systemsAffected: ['web_server'],
          dataExposed: false,
          usersImpacted: 100,
          downtimeMinutes: 30,
        },
        lessonsLearned: ['Need monitoring'],
        recommendations: [
          {
            priority: 'high',
            action: 'Add monitoring',
            owner: 'ops',
            dueDate: Date.now() + 86400000,
          },
        ],
        preventiveMeasures: ['Monitoring'],
      });

      // 4. Record metrics
      metricsCollector.recordMetric({
        name: 'MTTR',
        value: 30,
        unit: 'minutes',
        category: 'incident',
      });

      // 5. Create dashboard
      const dashboard = dashboardGenerator.createDashboardFromTemplate('soc');

      expect(escalation).toBeDefined();
      expect(analysis).toBeDefined();
      expect(dashboard).toBeDefined();
    });
  });
});
