import { ChartDataset, ChartOptions, Point } from '../types/index';
import { BarController } from './BarController';

/**
 * Waterfall Chart Controller
 * نمودار آبشاری برای نمایش تغییرات تجمعی
 */
export class WaterfallController extends BarController {
  id = 'waterfall';
  type = 'waterfall';

  /**
   * Parse waterfall data
   * داده‌های نمودار آبشاری را پردازش می‌کند
   */
  parse(data: any, start: number, count: number) {
    const parsed = super.parse(data, start, count);

    // Calculate cumulative values
    let cumulative = 0;
    const values = parsed.map((p: any) => {
      const value = p.y || 0;
      const base = cumulative;
      cumulative += value;
      return { ...p, base, cumulative };
    });

    return values;
  }

  /**
   * Update waterfall chart
   */
  update(mode: string) {
    const dataset = this.chart.data.datasets[this.index];
    const meta = this.getMeta();

    // Calculate positions
    meta.data.forEach((element: any, index: number) => {
      const value = dataset.data[index] as any;
      const base = value.base || 0;
      const height = value.y || 0;

      element.x = this.getPixelForValue(index);
      element.y = this.chart.scales.y.getPixelForValue(base + height);
      element.base = this.chart.scales.y.getPixelForValue(base);
      element.width = this.getBarWidth(index);
      element.height = element.base - element.y;
    });

    super.update(mode);
  }

  /**
   * Get bar width
   */
  getBarWidth(index: number): number {
    const scale = this.chart.scales.x;
    const width = scale.getPixelForValue(index + 1) - scale.getPixelForValue(index);
    return Math.max(width * 0.8, 1);
  }
}
