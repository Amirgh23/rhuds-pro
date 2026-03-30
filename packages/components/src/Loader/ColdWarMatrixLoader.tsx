/**
 * Cold War Matrix Loader
 * Full Matrix-style digital rain with multiple columns
 */

import React, { CSSProperties, useEffect, useState } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS, getComponentChamferClip } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarMatrixLoaderProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  size?: 'sm' | 'md' | 'lg';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  showCorners?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface MatrixColumn {
  id: number;
  left: number;
  delay: number;
  duration: number;
  characters: string[];
}

const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';

export const ColdWarMatrixLoader: React.FC<ColdWarMatrixLoaderProps> = ({
  theme = 'perseus',
  size = 'md',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showCorners = true,
  className = '',
  style = {},
}) => {
  const [columns, setColumns] = useState<MatrixColumn[]>([]);

  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { width: 250, height: 180, fontSize: '12px', columns: 12 },
    md: { width: 350, height: 240, fontSize: '14px', columns: 16 },
    lg: { width: 450, height: 300, fontSize: '16px', columns: 20 },
  };
  const sizes = sizeMap[size];

  useEffect(() => {
    const newColumns: MatrixColumn[] = [];

    for (let i = 0; i < sizes.columns; i++) {
      const charCount = Math.floor(Math.random() * 12) + 18;
      const characters = Array.from(
        { length: charCount },
        () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      );

      newColumns.push({
        id: i,
        left: (i / sizes.columns) * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
        characters,
      });
    }
    setColumns(newColumns);
  }, [sizes.columns]);

  const containerStyles: CSSProperties = {
    position: 'relative',
    width: `${sizes.width}px`,
    height: `${sizes.height}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10, 10, 20, 0.95)',
    border: `1px solid ${themeColors.primary}`,
    clipPath: getComponentChamferClip(8),
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    overflow: 'hidden',
    ...style,
  };

  const columnStyles = (column: MatrixColumn): CSSProperties => ({
    position: 'absolute',
    left: `${column.left}%`,
    top: '-100%',
    fontSize: sizes.fontSize,
    color: themeColors.primary,
    animation: `fall ${column.duration}s linear ${column.delay}s infinite`,
    whiteSpace: 'pre',
    lineHeight: '1.3',
    textShadow: glow ? `0 0 8px rgba(${rgb}, 0.8)` : 'none',
  });

  const charStyles = (index: number, total: number): CSSProperties => ({
    opacity: 1 - (index / total) * 0.7,
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
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '10px',
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
    zIndex: 10,
    backgroundColor: 'rgba(10, 10, 20, 0.8)',
    padding: '2px 8px',
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
          {column.characters.map((char, idx) => (
            <div key={idx} style={charStyles(idx, column.characters.length)}>
              {char}
            </div>
          ))}
        </div>
      ))}

      {showTechCode && <div style={techCodeStyles}>{generateTechCode('MTX')}</div>}

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

export default ColdWarMatrixLoader;
