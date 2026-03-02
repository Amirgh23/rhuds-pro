/**
 * GridLines Component
 * Renders animated grid pattern
 */

import React, { useEffect, useRef } from 'react';
import { GridLinesProps } from './types';

/**
 * GridLines Component
 */
export const GridLines: React.FC<GridLinesProps> = ({
  width,
  height,
  cellSize = 50,
  color = '#00ffff',
  strokeWidth = 1,
  dashed = false,
  dashArray = '5,5',
  opacity = 0.3,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, width, height);

    // Set line style
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.globalAlpha = opacity;

    if (dashed) {
      const dashParts = dashArray.split(',').map(Number);
      ctx.setLineDash(dashParts);
    }

    // Draw vertical lines
    for (let x = 0; x <= width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  }, [width, height, cellSize, color, strokeWidth, dashed, dashArray, opacity]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        display: 'block',
        ...style,
      }}
    />
  );
};

GridLines.displayName = 'GridLines';
