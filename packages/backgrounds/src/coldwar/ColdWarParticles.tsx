/**
 * ColdWarParticles Component - Professional Military Data Stream
 * Advanced tactical particle system with data fragments, coordinates, and military symbols
 * Inspired by Call of Duty: Black Ops Cold War intelligence displays
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarParticlesProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

interface DataParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  type: 'dot' | 'cross' | 'square' | 'triangle' | 'hex' | 'data';
  data?: string;
  rotation: number;
  rotationSpeed: number;
}

const THEME_COLORS: Record<
  ColdWarTheme,
  { primary: string; secondary: string; accent: string; glow: string }
> = {
  perseus: {
    primary: '#FFB000',
    secondary: '#D4A574',
    accent: '#FF8800',
    glow: '#FFD700',
  },
  greenTerminal: {
    primary: '#00FF41',
    secondary: '#00CC33',
    accent: '#00DD44',
    glow: '#00FF88',
  },
  satelliteView: {
    primary: '#00D9FF',
    secondary: '#0099CC',
    accent: '#00AAFF',
    glow: '#00FFFF',
  },
};

const INTENSITY_VALUES: Record<
  ColdWarIntensity,
  { count: number; speed: number; dataFrequency: number }
> = {
  low: { count: 30, speed: 0.3, dataFrequency: 0.1 },
  medium: { count: 60, speed: 0.6, dataFrequency: 0.2 },
  high: { count: 100, speed: 1.0, dataFrequency: 0.3 },
};

const DATA_FRAGMENTS = [
  '0x',
  '1A',
  'FF',
  '00',
  'A7',
  'B3',
  'C9',
  'D4',
  '█',
  '▓',
  '▒',
  '░',
  '■',
  '□',
  '▪',
  '▫',
  '>',
  '<',
  '+',
  '-',
  '*',
  '/',
  '=',
  '#',
];

const PARTICLE_TYPES: Array<'dot' | 'cross' | 'square' | 'triangle' | 'hex' | 'data'> = [
  'dot',
  'cross',
  'square',
  'triangle',
  'hex',
  'data',
];

export const ColdWarParticles: React.FC<ColdWarParticlesProps> = ({
  width,
  height,
  theme = 'perseus',
  intensity = 'medium',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<DataParticle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const { count, speed, dataFrequency } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + ((Math.random() - 0.5) * Math.PI) / 3; // Mostly upward
        const velocity = speed * (0.5 + Math.random() * 1.5);
        const type = PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)];

        particlesRef.current.push({
          x: Math.random() * width,
          y: height + Math.random() * 100,
          vx: Math.cos(angle) * velocity * 0.3,
          vy: Math.sin(angle) * velocity,
          size: type === 'data' ? 8 : 2 + Math.random() * 3,
          opacity: 0.4 + Math.random() * 0.4,
          life: 0,
          maxLife: 5 + Math.random() * 5,
          type,
          data:
            type === 'data'
              ? DATA_FRAGMENTS[Math.floor(Math.random() * DATA_FRAGMENTS.length)]
              : undefined,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
        });
      }
    };

    initParticles();

    const drawParticle = (p: DataParticle, alpha: number) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;

      const lifeRatio = p.life / p.maxLife;
      const color =
        lifeRatio < 0.3 ? colors.glow : lifeRatio < 0.7 ? colors.primary : colors.secondary;

      switch (p.type) {
        case 'dot':
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 5;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          break;

        case 'cross':
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.lineTo(p.size, 0);
          ctx.moveTo(0, -p.size);
          ctx.lineTo(0, p.size);
          ctx.stroke();
          break;

        case 'square':
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
          break;

        case 'triangle':
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size, p.size);
          ctx.lineTo(-p.size, p.size);
          ctx.closePath();
          ctx.stroke();
          break;

        case 'hex':
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = Math.cos(angle) * p.size;
            const y = Math.sin(angle) * p.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          break;

        case 'data':
          ctx.fillStyle = color;
          ctx.font = `${p.size}px "Share Tech Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.fillText(p.data || '00', 0, 0);
          ctx.shadowBlur = 0;
          break;
      }

      ctx.restore();
    };

    const render = () => {
      // Clear with fade trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      const time = prefersReducedMotion ? 0 : timeRef.current;

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.life += 0.016;
          p.rotation += p.rotationSpeed;

          // Add slight horizontal drift
          p.vx += (Math.random() - 0.5) * 0.01;
          p.vx *= 0.99; // Damping
        }

        // Calculate fade based on life
        const lifeRatio = p.life / p.maxLife;
        let alpha = p.opacity;

        // Fade in at start
        if (lifeRatio < 0.1) {
          alpha *= lifeRatio / 0.1;
        }
        // Fade out at end
        else if (lifeRatio > 0.8) {
          alpha *= (1 - lifeRatio) / 0.2;
        }

        // Draw particle if visible
        if (p.y > -50 && p.y < height + 50 && p.x > -50 && p.x < width + 50) {
          drawParticle(p, alpha);

          // Draw connection lines to nearby particles
          if (p.type !== 'data') {
            ctx.globalAlpha = alpha * 0.2;
            ctx.strokeStyle = colors.secondary;
            ctx.lineWidth = 0.5;

            for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) {
              const p2 = particles[j];
              const dx = p2.x - p.x;
              const dy = p2.y - p.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 80) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }

        // Reset particle if out of bounds or life expired
        if (p.y < -100 || p.life >= p.maxLife) {
          const angle = -Math.PI / 2 + ((Math.random() - 0.5) * Math.PI) / 3;
          const velocity = speed * (0.5 + Math.random() * 1.5);
          const type = PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)];

          p.x = Math.random() * width;
          p.y = height + Math.random() * 50;
          p.vx = Math.cos(angle) * velocity * 0.3;
          p.vy = Math.sin(angle) * velocity;
          p.life = 0;
          p.opacity = 0.4 + Math.random() * 0.4;
          p.type = type;
          p.size = type === 'data' ? 8 : 2 + Math.random() * 3;
          p.data =
            type === 'data'
              ? DATA_FRAGMENTS[Math.floor(Math.random() * DATA_FRAGMENTS.length)]
              : undefined;
          p.rotation = Math.random() * Math.PI * 2;
          p.rotationSpeed = (Math.random() - 0.5) * 0.05;
        }
      }

      // Draw data stream indicators
      if (!prefersReducedMotion) {
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

        const streamY = height - ((time * 30) % height);
        ctx.beginPath();
        ctx.moveTo(0, streamY);
        ctx.lineTo(width, streamY);
        ctx.stroke();

        ctx.setLineDash([]);
      }

      ctx.globalAlpha = 1;
      if (!prefersReducedMotion) {
        timeRef.current += 0.016;
      }
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, theme, intensity]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        display: 'block',
        fontFamily: '"Share Tech Mono", monospace',
        ...style,
      }}
      aria-label="Tactical data stream"
    />
  );
};

ColdWarParticles.displayName = 'ColdWarParticles';
