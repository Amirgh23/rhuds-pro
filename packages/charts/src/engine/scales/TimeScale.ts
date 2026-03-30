/**
 * Time Scale - maps time values to positions
 *
 * Requirement 26.1: TimeScale SHALL parse time values
 * Requirement 26.2: TimeScale SHALL generate Ticks at appropriate time intervals (hourly, daily, monthly, yearly)
 * Requirement 26.3: TimeScale mapping SHALL be consistent
 */

import { BaseScale } from './BaseScale';
import type { ScaleOptions, Tick, ChartArea, Chart } from '../types/index';

export class TimeScale extends BaseScale {
  constructor(id: string, options: ScaleOptions, ctx: CanvasRenderingContext2D, chart: Chart) {
    super(id, 'time', options, ctx, chart);
  }

  /**
   * Parse time values from various formats
   * Requirement 26.1: TimeScale SHALL parse time values
   */
  parse(value: any): number {
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'string') return new Date(value).getTime();
    if (typeof value === 'number') return value;
    return 0;
  }

  /**
   * Map a time value to a pixel position (0-1 normalized)
   * Requirement 26.3: TimeScale mapping SHALL be consistent
   */
  getPixelForValue(value: number): number {
    const range = this.max - this.min;
    if (range === 0) return 0.5;

    const normalized = (value - this.min) / range;
    return Math.max(0, Math.min(1, normalized));
  }

  /**
   * Map a pixel position back to a time value
   */
  getValueForPixel(pixel: number): number {
    const range = this.max - this.min;
    const clampedPixel = Math.max(0, Math.min(1, pixel));
    return this.min + clampedPixel * range;
  }

  getPixelForTick(index: number): number {
    if (index < 0 || index >= this.ticks.length) return 0;
    return this.getPixelForValue(this.ticks[index].value);
  }

  getLabelForValue(value: number): string {
    const date = new Date(value);
    return date.toLocaleDateString();
  }

  /**
   * Update scale with new dimensions
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
    // Draw time scale
  }

  /**
   * Generate time-based ticks at appropriate intervals
   * Requirement 26.2: TimeScale SHALL generate Ticks at appropriate time intervals (hourly, daily, monthly, yearly)
   * Requirement 4.2: Scale SHALL generate Ticks at appropriate intervals
   * Requirement 4.3: Ticks SHALL be monotonically increasing
   * Requirement 4.4: Ticks SHALL all be within the scale's min and max range
   */
  private generateTicks(): void {
    const range = this.max - this.min;
    const interval = this.calculateInterval(range);
    this.ticks = [];

    let value = Math.ceil(this.min / interval) * interval;
    while (value <= this.max) {
      if (value >= this.min) {
        this.ticks.push({
          value,
          label: this.getLabelForValue(value),
          major: this.isMajorTick(value, interval),
        });
      }
      value += interval;
    }
  }

  /**
   * Calculate appropriate time interval based on range
   * Supports hourly, daily, monthly, and yearly intervals
   */
  private calculateInterval(range: number): number {
    // Range is in milliseconds
    const HOUR = 3600000;
    const DAY = 86400000;
    const MONTH = 2592000000; // 30 days
    const YEAR = 31536000000; // 365 days

    if (range < HOUR * 6) return 10 * 60000; // 10 minutes
    if (range < HOUR * 24) return HOUR; // 1 hour
    if (range < DAY * 7) return DAY; // 1 day
    if (range < MONTH * 3) return DAY * 7; // 1 week
    if (range < YEAR) return MONTH; // 1 month
    return YEAR; // 1 year
  }

  /**
   * Determine if a tick is a major tick
   */
  private isMajorTick(value: number, interval: number): boolean {
    const date = new Date(value);
    const HOUR = 3600000;
    const DAY = 86400000;
    const MONTH = 2592000000;
    const YEAR = 31536000000;

    if (interval === YEAR) return date.getMonth() === 0 && date.getDate() === 1;
    if (interval === MONTH) return date.getDate() === 1;
    if (interval === DAY * 7) return date.getDay() === 0;
    if (interval === DAY) return date.getHours() === 0;
    if (interval === HOUR) return date.getMinutes() === 0;

    return true;
  }
}
