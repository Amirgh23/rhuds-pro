/**
 * MovingLines Component
 * Renders animated moving lines
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
      ctx.globalAlpha = opacity;

      const spacing = direction === 'horizontal' ? height / lineCount : width / lineCount;

      if (direction === 'horizontal') {
        // Horizontal moving lines
        for (let i = 0; i < lineCount; i++) {
          const y = (i * spacing + offsetRef.current) % height;

          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (direction === 'vertical') {
        // Vertical moving lines
        for (let i = 0; i < lineCount; i++) {
          const x = (i * spacing + offsetRef.current) % width;

          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
      } else if (direction === 'diagonal') {
        // Diagonal moving lines
        for (let i = 0; i < lineCount; i++) {
          const offset = (i * spacing + offsetRef.current) % (width + height);

          ctx.beginPath();
          ctx.moveTo(offset - height, 0);
          ctx.lineTo(offset, height);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;

      offsetRef.current += speed;
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
