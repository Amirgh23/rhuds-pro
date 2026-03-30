/**
 * Cold War HUD Button
 * Military-grade tactical button with HUD aesthetic
 */

import React, { ReactNode, CSSProperties, useState } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export type HudButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type HudButtonSize = 'sm' | 'md' | 'lg';

export interface ColdWarHudButtonProps {
  variant?: HudButtonVariant;
  size?: HudButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

function getVariantColors(variant: HudButtonVariant, theme: keyof typeof THEME_VARIANTS) {
  const themeColors = THEME_VARIANTS[theme];

  const colorMap = {
    primary: { border: themeColors.primary, text: themeColors.primary, rgb: '255, 176, 0' },
    secondary: { border: themeColors.secondary, text: themeColors.secondary, rgb: '51, 255, 0' },
    danger: { border: themeColors.error, text: themeColors.error, rgb: '255, 51, 51' },
    success: { border: themeColors.success, text: themeColors.success, rgb: '51, 255, 0' },
  };

  return colorMap[variant];
}

function getSizeStyles(size: HudButtonSize): CSSProperties {
  const sizeMap = {
    sm: { padding: '6px 12px', fontSize: '11px', minHeight: '28px', gap: '6px' },
    md: { padding: '10px 20px', fontSize: '13px', minHeight: '38px', gap: '8px' },
    lg: { padding: '14px 28px', fontSize: '15px', minHeight: '48px', gap: '10px' },
  };
  return sizeMap[size];
}

export const ColdWarHudButton: React.FC<ColdWarHudButtonProps> = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  theme = 'perseus',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  children,
  onClick,
  className = '',
  style = {},
  type = 'button',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [buttonCode] = useState(() => generateTechCode('HUD'));

  const colors = getVariantColors(variant, theme);
  const sizeStyles = getSizeStyles(size);

  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: `2px solid ${colors.border}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('button'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    background: 'rgba(10, 10, 20, 0.9)',
    color: colors.text,
    ...sizeStyles,
    ...style,
  };

  if (isHovered && !disabled) {
    baseStyles.transform = 'translateY(-2px)';
    baseStyles.boxShadow = `0 0 20px rgba(${colors.rgb}, 0.4), 0 4px 8px rgba(0, 0, 0, 0.4)`;
  }

  if (isPressed && !disabled) {
    baseStyles.transform = 'translateY(0px) scale(0.98)';
  }

  if (disabled) {
    baseStyles.opacity = 0.4;
    baseStyles.filter = 'grayscale(0.8)';
  }

  const textStyle: CSSProperties =
    glow && !disabled
      ? {
          textShadow: `
          0 0 4px ${colors.border},
          0 0 8px ${colors.border},
          0 0 12px rgba(${colors.rgb}, 0.5)
        `,
        }
      : {};

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      disabled={disabled || isLoading}
      className={className}
      style={baseStyles}
    >
      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && !disabled && <GlowOverlay color={colors.border} intensity="low" />}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: sizeStyles.gap,
          zIndex: 7,
          position: 'relative',
          ...textStyle,
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
              border: `2px solid ${colors.border}`,
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
          color: colors.border,
          opacity: 0.4,
          letterSpacing: '0.05em',
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

export default ColdWarHudButton;
