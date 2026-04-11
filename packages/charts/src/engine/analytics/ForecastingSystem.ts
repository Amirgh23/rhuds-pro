/**
 * Forecasting System
 * Generates forecasts for time series data
 */

/**
 * Forecast result
 */
export interface Forecast {
  id: string;
  timestamp: number;
  method: 'arima' | 'exponential-smoothing' | 'moving-average' | 'linear-regression';
  periods: number;
  predictions: number[];
  confidence: number;
  intervals: { lower: number; upper: number }[];
  accuracy: number;
}

/**
 * ARIMA parameters
 */
export interface ARIMAParams {
  p: number; // AR order
  d: number; // Differencing order
  q: number; // MA order
}

/**
 * Exponential smoothing parameters
 */
export interface ExponentialSmoothingParams {
  alpha: number; // Level smoothing
  beta?: number; // Trend smoothing
  gamma?: number; // Seasonal smoothing
  seasonal?: number; // Seasonal period
}

/**
 * Forecasting System
 * Generates forecasts using multiple methods
 */
export class ForecastingSystem {
  private forecasts: Map<string, Forecast> = new Map();

  /**
   * Forecast using ARIMA
   */
  forecastARIMA(data: number[], params: ARIMAParams, periods: number): Forecast {
    const id = `forecast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Difference the data
    let differenced = data;
    for (let d = 0; d < params.d; d++) {
      differenced = this.differenceData(differenced);
    }

    // Fit AR and MA components
    const arCoefficients = this.fitAR(differenced, params.p);
    const maCoefficients = this.fitMA(differenced, params.q);

    // Generate predictions
    const predictions: number[] = [];
    let currentData = [...differenced];

    for (let i = 0; i < periods; i++) {
      let prediction = 0;

      // AR component
      for (let j = 0; j < Math.min(params.p, currentData.length); j++) {
        prediction += arCoefficients[j] * currentData[currentData.length - 1 - j];
      }

      // MA component (simplified)
      for (let j = 0; j < Math.min(params.q, currentData.length); j++) {
        prediction += maCoefficients[j] * (currentData[currentData.length - 1 - j] - prediction);
      }

      predictions.push(prediction);
      currentData.push(prediction);
    }

    // Reverse differencing
    let forecast = predictions;
    for (let d = 0; d < params.d; d++) {
      forecast = this.undifferenceData(forecast, data);
    }

    // Calculate confidence intervals
    const intervals = forecast.map((pred) => ({
      lower: pred * 0.95,
      upper: pred * 1.05,
    }));

    // Calculate accuracy on training data
    const accuracy = this.calculateForecastAccuracy(data, forecast);

    const result: Forecast = {
      id,
      timestamp: Date.now(),
      method: 'arima',
      periods,
      predictions: forecast,
      confidence: 0.95,
      intervals,
      accuracy,
    };

    this.forecasts.set(id, result);
    return result;
  }

  /**
   * Forecast using exponential smoothing
   */
  forecastExponentialSmoothing(
    data: number[],
    params: ExponentialSmoothingParams,
    periods: number
  ): Forecast {
    const id = `forecast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Initialize level and trend
    let level = data[0];
    let trend = (data[1] - data[0]) / 1;
    const predictions: number[] = [];

    // Apply exponential smoothing
    for (let i = 1; i < data.length; i++) {
      const prevLevel = level;
      level = params.alpha * data[i] + (1 - params.alpha) * (level + trend);
      trend = (params.beta || 0.1) * (level - prevLevel) + (1 - (params.beta || 0.1)) * trend;
    }

    // Generate forecasts
    for (let i = 0; i < periods; i++) {
      predictions.push(level + (i + 1) * trend);
    }

    // Calculate confidence intervals
    const intervals = predictions.map((pred) => ({
      lower: pred * 0.9,
      upper: pred * 1.1,
    }));

    // Calculate accuracy
    const accuracy = this.calculateForecastAccuracy(data, predictions);

    const result: Forecast = {
      id,
      timestamp: Date.now(),
      method: 'exponential-smoothing',
      periods,
      predictions,
      confidence: 0.9,
      intervals,
      accuracy,
    };

    this.forecasts.set(id, result);
    return result;
  }

  /**
   * Forecast using moving average
   */
  forecastMovingAverage(data: number[], windowSize: number, periods: number): Forecast {
    const id = `forecast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Calculate moving average
    const ma = this.calculateMovingAverage(data, windowSize);
    const lastMA = ma[ma.length - 1];

    // Generate forecasts (constant MA)
    const predictions = Array(periods).fill(lastMA);

    // Calculate confidence intervals
    const stdDev = this.calculateStandardDeviation(data);
    const intervals = predictions.map((pred) => ({
      lower: pred - 1.96 * stdDev,
      upper: pred + 1.96 * stdDev,
    }));

    // Calculate accuracy
    const accuracy = this.calculateForecastAccuracy(data, predictions);

    const result: Forecast = {
      id,
      timestamp: Date.now(),
      method: 'moving-average',
      periods,
      predictions,
      confidence: 0.95,
      intervals,
      accuracy,
    };

    this.forecasts.set(id, result);
    return result;
  }

  /**
   * Forecast using linear regression
   */
  forecastLinearRegression(data: number[], periods: number): Forecast {
    const id = `forecast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Fit linear regression
    const n = data.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += data[i];
      sumXY += i * data[i];
      sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate predictions
    const predictions: number[] = [];
    for (let i = 0; i < periods; i++) {
      predictions.push(intercept + slope * (n + i));
    }

    // Calculate residuals and confidence intervals
    let residualSum = 0;
    for (let i = 0; i < n; i++) {
      const predicted = intercept + slope * i;
      residualSum += (data[i] - predicted) ** 2;
    }
    const stdError = Math.sqrt(residualSum / (n - 2));

    const intervals = predictions.map((pred) => ({
      lower: pred - 1.96 * stdError,
      upper: pred + 1.96 * stdError,
    }));

    // Calculate accuracy
    const accuracy = this.calculateForecastAccuracy(data, predictions);

    const result: Forecast = {
      id,
      timestamp: Date.now(),
      method: 'linear-regression',
      periods,
      predictions,
      confidence: 0.95,
      intervals,
      accuracy,
    };

    this.forecasts.set(id, result);
    return result;
  }

  /**
   * Fit AR model
   */
  private fitAR(data: number[], order: number): number[] {
    const coefficients: number[] = [];
    const mean = data.reduce((a, b) => a + b, 0) / data.length;

    for (let i = 0; i < order; i++) {
      let numerator = 0,
        denominator = 0;
      for (let j = i + 1; j < data.length; j++) {
        numerator += (data[j] - mean) * (data[j - i - 1] - mean);
        denominator += (data[j] - mean) ** 2;
      }
      coefficients.push(numerator / (denominator || 1));
    }

    return coefficients;
  }

  /**
   * Fit MA model
   */
  private fitMA(data: number[], order: number): number[] {
    const coefficients: number[] = [];
    for (let i = 0; i < order; i++) {
      coefficients.push(0.1 * (i + 1));
    }
    return coefficients;
  }

  /**
   * Difference data
   */
  private differenceData(data: number[]): number[] {
    const differenced: number[] = [];
    for (let i = 1; i < data.length; i++) {
      differenced.push(data[i] - data[i - 1]);
    }
    return differenced;
  }

  /**
   * Undifference data
   */
  private undifferenceData(differenced: number[], original: number[]): number[] {
    const undifferenced: number[] = [original[original.length - 1]];
    for (let i = 0; i < differenced.length; i++) {
      undifferenced.push(undifferenced[i] + differenced[i]);
    }
    return undifferenced.slice(1);
  }

  /**
   * Calculate moving average
   */
  private calculateMovingAverage(data: number[], windowSize: number): number[] {
    const ma: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < windowSize - 1) {
        ma.push(0);
      } else {
        const sum = data.slice(i - windowSize + 1, i + 1).reduce((a, b) => a + b, 0);
        ma.push(sum / windowSize);
      }
    }
    return ma;
  }

  /**
   * Calculate standard deviation
   */
  private calculateStandardDeviation(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sum, v) => sum + (v - mean) ** 2, 0) / data.length;
    return Math.sqrt(variance);
  }

  /**
   * Calculate forecast accuracy
   */
  private calculateForecastAccuracy(actual: number[], predicted: number[]): number {
    const minLen = Math.min(actual.length, predicted.length);
    let mape = 0;

    for (let i = 0; i < minLen; i++) {
      const error = Math.abs((actual[i] - predicted[i]) / (actual[i] || 1));
      mape += error;
    }

    mape /= minLen;
    return Math.max(0, 1 - mape);
  }

  /**
   * Get forecast
   */
  getForecast(forecastId: string): Forecast | undefined {
    return this.forecasts.get(forecastId);
  }

  /**
   * Get all forecasts
   */
  getAllForecasts(): Forecast[] {
    return Array.from(this.forecasts.values());
  }

  /**
   * Compare forecasts
   */
  compareForecasts(forecastIds: string[]): Record<string, Forecast | undefined> {
    const comparison: Record<string, Forecast | undefined> = {};
    for (const id of forecastIds) {
      comparison[id] = this.forecasts.get(id);
    }
    return comparison;
  }

  /**
   * Delete forecast
   */
  deleteForecast(forecastId: string): boolean {
    return this.forecasts.delete(forecastId);
  }
}
