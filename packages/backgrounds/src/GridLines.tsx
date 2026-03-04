/**
 * GridLines Component
 * Renders animated grid pattern with wave and glow effects
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
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, width, height);

      // Set line style
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;

      if (dashed) {
        const dashParts = dashArray.split(',').map(Number);
        ctx.setLineDash(dashParts);
      }

      // Draw vertical lines with wave animation
      for (let x = 0; x <= width; x += cellSize) {
        ctx.beginPath();
        
        for (let y = 0; y <= height; y += 5) {
          // Wave effect
          const wave = Math.sin((y + timeRef.current * 50) * 0.01) * 3;
          const xPos = x + wave;
          
          // Glow effect based on position
          const glowIntensity = Math.sin((y + timeRef.current * 100) * 0.02) * 0.5 + 0.5;
          ctx.globalAlpha = opacity * (0.5 + glowIntensity * 0.5);
          
          if (y === 0) {
            ctx.moveTo(xPos, y);
          } else {
            ctx.lineTo(xPos, y);
          }
        }
        
        ctx.stroke();
      }

      // Draw horizontal lines with wave animation
      for (let y = 0; y <= height; y += cellSize) {
        ctx.beginPath();
        
        for (let x = 0; x <= width; x += 5) {
          // Wave effect
          const wave = Math.sin((x + timeRef.current * 50) * 0.01) * 3;
          const yPos = y + wave;
          
          // Glow effect based on position
          const glowIntensity = Math.sin((x + timeRef.current * 100) * 0.02) * 0.5 + 0.5;
          ctx.globalAlpha = opacity * (0.5 + glowIntensity * 0.5);
          
          if (x === 0) {
            ctx.moveTo(x, yPos);
          } else {
            ctx.lineTo(x, yPos);
          }
        }
        
        ctx.stroke();
      }

      // Add intersection glow points
      ctx.globalAlpha = opacity * 0.8;
      for (let x = 0; x <= width; x += cellSize) {
        for (let y = 0; y <= height; y += cellSize) {
          const pulse = Math.sin(timeRef.current * 2 + x * 0.01 + y * 0.01) * 0.5 + 0.5;
          const size = 2 + pulse * 2;
          
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
      
      timeRef.current += 0.016;
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
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
