import React, { useRef, useEffect } from 'react';
import { useTheme } from '@rhuds/core';

export interface BubbleDataPoint {
  x: number;
  y: number;
  r: number; // radius
  label?: string;
  color?: string;
}

export interface BubbleChartProps {
  data: BubbleDataPoint[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  xLabel?: string;
  yLabel?: string;
  colors?: string[];
  className?: string;
  variant?: 'rhuds' | 'coldwar';
}

export function BubbleChart({
  data,
  width = 600,
  height = 400,
  showGrid = true,
  showLegend = true,
  xLabel = 'X Axis',
  yLabel = 'Y Axis',
  colors,
  className = '',
  variant = 'rhuds',
}: BubbleChartProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get theme colors based on variant
  const getThemeColors = () => {
    if (variant === 'coldwar') {
      return {
        primary: '#FFB000', // Tactical Amber
        secondary: '#33FF00', // Phosphor Green
        accent: '#FF3333', // Muted Red
        background: '#0a0a0c', // Deep Black
        text: '#FFB000',
        grid: '#1a1a1e',
        border: '#2a2a2e',
      };
    }
    // RHUDS variant
    return {
      primary: theme?.currentMode?.tokens?.colors?.primary || '#29F2DF',
      secondary: theme?.currentMode?.tokens?.colors?.secondary || '#1C7FA6',
      accent: theme?.currentMode?.tokens?.colors?.accent || '#EF3EF1',
      background: theme?.currentMode?.tokens?.colors?.background || '#0a0a0a',
      text: theme?.currentMode?.tokens?.colors?.text || '#ffffff',
      grid: '#333333',
      border: '#555555',
    };
  };

  const themeColors = getThemeColors();
  const defaultColors = colors || [
    themeColors.primary,
    themeColors.secondary,
    themeColors.accent,
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
    ctx.fillStyle = themeColors.background;
    ctx.fillRect(0, 0, width, height);

    // Calculate padding
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Find min/max values for scaling
    const xValues = data.map((d) => d.x);
    const yValues = data.map((d) => d.y);
    const rValues = data.map((d) => d.r);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const maxR = Math.max(...rValues);

    // Scale functions
    const scaleX = (x: number) => {
      return padding + ((x - minX) / (maxX - minX)) * chartWidth;
    };

    const scaleY = (y: number) => {
      return height - padding - ((y - minY) / (maxY - minY)) * chartHeight;
    };

    const scaleR = (r: number) => {
      return (r / maxR) * 40; // Max bubble radius 40px
    };

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = themeColors.grid;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      // Vertical grid lines
      for (let i = 0; i <= 5; i++) {
        const x = padding + (chartWidth / 5) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }

    // Draw axes
    ctx.strokeStyle = themeColors.text;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = themeColors.text;
    ctx.font = `12px 'Share Tech Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, width / 2, height - 10);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // Draw bubbles
    data.forEach((point, index) => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      const r = scaleR(point.r);
      const color = point.color || defaultColors[index % defaultColors.length];

      // Draw bubble with glow effect for coldwar
      if (variant === 'coldwar') {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowColor = 'transparent';

      // Draw label if provided
      if (point.label) {
        ctx.fillStyle = themeColors.text;
        ctx.font = `10px 'Share Tech Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(point.label, x, y);
      }
    });

    // Draw axis ticks and values
    ctx.fillStyle = themeColors.text;
    ctx.font = `10px 'Share Tech Mono', monospace`;
    ctx.textAlign = 'right';

    for (let i = 0; i <= 5; i++) {
      const x = padding + (chartWidth / 5) * i;
      const value = (minX + ((maxX - minX) / 5) * i).toFixed(1);
      ctx.fillText(value, x, height - padding + 20);
    }

    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (chartHeight / 5) * i;
      const value = (minY + ((maxY - minY) / 5) * i).toFixed(1);
      ctx.fillText(value, padding - 10, y + 4);
    }
  }, [
    data,
    width,
    height,
    showGrid,
    showLegend,
    variant,
    themeColors,
    defaultColors,
    xLabel,
    yLabel,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        border: `1px solid ${themeColors.border}`,
        borderRadius: variant === 'coldwar' ? '0px' : '4px',
        background: themeColors.background,
      }}
    />
  );
}
