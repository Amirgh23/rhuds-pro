import { ChartController } from './ChartController';

/**
 * Treemap Chart Controller
 * نمودار Treemap برای نمایش سلسله‌مراتبی
 */
export class TreemapController extends ChartController {
  id = 'treemap';
  type = 'treemap';

  /**
   * Parse treemap data
   * داده‌های Treemap را پردازش می‌کند
   * Format: hierarchical tree structure
   */
  parse(data: any) {
    const width = this.chart.width;
    const height = this.chart.height;

    // Calculate rectangles using squarified algorithm
    const rectangles = this.squarify(data, 0, 0, width, height);
    return rectangles;
  }

  /**
   * Squarified treemap algorithm
   * الگوریتم Squarified برای محاسبه مستطیل‌ها
   */
  private squarify(data: any, x: number, y: number, width: number, height: number): any[] {
    if (!data.children || data.children.length === 0) {
      return [
        {
          x,
          y,
          width,
          height,
          value: data.value,
          label: data.label,
          color: data.color,
        },
      ];
    }

    const total = data.children.reduce((sum: number, child: any) => sum + child.value, 0);
    const rectangles: any[] = [];
    let currentX = x;
    let currentY = y;
    let remainingWidth = width;
    let remainingHeight = height;

    data.children.forEach((child: any, index: number) => {
      const ratio = child.value / total;
      const isHorizontal = remainingWidth > remainingHeight;

      let childWidth, childHeight;
      if (isHorizontal) {
        childWidth = remainingWidth * ratio;
        childHeight = remainingHeight;
      } else {
        childWidth = remainingWidth;
        childHeight = remainingHeight * ratio;
      }

      const childRects = this.squarify(child, currentX, currentY, childWidth, childHeight);

      rectangles.push(...childRects);

      if (isHorizontal) {
        currentX += childWidth;
        remainingWidth -= childWidth;
      } else {
        currentY += childHeight;
        remainingHeight -= childHeight;
      }
    });

    return rectangles;
  }

  /**
   * Update treemap chart
   */
  update(mode: string) {
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    const rectangles = this.parse(dataset.data);
    meta.data = rectangles;

    super.update(mode);
  }

  /**
   * Draw treemap chart
   */
  draw() {
    const ctx = this.chart.ctx;
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    meta.data.forEach((rect: any) => {
      // Draw rectangle
      ctx.fillStyle = rect.color || dataset.backgroundColor || '#0ff';
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

      // Draw border
      ctx.strokeStyle = dataset.borderColor || '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Draw label
      if (rect.label && rect.width > 40 && rect.height > 30) {
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(rect.label, rect.x + rect.width / 2, rect.y + rect.height / 2);
      }
    });
  }
}
