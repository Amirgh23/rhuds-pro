/**
 * Cold War Binary Loader
 * Falling binary digits (0s and 1s) - Matrix-style animation
 */

import React, { CSSProperties, useEffect, useState, useMemo } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS, getComponentChamferClip } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarBinaryLoaderProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  size?: 'sm' | 'md' | 'lg';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  showCorners?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  density?: 'low' | 'medium' | 'high';
  className?: string;
  style?: CSSProperties;
}

interface BinaryColumn {
  id: number;
  left: number;
  delay: number;
  duration: number;
  digits: string;
}

export const ColdWarBinaryLoader: React.FC<ColdWarBinaryLoaderProps> = ({
  theme = 'perseus',
  size = 'md',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showCorners = true,
  speed = 'normal',
  density = 'medium',
  className = '',
  style = {},
}) => {
  const [columns, setColumns] = useState<BinaryColumn[]>([]);

  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { width: 200, height: 150, fontSize: '12px' },
    md: { width: 300, height: 200, fontSize: '14px' },
    lg: { width: 400, height: 250, fontSize: '16px' },
  };
  const sizes = sizeMap[size];

  const densityMap = {
    low: 8,
    medium: 12,
    high: 16,
  };
  const columnCount = densityMap[density];

  const speedMap = {
    slow: { min: 3, max: 5 },
    normal: { min: 2, max: 4 },
    fast: { min: 1, max: 3 },
  };
  const speedRange = useMemo(() => speedMap[speed], [speed]);

  useEffect(() => {
    const newColumns: BinaryColumn[] = [];
    for (let i = 0; i < columnCount; i++) {
      const digitCount = Math.floor(Math.random() * 10) + 15;
      const digits = Array.from({ length: digitCount }, () =>
        Math.random() > 0.5 ? '1' : '0'
      ).join('');

      newColumns.push({
        id: i,
        left: (i / columnCount) * 100,
        delay: Math.random() * 2,
        duration: speedRange.min + Math.random() * (speedRange.max - speedRange.min),
        digits,
      });
    }
    setColumns(newColumns);
  }, [columnCount, speedRange]);

  const containerStyles: CSSProperties = {
    position: 'relative',
    width: `${sizes.width}px`,
    height: `${sizes.height}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10, 10, 20, 0.95)',
    border: `1px solid ${themeColors.primary}`,
    clipPath: getComponentChamferClip('card'),
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    overflow: 'hidden',
    ...style,
  };

  const columnStyles = (column: BinaryColumn): CSSProperties => ({
    position: 'absolute',
    left: `${column.left}%`,
    top: '-100%',
    fontSize: sizes.fontSize,
    color: themeColors.primary,
    opacity: 0.8,
    textShadow: glow ? `0 0 8px rgba(${rgb}, 0.8)` : 'none',
    animation: `fall ${column.duration}s linear ${column.delay}s infinite`,
    whiteSpace: 'pre',
    lineHeight: '1.2',
  });

  const cornerStyles: CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    border: `1px solid ${themeColors.primary}`,
  };

  const techCodeStyles: CSSProperties = {
    position: 'absolute',
    bottom: '8px',
    right: '12px',
    fontSize: '10px',
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
    zIndex: 10,
  };

  return (
    <div
      className={className}
      style={containerStyles}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      {showCorners && (
        <>
          <div
            style={{ ...cornerStyles, top: 0, left: 0, borderRight: 'none', borderBottom: 'none' }}
          />
          <div
            style={{ ...cornerStyles, top: 0, right: 0, borderLeft: 'none', borderBottom: 'none' }}
          />
          <div
            style={{ ...cornerStyles, bottom: 0, left: 0, borderRight: 'none', borderTop: 'none' }}
          />
          <div
            style={{ ...cornerStyles, bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none' }}
          />
        </>
      )}

      {columns.map((column) => (
        <div key={column.id} style={columnStyles(column)}>
          {column.digits.split('').map((digit, idx) => (
            <div key={idx}>{digit}</div>
          ))}
        </div>
      ))}

      {showTechCode && <div style={techCodeStyles}>{generateTechCode('BIN')}</div>}

      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      <style>{`
        @keyframes fall {
          from { top: -100%; }
          to { top: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ColdWarBinaryLoader;
