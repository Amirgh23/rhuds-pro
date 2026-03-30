/**
 * Cold War Glitch Button
 * Button with random glitch effects and distortion
 */

import React, { ReactNode, CSSProperties, useState, useEffect } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarGlitchButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  glitchIntensity?: 'low' | 'medium' | 'high';
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export const ColdWarGlitchButton: React.FC<ColdWarGlitchButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  theme = 'perseus',
  glitchIntensity = 'medium',
  children,
  onClick,
  className = '',
  style = {},
  type = 'button',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [buttonCode] = useState(() => generateTechCode('GLT'));

  const themeColors = THEME_VARIANTS[theme];
  const colorMap = {
    primary: { color: themeColors.primary, rgb: '255, 176, 0' },
    secondary: { color: themeColors.secondary, rgb: '51, 255, 0' },
    danger: { color: themeColors.error, rgb: '255, 51, 51' },
  };
  const colors = colorMap[variant];

  const sizeMap = {
    sm: { padding: '6px 12px', fontSize: '11px', minHeight: '28px', gap: '6px' },
    md: { padding: '10px 20px', fontSize: '13px', minHeight: '38px', gap: '8px' },
    lg: { padding: '14px 28px', fontSize: '15px', minHeight: '48px', gap: '10px' },
  };
  const sizeStyles = sizeMap[size];

  // Random glitch effect
  useEffect(() => {
    const intervalMap = { low: 4000, medium: 2000, high: 1000 };
    const interval = intervalMap[glitchIntensity];

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        const timeoutId = setTimeout(() => setGlitchActive(false), 100);
        return () => clearTimeout(timeoutId);
      }
    }, interval);

    return () => clearInterval(glitchInterval);
  }, [glitchIntensity]);

  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: `1px solid ${colors.color}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('button'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    background: 'rgba(10, 10, 20, 0.95)',
    color: colors.color,
    ...sizeStyles,
    ...style,
  };

  if (glitchActive) {
    baseStyles.filter = 'hue-rotate(180deg) saturate(3)';
    baseStyles.transform = 'skewX(-3deg)';
  }

  if (isHovered && !disabled) {
    baseStyles.boxShadow = `0 0 20px rgba(${colors.rgb}, 0.5)`;
  }

  if (disabled) {
    baseStyles.opacity = 0.4;
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || isLoading}
      className={className}
      style={baseStyles}
    >
      <ScanlinesOverlay intensity="high" />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: sizeStyles.gap,
          zIndex: 7,
          position: 'relative',
        }}
      >
        {leftIcon && <span>{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span>{rightIcon}</span>}
        {isLoading && (
          <span
            style={{
              display: 'inline-block',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              border: `2px solid ${colors.color}`,
              borderTopColor: 'transparent',
              animation: 'spinner-rotate 0.6s linear infinite',
            }}
          />
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '2px',
          right: '4px',
          fontSize: '7px',
          color: colors.color,
          opacity: 0.4,
          zIndex: 4,
        }}
      >
        {buttonCode}
      </div>

      <style>{`
        @keyframes spinner-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default ColdWarGlitchButton;
