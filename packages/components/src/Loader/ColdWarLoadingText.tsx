/**
 * Cold War Loading Text
 * Animated "LOADING..." text with dot animation and pulse effects
 */

import React, { CSSProperties, useState, useEffect } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS, getComponentChamferClip } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarLoadingTextProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  size?: 'sm' | 'md' | 'lg';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  showCorners?: boolean;
  text?: string;
  animationStyle?: 'dots' | 'pulse' | 'fade';
  className?: string;
  style?: CSSProperties;
}

export const ColdWarLoadingText: React.FC<ColdWarLoadingTextProps> = ({
  theme = 'perseus',
  size = 'md',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showCorners = true,
  text = 'LOADING',
  animationStyle = 'dots',
  className = '',
  style = {},
}) => {
  const [dots, setDots] = useState('');

  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { width: 200, height: 80, fontSize: '16px' },
    md: { width: 280, height: 100, fontSize: '20px' },
    lg: { width: 360, height: 120, fontSize: '24px' },
  };
  const sizes = sizeMap[size];

  useEffect(() => {
    if (animationStyle === 'dots') {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev.length >= 3) return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [animationStyle]);

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

  const getTextAnimation = () => {
    switch (animationStyle) {
      case 'pulse':
        return 'pulse 1.5s ease-in-out infinite';
      case 'fade':
        return 'fade 2s ease-in-out infinite';
      default:
        return 'none';
    }
  };

  const textStyles: CSSProperties = {
    fontSize: sizes.fontSize,
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontWeight: 700,
    textShadow: glow ? `0 0 15px rgba(${rgb}, 0.9)` : 'none',
    animation: getTextAnimation(),
  };

  const dotsStyles: CSSProperties = {
    display: 'inline-block',
    width: '40px',
    textAlign: 'left',
  };

  const cornerStyles: CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    border: `1px solid ${themeColors.primary}`,
  };

  const techCodeStyles: CSSProperties = {
    position: 'absolute',
    top: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '10px',
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
    opacity: 0.7,
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

      <div style={textStyles}>
        {text}
        {animationStyle === 'dots' && <span style={dotsStyles}>{dots}</span>}
      </div>

      {showTechCode && <div style={techCodeStyles}>{generateTechCode('LDG')}</div>}

      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.98);
          }
        }

        @keyframes fade {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
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

export default ColdWarLoadingText;
