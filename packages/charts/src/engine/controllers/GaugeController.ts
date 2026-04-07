import { ChartController } from './ChartController';

/**
 * Gauge Chart Controller
 * سنج دایره‌ای برای نمایش یک مقدار
 */
export class GaugeController extends ChartController {
  id = 'gauge';
  type = 'gauge';

  /**
   * Parse gauge data
   * داده‌های Gauge را پردازش می‌کند
   * Format: { value, min, max, label }
   */
  parse(data: any) {
    const { value = 0, min = 0, max = 100, label = '' } = data;
    const normalized = (value - min) / (max - min);

    return {
      value,
      min,
      max,
      normalized: Math.max(0, Math.min(1, normalized)),
      label,
      angle: normalized * 270 - 135, // -135 to 135 degrees
    };
  }

  /**
   * Update gauge chart
   */
  update(mode: string) {
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    const gauge = this.parse(dataset.data);
    meta.data = [gauge];

    super.update(mode);
  }

  /**
   * Draw gauge chart
   */
  draw() {
    const ctx = this.chart.ctx;
    const width = this.chart.width;
    const height = this.chart.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    const dataset = this.chart.data.datasets[0];
    const gauge = this.parse(dataset.data);

    // Draw background arc
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, (-135 * Math.PI) / 180, (135 * Math.PI) / 180);
    ctx.stroke();

    // Draw value arc
    ctx.strokeStyle = dataset.borderColor || '#0ff';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, (-135 * Math.PI) / 180, (gauge.angle * Math.PI) / 180);
    ctx.stroke();

    // Draw needle
    const needleAngle = (gauge.angle * Math.PI) / 180;
    const needleLength = radius - 20;
    const needleX = centerX + Math.cos(needleAngle) * needleLength;
    const needleY = centerY + Math.sin(needleAngle) * needleLength;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(needleX, needleY);
    ctx.stroke();

    // Draw center circle
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Draw value text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(gauge.value.toFixed(1), centerX, centerY + 60);

    // Draw label
    if (gauge.label) {
      ctx.font = '14px Arial';
      ctx.fillText(gauge.label, centerX, centerY + 90);
    }
  }
}
