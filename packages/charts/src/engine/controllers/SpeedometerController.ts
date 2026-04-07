import { ChartController } from './ChartController';

/**
 * Speedometer Chart Controller
 * سرعت‌سنج برای نمایش سرعت یا کارایی
 */
export class SpeedometerController extends ChartController {
  id = 'speedometer';
  type = 'speedometer';

  /**
   * Parse speedometer data
   * داده‌های Speedometer را پردازش می‌کند
   */
  parse(data: any) {
    const { value = 0, min = 0, max = 100, label = '', zones = [] } = data;
    const normalized = (value - min) / (max - min);

    return {
      value,
      min,
      max,
      normalized: Math.max(0, Math.min(1, normalized)),
      label,
      zones: zones.length > 0 ? zones : this.getDefaultZones(),
      angle: normalized * 270 - 135,
    };
  }

  /**
   * Get default zones (Red, Yellow, Green)
   */
  private getDefaultZones() {
    return [
      { start: 0, end: 0.33, color: '#f00', label: 'Low' },
      { start: 0.33, end: 0.66, color: '#ff0', label: 'Medium' },
      { start: 0.66, end: 1, color: '#0f0', label: 'High' },
    ];
  }

  /**
   * Update speedometer chart
   */
  update(mode: string) {
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    const speedometer = this.parse(dataset.data);
    meta.data = [speedometer];

    super.update(mode);
  }

  /**
   * Draw speedometer chart
   */
  draw() {
    const ctx = this.chart.ctx;
    const width = this.chart.width;
    const height = this.chart.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    const dataset = this.chart.data.datasets[0];
    const speedometer = this.parse(dataset.data);

    // Draw zones
    speedometer.zones.forEach((zone: any) => {
      const startAngle = -135 + zone.start * 270;
      const endAngle = -135 + zone.end * 270;

      ctx.strokeStyle = zone.color;
      ctx.lineWidth = 30;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, (startAngle * Math.PI) / 180, (endAngle * Math.PI) / 180);
      ctx.stroke();
    });

    // Draw scale marks
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 10; i++) {
      const angle = -135 + (i / 10) * 270;
      const rad = (angle * Math.PI) / 180;
      const x1 = centerX + Math.cos(rad) * (radius - 10);
      const y1 = centerY + Math.sin(rad) * (radius - 10);
      const x2 = centerX + Math.cos(rad) * (radius + 10);
      const y2 = centerY + Math.sin(rad) * (radius + 10);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw needle
    const needleAngle = (speedometer.angle * Math.PI) / 180;
    const needleLength = radius - 20;
    const needleX = centerX + Math.cos(needleAngle) * needleLength;
    const needleY = centerY + Math.sin(needleAngle) * needleLength;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(needleX, needleY);
    ctx.stroke();

    // Draw center circle
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
    ctx.fill();

    // Draw value text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(speedometer.value.toFixed(1), centerX, centerY + 70);

    // Draw label
    if (speedometer.label) {
      ctx.font = '14px Arial';
      ctx.fillText(speedometer.label, centerX, centerY + 100);
    }
  }
}
