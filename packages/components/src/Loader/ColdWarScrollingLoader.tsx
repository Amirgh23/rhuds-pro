/**
 * Cold War Scrolling Loader
 * Horizontal scrolling text with tactical message display
 */

import React, { CSSProperties } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS, getComponentChamferClip } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarScrollingLoaderProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  size?: 'sm' | 'md' | 'lg';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  showCorners?: boolean;
  message?: string;
  scrollSpeed?: 'slow' | 'normal' | 'fast';
  className?: string;
  style?: CSSProperties;
}

export const ColdWarScrollingLoader: React.FC<ColdWarScrollingLoaderProps> = ({
  theme = 'perseus',
  size = 'md',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showCorners = true,
  message = 'SYSTEM LOADING • PLEASE WAIT • INITIALIZING PROTOCOLS',
  scrollSpeed = 'normal',
  className = '',
  style = {},
}) => {
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { width: 250, height: 60, fontSize: '12px' },
    md: { width: 350, height: 80, fontSize: '14px' },
    lg: { width: 450, height: 100, fontSize: '16px' },
  };
  const sizes = sizeMap[size];

  const speedMap = {
    slow: '30s',
    normal: '20s',
    fast: '10s',
  };
  const animationDuration = speedMap[scrollSpeed];

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

  const scrollContainerStyles: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const scrollTextStyles: CSSProperties = {
    display: 'flex',
    whiteSpace: 'nowrap',
    fontSize: sizes.fontSize,
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 600,
    animation: `scroll ${animationDuration} linear infinite`,
    textShadow: glow ? `0 0 10px rgba(${rgb}, 0.8)` : 'none',
  };

  const cornerStyles: CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    border: `1px solid ${themeColors.primary}`,
  };

  const techCodeStyles: CSSProperties = {
    position: 'absolute',
    top: '4px',
    right: '8px',
    fontSize: '9px',
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
    opacity: 0.7,
    zIndex: 10,
  };

  const repeatedMessage = `${message} • `.repeat(5);

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

      <div style={scrollContainerStyles}>
        <div style={scrollTextStyles}>
          <span>{repeatedMessage}</span>
        </div>
      </div>

      {showTechCode && <div style={techCodeStyles}>{generateTechCode('SCR')}</div>}

      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      <style>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
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

export default ColdWarScrollingLoader;
