/**
 * Cold War Wave Loader
 * Animated wave/sine pattern - audio waveform style with pulsing bars
 */

import React, { CSSProperties } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS, getComponentChamferClip } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarWaveLoaderProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  size?: 'sm' | 'md' | 'lg';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  showCorners?: boolean;
  waveFrequency?: 'low' | 'medium' | 'high';
  className?: string;
  style?: CSSProperties;
}

export const ColdWarWaveLoader: React.FC<ColdWarWaveLoaderProps> = ({
  theme = 'perseus',
  size = 'md',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showCorners = true,
  waveFrequency = 'medium',
  className = '',
  style = {},
}) => {
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { width: 200, height: 80, barWidth: 4, barCount: 15 },
    md: { width: 280, height: 100, barWidth: 5, barCount: 20 },
    lg: { width: 360, height: 120, barWidth: 6, barCount: 25 },
  };
  const sizes = sizeMap[size];

  const frequencyMap = {
    low: { min: 0.3, max: 0.6 },
    medium: { min: 0.4, max: 0.8 },
    high: { min: 0.5, max: 1.0 },
  };
  const frequency = frequencyMap[waveFrequency];

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

  const waveContainerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${sizes.barWidth}px`,
    height: '60%',
  };

  const getBarHeight = (index: number): number => {
    const normalizedIndex = index / sizes.barCount;
    const sineValue = Math.sin(normalizedIndex * Math.PI * 2);
    const height = frequency.min + (frequency.max - frequency.min) * ((sineValue + 1) / 2);
    return height;
  };

  const barStyles = (index: number): CSSProperties => {
    const heightMultiplier = getBarHeight(index);
    const delay = index * 0.05;

    return {
      width: `${sizes.barWidth}px`,
      height: `${heightMultiplier * 100}%`,
      backgroundColor: themeColors.primary,
      animation: `pulse 1.2s ease-in-out ${delay}s infinite`,
      boxShadow: glow ? `0 0 10px rgba(${rgb}, 0.8)` : 'none',
      clipPath:
        'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)',
    };
  };

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

      <div style={waveContainerStyles}>
        {Array.from({ length: sizes.barCount }, (_, index) => (
          <div key={index} style={barStyles(index)} />
        ))}
      </div>

      {showTechCode && <div style={techCodeStyles}>{generateTechCode('WAV')}</div>}

      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scaleY(1);
            opacity: 1;
          }
          50% {
            transform: scaleY(0.5);
            opacity: 0.7;
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

export default ColdWarWaveLoader;
