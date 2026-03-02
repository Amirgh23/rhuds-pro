/**
 * Puffs Component
 * Renders animated particle effects
 */

import React, { useEffect, useRef } from 'react';
import { PuffsProps, ParticleConfig } from './types';

/**
 * Puffs Component
 */
export const Puffs: React.FC<PuffsProps> = ({
  width,
  height,
  particleCount = 50,
  particleSize = 4,
  color = '#00ffff',
  speed = 1,
  opacity = 0.6,
  animated = true,
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ParticleConfig[]>([]);
  const animationRef = useRef<number | null>(null);

  // Initialize particles
  useEffect(() => {
    const particles: ParticleConfig[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        size: Math.random() * particleSize + 1,
        opacity: Math.random() * opacity,
        color,
        life: Math.random() * 100,
        maxLife: 100,
      });
    }

    particlesRef.current = particles;
  }, [particleCount, particleSize, color, speed, opacity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Update life
        if (particle.maxLife) {
          particle.life = (particle.life || 0) + 1;
          if (particle.life > particle.maxLife) {
            // Reset particle
            particle.x = Math.random() * width;
            particle.y = Math.random() * height;
            particle.life = 0;
          }
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Draw particle
        ctx.fillStyle = particle.color || color;
        ctx.globalAlpha = particle.opacity;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (animated) {
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
  }, [width, height, color, animated]);

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

Puffs.displayName = 'Puffs';
