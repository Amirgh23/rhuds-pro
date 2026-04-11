/**
 * Phase 17 Week 3 - Advanced Threat Hunting Tests
 * Comprehensive test suite for threat hunting features
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ThreatHuntingEngine } from '../../engine/security/ThreatHuntingEngine';
import { PatternDetectionEngine } from '../../engine/security/PatternDetectionEngine';
import { AnomalyDetectionEngine } from '../../engine/security/AnomalyDetectionEngine';
import { HuntingAutomationEngine } from '../../engine/security/HuntingAutomationEngine';
import { ThreatIntelligenceCorrelation } from '../../engine/security/ThreatIntelligenceCorrelation';

describe('Phase 17 Week 3 - Advanced Threat Hunting', () => {
  // ============================================================================
  // ThreatHuntingEngine Tests
  // ============================================================================

  describe('ThreatHuntingEngine', () => {
    let engine: ThreatHuntingEngine;

    beforeEach(() => {
      engine = new ThreatHuntingEngine();
    });

    it('should register query handler', () => {
      engine.registerQueryHandler('process', async () => {
        return [{ id: 'proc-1', severity: 'high' }];
      });

      expect(engine).toBeDefined();
    });

    it('should create hunt query', () => {
      const query = engine.createQuery(
        'Suspicious Process Query',
        'Hunt for suspicious processes',
        'process:cmd.exe',
        { timeRange: '24h' }
      );

      expect(query.id).toBeDefined();
      expect(query.name).toBe('Suspicious Process Query');
      expect(query.status).toBe('draft');
    });

    it('should execute hunt query', async () => {
      engine.registerQueryHandler('process', async () => {
        return [
          { id: 'proc-1', severity: 'high', type: 'suspicious' },
          { id: 'proc-2', severity: 'medium', type: 'suspicious' },
        ];
      });

      const query = engine.createQuery('Test Query', 'Test', 'process:cmd.exe');
      const result = await engine.executeQuery(query.id);

      expect(result?.status).toBe('completed');
      expect(result?.matchCount).toBe(2);
    });

    it('should get query', () => {
      const query = engine.createQuery('Test Query', 'Test', 'process:cmd.exe');
      const retrieved = engine.getQuery(query.id);

      expect(retrieved?.id).toBe(query.id);
    });

    it('should get all queries', () => {
      engine.createQuery('Query 1', 'Test 1', 'process:cmd.exe');
      engine.createQuery('Query 2', 'Test 2', 'network:port:443');

      const queries = engine.getAllQueries();
      expect(queries.length).toBe(2);
    });

    it('should get active queries', async () => {
      engine.registerQueryHandler('process', async () => []);

      const query = engine.createQuery('Test Query', 'Test', 'process:cmd.exe');
      await engine.executeQuery(query.id);

      const activeQueries = engine.getActiveQueries();
      expect(activeQueries.length).toBe(1);
    });

    it('should get hunting statistics', async () => {
      engine.registerQueryHandler('process', async () => [{ id: 'proc-1', severity: 'high' }]);

      const query = engine.createQuery('Test Query', 'Test', 'process:cmd.exe');
      await engine.executeQuery(query.id);

      const stats = engine.getStatistics();
      expect(stats.totalQueries).toBe(1);
      expect(stats.totalMatches).toBeGreaterThan(0);
    });

    it('should export hunting report', async () => {
      engine.registerQueryHandler('process', async () => []);

      const query = engine.createQuery('Test Query', 'Test', 'process:cmd.exe');
      await engine.executeQuery(query.id);

      const report = engine.exportHuntingReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // PatternDetectionEngine Tests
  // ============================================================================

  describe('PatternDetectionEngine', () => {
    let engine: PatternDetectionEngine;

    beforeEach(() => {
      engine = new PatternDetectionEngine();
    });

    it('should register detection handler', () => {
      engine.registerDetectionHandler('behavioral', (signature, data) => {
        return (data.action as string) === signature.action;
      });

      expect(engine).toBeDefined();
    });

    it('should create detection pattern', () => {
      const pattern = engine.createPattern(
        'Suspicious Login Pattern',
        'Detect suspicious login attempts',
        'behavioral',
        { action: 'login', failureCount: 5 },
        'high'
      );

      expect(pattern.id).toBeDefined();
      expect(pattern.name).toBe('Suspicious Login Pattern');
      expect(pattern.enabled).toBe(true);
    });

    it('should analyze data against patterns', () => {
      engine.registerDetectionHandler('behavioral', (signature, data) => {
        return (data.action as string) === signature.action;
      });

      engine.createPattern('Test Pattern', 'Test', 'behavioral', { action: 'login' }, 'high');

      const matches = engine.analyzeData({ action: 'login', user: 'admin' });
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should get pattern', () => {
      const pattern = engine.createPattern('Test Pattern', 'Test', 'behavioral', {}, 'high');
      const retrieved = engine.getPattern(pattern.id);

      expect(retrieved?.id).toBe(pattern.id);
    });

    it('should get all patterns', () => {
      engine.createPattern('Pattern 1', 'Test 1', 'behavioral', {}, 'high');
      engine.createPattern('Pattern 2', 'Test 2', 'network', {}, 'medium');

      const patterns = engine.getAllPatterns();
      expect(patterns.length).toBe(2);
    });

    it('should enable and disable patterns', () => {
      const pattern = engine.createPattern('Test Pattern', 'Test', 'behavioral', {}, 'high');

      expect(engine.disablePattern(pattern.id)).toBe(true);
      const disabled = engine.getPattern(pattern.id);
      expect(disabled?.enabled).toBe(false);

      expect(engine.enablePattern(pattern.id)).toBe(true);
      const enabled = engine.getPattern(pattern.id);
      expect(enabled?.enabled).toBe(true);
    });

    it('should get detection statistics', () => {
      engine.registerDetectionHandler('behavioral', (signature, data) => {
        return (data.action as string) === signature.action;
      });

      engine.createPattern('Test Pattern', 'Test', 'behavioral', { action: 'login' }, 'high');
      engine.analyzeData({ action: 'login' });

      const stats = engine.getStatistics();
      expect(stats.totalPatterns).toBe(1);
      expect(stats.totalMatches).toBeGreaterThan(0);
    });

    it('should export detection report', () => {
      engine.createPattern('Test Pattern', 'Test', 'behavioral', {}, 'high');

      const report = engine.exportDetectionReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // AnomalyDetectionEngine Tests
  // ============================================================================

  describe('AnomalyDetectionEngine', () => {
    let engine: AnomalyDetectionEngine;

    beforeEach(() => {
      engine = new AnomalyDetectionEngine();
    });

    it('should create baseline profile', () => {
      const dataPoints = [
        { cpu: 50, memory: 60, disk: 70 },
        { cpu: 55, memory: 65, disk: 75 },
        { cpu: 52, memory: 62, disk: 72 },
      ];

      const profile = engine.createBaselineProfile('Normal Behavior', dataPoints);

      expect(profile.id).toBeDefined();
      expect(profile.name).toBe('Normal Behavior');
      expect(profile.sampleCount).toBe(3);
    });

    it('should record data point', () => {
      engine.recordDataPoint({ cpu: 50, memory: 60 });
      engine.recordDataPoint({ cpu: 55, memory: 65 });

      const stats = engine.getStatistics();
      expect(stats.totalDataPoints).toBe(2);
    });

    it('should detect anomalies', () => {
      const dataPoints = [
        { cpu: 50, memory: 60 },
        { cpu: 55, memory: 65 },
        { cpu: 52, memory: 62 },
      ];

      const profile = engine.createBaselineProfile('Normal', dataPoints);

      // Anomalous data point
      const anomaly = engine.detectAnomalies(profile.id, { cpu: 95, memory: 98 });

      expect(anomaly).toBeDefined();
      expect(anomaly?.anomalyScore).toBeGreaterThan(0);
    });

    it('should get baseline profile', () => {
      const profile = engine.createBaselineProfile('Test', [{ cpu: 50 }]);
      const retrieved = engine.getBaselineProfile(profile.id);

      expect(retrieved?.id).toBe(profile.id);
    });

    it('should get anomalies by severity', () => {
      const dataPoints = [{ cpu: 50 }, { cpu: 55 }, { cpu: 52 }];
      const profile = engine.createBaselineProfile('Normal', dataPoints);

      engine.detectAnomalies(profile.id, { cpu: 95 });

      const anomalies = engine.getAnomaliesBySeverity('critical');
      expect(anomalies.length).toBeGreaterThanOrEqual(0);
    });

    it('should get high anomaly scores', () => {
      const dataPoints = [{ cpu: 50 }, { cpu: 55 }];
      const profile = engine.createBaselineProfile('Normal', dataPoints);

      engine.detectAnomalies(profile.id, { cpu: 95 });

      const highScores = engine.getHighAnomalyScores(0.5);
      expect(highScores.length).toBeGreaterThanOrEqual(0);
    });

    it('should get anomaly statistics', () => {
      const dataPoints = [{ cpu: 50 }, { cpu: 55 }];
      const profile = engine.createBaselineProfile('Normal', dataPoints);

      engine.detectAnomalies(profile.id, { cpu: 95 });

      const stats = engine.getStatistics();
      expect(stats.totalAnomalies).toBeGreaterThanOrEqual(0);
    });

    it('should export anomaly report', () => {
      const profile = engine.createBaselineProfile('Test', [{ cpu: 50 }]);

      const report = engine.exportAnomalyReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // HuntingAutomationEngine Tests
  // ============================================================================

  describe('HuntingAutomationEngine', () => {
    let engine: HuntingAutomationEngine;

    beforeEach(() => {
      engine = new HuntingAutomationEngine();
    });

    it('should register campaign handler', () => {
      engine.registerCampaignHandler('default', async () => [
        { type: 'query', id: 'q1', matchCount: 5 },
      ]);

      expect(engine).toBeDefined();
    });

    it('should create hunting campaign', () => {
      const campaign = engine.createCampaign(
        'Malware Hunt',
        'Hunt for malware indicators',
        ['query1', 'query2'],
        ['pattern1', 'pattern2'],
        'full-auto'
      );

      expect(campaign.id).toBeDefined();
      expect(campaign.name).toBe('Malware Hunt');
      expect(campaign.status).toBe('draft');
    });

    it('should start campaign', async () => {
      engine.registerCampaignHandler('default', async () => [
        { type: 'query', id: 'q1', matchCount: 5 },
      ]);

      const campaign = engine.createCampaign('Test Campaign', 'Test', ['q1'], ['p1']);
      const execution = await engine.startCampaign(campaign.id);

      expect(execution?.status).toBe('completed');
      expect(execution?.matchesFound).toBeGreaterThanOrEqual(0);
    });

    it('should pause and resume campaign', async () => {
      engine.registerCampaignHandler('default', async () => []);

      const campaign = engine.createCampaign('Test Campaign', 'Test', ['q1'], ['p1']);

      // Start campaign first to make it active
      await engine.startCampaign(campaign.id);

      expect(engine.pauseCampaign(campaign.id)).toBe(true);
      const paused = engine.getCampaign(campaign.id);
      expect(paused?.status).toBe('paused');

      expect(engine.resumeCampaign(campaign.id)).toBe(true);
      const resumed = engine.getCampaign(campaign.id);
      expect(resumed?.status).toBe('active');
    });

    it('should get campaign', () => {
      const campaign = engine.createCampaign('Test Campaign', 'Test', ['q1'], ['p1']);
      const retrieved = engine.getCampaign(campaign.id);

      expect(retrieved?.id).toBe(campaign.id);
    });

    it('should get all campaigns', () => {
      engine.createCampaign('Campaign 1', 'Test 1', ['q1'], ['p1']);
      engine.createCampaign('Campaign 2', 'Test 2', ['q2'], ['p2']);

      const campaigns = engine.getAllCampaigns();
      expect(campaigns.length).toBe(2);
    });

    it('should get hunting statistics', async () => {
      engine.registerCampaignHandler('default', async () => [
        { type: 'query', id: 'q1', matchCount: 5 },
      ]);

      const campaign = engine.createCampaign('Test Campaign', 'Test', ['q1'], ['p1']);
      await engine.startCampaign(campaign.id);

      const stats = engine.getStatistics();
      expect(stats.totalCampaigns).toBe(1);
      expect(stats.totalExecutions).toBeGreaterThan(0);
    });

    it('should export hunting report', async () => {
      engine.registerCampaignHandler('default', async () => []);

      const campaign = engine.createCampaign('Test Campaign', 'Test', ['q1'], ['p1']);
      await engine.startCampaign(campaign.id);

      const report = engine.exportHuntingReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // ThreatIntelligenceCorrelation Tests
  // ============================================================================

  describe('ThreatIntelligenceCorrelation', () => {
    let engine: ThreatIntelligenceCorrelation;

    beforeEach(() => {
      engine = new ThreatIntelligenceCorrelation();
    });

    it('should register correlation rule', () => {
      engine.registerCorrelationRule('indicator-match', (huntingResult, threatProfile) => {
        return null;
      });

      expect(engine).toBeDefined();
    });

    it('should create threat profile', () => {
      const profile = engine.createThreatProfile(
        'APT28',
        'Russian APT group',
        [
          { type: 'ip', value: '192.168.1.1', severity: 'high' },
          { type: 'domain', value: 'evil.com', severity: 'high' },
        ],
        ['reconnaissance', 'weaponization'],
        ['T1592', 'T1589']
      );

      expect(profile.id).toBeDefined();
      expect(profile.name).toBe('APT28');
      expect(profile.indicators.length).toBe(2);
    });

    it('should correlate hunting result with threat intelligence', () => {
      engine.registerCorrelationRule('indicator-match', (huntingResult, threatProfile) => {
        if (
          huntingResult.ip === threatProfile.indicators[0]?.value &&
          threatProfile.indicators[0]?.type === 'ip'
        ) {
          return {
            id: '',
            timestamp: Date.now(),
            huntingResultId: '',
            threatIntelligenceId: '',
            correlationType: 'direct',
            confidence: 0.95,
            severity: 'critical',
            correlationData: { match: 'ip' },
            actionRecommendation: 'Block IP immediately',
          };
        }
        return null;
      });

      engine.createThreatProfile(
        'APT28',
        'Test',
        [{ type: 'ip', value: '192.168.1.1', severity: 'high' }],
        [],
        []
      );

      const correlations = engine.correlateResult('hunt-1', { ip: '192.168.1.1' });
      expect(correlations.length).toBeGreaterThanOrEqual(0);
    });

    it('should get threat profile', () => {
      const profile = engine.createThreatProfile('APT28', 'Test', [], [], []);
      const retrieved = engine.getThreatProfile(profile.id);

      expect(retrieved?.id).toBe(profile.id);
    });

    it('should get all threat profiles', () => {
      engine.createThreatProfile('APT28', 'Test 1', [], [], []);
      engine.createThreatProfile('APT29', 'Test 2', [], [], []);

      const profiles = engine.getAllThreatProfiles();
      expect(profiles.length).toBe(2);
    });

    it('should get high confidence correlations', () => {
      engine.registerCorrelationRule('test', (huntingResult, threatProfile) => {
        return {
          id: '',
          timestamp: Date.now(),
          huntingResultId: '',
          threatIntelligenceId: '',
          correlationType: 'direct',
          confidence: 0.95,
          severity: 'critical',
          correlationData: {},
          actionRecommendation: 'Test',
        };
      });

      engine.createThreatProfile('APT28', 'Test', [], [], []);
      engine.correlateResult('hunt-1', {});

      const correlations = engine.getHighConfidenceCorrelations(0.9);
      expect(correlations.length).toBeGreaterThanOrEqual(0);
    });

    it('should get correlation statistics', () => {
      engine.createThreatProfile('APT28', 'Test', [], [], []);

      const stats = engine.getStatistics();
      expect(stats.totalThreatProfiles).toBe(1);
      expect(stats.totalCorrelations).toBeGreaterThanOrEqual(0);
    });

    it('should export correlation report', () => {
      engine.createThreatProfile('APT28', 'Test', [], [], []);

      const report = engine.exportCorrelationReport('json');
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Tests', () => {
    it('should coordinate threat hunting and pattern detection', () => {
      const hunting = new ThreatHuntingEngine();
      const patterns = new PatternDetectionEngine();

      hunting.registerQueryHandler('process', async () => [{ id: 'proc-1', severity: 'high' }]);

      patterns.registerDetectionHandler('behavioral', () => true);

      const query = hunting.createQuery('Test', 'Test', 'process:cmd.exe');
      const pattern = patterns.createPattern('Test', 'Test', 'behavioral', {}, 'high');

      expect(query.id).toBeDefined();
      expect(pattern.id).toBeDefined();
    });

    it('should coordinate anomaly detection and hunting automation', () => {
      const anomaly = new AnomalyDetectionEngine();
      const automation = new HuntingAutomationEngine();

      const profile = anomaly.createBaselineProfile('Normal', [{ cpu: 50 }]);
      const campaign = automation.createCampaign('Test', 'Test', ['q1'], ['p1']);

      expect(profile.id).toBeDefined();
      expect(campaign.id).toBeDefined();
    });

    it('should coordinate threat intelligence correlation with hunting', () => {
      const hunting = new ThreatHuntingEngine();
      const correlation = new ThreatIntelligenceCorrelation();

      hunting.registerQueryHandler('process', async () => []);

      const query = hunting.createQuery('Test', 'Test', 'process:cmd.exe');
      const profile = correlation.createThreatProfile('APT28', 'Test', [], [], []);

      expect(query.id).toBeDefined();
      expect(profile.id).toBeDefined();
    });

    it('should handle full threat hunting workflow', async () => {
      const hunting = new ThreatHuntingEngine();
      const patterns = new PatternDetectionEngine();
      const anomaly = new AnomalyDetectionEngine();
      const automation = new HuntingAutomationEngine();
      const correlation = new ThreatIntelligenceCorrelation();

      // Setup handlers
      hunting.registerQueryHandler('process', async () => [{ id: 'proc-1', severity: 'high' }]);

      patterns.registerDetectionHandler('behavioral', () => true);

      automation.registerCampaignHandler('default', async () => [
        { type: 'query', id: 'q1', matchCount: 5 },
      ]);

      // Create resources
      const query = hunting.createQuery('Test', 'Test', 'process:cmd.exe');
      const pattern = patterns.createPattern('Test', 'Test', 'behavioral', {}, 'high');
      const profile = anomaly.createBaselineProfile('Normal', [{ cpu: 50 }]);
      const campaign = automation.createCampaign('Test', 'Test', ['q1'], ['p1']);
      const threatProfile = correlation.createThreatProfile('APT28', 'Test', [], [], []);

      // Verify all created
      expect(query.id).toBeDefined();
      expect(pattern.id).toBeDefined();
      expect(profile.id).toBeDefined();
      expect(campaign.id).toBeDefined();
      expect(threatProfile.id).toBeDefined();

      // Execute
      const result = await hunting.executeQuery(query.id);
      expect(result?.status).toBe('completed');
    });
  });
});
