/**
 * Predictive Analytics Engine
 * Advanced predictive analytics with multiple algorithms
 */

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  confidence?: number;
}

export interface Forecast {
  timestamp: Date;
  predicted: number;
  lower: number;
  upper: number;
  confidence: number;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  predictions: number[];
}

export interface ClassificationResult {
  label: string;
  probability: number;
  confidence: number;
}

export interface EnsembleResult {
  prediction: number;
  confidence: number;
  models: Array<{
    name: string;
    prediction: number;
    weight: number;
  }>;
}

/**
 * PredictiveAnalyticsEngine - Advanced predictive analytics
 */
export class PredictiveAnalyticsEngine {
  /**
   * Time series forecasting using exponential smoothing
   */
  forecastTimeSeries(data: TimeSeriesData[], periods: number, alpha: number = 0.3): Forecast[] {
    if (data.length === 0) return [];

    const values = data.map((d) => d.value);
    const forecasts: Forecast[] = [];

    let level = values[0];
    let trend = values.length > 1 ? values[1] - values[0] : 0;

    for (let i = 0; i < periods; i++) {
      const forecast = level + trend;
      const confidence = 0.95 - (i * 0.05) / periods; // Decreasing confidence

      forecasts.push({
        timestamp: new Date(data[data.length - 1].timestamp.getTime() + (i + 1) * 60 * 60 * 1000),
        predicted: forecast,
        lower: forecast * 0.9,
        upper: forecast * 1.1,
        confidence,
      });

      // Update level and trend for next iteration
      if (i < values.length) {
        const prevLevel = level;
        level = alpha * values[i] + (1 - alpha) * (level + trend);
        trend = 0.1 * (level - prevLevel) + 0.9 * trend;
      }
    }

    return forecasts;
  }

  /**
   * Linear regression analysis
   */
  linearRegression(x: number[], y: number[]): RegressionResult {
    if (x.length !== y.length || x.length === 0) {
      throw new Error('X and Y arrays must have equal non-zero length');
    }

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared
    const yMean = sumY / n;
    const ssTotal = y.reduce((sum, yi) => sum + (yi - yMean) ** 2, 0);
    const ssPredicted = y.reduce((sum, yi, i) => sum + (slope * x[i] + intercept - yi) ** 2, 0);
    const rSquared = 1 - ssPredicted / ssTotal;

    // Generate predictions
    const predictions = x.map((xi) => slope * xi + intercept);

    return {
      slope,
      intercept,
      rSquared,
      predictions,
    };
  }

  /**
   * Logistic regression for classification
   */
  logisticRegression(
    features: number[][],
    labels: number[],
    learningRate: number = 0.01,
    iterations: number = 100
  ): (features: number[]) => ClassificationResult {
    if (features.length !== labels.length) {
      throw new Error('Features and labels must have equal length');
    }

    const n = features.length;
    const m = features[0].length;
    let weights = new Array(m).fill(0);
    let bias = 0;

    // Gradient descent
    for (let iter = 0; iter < iterations; iter++) {
      let dw = new Array(m).fill(0);
      let db = 0;

      for (let i = 0; i < n; i++) {
        const z = features[i].reduce((sum, f, j) => sum + f * weights[j], bias);
        const prediction = 1 / (1 + Math.exp(-z));
        const error = prediction - labels[i];

        for (let j = 0; j < m; j++) {
          dw[j] += (error * features[i][j]) / n;
        }
        db += error / n;
      }

      // Update weights
      for (let j = 0; j < m; j++) {
        weights[j] -= learningRate * dw[j];
      }
      bias -= learningRate * db;
    }

    return (features: number[]): ClassificationResult => {
      const z = features.reduce((sum, f, j) => sum + f * weights[j], bias);
      const probability = 1 / (1 + Math.exp(-z));
      return {
        label: probability > 0.5 ? 'positive' : 'negative',
        probability,
        confidence: Math.abs(probability - 0.5) * 2,
      };
    };
  }

  /**
   * Ensemble prediction combining multiple models
   */
  ensemblePrediction(
    predictions: Array<{ value: number; weight: number; name: string }>
  ): EnsembleResult {
    const totalWeight = predictions.reduce((sum, p) => sum + p.weight, 0);
    const weightedSum = predictions.reduce((sum, p) => sum + p.value * p.weight, 0);
    const prediction = weightedSum / totalWeight;

    // Calculate confidence based on agreement
    const variance = predictions.reduce(
      (sum, p) => sum + p.weight * (p.value - prediction) ** 2,
      0
    );
    const confidence = Math.max(0, 1 - variance / (totalWeight * 100));

    return {
      prediction,
      confidence,
      models: predictions.map((p) => ({
        name: p.name,
        prediction: p.value,
        weight: p.weight / totalWeight,
      })),
    };
  }

  /**
   * Anomaly detection using statistical methods
   */
  detectAnomalies(
    data: number[],
    threshold: number = 2.5
  ): Array<{ index: number; value: number; zscore: number }> {
    if (data.length === 0) return [];

    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / data.length;
    const stdDev = Math.sqrt(variance);

    return data
      .map((value, index) => ({
        index,
        value,
        zscore: (value - mean) / stdDev,
      }))
      .filter((item) => Math.abs(item.zscore) > threshold);
  }

  /**
   * Confidence interval calculation
   */
  confidenceInterval(
    data: number[],
    confidence: number = 0.95
  ): { lower: number; upper: number; mean: number } {
    if (data.length === 0) {
      throw new Error('Data array cannot be empty');
    }

    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / data.length;
    const stdDev = Math.sqrt(variance);

    // Z-score for 95% confidence
    const zScore = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.576 : 1.645;
    const marginOfError = zScore * (stdDev / Math.sqrt(data.length));

    return {
      lower: mean - marginOfError,
      upper: mean + marginOfError,
      mean,
    };
  }

  /**
   * Trend analysis
   */
  analyzeTrend(data: TimeSeriesData[]): {
    trend: 'increasing' | 'decreasing' | 'stable';
    strength: number;
    slope: number;
  } {
    if (data.length < 2) {
      return { trend: 'stable', strength: 0, slope: 0 };
    }

    const x = data.map((_, i) => i);
    const y = data.map((d) => d.value);
    const regression = this.linearRegression(x, y);

    const strength = Math.abs(regression.rSquared);
    const trend =
      regression.slope > 0.01 ? 'increasing' : regression.slope < -0.01 ? 'decreasing' : 'stable';

    return {
      trend,
      strength,
      slope: regression.slope,
    };
  }
}

export default PredictiveAnalyticsEngine;
