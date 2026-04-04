// ==================== OTHER CHART TYPES ====================
// Add these functions before drawMixedChart

// 1. COMBO BAR/LINE CHART
const drawComboBarLine = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const barData = [45, 55, 60, 70, 50, 65];
  const lineData = [65, 59, 80, 81, 56, 75];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Combo Chart - Bar + Line', width, height, titleOptions);
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
  const barWidth = ((width - 2 * padding) / barData.length) * 0.5;

  // Draw bars
  for (let i = 0; i < barData.length; i++) {
    const x = padding + (i * chartWidth) / (barData.length - 1) - barWidth / 2;
    const barDelay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const fullBarHeight = (barData[i] / maxValue) * chartHeight;
    const barHeight = fullBarHeight * easedBarProgress;
    const y = height - padding - 30 - barHeight;

    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, `${colors.secondary}88`);
    gradient.addColorStop(1, `${colors.secondary}33`);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
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
      { label: 'Bar Data', color: colors.secondary },
      { label: 'Line Data', color: colors.primary },
    ],
    width - 180,
    40
  );
  ctx.globalAlpha = 1;
};

// 2. MULTI SERIES PIE CHART
const drawMultiSeriesPie = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Multi Series Pie Chart', width, height, titleOptions);
  ctx.globalAlpha = 1;

  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const outerRadius = Math.min(width, height) / 3;
  const innerRadius = outerRadius * 0.6;

  const outerData = [30, 25, 20, 25];
  const innerData = [15, 20, 25, 15, 25];
  const outerColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A'];
  const innerColors = ['#00F5FF', '#FF00FF', '#00FF00', '#FFA500', '#FF1493'];
  const outerLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
  const innerLabels = ['A', 'B', 'C', 'D', 'E'];

  const easedProgress = easeOutQuart(progress);

  // Draw outer ring
  let outerStartAngle = -Math.PI / 2;
  const outerTotal = outerData.reduce((a, b) => a + b, 0);
  outerData.forEach((value, i) => {
    const sliceAngle = (value / outerTotal) * Math.PI * 2 * easedProgress;
    const endAngle = outerStartAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, outerStartAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, outerStartAngle, true);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      innerRadius,
      centerX,
      centerY,
      outerRadius
    );
    gradient.addColorStop(0, `${outerColors[i]}88`);
    gradient.addColorStop(1, `${outerColors[i]}FF`);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    outerStartAngle = endAngle;
  });

  // Draw inner circle
  let innerStartAngle = -Math.PI / 2;
  const innerTotal = innerData.reduce((a, b) => a + b, 0);
  innerData.forEach((value, i) => {
    const sliceAngle = (value / innerTotal) * Math.PI * 2 * easedProgress;
    const endAngle = innerStartAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, innerRadius * 0.9, innerStartAngle, endAngle);
    ctx.closePath();

    ctx.fillStyle = innerColors[i];
    ctx.fill();
    ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    innerStartAngle = endAngle;
  });

  ctx.globalAlpha = progress;
  drawLegend(
    ctx,
    [
      { label: 'Outer Ring', color: colors.primary },
      { label: 'Inner Circle', color: innerColors[0] },
    ],
    width - 180,
    40
  );
  ctx.globalAlpha = 1;
};

// 3. POLAR AREA CHART
const drawPolarArea = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Polar Area Chart', width, height, titleOptions);
  ctx.globalAlpha = 1;

  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const maxRadius = Math.min(width, height) / 3;

  const data = [65, 59, 90, 81, 56, 75];
  const polarColors = [
    colors.primary,
    colors.secondary,
    '#FF006E',
    '#FFD60A',
    '#00F5FF',
    '#FF00FF',
  ];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  const maxValue = Math.max(...data);
  const easedProgress = easeOutQuart(progress);

  let startAngle = -Math.PI / 2;
  const angleStep = (Math.PI * 2) / data.length;

  data.forEach((value, i) => {
    const delay = i * 0.1;
    const segmentProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedSegmentProgress = easeOutQuart(segmentProgress);

    const radius = (value / maxValue) * maxRadius * easedSegmentProgress;
    const endAngle = startAngle + angleStep;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `${polarColors[i]}33`);
    gradient.addColorStop(1, `${polarColors[i]}FF`);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw grid circles
    ctx.strokeStyle = `${colors.primary}22`;
    ctx.lineWidth = 1;
    for (let r = maxRadius / 4; r <= maxRadius; r += maxRadius / 4) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    startAngle = endAngle;
  });

  ctx.globalAlpha = progress;
  drawLegend(
    ctx,
    labels.map((label, i) => ({ label, color: polarColors[i] })),
    width - 180,
    40
  );
  ctx.globalAlpha = 1;
};

// 4. POLAR AREA WITH CENTERED POINT LABELS
const drawPolarAreaCentered = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Polar Area - Centered Labels', width, height, titleOptions);
  ctx.globalAlpha = 1;

  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const maxRadius = Math.min(width, height) / 3;

  const data = [65, 59, 90, 81, 56, 75, 70, 85];
  const polarColors = [
    colors.primary,
    colors.secondary,
    '#FF006E',
    '#FFD60A',
    '#00F5FF',
    '#FF00FF',
    '#00FF00',
    '#FFA500',
  ];
  const labels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  const maxValue = Math.max(...data);
  const easedProgress = easeOutQuart(progress);

  let startAngle = -Math.PI / 2;
  const angleStep = (Math.PI * 2) / data.length;

  data.forEach((value, i) => {
    const delay = i * 0.08;
    const segmentProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    const easedSegmentProgress = easeOutQuart(segmentProgress);

    const radius = (value / maxValue) * maxRadius * easedSegmentProgress;
    const endAngle = startAngle + angleStep;
    const midAngle = (startAngle + endAngle) / 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `${polarColors[i]}33`);
    gradient.addColorStop(1, `${polarColors[i]}FF`);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw centered label
    const labelRadius = radius * 0.6;
    const labelX = centerX + Math.cos(midAngle) * labelRadius;
    const labelY = centerY + Math.sin(midAngle) * labelRadius;

    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labels[i], labelX, labelY);
    ctx.fillText(data[i].toString(), labelX, labelY + 15);

    startAngle = endAngle;
  });
};

// 5. RADAR CHART WITH SKIP POINTS
const drawRadarSkipPoints = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Radar Chart - Skip Points', width, height, titleOptions);
  ctx.globalAlpha = 1;

  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const radius = Math.min(width, height) / 3;

  const data1 = [65, null, 80, 81, null, 75]; // null = skip
  const data2 = [45, 69, null, 91, 66, null];
  const labels = ['Speed', 'Strength', 'Defense', 'Attack', 'Magic', 'HP'];

  const maxValue = 100;
  const easedProgress = easeOutQuart(progress);

  // Draw grid
  ctx.strokeStyle = `${colors.primary}22`;
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    for (let j = 0; j < labels.length; j++) {
      const angle = (j * Math.PI * 2) / labels.length - Math.PI / 2;
      const r = (radius / 5) * i;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Draw axes
  ctx.strokeStyle = `${colors.primary}44`;
  for (let i = 0; i < labels.length; i++) {
    const angle = (i * Math.PI * 2) / labels.length - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
    ctx.stroke();

    // Labels
    const labelX = centerX + Math.cos(angle) * (radius + 20);
    const labelY = centerY + Math.sin(angle) * (radius + 20);
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], labelX, labelY);
  }

  // Draw data1 (with skips)
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 2;
  ctx.beginPath();
  let firstPoint = true;
  data1.forEach((value, i) => {
    if (value !== null) {
      const angle = (i * Math.PI * 2) / data1.length - Math.PI / 2;
      const r = (value / maxValue) * radius * easedProgress;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    } else {
      firstPoint = true; // Reset for next segment
    }
  });
  ctx.stroke();

  // Draw data2 (with skips)
  ctx.strokeStyle = colors.secondary;
  ctx.beginPath();
  firstPoint = true;
  data2.forEach((value, i) => {
    if (value !== null) {
      const angle = (i * Math.PI * 2) / data2.length - Math.PI / 2;
      const r = (value / maxValue) * radius * easedProgress;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    } else {
      firstPoint = true;
    }
  });
  ctx.stroke();

  ctx.globalAlpha = progress;
  drawLegend(
    ctx,
    [
      { label: 'Player 1', color: colors.primary },
      { label: 'Player 2', color: colors.secondary },
    ],
    width - 180,
    40
  );
  ctx.globalAlpha = 1;
};

// 6. SCATTER MULTI AXIS
const drawScatterMultiAxis = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = progress;
  drawCustomTitle(ctx, 'Scatter Chart - Multi Axis', width, height, titleOptions);
  ctx.globalAlpha = 1;

  drawGrid(ctx, width, height, padding, gridOptions);

  // Axes labels
  ctx.globalAlpha = progress;
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
    ctx.fillText(`${200 - i * 40}`, width - padding + 10, y + 4);
  }
  ctx.textAlign = 'center';
  for (let i = 0; i <= 5; i++) {
    const x = padding + (i * (width - 2 * padding)) / 5;
    ctx.fillText(`${i * 20}`, x, height - padding + 20);
  }
  ctx.globalAlpha = 1;

  const chartHeight = height - 2 * padding - 30;
  const chartWidth = width - 2 * padding;

  // Dataset 1 (left Y axis, 0-100)
  const data1 = [
    { x: 10, y: 20 },
    { x: 25, y: 45 },
    { x: 40, y: 60 },
    { x: 55, y: 75 },
    { x: 70, y: 55 },
    { x: 85, y: 80 },
  ];

  // Dataset 2 (right Y axis, 0-200)
  const data2 = [
    { x: 15, y: 140 },
    { x: 30, y: 160 },
    { x: 45, y: 120 },
    { x: 60, y: 180 },
    { x: 75, y: 150 },
    { x: 90, y: 170 },
  ];

  const easedProgress = easeOutQuart(progress);

  // Draw dataset 1
  data1.forEach((point, i) => {
    const delay = i * 0.1;
    const pointProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    if (pointProgress > 0) {
      const x = padding + (point.x / 100) * chartWidth;
      const y = height - padding - 30 - (point.y / 100) * chartHeight;
      const size = 6 * easeOutQuart(pointProgress);

      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Draw dataset 2
  data2.forEach((point, i) => {
    const delay = i * 0.1 + 0.3;
    const pointProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    if (pointProgress > 0) {
      const x = padding + (point.x / 100) * chartWidth;
      const y = height - padding - 30 - (point.y / 200) * chartHeight;
      const size = 6 * easeOutQuart(pointProgress);

      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  ctx.globalAlpha = progress;
  drawLegend(
    ctx,
    [
      { label: 'Data 1 (0-100)', color: colors.primary },
      { label: 'Data 2 (0-200)', color: colors.secondary },
    ],
    width - 200,
    40
  );
  ctx.globalAlpha = 1;
};
