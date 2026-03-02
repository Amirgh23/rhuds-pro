/**
 * Nebula Component
 * Renders animated nebula effects with gradient blending
 */

import React, { useEffect, useRef } from 'react';
import { NebulaEffect } from './effects';

export interface NebulaProps {
  width: number;
  height: number;
  colors?: string[];
  scale?: number;
  speed?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Nebula Component
 */
export const Nebula: React.FC<NebulaProps> = ({
  width,
  height,
  colors = ['#ff00ff', '#00ffff', '#ff0080'],
  scale = 1,
  speed = 1,
  opacity = 0.5,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const effectRef = useRef<NebulaEffect | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      effectRef.current = new NebulaEffect(canvas);
    } catch (error) {
      console.error('Failed to initialize Nebula effect:', error);
      return;
    }

    const render = () => {
      if (effectRef.current) {
        effectRef.current.render(colors, scale, speed, opacity);
      }
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, scale, speed, opacity]);

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

Nebula.displayName = 'Nebula';
