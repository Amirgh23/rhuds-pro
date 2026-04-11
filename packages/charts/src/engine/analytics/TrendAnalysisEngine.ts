/**
 * Trend Analysis Engine
 * Analyzes trends and patterns in time series data
 */

/**
 * Trend direction
 */
export type TrendDirection = 'uptrend' | 'downtrend' | 'sideways' | 'volatile';

/**
 * Trend analysis result
 */
export interface TrendAnalysis {
  id: string;
  timestamp: number;
  direction: TrendDirection;
  strength: number;
  slope: number;
  startValue: number;
  endValue: number;
  changePercent: number;
  volatility: number;
  support: number;
  resistance: number;
}

/**
 * Pattern detection result
 */
export interface Pattern {
  id: string;
  name: string;
  type: 'head-shoulders' | 'double-top' | 'double-bottom' | 'triangle' | 'wedge';
  confidence: number;
  startIndex: number;
  endIndex: number;
  breakoutLevel: number;
}

/**
 * Moving average
 */
export interface MovingAverage {
  period: number;
  values: number[];
  type: 'simple' | 'exponential' | 'weighted';
}

/**
 * Trend Analysis Engine
 * Analyzes trends and patterns in data
 */
export class TrendAnalysisEngine {
  private trends: Map<string, TrendAnalysis> = new Map();
  private patterns: Map<string, Pattern[]> = new Map();
  private movingAverages: Map<string, MovingAverage> = new Map();

  /**
   * Analyze trend in time series
   */
  analyzeTrend(data: number[], windowSize: number = 20): TrendAnalysis {
    const id = `trend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const window = data.slice(-windowSize);

    // Calculate trend metrics
    const startValue = window[0];
    const endValue = window[window.length - 1];
    const changePercent = ((endValue - startValue) / startValue) * 100;

    // Linear regression for slope
    const slope = this.calculateSlope(window);

    // Calculate volatility
    const volatility = this.calculateVolatility(window);

    // Determine direction
    let direction: TrendDirection = 'sideways';
    if (volatility > 0.15) {
      direction = 'volatile';
    } else if (slope > 0.1) {
      direction = 'uptrend';
    } else if (slope < -0.1) {
      direction = 'downtrend';
    }

    // Calculate support and resistance
    const support = Math.min(...window);
    const resistance = Math.max(...window);

    // Calculate trend strength (0-1)
    const strength = Math.min(1, Math.abs(slope) * 10);

    const trend: TrendAnalysis = {
      id,
      timestamp: Date.now(),
      direction,
      strength,
      slope,
      startValue,
      endValue,
      changePercent,
      volatility,
      support,
      resistance,
    };

    this.trends.set(id, trend);
    return trend;
  }

  /**
   * Detect patterns in data
   */
  detectPatterns(data: number[], minConfidence: number = 0.7): Pattern[] {
    const patterns: Pattern[] = [];
    const patternId = `patterns-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Head and shoulders pattern
    const headShoulders = this.detectHeadShoulders(data);
    if (headShoulders && headShoulders.confidence >= minConfidence) {
      patterns.push(headShoulders);
    }

    // Double top/bottom patterns
    const doubleTop = this.detectDoubleTop(data);
    if (doubleTop && doubleTop.confidence >= minConfidence) {
      patterns.push(doubleTop);
    }

    const doubleBottom = this.detectDoubleBottom(data);
    if (doubleBottom && doubleBottom.confidence >= minConfidence) {
      patterns.push(doubleBottom);
    }

    // Triangle pattern
    const triangle = this.detectTriangle(data);
    if (triangle && triangle.confidence >= minConfidence) {
      patterns.push(triangle);
    }

    // Wedge pattern
    const wedge = this.detectWedge(data);
    if (wedge && wedge.confidence >= minConfidence) {
      patterns.push(wedge);
    }

    this.patterns.set(patternId, patterns);
    return patterns;
  }

  /**
   * Calculate moving average
   */
  calculateMovingAverage(
    data: number[],
    period: number,
    type: 'simple' | 'exponential' | 'weighted' = 'simple'
  ): MovingAverage {
    const id = `ma-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const values: number[] = [];

    if (type === 'simple') {
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          values.push(0);
        } else {
          const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
          values.push(sum / period);
        }
      }
    } else if (type === 'exponential') {
      const multiplier = 2 / (period + 1);
      let ema = data[0];
      values.push(ema);

      for (let i = 1; i < data.length; i++) {
        ema = data[i] * multiplier + ema * (1 - multiplier);
        values.push(ema);
      }
    } else if (type === 'weighted') {
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          values.push(0);
        } else {
          let sum = 0,
            weight = 0;
          for (let j = 0; j < period; j++) {
            const w = j + 1;
            sum += data[i - period + 1 + j] * w;
            weight += w;
          }
          values.push(sum / weight);
        }
      }
    }

    const ma: MovingAverage = { period, values, type };
    this.movingAverages.set(id, ma);
    return ma;
  }

  /**
   * Detect head and shoulders pattern
   */
  private detectHeadShoulders(data: number[]): Pattern | null {
    if (data.length < 5) return null;

    // Find local peaks
    const peaks: number[] = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
        peaks.push(i);
      }
    }

    if (peaks.length < 3) return null;

    // Check for head and shoulders pattern
    for (let i = 0; i < peaks.length - 2; i++) {
      const leftShoulder = data[peaks[i]];
      const head = data[peaks[i + 1]];
      const rightShoulder = data[peaks[i + 2]];

      if (
        head > leftShoulder &&
        head > rightShoulder &&
        Math.abs(leftShoulder - rightShoulder) < head * 0.1
      ) {
        const confidence = 1 - Math.abs(leftShoulder - rightShoulder) / head;
        return {
          id: `pattern-${Date.now()}`,
          name: 'Head and Shoulders',
          type: 'head-shoulders',
          confidence,
          startIndex: peaks[i],
          endIndex: peaks[i + 2],
          breakoutLevel: Math.min(leftShoulder, rightShoulder),
        };
      }
    }

    return null;
  }

  /**
   * Detect double top pattern
   */
  private detectDoubleTop(data: number[]): Pattern | null {
    if (data.length < 4) return null;

    const peaks: number[] = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
        peaks.push(i);
      }
    }

    if (peaks.length < 2) return null;

    for (let i = 0; i < peaks.length - 1; i++) {
      const peak1 = data[peaks[i]];
      const peak2 = data[peaks[i + 1]];

      if (Math.abs(peak1 - peak2) < Math.max(peak1, peak2) * 0.05) {
        const confidence = 1 - Math.abs(peak1 - peak2) / Math.max(peak1, peak2);
        return {
          id: `pattern-${Date.now()}`,
          name: 'Double Top',
          type: 'double-top',
          confidence,
          startIndex: peaks[i],
          endIndex: peaks[i + 1],
          breakoutLevel: Math.min(peak1, peak2) * 0.95,
        };
      }
    }

    return null;
  }

  /**
   * Detect double bottom pattern
   */
  private detectDoubleBottom(data: number[]): Pattern | null {
    if (data.length < 4) return null;

    const troughs: number[] = [];
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] < data[i - 1] && data[i] < data[i + 1]) {
        troughs.push(i);
      }
    }

    if (troughs.length < 2) return null;

    for (let i = 0; i < troughs.length - 1; i++) {
      const trough1 = data[troughs[i]];
      const trough2 = data[troughs[i + 1]];

      if (Math.abs(trough1 - trough2) < Math.max(trough1, trough2) * 0.05) {
        const confidence = 1 - Math.abs(trough1 - trough2) / Math.max(trough1, trough2);
        return {
          id: `pattern-${Date.now()}`,
          name: 'Double Bottom',
          type: 'double-bottom',
          confidence,
          startIndex: troughs[i],
          endIndex: troughs[i + 1],
          breakoutLevel: Math.max(trough1, trough2) * 1.05,
        };
      }
    }

    return null;
  }

  /**
   * Detect triangle pattern
   */
  private detectTriangle(data: number[]): Pattern | null {
    if (data.length < 6) return null;

    // Find converging highs and lows
    let highSlope = 0,
      lowSlope = 0;
    const window = data.slice(-20);

    const highs = window.filter((_, i) => i % 2 === 0);
    const lows = window.filter((_, i) => i % 2 === 1);

    if (highs.length > 1) {
      highSlope = (highs[highs.length - 1] - highs[0]) / highs.length;
    }
    if (lows.length > 1) {
      lowSlope = (lows[lows.length - 1] - lows[0]) / lows.length;
    }

    // Check if converging
    if (Math.abs(highSlope) < 0.1 && Math.abs(lowSlope) < 0.1) {
      const range = Math.max(...window) - Math.min(...window);
      const confidence = 1 - Math.abs(highSlope + lowSlope) / 0.2;

      return {
        id: `pattern-${Date.now()}`,
        name: 'Triangle',
        type: 'triangle',
        confidence: Math.max(0, Math.min(1, confidence)),
        startIndex: data.length - 20,
        endIndex: data.length - 1,
        breakoutLevel: Math.max(...window),
      };
    }

    return null;
  }

  /**
   * Detect wedge pattern
   */
  private detectWedge(data: number[]): Pattern | null {
    if (data.length < 6) return null;

    const window = data.slice(-20);
    const highs: number[] = [];
    const lows: number[] = [];

    for (let i = 1; i < window.length - 1; i++) {
      if (window[i] > window[i - 1] && window[i] > window[i + 1]) {
        highs.push(window[i]);
      }
      if (window[i] < window[i - 1] && window[i] < window[i + 1]) {
        lows.push(window[i]);
      }
    }

    if (highs.length > 1 && lows.length > 1) {
      const highTrend = highs[highs.length - 1] - highs[0];
      const lowTrend = lows[lows.length - 1] - lows[0];

      // Wedge: one side converging, other diverging
      if ((highTrend > 0 && lowTrend < 0) || (highTrend < 0 && lowTrend > 0)) {
        const confidence = Math.min(
          1,
          Math.abs(highTrend - lowTrend) / Math.max(Math.abs(highTrend), Math.abs(lowTrend))
        );

        return {
          id: `pattern-${Date.now()}`,
          name: 'Wedge',
          type: 'wedge',
          confidence,
          startIndex: data.length - 20,
          endIndex: data.length - 1,
          breakoutLevel: Math.max(...window),
        };
      }
    }

    return null;
  }

  /**
   * Calculate slope using linear regression
   */
  private calculateSlope(data: number[]): number {
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

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  /**
   * Calculate volatility (standard deviation)
   */
  private calculateVolatility(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sum, v) => sum + (v - mean) ** 2, 0) / data.length;
    return Math.sqrt(variance) / mean;
  }

  /**
   * Get trend analysis
   */
  getTrend(trendId: string): TrendAnalysis | undefined {
    return this.trends.get(trendId);
  }

  /**
   * Get all trends
   */
  getAllTrends(): TrendAnalysis[] {
    return Array.from(this.trends.values());
  }

  /**
   * Get patterns
   */
  getPatterns(patternId: string): Pattern[] {
    return this.patterns.get(patternId) || [];
  }

  /**
   * Get moving average
   */
  getMovingAverage(maId: string): MovingAverage | undefined {
    return this.movingAverages.get(maId);
  }
}
