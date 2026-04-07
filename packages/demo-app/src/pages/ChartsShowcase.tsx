/**
// ==================== OTHER CHART TYPES ====================
// Add these functions before drawMixedChart

// 1. COMBO BAR/LINE CHART
const drawComboBarLine = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const bottomPadding = 60;
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
    const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i * (width - 2 * padding)) / barData.length + (width - 2 * padding) / (barData.length * 2);
    ctx.fillText(labels[i], x, height - padding + 10);
  }
  ctx.globalAlpha = 1;

  const chartHeight = height - 2 * padding - bottomPadding;
  const chartWidth = width - 2 * padding;
  const maxValue = 100;
  const barWidth = (chartWidth / barData.length) * 0.6;

  // Draw bars
  for (let i = 0; i < barData.length; i++) {
    const x = padding + (i * chartWidth) / barData.length + (chartWidth / barData.length - barWidth) / 2;
    const barDelay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
    const easedBarProgress = easeOutQuart(barProgress);
    const fullBarHeight = (barData[i] / maxValue) * chartHeight;
    const barHeight = fullBarHeight * easedBarProgress;
    const y = height - padding - bottomPadding + 20 - barHeight;

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
    const x = padding + (i * chartWidth) / barData.length + (chartWidth / barData.length) / 2;
    const y = height - padding - bottomPadding + 20 - (lineData[i] / maxValue) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    if (i / (lineData.length - 1) > easedProgress) break;
  }
  ctx.stroke();

  for (let i = 0; i < lineData.length; i++) {
    if (i / (lineData.length - 1) > easedProgress) break;
    const x = padding + (i * chartWidth) / barData.length + (chartWidth / barData.length) / 2;
    const y = height - padding - bottomPadding + 20 - (lineData[i] / maxValue) * chartHeight;
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

  const data1 = [65, null, 80, 81, null, 75]; // null = skip (no marker, but line connects)
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

  // Helper function to draw dataset with skip points
  const drawDatasetWithSkips = (data: (number | null)[], strokeColor: string, fillColor: string) => {
    // Draw filled area
    ctx.fillStyle = fillColor;
    ctx.beginPath();

    // Draw lines connecting ALL points (null = 0 value)
    for (let i = 0; i < data.length; i++) {
      const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
      const value = data[i] !== null ? data[i] : 0; // Treat null as 0
      const r = (value / maxValue) * radius * easedProgress;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();

    // Draw stroke
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
      const value = data[i] !== null ? data[i] : 0;
      const r = (value / maxValue) * radius * easedProgress;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();

    // Draw markers only for non-null points
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== null) {
        const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
        const r = (data[i] / maxValue) * radius * easedProgress;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  };

  // Draw data1
  drawDatasetWithSkips(data1, colors.primary, `${colors.primary}33`);

  // Draw data2
  drawDatasetWithSkips(data2, colors.secondary, `${colors.secondary}33`);

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
    const y = padding + (i * (height - 2 * padding - 60)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }
  ctx.textAlign = 'left';
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (height - 2 * padding - 60)) / 5;
    ctx.fillText(`${200 - i * 40}`, width - padding + 10, y + 4);
  }
  ctx.textAlign = 'center';
  for (let i = 0; i <= 5; i++) {
    const x = padding + (i * (width - 2 * padding)) / 5;
    ctx.fillText(`${i * 20}`, x, height - padding + 10);
  }
  ctx.globalAlpha = 1;

  const chartHeight = height - 2 * padding - 60;
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
      const y = height - padding - 40 - (point.y / 100) * chartHeight;
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
      const y = height - padding - 40 - (point.y / 200) * chartHeight;
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
    width - 180,
    40
  );
  ctx.globalAlpha = 1;
};

// 7. STACKED BAR/LINE CHART
const drawStackedBarLine = (canvas: HTMLCanvasElement, progress: number = 1) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;
  const bottomPadding = 80;

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
    const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
    ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
  }
  ctx.textAlign = 'center';
  for (let i = 0; i < labels.length; i++) {
    const x = padding + (i * (width - 2 * padding)) / barData1.length + (width - 2 * padding) / (barData1.length * 2);
    ctx.fillText(labels[i], x, height - padding + 10);
  }
  ctx.globalAlpha = 1;

  const chartHeight = height - 2 * padding - bottomPadding;
  const chartWidth = width - 2 * padding;
  const maxValue = 100;
  const barWidth = (chartWidth / barData1.length) * 0.6;

  // Draw stacked bars
  for (let i = 0; i < barData1.length; i++) {
    const x = padding + (i * chartWidth) / barData1.length + (chartWidth / barData1.length - barWidth) / 2;
    const barDelay = i * 0.1;
    const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
    const easedBarProgress = easeOutQuart(barProgress);

    const total = barData1[i] + barData2[i];
    const fullHeight1 = (barData1[i] / maxValue) * chartHeight;
    const fullHeight2 = (barData2[i] / maxValue) * chartHeight;
    const height1 = fullHeight1 * easedBarProgress;
    const height2 = fullHeight2 * easedBarProgress;

    // Bottom bar
    const y1 = height - padding - bottomPadding - height1;
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
    const x = padding + (i * chartWidth) / barData1.length + (chartWidth / barData1.length) / 2;
    const y = height - padding - bottomPadding - (lineData[i] / maxValue) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    if (i / (lineData.length - 1) > easedProgress) break;
  }
  ctx.stroke();

  for (let i = 0; i < lineData.length; i++) {
    if (i / (lineData.length - 1) > easedProgress) break;
    const x = padding + (i * chartWidth) / barData1.length + (chartWidth / barData1.length) / 2;
    const y = height - padding - bottomPadding - (lineData[i] / maxValue) * chartHeight;
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

/**
 * Charts Showcase Page
 * Demonstrates all chart types with RHUDS and ColdWar themes
 * Full Chart.js equivalent implementation
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './ChartsShowcase.css';

type ChartVariant = 'r-huds' | 'coldwar';

// Tooltip interface
interface TooltipData {
  x: number;
  y: number;
  label: string;
  value: string | number;
  color: string;
  visible: boolean;
}

// Dataset interface for multiple datasets
interface ChartDataset {
  label: string;
  data: number[];
  color: string;
  visible: boolean;
}

const ChartsShowcaseComponent: React.FC = () => {
  const [variant, setVariant] = useState<ChartVariant>('r-huds');
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedTimeRef = useRef<number>(0);
  const totalPausedTimeRef = useRef<number>(0);

  // Tooltip state
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    label: '',
    value: '',
    color: '',
    visible: false,
  });

  // Multiple datasets state for Line Chart
  const [lineDatasets, setLineDatasets] = useState<ChartDataset[]>([
    { label: 'Sales 2023', data: [65, 59, 80, 81, 56, 55], color: '#29F2DF', visible: true },
    { label: 'Sales 2024', data: [45, 69, 70, 91, 66, 75], color: '#FF006E', visible: true },
  ]);

  // Toggle dataset visibility for Line Chart
  const toggleLineDataset = useCallback((index: number) => {
    setLineDatasets((prev) =>
      prev.map((ds, i) => (i === index ? { ...ds, visible: !ds.visible } : ds))
    );
  }, []);

  // Multiple datasets state for Bar Chart
  const [barDatasets, setBarDatasets] = useState<ChartDataset[]>([
    { label: 'Q1', data: [12, 19, 3, 5], color: '#29F2DF', visible: true },
    { label: 'Q2', data: [15, 22, 8, 10], color: '#FF006E', visible: true },
  ]);

  // Toggle dataset visibility for Bar Chart
  const toggleBarDataset = useCallback((index: number) => {
    setBarDatasets((prev) =>
      prev.map((ds, i) => (i === index ? { ...ds, visible: !ds.visible } : ds))
    );
  }, []);

  // Toggle dataset visibility for Legend Events
  const toggleLegendEventDataset = useCallback((index: number) => {
    setLegendEventDatasets((prev) =>
      prev.map((ds, i) => (i === index ? { ...ds, visible: !ds.visible } : ds))
    );
  }, []);

  // Grid customization options - memoized to prevent recalculation
  const gridOptions = useMemo(
    () => ({
      display: true,
      color: 'rgba(41, 242, 223, 0.2)',
      lineWidth: 1,
      drawBorder: true,
      drawTicks: true,
      tickLength: 8,
      borderDash: [] as number[], // Empty for solid, [5, 5] for dashed
    }),
    []
  );

  // Title customization options - memoized to prevent recalculation
  const titleOptions = useMemo(
    () => ({
      display: true,
      position: 'top' as 'top' | 'bottom',
      align: 'center' as 'start' | 'center' | 'end',
      font: {
        size: 14,
        weight: 'bold' as 'normal' | 'bold',
        family: 'monospace',
      },
      padding: 10,
    }),
    []
  );

  // Animation callbacks - memoized to prevent recreation
  const onAnimationProgress = useCallback((progress: number) => {
    // Callback during animation - can be used for custom effects
    // console.log('Animation progress:', progress);
  }, []);

  const onAnimationComplete = useCallback(() => {
    // Callback when animation completes
    // console.log('Animation complete!');
  }, []);

  // Export chart to PNG - memoized to prevent recreation
  const exportToPNG = useCallback(
    (canvasRef: React.RefObject<HTMLCanvasElement>, filename: string) => {
      if (!canvasRef.current) return;

      try {
        // Convert canvas to blob
        canvasRef.current.toBlob((blob) => {
          if (!blob) return;

          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${filename}.png`;
          link.href = url;
          link.click();

          // Cleanup
          URL.revokeObjectURL(url);
        });
      } catch (error) {
        console.error('Export to PNG failed:', error);
      }
    },
    []
  );

  // Copy chart to clipboard - memoized to prevent recreation
  const copyToClipboard = useCallback(async (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    try {
      // Convert canvas to blob
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;

        // Copy to clipboard using Clipboard API
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);

        // Show success feedback
        alert('Chart copied to clipboard!');
      });
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      alert('Failed to copy chart. Your browser may not support this feature.');
    }
  }, []);

  // Export chart to SVG - memoized to prevent recreation
  const exportToSVG = useCallback(
    (canvasRef: React.RefObject<HTMLCanvasElement>, filename: string) => {
      if (!canvasRef.current) return;

      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Get image data from canvas
        const dataURL = canvas.toDataURL('image/png');

        // Create SVG with embedded image
        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image width="${canvas.width}" height="${canvas.height}" xlink:href="${dataURL}"/>
</svg>`;

        // Create download link
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${filename}.svg`;
        link.href = url;
        link.click();

        // Cleanup
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Export to SVG failed:', error);
      }
    },
    []
  );

  // Data decimation for performance - memoized to prevent recreation
  const decimateData = useCallback((data: number[], maxPoints: number = 100): number[] => {
    if (data.length <= maxPoints) return data;

    const decimated: number[] = [];
    const step = data.length / maxPoints;

    for (let i = 0; i < maxPoints; i++) {
      const index = Math.floor(i * step);
      decimated.push(data[index]);
    }

    return decimated;
  }, []);

  // Responsive state
  const [chartDimensions, setChartDimensions] = useState({ width: 400, height: 300 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Chart refs
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const doughnutChartRef = useRef<HTMLCanvasElement>(null);
  const radarChartRef = useRef<HTMLCanvasElement>(null);
  const polarChartRef = useRef<HTMLCanvasElement>(null);
  const bubbleChartRef = useRef<HTMLCanvasElement>(null);
  const scatterChartRef = useRef<HTMLCanvasElement>(null);
  const mixedChartRef = useRef<HTMLCanvasElement>(null);
  const barBorderRadiusRef = useRef<HTMLCanvasElement>(null);
  const floatingBarsRef = useRef<HTMLCanvasElement>(null);
  const horizontalBarRef = useRef<HTMLCanvasElement>(null);
  const stackedBarRef = useRef<HTMLCanvasElement>(null);
  const stackedGroupedBarRef = useRef<HTMLCanvasElement>(null);
  const lineInterpolationRef = useRef<HTMLCanvasElement>(null);
  const multiAxisLineRef = useRef<HTMLCanvasElement>(null);
  const pointStylingRef = useRef<HTMLCanvasElement>(null);
  const segmentStylingRef = useRef<HTMLCanvasElement>(null);
  const steppedLineRef = useRef<HTMLCanvasElement>(null);
  const lineStylingRef = useRef<HTMLCanvasElement>(null);

  // Other Charts refs
  const comboBarLineRef = useRef<HTMLCanvasElement>(null);
  const multiSeriesPieRef = useRef<HTMLCanvasElement>(null);
  const polarAreaRef = useRef<HTMLCanvasElement>(null);
  const polarAreaCenteredRef = useRef<HTMLCanvasElement>(null);
  const radarSkipPointsRef = useRef<HTMLCanvasElement>(null);
  const scatterMultiAxisRef = useRef<HTMLCanvasElement>(null);
  const stackedBarLineRef = useRef<HTMLCanvasElement>(null);

  // Advanced Line & Area Charts
  const areaChartRef = useRef<HTMLCanvasElement>(null);
  const lineBoundariesRef = useRef<HTMLCanvasElement>(null);
  const lineDatasetsRef = useRef<HTMLCanvasElement>(null);
  const lineDrawTimeRef = useRef<HTMLCanvasElement>(null);
  const lineStackedRef = useRef<HTMLCanvasElement>(null);
  const radarStackedRef = useRef<HTMLCanvasElement>(null);

  // Scales & Configuration Options refs
  const linearScaleMinMaxRef = useRef<HTMLCanvasElement>(null);
  const linearScaleSuggestedRef = useRef<HTMLCanvasElement>(null);
  const linearScaleStepSizeRef = useRef<HTMLCanvasElement>(null);
  const logScaleRef = useRef<HTMLCanvasElement>(null);
  const stackedLinearCategoryRef = useRef<HTMLCanvasElement>(null);
  const timeScaleRef = useRef<HTMLCanvasElement>(null);
  const timeScaleMaxSpanRef = useRef<HTMLCanvasElement>(null);
  const timeScaleComboRef = useRef<HTMLCanvasElement>(null);
  const centerPositioningRef = useRef<HTMLCanvasElement>(null);
  const gridConfigurationRef = useRef<HTMLCanvasElement>(null);
  const tickConfigurationRef = useRef<HTMLCanvasElement>(null);
  const titleConfigurationRef = useRef<HTMLCanvasElement>(null);

  // Legend & Layout Options refs
  const legendEventsRef = useRef<HTMLCanvasElement>(null);
  const htmlLegendRef = useRef<HTMLCanvasElement>(null);
  const legendPointStyleRef = useRef<HTMLCanvasElement>(null);
  const legendPositionRef = useRef<HTMLCanvasElement>(null);
  const alignmentTitlePositionRef = useRef<HTMLCanvasElement>(null);

  // Tooltip & Interaction Modes refs
  const tooltipCustomRef = useRef<HTMLCanvasElement>(null);
  const tooltipContentRef = useRef<HTMLCanvasElement>(null);
  const tooltipExternalRef = useRef<HTMLCanvasElement>(null);
  const interactionModesRef = useRef<HTMLCanvasElement>(null);
  const tooltipPointStyleRef = useRef<HTMLCanvasElement>(null);
  const tooltipPositionRef = useRef<HTMLCanvasElement>(null);

  // Scriptable Options refs
  const scriptableBarRef = useRef<HTMLCanvasElement>(null);
  const scriptableBubbleRef = useRef<HTMLCanvasElement>(null);
  const scriptableLineRef = useRef<HTMLCanvasElement>(null);
  const scriptablePieRef = useRef<HTMLCanvasElement>(null);
  const scriptablePolarRef = useRef<HTMLCanvasElement>(null);
  const scriptableRadarRef = useRef<HTMLCanvasElement>(null);

  // Animations refs
  const animDelayRef = useRef<HTMLCanvasElement>(null);
  const animDropRef = useRef<HTMLCanvasElement>(null);
  const animLoopRef = useRef<HTMLCanvasElement>(null);
  const animProgressiveRef = useRef<HTMLCanvasElement>(null);
  const animProgressiveEasingRef = useRef<HTMLCanvasElement>(null);

  // Easing functions from Chart.js Animation system
  const easeOutQuart = (t: number) => 1 - (t - 1) * (t - 1) * (t - 1) * (t - 1);
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

  // Mouse tracking for tooltips - memoized to prevent recreation
  const handleMouseMove = useCallback(
    (
      event: React.MouseEvent<HTMLCanvasElement>,
      chartType: string,
      data: any[],
      labels?: string[]
    ) => {
      const canvas = event.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Hit detection based on chart type
      const hitResult = detectHit(canvas, mouseX, mouseY, chartType, data, labels);

      if (hitResult) {
        setTooltip({
          x: event.clientX,
          y: event.clientY,
          label: hitResult.label,
          value: hitResult.value,
          color: hitResult.color,
          visible: true,
        });
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    },
    [variant]
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  // Hit detection for different chart types
  const detectHit = (
    canvas: HTMLCanvasElement,
    mouseX: number,
    mouseY: number,
    chartType: string,
    data: any[],
    labels?: string[]
  ): { label: string; value: number | string; color: string } | null => {
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    const colors_arr =
      variant === 'r-huds'
        ? ['#29F2DF', '#FF006E', '#8338EC', '#FFBE0B', '#FB5607']
        : ['#00FF00', '#FFFF00', '#FF0000', '#00FFFF', '#FF00FF'];

    switch (chartType) {
      case 'line-multi': {
        // Check proximity to points in multiple datasets
        if (!Array.isArray(data) || data.length === 0) break;

        // data is array of datasets with {label, data, color, visible}
        const datasets = data as ChartDataset[];
        const maxValue = Math.max(...datasets.flatMap((ds) => ds.data), 100);
        const minValue = Math.min(...datasets.flatMap((ds) => ds.data), 0);
        const range = maxValue - minValue;

        let closestPoint: { label: string; value: number; color: string } | null = null;
        let minDistance = Infinity;

        for (let dsIndex = 0; dsIndex < datasets.length; dsIndex++) {
          const dataset = datasets[dsIndex];
          for (let i = 0; i < dataset.data.length; i++) {
            const value = dataset.data[i];
            const x = padding + (i * (width - 2 * padding)) / (dataset.data.length - 1);
            const normalizedValue = (value - minValue) / range;
            const y = height - padding - 40 - normalizedValue * (height - 2 * padding - 60);

            const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
            if (distance < 10 && distance < minDistance) {
              minDistance = distance;
              closestPoint = {
                label: `${dataset.label} - ${labels ? labels[i] : `Point ${i + 1}`}`,
                value: value,
                color: dataset.color,
              };
            }
          }
        }

        if (closestPoint) return closestPoint;
        break;
      }

      case 'line':
      case 'mixed':
      case 'scatter': {
        // Check proximity to points
        const dataArray = Array.isArray(data[0]) ? data : [data];
        for (let i = 0; i < dataArray[0].length; i++) {
          const value = chartType === 'scatter' ? data[i].y : dataArray[0][i];
          const x =
            chartType === 'scatter'
              ? padding + ((data[i].x + 10) / 20) * (width - 2 * padding)
              : padding + (i * (width - 2 * padding)) / (dataArray[0].length - 1);
          const y =
            chartType === 'scatter'
              ? height - padding - 40 - (value / 10) * (height - 2 * padding - 60)
              : height - padding - 40 - (value / 100) * (height - 2 * padding - 60);

          const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
          if (distance < 10) {
            return {
              label: labels ? labels[i] : `Point ${i + 1}`,
              value: chartType === 'scatter' ? `(${data[i].x}, ${data[i].y})` : value,
              color: colors_arr[0],
            };
          }
        }
        break;
      }

      case 'scatter-multi': {
        // Check proximity to points in multiple scatter datasets
        const datasets = data as any[][];
        const chartHeight = height - 2 * padding - 60;
        const chartWidth = width - 2 * padding;

        let closestPoint: { label: string; value: string; color: string; distance: number } | null =
          null;

        // Dataset 1 (left Y axis, 0-100)
        for (let i = 0; i < datasets[0].length; i++) {
          const point = datasets[0][i];
          const x = padding + (point.x / 100) * chartWidth;
          const y = height - padding - 40 - (point.y / 100) * chartHeight;

          const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
          if (distance < 10) {
            if (!closestPoint || distance < closestPoint.distance) {
              closestPoint = {
                label: `${labels ? labels[0] : 'Data 1'} - Point ${i + 1}`,
                value: `(${point.x}, ${point.y})`,
                color: colors_arr[0],
                distance,
              };
            }
          }
        }

        // Dataset 2 (right Y axis, 0-200)
        for (let i = 0; i < datasets[1].length; i++) {
          const point = datasets[1][i];
          const x = padding + (point.x / 100) * chartWidth;
          const y = height - padding - 40 - (point.y / 200) * chartHeight;

          const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
          if (distance < 10) {
            if (!closestPoint || distance < closestPoint.distance) {
              closestPoint = {
                label: `${labels ? labels[1] : 'Data 2'} - Point ${i + 1}`,
                value: `(${point.x}, ${point.y})`,
                color: colors_arr[1],
                distance,
              };
            }
          }
        }

        if (closestPoint) {
          const { distance, ...result } = closestPoint;
          return result;
        }
        break;
      }

      case 'bar': {
        // Check if mouse is over a bar
        const barWidth = ((width - 2 * padding) / data.length) * 0.7;
        const maxValue = Math.max(...data);
        for (let i = 0; i < data.length; i++) {
          const x =
            padding +
            (i * (width - 2 * padding)) / data.length +
            ((width - 2 * padding) / data.length) * 0.15;
          const barHeight = (data[i] / maxValue) * (height - 2 * padding - 60);
          const y = height - padding - 40 - barHeight;

          if (
            mouseX >= x &&
            mouseX <= x + barWidth &&
            mouseY >= y &&
            mouseY <= height - padding - 30
          ) {
            return {
              label: labels ? labels[i] : `Bar ${i + 1}`,
              value: data[i],
              color: colors_arr[i % colors_arr.length],
            };
          }
        }
        break;
      }

      case 'bubble': {
        // Check proximity to bubbles
        for (let i = 0; i < data.length; i++) {
          const bubble = data[i];
          const x = padding + (bubble.x / 50) * (width - 2 * padding);
          const y = height - padding - 40 - (bubble.y / 50) * (height - 2 * padding - 60);
          const radius = (bubble.r / 25) * 30;

          const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
          if (distance < radius) {
            return {
              label: `Bubble ${i + 1}`,
              value: `x:${bubble.x}, y:${bubble.y}, r:${bubble.r}`,
              color: colors_arr[0],
            };
          }
        }
        break;
      }

      case 'pie':
      case 'doughnut': {
        // Check if mouse is in a pie/doughnut slice
        const centerX = width / 2;
        const centerY = height / 2 + 10;
        const outerRadius = Math.min(width, height) / 3;
        const innerRadius = chartType === 'doughnut' ? outerRadius * 0.6 : 0;

        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= innerRadius && distance <= outerRadius) {
          let angle = Math.atan2(dy, dx);
          if (angle < -Math.PI / 2) angle += 2 * Math.PI;
          angle += Math.PI / 2;

          const total = data.reduce((a: number, b: number) => a + b, 0);
          let currentAngle = 0;

          for (let i = 0; i < data.length; i++) {
            const sliceAngle = (data[i] / total) * Math.PI * 2;
            if (angle >= currentAngle && angle <= currentAngle + sliceAngle) {
              return {
                label: labels ? labels[i] : `Slice ${i + 1}`,
                value: `${data[i]} (${((data[i] / total) * 100).toFixed(1)}%)`,
                color: colors_arr[i % colors_arr.length],
              };
            }
            currentAngle += sliceAngle;
          }
        }
        break;
      }

      case 'radar': {
        // Check proximity to radar points
        const centerX = width / 2;
        const centerY = height / 2 + 10;
        const radius = Math.min(width, height) / 3;
        const sides = data.length;

        for (let i = 0; i < sides; i++) {
          const angle = (i * Math.PI * 2) / sides - Math.PI / 2;
          const x = centerX + Math.cos(angle) * ((data[i] / 100) * radius);
          const y = centerY + Math.sin(angle) * ((data[i] / 100) * radius);

          const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
          if (distance < 10) {
            return {
              label: labels ? labels[i] : `Point ${i + 1}`,
              value: data[i],
              color: colors_arr[0],
            };
          }
        }
        break;
      }

      case 'polar': {
        // Check if mouse is in a polar segment
        const centerX = width / 2;
        const centerY = height / 2 + 10;
        const maxRadius = Math.min(width, height) / 3;

        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let angle = Math.atan2(dy, dx);
        if (angle < -Math.PI / 2) angle += 2 * Math.PI;
        angle += Math.PI / 2;

        const maxValue = Math.max(...data);
        const segmentAngle = (Math.PI * 2) / data.length;

        for (let i = 0; i < data.length; i++) {
          const segmentRadius = (data[i] / maxValue) * maxRadius;
          const startAngle = i * segmentAngle;
          const endAngle = (i + 1) * segmentAngle;

          if (angle >= startAngle && angle <= endAngle && distance <= segmentRadius) {
            return {
              label: labels ? labels[i] : `Segment ${i + 1}`,
              value: data[i],
              color: colors_arr[i % colors_arr.length],
            };
          }
        }
        break;
      }

      case 'stacked-bar-line': {
        // Check proximity to line points and bars
        const barData1 = [20, 25, 30, 35, 25, 30];
        const barData2 = [15, 20, 25, 20, 30, 25];
        const lineData = data; // [65, 70, 80, 75, 85, 80]
        const bottomPadding = 80;
        const chartHeight = height - 2 * padding - bottomPadding;
        const chartWidth = width - 2 * padding;
        const maxValue = 100;
        const barWidth = (chartWidth / barData1.length) * 0.6;

        // Check line points first (higher priority)
        for (let i = 0; i < lineData.length; i++) {
          const x = padding + (i * chartWidth) / barData1.length + chartWidth / barData1.length / 2;
          const y = height - padding - bottomPadding - (lineData[i] / maxValue) * chartHeight;

          const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
          if (distance < 10) {
            return {
              label: `${labels ? labels[i] : `Point ${i + 1}`} (Line)`,
              value: lineData[i],
              color: colors_arr[0],
            };
          }
        }

        // Check bars
        for (let i = 0; i < barData1.length; i++) {
          const x =
            padding +
            (i * chartWidth) / barData1.length +
            (chartWidth / barData1.length - barWidth) / 2;
          const fullHeight1 = (barData1[i] / maxValue) * chartHeight;
          const fullHeight2 = (barData2[i] / maxValue) * chartHeight;
          const y1 = height - padding - bottomPadding - fullHeight1;
          const y2 = y1 - fullHeight2;

          // Check bottom bar
          if (
            mouseX >= x &&
            mouseX <= x + barWidth &&
            mouseY >= y1 &&
            mouseY <= height - padding - bottomPadding
          ) {
            return {
              label: `${labels ? labels[i] : `Bar ${i + 1}`} (Bottom)`,
              value: barData1[i],
              color: colors_arr[1],
            };
          }

          // Check top bar
          if (mouseX >= x && mouseX <= x + barWidth && mouseY >= y2 && mouseY <= y1) {
            return {
              label: `${labels ? labels[i] : `Bar ${i + 1}`} (Top)`,
              value: barData2[i],
              color: colors_arr[2],
            };
          }
        }
        break;
      }

      case 'line-time-axis': {
        // Line Chart - Time Axis
        const timeData = [65, 59, 80, 81, 56, 55, 70, 75, 68];
        const bottomPadding = 70;
        const chartHeight = height - 2 * padding - bottomPadding;
        const chartBottom = height - padding - bottomPadding;
        const chartWidth = width - 2 * padding;
        const maxValue = 100;

        for (let i = 0; i < timeData.length; i++) {
          const x = padding + (i * chartWidth) / (timeData.length - 1);
          const y = chartBottom - (timeData[i] / maxValue) * chartHeight;

          const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
          if (distance < 10) {
            return {
              label: labels ? labels[i] : `Point ${i + 1}`,
              value: timeData[i],
              color: colors_arr[0],
            };
          }
        }
        break;
      }

      case 'line-stacked': {
        // Stacked Line Chart
        const data1 = [20, 25, 30, 35, 25, 30];
        const data2 = [15, 20, 25, 20, 30, 25];
        const data3 = [10, 15, 20, 15, 20, 15];
        const bottomPadding = 70;
        const chartHeight = height - 2 * padding - bottomPadding;
        const chartBottom = height - padding - bottomPadding;
        const chartWidth = width - 2 * padding;
        const maxValue = 100;

        // Calculate stacked values
        const stacked1 = data1;
        const stacked2 = data1.map((v, i) => v + data2[i]);
        const stacked3 = data1.map((v, i) => v + data2[i] + data3[i]);

        const layers = [
          { data: stacked3, label: 'Layer 3', color: colors_arr[2] },
          { data: stacked2, label: 'Layer 2', color: colors_arr[1] },
          { data: stacked1, label: 'Layer 1', color: colors_arr[0] },
        ];

        for (const layer of layers) {
          for (let i = 0; i < layer.data.length; i++) {
            const x = padding + (i * chartWidth) / (layer.data.length - 1);
            const y = chartBottom - (layer.data[i] / maxValue) * chartHeight;

            const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
            if (distance < 10) {
              return {
                label: `${layer.label} - ${labels ? labels[i] : `Point ${i + 1}`}`,
                value: layer.data[i],
                color: layer.color,
              };
            }
          }
        }
        break;
      }

      case 'stacked-linear-category': {
        // Stacked Linear / Category
        const dataset1 = [20, 30, 25, 35];
        const dataset2 = [15, 20, 30, 25];
        const dataset3 = [10, 15, 20, 15];
        const categories = ['Cat A', 'Cat B', 'Cat C', 'Cat D'];
        const bottomPadding = 70;
        const chartHeight = height - 2 * padding - bottomPadding;
        const chartBottom = height - padding - bottomPadding;
        const chartWidth = width - 2 * padding;
        const maxTotal = Math.max(
          ...categories.map((_, i) => dataset1[i] + dataset2[i] + dataset3[i])
        );

        // Calculate stacked values
        const stacked1 = dataset1;
        const stacked2 = dataset1.map((v, i) => v + dataset2[i]);
        const stacked3 = dataset1.map((v, i) => v + dataset2[i] + dataset3[i]);

        const datasets = [
          { data: stacked3, label: 'Dataset 3', color: colors_arr[2] },
          { data: stacked2, label: 'Dataset 2', color: colors_arr[1] },
          { data: stacked1, label: 'Dataset 1', color: colors_arr[0] },
        ];

        for (const dataset of datasets) {
          for (let i = 0; i < dataset.data.length; i++) {
            const x = padding + (i * chartWidth) / (categories.length - 1);
            const y = chartBottom - (dataset.data[i] / maxTotal) * chartHeight;

            const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
            if (distance < 10) {
              return {
                label: `${dataset.label} - ${categories[i]}`,
                value: dataset.data[i],
                color: dataset.color,
              };
            }
          }
        }
        break;
      }
    }

    return null;
  };

  // Animation loop with pause/resume support
  useEffect(() => {
    if (!isAnimating || isPaused) return;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current - totalPausedTimeRef.current;
      const duration = 1500; // 1.5 seconds animation
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = easeOutQuart(progress);

      setAnimationProgress(easedProgress);

      // Call progress callback
      onAnimationProgress(easedProgress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        // Call complete callback
        onAnimationComplete();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, isPaused]);

  // Handle pause
  const handlePause = () => {
    if (!isAnimating || isPaused) return;
    setIsPaused(true);
    pausedTimeRef.current = Date.now();
  };

  // Handle resume
  const handleResume = () => {
    if (!isPaused) return;
    setIsPaused(false);
    totalPausedTimeRef.current += Date.now() - pausedTimeRef.current;
  };

  // Handle replay
  const handleReplay = () => {
    startTimeRef.current = Date.now();
    totalPausedTimeRef.current = 0;
    pausedTimeRef.current = 0;
    setAnimationProgress(0);
    setIsAnimating(true);
    setIsPaused(false);
  };

  // Reset animation when variant changes
  useEffect(() => {
    startTimeRef.current = Date.now();
    totalPausedTimeRef.current = 0;
    pausedTimeRef.current = 0;
    setAnimationProgress(0);
    setIsAnimating(true);
    setIsPaused(false);
  }, [variant]);

  // Responsive resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setChartDimensions({ width, height: 300 });
      }
    };

    // Initial size
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Legend click handler
  const handleLegendClick = (datasetIndex: number) => {
    setLineDatasets((prev) =>
      prev.map((dataset, index) =>
        index === datasetIndex ? { ...dataset, visible: !dataset.visible } : dataset
      )
    );
  };

  // Bar legend click handler
  const handleBarLegendClick = (datasetIndex: number) => {
    setBarDatasets((prev) =>
      prev.map((dataset, index) =>
        index === datasetIndex ? { ...dataset, visible: !dataset.visible } : dataset
      )
    );
  };

  // Theme colors
  const colors =
    variant === 'r-huds'
      ? {
          primary: '#29F2DF',
          secondary: '#FF006E',
          tertiary: '#8338EC',
          quaternary: '#FFBE0B',
          quinary: '#FB5607',
        }
      : {
          primary: '#00FF00',
          secondary: '#FFFF00',
          tertiary: '#FF0000',
          quaternary: '#00FFFF',
          quinary: '#FF00FF',
        };

  // Legend Events datasets state (moved after colors definition)
  const [legendEventDatasets, setLegendEventDatasets] = useState<ChartDataset[]>([
    { label: 'Dataset 1', data: [65, 59, 80, 81, 56, 55], color: colors.primary, visible: true },
    { label: 'Dataset 2', data: [45, 69, 70, 91, 66, 75], color: colors.secondary, visible: true },
    { label: 'Dataset 3', data: [35, 49, 60, 71, 46, 65], color: colors.tertiary, visible: true },
  ]);

  // Helper functions for chart features
  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: number,
    options: typeof gridOptions
  ) => {
    if (!options.display) return;

    const gridColor =
      variant === 'r-huds' ? options.color : options.color.replace('41, 242, 223', '0, 255, 0');

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = options.lineWidth;

    // Set line dash if specified
    if (options.borderDash.length > 0) {
      ctx.setLineDash(options.borderDash);
    }

    // Draw horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Draw ticks
      if (options.drawTicks) {
        ctx.beginPath();
        ctx.moveTo(padding - options.tickLength, y);
        ctx.lineTo(padding, y);
        ctx.stroke();
      }
    }

    // Draw border
    if (options.drawBorder) {
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(padding, padding, width - 2 * padding, height - 2 * padding - 60);
    }

    // Reset line dash
    ctx.setLineDash([]);
  };

  const drawCustomTitle = (
    ctx: CanvasRenderingContext2D,
    title: string,
    width: number,
    height: number,
    options: typeof titleOptions
  ) => {
    if (!options.display) return;

    ctx.font = `${options.font.weight} ${options.font.size}px ${options.font.family}`;
    ctx.fillStyle = colors.primary;

    let x = width / 2;
    let y = options.padding;

    // Handle alignment
    if (options.align === 'start') {
      ctx.textAlign = 'left';
      x = options.padding;
    } else if (options.align === 'end') {
      ctx.textAlign = 'right';
      x = width - options.padding;
    } else {
      ctx.textAlign = 'center';
    }

    // Handle position
    if (options.position === 'bottom') {
      y = height - options.padding;
    }

    ctx.fillText(title, x, y);
  };

  const drawLegend = (
    ctx: CanvasRenderingContext2D,
    items: { label: string; color: string }[],
    x: number,
    y: number
  ) => {
    const itemHeight = 20;
    const itemWidth = 150;
    const padding = 10;

    // Legend background
    ctx.fillStyle = variant === 'r-huds' ? 'rgba(41, 242, 223, 0.1)' : 'rgba(0, 255, 0, 0.1)';
    ctx.fillRect(
      x - padding,
      y - padding,
      itemWidth + padding * 2,
      items.length * itemHeight + padding * 2
    );

    // Legend border
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1;
    ctx.strokeRect(
      x - padding,
      y - padding,
      itemWidth + padding * 2,
      items.length * itemHeight + padding * 2
    );

    // Legend items
    ctx.font = '12px monospace';
    ctx.fillStyle = colors.primary;
    items.forEach((item, i) => {
      const itemY = y + i * itemHeight;

      // Color box
      ctx.fillStyle = item.color;
      ctx.fillRect(x, itemY, 12, 12);

      // Label
      ctx.fillStyle = colors.primary;
      ctx.textAlign = 'left';
      ctx.fillText(item.label, x + 18, itemY + 10);
    });
  };

  const drawTitle = (ctx: CanvasRenderingContext2D, title: string, x: number, y: number) => {
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'center';
    ctx.fillText(title, x, y);
  };

  // Data validation helper
  const validateData = (data: any[]): boolean => {
    if (!Array.isArray(data) || data.length === 0) return false;
    return data.every((val) => typeof val === 'number' && !isNaN(val) && isFinite(val));
  };

  // Simple canvas drawing functions
  const drawLineChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    // Clear with background
    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Draw title with fade-in animation
    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Line Chart - Multiple Datasets', width / 2, 20);
    ctx.globalAlpha = 1;

    // Calculate scale based on all visible datasets
    const visibleDatasets = lineDatasets.filter((ds) => ds.visible);
    if (visibleDatasets.length === 0) {
      ctx.fillStyle = colors.primary;
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('No visible datasets', width / 2, height / 2);
      return;
    }

    // Validate all datasets
    const allValid = visibleDatasets.every((ds) => validateData(ds.data));
    if (!allValid) {
      ctx.fillStyle = colors.primary;
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Invalid data detected', width / 2, height / 2);
      return;
    }

    // Find max value for scaling
    const maxValue = Math.max(...visibleDatasets.flatMap((ds) => ds.data), 100);
    const minValue = Math.min(...visibleDatasets.flatMap((ds) => ds.data), 0);
    const range = maxValue - minValue;
    const stepSize = Math.ceil(range / 5);

    // Draw grid with animation effect
    ctx.strokeStyle = `${colors.primary}33`;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.globalAlpha = progress;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels with custom scale
      const value = Math.round(maxValue - i * stepSize);
      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(value.toString(), padding - 10, y + 4);
      ctx.globalAlpha = 1;
    }

    // Draw X-axis labels
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 5);
    }
    ctx.globalAlpha = 1;

    // Draw each visible dataset
    visibleDatasets.forEach((dataset, datasetIndex) => {
      const data = dataset.data;
      const datasetColor = dataset.color;

      // Draw line with progressive animation
      ctx.strokeStyle = datasetColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const animatedLength = Math.floor(data.length * progress);
      for (let i = 0; i <= animatedLength; i++) {
        const index = Math.min(i, data.length - 1);
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
        const normalizedValue = (data[index] - minValue) / range;
        const y = height - padding - 40 - normalizedValue * (height - 2 * padding - 60);

        // Interpolate last point for smooth animation
        if (i === animatedLength && i < data.length - 1) {
          const fraction = data.length * progress - animatedLength;
          const nextIndex = i + 1;
          const nextX = padding + (nextIndex * (width - 2 * padding)) / (data.length - 1);
          const nextNormalizedValue = (data[nextIndex] - minValue) / range;
          const nextY = height - padding - 40 - nextNormalizedValue * (height - 2 * padding - 60);
          const interpX = x + (nextX - x) * fraction;
          const interpY = y + (nextY - y) * fraction;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          ctx.lineTo(interpX, interpY);
        } else {
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw filled area under line with animation
      ctx.fillStyle = `${datasetColor}22`;
      ctx.globalAlpha = progress * 0.3;
      ctx.beginPath();
      for (let i = 0; i <= animatedLength; i++) {
        const index = Math.min(i, data.length - 1);
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
        const normalizedValue = (data[index] - minValue) / range;
        const y = height - padding - 40 - normalizedValue * (height - 2 * padding - 60);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const lastX = padding + (animatedLength * (width - 2 * padding)) / (data.length - 1);
      ctx.lineTo(lastX, height - padding - 30);
      ctx.lineTo(padding, height - padding - 30);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw points with scale animation
      ctx.fillStyle = datasetColor;
      for (let i = 0; i < data.length; i++) {
        if (i / data.length > progress) break;

        const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
        const normalizedValue = (data[i] - minValue) / range;
        const y = height - padding - 40 - normalizedValue * (height - 2 * padding - 60);

        // Scale animation for points
        const pointProgress = Math.min(1, (progress * data.length - i) * 2);
        const scale = easeOutQuart(Math.max(0, pointProgress));
        const radius = 5 * scale;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Point border
        ctx.strokeStyle = variant === 'r-huds' ? '#0a0e27' : '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw legend with fade-in
    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      visibleDatasets.map((ds) => ({ label: ds.label, color: ds.color })),
      width - 120,
      40
    );
    ctx.globalAlpha = 1;
  };

  const drawBarChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const labels = ['Product A', 'Product B', 'Product C', 'Product D'];

    // Clear with background
    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Draw title with fade-in
    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Bar Chart - Multiple Datasets Comparison', width / 2, 20);
    ctx.globalAlpha = 1;

    // Get visible datasets
    const visibleDatasets = barDatasets.filter((ds) => ds.visible);
    if (visibleDatasets.length === 0) {
      ctx.fillStyle = colors.primary;
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('No visible datasets', width / 2, height / 2);
      return;
    }

    // Validate all datasets
    const allValid = visibleDatasets.every((ds) => validateData(ds.data));
    if (!allValid) {
      ctx.fillStyle = colors.primary;
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Invalid data detected', width / 2, height / 2);
      return;
    }

    // Find max value for scaling
    const maxValue = Math.max(...visibleDatasets.flatMap((ds) => ds.data), 20);

    // Draw grid
    ctx.strokeStyle = `${colors.primary}33`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = progress;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      const value = Math.round(maxValue - (i * maxValue) / 5);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }
    ctx.globalAlpha = 1;

    // Calculate bar dimensions
    const numCategories = labels.length;
    const numDatasets = visibleDatasets.length;
    const categoryWidth = (width - 2 * padding) / numCategories;
    const barWidth = (categoryWidth * 0.8) / numDatasets;
    const barGap = categoryWidth * 0.1;

    // Draw bars for each dataset
    visibleDatasets.forEach((dataset, datasetIndex) => {
      const data = dataset.data;
      const datasetColor = dataset.color;

      for (let i = 0; i < data.length; i++) {
        const x = padding + i * categoryWidth + barGap / 2 + datasetIndex * barWidth;

        // Animated bar height with delay for each bar
        const barDelay = (i * numDatasets + datasetIndex) * 0.08;
        const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
        const easedBarProgress = easeOutQuart(barProgress);

        const fullBarHeight = (data[i] / maxValue) * (height - 2 * padding - 60);
        const barHeight = fullBarHeight * easedBarProgress;
        const y = height - padding - 40 - barHeight;

        // Bar with glow effect
        ctx.fillStyle = datasetColor;
        ctx.shadowColor = datasetColor;
        ctx.shadowBlur = 10 * easedBarProgress;
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.shadowBlur = 0;

        // Bar border
        ctx.strokeStyle = datasetColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);

        // Value on bar with scale animation
        if (easedBarProgress > 0.5) {
          ctx.globalAlpha = (easedBarProgress - 0.5) * 2;
          ctx.fillStyle = datasetColor;
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(data[i].toString(), x + barWidth / 2, y - 5);
          ctx.globalAlpha = 1;
        }
      }
    });

    // Draw category labels
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + i * categoryWidth + categoryWidth / 2;
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    // Draw legend with fade-in
    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      visibleDatasets.map((ds) => ({ label: ds.label, color: ds.color })),
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  const drawPieChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radius = Math.min(width, height) / 3;
    const data = [300, 50, 100];
    const labels = ['Red', 'Blue', 'Yellow'];
    const colors_arr = [colors.primary, colors.secondary, colors.tertiary];

    // Clear with background
    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Draw custom title with options
    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Pie Chart - Data Distribution', width, height, titleOptions);
    ctx.globalAlpha = 1;

    // Rotation animation - pie grows from 0 to full circle
    const animatedAngle = easeOutQuart(progress) * Math.PI * 2;

    // Draw pie with borders and glow
    const total = data.reduce((a, b) => a + b, 0);
    let currentAngle = -Math.PI / 2;
    let drawnAngle = 0;

    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i] / total) * Math.PI * 2;

      // Calculate how much of this slice to draw
      const remainingAngle = animatedAngle - drawnAngle;
      if (remainingAngle <= 0) break;

      const drawSliceAngle = Math.min(sliceAngle, remainingAngle);
      const sliceProgress = drawSliceAngle / sliceAngle;

      // Slice with glow
      ctx.fillStyle = colors_arr[i];
      ctx.shadowColor = colors_arr[i];
      ctx.shadowBlur = 15 * progress;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + drawSliceAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Slice border
      ctx.strokeStyle = colors_arr[i];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + drawSliceAngle);
      ctx.lineTo(centerX, centerY);
      ctx.stroke();

      // Percentage label with fade-in (only show when slice is mostly visible)
      if (sliceProgress > 0.5) {
        const labelAlpha = (sliceProgress - 0.5) * 2;
        ctx.globalAlpha = labelAlpha;

        const labelAngle = currentAngle + drawSliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.65);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.65);
        const percentage = ((data[i] / total) * 100).toFixed(1);

        ctx.fillStyle = variant === 'r-huds' ? '#0a0e27' : '#000000';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${percentage}%`, labelX, labelY);
        ctx.globalAlpha = 1;
      }

      currentAngle += sliceAngle;
      drawnAngle += drawSliceAngle;
    }

    // Draw legend with fade-in
    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      labels.map((label, i) => ({ label, color: colors_arr[i] })),
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  const drawDoughnutChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const outerRadius = Math.min(width, height) / 3;
    const innerRadius = outerRadius * 0.6;
    const data = [55, 30, 15];
    const labels = ['Desktop', 'Mobile', 'Tablet'];
    const colors_arr = [colors.primary, colors.secondary, colors.tertiary];

    // Clear with background
    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Draw title with fade-in
    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Doughnut Chart - Device Distribution', width / 2, 20);
    ctx.globalAlpha = 1;

    // Rotation animation - doughnut grows from 0 to full circle
    const animatedAngle = easeOutQuart(progress) * Math.PI * 2;

    // Draw doughnut with glow effect
    const total = data.reduce((a, b) => a + b, 0);
    let currentAngle = -Math.PI / 2;
    let drawnAngle = 0;

    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i] / total) * Math.PI * 2;

      // Calculate how much of this slice to draw
      const remainingAngle = animatedAngle - drawnAngle;
      if (remainingAngle <= 0) break;

      const drawSliceAngle = Math.min(sliceAngle, remainingAngle);

      // Outer arc with glow
      ctx.fillStyle = colors_arr[i];
      ctx.shadowColor = colors_arr[i];
      ctx.shadowBlur = 15 * progress;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + drawSliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + drawSliceAngle, currentAngle, true);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Border
      ctx.strokeStyle = colors_arr[i];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + drawSliceAngle);
      ctx.stroke();

      currentAngle += sliceAngle;
      drawnAngle += drawSliceAngle;
    }

    // Center text with fade-in
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('100%', centerX, centerY - 5);
    ctx.font = '12px monospace';
    ctx.fillText('Total', centerX, centerY + 12);
    ctx.globalAlpha = 1;

    // Draw legend with fade-in
    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      labels.map((label, i) => ({ label, color: colors_arr[i] })),
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  const drawRadarChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radius = Math.min(width, height) / 3;
    const data = [80, 90, 70, 85, 75];
    const labels = ['Speed', 'Power', 'Defense', 'Agility', 'Intelligence'];
    const sides = data.length;

    // Clear with background
    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Draw title with fade-in
    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Radar Chart - Multi-Variable Analysis', width / 2, 20);
    ctx.globalAlpha = 1;

    // Draw grid with labels (fade-in)
    ctx.globalAlpha = progress;
    ctx.strokeStyle = `${colors.primary}33`;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      for (let j = 0; j < sides; j++) {
        const angle = (j * Math.PI * 2) / sides - Math.PI / 2;
        const x = centerX + Math.cos(angle) * ((radius * i) / 5);
        const y = centerY + Math.sin(angle) * ((radius * i) / 5);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Grid labels
      ctx.fillStyle = colors.primary;
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${i * 20}`, centerX, centerY - (radius * i) / 5 - 5);
    }

    // Draw axis lines
    ctx.strokeStyle = `${colors.primary}66`;
    ctx.lineWidth = 1;
    for (let i = 0; i < sides; i++) {
      const angle = (i * Math.PI * 2) / sides - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Axis labels
      const labelX = centerX + Math.cos(angle) * (radius + 25);
      const labelY = centerY + Math.sin(angle) * (radius + 25);
      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], labelX, labelY);
    }
    ctx.globalAlpha = 1;

    // Polygon scale animation - grows from center
    const easedProgress = easeOutQuart(progress);

    // Draw data polygon with glow
    ctx.strokeStyle = colors.primary;
    ctx.fillStyle = `${colors.primary}33`;
    ctx.lineWidth = 2;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 10 * progress;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (i * Math.PI * 2) / sides - Math.PI / 2;
      const animatedRadius = (data[i] / 100) * radius * easedProgress;
      const x = centerX + Math.cos(angle) * animatedRadius;
      const y = centerY + Math.sin(angle) * animatedRadius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw data points with scale animation
    ctx.fillStyle = colors.primary;
    for (let i = 0; i < sides; i++) {
      const angle = (i * Math.PI * 2) / sides - Math.PI / 2;
      const animatedRadius = (data[i] / 100) * radius * easedProgress;
      const x = centerX + Math.cos(angle) * animatedRadius;
      const y = centerY + Math.sin(angle) * animatedRadius;

      // Point scale animation
      const pointProgress = Math.min(1, progress * 1.5);
      const pointRadius = 4 * easeOutQuart(pointProgress);

      ctx.beginPath();
      ctx.arc(x, y, pointRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawPolarChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const maxRadius = Math.min(width, height) / 3;
    const data = [11, 16, 7, 3, 14];
    const labels = ['A', 'B', 'C', 'D', 'E'];
    const colors_arr = [
      colors.primary,
      colors.secondary,
      colors.tertiary,
      colors.quaternary,
      colors.quinary,
    ];

    // Clear with background
    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Draw title with fade-in
    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Polar Area Chart - Radial Distribution', width / 2, 20);
    ctx.globalAlpha = 1;

    // Radial scale animation - segments grow from center
    const easedProgress = easeOutQuart(progress);

    const maxValue = Math.max(...data);
    for (let i = 0; i < data.length; i++) {
      const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
      const nextAngle = ((i + 1) * Math.PI * 2) / data.length - Math.PI / 2;
      const fullRadius = (data[i] / maxValue) * maxRadius;

      // Animated radius with stagger delay
      const segmentDelay = i * 0.1;
      const segmentProgress = Math.max(
        0,
        Math.min(1, (progress - segmentDelay) / (1 - segmentDelay))
      );
      const radius = fullRadius * easeOutQuart(segmentProgress);

      // Segment with glow
      ctx.fillStyle = colors_arr[i];
      ctx.shadowColor = colors_arr[i];
      ctx.shadowBlur = 15 * segmentProgress;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, nextAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Segment border
      ctx.strokeStyle = colors_arr[i];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, nextAngle);
      ctx.lineTo(centerX, centerY);
      ctx.stroke();

      // Label with fade-in (only show when segment is mostly visible)
      if (segmentProgress > 0.5) {
        ctx.globalAlpha = (segmentProgress - 0.5) * 2;

        const labelAngle = angle + (nextAngle - angle) / 2;
        const labelRadius = radius + 30;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;

        ctx.fillStyle = colors.primary;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${labels[i]} (${data[i]})`, labelX, labelY);
        ctx.globalAlpha = 1;
      }
    }

    // Draw legend with fade-in
    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      labels.map((label, i) => ({ label, color: colors_arr[i] })),
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  const drawBubbleChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [
      { x: 20, y: 30, r: 15 },
      { x: 40, y: 10, r: 10 },
      { x: 30, y: 20, r: 20 },
    ];

    // Clear with background
    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Draw title with fade-in
    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Bubble Chart - 3D Data Visualization', width / 2, 20);
    ctx.globalAlpha = 1;

    // Draw grid with fade-in
    ctx.globalAlpha = progress;
    ctx.strokeStyle = `${colors.primary}33`;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${50 - i * 10}`, padding - 10, y + 4);
    }

    // X-axis labels
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i * (width - 2 * padding)) / 5;
      ctx.fillText(`${i * 10}`, x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    // Draw bubbles with scale animation
    for (let i = 0; i < data.length; i++) {
      const bubble = data[i];
      const x = padding + (bubble.x / 50) * (width - 2 * padding);
      const y = height - padding - 40 - (bubble.y / 50) * (height - 2 * padding - 60);
      const fullRadius = (bubble.r / 25) * 30;

      // Staggered scale animation for each bubble
      const bubbleDelay = i * 0.15;
      const bubbleProgress = Math.max(0, Math.min(1, (progress - bubbleDelay) / (1 - bubbleDelay)));
      const easedBubbleProgress = easeOutQuart(bubbleProgress);
      const radius = fullRadius * easedBubbleProgress;

      ctx.fillStyle = `${colors.primary}66`;
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 15 * easedBubbleProgress;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Bubble border
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Value label with fade-in (only show when bubble is mostly visible)
      if (easedBubbleProgress > 0.5) {
        ctx.globalAlpha = (easedBubbleProgress - 0.5) * 2;
        ctx.fillStyle = colors.primary;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(bubble.r.toString(), x, y + 4);
        ctx.globalAlpha = 1;
      }
    }

    // Draw legend with fade-in
    ctx.globalAlpha = progress;
    drawLegend(ctx, [{ label: 'Bubble Size = Value', color: colors.primary }], width - 180, 40);
    ctx.globalAlpha = 1;
  };

  const drawScatterChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [
      { x: -10, y: 0 },
      { x: 0, y: 10 },
      { x: 10, y: 5 },
      { x: 0.5, y: 5.5 },
    ];

    // Clear with background
    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Draw title with fade-in
    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Scatter Chart - Correlation Analysis', width / 2, 20);
    ctx.globalAlpha = 1;

    // Draw grid with fade-in
    ctx.globalAlpha = progress;
    ctx.strokeStyle = `${colors.primary}33`;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${10 - i * 2}`, padding - 10, y + 4);
    }

    // X-axis labels
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i * (width - 2 * padding)) / 5;
      ctx.fillText(`${-10 + i * 4}`, x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    // Draw trend line with animation
    const trendProgress = easeOutQuart(progress);
    ctx.strokeStyle = `${colors.secondary}44`;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.globalAlpha = progress;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - 30);
    const trendEndX = padding + (width - 2 * padding) * trendProgress;
    const trendEndY = height - padding - 40 - (height - 2 * padding - 60) * trendProgress;
    ctx.lineTo(trendEndX, trendEndY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Draw points with scale animation
    ctx.fillStyle = colors.primary;
    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      const x = padding + ((point.x + 10) / 20) * (width - 2 * padding);
      const y = height - padding - 40 - (point.y / 10) * (height - 2 * padding - 60);

      // Staggered scale animation for each point
      const pointDelay = i * 0.15;
      const pointProgress = Math.max(0, Math.min(1, (progress - pointDelay) / (1 - pointDelay)));
      const easedPointProgress = easeOutQuart(pointProgress);
      const pointRadius = 6 * easedPointProgress;

      // Point with glow
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 10 * easedPointProgress;
      ctx.beginPath();
      ctx.arc(x, y, pointRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Point border
      ctx.strokeStyle = variant === 'r-huds' ? '#0a0e27' : '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, pointRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw legend with fade-in
    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Data Points', color: colors.primary },
        { label: 'Trend Line', color: colors.secondary },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // Bar Chart with Border Radius
  const drawBarChartWithBorderRadius = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56, 55, 70];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const borderRadius = 8;

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Bar Chart with Border Radius', width / 2, 20);
    ctx.globalAlpha = 1;

    // Draw grid
    ctx.strokeStyle = `${colors.primary}33`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = progress;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      const value = Math.round(100 - (i * 100) / 5);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }
    ctx.globalAlpha = 1;

    // Draw bars with rounded corners
    const barWidth = ((width - 2 * padding) / data.length) * 0.25;
    const maxValue = 100;

    for (let i = 0; i < data.length; i++) {
      const x =
        padding +
        (i * (width - 2 * padding)) / data.length +
        ((width - 2 * padding) / data.length) * 0.15;

      const barDelay = i * 0.08;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
      const easedBarProgress = easeOutQuart(barProgress);

      const fullBarHeight = (data[i] / maxValue) * (height - 2 * padding - 60);
      const barHeight = fullBarHeight * 0.75 * easedBarProgress;
      const y = height - padding - 60 - barHeight;

      // Draw rounded rectangle
      ctx.fillStyle = colors.primary;
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 10 * easedBarProgress;

      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + barWidth - borderRadius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + borderRadius);
      ctx.lineTo(x + barWidth, height - padding - 60);
      ctx.lineTo(x, height - padding - 60);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // X-axis labels
      ctx.globalAlpha = progress;
      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barWidth / 2, height - padding + 10);
      ctx.globalAlpha = 1;
    }
  };

  // Floating Bars
  const drawFloatingBars = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [
      { start: 20, end: 65 },
      { start: 30, end: 80 },
      { start: 15, end: 70 },
      { start: 40, end: 90 },
      { start: 25, end: 75 },
    ];
    const labels = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Floating Bars (Range Chart)', width / 2, 20);
    ctx.globalAlpha = 1;

    // Draw grid
    ctx.strokeStyle = `${colors.primary}33`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = progress;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.globalAlpha = 1;

    // Draw floating bars
    const barWidth = ((width - 2 * padding) / data.length) * 0.6;
    const maxValue = 100;

    for (let i = 0; i < data.length; i++) {
      const x =
        padding +
        (i * (width - 2 * padding)) / data.length +
        ((width - 2 * padding) / data.length) * 0.2;

      const barDelay = i * 0.1;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
      const easedBarProgress = easeOutQuart(barProgress);

      const startY =
        height - padding - 40 - (data[i].start / maxValue) * (height - 2 * padding - 60);
      const endY = height - padding - 40 - (data[i].end / maxValue) * (height - 2 * padding - 60);
      const barHeight = (startY - endY) * easedBarProgress;

      // Gradient fill
      const gradient = ctx.createLinearGradient(x, endY, x, startY);
      gradient.addColorStop(0, `${colors.primary}FF`);
      gradient.addColorStop(1, `${colors.primary}66`);

      ctx.fillStyle = gradient;
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 15 * easedBarProgress;
      ctx.fillRect(x, startY - barHeight, barWidth, barHeight);
      ctx.shadowBlur = 0;

      // Border
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, startY - barHeight, barWidth, barHeight);

      // Labels
      if (easedBarProgress > 0.5) {
        ctx.globalAlpha = (easedBarProgress - 0.5) * 2;
        ctx.fillStyle = colors.primary;
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${data[i].start}-${data[i].end}`, x + barWidth / 2, startY - barHeight / 2);
        ctx.globalAlpha = 1;
      }

      // X-axis labels
      ctx.globalAlpha = progress;
      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barWidth / 2, height - padding + 10);
      ctx.globalAlpha = 1;
    }
  };

  // Horizontal Bar Chart
  const drawHorizontalBarChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56];
    const labels = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Horizontal Bar Chart', width / 2, 20);
    ctx.globalAlpha = 1;

    // Draw grid (vertical lines)
    ctx.strokeStyle = `${colors.primary}33`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = progress;
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i * (width - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${i * 20}`, x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    // Draw horizontal bars
    const barHeight = ((height - 2 * padding) / data.length) * 0.7;
    const maxValue = 100;

    for (let i = 0; i < data.length; i++) {
      const y =
        padding +
        (i * (height - 2 * padding)) / data.length +
        ((height - 2 * padding) / data.length) * 0.15;

      const barDelay = i * 0.1;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
      const easedBarProgress = easeOutQuart(barProgress);

      const fullBarWidth = (data[i] / maxValue) * (width - 2 * padding);
      const barWidth = fullBarWidth * easedBarProgress;

      // Bar with gradient
      const gradient = ctx.createLinearGradient(padding, y, padding + barWidth, y);
      gradient.addColorStop(0, `${colors.primary}88`);
      gradient.addColorStop(1, `${colors.primary}FF`);

      ctx.fillStyle = gradient;
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 10 * easedBarProgress;
      ctx.fillRect(padding, y, barWidth, barHeight);
      ctx.shadowBlur = 0;

      // Border
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.strokeRect(padding, y, barWidth, barHeight);

      // Value label
      if (easedBarProgress > 0.5) {
        ctx.globalAlpha = (easedBarProgress - 0.5) * 2;
        ctx.fillStyle = colors.primary;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(data[i].toString(), padding + barWidth + 5, y + barHeight / 2 + 4);
        ctx.globalAlpha = 1;
      }

      // Y-axis labels
      ctx.globalAlpha = progress;
      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(labels[i], padding - 10, y + barHeight / 2 + 4);
      ctx.globalAlpha = 1;
    }
  };

  // Stacked Bar Chart
  const drawStackedBarChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const datasets = [
      { label: 'Dataset 1', data: [20, 30, 25, 35, 30], color: colors.primary },
      { label: 'Dataset 2', data: [25, 20, 30, 25, 35], color: colors.secondary },
      { label: 'Dataset 3', data: [15, 25, 20, 30, 20], color: colors.tertiary },
    ];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Stacked Bar Chart', width / 2, 20);
    ctx.globalAlpha = 1;

    // Calculate totals
    const totals = labels.map((_, i) => datasets.reduce((sum, ds) => sum + ds.data[i], 0));
    const maxTotal = Math.max(...totals);

    // Draw grid
    ctx.strokeStyle = `${colors.primary}33`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = progress;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      const value = Math.round(maxTotal - (i * maxTotal) / 5);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }
    ctx.globalAlpha = 1;

    // Draw stacked bars
    const barWidth = ((width - 2 * padding) / labels.length) * 0.7;
    const chartHeight = height - 2 * padding - 60;
    const baselineY = padding + chartHeight; // Zero point baseline (bottom of chart area)

    for (let i = 0; i < labels.length; i++) {
      const x =
        padding +
        (i * (width - 2 * padding)) / labels.length +
        ((width - 2 * padding) / labels.length) * 0.15;
      let stackedHeight = 0;

      for (let j = 0; j < datasets.length; j++) {
        const barDelay = (i * datasets.length + j) * 0.05;
        const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
        const easedBarProgress = easeOutQuart(barProgress);

        const fullSegmentHeight = (datasets[j].data[i] / maxTotal) * chartHeight;
        const segmentHeight = fullSegmentHeight * easedBarProgress;

        ctx.fillStyle = datasets[j].color;
        ctx.shadowColor = datasets[j].color;
        ctx.shadowBlur = 8 * easedBarProgress;
        ctx.fillRect(x, baselineY - stackedHeight - segmentHeight, barWidth, segmentHeight);
        ctx.shadowBlur = 0;

        // Border
        ctx.strokeStyle = datasets[j].color;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, baselineY - stackedHeight - segmentHeight, barWidth, segmentHeight);

        stackedHeight += fullSegmentHeight;
      }

      // X-axis labels
      ctx.globalAlpha = progress;
      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barWidth / 2, height - padding + 10);
      ctx.globalAlpha = 1;
    }

    // Legend
    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      datasets.map((ds) => ({ label: ds.label, color: ds.color })),
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // Stacked Bar Chart with Groups
  const drawStackedGroupedBarChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const groups = [
      {
        label: 'Group A',
        stacks: [
          { data: [20, 25], color: colors.primary },
          { data: [15, 20], color: colors.secondary },
        ],
      },
      {
        label: 'Group B',
        stacks: [
          { data: [30, 28], color: colors.primary },
          { data: [20, 25], color: colors.secondary },
        ],
      },
      {
        label: 'Group C',
        stacks: [
          { data: [25, 30], color: colors.primary },
          { data: [18, 22], color: colors.secondary },
        ],
      },
    ];
    const stackLabels = ['Stack 1', 'Stack 2'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawTitle(ctx, 'Stacked Bar Chart with Groups', width / 2, 20);
    ctx.globalAlpha = 1;

    // Calculate max value
    const maxValue = Math.max(
      ...groups.flatMap((g) =>
        stackLabels.map((_, i) => g.stacks.reduce((sum, s) => sum + s.data[i], 0))
      )
    );

    // Draw grid
    ctx.strokeStyle = `${colors.primary}33`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = progress;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      const value = Math.round(maxValue - (i * maxValue) / 5);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }
    ctx.globalAlpha = 1;

    // Draw grouped stacked bars
    const groupWidth = (width - 2 * padding) / groups.length;
    const barWidth = (groupWidth * 0.7) / stackLabels.length;
    const chartHeight = height - 2 * padding - 60;
    const baselineY = padding + chartHeight; // Zero point baseline (bottom of chart area)

    for (let g = 0; g < groups.length; g++) {
      const groupX = padding + g * groupWidth;

      for (let s = 0; s < stackLabels.length; s++) {
        const x = groupX + groupWidth * 0.15 + s * barWidth;
        let stackedHeight = 0;

        for (let st = 0; st < groups[g].stacks.length; st++) {
          const barDelay =
            (g * stackLabels.length * groups[g].stacks.length + s * groups[g].stacks.length + st) *
            0.03;
          const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
          const easedBarProgress = easeOutQuart(barProgress);

          const fullSegmentHeight = (groups[g].stacks[st].data[s] / maxValue) * chartHeight;
          const segmentHeight = fullSegmentHeight * easedBarProgress;

          ctx.fillStyle = groups[g].stacks[st].color;
          ctx.shadowColor = groups[g].stacks[st].color;
          ctx.shadowBlur = 8 * easedBarProgress;
          ctx.fillRect(x, baselineY - stackedHeight - segmentHeight, barWidth, segmentHeight);
          ctx.shadowBlur = 0;

          // Border
          ctx.strokeStyle = groups[g].stacks[st].color;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, baselineY - stackedHeight - segmentHeight, barWidth, segmentHeight);

          stackedHeight += fullSegmentHeight;
        }
      }

      // Group labels
      ctx.globalAlpha = progress;
      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(groups[g].label, groupX + groupWidth / 2, height - padding + 10);
      ctx.globalAlpha = 1;
    }

    // Legend
    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Stack Type 1', color: colors.primary },
        { label: 'Stack Type 2', color: colors.secondary },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

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
    drawGrid(ctx, width, height, padding, gridOptions);
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;
    const chartHeight = height - 2 * padding - 60;
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
        const y = height - padding - 40 - ((data[i] + mode.offset) / maxValue) * chartHeight;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          if (mode.label === 'Linear') {
            ctx.lineTo(x, y);
          } else if (mode.label === 'Smooth') {
            const prevX = padding + ((i - 1) * chartWidth) / (data.length - 1);
            const prevY =
              height - padding - 40 - ((data[i - 1] + mode.offset) / maxValue) * chartHeight;
            const cpX = (prevX + x) / 2;
            ctx.quadraticCurveTo(cpX, prevY, x, y);
          } else if (mode.label === 'Step') {
            const prevX = padding + ((i - 1) * chartWidth) / (data.length - 1);
            const prevY =
              height - padding - 40 - ((data[i - 1] + mode.offset) / maxValue) * chartHeight;
            ctx.lineTo(x, prevY);
            ctx.lineTo(x, y);
          }
        }
        if (i / (data.length - 1) > easedProgress) break;
      }
      ctx.stroke();
      for (let i = 0; i < data.length; i++) {
        if (i / (data.length - 1) > easedProgress) break;
        const x = padding + (i * chartWidth) / (data.length - 1);
        const y = height - padding - 40 - ((data[i] + mode.offset) / maxValue) * chartHeight;
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
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'left';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${400 - i * 80}`, width - padding + 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;
    const chartHeight = height - 2 * padding - 60;
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
        const y = height - padding - 40 - (dataset.data[i] / dataset.maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        if (i / (dataset.data.length - 1) > easedProgress) break;
      }
      ctx.stroke();

      for (let i = 0; i < dataset.data.length; i++) {
        if (i / (dataset.data.length - 1) > easedProgress) break;
        const x = padding + (i * chartWidth) / (dataset.data.length - 1);
        const y = height - padding - 40 - (dataset.data[i] / dataset.maxValue) * chartHeight;
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
      width - 180,
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
    drawGrid(ctx, width, height, padding, gridOptions);
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;
    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = 100;
    const easedProgress = easeOutQuart(progress);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    const shapes = ['circle', 'square', 'triangle', 'star', 'diamond', 'cross', 'plus'];
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;
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
    drawGrid(ctx, width, height, padding, gridOptions);
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;
    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = 100;
    const easedProgress = easeOutQuart(progress);
    for (let i = 0; i < data.length - 1; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x1 = padding + (i * chartWidth) / (data.length - 1);
      const y1 = height - padding - 40 - (data[i] / maxValue) * chartHeight;
      const x2 = padding + ((i + 1) * chartWidth) / (data.length - 1);
      const y2 = height - padding - 40 - (data[i + 1] / maxValue) * chartHeight;
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
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;
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
    drawGrid(ctx, width, height, padding, gridOptions);
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;
    const chartHeight = height - 2 * padding - 60;
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
        const y = height - padding - 40 - ((data[i] + mode.offset) / maxValue) * chartHeight;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = padding + ((i - 1) * chartWidth) / (data.length - 1);
          const prevY =
            height - padding - 40 - ((data[i - 1] + mode.offset) / maxValue) * chartHeight;
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
        const y = height - padding - 40 - ((data[i] + mode.offset) / maxValue) * chartHeight;
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
    drawGrid(ctx, width, height, padding, gridOptions);
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;
    const chartHeight = height - 2 * padding - 60;
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
        const y = height - padding - 40 - ((data[i] + style.offset) / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        if (i / (data.length - 1) > easedProgress) break;
      }
      ctx.stroke();
      ctx.setLineDash([]);
      for (let i = 0; i < data.length; i++) {
        if (i / (data.length - 1) > easedProgress) break;
        const x = padding + (i * chartWidth) / (data.length - 1);
        const y = height - padding - 40 - ((data[i] + style.offset) / maxValue) * chartHeight;
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

  // ==================== OTHER CHART TYPES ====================

  // 1. COMBO BAR/LINE CHART
  const drawComboBarLine = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 60;
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
      const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x =
        padding +
        (i * (width - 2 * padding)) / barData.length +
        (width - 2 * padding) / (barData.length * 2);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const chartHeight = height - 2 * padding - bottomPadding;
    const chartWidth = width - 2 * padding;
    const maxValue = 100;
    const barWidth = (chartWidth / barData.length) * 0.6;
    const chartTop = padding;
    const chartBottom = height - padding - bottomPadding;

    // Draw bars
    for (let i = 0; i < barData.length; i++) {
      const x =
        padding + (i * chartWidth) / barData.length + (chartWidth / barData.length - barWidth) / 2;
      const barDelay = i * 0.1;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
      const easedBarProgress = easeOutQuart(barProgress);
      const fullBarHeight = (barData[i] / maxValue) * chartHeight;
      const barHeight = fullBarHeight * easedBarProgress;
      const y = chartBottom - barHeight;

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
      const x = padding + (i * chartWidth) / barData.length + chartWidth / barData.length / 2;
      const y = chartBottom - (lineData[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (lineData.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < lineData.length; i++) {
      if (i / (lineData.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / barData.length + chartWidth / barData.length / 2;
      const y = chartBottom - (lineData[i] / maxValue) * chartHeight;
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

    // Draw grid circles
    ctx.strokeStyle = `${colors.primary}22`;
    ctx.lineWidth = 1;
    for (let r = maxRadius / 4; r <= maxRadius; r += maxRadius / 4) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

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

    // Data with null values - skip points means don't draw point but draw line through it
    const data1 = [65, null, 80, 81, null, 75];
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

    // Draw data1 line (connect all points, including null positions)
    ctx.fillStyle = `${colors.primary}33`;
    ctx.beginPath();
    for (let i = 0; i < data1.length; i++) {
      const angle = (i * Math.PI * 2) / data1.length - Math.PI / 2;
      const value = data1[i] !== null ? data1[i] : 0;
      const r = (value / maxValue) * radius * easedProgress;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < data1.length; i++) {
      const angle = (i * Math.PI * 2) / data1.length - Math.PI / 2;
      const value = data1[i] !== null ? data1[i] : 0;
      const r = (value / maxValue) * radius * easedProgress;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw data1 points (only non-null)
    ctx.fillStyle = colors.primary;
    for (let i = 0; i < data1.length; i++) {
      if (data1[i] !== null) {
        const angle = (i * Math.PI * 2) / data1.length - Math.PI / 2;
        const r = (data1[i] / maxValue) * radius * easedProgress;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Draw data2 line (connect all points, including null positions)
    ctx.fillStyle = `${colors.secondary}33`;
    ctx.beginPath();
    for (let i = 0; i < data2.length; i++) {
      const angle = (i * Math.PI * 2) / data2.length - Math.PI / 2;
      const value = data2[i] !== null ? data2[i] : 0;
      const r = (value / maxValue) * radius * easedProgress;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < data2.length; i++) {
      const angle = (i * Math.PI * 2) / data2.length - Math.PI / 2;
      const value = data2[i] !== null ? data2[i] : 0;
      const r = (value / maxValue) * radius * easedProgress;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Draw data2 points (only non-null)
    ctx.fillStyle = colors.secondary;
    for (let i = 0; i < data2.length; i++) {
      if (data2[i] !== null) {
        const angle = (i * Math.PI * 2) / data2.length - Math.PI / 2;
        const r = (data2[i] / maxValue) * radius * easedProgress;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

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
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'left';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${200 - i * 40}`, width - padding + 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i * (width - 2 * padding)) / 5;
      ctx.fillText(`${i * 20}`, x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const chartHeight = height - 2 * padding - 60;
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

    // Draw dataset 1
    data1.forEach((point, i) => {
      const delay = i * 0.1;
      const pointProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      if (pointProgress > 0) {
        const x = padding + (point.x / 100) * chartWidth;
        const y = height - padding - 40 - (point.y / 100) * chartHeight;
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
        const y = height - padding - 40 - (point.y / 200) * chartHeight;
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
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 7. STACKED BAR/LINE CHART
  const drawStackedBarLine = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 60;

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
      const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x =
        padding +
        (i * (width - 2 * padding)) / barData1.length +
        (width - 2 * padding) / (barData1.length * 2);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const chartHeight = height - 2 * padding - bottomPadding;
    const chartWidth = width - 2 * padding;
    const maxValue = 100;
    const barWidth = (chartWidth / barData1.length) * 0.6;
    const baselineY = padding + chartHeight; // Zero point baseline

    // Draw stacked bars
    for (let i = 0; i < barData1.length; i++) {
      const x =
        padding +
        (i * chartWidth) / barData1.length +
        (chartWidth / barData1.length - barWidth) / 2;
      const barDelay = i * 0.1;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
      const easedBarProgress = easeOutQuart(barProgress);

      const fullHeight1 = (barData1[i] / maxValue) * chartHeight;
      const fullHeight2 = (barData2[i] / maxValue) * chartHeight;
      const height1 = fullHeight1 * easedBarProgress;
      const height2 = fullHeight2 * easedBarProgress;

      // Bottom bar
      const y1 = baselineY - height1;
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
      const x = padding + (i * chartWidth) / barData1.length + chartWidth / barData1.length / 2;
      const y = baselineY - (lineData[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (lineData.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < lineData.length; i++) {
      if (i / (lineData.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / barData1.length + chartWidth / barData1.length / 2;
      const y = baselineY - (lineData[i] / maxValue) * chartHeight;
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

  // ==================== ADVANCED LINE & AREA CHARTS ====================

  // 1. AREA CHART
  const drawAreaChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 65;
    const data = [65, 59, 80, 81, 56, 55, 70];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Area Chart', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    // Axes
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const chartHeight = height - 2 * padding - bottomPadding;
    const chartWidth = width - 2 * padding;
    const maxValue = 100;
    const easedProgress = easeOutQuart(progress);

    // Draw filled area
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - bottomPadding);
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - bottomPadding - (data[i] / maxValue) * chartHeight;
      ctx.lineTo(x, y);
    }
    const lastX = padding + Math.min(easedProgress, 1) * chartWidth;
    ctx.lineTo(lastX, height - padding - bottomPadding);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding - bottomPadding);
    gradient.addColorStop(0, `${colors.primary}88`);
    gradient.addColorStop(1, `${colors.primary}11`);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line on top
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - bottomPadding - (data[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw points
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - bottomPadding - (data[i] / maxValue) * chartHeight;
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  // 2. LINE CHART WITH BOUNDARIES
  const drawLineBoundaries = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56, 55, 70];
    const upperBound = [75, 70, 90, 92, 68, 67, 82];
    const lowerBound = [55, 48, 70, 70, 44, 43, 58];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Line Chart - Boundaries', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = 100;
    const easedProgress = easeOutQuart(progress);

    // Draw boundary area
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (upperBound[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    for (let i = data.length - 1; i >= 0; i--) {
      if (i / (data.length - 1) > easedProgress) continue;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (lowerBound[i] / maxValue) * chartHeight;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = `${colors.secondary}22`;
    ctx.fill();

    // Draw main line
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw boundary lines
    ctx.strokeStyle = `${colors.secondary}88`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    for (let i = 0; i < upperBound.length; i++) {
      if (i / (upperBound.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (upperBound.length - 1);
      const y = height - padding - 40 - (upperBound[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < lowerBound.length; i++) {
      if (i / (lowerBound.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (lowerBound.length - 1);
      const y = height - padding - 40 - (lowerBound[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Main Line', color: colors.primary },
        { label: 'Boundaries', color: colors.secondary },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 3. LINE CHART WITH MULTIPLE DATASETS
  const drawLineDatasets = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Line Chart - Multiple Datasets', width, height, titleOptions);
    ctx.globalAlpha = 1;

    // Get visible datasets
    const visibleDatasets = lineDatasets.filter((ds) => ds.visible);
    if (visibleDatasets.length === 0) {
      ctx.fillStyle = colors.primary;
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('No visible datasets', width / 2, height / 2);
      return;
    }

    // Find max/min values for scaling
    const maxValue = Math.max(...visibleDatasets.flatMap((ds) => ds.data), 100);
    const minValue = Math.min(...visibleDatasets.flatMap((ds) => ds.data), 0);
    const range = maxValue - minValue;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      const value = Math.round(maxValue - (i * range) / 5);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 5);
    }
    ctx.globalAlpha = 1;

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const easedProgress = easeOutQuart(progress);

    visibleDatasets.forEach((dataset, idx) => {
      const delay = idx * 0.2;
      const datasetProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      const easedDatasetProgress = easeOutQuart(datasetProgress);

      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < dataset.data.length; i++) {
        if (i / (dataset.data.length - 1) > easedDatasetProgress) break;
        const x = padding + (i * chartWidth) / (dataset.data.length - 1);
        const normalizedValue = (dataset.data[i] - minValue) / range;
        const y = height - padding - 40 - normalizedValue * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw points
      for (let i = 0; i < dataset.data.length; i++) {
        if (i / (dataset.data.length - 1) > easedDatasetProgress) break;
        const x = padding + (i * chartWidth) / (dataset.data.length - 1);
        const normalizedValue = (dataset.data[i] - minValue) / range;
        const y = height - padding - 40 - normalizedValue * chartHeight;
        ctx.fillStyle = dataset.color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Point border
        ctx.strokeStyle = variant === 'r-huds' ? '#0a0e27' : '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      visibleDatasets.map((ds) => ({ label: ds.label, color: ds.color })),
      width - 120,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 4. LINE CHART WITH TIME AXIS
  const drawLineDrawTime = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 70;
    const data = [65, 59, 80, 81, 56, 55, 70, 75, 68];
    const timeLabels = [
      '00:00',
      '03:00',
      '06:00',
      '09:00',
      '12:00',
      '15:00',
      '18:00',
      '21:00',
      '24:00',
    ];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Line Chart - Time Axis', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < timeLabels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (timeLabels.length - 1);
      ctx.fillText(timeLabels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const chartHeight = height - 2 * padding - bottomPadding;
    const chartBottom = height - padding - bottomPadding;
    const chartWidth = width - 2 * padding;
    const maxValue = 100;
    const easedProgress = easeOutQuart(progress);

    // Draw smooth curve
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = chartBottom - (data[i] / maxValue) * chartHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevX = padding + ((i - 1) * chartWidth) / (data.length - 1);
        const prevY = chartBottom - (data[i - 1] / maxValue) * chartHeight;
        const cpX = (prevX + x) / 2;
        ctx.quadraticCurveTo(cpX, prevY, x, y);
      }
    }
    ctx.stroke();

    // Draw points with time markers
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = chartBottom - (data[i] / maxValue) * chartHeight;

      // Only draw if within bounds
      if (y >= padding && y <= chartBottom) {
        ctx.fillStyle = colors.primary;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw vertical time marker
        if (i % 2 === 0) {
          ctx.strokeStyle = `${colors.primary}33`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, chartBottom);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }
  };

  // 5. STACKED LINE CHART
  const drawLineStacked = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 60;
    const data1 = [20, 25, 30, 35, 25, 30];
    const data2 = [15, 20, 25, 20, 30, 25];
    const data3 = [10, 15, 20, 15, 20, 15];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Stacked Line Chart', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const chartHeight = height - 2 * padding - bottomPadding;
    const chartBottom = height - padding - bottomPadding;
    const chartWidth = width - 2 * padding;
    const maxValue = 100;
    const easedProgress = easeOutQuart(progress);

    // Calculate stacked values
    const stacked1 = data1;
    const stacked2 = data1.map((v, i) => v + data2[i]);
    const stacked3 = data1.map((v, i) => v + data2[i] + data3[i]);

    const layers = [
      { data: stacked3, color: '#FF006E', label: 'Layer 3' },
      { data: stacked2, color: colors.secondary, label: 'Layer 2' },
      { data: stacked1, color: colors.primary, label: 'Layer 1' },
    ];

    // Draw areas from top to bottom
    layers.forEach((layer, idx) => {
      const delay = idx * 0.15;
      const layerProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      const easedLayerProgress = easeOutQuart(layerProgress);

      // Draw filled area
      ctx.beginPath();
      ctx.moveTo(padding, chartBottom);
      for (let i = 0; i < layer.data.length; i++) {
        if (i / (layer.data.length - 1) > easedLayerProgress) break;
        const x = padding + (i * chartWidth) / (layer.data.length - 1);
        const y = chartBottom - (layer.data[i] / maxValue) * chartHeight;
        ctx.lineTo(x, y);
      }
      const lastX = padding + Math.min(easedLayerProgress, 1) * chartWidth;
      ctx.lineTo(lastX, chartBottom);
      ctx.closePath();

      ctx.fillStyle = `${layer.color}66`;
      ctx.fill();

      // Draw line
      ctx.strokeStyle = layer.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < layer.data.length; i++) {
        if (i / (layer.data.length - 1) > easedLayerProgress) break;
        const x = padding + (i * chartWidth) / (layer.data.length - 1);
        const y = chartBottom - (layer.data[i] / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Layer 1', color: colors.primary },
        { label: 'Layer 2', color: colors.secondary },
        { label: 'Layer 3', color: '#FF006E' },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 6. STACKED RADAR CHART
  const drawRadarStacked = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Stacked Radar Chart', width, height, titleOptions);
    ctx.globalAlpha = 1;

    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radius = Math.min(width, height) / 3;

    const data1 = [30, 35, 40, 35, 30, 35];
    const data2 = [20, 25, 20, 25, 30, 25];
    const data3 = [15, 15, 20, 15, 20, 15];
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

    // Calculate stacked values
    const stacked1 = data1;
    const stacked2 = data1.map((v, i) => v + data2[i]);
    const stacked3 = data1.map((v, i) => v + data2[i] + data3[i]);

    const layers = [
      { data: stacked3, color: '#FF006E' },
      { data: stacked2, color: colors.secondary },
      { data: stacked1, color: colors.primary },
    ];

    // Draw layers from outside to inside
    layers.forEach((layer, idx) => {
      const delay = idx * 0.2;
      const layerProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      const easedLayerProgress = easeOutQuart(layerProgress);

      ctx.beginPath();
      for (let i = 0; i < layer.data.length; i++) {
        const angle = (i * Math.PI * 2) / layer.data.length - Math.PI / 2;
        const r = (layer.data[i] / maxValue) * radius * easedLayerProgress;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      ctx.fillStyle = `${layer.color}44`;
      ctx.fill();
      ctx.strokeStyle = layer.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Base Layer', color: colors.primary },
        { label: 'Middle Layer', color: colors.secondary },
        { label: 'Top Layer', color: '#FF006E' },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // ==================== END OF ADVANCED LINE & AREA CHARTS ====================

  // ==================== SCALES & CONFIGURATION OPTIONS ====================

  // 1. LINEAR SCALE - MIN-MAX
  const drawLinearScaleMinMax = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 70;
    const chartHeight = height - 2 * padding - bottomPadding;
    const chartBottom = height - padding - bottomPadding;
    const data = [25, 35, 45, 55, 65, 75];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Linear Scale - Min-Max (20-80)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    // Fixed min-max scale: 20-80
    const minValue = 20;
    const maxValue = 80;
    const range = maxValue - minValue;

    // Draw grid
    drawGrid(ctx, width, height, padding, gridOptions);

    // Y-axis labels with fixed min-max
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight) / 5;
      const value = Math.round(maxValue - (i * range) / 5);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - bottomPadding + 20);
    }
    ctx.globalAlpha = 1;

    // Draw line
    const easedProgress = easeOutQuart(progress);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const normalizedValue = (data[i] - minValue) / range;
      const y = chartBottom - normalizedValue * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    // Draw points
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const normalizedValue = (data[i] - minValue) / range;
      const y = chartBottom - normalizedValue * chartHeight;
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 2. LINEAR SCALE - SUGGESTED MIN-MAX
  const drawLinearScaleSuggested = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 70;
    const chartHeight = height - 2 * padding - bottomPadding;
    const chartBottom = height - padding - bottomPadding;
    const data = [45, 55, 65, 75, 85, 95];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Linear Scale - Suggested Min-Max (40-100)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    // Suggested min-max with padding
    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);
    const suggestedMin = 40; // Suggested minimum
    const suggestedMax = 100; // Suggested maximum
    const minValue = Math.min(dataMin, suggestedMin);
    const maxValue = Math.max(dataMax, suggestedMax);
    const range = maxValue - minValue;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight) / 5;
      const value = Math.round(maxValue - (i * range) / 5);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - bottomPadding + 20);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const normalizedValue = (data[i] - minValue) / range;
      const y = chartBottom - normalizedValue * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const normalizedValue = (data[i] - minValue) / range;
      const y = chartBottom - normalizedValue * chartHeight;
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 3. LINEAR SCALE - STEP SIZE
  const drawLinearScaleStepSize = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 70;
    const chartHeight = height - 2 * padding - bottomPadding;
    const chartBottom = height - padding - bottomPadding;
    const data = [10, 25, 40, 55, 70, 85];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Linear Scale - Step Size (15)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    // Fixed step size of 15
    const stepSize = 15;
    const maxValue = 90; // 6 steps * 15
    const minValue = 0;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 6; i++) {
      const y = padding + (i * chartHeight) / 6;
      const value = maxValue - i * stepSize;
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - bottomPadding + 20);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);
    ctx.strokeStyle = colors.tertiary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = chartBottom - (data[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = chartBottom - (data[i] / maxValue) * chartHeight;
      ctx.fillStyle = colors.tertiary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 4. LOG SCALE
  const drawLogScale = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 70;
    const chartHeight = height - 2 * padding - bottomPadding;
    const chartBottom = height - padding - bottomPadding;
    const data = [1, 10, 100, 1000, 10000, 100000];
    const labels = ['1', '10', '100', '1K', '10K', '100K'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Logarithmic Scale', width, height, titleOptions);
    ctx.globalAlpha = 1;

    // Logarithmic scale
    const logMin = 0; // log10(1) = 0
    const logMax = 5; // log10(100000) = 5

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    const logLabels = [100000, 10000, 1000, 100, 10, 1];
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight) / 5;
      ctx.fillText(logLabels[i].toString(), padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - bottomPadding + 20);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);
    ctx.strokeStyle = colors.quaternary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const logValue = Math.log10(data[i]);
      const normalizedValue = (logValue - logMin) / (logMax - logMin);
      const y = chartBottom - normalizedValue * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const logValue = Math.log10(data[i]);
      const normalizedValue = (logValue - logMin) / (logMax - logMin);
      const y = chartBottom - normalizedValue * chartHeight;
      ctx.fillStyle = colors.quaternary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 5. STACKED LINEAR / CATEGORY
  const drawStackedLinearCategory = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 60;
    const categories = ['Cat A', 'Cat B', 'Cat C', 'Cat D'];
    const dataset1 = [20, 30, 25, 35];
    const dataset2 = [15, 20, 30, 25];
    const dataset3 = [10, 15, 20, 15];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Stacked Linear / Category Scale', width, height, titleOptions);
    ctx.globalAlpha = 1;

    const maxTotal = Math.max(...categories.map((_, i) => dataset1[i] + dataset2[i] + dataset3[i]));

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
      const value = Math.round(maxTotal - (i * maxTotal) / 5);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < categories.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (categories.length - 1);
      ctx.fillText(categories[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);
    const chartHeight = height - 2 * padding - bottomPadding;
    const chartBottom = height - padding - bottomPadding;

    // Draw stacked areas
    const datasets = [
      { data: dataset1, color: colors.primary },
      { data: dataset2, color: colors.secondary },
      { data: dataset3, color: colors.tertiary },
    ];

    let cumulativeData = new Array(categories.length).fill(0);

    datasets.forEach((dataset, idx) => {
      const delay = idx * 0.2;
      const datasetProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      const easedDatasetProgress = easeOutQuart(datasetProgress);

      ctx.beginPath();
      for (let i = 0; i < categories.length; i++) {
        const x = padding + (i * (width - 2 * padding)) / (categories.length - 1);
        const y =
          chartBottom -
          ((cumulativeData[i] + dataset.data[i]) / maxTotal) * chartHeight * easedDatasetProgress;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Close path to bottom
      for (let i = categories.length - 1; i >= 0; i--) {
        const x = padding + (i * (width - 2 * padding)) / (categories.length - 1);
        const y = chartBottom - (cumulativeData[i] / maxTotal) * chartHeight * easedDatasetProgress;
        ctx.lineTo(x, y);
      }
      ctx.closePath();

      ctx.fillStyle = `${dataset.color}66`;
      ctx.fill();
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Update cumulative data
      cumulativeData = cumulativeData.map((v, i) => v + dataset.data[i]);
    });

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Dataset 1', color: colors.primary },
        { label: 'Dataset 2', color: colors.secondary },
        { label: 'Dataset 3', color: colors.tertiary },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 6. TIME SCALE
  const drawTimeScale = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 70;
    const data = [45, 55, 65, 75, 85, 95];
    const timeLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Time Scale (24 Hours)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < timeLabels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (timeLabels.length - 1);
      ctx.fillText(timeLabels[i], x, height - bottomPadding + 20);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);
    const chartHeight = height - 2 * padding - bottomPadding;
    const chartBottom = height - padding - bottomPadding;

    ctx.strokeStyle = colors.quinary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = chartBottom - (data[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = chartBottom - (data[i] / 100) * chartHeight;

      ctx.fillStyle = colors.quinary;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 7. TIME SCALE - MAX SPAN
  const drawTimeScaleMaxSpan = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 70;
    const data = [45, 55, 65, 75, 85, 95, 88, 92];
    const timeLabels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Time Scale - Max Span (24h)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < timeLabels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (timeLabels.length - 1);
      ctx.fillText(timeLabels[i], x, height - bottomPadding + 20);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);
    const chartHeight = height - 2 * padding - bottomPadding;
    const chartBottom = height - padding - bottomPadding;

    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = chartBottom - (data[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = chartBottom - (data[i] / 100) * chartHeight;
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 8. TIME SCALE - COMBO CHART
  const drawTimeScaleCombo = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 60;
    const barData = [30, 40, 35, 45, 50, 55];
    const lineData = [65, 70, 75, 80, 85, 90];
    const timeLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Time Scale - Combo Chart', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < timeLabels.length; i++) {
      const x =
        padding +
        (i * (width - 2 * padding)) / timeLabels.length +
        (width - 2 * padding) / timeLabels.length / 2;
      ctx.fillText(timeLabels[i], x, height - bottomPadding + 20);
    }
    ctx.globalAlpha = 1;

    const chartHeight = height - 2 * padding - bottomPadding;
    const chartBottom = height - padding - bottomPadding;
    const barWidth = ((width - 2 * padding) / barData.length) * 0.7;
    const maxValue = 100;

    // Draw bars
    for (let i = 0; i < barData.length; i++) {
      const x =
        padding +
        (i * (width - 2 * padding)) / barData.length +
        ((width - 2 * padding) / barData.length - barWidth) / 2;
      const barDelay = i * 0.1;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
      const easedBarProgress = easeOutQuart(barProgress);

      const fullBarHeight = (barData[i] / maxValue) * chartHeight;
      const barHeight = fullBarHeight * easedBarProgress;
      const y = chartBottom - barHeight;

      ctx.fillStyle = colors.secondary;
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
      const x =
        padding +
        (i * (width - 2 * padding)) / lineData.length +
        (width - 2 * padding) / lineData.length / 2;
      const y = chartBottom - (lineData[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (lineData.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < lineData.length; i++) {
      if (i / (lineData.length - 1) > easedProgress) break;
      const x =
        padding +
        (i * (width - 2 * padding)) / lineData.length +
        (width - 2 * padding) / lineData.length / 2;
      const y = chartBottom - (lineData[i] / maxValue) * chartHeight;
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw legend with proper positioning
    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Bars', color: colors.secondary },
        { label: 'Line', color: colors.primary },
      ],
      padding + 10,
      padding + 10
    );
    ctx.globalAlpha = 1;
  };

  // 9. CENTER POSITIONING
  const drawCenterPositioning = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [30, -20, 40, -10, 50, 20, -30, 45];
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Center Positioning (Zero Line)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    const minValue = -50;
    const maxValue = 50;
    const zeroY =
      height - padding - 40 - (-minValue / (maxValue - minValue)) * (height - 2 * padding - 60);

    drawGrid(ctx, width, height, padding, gridOptions);

    // Draw zero line
    ctx.strokeStyle = colors.tertiary;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, zeroY);
    ctx.lineTo(width - padding, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      const value = Math.round(maxValue - (i * (maxValue - minValue)) / 5);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const barWidth = ((width - 2 * padding) / data.length) * 0.7;

    for (let i = 0; i < data.length; i++) {
      const x =
        padding +
        (i * (width - 2 * padding)) / data.length +
        ((width - 2 * padding) / data.length) * 0.15;
      const barDelay = i * 0.08;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
      const easedBarProgress = easeOutQuart(barProgress);

      const normalizedValue = (data[i] - minValue) / (maxValue - minValue);
      const targetY = height - padding - 40 - normalizedValue * (height - 2 * padding - 60);

      let barY, barHeight;
      if (data[i] >= 0) {
        barHeight = Math.abs(targetY - zeroY) * easedBarProgress;
        barY = zeroY - barHeight;
        ctx.fillStyle = colors.primary;
      } else {
        barHeight = Math.abs(targetY - zeroY) * easedBarProgress;
        barY = zeroY;
        ctx.fillStyle = colors.secondary;
      }

      ctx.fillRect(x, barY, barWidth, barHeight);
      ctx.strokeStyle = data[i] >= 0 ? colors.primary : colors.secondary;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, barY, barWidth, barHeight);
    }

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Positive', color: colors.primary },
        { label: 'Negative', color: colors.secondary },
        { label: 'Zero Line', color: colors.tertiary },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 10. GRID CONFIGURATION (ADVANCED)
  const drawGridConfiguration = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [45, 55, 65, 75, 85, 95];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Grid Configuration (Dashed)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    // Custom grid with dashed lines
    const customGridOptions = {
      ...gridOptions,
      borderDash: [5, 5],
      color: variant === 'r-huds' ? 'rgba(41, 242, 223, 0.3)' : 'rgba(0, 255, 0, 0.3)',
      lineWidth: 2,
    };

    drawGrid(ctx, width, height, padding, customGridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);
    ctx.strokeStyle = colors.quaternary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 60);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 60);
      ctx.fillStyle = colors.quaternary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 11. TICK CONFIGURATION (ADVANCED)
  const drawTickConfiguration = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [45, 55, 65, 75, 85, 95];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Tick Configuration (Custom)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    // Custom tick marks
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;

      // Draw longer tick marks
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding - 10, y);
      ctx.lineTo(padding, y);
      ctx.stroke();

      // Custom tick labels with units
      ctx.fillText(`${100 - i * 20}%`, padding - 20, y + 4);
    }

    ctx.textAlign = 'center';
    ctx.font = 'bold 11px monospace';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);

      // Draw tick marks on X axis
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, height - padding);
      ctx.lineTo(x, height - padding + 10);
      ctx.stroke();

      ctx.fillText(labels[i], x, height - padding + 25);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);
    ctx.strokeStyle = colors.quinary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 60);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 60);
      ctx.fillStyle = colors.quinary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // 12. TITLE CONFIGURATION (ADVANCED)
  const drawTitleConfiguration = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [45, 55, 65, 75, 85, 95];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Custom title configuration - bottom aligned, left positioned
    const customTitleOptions = {
      ...titleOptions,
      position: 'bottom' as 'top' | 'bottom',
      align: 'start' as 'start' | 'center' | 'end',
      font: {
        size: 16,
        weight: 'bold' as 'normal' | 'bold',
        family: 'monospace',
      },
    };

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Title: Bottom-Left Aligned', width, height, customTitleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);
    ctx.strokeStyle = colors.tertiary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 60);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 60);
      ctx.fillStyle = colors.tertiary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // ==================== END OF SCALES & CONFIGURATION ====================

  // ==================== LEGEND & LAYOUT OPTIONS ====================

  // 1. LEGEND EVENTS (Interactive)
  const drawLegendEvents = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    const datasets = legendEventDatasets;
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Legend Events (Click to Toggle)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);

    datasets.forEach((dataset, idx) => {
      if (!dataset.visible) return;

      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < dataset.data.length; i++) {
        const x = padding + (i * (width - 2 * padding)) / (dataset.data.length - 1);
        const y = height - padding - 40 - (dataset.data[i] / 100) * (height - 2 * padding - 60);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        if (i / (dataset.data.length - 1) > easedProgress) break;
      }
      ctx.stroke();

      for (let i = 0; i < dataset.data.length; i++) {
        if (i / (dataset.data.length - 1) > easedProgress) break;
        const x = padding + (i * (width - 2 * padding)) / (dataset.data.length - 1);
        const y = height - padding - 40 - (dataset.data[i] / 100) * (height - 2 * padding - 60);
        ctx.fillStyle = dataset.color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Interactive legend with hover effect
    ctx.globalAlpha = progress;
    const legendX = width - 180;
    const legendY = 40;
    const itemHeight = 25;

    datasets.forEach((dataset, i) => {
      const itemY = legendY + i * itemHeight;

      // Legend item background
      ctx.fillStyle = dataset.visible ? 'rgba(41, 242, 223, 0.1)' : 'rgba(100, 100, 100, 0.1)';
      ctx.fillRect(legendX - 5, itemY - 5, 170, 20);

      // Color box
      ctx.fillStyle = dataset.visible ? dataset.color : `${dataset.color}44`;
      ctx.fillRect(legendX, itemY, 12, 12);

      // Label
      ctx.fillStyle = dataset.visible ? colors.primary : `${colors.primary}44`;
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(dataset.label, legendX + 18, itemY + 10);

      // Click indicator
      ctx.fillStyle = colors.secondary;
      ctx.font = '10px monospace';
      ctx.fillText('(click)', legendX + 120, itemY + 10);
    });
    ctx.globalAlpha = 1;
  };

  // 2. HTML LEGEND (Styled)
  const drawHTMLLegend = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [300, 150, 100, 80];
    const labels = ['Red', 'Blue', 'Yellow', 'Green'];
    const chartColors = [colors.primary, colors.secondary, colors.tertiary, colors.quaternary];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'HTML Legend (Styled)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radius = Math.min(width, height) / 3;

    const easedProgress = easeOutQuart(progress);
    const animatedAngle = easedProgress * Math.PI * 2;

    const total = data.reduce((a, b) => a + b, 0);
    let currentAngle = -Math.PI / 2;
    let drawnAngle = 0;

    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i] / total) * Math.PI * 2;
      const remainingAngle = animatedAngle - drawnAngle;
      if (remainingAngle <= 0) break;

      const drawSliceAngle = Math.min(sliceAngle, remainingAngle);

      ctx.fillStyle = chartColors[i];
      ctx.shadowColor = chartColors[i];
      ctx.shadowBlur = 15 * progress;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + drawSliceAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.shadowBlur = 0;

      currentAngle += sliceAngle;
      drawnAngle += drawSliceAngle;
    }

    // HTML-style legend with boxes and percentages
    ctx.globalAlpha = progress;
    const legendX = width - 180;
    const legendY = 40;
    const itemHeight = 30;

    ctx.fillStyle = 'rgba(41, 242, 223, 0.05)';
    ctx.fillRect(legendX - 10, legendY - 10, 170, data.length * itemHeight + 20);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 10, legendY - 10, 170, data.length * itemHeight + 20);

    labels.forEach((label, i) => {
      const itemY = legendY + i * itemHeight;
      const percentage = ((data[i] / total) * 100).toFixed(1);

      // Color box with border
      ctx.fillStyle = chartColors[i];
      ctx.fillRect(legendX, itemY, 15, 15);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 1;
      ctx.strokeRect(legendX, itemY, 15, 15);

      // Label
      ctx.fillStyle = colors.primary;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label, legendX + 22, itemY + 11);

      // Percentage
      ctx.font = '11px monospace';
      ctx.fillText(`${percentage}%`, legendX + 100, itemY + 11);
    });
    ctx.globalAlpha = 1;
  };

  // 3. LEGEND POINT STYLE
  const drawLegendPointStyle = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    const datasets = [
      { label: 'Circle', data: [65, 59, 80, 81, 56, 55], color: colors.primary, style: 'circle' },
      { label: 'Square', data: [45, 69, 70, 91, 66, 75], color: colors.secondary, style: 'square' },
      {
        label: 'Triangle',
        data: [35, 49, 60, 71, 46, 65],
        color: colors.tertiary,
        style: 'triangle',
      },
    ];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Legend Point Style', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);

    datasets.forEach((dataset) => {
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < dataset.data.length; i++) {
        const x = padding + (i * (width - 2 * padding)) / (dataset.data.length - 1);
        const y = height - padding - 40 - (dataset.data[i] / 100) * (height - 2 * padding - 60);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        if (i / (dataset.data.length - 1) > easedProgress) break;
      }
      ctx.stroke();

      for (let i = 0; i < dataset.data.length; i++) {
        if (i / (dataset.data.length - 1) > easedProgress) break;
        const x = padding + (i * (width - 2 * padding)) / (dataset.data.length - 1);
        const y = height - padding - 40 - (dataset.data[i] / 100) * (height - 2 * padding - 60);

        ctx.fillStyle = dataset.color;
        if (dataset.style === 'circle') {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (dataset.style === 'square') {
          ctx.fillRect(x - 5, y - 5, 10, 10);
        } else if (dataset.style === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(x, y - 6);
          ctx.lineTo(x - 5, y + 4);
          ctx.lineTo(x + 5, y + 4);
          ctx.closePath();
          ctx.fill();
        }
      }
    });

    // Legend with point styles - horizontal layout at top
    ctx.globalAlpha = progress;
    const legendY = 35;
    let legendX = padding + 20;
    const itemSpacing = 120;

    datasets.forEach((dataset, i) => {
      const pointX = legendX + 6;
      const pointY = legendY + 6;

      ctx.fillStyle = dataset.color;
      if (dataset.style === 'circle') {
        ctx.beginPath();
        ctx.arc(pointX, pointY, 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (dataset.style === 'square') {
        ctx.fillRect(pointX - 6, pointY - 6, 12, 12);
      } else if (dataset.style === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(pointX, pointY - 7);
        ctx.lineTo(pointX - 6, pointY + 5);
        ctx.lineTo(pointX + 6, pointY + 5);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = colors.primary;
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(dataset.label, legendX + 20, legendY + 10);

      legendX += itemSpacing;
    });
    ctx.globalAlpha = 1;
  };

  // 4. POSITION (Legend Positions)
  const drawLegendPosition = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56, 55];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Legend Position (Left)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 60);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 60);
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Legend on the left side
    ctx.globalAlpha = progress;
    const legendX = 10;
    const legendY = height / 2 - 20;

    ctx.fillStyle = 'rgba(41, 242, 223, 0.1)';
    ctx.fillRect(legendX, legendY, 120, 40);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY, 120, 40);

    ctx.fillStyle = colors.primary;
    ctx.fillRect(legendX + 10, legendY + 14, 12, 12);
    ctx.fillStyle = colors.primary;
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Data Series', legendX + 28, legendY + 24);
    ctx.globalAlpha = 1;
  };

  // 5. ALIGNMENT AND TITLE POSITION
  const drawAlignmentTitlePosition = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56, 55];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Title at top-right
    ctx.globalAlpha = progress;
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'right';
    ctx.fillText('Alignment & Title (Top-Right)', width - 10, 20);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - 60)) / 5;
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    const easedProgress = easeOutQuart(progress);
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 60);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / 100) * (height - 2 * padding - 60);
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Legend at bottom-center
    ctx.globalAlpha = progress;
    const legendX = width / 2 - 60;
    const legendY = height - 20;

    ctx.fillStyle = colors.secondary;
    ctx.fillRect(legendX, legendY, 12, 12);
    ctx.fillStyle = colors.primary;
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Data Series', legendX + 18, legendY + 10);
    ctx.globalAlpha = 1;
  };

  // ==================== END OF LEGEND & LAYOUT ====================

  // ==================== TOOLTIP & INTERACTION MODES ====================

  // 1. TOOLTIP - CUSTOM
  const drawTooltipCustom = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56, 55];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Custom Tooltip', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = Math.max(...data);
    const easedProgress = easeOutQuart(progress);

    // Draw line
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    // Draw points with custom tooltip indicator
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;

      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Show tooltip on hover point (simulated for point 3)
      if (i === 3 && progress > 0.7) {
        const tooltipAlpha = Math.min(1, (progress - 0.7) / 0.3);
        ctx.globalAlpha = tooltipAlpha;

        // Tooltip background
        const tooltipWidth = 100;
        const tooltipHeight = 50;
        const tooltipX = x - tooltipWidth / 2;
        const tooltipY = y - tooltipHeight - 15;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

        // Tooltip text
        ctx.fillStyle = colors.primary;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], tooltipX + tooltipWidth / 2, tooltipY + 20);
        ctx.fillText(`Value: ${data[i]}`, tooltipX + tooltipWidth / 2, tooltipY + 38);

        // Tooltip arrow
        ctx.beginPath();
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x - 5, tooltipY + tooltipHeight);
        ctx.lineTo(x + 5, tooltipY + tooltipHeight);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fill();
        ctx.strokeStyle = colors.primary;
        ctx.stroke();

        ctx.globalAlpha = 1;
      }
    }

    ctx.globalAlpha = progress;
    drawLegend(ctx, [{ label: 'Sales Data', color: colors.primary }], width - 180, 40);
    ctx.globalAlpha = 1;
  };

  // 2. TOOLTIP - CUSTOM CONTENT
  const drawTooltipContent = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data1 = [65, 59, 80, 81, 56, 55];
    const data2 = [45, 69, 70, 91, 66, 75];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Custom Tooltip Content', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = 100;
    const easedProgress = easeOutQuart(progress);

    // Draw bars
    const barWidth = ((width - 2 * padding) / data1.length) * 0.25;
    for (let i = 0; i < data1.length; i++) {
      const x = padding + (i * chartWidth) / data1.length + chartWidth / data1.length / 2;
      const barDelay = i * 0.1;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
      const easedBarProgress = easeOutQuart(barProgress);

      // Bar 1
      const height1 = (data1[i] / maxValue) * chartHeight * easedBarProgress;
      const y1 = height - padding - 60 - height1;
      ctx.fillStyle = colors.primary;
      ctx.fillRect(x - barWidth - 3, y1, barWidth, height1);

      // Bar 2
      const height2 = (data2[i] / maxValue) * chartHeight * easedBarProgress;
      const y2 = height - padding - 60 - height2;
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(x + 3, y2, barWidth, height2);

      // Rich tooltip on hover (simulated for bar 4)
      if (i === 4 && progress > 0.8) {
        const tooltipAlpha = Math.min(1, (progress - 0.8) / 0.2);
        ctx.globalAlpha = tooltipAlpha;

        const tooltipWidth = 120;
        const tooltipHeight = 75;
        const chartAreaLeft = padding + 5;
        const chartAreaRight = width - padding - 5;
        const chartAreaTop = padding + 5;
        const chartAreaBottom = height - padding - 45;

        // Position tooltip inside chart area
        let tooltipX = x - tooltipWidth / 2;
        let tooltipY = Math.min(y1, y2) - tooltipHeight - 10;

        // Clamp to chart boundaries
        if (tooltipX < chartAreaLeft) tooltipX = chartAreaLeft;
        if (tooltipX + tooltipWidth > chartAreaRight) tooltipX = chartAreaRight - tooltipWidth;
        if (tooltipY < chartAreaTop) tooltipY = Math.max(y1, y2) + 10;
        if (tooltipY + tooltipHeight > chartAreaBottom) tooltipY = chartAreaBottom - tooltipHeight;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

        ctx.fillStyle = colors.primary;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${labels[i]}`, tooltipX + 8, tooltipY + 14);
        ctx.fillText(`S1: ${data1[i]}`, tooltipX + 8, tooltipY + 32);
        ctx.fillStyle = colors.secondary;
        ctx.fillText(`S2: ${data2[i]}`, tooltipX + 8, tooltipY + 50);
        ctx.fillStyle = '#FFD60A';
        ctx.fillText(`T: ${data1[i] + data2[i]}`, tooltipX + 8, tooltipY + 68);

        ctx.globalAlpha = 1;
      }
    }

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Series 1', color: colors.primary },
        { label: 'Series 2', color: colors.secondary },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 3. TOOLTIP - EXTERNAL HTML
  const drawTooltipExternal = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [30, 45, 60, 75, 50, 65, 80];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'External HTML Tooltip', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = Math.max(...data);
    const easedProgress = easeOutQuart(progress);

    // Draw area chart
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - 30);
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;
      ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.lineTo(padding + easedProgress * chartWidth, height - padding - 30);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding - 30);
    gradient.addColorStop(0, `${colors.primary}66`);
    gradient.addColorStop(1, `${colors.primary}11`);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      if (i / (data.length - 1) > easedProgress) break;
    }
    ctx.stroke();

    // Draw points
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;

      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // External tooltip indicator
    if (progress > 0.7) {
      const tooltipAlpha = Math.min(1, (progress - 0.7) / 0.3);
      ctx.globalAlpha = tooltipAlpha;
      ctx.fillStyle = colors.primary;
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Hover for external tooltip', width / 2, height - 15);
      ctx.globalAlpha = 1;
    }
  };

  // 4. INTERACTION MODES
  const drawInteractionModes = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 60;
    const data = [
      [65, 59, 80],
      [45, 69, 70],
      [55, 75, 60],
    ];
    const labels = ['Q1', 'Q2', 'Q3'];
    const series = ['Product A', 'Product B', 'Product C'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Interaction Modes (Point, Nearest, Index)', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - bottomPadding;
    const chartWidth = width - 2 * padding;
    const maxValue = 100;
    const barWidth = (chartWidth / labels.length) * 0.12;
    const seriesColors = [colors.primary, colors.secondary, '#FF006E'];

    // Draw grouped bars
    for (let i = 0; i < labels.length; i++) {
      for (let j = 0; j < series.length; j++) {
        const groupX =
          padding + (i * chartWidth) / labels.length + chartWidth / (labels.length * 2);
        const x = groupX + (j - 1) * (barWidth + 1) - barWidth / 2;
        const barDelay = i * 0.1 + j * 0.05;
        const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
        const easedBarProgress = easeOutQuart(barProgress);

        const barHeight = (data[j][i] / maxValue) * chartHeight * easedBarProgress;
        const y = padding + chartHeight - barHeight;

        ctx.fillStyle = seriesColors[j];
        ctx.fillRect(x, y, barWidth, barHeight);
        ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);

        // Highlight interaction (simulated for middle bar of Q2)
        if (i === 1 && j === 1 && progress > 0.8) {
          const highlightAlpha = Math.min(1, (progress - 0.8) / 0.2);
          ctx.globalAlpha = highlightAlpha;
          ctx.strokeStyle = '#FFD60A';
          ctx.lineWidth = 3;
          ctx.strokeRect(x - 2, y - 2, barWidth + 4, barHeight + 4);
          ctx.globalAlpha = 1;
        }
      }
    }

    // Draw labels
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * chartWidth) / labels.length + chartWidth / (labels.length * 2);
      ctx.fillText(labels[i], x, height - padding - bottomPadding + 35);
    }
    ctx.globalAlpha = 1;

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      series.map((s, i) => ({ label: s, color: seriesColors[i] })),
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 5. TOOLTIP - POINT STYLE
  const drawTooltipPointStyle = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 40;
    const data1 = [65, 59, 80, 81, 56, 55];
    const data2 = [45, 69, 70, 91, 66, 75];
    const data3 = [55, 65, 60, 70, 75, 65];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Tooltip Point Styles', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - bottomPadding;
    const chartWidth = width - 2 * padding;
    const maxValue = 100;
    const easedProgress = easeOutQuart(progress);

    const datasets = [
      { data: data1, color: colors.primary, style: 'circle' },
      { data: data2, color: colors.secondary, style: 'rect' },
      { data: data3, color: '#FF006E', style: 'triangle' },
    ];

    // Draw lines and points
    datasets.forEach((dataset, datasetIndex) => {
      // Draw line
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < dataset.data.length; i++) {
        const x = padding + (i * chartWidth) / (dataset.data.length - 1);
        const y = height - padding - bottomPadding - (dataset.data[i] / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        if (i / (dataset.data.length - 1) > easedProgress) break;
      }
      ctx.stroke();

      // Draw points with different styles
      for (let i = 0; i < dataset.data.length; i++) {
        if (i / (dataset.data.length - 1) > easedProgress) break;
        const x = padding + (i * chartWidth) / (dataset.data.length - 1);
        const y = height - padding - bottomPadding - (dataset.data[i] / maxValue) * chartHeight;

        ctx.fillStyle = dataset.color;
        ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
        ctx.lineWidth = 2;

        if (dataset.style === 'circle') {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (dataset.style === 'rect') {
          ctx.fillRect(x - 5, y - 5, 10, 10);
          ctx.strokeRect(x - 5, y - 5, 10, 10);
        } else if (dataset.style === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(x, y - 6);
          ctx.lineTo(x - 5, y + 4);
          ctx.lineTo(x + 5, y + 4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
    });

    // Draw labels
    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * chartWidth) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding - bottomPadding + 35);
    }
    ctx.globalAlpha = 1;

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Circle Points', color: colors.primary },
        { label: 'Square Points', color: colors.secondary },
        { label: 'Triangle Points', color: '#FF006E' },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 6. TOOLTIP - POSITION
  const drawTooltipPosition = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const maxRadius = Math.min(width - 2 * padding, height - 2 * padding) / 2.5;
    const radius = maxRadius * 0.8;

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Tooltip Positioning', width, height, titleOptions);
    ctx.globalAlpha = 1;

    const data = [30, 25, 20, 15, 10];
    const pieColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A', '#00FF00'];
    const labels = ['A', 'B', 'C', 'D', 'E'];
    const total = data.reduce((a, b) => a + b, 0);

    const easedProgress = easeOutQuart(progress);
    let startAngle = -Math.PI / 2;

    data.forEach((value, i) => {
      const sliceAngle = (value / total) * Math.PI * 2 * easedProgress;
      const endAngle = startAngle + sliceAngle;
      const midAngle = (startAngle + endAngle) / 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, `${pieColors[i]}88`);
      gradient.addColorStop(1, `${pieColors[i]}FF`);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tooltip at different positions (simulated for slice 2)
      if (i === 2 && progress > 0.7) {
        const tooltipAlpha = Math.min(1, (progress - 0.7) / 0.3);
        ctx.globalAlpha = tooltipAlpha;

        const tooltipWidth = 70;
        const tooltipHeight = 32;
        const tooltipDistance = radius + 15;
        let tooltipX = centerX + Math.cos(midAngle) * tooltipDistance;
        let tooltipY = centerY + Math.sin(midAngle) * tooltipDistance;

        // Constrain tooltip within canvas bounds with proper margins
        const minX = padding + 5;
        const maxX = width - padding - tooltipWidth - 5;
        const minY = padding + 5;
        const maxY = height - padding - tooltipHeight - 5;

        tooltipX = Math.max(minX, Math.min(tooltipX - tooltipWidth / 2, maxX));
        tooltipY = Math.max(minY, Math.min(tooltipY - tooltipHeight / 2, maxY));

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        ctx.strokeStyle = pieColors[i];
        ctx.lineWidth = 2;
        ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

        ctx.fillStyle = pieColors[i];
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], tooltipX + tooltipWidth / 2, tooltipY + 9);
        ctx.font = '8px monospace';
        ctx.fillText(
          `${value} (${((value / total) * 100).toFixed(1)}%)`,
          tooltipX + tooltipWidth / 2,
          tooltipY + 21
        );

        ctx.globalAlpha = 1;
      }

      startAngle = endAngle;
    });

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      labels.map((label, i) => ({ label, color: pieColors[i] })),
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // ==================== END OF TOOLTIP & INTERACTION ====================

  // ==================== SCRIPTABLE OPTIONS ====================

  // 1. SCRIPTABLE BAR CHART
  const drawScriptableBar = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56, 55, 70];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Scriptable Bar Chart', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = Math.max(...data);
    const barWidth = (chartWidth / data.length) * 0.25;

    // Draw bars with scriptable colors based on value
    for (let i = 0; i < data.length; i++) {
      const x =
        padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;
      const barDelay = i * 0.1;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
      const easedBarProgress = easeOutQuart(barProgress);

      const barHeight = (data[i] / maxValue) * chartHeight * 0.75 * easedBarProgress;
      const y = height - padding - 60 - barHeight;

      // Scriptable color based on value
      let barColor;
      if (data[i] > 75) {
        barColor = '#00FF00'; // Green for high values
      } else if (data[i] > 60) {
        barColor = colors.primary; // Cyan for medium values
      } else {
        barColor = '#FF006E'; // Pink for low values
      }

      const gradient = ctx.createLinearGradient(x, y, x, height - padding - 60);
      gradient.addColorStop(0, `${barColor}FF`);
      gradient.addColorStop(1, `${barColor}66`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.strokeStyle = barColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Value label
      if (barProgress > 0.5) {
        ctx.fillStyle = barColor;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(data[i].toString(), x + barWidth / 2, y - 5);
      }
    }

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'High (>75)', color: '#00FF00' },
        { label: 'Medium (>60)', color: colors.primary },
        { label: 'Low', color: '#FF006E' },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 2. SCRIPTABLE BUBBLE CHART
  const drawScriptableBubble = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Scriptable Bubble Chart', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;

    const bubbles = [
      { x: 20, y: 30, r: 15, value: 30 },
      { x: 40, y: 50, r: 25, value: 50 },
      { x: 60, y: 70, r: 20, value: 70 },
      { x: 80, y: 40, r: 30, value: 40 },
      { x: 30, y: 80, r: 18, value: 80 },
      { x: 70, y: 60, r: 22, value: 60 },
    ];

    // Predefined colors for bubbles
    const bubbleColors = [
      colors.primary,
      colors.secondary,
      '#FF006E',
      '#FFD60A',
      '#00FF00',
      '#FF00FF',
    ];

    const easedProgress = easeOutQuart(progress);

    bubbles.forEach((bubble, i) => {
      const delay = i * 0.1;
      const bubbleProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      if (bubbleProgress > 0) {
        const x = padding + (bubble.x / 100) * chartWidth;
        const y = height - padding - 40 - (bubble.y / 100) * chartHeight;
        const r = bubble.r * easeOutQuart(bubbleProgress);

        // Use predefined color
        const bubbleColor = bubbleColors[i];

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, `${bubbleColor}88`);
        gradient.addColorStop(1, `${bubbleColor}33`);
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = bubbleColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Value label
        if (bubbleProgress > 0.7) {
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(bubble.value.toString(), x, y);
        }
      }
    });

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Colors based on position', width / 2, height - 15);
    ctx.globalAlpha = 1;
  };

  // 3. SCRIPTABLE LINE CHART
  const drawScriptableLine = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56, 55, 70, 75];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Scriptable Line Chart', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = Math.max(...data);
    const easedProgress = easeOutQuart(progress);

    // Draw line segments with different colors
    for (let i = 0; i < data.length - 1; i++) {
      const segmentProgress = Math.max(
        0,
        Math.min(1, (easedProgress - i / (data.length - 1)) * (data.length - 1))
      );
      if (segmentProgress > 0) {
        const x1 = padding + (i * chartWidth) / (data.length - 1);
        const y1 = height - padding - 40 - (data[i] / maxValue) * chartHeight;
        const x2 = padding + ((i + 1) * chartWidth) / (data.length - 1);
        const y2 = height - padding - 40 - (data[i + 1] / maxValue) * chartHeight;

        // Scriptable color based on segment slope
        const slope = data[i + 1] - data[i];
        let segmentColor;
        if (slope > 10) {
          segmentColor = '#00FF00'; // Green for increasing
        } else if (slope < -10) {
          segmentColor = '#FF006E'; // Pink for decreasing
        } else {
          segmentColor = colors.primary; // Cyan for stable
        }

        ctx.strokeStyle = segmentColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + (x2 - x1) * segmentProgress, y1 + (y2 - y1) * segmentProgress);
        ctx.stroke();
      }
    }

    // Draw points
    for (let i = 0; i < data.length; i++) {
      if (i / (data.length - 1) > easedProgress) break;
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;

      // Scriptable point size based on value
      const pointSize = 3 + (data[i] / maxValue) * 5;

      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(x, y, pointSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Increasing', color: '#00FF00' },
        { label: 'Stable', color: colors.primary },
        { label: 'Decreasing', color: '#FF006E' },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 4. SCRIPTABLE PIE CHART
  const drawScriptablePie = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radius = Math.min(width, height) / 3;

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Scriptable Pie Chart', width, height, titleOptions);
    ctx.globalAlpha = 1;

    const data = [30, 25, 20, 15, 10];
    const labels = ['A', 'B', 'C', 'D', 'E'];
    const total = data.reduce((a, b) => a + b, 0);

    const easedProgress = easeOutQuart(progress);
    let startAngle = -Math.PI / 2;

    // Predefined colors instead of HSL
    const sliceColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A', '#00FF00'];

    data.forEach((value, i) => {
      const sliceAngle = (value / total) * Math.PI * 2 * easedProgress;
      const endAngle = startAngle + sliceAngle;
      const midAngle = (startAngle + endAngle) / 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Use predefined colors
      const sliceColor = sliceColors[i];

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, `${sliceColor}88`);
      gradient.addColorStop(1, `${sliceColor}FF`);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Scriptable border width based on value
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 1 + (value / total) * 5;
      ctx.stroke();

      // Label
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], labelX, labelY);
      ctx.fillText(`${value}`, labelX, labelY + 15);

      startAngle = endAngle;
    });

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Border width based on value', width / 2, height - 15);
    ctx.globalAlpha = 1;
  };

  // 5. SCRIPTABLE POLAR AREA CHART
  const drawScriptablePolar = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const maxRadius = Math.min(width, height) / 3;

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Scriptable Polar Area Chart', width, height, titleOptions);
    ctx.globalAlpha = 1;

    const data = [65, 59, 90, 81, 56, 75];
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

      // Scriptable color based on value
      let segmentColor;
      if (value > 80) {
        segmentColor = '#00FF00';
      } else if (value > 65) {
        segmentColor = colors.primary;
      } else {
        segmentColor = '#FF006E';
      }

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, `${segmentColor}33`);
      gradient.addColorStop(1, `${segmentColor}FF`);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'High (>80)', color: '#00FF00' },
        { label: 'Medium (>65)', color: colors.primary },
        { label: 'Low', color: '#FF006E' },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // 6. SCRIPTABLE RADAR CHART
  const drawScriptableRadar = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radius = Math.min(width, height) / 3;

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Scriptable Radar Chart', width, height, titleOptions);
    ctx.globalAlpha = 1;

    const data = [65, 59, 90, 81, 56, 75];
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

    // Draw data with scriptable point styles
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
      const r = (data[i] / maxValue) * radius * easedProgress;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Fill with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `${colors.primary}44`);
    gradient.addColorStop(1, `${colors.primary}11`);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw points with scriptable styles based on value
    for (let i = 0; i < data.length; i++) {
      if (i / data.length > easedProgress) break;
      const angle = (i * Math.PI * 2) / data.length - Math.PI / 2;
      const r = (data[i] / maxValue) * radius;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      // Scriptable point size and color based on value
      const pointSize = 3 + (data[i] / maxValue) * 5;
      let pointColor;
      if (data[i] > 80) {
        pointColor = '#00FF00';
      } else if (data[i] > 60) {
        pointColor = colors.primary;
      } else {
        pointColor = '#FF006E';
      }

      ctx.fillStyle = pointColor;
      ctx.beginPath();
      ctx.arc(x, y, pointSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'High (>80)', color: '#00FF00' },
        { label: 'Medium (>60)', color: colors.primary },
        { label: 'Low', color: '#FF006E' },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  // ==================== END OF SCRIPTABLE OPTIONS ====================

  // ==================== ANIMATIONS ====================

  // 1. ANIMATION - DELAY
  const drawAnimDelay = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56, 55, 70];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Animation with Delay', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = Math.max(...data);
    const barWidth = (chartWidth / data.length) * 0.25;

    // Draw bars with staggered delay
    for (let i = 0; i < data.length; i++) {
      const x =
        padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;

      // Each bar has increasing delay
      const barDelay = i * 0.12;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
      const easedBarProgress = easeOutQuart(barProgress);

      const barHeight = (data[i] / maxValue) * chartHeight * 0.75 * easedBarProgress;
      const y = height - padding - 60 - barHeight;

      const gradient = ctx.createLinearGradient(x, y, x, height - padding - 60);
      gradient.addColorStop(0, `${colors.primary}FF`);
      gradient.addColorStop(1, `${colors.primary}66`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Value label with fade-in
      if (barProgress > 0.7) {
        const labelAlpha = (barProgress - 0.7) / 0.3;
        ctx.globalAlpha = labelAlpha;
        ctx.fillStyle = colors.primary;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(data[i].toString(), x + barWidth / 2, y - 5);
        ctx.globalAlpha = 1;
      }
    }

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Each bar animates with 120ms delay', width / 2, height - 15);
    ctx.globalAlpha = 1;
  };

  // 2. ANIMATION - DROP
  const drawAnimDrop = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56, 55, 70];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Drop Animation', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = Math.max(...data);
    const barWidth = (chartWidth / data.length) * 0.7;

    // Draw bars with drop effect
    for (let i = 0; i < data.length; i++) {
      const x =
        padding + (i * chartWidth) / data.length + (chartWidth / data.length - barWidth) / 2;

      const barDelay = i * 0.08;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));

      // Bounce easing for drop effect
      const easedBarProgress =
        barProgress < 0.5
          ? 4 * barProgress * barProgress * barProgress
          : 1 - Math.pow(-2 * barProgress + 2, 3) / 2;

      const finalBarHeight = (data[i] / maxValue) * chartHeight;
      const barHeight = finalBarHeight * easedBarProgress;

      // Drop from top
      const dropOffset = (1 - easedBarProgress) * (height - padding - 30);
      const y = padding + dropOffset;

      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, `${colors.secondary}FF`);
      gradient.addColorStop(1, `${colors.secondary}66`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);
    }

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.secondary;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Bars drop from top with bounce', width / 2, height - 15);
    ctx.globalAlpha = 1;
  };

  // 3. ANIMATION - LOOP
  const drawAnimLoop = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const radius = Math.min(width, height) / 3;

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Loop Animation', width, height, titleOptions);
    ctx.globalAlpha = 1;

    const data = [30, 25, 20, 15, 10];
    const pieColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A', '#00FF00'];
    const labels = ['A', 'B', 'C', 'D', 'E'];
    const total = data.reduce((a, b) => a + b, 0);

    // Loop animation - rotates continuously
    const loopProgress = (progress * 2) % 1;
    const rotation = loopProgress * Math.PI * 2;

    let startAngle = -Math.PI / 2 + rotation;

    data.forEach((value, i) => {
      const sliceAngle = (value / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, `${pieColors[i]}88`);
      gradient.addColorStop(1, `${pieColors[i]}FF`);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Continuous rotation loop', width / 2, height - 15);
    ctx.globalAlpha = 1;
  };

  // 4. ANIMATION - PROGRESSIVE LINE
  const drawAnimProgressive = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56, 55, 70, 75, 85, 90];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Progressive Line Animation', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = Math.max(...data);

    // Progressive line drawing
    const pointsToShow = Math.floor(data.length * progress);

    // Draw line
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= pointsToShow; i++) {
      const index = Math.min(i, data.length - 1);
      const x = padding + (index * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[index] / maxValue) * chartHeight;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw points progressively
    for (let i = 0; i <= pointsToShow; i++) {
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;

      // Last point pulses
      const isPulsingPoint = i === pointsToShow && pointsToShow < data.length;
      const pulseScale = isPulsingPoint ? 1 + Math.sin(progress * Math.PI * 4) * 0.3 : 1;

      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(x, y, 5 * pulseScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.primary;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Line draws progressively point by point', width / 2, height - 15);
    ctx.globalAlpha = 1;
  };

  // 5. ANIMATION - PROGRESSIVE WITH EASING
  const drawAnimProgressiveEasing = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const data = [65, 59, 80, 81, 56, 55, 70, 75, 85, 90];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Progressive Line with Easing', width, height, titleOptions);
    ctx.globalAlpha = 1;

    drawGrid(ctx, width, height, padding, gridOptions);

    const chartHeight = height - 2 * padding - 60;
    const chartWidth = width - 2 * padding;
    const maxValue = Math.max(...data);

    // Apply easing to progress
    const easedProgress = easeOutQuart(progress);
    const pointsToShow = Math.floor(data.length * easedProgress);
    const partialProgress = (data.length * easedProgress) % 1;

    // Draw line with smooth easing
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= pointsToShow; i++) {
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    // Draw partial segment to next point
    if (pointsToShow < data.length - 1 && partialProgress > 0) {
      const x1 = padding + (pointsToShow * chartWidth) / (data.length - 1);
      const y1 = height - padding - 40 - (data[pointsToShow] / maxValue) * chartHeight;
      const x2 = padding + ((pointsToShow + 1) * chartWidth) / (data.length - 1);
      const y2 = height - padding - 40 - (data[pointsToShow + 1] / maxValue) * chartHeight;

      ctx.lineTo(x1 + (x2 - x1) * partialProgress, y1 + (y2 - y1) * partialProgress);
    }
    ctx.stroke();

    // Draw points with easing
    for (let i = 0; i <= pointsToShow; i++) {
      const x = padding + (i * chartWidth) / (data.length - 1);
      const y = height - padding - 40 - (data[i] / maxValue) * chartHeight;

      const pointDelay = i / data.length;
      const pointProgress = Math.max(0, Math.min(1, (easedProgress - pointDelay) * data.length));
      const pointScale = easeOutQuart(pointProgress);

      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.arc(x, y, 5 * pointScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(10, 14, 39, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.globalAlpha = progress;
    ctx.fillStyle = colors.secondary;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Smooth easing with easeOutQuart', width / 2, height - 15);
    ctx.globalAlpha = 1;
  };

  // ==================== END OF ANIMATIONS ====================

  // ==================== END OF OTHER CHARTS ====================

  const drawMixedChart = (canvas: HTMLCanvasElement, progress: number = 1) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const bottomPadding = 60;
    const lineData = [65, 59, 80, 81, 56, 55];
    const barData = [45, 55, 60, 70, 50, 65];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    // Clear with background
    ctx.fillStyle = 'rgba(10, 14, 39, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Draw title with fade-in
    ctx.globalAlpha = progress;
    drawCustomTitle(ctx, 'Mixed Chart - Line + Bar Combination', width, height, titleOptions);
    ctx.globalAlpha = 1;

    // Draw grid
    ctx.strokeStyle = `${colors.primary}33`;
    ctx.lineWidth = 1;
    ctx.globalAlpha = progress;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * (height - 2 * padding - bottomPadding)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = colors.primary;
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${100 - i * 20}`, padding - 10, y + 4);
    }

    // X-axis labels
    ctx.fillStyle = colors.primary;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < labels.length; i++) {
      const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
      ctx.fillText(labels[i], x, height - padding + 10);
    }
    ctx.globalAlpha = 1;

    // Draw bars first (background layer)
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding - bottomPadding;
    const baselineY = padding + chartHeight;
    const barWidth = (chartWidth / barData.length) * 0.6;
    const maxValue = 100;
    for (let i = 0; i < barData.length; i++) {
      const x =
        padding + (i * chartWidth) / barData.length + (chartWidth / barData.length - barWidth) / 2;

      // Animated bar height
      const barDelay = i * 0.1;
      const barProgress = Math.max(0, Math.min(1, (progress - barDelay) / (1 - barDelay)));
      const easedBarProgress = easeOutQuart(barProgress);

      const fullBarHeight = (barData[i] / maxValue) * chartHeight;
      const barHeight = fullBarHeight * easedBarProgress;
      const y = baselineY - barHeight;

      // Bar with gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, `${colors.secondary}88`);
      gradient.addColorStop(1, `${colors.secondary}33`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Bar border
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);
    }

    // Draw line on top (foreground layer)
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    const animatedLength = Math.floor(lineData.length * progress);
    for (let i = 0; i <= animatedLength; i++) {
      const index = Math.min(i, lineData.length - 1);
      const x = padding + (index * chartWidth) / (lineData.length - 1);
      const y = baselineY - (lineData[index] / maxValue) * chartHeight;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw points
    ctx.fillStyle = colors.primary;
    for (let i = 0; i < lineData.length; i++) {
      if (i / lineData.length > progress) break;

      const x = padding + (i * chartWidth) / (lineData.length - 1);
      const y = baselineY - (lineData[i] / maxValue) * chartHeight;

      const pointProgress = Math.min(1, (progress * lineData.length - i) * 2);
      const scale = easeOutQuart(Math.max(0, pointProgress));
      const radius = 5 * scale;

      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 10 * scale;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Point border
      ctx.strokeStyle = variant === 'r-huds' ? '#0a0e27' : '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw legend
    ctx.globalAlpha = progress;
    drawLegend(
      ctx,
      [
        { label: 'Line Data', color: colors.primary },
        { label: 'Bar Data', color: colors.secondary },
      ],
      width - 180,
      40
    );
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    // Draw all charts with animation progress
    if (lineChartRef.current) {
      lineChartRef.current.width = lineChartRef.current.parentElement?.clientWidth || 400;
      lineChartRef.current.height = 300;
      drawLineChart(lineChartRef.current, animationProgress);
    }
    if (barChartRef.current) {
      barChartRef.current.width = barChartRef.current.parentElement?.clientWidth || 400;
      barChartRef.current.height = 300;
      drawBarChart(barChartRef.current, animationProgress);
    }
    if (pieChartRef.current) {
      pieChartRef.current.width = pieChartRef.current.parentElement?.clientWidth || 400;
      pieChartRef.current.height = 300;
      drawPieChart(pieChartRef.current, animationProgress);
    }
    if (doughnutChartRef.current) {
      doughnutChartRef.current.width = doughnutChartRef.current.parentElement?.clientWidth || 400;
      doughnutChartRef.current.height = 300;
      drawDoughnutChart(doughnutChartRef.current, animationProgress);
    }
    if (radarChartRef.current) {
      radarChartRef.current.width = radarChartRef.current.parentElement?.clientWidth || 400;
      radarChartRef.current.height = 300;
      drawRadarChart(radarChartRef.current, animationProgress);
    }
    if (polarChartRef.current) {
      polarChartRef.current.width = polarChartRef.current.parentElement?.clientWidth || 400;
      polarChartRef.current.height = 300;
      drawPolarChart(polarChartRef.current, animationProgress);
    }
    if (bubbleChartRef.current) {
      bubbleChartRef.current.width = bubbleChartRef.current.parentElement?.clientWidth || 400;
      bubbleChartRef.current.height = 300;
      drawBubbleChart(bubbleChartRef.current, animationProgress);
    }
    if (scatterChartRef.current) {
      scatterChartRef.current.width = scatterChartRef.current.parentElement?.clientWidth || 400;
      scatterChartRef.current.height = 300;
      drawScatterChart(scatterChartRef.current, animationProgress);
    }
    if (mixedChartRef.current) {
      mixedChartRef.current.width = mixedChartRef.current.parentElement?.clientWidth || 400;
      mixedChartRef.current.height = 300;
      drawMixedChart(mixedChartRef.current, animationProgress);
    }
    if (barBorderRadiusRef.current) {
      barBorderRadiusRef.current.width =
        barBorderRadiusRef.current.parentElement?.clientWidth || 400;
      barBorderRadiusRef.current.height = 300;
      drawBarChartWithBorderRadius(barBorderRadiusRef.current, animationProgress);
    }
    if (floatingBarsRef.current) {
      floatingBarsRef.current.width = floatingBarsRef.current.parentElement?.clientWidth || 400;
      floatingBarsRef.current.height = 300;
      drawFloatingBars(floatingBarsRef.current, animationProgress);
    }
    if (horizontalBarRef.current) {
      horizontalBarRef.current.width = horizontalBarRef.current.parentElement?.clientWidth || 400;
      horizontalBarRef.current.height = 300;
      drawHorizontalBarChart(horizontalBarRef.current, animationProgress);
    }
    if (stackedBarRef.current) {
      stackedBarRef.current.width = stackedBarRef.current.parentElement?.clientWidth || 400;
      stackedBarRef.current.height = 300;
      drawStackedBarChart(stackedBarRef.current, animationProgress);
    }
    if (stackedGroupedBarRef.current) {
      stackedGroupedBarRef.current.width =
        stackedGroupedBarRef.current.parentElement?.clientWidth || 400;
      stackedGroupedBarRef.current.height = 300;
      drawStackedGroupedBarChart(stackedGroupedBarRef.current, animationProgress);
    }

    // Line Chart Variants
    if (lineInterpolationRef.current) {
      lineInterpolationRef.current.width =
        lineInterpolationRef.current.parentElement?.clientWidth || 400;
      lineInterpolationRef.current.height = 300;
      drawLineInterpolation(lineInterpolationRef.current, animationProgress);
    }
    if (multiAxisLineRef.current) {
      multiAxisLineRef.current.width = multiAxisLineRef.current.parentElement?.clientWidth || 400;
      multiAxisLineRef.current.height = 300;
      drawMultiAxisLine(multiAxisLineRef.current, animationProgress);
    }
    if (pointStylingRef.current) {
      pointStylingRef.current.width = pointStylingRef.current.parentElement?.clientWidth || 400;
      pointStylingRef.current.height = 300;
      drawPointStyling(pointStylingRef.current, animationProgress);
    }
    if (segmentStylingRef.current) {
      segmentStylingRef.current.width = segmentStylingRef.current.parentElement?.clientWidth || 400;
      segmentStylingRef.current.height = 300;
      drawSegmentStyling(segmentStylingRef.current, animationProgress);
    }
    if (steppedLineRef.current) {
      steppedLineRef.current.width = steppedLineRef.current.parentElement?.clientWidth || 400;
      steppedLineRef.current.height = 300;
      drawSteppedLine(steppedLineRef.current, animationProgress);
    }
    if (lineStylingRef.current) {
      lineStylingRef.current.width = lineStylingRef.current.parentElement?.clientWidth || 400;
      lineStylingRef.current.height = 300;
      drawLineStyling(lineStylingRef.current, animationProgress);
    }

    // Other Charts
    if (comboBarLineRef.current) {
      comboBarLineRef.current.width = comboBarLineRef.current.parentElement?.clientWidth || 400;
      comboBarLineRef.current.height = 300;
      drawComboBarLine(comboBarLineRef.current, animationProgress);
    }
    if (multiSeriesPieRef.current) {
      multiSeriesPieRef.current.width = multiSeriesPieRef.current.parentElement?.clientWidth || 400;
      multiSeriesPieRef.current.height = 300;
      drawMultiSeriesPie(multiSeriesPieRef.current, animationProgress);
    }
    if (polarAreaRef.current) {
      polarAreaRef.current.width = polarAreaRef.current.parentElement?.clientWidth || 400;
      polarAreaRef.current.height = 300;
      drawPolarArea(polarAreaRef.current, animationProgress);
    }
    if (polarAreaCenteredRef.current) {
      polarAreaCenteredRef.current.width =
        polarAreaCenteredRef.current.parentElement?.clientWidth || 400;
      polarAreaCenteredRef.current.height = 300;
      drawPolarAreaCentered(polarAreaCenteredRef.current, animationProgress);
    }
    if (radarSkipPointsRef.current) {
      radarSkipPointsRef.current.width =
        radarSkipPointsRef.current.parentElement?.clientWidth || 400;
      radarSkipPointsRef.current.height = 300;
      drawRadarSkipPoints(radarSkipPointsRef.current, animationProgress);
    }
    if (scatterMultiAxisRef.current) {
      scatterMultiAxisRef.current.width =
        scatterMultiAxisRef.current.parentElement?.clientWidth || 400;
      scatterMultiAxisRef.current.height = 300;
      drawScatterMultiAxis(scatterMultiAxisRef.current, animationProgress);
    }
    if (stackedBarLineRef.current) {
      stackedBarLineRef.current.width = stackedBarLineRef.current.parentElement?.clientWidth || 400;
      stackedBarLineRef.current.height = 300;
      drawStackedBarLine(stackedBarLineRef.current, animationProgress);
    }

    // Advanced Line & Area Charts
    if (areaChartRef.current) {
      areaChartRef.current.width = areaChartRef.current.parentElement?.clientWidth || 400;
      areaChartRef.current.height = 300;
      drawAreaChart(areaChartRef.current, animationProgress);
    }
    if (lineBoundariesRef.current) {
      lineBoundariesRef.current.width = lineBoundariesRef.current.parentElement?.clientWidth || 400;
      lineBoundariesRef.current.height = 300;
      drawLineBoundaries(lineBoundariesRef.current, animationProgress);
    }
    if (lineDatasetsRef.current) {
      lineDatasetsRef.current.width = lineDatasetsRef.current.parentElement?.clientWidth || 400;
      lineDatasetsRef.current.height = 300;
      drawLineDatasets(lineDatasetsRef.current, animationProgress);
    }
    if (lineDrawTimeRef.current) {
      lineDrawTimeRef.current.width = lineDrawTimeRef.current.parentElement?.clientWidth || 400;
      lineDrawTimeRef.current.height = 300;
      drawLineDrawTime(lineDrawTimeRef.current, animationProgress);
    }
    if (lineStackedRef.current) {
      lineStackedRef.current.width = lineStackedRef.current.parentElement?.clientWidth || 400;
      lineStackedRef.current.height = 300;
      drawLineStacked(lineStackedRef.current, animationProgress);
    }
    if (radarStackedRef.current) {
      radarStackedRef.current.width = radarStackedRef.current.parentElement?.clientWidth || 400;
      radarStackedRef.current.height = 300;
      drawRadarStacked(radarStackedRef.current, animationProgress);
    }

    // Scales & Configuration Options
    if (linearScaleMinMaxRef.current) {
      linearScaleMinMaxRef.current.width =
        linearScaleMinMaxRef.current.parentElement?.clientWidth || 400;
      linearScaleMinMaxRef.current.height = 300;
      drawLinearScaleMinMax(linearScaleMinMaxRef.current, animationProgress);
    }
    if (linearScaleSuggestedRef.current) {
      linearScaleSuggestedRef.current.width =
        linearScaleSuggestedRef.current.parentElement?.clientWidth || 400;
      linearScaleSuggestedRef.current.height = 300;
      drawLinearScaleSuggested(linearScaleSuggestedRef.current, animationProgress);
    }
    if (linearScaleStepSizeRef.current) {
      linearScaleStepSizeRef.current.width =
        linearScaleStepSizeRef.current.parentElement?.clientWidth || 400;
      linearScaleStepSizeRef.current.height = 300;
      drawLinearScaleStepSize(linearScaleStepSizeRef.current, animationProgress);
    }
    if (logScaleRef.current) {
      logScaleRef.current.width = logScaleRef.current.parentElement?.clientWidth || 400;
      logScaleRef.current.height = 300;
      drawLogScale(logScaleRef.current, animationProgress);
    }
    if (stackedLinearCategoryRef.current) {
      stackedLinearCategoryRef.current.width =
        stackedLinearCategoryRef.current.parentElement?.clientWidth || 400;
      stackedLinearCategoryRef.current.height = 300;
      drawStackedLinearCategory(stackedLinearCategoryRef.current, animationProgress);
    }
    if (timeScaleRef.current) {
      timeScaleRef.current.width = timeScaleRef.current.parentElement?.clientWidth || 400;
      timeScaleRef.current.height = 300;
      drawTimeScale(timeScaleRef.current, animationProgress);
    }
    if (timeScaleMaxSpanRef.current) {
      timeScaleMaxSpanRef.current.width =
        timeScaleMaxSpanRef.current.parentElement?.clientWidth || 400;
      timeScaleMaxSpanRef.current.height = 300;
      drawTimeScaleMaxSpan(timeScaleMaxSpanRef.current, animationProgress);
    }
    if (timeScaleComboRef.current) {
      timeScaleComboRef.current.width = timeScaleComboRef.current.parentElement?.clientWidth || 400;
      timeScaleComboRef.current.height = 300;
      drawTimeScaleCombo(timeScaleComboRef.current, animationProgress);
    }
    if (centerPositioningRef.current) {
      centerPositioningRef.current.width =
        centerPositioningRef.current.parentElement?.clientWidth || 400;
      centerPositioningRef.current.height = 300;
      drawCenterPositioning(centerPositioningRef.current, animationProgress);
    }
    if (gridConfigurationRef.current) {
      gridConfigurationRef.current.width =
        gridConfigurationRef.current.parentElement?.clientWidth || 400;
      gridConfigurationRef.current.height = 300;
      drawGridConfiguration(gridConfigurationRef.current, animationProgress);
    }
    if (tickConfigurationRef.current) {
      tickConfigurationRef.current.width =
        tickConfigurationRef.current.parentElement?.clientWidth || 400;
      tickConfigurationRef.current.height = 300;
      drawTickConfiguration(tickConfigurationRef.current, animationProgress);
    }
    if (titleConfigurationRef.current) {
      titleConfigurationRef.current.width =
        titleConfigurationRef.current.parentElement?.clientWidth || 400;
      titleConfigurationRef.current.height = 300;
      drawTitleConfiguration(titleConfigurationRef.current, animationProgress);
    }

    // Legend & Layout Options
    if (legendEventsRef.current) {
      legendEventsRef.current.width = legendEventsRef.current.parentElement?.clientWidth || 400;
      legendEventsRef.current.height = 300;
      drawLegendEvents(legendEventsRef.current, animationProgress);
    }
    if (htmlLegendRef.current) {
      htmlLegendRef.current.width = htmlLegendRef.current.parentElement?.clientWidth || 400;
      htmlLegendRef.current.height = 300;
      drawHTMLLegend(htmlLegendRef.current, animationProgress);
    }
    if (legendPointStyleRef.current) {
      legendPointStyleRef.current.width =
        legendPointStyleRef.current.parentElement?.clientWidth || 400;
      legendPointStyleRef.current.height = 300;
      drawLegendPointStyle(legendPointStyleRef.current, animationProgress);
    }
    if (legendPositionRef.current) {
      legendPositionRef.current.width = legendPositionRef.current.parentElement?.clientWidth || 400;
      legendPositionRef.current.height = 300;
      drawLegendPosition(legendPositionRef.current, animationProgress);
    }
    if (alignmentTitlePositionRef.current) {
      alignmentTitlePositionRef.current.width =
        alignmentTitlePositionRef.current.parentElement?.clientWidth || 400;
      alignmentTitlePositionRef.current.height = 300;
      drawAlignmentTitlePosition(alignmentTitlePositionRef.current, animationProgress);
    }

    // Tooltip & Interaction Modes
    if (tooltipCustomRef.current) {
      tooltipCustomRef.current.width = tooltipCustomRef.current.parentElement?.clientWidth || 400;
      tooltipCustomRef.current.height = 300;
      drawTooltipCustom(tooltipCustomRef.current, animationProgress);
    }
    if (tooltipContentRef.current) {
      tooltipContentRef.current.width = tooltipContentRef.current.parentElement?.clientWidth || 400;
      tooltipContentRef.current.height = 300;
      drawTooltipContent(tooltipContentRef.current, animationProgress);
    }
    if (tooltipExternalRef.current) {
      tooltipExternalRef.current.width =
        tooltipExternalRef.current.parentElement?.clientWidth || 400;
      tooltipExternalRef.current.height = 300;
      drawTooltipExternal(tooltipExternalRef.current, animationProgress);
    }
    if (interactionModesRef.current) {
      interactionModesRef.current.width =
        interactionModesRef.current.parentElement?.clientWidth || 400;
      interactionModesRef.current.height = 300;
      drawInteractionModes(interactionModesRef.current, animationProgress);
    }
    if (tooltipPointStyleRef.current) {
      tooltipPointStyleRef.current.width =
        tooltipPointStyleRef.current.parentElement?.clientWidth || 400;
      tooltipPointStyleRef.current.height = 300;
      drawTooltipPointStyle(tooltipPointStyleRef.current, animationProgress);
    }
    if (tooltipPositionRef.current) {
      tooltipPositionRef.current.width =
        tooltipPositionRef.current.parentElement?.clientWidth || 400;
      tooltipPositionRef.current.height = 300;
      drawTooltipPosition(tooltipPositionRef.current, animationProgress);
    }

    // Scriptable Options
    if (scriptableBarRef.current) {
      scriptableBarRef.current.width = scriptableBarRef.current.parentElement?.clientWidth || 400;
      scriptableBarRef.current.height = 300;
      drawScriptableBar(scriptableBarRef.current, animationProgress);
    }
    if (scriptableBubbleRef.current) {
      scriptableBubbleRef.current.width =
        scriptableBubbleRef.current.parentElement?.clientWidth || 400;
      scriptableBubbleRef.current.height = 300;
      drawScriptableBubble(scriptableBubbleRef.current, animationProgress);
    }
    if (scriptableLineRef.current) {
      scriptableLineRef.current.width = scriptableLineRef.current.parentElement?.clientWidth || 400;
      scriptableLineRef.current.height = 300;
      drawScriptableLine(scriptableLineRef.current, animationProgress);
    }
    if (scriptablePieRef.current) {
      scriptablePieRef.current.width = scriptablePieRef.current.parentElement?.clientWidth || 400;
      scriptablePieRef.current.height = 300;
      drawScriptablePie(scriptablePieRef.current, animationProgress);
    }
    if (scriptablePolarRef.current) {
      scriptablePolarRef.current.width =
        scriptablePolarRef.current.parentElement?.clientWidth || 400;
      scriptablePolarRef.current.height = 300;
      drawScriptablePolar(scriptablePolarRef.current, animationProgress);
    }
    if (scriptableRadarRef.current) {
      scriptableRadarRef.current.width =
        scriptableRadarRef.current.parentElement?.clientWidth || 400;
      scriptableRadarRef.current.height = 300;
      drawScriptableRadar(scriptableRadarRef.current, animationProgress);
    }

    // Animations
    if (animDelayRef.current) {
      animDelayRef.current.width = animDelayRef.current.parentElement?.clientWidth || 400;
      animDelayRef.current.height = 300;
      drawAnimDelay(animDelayRef.current, animationProgress);
    }
    if (animDropRef.current) {
      animDropRef.current.width = animDropRef.current.parentElement?.clientWidth || 400;
      animDropRef.current.height = 300;
      drawAnimDrop(animDropRef.current, animationProgress);
    }
    if (animLoopRef.current) {
      animLoopRef.current.width = animLoopRef.current.parentElement?.clientWidth || 400;
      animLoopRef.current.height = 300;
      drawAnimLoop(animLoopRef.current, animationProgress);
    }
    if (animProgressiveRef.current) {
      animProgressiveRef.current.width =
        animProgressiveRef.current.parentElement?.clientWidth || 400;
      animProgressiveRef.current.height = 300;
      drawAnimProgressive(animProgressiveRef.current, animationProgress);
    }
    if (animProgressiveEasingRef.current) {
      animProgressiveEasingRef.current.width =
        animProgressiveEasingRef.current.parentElement?.clientWidth || 400;
      animProgressiveEasingRef.current.height = 300;
      drawAnimProgressiveEasing(animProgressiveEasingRef.current, animationProgress);
    }
  }, [variant, animationProgress, lineDatasets, barDatasets, legendEventDatasets]);

  // Handle legend events canvas clicks
  useEffect(() => {
    const canvas = legendEventsRef.current;
    if (!canvas) return;

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Legend position
      const legendX = canvas.width - 180;
      const legendY = 40;
      const itemHeight = 25;

      // Check if click is within legend area
      legendEventDatasets.forEach((dataset, i) => {
        const itemY = legendY + i * itemHeight;
        if (x >= legendX - 5 && x <= legendX + 165 && y >= itemY - 5 && y <= itemY + 15) {
          toggleLegendEventDataset(i);
        }
      });
    };

    canvas.addEventListener('click', handleCanvasClick);
    return () => canvas.removeEventListener('click', handleCanvasClick);
  }, [legendEventDatasets]);

  return (
    <div className={`charts-showcase ${variant}`} role="main" aria-label="Charts Showcase">
      <div className="showcase-header">
        <h1>Charts Showcase</h1>
        <p>Complete Chart.js equivalent implementation with RHUDS & ColdWar themes</p>

        <div className="theme-switcher" role="toolbar" aria-label="Chart controls">
          <button
            className={variant === 'r-huds' ? 'active' : ''}
            onClick={() => setVariant('r-huds')}
            aria-pressed={variant === 'r-huds'}
            aria-label="Switch to RHUDS theme"
          >
            RHUDS Theme
          </button>
          <button
            className={variant === 'coldwar' ? 'active' : ''}
            onClick={() => setVariant('coldwar')}
            aria-pressed={variant === 'coldwar'}
            aria-label="Switch to ColdWar theme"
          >
            ColdWar Theme
          </button>
          <button
            onClick={handleReplay}
            style={{ marginLeft: '20px' }}
            aria-label="Replay animation"
            disabled={isAnimating && !isPaused}
          >
            🔄 Replay Animation
          </button>
          {isAnimating && (
            <>
              <button
                onClick={isPaused ? handleResume : handlePause}
                style={{ marginLeft: '10px' }}
                aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              <span style={{ marginLeft: '10px', fontSize: '14px' }}>
                Progress: {Math.round(animationProgress * 100)}%
              </span>
            </>
          )}
        </div>

        <div className="export-controls" role="region" aria-label="Export options">
          <h3>Export Charts</h3>
          <div className="export-buttons">
            <button
              onClick={() => exportToPNG(lineChartRef, 'line-chart')}
              aria-label="Export line chart as PNG"
            >
              📥 Export Line Chart (PNG)
            </button>
            <button
              onClick={() => exportToSVG(lineChartRef, 'line-chart')}
              aria-label="Export line chart as SVG"
            >
              📥 Export Line Chart (SVG)
            </button>
            <button
              onClick={() => exportToPNG(barChartRef, 'bar-chart')}
              aria-label="Export bar chart as PNG"
            >
              📥 Export Bar Chart (PNG)
            </button>
            <button
              onClick={() => exportToPNG(pieChartRef, 'pie-chart')}
              aria-label="Export pie chart as PNG"
            >
              📥 Export Pie Chart (PNG)
            </button>
            <button
              onClick={() => copyToClipboard(lineChartRef)}
              aria-label="Copy line chart to clipboard"
            >
              📋 Copy Line Chart
            </button>
            <button
              onClick={() => copyToClipboard(barChartRef)}
              aria-label="Copy bar chart to clipboard"
            >
              📋 Copy Bar Chart
            </button>
          </div>
        </div>
      </div>

      <div className="charts-grid" role="region" aria-label="Chart visualizations">
        <div className="chart-card full-width">
          <h3 id="line-chart-title">Line Chart</h3>
          <div className="chart-container">
            <canvas
              ref={lineChartRef}
              role="img"
              aria-labelledby="line-chart-title"
              aria-describedby="line-chart-desc"
              onMouseMove={(e) => {
                const visibleDatasets = lineDatasets.filter((ds) => ds.visible);
                if (visibleDatasets.length > 0) {
                  handleMouseMove(e, 'line', visibleDatasets[0].data, [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                  ]);
                }
              }}
              onMouseLeave={handleMouseLeave}
              tabIndex={0}
            ></canvas>
            <div id="line-chart-desc" className="sr-only">
              Line chart showing multiple datasets with values from January to June. Use mouse to
              hover over data points for detailed information.
            </div>
          </div>
          {/* Interactive Legend */}
          <div className="chart-legend-interactive" role="group" aria-label="Chart legend">
            {lineDatasets.map((dataset, index) => (
              <div
                key={index}
                className={`legend-item ${!dataset.visible ? 'disabled' : ''}`}
                onClick={() => handleLegendClick(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLegendClick(index);
                  }
                }}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                aria-pressed={dataset.visible}
                aria-label={`Toggle ${dataset.label} dataset visibility`}
              >
                <div
                  className="legend-color-box"
                  style={{
                    backgroundColor: dataset.color,
                    opacity: dataset.visible ? 1 : 0.3,
                  }}
                  aria-hidden="true"
                ></div>
                <span style={{ opacity: dataset.visible ? 1 : 0.5 }}>{dataset.label}</span>
              </div>
            ))}
          </div>
          <p>Multiple datasets with interactive legend (click to toggle)</p>
        </div>

        <div className="chart-card full-width">
          <h3 id="bar-chart-title">Bar Chart</h3>
          <div className="chart-container">
            <canvas
              ref={barChartRef}
              role="img"
              aria-labelledby="bar-chart-title"
              aria-describedby="bar-chart-desc"
              onMouseMove={(e) => {
                const visibleDatasets = barDatasets.filter((ds) => ds.visible);
                if (visibleDatasets.length > 0) {
                  handleMouseMove(e, 'bar', visibleDatasets[0].data, [
                    'Product A',
                    'Product B',
                    'Product C',
                    'Product D',
                  ]);
                }
              }}
              onMouseLeave={handleMouseLeave}
              tabIndex={0}
            ></canvas>
            <div id="bar-chart-desc" className="sr-only">
              Bar chart comparing multiple datasets across four products. Hover over bars for
              detailed values.
            </div>
          </div>
          {/* Interactive Legend */}
          <div className="chart-legend-interactive" role="group" aria-label="Chart legend">
            {barDatasets.map((dataset, index) => (
              <div
                key={index}
                className={`legend-item ${!dataset.visible ? 'disabled' : ''}`}
                onClick={() => handleBarLegendClick(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleBarLegendClick(index);
                  }
                }}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                aria-pressed={dataset.visible}
                aria-label={`Toggle ${dataset.label} dataset visibility`}
              >
                <div
                  className="legend-color-box"
                  style={{
                    backgroundColor: dataset.color,
                    opacity: dataset.visible ? 1 : 0.3,
                  }}
                  aria-hidden="true"
                ></div>
                <span style={{ opacity: dataset.visible ? 1 : 0.5 }}>{dataset.label}</span>
              </div>
            ))}
          </div>
          <p>Multiple datasets with grouped bars (click legend to toggle)</p>
        </div>

        <div className="chart-card">
          <h3>Pie Chart</h3>
          <div className="chart-container">
            <canvas
              ref={pieChartRef}
              onMouseMove={(e) =>
                handleMouseMove(e, 'pie', [300, 50, 100], ['Red', 'Blue', 'Yellow'])
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Show proportions of a whole</p>
        </div>

        <div className="chart-card">
          <h3>Doughnut Chart</h3>
          <div className="chart-container">
            <canvas
              ref={doughnutChartRef}
              onMouseMove={(e) =>
                handleMouseMove(e, 'doughnut', [55, 30, 15], ['Desktop', 'Mobile', 'Tablet'])
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Like pie chart with center cutout</p>
        </div>

        <div className="chart-card">
          <h3>Radar Chart</h3>
          <div className="chart-container">
            <canvas
              ref={radarChartRef}
              onMouseMove={(e) =>
                handleMouseMove(
                  e,
                  'radar',
                  [80, 90, 70, 85, 75],
                  ['Speed', 'Power', 'Defense', 'Agility', 'Intelligence']
                )
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Compare multiple variables</p>
        </div>

        <div className="chart-card">
          <h3>Polar Area Chart</h3>
          <div className="chart-container">
            <canvas
              ref={polarChartRef}
              onMouseMove={(e) =>
                handleMouseMove(e, 'polar', [11, 16, 7, 3, 14], ['A', 'B', 'C', 'D', 'E'])
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Similar to pie but with variable radius</p>
        </div>

        <div className="chart-card">
          <h3>Bubble Chart</h3>
          <div className="chart-container">
            <canvas
              ref={bubbleChartRef}
              onMouseMove={(e) =>
                handleMouseMove(e, 'bubble', [
                  { x: 20, y: 30, r: 15 },
                  { x: 40, y: 10, r: 10 },
                  { x: 30, y: 20, r: 20 },
                ])
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Three-dimensional data visualization</p>
        </div>

        <div className="chart-card">
          <h3>Scatter Chart</h3>
          <div className="chart-container">
            <canvas
              ref={scatterChartRef}
              onMouseMove={(e) =>
                handleMouseMove(e, 'scatter', [
                  { x: -10, y: 0 },
                  { x: 0, y: 10 },
                  { x: 10, y: 5 },
                  { x: 0.5, y: 5.5 },
                ])
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Show correlation between variables</p>
        </div>

        <div className="chart-card full-width">
          <h3>Mixed Chart (Line + Bar)</h3>
          <div className="chart-container">
            <canvas
              ref={mixedChartRef}
              onMouseMove={(e) =>
                handleMouseMove(
                  e,
                  'mixed',
                  [65, 70, 80, 75, 85, 80],
                  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                )
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Combine multiple chart types with gradient fills</p>
        </div>

        <div className="chart-card">
          <h3>Bar Chart with Border Radius</h3>
          <div className="chart-container">
            <canvas
              ref={barBorderRadiusRef}
              onMouseMove={(e) =>
                handleMouseMove(
                  e,
                  'bar',
                  [12, 19, 3, 5, 2, 3],
                  ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
                )
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Rounded corners for modern look</p>
        </div>

        <div className="chart-card">
          <h3>Floating Bars (Range Chart)</h3>
          <div className="chart-container">
            <canvas
              ref={floatingBarsRef}
              onMouseMove={(e) =>
                handleMouseMove(
                  e,
                  'bar',
                  [20, 30, 25, 35, 28, 32],
                  ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']
                )
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Show data ranges with floating bars</p>
        </div>

        <div className="chart-card">
          <h3>Horizontal Bar Chart</h3>
          <div className="chart-container">
            <canvas
              ref={horizontalBarRef}
              onMouseMove={(e) =>
                handleMouseMove(
                  e,
                  'bar',
                  [65, 59, 80, 81, 56],
                  ['Product A', 'Product B', 'Product C', 'Product D', 'Product E']
                )
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Bars oriented horizontally for better label readability</p>
        </div>

        <div className="chart-card full-width">
          <h3>Stacked Bar Chart</h3>
          <div className="chart-container">
            <canvas
              ref={stackedBarRef}
              onMouseMove={(e) =>
                handleMouseMove(e, 'bar', [20, 25, 30, 35], ['Q1', 'Q2', 'Q3', 'Q4'])
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Multiple datasets stacked vertically</p>
        </div>

        <div className="chart-card full-width">
          <h3>Stacked Bar Chart with Groups</h3>
          <div className="chart-container">
            <canvas
              ref={stackedGroupedBarRef}
              onMouseMove={(e) =>
                handleMouseMove(
                  e,
                  'bar',
                  [15, 20, 25, 30],
                  ['Group A', 'Group B', 'Group C', 'Group D']
                )
              }
              onMouseLeave={handleMouseLeave}
            ></canvas>
          </div>
          <p>Grouped stacked bars for complex data visualization</p>
        </div>
      </div>

      {/* Line Chart Variants Section */}
      <div className="charts-section">
        <h2 className="section-title">Line Chart Variants</h2>
        <div className="charts-grid">
          {/* Line Interpolation */}
          <div className="chart-card">
            <h3>Line Interpolation</h3>
            <div className="chart-container">
              <canvas
                ref={lineInterpolationRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Three interpolation modes: Linear, Smooth (Bezier), and Step</p>
          </div>

          {/* Multi Axis Line */}
          <div className="chart-card full-width">
            <h3>Multi Axis Line Chart</h3>
            <div className="chart-container">
              <canvas
                ref={multiAxisLineRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Two Y axes with different scales (left: 0-100, right: 0-400)</p>
          </div>

          {/* Point Styling */}
          <div className="chart-card">
            <h3>Point Styling</h3>
            <div className="chart-container">
              <canvas
                ref={pointStylingRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55, 40],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Different point shapes: Circle, Square, Triangle, Star, Diamond, Cross, Plus</p>
          </div>

          {/* Segment Styling */}
          <div className="chart-card">
            <h3>Segment Styling</h3>
            <div className="chart-container">
              <canvas
                ref={segmentStylingRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Different colors for each line segment</p>
          </div>

          {/* Stepped Line */}
          <div className="chart-card">
            <h3>Stepped Line Chart</h3>
            <div className="chart-container">
              <canvas
                ref={steppedLineRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Three step modes: Step-before, Step-after, Step-middle</p>
          </div>

          {/* Line Styling */}
          <div className="chart-card">
            <h3>Line Styling</h3>
            <div className="chart-container">
              <canvas
                ref={lineStylingRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Three line patterns: Solid, Dashed, Dotted</p>
          </div>
        </div>
      </div>

      {/* Other Chart Types Section */}
      <div className="charts-section">
        <h2 className="section-title">Other Chart Types</h2>
        <div className="charts-grid">
          {/* Combo Bar/Line */}
          <div className="chart-card full-width">
            <h3>Combo Bar/Line Chart</h3>
            <div className="chart-container">
              <canvas
                ref={comboBarLineRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 70, 80, 75, 85, 80],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Combines bar and line charts with independent datasets</p>
          </div>

          {/* Multi Series Pie */}
          <div className="chart-card">
            <h3>Multi Series Pie Chart</h3>
            <div className="chart-container">
              <canvas
                ref={multiSeriesPieRef}
                onMouseMove={(e) =>
                  handleMouseMove(e, 'pie', [30, 25, 20, 25], ['Q1', 'Q2', 'Q3', 'Q4'])
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Outer ring and inner circle for hierarchical data</p>
          </div>

          {/* Polar Area */}
          <div className="chart-card">
            <h3>Polar Area Chart</h3>
            <div className="chart-container">
              <canvas
                ref={polarAreaRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'polar',
                    [65, 59, 90, 81, 56, 75],
                    ['A', 'B', 'C', 'D', 'E', 'F']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Radial segments with varying radius based on values</p>
          </div>

          {/* Polar Area Centered */}
          <div className="chart-card">
            <h3>Polar Area - Centered Labels</h3>
            <div className="chart-container">
              <canvas
                ref={polarAreaCenteredRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'polar',
                    [65, 59, 90, 81, 56, 75, 70, 85],
                    ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Polar area with centered point labels showing values</p>
          </div>

          {/* Radar Skip Points */}
          <div className="chart-card">
            <h3>Radar - Skip Points</h3>
            <div className="chart-container">
              <canvas
                ref={radarSkipPointsRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'radar',
                    [65, 59, 80, 81, 56, 75],
                    ['Speed', 'Strength', 'Defense', 'Attack', 'Magic', 'HP']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Radar chart with null values creating gaps in the data</p>
          </div>

          {/* Scatter Multi Axis */}
          <div className="chart-card full-width">
            <h3>Scatter - Multi Axis</h3>
            <div className="chart-container">
              <canvas
                ref={scatterMultiAxisRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'scatter-multi',
                    [
                      [
                        { x: 10, y: 20 },
                        { x: 25, y: 45 },
                        { x: 40, y: 60 },
                        { x: 55, y: 75 },
                        { x: 70, y: 55 },
                        { x: 85, y: 80 },
                      ],
                      [
                        { x: 15, y: 140 },
                        { x: 30, y: 160 },
                        { x: 45, y: 120 },
                        { x: 60, y: 180 },
                        { x: 75, y: 150 },
                        { x: 90, y: 170 },
                      ],
                    ],
                    ['Data 1 (0-100)', 'Data 2 (0-200)']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Two Y axes with different scales for scatter data</p>
          </div>

          {/* Stacked Bar/Line */}
          <div className="chart-card full-width">
            <h3>Stacked Bar/Line Chart</h3>
            <div className="chart-container">
              <canvas
                ref={stackedBarLineRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'stacked-bar-line',
                    [65, 70, 80, 75, 85, 80],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Stacked bars combined with line overlay</p>
          </div>
        </div>
      </div>

      {/* Advanced Line & Area Charts Section */}
      <div className="charts-section">
        <h2 className="section-title">Advanced Line & Area Charts</h2>
        <div className="charts-grid">
          {/* Area Chart */}
          <div className="chart-card">
            <h3>Area Chart</h3>
            <div className="chart-container">
              <canvas
                ref={areaChartRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55, 40],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Line chart with filled area below the line</p>
          </div>

          {/* Line Boundaries */}
          <div className="chart-card full-width">
            <h3>Line Chart - Boundaries</h3>
            <div className="chart-container">
              <canvas
                ref={lineBoundariesRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Line with upper and lower boundary limits</p>
          </div>

          {/* Line Datasets */}
          <div className="chart-card full-width">
            <h3>Line Chart - Multiple Datasets</h3>
            <div className="chart-container">
              <canvas
                ref={lineDatasetsRef}
                onMouseMove={(e) => {
                  const visibleDatasets = lineDatasets.filter((ds) => ds.visible);
                  if (visibleDatasets.length > 0) {
                    handleMouseMove(e, 'line-multi', visibleDatasets, [
                      'Jan',
                      'Feb',
                      'Mar',
                      'Apr',
                      'May',
                      'Jun',
                    ]);
                  }
                }}
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {lineDatasets.map((dataset, index) => (
                <button
                  key={index}
                  onClick={() => toggleLineDataset(index)}
                  style={{
                    padding: '5px 10px',
                    background: dataset.visible ? dataset.color : 'rgba(255,255,255,0.1)',
                    color: dataset.visible ? '#000' : '#666',
                    border: `2px solid ${dataset.color}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    opacity: dataset.visible ? 1 : 0.5,
                  }}
                >
                  {dataset.label}
                </button>
              ))}
            </div>
            <p>Three independent line datasets on one chart</p>
          </div>

          {/* Line DrawTime */}
          <div className="chart-card">
            <h3>Line Chart - Time Axis</h3>
            <div className="chart-container">
              <canvas
                ref={lineDrawTimeRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line-time-axis',
                    [65, 59, 80, 81, 56, 55, 70, 75, 68],
                    [
                      '00:00',
                      '03:00',
                      '06:00',
                      '09:00',
                      '12:00',
                      '15:00',
                      '18:00',
                      '21:00',
                      '24:00',
                    ]
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Time-based X-axis with smooth curves and markers</p>
          </div>

          {/* Line Stacked */}
          <div className="chart-card full-width">
            <h3>Stacked Line Chart</h3>
            <div className="chart-container">
              <canvas
                ref={lineStackedRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line-stacked',
                    [20, 25, 30, 35, 25, 30],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Multiple lines stacked on top of each other</p>
          </div>

          {/* Radar Stacked */}
          <div className="chart-card full-width">
            <h3>Stacked Radar Chart</h3>
            <div className="chart-container">
              <canvas
                ref={radarStackedRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'radar',
                    [65, 59, 80, 81, 56, 55],
                    ['Speed', 'Power', 'Defense', 'Agility', 'Intelligence', 'Stamina']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Radar chart with stacked layers</p>
          </div>
        </div>
      </div>

      {/* Scales & Configuration Options Section */}
      <div className="charts-section">
        <h2 className="section-title">Scales & Configuration Options</h2>
        <div className="charts-grid">
          {/* Linear Scale - Min-Max */}
          <div className="chart-card">
            <h3>Linear Scale - Min-Max</h3>
            <div className="chart-container">
              <canvas
                ref={linearScaleMinMaxRef}
                onMouseMove={(e) =>
                  handleMouseMove(e, 'line', [30, 40, 50, 60, 70], ['A', 'B', 'C', 'D', 'E'])
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Fixed minimum (20) and maximum (80) scale values</p>
          </div>

          {/* Linear Scale - Suggested Min-Max */}
          <div className="chart-card">
            <h3>Linear Scale - Suggested Min-Max</h3>
            <div className="chart-container">
              <canvas
                ref={linearScaleSuggestedRef}
                onMouseMove={(e) =>
                  handleMouseMove(e, 'line', [50, 60, 70, 80, 90], ['A', 'B', 'C', 'D', 'E'])
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Suggested min-max with automatic padding (40-100)</p>
          </div>

          {/* Linear Scale - Step Size */}
          <div className="chart-card">
            <h3>Linear Scale - Step Size</h3>
            <div className="chart-container">
              <canvas
                ref={linearScaleStepSizeRef}
                onMouseMove={(e) =>
                  handleMouseMove(e, 'line', [15, 30, 45, 60, 75], ['A', 'B', 'C', 'D', 'E'])
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Fixed step size of 15 between tick marks</p>
          </div>

          {/* Log Scale */}
          <div className="chart-card">
            <h3>Logarithmic Scale</h3>
            <div className="chart-container">
              <canvas
                ref={logScaleRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [10, 100, 1000, 10000, 100000],
                    ['10', '100', '1K', '10K', '100K']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Logarithmic scale for exponential data (1 to 100K)</p>
          </div>

          {/* Stacked Linear / Category */}
          <div className="chart-card full-width">
            <h3>Stacked Linear / Category</h3>
            <div className="chart-container">
              <canvas
                ref={stackedLinearCategoryRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'stacked-linear-category',
                    [20, 30, 25, 35],
                    ['Cat A', 'Cat B', 'Cat C', 'Cat D']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Stacked area chart with category scale</p>
          </div>

          {/* Time Scale */}
          <div className="chart-card">
            <h3>Time Scale</h3>
            <div className="chart-container">
              <canvas
                ref={timeScaleRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Time-based scale showing 24-hour period</p>
          </div>

          {/* Time Scale - Max Span */}
          <div className="chart-card">
            <h3>Time Scale - Max Span</h3>
            <div className="chart-container">
              <canvas
                ref={timeScaleMaxSpanRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Extended time scale with maximum span (24 hours)</p>
          </div>

          {/* Time Scale - Combo */}
          <div className="chart-card full-width">
            <h3>Time Scale - Combo Chart</h3>
            <div className="chart-container">
              <canvas
                ref={timeScaleComboRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Time-based combo chart with bars and line</p>
          </div>

          {/* Center Positioning */}
          <div className="chart-card">
            <h3>Center Positioning</h3>
            <div className="chart-container">
              <canvas
                ref={centerPositioningRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'bar',
                    [-20, 10, -15, 25, -10, 30],
                    ['A', 'B', 'C', 'D', 'E', 'F']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Zero-centered scale for positive and negative values</p>
          </div>

          {/* Grid Configuration */}
          <div className="chart-card">
            <h3>Grid Configuration</h3>
            <div className="chart-container">
              <canvas
                ref={gridConfigurationRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Custom grid with dashed lines and styling</p>
          </div>

          {/* Tick Configuration */}
          <div className="chart-card">
            <h3>Tick Configuration</h3>
            <div className="chart-container">
              <canvas
                ref={tickConfigurationRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Custom tick marks with units and styling</p>
          </div>

          {/* Title Configuration */}
          <div className="chart-card full-width">
            <h3>Title Configuration</h3>
            <div className="chart-container">
              <canvas
                ref={titleConfigurationRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Custom title positioning (bottom-left aligned)</p>
          </div>
        </div>
      </div>

      {/* Legend & Layout Options Section */}
      <div className="charts-section">
        <h2 className="section-title">Legend & Layout Options</h2>
        <div className="charts-grid">
          {/* Legend Events (Interactive) */}
          <div className="chart-card full-width">
            <h3>Legend Events (Interactive)</h3>
            <div className="chart-container">
              <canvas
                ref={legendEventsRef}
                onMouseMove={(e) =>
                  handleMouseMove(e, 'pie', [30, 50, 100, 40], ['Red', 'Blue', 'Yellow', 'Green'])
                }
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer' }}
              ></canvas>
            </div>
            <p>Interactive legend with click indicators</p>
          </div>

          {/* HTML Legend (Styled) */}
          <div className="chart-card full-width">
            <h3>HTML Legend (Styled)</h3>
            <div className="chart-container">
              <canvas
                ref={htmlLegendRef}
                onMouseMove={(e) =>
                  handleMouseMove(e, 'pie', [30, 50, 100, 40], ['Red', 'Blue', 'Yellow', 'Green'])
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Custom HTML-styled legend with percentages</p>
          </div>

          {/* Legend Point Style */}
          <div className="chart-card">
            <h3>Legend Point Style</h3>
            <div className="chart-container">
              <canvas
                ref={legendPointStyleRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Different point styles (circle, square, triangle)</p>
          </div>

          {/* Legend Position (Left) */}
          <div className="chart-card full-width">
            <h3>Legend Position (Left)</h3>
            <div className="chart-container">
              <canvas
                ref={legendPositionRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'bar',
                    [12, 19, 3, 5, 2, 3],
                    ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Legend positioned on the left side</p>
          </div>

          {/* Alignment and Title Position */}
          <div className="chart-card full-width">
            <h3>Alignment & Title Position</h3>
            <div className="chart-container">
              <canvas
                ref={alignmentTitlePositionRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Custom title alignment and legend positioning</p>
          </div>
        </div>
      </div>

      {/* Tooltip & Interaction Modes Section */}
      <div className="charts-section">
        <h2 className="section-title">Tooltip & Interaction Modes</h2>
        <div className="charts-grid">
          {/* Custom Tooltip */}
          <div className="chart-card full-width">
            <h3>Custom Tooltip</h3>
            <div className="chart-container">
              <canvas
                ref={tooltipCustomRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Custom tooltip with click indicators</p>
          </div>

          {/* Tooltip Content */}
          <div className="chart-card full-width">
            <h3>Tooltip Content</h3>
            <div className="chart-container">
              <canvas
                ref={tooltipContentRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'bar',
                    [12, 19, 3, 5, 2, 3],
                    ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Rich tooltip with multiple data series</p>
          </div>

          {/* External HTML Tooltip */}
          <div className="chart-card full-width">
            <h3>External HTML Tooltip</h3>
            <div className="chart-container">
              <canvas
                ref={tooltipExternalRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>External HTML tooltip indicator</p>
          </div>

          {/* Interaction Modes */}
          <div className="chart-card full-width">
            <h3>Interaction Modes</h3>
            <div className="chart-container">
              <canvas
                ref={interactionModesRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Point, nearest, and index interaction modes</p>
          </div>

          {/* Tooltip Point Style */}
          <div className="chart-card">
            <h3>Tooltip Point Style</h3>
            <div className="chart-container">
              <canvas
                ref={tooltipPointStyleRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Different point styles in tooltips</p>
          </div>

          {/* Tooltip Position */}
          <div className="chart-card full-width">
            <h3>Tooltip Position</h3>
            <div className="chart-container">
              <canvas
                ref={tooltipPositionRef}
                onMouseMove={(e) =>
                  handleMouseMove(e, 'pie', [30, 50, 100, 40], ['Red', 'Blue', 'Yellow', 'Green'])
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Tooltip positioning on pie chart</p>
          </div>
        </div>
      </div>

      {/* Scriptable Options Section */}
      <div className="charts-section">
        <h2 className="section-title">Scriptable Options</h2>
        <div className="charts-grid">
          {/* Scriptable Bar Chart */}
          <div className="chart-card">
            <h3>Scriptable Bar Chart</h3>
            <div className="chart-container">
              <canvas
                ref={scriptableBarRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'bar',
                    [12, 19, 3, 5, 2, 3],
                    ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Bar chart with value-based colors</p>
          </div>

          {/* Scriptable Bubble Chart */}
          <div className="chart-card">
            <h3>Scriptable Bubble Chart</h3>
            <div className="chart-container">
              <canvas
                ref={scriptableBubbleRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'bubble',
                    [
                      { x: 20, y: 30, r: 15 },
                      { x: 40, y: 10, r: 10 },
                      { x: 60, y: 50, r: 20 },
                    ],
                    ['Bubble 1', 'Bubble 2', 'Bubble 3']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Bubble chart with position-based colors</p>
          </div>

          {/* Scriptable Line Chart */}
          <div className="chart-card">
            <h3>Scriptable Line Chart</h3>
            <div className="chart-container">
              <canvas
                ref={scriptableLineRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Line chart with slope-based segment colors</p>
          </div>

          {/* Scriptable Pie Chart */}
          <div className="chart-card">
            <h3>Scriptable Pie Chart</h3>
            <div className="chart-container">
              <canvas
                ref={scriptablePieRef}
                onMouseMove={(e) =>
                  handleMouseMove(e, 'pie', [30, 50, 100, 40], ['Red', 'Blue', 'Yellow', 'Green'])
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Pie chart with dynamic border widths</p>
          </div>

          {/* Scriptable Polar Area Chart */}
          <div className="chart-card">
            <h3>Scriptable Polar Area Chart</h3>
            <div className="chart-container">
              <canvas
                ref={scriptablePolarRef}
                onMouseMove={(e) =>
                  handleMouseMove(e, 'polar', [11, 16, 7, 3, 14], ['A', 'B', 'C', 'D', 'E'])
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Polar area with value-based colors</p>
          </div>

          {/* Scriptable Radar Chart */}
          <div className="chart-card">
            <h3>Scriptable Radar Chart</h3>
            <div className="chart-container">
              <canvas
                ref={scriptableRadarRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'radar',
                    [65, 59, 90, 81, 56, 55, 40],
                    ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Radar chart with dynamic point sizes</p>
          </div>
        </div>
      </div>

      {/* Animations Section */}
      <div className="charts-section">
        <h2 className="section-title">Animations</h2>
        <div className="charts-grid">
          {/* Animation Delay */}
          <div className="chart-card">
            <h3>Animation Delay</h3>
            <div className="chart-container">
              <canvas
                ref={animDelayRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'bar',
                    [12, 19, 3, 5, 2, 3],
                    ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Staggered animation with delays</p>
          </div>

          {/* Animation Drop */}
          <div className="chart-card">
            <h3>Drop Animation</h3>
            <div className="chart-container">
              <canvas
                ref={animDropRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'bar',
                    [12, 19, 3, 5, 2, 3],
                    ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Bars drop from top with bounce</p>
          </div>

          {/* Animation Loop */}
          <div className="chart-card">
            <h3>Loop Animation</h3>
            <div className="chart-container">
              <canvas
                ref={animLoopRef}
                onMouseMove={(e) =>
                  handleMouseMove(e, 'doughnut', [55, 30, 15], ['Desktop', 'Mobile', 'Tablet'])
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Continuous rotation loop</p>
          </div>

          {/* Progressive Line */}
          <div className="chart-card">
            <h3>Progressive Line</h3>
            <div className="chart-container">
              <canvas
                ref={animProgressiveRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Line draws progressively point by point</p>
          </div>

          {/* Progressive Line with Easing */}
          <div className="chart-card">
            <h3>Progressive Line with Easing</h3>
            <div className="chart-container">
              <canvas
                ref={animProgressiveEasingRef}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    'line',
                    [65, 59, 80, 81, 56, 55],
                    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
                  )
                }
                onMouseLeave={handleMouseLeave}
              ></canvas>
            </div>
            <p>Smooth easing with easeOutQuart</p>
          </div>
        </div>
      </div>

      {/* Tooltip Component */}
      {tooltip.visible && (
        <div
          className="chart-tooltip"
          style={{
            position: 'fixed',
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 40}px`,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          <div className="tooltip-content">
            <div className="tooltip-color" style={{ backgroundColor: tooltip.color }}></div>
            <div className="tooltip-text">
              <div className="tooltip-label">{tooltip.label}</div>
              <div className="tooltip-value">{tooltip.value}</div>
            </div>
          </div>
        </div>
      )}

      <div className="features-section">
        <h2>Chart.js Equivalent Features</h2>
        <div className="features-grid">
          <div className="feature">
            <h4>✓ All Chart Types</h4>
            <p>Line, Bar, Pie, Doughnut, Radar, Polar Area, Bubble, Scatter</p>
          </div>
          <div className="feature">
            <h4>✓ Responsive Design</h4>
            <p>Charts automatically resize with container</p>
          </div>
          <div className="feature">
            <h4>✓ Theme Support</h4>
            <p>RHUDS neon theme & ColdWar tactical theme</p>
          </div>
          <div className="feature">
            <h4>✓ Animations</h4>
            <p>Smooth transitions with callbacks (onProgress, onComplete)</p>
          </div>
          <div className="feature">
            <h4>✓ Tooltips</h4>
            <p>Interactive hover information with hit detection</p>
          </div>
          <div className="feature">
            <h4>✓ Legends</h4>
            <p>Interactive legends with click handlers</p>
          </div>
          <div className="feature">
            <h4>✓ Multiple Datasets</h4>
            <p>Support for multiple data series per chart</p>
          </div>
          <div className="feature">
            <h4>✓ Data Validation</h4>
            <p>Automatic validation and error handling</p>
          </div>
          <div className="feature">
            <h4>✓ Auto-scaling</h4>
            <p>Dynamic scale calculation based on data</p>
          </div>
          <div className="feature">
            <h4>✓ Grid Customization</h4>
            <p>Customizable grid lines, colors, and borders</p>
          </div>
          <div className="feature">
            <h4>✓ Title Options</h4>
            <p>Flexible title positioning and styling</p>
          </div>
          <div className="feature">
            <h4>✓ Animation Callbacks</h4>
            <p>Progress and completion event handlers</p>
          </div>
          <div className="feature">
            <h4>✓ Export Features</h4>
            <p>Export charts to PNG and SVG formats</p>
          </div>
          <div className="feature">
            <h4>✓ Mixed Charts</h4>
            <p>Combine multiple chart types (Line + Bar)</p>
          </div>
          <div className="feature">
            <h4>✓ Gradient Fills</h4>
            <p>Advanced styling with gradient backgrounds</p>
          </div>
          <div className="feature">
            <h4>✓ Data Decimation</h4>
            <p>Performance optimization for large datasets</p>
          </div>
          <div className="feature">
            <h4>✓ Pause/Resume</h4>
            <p>Animation control with pause and resume</p>
          </div>
          <div className="feature">
            <h4>✓ Clipboard Copy</h4>
            <p>Copy charts directly to clipboard</p>
          </div>
          <div className="feature">
            <h4>✓ Accessibility</h4>
            <p>ARIA labels and keyboard navigation support</p>
          </div>
          <div className="feature">
            <h4>✓ Keyboard Support</h4>
            <p>Full keyboard navigation for interactive elements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChartsShowcaseComponent);
