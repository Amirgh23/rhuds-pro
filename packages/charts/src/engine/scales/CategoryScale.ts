/**
 * Category Scale - maps categorical labels to positions
 *
 * Requirement 25.1: CategoryScale SHALL create one position for each label
 * Requirement 25.2: CategoryScale mapping SHALL be consistent
 * Requirement 25.3: CategoryScale positions SHALL be recalculated on label updates
 */

import { BaseScale } from './BaseScale';
import type { ScaleOptions, Tick, ChartArea, Chart } from '../types/index';

export class CategoryScale extends BaseScale {
  categories: string[] = [];

  constructor(id: string, options: ScaleOptions, ctx: CanvasRenderingContext2D, chart: Chart) {
    super(id, 'category', options, ctx, chart);
    this.extractCategories();
  }

  parse(value: any): number {
    return typeof value === 'number' ? value : 0;
  }

  /**
   * Map a category index to a pixel position (0-1 normalized)
   * Requirement 25.2: CategoryScale mapping SHALL be consistent
   */
  getPixelForValue(value: number): number {
    const index = Math.round(value);
    if (this.categories.length === 0) return 0;
    if (this.categories.length === 1) return 0.5;

    // Clamp index to valid range
    const clampedIndex = Math.max(0, Math.min(index, this.categories.length - 1));
    return clampedIndex / (this.categories.length - 1);
  }

  /**
   * Map a pixel position back to a category index
   */
  getValueForPixel(pixel: number): number {
    if (this.categories.length === 0) return 0;
    if (this.categories.length === 1) return 0;

    // Clamp pixel to [0, 1]
    const clampedPixel = Math.max(0, Math.min(1, pixel));
    return clampedPixel * (this.categories.length - 1);
  }

  getPixelForTick(index: number): number {
    if (index < 0 || index >= this.ticks.length) return 0;
    return this.getPixelForValue(this.ticks[index].value);
  }

  getLabelForValue(value: number): string {
    const index = Math.round(value);
    return this.categories[index] || '';
  }

  /**
   * Update scale with new dimensions
   * Requirement 25.3: CategoryScale positions SHALL be recalculated on label updates
   */
  update(maxWidth: number, maxHeight: number): void {
    this.width = maxWidth;
    this.height = maxHeight;
    this.extractCategories();
    this.generateTicks();
    this.validateTicks();
  }

  draw(chartArea: ChartArea): void {
    if (this.id !== 'x') return; // Only draw X axis for now

    const ctx = this.ctx;
    const left = chartArea.left;
    const right = chartArea.right;
    const y = chartArea.bottom;

    ctx.save();
    ctx.strokeStyle = '#1C7FA6';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#29F2DF';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Draw X axis line
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();

    // Draw ticks and labels
    this.ticks.forEach((tick) => {
      const pixelPos = this.getPixelForValue(tick.value);
      const x = left + pixelPos * (right - left);

      // Draw tick mark
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 5);
      ctx.stroke();

      // Draw label
      ctx.fillText(tick.label, x, y + 10);
    });

    ctx.restore();
  }

  /**
   * Extract categories from chart labels
   * Requirement 25.1: CategoryScale SHALL create one position for each label
   */
  private extractCategories(): void {
    const labels = this.chart.data.labels || [];
    this.categories = labels as string[];
    this.min = 0;
    this.max = Math.max(0, this.categories.length - 1);
  }

  /**
   * Generate ticks for each category
   * Requirement 4.2: Scale SHALL generate Ticks at appropriate intervals
   * Requirement 4.3: Ticks SHALL be monotonically increasing
   * Requirement 4.4: Ticks SHALL all be within the scale's min and max range
   */
  private generateTicks(): void {
    this.ticks = this.categories.map((cat, idx) => ({
      value: idx,
      label: cat,
      major: true,
    }));
  }
}
