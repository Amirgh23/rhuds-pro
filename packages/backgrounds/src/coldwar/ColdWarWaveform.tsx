/**
 * ColdWarWaveform Component - Professional Audio Waveform Display
 * Advanced tactical waveform with frequency analysis, signal strength, and audio visualization
 * Inspired by Call of Duty: Black Ops Cold War audio intelligence displays
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarWaveformProps {
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
  { amplitude: number; frequency: number; bars: number }
> = {
  low: { amplitude: 0.3, frequency: 2, bars: 20 },
  medium: { amplitude: 0.5, frequency: 3, bars: 40 },
  high: { amplitude: 0.7, frequency: 4, bars: 60 },
};

export const ColdWarWaveform: React.FC<ColdWarWaveformProps> = ({
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
  const waveDataRef = useRef<number[]>([]);
  const frequencyBarsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const { amplitude, frequency, bars } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const centerY = height / 2;
    const wavePoints = 200;

    // Initialize wave data
    if (waveDataRef.current.length === 0) {
      for (let i = 0; i < wavePoints; i++) {
        waveDataRef.current.push(0);
      }
    }

    // Initialize frequency bars
    if (frequencyBarsRef.current.length === 0) {
      for (let i = 0; i < bars; i++) {
        frequencyBarsRef.current.push(Math.random());
      }
    }

    const render = () => {
      // Clear with dark gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
      bgGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const time = prefersReducedMotion ? 0 : timeRef.current;

      ctx.save();

      // Update wave data
      if (!prefersReducedMotion) {
        waveDataRef.current.shift();
        const newValue =
          Math.sin(time * frequency) * amplitude +
          Math.sin(time * frequency * 2.3) * amplitude * 0.5 +
          Math.sin(time * frequency * 0.7) * amplitude * 0.3 +
          (Math.random() - 0.5) * 0.1;
        waveDataRef.current.push(newValue);

        // Update frequency bars
        frequencyBarsRef.current = frequencyBarsRef.current.map((val, i) => {
          const target = Math.abs(Math.sin(time * frequency + i * 0.1)) * (1 - i / bars);
          return val + (target - val) * 0.1;
        });
      }

      // Draw center line
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw grid lines
      ctx.globalAlpha = 0.2;
      const gridSpacing = height / 8;
      for (let i = 1; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSpacing);
        ctx.lineTo(width, i * gridSpacing);
        ctx.stroke();
      }

      // Draw main waveform
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      waveDataRef.current.forEach((value, i) => {
        const x = (i / wavePoints) * width;
        const y = centerY + value * (height * 0.35);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Draw secondary waveform (phase shifted)
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      waveDataRef.current.forEach((value, i) => {
        const x = (i / wavePoints) * width;
        const phaseShift = Math.sin((i / wavePoints) * Math.PI * 2 + time) * 0.3;
        const y = centerY + (value + phaseShift) * (height * 0.25);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw frequency spectrum bars
      const barWidth = width / bars;
      const barMaxHeight = height * 0.3;
      const barY = height - 60;

      frequencyBarsRef.current.forEach((value, i) => {
        const barHeight = value * barMaxHeight;
        const x = i * barWidth;

        // Bar gradient
        const barGradient = ctx.createLinearGradient(x, barY, x, barY - barHeight);
        barGradient.addColorStop(0, colors.glow);
        barGradient.addColorStop(0.5, colors.primary);
        barGradient.addColorStop(1, colors.secondary);

        ctx.fillStyle = barGradient;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x + 1, barY - barHeight, barWidth - 2, barHeight);

        // Bar outline
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.strokeRect(x + 1, barY - barHeight, barWidth - 2, barHeight);
      });

      // Draw waveform envelope
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = colors.glow;
      ctx.lineWidth = 1;

      ctx.beginPath();
      waveDataRef.current.forEach((value, i) => {
        const x = (i / wavePoints) * width;
        const envelope = Math.abs(value) * (height * 0.35);
        const y = centerY - envelope;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.beginPath();
      waveDataRef.current.forEach((value, i) => {
        const x = (i / wavePoints) * width;
        const envelope = Math.abs(value) * (height * 0.35);
        const y = centerY + envelope;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw tactical HUD overlay
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;

      // Corner brackets
      const bracketSize = 30;
      const offset = 10;

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

      // Draw HUD info
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = colors.primary;
      ctx.font = '10px "Share Tech Mono", monospace';
      ctx.textAlign = 'left';

      const currentAmplitude = Math.abs(waveDataRef.current[waveDataRef.current.length - 1]);
      const signalStrength = Math.floor((currentAmplitude * 100) / amplitude);

      ctx.fillText('AUDIO ANALYSIS', offset + bracketSize + 10, offset + 15);
      ctx.fillText(`SIGNAL: ${signalStrength}%`, offset + bracketSize + 10, offset + 28);

      ctx.textAlign = 'right';
      ctx.fillText(
        `FREQ: ${frequency.toFixed(1)} Hz`,
        width - offset - bracketSize - 10,
        offset + 15
      );
      ctx.fillText(`TIME: ${time.toFixed(2)}s`, width - offset - bracketSize - 10, offset + 28);

      // Draw signal strength meter
      const meterWidth = 100;
      const meterHeight = 8;
      const meterX = width - offset - bracketSize - 10 - meterWidth;
      const meterY = offset + 35;

      ctx.globalAlpha = 0.3;
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(meterX, meterY, meterWidth, meterHeight);

      ctx.globalAlpha = 0.8;
      const meterFill = (signalStrength / 100) * meterWidth;
      const meterGradient = ctx.createLinearGradient(meterX, meterY, meterX + meterFill, meterY);
      meterGradient.addColorStop(0, colors.glow);
      meterGradient.addColorStop(1, colors.primary);
      ctx.fillStyle = meterGradient;
      ctx.fillRect(meterX, meterY, meterFill, meterHeight);

      // Draw pulsing recording indicator
      if (!prefersReducedMotion) {
        const pulse = Math.sin(time * 5) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = colors.glow;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(offset + 15, height - offset - 15, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.globalAlpha = 0.7;
        ctx.fillStyle = colors.primary;
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('REC', offset + 25, height - offset - 11);
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
      aria-label="Audio waveform display"
    />
  );
};

ColdWarWaveform.displayName = 'ColdWarWaveform';
