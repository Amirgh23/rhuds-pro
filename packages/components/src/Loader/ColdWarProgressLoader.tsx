/**
 * Cold War Progress Loader
 * Circular progress indicator with percentage display
 */

import React, { CSSProperties, useState, useEffect } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS, getComponentChamferClip } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarProgressLoaderProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  size?: 'sm' | 'md' | 'lg';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  showCorners?: boolean;
  progress?: number;
  animated?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarProgressLoader: React.FC<ColdWarProgressLoaderProps> = ({
  theme = 'perseus',
  size = 'md',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showCorners = true,
  progress = 0,
  animated = true,
  className = '',
  style = {},
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { container: 100, circle: 60, fontSize: '16px', stroke: 4 },
    md: { container: 140, circle: 90, fontSize: '20px', stroke: 5 },
    lg: { container: 180, circle: 120, fontSize: '24px', stroke: 6 },
  };
  const sizes = sizeMap[size];

  useEffect(() => {
    if (animated) {
      const duration = 500;
      const steps = 30;
      const increment = (progress - displayProgress) / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayProgress(progress);
          clearInterval(interval);
        } else {
          setDisplayProgress((prev) => prev + increment);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  const containerStyles: CSSProperties = {
    position: 'relative',
    width: `${sizes.container}px`,
    height: `${sizes.container}px`,
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
    transform: 'rotate(-90deg)',
    filter: glow ? `drop-shadow(0 0 10px rgba(${rgb}, 0.6))` : 'none',
  };

  const radius = (sizes.circle - sizes.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayProgress / 100) * circumference;

  const percentageStyles: CSSProperties = {
    position: 'absolute',
    fontSize: sizes.fontSize,
    fontWeight: 700,
    color: themeColors.primary,
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
      role="progressbar"
      aria-valuenow={Math.round(displayProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading progress"
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

      <svg width={sizes.circle} height={sizes.circle} style={svgStyles}>
        <circle
          cx={sizes.circle / 2}
          cy={sizes.circle / 2}
          r={radius}
          fill="none"
          stroke={`rgba(${rgb}, 0.2)`}
          strokeWidth={sizes.stroke}
        />
        <circle
          cx={sizes.circle / 2}
          cy={sizes.circle / 2}
          r={radius}
          fill="none"
          stroke={themeColors.primary}
          strokeWidth={sizes.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: animated
              ? `stroke-dashoffset ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`
              : 'none',
          }}
        />
      </svg>

      <div style={percentageStyles}>{Math.round(displayProgress)}%</div>

      {showTechCode && <div style={techCodeStyles}>{generateTechCode('PRG')}</div>}

      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ColdWarProgressLoader;
