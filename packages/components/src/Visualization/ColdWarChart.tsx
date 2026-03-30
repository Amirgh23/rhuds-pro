/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR CHART - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode, getMilitaryTimestamp } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarChartDataPoint {
  label: string;
  value: number;
}

export interface ColdWarChartProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  type?: 'line' | 'bar' | 'area';
  data: ColdWarChartDataPoint[];
  title?: string;
  width?: number;
  height?: number;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showCorners?: boolean;
  showGrid?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarChart: React.FC<ColdWarChartProps> = ({
  theme = 'perseus',
  type = 'line',
  data,
  title,
  width = 600,
  height = 300,
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showCorners = true,
  showGrid = true,
  className = '',
  style = {},
}) => {
  const [techCode] = useState(() => generateTechCode('CHT'));
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const maxValue = Math.max(...data.map((d) => d.value));
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const getPointX = (index: number) => {
    return padding + (index / (data.length - 1)) * chartWidth;
  };

  const getPointY = (value: number) => {
    return height - padding - (value / maxValue) * chartHeight;
  };

  const containerStyles: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    background: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(${rgb}, 0.02) 2px,
        rgba(${rgb}, 0.02) 4px
      ),
      linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100())
    `,
    border: `1px solid rgba(${rgb}, 0.3)`,
    boxShadow: `
      inset 0 0 30px rgba(0, 0, 0, 0.6),
      inset 0 0 10px rgba(${rgb}, 0.1),
      0 4px 12px rgba(0, 0, 0, 0.4)
    `,
    overflow: 'hidden',
    ...style,
  };

  const headerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderBottom: `1px solid rgba(${rgb}, 0.3)`,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    background: `rgba(${rgb}, 0.1)`,
  };

  // Generate path for line/area chart
  const generatePath = (): string => {
    const points = data.map((d, i) => `${getPointX(i)},${getPointY(d.value)}`).join(' L ');
    return `M ${points}`;
  };

  // Generate area path
  const generateAreaPath = (): string => {
    const points = data.map((d, i) => `${getPointX(i)},${getPointY(d.value)}`).join(' L ');
    return `M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`;
  };

  return (
    <div className={className} style={containerStyles}>
      {/* Header */}
      {title && (
        <div style={headerStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: themeColors.primary,
                boxShadow: `0 0 6px ${themeColors.primary}`,
                animation: 'led-pulse 1s ease-in-out infinite',
              }}
            />
            <span>{title}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '9px',
              opacity: 0.6,
            }}
          >
            <span>{techCode}</span>
            <span>{getMilitaryTimestamp()}</span>
          </div>
        </div>
      )}

      {/* Chart SVG */}
      <svg width={width} height={height} style={{ position: 'relative', zIndex: 2 }}>
        {/* Grid */}
        {showGrid && (
          <g opacity="0.2">
            {Array.from({ length: 5 }).map((_, i) => {
              const y = padding + (i / 4) * chartHeight;
              return (
                <line
                  key={`h-${i}`}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke={themeColors.primary}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              );
            })}
            {data.map((_, i) => {
              const x = getPointX(i);
              return (
                <line
                  key={`v-${i}`}
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={height - padding}
                  stroke={themeColors.primary}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              );
            })}
          </g>
        )}

        {/* Chart Type Rendering */}
        {type === 'area' && (
          <path d={generateAreaPath()} fill={`rgba(${rgb}, 0.2)`} stroke="none" />
        )}

        {type === 'bar' &&
          data.map((d, i) => {
            const x = getPointX(i);
            const y = getPointY(d.value);
            const barWidth = (chartWidth / data.length) * 0.6;
            return (
              <rect
                key={i}
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={height - padding - y}
                fill={`rgba(${rgb}, 0.6)`}
                stroke={themeColors.primary}
                strokeWidth="1"
              />
            );
          })}

        {(type === 'line' || type === 'area') && (
          <>
            <path d={generatePath()} fill="none" stroke={themeColors.primary} strokeWidth="2" />
            {data.map((d, i) => (
              <circle
                key={i}
                cx={getPointX(i)}
                cy={getPointY(d.value)}
                r="4"
                fill={themeColors.primary}
                stroke={themeColors.background}
                strokeWidth="2"
              >
                <animate
                  attributeName="r"
                  values="4;6;4"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${i * 0.2}s`}
                />
              </circle>
            ))}
          </>
        )}

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke={themeColors.primary}
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke={themeColors.primary}
          strokeWidth="2"
        />

        {/* Labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={getPointX(i)}
            y={height - padding + 20}
            fill={themeColors.primary}
            fontSize="10"
            fontFamily="'Share Tech Mono', 'Roboto Mono', monospace"
            textAnchor="middle"
          >
            {d.label}
          </text>
        ))}
      </svg>

      {/* Corner Brackets */}
      {showCorners && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              width: '12px',
              height: '12px',
              borderTop: `2px solid ${themeColors.primary}`,
              borderLeft: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderTop: `2px solid ${themeColors.primary}`,
              borderRight: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '4px',
              width: '12px',
              height: '12px',
              borderBottom: `2px solid ${themeColors.primary}`,
              borderLeft: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderBottom: `2px solid ${themeColors.primary}`,
              borderRight: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
        </>
      )}

      {/* Scanlines */}
      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}

      {/* Glow */}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      {/* Animations */}
      <style>
        {`
          @keyframes led-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ColdWarChart;
