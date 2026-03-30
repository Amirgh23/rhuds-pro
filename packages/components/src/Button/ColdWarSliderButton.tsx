/**
 * Cold War Slider Button Component
 * Button with sliding background effect
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarSliderButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  sliderDirection?: 'left' | 'right' | 'top' | 'bottom';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', secondary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: {
    primary: '#33FF00',
    secondary: '#FFB000',
    background: '#0a0a0c',
    surface: '#1a1a1e',
  },
  satelliteView: {
    primary: '#00CCFF',
    secondary: '#0066CC',
    background: '#3a3a3e',
    surface: '#2a2a2e',
  },
};

const VARIANT_COLORS = {
  primary: (theme: ThemeVariant) => THEME_COLORS[theme].primary,
  secondary: (theme: ThemeVariant) => THEME_COLORS[theme].secondary,
  danger: () => '#FF3333',
  success: (theme: ThemeVariant) => THEME_COLORS[theme].secondary,
};

export const ColdWarSliderButton: React.FC<ColdWarSliderButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  theme = 'perseus',
  glow = true,
  scanlines = false,
  scanlinesIntensity = 'medium',
  sliderDirection = 'left',
  disabled = false,
  onClick,
  className = '',
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const themeColors = THEME_COLORS[theme];
  const variantColor = VARIANT_COLORS[variant](theme);
  const rgb = getRgbString(variantColor);
  const techCode = generateTechCode('SLD');

  const sizeMap = {
    sm: { padding: '8px 16px', fontSize: '12px', height: '32px' },
    md: { padding: '12px 24px', fontSize: '14px', height: '40px' },
    lg: { padding: '16px 32px', fontSize: '16px', height: '48px' },
  };

  const directionMap = {
    left: { transform: 'translateX(-100%)', hoverTransform: 'translateX(0)' },
    right: { transform: 'translateX(100%)', hoverTransform: 'translateX(0)' },
    top: { transform: 'translateY(-100%)', hoverTransform: 'translateY(0)' },
    bottom: { transform: 'translateY(100%)', hoverTransform: 'translateY(0)' },
  };

  const buttonStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: sizeMap[size].padding,
    height: sizeMap[size].height,
    fontSize: sizeMap[size].fontSize,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: disabled ? '#666' : variantColor,
    backgroundColor: disabled ? themeColors.surface : themeColors.background,
    border: `1px solid ${disabled ? '#666' : variantColor}`,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 150ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    opacity: disabled ? 0.5 : 1,
    overflow: 'hidden',
    ...style,
  };

  if (!disabled && isActive) {
    buttonStyle.transform = 'scale(0.98)';
    buttonStyle.borderWidth = '2px';
  }

  const sliderStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: variantColor,
    opacity: 0.15,
    transform: isHovered
      ? directionMap[sliderDirection].hoverTransform
      : directionMap[sliderDirection].transform,
    transition: 'transform 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '2px',
    right: '4px',
    fontSize: '8px',
    color: disabled ? '#666' : variantColor,
    opacity: 0.5,
    pointerEvents: 'none',
    zIndex: 15,
  };

  return (
    <button
      className={className}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {/* Slider Background */}
      <div style={sliderStyle} />

      {/* Scanlines */}
      {scanlines && !disabled && <ScanlinesOverlay intensity={scanlinesIntensity} />}

      {/* Tech Code */}
      <span style={techCodeStyle}>{techCode}</span>

      {/* Content */}
      <span style={contentStyle}>{children}</span>
    </button>
  );
};

export default ColdWarSliderButton;
