/**
 * Phase 12 Week 1 - AI & Machine Learning Integration Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AIModelManager } from '../../engine/ai/AIModelManager';
import { PredictiveAnalyticsEngine } from '../../engine/ai/PredictiveAnalyticsEngine';
import { NLPIntegration } from '../../engine/ai/NLPIntegration';
import { ComputerVisionIntegration } from '../../engine/ai/ComputerVisionIntegration';
import { AnomalyDetectionSystem } from '../../engine/ai/AnomalyDetectionSystem';

describe('Phase 12 Week 1 - AI & Machine Learning', () => {
  describe('AIModelManager', () => {
    let manager: AIModelManager;

    beforeEach(() => {
      manager = new AIModelManager();
    });

    it('should register and retrieve models', () => {
      const model = {
        id: 'model-1',
        name: 'Test Model',
        version: '1.0.0',
        type: 'classification' as const,
        status: 'draft' as const,
        accuracy: 0.95,
        precision: 0.93,
        recall: 0.92,
        f1Score: 0.925,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      manager.registerModel(model);
      const retrieved = manager.getModel('model-1');

      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Test Model');
    });

    it('should deploy models', () => {
      const model = {
        id: 'model-1',
        name: 'Test Model',
        version: '1.0.0',
        type: 'classification' as const,
        status: 'draft' as const,
        accuracy: 0.95,
        precision: 0.93,
        recall: 0.92,
        f1Score: 0.925,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      manager.registerModel(model);
      manager.deployModel('model-1', '1.0.0');

      const active = manager.getActiveModel();
      expect(active?.status).toBe('deployed');
    });

    it('should setup A/B tests', () => {
      const testId = manager.setupABTest({
        modelA: 'model-a',
        modelB: 'model-b',
        splitRatio: 0.5,
        duration: 3600000,
        metrics: ['accuracy', 'latency'],
      });

      expect(testId).toBeDefined();
      expect(testId).toContain('ab-test');
    });

    it('should track model performance', () => {
      manager.trackPerformance('model-1', 100, 0.95, 50, 2);
      const metrics = manager.getPerformanceMetrics('model-1', 24);

      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0].accuracy).toBe(0.95);
    });

    it('should determine if retraining is needed', () => {
      manager.trackPerformance('model-1', 100, 0.8, 50, 5);
      const shouldRetrain = manager.shouldRetrain('model-1', 0.85);

      expect(shouldRetrain).toBe(true);
    });
  });

  describe('PredictiveAnalyticsEngine', () => {
    let engine: PredictiveAnalyticsEngine;

    beforeEach(() => {
      engine = new PredictiveAnalyticsEngine();
    });

    it('should forecast time series data', () => {
      const data = [
        { timestamp: new Date('2024-01-01'), value: 100 },
        { timestamp: new Date('2024-01-02'), value: 105 },
        { timestamp: new Date('2024-01-03'), value: 110 },
        { timestamp: new Date('2024-01-04'), value: 115 },
        { timestamp: new Date('2024-01-05'), value: 120 },
      ];

      const forecasts = engine.forecastTimeSeries(data, 3);

      expect(forecasts.length).toBe(3);
      expect(forecasts[0].predicted).toBeGreaterThan(0);
      expect(forecasts[0].confidence).toBeGreaterThan(0);
    });

    it('should perform linear regression', () => {
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 6, 8, 10];

      const result = engine.linearRegression(x, y);

      expect(result.slope).toBeCloseTo(2, 1);
      expect(result.rSquared).toBeCloseTo(1, 1);
    });

    it('should detect anomalies', () => {
      const data = [1, 2, 3, 4, 5, 100, 6, 7, 8, 9];
      const anomalies = engine.detectAnomalies(data, 2);

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies[0].value).toBe(100);
    });

    it('should calculate confidence intervals', () => {
      const data = [10, 12, 11, 13, 12, 14, 11, 12];
      const interval = engine.confidenceInterval(data, 0.95);

      expect(interval.lower).toBeLessThan(interval.mean);
      expect(interval.upper).toBeGreaterThan(interval.mean);
    });

    it('should analyze trends', () => {
      const data = [
        { timestamp: new Date('2024-01-01'), value: 100 },
        { timestamp: new Date('2024-01-02'), value: 110 },
        { timestamp: new Date('2024-01-03'), value: 120 },
        { timestamp: new Date('2024-01-04'), value: 130 },
        { timestamp: new Date('2024-01-05'), value: 140 },
      ];

      const trend = engine.analyzeTrend(data);

      expect(trend.trend).toBe('increasing');
      expect(trend.strength).toBeGreaterThan(0);
    });
  });

  describe('NLPIntegration', () => {
    let nlp: NLPIntegration;

    beforeEach(() => {
      nlp = new NLPIntegration();
    });

    it('should classify text', () => {
      const result = nlp.classifyText('This is a great product', [
        'positive',
        'negative',
        'neutral',
      ]);

      expect(result.category).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should analyze sentiment', () => {
      const result = nlp.analyzeSentiment('This is excellent and wonderful');

      expect(result.sentiment).toBe('positive');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should extract entities', () => {
      const result = nlp.extractEntities('John Smith works at Google Inc');

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((e) => e.type === 'PERSON')).toBe(true);
    });

    it('should extract topics', () => {
      const text = 'Machine learning is powerful. Deep learning is a subset of machine learning.';
      const topics = nlp.extractTopics(text, 3);

      expect(topics.length).toBeGreaterThan(0);
      expect(topics[0].weight).toBeGreaterThan(0);
    });

    it('should detect language', () => {
      const result = nlp.detectLanguage('The quick brown fox jumps');

      expect(result.language).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should calculate text similarity', () => {
      const similarity = nlp.calculateSimilarity(
        'The cat sat on the mat',
        'The dog sat on the mat'
      );

      expect(similarity).toBeGreaterThan(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should summarize text', () => {
      const text =
        'This is a long text. It contains multiple sentences. Each sentence has information. The summary should capture the main points.';
      const summary = nlp.summarizeText(text, 2);

      expect(summary).toBeDefined();
      expect(summary.length).toBeGreaterThan(0);
    });

    it('should extract keywords', () => {
      const keywords = nlp.extractKeywords(
        'Machine learning and deep learning are important technologies',
        5
      );

      expect(keywords.length).toBeGreaterThan(0);
      expect(keywords.some((k) => k.includes('learning'))).toBe(true);
    });
  });

  describe('ComputerVisionIntegration', () => {
    let vision: ComputerVisionIntegration;
    let mockImageData: ImageData;

    beforeEach(() => {
      vision = new ComputerVisionIntegration();
      mockImageData = new ImageData(100, 100);
    });

    it('should classify images', () => {
      const result = vision.classifyImage(mockImageData);

      expect(result.label).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.topLabels.length).toBeGreaterThan(0);
    });

    it('should detect objects', () => {
      const objects = vision.detectObjects(mockImageData);

      expect(Array.isArray(objects)).toBe(true);
      if (objects.length > 0) {
        expect(objects[0].label).toBeDefined();
        expect(objects[0].confidence).toBeGreaterThan(0);
      }
    });

    it('should detect faces', () => {
      const result = vision.detectFaces(mockImageData);

      expect(result.faces).toBeDefined();
      expect(Array.isArray(result.faces)).toBe(true);
    });

    it('should analyze scene', () => {
      const analysis = vision.analyzeScene(mockImageData);

      expect(analysis.lighting).toBeDefined();
      expect(analysis.composition).toBeDefined();
      expect(Array.isArray(analysis.colors)).toBe(true);
    });

    it('should extract colors', () => {
      const colors = vision.extractColors(mockImageData, 5);

      expect(Array.isArray(colors)).toBe(true);
      expect(colors.length).toBeGreaterThan(0);
    });

    it('should calculate quality score', () => {
      const score = vision.calculateQualityScore(mockImageData);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  describe('AnomalyDetectionSystem', () => {
    let system: AnomalyDetectionSystem;

    beforeEach(() => {
      system = new AnomalyDetectionSystem();
    });

    it('should detect statistical anomalies', () => {
      const data = [
        { timestamp: new Date(), value: 10 },
        { timestamp: new Date(), value: 11 },
        { timestamp: new Date(), value: 12 },
        { timestamp: new Date(), value: 100 },
        { timestamp: new Date(), value: 11 },
      ];

      const anomalies = system.detectStatisticalAnomalies(data, 2);

      expect(anomalies.length).toBe(5);
      expect(anomalies.some((a) => a.isAnomaly)).toBe(true);
    });

    it('should detect time series anomalies', () => {
      const data = Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() + i * 1000),
        value: i < 15 ? 10 + Math.random() : 50,
      }));

      const anomalies = system.detectTimeSeriesAnomalies(data, 7);

      expect(anomalies.length).toBeGreaterThan(0);
    });

    it('should detect pattern anomalies', () => {
      const data = [
        { timestamp: new Date(), value: 10 },
        { timestamp: new Date(), value: 11 },
        { timestamp: new Date(), value: 50 },
        { timestamp: new Date(), value: 12 },
        { timestamp: new Date(), value: 11 },
      ];

      const patterns = system.detectPatternAnomalies(data);

      expect(Array.isArray(patterns)).toBe(true);
    });

    it('should generate alerts', () => {
      const anomaly = {
        timestamp: new Date(),
        value: 100,
        anomalyScore: 3.5,
        isAnomaly: true,
        severity: 'high' as const,
      };

      const alert = system.generateAlert(anomaly);

      expect(alert.id).toBeDefined();
      expect(alert.severity).toBe('high');
    });

    it('should get recent alerts', () => {
      const anomaly = {
        timestamp: new Date(),
        value: 100,
        anomalyScore: 3.5,
        isAnomaly: true,
        severity: 'high' as const,
      };

      system.generateAlert(anomaly);
      const alerts = system.getRecentAlerts(24);

      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should get anomaly statistics', () => {
      const anomalies = [
        {
          timestamp: new Date(),
          value: 100,
          anomalyScore: 3.5,
          isAnomaly: true,
          severity: 'high' as const,
        },
        {
          timestamp: new Date(),
          value: 50,
          anomalyScore: 2.5,
          isAnomaly: true,
          severity: 'medium' as const,
        },
      ];

      const stats = system.getAnomalyStatistics(anomalies);

      expect(stats.totalAnomalies).toBe(2);
      expect(stats.averageScore).toBeGreaterThan(0);
    });
  });

  describe('Integration Tests', () => {
    it('should integrate all AI modules', () => {
      const modelManager = new AIModelManager();
      const analytics = new PredictiveAnalyticsEngine();
      const nlp = new NLPIntegration();
      const vision = new ComputerVisionIntegration();
      const anomaly = new AnomalyDetectionSystem();

      expect(modelManager).toBeDefined();
      expect(analytics).toBeDefined();
      expect(nlp).toBeDefined();
      expect(vision).toBeDefined();
      expect(anomaly).toBeDefined();
    });

    it('should handle complex AI workflows', () => {
      const modelManager = new AIModelManager();
      const analytics = new PredictiveAnalyticsEngine();

      // Register model
      modelManager.registerModel({
        id: 'model-1',
        name: 'Predictive Model',
        version: '1.0.0',
        type: 'regression',
        status: 'draft',
        accuracy: 0.92,
        precision: 0.9,
        recall: 0.91,
        f1Score: 0.905,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      });

      // Deploy model
      modelManager.deployModel('model-1', '1.0.0');

      // Make predictions
      const data = [
        { timestamp: new Date(), value: 100 },
        { timestamp: new Date(), value: 105 },
        { timestamp: new Date(), value: 110 },
      ];

      const forecasts = analytics.forecastTimeSeries(data, 2);

      expect(modelManager.getActiveModel()).toBeDefined();
      expect(forecasts.length).toBe(2);
    });
  });
});
