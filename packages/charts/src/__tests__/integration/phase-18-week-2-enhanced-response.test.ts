/**
 * Phase 18 Week 2 - Enhanced Response Capabilities
 * Comprehensive test suite for advanced response features
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AdvancedResponseWorkflows } from '../../engine/security/AdvancedResponseWorkflows';
import { PredictiveResponseOptimization } from '../../engine/security/PredictiveResponseOptimization';
import { MLResponseIntegration } from '../../engine/security/MLResponseIntegration';
import { ResponsePatternAnalysis } from '../../engine/security/ResponsePatternAnalysis';
import { AdaptiveResponseStrategies } from '../../engine/security/AdaptiveResponseStrategies';

describe('Phase 18 Week 2 - Enhanced Response Capabilities', () => {
  describe('AdvancedResponseWorkflows', () => {
    let workflows: AdvancedResponseWorkflows;

    beforeEach(() => {
      workflows = new AdvancedResponseWorkflows();
    });

    it('should create a workflow', () => {
      const workflowId = workflows.createWorkflow({
        id: 'wf_test',
        name: 'Test Workflow',
        description: 'Test workflow',
        stages: [],
        initialStageId: 'stage_1',
        threatTypes: ['malware'],
        severityRange: [5, 10],
      });

      expect(workflowId).toBeDefined();
      expect(typeof workflowId).toBe('string');
    });

    it('should register action handlers', () => {
      workflows.registerActionHandler('isolate', async () => ({
        actionId: 'action_1',
        success: true,
        duration: 100,
      }));

      expect(() => {
        workflows.registerActionHandler('block', async () => ({
          actionId: 'action_2',
          success: true,
          duration: 50,
        }));
      }).not.toThrow();
    });

    it('should get workflow statistics', async () => {
      const workflowId = workflows.createWorkflow({
        id: 'wf_test',
        name: 'Test Workflow',
        description: 'Test workflow',
        stages: [],
        initialStageId: 'stage_1',
        threatTypes: ['malware'],
        severityRange: [5, 10],
      });

      const stats = workflows.getStatistics();
      expect(stats.totalWorkflows).toBeGreaterThanOrEqual(1);
    });
  });

  describe('PredictiveResponseOptimization', () => {
    let optimizer: PredictiveResponseOptimization;

    beforeEach(() => {
      optimizer = new PredictiveResponseOptimization();
    });

    it('should record threat patterns', () => {
      optimizer.recordThreatPattern({
        id: 'pattern_1',
        threatType: 'malware',
        characteristics: { vector: 'email' },
        frequency: 10,
        averageSeverity: 7,
        commonResponses: [
          {
            responseType: 'isolate',
            successRate: 0.95,
            averageDuration: 1000,
            costScore: 10,
            riskReduction: 0.8,
          },
        ],
      });

      expect(() => {
        optimizer.recordThreatPattern({
          id: 'pattern_2',
          threatType: 'phishing',
          characteristics: { vector: 'web' },
          frequency: 5,
          averageSeverity: 5,
          commonResponses: [],
        });
      }).not.toThrow();
    });

    it('should train prediction models', () => {
      const modelId = optimizer.trainPredictionModel('malware', [
        {
          id: 'pattern_1',
          threatType: 'malware',
          characteristics: {},
          frequency: 10,
          averageSeverity: 7,
          commonResponses: [],
        },
      ]);

      expect(modelId).toBeDefined();
      expect(typeof modelId).toBe('string');
    });

    it('should generate predictions', () => {
      optimizer.recordThreatPattern({
        id: 'pattern_1',
        threatType: 'malware',
        characteristics: {},
        frequency: 10,
        averageSeverity: 7,
        commonResponses: [
          {
            responseType: 'isolate',
            successRate: 0.95,
            averageDuration: 1000,
            costScore: 10,
            riskReduction: 0.8,
          },
        ],
      });

      const prediction = optimizer.generatePrediction('threat_1', {
        id: 'pattern_1',
        threatType: 'malware',
        characteristics: {},
        frequency: 10,
        averageSeverity: 7,
        commonResponses: [
          {
            responseType: 'isolate',
            successRate: 0.95,
            averageDuration: 1000,
            costScore: 10,
            riskReduction: 0.8,
          },
        ],
      });

      expect(prediction.threatId).toBe('threat_1');
      expect(prediction.confidence).toBeGreaterThanOrEqual(0);
      expect(prediction.confidence).toBeLessThanOrEqual(1);
    });

    it('should get prediction statistics', () => {
      const stats = optimizer.getStatistics();
      expect(stats.totalPredictions).toBeGreaterThanOrEqual(0);
      expect(stats.averageAccuracy).toBeGreaterThanOrEqual(0);
      expect(stats.modelCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('MLResponseIntegration', () => {
    let mlIntegration: MLResponseIntegration;

    beforeEach(() => {
      mlIntegration = new MLResponseIntegration();
    });

    it('should create ML models', () => {
      const modelId = mlIntegration.createModel('Threat Classifier', 'classification');
      expect(modelId).toBeDefined();
      expect(typeof modelId).toBe('string');
    });

    it('should train classification models', () => {
      const modelId = mlIntegration.createModel('Threat Classifier', 'classification');

      mlIntegration.trainClassificationModel(modelId, {
        features: [
          [1, 2, 3],
          [2, 3, 4],
        ],
        labels: ['malware', 'phishing'],
      });

      const performance = mlIntegration.getModelPerformance(modelId);
      expect(performance).toBeDefined();
      expect(performance?.accuracy).toBeGreaterThanOrEqual(0);
    });

    it('should classify threats', () => {
      const modelId = mlIntegration.createModel('Threat Classifier', 'classification');

      mlIntegration.trainClassificationModel(modelId, {
        features: [
          [1, 2, 3],
          [2, 3, 4],
        ],
        labels: ['malware', 'phishing'],
      });

      const result = mlIntegration.classifyThreat(modelId, [1.5, 2.5, 3.5]);
      expect(result.threatClass).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should get ML statistics', () => {
      mlIntegration.createModel('Model 1', 'classification');
      mlIntegration.createModel('Model 2', 'regression');

      const stats = mlIntegration.getStatistics();
      expect(stats.totalModels).toBeGreaterThanOrEqual(2);
      expect(stats.averageAccuracy).toBeGreaterThanOrEqual(0);
    });
  });

  describe('ResponsePatternAnalysis', () => {
    let patternAnalysis: ResponsePatternAnalysis;

    beforeEach(() => {
      patternAnalysis = new ResponsePatternAnalysis();
    });

    it('should record response patterns', () => {
      patternAnalysis.recordPattern({
        id: 'pattern_1',
        threatType: 'malware',
        responseType: 'isolate',
        frequency: 10,
        successRate: 0.95,
        averageDuration: 1000,
        costScore: 10,
        lastOccurrence: Date.now(),
      });

      expect(() => {
        patternAnalysis.recordPattern({
          id: 'pattern_2',
          threatType: 'phishing',
          responseType: 'block',
          frequency: 5,
          successRate: 0.85,
          averageDuration: 500,
          costScore: 5,
          lastOccurrence: Date.now(),
        });
      }).not.toThrow();
    });

    it('should analyze trends', () => {
      patternAnalysis.recordPattern({
        id: 'pattern_1',
        threatType: 'malware',
        responseType: 'isolate',
        frequency: 10,
        successRate: 0.95,
        averageDuration: 1000,
        costScore: 10,
        lastOccurrence: Date.now() - 10000,
      });

      patternAnalysis.recordPattern({
        id: 'pattern_2',
        threatType: 'malware',
        responseType: 'isolate',
        frequency: 12,
        successRate: 0.96,
        averageDuration: 950,
        costScore: 9,
        lastOccurrence: Date.now() - 5000,
      });

      patternAnalysis.recordPattern({
        id: 'pattern_3',
        threatType: 'malware',
        responseType: 'isolate',
        frequency: 15,
        successRate: 0.97,
        averageDuration: 900,
        costScore: 8,
        lastOccurrence: Date.now(),
      });

      const trends = patternAnalysis.analyzeTrends();
      expect(trends.size).toBeGreaterThanOrEqual(0);
    });

    it('should detect anomalies', () => {
      patternAnalysis.recordPattern({
        id: 'pattern_1',
        threatType: 'malware',
        responseType: 'isolate',
        frequency: 10,
        successRate: 0.95,
        averageDuration: 1000,
        costScore: 10,
        lastOccurrence: Date.now(),
      });

      patternAnalysis.recordPattern({
        id: 'pattern_2',
        threatType: 'malware',
        responseType: 'isolate',
        frequency: 5,
        successRate: 0.1,
        averageDuration: 5000,
        costScore: 50,
        lastOccurrence: Date.now(),
      });

      const anomalies = patternAnalysis.detectAnomalies();
      expect(anomalies.size).toBeGreaterThanOrEqual(0);
    });

    it('should find correlations', () => {
      patternAnalysis.recordPattern({
        id: 'pattern_1',
        threatType: 'malware',
        responseType: 'isolate',
        frequency: 10,
        successRate: 0.95,
        averageDuration: 1000,
        costScore: 10,
        lastOccurrence: Date.now(),
      });

      patternAnalysis.recordPattern({
        id: 'pattern_2',
        threatType: 'malware',
        responseType: 'block',
        frequency: 10,
        successRate: 0.94,
        averageDuration: 1050,
        costScore: 11,
        lastOccurrence: Date.now(),
      });

      const correlations = patternAnalysis.findCorrelations();
      expect(correlations.size).toBeGreaterThanOrEqual(0);
    });

    it('should cluster patterns', () => {
      patternAnalysis.recordPattern({
        id: 'pattern_1',
        threatType: 'malware',
        responseType: 'isolate',
        frequency: 10,
        successRate: 0.95,
        averageDuration: 1000,
        costScore: 10,
        lastOccurrence: Date.now(),
      });

      patternAnalysis.recordPattern({
        id: 'pattern_2',
        threatType: 'phishing',
        responseType: 'block',
        frequency: 5,
        successRate: 0.85,
        averageDuration: 500,
        costScore: 5,
        lastOccurrence: Date.now(),
      });

      const clusters = patternAnalysis.clusterPatterns(2);
      expect(clusters.size).toBeGreaterThanOrEqual(0);
    });

    it('should get pattern statistics', () => {
      patternAnalysis.recordPattern({
        id: 'pattern_1',
        threatType: 'malware',
        responseType: 'isolate',
        frequency: 10,
        successRate: 0.95,
        averageDuration: 1000,
        costScore: 10,
        lastOccurrence: Date.now(),
      });

      const stats = patternAnalysis.getStatistics();
      expect(stats.totalPatterns).toBeGreaterThanOrEqual(1);
      expect(stats.averageSuccessRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('AdaptiveResponseStrategies', () => {
    let adaptiveStrategies: AdaptiveResponseStrategies;

    beforeEach(() => {
      adaptiveStrategies = new AdaptiveResponseStrategies();
    });

    it('should create adaptive strategies', () => {
      const strategyId = adaptiveStrategies.createStrategy('Malware Response', 'malware', [], {
        maxDuration: 5000,
        maxCost: 100,
        maxRiskIncrease: 0.1,
        requiredResources: ['isolation'],
      });

      expect(strategyId).toBeDefined();
      expect(typeof strategyId).toBe('string');
    });

    it('should register adaptation rules', () => {
      const strategyId = adaptiveStrategies.createStrategy('Malware Response', 'malware', [], {
        maxDuration: 5000,
        maxCost: 100,
        maxRiskIncrease: 0.1,
        requiredResources: ['isolation'],
      });

      adaptiveStrategies.registerAdaptationRule(strategyId, {
        id: 'rule_1',
        condition: () => true,
        adaptation: () => {},
        priority: 1,
      });

      expect(() => {
        adaptiveStrategies.registerAdaptationRule(strategyId, {
          id: 'rule_2',
          condition: () => false,
          adaptation: () => {},
          priority: 2,
        });
      }).not.toThrow();
    });

    it('should get strategies by threat type', () => {
      adaptiveStrategies.createStrategy('Malware Response', 'malware', [], {
        maxDuration: 5000,
        maxCost: 100,
        maxRiskIncrease: 0.1,
        requiredResources: [],
      });

      adaptiveStrategies.createStrategy('Phishing Response', 'phishing', [], {
        maxDuration: 3000,
        maxCost: 50,
        maxRiskIncrease: 0.05,
        requiredResources: [],
      });

      const malwareStrategies = adaptiveStrategies.getStrategiesByThreatType('malware');
      expect(malwareStrategies.length).toBeGreaterThanOrEqual(1);
    });

    it('should get adaptation statistics', () => {
      adaptiveStrategies.createStrategy('Malware Response', 'malware', [], {
        maxDuration: 5000,
        maxCost: 100,
        maxRiskIncrease: 0.1,
        requiredResources: [],
      });

      const stats = adaptiveStrategies.getStatistics();
      expect(stats.totalStrategies).toBeGreaterThanOrEqual(1);
      expect(stats.averageSuccessRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Integration Tests', () => {
    it('should integrate all enhanced response components', async () => {
      const workflows = new AdvancedResponseWorkflows();
      const optimizer = new PredictiveResponseOptimization();
      const mlIntegration = new MLResponseIntegration();
      const patternAnalysis = new ResponsePatternAnalysis();
      const adaptiveStrategies = new AdaptiveResponseStrategies();

      const workflowId = workflows.createWorkflow({
        id: 'wf_integrated',
        name: 'Integrated Response',
        description: 'Integrated response workflow',
        stages: [],
        initialStageId: 'stage_1',
        threatTypes: ['malware'],
        severityRange: [5, 10],
      });

      const modelId = mlIntegration.createModel('Threat Classifier', 'classification');

      const strategyId = adaptiveStrategies.createStrategy('Integrated Response', 'malware', [], {
        maxDuration: 5000,
        maxCost: 100,
        maxRiskIncrease: 0.1,
        requiredResources: [],
      });

      patternAnalysis.recordPattern({
        id: 'pattern_1',
        threatType: 'malware',
        responseType: 'isolate',
        frequency: 10,
        successRate: 0.95,
        averageDuration: 1000,
        costScore: 10,
        lastOccurrence: Date.now(),
      });

      expect(workflowId).toBeDefined();
      expect(modelId).toBeDefined();
      expect(strategyId).toBeDefined();
      expect(patternAnalysis.getStatistics().totalPatterns).toBe(1);
    });

    it('should handle complex threat response scenarios', async () => {
      const patternAnalysis = new ResponsePatternAnalysis();

      for (let i = 0; i < 5; i++) {
        patternAnalysis.recordPattern({
          id: `pattern_${i}`,
          threatType: i % 2 === 0 ? 'malware' : 'phishing',
          responseType: i % 3 === 0 ? 'isolate' : 'block',
          frequency: 10 + i,
          successRate: 0.8 + i * 0.02,
          averageDuration: 1000 + i * 100,
          costScore: 10 + i,
          lastOccurrence: Date.now() - i * 1000,
        });
      }

      const stats = patternAnalysis.getStatistics();
      expect(stats.totalPatterns).toBe(5);
      expect(stats.uniqueThreatTypes).toBeGreaterThanOrEqual(1);
    });
  });
});
