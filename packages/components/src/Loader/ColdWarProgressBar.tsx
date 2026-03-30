/**
 * Cold War Progress Bar
 * Tactical progress indicator with military aesthetic
 */

import React, { CSSProperties, useEffect, useState } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  color?: 'amber' | 'green' | 'blue' | 'red';
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  scanlines?: boolean;
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarProgressBar: React.FC<ColdWarProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  theme = 'perseus',
  color = 'amber',
  showLabel = true,
  showPercentage = true,
  animated = true,
  scanlines = true,
  glow = true,
  className = '',
  style = {},
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [techCode] = useState(() => generateTechCode('PRG'));

  const themeColors = THEME_VARIANTS[theme];
  const colorMap = {
    amber: { primary: themeColors.primary, rgb: '255, 176, 0' },
    green: { primary: themeColors.success, rgb: '51, 255, 0' },
    blue: { primary: themeColors.accent, rgb: '0, 204, 255' },
    red: { primary: themeColors.error, rgb: '255, 51, 51' },
  };
  const colors = colorMap[color];

  const sizeMap = {
    sm: { height: '8px', fontSize: '10px' },
    md: { height: '12px', fontSize: '12px' },
    lg: { height: '16px', fontSize: '14px' },
  };
  const sizes = sizeMap[size];

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    if (animated) {
      const duration = 500;
      const steps = 30;
      const increment = (percentage - displayValue) / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayValue(percentage);
          clearInterval(interval);
        } else {
          setDisplayValue((prev) => prev + increment);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  const containerStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    ...style,
  };

  const barContainerStyles: CSSProperties = {
    width: '100%',
    height: sizes.height,
    background: 'rgba(10, 10, 20, 0.9)',
    border: `1px solid ${colors.primary}`,
    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const barFillStyles: CSSProperties = {
    height: '100%',
    width: `${displayValue}%`,
    background: `linear-gradient(90deg, ${colors.primary}, rgba(${colors.rgb}, 0.7))`,
    transition: animated
      ? `width ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`
      : 'none',
    position: 'relative',
    boxShadow: glow ? `0 0 10px rgba(${colors.rgb}, 0.6)` : 'none',
  };

  const labelStyles: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: sizes.fontSize,
    fontWeight: 500,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    color: themeColors.text,
  };

  return (
    <div className={className} style={containerStyles}>
      {showLabel && (
        <div style={labelStyles}>
          <span>{techCode}</span>
          {showPercentage && <span>{Math.round(displayValue)}%</span>}
        </div>
      )}

      <div style={barContainerStyles}>
        <div style={barFillStyles}>{scanlines && <ScanlinesOverlay intensity="low" />}</div>
      </div>
    </div>
  );
};

export default ColdWarProgressBar;
