/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR CHARTS TOOLTIP LOGIC - STRICT POINT DETECTION
 * ═══════════════════════════════════════════════════════════════════════════
 * Tooltips only appear when hovering directly over data points
 */

export interface TooltipData {
  label: string;
  value: string;
  color: string;
}

export interface ChartDataPoint {
  x: number;
  y: number;
  label: string;
}

// Get chart data for tooltip - returns data points based on chart type
export const getChartData = (chartId: string): ChartDataPoint[] => {
  // Sample data for each chart - 6 data points
  const dataPoints = 6;
  const data: ChartDataPoint[] = [];

  for (let i = 0; i < dataPoints; i++) {
    data.push({
      x: i,
      y: 30 + Math.random() * 50,
      label: `Point ${i + 1}`,
    });
  }

  return data;
};

// Check if mouse is near a data point - STRICT detection
export const isNearDataPoint = (
  chartId: string,
  chartType: string | undefined,
  mouseX: number,
  mouseY: number,
  canvas: HTMLCanvasElement
): TooltipData | null => {
  const rect = canvas.getBoundingClientRect();
  const relX = mouseX - rect.left;
  const relY = mouseY - rect.top;

  const padding = 40;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;

  // Get chart data
  const data = getChartData(chartId);
  const dataCount = data.length;

  // Different detection logic based on chart type
  if (chartType === 'bar' || chartType === 'stackedBar' || chartType === 'horizontalBar') {
    // Bar charts: detect if cursor is over a bar rectangle
    const barWidth = (chartWidth / dataCount) * 0.6;
    const spacing = chartWidth / dataCount;

    for (let i = 0; i < dataCount; i++) {
      const barX = padding + i * spacing + spacing * 0.2;
      const barHeight = (data[i].y / 100) * chartHeight;
      const barY = padding + chartHeight - barHeight;

      if (
        relX >= barX &&
        relX <= barX + barWidth &&
        relY >= barY &&
        relY <= padding + chartHeight
      ) {
        return {
          label: data[i].label,
          value: `${data[i].y.toFixed(1)}%`,
          color: '#F0A000',
        };
      }
    }
  } else if (chartType === 'line' || chartType === 'area' || chartType === 'stackedLine') {
    // Line charts: detect if cursor is within 10px of a data point
    const hitRadius = 10;

    for (let i = 0; i < dataCount; i++) {
      const pointX = padding + (i / (dataCount - 1)) * chartWidth;
      const pointY = padding + chartHeight - (data[i].y / 100) * chartHeight;

      const distance = Math.sqrt(Math.pow(relX - pointX, 2) + Math.pow(relY - pointY, 2));

      if (distance <= hitRadius) {
        return {
          label: data[i].label,
          value: `${data[i].y.toFixed(1)}%`,
          color: '#F0A000',
        };
      }
    }
  } else if (chartType === 'pie' || chartType === 'doughnut') {
    // Pie/Doughnut: detect if cursor is within a slice
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = (Math.min(chartWidth, chartHeight) / 2) * 0.8;
    const innerRadius = chartType === 'doughnut' ? radius * 0.5 : 0;

    const dx = relX - centerX;
    const dy = relY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= innerRadius && distance <= radius) {
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += Math.PI * 2;

      const sliceAngle = (Math.PI * 2) / dataCount;
      const sliceIndex = Math.floor(angle / sliceAngle);

      if (sliceIndex >= 0 && sliceIndex < dataCount) {
        return {
          label: data[sliceIndex].label,
          value: `${data[sliceIndex].y.toFixed(1)}%`,
          color: '#F0A000',
        };
      }
    }
  } else if (chartType === 'radar' || chartType === 'polar') {
    // Radar/Polar: detect if cursor is near a vertex
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = (Math.min(chartWidth, chartHeight) / 2) * 0.8;
    const hitRadius = 15;

    for (let i = 0; i < dataCount; i++) {
      const angle = (i / dataCount) * Math.PI * 2 - Math.PI / 2;
      const radius = (data[i].y / 100) * maxRadius;
      const pointX = centerX + Math.cos(angle) * radius;
      const pointY = centerY + Math.sin(angle) * radius;

      const distance = Math.sqrt(Math.pow(relX - pointX, 2) + Math.pow(relY - pointY, 2));

      if (distance <= hitRadius) {
        return {
          label: data[i].label,
          value: `${data[i].y.toFixed(1)}%`,
          color: '#F0A000',
        };
      }
    }
  } else if (chartType === 'scatter' || chartType === 'bubble') {
    // Scatter/Bubble: detect if cursor is within bubble radius
    const hitRadius = chartType === 'bubble' ? 15 : 8;

    for (let i = 0; i < dataCount; i++) {
      const pointX = padding + (data[i].x / (dataCount - 1)) * chartWidth;
      const pointY = padding + chartHeight - (data[i].y / 100) * chartHeight;

      const distance = Math.sqrt(Math.pow(relX - pointX, 2) + Math.pow(relY - pointY, 2));

      if (distance <= hitRadius) {
        return {
          label: data[i].label,
          value: `${data[i].y.toFixed(1)}%`,
          color: '#F0A000',
        };
      }
    }
  }

  return null;
};
