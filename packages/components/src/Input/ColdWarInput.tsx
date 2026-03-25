/**
 * Cold War Redesign - Cinematic Input Component
 * AAA-quality terminal/data entry field with holographic effects
 * Features: Full-block cursor, label bar, grid pattern, scanning animation, tech overlays
 */

import React, { InputHTMLAttributes, ReactNode, CSSProperties } from 'react';
import {
  getComponentChamferClip,
  THEME_VARIANTS,
  ANIMATION_TOKENS,
  getTextureEffect,
} from '@rhuds/core';

export type InputVariant = 'tactical' | 'terminal' | 'holo' | 'glitch' | 'minimal';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'focus' | 'error' | 'success' | 'disabled';

export interface ColdWarInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input variant */
  variant?: InputVariant;
  /** Input size */
  size?: InputSize;
  /** Input state */
  state?: InputState;
  /** Icon placement */
  iconPlacement?: 'left' | 'right' | 'both';
  /** Left icon element */
  leftIcon?: ReactNode;
  /** Right icon element */
  rightIcon?: ReactNode;
  /** Label text */
  label?: string;
  /** Error message */
  errorMessage?: string;
  /** Success message */
  successMessage?: string;
  /** Theme variant */
  theme?: keyof typeof THEME_VARIANTS;
  /** Apply scanlines effect */
  scanlines?: boolean;
  /** Scanlines intensity */
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  /** Apply glow effect */
  glow?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Container style */
  containerStyle?: CSSProperties;
}

/**
 * Get variant colors based on theme
 */
function getVariantColors(variant: InputVariant, theme: keyof typeof THEME_VARIANTS) {
  const themeColors = THEME_VARIANTS[theme];

  const colorMap = {
    tactical: {
      background: themeColors.surface,
      border: '#2a2a2e',
      text: themeColors.text,
      focus: themeColors.primary,
      error: themeColors.error,
      success: themeColors.success,
      placeholder: '#999999',
    },
    terminal: {
      background: themeColors.background,
      border: themeColors.primary,
      text: themeColors.primary,
      focus: themeColors.primary,
      error: themeColors.error,
      success: themeColors.success,
      placeholder: themeColors.primary + '80',
    },
    holo: {
      background: themeColors.surface,
      border: themeColors.accent,
      text: themeColors.text,
      focus: themeColors.accent,
      error: themeColors.error,
      success: themeColors.success,
      placeholder: '#999999',
    },
    glitch: {
      background: themeColors.background,
      border: themeColors.primary,
      text: themeColors.primary,
      focus: themeColors.primary,
      error: themeColors.error,
      success: themeColors.success,
      placeholder: themeColors.primary + '80',
    },
    minimal: {
      background: 'transparent',
      border: '#3a3a3e',
      text: themeColors.text,
      focus: themeColors.primary,
      error: themeColors.error,
      success: themeColors.success,
      placeholder: '#666666',
    },
  };

  return colorMap[variant];
}

/**
 * Get size styles
 */
function getSizeStyles(size: InputSize): CSSProperties {
  const sizeMap = {
    sm: {
      padding: '6px 10px',
      fontSize: '12px',
      minHeight: '28px',
    },
    md: {
      padding: '8px 12px',
      fontSize: '14px',
      minHeight: '36px',
    },
    lg: {
      padding: '12px 16px',
      fontSize: '16px',
      minHeight: '44px',
    },
  };

  return sizeMap[size];
}

/**
 * Get state styles
 */
function getStateStyles(state: InputState, colors: any): CSSProperties {
  const stateMap = {
    default: {
      borderColor: colors.border,
      color: colors.text,
      boxShadow: 'none',
    },
    focus: {
      borderColor: colors.focus,
      color: colors.text,
      boxShadow: `0 0 10px ${colors.focus}80`,
    },
    error: {
      borderColor: colors.error,
      color: colors.text,
      boxShadow: `0 0 10px ${colors.error}80`,
    },
    success: {
      borderColor: colors.success,
      color: colors.text,
      boxShadow: `0 0 10px ${colors.success}80`,
    },
    disabled: {
      borderColor: '#3a3a3e',
      color: '#3a3a3e',
      boxShadow: 'none',
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  return stateMap[state];
}

/**
 * Cold War Input Component
 */
export const ColdWarInput: React.FC<ColdWarInputProps> = ({
  variant = 'tactical',
  size = 'md',
  state = 'default',
  iconPlacement = 'left',
  leftIcon,
  rightIcon,
  label,
  errorMessage,
  successMessage,
  theme = 'perseus',
  scanlines = false,
  scanlinesIntensity = 'medium',
  glow = true,
  disabled = false,
  className = '',
  style = {},
  containerStyle = {},
  placeholder,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const colors = getVariantColors(variant, theme);
  const sizeStyles = getSizeStyles(size);

  // Determine current state
  let currentState: InputState = state;
  if (disabled) currentState = 'disabled';
  else if (errorMessage) currentState = 'error';
  else if (successMessage) currentState = 'success';
  else if (isFocused) currentState = 'focus';

  const stateStyles = getStateStyles(currentState, colors);

  const baseInputStyles: CSSProperties = {
    display: 'block',
    width: '100%',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace",
    fontWeight: 400,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    border: 'none',
    borderRadius: 0,
    clipPath: getComponentChamferClip('input'),
    backgroundColor: colors.background,
    color: colors.text,
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    outline: 'none',
    position: 'relative',
    ...sizeStyles,
    ...stateStyles,
    ...style,
  };

  // CINEMATIC: Complex multi-layer box-shadow for depth & scanning effect
  baseInputStyles.boxShadow = `
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3),
    0 0 0 1px ${colors.border}40,
    0 0 0 2px rgba(0, 0, 0, 0.8),
    0 4px 12px rgba(0, 0, 0, 0.4)
  `;

  // CINEMATIC: Grid pattern background (terminal aesthetic)
  baseInputStyles.backgroundImage = `
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(0deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
  `;
  baseInputStyles.backgroundSize = '8px 8px';

  // CINEMATIC: Bloom & glow effect with multiple text-shadow layers
  if (glow && currentState !== 'disabled') {
    baseInputStyles.textShadow = `
      0 0 4px ${colors[currentState === 'focus' ? 'focus' : 'border']},
      0 0 8px ${colors[currentState === 'focus' ? 'focus' : 'border']}80,
      0 0 12px ${colors[currentState === 'focus' ? 'focus' : 'border']}40
    `;
  }

  // CINEMATIC: Enhanced focus state with scanning animation
  if (currentState === 'focus') {
    baseInputStyles.boxShadow = `
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3),
      0 0 0 1px ${colors.focus}60,
      0 0 0 2px rgba(0, 0, 0, 0.8),
      0 6px 16px rgba(0, 0, 0, 0.5),
      0 0 20px ${colors.focus}40
    `;
  }

  // Placeholder styles
  const placeholderColor = colors.placeholder;

  const containerBaseStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    ...containerStyle,
  };

  const inputWrapperStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
  };

  const iconStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: currentState === 'focus' ? colors.focus : colors.border,
    fontSize: size === 'sm' ? '12px' : size === 'lg' ? '18px' : '14px',
    transition: `color ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
  };

  const labelStyles: CSSProperties = {
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: colors.text,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace",
  };

  const messageStyles: CSSProperties = {
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: errorMessage ? colors.error : colors.success,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace",
  };

  return (
    <div style={containerBaseStyles} className={className}>
      {/* CINEMATIC: Label bar (file tab aesthetic) */}
      {label && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            paddingLeft: '8px',
            paddingRight: '12px',
            paddingTop: '4px',
            paddingBottom: '4px',
            backgroundColor: `${colors.focus}20`,
            borderLeft: `3px solid ${colors.focus}`,
            borderTopLeftRadius: '2px',
            borderTopRightRadius: '2px',
            fontFamily: "'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: colors.focus,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* CINEMATIC: Tech data indicator */}
          <span
            style={{
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: colors.focus,
              animation: 'led-pulse 1s ease-in-out infinite',
            }}
          />
          {label}
        </div>
      )}

      <div style={inputWrapperStyles}>
        {leftIcon && (iconPlacement === 'left' || iconPlacement === 'both') && (
          <span style={iconStyles}>{leftIcon}</span>
        )}

        {/* CINEMATIC: Input wrapper with scanning border animation */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input
            {...inputProps}
            disabled={disabled}
            placeholder={placeholder}
            style={baseInputStyles}
            onFocus={(e) => {
              setIsFocused(true);
              inputProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              inputProps.onBlur?.(e);
            }}
          />

          {/* CINEMATIC: Scanning animation border on focus */}
          {isFocused && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '1px',
                backgroundColor: `linear-gradient(90deg, transparent, ${colors.focus}, transparent)`,
                animation: 'scan-line-sweep 0.6s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          )}

          {/* CINEMATIC: Reticle/crosshair SVG overlay on focus */}
          {isFocused && (
            <svg
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                opacity: 0.4,
                pointerEvents: 'none',
                animation: 'targeting-reticle-spin 4s linear infinite',
              }}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="8" fill="none" stroke={colors.focus} strokeWidth="1" />
              <line x1="12" y1="4" x2="12" y2="8" stroke={colors.focus} strokeWidth="1" />
              <line x1="12" y1="16" x2="12" y2="20" stroke={colors.focus} strokeWidth="1" />
              <line x1="4" y1="12" x2="8" y2="12" stroke={colors.focus} strokeWidth="1" />
              <line x1="16" y1="12" x2="20" y2="12" stroke={colors.focus} strokeWidth="1" />
            </svg>
          )}
        </div>

        {rightIcon && (iconPlacement === 'right' || iconPlacement === 'both') && (
          <span style={iconStyles}>{rightIcon}</span>
        )}
      </div>

      {/* CINEMATIC: Tech data footer with status */}
      {(errorMessage || successMessage) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '4px',
            paddingLeft: '8px',
            fontSize: '10px',
            fontWeight: 400,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: errorMessage ? colors.error : colors.success,
            fontFamily: "'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace",
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              backgroundColor: errorMessage ? colors.error : colors.success,
              animation: 'led-pulse 0.8s ease-in-out infinite',
            }}
          />
          {errorMessage || successMessage}
        </div>
      )}
    </div>
  );
};

export default ColdWarInput;
