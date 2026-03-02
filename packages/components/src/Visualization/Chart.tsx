import React, { useRef, useEffect } from 'react';
import { useTheme } from '@rhuds/core';

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar' | 'pie' | 'area';
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  colors?: string[];
  className?: string;
}

export function Chart({
  data,
  type = 'bar',
  width = 600,
  height = 400,
  showGrid = true,
  showLegend = true,
  colors,
  className = '',
}: ChartProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const defaultColors = colors || [
    theme.currentMode.colors.primary,
    theme.currentMode.colors.secondary,
    theme.currentMode.colors.accent,
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw based on type
    if (type === 'bar') {
      drawBarChart(ctx, data, padding, chartWidth, chartHeight, defaultColors, showGrid);
    } else if (type === 'line') {
      drawLineChart(ctx, data, padding, chartWidth, chartHeight, defaultColors[0], showGrid);
    } else if (type === 'pie') {
      drawPieChart(ctx, data, width / 2, height / 2, Math.min(chartWidth, chartHeight) / 2 - 20, defaultColors);
    } else if (type === 'area') {
      drawAreaChart(ctx, data, padding, chartWidth, chartHeight, defaultColors[0], showGrid);
    }
  }, [data, type, width, height, showGrid, defaultColors]);

  const drawBarChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartDataPoint[],
    padding: number,
    chartWidth: number,
    chartHeight: number,
    colors: string[],
    showGrid: boolean
  ) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = chartWidth / data.length - 10;

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = theme.currentMode.colors.border;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
      }
    }

    // Draw bars
    data.forEach((point, index) => {
      const barHeight = (point.value / maxValue) * chartHeight;
      const x = padding + (chartWidth / data.length) * index + 5;
      const y = padding + chartHeight - barHeight;

      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = theme.currentMode.colors.text;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(point.label, x + barWidth / 2, padding + chartHeight + 20);
    });
  };

  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartDataPoint[],
    padding: number,
    chartWidth: number,
    chartHeight: number,
    color: string,
    showGrid: boolean
  ) => {
    const maxValue = Math.max(...data.map(d => d.value));

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = theme.currentMode.colors.border;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
      }
    }

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - (point.value / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.stroke();
  };

  const drawPieChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartDataPoint[],
    centerX: number,
    centerY: number,
    radius: number,
    colors: string[]
  ) => {
    const total = data.reduce((sum, point) => sum + point.value, 0);
    let currentAngle = -Math.PI / 2;

    data.forEach((point, index) => {
      const sliceAngle = (point.value / total) * Math.PI * 2;

      ctx.fillStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(point.label, labelX, labelY);

      currentAngle += sliceAngle;
    });
  };

  const drawAreaChart = (
    ctx: CanvasRenderingContext2D,
    data: ChartDataPoint[],
    padding: number,
    chartWidth: number,
    chartHeight: number,
    color: string,
    showGrid: boolean
  ) => {
    const maxValue = Math.max(...data.map(d => d.value));

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = theme.currentMode.colors.border;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
      }
    }

    // Draw area
    ctx.fillStyle = `${color}40`;
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);

    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - (point.value / maxValue) * chartHeight;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - (point.value / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  };

  return (
    <div className={className}>
      <canvas ref={canvasRef} width={width} height={height} />
      {showLegend && type !== 'pie' && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {data.map((point, index) => (
            <div key={point.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: defaultColors[index % defaultColors.length],
                  borderRadius: '2px',
                }}
              />
              <span style={{ color: theme.currentMode.colors.text, fontSize: '14px' }}>
                {point.label}: {point.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
