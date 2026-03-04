/**
 * MovingLines Component
 * Renders animated moving lines with gradient and glow effects
 */

import React, { useEffect, useRef } from 'react';
import { MovingLinesProps } from './types';

/**
 * MovingLines Component
 */
export const MovingLines: React.FC<MovingLinesProps> = ({
  width,
  height,
  lineCount = 10,
  color = '#00ffff',
  strokeWidth = 2,
  speed = 2,
  direction = 'horizontal',
  opacity = 0.5,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas with trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      const spacing = direction === 'horizontal' ? height / lineCount : width / lineCount;

      if (direction === 'horizontal') {
        // Horizontal moving lines with gradient
        for (let i = 0; i < lineCount; i++) {
          const y = (i * spacing + offsetRef.current) % height;
          
          // Create gradient for each line
          const gradient = ctx.createLinearGradient(0, y, width, y);
          const pulse = Math.sin(timeRef.current * 2 + i * 0.5) * 0.5 + 0.5;
          
          gradient.addColorStop(0, `${color}00`);
          gradient.addColorStop(0.5, color);
          gradient.addColorStop(1, `${color}00`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = strokeWidth + pulse * 2;
          ctx.globalAlpha = opacity * (0.5 + pulse * 0.5);
          
          // Add glow effect
          ctx.shadowBlur = 15 * pulse;
          ctx.shadowColor = color;

          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (direction === 'vertical') {
        // Vertical moving lines with gradient
        for (let i = 0; i < lineCount; i++) {
          const x = (i * spacing + offsetRef.current) % width;
          
          // Create gradient for each line
          const gradient = ctx.createLinearGradient(x, 0, x, height);
          const pulse = Math.sin(timeRef.current * 2 + i * 0.5) * 0.5 + 0.5;
          
          gradient.addColorStop(0, `${color}00`);
          gradient.addColorStop(0.5, color);
          gradient.addColorStop(1, `${color}00`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = strokeWidth + pulse * 2;
          ctx.globalAlpha = opacity * (0.5 + pulse * 0.5);
          
          // Add glow effect
          ctx.shadowBlur = 15 * pulse;
          ctx.shadowColor = color;

          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
      } else if (direction === 'diagonal') {
        // Diagonal moving lines with gradient
        for (let i = 0; i < lineCount; i++) {
          const offset = (i * spacing + offsetRef.current) % (width + height);
          const pulse = Math.sin(timeRef.current * 2 + i * 0.5) * 0.5 + 0.5;
          
          ctx.strokeStyle = color;
          ctx.lineWidth = strokeWidth + pulse * 2;
          ctx.globalAlpha = opacity * (0.5 + pulse * 0.5);
          
          // Add glow effect
          ctx.shadowBlur = 15 * pulse;
          ctx.shadowColor = color;

          ctx.beginPath();
          ctx.moveTo(offset - height, 0);
          ctx.lineTo(offset, height);
          ctx.stroke();
        }
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      offsetRef.current += speed;
      timeRef.current += 0.016;
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, lineCount, color, strokeWidth, speed, direction, opacity]);

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

MovingLines.displayName = 'MovingLines';
