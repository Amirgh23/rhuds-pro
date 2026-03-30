/**
 * ColdWarNoise Component - Professional Static Interference
 * Advanced tactical noise with signal interference, static patterns, and glitch effects
 * Inspired by Call of Duty: Black Ops Cold War signal disruption displays
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarNoiseProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

const THEME_COLORS: Record<ColdWarTheme, { primary: string; secondary: string; accent: string }> = {
  perseus: {
    primary: '#FFB000',
    secondary: '#D4A574',
    accent: '#FF8800',
  },
  greenTerminal: {
    primary: '#00FF41',
    secondary: '#00CC33',
    accent: '#00DD44',
  },
  satelliteView: {
    primary: '#00D9FF',
    secondary: '#0099CC',
    accent: '#00AAFF',
  },
};

const INTENSITY_VALUES: Record<
  ColdWarIntensity,
  { opacity: number; noiseScale: number; glitchFrequency: number }
> = {
  low: { opacity: 0.15, noiseScale: 3, glitchFrequency: 0.01 },
  medium: { opacity: 0.25, noiseScale: 2, glitchFrequency: 0.02 },
  high: { opacity: 0.4, noiseScale: 1, glitchFrequency: 0.04 },
};

// Fast random number generator
function random(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const ColdWarNoise: React.FC<ColdWarNoiseProps> = ({
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
  const imageDataRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const { opacity, noiseScale, glitchFrequency } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Parse color to RGB
    const parseColor = (hex: string): [number, number, number] => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return [0, 0, 0];
      return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    };

    const primaryRGB = parseColor(colors.primary);
    const secondaryRGB = parseColor(colors.secondary);
    const accentRGB = parseColor(colors.accent);

    const render = () => {
      const time = prefersReducedMotion ? 0 : timeRef.current;

      // Create or reuse image data
      if (!imageDataRef.current) {
        imageDataRef.current = ctx.createImageData(width, height);
      }

      const imageData = imageDataRef.current;
      const data = imageData.data;

      // Generate tactical noise pattern
      const glitchActive = Math.random() < glitchFrequency;
      const glitchY = Math.floor(Math.random() * height);
      const glitchHeight = 20 + Math.floor(Math.random() * 50);

      for (let y = 0; y < height; y += noiseScale) {
        for (let x = 0; x < width; x += noiseScale) {
          // Generate noise value
          const seed = x * 0.01 + y * 0.01 + time * 10;
          const noiseVal = random(seed);

          // Determine color based on noise and position
          let r, g, b, a;

          // Glitch effect
          if (glitchActive && y >= glitchY && y < glitchY + glitchHeight) {
            const glitchIntensity = Math.abs(y - (glitchY + glitchHeight / 2)) / (glitchHeight / 2);
            r = accentRGB[0];
            g = accentRGB[1];
            b = accentRGB[2];
            a = Math.round(255 * opacity * (1 - glitchIntensity) * noiseVal);
          }
          // Regular noise
          else {
            const colorBlend = noiseVal;
            r = Math.round(primaryRGB[0] * (1 - colorBlend) + secondaryRGB[0] * colorBlend);
            g = Math.round(primaryRGB[1] * (1 - colorBlend) + secondaryRGB[1] * colorBlend);
            b = Math.round(primaryRGB[2] * (1 - colorBlend) + secondaryRGB[2] * colorBlend);
            a = Math.round(255 * opacity * noiseVal);
          }

          // Fill pixel block
          for (let dy = 0; dy < noiseScale && y + dy < height; dy++) {
            for (let dx = 0; dx < noiseScale && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              data[idx] = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = a;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Draw tactical interference patterns
      ctx.globalAlpha = opacity * 0.3;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 1;

      // Horizontal scan lines
      if (!prefersReducedMotion) {
        const scanY = (time * 100) % height;
        for (let i = -10; i <= 10; i += 2) {
          const y = scanY + i;
          if (y >= 0 && y < height) {
            const intensity = 1 - Math.abs(i) / 10;
            ctx.globalAlpha = opacity * 0.3 * intensity;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }
        }
      }

      // Random vertical glitch bars
      if (glitchActive) {
        ctx.globalAlpha = opacity * 0.5;
        ctx.fillStyle = colors.accent;
        const numBars = 3 + Math.floor(Math.random() * 5);

        for (let i = 0; i < numBars; i++) {
          const barX = Math.floor(Math.random() * width);
          const barWidth = 2 + Math.floor(Math.random() * 4);
          const barHeight = 10 + Math.floor(Math.random() * 30);
          const barY = Math.floor(Math.random() * height);

          ctx.fillRect(barX, barY, barWidth, barHeight);
        }
      }

      // Draw signal strength indicator
      ctx.globalAlpha = opacity * 0.6;
      ctx.fillStyle = colors.primary;
      ctx.font = '10px "Share Tech Mono", monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';

      const signalStrength = Math.floor((1 - opacity) * 100);
      ctx.fillText(`SIGNAL: ${signalStrength}%`, width - 10, 10);

      // Draw noise bars (signal strength visualization)
      const barCount = 5;
      const barWidth = 3;
      const barSpacing = 2;
      const barMaxHeight = 15;

      for (let i = 0; i < barCount; i++) {
        const barHeight = (barMaxHeight / barCount) * (i + 1);
        const barX = width - 10 - (barCount - i) * (barWidth + barSpacing);
        const barY = 25;

        if (i < Math.floor(signalStrength / 20)) {
          ctx.fillStyle = colors.primary;
        } else {
          ctx.fillStyle = colors.secondary;
          ctx.globalAlpha = opacity * 0.3;
        }

        ctx.fillRect(barX, barY + (barMaxHeight - barHeight), barWidth, barHeight);
      }

      // Draw interference warning
      if (glitchActive) {
        ctx.globalAlpha = opacity * 0.8;
        ctx.fillStyle = colors.accent;
        ctx.font = 'bold 10px "Share Tech Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('⚠ INTERFERENCE DETECTED', 10, 10);
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
      aria-label="Signal interference display"
    />
  );
};

ColdWarNoise.displayName = 'ColdWarNoise';
