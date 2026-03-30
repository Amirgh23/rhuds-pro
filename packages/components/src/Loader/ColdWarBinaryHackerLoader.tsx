/**
 * Cold War Binary Hacker Loader
 * Combination of binary rain and hacker text - dual-layer animation
 */

import React, { CSSProperties, useState, useEffect } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS, getComponentChamferClip } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarBinaryHackerLoaderProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  size?: 'sm' | 'md' | 'lg';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  showCorners?: boolean;
  messages?: string[];
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

const DEFAULT_MESSAGES = ['DECRYPTING...', 'ANALYZING...', 'PROCESSING...', 'COMPLETE'];

export const ColdWarBinaryHackerLoader: React.FC<ColdWarBinaryHackerLoaderProps> = ({
  theme = 'perseus',
  size = 'md',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showCorners = true,
  messages = DEFAULT_MESSAGES,
  className = '',
  style = {},
}) => {
  const [columns, setColumns] = useState<BinaryColumn[]>([]);
  const [displayText, setDisplayText] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { width: 300, height: 150, fontSize: '12px', textSize: '14px' },
    md: { width: 400, height: 200, fontSize: '14px', textSize: '16px' },
    lg: { width: 500, height: 250, fontSize: '16px', textSize: '18px' },
  };
  const sizes = sizeMap[size];

  useEffect(() => {
    const columnCount = 10;
    const newColumns: BinaryColumn[] = [];

    for (let i = 0; i < columnCount; i++) {
      const digitCount = Math.floor(Math.random() * 8) + 12;
      const digits = Array.from({ length: digitCount }, () =>
        Math.random() > 0.5 ? '1' : '0'
      ).join('');

      newColumns.push({
        id: i,
        left: (i / columnCount) * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        digits,
      });
    }
    setColumns(newColumns);
  }, []);

  useEffect(() => {
    const currentMessage = messages[currentMessageIndex];

    if (currentCharIndex < currentMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentMessage.substring(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      }, 60);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentMessageIndex((currentMessageIndex + 1) % messages.length);
        setCurrentCharIndex(0);
        setDisplayText('');
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, currentMessageIndex, messages]);

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

  const binaryLayerStyles: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  };

  const columnStyles = (column: BinaryColumn): CSSProperties => ({
    position: 'absolute',
    left: `${column.left}%`,
    top: '-100%',
    fontSize: sizes.fontSize,
    color: themeColors.primary,
    animation: `fall ${column.duration}s linear ${column.delay}s infinite`,
    whiteSpace: 'pre',
    lineHeight: '1.2',
  });

  const textContainerStyles: CSSProperties = {
    position: 'relative',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    fontSize: sizes.textSize,
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
    textShadow: glow ? `0 0 15px rgba(${rgb}, 0.9)` : 'none',
  };

  const cursorStyles: CSSProperties = {
    display: 'inline-block',
    width: '10px',
    height: sizes.textSize,
    backgroundColor: themeColors.primary,
    marginLeft: '4px',
    animation: 'blink 1s step-end infinite',
  };

  const cornerStyles: CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    border: `1px solid ${themeColors.primary}`,
    zIndex: 10,
  };

  const techCodeStyles: CSSProperties = {
    position: 'absolute',
    top: '8px',
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

      <div style={binaryLayerStyles}>
        {columns.map((column) => (
          <div key={column.id} style={columnStyles(column)}>
            {column.digits.split('').map((digit, idx) => (
              <div key={idx}>{digit}</div>
            ))}
          </div>
        ))}
      </div>

      <div style={textContainerStyles}>
        <span>{displayText}</span>
        <span style={cursorStyles} />
      </div>

      {showTechCode && <div style={techCodeStyles}>{generateTechCode('BHK')}</div>}

      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      <style>{`
        @keyframes fall {
          from { top: -100%; }
          to { top: 100%; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
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

export default ColdWarBinaryHackerLoader;
