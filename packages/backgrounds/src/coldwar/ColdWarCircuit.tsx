/**
 * ColdWarCircuit Component - Professional Military Circuit Board
 * Advanced electronic circuit with data flow, connection nodes, and signal paths
 * Inspired by Call of Duty: Black Ops Cold War technical schematics
 */

import React, { useEffect, useRef } from 'react';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

interface ColdWarCircuitProps {
  width: number;
  height: number;
  theme?: ColdWarTheme;
  intensity?: ColdWarIntensity;
  className?: string;
  style?: React.CSSProperties;
}

interface CircuitNode {
  x: number;
  y: number;
  type: 'chip' | 'resistor' | 'capacitor' | 'junction';
  connections: number[];
  active: boolean;
  pulse: number;
}

interface DataPacket {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

const THEME_COLORS: Record<
  ColdWarTheme,
  { primary: string; secondary: string; accent: string; glow: string; data: string }
> = {
  perseus: {
    primary: '#FFB000',
    secondary: '#D4A574',
    accent: '#FF8800',
    glow: '#FFD700',
    data: '#FFCC00',
  },
  greenTerminal: {
    primary: '#00FF41',
    secondary: '#00CC33',
    accent: '#00DD44',
    glow: '#00FF88',
    data: '#00FFAA',
  },
  satelliteView: {
    primary: '#00D9FF',
    secondary: '#0099CC',
    accent: '#00AAFF',
    glow: '#00FFFF',
    data: '#00EEFF',
  },
};

const INTENSITY_VALUES: Record<
  ColdWarIntensity,
  { nodes: number; packets: number; complexity: number }
> = {
  low: { nodes: 15, packets: 3, complexity: 0.3 },
  medium: { nodes: 25, packets: 6, complexity: 0.5 },
  high: { nodes: 40, packets: 10, complexity: 0.7 },
};

export const ColdWarCircuit: React.FC<ColdWarCircuitProps> = ({
  width,
  height,
  theme = 'perseus',
  intensity = 'medium',
  className,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<CircuitNode[]>([]);
  const packetsRef = useRef<DataPacket[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = THEME_COLORS[theme];
    const { nodes: nodeCount, packets: packetCount, complexity } = INTENSITY_VALUES[intensity];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const margin = 60;

    // Initialize circuit nodes
    if (nodesRef.current.length === 0) {
      const types: Array<'chip' | 'resistor' | 'capacitor' | 'junction'> = [
        'chip',
        'resistor',
        'capacitor',
        'junction',
      ];

      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: margin + Math.random() * (width - margin * 2),
          y: margin + Math.random() * (height - margin * 2),
          type: types[Math.floor(Math.random() * types.length)],
          connections: [],
          active: Math.random() < 0.5,
          pulse: Math.random() * Math.PI * 2,
        });
      }

      // Create connections between nearby nodes
      nodesRef.current.forEach((node, i) => {
        const maxConnections = Math.floor(2 + complexity * 3);
        const nearbyNodes = nodesRef.current
          .map((n, idx) => ({
            node: n,
            index: idx,
            distance: Math.hypot(n.x - node.x, n.y - node.y),
          }))
          .filter((n) => n.index !== i && n.distance < 200)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, maxConnections);

        node.connections = nearbyNodes.map((n) => n.index);
      });
    }

    // Initialize data packets
    if (packetsRef.current.length === 0) {
      for (let i = 0; i < packetCount; i++) {
        const fromNode = Math.floor(Math.random() * nodeCount);
        const node = nodesRef.current[fromNode];
        if (node.connections.length > 0) {
          packetsRef.current.push({
            fromNode,
            toNode: node.connections[Math.floor(Math.random() * node.connections.length)],
            progress: Math.random(),
            speed: 0.005 + Math.random() * 0.01,
          });
        }
      }
    }

    const drawNode = (node: CircuitNode, pulseValue: number) => {
      const size = node.type === 'chip' ? 12 : node.type === 'junction' ? 4 : 8;

      ctx.save();
      ctx.translate(node.x, node.y);

      switch (node.type) {
        case 'chip':
          // Draw IC chip
          ctx.fillStyle = node.active ? colors.primary : colors.secondary;
          ctx.globalAlpha = node.active ? 0.8 : 0.4;
          ctx.fillRect(-size, -size, size * 2, size * 2);

          ctx.strokeStyle = colors.glow;
          ctx.lineWidth = 1;
          ctx.strokeRect(-size, -size, size * 2, size * 2);

          // Chip pins
          ctx.fillStyle = colors.accent;
          for (let i = 0; i < 4; i++) {
            ctx.fillRect(-size - 2, -size + i * 6, 2, 2);
            ctx.fillRect(size, -size + i * 6, 2, 2);
          }
          break;

        case 'resistor':
          // Draw resistor
          ctx.strokeStyle = node.active ? colors.primary : colors.secondary;
          ctx.lineWidth = 3;
          ctx.globalAlpha = node.active ? 0.8 : 0.4;

          ctx.beginPath();
          ctx.moveTo(-size, 0);
          for (let i = 0; i < 4; i++) {
            ctx.lineTo(-size + i * (size / 2), i % 2 === 0 ? -4 : 4);
          }
          ctx.lineTo(size, 0);
          ctx.stroke();
          break;

        case 'capacitor':
          // Draw capacitor
          ctx.strokeStyle = node.active ? colors.primary : colors.secondary;
          ctx.lineWidth = 2;
          ctx.globalAlpha = node.active ? 0.8 : 0.4;

          ctx.beginPath();
          ctx.moveTo(-2, -size);
          ctx.lineTo(-2, size);
          ctx.moveTo(2, -size);
          ctx.lineTo(2, size);
          ctx.stroke();
          break;

        case 'junction':
          // Draw junction point
          ctx.fillStyle = node.active ? colors.glow : colors.secondary;
          ctx.globalAlpha = node.active ? pulseValue : 0.4;
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = node.active ? 10 : 0;

          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          break;
      }

      ctx.restore();
    };

    const render = () => {
      // Clear with circuit board background
      ctx.fillStyle = 'rgba(0, 10, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      const time = prefersReducedMotion ? 0 : timeRef.current;

      ctx.save();

      // Draw circuit traces (connections)
      ctx.strokeStyle = colors.secondary;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.4;

      nodesRef.current.forEach((node, i) => {
        node.connections.forEach((targetIdx) => {
          const target = nodesRef.current[targetIdx];

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);

          // Draw orthogonal paths (like PCB traces)
          const midX = (node.x + target.x) / 2;
          ctx.lineTo(midX, node.y);
          ctx.lineTo(midX, target.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Update and draw data packets
      if (!prefersReducedMotion) {
        packetsRef.current.forEach((packet, i) => {
          packet.progress += packet.speed;

          if (packet.progress >= 1) {
            // Packet reached destination, create new packet
            const fromNode = packet.toNode;
            const node = nodesRef.current[fromNode];
            if (node.connections.length > 0) {
              packet.fromNode = fromNode;
              packet.toNode = node.connections[Math.floor(Math.random() * node.connections.length)];
              packet.progress = 0;

              // Activate nodes
              nodesRef.current[fromNode].active = true;
              nodesRef.current[packet.toNode].active = true;
            }
          }

          // Draw packet
          const from = nodesRef.current[packet.fromNode];
          const to = nodesRef.current[packet.toNode];
          const midX = (from.x + to.x) / 2;

          let x, y;
          if (packet.progress < 0.5) {
            const t = packet.progress * 2;
            x = from.x + (midX - from.x) * t;
            y = from.y;
          } else {
            const t = (packet.progress - 0.5) * 2;
            x = midX + (to.x - midX) * t;
            y = from.y + (to.y - from.y) * t;
          }

          ctx.fillStyle = colors.data;
          ctx.globalAlpha = 0.9;
          ctx.shadowColor = colors.data;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw packet trail
          ctx.strokeStyle = colors.data;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 10, y);
          ctx.stroke();
        });
      }

      // Update and draw nodes
      nodesRef.current.forEach((node, i) => {
        if (!prefersReducedMotion) {
          node.pulse += 0.05;

          // Randomly deactivate nodes
          if (node.active && Math.random() < 0.01) {
            node.active = false;
          }
        }

        const pulseValue = Math.sin(node.pulse) * 0.3 + 0.7;
        drawNode(node, pulseValue);
      });

      // Draw tactical HUD frame
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;

      // Corner brackets
      const bracketSize = 35;
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
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = colors.primary;
      ctx.font = '10px "Share Tech Mono", monospace';
      ctx.textAlign = 'left';

      const activeNodes = nodesRef.current.filter((n) => n.active).length;
      const dataFlow = packetsRef.current.length;

      ctx.fillText('CIRCUIT ANALYSIS', offset + bracketSize + 10, offset + 15);
      ctx.fillText(`NODES: ${activeNodes}/${nodeCount}`, offset + bracketSize + 10, offset + 28);

      ctx.textAlign = 'right';
      ctx.fillText(`DATA FLOW: ${dataFlow}`, width - offset - bracketSize - 10, offset + 15);
      ctx.fillText(`STATUS: ACTIVE`, width - offset - bracketSize - 10, offset + 28);

      // Draw system status indicator
      if (!prefersReducedMotion) {
        const statusPulse = Math.sin(time * 3) * 0.3 + 0.7;
        ctx.globalAlpha = statusPulse;
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
      aria-label="Circuit board display"
    />
  );
};

ColdWarCircuit.displayName = 'ColdWarCircuit';
