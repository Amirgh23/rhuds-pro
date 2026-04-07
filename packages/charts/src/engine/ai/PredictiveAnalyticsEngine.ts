/**
 * Predictive Analytics Engine
 * Advanced predictive analytics with multiple algorithms
 *
 * موتور تجزیه و تحلیل پیش بینی کننده
 * تجزیه و تحلیل پیش بینی کننده پیشرفته با الگوریتم های متعدد
 */

import { EventEmitter } from 'events';

export interface TimeSeriesData {
  timestamp: number;
  value: number;
  metadata?: Record<string, any>;
}

export interface PredictionResult {
  timestamp: number;
  predicted: number;
  confidence: number;
  lower: number;
  upper: number;
  algorithm: string;
}

export interface RegressionModel {
  type: 'linear' | 'polynomial' | 'exponential';
  coefficients: number[];
  intercept: number;
  rSquared: number;
}

export interface ClassificationResult {
  class: string;
  probability: number;
  alternatives: Array<{ class: string; probability: number }>;
}

export interface EnsembleConfig {
  models: string[];
  weights?: number[];
  aggregation: 'average' | 'weighted' | 'voting';
}

export class PredictiveAnalyticsEngine extends EventEmitter {
  private timeSeries: Map<string, TimeSeriesData[]> = new Map();
  private regressionModels: Map<string, RegressionModel> = new Map();
  private classifiers: Map<string, any> = new Map();
  private ensembles: Map<string, EnsembleConfig> = new Map();

  constructor() {
    super();
  }

  /**
   * Add time series data
   */
  addTimeSeriesData(seriesId: string, data: TimeSeriesData[]): void {
    const existing = this.timeSeries.get(seriesId) || [];
    this.timeSeries.set(seriesId, [...existing, ...data]);
    this.emit('timeseries:added', { seriesId, count: data.length });
  }

  /**
   * Forecast time series using exponential smoothing
   */
  forecastTimeSeries(
    seriesId: string,
    periods: number,
    options?: {
      alpha?: number;
      beta?: number;
      gamma?: number;
    }
  ): PredictionResult[] {
    const data = this.timeSeries.get(seriesId);
    if (!data || data.length === 0) {
      throw new Error(`Time series ${seriesId} not found`);
    }

    const alpha = options?.alpha || 0.3;
    const predictions: PredictionResult[] = [];

    // Simple exponential smoothing
    let level = data[0].value;
    let trend = 0;

    for (let i = 1; i < data.length; i++) {
      const prevLevel = level;
      level = alpha * data[i].value + (1 - alpha) * (level + trend);
      trend = (level - prevLevel) * 0.1;
    }

    // Generate forecasts
    const lastTimestamp = data[data.length - 1].timestamp;
    const interval = data.length > 1 ? data[1].timestamp - data[0].timestamp : 1000;

    for (let i = 1; i <= periods; i++) {
      const predicted = level + trend * i;
      const confidence = Math.max(0.5, 1 - i * 0.05);
      const std = Math.sqrt(this.calculateVariance(data.map((d) => d.value)));

      predictions.push({
        timestamp: lastTimestamp + interval * i,
        predicted,
        confidence,
        lower: predicted - 1.96 * std,
        upper: predicted + 1.96 * std,
        algorithm: 'exponential-smoothing',
      });
    }

    this.emit('forecast:completed', { seriesId, periods, predictions });
    return predictions;
  }

  /**
   * Fit regression model
   */
  fitRegression(
    modelId: string,
    data: Array<{ x: number; y: number }>,
    type: 'linear' | 'polynomial' | 'exponential' = 'linear'
  ): RegressionModel {
    if (data.length < 2) {
      throw new Error('Need at least 2 data points for regression');
    }

    let model: RegressionModel;

    if (type === 'linear') {
      model = this.fitLinearRegression(data);
    } else if (type === 'polynomial') {
      model = this.fitPolynomialRegression(data);
    } else {
      model = this.fitExponentialRegression(data);
    }

    this.regressionModels.set(modelId, model);
    this.emit('regression:fitted', { modelId, type, rSquared: model.rSquared });
    return model;
  }

  /**
   * Predict using regression model
   */
  predictRegression(modelId: string, x: number): number {
    const model = this.regressionModels.get(modelId);
    if (!model) throw new Error(`Regression model ${modelId} not found`);

    if (model.type === 'linear') {
      return model.coefficients[0] * x + model.intercept;
    } else if (model.type === 'polynomial') {
      let result = model.intercept;
      for (let i = 0; i < model.coefficients.length; i++) {
        result += model.coefficients[i] * Math.pow(x, i + 1);
      }
      return result;
    } else {
      return model.intercept * Math.exp(model.coefficients[0] * x);
    }
  }

  /**
   * Classify data point
   */
  classify(classifierId: string, features: number[]): ClassificationResult {
    const classifier = this.classifiers.get(classifierId);
    if (!classifier) throw new Error(`Classifier ${classifierId} not found`);

    // Simple Naive Bayes-like classification
    const classes = Object.keys(classifier.priors);
    const scores = classes.map((cls) => ({
      class: cls,
      score: Math.log(classifier.priors[cls]),
    }));

    // Calculate likelihood
    for (let i = 0; i < features.length; i++) {
      for (const item of scores) {
        const likelihood = classifier.likelihoods[item.class]?.[i] || 0.5;
        item.score += Math.log(likelihood);
      }
    }

    // Normalize scores to probabilities
    const maxScore = Math.max(...scores.map((s) => s.score));
    const expScores = scores.map((s) => ({
      ...s,
      exp: Math.exp(s.score - maxScore),
    }));
    const sumExp = expScores.reduce((sum, s) => sum + s.exp, 0);

    const probabilities = expScores.map((s) => ({
      class: s.class,
      probability: s.exp / sumExp,
    }));

    probabilities.sort((a, b) => b.probability - a.probability);

    this.emit('classification:completed', {
      classifierId,
      result: probabilities[0],
    });

    return {
      class: probabilities[0].class,
      probability: probabilities[0].probability,
      alternatives: probabilities.slice(1),
    };
  }

  /**
   * Train classifier
   */
  trainClassifier(
    classifierId: string,
    trainingData: Array<{ features: number[]; label: string }>
  ): void {
    const classes = [...new Set(trainingData.map((d) => d.label))];
    const priors: Record<string, number> = {};
    const likelihoods: Record<string, number[][]> = {};

    // Calculate priors
    for (const cls of classes) {
      const count = trainingData.filter((d) => d.label === cls).length;
      priors[cls] = count / trainingData.length;
      likelihoods[cls] = [];
    }

    // Calculate likelihoods
    const featureCount = trainingData[0]?.features.length || 0;
    for (let f = 0; f < featureCount; f++) {
      for (const cls of classes) {
        const classData = trainingData.filter((d) => d.label === cls);
        const mean = classData.reduce((sum, d) => sum + d.features[f], 0) / classData.length;
        const variance =
          classData.reduce((sum, d) => sum + Math.pow(d.features[f] - mean, 2), 0) /
          classData.length;
        const std = Math.sqrt(variance || 1);

        if (!likelihoods[cls][f]) likelihoods[cls][f] = [];
        likelihoods[cls][f] = [mean, std];
      }
    }

    this.classifiers.set(classifierId, { priors, likelihoods });
    this.emit('classifier:trained', { classifierId, classes: classes.length });
  }

  /**
   * Create ensemble model
   */
  createEnsemble(ensembleId: string, config: EnsembleConfig): void {
    if (config.weights && config.weights.length !== config.models.length) {
      throw new Error('Weights must match number of models');
    }

    const weights = config.weights || config.models.map(() => 1 / config.models.length);
    this.ensembles.set(ensembleId, {
      ...config,
      weights,
    });

    this.emit('ensemble:created', { ensembleId, models: config.models.length });
  }

  /**
   * Predict with ensemble
   */
  predictEnsemble(ensembleId: string, x: number): number {
    const ensemble = this.ensembles.get(ensembleId);
    if (!ensemble) throw new Error(`Ensemble ${ensembleId} not found`);

    const predictions = ensemble.models.map((modelId, idx) => {
      const pred = this.predictRegression(modelId, x);
      return pred * (ensemble.weights?.[idx] || 1 / ensemble.models.length);
    });

    return predictions.reduce((sum, p) => sum + p, 0);
  }

  /**
   * Calculate confidence intervals
   */
  calculateConfidenceInterval(
    seriesId: string,
    confidenceLevel: number = 0.95
  ): { lower: number; upper: number; mean: number } {
    const data = this.timeSeries.get(seriesId);
    if (!data || data.length === 0) {
      throw new Error(`Time series ${seriesId} not found`);
    }

    const values = data.map((d) => d.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = this.calculateVariance(values);
    const std = Math.sqrt(variance);
    const se = std / Math.sqrt(values.length);

    // Z-score for confidence level
    const zScore = confidenceLevel === 0.95 ? 1.96 : confidenceLevel === 0.99 ? 2.576 : 1.645;
    const margin = zScore * se;

    return {
      mean,
      lower: mean - margin,
      upper: mean + margin,
    };
  }

  /**
   * Get model accuracy
   */
  getModelAccuracy(modelId: string): number {
    const model = this.regressionModels.get(modelId);
    return model?.rSquared || 0;
  }

  /**
   * Private helper: Linear regression
   */
  private fitLinearRegression(data: Array<{ x: number; y: number }>): RegressionModel {
    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.x, 0);
    const sumY = data.reduce((sum, d) => sum + d.y, 0);
    const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0);
    const sumX2 = data.reduce((sum, d) => sum + d.x * d.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const yMean = sumY / n;
    const ssTotal = data.reduce((sum, d) => sum + Math.pow(d.y - yMean, 2), 0);
    const ssRes = data.reduce((sum, d) => sum + Math.pow(d.y - (slope * d.x + intercept), 2), 0);
    const rSquared = 1 - ssRes / ssTotal;

    return {
      type: 'linear',
      coefficients: [slope],
      intercept,
      rSquared,
    };
  }

  /**
   * Private helper: Polynomial regression
   */
  private fitPolynomialRegression(data: Array<{ x: number; y: number }>): RegressionModel {
    // Simplified quadratic regression
    const n = data.length;
    const sumX = data.reduce((sum, d) => sum + d.x, 0);
    const sumY = data.reduce((sum, d) => sum + d.y, 0);
    const sumX2 = data.reduce((sum, d) => sum + d.x * d.x, 0);
    const sumX3 = data.reduce((sum, d) => sum + Math.pow(d.x, 3), 0);
    const sumX4 = data.reduce((sum, d) => sum + Math.pow(d.x, 4), 0);
    const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0);
    const sumX2Y = data.reduce((sum, d) => sum + d.x * d.x * d.y, 0);

    const yMean = sumY / n;
    const ssTotal = data.reduce((sum, d) => sum + Math.pow(d.y - yMean, 2), 0);

    // Simplified coefficients
    const a = (sumX2Y - (sumX2 * sumY) / n) / (sumX4 - (sumX2 * sumX2) / n);
    const b = (sumXY - a * sumX2) / sumX;
    const c = (sumY - a * sumX2 - b * sumX) / n;

    const ssRes = data.reduce(
      (sum, d) => sum + Math.pow(d.y - (a * d.x * d.x + b * d.x + c), 2),
      0
    );
    const rSquared = 1 - ssRes / ssTotal;

    return {
      type: 'polynomial',
      coefficients: [a, b],
      intercept: c,
      rSquared,
    };
  }

  /**
   * Private helper: Exponential regression
   */
  private fitExponentialRegression(data: Array<{ x: number; y: number }>): RegressionModel {
    // Transform to linear: ln(y) = ln(a) + bx
    const transformedData = data
      .filter((d) => d.y > 0)
      .map((d) => ({
        x: d.x,
        y: Math.log(d.y),
      }));

    const linear = this.fitLinearRegression(transformedData);
    const a = Math.exp(linear.intercept);
    const b = linear.coefficients[0];

    const yMean = data.reduce((sum, d) => sum + d.y, 0) / data.length;
    const ssTotal = data.reduce((sum, d) => sum + Math.pow(d.y - yMean, 2), 0);
    const ssRes = data.reduce((sum, d) => sum + Math.pow(d.y - a * Math.exp(b * d.x), 2), 0);
    const rSquared = 1 - ssRes / ssTotal;

    return {
      type: 'exponential',
      coefficients: [b],
      intercept: a,
      rSquared,
    };
  }

  /**
   * Private helper: Calculate variance
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  }
}
