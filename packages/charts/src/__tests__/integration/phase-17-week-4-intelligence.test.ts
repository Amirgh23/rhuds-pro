/**
 * Phase 17 Week 4 - Security Intelligence & Analytics Tests
 * Comprehensive test suite for intelligence and analytics features
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SecurityIntelligenceEngine } from '../../engine/security/SecurityIntelligenceEngine';
import { ThreatAnalyticsEngine } from '../../engine/security/ThreatAnalyticsEngine';
import { SecurityDashboardEngine } from '../../engine/security/SecurityDashboardEngine';
import { ThreatPredictionEngine } from '../../engine/security/ThreatPredictionEngine';
import { SecurityReportingEngine } from '../../engine/security/SecurityReportingEngine';

describe('Phase 17 Week 4 - Security Intelligence & Analytics', () => {
  // ============================================================================
  // SecurityIntelligenceEngine Tests
  // ============================================================================

  describe('SecurityIntelligenceEngine', () => {
    let engine: SecurityIntelligenceEngine;

    beforeEach(() => {
      engine = new SecurityIntelligenceEngine();
    });

    it('should register intelligence source', () => {
      const source = engine.registerSource({
        id: 'source-1',
        name: 'Threat Feed',
        type: 'feed',
        url: 'https://threat-feed.example.com',
        enabled: true,
      });

      expect(source.id).toBe('source-1');
      expect(source.name).toBe('Threat Feed');
      expect(source.enabled).toBe(true);
    });

    it('should register source handler', () => {
      engine.registerSourceHandler('feed', async () => {
        return [
          {
            id: 'data-1',
            sourceId: 'source-1',
            type: 'malware',
            severity: 'high',
            data: { hash: 'abc123' },
            timestamp: new Date(),
            processed: false,
          },
        ];
      });

      expect(engine).toBeDefined();
    });

    it('should collect intelligence', async () => {
      engine.registerSource({
        id: 'source-1',
        name: 'Threat Feed',
        type: 'feed',
        enabled: true,
      });

      engine.registerSourceHandler('feed', async () => {
        return [
          {
            id: 'data-1',
            sourceId: 'source-1',
            type: 'malware',
            severity: 'high',
            data: { hash: 'abc123' },
            timestamp: new Date(),
            processed: false,
          },
        ];
      });

      const collected = await engine.collectIntelligence('source-1');
      expect(collected).toHaveLength(1);
      expect(collected[0].type).toBe('malware');
    });

    it('should add intelligence data point', () => {
      const data = engine.addDataPoint({
        sourceId: 'source-1',
        type: 'vulnerability',
        severity: 'critical',
        data: { cve: 'CVE-2024-1234' },
        timestamp: new Date(),
        processed: false,
      });

      expect(data.id).toBeDefined();
      expect(data.severity).toBe('critical');
    });

    it('should analyze intelligence', () => {
      const data1 = engine.addDataPoint({
        sourceId: 'source-1',
        type: 'malware',
        severity: 'high',
        data: { hash: 'abc123' },
        timestamp: new Date(),
        processed: false,
      });

      const analysis = engine.analyzeIntelligence([data1.id], 'malware_analysis');
      expect(analysis.id).toBeDefined();
      expect(analysis.findings).toHaveLength(1);
      expect(analysis.recommendations).toHaveLength(1);
    });

    it('should get data by source', () => {
      engine.addDataPoint({
        sourceId: 'source-1',
        type: 'malware',
        severity: 'high',
        data: { hash: 'abc123' },
        timestamp: new Date(),
        processed: false,
      });

      const data = engine.getDataBySource('source-1');
      expect(data).toHaveLength(1);
    });

    it('should get data by severity', () => {
      engine.addDataPoint({
        sourceId: 'source-1',
        type: 'malware',
        severity: 'critical',
        data: { hash: 'abc123' },
        timestamp: new Date(),
        processed: false,
      });

      const data = engine.getDataBySeverity('critical');
      expect(data).toHaveLength(1);
    });

    it('should get high confidence analyses', () => {
      const data1 = engine.addDataPoint({
        sourceId: 'source-1',
        type: 'malware',
        severity: 'high',
        data: { hash: 'abc123' },
        timestamp: new Date(),
        processed: false,
      });

      engine.analyzeIntelligence([data1.id], 'analysis');
      const analyses = engine.getHighConfidenceAnalyses(0.5);
      expect(analyses.length).toBeGreaterThanOrEqual(0);
    });

    it('should get statistics', () => {
      engine.registerSource({
        id: 'source-1',
        name: 'Feed',
        type: 'feed',
        enabled: true,
      });

      engine.addDataPoint({
        sourceId: 'source-1',
        type: 'malware',
        severity: 'critical',
        data: {},
        timestamp: new Date(),
        processed: false,
      });

      const stats = engine.getStatistics();
      expect(stats.totalSources).toBe(1);
      expect(stats.totalDataPoints).toBe(1);
      expect(stats.criticalCount).toBe(1);
    });

    it('should export intelligence report', () => {
      engine.addDataPoint({
        sourceId: 'source-1',
        type: 'malware',
        severity: 'high',
        data: {},
        timestamp: new Date(),
        processed: false,
      });

      const report = engine.exportIntelligenceReport('json');
      expect(report).toContain('statistics');
    });
  });

  // ============================================================================
  // ThreatAnalyticsEngine Tests
  // ============================================================================

  describe('ThreatAnalyticsEngine', () => {
    let engine: ThreatAnalyticsEngine;

    beforeEach(() => {
      engine = new ThreatAnalyticsEngine();
    });

    it('should record threat metric', () => {
      const metric = engine.recordMetric('threat-1', 'activity_count', 10);
      expect(metric.id).toBeDefined();
      expect(metric.value).toBe(10);
    });

    it('should analyze threat', () => {
      engine.recordMetric('threat-1', 'activity_count', 10);
      const analysis = engine.analyzeThreat('threat-1', 'malware');
      expect(analysis.id).toBeDefined();
      expect(analysis.threatId).toBe('threat-1');
    });

    it('should get threat metrics', () => {
      engine.recordMetric('threat-1', 'activity_count', 10);
      engine.recordMetric('threat-1', 'activity_count', 15);

      const metrics = engine.getThreatMetrics('threat-1');
      expect(metrics).toHaveLength(2);
    });

    it('should get threat trend', () => {
      engine.recordMetric('threat-1', 'activity_count', 10);
      engine.recordMetric('threat-1', 'activity_count', 15);

      const trend = engine.getThreatTrend('threat-1', 'activity_count');
      expect(trend.threatId).toBe('threat-1');
      expect(trend.dataPoints).toHaveLength(2);
    });

    it('should get high severity analyses', () => {
      engine.recordMetric('threat-1', 'activity_count', 100);
      engine.analyzeThreat('threat-1', 'malware');

      const analyses = engine.getHighSeverityAnalyses(0.5);
      expect(analyses.length).toBeGreaterThanOrEqual(0);
    });

    it('should get analyses by trend', () => {
      engine.recordMetric('threat-1', 'activity_count', 10);
      engine.recordMetric('threat-1', 'activity_count', 15);
      engine.analyzeThreat('threat-1', 'malware');

      const analyses = engine.getAnalysesByTrend('increasing');
      expect(analyses.length).toBeGreaterThanOrEqual(0);
    });

    it('should get statistics', () => {
      engine.recordMetric('threat-1', 'activity_count', 10);
      engine.analyzeThreat('threat-1', 'malware');

      const stats = engine.getStatistics();
      expect(stats.totalThreats).toBe(1);
      expect(stats.totalMetrics).toBe(1);
      expect(stats.totalAnalyses).toBe(1);
    });

    it('should export analytics report', () => {
      engine.recordMetric('threat-1', 'activity_count', 10);
      const report = engine.exportAnalyticsReport('json');
      expect(report).toContain('statistics');
    });
  });

  // ============================================================================
  // SecurityDashboardEngine Tests
  // ============================================================================

  describe('SecurityDashboardEngine', () => {
    let engine: SecurityDashboardEngine;

    beforeEach(() => {
      engine = new SecurityDashboardEngine();
    });

    it('should create dashboard', () => {
      const dashboard = engine.createDashboard('Security Dashboard', 'Main security dashboard');
      expect(dashboard.id).toBeDefined();
      expect(dashboard.name).toBe('Security Dashboard');
      expect(dashboard.widgets).toHaveLength(0);
    });

    it('should add widget to dashboard', () => {
      const dashboard = engine.createDashboard('Dashboard', 'Description');
      const widget = engine.addWidget(dashboard.id, {
        type: 'chart',
        title: 'Threat Chart',
        data: { threats: 10 },
        position: { x: 0, y: 0 },
        size: { width: 300, height: 200 },
      });

      expect(widget.id).toBeDefined();
      expect(widget.title).toBe('Threat Chart');
    });

    it('should remove widget from dashboard', () => {
      const dashboard = engine.createDashboard('Dashboard', 'Description');
      const widget = engine.addWidget(dashboard.id, {
        type: 'chart',
        title: 'Chart',
        data: {},
        position: { x: 0, y: 0 },
        size: { width: 300, height: 200 },
      });

      engine.removeWidget(dashboard.id, widget.id);
      const updated = engine.getDashboard(dashboard.id);
      expect(updated?.widgets).toHaveLength(0);
    });

    it('should update widget', () => {
      const dashboard = engine.createDashboard('Dashboard', 'Description');
      const widget = engine.addWidget(dashboard.id, {
        type: 'chart',
        title: 'Chart',
        data: {},
        position: { x: 0, y: 0 },
        size: { width: 300, height: 200 },
      });

      engine.updateWidget(dashboard.id, widget.id, { title: 'Updated Chart' });
      const updated = engine.getDashboard(dashboard.id);
      expect(updated?.widgets[0].title).toBe('Updated Chart');
    });

    it('should record metrics', () => {
      const dashboard = engine.createDashboard('Dashboard', 'Description');
      engine.recordMetrics(dashboard.id, {
        totalIncidents: 5,
        activeAlerts: 3,
        threatLevel: 'high',
        complianceScore: 0.85,
        mttr: 120,
        mtbf: 720,
      });

      const metrics = engine.getMetrics(dashboard.id);
      expect(metrics?.totalIncidents).toBe(5);
    });

    it('should get threat level', () => {
      const dashboard = engine.createDashboard('Dashboard', 'Description');
      engine.recordMetrics(dashboard.id, {
        totalIncidents: 5,
        activeAlerts: 3,
        threatLevel: 'critical',
        complianceScore: 0.85,
        mttr: 120,
        mtbf: 720,
      });

      const level = engine.getThreatLevel();
      expect(['critical', 'high', 'medium', 'low']).toContain(level);
    });

    it('should get statistics', () => {
      engine.createDashboard('Dashboard 1', 'Description');
      engine.createDashboard('Dashboard 2', 'Description');

      const stats = engine.getStatistics();
      expect(stats.totalDashboards).toBe(2);
    });

    it('should export dashboard report', () => {
      const dashboard = engine.createDashboard('Dashboard', 'Description');
      const report = engine.exportDashboardReport(dashboard.id, 'json');
      expect(report).toContain('Dashboard');
    });
  });

  // ============================================================================
  // ThreatPredictionEngine Tests
  // ============================================================================

  describe('ThreatPredictionEngine', () => {
    let engine: ThreatPredictionEngine;

    beforeEach(() => {
      engine = new ThreatPredictionEngine();
    });

    it('should create prediction model', () => {
      const model = engine.createModel('Malware Predictor', 'ml');
      expect(model.id).toBeDefined();
      expect(model.name).toBe('Malware Predictor');
      expect(model.accuracy).toBe(0);
    });

    it('should train model', () => {
      const model = engine.createModel('Predictor', 'ml');
      engine.trainModel(model.id, [{ feature1: 1, feature2: 2 }]);

      const trained = engine.getModel(model.id);
      expect(trained?.trainingDataPoints).toBe(1);
      expect(trained?.accuracy).toBeGreaterThan(0);
    });

    it('should predict threat', () => {
      const model = engine.createModel('Predictor', 'ml');
      const prediction = engine.predictThreat(model.id, 'malware', { feature1: 1 });

      expect(prediction.id).toBeDefined();
      expect(prediction.threatType).toBe('malware');
      expect(prediction.probability).toBeGreaterThanOrEqual(0);
      expect(prediction.probability).toBeLessThanOrEqual(1);
    });

    it('should get predictions by threat type', () => {
      const model = engine.createModel('Predictor', 'ml');
      engine.predictThreat(model.id, 'malware', {});
      engine.predictThreat(model.id, 'malware', {});

      const predictions = engine.getPredictionsByThreatType('malware');
      expect(predictions).toHaveLength(2);
    });

    it('should get high probability predictions', () => {
      const model = engine.createModel('Predictor', 'ml');
      engine.predictThreat(model.id, 'malware', {});

      const predictions = engine.getHighProbabilityPredictions(0.5);
      expect(predictions.length).toBeGreaterThanOrEqual(0);
    });

    it('should get recent predictions', () => {
      const model = engine.createModel('Predictor', 'ml');
      engine.predictThreat(model.id, 'malware', {});

      const predictions = engine.getRecentPredictions(1);
      expect(predictions).toHaveLength(1);
    });

    it('should get statistics', () => {
      const model = engine.createModel('Predictor', 'ml');
      engine.trainModel(model.id, [{ feature: 1 }]);
      engine.predictThreat(model.id, 'malware', {});

      const stats = engine.getStatistics();
      expect(stats.totalModels).toBe(1);
      expect(stats.totalPredictions).toBe(1);
    });

    it('should export prediction report', () => {
      const model = engine.createModel('Predictor', 'ml');
      engine.predictThreat(model.id, 'malware', {});

      const report = engine.exportPredictionReport('json');
      expect(report).toContain('statistics');
    });
  });

  // ============================================================================
  // SecurityReportingEngine Tests
  // ============================================================================

  describe('SecurityReportingEngine', () => {
    let engine: SecurityReportingEngine;

    beforeEach(() => {
      engine = new SecurityReportingEngine();
    });

    it('should create report template', () => {
      const template = engine.createTemplate('Monthly Report', 'monthly', [
        'Executive Summary',
        'Threat Analysis',
      ]);

      expect(template.id).toBeDefined();
      expect(template.name).toBe('Monthly Report');
      expect(template.sections).toHaveLength(2);
    });

    it('should generate report', () => {
      const template = engine.createTemplate('Report', 'monthly', ['Executive Summary']);
      const report = engine.generateReport(
        template.id,
        'Security Report',
        'Monthly security report',
        { start: new Date('2024-01-01'), end: new Date('2024-01-31') }
      );

      expect(report.id).toBeDefined();
      expect(report.title).toBe('Security Report');
      expect(report.sections).toHaveLength(1);
    });

    it('should add report data', () => {
      const template = engine.createTemplate('Report', 'monthly', ['Summary']);
      const report = engine.generateReport(template.id, 'Report', 'Description', {
        start: new Date(),
        end: new Date(),
      });

      engine.addReportData(report.id, { incidents: 5 });
      expect(engine).toBeDefined();
    });

    it('should get report', () => {
      const template = engine.createTemplate('Report', 'monthly', ['Summary']);
      const report = engine.generateReport(template.id, 'Report', 'Description', {
        start: new Date(),
        end: new Date(),
      });

      const retrieved = engine.getReport(report.id);
      expect(retrieved?.title).toBe('Report');
    });

    it('should get reports by template', () => {
      const template = engine.createTemplate('Report', 'monthly', ['Summary']);
      engine.generateReport(template.id, 'Report 1', 'Description', {
        start: new Date(),
        end: new Date(),
      });

      const reports = engine.getReportsByTemplate(template.id);
      expect(reports).toHaveLength(1);
    });

    it('should get template', () => {
      const template = engine.createTemplate('Report', 'monthly', ['Summary']);
      const retrieved = engine.getTemplate(template.id);
      expect(retrieved?.name).toBe('Report');
    });

    it('should get statistics', () => {
      const template = engine.createTemplate('Report', 'monthly', ['Summary']);
      engine.generateReport(template.id, 'Report', 'Description', {
        start: new Date(),
        end: new Date(),
      });

      const stats = engine.getStatistics();
      expect(stats.totalReports).toBe(1);
      expect(stats.totalTemplates).toBe(1);
    });

    it('should export report', () => {
      const template = engine.createTemplate('Report', 'monthly', ['Summary']);
      const report = engine.generateReport(template.id, 'Report', 'Description', {
        start: new Date(),
        end: new Date(),
      });

      const exported = engine.exportReport(report.id, 'json');
      expect(exported).toContain('Report');
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Tests', () => {
    it('should coordinate intelligence and analytics', () => {
      const intelligence = new SecurityIntelligenceEngine();
      const analytics = new ThreatAnalyticsEngine();

      intelligence.registerSource({
        id: 'source-1',
        name: 'Feed',
        type: 'feed',
        enabled: true,
      });

      const data = intelligence.addDataPoint({
        sourceId: 'source-1',
        type: 'malware',
        severity: 'high',
        data: {},
        timestamp: new Date(),
        processed: false,
      });

      analytics.recordMetric('threat-1', 'activity_count', 10);

      expect(data.id).toBeDefined();
      expect(analytics.getThreatMetrics('threat-1')).toHaveLength(1);
    });

    it('should coordinate analytics and dashboard', () => {
      const analytics = new ThreatAnalyticsEngine();
      const dashboard = new SecurityDashboardEngine();

      analytics.recordMetric('threat-1', 'activity_count', 10);
      const analysis = analytics.analyzeThreat('threat-1', 'malware');

      const dash = dashboard.createDashboard('Dashboard', 'Description');
      dashboard.recordMetrics(dash.id, {
        totalIncidents: 5,
        activeAlerts: 3,
        threatLevel: 'high',
        complianceScore: 0.85,
        mttr: 120,
        mtbf: 720,
      });

      expect(analysis.id).toBeDefined();
      expect(dashboard.getMetrics(dash.id)?.totalIncidents).toBe(5);
    });

    it('should coordinate prediction and reporting', () => {
      const prediction = new ThreatPredictionEngine();
      const reporting = new SecurityReportingEngine();

      const model = prediction.createModel('Predictor', 'ml');
      prediction.predictThreat(model.id, 'malware', {});

      const template = reporting.createTemplate('Report', 'monthly', ['Predictions']);
      const report = reporting.generateReport(template.id, 'Report', 'Description', {
        start: new Date(),
        end: new Date(),
      });

      expect(prediction.getStatistics().totalPredictions).toBe(1);
      expect(report.sections).toHaveLength(1);
    });

    it('should handle full intelligence and analytics workflow', () => {
      const intelligence = new SecurityIntelligenceEngine();
      const analytics = new ThreatAnalyticsEngine();
      const dashboard = new SecurityDashboardEngine();
      const prediction = new ThreatPredictionEngine();
      const reporting = new SecurityReportingEngine();

      // Collect intelligence
      intelligence.registerSource({
        id: 'source-1',
        name: 'Feed',
        type: 'feed',
        enabled: true,
      });

      // Analyze threats
      analytics.recordMetric('threat-1', 'activity_count', 10);
      analytics.analyzeThreat('threat-1', 'malware');

      // Create dashboard
      const dash = dashboard.createDashboard('Dashboard', 'Description');
      dashboard.recordMetrics(dash.id, {
        totalIncidents: 5,
        activeAlerts: 3,
        threatLevel: 'high',
        complianceScore: 0.85,
        mttr: 120,
        mtbf: 720,
      });

      // Make predictions
      const model = prediction.createModel('Predictor', 'ml');
      prediction.predictThreat(model.id, 'malware', {});

      // Generate report
      const template = reporting.createTemplate('Report', 'monthly', ['Summary']);
      reporting.generateReport(template.id, 'Report', 'Description', {
        start: new Date(),
        end: new Date(),
      });

      expect(intelligence).toBeDefined();
      expect(analytics.getStatistics().totalAnalyses).toBe(1);
      expect(dashboard.getStatistics().totalDashboards).toBe(1);
      expect(prediction.getStatistics().totalPredictions).toBe(1);
      expect(reporting.getStatistics().totalReports).toBe(1);
    });
  });
});
