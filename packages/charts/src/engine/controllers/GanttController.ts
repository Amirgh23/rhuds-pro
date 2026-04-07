import { ChartController } from './ChartController';

/**
 * Gantt Chart Controller
 * نمودار زمانی برای مدیریت پروژه
 */
export class GanttController extends ChartController {
  id = 'gantt';
  type = 'gantt';

  /**
   * Parse gantt data
   * داده‌های Gantt را پردازش می‌کند
   * Format: [{ name, start, end, progress }, ...]
   */
  parse(data: any[]) {
    const padding = 40;
    const rowHeight = 30;
    const height = this.chart.height;
    const width = this.chart.width;

    // Find min and max dates
    let minDate = Infinity;
    let maxDate = -Infinity;

    data.forEach((task) => {
      const start = new Date(task.start).getTime();
      const end = new Date(task.end).getTime();
      minDate = Math.min(minDate, start);
      maxDate = Math.max(maxDate, end);
    });

    const timeRange = maxDate - minDate;
    const chartWidth = width - 2 * padding;

    return data.map((task, index) => {
      const start = new Date(task.start).getTime();
      const end = new Date(task.end).getTime();

      const x = padding + ((start - minDate) / timeRange) * chartWidth;
      const taskWidth = ((end - start) / timeRange) * chartWidth;
      const y = padding + index * rowHeight;

      return {
        name: task.name,
        x,
        y,
        width: taskWidth,
        height: rowHeight - 5,
        progress: task.progress || 0,
        start: new Date(task.start),
        end: new Date(task.end),
      };
    });
  }

  /**
   * Update gantt chart
   */
  update(mode: string) {
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();

    const tasks = this.parse(dataset.data as any[]);
    meta.data = tasks;

    super.update(mode);
  }

  /**
   * Draw gantt chart
   */
  draw() {
    const ctx = this.chart.ctx;
    const dataset = this.chart.data.datasets[0];
    const meta = this.getMeta();
    const padding = 40;

    // Draw task bars
    meta.data.forEach((task: any, index: number) => {
      // Draw background
      ctx.fillStyle = '#333';
      ctx.fillRect(task.x, task.y, task.width, task.height);

      // Draw progress
      ctx.fillStyle = dataset.backgroundColor || '#0f0';
      ctx.fillRect(task.x, task.y, task.width * task.progress, task.height);

      // Draw border
      ctx.strokeStyle = dataset.borderColor || '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(task.x, task.y, task.width, task.height);

      // Draw task name
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(task.name, padding - 10, task.y + task.height / 2);

      // Draw dates
      ctx.font = '10px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(task.start.toLocaleDateString(), task.x + 5, task.y + task.height + 15);
    });
  }
}
