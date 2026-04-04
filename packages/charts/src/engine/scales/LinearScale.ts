/**
 * Linear Scale - maps numeric values to pixel positions
 *
 * Requirement 24.1: LinearScale SHALL calculate min and max from the data
 * Requirement 24.2: LinearScale SHALL generate evenly spaced Ticks
 * Requirement 24.3: LinearScale mapping SHALL be linear and consistent
 * Requirement 24.4: LinearScale Tick positions SHALL be recalculated on update
 */

import { BaseScale } from './BaseScale';
import type { ScaleOptions, Tick, ChartArea, Chart } from '../types/index';

export class LinearScale extends BaseScale {
  constructor(id: string, options: ScaleOptions, ctx: CanvasRenderingContext2D, chart: Chart) {
    super(id, 'linear', options, ctx, chart);
  }

  parse(value: any): number {
    return typeof value === 'number' ? value : 0;
  }

  /**
   * Map a data value to a pixel position (0-1 normalized)
   * Requirement 4.5: Scale SHALL return a pixel position within the Chart_Area bounds
   */
  getPixelForValue(value: number): number {
    const range = this.max - this.min;
    if (range === 0) return 0.5; // Return middle if no range

    const normalized = (value - this.min) / range;

    // Clamp to [0, 1] to ensure within bounds
    return Math.max(0, Math.min(1, normalized));
  }

  /**
   * Map a pixel position back to a data value
   * Requirement 4.6: Scale SHALL return a value approximately equal to the original data value
   */
  getValueForPixel(pixel: number): number {
    const range = this.max - this.min;
    // Clamp pixel to [0, 1]
    const clampedPixel = Math.max(0, Math.min(1, pixel));
    return this.min + clampedPixel * range;
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
   * Requirement 4.7: Scale SHALL recalculate all Tick positions and labels on dimension updates
   * Requirement 24.4: LinearScale Tick positions SHALL be recalculated on update
   */
  update(maxWidth: number, maxHeight: number): void {
    this.width = maxWidth;
    this.height = maxHeight;

    // Calculate min/max from data if not explicitly set
    if (this.options.min === undefined || this.options.max === undefined) {
      const dataRange = this.calculateDataRange();
      if (this.options.min === undefined) this.min = dataRange.min;
      if (this.options.max === undefined) this.max = dataRange.max;
    } else {
      this.min = this.options.min as number;
      this.max = this.options.max as number;
    }

    this.generateTicks();
    this.validateTicks();
  }

  draw(chartArea: ChartArea): void {
    if (this.id !== 'y') return; // Only draw Y axis for now

    const ctx = this.ctx;
    const x = chartArea.left;
    const top = chartArea.top;
    const bottom = chartArea.bottom;

    ctx.save();
    ctx.strokeStyle = '#1C7FA6';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#29F2DF';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    // Draw Y axis line
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();

    // Draw ticks and labels
    this.ticks.forEach((tick) => {
      const pixelPos = this.getPixelForValue(tick.value);
      const y = bottom - pixelPos * (bottom - top);

      // Draw tick mark
      ctx.beginPath();
      ctx.moveTo(x - 5, y);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Draw label
      ctx.fillText(tick.label, x - 10, y);
    });

    ctx.restore();
  }

  /**
   * Generate evenly spaced ticks
   * Requirement 24.2: LinearScale SHALL generate evenly spaced Ticks
   * Requirement 4.2: Scale SHALL generate Ticks at appropriate intervals
   * Requirement 4.3: Ticks SHALL be monotonically increasing
   * Requirement 4.4: Ticks SHALL all be within the scale's min and max range
   */
  private generateTicks(): void {
    const range = this.max - this.min;
    const stepSize = this.calculateStepSize(range);
    this.ticks = [];

    let value = this.min;
    while (value <= this.max + stepSize * 0.01) {
      // Small epsilon for floating point
      if (value <= this.max) {
        this.ticks.push({
          value,
          label: this.getLabelForValue(value),
          major: true,
        });
      }
      value += stepSize;
    }
  }

  /**
   * Calculate appropriate step size for ticks
   */
  private calculateStepSize(range: number): number {
    if (range === 0) return 1;

    const magnitude = Math.floor(Math.log10(range));
    const normalized = range / Math.pow(10, magnitude);

    let step = 1;
    if (normalized > 5) step = 5;
    else if (normalized > 2) step = 2;

    return step * Math.pow(10, magnitude);
  }
}
