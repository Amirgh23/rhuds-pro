/**
 * ColdWarRadar Component - Professional Military Radar Display
 * Advanced tactical radar with multiple sweep modes, target tracking, and range rings
 * Inspired by Call of Duty: Black Ops Cold War radar systems
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarRadarProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

const THEME_COLORS: Record<
  ColdWarTheme,
  { primary: string; secondary: string; sweep: string; target: string }
> = {
  perseus: {
    primary: '#FFB000',
    secondary: '#D4A574',
    sweep: '#FFD700',
    target: '#FF3333',
  },
  greenTerminal: {
    primary: '#00FF41',
    secondary: '#00CC33',
    sweep: '#00FF88',
    target: '#FF0000',
  },
  satelliteView: {
    primary: '#00D9FF',
    secondary: '#0099CC',
    sweep: '#00FFFF',
    target: '#FF6600',
  },
};

const INTENSITY_VALUES: Record<
  ColdWarIntensity,
  { opacity: number; rings: number; targets: number }
> = {
  low: { opacity: 0.4, rings: 4, targets: 3 },
  medium: { opacity: 0.6, rings: 6, targets: 5 },
  high: { opacity: 0.8, rings: 8, targets: 8 },
};

export const ColdWarRadar: React.FC<ColdWarRadarProps> = ({
  width,
  height,
  theme = 'perseus',
  intensity = 'medium',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const targetsRef = useRef<Array<{ angle: number; distance: number; speed: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const { opacity, rings, targets: targetCount } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 40;

    // Initialize random targets
    if (targetsRef.current.length === 0) {
      for (let i = 0; i < targetCount; i++) {
        targetsRef.current.push({
          angle: Math.random() * Math.PI * 2,
          distance: 0.3 + Math.random() * 0.6,
          speed: 0.01 + Math.random() * 0.02,
        });
      }
    }

    const render = () => {
      // Clear with dark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      const time = prefersReducedMotion ? 0 : timeRef.current;
      const sweepAngle = (time * 1.2) % (Math.PI * 2);

      ctx.save();

      // Draw outer frame
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.globalAlpha = opacity * 0.8;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Draw concentric range rings with labels
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = opacity * 0.5;

      for (let i = 1; i <= rings; i++) {
        const radius = (maxRadius / rings) * i;
        const ringOpacity = 1 - (i / rings) * 0.3;

        ctx.globalAlpha = opacity * ringOpacity * 0.5;
        ctx.strokeStyle = i === rings ? colors.primary : colors.secondary;
        ctx.lineWidth = i === rings ? 2 : 1;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Draw range markers
        if (i % 2 === 0) {
          ctx.fillStyle = colors.secondary;
          ctx.globalAlpha = opacity * 0.7;
          ctx.font = '10px "Share Tech Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${i * 100}m`, centerX, centerY - radius - 5);
        }
      }

      // Draw cardinal direction lines and labels
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity * 0.4;

      const directions = [
        { angle: 0, label: 'N' },
        { angle: Math.PI / 2, label: 'E' },
        { angle: Math.PI, label: 'S' },
        { angle: (Math.PI * 3) / 2, label: 'W' },
      ];

      directions.forEach(({ angle, label }) => {
        const x = centerX + Math.cos(angle - Math.PI / 2) * maxRadius;
        const y = centerY + Math.sin(angle - Math.PI / 2) * maxRadius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Direction labels
        ctx.fillStyle = colors.primary;
        ctx.globalAlpha = opacity * 0.9;
        ctx.font = 'bold 14px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const labelX = centerX + Math.cos(angle - Math.PI / 2) * (maxRadius + 20);
        const labelY = centerY + Math.sin(angle - Math.PI / 2) * (maxRadius + 20);
        ctx.fillText(label, labelX, labelY);
      });

      // Draw diagonal grid lines
      ctx.globalAlpha = opacity * 0.2;
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const x = centerX + Math.cos(angle) * maxRadius;
        const y = centerY + Math.sin(angle) * maxRadius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Draw rotating sweep with gradient trail
      ctx.globalAlpha = opacity * 0.7;
      const sweepGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius
      );
      sweepGradient.addColorStop(0, colors.sweep + 'AA');
      sweepGradient.addColorStop(0.5, colors.sweep + '44');
      sweepGradient.addColorStop(1, colors.sweep + '00');

      ctx.fillStyle = sweepGradient;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, sweepAngle - Math.PI / 6, sweepAngle);
      ctx.closePath();
      ctx.fill();

      // Draw sweep line
      ctx.strokeStyle = colors.sweep;
      ctx.lineWidth = 3;
      ctx.globalAlpha = opacity;
      ctx.shadowColor = colors.sweep;
      ctx.shadowBlur = 15;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(sweepAngle) * maxRadius,
        centerY + Math.sin(sweepAngle) * maxRadius
      );
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Update and draw targets
      if (!prefersReducedMotion) {
        targetsRef.current.forEach((target) => {
          target.angle += target.speed;
          if (target.angle > Math.PI * 2) target.angle -= Math.PI * 2;
        });
      }

      targetsRef.current.forEach((target) => {
        const targetX = centerX + Math.cos(target.angle) * maxRadius * target.distance;
        const targetY = centerY + Math.sin(target.angle) * maxRadius * target.distance;

        // Check if target is in sweep range
        const angleDiff = Math.abs(
          ((target.angle - sweepAngle + Math.PI) % (Math.PI * 2)) - Math.PI
        );
        const isInSweep = angleDiff < Math.PI / 6;

        if (isInSweep || prefersReducedMotion) {
          // Draw target blip
          ctx.fillStyle = colors.target;
          ctx.globalAlpha = opacity * (isInSweep ? 1 : 0.3);
          ctx.shadowColor = colors.target;
          ctx.shadowBlur = 10;

          ctx.beginPath();
          ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Draw target ring
          ctx.strokeStyle = colors.target;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
          ctx.stroke();

          // Draw target cross
          ctx.beginPath();
          ctx.moveTo(targetX - 6, targetY);
          ctx.lineTo(targetX + 6, targetY);
          ctx.moveTo(targetX, targetY - 6);
          ctx.lineTo(targetX, targetY + 6);
          ctx.stroke();

          ctx.shadowBlur = 0;
        }
      });

      // Draw center point with pulsing effect
      const centerPulse = prefersReducedMotion ? 1 : Math.sin(time * 4) * 0.3 + 0.7;
      ctx.globalAlpha = opacity * centerPulse;
      ctx.fillStyle = colors.sweep;
      ctx.shadowColor = colors.sweep;
      ctx.shadowBlur = 20;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = colors.sweep;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10 + centerPulse * 5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Draw HUD info overlay
      ctx.globalAlpha = opacity * 0.8;
      ctx.fillStyle = colors.primary;
      ctx.font = '12px "Share Tech Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`TARGETS: ${targetsRef.current.length}`, 20, height - 20);
      ctx.fillText(`RANGE: ${rings * 100}m`, 20, height - 40);

      ctx.textAlign = 'right';
      ctx.fillText(
        `SWEEP: ${Math.floor((sweepAngle / (Math.PI * 2)) * 360)}°`,
        width - 20,
        height - 20
      );

      ctx.restore();

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
      aria-label="Tactical radar display"
    />
  );
};

ColdWarRadar.displayName = 'ColdWarRadar';
