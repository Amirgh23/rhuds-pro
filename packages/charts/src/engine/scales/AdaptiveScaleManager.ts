/**
 * Adaptive Scale Manager
 * مدیریت مقیاس‌های خودکار و سازگار
 */
export class AdaptiveScaleManager {
  private scales: Map<string, any> = new Map();
  private ranges: Map<string, { min: number; max: number }> = new Map();
  private formatters: Map<string, (value: number) => string> = new Map();

  /**
   * Register scale
   * مقیاس را ثبت می‌کند
   */
  registerScale(id: string, scale: any): void {
    this.scales.set(id, scale);
  }

  /**
   * Calculate optimal range
   * بازه بهینه را محاسبه می‌کند
   */
  calculateOptimalRange(data: number[]): { min: number; max: number } {
    if (data.length === 0) return { min: 0, max: 1 };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    // Add padding
    const padding = range * 0.1;
    return {
      min: Math.floor((min - padding) / 10) * 10,
      max: Math.ceil((max + padding) / 10) * 10,
    };
  }

  /**
   * Generate nice ticks
   * تیک‌های خوب را تولید می‌کند
   */
  generateNiceTicks(min: number, max: number, count: number = 5): number[] {
    const range = max - min;
    const step = range / (count - 1);
    const ticks: number[] = [];

    for (let i = 0; i < count; i++) {
      ticks.push(min + step * i);
    }

    return ticks;
  }

  /**
   * Auto format values
   * مقادیر را خودکار فرمت می‌کند
   */
  autoFormat(value: number): string {
    if (Math.abs(value) >= 1e6) {
      return (value / 1e6).toFixed(1) + 'M';
    } else if (Math.abs(value) >= 1e3) {
      return (value / 1e3).toFixed(1) + 'K';
    } else if (Math.abs(value) < 1 && value !== 0) {
      return value.toFixed(2);
    }
    return value.toFixed(0);
  }

  /**
   * Register custom formatter
   * فرمت‌کننده سفارشی را ثبت می‌کند
   */
  registerFormatter(id: string, formatter: (value: number) => string): void {
    this.formatters.set(id, formatter);
  }

  /**
   * Format value
   * مقدار را فرمت می‌کند
   */
  format(id: string, value: number): string {
    const formatter = this.formatters.get(id);
    return formatter ? formatter(value) : this.autoFormat(value);
  }

  /**
   * Adapt scale to data
   * مقیاس را به داده‌ها سازگار می‌کند
   */
  adaptScale(id: string, data: number[]): void {
    const range = this.calculateOptimalRange(data);
    this.ranges.set(id, range);

    const scale = this.scales.get(id);
    if (scale) {
      scale.min = range.min;
      scale.max = range.max;
    }
  }

  /**
   * Get scale info
   */
  getScaleInfo(id: string) {
    return {
      scale: this.scales.get(id),
      range: this.ranges.get(id),
      formatter: this.formatters.get(id),
    };
  }
}
