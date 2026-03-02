/**
 * StarField Component
 * Renders animated star field with parallax scrolling
 */

import React, { useEffect, useRef } from 'react';
import { StarFieldEffect } from './effects';

export interface StarFieldProps {
  width: number;
  height: number;
  starCount?: number;
  speed?: number;
  parallaxFactor?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * StarField Component
 */
export const StarField: React.FC<StarFieldProps> = ({
  width,
  height,
  starCount = 200,
  speed = 1,
  parallaxFactor = 0.5,
  color = '#ffffff',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const effectRef = useRef<StarFieldEffect | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      effectRef.current = new StarFieldEffect(canvas, starCount);
    } catch (error) {
      console.error('Failed to initialize StarField effect:', error);
      return;
    }

    const render = () => {
      if (effectRef.current) {
        effectRef.current.render(speed, parallaxFactor, color);
      }
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [starCount, speed, parallaxFactor, color]);

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

StarField.displayName = 'StarField';
