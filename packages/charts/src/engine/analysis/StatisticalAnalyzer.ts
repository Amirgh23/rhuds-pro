/**
 * Statistical Analysis System
 * Mean, median, std dev, correlation, regression
 */

export interface CorrelationMatrix {
  variables: string[];
  matrix: number[][];
}

export interface RegressionModel {
  slope: number;
  intercept: number;
  rSquared: number;
  predict: (x: number) => number;
}

export interface DescriptiveStats {
  mean: number;
  median: number;
  mode: number | null;
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
}

/**
 * Statistical Analyzer
 */
export class StatisticalAnalyzer {
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Calculate descriptive statistics
   */
  public calculateDescriptiveStats(data: number[]): DescriptiveStats {
    if (data.length === 0) {
      return {
        mean: 0,
        median: 0,
        mode: null,
        stdDev: 0,
        variance: 0,
        min: 0,
        max: 0,
        range: 0,
        q1: 0,
        q3: 0,
        iqr: 0,
        skewness: 0,
        kurtosis: 0,
      };
    }

    const sorted = [...data].sort((a, b) => a - b);
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const median = this.calculateMedian(sorted);
    const mode = this.calculateMode(data);
    const variance = this.calculateVariance(data, mean);
    const stdDev = Math.sqrt(variance);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;
    const q1 = this.calculatePercentile(sorted, 25);
    const q3 = this.calculatePercentile(sorted, 75);
    const iqr = q3 - q1;
    const skewness = this.calculateSkewness(data, mean, stdDev);
    const kurtosis = this.calculateKurtosis(data, mean, stdDev);

    this.emit('stats:calculated', { count: data.length });

    return {
      mean,
      median,
      mode,
      stdDev,
      variance,
      min,
      max,
      range,
      q1,
      q3,
      iqr,
      skewness,
      kurtosis,
    };
  }

  /**
   * Calculate mean
   */
  public calculateMean(data: number[]): number {
    if (data.length === 0) return 0;
    return data.reduce((a, b) => a + b, 0) / data.length;
  }

  /**
   * Calculate median
   */
  public calculateMedian(data: number[]): number {
    if (data.length === 0) return 0;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /**
   * Calculate mode
   */
  public calculateMode(data: number[]): number | null {
    if (data.length === 0) return null;

    const frequency = new Map<number, number>();
    let maxFreq = 0;
    let mode: number | null = null;

    data.forEach((value) => {
      const count = (frequency.get(value) || 0) + 1;
      frequency.set(value, count);

      if (count > maxFreq) {
        maxFreq = count;
        mode = value;
      }
    });

    return maxFreq > 1 ? mode : null;
  }

  /**
   * Calculate standard deviation
   */
  public calculateStdDev(data: number[]): number {
    return Math.sqrt(this.calculateVariance(data));
  }

  /**
   * Calculate variance
   */
  public calculateVariance(data: number[], mean?: number): number {
    if (data.length === 0) return 0;
    const m = mean !== undefined ? mean : this.calculateMean(data);
    return data.reduce((a, b) => a + Math.pow(b - m, 2), 0) / data.length;
  }

  /**
   * Calculate correlation between two datasets
   */
  public calculateCorrelation(data1: number[], data2: number[]): number {
    if (data1.length !== data2.length || data1.length === 0) {
      return 0;
    }

    const mean1 = this.calculateMean(data1);
    const mean2 = this.calculateMean(data2);
    const stdDev1 = this.calculateStdDev(data1);
    const stdDev2 = this.calculateStdDev(data2);

    if (stdDev1 === 0 || stdDev2 === 0) {
      return 0;
    }

    let covariance = 0;
    for (let i = 0; i < data1.length; i++) {
      covariance += (data1[i] - mean1) * (data2[i] - mean2);
    }
    covariance /= data1.length;

    return covariance / (stdDev1 * stdDev2);
  }

  /**
   * Calculate correlation matrix
   */
  public calculateCorrelationMatrix(datasets: Record<string, number[]>): CorrelationMatrix {
    const variables = Object.keys(datasets);
    const n = variables.length;
    const matrix: number[][] = Array(n)
      .fill(null)
      .map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          matrix[i][j] = this.calculateCorrelation(datasets[variables[i]], datasets[variables[j]]);
        }
      }
    }

    this.emit('correlation:calculated', { variableCount: n });

    return { variables, matrix };
  }

  /**
   * Linear regression
   */
  public linearRegression(xData: number[], yData: number[]): RegressionModel {
    if (xData.length !== yData.length || xData.length < 2) {
      return {
        slope: 0,
        intercept: 0,
        rSquared: 0,
        predict: () => 0,
      };
    }

    const n = xData.length;
    const xMean = this.calculateMean(xData);
    const yMean = this.calculateMean(yData);

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (xData[i] - xMean) * (yData[i] - yMean);
      denominator += (xData[i] - xMean) * (xData[i] - xMean);
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;

    // Calculate R-squared
    const yPredicted = xData.map((x) => slope * x + intercept);
    const ssRes = yData.reduce((a, y, i) => a + Math.pow(y - yPredicted[i], 2), 0);
    const ssTot = yData.reduce((a, y) => a + Math.pow(y - yMean, 2), 0);
    const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

    this.emit('regression:calculated', { slope, intercept, rSquared });

    return {
      slope,
      intercept,
      rSquared,
      predict: (x: number) => slope * x + intercept,
    };
  }

  /**
   * Polynomial regression
   */
  public polynomialRegression(
    xData: number[],
    yData: number[],
    degree: number = 2
  ): RegressionModel {
    if (xData.length !== yData.length || xData.length < degree + 1) {
      return {
        slope: 0,
        intercept: 0,
        rSquared: 0,
        predict: () => 0,
      };
    }

    // Use linear regression as simplified version
    // Full polynomial regression would require matrix operations
    const linear = this.linearRegression(xData, yData);

    return {
      ...linear,
      predict: (x: number) => {
        let result = 0;
        for (let i = 0; i <= degree; i++) {
          result += Math.pow(x, i);
        }
        return result * linear.slope + linear.intercept;
      },
    };
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(sortedData: number[], percentile: number): number {
    if (sortedData.length === 0) return 0;

    const index = (percentile / 100) * (sortedData.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    if (lower === upper) {
      return sortedData[lower];
    }

    return sortedData[lower] * (1 - weight) + sortedData[upper] * weight;
  }

  /**
   * Calculate skewness
   */
  private calculateSkewness(data: number[], mean: number, stdDev: number): number {
    if (data.length < 3 || stdDev === 0) return 0;

    const n = data.length;
    const m3 = data.reduce((a, b) => a + Math.pow(b - mean, 3), 0) / n;

    return m3 / Math.pow(stdDev, 3);
  }

  /**
   * Calculate kurtosis
   */
  private calculateKurtosis(data: number[], mean: number, stdDev: number): number {
    if (data.length < 4 || stdDev === 0) return 0;

    const n = data.length;
    const m4 = data.reduce((a, b) => a + Math.pow(b - mean, 4), 0) / n;

    return m4 / Math.pow(stdDev, 4) - 3;
  }

  /**
   * Perform t-test
   */
  public tTest(data1: number[], data2: number[]): { tStatistic: number; pValue: number } {
    const mean1 = this.calculateMean(data1);
    const mean2 = this.calculateMean(data2);
    const var1 = this.calculateVariance(data1, mean1);
    const var2 = this.calculateVariance(data2, mean2);
    const n1 = data1.length;
    const n2 = data2.length;

    const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    const tStatistic = (mean1 - mean2) / Math.sqrt(pooledVar * (1 / n1 + 1 / n2));

    // Approximate p-value (simplified)
    const pValue = 2 * (1 - this.normalCDF(Math.abs(tStatistic)));

    this.emit('ttest:performed', { tStatistic, pValue });

    return { tStatistic, pValue };
  }

  /**
   * Normal CDF approximation
   */
  private normalCDF(x: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1.0 + sign * y);
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
    this.listeners.clear();
  }
}

export default StatisticalAnalyzer;
