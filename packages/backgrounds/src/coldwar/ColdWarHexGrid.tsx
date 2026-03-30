/**
 * ColdWarHexGrid Component - Professional Hexagonal Tactical Grid
 * Advanced hexagonal grid with tactical overlays, target zones, and military markers
 * Inspired by Call of Duty: Black Ops Cold War strategic map displays
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarHexGridProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

interface HexCell {
  x: number;
  y: number;
  active: boolean;
  pulse: number;
  targetZone: boolean;
}

const THEME_COLORS: Record<
  ColdWarTheme,
  { primary: string; secondary: string; accent: string; glow: string; danger: string }
> = {
  perseus: {
    primary: '#FFB000',
    secondary: '#D4A574',
    accent: '#FF8800',
    glow: '#FFD700',
    danger: '#FF3333',
  },
  greenTerminal: {
    primary: '#00FF41',
    secondary: '#00CC33',
    accent: '#00DD44',
    glow: '#00FF88',
    danger: '#FF0000',
  },
  satelliteView: {
    primary: '#00D9FF',
    secondary: '#0099CC',
    accent: '#00AAFF',
    glow: '#00FFFF',
    danger: '#FF6600',
  },
};

const INTENSITY_VALUES: Record<
  ColdWarIntensity,
  { hexSize: number; opacity: number; activeRate: number }
> = {
  low: { hexSize: 50, opacity: 0.3, activeRate: 0.05 },
  medium: { hexSize: 35, opacity: 0.5, activeRate: 0.1 },
  high: { hexSize: 25, opacity: 0.7, activeRate: 0.15 },
};

export const ColdWarHexGrid: React.FC<ColdWarHexGridProps> = ({
  width,
  height,
  theme = 'perseus',
  intensity = 'medium',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const hexCellsRef = useRef<HexCell[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const { hexSize, opacity, activeRate } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hexagon geometry
    const hexWidth = hexSize * 2;
    const hexHeight = Math.sqrt(3) * hexSize;
    const horizontalSpacing = hexWidth * 0.75;
    const verticalSpacing = hexHeight;

    // Initialize hex cells
    if (hexCellsRef.current.length === 0) {
      for (let row = -1; row < Math.ceil(height / verticalSpacing) + 1; row++) {
        for (let col = -1; col < Math.ceil(width / horizontalSpacing) + 1; col++) {
          const xOffset = row % 2 === 0 ? 0 : horizontalSpacing / 2;
          const x = col * horizontalSpacing + xOffset;
          const y = row * verticalSpacing;

          hexCellsRef.current.push({
            x,
            y,
            active: Math.random() < activeRate,
            pulse: Math.random() * Math.PI * 2,
            targetZone: Math.random() < 0.05,
          });
        }
      }
    }

    const drawHexagon = (x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    };

    const render = () => {
      // Clear with subtle gradient
      const bgGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 2
      );
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const time = prefersReducedMotion ? 0 : timeRef.current;

      ctx.save();

      // Update and draw hex cells
      hexCellsRef.current.forEach((cell, index) => {
        // Randomly activate/deactivate cells
        if (!prefersReducedMotion && Math.random() < 0.001) {
          cell.active = !cell.active;
        }

        // Update pulse
        if (!prefersReducedMotion) {
          cell.pulse += 0.05;
        }

        const pulseValue = Math.sin(cell.pulse) * 0.5 + 0.5;

        // Draw hexagon
        ctx.strokeStyle = cell.targetZone ? colors.danger : colors.secondary;
        ctx.lineWidth = cell.active ? 2 : 1;
        ctx.globalAlpha = opacity * (cell.active ? 0.8 : 0.3);

        drawHexagon(cell.x, cell.y, hexSize);
        ctx.stroke();

        // Fill active cells
        if (cell.active) {
          ctx.globalAlpha = opacity * 0.2 * pulseValue;
          ctx.fillStyle = cell.targetZone ? colors.danger : colors.primary;
          drawHexagon(cell.x, cell.y, hexSize);
          ctx.fill();
        }

        // Draw target zone markers
        if (cell.targetZone) {
          ctx.globalAlpha = opacity * pulseValue;
          ctx.strokeStyle = colors.danger;
          ctx.lineWidth = 2;

          // Crosshair
          const markerSize = hexSize * 0.4;
          ctx.beginPath();
          ctx.moveTo(cell.x - markerSize, cell.y);
          ctx.lineTo(cell.x + markerSize, cell.y);
          ctx.moveTo(cell.x, cell.y - markerSize);
          ctx.lineTo(cell.x, cell.y + markerSize);
          ctx.stroke();

          // Outer ring
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, hexSize * 0.6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw center dot for active cells
        if (cell.active && !cell.targetZone) {
          ctx.globalAlpha = opacity * pulseValue;
          ctx.fillStyle = colors.glow;
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw tactical overlay lines
      if (!prefersReducedMotion) {
        ctx.globalAlpha = opacity * 0.4;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

        // Diagonal scan lines
        const scanOffset = (time * 50) % (width + height);
        for (let i = -height; i < width + height; i += 100) {
          ctx.beginPath();
          ctx.moveTo(i + scanOffset, 0);
          ctx.lineTo(i + scanOffset - height, height);
          ctx.stroke();
        }

        ctx.setLineDash([]);
      }

      // Draw tactical HUD frame
      ctx.globalAlpha = opacity * 0.8;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;

      // Corner brackets
      const bracketSize = 40;
      const offset = 15;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(offset + bracketSize, offset);
      ctx.lineTo(offset, offset);
      ctx.lineTo(offset, offset + bracketSize);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(width - offset - bracketSize, offset);
      ctx.lineTo(width - offset, offset);
      ctx.lineTo(width - offset, offset + bracketSize);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(offset, height - offset - bracketSize);
      ctx.lineTo(offset, height - offset);
      ctx.lineTo(offset + bracketSize, height - offset);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width - offset, height - offset - bracketSize);
      ctx.lineTo(width - offset, height - offset);
      ctx.lineTo(width - offset - bracketSize, height - offset);
      ctx.stroke();

      // Draw HUD info
      ctx.globalAlpha = opacity * 0.7;
      ctx.fillStyle = colors.primary;
      ctx.font = '11px "Share Tech Mono", monospace';
      ctx.textAlign = 'left';

      const activeCells = hexCellsRef.current.filter((c) => c.active).length;
      const targetZones = hexCellsRef.current.filter((c) => c.targetZone).length;

      ctx.fillText(`GRID: ACTIVE`, offset + bracketSize + 10, offset + 15);
      ctx.fillText(`CELLS: ${activeCells}`, offset + bracketSize + 10, offset + 30);

      ctx.textAlign = 'right';
      ctx.fillText(`TARGETS: ${targetZones}`, width - offset - bracketSize - 10, offset + 15);
      ctx.fillText(
        `SCAN: ${Math.floor((time * 10) % 360)}°`,
        width - offset - bracketSize - 10,
        offset + 30
      );

      // Draw pulsing status indicator
      if (!prefersReducedMotion) {
        const statusPulse = Math.sin(time * 3) * 0.3 + 0.7;
        ctx.globalAlpha = opacity * statusPulse;
        ctx.fillStyle = colors.glow;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(width - offset - 10, height - offset - 10, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
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
      aria-label="Hexagonal tactical grid display"
    />
  );
};

ColdWarHexGrid.displayName = 'ColdWarHexGrid';
