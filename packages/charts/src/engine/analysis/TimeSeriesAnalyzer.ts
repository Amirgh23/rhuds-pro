/**
 * Time Series Analysis System
 * Trend detection, forecasting, and anomaly detection
 */

export interface TimeSeriesPoint {
  timestamp: number | Date;
  value: number;
}

export interface TrendResult {
  direction: 'up' | 'down' | 'stable';
  strength: number; // 0-1
  slope: number;
  startValue: number;
  endValue: number;
}

export interface ForecastResult {
  predictions: TimeSeriesPoint[];
  confidence: number;
  method: string;
}

export interface AnomalyResult {
  index: number;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Time Series Analyzer
 */
export class TimeSeriesAnalyzer {
  private data: TimeSeriesPoint[] = [];
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Set data
   */
  public setData(data: TimeSeriesPoint[]): void {
    this.data = data.sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return aTime - bTime;
    });
    this.emit('data:set', { count: data.length });
  }

  /**
   * Detect trends
   */
  public detectTrends(windowSize: number = 10): TrendResult[] {
    if (this.data.length < windowSize) {
      return [];
    }

    const trends: TrendResult[] = [];

    for (let i = 0; i <= this.data.length - windowSize; i++) {
      const window = this.data.slice(i, i + windowSize);
      const trend = this.calculateTrend(window);
      trends.push(trend);
    }

    this.emit('trends:detected', { count: trends.length });
    return trends;
  }

  /**
   * Calculate trend for a window
   */
  private calculateTrend(window: TimeSeriesPoint[]): TrendResult {
    const values = window.map((p) => p.value);
    const n = values.length;

    // Calculate linear regression
    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (values[i] - yMean);
      denominator += (i - xMean) * (i - xMean);
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const startValue = values[0];
    const endValue = values[n - 1];

    let direction: 'up' | 'down' | 'stable' = 'stable';
    if (slope > 0.01) direction = 'up';
    if (slope < -0.01) direction = 'down';

    const strength = Math.min(1, Math.abs(slope) / (yMean || 1));

    return {
      direction,
      strength,
      slope,
      startValue,
      endValue,
    };
  }

  /**
   * Forecast using simple exponential smoothing
   */
  public forecast(periods: number = 12, alpha: number = 0.3): ForecastResult {
    if (this.data.length === 0) {
      return { predictions: [], confidence: 0, method: 'exponential-smoothing' };
    }

    const values = this.data.map((p) => p.value);
    const predictions: TimeSeriesPoint[] = [];

    // Initialize with first value
    let smoothed = values[0];

    // Apply exponential smoothing
    for (let i = 1; i < values.length; i++) {
      smoothed = alpha * values[i] + (1 - alpha) * smoothed;
    }

    // Generate forecasts
    const lastTimestamp = new Date(this.data[this.data.length - 1].timestamp).getTime();
    const interval = this.estimateInterval();

    for (let i = 1; i <= periods; i++) {
      predictions.push({
        timestamp: new Date(lastTimestamp + interval * i),
        value: smoothed,
      });
    }

    // Calculate confidence based on variance
    const variance = this.calculateVariance(values);
    const confidence = Math.max(0, 1 - variance / (Math.abs(smoothed) || 1));

    this.emit('forecast:generated', { periods, confidence });

    return {
      predictions,
      confidence,
      method: 'exponential-smoothing',
    };
  }

  /**
   * Detect anomalies using statistical methods
   */
  public detectAnomalies(threshold: number = 2): AnomalyResult[] {
    if (this.data.length < 3) {
      return [];
    }

    const values = this.data.map((p) => p.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = this.calculateStdDev(values);

    const anomalies: AnomalyResult[] = [];

    values.forEach((value, index) => {
      const deviation = Math.abs(value - mean);
      const zScore = stdDev === 0 ? 0 : deviation / stdDev;

      if (zScore > threshold) {
        let severity: 'low' | 'medium' | 'high' = 'low';
        if (zScore > 3) severity = 'high';
        else if (zScore > 2) severity = 'medium';

        anomalies.push({
          index,
          value,
          expectedValue: mean,
          deviation,
          severity,
        });
      }
    });

    this.emit('anomalies:detected', { count: anomalies.length });
    return anomalies;
  }

  /**
   * Seasonal decomposition
   */
  public decomposeSeasonality(seasonLength: number = 12): {
    trend: number[];
    seasonal: number[];
    residual: number[];
  } {
    const values = this.data.map((p) => p.value);

    if (values.length < seasonLength * 2) {
      return {
        trend: values,
        seasonal: new Array(values.length).fill(0),
        residual: new Array(values.length).fill(0),
      };
    }

    // Calculate trend using moving average
    const trend = this.calculateMovingAverage(values, seasonLength);

    // Calculate seasonal component
    const seasonal = new Array(values.length).fill(0);
    for (let i = 0; i < values.length; i++) {
      seasonal[i] = values[i] - trend[i];
    }

    // Calculate residual
    const seasonalAvg = this.calculateSeasonalAverage(seasonal, seasonLength);
    const residual = values.map((v, i) => v - trend[i] - seasonalAvg[i % seasonLength]);

    this.emit('seasonality:decomposed', { seasonLength });

    return { trend, seasonal: seasonalAvg, residual };
  }

  /**
   * Calculate moving average
   */
  private calculateMovingAverage(values: number[], windowSize: number): number[] {
    const result: number[] = [];
    const halfWindow = Math.floor(windowSize / 2);

    for (let i = 0; i < values.length; i++) {
      const start = Math.max(0, i - halfWindow);
      const end = Math.min(values.length, i + halfWindow + 1);
      const window = values.slice(start, end);
      result.push(window.reduce((a, b) => a + b, 0) / window.length);
    }

    return result;
  }

  /**
   * Calculate seasonal average
   */
  private calculateSeasonalAverage(values: number[], seasonLength: number): number[] {
    const seasonal = new Array(seasonLength).fill(0);
    const counts = new Array(seasonLength).fill(0);

    for (let i = 0; i < values.length; i++) {
      const seasonIndex = i % seasonLength;
      seasonal[seasonIndex] += values[i];
      counts[seasonIndex]++;
    }

    return seasonal.map((s, i) => (counts[i] > 0 ? s / counts[i] : 0));
  }

  /**
   * Calculate variance
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  }

  /**
   * Calculate standard deviation
   */
  private calculateStdDev(values: number[]): number {
    return Math.sqrt(this.calculateVariance(values));
  }

  /**
   * Estimate interval between data points
   */
  private estimateInterval(): number {
    if (this.data.length < 2) return 86400000; // Default to 1 day

    const times = this.data.map((p) => new Date(p.timestamp).getTime());
    const intervals = [];

    for (let i = 1; i < times.length; i++) {
      intervals.push(times[i] - times[i - 1]);
    }

    return intervals.reduce((a, b) => a + b, 0) / intervals.length;
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    count: number;
    min: number;
    max: number;
    mean: number;
    stdDev: number;
  } {
    const values = this.data.map((p) => p.value);

    if (values.length === 0) {
      return { count: 0, min: 0, max: 0, mean: 0, stdDev: 0 };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = this.calculateStdDev(values);

    return { count: values.length, min, max, mean, stdDev };
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Destroy analyzer
   */
  public destroy(): void {
    this.data = [];
    this.listeners.clear();
  }
}

export default TimeSeriesAnalyzer;
