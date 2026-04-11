/**
 * Base Checkbox Component
 * Theme-aware checkbox with support for multiple themes and variants
 * Consolidates 15+ checkbox component variants into a single flexible component
 */

import React, { useMemo, CSSProperties } from 'react';
import { useTheme } from '@rhuds/core';

export type CheckboxTheme =
  | 'rhuds'
  | 'coldwar'
  | 'cyberpunk'
  | 'neon'
  | 'glitch'
  | 'glow'
  | 'holo'
  | 'bubble';
export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface BaseCheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'onChange'
> {
  /** Checkbox theme variant */
  checkboxTheme?: CheckboxTheme;
  /** Size preset */
  size?: CheckboxSize;
  /** Label text */
  label?: string;
  /** Checked state */
  checked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Enable glow effect */
  glow?: boolean;
  /** Custom color */
  color?: string;
}

/**
 * Get theme-specific checkbox styles
 */
function getThemeStyles(checkboxTheme: CheckboxTheme, theme: any, color?: string): CSSProperties {
  const tokens = (theme?.currentMode?.tokens as any) || {};
  const colors = (tokens.colors as Record<string, string>) || {};
  const primaryColor = color || colors.primary || '#29F2DF';

  const baseStyles: CSSProperties = {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: primaryColor,
    transition: 'all 0.2s ease-in-out',
  };

  const themeStyles: Record<CheckboxTheme, CSSProperties> = {
    rhuds: {
      accentColor: primaryColor,
      boxShadow: `0 0 8px rgba(41, 242, 223, 0.3)`,
    },
    coldwar: {
      accentColor: primaryColor,
      boxShadow: `inset 0 0 5px rgba(0, 0, 0, 0.6), 0 0 10px ${primaryColor}`,
    },
    cyberpunk: {
      accentColor: primaryColor,
      boxShadow: `0 0 12px ${primaryColor}, inset 0 0 5px rgba(${primaryColor}, 0.2)`,
    },
    neon: {
      accentColor: primaryColor,
      boxShadow: `0 0 15px ${primaryColor}, 0 0 30px ${primaryColor}`,
    },
    glitch: {
      accentColor: primaryColor,
      boxShadow: `0 0 10px ${primaryColor}`,
    },
    glow: {
      accentColor: primaryColor,
      boxShadow: `0 0 12px ${primaryColor}, inset 0 0 8px rgba(255, 255, 255, 0.1)`,
    },
    holo: {
      accentColor: primaryColor,
      boxShadow: `0 0 15px ${primaryColor}, inset 0 0 10px rgba(255, 255, 255, 0.15)`,
    },
    bubble: {
      accentColor: primaryColor,
      borderRadius: '50%',
      boxShadow: `0 0 10px ${primaryColor}, inset 0 0 5px rgba(${primaryColor}, 0.3)`,
    },
  };

  return { ...baseStyles, ...themeStyles[checkboxTheme] };
}

/**
 * Get size styles
 */
function getSizeStyles(size: CheckboxSize): CSSProperties {
  const sizeMap: Record<CheckboxSize, CSSProperties> = {
    sm: {
      width: '16px',
      height: '16px',
    },
    md: {
      width: '20px',
      height: '20px',
    },
    lg: {
      width: '24px',
      height: '24px',
    },
  };

  return sizeMap[size];
}

/**
 * Base Checkbox Component
 */
export const BaseCheckbox = React.forwardRef<HTMLInputElement, BaseCheckboxProps>(
  (
    {
      checkboxTheme = 'rhuds',
      size = 'md',
      label,
      checked = false,
      onChange,
      glow = false,
      color,
      disabled = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();

    const sizeStyles = useMemo(() => getSizeStyles(size), [size]);
    const themeStyles = useMemo(
      () => getThemeStyles(checkboxTheme, theme, color),
      [checkboxTheme, theme, color]
    );

    const checkboxStyle = useMemo<CSSProperties>(
      () => ({
        ...themeStyles,
        ...sizeStyles,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }),
      [themeStyles, sizeStyles, disabled, style]
    );

    const tokens = (theme?.currentMode?.tokens as any) || {};
    const colors = (tokens.colors as Record<string, string>) || {};

    const containerStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
    };

    const labelStyle: CSSProperties = {
      fontSize: '1rem',
      color: colors.text || '#ffffff',
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
    };

    return (
      <label style={containerStyle} className={className}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          style={checkboxStyle}
          {...props}
        />
        {label && <span style={labelStyle}>{label}</span>}
      </label>
    );
  }
);

BaseCheckbox.displayName = 'BaseCheckbox';
