/**
 * ColdWarSonar Component - Professional Submarine Sonar Display
 * Advanced sonar visualization with ping waves, target detection, and depth analysis
 * Inspired by Call of Duty: Black Ops Cold War submarine mission displays
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarSonarProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

interface SonarPing {
  radius: number;
  alpha: number;
  speed: number;
}

interface SonarTarget {
  angle: number;
  distance: number;
  type: 'hostile' | 'neutral' | 'unknown';
  pulse: number;
}

const THEME_COLORS: Record<
  ColdWarTheme,
  {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
    hostile: string;
    neutral: string;
  }
> = {
  perseus: {
    primary: '#FFB000',
    secondary: '#D4A574',
    accent: '#FF8800',
    glow: '#FFD700',
    hostile: '#FF3333',
    neutral: '#00FF88',
  },
  greenTerminal: {
    primary: '#00FF41',
    secondary: '#00CC33',
    accent: '#00DD44',
    glow: '#00FF88',
    hostile: '#FF0000',
    neutral: '#00FFFF',
  },
  satelliteView: {
    primary: '#00D9FF',
    secondary: '#0099CC',
    accent: '#00AAFF',
    glow: '#00FFFF',
    hostile: '#FF6600',
    neutral: '#00FF00',
  },
};

const INTENSITY_VALUES: Record<
  ColdWarIntensity,
  { pingSpeed: number; targets: number; sweepSpeed: number }
> = {
  low: { pingSpeed: 0.5, targets: 3, sweepSpeed: 0.01 },
  medium: { pingSpeed: 1, targets: 6, sweepSpeed: 0.015 },
  high: { pingSpeed: 1.5, targets: 10, sweepSpeed: 0.02 },
};

export const ColdWarSonar: React.FC<ColdWarSonarProps> = ({
  width,
  height,
  theme = 'perseus',
  intensity = 'medium',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const pingsRef = useRef<SonarPing[]>([]);
  const targetsRef = useRef<SonarTarget[]>([]);
  const sweepAngleRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const { pingSpeed, targets: targetCount, sweepSpeed } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 60;

    // Initialize targets
    if (targetsRef.current.length === 0) {
      const types: Array<'hostile' | 'neutral' | 'unknown'> = ['hostile', 'neutral', 'unknown'];
      for (let i = 0; i < targetCount; i++) {
        targetsRef.current.push({
          angle: Math.random() * Math.PI * 2,
          distance: 0.3 + Math.random() * 0.6,
          type: types[Math.floor(Math.random() * types.length)],
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    const render = () => {
      // Clear with dark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, width, height);

      const time = prefersReducedMotion ? 0 : timeRef.current;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Draw range circles
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      for (let i = 1; i <= 4; i++) {
        const radius = (maxRadius / 4) * i;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Range labels
        ctx.fillStyle = colors.primary;
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${i * 250}m`, 0, -radius - 5);
      }

      // Draw cardinal directions
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 1;

      const directions = ['N', 'E', 'S', 'W'];
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 - Math.PI / 2;
        const x = Math.cos(angle) * (maxRadius + 20);
        const y = Math.sin(angle) * (maxRadius + 20);

        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius);
        ctx.lineTo(Math.cos(angle) * (maxRadius + 10), Math.sin(angle) * (maxRadius + 10));
        ctx.stroke();

        ctx.fillStyle = colors.glow;
        ctx.font = '12px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(directions[i], x, y);
      }

      // Update and draw sonar pings
      if (!prefersReducedMotion) {
        pingsRef.current = pingsRef.current.filter((ping) => ping.alpha > 0);

        pingsRef.current.forEach((ping) => {
          ping.radius += ping.speed * pingSpeed;
          ping.alpha -= 0.01;

          if (ping.radius < maxRadius) {
            ctx.strokeStyle = colors.glow;
            ctx.lineWidth = 2;
            ctx.globalAlpha = ping.alpha * 0.6;
            ctx.shadowColor = colors.glow;
            ctx.shadowBlur = 15;

            ctx.beginPath();
            ctx.arc(0, 0, ping.radius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.shadowBlur = 0;
          }
        });

        // Create new ping periodically
        if (Math.random() < 0.02) {
          pingsRef.current.push({
            radius: 0,
            alpha: 1,
            speed: 2,
          });
        }
      }

      // Draw sweep line
      if (!prefersReducedMotion) {
        sweepAngleRef.current += sweepSpeed;
        if (sweepAngleRef.current > Math.PI * 2) {
          sweepAngleRef.current = 0;
        }
      }

      // Sweep gradient
      const sweepGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
      sweepGradient.addColorStop(0, `${colors.accent}40`);
      sweepGradient.addColorStop(0.5, `${colors.accent}20`);
      sweepGradient.addColorStop(1, `${colors.accent}00`);

      ctx.globalAlpha = 0.4;
      ctx.fillStyle = sweepGradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadius, sweepAngleRef.current - 0.5, sweepAngleRef.current);
      ctx.closePath();
      ctx.fill();

      // Sweep line
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = 2;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 20;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(sweepAngleRef.current) * maxRadius,
        Math.sin(sweepAngleRef.current) * maxRadius
      );
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Update and draw targets
      targetsRef.current.forEach((target) => {
        if (!prefersReducedMotion) {
          target.pulse += 0.05;
          // Slowly move targets
          target.angle += (Math.random() - 0.5) * 0.01;
          target.distance += (Math.random() - 0.5) * 0.005;
          target.distance = Math.max(0.2, Math.min(0.9, target.distance));
        }

        const pulseValue = Math.sin(target.pulse) * 0.3 + 0.7;
        const targetRadius = target.distance * maxRadius;
        const targetX = Math.cos(target.angle) * targetRadius;
        const targetY = Math.sin(target.angle) * targetRadius;

        // Target color based on type
        let targetColor = colors.primary;
        if (target.type === 'hostile') targetColor = colors.hostile;
        else if (target.type === 'neutral') targetColor = colors.neutral;

        // Draw target blip
        ctx.globalAlpha = pulseValue * 0.9;
        ctx.fillStyle = targetColor;
        ctx.shadowColor = targetColor;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw target ring
        ctx.strokeStyle = targetColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
        ctx.stroke();

        // Draw target identifier
        if (target.type === 'hostile') {
          ctx.strokeStyle = targetColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(targetX - 12, targetY - 12);
          ctx.lineTo(targetX + 12, targetY + 12);
          ctx.moveTo(targetX + 12, targetY - 12);
          ctx.lineTo(targetX - 12, targetY + 12);
          ctx.stroke();
        }

        ctx.shadowBlur = 0;
      });

      // Draw center point
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = colors.glow;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      // Draw tactical HUD frame
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;

      const bracketSize = 35;
      const offset = 15;

      // Corner brackets
      ctx.beginPath();
      ctx.moveTo(offset + bracketSize, offset);
      ctx.lineTo(offset, offset);
      ctx.lineTo(offset, offset + bracketSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - offset - bracketSize, offset);
      ctx.lineTo(width - offset, offset);
      ctx.lineTo(width - offset, offset + bracketSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(offset, height - offset - bracketSize);
      ctx.lineTo(offset, height - offset);
      ctx.lineTo(offset + bracketSize, height - offset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - offset, height - offset - bracketSize);
      ctx.lineTo(width - offset, height - offset);
      ctx.lineTo(width - offset - bracketSize, height - offset);
      ctx.stroke();

      // Draw HUD info
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = colors.primary;
      ctx.font = '10px "Share Tech Mono", monospace';
      ctx.textAlign = 'left';

      const hostileCount = targetsRef.current.filter((t) => t.type === 'hostile').length;
      const neutralCount = targetsRef.current.filter((t) => t.type === 'neutral').length;

      ctx.fillText('SONAR ACTIVE', offset + bracketSize + 10, offset + 15);
      ctx.fillText(`RANGE: 1000m`, offset + bracketSize + 10, offset + 28);

      ctx.textAlign = 'right';
      ctx.fillText(`HOSTILE: ${hostileCount}`, width - offset - bracketSize - 10, offset + 15);
      ctx.fillText(`NEUTRAL: ${neutralCount}`, width - offset - bracketSize - 10, offset + 28);

      // Draw depth indicator
      ctx.textAlign = 'left';
      ctx.fillText('DEPTH: 150m', offset + bracketSize + 10, height - offset - 15);

      // Draw bearing
      const bearing = Math.floor((sweepAngleRef.current * 180) / Math.PI);
      ctx.textAlign = 'right';
      ctx.fillText(`BEARING: ${bearing}°`, width - offset - bracketSize - 10, height - offset - 15);

      // Draw pulsing status indicator
      if (!prefersReducedMotion) {
        const statusPulse = Math.sin(time * 3) * 0.3 + 0.7;
        ctx.globalAlpha = statusPulse;
        ctx.fillStyle = colors.glow;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(width - offset - 10, height - offset - 30, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

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
      aria-label="Sonar display"
    />
  );
};

ColdWarSonar.displayName = 'ColdWarSonar';
