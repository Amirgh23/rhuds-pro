import { ChartController } from './ChartController';

/**
 * Heatmap Chart Controller
 * نقشه حرارتی برای نمایش داده‌های دو بعدی
 */
export class HeatmapController extends ChartController {
  id = 'heatmap';
  type = 'heatmap';

  /**
   * Parse heatmap data
   * داده‌های Heatmap را پردازش می‌کند
   * Format: { x: [...], y: [...], values: [[...]] }
   */
  parse(data: any) {
    const { x = [], y = [], values = [] } = data;
    const cellSize = 30;
    const padding = 40;

    const cells = [];
    const minValue = Math.min(...values.flat());
    const maxValue = Math.max(...values.flat());

    for (let i = 0; i < y.length; i++) {
      for (let j = 0; j < x.length; j++) {
        const value = values[i]?.[j] || 0;
        const normalized = (value - minValue) / (maxValue - minValue);

        cells.push({
          x: padding + j * cellSize,
          y: padding + i * cellSize,
          width: cellSize,
          height: cellSize,
          value,
          normalized,
          label: `${x[j]}, ${y[i]}`,
        });
      }
    }

    return cells;
  }

  /**
   * Get color for value
   * رنگ را بر اساس مقدار محاسبه می‌کند
   */
  private getColorForValue(normalized: number): string {
    // Blue to Red gradient
    const hue = (1 - normalized) * 240; // 240 (blue) to 0 (red)
    return `hsl(${hue}, 100%, 50%)`;
  }

  /**
   * Update heatmap chart
   */
  update(mode: string) {
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    const cells = this.parse(dataset.data);
    meta.data = cells;

    super.update(mode);
  }

  /**
   * Draw heatmap chart
   */
  draw() {
    const ctx = this.chart.ctx;
    const meta = this.getMeta();

    meta.data.forEach((cell: any) => {
      // Draw cell
      ctx.fillStyle = this.getColorForValue(cell.normalized);
      ctx.fillRect(cell.x, cell.y, cell.width, cell.height);

      // Draw border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);

      // Draw value
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cell.value.toFixed(1), cell.x + cell.width / 2, cell.y + cell.height / 2);
    });
  }
}
