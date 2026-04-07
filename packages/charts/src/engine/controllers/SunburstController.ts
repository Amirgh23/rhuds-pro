import { ChartController } from './ChartController';

/**
 * Sunburst Chart Controller
 * نمودار دایره‌ای سلسله‌مراتبی
 */
export class SunburstController extends ChartController {
  id = 'sunburst';
  type = 'sunburst';

  /**
   * Parse sunburst data
   * داده‌های Sunburst را پردازش می‌کند
   */
  parse(data: any) {
    const width = this.chart.width;
    const height = this.chart.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 20;

    const segments = this.calculateSegments(data, 0, 360, 0, maxRadius, centerX, centerY);
    return segments;
  }

  /**
   * Calculate segments recursively
   */
  private calculateSegments(
    data: any,
    startAngle: number,
    endAngle: number,
    innerRadius: number,
    outerRadius: number,
    centerX: number,
    centerY: number
  ): any[] {
    const segments: any[] = [];
    const total =
      data.children?.reduce((sum: number, child: any) => sum + child.value, 0) || data.value;

    if (!data.children || data.children.length === 0) {
      return [
        {
          label: data.label,
          value: data.value,
          startAngle,
          endAngle,
          innerRadius,
          outerRadius,
          centerX,
          centerY,
        },
      ];
    }

    let currentAngle = startAngle;
    const angleRange = endAngle - startAngle;

    data.children.forEach((child: any) => {
      const childAngleRange = (child.value / total) * angleRange;
      const childEndAngle = currentAngle + childAngleRange;

      const childSegments = this.calculateSegments(
        child,
        currentAngle,
        childEndAngle,
        innerRadius,
        outerRadius,
        centerX,
        centerY
      );

      segments.push(...childSegments);
      currentAngle = childEndAngle;
    });

    return segments;
  }

  /**
   * Update sunburst chart
   */
  update(mode: string) {
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    const segments = this.parse(dataset.data);
    meta.data = segments;

    super.update(mode);
  }

  /**
   * Draw sunburst chart
   */
  draw() {
    const ctx = this.chart.ctx;
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    meta.data.forEach((segment: any, index: number) => {
      const startRad = (segment.startAngle * Math.PI) / 180;
      const endRad = (segment.endAngle * Math.PI) / 180;

      // Draw segment
      ctx.fillStyle = dataset.backgroundColor || `hsl(${index * 30}, 100%, 50%)`;
      ctx.beginPath();
      ctx.arc(segment.centerX, segment.centerY, segment.outerRadius, startRad, endRad);
      ctx.lineTo(
        segment.centerX + Math.cos(endRad) * segment.innerRadius,
        segment.centerY + Math.sin(endRad) * segment.innerRadius
      );
      ctx.arc(segment.centerX, segment.centerY, segment.innerRadius, endRad, startRad, true);
      ctx.closePath();
      ctx.fill();

      // Draw border
      ctx.strokeStyle = dataset.borderColor || '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw label
      if (segment.label) {
        const midAngle = (((segment.startAngle + segment.endAngle) / 2) * Math.PI) / 180;
        const midRadius = (segment.innerRadius + segment.outerRadius) / 2;
        const x = segment.centerX + Math.cos(midAngle) * midRadius;
        const y = segment.centerY + Math.sin(midAngle) * midRadius;

        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(segment.label, x, y);
      }
    });
  }
}
