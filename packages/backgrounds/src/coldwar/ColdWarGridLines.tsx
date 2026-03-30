/**
 * ColdWarGridLines Component - Professional Military HUD Grid
 * Advanced 3D perspective tactical grid with depth, military markers, and coordinate system
 * Inspired by Call of Duty: Black Ops Cold War tactical displays
 */

import React, { useEffect, useRef } from 'react';

export type ColdWarTheme = 'perseus' | 'greenTerminal' | 'satelliteView';
export type ColdWarIntensity = 'low' | 'medium' | 'high';

interface ColdWarGridLinesProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

const THEME_COLORS: Record<
  ColdWarTheme,
  { primary: string; secondary: string; accent: string; glow: string }
> = {
  perseus: {
    primary: '#FFB000',
    secondary: '#D4A574',
    accent: '#8B6F47',
    glow: '#FFD700',
  },
  greenTerminal: {
    primary: '#00FF41',
    secondary: '#00CC33',
    accent: '#008822',
    glow: '#00FF88',
  },
  satelliteView: {
    primary: '#00D9FF',
    secondary: '#0099CC',
    accent: '#006699',
    glow: '#00FFFF',
  },
};

const INTENSITY_VALUES: Record<
  ColdWarIntensity,
  { opacity: number; gridSize: number; depth: number }
> = {
  low: { opacity: 0.3, gridSize: 100, depth: 0.4 },
  medium: { opacity: 0.5, gridSize: 70, depth: 0.6 },
  high: { opacity: 0.7, gridSize: 50, depth: 0.8 },
};

export const ColdWarGridLines: React.FC<ColdWarGridLinesProps> = ({
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
    const { opacity, gridSize, depth } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const centerX = width / 2;
    const centerY = height * 0.7; // Horizon line lower for better perspective
    const vanishingPointY = height * 0.3;

    const render = () => {
      // Clear with subtle gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const time = prefersReducedMotion ? 0 : timeRef.current;

      // Draw 3D perspective grid floor
      ctx.save();
      ctx.globalAlpha = opacity * 0.5;
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 1;

      // Horizontal lines (depth lines) with perspective
      for (let i = 0; i < 20; i++) {
        const progress = i / 20;
        const y = centerY + (height - centerY) * progress * progress; // Quadratic for perspective
        const perspectiveScale = 1 - progress * depth;
        const lineWidth = width * perspectiveScale;
        const x1 = centerX - lineWidth / 2;
        const x2 = centerX + lineWidth / 2;

        // Fade lines based on distance
        ctx.globalAlpha = opacity * (1 - progress * 0.7);
        ctx.lineWidth = 1 + progress * 2;

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();

        // Draw tactical markers at grid intersections
        if (i % 2 === 0) {
          ctx.fillStyle = colors.accent;
          ctx.globalAlpha = opacity * (1 - progress * 0.5);
          const markerSize = 2 + progress * 3;

          // Left marker
          ctx.fillRect(x1 - markerSize, y - markerSize / 2, markerSize, markerSize);
          // Right marker
          ctx.fillRect(x2, y - markerSize / 2, markerSize, markerSize);
        }
      }

      // Vertical lines (converging to vanishing point)
      ctx.globalAlpha = opacity * 0.6;
      ctx.strokeStyle = colors.primary;
      const numVerticalLines = Math.floor(width / gridSize);

      for (let i = -numVerticalLines; i <= numVerticalLines; i++) {
        const x = centerX + i * gridSize;
        const convergeFactor = Math.abs(i) / numVerticalLines;

        ctx.lineWidth = 1 + convergeFactor * 0.5;
        ctx.globalAlpha = opacity * (1 - convergeFactor * 0.4);

        ctx.beginPath();
        ctx.moveTo(x, centerY);

        // Converge towards vanishing point
        const targetX = centerX + (x - centerX) * 0.3;
        ctx.lineTo(targetX, vanishingPointY);
        ctx.stroke();
      }

      // Draw coordinate system overlay
      ctx.globalAlpha = opacity * 0.8;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;

      // Center crosshair
      const crosshairSize = 30;
      ctx.beginPath();
      ctx.moveTo(centerX - crosshairSize, centerY);
      ctx.lineTo(centerX + crosshairSize, centerY);
      ctx.moveTo(centerX, centerY - crosshairSize);
      ctx.lineTo(centerX, centerY + crosshairSize);
      ctx.stroke();

      // Animated scanning line
      if (!prefersReducedMotion) {
        const scanY = centerY + ((time * 50) % (height - centerY));
        ctx.globalAlpha = opacity * 0.4;
        ctx.strokeStyle = colors.glow;
        ctx.lineWidth = 2;

        const scanGradient = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
        scanGradient.addColorStop(0, colors.glow + '00');
        scanGradient.addColorStop(0.5, colors.glow + 'FF');
        scanGradient.addColorStop(1, colors.glow + '00');
        ctx.strokeStyle = scanGradient;

        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
      }

      // Draw tactical corner brackets
      ctx.globalAlpha = opacity * 0.9;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      const bracketSize = 40;
      const bracketOffset = 20;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(bracketOffset + bracketSize, bracketOffset);
      ctx.lineTo(bracketOffset, bracketOffset);
      ctx.lineTo(bracketOffset, bracketOffset + bracketSize);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(width - bracketOffset - bracketSize, bracketOffset);
      ctx.lineTo(width - bracketOffset, bracketOffset);
      ctx.lineTo(width - bracketOffset, bracketOffset + bracketSize);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(bracketOffset, height - bracketOffset - bracketSize);
      ctx.lineTo(bracketOffset, height - bracketOffset);
      ctx.lineTo(bracketOffset + bracketSize, height - bracketOffset);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width - bracketOffset, height - bracketOffset - bracketSize);
      ctx.lineTo(width - bracketOffset, height - bracketOffset);
      ctx.lineTo(width - bracketOffset - bracketSize, height - bracketOffset);
      ctx.stroke();

      // Draw pulsing tactical markers
      if (!prefersReducedMotion) {
        const pulse = Math.sin(time * 3) * 0.3 + 0.7;
        ctx.globalAlpha = opacity * pulse;
        ctx.fillStyle = colors.glow;

        // Strategic points markers
        const markers = [
          { x: centerX, y: centerY },
          { x: centerX - gridSize * 2, y: centerY + gridSize },
          { x: centerX + gridSize * 2, y: centerY + gridSize },
        ];

        markers.forEach((marker) => {
          ctx.beginPath();
          ctx.arc(marker.x, marker.y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Outer ring
          ctx.strokeStyle = colors.glow;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(marker.x, marker.y, 8 + pulse * 4, 0, Math.PI * 2);
          ctx.stroke();
        });
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
      aria-label="Tactical grid display"
    />
  );
};

ColdWarGridLines.displayName = 'ColdWarGridLines';
