/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR CHART RENDERER - PART 2: ADVANCED LINE CHARTS (6)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  COLDWAR_COLORS,
  getChartColor,
  easeOutQuart,
  drawHudGrid,
  drawHudAxes,
} from './ColdWarChartRenderer';

// ═══════════════════════════════════════════════════════════════════════════
// ADVANCED LINE CHARTS (6 charts)
// ═══════════════════════════════════════════════════════════════════════════

export const drawLineInterpolation = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [30, 70, 40, 80, 50, 90, 60];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  // Y-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }

  // Smooth curve with Bezier interpolation
  const easedProgress = easeOutQuart(progress);
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.accent;
  ctx.shadowBlur = 15;
  ctx.beginPath();

  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  for (let i = 0; i < data.length - 1; i++) {
    if ((i + 1) / (data.length - 1) <= easedProgress) {
      const x1 = padding + (i / (data.length - 1)) * chartWidth;
      const y1 = height - padding - 40 - (data[i] / 100) * chartHeight;
      const x2 = padding + ((i + 1) / (data.length - 1)) * chartWidth;
      const y2 = height - padding - 40 - (data[i + 1] / 100) * chartHeight;

      const cpX = (x1 + x2) / 2;
      const cpY = (y1 + y2) / 2;

      if (i === 0) ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cpX, cpY, x2, y2);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Points
  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;

      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.accent;
      ctx.shadowColor = COLDWAR_COLORS.accent;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // X-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawMultiAxisLine = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data1 = [30, 50, 40, 70, 60, 80];
  const data2 = [200, 350, 300, 450, 400, 500];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  // Left Y-axis labels
  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = "9px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }

  // Right Y-axis
  ctx.strokeStyle = COLDWAR_COLORS.secondary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width - padding, padding);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  // Right Y-axis labels
  ctx.fillStyle = COLDWAR_COLORS.secondary;
  ctx.textAlign = 'left';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${600 - i * 100}`, width - padding + 10, y + 4);
  }

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Line 1 (left axis)
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.shadowColor = COLDWAR_COLORS.primary;
  ctx.shadowBlur = 10;
  ctx.beginPath();

  for (let i = 0; i < data1.length; i++) {
    if (i / (data1.length - 1) <= easedProgress) {
      const x = padding + (i / (data1.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data1[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Line 2 (right axis)
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.secondary;
  ctx.lineWidth = 2;
  ctx.shadowColor = COLDWAR_COLORS.secondary;
  ctx.shadowBlur = 10;
  ctx.beginPath();

  for (let i = 0; i < data2.length; i++) {
    if (i / (data2.length - 1) <= easedProgress) {
      const x = padding + (i / (data2.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data2[i] / 600) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  // X-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data1.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawPointStyling = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [40, 60, 50, 75, 65, 85, 70];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const pointStyles = ['circle', 'square', 'triangle', 'star', 'diamond', 'cross', 'circle'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  // Y-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Line
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.warning;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Styled points
  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;
      const size = 8;

      ctx.save();
      ctx.fillStyle = getChartColor(i);
      ctx.strokeStyle = COLDWAR_COLORS.background;
      ctx.lineWidth = 2;

      switch (pointStyles[i]) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        case 'square':
          ctx.fillRect(x - size, y - size, size * 2, size * 2);
          ctx.strokeRect(x - size, y - size, size * 2, size * 2);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(x, y - size);
          ctx.lineTo(x + size, y + size);
          ctx.lineTo(x - size, y + size);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case 'star':
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = j % 2 === 0 ? size : size / 2;
            const px = x + Math.cos(angle) * r;
            const py = y + Math.sin(angle) * r;
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case 'diamond':
          ctx.beginPath();
          ctx.moveTo(x, y - size);
          ctx.lineTo(x + size, y);
          ctx.lineTo(x, y + size);
          ctx.lineTo(x - size, y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case 'cross':
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x - size, y);
          ctx.lineTo(x + size, y);
          ctx.moveTo(x, y - size);
          ctx.lineTo(x, y + size);
          ctx.stroke();
          break;
      }
      ctx.restore();
    }
  }

  // X-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawSegmentStyling = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [30, 60, 40, 80, 50, 70, 90];
  const labels = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  // Y-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Segmented line with different colors
  for (let i = 0; i < data.length - 1; i++) {
    if ((i + 1) / (data.length - 1) <= easedProgress) {
      const x1 = padding + (i / (data.length - 1)) * chartWidth;
      const y1 = height - padding - 40 - (data[i] / 100) * chartHeight;
      const x2 = padding + ((i + 1) / (data.length - 1)) * chartWidth;
      const y2 = height - padding - 40 - (data[i + 1] / 100) * chartHeight;

      ctx.save();
      ctx.strokeStyle = getChartColor(i);
      ctx.lineWidth = 3;
      ctx.shadowColor = getChartColor(i);
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Points
  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;

      ctx.save();
      ctx.fillStyle = getChartColor(i);
      ctx.shadowColor = getChartColor(i);
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // X-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawSteppedLine = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [20, 40, 35, 60, 55, 75, 70];
  const labels = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6', 'Step 7'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  // Y-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Stepped line
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.info;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.info;
  ctx.shadowBlur = 10;
  ctx.beginPath();

  for (let i = 0; i < data.length - 1; i++) {
    if ((i + 1) / (data.length - 1) <= easedProgress) {
      const x1 = padding + (i / (data.length - 1)) * chartWidth;
      const y1 = height - padding - 40 - (data[i] / 100) * chartHeight;
      const x2 = padding + ((i + 1) / (data.length - 1)) * chartWidth;
      const y2 = height - padding - 40 - (data[i + 1] / 100) * chartHeight;

      if (i === 0) ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1); // Horizontal
      ctx.lineTo(x2, y2); // Vertical
    }
  }
  ctx.stroke();
  ctx.restore();

  // Points
  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;

      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.info;
      ctx.shadowColor = COLDWAR_COLORS.info;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // X-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "9px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawLineStyling = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data1 = [30, 50, 40, 70, 60, 80];
  const data2 = [40, 60, 50, 80, 70, 90];
  const data3 = [20, 40, 30, 60, 50, 70];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  // Y-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Line 1 - Solid
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 3;
  ctx.setLineDash([]);
  ctx.beginPath();

  for (let i = 0; i < data1.length; i++) {
    if (i / (data1.length - 1) <= easedProgress) {
      const x = padding + (i / (data1.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data1[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Line 2 - Dashed
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.secondary;
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 5]);
  ctx.beginPath();

  for (let i = 0; i < data2.length; i++) {
    if (i / (data2.length - 1) <= easedProgress) {
      const x = padding + (i / (data2.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data2[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Line 3 - Dotted
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 3;
  ctx.setLineDash([2, 5]);
  ctx.beginPath();

  for (let i = 0; i < data3.length; i++) {
    if (i / (data3.length - 1) <= easedProgress) {
      const x = padding + (i / (data3.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data3[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  // X-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data1.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};
