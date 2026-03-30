/**
 * Cold War Heart Rate Loader
 * Animated heartbeat/EKG line with tactical medical aesthetic
 */

import React, { CSSProperties } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS, getComponentChamferClip } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarHeartRateLoaderProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  size?: 'sm' | 'md' | 'lg';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  showCorners?: boolean;
  pulseSpeed?: 'slow' | 'normal' | 'fast';
  className?: string;
  style?: CSSProperties;
}

export const ColdWarHeartRateLoader: React.FC<ColdWarHeartRateLoaderProps> = ({
  theme = 'perseus',
  size = 'md',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showCorners = true,
  pulseSpeed = 'normal',
  className = '',
  style = {},
}) => {
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { width: 200, height: 80, fontSize: '10px', strokeWidth: 2 },
    md: { width: 300, height: 100, fontSize: '12px', strokeWidth: 3 },
    lg: { width: 400, height: 120, fontSize: '14px', strokeWidth: 4 },
  };
  const sizes = sizeMap[size];

  const speedMap = {
    slow: '2s',
    normal: '1.5s',
    fast: '1s',
  };
  const animationDuration = speedMap[pulseSpeed];

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

  const svgStyles: CSSProperties = {
    width: '80%',
    height: '50%',
    filter: glow ? `drop-shadow(0 0 8px rgba(${rgb}, 0.8))` : 'none',
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
    right: '12px',
    fontSize: sizes.fontSize,
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
  };

  const heartbeatPath = 'M0,50 L40,50 L45,30 L50,70 L55,20 L60,50 L100,50';

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

      <svg style={svgStyles} viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={heartbeatPath}
          fill="none"
          stroke={themeColors.primary}
          strokeWidth={sizes.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur={animationDuration}
            repeatCount="indefinite"
          />
        </path>
      </svg>

      {showTechCode && <div style={techCodeStyles}>{generateTechCode('HRT')}</div>}

      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          svg * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ColdWarHeartRateLoader;
