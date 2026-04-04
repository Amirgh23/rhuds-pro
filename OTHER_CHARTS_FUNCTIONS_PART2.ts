// 7. STACKED BAR/LINE CHART
const drawStackedBarLine = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  const barData1 = [20, 25, 30, 35, 25, 30];
  const barData2 = [15, 20, 25, 20, 30, 25];
  const lineData = [65, 70, 80, 75, 85, 80];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Stacked Bar + Line Chart', width, height, titleOptions);
  ctx.globalAlpha = 1;

  drawGrid(ctx, width, height, padding, gridOptions);

  ctx.globalAlpha = progress;
  ctx.fillStyle = colors.primary;
  ctx.font = '11px monospace';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 30)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
    ctx.fillText(labels[i], x, height - padding + 20);
  }
  ctx.globalAlpha = 1;

  const chartHeight = height - 2 * padding - 30;
  const chartWidth = width - 2 * padding;
  const maxValue = 100;
  const barWidth = ((width - 2 * padding) / barData1.length) * 0.5;

  // Draw stacked bars
  for (let i = 0; i < barData1.length; i++) {
    const x = padding + (i * chartWidth) / (barData1.length - 1) - barWidth / 2;
    const barDelay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
    const easedBarProgress = easeOutQuart(barProgress);

    const total = barData1[i] + barData2[i];
    const fullHeight1 = (barData1[i] / maxValue) * chartHeight;
    const fullHeight2 = (barData2[i] / maxValue) * chartHeight;
    const height1 = fullHeight1 * easedBarProgress;
    const height2 = fullHeight2 * easedBarProgress;

    // Bottom bar
    const y1 = height - padding - 30 - height1;
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(x, y1, barWidth, height1);
    ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y1, barWidth, height1);

    // Top bar
    const y2 = y1 - height2;
    ctx.fillStyle = '#FF006E';
    ctx.fillRect(x, y2, barWidth, height2);
    ctx.strokeRect(x, y2, barWidth, height2);
  }

  // Draw line
  const easedProgress = easeOutQuart(progress);
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < lineData.length; i++) {
    const x = padding + (i * chartWidth) / (lineData.length - 1);
    const y = height - padding - 30 - (lineData[i] / maxValue) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    if (i / (lineData.length - 1) > easedProgress) break;
  }
  ctx.stroke();

  for (let i = 0; i < lineData.length; i++) {
    if (i / (lineData.length - 1) > easedProgress) break;
    const x = padding + (i * chartWidth) / (lineData.length - 1);
    const y = height - padding - 30 - (lineData[i] / maxValue) * chartHeight;
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.globalAlpha = progress;
  drawLegend(
    ctx,
    [
      { label: 'Bar Stack 1', color: colors.secondary },
      { label: 'Bar Stack 2', color: '#FF006E' },
      { label: 'Line Data', color: colors.primary },
    ],
    width - 180,
    40
  );
  ctx.globalAlpha = 1;
};

// ==================== END OF OTHER CHARTS ====================
