/**
 * Dots Component
 * Renders animated dot patterns (grid, random, hexagonal)
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { DotsProps } from './types';

/**
 * Generate grid pattern dots
 */
function generateGridDots(
  width: number,
  height: number,
  spacing: number
): Array<{ x: number; y: number }> {
  const dots: Array<{ x: number; y: number }> = [];

  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      dots.push({ x, y });
    }
  }

  return dots;
}

/**
 * Generate random pattern dots
 */
function generateRandomDots(
  width: number,
  height: number,
  spacing: number
): Array<{ x: number; y: number }> {
  const dots: Array<{ x: number; y: number }> = [];
  const count = Math.floor((width * height) / (spacing * spacing));

  for (let i = 0; i < count; i++) {
    dots.push({
      x: Math.random() * width,
      y: Math.random() * height,
    });
  }

  return dots;
}

/**
 * Generate hexagonal pattern dots
 */
function generateHexagonalDots(
  width: number,
  height: number,
  spacing: number
): Array<{ x: number; y: number }> {
  const dots: Array<{ x: number; y: number }> = [];
  const hexHeight = spacing * Math.sqrt(3) / 2;

  for (let y = 0; y < height; y += hexHeight) {
    for (let x = 0; x < width; x += spacing) {
      const offsetX = (Math.floor(y / hexHeight) % 2) * (spacing / 2);
      dots.push({ x: x + offsetX, y });
    }
  }

  return dots;
}

/**
 * Dots Component
 */
export const Dots: React.FC<DotsProps> = ({
  width,
  height,
  pattern = 'grid',
  dotSize = 2,
  spacing = 20,
  color = '#00ffff',
  opacity = 0.5,
  animated = true,
  animationSpeed = 1,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const dots = useMemo(() => {
    switch (pattern) {
      case 'random':
        return generateRandomDots(width, height, spacing);
      case 'hexagonal':
        return generateHexagonalDots(width, height, spacing);
      case 'grid':
      default:
        return generateGridDots(width, height, spacing);
    }
  }, [width, height, spacing, pattern]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, width, height);

      // Draw dots
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;

      dots.forEach((dot) => {
        let dotOpacity = opacity;

        if (animated) {
          // Pulsing animation
          const pulse = Math.sin(timeRef.current * animationSpeed + dot.x + dot.y) * 0.5 + 0.5;
          dotOpacity = opacity * (0.5 + pulse * 0.5);
          ctx.globalAlpha = dotOpacity;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (animated) {
        timeRef.current += 0.016; // ~60fps
        animationRef.current = requestAnimationFrame(render);
      }
    };

    if (animated) {
      animationRef.current = requestAnimationFrame(render);
    } else {
      render();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, dots, dotSize, color, opacity, animated, animationSpeed]);

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

Dots.displayName = 'Dots';
