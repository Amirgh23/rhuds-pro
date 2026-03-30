/**
 * Base Dataset Controller
 * Manages data parsing, element creation, and rendering for a specific chart type
 */

import type {
  IDatasetController,
  Chart,
  ChartDataset,
  ChartMeta,
  ElementStyle,
  UpdateMode,
} from '../types/index';

/**
 * Base class for all dataset controllers
 */
export abstract class DatasetController implements IDatasetController {
  chart: Chart;
  index: number;
  type: string;

  protected dataset: ChartDataset;
  protected meta: ChartMeta;

  constructor(chart: Chart, index: number, type: string) {
    this.chart = chart;
    this.index = index;
    this.type = type;
    this.dataset = chart.data.datasets[index];
    this.meta = {
      type,
      index,
      data: [],
      parsed: [],
      updated: false,
      hidden: false,
    };
  }

  /**
   * Initialize the controller
   */
  initialize(): void {
    // Override in subclasses
  }

  /**
   * Parse data from the dataset
   * @param start - Start index
   * @param count - Number of items to parse
   */
  abstract parse(start: number, count: number): void;

  /**
   * Update the controller with a specific mode
   * @param mode - Update mode (default, active, resize, reset, none)
   */
  abstract update(mode: UpdateMode): void;

  /**
   * Draw the dataset to the canvas
   */
  abstract draw(): void;

  /**
   * Destroy the controller and cleanup resources
   */
  destroy(): void {
    this.meta.data = [];
    this.meta.parsed = [];
  }

  /**
   * Get the dataset
   */
  getDataset(): ChartDataset {
    return this.dataset;
  }

  /**
   * Get the metadata
   */
  getMeta(): ChartMeta {
    return this.meta;
  }

  /**
   * Get the style for an element at a specific index
   * @param index - Element index
   * @param active - Whether the element is in active/hover state
   */
  abstract getStyle(index: number, active: boolean): ElementStyle;

  /**
   * Helper method to get the pixel position for a value on the X axis
   * @param value - Data value
   * @param index - Data index
   */
  protected getPixelForValueX(value: number, index: number): number {
    const xScale = this.chart.scales.get('x');
    if (!xScale) {
      return 0;
    }
    return xScale.getPixelForValue(value);
  }

  /**
   * Helper method to get the pixel position for a value on the Y axis
   * @param value - Data value
   * @param index - Data index
   */
  protected getPixelForValueY(value: number, index: number): number {
    const yScale = this.chart.scales.get('y');
    if (!yScale) {
      return 0;
    }
    return yScale.getPixelForValue(value);
  }
}
