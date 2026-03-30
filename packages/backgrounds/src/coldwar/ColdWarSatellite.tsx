/**
 * ColdWarSatellite Component - Professional Satellite Tracking Display
 * Advanced orbital tracking with satellite paths, ground stations, and signal coverage
 * Inspired by Call of Duty: Black Ops Cold War satellite mission displays
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarSatelliteProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

interface Satellite {
  angle: number;
  orbitRadius: number;
  speed: number;
  active: boolean;
  signalStrength: number;
}

interface GroundStation {
  x: number;
  y: number;
  pulse: number;
  active: boolean;
}

const THEME_COLORS: Record<
  ColdWarTheme,
  { primary: string; secondary: string; accent: string; glow: string; signal: string }
> = {
  perseus: {
    primary: '#FFB000',
    secondary: '#D4A574',
    accent: '#FF8800',
    glow: '#FFD700',
    signal: '#00FF88',
  },
  greenTerminal: {
    primary: '#00FF41',
    secondary: '#00CC33',
    accent: '#00DD44',
    glow: '#00FF88',
    signal: '#00FFFF',
  },
  satelliteView: {
    primary: '#00D9FF',
    secondary: '#0099CC',
    accent: '#00AAFF',
    glow: '#00FFFF',
    signal: '#00FF00',
  },
};

const INTENSITY_VALUES: Record<
  ColdWarIntensity,
  { satellites: number; stations: number; orbitSpeed: number }
> = {
  low: { satellites: 2, stations: 3, orbitSpeed: 0.005 },
  medium: { satellites: 4, stations: 5, orbitSpeed: 0.01 },
  high: { satellites: 6, stations: 8, orbitSpeed: 0.015 },
};

export const ColdWarSatellite: React.FC<ColdWarSatelliteProps> = ({
  width,
  height,
  theme = 'perseus',
  intensity = 'medium',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const satellitesRef = useRef<Satellite[]>([]);
  const stationsRef = useRef<GroundStation[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const {
      satellites: satCount,
      stations: stationCount,
      orbitSpeed,
    } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const centerX = width / 2;
    const centerY = height / 2;
    const earthRadius = Math.min(width, height) / 6;

    // Initialize satellites
    if (satellitesRef.current.length === 0) {
      for (let i = 0; i < satCount; i++) {
        satellitesRef.current.push({
          angle: (i / satCount) * Math.PI * 2,
          orbitRadius: earthRadius + 60 + i * 30,
          speed: orbitSpeed * (1 + i * 0.2),
          active: Math.random() > 0.3,
          signalStrength: 0.5 + Math.random() * 0.5,
        });
      }
    }

    // Initialize ground stations
    if (stationsRef.current.length === 0) {
      for (let i = 0; i < stationCount; i++) {
        const angle = (i / stationCount) * Math.PI * 2;
        stationsRef.current.push({
          x: Math.cos(angle) * earthRadius * 0.8,
          y: Math.sin(angle) * earthRadius * 0.8,
          pulse: Math.random() * Math.PI * 2,
          active: Math.random() > 0.4,
        });
      }
    }

    const render = () => {
      // Clear with space background
      const bgGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(width, height) / 2
      );
      bgGradient.addColorStop(0, 'rgba(0, 5, 15, 0.1)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const time = prefersReducedMotion ? 0 : timeRef.current;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Draw Earth
      const earthGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, earthRadius);
      earthGradient.addColorStop(0, `${colors.accent}60`);
      earthGradient.addColorStop(0.7, `${colors.secondary}40`);
      earthGradient.addColorStop(1, `${colors.primary}20`);

      ctx.globalAlpha = 0.6;
      ctx.fillStyle = earthGradient;
      ctx.beginPath();
      ctx.arc(0, 0, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Earth outline
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.stroke();

      // Draw latitude/longitude lines
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, (earthRadius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * earthRadius, Math.sin(angle) * earthRadius);
        ctx.stroke();
      }

      // Draw ground stations
      stationsRef.current.forEach((station) => {
        if (!prefersReducedMotion) {
          station.pulse += 0.05;
          if (Math.random() < 0.005) {
            station.active = !station.active;
          }
        }

        const pulseValue = Math.sin(station.pulse) * 0.3 + 0.7;

        if (station.active) {
          // Signal coverage area
          ctx.globalAlpha = 0.1 * pulseValue;
          ctx.fillStyle = colors.signal;
          ctx.beginPath();
          ctx.arc(station.x, station.y, 40, 0, Math.PI * 2);
          ctx.fill();
        }

        // Station marker
        ctx.globalAlpha = station.active ? pulseValue * 0.9 : 0.4;
        ctx.fillStyle = station.active ? colors.signal : colors.secondary;
        ctx.shadowColor = station.active ? colors.signal : 'transparent';
        ctx.shadowBlur = station.active ? 15 : 0;

        ctx.beginPath();
        ctx.arc(station.x, station.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Station antenna
        ctx.strokeStyle = station.active ? colors.signal : colors.secondary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(station.x, station.y);
        ctx.lineTo(station.x, station.y - 12);
        ctx.stroke();

        ctx.shadowBlur = 0;
      });

      // Draw orbital paths
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.2;
      ctx.setLineDash([5, 5]);

      satellitesRef.current.forEach((sat) => {
        ctx.beginPath();
        ctx.arc(0, 0, sat.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.setLineDash([]);

      // Update and draw satellites
      satellitesRef.current.forEach((sat, index) => {
        if (!prefersReducedMotion) {
          sat.angle += sat.speed;
          if (sat.angle > Math.PI * 2) sat.angle -= Math.PI * 2;

          if (Math.random() < 0.002) {
            sat.active = !sat.active;
          }
        }

        const satX = Math.cos(sat.angle) * sat.orbitRadius;
        const satY = Math.sin(sat.angle) * sat.orbitRadius;

        // Draw signal beams to active ground stations
        if (sat.active) {
          stationsRef.current.forEach((station) => {
            if (station.active) {
              const distance = Math.hypot(satX - station.x, satY - station.y);
              if (distance < 200) {
                ctx.globalAlpha = 0.2 * sat.signalStrength;
                ctx.strokeStyle = colors.signal;
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);

                ctx.beginPath();
                ctx.moveTo(satX, satY);
                ctx.lineTo(station.x, station.y);
                ctx.stroke();

                ctx.setLineDash([]);
              }
            }
          });
        }

        // Draw satellite
        ctx.globalAlpha = sat.active ? 0.9 : 0.4;
        ctx.fillStyle = sat.active ? colors.glow : colors.secondary;
        ctx.shadowColor = sat.active ? colors.glow : 'transparent';
        ctx.shadowBlur = sat.active ? 20 : 0;

        // Satellite body
        ctx.save();
        ctx.translate(satX, satY);
        ctx.rotate(sat.angle + Math.PI / 2);

        ctx.fillRect(-4, -6, 8, 12);

        // Solar panels
        ctx.fillStyle = sat.active ? colors.accent : colors.secondary;
        ctx.fillRect(-12, -3, 6, 6);
        ctx.fillRect(6, -3, 6, 6);

        ctx.restore();

        ctx.shadowBlur = 0;

        // Satellite ID
        if (sat.active) {
          ctx.globalAlpha = 0.7;
          ctx.fillStyle = colors.primary;
          ctx.font = '9px "Share Tech Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`SAT-${index + 1}`, satX, satY - 15);
        }
      });

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

      const activeSats = satellitesRef.current.filter((s) => s.active).length;
      const activeStations = stationsRef.current.filter((s) => s.active).length;

      ctx.fillText('ORBITAL TRACKING', offset + bracketSize + 10, offset + 15);
      ctx.fillText(`SATELLITES: ${activeSats}/${satCount}`, offset + bracketSize + 10, offset + 28);

      ctx.textAlign = 'right';
      ctx.fillText(
        `STATIONS: ${activeStations}/${stationCount}`,
        width - offset - bracketSize - 10,
        offset + 15
      );
      ctx.fillText(
        `COVERAGE: ${Math.floor((activeSats / satCount) * 100)}%`,
        width - offset - bracketSize - 10,
        offset + 28
      );

      // Draw altitude
      ctx.textAlign = 'left';
      ctx.fillText('ALT: 400km', offset + bracketSize + 10, height - offset - 15);

      // Draw time
      ctx.textAlign = 'right';
      ctx.fillText(
        `TIME: ${Math.floor(time)}s`,
        width - offset - bracketSize - 10,
        height - offset - 15
      );

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
      aria-label="Satellite tracking display"
    />
  );
};

ColdWarSatellite.displayName = 'ColdWarSatellite';
