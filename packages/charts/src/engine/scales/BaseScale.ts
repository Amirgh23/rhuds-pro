/**
 * Base Scale class with min/max calculation, tick generation, and value-to-pixel mapping
 *
 * Requirement 4.1: Scale SHALL determine the minimum and maximum data values
 * Requirement 4.2: Scale SHALL generate Ticks at appropriate intervals
 * Requirement 4.5: Scale SHALL return a pixel position within the Chart_Area bounds
 * Requirement 4.6: Scale SHALL return a value approximately equal to the original data value
 * Requirement 4.7: Scale SHALL recalculate all Tick positions and labels on dimension updates
 */

import type { IScale, ScaleOptions, Tick, ChartArea, Chart } from '../types/index';

export abstract class BaseScale implements IScale {
  id: string;
  type: string;
  options: ScaleOptions;
  ctx: CanvasRenderingContext2D;
  chart: Chart;

  min: number = 0;
  max: number = 100;
  ticks: Tick[] = [];

  // Dimension tracking for responsive updates
  width: number = 0;
  height: number = 0;

  constructor(
    id: string,
    type: string,
    options: ScaleOptions,
    ctx: CanvasRenderingContext2D,
    chart: Chart
  ) {
    this.id = id;
    this.type = type;
    this.options = options;
    this.ctx = ctx;
    this.chart = chart;
  }

  /**
   * Calculate min and max values from chart data
   * Requirement 4.1: Scale SHALL determine the minimum and maximum data values
   */
  protected calculateDataRange(): { min: number; max: number } {
    let min = Infinity;
    let max = -Infinity;

    // Iterate through all datasets
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data.forEach((value) => {
        const parsed = this.parse(value);
        if (typeof parsed === 'number' && isFinite(parsed)) {
          min = Math.min(min, parsed);
          max = Math.max(max, parsed);
        }
      });
    });

    // Handle edge cases
    if (!isFinite(min)) min = 0;
    if (!isFinite(max)) max = 100;
    if (min === max) {
      max = min + 1;
    }

    return { min, max };
  }

  /**
   * Validate that ticks are monotonically increasing and within bounds
   * Requirement 4.3: Ticks SHALL be monotonically increasing
   * Requirement 4.4: Ticks SHALL all be within the scale's min and max range
   */
  protected validateTicks(): boolean {
    if (this.ticks.length === 0) return true;

    for (let i = 0; i < this.ticks.length; i++) {
      const tick = this.ticks[i];

      // Check within bounds
      if (tick.value < this.min || tick.value > this.max) {
        console.warn(`Tick value ${tick.value} is outside scale range [${this.min}, ${this.max}]`);
        return false;
      }

      // Check monotonically increasing
      if (i > 0 && tick.value < this.ticks[i - 1].value) {
        console.warn(`Ticks are not monotonically increasing at index ${i}`);
        return false;
      }
    }

    return true;
  }

  abstract parse(value: any): number;
  abstract getPixelForValue(value: number): number;
  abstract getValueForPixel(pixel: number): number;
  abstract getPixelForTick(index: number): number;
  abstract getLabelForValue(value: number): string;
  abstract update(maxWidth: number, maxHeight: number): void;
  abstract draw(chartArea: ChartArea): void;
}
