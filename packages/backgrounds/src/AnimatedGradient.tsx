/**
 * AnimatedGradient Component
 * Renders animated gradient backgrounds with smooth transitions
 */

import React, { useEffect, useRef } from 'react';
import { AnimatedGradientEffect } from './effects';

export interface AnimatedGradientProps {
  width: number;
  height: number;
  colors?: string[];
  angle?: number;
  speed?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AnimatedGradient Component
 */
export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  width,
  height,
  colors = ['#ff0080', '#00ffff'],
  angle = 0,
  speed = 1,
  opacity = 1,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const effectRef = useRef<AnimatedGradientEffect | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      effectRef.current = new AnimatedGradientEffect(canvas);
    } catch (error) {
      console.error('Failed to initialize AnimatedGradient effect:', error);
      return;
    }

    const render = () => {
      if (effectRef.current) {
        effectRef.current.render(colors, angle, speed, opacity);
      }
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, angle, speed, opacity]);

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

AnimatedGradient.displayName = 'AnimatedGradient';
