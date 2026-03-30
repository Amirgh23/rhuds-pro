/**
 * Defaults Manager
 * Manages default options for all chart types
 */

import type { ChartOptions, ChartTheme } from '../types/index';
import type { Registry } from '../registry/Registry';

export interface DefaultsConfig {
  global?: Partial<ChartOptions>;
  [chartType: string]: any;
}

export class DefaultsManager {
  private defaults: DefaultsConfig = {};

  constructor(defaults: DefaultsConfig = {}) {
    this.defaults = this.initializeDefaults(defaults);
  }

  /**
   * Register all default components with registry
   */
  static registerDefaults(registry: Registry): void {
    // Default components are registered directly
    // This method is kept for API compatibility
    // Components are registered when they're imported in their respective index files
  }

  /**
   * Initialize default configuration
   */
  private initializeDefaults(config: DefaultsConfig): DefaultsConfig {
    return {
      global: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        animation: {
          duration: 750,
          easing: 'easeInOutQuart',
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
          title: {
            display: false,
          },
        },
        ...config.global,
      },
      line: {
        tension: 0.1,
        fill: false,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        ...config.line,
      },
      bar: {
        barPercentage: 0.8,
        categoryPercentage: 0.9,
        borderWidth: 1,
        ...config.bar,
      },
      pie: {
        cutout: 0,
        ...config.pie,
      },
      doughnut: {
        cutout: '50%',
        ...config.doughnut,
      },
      radar: {
        tension: 0.1,
        fill: true,
        ...config.radar,
      },
      polarArea: {
        ...config.polarArea,
      },
      bubble: {
        ...config.bubble,
      },
      scatter: {
        showLine: false,
        ...config.scatter,
      },
      mixed: {
        ...config.mixed,
      },
    };
  }

  /**
   * Get defaults for a chart type
   */
  getDefaults(chartType: string): any {
    return {
      ...this.defaults.global,
      ...this.defaults[chartType],
    };
  }

  /**
   * Merge user options with defaults
   */
  mergeOptions(chartType: string, userOptions: Partial<ChartOptions>): ChartOptions {
    const defaults = this.getDefaults(chartType);
    return this.deepMerge(defaults, userOptions);
  }

  /**
   * Set defaults for a chart type
   */
  setDefaults(chartType: string, options: any): void {
    this.defaults[chartType] = {
      ...this.defaults[chartType],
      ...options,
    };
  }

  /**
   * Set global defaults
   */
  setGlobalDefaults(options: Partial<ChartOptions>): void {
    this.defaults.global = {
      ...this.defaults.global,
      ...options,
    };
  }

  /**
   * Deep merge objects
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key]) &&
          typeof target[key] === 'object' &&
          target[key] !== null &&
          !Array.isArray(target[key])
        ) {
          result[key] = this.deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }

  /**
   * Get all defaults
   */
  getAllDefaults(): DefaultsConfig {
    return JSON.parse(JSON.stringify(this.defaults));
  }

  /**
   * Reset to initial defaults
   */
  reset(): void {
    this.defaults = this.initializeDefaults({});
  }
}

export default DefaultsManager;
