/**
 * Base Button Component
 * Theme-aware button with support for multiple themes and variants
 * Consolidates 22+ button component variants into a single flexible component
 */

import React, { useMemo, CSSProperties } from 'react';
import { useTheme } from '@rhuds/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'tactical'
  | 'glitch';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonTheme = 'rhuds' | 'coldwar' | 'cyberpunk' | 'neon' | 'glitch' | 'glow' | 'holo';

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Theme variant */
  buttonTheme?: ButtonTheme;
  /** Loading state */
  isLoading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Left icon element */
  leftIcon?: React.ReactNode;
  /** Right icon element */
  rightIcon?: React.ReactNode;
  /** Icon placement mode */
  iconPlacement?: 'left' | 'right' | 'only';
  /** Enable glow effect */
  glow?: boolean;
  /** Enable scanlines effect */
  scanlines?: boolean;
  /** Scanlines intensity */
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  /** Enable corner brackets (ColdWar theme) */
  cornerBrackets?: boolean;
  /** Enable LED indicator (ColdWar theme) */
  ledIndicator?: boolean;
  /** Enable click flash effect */
  clickFlash?: boolean;
}

/**
 * Get variant colors based on theme and variant
 */
function getVariantColors(
  variant: ButtonVariant,
  theme: any,
  buttonTheme: ButtonTheme
): Record<string, string> {
  const tokens = theme?.currentMode?.tokens || {};
  const colors = tokens.colors || {};

  // Base color mapping
  const colorMap: Record<ButtonVariant, string> = {
    primary: colors.primary || '#29F2DF',
    secondary: colors.secondary || '#666666',
    danger: colors.error || '#EF3EF1',
    success: colors.success || '#29F2DF',
    warning: colors.warning || '#FFB000',
    tactical: colors.primary || '#FFB000',
    glitch: colors.primary || '#29F2DF',
  };

  const baseColor = colorMap[variant];

  return {
    background: colors.background || '#0a0a14',
    border: baseColor,
    text: baseColor,
    glow: baseColor,
  };
}

/**
 * Get size styles
 */
function getSizeStyles(size: ButtonSize): CSSProperties {
  const sizeMap: Record<ButtonSize, CSSProperties> = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      minHeight: '28px',
      minWidth: '80px',
      gap: '0.5rem',
    },
    md: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      minHeight: '38px',
      minWidth: '120px',
      gap: '0.75rem',
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      minHeight: '48px',
      minWidth: '160px',
      gap: '1rem',
    },
  };

  return sizeMap[size];
}

/**
 * Get theme-specific styles
 */
function getThemeStyles(buttonTheme: ButtonTheme, colors: Record<string, string>): CSSProperties {
  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    textTransform: 'uppercase',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.background,
    color: colors.text,
  };

  // Theme-specific overrides
  const themeStyles: Record<ButtonTheme, CSSProperties> = {
    rhuds: {
      borderRadius: '4px',
      boxShadow: `0 0 10px rgba(41, 242, 223, 0.3)`,
    },
    coldwar: {
      borderRadius: 0,
      borderStyle: 'dashed',
      fontFamily: "'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace",
      letterSpacing: '0.05em',
      boxShadow: `inset 0 0 20px rgba(0, 0, 0, 0.6), 0 0 20px rgba(${colors.border}, 0.3)`,
    },
    cyberpunk: {
      borderRadius: '2px',
      boxShadow: `0 0 15px ${colors.glow}, inset 0 0 10px rgba(${colors.border}, 0.2)`,
      textShadow: `0 0 10px ${colors.glow}`,
    },
    neon: {
      borderRadius: '8px',
      boxShadow: `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`,
    },
    glitch: {
      borderRadius: '4px',
      boxShadow: `0 0 10px ${colors.glow}`,
    },
    glow: {
      borderRadius: '6px',
      boxShadow: `0 0 15px ${colors.glow}, inset 0 0 10px rgba(${colors.border}, 0.1)`,
    },
    holo: {
      borderRadius: '4px',
      boxShadow: `0 0 20px ${colors.glow}, inset 0 0 15px rgba(255, 255, 255, 0.1)`,
    },
  };

  return { ...baseStyles, ...themeStyles[buttonTheme] };
}

/**
 * Base Button Component
 */
export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      buttonTheme = 'rhuds',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      iconPlacement = 'left',
      glow = true,
      scanlines = false,
      scanlinesIntensity = 'medium',
      cornerBrackets = false,
      ledIndicator = false,
      clickFlash = false,
      className,
      style,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const colors = useMemo(
      () => getVariantColors(variant, theme, buttonTheme),
      [variant, theme, buttonTheme]
    );
    const sizeStyles = useMemo(() => getSizeStyles(size), [size]);
    const themeStyles = useMemo(() => getThemeStyles(buttonTheme, colors), [buttonTheme, colors]);

    const computedStyle = useMemo<CSSProperties>(
      () => ({
        ...themeStyles,
        ...sizeStyles,
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled || isLoading ? 0.6 : 1,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        ...style,
      }),
      [themeStyles, sizeStyles, fullWidth, disabled, isLoading, style]
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading) {
        onClick?.(e);
      }
    };

    return (
      <button
        ref={ref}
        className={className}
        style={computedStyle}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: sizeStyles.gap,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {leftIcon && iconPlacement !== 'only' && <span>{leftIcon}</span>}
          {iconPlacement !== 'only' && <span>{children}</span>}
          {rightIcon && iconPlacement !== 'only' && <span>{rightIcon}</span>}
          {iconPlacement === 'only' && (leftIcon || rightIcon)}
          {isLoading && <span>...</span>}
        </div>
      </button>
    );
  }
);

BaseButton.displayName = 'BaseButton';
