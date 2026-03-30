/**
 * Configuration Validator
 * Validates chart configuration and data
 */

import type { ChartOptions, ChartData } from '../types/index';

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export class ConfigValidator {
  /**
   * Validate chart type
   */
  static validateChartType(type: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const validTypes = [
      'line',
      'bar',
      'pie',
      'doughnut',
      'radar',
      'polarArea',
      'bubble',
      'scatter',
      'mixed',
    ];

    if (!type) {
      errors.push({
        field: 'type',
        message: 'Chart type is required',
      });
    } else if (!validTypes.includes(type)) {
      errors.push({
        field: 'type',
        message: `Invalid chart type: ${type}. Must be one of: ${validTypes.join(', ')}`,
        value: type,
      });
    }

    return errors;
  }

  /**
   * Validate data structure
   */
  static validateData(data: ChartData): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data) {
      errors.push({
        field: 'data',
        message: 'Data is required',
      });
      return errors;
    }

    if (!Array.isArray(data.datasets)) {
      errors.push({
        field: 'data.datasets',
        message: 'Datasets must be an array',
        value: typeof data.datasets,
      });
    } else if (data.datasets.length === 0) {
      errors.push({
        field: 'data.datasets',
        message: 'At least one dataset is required',
      });
    }

    if (data.labels && !Array.isArray(data.labels)) {
      errors.push({
        field: 'data.labels',
        message: 'Labels must be an array',
        value: typeof data.labels,
      });
    }

    return errors;
  }

  /**
   * Validate options
   */
  static validateOptions(options: Partial<ChartOptions>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (options.responsive !== undefined && typeof options.responsive !== 'boolean') {
      errors.push({
        field: 'options.responsive',
        message: 'Responsive must be a boolean',
        value: typeof options.responsive,
      });
    }

    if (
      options.maintainAspectRatio !== undefined &&
      typeof options.maintainAspectRatio !== 'boolean'
    ) {
      errors.push({
        field: 'options.maintainAspectRatio',
        message: 'MaintainAspectRatio must be a boolean',
        value: typeof options.maintainAspectRatio,
      });
    }

    if (options.aspectRatio !== undefined && typeof options.aspectRatio !== 'number') {
      errors.push({
        field: 'options.aspectRatio',
        message: 'AspectRatio must be a number',
        value: typeof options.aspectRatio,
      });
    }

    return errors;
  }

  /**
   * Validate complete configuration
   */
  static validate(
    type: string,
    data: ChartData,
    options?: Partial<ChartOptions>
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    errors.push(...this.validateChartType(type));
    errors.push(...this.validateData(data));

    if (options) {
      errors.push(...this.validateOptions(options));
    }

    return errors;
  }

  /**
   * Get error message
   */
  static getErrorMessage(errors: ValidationError[]): string {
    if (errors.length === 0) return '';

    const messages = errors.map((e) => `${e.field}: ${e.message}`);
    return messages.join('\n');
  }
}

export default ConfigValidator;
