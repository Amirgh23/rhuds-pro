// ==================== TOOLTIP & INTERACTION PATCH ====================
// این فایل شامل تمام توابع و اصلاحات لازم برای فعال‌سازی tooltip و interaction است

// Hit Detection Functions

/**
 * تشخیص hit برای Line Chart
 */
const detectLineChartHit = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  data: number[],
  labels: string[],
  colors: any
): { index: number; value: number; label: string; color: string } | null => {
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  const maxValue = Math.max(...data, 100);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue;

  const hitRadius = 10; // شعاع تشخیص hit

  for (let i = 0; i < data.length; i++) {
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
    const normalizedValue = (data[i] - minValue) / range;
    const y = height - padding - 30 - normalizedValue * (height - 2 * padding - 30);

    const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);

    if (distance <= hitRadius) {
      return {
        index: i,
        value: data[i],
        label: labels[i] || `Point ${i + 1}`,
        color: colors.primary,
      };
    }
  }

  return null;
};

/**
 * تشخیص hit برای Bar Chart
 */
const detectBarChartHit = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  data: number[],
  labels: string[],
  colors: any
): { index: number; value: number; label: string; color: string } | null => {
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  const maxValue = Math.max(...data, 100);
  const barWidth = ((width - 2 * padding) / data.length) * 0.8;
  const barSpacing = (width - 2 * padding) / data.length;

  for (let i = 0; i < data.length; i++) {
    const x = padding + i * barSpacing + (barSpacing - barWidth) / 2;
    const barHeight = (data[i] / maxValue) * (height - 2 * padding - 30);
    const y = height - padding - 30 - barHeight;

    if (mouseX >= x && mouseX <= x + barWidth && mouseY >= y && mouseY <= height - padding - 30) {
      return {
        index: i,
        value: data[i],
        label: labels[i] || `Bar ${i + 1}`,
        color: colors.primary,
      };
    }
  }

  return null;
};

/**
 * تشخیص hit برای Pie Chart
 */
const detectPieChartHit = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  data: number[],
  labels: string[],
  colors: any
): { index: number; value: number; label: string; color: string } | null => {
  const width = canvas.width;
  const height = canvas.height;

  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const radius = Math.min(width, height) / 3;

  // محاسبه فاصله از مرکز
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // اگر خارج از دایره است
  if (distance > radius) return null;

  // محاسبه زاویه
  let angle = Math.atan2(dy, dx);
  if (angle < 0) angle += 2 * Math.PI;

  // تبدیل به زاویه از بالا (12 o'clock)
  angle = (angle + Math.PI / 2) % (2 * Math.PI);

  const total = data.reduce((sum, val) => sum + val, 0);
  let currentAngle = 0;

  for (let i = 0; i < data.length; i++) {
    const sliceAngle = (data[i] / total) * 2 * Math.PI;

    if (angle >= currentAngle && angle < currentAngle + sliceAngle) {
      const sliceColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A', '#00FF00'];
      return {
        index: i,
        value: data[i],
        label: labels[i] || `Slice ${i + 1}`,
        color: sliceColors[i % sliceColors.length],
      };
    }

    currentAngle += sliceAngle;
  }

  return null;
};

/**
 * تشخیص hit برای Doughnut Chart
 */
const detectDoughnutChartHit = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  data: number[],
  labels: string[],
  colors: any
): { index: number; value: number; label: string; color: string } | null => {
  const width = canvas.width;
  const height = canvas.height;

  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const outerRadius = Math.min(width, height) / 3;
  const innerRadius = outerRadius * 0.6;

  // محاسبه فاصله از مرکز
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // اگر خارج از ring است
  if (distance > outerRadius || distance < innerRadius) return null;

  // محاسبه زاویه
  let angle = Math.atan2(dy, dx);
  if (angle < 0) angle += 2 * Math.PI;

  // تبدیل به زاویه از بالا
  angle = (angle + Math.PI / 2) % (2 * Math.PI);

  const total = data.reduce((sum, val) => sum + val, 0);
  let currentAngle = 0;

  for (let i = 0; i < data.length; i++) {
    const sliceAngle = (data[i] / total) * 2 * Math.PI;

    if (angle >= currentAngle && angle < currentAngle + sliceAngle) {
      const sliceColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A', '#00FF00'];
      return {
        index: i,
        value: data[i],
        label: labels[i] || `Slice ${i + 1}`,
        color: sliceColors[i % sliceColors.length],
      };
    }

    currentAngle += sliceAngle;
  }

  return null;
};

/**
 * تشخیص hit برای Radar Chart
 */
const detectRadarChartHit = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  data: number[],
  labels: string[],
  colors: any
): { index: number; value: number; label: string; color: string } | null => {
  const width = canvas.width;
  const height = canvas.height;

  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const radius = Math.min(width, height) / 3;
  const maxValue = Math.max(...data, 100);

  const hitRadius = 10;

  for (let i = 0; i < data.length; i++) {
    const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
    const distance = (data[i] / maxValue) * radius;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);

    if (dist <= hitRadius) {
      return {
        index: i,
        value: data[i],
        label: labels[i] || `Point ${i + 1}`,
        color: colors.primary,
      };
    }
  }

  return null;
};

/**
 * تشخیص hit برای Polar Chart
 */
const detectPolarChartHit = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  data: number[],
  labels: string[],
  colors: any
): { index: number; value: number; label: string; color: string } | null => {
  const width = canvas.width;
  const height = canvas.height;

  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const maxRadius = Math.min(width, height) / 3;
  const maxValue = Math.max(...data, 100);

  // محاسبه فاصله و زاویه
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  let angle = Math.atan2(dy, dx);
  if (angle < 0) angle += 2 * Math.PI;
  angle = (angle + Math.PI / 2) % (2 * Math.PI);

  const segmentAngle = (2 * Math.PI) / data.length;
  const segmentIndex = Math.floor(angle / segmentAngle);

  if (segmentIndex >= 0 && segmentIndex < data.length) {
    const segmentRadius = (data[segmentIndex] / maxValue) * maxRadius;

    if (distance <= segmentRadius) {
      const segmentColors = [colors.primary, colors.secondary, '#FF006E', '#FFD60A', '#00FF00'];
      return {
        index: segmentIndex,
        value: data[segmentIndex],
        label: labels[segmentIndex] || `Segment ${segmentIndex + 1}`,
        color: segmentColors[segmentIndex % segmentColors.length],
      };
    }
  }

  return null;
};

/**
 * تشخیص hit برای Bubble Chart
 */
const detectBubbleChartHit = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  bubbles: Array<{ x: number; y: number; r: number; label: string }>,
  colors: any
): { index: number; value: any; label: string; color: string } | null => {
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    const x = padding + (bubble.x / 100) * (width - 2 * padding);
    const y = height - padding - 30 - (bubble.y / 100) * (height - 2 * padding - 30);
    const r = (bubble.r / 30) * 20 + 5;

    const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);

    if (distance <= r) {
      return {
        index: i,
        value: { x: bubble.x, y: bubble.y, r: bubble.r },
        label: bubble.label,
        color: colors.primary,
      };
    }
  }

  return null;
};

/**
 * تشخیص hit برای Scatter Chart
 */
const detectScatterChartHit = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  points: Array<{ x: number; y: number }>,
  labels: string[],
  colors: any
): { index: number; value: any; label: string; color: string } | null => {
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  const xValues = points.map((p) => p.x);
  const yValues = points.map((p) => p.y);
  const maxX = Math.max(...xValues);
  const maxY = Math.max(...yValues);

  const hitRadius = 10;

  for (let i = 0; i < points.length; i++) {
    const x = padding + (points[i].x / maxX) * (width - 2 * padding);
    const y = height - padding - 30 - (points[i].y / maxY) * (height - 2 * padding - 30);

    const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);

    if (distance <= hitRadius) {
      return {
        index: i,
        value: points[i],
        label: labels[i] || `Point ${i + 1}`,
        color: colors.primary,
      };
    }
  }

  return null;
};

/**
 * تابع اصلی تشخیص hit
 */
const detectHit = (
  canvas: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  chartType: string,
  data: any,
  labels: string[] = [],
  colors: any
): { index: number; value: any; label: string; color: string } | null => {
  switch (chartType) {
    case 'line':
      return detectLineChartHit(canvas, mouseX, mouseY, data, labels, colors);
    case 'bar':
      return detectBarChartHit(canvas, mouseX, mouseY, data, labels, colors);
    case 'pie':
      return detectPieChartHit(canvas, mouseX, mouseY, data, labels, colors);
    case 'doughnut':
      return detectDoughnutChartHit(canvas, mouseX, mouseY, data, labels, colors);
    case 'radar':
      return detectRadarChartHit(canvas, mouseX, mouseY, data, labels, colors);
    case 'polar':
      return detectPolarChartHit(canvas, mouseX, mouseY, data, labels, colors);
    case 'bubble':
      return detectBubbleChartHit(canvas, mouseX, mouseY, data, colors);
    case 'scatter':
      return detectScatterChartHit(canvas, mouseX, mouseY, data, labels, colors);
    default:
      return null;
  }
};

// Export functions
export {
  detectLineChartHit,
  detectBarChartHit,
  detectPieChartHit,
  detectDoughnutChartHit,
  detectRadarChartHit,
  detectPolarChartHit,
  detectBubbleChartHit,
  detectScatterChartHit,
  detectHit,
};
