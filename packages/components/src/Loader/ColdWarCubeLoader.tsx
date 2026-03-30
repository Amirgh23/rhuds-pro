/**
 * Cold War Cube Loader
 * 3D rotating cube with tactical edges and chamfered corners
 */

import React, { CSSProperties } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS, getComponentChamferClip } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarCubeLoaderProps {
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

export const ColdWarCubeLoader: React.FC<ColdWarCubeLoaderProps> = ({
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
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { container: 120, cube: 50, fontSize: '10px' },
    md: { container: 160, cube: 70, fontSize: '12px' },
    lg: { container: 200, cube: 90, fontSize: '14px' },
  };
  const sizes = sizeMap[size];

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
    perspective: '1000px',
    ...style,
  };

  const cubeContainerStyles: CSSProperties = {
    width: `${sizes.cube}px`,
    height: `${sizes.cube}px`,
    position: 'relative',
    transformStyle: 'preserve-3d',
    animation: 'rotateCube 4s linear infinite',
  };

  const faceStyles = (transform: string): CSSProperties => ({
    position: 'absolute',
    width: `${sizes.cube}px`,
    height: `${sizes.cube}px`,
    border: `2px solid ${themeColors.primary}`,
    background: `rgba(${rgb}, 0.1)`,
    transform,
    boxShadow: glow ? `inset 0 0 20px rgba(${rgb}, 0.3)` : 'none',
    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
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
    fontSize: sizes.fontSize,
    color: themeColors.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 500,
    zIndex: 10,
  };

  const halfCube = sizes.cube / 2;

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

      <div style={cubeContainerStyles}>
        <div style={faceStyles(`rotateY(0deg) translateZ(${halfCube}px)`)} />
        <div style={faceStyles(`rotateY(90deg) translateZ(${halfCube}px)`)} />
        <div style={faceStyles(`rotateY(180deg) translateZ(${halfCube}px)`)} />
        <div style={faceStyles(`rotateY(-90deg) translateZ(${halfCube}px)`)} />
        <div style={faceStyles(`rotateX(90deg) translateZ(${halfCube}px)`)} />
        <div style={faceStyles(`rotateX(-90deg) translateZ(${halfCube}px)`)} />
      </div>

      {showTechCode && <div style={techCodeStyles}>{generateTechCode('3DC')}</div>}

      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      <style>{`
        @keyframes rotateCube {
          from {
            transform: rotateX(0deg) rotateY(0deg);
          }
          to {
            transform: rotateX(360deg) rotateY(360deg);
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

export default ColdWarCubeLoader;
