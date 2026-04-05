/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR CHART RENDERER - COMPLETE IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 * تمام 75+ چارت با استایل واقعی Call of Duty: Cold War HUD
 */

import { COLD_WAR_HUD_COLORS } from '@rhuds/core';

// Cold War Color Palette
export const COLDWAR_COLORS = {
  primary: COLD_WAR_HUD_COLORS.MENU_YELLOW.hex,
  secondary: COLD_WAR_HUD_COLORS.TECH_GREEN.hex,
  accent: COLD_WAR_HUD_COLORS.BLUE.hex,
  danger: COLD_WAR_HUD_COLORS.RED.hex,
  success: COLD_WAR_HUD_COLORS.GREEN.hex,
  warning: COLD_WAR_HUD_COLORS.ORANGE.hex,
  info: COLD_WAR_HUD_COLORS.PURPLE.hex,
  background: 'rgba(10, 10, 12, 0.95)',
  grid: 'rgba(240, 160, 0, 0.15)',
  text: COLD_WAR_HUD_COLORS.MENU_YELLOW.hex,
};

// Chart Color Palette
export const CHART_PALETTE = [
  COLD_WAR_HUD_COLORS.MENU_YELLOW.hex,
  COLD_WAR_HUD_COLORS.TECH_GREEN.hex,
  COLD_WAR_HUD_COLORS.BLUE.hex,
  COLD_WAR_HUD_COLORS.RED.hex,
  COLD_WAR_HUD_COLORS.ORANGE.hex,
  COLD_WAR_HUD_COLORS.GREEN.hex,
  COLD_WAR_HUD_COLORS.PURPLE.hex,
  COLD_WAR_HUD_COLORS.GOLD.hex,
];

export const getChartColor = (index: number): string => {
  return CHART_PALETTE[index % CHART_PALETTE.length];
};

// Easing Functions
export const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  else return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

// Helper Functions
export const drawHudGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: number
): void => {
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.grid;
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);

  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Horizontal lines
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * chartHeight) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Vertical lines
  for (let i = 0; i <= 5; i++) {
    const x = padding + (i * chartWidth) / 5;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding - 40);
    ctx.stroke();
  }

  ctx.restore();
};

export const drawHudAxes = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: number
): void => {
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;

  // Y axis
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 40);
  ctx.stroke();

  // X axis
  ctx.beginPath();
  ctx.moveTo(padding, height - padding - 40);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  ctx.restore();
};

// ═══════════════════════════════════════════════════════════════════════════
// BASIC CHARTS (8 charts)
// ═══════════════════════════════════════════════════════════════════════════

export const drawLineChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [65, 59, 80, 81, 56, 55, 70];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  // Background
  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid
  drawHudGrid(ctx, width, height, padding);

  // Axes
  drawHudAxes(ctx, width, height, padding);

  // Y-axis labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }

  // X-axis labels
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (labels.length - 1)) * (width - 2 * padding);
    ctx.fillText(labels[i], x, height - padding - 20);
  }

  // Line with glow
  const easedProgress = easeOutQuart(progress);
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.primary;
  ctx.shadowBlur = 10;
  ctx.beginPath();

  for (let i = 0; i < data.length; i++) {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 40);

    if (i / (data.length - 1) <= easedProgress) {
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Points with glow
  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 40);

      // Outer glow
      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.primary;
      ctx.shadowColor = COLDWAR_COLORS.primary;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Inner point
      ctx.fillStyle = COLDWAR_COLORS.background;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

export const drawBarChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const data = [45, 55, 60, 70, 50, 65, 75];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 40);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  // Bars
  const barWidth = ((width - 2 * padding) / data.length) * 0.7;
  for (let i = 0; i < data.length; i++) {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);

    const x =
      padding +
      (i * (width - 2 * padding)) / data.length +
      (width - 2 * padding) / data.length / 2 -
      barWidth / 2;
    const barHeight = (data[i] / 100) * (height - 2 * padding - 40) * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, COLDWAR_COLORS.primary);
    gradient.addColorStop(1, `${COLDWAR_COLORS.primary}66`);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = COLDWAR_COLORS.primary;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);
  }

  // Labels
  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x =
      padding + (i * (width - 2 * padding)) / data.length + (width - 2 * padding) / data.length / 2;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawPieChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;

  const data = [30, 25, 20, 25];
  const colors = [
    COLDWAR_COLORS.primary,
    COLDWAR_COLORS.secondary,
    COLDWAR_COLORS.accent,
    COLDWAR_COLORS.danger,
  ];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  const easedProgress = easeOutQuart(progress);
  let startAngle = -Math.PI / 2;
  const total = data.reduce((a, b) => a + b, 0);

  data.forEach((value, i) => {
    const sliceAngle = (value / total) * Math.PI * 2 * easedProgress;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `${colors[i]}88`);
    gradient.addColorStop(1, colors[i]);

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = COLDWAR_COLORS.background;
    ctx.lineWidth = 2;
    ctx.stroke();

    startAngle = endAngle;
  });
};

export const drawRadarChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;

  const data = [65, 59, 90, 81, 56, 75];
  const labels = ['Speed', 'Strength', 'Defense', 'Attack', 'Magic', 'HP'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid circles
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}44`;
  for (let i = 0; i < labels.length; i++) {
    const angle = (i * Math.PI * 2) / labels.length - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
    ctx.stroke();
  }

  // Data polygon
  const easedProgress = easeOutQuart(progress);
  ctx.fillStyle = `${COLDWAR_COLORS.primary}33`;
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < data.length; i++) {
    const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
    const r = (data[i] / 100) * radius * easedProgress;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Points
  for (let i = 0; i < data.length; i++) {
    const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
    const r = (data[i] / 100) * radius * easedProgress;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;

    ctx.fillStyle = COLDWAR_COLORS.primary;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Labels
  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const angle = (i * Math.PI * 2) / labels.length - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (radius + 25);
    const y = centerY + Math.sin(angle) * (radius + 25);
    ctx.fillText(labels[i], x, y);
  }
};

export const drawBubbleChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 40);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  // Bubbles
  const bubbles = [
    { x: 20, y: 30, r: 15, color: COLDWAR_COLORS.primary },
    { x: 40, y: 50, r: 20, color: COLDWAR_COLORS.secondary },
    { x: 60, y: 40, r: 18, color: COLDWAR_COLORS.accent },
    { x: 80, y: 70, r: 22, color: COLDWAR_COLORS.danger },
  ];

  const easedProgress = easeOutQuart(progress);

  bubbles.forEach((bubble, i) => {
    const delay = i * 0.15;
    const bubbleProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBubbleProgress = easeOutQuart(bubbleProgress);

    const x = padding + (bubble.x / 100) * (width - 2 * padding);
    const y = height - padding - 40 - (bubble.y / 100) * (height - 2 * padding - 40);
    const size = bubble.r * easedBubbleProgress;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, `${bubble.color}88`);
    gradient.addColorStop(1, `${bubble.color}33`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = bubble.color;
    ctx.lineWidth = 1;
    ctx.stroke();
  });
};

export const drawAreaChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const data = [30, 50, 45, 70, 60, 80, 75];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 40);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  // Area
  const easedProgress = easeOutQuart(progress);
  ctx.fillStyle = `${COLDWAR_COLORS.primary}33`;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding - 40);

  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 40);
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    }
  }

  ctx.lineTo(padding + Math.min(easedProgress, 1) * (width - 2 * padding), height - padding - 40);
  ctx.closePath();
  ctx.fill();

  // Line
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 40);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Labels
  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawDoughnutChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 3;
  const innerRadius = outerRadius * 0.6;

  const data = [30, 25, 20, 25];
  const colors = [
    COLDWAR_COLORS.primary,
    COLDWAR_COLORS.secondary,
    COLDWAR_COLORS.accent,
    COLDWAR_COLORS.danger,
  ];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  const easedProgress = easeOutQuart(progress);
  let startAngle = -Math.PI / 2;
  const total = data.reduce((a, b) => a + b, 0);

  data.forEach((value, i) => {
    const sliceAngle = (value / total) * Math.PI * 2 * easedProgress;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      innerRadius,
      centerX,
      centerY,
      outerRadius
    );
    gradient.addColorStop(0, `${colors[i]}88`);
    gradient.addColorStop(1, colors[i]);

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = COLDWAR_COLORS.background;
    ctx.lineWidth = 2;
    ctx.stroke();

    startAngle = endAngle;
  });
};

export const drawScatterChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 40);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  // Points
  const points = [
    { x: 20, y: 30, color: COLDWAR_COLORS.primary },
    { x: 40, y: 50, color: COLDWAR_COLORS.secondary },
    { x: 60, y: 40, color: COLDWAR_COLORS.accent },
    { x: 80, y: 70, color: COLDWAR_COLORS.danger },
    { x: 30, y: 60, color: COLDWAR_COLORS.success },
    { x: 70, y: 35, color: COLDWAR_COLORS.warning },
  ];

  const easedProgress = easeOutQuart(progress);

  points.forEach((point, i) => {
    const delay = i * 0.1;
    const pointProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedPointProgress = easeOutQuart(pointProgress);

    const x = padding + (point.x / 100) * (width - 2 * padding);
    const y = height - padding - 40 - (point.y / 100) * (height - 2 * padding - 40);
    const size = 6 * easedPointProgress;

    ctx.fillStyle = point.color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = COLDWAR_COLORS.background;
    ctx.lineWidth = 1;
    ctx.stroke();
  });
};

export const drawComboChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const barData = [45, 55, 60, 70, 50, 65];
  const lineData = [65, 59, 80, 81, 56, 75];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 40);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  // Bars
  const barWidth = ((width - 2 * padding) / barData.length) * 0.5;
  for (let i = 0; i < barData.length; i++) {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);

    const x =
      padding +
      (i * (width - 2 * padding)) / barData.length +
      (width - 2 * padding) / barData.length / 2 -
      barWidth / 2;
    const barHeight = (barData[i] / 100) * (height - 2 * padding - 40) * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    ctx.fillStyle = `${COLDWAR_COLORS.secondary}66`;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = COLDWAR_COLORS.secondary;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);
  }

  // Line
  const easedProgress = easeOutQuart(progress);
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < lineData.length; i++) {
    if (i / (lineData.length - 1) <= easedProgress) {
      const x = padding + (i / (lineData.length - 1)) * (width - 2 * padding);
      const y = height - padding - 40 - (lineData[i] / 100) * (height - 2 * padding - 40);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Labels
  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (barData.length - 1)) * (width - 2 * padding);
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawStackedBarChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const data1 = [20, 25, 30, 35, 25, 30];
  const data2 = [15, 20, 25, 20, 30, 25];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 40);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  // Stacked bars
  const barWidth = ((width - 2 * padding) / data1.length) * 0.7;
  for (let i = 0; i < data1.length; i++) {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);

    const x =
      padding +
      (i * (width - 2 * padding)) / data1.length +
      (width - 2 * padding) / data1.length / 2 -
      barWidth / 2;
    const height1 = (data1[i] / 100) * (height - 2 * padding - 40) * easedBarProgress;
    const height2 = (data2[i] / 100) * (height - 2 * padding - 40) * easedBarProgress;

    const y1 = height - padding - 40 - height1;
    ctx.fillStyle = COLDWAR_COLORS.secondary;
    ctx.fillRect(x, y1, barWidth, height1);

    const y2 = y1 - height2;
    ctx.fillStyle = COLDWAR_COLORS.accent;
    ctx.fillRect(x, y2, barWidth, height2);

    ctx.strokeStyle = COLDWAR_COLORS.primary;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y2, barWidth, height1 + height2);
  }

  // Labels
  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x =
      padding +
      (i * (width - 2 * padding)) / data1.length +
      (width - 2 * padding) / data1.length / 2;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawStackedLineChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const data1 = [30, 40, 35, 50, 45, 60];
  const data2 = [20, 25, 30, 25, 35, 30];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 40);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  const easedProgress = easeOutQuart(progress);

  // Area 1
  ctx.fillStyle = `${COLDWAR_COLORS.secondary}33`;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding - 40);
  for (let i = 0; i < data1.length; i++) {
    if (i / (data1.length - 1) <= easedProgress) {
      const x = padding + (i / (data1.length - 1)) * (width - 2 * padding);
      const y = height - padding - 40 - (data1[i] / 100) * (height - 2 * padding - 40);
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.lineTo(padding + Math.min(easedProgress, 1) * (width - 2 * padding), height - padding - 40);
  ctx.closePath();
  ctx.fill();

  // Area 2
  ctx.fillStyle = `${COLDWAR_COLORS.accent}33`;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding - 40);
  for (let i = 0; i < data2.length; i++) {
    if (i / (data2.length - 1) <= easedProgress) {
      const x = padding + (i / (data2.length - 1)) * (width - 2 * padding);
      const y = height - padding - 40 - ((data1[i] + data2[i]) / 100) * (height - 2 * padding - 40);
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.lineTo(padding + Math.min(easedProgress, 1) * (width - 2 * padding), height - padding - 40);
  ctx.closePath();
  ctx.fill();

  // Labels
  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data1.length - 1)) * (width - 2 * padding);
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawPolarChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 3;

  const data = [65, 59, 90, 81, 56, 75];
  const colors = [
    COLDWAR_COLORS.primary,
    COLDWAR_COLORS.secondary,
    COLDWAR_COLORS.accent,
    COLDWAR_COLORS.danger,
    COLDWAR_COLORS.success,
    COLDWAR_COLORS.warning,
  ];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid circles
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (maxRadius / 5) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  const easedProgress = easeOutQuart(progress);
  let startAngle = -Math.PI / 2;
  const angleStep = (Math.PI * 2) / data.length;

  data.forEach((value, i) => {
    const delay = i * 0.1;
    const segmentProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedSegmentProgress = easeOutQuart(segmentProgress);

    const radius = (value / 100) * maxRadius * easedSegmentProgress;
    const endAngle = startAngle + angleStep;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `${colors[i]}33`);
    gradient.addColorStop(1, `${colors[i]}FF`);

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 1;
    ctx.stroke();

    startAngle = endAngle;
  });
};

export const drawHorizontalBarChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const data = [45, 55, 60, 70, 50, 65];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const x = padding + (i * (width - 2 * padding - 40)) / 5;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding + (width - 2 * padding - 40), padding);
  ctx.lineTo(padding + (width - 2 * padding - 40), height - padding);
  ctx.stroke();

  // Bars
  const barHeight = ((height - 2 * padding) / data.length) * 0.7;
  for (let i = 0; i < data.length; i++) {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);

    const y =
      padding +
      (i * (height - 2 * padding)) / data.length +
      (height - 2 * padding) / data.length / 2 -
      barHeight / 2;
    const barWidth = (data[i] / 100) * (width - 2 * padding - 40) * easedBarProgress;
    const x = padding;

    const gradient = ctx.createLinearGradient(x, y, x + barWidth, y);
    gradient.addColorStop(0, COLDWAR_COLORS.primary);
    gradient.addColorStop(1, `${COLDWAR_COLORS.primary}66`);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = COLDWAR_COLORS.primary;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);
  }

  // Labels
  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = '11px monospace';
  ctx.textAlign = 'right';
  for (let i = 0; i < labels.length; i++) {
    const y =
      padding +
      (i * (height - 2 * padding)) / data.length +
      (height - 2 * padding) / data.length / 2 +
      4;
    ctx.fillText(labels[i], padding - 10, y);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ADVANCED BAR CHARTS (5 charts)
// ═══════════════════════════════════════════════════════════════════════════

export const drawBarBorderRadius = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [45, 55, 60, 70, 50, 65, 75];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;
  const borderRadius = 8;

  data.forEach((value, i) => {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);

    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    // Rounded rectangle
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + borderRadius, y);
    ctx.lineTo(x + barWidth - borderRadius, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + borderRadius);
    ctx.lineTo(x + barWidth, y + barHeight);
    ctx.lineTo(x, y + barHeight);
    ctx.lineTo(x, y + borderRadius);
    ctx.quadraticCurveTo(x, y, x + borderRadius, y);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, getChartColor(i));
    gradient.addColorStop(1, `${getChartColor(i)}66`);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = getChartColor(i);
    ctx.lineWidth = 2;
    ctx.shadowColor = getChartColor(i);
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();

    // Label
    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - padding - 20);
  });
};

export const drawFloatingBars = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [
    { start: 20, end: 45 },
    { start: 30, end: 55 },
    { start: 25, end: 60 },
    { start: 35, end: 70 },
    { start: 15, end: 50 },
    { start: 40, end: 65 },
  ];
  const labels = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];

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

  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.6;

  data.forEach((value, i) => {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);

    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const yStart = height - padding - 40 - (value.start / 100) * chartHeight;
    const yEnd = height - padding - 40 - (value.end / 100) * chartHeight;
    const barHeight = (yStart - yEnd) * easedBarProgress;

    const gradient = ctx.createLinearGradient(x, yEnd, x, yStart);
    gradient.addColorStop(0, getChartColor(i));
    gradient.addColorStop(1, `${getChartColor(i)}88`);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, yStart - barHeight, barWidth, barHeight);

    ctx.save();
    ctx.strokeStyle = getChartColor(i);
    ctx.lineWidth = 2;
    ctx.shadowColor = getChartColor(i);
    ctx.shadowBlur = 10;
    ctx.strokeRect(x, yStart - barHeight, barWidth, barHeight);
    ctx.restore();

    // Label
    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - padding - 20);
  });
};

export const drawStackedGroupedBar = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = {
    group1: [
      [20, 15],
      [25, 20],
      [30, 25],
    ],
    group2: [
      [15, 20],
      [20, 25],
      [25, 30],
    ],
  };
  const labels = ['Jan', 'Feb', 'Mar'];

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

  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const groupWidth = chartWidth / labels.length;
  const barWidth = groupWidth / 3;

  labels.forEach((label, i) => {
    const delay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);

    // Group 1
    const x1 = padding + i * groupWidth + barWidth * 0.2;
    const stack1 = data.group1[i];
    let y1 = height - padding - 40;

    stack1.forEach((value, stackIndex) => {
      const barHeight = (value / 100) * chartHeight * easedBarProgress;
      y1 -= barHeight;

      ctx.fillStyle = stackIndex === 0 ? COLDWAR_COLORS.primary : COLDWAR_COLORS.secondary;
      ctx.fillRect(x1, y1, barWidth, barHeight);

      ctx.strokeStyle = COLDWAR_COLORS.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(x1, y1, barWidth, barHeight);
    });

    // Group 2
    const x2 = padding + i * groupWidth + barWidth * 1.4;
    const stack2 = data.group2[i];
    let y2 = height - padding - 40;

    stack2.forEach((value, stackIndex) => {
      const barHeight = (value / 100) * chartHeight * easedBarProgress;
      y2 -= barHeight;

      ctx.fillStyle = stackIndex === 0 ? COLDWAR_COLORS.accent : COLDWAR_COLORS.warning;
      ctx.fillRect(x2, y2, barWidth, barHeight);

      ctx.strokeStyle = COLDWAR_COLORS.text;
      ctx.lineWidth = 1;
      ctx.strokeRect(x2, y2, barWidth, barHeight);
    });

    // Label
    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(label, padding + i * groupWidth + groupWidth / 2, height - padding - 20);
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// ADVANCED LINE CHARTS (6 charts) - UNIQUE IMPLEMENTATIONS
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

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.accent;
  ctx.shadowBlur = 15;
  ctx.beginPath();

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

  ctx.fillStyle = COLDWAR_COLORS.text;
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

  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = "9px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }

  ctx.strokeStyle = COLDWAR_COLORS.secondary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width - padding, padding);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  ctx.fillStyle = COLDWAR_COLORS.secondary;
  ctx.textAlign = 'left';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${600 - i * 100}`, width - padding + 10, y + 4);
  }

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

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

  ctx.fillStyle = COLDWAR_COLORS.text;
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

  ctx.fillStyle = COLDWAR_COLORS.text;
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
      ctx.lineTo(x2, y1);
      ctx.lineTo(x2, y2);
    }
  }
  ctx.stroke();
  ctx.restore();

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

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data1.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// COMBO CHARTS (7 charts) - UNIQUE IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const drawComboBarLine = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const barData = [30, 45, 40, 60, 50, 70];
  const lineData = [50, 65, 55, 80, 70, 90];
  const labels = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / barData.length) * 0.6;

  for (let i = 0; i < barData.length; i++) {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x =
      padding + (i * chartWidth) / barData.length + (chartWidth / barData.length - barWidth) / 2;
    const barHeight = (barData[i] / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    ctx.fillStyle = `${COLDWAR_COLORS.warning}88`;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = COLDWAR_COLORS.warning;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
  }

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.accent;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  for (let i = 0; i < lineData.length; i++) {
    if (i / (lineData.length - 1) <= easedProgress) {
      const x = padding + (i / (lineData.length - 1)) * chartWidth;
      const y = height - padding - 40 - (lineData[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (barData.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawMultiSeriesPie = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 3;
  const innerRadius = outerRadius * 0.5;

  const innerData = [25, 35, 40];
  const outerData = [20, 30, 25, 25];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  const easedProgress = easeOutQuart(progress);

  // Inner pie
  let startAngle = -Math.PI / 2;
  const innerTotal = innerData.reduce((a, b) => a + b, 0);
  innerData.forEach((value, i) => {
    const sliceAngle = (value / innerTotal) * Math.PI * 2 * easedProgress;
    const endAngle = startAngle + sliceAngle;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = getChartColor(i);
    ctx.fill();
    ctx.strokeStyle = COLDWAR_COLORS.background;
    ctx.lineWidth = 3;
    ctx.stroke();
    startAngle = endAngle;
  });

  // Outer pie
  startAngle = -Math.PI / 2;
  const outerTotal = outerData.reduce((a, b) => a + b, 0);
  outerData.forEach((value, i) => {
    const sliceAngle = (value / outerTotal) * Math.PI * 2 * easedProgress;
    const endAngle = startAngle + sliceAngle;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius + 5, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = `${getChartColor(i + 3)}AA`;
    ctx.fill();
    ctx.strokeStyle = COLDWAR_COLORS.background;
    ctx.lineWidth = 2;
    ctx.stroke();
    startAngle = endAngle;
  });
};

export const drawPolarArea = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 3;
  const data = [50, 70, 60, 85, 75, 90];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  const easedProgress = easeOutQuart(progress);
  const angleStep = (Math.PI * 2) / data.length;
  let startAngle = -Math.PI / 2;

  data.forEach((value, i) => {
    const delay = i * 0.1;
    const segmentProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedSegmentProgress = easeOutQuart(segmentProgress);
    const radius = (value / 100) * maxRadius * easedSegmentProgress;
    const endAngle = startAngle + angleStep;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `${getChartColor(i)}66`);
    gradient.addColorStop(1, getChartColor(i));

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = COLDWAR_COLORS.background;
    ctx.lineWidth = 2;
    ctx.stroke();

    startAngle = endAngle;
  });
};

export const drawPolarAreaCentered = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 3;
  const minRadius = maxRadius * 0.3;
  const data = [60, 80, 70, 90, 75, 85];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  const easedProgress = easeOutQuart(progress);
  const angleStep = (Math.PI * 2) / data.length;
  let startAngle = -Math.PI / 2;

  data.forEach((value, i) => {
    const delay = i * 0.1;
    const segmentProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedSegmentProgress = easeOutQuart(segmentProgress);
    const radius = minRadius + (value / 100) * (maxRadius - minRadius) * easedSegmentProgress;
    const endAngle = startAngle + angleStep;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.arc(centerX, centerY, minRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = `${getChartColor(i)}CC`;
    ctx.fill();
    ctx.strokeStyle = COLDWAR_COLORS.text;
    ctx.lineWidth = 1;
    ctx.stroke();

    startAngle = endAngle;
  });
};

export const drawRadarSkipPoints = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;
  const data = [65, null, 90, 81, null, 75, 85];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  const easedProgress = easeOutQuart(progress);
  ctx.fillStyle = `${COLDWAR_COLORS.danger}33`;
  ctx.strokeStyle = COLDWAR_COLORS.danger;
  ctx.lineWidth = 2;
  ctx.beginPath();

  let firstPoint = true;
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== null && i / (data.length - 1) <= easedProgress) {
      const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
      const r = (data[i]! / 100) * radius;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  for (let i = 0; i < data.length; i++) {
    if (data[i] !== null && i / (data.length - 1) <= easedProgress) {
      const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
      const r = (data[i]! / 100) * radius;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      ctx.fillStyle = COLDWAR_COLORS.danger;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

export const drawScatterMultiAxis = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const points1 = [
    { x: 20, y: 30 },
    { x: 40, y: 50 },
    { x: 60, y: 40 },
  ];
  const points2 = [
    { x: 30, y: 200 },
    { x: 50, y: 350 },
    { x: 70, y: 300 },
  ];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = "9px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }

  ctx.strokeStyle = COLDWAR_COLORS.secondary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width - padding, padding);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  ctx.fillStyle = COLDWAR_COLORS.secondary;
  ctx.textAlign = 'left';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${500 - i * 100}`, width - padding + 10, y + 4);
  }

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  points1.forEach((point, i) => {
    const delay = i * 0.15;
    const pointProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    if (pointProgress > 0) {
      const x = padding + (point.x / 100) * chartWidth;
      const y = height - padding - 40 - (point.y / 100) * chartHeight;
      const size = 8 * easeOutQuart(pointProgress);
      ctx.fillStyle = COLDWAR_COLORS.primary;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  points2.forEach((point, i) => {
    const delay = i * 0.15 + 0.3;
    const pointProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    if (pointProgress > 0) {
      const x = padding + (point.x / 100) * chartWidth;
      const y = height - padding - 40 - (point.y / 500) * chartHeight;
      const size = 8 * easeOutQuart(pointProgress);
      ctx.fillStyle = COLDWAR_COLORS.secondary;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  });
};

export const drawStackedBarLine = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const bar1 = [20, 25, 30, 35];
  const bar2 = [15, 20, 25, 20];
  const lineData = [50, 65, 75, 80];
  const labels = ['Q1', 'Q2', 'Q3', 'Q4'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / bar1.length) * 0.6;

  for (let i = 0; i < bar1.length; i++) {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x = padding + (i * chartWidth) / bar1.length + (chartWidth / bar1.length - barWidth) / 2;
    const height1 = (bar1[i] / 100) * chartHeight * easedBarProgress;
    const height2 = (bar2[i] / 100) * chartHeight * easedBarProgress;
    const y1 = height - padding - 40 - height1;
    ctx.fillStyle = COLDWAR_COLORS.secondary;
    ctx.fillRect(x, y1, barWidth, height1);
    const y2 = y1 - height2;
    ctx.fillStyle = COLDWAR_COLORS.accent;
    ctx.fillRect(x, y2, barWidth, height2);
  }

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.primary;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  for (let i = 0; i < lineData.length; i++) {
    if (i / (lineData.length - 1) <= easedProgress) {
      const x = padding + (i / (lineData.length - 1)) * chartWidth;
      const y = height - padding - 40 - (lineData[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (bar1.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// AREA CHARTS (5 charts) - UNIQUE IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const drawLineBoundaries = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [50, 60, 55, 70, 65, 80];
  const upperBound = [70, 80, 75, 90, 85, 95];
  const lowerBound = [30, 40, 35, 50, 45, 60];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Boundary area
  ctx.fillStyle = `${COLDWAR_COLORS.accent}22`;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding - 40 - (lowerBound[0] / 100) * chartHeight);
  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (lowerBound[i] / 100) * chartHeight;
      ctx.lineTo(x, y);
    }
  }
  for (let i = data.length - 1; i >= 0; i--) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (upperBound[i] / 100) * chartHeight;
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();

  // Main line
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.accent;
  ctx.shadowBlur = 15;
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

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawLineMultipleDatasets = (canvas: HTMLCanvasElement, progress: number = 1): void => {
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

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  const datasets = [
    { data: data1, color: COLDWAR_COLORS.primary },
    { data: data2, color: COLDWAR_COLORS.secondary },
    { data: data3, color: COLDWAR_COLORS.accent },
  ];

  datasets.forEach((dataset, idx) => {
    ctx.fillStyle = `${dataset.color}22`;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - 40);
    for (let i = 0; i < dataset.data.length; i++) {
      if (i / (dataset.data.length - 1) <= easedProgress) {
        const x = padding + (i / (dataset.data.length - 1)) * chartWidth;
        const y = height - padding - 40 - (dataset.data[i] / 100) * chartHeight;
        ctx.lineTo(x, y);
      }
    }
    ctx.lineTo(padding + Math.min(easedProgress, 1) * chartWidth, height - padding - 40);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.strokeStyle = dataset.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < dataset.data.length; i++) {
      if (i / (dataset.data.length - 1) <= easedProgress) {
        const x = padding + (i / (dataset.data.length - 1)) * chartWidth;
        const y = height - padding - 40 - (dataset.data[i] / 100) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.restore();
  });

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data1.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawLineTimeAxis = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [45, 55, 50, 70, 65, 80, 75];
  const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

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

  ctx.fillStyle = `${COLDWAR_COLORS.info}33`;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding - 40);
  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;
      ctx.lineTo(x, y);
    }
  }
  ctx.lineTo(padding + Math.min(easedProgress, 1) * chartWidth, height - padding - 40);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.info;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.info;
  ctx.shadowBlur = 15;
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

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "9px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawStackedRadar = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;
  const data1 = [40, 50, 45, 60, 55, 65];
  const data2 = [25, 30, 35, 30, 40, 35];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  const easedProgress = easeOutQuart(progress);

  // First layer
  ctx.fillStyle = `${COLDWAR_COLORS.secondary}44`;
  ctx.strokeStyle = COLDWAR_COLORS.secondary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < data1.length; i++) {
    const angle = (i * Math.PI * 2) / data1.length - Math.PI / 2;
    const r = (data1[i] / 100) * radius * easedProgress;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Second layer (stacked)
  ctx.fillStyle = `${COLDWAR_COLORS.accent}44`;
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < data2.length; i++) {
    const angle = (i * Math.PI * 2) / data2.length - Math.PI / 2;
    const r = ((data1[i] + data2[i]) / 100) * radius * easedProgress;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const angle = (i * Math.PI * 2) / labels.length - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (radius + 25);
    const y = centerY + Math.sin(angle) * (radius + 25);
    ctx.fillText(labels[i], x, y);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// REMAINING CHARTS (43 charts) - EFFICIENT IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// SCALE CHARTS (8 charts) - UNIQUE IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const drawLinearScaleMinMax = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [25, 45, 35, 65, 55, 85];
  const labels = ['Min', 'Low', 'Med', 'High', 'Max', 'Peak'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  // Y-axis with MIN/MAX labels
  ctx.fillStyle = COLDWAR_COLORS.danger;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  ctx.fillText('MAX', padding - 10, padding + 4);
  ctx.fillStyle = COLDWAR_COLORS.success;
  ctx.fillText('MIN', padding - 10, height - padding - 36);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;

  data.forEach((value, i) => {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(
      0,
      value > 70
        ? COLDWAR_COLORS.danger
        : value > 40
          ? COLDWAR_COLORS.warning
          : COLDWAR_COLORS.success
    );
    gradient.addColorStop(
      1,
      `${value > 70 ? COLDWAR_COLORS.danger : value > 40 ? COLDWAR_COLORS.warning : COLDWAR_COLORS.success}66`
    );

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle =
      value > 70
        ? COLDWAR_COLORS.danger
        : value > 40
          ? COLDWAR_COLORS.warning
          : COLDWAR_COLORS.success;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);

    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - padding - 20);
  });
};

export const drawLinearScaleSuggested = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [15, 25, 20, 35, 30, 40];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Suggested scale (0-50 instead of 0-100)
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  drawHudAxes(ctx, width, height, padding);

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(`${50 - i * 10}`, padding - 10, y + 4);
  }

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;

  data.forEach((value, i) => {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const barHeight = (value / 50) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    ctx.fillStyle = `${getChartColor(i)}AA`;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = getChartColor(i);
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);

    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - padding - 20);
  });
};

export const drawLinearScaleStepSize = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [10, 30, 50, 70, 90];
  const labels = ['10', '30', '50', '70', '90'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid with step size of 20
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  drawHudAxes(ctx, width, height, padding);

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
  const barWidth = (chartWidth / data.length) * 0.7;

  data.forEach((value, i) => {
    const delay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, COLDWAR_COLORS.accent);
    gradient.addColorStop(1, `${COLDWAR_COLORS.accent}44`);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = COLDWAR_COLORS.accent;
    ctx.lineWidth = 2;
    ctx.shadowColor = COLDWAR_COLORS.accent;
    ctx.shadowBlur = 10;
    ctx.strokeRect(x, y, barWidth, barHeight);

    ctx.shadowBlur = 0;
    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - padding - 20);
  });
};

export const drawLogScale = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [1, 10, 100, 1000, 10000];
  const labels = ['1', '10', '100', '1K', '10K'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  // Logarithmic scale labels
  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "9px 'Share Tech Mono', monospace";
  ctx.textAlign = 'right';
  const logLabels = ['10K', '1K', '100', '10', '1', '0'];
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 40)) / 5;
    ctx.fillText(logLabels[i], padding - 10, y + 4);
  }

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;

  data.forEach((value, i) => {
    const delay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const logValue = Math.log10(value + 1) / Math.log10(10001);
    const barHeight = logValue * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    ctx.fillStyle = `${COLDWAR_COLORS.info}AA`;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = COLDWAR_COLORS.info;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);

    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - padding - 20);
  });
};

export const drawStackedLinearCategory = (
  canvas: HTMLCanvasElement,
  progress: number = 1
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const categories = ['Cat A', 'Cat B', 'Cat C', 'Cat D'];
  const data1 = [20, 30, 25, 35];
  const data2 = [15, 20, 30, 25];
  const data3 = [10, 15, 20, 15];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

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
  const barWidth = (chartWidth / categories.length) * 0.7;

  categories.forEach((cat, i) => {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x =
      padding +
      (i * chartWidth) / categories.length +
      (chartWidth / categories.length - barWidth) / 2;

    const h1 = (data1[i] / 100) * chartHeight * easedBarProgress;
    const h2 = (data2[i] / 100) * chartHeight * easedBarProgress;
    const h3 = (data3[i] / 100) * chartHeight * easedBarProgress;

    const y1 = height - padding - 40 - h1;
    ctx.fillStyle = COLDWAR_COLORS.primary;
    ctx.fillRect(x, y1, barWidth, h1);

    const y2 = y1 - h2;
    ctx.fillStyle = COLDWAR_COLORS.secondary;
    ctx.fillRect(x, y2, barWidth, h2);

    const y3 = y2 - h3;
    ctx.fillStyle = COLDWAR_COLORS.accent;
    ctx.fillRect(x, y3, barWidth, h3);

    ctx.strokeStyle = COLDWAR_COLORS.text;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y3, barWidth, h1 + h2 + h3);

    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.textAlign = 'center';
    ctx.fillText(cat, x + barWidth / 2, height - padding - 20);
  });
};

export const drawTimeScale = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [30, 45, 40, 60, 55, 70, 65];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

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

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.warning;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.warning;
  ctx.shadowBlur = 15;
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

  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;
      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.warning;
      ctx.shadowColor = COLDWAR_COLORS.warning;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "9px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawTimeScaleMaxSpan = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [40, 50, 45, 65, 60, 75];
  const labels = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

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

  ctx.fillStyle = `${COLDWAR_COLORS.success}33`;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding - 40);
  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;
      ctx.lineTo(x, y);
    }
  }
  ctx.lineTo(padding + Math.min(easedProgress, 1) * chartWidth, height - padding - 40);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.success;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.success;
  ctx.shadowBlur = 15;
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

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawTimeScaleCombo = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const barData = [35, 45, 40, 55];
  const lineData = [50, 65, 60, 75];
  const labels = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / barData.length) * 0.6;

  barData.forEach((value, i) => {
    const delay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x =
      padding + (i * chartWidth) / barData.length + (chartWidth / barData.length - barWidth) / 2;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    ctx.fillStyle = `${COLDWAR_COLORS.secondary}88`;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = COLDWAR_COLORS.secondary;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
  });

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.primary;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  for (let i = 0; i < lineData.length; i++) {
    if (i / (lineData.length - 1) <= easedProgress) {
      const x = padding + (i / (lineData.length - 1)) * chartWidth;
      const y = height - padding - 40 - (lineData[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "9px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (barData.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

//
// SCRIPTABLE CHARTS (6 charts) - UNIQUE IMPLEMENTATIONS
//

export const drawScriptableBar = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [25, 45, 35, 65, 55, 85, 75];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;

  data.forEach((value, i) => {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    // Dynamic color based on value
    const color =
      value > 70
        ? COLDWAR_COLORS.danger
        : value > 50
          ? COLDWAR_COLORS.warning
          : value > 30
            ? COLDWAR_COLORS.success
            : COLDWAR_COLORS.accent;

    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, `${color}44`);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.strokeRect(x, y, barWidth, barHeight);

    ctx.shadowBlur = 0;
    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - padding - 20);
  });
};

export const drawScriptableBubble = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const bubbles = [
    { x: 20, y: 30, value: 50 },
    { x: 40, y: 50, value: 80 },
    { x: 60, y: 40, value: 60 },
    { x: 80, y: 70, value: 90 },
    { x: 30, y: 60, value: 40 },
  ];

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  bubbles.forEach((bubble, i) => {
    const delay = i * 0.15;
    const bubbleProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBubbleProgress = easeOutQuart(bubbleProgress);

    const x = padding + (bubble.x / 100) * chartWidth;
    const y = height - padding - 40 - (bubble.y / 100) * chartHeight;
    const size = (bubble.value / 100) * 25 * easedBubbleProgress;

    const color = getChartColor(i);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, `${color}AA`);
    gradient.addColorStop(1, `${color}22`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.stroke();
  });
};

export const drawScriptableLine = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [30, 50, 40, 70, 60, 80, 75];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Gradient line
  for (let i = 0; i < data.length - 1; i++) {
    if ((i + 1) / (data.length - 1) <= easedProgress) {
      const x1 = padding + (i / (data.length - 1)) * chartWidth;
      const y1 = height - padding - 40 - (data[i] / 100) * chartHeight;
      const x2 = padding + ((i + 1) / (data.length - 1)) * chartWidth;
      const y2 = height - padding - 40 - (data[i + 1] / 100) * chartHeight;

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, getChartColor(i));
      gradient.addColorStop(1, getChartColor(i + 1));

      ctx.save();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }
  }

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

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawScriptablePie = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;

  const data = [30, 25, 20, 15, 10];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  const easedProgress = easeOutQuart(progress);
  let startAngle = -Math.PI / 2;
  const total = data.reduce((a, b) => a + b, 0);

  data.forEach((value, i) => {
    const sliceAngle = (value / total) * Math.PI * 2 * easedProgress;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    // Dynamic color based on index
    const color = getChartColor(i);
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `${color}AA`);
    gradient.addColorStop(1, color);

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = COLDWAR_COLORS.background;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Add glow
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();

    startAngle = endAngle;
  });
};

export const drawScriptablePolar = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 3;

  const data = [60, 75, 55, 85, 70, 90];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (maxRadius / 5) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  const easedProgress = easeOutQuart(progress);
  const angleStep = (Math.PI * 2) / data.length;
  let startAngle = -Math.PI / 2;

  data.forEach((value, i) => {
    const delay = i * 0.1;
    const segmentProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedSegmentProgress = easeOutQuart(segmentProgress);
    const radius = (value / 100) * maxRadius * easedSegmentProgress;
    const endAngle = startAngle + angleStep;

    const color = getChartColor(i);
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `${color}44`);
    gradient.addColorStop(1, color);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.stroke();

    startAngle = endAngle;
  });
};

export const drawScriptableRadar = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;

  const data = [70, 60, 85, 75, 65, 80];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  const easedProgress = easeOutQuart(progress);

  ctx.fillStyle = `${COLDWAR_COLORS.accent}33`;
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < data.length; i++) {
    const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
    const r = (data[i] / 100) * radius * easedProgress;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Pulsing points
  for (let i = 0; i < data.length; i++) {
    const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
    const r = (data[i] / 100) * radius * easedProgress;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;

    const pulseSize = 4 + Math.sin(progress * Math.PI * 4 + i) * 2;
    const color = getChartColor(i);

    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const angle = (i * Math.PI * 2) / labels.length - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (radius + 25);
    const y = centerY + Math.sin(angle) * (radius + 25);
    ctx.fillText(labels[i], x, y);
  }
};
//
// ANIMATION CHARTS (6 charts) - UNIQUE IMPLEMENTATIONS
//

export const drawProgressiveLine = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [30, 50, 40, 70, 60, 80, 75];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Progressive line with trail effect
  for (let i = 0; i < data.length - 1; i++) {
    if ((i + 1) / (data.length - 1) <= easedProgress) {
      const x1 = padding + (i / (data.length - 1)) * chartWidth;
      const y1 = height - padding - 40 - (data[i] / 100) * chartHeight;
      const x2 = padding + ((i + 1) / (data.length - 1)) * chartWidth;
      const y2 = height - padding - 40 - (data[i + 1] / 100) * chartHeight;

      const segmentProgress = Math.min(
        1,
        (easedProgress - i / (data.length - 1)) * (data.length - 1)
      );
      const alpha = 0.3 + segmentProgress * 0.7;

      ctx.save();
      ctx.strokeStyle = `rgba(240, 160, 0, ${alpha})`;
      ctx.lineWidth = 3 + segmentProgress * 2;
      ctx.shadowColor = COLDWAR_COLORS.primary;
      ctx.shadowBlur = 10 + segmentProgress * 10;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;
      const pointProgress = Math.min(
        1,
        (easedProgress - i / (data.length - 1)) * (data.length - 1)
      );
      const size = 4 + pointProgress * 4;

      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.primary;
      ctx.shadowColor = COLDWAR_COLORS.primary;
      ctx.shadowBlur = 15 + pointProgress * 10;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawDelayedBar = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [45, 55, 60, 70, 50, 65, 75];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;

  data.forEach((value, i) => {
    const delay = i * 0.15;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutBounce(barProgress);

    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, getChartColor(i));
    gradient.addColorStop(1, `${getChartColor(i)}44`);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = getChartColor(i);
    ctx.lineWidth = 2;
    ctx.shadowColor = getChartColor(i);
    ctx.shadowBlur = 10 * barProgress;
    ctx.strokeRect(x, y, barWidth, barHeight);

    ctx.shadowBlur = 0;
    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - padding - 20);
  });
};

export const drawLoopAnimation = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [40, 60, 50, 75, 65, 80];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const loopProgress = (progress * 2) % 1;
  const easedProgress = easeInOutCubic(loopProgress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.accent;
  ctx.shadowBlur = 15;
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

  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;
      const pulse = 1 + Math.sin(progress * Math.PI * 4) * 0.3;

      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.accent;
      ctx.shadowColor = COLDWAR_COLORS.accent;
      ctx.shadowBlur = 15 * pulse;
      ctx.beginPath();
      ctx.arc(x, y, 5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawDropAnimation = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [45, 55, 60, 70, 50, 65];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;

  data.forEach((value, i) => {
    const delay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutBounce(barProgress);

    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const dropY = padding + (1 - easedBarProgress) * (chartHeight * 0.3);
    const y = height - padding - 40 - barHeight;

    ctx.save();
    ctx.globalAlpha = barProgress;
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, COLDWAR_COLORS.danger);
    gradient.addColorStop(1, `${COLDWAR_COLORS.danger}66`);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = COLDWAR_COLORS.danger;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
    ctx.restore();

    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - padding - 20);
  });
};

export const drawTensionAnimation = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [30, 50, 40, 70, 60, 80];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const tension = Math.sin(progress * Math.PI) * 0.5;

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.success;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.success;
  ctx.shadowBlur = 15;
  ctx.beginPath();

  for (let i = 0; i < data.length - 1; i++) {
    if ((i + 1) / (data.length - 1) <= easedProgress) {
      const x1 = padding + (i / (data.length - 1)) * chartWidth;
      const y1 = height - padding - 40 - (data[i] / 100) * chartHeight;
      const x2 = padding + ((i + 1) / (data.length - 1)) * chartWidth;
      const y2 = height - padding - 40 - (data[i + 1] / 100) * chartHeight;

      const cpX = (x1 + x2) / 2;
      const cpY = (y1 + y2) / 2 + (y1 - y2) * tension;

      if (i === 0) ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cpX, cpY, x2, y2);
    }
  }
  ctx.stroke();
  ctx.restore();

  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;

      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.success;
      ctx.shadowColor = COLDWAR_COLORS.success;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawEasingShowcase = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [30, 50, 40, 70, 60, 80];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  const easings = [
    { fn: (t: number) => t, color: COLDWAR_COLORS.primary },
    { fn: easeOutQuart, color: COLDWAR_COLORS.secondary },
    { fn: easeInOutCubic, color: COLDWAR_COLORS.accent },
  ];

  easings.forEach((easing, idx) => {
    const easedProgress = easing.fn(progress);

    ctx.save();
    ctx.strokeStyle = easing.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
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
  });

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};
//
// INTERACTION CHARTS (6 charts) - UNIQUE IMPLEMENTATIONS
//

export const drawTooltipCallbacks = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [45, 60, 55, 75, 65, 85];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 3;
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

  // Tooltip indicators
  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;

      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.primary;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Tooltip box
      if (i === Math.floor(data.length * easedProgress) - 1) {
        ctx.fillStyle = 'rgba(10, 10, 12, 0.9)';
        ctx.fillRect(x - 30, y - 40, 60, 30);
        ctx.strokeStyle = COLDWAR_COLORS.primary;
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 30, y - 40, 60, 30);
        ctx.fillStyle = COLDWAR_COLORS.text;
        ctx.font = "9px 'Share Tech Mono', monospace";
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x, y - 28);
        ctx.fillText(`${data[i]}`, x, y - 16);
      }
    }
  }

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawCustomTooltip = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [40, 55, 50, 70, 60, 80];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.accent;
  ctx.shadowBlur = 15;
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

      // Custom styled tooltip
      if (i === Math.floor(data.length * easedProgress) - 1) {
        const tooltipWidth = 70;
        const tooltipHeight = 35;
        const tooltipX = x - tooltipWidth / 2;
        const tooltipY = y - tooltipHeight - 15;

        // Tooltip background with gradient
        const gradient = ctx.createLinearGradient(
          tooltipX,
          tooltipY,
          tooltipX,
          tooltipY + tooltipHeight
        );
        gradient.addColorStop(0, 'rgba(93, 182, 229, 0.2)');
        gradient.addColorStop(1, 'rgba(10, 10, 12, 0.95)');
        ctx.fillStyle = gradient;
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

        // Border
        ctx.strokeStyle = COLDWAR_COLORS.accent;
        ctx.lineWidth = 2;
        ctx.shadowColor = COLDWAR_COLORS.accent;
        ctx.shadowBlur = 10;
        ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

        // Arrow
        ctx.beginPath();
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x - 5, tooltipY + tooltipHeight);
        ctx.lineTo(x + 5, tooltipY + tooltipHeight);
        ctx.closePath();
        ctx.fillStyle = COLDWAR_COLORS.accent;
        ctx.fill();

        // Text
        ctx.shadowBlur = 0;
        ctx.fillStyle = COLDWAR_COLORS.text;
        ctx.font = "bold 10px 'Share Tech Mono', monospace";
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x, tooltipY + 15);
        ctx.font = "9px 'Share Tech Mono', monospace";
        ctx.fillText(`Value: ${data[i]}`, x, tooltipY + 28);
      }
    }
  }

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawPointHitDetection = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const points = [
    { x: 20, y: 30 },
    { x: 40, y: 50 },
    { x: 60, y: 40 },
    { x: 80, y: 70 },
    { x: 30, y: 60 },
    { x: 70, y: 35 },
  ];

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  points.forEach((point, i) => {
    const delay = i * 0.1;
    const pointProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedPointProgress = easeOutQuart(pointProgress);

    if (pointProgress > 0) {
      const x = padding + (point.x / 100) * chartWidth;
      const y = height - padding - 40 - (point.y / 100) * chartHeight;
      const size = 8 * easedPointProgress;

      // Hit detection zone
      ctx.save();
      ctx.fillStyle = `${getChartColor(i)}22`;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Point
      ctx.save();
      ctx.fillStyle = getChartColor(i);
      ctx.shadowColor = getChartColor(i);
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Hit zone border
      ctx.strokeStyle = `${getChartColor(i)}66`;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });
};

export const drawNearestPoint = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const points = [
    { x: 25, y: 35 },
    { x: 45, y: 55 },
    { x: 65, y: 45 },
    { x: 85, y: 75 },
  ];

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const nearestIndex = Math.floor(points.length * easedProgress) - 1;

  points.forEach((point, i) => {
    const delay = i * 0.15;
    const pointProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));

    if (pointProgress > 0) {
      const x = padding + (point.x / 100) * chartWidth;
      const y = height - padding - 40 - (point.y / 100) * chartHeight;
      const isNearest = i === nearestIndex;
      const size = isNearest ? 10 : 6;

      ctx.save();
      ctx.fillStyle = isNearest ? COLDWAR_COLORS.danger : COLDWAR_COLORS.secondary;
      ctx.shadowColor = isNearest ? COLDWAR_COLORS.danger : COLDWAR_COLORS.secondary;
      ctx.shadowBlur = isNearest ? 20 : 10;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (isNearest) {
        ctx.strokeStyle = COLDWAR_COLORS.danger;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Crosshair
        ctx.beginPath();
        ctx.moveTo(x - 15, y);
        ctx.lineTo(x + 15, y);
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x, y + 15);
        ctx.stroke();
      }
    }
  });
};

export const drawAxisMode = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [40, 55, 50, 70, 60, 80];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.warning;
  ctx.lineWidth = 3;
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

  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;

      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.warning;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Axis intersection indicators
      if (i === Math.floor(data.length * easedProgress) - 1) {
        ctx.strokeStyle = `${COLDWAR_COLORS.warning}66`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, height - padding - 40);
        ctx.moveTo(x, y);
        ctx.lineTo(padding, y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawDatasetMode = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data1 = [30, 50, 40, 70, 60];
  const data2 = [40, 60, 50, 80, 70];
  const labels = ['A', 'B', 'C', 'D', 'E'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const activeDataset = Math.floor(progress * 2) % 2;

  const datasets = [
    { data: data1, color: COLDWAR_COLORS.primary },
    { data: data2, color: COLDWAR_COLORS.secondary },
  ];

  datasets.forEach((dataset, idx) => {
    const isActive = idx === activeDataset;
    const alpha = isActive ? 1 : 0.3;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = dataset.color;
    ctx.lineWidth = isActive ? 3 : 2;
    ctx.shadowColor = isActive ? dataset.color : 'transparent';
    ctx.shadowBlur = isActive ? 15 : 0;
    ctx.beginPath();
    for (let i = 0; i < dataset.data.length; i++) {
      if (i / (dataset.data.length - 1) <= easedProgress) {
        const x = padding + (i / (dataset.data.length - 1)) * chartWidth;
        const y = height - padding - 40 - (dataset.data[i] / 100) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.restore();

    for (let i = 0; i < dataset.data.length; i++) {
      if (i / (dataset.data.length - 1) <= easedProgress) {
        const x = padding + (i / (dataset.data.length - 1)) * chartWidth;
        const y = height - padding - 40 - (dataset.data[i] / 100) * chartHeight;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = dataset.color;
        ctx.shadowColor = isActive ? dataset.color : 'transparent';
        ctx.shadowBlur = isActive ? 15 : 0;
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  });

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data1.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};
//
// LEGEND & TITLE CHARTS (6 charts) - UNIQUE IMPLEMENTATIONS
//

export const drawLegendPosition = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [45, 55, 60];
  const labels = ['Series A', 'Series B', 'Series C'];
  const colors = [COLDWAR_COLORS.primary, COLDWAR_COLORS.secondary, COLDWAR_COLORS.accent];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Legend at top
  const legendY = 20;
  const legendX = width / 2 - 150;
  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(legendX + i * 100, legendY, 15, 15);
    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'left';
    ctx.fillText(labels[i], legendX + i * 100 + 20, legendY + 12);
  });

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;

  data.forEach((value, i) => {
    const delay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    ctx.fillStyle = `${colors[i]}AA`;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
  });
};

export const drawLegendAlignment = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [40, 60, 50];
  const labels = ['Alpha', 'Beta', 'Gamma'];
  const colors = [COLDWAR_COLORS.danger, COLDWAR_COLORS.warning, COLDWAR_COLORS.success];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Legend at bottom
  const legendY = height - 25;
  const legendX = width / 2 - 120;
  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(legendX + i * 80, legendY, 12, 12);
    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "9px 'Share Tech Mono', monospace";
    ctx.textAlign = 'left';
    ctx.fillText(labels[i], legendX + i * 80 + 17, legendY + 10);
  });

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 60;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;

  data.forEach((value, i) => {
    const delay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 60 - barHeight;

    ctx.fillStyle = `${colors[i]}AA`;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
  });
};

export const drawLegendEvents = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [50, 65, 55];
  const labels = ['Data 1', 'Data 2', 'Data 3'];
  const colors = [COLDWAR_COLORS.primary, COLDWAR_COLORS.accent, COLDWAR_COLORS.info];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Interactive legend with hover effect
  const legendY = 20;
  const legendX = width / 2 - 140;
  const activeIndex = Math.floor(progress * 3) % 3;

  colors.forEach((color, i) => {
    const isActive = i === activeIndex;
    const alpha = isActive ? 1 : 0.5;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(legendX + i * 95, legendY, 15, 15);

    if (isActive) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(legendX + i * 95 - 2, legendY - 2, 19, 19);
    }

    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'left';
    ctx.fillText(labels[i], legendX + i * 95 + 20, legendY + 12);
    ctx.restore();
  });

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;

  data.forEach((value, i) => {
    const delay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const isActive = i === activeIndex;
    const alpha = isActive ? 1 : 0.5;

    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `${colors[i]}AA`;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = isActive ? 3 : 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
    ctx.restore();
  });
};

export const drawTitlePosition = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [40, 55, 50, 70, 60, 80];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Title at top center
  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = "bold 14px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('TACTICAL DATA ANALYSIS', width / 2, 25);

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.primary;
  ctx.shadowBlur = 15;
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

  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;

      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.primary;
      ctx.shadowColor = COLDWAR_COLORS.primary;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawTitleAlignment = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [35, 50, 45, 65, 55, 75];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Title at left
  ctx.fillStyle = COLDWAR_COLORS.accent;
  ctx.font = "bold 12px 'Share Tech Mono', monospace";
  ctx.textAlign = 'left';
  ctx.fillText('MISSION STATS', padding, 25);

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.accent;
  ctx.shadowBlur = 15;
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

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawSubtitle = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [45, 60, 55, 75, 65, 85];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Title and subtitle
  ctx.fillStyle = COLDWAR_COLORS.primary;
  ctx.font = "bold 13px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('OPERATIONAL METRICS', width / 2, 20);

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "9px 'Share Tech Mono', monospace";
  ctx.fillText('Real-time Performance Data', width / 2, 35);

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.success;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.success;
  ctx.shadowBlur = 15;
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

  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) <= easedProgress) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = height - padding - 40 - (data[i] / 100) * chartHeight;

      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.success;
      ctx.shadowColor = COLDWAR_COLORS.success;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};
//
// GRID & AXES CHARTS (6 charts) - UNIQUE IMPLEMENTATIONS
//

export const drawGridConfiguration = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [40, 55, 50, 70, 60, 80];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Dense grid
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}33`;
  ctx.lineWidth = 1;
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  for (let i = 0; i <= 10; i++) {
    const y = padding + (i * chartHeight) / 10;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  for (let i = 0; i <= 10; i++) {
    const x = padding + (i * chartWidth) / 10;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding - 40);
    ctx.stroke();
  }

  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.primary;
  ctx.shadowBlur = 15;
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

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawGridStyling = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [35, 50, 45, 65, 55, 75];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Styled grid with dashed lines and colors
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  ctx.setLineDash([5, 5]);
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * chartHeight) / 5;
    ctx.strokeStyle = i % 2 === 0 ? `${COLDWAR_COLORS.accent}44` : `${COLDWAR_COLORS.secondary}33`;
    ctx.lineWidth = i % 2 === 0 ? 1.5 : 1;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.accent;
  ctx.shadowBlur = 15;
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

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawAxesBorders = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [45, 60, 55, 75, 65, 85];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  drawHudGrid(ctx, width, height, padding);

  // Thick axis borders
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 4;
  ctx.shadowColor = COLDWAR_COLORS.primary;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 40);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.warning;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.warning;
  ctx.shadowBlur = 15;
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

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawTickConfiguration = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [40, 55, 50, 70, 60, 80];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Custom tick marks
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * chartHeight) / 5;
    ctx.beginPath();
    ctx.moveTo(padding - 8, y);
    ctx.lineTo(padding, y);
    ctx.stroke();

    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'right';
    ctx.fillText(`${100 - i * 20}`, padding - 12, y + 4);
  }

  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (labels.length - 1)) * chartWidth;
    ctx.strokeStyle = COLDWAR_COLORS.primary;
    ctx.beginPath();
    ctx.moveTo(x, height - padding - 40);
    ctx.lineTo(x, height - padding - 32);
    ctx.stroke();
  }

  const easedProgress = easeOutQuart(progress);

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.danger;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.danger;
  ctx.shadowBlur = 15;
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

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawAxesStyling = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [35, 50, 45, 65, 55, 75];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  drawHudGrid(ctx, width, height, padding);

  // Styled axes with different colors
  ctx.strokeStyle = COLDWAR_COLORS.accent;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.accent;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 40);
  ctx.stroke();

  ctx.strokeStyle = COLDWAR_COLORS.secondary;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.secondary;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding - 40);
  ctx.lineTo(width - padding, height - padding - 40);
  ctx.stroke();

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.info;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.info;
  ctx.shadowBlur = 15;
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

  ctx.fillStyle = COLDWAR_COLORS.text;
  ctx.font = "10px 'Share Tech Mono', monospace";
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    ctx.fillText(labels[i], x, height - padding - 20);
  }
};

export const drawMultipleYAxes = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  drawMultiAxisLine(canvas, progress);
};
//
// SPECIAL CHARTS (5 charts) - UNIQUE IMPLEMENTATIONS
//

export const drawMixedChartTypes = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const barData = [30, 40, 35];
  const lineData = [50, 65, 60, 75, 70];
  const scatterData = [
    { x: 70, y: 55 },
    { x: 85, y: 70 },
  ];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;

  // Bars
  const barWidth = (chartWidth / 6) * 0.5;
  barData.forEach((value, i) => {
    const delay = i * 0.08;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const x = padding + (i * chartWidth) / 6;
    const barHeight = (value / 100) * chartHeight * easedBarProgress;
    const y = height - padding - 40 - barHeight;

    ctx.fillStyle = `${COLDWAR_COLORS.primary}88`;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = COLDWAR_COLORS.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
  });

  // Line
  ctx.save();
  ctx.strokeStyle = COLDWAR_COLORS.secondary;
  ctx.lineWidth = 3;
  ctx.shadowColor = COLDWAR_COLORS.secondary;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  for (let i = 0; i < lineData.length; i++) {
    if (i / (lineData.length - 1) <= easedProgress) {
      const x = padding + (i / (lineData.length - 1)) * chartWidth;
      const y = height - padding - 40 - (lineData[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Scatter
  scatterData.forEach((point, i) => {
    const delay = 0.5 + i * 0.15;
    const pointProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    if (pointProgress > 0) {
      const x = padding + (point.x / 100) * chartWidth;
      const y = height - padding - 40 - (point.y / 100) * chartHeight;
      const size = 8 * easeOutQuart(pointProgress);

      ctx.save();
      ctx.fillStyle = COLDWAR_COLORS.accent;
      ctx.shadowColor = COLDWAR_COLORS.accent;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });
};

export const drawFinancialChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const candlesticks = [
    { open: 40, high: 60, low: 35, close: 55 },
    { open: 55, high: 70, low: 50, close: 65 },
    { open: 65, high: 75, low: 60, close: 62 },
    { open: 62, high: 80, low: 58, close: 75 },
    { open: 75, high: 85, low: 70, close: 72 },
  ];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const candleWidth = (chartWidth / candlesticks.length) * 0.6;

  candlesticks.forEach((candle, i) => {
    const delay = i * 0.15;
    const candleProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedCandleProgress = easeOutQuart(candleProgress);

    if (candleProgress > 0) {
      const x =
        padding +
        (i * chartWidth) / candlesticks.length +
        (chartWidth / candlesticks.length - candleWidth) / 2;
      const isGreen = candle.close > candle.open;
      const color = isGreen ? COLDWAR_COLORS.success : COLDWAR_COLORS.danger;

      const highY = height - padding - 40 - (candle.high / 100) * chartHeight * easedCandleProgress;
      const lowY = height - padding - 40 - (candle.low / 100) * chartHeight * easedCandleProgress;
      const openY = height - padding - 40 - (candle.open / 100) * chartHeight * easedCandleProgress;
      const closeY =
        height - padding - 40 - (candle.close / 100) * chartHeight * easedCandleProgress;

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Body
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      ctx.fillStyle = isGreen ? `${color}AA` : color;
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.strokeRect(x, bodyTop, candleWidth, bodyHeight);
    }
  });
};

export const drawGanttChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const tasks = [
    { name: 'Task A', start: 10, duration: 30, color: COLDWAR_COLORS.primary },
    { name: 'Task B', start: 25, duration: 40, color: COLDWAR_COLORS.secondary },
    { name: 'Task C', start: 50, duration: 25, color: COLDWAR_COLORS.accent },
    { name: 'Task D', start: 70, duration: 20, color: COLDWAR_COLORS.warning },
  ];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = `${COLDWAR_COLORS.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const x = padding + 100 + (i * (width - padding - 100)) / 5;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = COLDWAR_COLORS.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding + 100, padding);
  ctx.lineTo(padding + 100, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding;
  const chartWidth = width - padding - 100;
  const taskHeight = chartHeight / (tasks.length + 1);

  tasks.forEach((task, i) => {
    const delay = i * 0.15;
    const taskProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedTaskProgress = easeOutQuart(taskProgress);

    const y = padding + (i + 0.5) * taskHeight - taskHeight * 0.3;
    const x = padding + 100 + (task.start / 100) * chartWidth;
    const barWidth = (task.duration / 100) * chartWidth * easedTaskProgress;

    // Task bar
    const gradient = ctx.createLinearGradient(x, y, x + barWidth, y);
    gradient.addColorStop(0, task.color);
    gradient.addColorStop(1, `${task.color}66`);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, taskHeight * 0.6);
    ctx.strokeStyle = task.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = task.color;
    ctx.shadowBlur = 10;
    ctx.strokeRect(x, y, barWidth, taskHeight * 0.6);

    // Task name
    ctx.shadowBlur = 0;
    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.textAlign = 'right';
    ctx.fillText(task.name, padding + 95, y + taskHeight * 0.4);
  });
};

export const drawWaterfallChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [
    { label: 'Start', value: 50, isTotal: true },
    { label: '+A', value: 15, isTotal: false },
    { label: '+B', value: 20, isTotal: false },
    { label: '-C', value: -10, isTotal: false },
    { label: 'End', value: 75, isTotal: true },
  ];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);
  drawHudGrid(ctx, width, height, padding);
  drawHudAxes(ctx, width, height, padding);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding - 40;
  const chartWidth = width - 2 * padding;
  const barWidth = (chartWidth / data.length) * 0.7;

  let cumulative = 0;
  data.forEach((item, i) => {
    const delay = i * 0.12;
    const barProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedBarProgress = easeOutQuart(barProgress);

    const x = padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;

    if (item.isTotal) {
      cumulative = item.value;
      const barHeight = (item.value / 100) * chartHeight * easedBarProgress;
      const y = height - padding - 40 - barHeight;

      ctx.fillStyle = `${COLDWAR_COLORS.accent}AA`;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.strokeStyle = COLDWAR_COLORS.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);
    } else {
      const startY = height - padding - 40 - (cumulative / 100) * chartHeight;
      const barHeight = Math.abs((item.value / 100) * chartHeight) * easedBarProgress;
      const isPositive = item.value > 0;
      const y = isPositive ? startY - barHeight : startY;

      const color = isPositive ? COLDWAR_COLORS.success : COLDWAR_COLORS.danger;
      ctx.fillStyle = `${color}AA`;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);

      cumulative += item.value;
    }

    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "9px 'Share Tech Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + barWidth / 2, height - padding - 20);
  });
};

export const drawFunnelChart = (canvas: HTMLCanvasElement, progress: number = 1): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const stages = [
    { label: 'Visitors', value: 100, color: COLDWAR_COLORS.primary },
    { label: 'Leads', value: 75, color: COLDWAR_COLORS.secondary },
    { label: 'Prospects', value: 50, color: COLDWAR_COLORS.accent },
    { label: 'Customers', value: 25, color: COLDWAR_COLORS.success },
  ];

  ctx.fillStyle = COLDWAR_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  const easedProgress = easeOutQuart(progress);
  const chartHeight = height - 2 * padding;
  const maxWidth = width - 2 * padding;
  const stageHeight = chartHeight / stages.length;

  stages.forEach((stage, i) => {
    const delay = i * 0.15;
    const stageProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedStageProgress = easeOutQuart(stageProgress);

    const y = padding + i * stageHeight;
    const currentWidth = (stage.value / 100) * maxWidth * easedStageProgress;
    const nextWidth =
      i < stages.length - 1
        ? (stages[i + 1].value / 100) * maxWidth * easedStageProgress
        : currentWidth * 0.5;

    const x1 = width / 2 - currentWidth / 2;
    const x2 = width / 2 + currentWidth / 2;
    const x3 = width / 2 + nextWidth / 2;
    const x4 = width / 2 - nextWidth / 2;

    // Trapezoid
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.lineTo(x3, y + stageHeight);
    ctx.lineTo(x4, y + stageHeight);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(width / 2, y, width / 2, y + stageHeight);
    gradient.addColorStop(0, `${stage.color}AA`);
    gradient.addColorStop(1, `${stage.color}66`);

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = stage.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = stage.color;
    ctx.shadowBlur = 10;
    ctx.stroke();

    // Label
    ctx.shadowBlur = 0;
    ctx.fillStyle = COLDWAR_COLORS.text;
    ctx.font = "11px 'Share Tech Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(`${stage.label} (${stage.value}%)`, width / 2, y + stageHeight / 2 + 4);
  });
};
