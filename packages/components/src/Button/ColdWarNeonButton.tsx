/**
 * Cold War Neon Button
 * Button with neon glow and hover effects
 */

import React, { ReactNode, CSSProperties, useState } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarNeonButtonProps {
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  glowIntensity?: 'low' | 'medium' | 'high';
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export const ColdWarNeonButton: React.FC<ColdWarNeonButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  theme = 'perseus',
  glowIntensity = 'medium',
  children,
  onClick,
  className = '',
  style = {},
  type = 'button',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [buttonCode] = useState(() => generateTechCode('NEO'));

  const themeColors = THEME_VARIANTS[theme];
  const colorMap = {
    primary: { color: themeColors.primary, rgb: '255, 176, 0' },
    secondary: { color: themeColors.secondary, rgb: '51, 255, 0' },
    success: { color: themeColors.success, rgb: '51, 255, 0' },
  };
  const colors = colorMap[variant];

  const sizeMap = {
    sm: { padding: '6px 12px', fontSize: '11px', minHeight: '28px', gap: '6px' },
    md: { padding: '10px 20px', fontSize: '13px', minHeight: '38px', gap: '8px' },
    lg: { padding: '14px 28px', fontSize: '15px', minHeight: '48px', gap: '10px' },
  };
  const sizeStyles = sizeMap[size];

  const glowMap = { low: 0.3, medium: 0.5, high: 0.7 };
  const glowOpacity = glowMap[glowIntensity];

  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: `2px solid ${colors.color}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('button'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    background: 'rgba(10, 10, 20, 0.8)',
    color: colors.color,
    boxShadow: `
      0 0 10px rgba(${colors.rgb}, ${glowOpacity * 0.5}),
      0 0 20px rgba(${colors.rgb}, ${glowOpacity * 0.3}),
      inset 0 0 20px rgba(${colors.rgb}, ${glowOpacity * 0.2})
    `,
    ...sizeStyles,
    ...style,
  };

  if (isHovered && !disabled) {
    baseStyles.transform = 'translateY(-2px) scale(1.02)';
    baseStyles.boxShadow = `
      0 0 20px rgba(${colors.rgb}, ${glowOpacity}),
      0 0 40px rgba(${colors.rgb}, ${glowOpacity * 0.6}),
      0 0 60px rgba(${colors.rgb}, ${glowOpacity * 0.3}),
      inset 0 0 30px rgba(${colors.rgb}, ${glowOpacity * 0.3})
    `;
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
      <GlowOverlay color={colors.color} intensity={glowIntensity} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: sizeStyles.gap,
          zIndex: 7,
          position: 'relative',
          textShadow: `
          0 0 8px ${colors.color},
          0 0 16px rgba(${colors.rgb}, 0.6)
        `,
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

export default ColdWarNeonButton;
