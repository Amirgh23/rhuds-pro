/**
 * Puffs Component
 * Renders animated particle effects with trails and physics
 */

import React, { useEffect, useRef } from 'react';
import { PuffsProps, ParticleConfig } from './types';

interface EnhancedParticle extends ParticleConfig {
  trail: Array<{ x: number; y: number; opacity: number }>;
  angle: number;
  angleVelocity: number;
}

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
  const particlesRef = useRef<EnhancedParticle[]>([]);
  const animationRef = useRef<number | null>(null);

  // Initialize particles
  useEffect(() => {
    const particles: EnhancedParticle[] = [];

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
        trail: [],
        angle: Math.random() * Math.PI * 2,
        angleVelocity: (Math.random() - 0.5) * 0.1,
      });
    }

    particlesRef.current = particles;
  }, [particleCount, particleSize, color, speed, opacity, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas with fade effect for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position with physics
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;
        
        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Update angle
        particle.angle += particle.angleVelocity;

        // Update trail
        particle.trail.push({ 
          x: particle.x, 
          y: particle.y, 
          opacity: particle.opacity 
        });
        
        if (particle.trail.length > 15) {
          particle.trail.shift();
        }

        // Update life
        if (particle.maxLife) {
          particle.life = (particle.life || 0) + 1;
          if (particle.life > particle.maxLife) {
            // Reset particle
            particle.x = Math.random() * width;
            particle.y = Math.random() * height;
            particle.vx = (Math.random() - 0.5) * speed * 2;
            particle.vy = (Math.random() - 0.5) * speed * 2;
            particle.life = 0;
            particle.trail = [];
          }
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Draw trail
        particle.trail.forEach((point, index) => {
          const trailOpacity = (index / particle.trail.length) * particle.opacity * 0.5;
          const trailSize = particle.size * (index / particle.trail.length);
          
          ctx.fillStyle = particle.color || color;
          ctx.globalAlpha = trailOpacity;
          ctx.beginPath();
          ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw particle with glow
        ctx.fillStyle = particle.color || color;
        ctx.globalAlpha = particle.opacity;
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color || color;
        
        // Draw rotating particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.angle);
        
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add inner glow
        ctx.globalAlpha = particle.opacity * 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      ctx.shadowBlur = 0;
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
  }, [width, height, color, animated, speed]);

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
