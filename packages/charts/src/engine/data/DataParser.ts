/**
 * Data Parser System
 * Handles parsing of various data formats and normalization
 */

import type { ChartDataset, ChartData } from '../types/index';

/**
 * Parsed data point in standardized format
 */
export interface ParsedDataPoint {
  x: number | null;
  y: number | null;
  r?: number | null; // radius for bubble charts
  raw: any; // original raw value
  index: number;
  valid: boolean;
}

/**
 * Data parser configuration
 */
export interface DataParserOptions {
  skipInvalid?: boolean;
  logWarnings?: boolean;
  normalizeNaN?: boolean;
}

/**
 * Data Parser
 * Parses various data formats into standardized ParsedDataPoint format
 */
export class DataParser {
  private options: Required<DataParserOptions>;

  constructor(options: DataParserOptions = {}) {
    this.options = {
      skipInvalid: options.skipInvalid ?? true,
      logWarnings: options.logWarnings ?? true,
      normalizeNaN: options.normalizeNaN ?? true,
    };
  }

  /**
   * Parse a dataset into standardized format
   * @param dataset - The dataset to parse
   * @param labels - Optional labels for categorical data
   * @returns Array of parsed data points
   */
  parseDataset(dataset: ChartDataset, labels?: string[]): ParsedDataPoint[] {
    const data = dataset.data;

    if (!Array.isArray(data)) {
      if (this.options.logWarnings) {
        console.warn('Dataset data is not an array', dataset);
      }
      return [];
    }

    const parsed: ParsedDataPoint[] = [];

    for (let i = 0; i < data.length; i++) {
      const point = this.parseDataPoint(data[i], i, labels);
      parsed.push(point);
    }

    return parsed;
  }

  /**
   * Parse a single data point
   * @param value - The raw data value
   * @param index - The index of the data point
   * @param labels - Optional labels for categorical data
   * @returns Parsed data point
   */
  private parseDataPoint(value: any, index: number, labels?: string[]): ParsedDataPoint {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return {
        x: null,
        y: null,
        raw: value,
        index,
        valid: false,
      };
    }

    // Handle numeric values (simple y-value)
    if (typeof value === 'number') {
      const y = this.normalizeNumber(value);
      const x = labels ? this.getLabelIndex(labels, index) : index;

      return {
        x,
        y,
        raw: value,
        index,
        valid: y !== null,
      };
    }

    // Handle string values (try to parse as number)
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        const y = this.normalizeNumber(parsed);
        const x = labels ? this.getLabelIndex(labels, index) : index;

        return {
          x,
          y,
          raw: value,
          index,
          valid: y !== null,
        };
      }

      if (this.options.logWarnings) {
        console.warn(`Could not parse string value as number: "${value}"`, {
          index,
        });
      }

      return {
        x: null,
        y: null,
        raw: value,
        index,
        valid: false,
      };
    }

    // Handle object values (x, y, r format)
    if (typeof value === 'object' && value !== null) {
      return this.parseObjectDataPoint(value, index, labels);
    }

    // Unknown type
    if (this.options.logWarnings) {
      console.warn(`Unknown data point type: ${typeof value}`, {
        value,
        index,
      });
    }

    return {
      x: null,
      y: null,
      raw: value,
      index,
      valid: false,
    };
  }

  /**
   * Parse object-based data point (x, y, r format)
   * @param obj - The object to parse
   * @param index - The index of the data point
   * @param labels - Optional labels for categorical data
   * @returns Parsed data point
   */
  private parseObjectDataPoint(obj: any, index: number, labels?: string[]): ParsedDataPoint {
    let x: number | null = null;
    let y: number | null = null;
    let r: number | null = null;
    let valid = false;

    // Try to extract x value
    if ('x' in obj) {
      x = this.normalizeNumber(obj.x);
    } else if (labels) {
      x = this.getLabelIndex(labels, index);
    } else {
      x = index;
    }

    // Try to extract y value
    if ('y' in obj) {
      y = this.normalizeNumber(obj.y);
      valid = y !== null;
    } else if ('value' in obj) {
      y = this.normalizeNumber(obj.value);
      valid = y !== null;
    }

    // Try to extract r value (radius for bubble charts)
    if ('r' in obj) {
      r = this.normalizeNumber(obj.r);
    }

    // If we have at least one valid coordinate, consider it valid
    if (x !== null || y !== null) {
      valid = true;
    }

    if (!valid && this.options.logWarnings) {
      console.warn('Object data point has no valid x or y value', {
        obj,
        index,
      });
    }

    return {
      x,
      y,
      r: r !== null ? r : undefined,
      raw: obj,
      index,
      valid,
    };
  }

  /**
   * Normalize a number value
   * @param value - The value to normalize
   * @returns Normalized number or null if invalid
   */
  private normalizeNumber(value: any): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    const num = Number(value);

    if (isNaN(num)) {
      return null;
    }

    // Handle NaN normalization
    if (!isFinite(num)) {
      if (this.options.normalizeNaN) {
        return null;
      }
      return num;
    }

    return num;
  }

  /**
   * Get the index of a label in the labels array
   * @param labels - The labels array
   * @param index - The data index
   * @returns The label index or the data index if not found
   */
  private getLabelIndex(labels: string[], index: number): number {
    if (!labels || labels.length === 0) {
      return index;
    }

    // If index is within labels range, use it
    if (index < labels.length) {
      return index;
    }

    // Otherwise return the index as-is
    return index;
  }

  /**
   * Parse all datasets in a chart data object
   * @param data - The chart data object
   * @returns Map of dataset index to parsed data points
   */
  parseChartData(data: ChartData): Map<number, ParsedDataPoint[]> {
    const result = new Map<number, ParsedDataPoint[]>();

    if (!data.datasets || !Array.isArray(data.datasets)) {
      return result;
    }

    for (let i = 0; i < data.datasets.length; i++) {
      const dataset = data.datasets[i];
      const parsed = this.parseDataset(dataset, data.labels);
      result.set(i, parsed);
    }

    return result;
  }

  /**
   * Validate parsed data
   * @param parsed - The parsed data points
   * @returns Validation result with count of valid/invalid points
   */
  validateParsedData(parsed: ParsedDataPoint[]): {
    valid: number;
    invalid: number;
    total: number;
  } {
    let valid = 0;
    let invalid = 0;

    for (const point of parsed) {
      if (point.valid) {
        valid++;
      } else {
        invalid++;
      }
    }

    return {
      valid,
      invalid,
      total: parsed.length,
    };
  }

  /**
   * Filter out invalid data points
   * @param parsed - The parsed data points
   * @returns Array of valid data points
   */
  filterValidData(parsed: ParsedDataPoint[]): ParsedDataPoint[] {
    return parsed.filter((point) => point.valid);
  }

  /**
   * Get statistics about parsed data
   * @param parsed - The parsed data points
   * @returns Statistics object
   */
  getDataStatistics(parsed: ParsedDataPoint[]): {
    xMin: number | null;
    xMax: number | null;
    yMin: number | null;
    yMax: number | null;
    rMin: number | null;
    rMax: number | null;
    count: number;
    validCount: number;
  } {
    let xMin: number | null = null;
    let xMax: number | null = null;
    let yMin: number | null = null;
    let yMax: number | null = null;
    let rMin: number | null = null;
    let rMax: number | null = null;
    let validCount = 0;

    for (const point of parsed) {
      if (!point.valid) {
        continue;
      }

      validCount++;

      // Update x bounds
      if (point.x !== null) {
        if (xMin === null || point.x < xMin) {
          xMin = point.x;
        }
        if (xMax === null || point.x > xMax) {
          xMax = point.x;
        }
      }

      // Update y bounds
      if (point.y !== null) {
        if (yMin === null || point.y < yMin) {
          yMin = point.y;
        }
        if (yMax === null || point.y > yMax) {
          yMax = point.y;
        }
      }

      // Update r bounds
      if (point.r !== null && point.r !== undefined) {
        if (rMin === null || point.r < rMin) {
          rMin = point.r;
        }
        if (rMax === null || point.r > rMax) {
          rMax = point.r;
        }
      }
    }

    return {
      xMin,
      xMax,
      yMin,
      yMax,
      rMin,
      rMax,
      count: parsed.length,
      validCount,
    };
  }
}

/**
 * Create a default data parser instance
 */
export function createDataParser(options?: DataParserOptions): DataParser {
  return new DataParser(options);
}
