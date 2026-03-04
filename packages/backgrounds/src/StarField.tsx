/**
 * StarField Component
 * Renders animated star field with parallax, shooting stars, and twinkle effects
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

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
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
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const timeRef = useRef(0);

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
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Render base star field
      if (effectRef.current) {
        effectRef.current.render(speed, parallaxFactor, color);
      }

      // Add shooting stars randomly
      if (Math.random() < 0.01) {
        shootingStarsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.3,
          vx: 5 + Math.random() * 5,
          vy: 3 + Math.random() * 3,
          life: 0,
          maxLife: 30 + Math.random() * 30,
          size: 1 + Math.random() * 2,
        });
      }

      // Update and draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        star.x += star.vx;
        star.y += star.vy;
        star.life++;

        if (star.life > star.maxLife) {
          return false;
        }

        const lifeRatio = 1 - star.life / star.maxLife;
        
        // Draw shooting star trail
        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - star.vx * 5,
          star.y - star.vy * 5
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, `${color}00`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.size;
        ctx.globalAlpha = lifeRatio;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.vx * 5, star.y - star.vy * 5);
        ctx.stroke();

        // Draw shooting star head
        ctx.fillStyle = color;
        ctx.globalAlpha = lifeRatio;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      
      timeRef.current += 0.016;
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [starCount, speed, parallaxFactor, color, width, height]);

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
