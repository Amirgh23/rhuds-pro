/**
 * ColdWarTacticalMap Component - Professional Tactical Map Display
 * Advanced military map with waypoints, zones, movement paths, and strategic markers
 * Inspired by Call of Duty: Black Ops Cold War mission briefing maps
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarTacticalMapProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

interface Waypoint {
  x: number;
  y: number;
  type: 'objective' | 'enemy' | 'friendly' | 'intel';
  label: string;
  pulse: number;
  active: boolean;
}

interface MovementPath {
  points: { x: number; y: number }[];
  progress: number;
  speed: number;
}

interface TacticalZone {
  x: number;
  y: number;
  radius: number;
  type: 'danger' | 'secure' | 'contested';
  pulse: number;
}

const THEME_COLORS: Record<
  ColdWarTheme,
  {
    primary: string;
    secondary: string;
    objective: string;
    enemy: string;
    friendly: string;
    intel: string;
    danger: string;
    secure: string;
    contested: string;
    glow: string;
  }
> = {
  perseus: {
    primary: '#FFB000',
    secondary: '#D4A574',
    objective: '#FFD700',
    enemy: '#FF3333',
    friendly: '#00FF88',
    intel: '#00AAFF',
    danger: '#FF3333',
    secure: '#00FF88',
    contested: '#FF8800',
    glow: '#FFD700',
  },
  greenTerminal: {
    primary: '#00FF41',
    secondary: '#00CC33',
    objective: '#00FF88',
    enemy: '#FF0000',
    friendly: '#00FFAA',
    intel: '#00FFFF',
    danger: '#FF0000',
    secure: '#00FF00',
    contested: '#FFAA00',
    glow: '#00FF88',
  },
  satelliteView: {
    primary: '#00D9FF',
    secondary: '#0099CC',
    objective: '#00FFFF',
    enemy: '#FF6600',
    friendly: '#00FF00',
    intel: '#00AAFF',
    danger: '#FF6600',
    secure: '#00FF00',
    contested: '#FFCC00',
    glow: '#00FFFF',
  },
};

const INTENSITY_VALUES: Record<
  ColdWarIntensity,
  { waypoints: number; zones: number; paths: number }
> = {
  low: { waypoints: 4, zones: 2, paths: 1 },
  medium: { waypoints: 7, zones: 3, paths: 2 },
  high: { waypoints: 12, zones: 5, paths: 3 },
};

export const ColdWarTacticalMap: React.FC<ColdWarTacticalMapProps> = ({
  width,
  height,
  theme = 'perseus',
  intensity = 'medium',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const waypointsRef = useRef<Waypoint[]>([]);
  const zonesRef = useRef<TacticalZone[]>([]);
  const pathsRef = useRef<MovementPath[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const {
      waypoints: waypointCount,
      zones: zoneCount,
      paths: pathCount,
    } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const margin = 60;

    // Initialize waypoints
    if (waypointsRef.current.length === 0) {
      const types: Array<'objective' | 'enemy' | 'friendly' | 'intel'> = [
        'objective',
        'enemy',
        'friendly',
        'intel',
      ];
      const labels = [
        'ALPHA',
        'BRAVO',
        'CHARLIE',
        'DELTA',
        'ECHO',
        'FOXTROT',
        'GOLF',
        'HOTEL',
        'INDIA',
        'JULIET',
        'KILO',
        'LIMA',
      ];

      for (let i = 0; i < waypointCount; i++) {
        waypointsRef.current.push({
          x: margin + Math.random() * (width - margin * 2),
          y: margin + Math.random() * (height - margin * 2),
          type: types[Math.floor(Math.random() * types.length)],
          label: labels[i % labels.length],
          pulse: Math.random() * Math.PI * 2,
          active: Math.random() > 0.3,
        });
      }
    }

    // Initialize zones
    if (zonesRef.current.length === 0) {
      const zoneTypes: Array<'danger' | 'secure' | 'contested'> = ['danger', 'secure', 'contested'];

      for (let i = 0; i < zoneCount; i++) {
        zonesRef.current.push({
          x: margin + Math.random() * (width - margin * 2),
          y: margin + Math.random() * (height - margin * 2),
          radius: 40 + Math.random() * 60,
          type: zoneTypes[Math.floor(Math.random() * zoneTypes.length)],
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    // Initialize movement paths
    if (pathsRef.current.length === 0) {
      for (let i = 0; i < pathCount; i++) {
        const pointCount = 3 + Math.floor(Math.random() * 3);
        const points: { x: number; y: number }[] = [];

        for (let j = 0; j < pointCount; j++) {
          points.push({
            x: margin + Math.random() * (width - margin * 2),
            y: margin + Math.random() * (height - margin * 2),
          });
        }

        pathsRef.current.push({
          points,
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.003,
        });
      }
    }

    const render = () => {
      // Clear with map background
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, 'rgba(0, 10, 5, 0.1)');
      bgGradient.addColorStop(1, 'rgba(0, 5, 10, 0.1)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const time = prefersReducedMotion ? 0 : timeRef.current;

      ctx.save();

      // Draw grid
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.15;

      const gridSize = 40;
      for (let x = margin; x < width - margin; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, height - margin);
        ctx.stroke();
      }

      for (let y = margin; y < height - margin; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
      }

      // Draw grid coordinates
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = colors.secondary;
      ctx.font = '9px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';

      for (let i = 0; i < Math.floor((width - margin * 2) / gridSize); i++) {
        ctx.fillText(
          String.fromCharCode(65 + i),
          margin + i * gridSize + gridSize / 2,
          margin - 10
        );
      }

      ctx.textAlign = 'right';
      for (let i = 0; i < Math.floor((height - margin * 2) / gridSize); i++) {
        ctx.fillText(`${i + 1}`, margin - 10, margin + i * gridSize + gridSize / 2 + 3);
      }

      // Draw tactical zones
      zonesRef.current.forEach((zone) => {
        if (!prefersReducedMotion) {
          zone.pulse += 0.03;
        }

        const pulseValue = Math.sin(zone.pulse) * 0.2 + 0.8;

        let zoneColor = colors.primary;
        if (zone.type === 'danger') zoneColor = colors.danger;
        else if (zone.type === 'secure') zoneColor = colors.secure;
        else if (zone.type === 'contested') zoneColor = colors.contested;

        // Zone fill
        ctx.globalAlpha = 0.1 * pulseValue;
        ctx.fillStyle = zoneColor;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.fill();

        // Zone border
        ctx.globalAlpha = 0.4 * pulseValue;
        ctx.strokeStyle = zoneColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw movement paths
      pathsRef.current.forEach((path) => {
        if (!prefersReducedMotion) {
          path.progress += path.speed;
          if (path.progress > 1) path.progress = 0;
        }

        // Draw path line
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        ctx.setLineDash([10, 5]);

        ctx.beginPath();
        path.points.forEach((point, i) => {
          if (i === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();

        ctx.setLineDash([]);

        // Draw movement indicator
        const totalSegments = path.points.length - 1;
        const currentSegment = Math.floor(path.progress * totalSegments);
        const segmentProgress = (path.progress * totalSegments) % 1;

        if (currentSegment < totalSegments) {
          const start = path.points[currentSegment];
          const end = path.points[currentSegment + 1];

          const x = start.x + (end.x - start.x) * segmentProgress;
          const y = start.y + (end.y - start.y) * segmentProgress;

          ctx.globalAlpha = 0.9;
          ctx.fillStyle = colors.glow;
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = 15;

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
        }
      });

      // Draw waypoints
      waypointsRef.current.forEach((waypoint) => {
        if (!prefersReducedMotion) {
          waypoint.pulse += 0.05;
          if (Math.random() < 0.002) {
            waypoint.active = !waypoint.active;
          }
        }

        const pulseValue = Math.sin(waypoint.pulse) * 0.3 + 0.7;

        let waypointColor = colors.primary;
        if (waypoint.type === 'objective') waypointColor = colors.objective;
        else if (waypoint.type === 'enemy') waypointColor = colors.enemy;
        else if (waypoint.type === 'friendly') waypointColor = colors.friendly;
        else if (waypoint.type === 'intel') waypointColor = colors.intel;

        // Waypoint marker
        ctx.save();
        ctx.translate(waypoint.x, waypoint.y);

        ctx.globalAlpha = waypoint.active ? pulseValue * 0.9 : 0.4;
        ctx.strokeStyle = waypointColor;
        ctx.fillStyle = waypointColor;
        ctx.lineWidth = 2;

        if (waypoint.active) {
          ctx.shadowColor = waypointColor;
          ctx.shadowBlur = 15;
        }

        // Draw marker based on type
        if (waypoint.type === 'objective') {
          // Star
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const radius = i % 2 === 0 ? 10 : 5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (waypoint.type === 'enemy') {
          // X mark
          ctx.beginPath();
          ctx.moveTo(-8, -8);
          ctx.lineTo(8, 8);
          ctx.moveTo(8, -8);
          ctx.lineTo(-8, 8);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, Math.PI * 2);
          ctx.stroke();
        } else if (waypoint.type === 'friendly') {
          // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(-8, 8);
          ctx.lineTo(8, 8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (waypoint.type === 'intel') {
          // Diamond
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(8, 0);
          ctx.lineTo(0, 10);
          ctx.lineTo(-8, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        ctx.shadowBlur = 0;

        // Label
        if (waypoint.active) {
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = waypointColor;
          ctx.font = '10px "Share Tech Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(waypoint.label, 0, 22);
        }

        ctx.restore();
      });

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

      const activeWaypoints = waypointsRef.current.filter((w) => w.active).length;

      ctx.fillText('TACTICAL MAP', offset + bracketSize + 10, offset + 15);
      ctx.fillText(
        `WAYPOINTS: ${activeWaypoints}/${waypointCount}`,
        offset + bracketSize + 10,
        offset + 28
      );

      ctx.textAlign = 'right';
      ctx.fillText(`ZONES: ${zoneCount}`, width - offset - bracketSize - 10, offset + 15);
      ctx.fillText(`SCALE: 1:5000`, width - offset - bracketSize - 10, offset + 28);

      // Draw coordinates
      ctx.textAlign = 'left';
      ctx.fillText('GRID: A1-L12', offset + bracketSize + 10, height - offset - 15);

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
      aria-label="Tactical map display"
    />
  );
};

ColdWarTacticalMap.displayName = 'ColdWarTacticalMap';
