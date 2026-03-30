/**
 * ColdWarTerminal Component - Professional Military Terminal Display
 * Advanced command terminal with scrolling text, system logs, and encryption sequences
 * Inspired by Call of Duty: Black Ops Cold War computer terminal interfaces
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarTerminalProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'error' | 'success' | 'warning';
  age: number;
}

const THEME_COLORS: Record<
  ColdWarTheme,
  {
    primary: string;
    secondary: string;
    error: string;
    success: string;
    warning: string;
    glow: string;
  }
> = {
  perseus: {
    primary: '#FFB000',
    secondary: '#D4A574',
    error: '#FF3333',
    success: '#00FF88',
    warning: '#FF8800',
    glow: '#FFD700',
  },
  greenTerminal: {
    primary: '#00FF41',
    secondary: '#00CC33',
    error: '#FF0000',
    success: '#00FFAA',
    warning: '#FFAA00',
    glow: '#00FF88',
  },
  satelliteView: {
    primary: '#00D9FF',
    secondary: '#0099CC',
    error: '#FF6600',
    success: '#00FF00',
    warning: '#FFCC00',
    glow: '#00FFFF',
  },
};

const INTENSITY_VALUES: Record<ColdWarIntensity, { speed: number; maxLines: number }> = {
  low: { speed: 2000, maxLines: 15 },
  medium: { speed: 1000, maxLines: 25 },
  high: { speed: 500, maxLines: 35 },
};

const COMMANDS = [
  'SYSTEM.INIT',
  'DECRYPT.EXE',
  'SCAN.NETWORK',
  'ACCESS.MAINFRAME',
  'TRACE.SIGNAL',
  'ANALYZE.DATA',
  'COMPILE.INTEL',
  'VERIFY.CREDENTIALS',
  'ESTABLISH.LINK',
  'MONITOR.ACTIVITY',
];

const OUTPUTS = [
  'Connection established...',
  'Decryption in progress...',
  'Analyzing encrypted data...',
  'Scanning for vulnerabilities...',
  'Accessing secure database...',
  'Retrieving classified files...',
  'Compiling intelligence report...',
  'Verifying authentication...',
  'Establishing secure channel...',
  'Monitoring network traffic...',
];

const ERRORS = [
  'ERROR: Access denied',
  'ERROR: Connection timeout',
  'ERROR: Invalid credentials',
  'ERROR: Firewall detected',
];

const SUCCESS = [
  'SUCCESS: Access granted',
  'SUCCESS: Decryption complete',
  'SUCCESS: Data retrieved',
  'SUCCESS: Connection secure',
];

const WARNINGS = [
  'WARNING: Intrusion detected',
  'WARNING: Low signal strength',
  'WARNING: Encryption weak',
  'WARNING: Trace detected',
];

export const ColdWarTerminal: React.FC<ColdWarTerminalProps> = ({
  width,
  height,
  theme = 'perseus',
  intensity = 'medium',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const linesRef = useRef<TerminalLine[]>([]);
  const lastLineTimeRef = useRef(0);
  const cursorBlinkRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const { speed, maxLines } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lineHeight = 16;
    const padding = 20;
    const fontSize = 12;

    const addLine = () => {
      const rand = Math.random();
      let line: TerminalLine;

      if (rand < 0.3) {
        line = {
          text: `> ${COMMANDS[Math.floor(Math.random() * COMMANDS.length)]}`,
          type: 'command',
          age: 0,
        };
      } else if (rand < 0.6) {
        line = {
          text: OUTPUTS[Math.floor(Math.random() * OUTPUTS.length)],
          type: 'output',
          age: 0,
        };
      } else if (rand < 0.7) {
        line = {
          text: ERRORS[Math.floor(Math.random() * ERRORS.length)],
          type: 'error',
          age: 0,
        };
      } else if (rand < 0.85) {
        line = {
          text: SUCCESS[Math.floor(Math.random() * SUCCESS.length)],
          type: 'success',
          age: 0,
        };
      } else {
        line = {
          text: WARNINGS[Math.floor(Math.random() * WARNINGS.length)],
          type: 'warning',
          age: 0,
        };
      }

      linesRef.current.push(line);
      if (linesRef.current.length > maxLines) {
        linesRef.current.shift();
      }
    };

    const render = () => {
      // Clear with terminal background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const time = prefersReducedMotion ? 0 : timeRef.current;

      // Add new lines periodically
      if (!prefersReducedMotion && time - lastLineTimeRef.current > speed) {
        addLine();
        lastLineTimeRef.current = time;
      }

      ctx.save();

      // Draw terminal border
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Draw terminal header
      ctx.fillStyle = colors.primary;
      ctx.globalAlpha = 0.8;
      ctx.font = `bold ${fontSize}px "Share Tech Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('CLASSIFIED TERMINAL - AUTHORIZED ACCESS ONLY', padding, padding + 10);

      // Draw separator line
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(padding, padding + 20);
      ctx.lineTo(width - padding, padding + 20);
      ctx.stroke();

      // Draw terminal lines
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;
      const startY = padding + 40;

      linesRef.current.forEach((line, index) => {
        const y = startY + index * lineHeight;

        // Age lines
        if (!prefersReducedMotion) {
          line.age += 0.016;
        }

        // Fade older lines
        const alpha = Math.max(0.3, 1 - line.age / 10);

        // Set color based on type
        let color = colors.secondary;
        switch (line.type) {
          case 'command':
            color = colors.primary;
            break;
          case 'error':
            color = colors.error;
            break;
          case 'success':
            color = colors.success;
            break;
          case 'warning':
            color = colors.warning;
            break;
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;

        // Add glow for recent lines
        if (line.age < 0.5) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillText(line.text, padding, y);
      });

      ctx.shadowBlur = 0;

      // Draw cursor
      if (!prefersReducedMotion) {
        cursorBlinkRef.current += 0.05;
      }
      const cursorAlpha = Math.sin(cursorBlinkRef.current) * 0.5 + 0.5;

      const cursorY = startY + linesRef.current.length * lineHeight;
      ctx.fillStyle = colors.glow;
      ctx.globalAlpha = cursorAlpha;
      ctx.fillRect(padding, cursorY - fontSize + 2, 8, fontSize);

      // Draw system status
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = colors.primary;
      ctx.font = `10px "Share Tech Mono", monospace`;
      ctx.textAlign = 'left';

      const statusY = height - padding - 5;
      ctx.fillText(`LINES: ${linesRef.current.length}`, padding, statusY);

      ctx.textAlign = 'right';
      ctx.fillText(`UPTIME: ${Math.floor(time)}s`, width - padding, statusY);

      // Draw pulsing status indicator
      if (!prefersReducedMotion) {
        const statusPulse = Math.sin(time * 3) * 0.3 + 0.7;
        ctx.globalAlpha = statusPulse;
        ctx.fillStyle = colors.success;
        ctx.shadowColor = colors.success;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(width - padding - 60, statusY - 4, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.globalAlpha = 0.7;
        ctx.fillStyle = colors.primary;
        ctx.textAlign = 'right';
        ctx.fillText('ACTIVE', width - padding - 70, statusY);
      }

      ctx.restore();

      if (!prefersReducedMotion) {
        timeRef.current += 16;
      }
      animationRef.current = requestAnimationFrame(render);
    };

    // Initialize with some lines
    if (linesRef.current.length === 0) {
      for (let i = 0; i < 5; i++) {
        addLine();
      }
    }

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
      aria-label="Military terminal display"
    />
  );
};

ColdWarTerminal.displayName = 'ColdWarTerminal';
