/**
 * ColdWarScanlines Component - Professional CRT Monitor Effect
 * Advanced CRT scanlines with phosphor glow, screen curvature, and tactical HUD overlay
 * Inspired by Call of Duty: Black Ops Cold War terminal displays
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarScanlinesProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

const THEME_COLORS: Record<
  ColdWarTheme,
  { primary: string; secondary: string; glow: string; phosphor: string }
> = {
  perseus: {
    primary: '#FFB000',
    secondary: '#D4A574',
    glow: '#FFD700',
    phosphor: '#FF8800',
  },
  greenTerminal: {
    primary: '#00FF41',
    secondary: '#00CC33',
    glow: '#00FF88',
    phosphor: '#00DD44',
  },
  satelliteView: {
    primary: '#00D9FF',
    secondary: '#0099CC',
    glow: '#00FFFF',
    phosphor: '#00AAFF',
  },
};

const INTENSITY_VALUES: Record<
  ColdWarIntensity,
  { opacity: number; scanlineHeight: number; flickerAmount: number }
> = {
  low: { opacity: 0.25, scanlineHeight: 4, flickerAmount: 0.02 },
  medium: { opacity: 0.4, scanlineHeight: 2, flickerAmount: 0.04 },
  high: { opacity: 0.6, scanlineHeight: 1, flickerAmount: 0.06 },
};

export const ColdWarScanlines: React.FC<ColdWarScanlinesProps> = ({
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const { opacity, scanlineHeight, flickerAmount } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      // Clear with subtle vignette
      const vignetteGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 2
      );
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, width, height);

      const time = prefersReducedMotion ? 0 : timeRef.current;

      ctx.save();

      // Draw horizontal scanlines with phosphor glow
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = scanlineHeight;
      ctx.globalAlpha = opacity * 0.4;

      for (let y = 0; y < height; y += scanlineHeight * 2) {
        const flicker = prefersReducedMotion
          ? 1
          : 1 + Math.sin(time * 10 + y * 0.1) * flickerAmount;
        ctx.globalAlpha = opacity * 0.4 * flicker;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw phosphor glow effect
      if (!prefersReducedMotion) {
        ctx.globalAlpha = opacity * 0.15;
        ctx.strokeStyle = colors.phosphor;
        ctx.lineWidth = scanlineHeight * 2;
        ctx.shadowColor = colors.phosphor;
        ctx.shadowBlur = 10;

        const glowY = (time * 100) % height;
        for (let i = -20; i <= 20; i += scanlineHeight * 2) {
          const y = glowY + i;
          if (y >= 0 && y <= height) {
            const glowIntensity = 1 - Math.abs(i) / 20;
            ctx.globalAlpha = opacity * 0.15 * glowIntensity;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }
        }
        ctx.shadowBlur = 0;
      }

      // Draw CRT screen curvature effect (subtle distortion lines)
      ctx.globalAlpha = opacity * 0.2;
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += 40) {
        const curve = Math.sin((x / width) * Math.PI) * 5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.quadraticCurveTo(x + curve, height / 2, x, height);
        ctx.stroke();
      }

      // Draw tactical HUD frame with corner brackets
      ctx.globalAlpha = opacity * 0.9;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      const bracketSize = 50;
      const bracketThickness = 3;
      const offset = 15;

      // Top-left corner
      ctx.beginPath();
      ctx.moveTo(offset + bracketSize, offset);
      ctx.lineTo(offset, offset);
      ctx.lineTo(offset, offset + bracketSize);
      ctx.stroke();

      // Inner detail
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(offset + bracketSize - 10, offset + bracketThickness);
      ctx.lineTo(offset + bracketThickness, offset + bracketThickness);
      ctx.lineTo(offset + bracketThickness, offset + bracketSize - 10);
      ctx.stroke();

      // Top-right corner
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width - offset - bracketSize, offset);
      ctx.lineTo(width - offset, offset);
      ctx.lineTo(width - offset, offset + bracketSize);
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width - offset - bracketSize + 10, offset + bracketThickness);
      ctx.lineTo(width - offset - bracketThickness, offset + bracketThickness);
      ctx.lineTo(width - offset - bracketThickness, offset + bracketSize - 10);
      ctx.stroke();

      // Bottom-left corner
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(offset, height - offset - bracketSize);
      ctx.lineTo(offset, height - offset);
      ctx.lineTo(offset + bracketSize, height - offset);
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(offset + bracketThickness, height - offset - bracketSize + 10);
      ctx.lineTo(offset + bracketThickness, height - offset - bracketThickness);
      ctx.lineTo(offset + bracketSize - 10, height - offset - bracketThickness);
      ctx.stroke();

      // Bottom-right corner
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width - offset, height - offset - bracketSize);
      ctx.lineTo(width - offset, height - offset);
      ctx.lineTo(width - offset - bracketSize, height - offset);
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width - offset - bracketThickness, height - offset - bracketSize + 10);
      ctx.lineTo(width - offset - bracketThickness, height - offset - bracketThickness);
      ctx.lineTo(width - offset - bracketSize + 10, height - offset - bracketThickness);
      ctx.stroke();

      // Draw tactical markers along edges
      ctx.globalAlpha = opacity * 0.6;
      ctx.fillStyle = colors.glow;
      const markerSpacing = 80;

      // Top edge markers
      for (let x = markerSpacing; x < width - markerSpacing; x += markerSpacing) {
        ctx.fillRect(x - 1, offset, 2, 8);
      }

      // Bottom edge markers
      for (let x = markerSpacing; x < width - markerSpacing; x += markerSpacing) {
        ctx.fillRect(x - 1, height - offset - 8, 2, 8);
      }

      // Left edge markers
      for (let y = markerSpacing; y < height - markerSpacing; y += markerSpacing) {
        ctx.fillRect(offset, y - 1, 8, 2);
      }

      // Right edge markers
      for (let y = markerSpacing; y < height - markerSpacing; y += markerSpacing) {
        ctx.fillRect(width - offset - 8, y - 1, 8, 2);
      }

      // Draw pulsing status indicators
      if (!prefersReducedMotion) {
        const pulse = Math.sin(time * 3) * 0.3 + 0.7;
        ctx.globalAlpha = opacity * pulse;
        ctx.fillStyle = colors.glow;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 15;

        // Status dots in corners
        const dotSize = 4;
        ctx.beginPath();
        ctx.arc(offset + bracketSize + 15, offset + 15, dotSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(width - offset - bracketSize - 15, offset + 15, dotSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      // Draw HUD text overlay
      ctx.globalAlpha = opacity * 0.7;
      ctx.fillStyle = colors.primary;
      ctx.font = '10px "Share Tech Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('TACTICAL DISPLAY', offset + bracketSize + 25, offset + 20);

      ctx.textAlign = 'right';
      ctx.fillText('SECURE CHANNEL', width - offset - bracketSize - 25, offset + 20);

      // Draw scan line indicator
      if (!prefersReducedMotion) {
        const scanProgress = ((time * 50) % height) / height;
        ctx.globalAlpha = opacity * 0.5;
        ctx.fillStyle = colors.glow;
        ctx.fillRect(offset, height - offset - 30, (width - offset * 2) * scanProgress, 2);
      }

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
      aria-label="CRT scanlines display"
    />
  );
};

ColdWarScanlines.displayName = 'ColdWarScanlines';
