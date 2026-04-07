/**
 * Phase 12 Week 1 - AI/ML Features Integration Tests
 * Comprehensive testing for all AI/ML features
 *
 * تست های ادغام ویژگی های هوش مصنوعی فاز 12 هفته 1
 * تست جامع برای تمام ویژگی های هوش مصنوعی
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AIModelManager } from '../../engine/ai/AIModelManager';
import { PredictiveAnalyticsEngine } from '../../engine/ai/PredictiveAnalyticsEngine';
import { NLPIntegration } from '../../engine/ai/NLPIntegration';
import { ComputerVisionIntegration } from '../../engine/ai/ComputerVisionIntegration';
import { AnomalyDetectionSystem } from '../../engine/ai/AnomalyDetectionSystem';

describe('Phase 12 Week 1 - AI/ML Features', () => {
  describe('AIModelManager', () => {
    let manager: AIModelManager;

    beforeEach(() => {
      manager = new AIModelManager();
    });

    it('should create a new AI model', () => {
      const model = manager.createModel({
        name: 'Test Model',
        type: 'classification',
        metadata: { version: '1.0' },
      });

      expect(model).toBeDefined();
      expect(model.name).toBe('Test Model');
      expect(model.type).toBe('classification');
      expect(model.status).toBe('training');
      expect(model.version).toBe('1.0.0');
    });

    it('should train a model', async () => {
      const model = manager.createModel({
        name: 'Training Model',
        type: 'regression',
      });

      const trainingData = Array.from({ length: 100 }, (_, i) => ({
        x: i,
        y: i * 2 + Math.random() * 10,
      }));

      const trained = await manager.trainModel(model.id, trainingData);

      expect(trained.status).toBe('deployed');
      expect(trained.accuracy).toBeGreaterThan(0.5);
      expect(trained.accuracy).toBeLessThanOrEqual(1);
    });

    it('should deploy a model', () => {
      const model = manager.createModel({
        name: 'Deploy Model',
        type: 'classification',
      });

      const deployed = manager.deployModel(model.id);

      expect(deployed.status).toBe('deployed');
      expect(manager.getDeployedModel()?.id).toBe(model.id);
    });

    it('should setup A/B test', () => {
      const modelA = manager.createModel({
        name: 'Model A',
        type: 'classification',
      });

      const modelB = manager.createModel({
        name: 'Model B',
        type: 'classification',
      });

      manager.setupABTest({
        modelAId: modelA.id,
        modelBId: modelB.id,
        trafficSplit: 50,
        duration: 3600,
        metrics: ['accuracy', 'latency'],
      });

      expect(manager.getAllModels().length).toBe(2);
    });

    it('should get model performance', async () => {
      const model = manager.createModel({
        name: 'Performance Model',
        type: 'regression',
      });

      await manager.trainModel(model.id, [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
      ]);

      const performance = manager.getModelPerformance(model.id);

      expect(performance.modelId).toBe(model.id);
      expect(performance.currentAccuracy).toBeGreaterThan(0);
      expect(performance.status).toBe('deployed');
    });

    it('should archive a model', () => {
      const model = manager.createModel({
        name: 'Archive Model',
        type: 'classification',
      });

      const archived = manager.archiveModel(model.id);

      expect(archived.status).toBe('archived');
    });

    it('should rollback model version', async () => {
      const model = manager.createModel({
        name: 'Rollback Model',
        type: 'regression',
      });

      await manager.trainModel(model.id, [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
      ]);

      const rolled = manager.rollbackModel(model.id, '1.0.0');

      expect(rolled.version).toBe('1.0.0');
    });
  });

  describe('PredictiveAnalyticsEngine', () => {
    let engine: PredictiveAnalyticsEngine;

    beforeEach(() => {
      engine = new PredictiveAnalyticsEngine();
    });

    it('should add time series data', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        value: Math.sin(i) * 10 + 50,
      }));

      engine.addTimeSeriesData('series-1', data);
      expect(engine).toBeDefined();
    });

    it('should forecast time series', () => {
      const data = Array.from({ length: 30 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        value: 50 + Math.sin(i * 0.2) * 10,
      }));

      engine.addTimeSeriesData('series-1', data);
      const forecast = engine.forecastTimeSeries('series-1', 10);

      expect(forecast.length).toBe(10);
      expect(forecast[0].predicted).toBeDefined();
      expect(forecast[0].confidence).toBeGreaterThan(0);
      expect(forecast[0].confidence).toBeLessThanOrEqual(1);
    });

    it('should fit linear regression', () => {
      const data = Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: i * 2 + Math.random() * 5,
      }));

      const model = engine.fitRegression('linear-model', data, 'linear');

      expect(model.type).toBe('linear');
      expect(model.coefficients.length).toBeGreaterThan(0);
      expect(model.rSquared).toBeGreaterThan(0);
    });

    it('should predict with regression model', () => {
      const data = Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: i * 2 + 5,
      }));

      engine.fitRegression('linear-model', data, 'linear');
      const prediction = engine.predictRegression('linear-model', 10);

      expect(prediction).toBeDefined();
      expect(typeof prediction).toBe('number');
    });

    it('should train classifier', () => {
      const trainingData = [
        { features: [1, 2, 3], label: 'A' },
        { features: [1.1, 2.1, 3.1], label: 'A' },
        { features: [5, 6, 7], label: 'B' },
        { features: [5.1, 6.1, 7.1], label: 'B' },
      ];

      engine.trainClassifier('classifier-1', trainingData);
      expect(engine).toBeDefined();
    });

    it('should classify data point', () => {
      const trainingData = [
        { features: [1, 2, 3], label: 'A' },
        { features: [1.1, 2.1, 3.1], label: 'A' },
        { features: [5, 6, 7], label: 'B' },
        { features: [5.1, 6.1, 7.1], label: 'B' },
      ];

      engine.trainClassifier('classifier-1', trainingData);
      const result = engine.classify('classifier-1', [1, 2, 3]);

      expect(result.class).toBeDefined();
      expect(result.probability).toBeGreaterThan(0);
      expect(result.probability).toBeLessThanOrEqual(1);
    });

    it('should create ensemble model', () => {
      const data = Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: i * 2 + 5,
      }));

      engine.fitRegression('model-1', data, 'linear');
      engine.fitRegression('model-2', data, 'polynomial');

      engine.createEnsemble('ensemble-1', {
        models: ['model-1', 'model-2'],
        aggregation: 'average',
      });

      expect(engine).toBeDefined();
    });

    it('should predict with ensemble', () => {
      const data = Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: i * 2 + 5,
      }));

      engine.fitRegression('model-1', data, 'linear');
      engine.fitRegression('model-2', data, 'polynomial');

      engine.createEnsemble('ensemble-1', {
        models: ['model-1', 'model-2'],
        aggregation: 'average',
      });

      const prediction = engine.predictEnsemble('ensemble-1', 10);

      expect(prediction).toBeDefined();
      expect(typeof prediction).toBe('number');
    });

    it('should calculate confidence intervals', () => {
      const data = Array.from({ length: 30 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        value: 50 + Math.random() * 10,
      }));

      engine.addTimeSeriesData('series-1', data);
      const ci = engine.calculateConfidenceInterval('series-1', 0.95);

      expect(ci.mean).toBeDefined();
      expect(ci.lower).toBeLessThan(ci.mean);
      expect(ci.upper).toBeGreaterThan(ci.mean);
    });
  });

  describe('NLPIntegration', () => {
    let nlp: NLPIntegration;

    beforeEach(() => {
      nlp = new NLPIntegration();
    });

    it('should analyze sentiment', () => {
      const result = nlp.analyzeSentiment('This is a great product, I love it!');

      expect(result.sentiment).toBeDefined();
      expect(['positive', 'negative', 'neutral']).toContain(result.sentiment);
      expect(result.score).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should extract entities', () => {
      const text = 'John Smith works at Google in New York on 2024-01-15';
      const entities = nlp.extractEntities(text);

      expect(entities.length).toBeGreaterThan(0);
      expect(entities[0].type).toBeDefined();
      expect(['PERSON', 'LOCATION', 'ORGANIZATION', 'DATE', 'MONEY', 'OTHER']).toContain(
        entities[0].type
      );
    });

    it('should classify text', () => {
      const trainingData = [
        { text: 'This is a sports article about football', category: 'sports' },
        { text: 'Another sports news about basketball', category: 'sports' },
        { text: 'Technology news about AI', category: 'tech' },
        { text: 'New software development tools', category: 'tech' },
      ];

      nlp.trainClassifier('classifier-1', trainingData);
      const result = nlp.classifyText('classifier-1', 'football game news');

      expect(result.category).toBeDefined();
      expect(result.probability).toBeGreaterThan(0);
    });

    it('should extract topics', () => {
      const texts = [
        'Machine learning is a subset of artificial intelligence',
        'Deep learning uses neural networks',
        'AI is transforming technology',
        'Neural networks are powerful',
      ];

      const topics = nlp.extractTopics('model-1', texts, 3);

      expect(topics.length).toBe(3);
      expect(topics[0].keywords.length).toBeGreaterThan(0);
    });

    it('should detect language', () => {
      const result = nlp.detectLanguage('Hello, this is English text');

      expect(result.language).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should tokenize text', () => {
      const tokens = nlp.tokenize('Hello world this is a test');

      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[0]).toBe('hello');
    });

    it('should remove stopwords', () => {
      const tokens = ['the', 'quick', 'brown', 'fox', 'jumps'];
      const filtered = nlp.removeStopwords(tokens, 'en');

      expect(filtered.length).toBeLessThan(tokens.length);
      expect(filtered).toContain('quick');
    });

    it('should calculate text similarity', () => {
      const similarity = nlp.calculateSimilarity('hello world', 'hello there');

      expect(similarity).toBeGreaterThan(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });
  });

  describe('ComputerVisionIntegration', () => {
    let cv: ComputerVisionIntegration;

    beforeEach(() => {
      cv = new ComputerVisionIntegration();
    });

    it('should classify image', () => {
      const imageData = new Uint8Array(1000);
      const result = cv.classifyImage('default-classifier', imageData);

      expect(result.class).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.processingTime).toBeGreaterThanOrEqual(0);
    });

    it('should detect objects', () => {
      const imageData = new Uint8Array(1000);
      const result = cv.detectObjects('default-detector', imageData);

      expect(result.objects).toBeDefined();
      expect(Array.isArray(result.objects)).toBe(true);
      expect(result.processingTime).toBeGreaterThanOrEqual(0);
    });

    it('should recognize faces', () => {
      const imageData = new Uint8Array(1000);
      const result = cv.recognizeFaces('default-recognizer', imageData);

      expect(result.faces).toBeDefined();
      expect(Array.isArray(result.faces)).toBe(true);
      expect(result.processingTime).toBeGreaterThanOrEqual(0);
    });

    it('should understand scene', () => {
      const imageData = new Uint8Array(1000);
      const result = cv.understandScene(imageData);

      expect(result.objects).toBeDefined();
      expect(result.activities).toBeDefined();
      expect(result.setting).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should analyze video', () => {
      const frames = Array.from({ length: 100 }, (_, i) => ({
        timestamp: i * 33,
        frameNumber: i,
        data: new Uint8Array(1000),
      }));

      const result = cv.analyzeVideo('video-1', frames);

      expect(result.frameCount).toBe(100);
      expect(result.scenes).toBeDefined();
      expect(result.objects).toBeDefined();
    });

    it('should extract features', () => {
      const imageData = new Uint8Array(1000);
      const features = cv.extractFeatures(imageData);

      expect(Array.isArray(features)).toBe(true);
      expect(features.length).toBeGreaterThan(0);
    });

    it('should compare images', () => {
      const image1 = new Uint8Array(1000);
      const image2 = new Uint8Array(1000);

      const similarity = cv.compareImages(image1, image2);

      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should detect edges', () => {
      const imageData = new Uint8Array(1000);
      const edges = cv.detectEdges(imageData);

      expect(edges).toBeDefined();
      expect(edges.length).toBe(imageData.length);
    });

    it('should segment image', () => {
      const imageData = new Uint8Array(1000);
      const segments = cv.segmentImage(imageData);

      expect(segments.size).toBeGreaterThan(0);
    });

    it('should enhance image', () => {
      const imageData = new Uint8Array(1000);
      const enhanced = cv.enhanceImage(imageData);

      expect(enhanced).toBeDefined();
      expect(enhanced.length).toBe(imageData.length);
    });
  });

  describe('AnomalyDetectionSystem', () => {
    let ads: AnomalyDetectionSystem;

    beforeEach(() => {
      ads = new AnomalyDetectionSystem();
    });

    it('should add data points', () => {
      ads.addDataPoint('stream-1', 50);
      ads.addDataPoint('stream-1', 51);
      ads.addDataPoint('stream-1', 52);

      expect(ads).toBeDefined();
    });

    it('should detect anomalies using statistical method', () => {
      const data = Array.from({ length: 100 }, (_, i) => 50 + Math.random() * 10);
      data[50] = 200; // Inject anomaly

      for (const value of data) {
        ads.addDataPoint('stream-1', value);
      }

      const anomalies = ads.detectAnomaliesStatistical('stream-1', 3);

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies.some((a) => a.isAnomaly)).toBe(true);
    });

    it('should detect anomalies using Isolation Forest', () => {
      const data = Array.from({ length: 100 }, (_, i) => 50 + Math.random() * 10);
      data[50] = 200; // Inject anomaly

      for (const value of data) {
        ads.addDataPoint('stream-1', value);
      }

      const anomalies = ads.detectAnomaliesIsolationForest('stream-1', 0.1);

      expect(anomalies.length).toBeGreaterThan(0);
    });

    it('should detect anomalies using LSTM method', () => {
      const data = Array.from({ length: 50 }, (_, i) => 50 + Math.sin(i * 0.1) * 10);

      for (const value of data) {
        ads.addDataPoint('stream-1', value);
      }

      const anomalies = ads.detectAnomaliesLSTM('stream-1', 10, 0.7);

      expect(anomalies.length).toBeGreaterThan(0);
    });

    it('should generate alert', () => {
      ads.addDataPoint('stream-1', 50);
      const anomalies = ads.detectAnomaliesStatistical('stream-1', 3);

      if (anomalies.length > 0) {
        const alert = ads.generateAlert('stream-1', anomalies[0]);

        expect(alert.id).toBeDefined();
        expect(['low', 'medium', 'high', 'critical']).toContain(alert.severity);
        expect(alert.message).toBeDefined();
      }
    });

    it('should analyze root cause', () => {
      const data = Array.from({ length: 20 }, (_, i) => 50 + i);

      for (const value of data) {
        ads.addDataPoint('stream-1', value);
      }

      const analysis = ads.analyzeRootCause('anomaly-1', 'stream-1');

      expect(analysis.possibleCauses).toBeDefined();
      expect(analysis.recommendations).toBeDefined();
      expect(analysis.possibleCauses.length).toBeGreaterThan(0);
    });

    it('should detect patterns', () => {
      const data = Array.from({ length: 50 }, (_, i) => 50 + Math.random() * 10);
      data[10] = 200;
      data[11] = 210;
      data[30] = 20;

      for (const value of data) {
        ads.addDataPoint('stream-1', value);
      }

      ads.detectAnomaliesStatistical('stream-1', 2);
      const patterns = ads.detectPatterns('stream-1');

      expect(Array.isArray(patterns)).toBe(true);
    });

    it('should get anomaly statistics', () => {
      const data = Array.from({ length: 50 }, (_, i) => 50 + Math.random() * 10);

      for (const value of data) {
        ads.addDataPoint('stream-1', value);
      }

      ads.detectAnomaliesStatistical('stream-1', 3);
      const stats = ads.getAnomalyStatistics('stream-1');

      expect(stats.totalPoints).toBeGreaterThan(0);
      expect(stats.anomalyRate).toBeGreaterThanOrEqual(0);
      expect(stats.anomalyRate).toBeLessThanOrEqual(1);
    });

    it('should set threshold', () => {
      ads.setThreshold('stream-1', 2.5);
      expect(ads).toBeDefined();
    });

    it('should get alerts', () => {
      const data = Array.from({ length: 100 }, (_, i) => 50 + Math.random() * 10);
      data[50] = 200;

      for (const value of data) {
        ads.addDataPoint('stream-1', value);
      }

      const anomalies = ads.detectAnomaliesStatistical('stream-1', 2);
      if (anomalies.some((a) => a.isAnomaly)) {
        ads.generateAlert('stream-1', anomalies.find((a) => a.isAnomaly)!);
      }

      const alerts = ads.getAlerts('stream-1');

      expect(Array.isArray(alerts)).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should work together: Model -> Predictions -> Anomalies', () => {
      const manager = new AIModelManager();
      const engine = new PredictiveAnalyticsEngine();
      const ads = new AnomalyDetectionSystem();

      // Create and train model
      const model = manager.createModel({
        name: 'Integration Model',
        type: 'regression',
      });

      // Generate predictions
      const data = Array.from({ length: 30 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        value: 50 + Math.sin(i * 0.2) * 10,
      }));

      engine.addTimeSeriesData('series-1', data);
      const forecast = engine.forecastTimeSeries('series-1', 10);

      // Detect anomalies in forecast
      for (const pred of forecast) {
        ads.addDataPoint('stream-1', pred.predicted);
      }

      const anomalies = ads.detectAnomaliesStatistical('stream-1', 2);

      expect(model).toBeDefined();
      expect(forecast.length).toBe(10);
      expect(anomalies.length).toBeGreaterThan(0);
    });

    it('should work together: NLP -> Classification -> Anomaly Detection', () => {
      const nlp = new NLPIntegration();
      const engine = new PredictiveAnalyticsEngine();
      const ads = new AnomalyDetectionSystem();

      // Train classifier
      const trainingData = [
        { text: 'positive feedback', category: 'positive' },
        { text: 'negative feedback', category: 'negative' },
      ];

      nlp.trainClassifier('classifier-1', trainingData);

      // Classify texts and track sentiment scores
      const texts = ['great product', 'terrible service', 'amazing experience'];
      const scores = texts.map((text) => {
        const sentiment = nlp.analyzeSentiment(text);
        return sentiment.score;
      });

      // Detect anomalies in sentiment scores
      for (const score of scores) {
        ads.addDataPoint('sentiment-stream', score);
      }

      const anomalies = ads.detectAnomaliesStatistical('sentiment-stream', 2);

      expect(scores.length).toBe(3);
      expect(anomalies.length).toBeGreaterThan(0);
    });

    it('should work together: Computer Vision -> Anomaly Detection', () => {
      const cv = new ComputerVisionIntegration();
      const ads = new AnomalyDetectionSystem();

      // Analyze multiple images
      const imageConfidences = [];
      for (let i = 0; i < 10; i++) {
        const imageData = new Uint8Array(1000);
        const result = cv.classifyImage('default-classifier', imageData);
        imageConfidences.push(result.confidence);
      }

      // Detect anomalies in confidence scores
      for (const confidence of imageConfidences) {
        ads.addDataPoint('cv-confidence', confidence);
      }

      const anomalies = ads.detectAnomaliesStatistical('cv-confidence', 2);

      expect(imageConfidences.length).toBe(10);
      expect(anomalies.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large datasets efficiently', () => {
      const engine = new PredictiveAnalyticsEngine();
      const startTime = Date.now();

      // Add 1000 data points
      const data = Array.from({ length: 1000 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        value: 50 + Math.random() * 10,
      }));

      engine.addTimeSeriesData('large-series', data);
      const forecast = engine.forecastTimeSeries('large-series', 100);

      const elapsed = Date.now() - startTime;

      expect(forecast.length).toBe(100);
      expect(elapsed).toBeLessThan(500); // Should complete in < 500ms
    });

    it('should handle concurrent anomaly detection', () => {
      const ads = new AnomalyDetectionSystem();
      const startTime = Date.now();

      // Add data to multiple streams
      for (let stream = 0; stream < 10; stream++) {
        for (let i = 0; i < 100; i++) {
          ads.addDataPoint(`stream-${stream}`, 50 + Math.random() * 10);
        }
      }

      // Detect anomalies in all streams
      for (let stream = 0; stream < 10; stream++) {
        ads.detectAnomaliesStatistical(`stream-${stream}`, 3);
      }

      const elapsed = Date.now() - startTime;

      expect(elapsed).toBeLessThan(1000); // Should complete in < 1 second
    });
  });
});
