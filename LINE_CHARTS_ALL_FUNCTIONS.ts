// ==================== LINE CHART VARIANTS ====================
// این توابع باید قبل از drawMixedChart (خط 2080) اضافه شوند

// 1. LINE INTERPOLATION MODES
const drawLineInterpolation = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [30, 50, 40, 70, 60, 80, 65];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Line Interpolation - Linear, Smooth, Step', width, height, titleOptions);
  ctx.globalAlpha = 1;
  drawCustomGrid(ctx, width, height, padding, colors, gridOptions, progress);
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
  const modes = [
    { label: 'Linear', color: colors.primary, offset: 0 },
    { label: 'Smooth', color: colors.secondary, offset: -5 },
    { label: 'Step', color: '#FF006E', offset: 5 },
  ];
  modes.forEach((mode, modeIndex) => {
    const delay = modeIndex * 0.15;
    const modeProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedProgress = easeOutQuart(modeProgress);
    ctx.strokeStyle = mode.color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 30 - ((data[i] + mode.offset) / maxValue) * chartHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        if (mode.label === 'Linear') {
          ctx.lineTo(x, y);
        } else if (mode.label === 'Smooth') {
          const prevX = padding + ((i - 1) * chartWidth) / (data.length - 1);
          const prevY =
            height - padding - 30 - ((data[i - 1] + mode.offset) / maxValue) * chartHeight;
          const cpX = (prevX + x) / 2;
          ctx.quadraticCurveTo(cpX, prevY, x, y);
        } else if (mode.label === 'Step') {
          const prevX = padding + ((i - 1) * chartWidth) / (data.length - 1);
          ctx.lineTo(x, ctx.currentPoint?.y || y);
          ctx.lineTo(x, y);
        }
      }
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 30 - ((data[i] + mode.offset) / maxValue) * chartHeight;
      ctx.fillStyle = mode.color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
  ctx.globalAlpha = progress;
  drawLegend(
    ctx,
    modes.map((m) => ({ label: m.label, color: m.color })),
    width - 180,
    40
  );
  ctx.globalAlpha = 1;
};

// 2. MULTI AXIS LINE CHART
const drawMultiAxisLine = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data1 = [65, 59, 80, 81, 56, 55, 70];
  const data2 = [280, 320, 290, 350, 310, 340, 330];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Multi Axis Line Chart - Two Y Axes', width, height, titleOptions);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = `${colors.primary}33`;
  ctx.lineWidth = 1;
  ctx.globalAlpha = progress;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 30)) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  ctx.fillStyle = colors.primary;
  ctx.font = '11px monospace';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 30)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }
  ctx.textAlign = 'left';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 30)) / 5;
    ctx.fillText(`${400 - i * 80}`, width - padding + 10, y + 4);
  }
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
    ctx.fillText(labels[i], x, height - padding + 20);
  }
  ctx.globalAlpha = 1;
  const chartHeight = height - 2 * padding - 30;
  const chartWidth = width - 2 * padding;
  const datasets = [
    { data: data1, color: colors.primary, maxValue: 100, label: 'Sales (Left)' },
    { data: data2, color: colors.secondary, maxValue: 400, label: 'Revenue (Right)' },
  ];
  datasets.forEach((dataset, dsIndex) => {
    const delay = dsIndex * 0.2;
    const dsProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedProgress = easeOutQuart(dsProgress);
    ctx.strokeStyle = dataset.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < dataset.data.length; i++) {
      const x = padding + (i * chartWidth) / (dataset.data.length - 1);
      const y = height - padding - 30 - (dataset.data[i] / dataset.maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (dataset.data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < dataset.data.length; i++) {
      if (i / (dataset.data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (dataset.data.length - 1);
      const y = height - padding - 30 - (dataset.data[i] / dataset.maxValue) * chartHeight;
      ctx.fillStyle = dataset.color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
  ctx.globalAlpha = progress;
  drawLegend(
    ctx,
    datasets.map((d) => ({ label: d.label, color: d.color })),
    width - 200,
    40
  );
  ctx.globalAlpha = 1;
};

// 3. POINT STYLING
const drawPointStyling = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [45, 60, 50, 75, 65, 85, 70];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Point Styling - Different Shapes', width, height, titleOptions);
  ctx.globalAlpha = 1;
  drawCustomGrid(ctx, width, height, padding, colors, gridOptions, progress);
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
  const easedProgress = easeOutQuart(progress);
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < data.length; i++) {
    const x = padding + (i * chartWidth) / (data.length - 1);
    const y = height - padding - 30 - (data[i] / maxValue) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    if (i / (data.length - 1) > easedProgress) break;
  }
  ctx.stroke();

  const shapes = ['circle', 'square', 'triangle', 'star', 'diamond', 'cross', 'plus'];
  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) > easedProgress) break;
    const x = padding + (i * chartWidth) / (data.length - 1);
    const y = height - padding - 30 - (data[i] / maxValue) * chartHeight;
    const shape = shapes[i % shapes.length];
    const size = 6;
    ctx.fillStyle = colors.primary;
    ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
    ctx.lineWidth = 2;
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (shape === 'square') {
      ctx.fillRect(x - size, y - size, size * 2, size * 2);
      ctx.strokeRect(x - size, y - size, size * 2, size * 2);
    } else if (shape === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x - size, y + size);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (shape === 'star') {
      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
        const r = j % 2 === 0 ? size : size / 2;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (shape === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (shape === 'cross') {
      ctx.beginPath();
      ctx.moveTo(x - size, y - size);
      ctx.lineTo(x + size, y + size);
      ctx.moveTo(x + size, y - size);
      ctx.lineTo(x - size, y + size);
      ctx.stroke();
    } else if (shape === 'plus') {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.stroke();
    }
  }
};

// 4. SEGMENT STYLING
const drawSegmentStyling = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [40, 55, 45, 70, 60, 75, 65];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const segmentColors = [
    colors.primary,
    colors.secondary,
    '#FF006E',
    '#FFD60A',
    '#00F5FF',
    '#FF00FF',
  ];
  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Segment Styling - Different Colors', width, height, titleOptions);
  ctx.globalAlpha = 1;
  drawCustomGrid(ctx, width, height, padding, colors, gridOptions, progress);
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
  const easedProgress = easeOutQuart(progress);
  for (let i = 0; i < data.length - 1; i++) {
    if (i / (data.length - 1) > easedProgress) break;
    const x1 = padding + (i * chartWidth) / (data.length - 1);
    const y1 = height - padding - 30 - (data[i] / maxValue) * chartHeight;
    const x2 = padding + ((i + 1) * chartWidth) / (data.length - 1);
    const y2 = height - padding - 30 - (data[i + 1] / maxValue) * chartHeight;
    ctx.strokeStyle = segmentColors[i % segmentColors.length];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  for (let i = 0; i < data.length; i++) {
    if (i / (data.length - 1) > easedProgress) break;
    const x = padding + (i * chartWidth) / (data.length - 1);
    const y = height - padding - 30 - (data[i] / maxValue) * chartHeight;
    ctx.fillStyle = segmentColors[i % segmentColors.length];
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

// 5. STEPPED LINE CHART
const drawSteppedLine = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [35, 55, 45, 70, 60, 80, 70];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Stepped Line - Before, After, Middle', width, height, titleOptions);
  ctx.globalAlpha = 1;
  drawCustomGrid(ctx, width, height, padding, colors, gridOptions, progress);
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
  const modes = [
    { label: 'Step-before', color: colors.primary, offset: 0 },
    { label: 'Step-after', color: colors.secondary, offset: -5 },
    { label: 'Step-middle', color: '#FF006E', offset: 5 },
  ];
  modes.forEach((mode, modeIndex) => {
    const delay = modeIndex * 0.15;
    const modeProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedProgress = easeOutQuart(modeProgress);
    ctx.strokeStyle = mode.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 30 - ((data[i] + mode.offset) / maxValue) * chartHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX = padding + ((i - 1) * chartWidth) / (data.length - 1);
        const prevY =
          height - padding - 30 - ((data[i - 1] + mode.offset) / maxValue) * chartHeight;
        if (mode.label === 'Step-before') {
          ctx.lineTo(x, prevY);
          ctx.lineTo(x, y);
        } else if (mode.label === 'Step-after') {
          ctx.lineTo(prevX, y);
          ctx.lineTo(x, y);
        } else {
          const midX = (prevX + x) / 2;
          ctx.lineTo(midX, prevY);
          ctx.lineTo(midX, y);
          ctx.lineTo(x, y);
        }
      }
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 30 - ((data[i] + mode.offset) / maxValue) * chartHeight;
      ctx.fillStyle = mode.color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
  ctx.globalAlpha = progress;
  drawLegend(
    ctx,
    modes.map((m) => ({ label: m.label, color: m.color })),
    width - 200,
    40
  );
  ctx.globalAlpha = 1;
};

// 6. LINE STYLING (Solid, Dashed, Dotted)
const drawLineStyling = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const data = [40, 60, 50, 75, 65, 85, 75];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Line Styling - Solid, Dashed, Dotted', width, height, titleOptions);
  ctx.globalAlpha = 1;
  drawCustomGrid(ctx, width, height, padding, colors, gridOptions, progress);
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
  const styles = [
    { label: 'Solid', color: colors.primary, dash: [], offset: 0 },
    { label: 'Dashed', color: colors.secondary, dash: [10, 5], offset: -5 },
    { label: 'Dotted', color: '#FF006E', dash: [2, 3], offset: 5 },
  ];
  styles.forEach((style, styleIndex) => {
    const delay = styleIndex * 0.15;
    const styleProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedProgress = easeOutQuart(styleProgress);
    ctx.strokeStyle = style.color;
    ctx.lineWidth = 2;
    ctx.setLineDash(style.dash);
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 30 - ((data[i] + style.offset) / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 30 - ((data[i] + style.offset) / maxValue) * chartHeight;
      ctx.fillStyle = style.color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
  ctx.globalAlpha = progress;
  drawLegend(
    ctx,
    styles.map((s) => ({ label: s.label, color: s.color })),
    width - 180,
    40
  );
  ctx.globalAlpha = 1;
};

// ==================== END OF LINE CHART VARIANTS ====================
