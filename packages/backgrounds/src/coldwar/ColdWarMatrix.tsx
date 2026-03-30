/**
 * ColdWarMatrix Component - Professional Military Code Matrix
 * Advanced cascading code display with military encryption symbols
 * Inspired by Call of Duty: Black Ops Cold War decryption sequences
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarMatrixProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string[];
}

const THEME_COLORS: Record<ColdWarTheme, { primary: string; glow: string }> = {
  perseus: { primary: '#FFB000', glow: '#FFD700' },
  greenTerminal: { primary: '#00FF41', glow: '#00FF88' },
  satelliteView: { primary: '#00D9FF', glow: '#00FFFF' },
};

const INTENSITY_VALUES: Record<
  ColdWarIntensity,
  { columns: number; speed: number; fontSize: number }
> = {
  low: { columns: 20, speed: 0.5, fontSize: 14 },
  medium: { columns: 35, speed: 1, fontSize: 12 },
  high: { columns: 50, speed: 1.5, fontSize: 10 },
};

const MATRIX_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ█▓▒░■□▪▫><+-*/=#@$⚠⚡◆◇●○▲△'.split('');

export const ColdWarMatrix: React.FC<ColdWarMatrixProps> = ({
  width,
  height,
  theme = 'perseus',
  intensity = 'medium',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const columnsRef = useRef<MatrixColumn[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const { columns: columnCount, speed, fontSize } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const columnWidth = width / columnCount;
    const maxChars = Math.ceil(height / fontSize) + 1;

    if (columnsRef.current.length === 0) {
      for (let i = 0; i < columnCount; i++) {
        const chars: string[] = [];
        for (let j = 0; j < maxChars; j++) {
          chars.push(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]);
        }
        columnsRef.current.push({
          x: i * columnWidth,
          y: -Math.random() * height,
          speed: speed * (0.5 + Math.random() * 1.5),
          chars,
        });
      }
    }

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);

      const time = prefersReducedMotion ? 0 : timeRef.current;

      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;
      ctx.textAlign = 'center';

      columnsRef.current.forEach((column) => {
        if (!prefersReducedMotion) {
          column.y += column.speed;
          if (column.y > height + fontSize * maxChars) {
            column.y = -fontSize * maxChars;
          }
          if (Math.random() < 0.05) {
            const idx = Math.floor(Math.random() * column.chars.length);
            column.chars[idx] = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          }
        }

        for (let i = 0; i < column.chars.length; i++) {
          const charY = column.y + i * fontSize;
          if (charY > -fontSize && charY < height + fontSize) {
            if (i === 0) {
              ctx.fillStyle = colors.glow;
              ctx.globalAlpha = 1;
              ctx.shadowColor = colors.glow;
              ctx.shadowBlur = 15;
            } else if (i < 5) {
              ctx.fillStyle = colors.primary;
              ctx.globalAlpha = 1 - i / 10;
              ctx.shadowBlur = 8;
            } else {
              ctx.fillStyle = colors.primary;
              ctx.globalAlpha = 0.4 - (i / column.chars.length) * 0.4;
              ctx.shadowBlur = 0;
            }
            ctx.fillText(column.chars[i], column.x + columnWidth / 2, charY);
          }
        }
        ctx.shadowBlur = 0;
      });

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
        backgroundColor: '#000',
        ...style,
      }}
      aria-label="Military code matrix display"
    />
  );
};

ColdWarMatrix.displayName = 'ColdWarMatrix';
