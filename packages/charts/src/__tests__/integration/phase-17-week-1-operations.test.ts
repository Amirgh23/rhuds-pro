/**
 * Phase 17 Week 1 - Advanced Security Operations Tests
 * Comprehensive test suite for SOC, threat intelligence, incident management, metrics, and vulnerabilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SecurityOperationsCenter } from '../../engine/security/SecurityOperationsCenter';
import { ThreatIntelligenceIntegration } from '../../engine/security/ThreatIntelligenceIntegration';
import { IncidentManagementWorkflow } from '../../engine/security/IncidentManagementWorkflow';
import { SecurityMetricsAggregator } from '../../engine/security/SecurityMetricsAggregator';
import { VulnerabilityManagementSystem } from '../../engine/security/VulnerabilityManagementSystem';

describe('Phase 17 Week 1 - Advanced Security Operations', () => {
  let soc: SecurityOperationsCenter;
  let threatIntel: ThreatIntelligenceIntegration;
  let incidentMgmt: IncidentManagementWorkflow;
  let metricsAgg: SecurityMetricsAggregator;
  let vulnMgmt: VulnerabilityManagementSystem;

  beforeEach(() => {
    soc = new SecurityOperationsCenter();
    threatIntel = new ThreatIntelligenceIntegration();
    incidentMgmt = new IncidentManagementWorkflow();
    metricsAgg = new SecurityMetricsAggregator();
    vulnMgmt = new VulnerabilityManagementSystem();
  });

  describe('SecurityOperationsCenter', () => {
    it('should create security alert', () => {
      const alert = soc.createAlert({
        severity: 'critical',
        type: 'malware',
        source: 'endpoint',
        message: 'Malware detected',
        context: { file: 'test.exe' },
        tags: ['malware', 'endpoint'],
      });

      expect(alert.id).toBeDefined();
      expect(alert.status).toBe('new');
      expect(alert.severity).toBe('critical');
    });

    it('should acknowledge alert', () => {
      const alert = soc.createAlert({
        severity: 'high',
        type: 'intrusion',
        source: 'network',
        message: 'Intrusion attempt',
        context: {},
        tags: ['intrusion'],
      });

      const result = soc.acknowledgeAlert(alert.id, 'analyst@example.com');
      expect(result).toBe(true);

      const updated = soc.getAlert(alert.id);
      expect(updated?.status).toBe('acknowledged');
      expect(updated?.assignedTo).toBe('analyst@example.com');
    });

    it('should resolve alert', () => {
      const alert = soc.createAlert({
        severity: 'medium',
        type: 'suspicious',
        source: 'log',
        message: 'Suspicious activity',
        context: {},
        tags: ['suspicious'],
      });

      const result = soc.resolveAlert(alert.id);
      expect(result).toBe(true);

      const updated = soc.getAlert(alert.id);
      expect(updated?.status).toBe('resolved');
    });

    it('should get active alerts', () => {
      soc.createAlert({
        severity: 'critical',
        type: 'test1',
        source: 'test',
        message: 'Test 1',
        context: {},
        tags: [],
      });

      soc.createAlert({
        severity: 'high',
        type: 'test2',
        source: 'test',
        message: 'Test 2',
        context: {},
        tags: [],
      });

      const active = soc.getActiveAlerts();
      expect(active.length).toBeGreaterThan(0);
    });

    it('should get SOC dashboard', () => {
      soc.createAlert({
        severity: 'critical',
        type: 'test',
        source: 'test',
        message: 'Test',
        context: {},
        tags: [],
      });

      const dashboard = soc.getSOCDashboard();
      expect(dashboard.alertCount).toBeGreaterThan(0);
      expect(dashboard.threatLevel).toBeDefined();
    });

    it('should get SOC statistics', () => {
      soc.createAlert({
        severity: 'critical',
        type: 'test',
        source: 'test',
        message: 'Test',
        context: {},
        tags: [],
      });

      const stats = soc.getStatistics();
      expect(stats.totalAlerts).toBeGreaterThan(0);
      expect(stats.severityDistribution).toBeDefined();
    });

    it('should export SOC report', () => {
      soc.createAlert({
        severity: 'high',
        type: 'test',
        source: 'test',
        message: 'Test',
        context: {},
        tags: [],
      });

      const report = soc.exportSOCReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  describe('ThreatIntelligenceIntegration', () => {
    it('should register threat intelligence source', () => {
      const source = threatIntel.registerSource({
        name: 'OSINT Feed',
        type: 'feed',
        url: 'https://example.com/feed',
        enabled: true,
        syncInterval: 3600000,
      });

      expect(source.id).toBeDefined();
      expect(source.name).toBe('OSINT Feed');
    });

    it('should check if indicator is known threat', async () => {
      const source = threatIntel.registerSource({
        name: 'Test Source',
        type: 'api',
        enabled: true,
        syncInterval: 3600000,
      });

      threatIntel.registerSourceHandler(source.id, async () => [
        {
          id: 'ind1',
          timestamp: Date.now(),
          type: 'ip',
          value: '192.168.1.1',
          severity: 'critical',
          source: source.id,
          confidence: 0.95,
          lastSeen: Date.now(),
          firstSeen: Date.now(),
          tags: ['malicious'],
        },
      ]);

      await threatIntel.syncThreatIntelligence(source.id);

      const threat = threatIntel.isKnownThreat('ip', '192.168.1.1');
      expect(threat).toBeDefined();
      expect(threat?.severity).toBe('critical');
    });

    it('should get indicators by severity', async () => {
      const source = threatIntel.registerSource({
        name: 'Test',
        type: 'feed',
        enabled: true,
        syncInterval: 3600000,
      });

      threatIntel.registerSourceHandler(source.id, async () => [
        {
          id: 'ind1',
          timestamp: Date.now(),
          type: 'domain',
          value: 'malicious.com',
          severity: 'critical',
          source: source.id,
          confidence: 0.9,
          lastSeen: Date.now(),
          firstSeen: Date.now(),
          tags: [],
        },
      ]);

      await threatIntel.syncThreatIntelligence(source.id);

      const critical = threatIntel.getIndicatorsBySeverity('critical');
      expect(critical.length).toBeGreaterThan(0);
    });

    it('should get threat intelligence statistics', async () => {
      const source = threatIntel.registerSource({
        name: 'Test',
        type: 'feed',
        enabled: true,
        syncInterval: 3600000,
      });

      threatIntel.registerSourceHandler(source.id, async () => [
        {
          id: 'ind1',
          timestamp: Date.now(),
          type: 'hash',
          value: 'abc123',
          severity: 'high',
          source: source.id,
          confidence: 0.85,
          lastSeen: Date.now(),
          firstSeen: Date.now(),
          tags: [],
        },
      ]);

      await threatIntel.syncThreatIntelligence(source.id);

      const stats = threatIntel.getStatistics();
      expect(stats.totalIndicators).toBeGreaterThan(0);
    });

    it('should export threat intelligence report', async () => {
      const source = threatIntel.registerSource({
        name: 'Test',
        type: 'feed',
        enabled: true,
        syncInterval: 3600000,
      });

      threatIntel.registerSourceHandler(source.id, async () => [
        {
          id: 'ind1',
          timestamp: Date.now(),
          type: 'url',
          value: 'http://malicious.com/payload',
          severity: 'high',
          source: source.id,
          confidence: 0.88,
          lastSeen: Date.now(),
          firstSeen: Date.now(),
          tags: [],
        },
      ]);

      await threatIntel.syncThreatIntelligence(source.id);

      const report = threatIntel.exportThreatIntelligenceReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  describe('IncidentManagementWorkflow', () => {
    it('should create incident workflow', () => {
      const workflow = incidentMgmt.createWorkflow('incident-123', 'critical');

      expect(workflow.id).toBeDefined();
      expect(workflow.status).toBe('created');
      expect(workflow.severity).toBe('critical');
    });

    it('should assign incident', () => {
      const workflow = incidentMgmt.createWorkflow('incident-123', 'high');

      const result = incidentMgmt.assignIncident(workflow.id, 'analyst@example.com', 'admin');
      expect(result).toBe(true);

      const updated = incidentMgmt.getWorkflow(workflow.id);
      expect(updated?.assignedTo).toBe('analyst@example.com');
    });

    it('should add finding', () => {
      const workflow = incidentMgmt.createWorkflow('incident-123', 'medium');

      const result = incidentMgmt.addFinding(workflow.id, 'Suspicious process detected', 'analyst');
      expect(result).toBe(true);

      const updated = incidentMgmt.getWorkflow(workflow.id);
      expect(updated?.findings.length).toBeGreaterThan(0);
    });

    it('should set root cause', () => {
      const workflow = incidentMgmt.createWorkflow('incident-123', 'high');

      const result = incidentMgmt.setRootCause(workflow.id, 'Compromised credentials', 'analyst');
      expect(result).toBe(true);

      const updated = incidentMgmt.getWorkflow(workflow.id);
      expect(updated?.rootCause).toBe('Compromised credentials');
    });

    it('should get incident management statistics', () => {
      incidentMgmt.createWorkflow('incident-1', 'critical');
      incidentMgmt.createWorkflow('incident-2', 'high');

      const stats = incidentMgmt.getStatistics();
      expect(stats.totalIncidents).toBeGreaterThan(0);
      expect(stats.statusDistribution).toBeDefined();
    });

    it('should export incident report', () => {
      const workflow = incidentMgmt.createWorkflow('incident-123', 'high');

      const report = incidentMgmt.exportIncidentReport(workflow.id, 'json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });

    it('should close workflow', () => {
      const workflow = incidentMgmt.createWorkflow('incident-123', 'medium');

      const result = incidentMgmt.closeWorkflow(workflow.id, 'analyst');
      expect(result).toBe(true);

      const updated = incidentMgmt.getWorkflow(workflow.id);
      expect(updated?.status).toBe('closed');
    });
  });

  describe('SecurityMetricsAggregator', () => {
    it('should record metric', () => {
      const metric = metricsAgg.recordMetric({
        name: 'threat_count',
        value: 42,
        unit: 'count',
        category: 'threats',
        source: 'detector',
        tags: ['realtime'],
      });

      expect(metric.id).toBeDefined();
      expect(metric.value).toBe(42);
    });

    it('should get metrics by category', () => {
      metricsAgg.recordMetric({
        name: 'cpu_usage',
        value: 75,
        unit: 'percent',
        category: 'performance',
        source: 'monitor',
        tags: [],
      });

      const metrics = metricsAgg.getMetricsByCategory('performance');
      expect(metrics.length).toBeGreaterThan(0);
    });

    it('should get metric aggregate', () => {
      metricsAgg.recordMetric({
        name: 'response_time',
        value: 100,
        unit: 'ms',
        category: 'performance',
        source: 'monitor',
        tags: [],
      });

      metricsAgg.recordMetric({
        name: 'response_time',
        value: 150,
        unit: 'ms',
        category: 'performance',
        source: 'monitor',
        tags: [],
      });

      const aggregate = metricsAgg.getMetricAggregate('response_time');
      expect(aggregate).toBeDefined();
      expect(aggregate?.avg).toBeGreaterThan(0);
    });

    it('should get metric trend', () => {
      metricsAgg.recordMetric({
        name: 'alert_count',
        value: 10,
        unit: 'count',
        category: 'alerts',
        source: 'soc',
        tags: [],
      });

      const trend = metricsAgg.getMetricTrend('alert_count', 24);
      expect(Array.isArray(trend)).toBe(true);
    });

    it('should get security metrics statistics', () => {
      metricsAgg.recordMetric({
        name: 'test_metric',
        value: 50,
        unit: 'unit',
        category: 'test',
        source: 'test',
        tags: [],
      });

      const stats = metricsAgg.getStatistics();
      expect(stats.totalMetrics).toBeGreaterThan(0);
    });

    it('should export metrics report', () => {
      metricsAgg.recordMetric({
        name: 'test',
        value: 100,
        unit: 'unit',
        category: 'test',
        source: 'test',
        tags: [],
      });

      const report = metricsAgg.exportMetricsReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  describe('VulnerabilityManagementSystem', () => {
    it('should create vulnerability', () => {
      const vuln = vulnMgmt.createVulnerability({
        title: 'SQL Injection',
        description: 'SQL injection vulnerability',
        severity: 'critical',
        cvssScore: 9.8,
        affectedAssets: ['web-server-1'],
        discoveredBy: 'scanner',
        tags: ['sql', 'injection'],
      });

      expect(vuln.id).toBeDefined();
      expect(vuln.status).toBe('discovered');
    });

    it('should confirm vulnerability', () => {
      const vuln = vulnMgmt.createVulnerability({
        title: 'XSS',
        description: 'Cross-site scripting',
        severity: 'high',
        cvssScore: 7.5,
        affectedAssets: ['web-app'],
        discoveredBy: 'scanner',
        tags: ['xss'],
      });

      const result = vulnMgmt.confirmVulnerability(vuln.id);
      expect(result).toBe(true);

      const updated = vulnMgmt.getVulnerability(vuln.id);
      expect(updated?.status).toBe('confirmed');
    });

    it('should create remediation plan', () => {
      const vuln = vulnMgmt.createVulnerability({
        title: 'RCE',
        description: 'Remote code execution',
        severity: 'critical',
        cvssScore: 10,
        affectedAssets: ['server-1'],
        discoveredBy: 'scanner',
        tags: ['rce'],
      });

      const result = vulnMgmt.createRemediationPlan(vuln.id, ['Apply patch', 'Restart service']);
      expect(result).toBe(true);

      const plan = vulnMgmt.getRemediationPlan(vuln.id);
      expect(plan?.length).toBe(2);
    });

    it('should mark as resolved', () => {
      const vuln = vulnMgmt.createVulnerability({
        title: 'Test',
        description: 'Test vulnerability',
        severity: 'medium',
        cvssScore: 5.0,
        affectedAssets: ['test'],
        discoveredBy: 'scanner',
        tags: [],
      });

      const result = vulnMgmt.markAsResolved(vuln.id);
      expect(result).toBe(true);

      const updated = vulnMgmt.getVulnerability(vuln.id);
      expect(updated?.status).toBe('resolved');
      expect(updated?.remediatedDate).toBeDefined();
    });

    it('should get critical vulnerabilities', () => {
      vulnMgmt.createVulnerability({
        title: 'Critical',
        description: 'Critical vulnerability',
        severity: 'critical',
        cvssScore: 9.9,
        affectedAssets: ['prod'],
        discoveredBy: 'scanner',
        tags: [],
      });

      const critical = vulnMgmt.getCriticalVulnerabilities();
      expect(critical.length).toBeGreaterThan(0);
    });

    it('should get vulnerability management statistics', () => {
      vulnMgmt.createVulnerability({
        title: 'Test',
        description: 'Test',
        severity: 'high',
        cvssScore: 8.0,
        affectedAssets: ['test'],
        discoveredBy: 'scanner',
        tags: [],
      });

      const stats = vulnMgmt.getStatistics();
      expect(stats.totalVulnerabilities).toBeGreaterThan(0);
      expect(stats.severityDistribution).toBeDefined();
    });

    it('should export vulnerability report', () => {
      vulnMgmt.createVulnerability({
        title: 'Test',
        description: 'Test',
        severity: 'medium',
        cvssScore: 6.0,
        affectedAssets: ['test'],
        discoveredBy: 'scanner',
        tags: [],
      });

      const report = vulnMgmt.exportVulnerabilityReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  describe('Integration Tests', () => {
    it('should coordinate SOC and threat intelligence', async () => {
      const source = threatIntel.registerSource({
        name: 'Test',
        type: 'feed',
        enabled: true,
        syncInterval: 3600000,
      });

      threatIntel.registerSourceHandler(source.id, async () => [
        {
          id: 'ind1',
          timestamp: Date.now(),
          type: 'ip',
          value: '10.0.0.1',
          severity: 'critical',
          source: source.id,
          confidence: 0.95,
          lastSeen: Date.now(),
          firstSeen: Date.now(),
          tags: [],
        },
      ]);

      await threatIntel.syncThreatIntelligence(source.id);

      const alert = soc.createAlert({
        severity: 'critical',
        type: 'threat_intel_match',
        source: 'threat_intel',
        message: 'Known malicious IP detected',
        context: { ip: '10.0.0.1' },
        tags: ['threat_intel'],
      });

      expect(alert).toBeDefined();
      expect(alert.severity).toBe('critical');
    });

    it('should coordinate incident management and metrics', () => {
      const workflow = incidentMgmt.createWorkflow('incident-1', 'high');

      metricsAgg.recordMetric({
        name: 'incident_response_time',
        value: 300,
        unit: 'seconds',
        category: 'incidents',
        source: 'workflow',
        tags: ['incident-1'],
      });

      const stats = incidentMgmt.getStatistics();
      expect(stats.totalIncidents).toBeGreaterThan(0);

      const metrics = metricsAgg.getMetricsByCategory('incidents');
      expect(metrics.length).toBeGreaterThan(0);
    });

    it('should coordinate vulnerability management and SOC', () => {
      const vuln = vulnMgmt.createVulnerability({
        title: 'Critical RCE',
        description: 'Remote code execution',
        severity: 'critical',
        cvssScore: 10,
        affectedAssets: ['prod-server'],
        discoveredBy: 'scanner',
        tags: [],
      });

      const alert = soc.createAlert({
        severity: 'critical',
        type: 'vulnerability',
        source: 'vuln_scanner',
        message: `Critical vulnerability: ${vuln.title}`,
        context: { vulnId: vuln.id },
        tags: ['vulnerability'],
      });

      expect(alert.severity).toBe('critical');
    });

    it('should handle full security operations workflow', async () => {
      // Create threat intelligence source
      const source = threatIntel.registerSource({
        name: 'OSINT',
        type: 'feed',
        enabled: true,
        syncInterval: 3600000,
      });

      threatIntel.registerSourceHandler(source.id, async () => [
        {
          id: 'ind1',
          timestamp: Date.now(),
          type: 'domain',
          value: 'attacker.com',
          severity: 'critical',
          source: source.id,
          confidence: 0.99,
          lastSeen: Date.now(),
          firstSeen: Date.now(),
          tags: [],
        },
      ]);

      // Sync threat intelligence
      await threatIntel.syncThreatIntelligence(source.id);

      // Create SOC alert
      const alert = soc.createAlert({
        severity: 'critical',
        type: 'threat_detected',
        source: 'network',
        message: 'Threat detected from known attacker',
        context: { domain: 'attacker.com' },
        tags: ['threat_intel'],
      });

      // Create incident workflow
      const workflow = incidentMgmt.createWorkflow(alert.id, 'critical');

      // Record metrics
      metricsAgg.recordMetric({
        name: 'incident_severity',
        value: 10,
        unit: 'score',
        category: 'incidents',
        source: 'soc',
        tags: [alert.id],
      });

      // Create vulnerability
      const vuln = vulnMgmt.createVulnerability({
        title: 'Exploitation vector',
        description: 'Vulnerability exploited by attacker',
        severity: 'critical',
        cvssScore: 9.8,
        affectedAssets: ['affected-system'],
        discoveredBy: 'incident_response',
        tags: ['incident-related'],
      });

      // Verify all systems are coordinated
      expect(alert).toBeDefined();
      expect(workflow).toBeDefined();
      expect(vuln).toBeDefined();

      const socStats = soc.getStatistics();
      const incidentStats = incidentMgmt.getStatistics();
      const vulnStats = vulnMgmt.getStatistics();

      expect(socStats.totalAlerts).toBeGreaterThan(0);
      expect(incidentStats.totalIncidents).toBeGreaterThan(0);
      expect(vulnStats.totalVulnerabilities).toBeGreaterThan(0);
    });
  });
});
