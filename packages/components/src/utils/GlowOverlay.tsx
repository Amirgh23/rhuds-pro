/**
 * Glow Overlay Component
 * Reusable phosphor glow effect for Cold War components
 */

import React, { CSSProperties } from 'react';
import { getRgbString } from './coldWarUtils';

export interface GlowOverlayProps {
  color: string;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  style?: CSSProperties;
}

export const GlowOverlay: React.FC<GlowOverlayProps> = ({
  color,
  intensity = 'medium',
  className = '',
  style = {},
}) => {
  const rgb = getRgbString(color);

  const opacityMap = {
    low: 0.1,
    medium: 0.2,
    high: 0.3,
  };

  const opacity = opacityMap[intensity];

  const overlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 5,
    boxShadow: `
      inset 0 0 60px rgba(${rgb}, ${opacity}),
      inset 0 0 30px rgba(${rgb}, ${opacity * 0.75}),
      inset 0 0 15px rgba(${rgb}, ${opacity * 0.5})
    `,
    ...style,
  };

  return <div className={className} style={overlayStyle} />;
};

export default GlowOverlay;
