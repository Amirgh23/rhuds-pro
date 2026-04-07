/**
 * Data Normalizer
 * نرمال‌سازی داده‌ها برای استفاده در نمودارها
 */
export class DataNormalizer {
  /**
   * Normalize data to 0-1 range
   * داده‌ها را به بازه 0-1 نرمال می‌کند
   */
  static normalize(data: number[]): number[] {
    if (data.length === 0) return [];

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    return data.map((value) => (value - min) / range);
  }

  /**
   * Normalize to specific range
   * داده‌ها را به بازه مشخص نرمال می‌کند
   */
  static normalizeToRange(data: number[], min: number, max: number): number[] {
    const normalized = this.normalize(data);
    const range = max - min;
    return normalized.map((value) => min + value * range);
  }

  /**
   * Z-score normalization
   * نرمال‌سازی Z-score
   */
  static zScoreNormalize(data: number[]): number[] {
    if (data.length === 0) return [];

    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance) || 1;

    return data.map((value) => (value - mean) / stdDev);
  }

  /**
   * Log normalization
   * نرمال‌سازی لگاریتمی
   */
  static logNormalize(data: number[]): number[] {
    return data.map((value) => Math.log(Math.max(value, 1)));
  }

  /**
   * Percentile normalization
   * نرمال‌سازی درصدی
   */
  static percentileNormalize(data: number[]): number[] {
    const sorted = [...data].sort((a, b) => a - b);
    return data.map((value) => {
      const index = sorted.indexOf(value);
      return (index + 1) / sorted.length;
    });
  }

  /**
   * Handle missing values
   * مقادیر گمشده را مدیریت می‌کند
   */
  static fillMissing(
    data: any[],
    method: 'mean' | 'median' | 'forward' | 'backward' = 'mean'
  ): any[] {
    const result = [...data];
    const numbers = result.filter((v) => typeof v === 'number') as number[];

    if (numbers.length === 0) return result;

    let fillValue: number;
    if (method === 'mean') {
      fillValue = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    } else if (method === 'median') {
      const sorted = [...numbers].sort((a, b) => a - b);
      fillValue = sorted[Math.floor(sorted.length / 2)];
    } else {
      fillValue = numbers[0];
    }

    return result.map((value, index) => {
      if (value === null || value === undefined) {
        if (method === 'forward' && index > 0) {
          return result[index - 1];
        } else if (method === 'backward' && index < result.length - 1) {
          return result[index + 1];
        }
        return fillValue;
      }
      return value;
    });
  }

  /**
   * Remove outliers
   * نقاط پرت را حذف می‌کند
   */
  static removeOutliers(data: number[], threshold: number = 3): number[] {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    return data.filter((value) => Math.abs(value - mean) <= threshold * stdDev);
  }

  /**
   * Smooth data
   * داده‌ها را صاف می‌کند
   */
  static smooth(data: number[], windowSize: number = 3): number[] {
    const result: number[] = [];
    const halfWindow = Math.floor(windowSize / 2);

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - halfWindow);
      const end = Math.min(data.length, i + halfWindow + 1);
      const window = data.slice(start, end);
      const average = window.reduce((a, b) => a + b, 0) / window.length;
      result.push(average);
    }

    return result;
  }
}
