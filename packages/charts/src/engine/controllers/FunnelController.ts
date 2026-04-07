import { ChartController } from './ChartController';

/**
 * Funnel Chart Controller
 * نمودار قیف برای نمایش مراحل تبدیل
 */
export class FunnelController extends ChartController {
  id = 'funnel';
  type = 'funnel';

  /**
   * Parse funnel data
   * داده‌های Funnel را پردازش می‌کند
   * Format: [{ label, value }, ...]
   */
  parse(data: any[]) {
    const maxValue = Math.max(...data.map((d) => d.value));
    const height = this.chart.height;
    const width = this.chart.width;
    const padding = 40;
    const segmentHeight = (height - 2 * padding) / data.length;

    return data.map((item, index) => {
      const ratio = item.value / maxValue;
      const segmentWidth = (width - 2 * padding) * ratio;
      const x = padding + (width - 2 * padding - segmentWidth) / 2;
      const y = padding + index * segmentHeight;

      return {
        label: item.label,
        value: item.value,
        ratio,
        x,
        y,
        width: segmentWidth,
        height: segmentHeight,
        percentage: ((item.value / maxValue) * 100).toFixed(1),
      };
    });
  }

  /**
   * Update funnel chart
   */
  update(mode: string) {
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    const segments = this.parse(dataset.data as any[]);
    meta.data = segments;

    super.update(mode);
  }

  /**
   * Draw funnel chart
   */
  draw() {
    const ctx = this.chart.ctx;
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    meta.data.forEach((segment: any, index: number) => {
      // Draw segment
      ctx.fillStyle = dataset.backgroundColor || `hsl(${index * 30}, 100%, 50%)`;
      ctx.fillRect(segment.x, segment.y, segment.width, segment.height);

      // Draw border
      ctx.strokeStyle = dataset.borderColor || '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(segment.x, segment.y, segment.width, segment.height);

      // Draw label and value
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        segment.label,
        segment.x + segment.width / 2,
        segment.y + segment.height / 2 - 10
      );

      ctx.font = '12px Arial';
      ctx.fillText(
        `${segment.value} (${segment.percentage}%)`,
        segment.x + segment.width / 2,
        segment.y + segment.height / 2 + 10
      );
    });
  }
}
