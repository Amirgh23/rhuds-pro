/**
 * Cold War Subscribe Button Component
 * Button with subscribe/unsubscribe toggle state
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarSubscribeButtonProps {
  subscribed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  disabled?: boolean;
  onToggle?: (subscribed: boolean) => void;
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

export const ColdWarSubscribeButton: React.FC<ColdWarSubscribeButtonProps> = ({
  subscribed: initialSubscribed = false,
  size = 'md',
  theme = 'perseus',
  glow = true,
  scanlines = false,
  scanlinesIntensity = 'medium',
  disabled = false,
  onToggle,
  className = '',
  style = {},
}) => {
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const themeColors = THEME_COLORS[theme];
  const variantColor = subscribed ? themeColors.secondary : themeColors.primary;
  const rgb = getRgbString(variantColor);
  const techCode = generateTechCode('SUB');

  const sizeMap = {
    sm: { padding: '8px 16px', fontSize: '12px', height: '32px', iconSize: '14px' },
    md: { padding: '12px 24px', fontSize: '14px', height: '40px', iconSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '16px', height: '48px', iconSize: '18px' },
  };

  const handleClick = () => {
    if (!disabled) {
      const newState = !subscribed;
      setSubscribed(newState);
      onToggle?.(newState);
    }
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
    backgroundColor: disabled
      ? themeColors.surface
      : subscribed
        ? themeColors.surface
        : themeColors.background,
    border: `1px solid ${disabled ? '#666' : variantColor}`,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    opacity: disabled ? 0.5 : 1,
    overflow: 'hidden',
    ...style,
  };

  if (!disabled) {
    if (isHovered) {
      buttonStyle.transform = 'scale(1.02)';
      if (glow) {
        buttonStyle.boxShadow = `0 0 20px rgba(${rgb}, 0.4), inset 0 0 20px rgba(${rgb}, 0.1)`;
      }
    }
    if (isActive) {
      buttonStyle.transform = 'scale(0.98)';
      buttonStyle.borderWidth = '2px';
    }
  }

  const iconStyle: CSSProperties = {
    fontSize: sizeMap[size].iconSize,
    transition: 'transform 200ms ease-in-out',
    transform: subscribed ? 'rotate(0deg)' : 'rotate(180deg)',
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
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      aria-label={subscribed ? 'Unsubscribe' : 'Subscribe'}
      aria-pressed={subscribed}
    >
      {/* Scanlines */}
      {scanlines && !disabled && <ScanlinesOverlay intensity={scanlinesIntensity} />}

      {/* Tech Code */}
      <span style={techCodeStyle}>{techCode}</span>

      {/* Content */}
      <span style={contentStyle}>
        <span style={iconStyle}>{subscribed ? '✓' : '+'}</span>
        {subscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}
      </span>
    </button>
  );
};

export default ColdWarSubscribeButton;
