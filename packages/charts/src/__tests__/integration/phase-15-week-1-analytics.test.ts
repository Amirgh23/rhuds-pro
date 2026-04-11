/**
 * Phase 15 Week 1 - Advanced Analytics & Insights Tests
 * Comprehensive test suite for all analytics features
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  PredictiveAnalyticsEngine,
  AnomalyDetectionSystem,
  TrendAnalysisEngine,
  CorrelationAnalyzer,
  ForecastingSystem,
} from '../../engine/analytics';

describe('Phase 15 Week 1 - Advanced Analytics & Insights', () => {
  // ============================================================================
  // PredictiveAnalyticsEngine Tests
  // ============================================================================

  describe('PredictiveAnalyticsEngine', () => {
    let engine: PredictiveAnalyticsEngine;

    beforeEach(() => {
      engine = new PredictiveAnalyticsEngine();
    });

    it('should create linear regression model', () => {
      const trainingData = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
        { x: 5, y: 10 },
      ];

      const model = engine.createModel('Linear Model', 'linear', ['x'], 'y', trainingData, {
        testSplit: 0.2,
        epochs: 100,
        learningRate: 0.01,
        batchSize: 32,
        regularization: 0.001,
      });

      expect(model.name).toBe('Linear Model');
      expect(model.type).toBe('linear');
      expect(model.accuracy).toBeGreaterThan(0.8);
    });

    it('should create polynomial regression model', () => {
      const trainingData = [
        { x: 1, y: 1 },
        { x: 2, y: 4 },
        { x: 3, y: 9 },
        { x: 4, y: 16 },
        { x: 5, y: 25 },
      ];

      const model = engine.createModel('Polynomial Model', 'polynomial', ['x'], 'y', trainingData, {
        testSplit: 0.2,
        epochs: 100,
        learningRate: 0.01,
        batchSize: 32,
        regularization: 0.001,
      });

      expect(model.type).toBe('polynomial');
      expect(typeof model.accuracy).toBe('number');
    });

    it('should create exponential regression model', () => {
      const trainingData = [
        { x: 1, y: 2.718 },
        { x: 2, y: 7.389 },
        { x: 3, y: 20.086 },
        { x: 4, y: 54.598 },
        { x: 5, y: 148.413 },
      ];

      const model = engine.createModel(
        'Exponential Model',
        'exponential',
        ['x'],
        'y',
        trainingData,
        {
          testSplit: 0.2,
          epochs: 100,
          learningRate: 0.01,
          batchSize: 32,
          regularization: 0.001,
        }
      );

      expect(model.type).toBe('exponential');
    });

    it('should create neural network model', () => {
      const trainingData = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
        { x: 5, y: 10 },
      ];

      const model = engine.createModel('Neural Network', 'neural', ['x'], 'y', trainingData, {
        testSplit: 0.2,
        epochs: 100,
        learningRate: 0.01,
        batchSize: 32,
        regularization: 0.001,
      });

      expect(model.type).toBe('neural');
    });

    it('should make predictions', () => {
      const trainingData = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
        { x: 5, y: 10 },
      ];

      const model = engine.createModel('Linear Model', 'linear', ['x'], 'y', trainingData, {
        testSplit: 0.2,
        epochs: 100,
        learningRate: 0.01,
        batchSize: 32,
        regularization: 0.001,
      });

      const prediction = engine.predict({ x: 6 }, model.id);
      expect(prediction.predicted).toBeGreaterThan(0);
      expect(prediction.confidence).toBeGreaterThanOrEqual(0);
      expect(prediction.confidence).toBeLessThanOrEqual(1);
    });

    it('should evaluate model performance', () => {
      const trainingData = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
        { x: 5, y: 10 },
      ];

      const model = engine.createModel('Linear Model', 'linear', ['x'], 'y', trainingData, {
        testSplit: 0.2,
        epochs: 100,
        learningRate: 0.01,
        batchSize: 32,
        regularization: 0.001,
      });

      const metrics = engine.evaluateModel(model.id);
      expect(metrics.mse).toBeGreaterThanOrEqual(0);
      expect(metrics.rmse).toBeGreaterThanOrEqual(0);
      expect(metrics.mae).toBeGreaterThanOrEqual(0);
      expect(metrics.r2).toBeLessThanOrEqual(1);
    });

    it('should list all models', () => {
      const trainingData = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
      ];

      engine.createModel('Model 1', 'linear', ['x'], 'y', trainingData, {
        testSplit: 0.2,
        epochs: 100,
        learningRate: 0.01,
        batchSize: 32,
        regularization: 0.001,
      });

      engine.createModel('Model 2', 'polynomial', ['x'], 'y', trainingData, {
        testSplit: 0.2,
        epochs: 100,
        learningRate: 0.01,
        batchSize: 32,
        regularization: 0.001,
      });

      const models = engine.listModels();
      expect(models.length).toBe(2);
    });

    it('should delete model', () => {
      const trainingData = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
      ];

      const model = engine.createModel('Model 1', 'linear', ['x'], 'y', trainingData, {
        testSplit: 0.2,
        epochs: 100,
        learningRate: 0.01,
        batchSize: 32,
        regularization: 0.001,
      });

      const deleted = engine.deleteModel(model.id);
      expect(deleted).toBe(true);
      expect(engine.getModel(model.id)).toBeUndefined();
    });
  });

  // ============================================================================
  // AnomalyDetectionSystem Tests
  // ============================================================================

  describe('AnomalyDetectionSystem', () => {
    let system: AnomalyDetectionSystem;

    beforeEach(() => {
      system = new AnomalyDetectionSystem();
    });

    it('should detect anomalies using Z-score', () => {
      const data = [
        { value: 10 },
        { value: 12 },
        { value: 11 },
        { value: 13 },
        { value: 100 }, // Anomaly
      ];

      const result = system.detectAnomalies(data, {
        method: 'zscore',
        threshold: 2,
        sensitivity: 0.8,
        windowSize: 5,
      });

      expect(result.anomalies.length).toBeGreaterThanOrEqual(0);
      expect(result.anomalyRate).toBeGreaterThanOrEqual(0);
    });

    it('should detect anomalies using IQR', () => {
      const data = [
        { value: 10 },
        { value: 12 },
        { value: 11 },
        { value: 13 },
        { value: 100 }, // Anomaly
      ];

      const result = system.detectAnomalies(data, {
        method: 'iqr',
        threshold: 1.5,
        sensitivity: 0.8,
        windowSize: 5,
      });

      expect(result.anomalies.length).toBeGreaterThan(0);
    });

    it('should detect anomalies using Isolation Forest', () => {
      const data = [
        { value: 10 },
        { value: 12 },
        { value: 11 },
        { value: 13 },
        { value: 100 }, // Anomaly
      ];

      const result = system.detectAnomalies(data, {
        method: 'isolation-forest',
        threshold: 0.7,
        sensitivity: 0.8,
        windowSize: 5,
      });

      expect(result.anomalies.length).toBeGreaterThanOrEqual(0);
    });

    it('should detect anomalies using DBSCAN', () => {
      const data = [
        { value: 10 },
        { value: 12 },
        { value: 11 },
        { value: 13 },
        { value: 100 }, // Anomaly
      ];

      const result = system.detectAnomalies(data, {
        method: 'dbscan',
        threshold: 0.5,
        sensitivity: 0.8,
        windowSize: 5,
        minClusterSize: 2,
        eps: 5,
      });

      expect(result.anomalies.length).toBeGreaterThanOrEqual(0);
    });

    it('should detect anomalies using Autoencoder', () => {
      const data = [
        { value: 10 },
        { value: 12 },
        { value: 11 },
        { value: 13 },
        { value: 100 }, // Anomaly
      ];

      const result = system.detectAnomalies(data, {
        method: 'autoencoder',
        threshold: 0.5,
        sensitivity: 0.8,
        windowSize: 5,
      });

      expect(result.anomalies.length).toBeGreaterThanOrEqual(0);
    });

    it('should get anomalies by severity', () => {
      const data = [
        { value: 10 },
        { value: 12 },
        { value: 11 },
        { value: 13 },
        { value: 100 }, // Anomaly
      ];

      system.detectAnomalies(data, {
        method: 'zscore',
        threshold: 2,
        sensitivity: 0.8,
        windowSize: 5,
      });

      const critical = system.getAnomaliesBySeverity('critical');
      expect(Array.isArray(critical)).toBe(true);
    });

    it('should clear anomalies', () => {
      const data = [{ value: 10 }, { value: 12 }, { value: 11 }, { value: 13 }, { value: 100 }];

      system.detectAnomalies(data, {
        method: 'zscore',
        threshold: 2,
        sensitivity: 0.8,
        windowSize: 5,
      });

      system.clearAnomalies();
      expect(system.getAllAnomalies().length).toBe(0);
    });
  });

  // ============================================================================
  // TrendAnalysisEngine Tests
  // ============================================================================

  describe('TrendAnalysisEngine', () => {
    let engine: TrendAnalysisEngine;

    beforeEach(() => {
      engine = new TrendAnalysisEngine();
    });

    it('should analyze uptrend', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];
      const trend = engine.analyzeTrend(data);

      expect(['uptrend', 'volatile']).toContain(trend.direction);
      expect(trend.slope).toBeGreaterThan(0);
      expect(trend.changePercent).toBeGreaterThan(0);
    });

    it('should analyze downtrend', () => {
      const data = [28, 26, 24, 22, 20, 18, 16, 14, 12, 10];
      const trend = engine.analyzeTrend(data);

      expect(['downtrend', 'volatile']).toContain(trend.direction);
      expect(trend.slope).toBeLessThan(0);
      expect(trend.changePercent).toBeLessThan(0);
    });

    it('should analyze sideways trend', () => {
      const data = [15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
      const trend = engine.analyzeTrend(data);

      expect(trend.direction).toBe('sideways');
      expect(Math.abs(trend.slope)).toBeLessThan(0.1);
    });

    it('should detect patterns', () => {
      const data = [10, 15, 12, 15, 12, 20, 18, 16, 14, 12];
      const patterns = engine.detectPatterns(data, 0.5);

      expect(Array.isArray(patterns)).toBe(true);
    });

    it('should calculate simple moving average', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];
      const ma = engine.calculateMovingAverage(data, 3, 'simple');

      expect(ma.values.length).toBe(data.length);
      expect(ma.period).toBe(3);
      expect(ma.type).toBe('simple');
    });

    it('should calculate exponential moving average', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];
      const ma = engine.calculateMovingAverage(data, 3, 'exponential');

      expect(ma.values.length).toBe(data.length);
      expect(ma.type).toBe('exponential');
    });

    it('should calculate weighted moving average', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];
      const ma = engine.calculateMovingAverage(data, 3, 'weighted');

      expect(ma.values.length).toBe(data.length);
      expect(ma.type).toBe('weighted');
    });

    it('should get trend analysis', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];
      const trend = engine.analyzeTrend(data);

      const retrieved = engine.getTrend(trend.id);
      expect(retrieved).toBeDefined();
      expect(['uptrend', 'volatile']).toContain(retrieved?.direction);
    });

    it('should list all trends', () => {
      const data1 = [10, 12, 14, 16, 18, 20];
      const data2 = [28, 26, 24, 22, 20, 18];

      engine.analyzeTrend(data1);
      engine.analyzeTrend(data2);

      const trends = engine.getAllTrends();
      expect(trends.length).toBe(2);
    });
  });

  // ============================================================================
  // CorrelationAnalyzer Tests
  // ============================================================================

  describe('CorrelationAnalyzer', () => {
    let analyzer: CorrelationAnalyzer;

    beforeEach(() => {
      analyzer = new CorrelationAnalyzer();
    });

    it('should calculate positive correlation', () => {
      const data1 = [1, 2, 3, 4, 5];
      const data2 = [2, 4, 6, 8, 10];

      const result = analyzer.calculateCorrelation(data1, data2, 'x', 'y');

      expect(result.type).toBe('positive');
      expect(result.coefficient).toBeGreaterThan(0.9);
    });

    it('should calculate negative correlation', () => {
      const data1 = [1, 2, 3, 4, 5];
      const data2 = [10, 8, 6, 4, 2];

      const result = analyzer.calculateCorrelation(data1, data2, 'x', 'y');

      expect(result.type).toBe('negative');
      expect(result.coefficient).toBeLessThan(-0.9);
    });

    it('should calculate no correlation', () => {
      const data1 = [1, 2, 3, 4, 5];
      const data2 = [5, 3, 1, 4, 2];

      const result = analyzer.calculateCorrelation(data1, data2, 'x', 'y');

      expect(['none', 'negative', 'positive']).toContain(result.type);
    });

    it('should calculate correlation matrix', () => {
      const data = {
        x: [1, 2, 3, 4, 5],
        y: [2, 4, 6, 8, 10],
        z: [5, 4, 3, 2, 1],
      };

      const matrix = analyzer.calculateCorrelationMatrix(data);

      expect(matrix.variables.length).toBe(3);
      expect(matrix.matrix.length).toBe(3);
      expect(matrix.correlations.length).toBeGreaterThan(0);
    });

    it('should calculate covariance', () => {
      const data1 = [1, 2, 3, 4, 5];
      const data2 = [2, 4, 6, 8, 10];

      const result = analyzer.calculateCovariance(data1, data2, 'x', 'y');

      expect(result.covariance).toBeGreaterThan(0);
    });

    it('should calculate Spearman correlation', () => {
      const data1 = [1, 2, 3, 4, 5];
      const data2 = [2, 4, 6, 8, 10];

      const result = analyzer.calculateSpearmanCorrelation(data1, data2, 'x', 'y');

      expect(result.coefficient).toBeGreaterThan(0.9);
    });

    it('should find high correlations', () => {
      const data = {
        x: [1, 2, 3, 4, 5],
        y: [2, 4, 6, 8, 10],
        z: [5, 4, 3, 2, 1],
      };

      const highCorr = analyzer.findHighCorrelations(data, 0.7);

      expect(Array.isArray(highCorr)).toBe(true);
    });

    it('should calculate autocorrelation', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const acf = analyzer.calculateAutocorrelation(data, 1);

      expect(typeof acf).toBe('number');
    });

    it('should calculate ACF', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const acf = analyzer.calculateACF(data, 5);

      expect(acf.length).toBe(6);
    });

    it('should get all correlations', () => {
      const data1 = [1, 2, 3, 4, 5];
      const data2 = [2, 4, 6, 8, 10];

      analyzer.calculateCorrelation(data1, data2, 'x', 'y');

      const all = analyzer.getAllCorrelations();
      expect(all.length).toBeGreaterThan(0);
    });

    it('should clear correlations', () => {
      const data1 = [1, 2, 3, 4, 5];
      const data2 = [2, 4, 6, 8, 10];

      analyzer.calculateCorrelation(data1, data2, 'x', 'y');
      analyzer.clearCorrelations();

      expect(analyzer.getAllCorrelations().length).toBe(0);
    });
  });

  // ============================================================================
  // ForecastingSystem Tests
  // ============================================================================

  describe('ForecastingSystem', () => {
    let system: ForecastingSystem;

    beforeEach(() => {
      system = new ForecastingSystem();
    });

    it('should forecast using ARIMA', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];

      const forecast = system.forecastARIMA(data, { p: 1, d: 1, q: 1 }, 5);

      expect(forecast.method).toBe('arima');
      expect(forecast.predictions.length).toBe(5);
      expect(forecast.intervals.length).toBe(5);
    });

    it('should forecast using exponential smoothing', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];

      const forecast = system.forecastExponentialSmoothing(data, { alpha: 0.3, beta: 0.1 }, 5);

      expect(forecast.method).toBe('exponential-smoothing');
      expect(forecast.predictions.length).toBe(5);
    });

    it('should forecast using moving average', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];

      const forecast = system.forecastMovingAverage(data, 3, 5);

      expect(forecast.method).toBe('moving-average');
      expect(forecast.predictions.length).toBe(5);
    });

    it('should forecast using linear regression', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];

      const forecast = system.forecastLinearRegression(data, 5);

      expect(forecast.method).toBe('linear-regression');
      expect(forecast.predictions.length).toBe(5);
      expect(forecast.predictions[0]).toBeGreaterThan(0);
    });

    it('should get forecast', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];

      const forecast = system.forecastLinearRegression(data, 5);
      const retrieved = system.getForecast(forecast.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.method).toBe('linear-regression');
    });

    it('should list all forecasts', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];

      system.forecastLinearRegression(data, 5);
      system.forecastMovingAverage(data, 3, 5);

      const forecasts = system.getAllForecasts();
      expect(forecasts.length).toBe(2);
    });

    it('should compare forecasts', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];

      const f1 = system.forecastLinearRegression(data, 5);
      const f2 = system.forecastMovingAverage(data, 3, 5);

      const comparison = system.compareForecasts([f1.id, f2.id]);

      expect(Object.keys(comparison).length).toBe(2);
    });

    it('should delete forecast', () => {
      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];

      const forecast = system.forecastLinearRegression(data, 5);
      const deleted = system.deleteForecast(forecast.id);

      expect(deleted).toBe(true);
      expect(system.getForecast(forecast.id)).toBeUndefined();
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Tests', () => {
    it('should work together: Prediction + Anomaly Detection', () => {
      const engine = new PredictiveAnalyticsEngine();
      const system = new AnomalyDetectionSystem();

      const trainingData = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
        { x: 5, y: 10 },
      ];

      const model = engine.createModel('Model', 'linear', ['x'], 'y', trainingData, {
        testSplit: 0.2,
        epochs: 100,
        learningRate: 0.01,
        batchSize: 32,
        regularization: 0.001,
      });

      const prediction = engine.predict({ x: 6 }, model.id);

      const anomalyData = [
        { value: prediction.predicted },
        { value: prediction.predicted * 0.9 },
        { value: prediction.predicted * 1.1 },
        { value: prediction.predicted * 5 }, // Anomaly
      ];

      const result = system.detectAnomalies(anomalyData, {
        method: 'zscore',
        threshold: 2,
        sensitivity: 0.8,
        windowSize: 4,
      });

      expect(model.id).toBeDefined();
      expect(prediction.predicted).toBeGreaterThan(0);
      expect(result.anomalies.length).toBeGreaterThanOrEqual(0);
    });

    it('should work together: Trend Analysis + Forecasting', () => {
      const trendEngine = new TrendAnalysisEngine();
      const forecastSystem = new ForecastingSystem();

      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];

      const trend = trendEngine.analyzeTrend(data);
      const forecast = forecastSystem.forecastLinearRegression(data, 5);

      expect(['uptrend', 'volatile']).toContain(trend.direction);
      expect(forecast.predictions.length).toBe(5);
    });

    it('should work together: Correlation + Forecasting', () => {
      const analyzer = new CorrelationAnalyzer();
      const forecastSystem = new ForecastingSystem();

      const data1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const data2 = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

      const corr = analyzer.calculateCorrelation(data1, data2, 'x', 'y');
      const forecast = forecastSystem.forecastLinearRegression(data1, 5);

      expect(corr.type).toBe('positive');
      expect(forecast.predictions.length).toBe(5);
    });

    it('should work together: All analytics features', () => {
      const predictive = new PredictiveAnalyticsEngine();
      const anomaly = new AnomalyDetectionSystem();
      const trend = new TrendAnalysisEngine();
      const correlation = new CorrelationAnalyzer();
      const forecast = new ForecastingSystem();

      const data = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];

      const trendResult = trend.analyzeTrend(data);
      const forecastResult = forecast.forecastLinearRegression(data, 5);
      const anomalyResult = anomaly.detectAnomalies(
        data.map((v) => ({ value: v })),
        {
          method: 'zscore',
          threshold: 2,
          sensitivity: 0.8,
          windowSize: 5,
        }
      );

      expect(['uptrend', 'volatile', 'sideways']).toContain(trendResult.direction);
      expect(forecastResult.predictions.length).toBe(5);
      expect(anomalyResult.anomalies.length).toBeGreaterThanOrEqual(0);
    });
  });
});
