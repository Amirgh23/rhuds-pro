/**
 * Cold War HUD Box
 * Tactical container with military HUD aesthetic
 */

import React, { ReactNode, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS } from '@rhuds/core';
import { getRgbString } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarHudBoxProps {
  variant?: 'default' | 'bordered' | 'filled' | 'glass';
  color?: 'amber' | 'green' | 'blue' | 'red' | 'neutral';
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  padding?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarHudBox: React.FC<ColdWarHudBoxProps> = ({
  variant = 'default',
  color = 'amber',
  theme = 'perseus',
  scanlines = false,
  scanlinesIntensity = 'medium',
  glow = false,
  padding = '16px',
  children,
  className = '',
  style = {},
}) => {
  const themeColors = THEME_VARIANTS[theme];

  const colorMap = {
    amber: { primary: themeColors.primary, rgb: '255, 176, 0' },
    green: { primary: themeColors.success, rgb: '51, 255, 0' },
    blue: { primary: themeColors.accent, rgb: '0, 204, 255' },
    red: { primary: themeColors.error, rgb: '255, 51, 51' },
    neutral: { primary: '#3a3a3e', rgb: '58, 58, 62' },
  };
  const colors = colorMap[color];

  const variantStyles: Record<string, CSSProperties> = {
    default: {
      background: 'transparent',
      border: `1px solid ${colors.primary}`,
    },
    bordered: {
      background: 'rgba(10, 10, 20, 0.5)',
      border: `2px solid ${colors.primary}`,
    },
    filled: {
      background: 'rgba(10, 10, 20, 0.9)',
      border: `1px solid ${colors.primary}`,
    },
    glass: {
      background: 'rgba(10, 10, 20, 0.6)',
      backdropFilter: 'blur(10px)',
      border: `1px solid rgba(${colors.rgb}, 0.3)`,
    },
  };

  const baseStyles: CSSProperties = {
    padding,
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    color: themeColors.text,
    ...variantStyles[variant],
    ...style,
  };

  return (
    <div className={className} style={baseStyles}>
      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={colors.primary} intensity="low" />}

      <div style={{ position: 'relative', zIndex: 6 }}>{children}</div>
    </div>
  );
};

export default ColdWarHudBox;
