/**
 * Correlation Analyzer
 * Analyzes correlations between variables
 */

/**
 * Correlation result
 */
export interface CorrelationResult {
  variable1: string;
  variable2: string;
  coefficient: number;
  pValue: number;
  strength: 'very-weak' | 'weak' | 'moderate' | 'strong' | 'very-strong';
  type: 'positive' | 'negative' | 'none';
}

/**
 * Correlation matrix
 */
export interface CorrelationMatrix {
  id: string;
  timestamp: number;
  variables: string[];
  matrix: number[][];
  correlations: CorrelationResult[];
}

/**
 * Covariance result
 */
export interface CovarianceResult {
  variable1: string;
  variable2: string;
  covariance: number;
}

/**
 * Correlation Analyzer
 * Analyzes correlations and relationships between variables
 */
export class CorrelationAnalyzer {
  private correlationMatrices: Map<string, CorrelationMatrix> = new Map();
  private correlations: CorrelationResult[] = [];

  /**
   * Calculate correlation between two variables
   */
  calculateCorrelation(
    data1: number[],
    data2: number[],
    variable1: string,
    variable2: string
  ): CorrelationResult {
    if (data1.length !== data2.length) {
      throw new Error('Data arrays must have the same length');
    }

    // Calculate Pearson correlation coefficient
    const n = data1.length;
    const mean1 = data1.reduce((a, b) => a + b, 0) / n;
    const mean2 = data2.reduce((a, b) => a + b, 0) / n;

    let numerator = 0,
      denominator1 = 0,
      denominator2 = 0;

    for (let i = 0; i < n; i++) {
      const diff1 = data1[i] - mean1;
      const diff2 = data2[i] - mean2;
      numerator += diff1 * diff2;
      denominator1 += diff1 * diff1;
      denominator2 += diff2 * diff2;
    }

    const coefficient = numerator / Math.sqrt(denominator1 * denominator2 || 1);

    // Calculate p-value using t-test
    const tStatistic =
      (coefficient * Math.sqrt(n - 2)) / Math.sqrt(1 - coefficient * coefficient || 0.001);
    const pValue = this.calculatePValue(tStatistic, n - 2);

    // Determine strength
    const absCoeff = Math.abs(coefficient);
    let strength: 'very-weak' | 'weak' | 'moderate' | 'strong' | 'very-strong';
    if (absCoeff < 0.2) strength = 'very-weak';
    else if (absCoeff < 0.4) strength = 'weak';
    else if (absCoeff < 0.6) strength = 'moderate';
    else if (absCoeff < 0.8) strength = 'strong';
    else strength = 'very-strong';

    // Determine type
    const type: 'positive' | 'negative' | 'none' =
      coefficient > 0.2 ? 'positive' : coefficient < -0.2 ? 'negative' : 'none';

    const result: CorrelationResult = {
      variable1,
      variable2,
      coefficient,
      pValue,
      strength,
      type,
    };

    this.correlations.push(result);
    return result;
  }

  /**
   * Calculate correlation matrix for multiple variables
   */
  calculateCorrelationMatrix(data: Record<string, number[]>): CorrelationMatrix {
    const id = `corr-matrix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const variables = Object.keys(data);
    const n = variables.length;
    const matrix: number[][] = Array(n)
      .fill(null)
      .map(() => Array(n).fill(0));
    const correlations: CorrelationResult[] = [];

    // Calculate all pairwise correlations
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          const corr = this.calculateCorrelation(
            data[variables[i]],
            data[variables[j]],
            variables[i],
            variables[j]
          );
          matrix[i][j] = corr.coefficient;
          matrix[j][i] = corr.coefficient;
          correlations.push(corr);
        }
      }
    }

    const result: CorrelationMatrix = {
      id,
      timestamp: Date.now(),
      variables,
      matrix,
      correlations,
    };

    this.correlationMatrices.set(id, result);
    return result;
  }

  /**
   * Calculate covariance between two variables
   */
  calculateCovariance(
    data1: number[],
    data2: number[],
    variable1: string,
    variable2: string
  ): CovarianceResult {
    if (data1.length !== data2.length) {
      throw new Error('Data arrays must have the same length');
    }

    const n = data1.length;
    const mean1 = data1.reduce((a, b) => a + b, 0) / n;
    const mean2 = data2.reduce((a, b) => a + b, 0) / n;

    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += (data1[i] - mean1) * (data2[i] - mean2);
    }

    return {
      variable1,
      variable2,
      covariance: sum / (n - 1),
    };
  }

  /**
   * Calculate Spearman rank correlation
   */
  calculateSpearmanCorrelation(
    data1: number[],
    data2: number[],
    variable1: string,
    variable2: string
  ): CorrelationResult {
    if (data1.length !== data2.length) {
      throw new Error('Data arrays must have the same length');
    }

    // Rank the data
    const ranks1 = this.rankData(data1);
    const ranks2 = this.rankData(data2);

    // Calculate Pearson correlation on ranks
    return this.calculateCorrelation(ranks1, ranks2, variable1, variable2);
  }

  /**
   * Rank data for Spearman correlation
   */
  private rankData(data: number[]): number[] {
    const indexed = data.map((value, index) => ({ value, index }));
    indexed.sort((a, b) => a.value - b.value);

    const ranks = new Array(data.length);
    for (let i = 0; i < indexed.length; i++) {
      ranks[indexed[i].index] = i + 1;
    }

    return ranks;
  }

  /**
   * Find highly correlated variable pairs
   */
  findHighCorrelations(
    data: Record<string, number[]>,
    threshold: number = 0.7
  ): CorrelationResult[] {
    const matrix = this.calculateCorrelationMatrix(data);
    return matrix.correlations.filter(
      (c) => Math.abs(c.coefficient) >= threshold && c.variable1 !== c.variable2
    );
  }

  /**
   * Calculate partial correlation
   */
  calculatePartialCorrelation(
    data1: number[],
    data2: number[],
    control: number[],
    variable1: string,
    variable2: string,
    controlVar: string
  ): CorrelationResult {
    // Residuals after removing control variable effect
    const residuals1 = this.getResiduals(data1, control);
    const residuals2 = this.getResiduals(data2, control);

    return this.calculateCorrelation(residuals1, residuals2, variable1, variable2);
  }

  /**
   * Get residuals after linear regression
   */
  private getResiduals(data: number[], control: number[]): number[] {
    const n = data.length;
    const meanData = data.reduce((a, b) => a + b, 0) / n;
    const meanControl = control.reduce((a, b) => a + b, 0) / n;

    let numerator = 0,
      denominator = 0;
    for (let i = 0; i < n; i++) {
      numerator += (data[i] - meanData) * (control[i] - meanControl);
      denominator += (control[i] - meanControl) ** 2;
    }

    const slope = numerator / denominator;
    const intercept = meanData - slope * meanControl;

    const residuals: number[] = [];
    for (let i = 0; i < n; i++) {
      const predicted = intercept + slope * control[i];
      residuals.push(data[i] - predicted);
    }

    return residuals;
  }

  /**
   * Calculate autocorrelation
   */
  calculateAutocorrelation(data: number[], lag: number): number {
    const n = data.length;
    const mean = data.reduce((a, b) => a + b, 0) / n;

    let numerator = 0,
      denominator = 0;

    for (let i = 0; i < n - lag; i++) {
      numerator += (data[i] - mean) * (data[i + lag] - mean);
    }

    for (let i = 0; i < n; i++) {
      denominator += (data[i] - mean) ** 2;
    }

    return numerator / denominator;
  }

  /**
   * Calculate autocorrelation function
   */
  calculateACF(data: number[], maxLag: number): number[] {
    const acf: number[] = [];
    for (let lag = 0; lag <= maxLag; lag++) {
      acf.push(this.calculateAutocorrelation(data, lag));
    }
    return acf;
  }

  /**
   * Calculate p-value from t-statistic
   */
  private calculatePValue(tStatistic: number, df: number): number {
    // Simplified p-value calculation using normal approximation
    const absT = Math.abs(tStatistic);
    // For large df, use normal distribution
    if (df > 30) {
      return 2 * (1 - this.normalCDF(absT));
    }
    // For small df, use t-distribution approximation
    return 2 * (1 - this.tCDF(absT, df));
  }

  /**
   * Normal cumulative distribution function
   */
  private normalCDF(x: number): number {
    return 0.5 * (1 + Math.tanh(0.7978845608 * (x + 0.044715 * x * x * x)));
  }

  /**
   * T-distribution cumulative distribution function (approximation)
   */
  private tCDF(x: number, df: number): number {
    const absX = Math.abs(x);
    const t = 1 / (1 + absX / Math.sqrt(df));
    const cdf =
      1 -
      0.5 *
        t *
        Math.exp(
          -df * Math.log(t) -
            0.5 * Math.log(df * Math.PI) +
            this.logGamma(df / 2 + 0.5) -
            this.logGamma(df / 2)
        );
    return x < 0 ? 1 - cdf : cdf;
  }

  /**
   * Log gamma function (approximation)
   */
  private logGamma(x: number): number {
    const g = 7;
    const coef = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
      -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
      1.5056327351493116e-7,
    ];

    if (x < 0.5) {
      return Math.log(Math.PI / Math.sin(Math.PI * x)) - this.logGamma(1 - x);
    }

    x -= 1;
    let base = x + g + 0.5;
    let sum = coef[0];
    for (let i = 1; i < coef.length; i++) {
      sum += coef[i] / (x + i);
    }

    return Math.log(Math.sqrt(2 * Math.PI)) + Math.log(sum) - base + Math.log(base) * (x + 0.5);
  }

  /**
   * Get correlation result
   */
  getCorrelationMatrix(matrixId: string): CorrelationMatrix | undefined {
    return this.correlationMatrices.get(matrixId);
  }

  /**
   * Get all correlations
   */
  getAllCorrelations(): CorrelationResult[] {
    return this.correlations;
  }

  /**
   * Get correlations for variable
   */
  getCorrelationsForVariable(variable: string): CorrelationResult[] {
    return this.correlations.filter((c) => c.variable1 === variable || c.variable2 === variable);
  }

  /**
   * Clear correlations
   */
  clearCorrelations(): void {
    this.correlations = [];
    this.correlationMatrices.clear();
  }
}
