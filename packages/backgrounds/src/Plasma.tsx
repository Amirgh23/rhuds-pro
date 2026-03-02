/**
 * Plasma Component
 * Renders animated plasma effects
 */

import React, { useEffect, useRef } from 'react';
import { PlasmaEffect } from './effects';

export interface PlasmaProps {
  width: number;
  height: number;
  color1?: string;
  color2?: string;
  speed?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Plasma Component
 */
export const Plasma: React.FC<PlasmaProps> = ({
  width,
  height,
  color1 = '#ff0080',
  color2 = '#00ffff',
  speed = 1,
  opacity = 0.5,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const effectRef = useRef<PlasmaEffect | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      effectRef.current = new PlasmaEffect(canvas);
    } catch (error) {
      console.error('Failed to initialize Plasma effect:', error);
      return;
    }

    const render = () => {
      if (effectRef.current) {
        effectRef.current.render(color1, color2, speed, opacity);
      }
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color1, color2, speed, opacity]);

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

Plasma.displayName = 'Plasma';
