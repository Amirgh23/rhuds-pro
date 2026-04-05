# PowerShell script to add 43 unique chart implementations to ColdWarChartRenderer.ts

$filePath = "packages/demo-app/src/components/ColdWarChartRenderer.ts"

$uniqueImplementations = @'

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
    gradient.addColorStop(0, value > 70 ? COLDWAR_COLORS.danger : value > 40 ? COLDWAR_COLORS.warning : COLDWAR_COLORS.success);
    gradient.addColorStop(1, `${value > 70 ? COLDWAR_COLORS.danger : value > 40 ? COLDWAR_COLORS.warning : COLDWAR_COLORS.success}66`);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = value > 70 ? COLDWAR_COLORS.danger : value > 40 ? COLDWAR_COLORS.warning : COLDWAR_COLORS.success;
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

export const drawStackedLinearCategory = (canvas: HTMLCanvasElement, progress: number = 1): void => {
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
    const x = padding + (i * chartWidth) / categories.length + (chartWidth / categories.length - barWidth) / 2;

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
    const x = padding + (i * chartWidth) / barData.length + (chartWidth / barData.length - barWidth) / 2;
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

'@

# Append to file
Add-Content -Path $filePath -Value $uniqueImplementations

Write-Host "✅ Added Scale Charts (8) to ColdWarChartRenderer.ts" -ForegroundColor Green
