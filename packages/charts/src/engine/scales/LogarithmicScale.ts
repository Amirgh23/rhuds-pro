/**
 * Logarithmic Scale - maps exponential values to positions
 *
 * Requirement 27.1: LogarithmicScale SHALL calculate min and max from the data
 * Requirement 27.2: LogarithmicScale mapping SHALL use logarithmic transformation
 * Requirement 27.3: LogarithmicScale Ticks SHALL be at logarithmic intervals
 */

import { BaseScale } from './BaseScale';
import type { ScaleOptions, Tick, ChartArea, Chart } from '../types/index';

export class LogarithmicScale extends BaseScale {
  constructor(id: string, options: ScaleOptions, ctx: CanvasRenderingContext2D, chart: Chart) {
    super(id, 'logarithmic', options, ctx, chart);
  }

  /**
   * Parse values, ensuring they're positive for logarithmic scale
   */
  parse(value: any): number {
    return typeof value === 'number' && value > 0 ? value : 1;
  }

  /**
   * Map a value to a pixel position using logarithmic transformation
   * Requirement 27.2: LogarithmicScale mapping SHALL use logarithmic transformation
   */
  getPixelForValue(value: number): number {
    if (value <= 0) return 0;

    const logMin = Math.log10(Math.max(this.min, 1));
    const logMax = Math.log10(Math.max(this.max, 1));
    const logValue = Math.log10(value);
    const range = logMax - logMin;

    if (range === 0) return 0.5;

    const normalized = (logValue - logMin) / range;
    return Math.max(0, Math.min(1, normalized));
  }

  /**
   * Map a pixel position back to a value using inverse logarithmic transformation
   */
  getValueForPixel(pixel: number): number {
    const logMin = Math.log10(Math.max(this.min, 1));
    const logMax = Math.log10(Math.max(this.max, 1));
    const range = logMax - logMin;

    const clampedPixel = Math.max(0, Math.min(1, pixel));
    const logValue = logMin + clampedPixel * range;
    return Math.pow(10, logValue);
  }

  getPixelForTick(index: number): number {
    if (index < 0 || index >= this.ticks.length) return 0;
    return this.getPixelForValue(this.ticks[index].value);
  }

  getLabelForValue(value: number): string {
    return value.toFixed(0);
  }

  /**
   * Update scale with new dimensions
   * Requirement 27.1: LogarithmicScale SHALL calculate min and max from the data
   */
  update(maxWidth: number, maxHeight: number): void {
    this.width = maxWidth;
    this.height = maxHeight;

    // Calculate min/max from data if not explicitly set
    if (this.options.min === undefined || this.options.max === undefined) {
      const dataRange = this.calculateDataRange();
      if (this.options.min === undefined) this.min = Math.max(dataRange.min, 1);
      if (this.options.max === undefined) this.max = Math.max(dataRange.max, this.min + 1);
    } else {
      this.min = Math.max(this.options.min as number, 1);
      this.max = Math.max(this.options.max as number, this.min + 1);
    }

    this.generateTicks();
    this.validateTicks();
  }

  draw(chartArea: ChartArea): void {
    // Draw logarithmic scale
  }

  /**
   * Generate logarithmic ticks
   * Requirement 27.3: LogarithmicScale Ticks SHALL be at logarithmic intervals
   * Requirement 4.2: Scale SHALL generate Ticks at appropriate intervals
   * Requirement 4.3: Ticks SHALL be monotonically increasing
   * Requirement 4.4: Ticks SHALL all be within the scale's min and max range
   */
  private generateTicks(): void {
    const logMin = Math.log10(Math.max(this.min, 1));
    const logMax = Math.log10(Math.max(this.max, 1));
    this.ticks = [];

    // Generate ticks at powers of 10
    for (let i = Math.floor(logMin); i <= Math.ceil(logMax); i++) {
      const value = Math.pow(10, i);
      if (value >= this.min && value <= this.max) {
        this.ticks.push({
          value,
          label: this.getLabelForValue(value),
          major: true,
        });
      }
    }

    // If we don't have enough ticks, add intermediate values
    if (this.ticks.length < 3) {
      this.generateIntermediateTicks();
    }
  }

  /**
   * Generate intermediate logarithmic ticks for better granularity
   */
  private generateIntermediateTicks(): void {
    const logMin = Math.log10(Math.max(this.min, 1));
    const logMax = Math.log10(Math.max(this.max, 1));
    const newTicks: Tick[] = [];

    for (let i = Math.floor(logMin); i < Math.ceil(logMax); i++) {
      // Add main tick
      const mainValue = Math.pow(10, i);
      if (mainValue >= this.min && mainValue <= this.max) {
        newTicks.push({
          value: mainValue,
          label: this.getLabelForValue(mainValue),
          major: true,
        });
      }

      // Add intermediate ticks (2, 3, 5, 7 * 10^i)
      const multipliers = [2, 3, 5, 7];
      for (const mult of multipliers) {
        const value = mult * Math.pow(10, i);
        if (value >= this.min && value <= this.max) {
          newTicks.push({
            value,
            label: this.getLabelForValue(value),
            major: false,
          });
        }
      }
    }

    // Sort and deduplicate
    newTicks.sort((a, b) => a.value - b.value);
    this.ticks = newTicks.filter(
      (tick, idx, arr) => idx === 0 || tick.value !== arr[idx - 1].value
    );
  }
}
