/**
 * Scanlines Overlay Component
 * Reusable CRT scanlines effect for Cold War components
 */

import React, { CSSProperties } from 'react';

export interface ScanlinesOverlayProps {
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ScanlinesOverlay: React.FC<ScanlinesOverlayProps> = ({
  intensity = 'medium',
  animated = true,
  className = '',
  style = {},
}) => {
  const opacityMap = {
    low: 0.15,
    medium: 0.25,
    high: 0.35,
  };

  const opacity = opacityMap[intensity];

  const overlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 100,
    background: `repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, ${opacity}) 0px,
      rgba(0, 0, 0, ${opacity}) 1px,
      transparent 1px,
      transparent 2px
    )`,
    backgroundSize: '100% 2px',
    backgroundPosition: '0 0',
    animation: animated ? 'scanlines-move 8s linear infinite' : 'none',
    ...style,
  };

  return <div className={className} style={overlayStyle} />;
};

export default ScanlinesOverlay;
