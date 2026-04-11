/**
 * Base Input Component
 * Theme-aware input with support for multiple themes and variants
 * Consolidates 26+ input component variants into a single flexible component
 */

import React, { useState, useMemo, CSSProperties } from 'react';
import { useTheme } from '@rhuds/core';

export type InputTheme =
  | 'rhuds'
  | 'coldwar'
  | 'cyberpunk'
  | 'hacker'
  | 'holo'
  | 'bash'
  | 'floating'
  | 'gradient';
export type InputSize = 'sm' | 'md' | 'lg';

export interface BaseInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input theme variant */
  inputTheme?: InputTheme;
  /** Size preset */
  size?: InputSize;
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Enable glow effect */
  glow?: boolean;
  /** Enable scanlines effect */
  scanlines?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Required field indicator */
  required?: boolean;
  /** Icon element */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
}

/**
 * Get theme-specific input styles
 */
function getThemeStyles(
  inputTheme: InputTheme,
  theme: any,
  error?: string,
  focused?: boolean
): CSSProperties {
  const tokens = (theme?.currentMode?.tokens as any) || {};
  const colors = (tokens.colors as Record<string, string>) || {};

  const borderColor = error ? '#EF3EF1' : focused ? colors.primary : '#666';
  const baseStyles: CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: `2px solid ${borderColor}`,
    borderRadius: '4px',
    backgroundColor: '#1a1a1a',
    color: colors.text || '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    cursor: 'text',
  };

  const themeStyles: Record<InputTheme, CSSProperties> = {
    rhuds: {
      borderRadius: '4px',
      boxShadow: focused ? `0 0 10px ${colors.primary}` : 'none',
    },
    coldwar: {
      borderRadius: 0,
      borderStyle: 'dashed',
      fontFamily: "'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace",
      letterSpacing: '0.05em',
      boxShadow: focused
        ? `inset 0 0 10px rgba(0, 0, 0, 0.6), 0 0 15px ${colors.primary}`
        : 'inset 0 0 10px rgba(0, 0, 0, 0.6)',
    },
    cyberpunk: {
      borderRadius: '2px',
      boxShadow: focused
        ? `0 0 15px ${colors.primary}, inset 0 0 10px rgba(${colors.primary}, 0.1)`
        : 'none',
      textShadow: focused ? `0 0 5px ${colors.primary}` : 'none',
    },
    hacker: {
      borderRadius: 0,
      fontFamily: "'Courier New', monospace",
      backgroundColor: '#000000',
      color: '#00FF00',
      border: `1px solid #00FF00`,
      boxShadow: focused ? `0 0 10px #00FF00, inset 0 0 5px rgba(0, 255, 0, 0.2)` : 'none',
    },
    holo: {
      borderRadius: '6px',
      boxShadow: focused
        ? `0 0 20px ${colors.primary}, inset 0 0 10px rgba(255, 255, 255, 0.1)`
        : 'none',
    },
    bash: {
      borderRadius: 0,
      fontFamily: "'Courier New', monospace",
      backgroundColor: '#0a0a0a',
      color: '#00FF00',
      border: `1px solid #00FF00`,
      boxShadow: focused ? `0 0 8px #00FF00` : 'none',
    },
    floating: {
      borderRadius: '8px',
      border: 'none',
      borderBottom: `2px solid ${borderColor}`,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      boxShadow: focused ? `0 4px 12px rgba(${colors.primary}, 0.2)` : 'none',
    },
    gradient: {
      borderRadius: '6px',
      background: `linear-gradient(135deg, rgba(41, 242, 223, 0.1) 0%, rgba(239, 62, 241, 0.1) 100%)`,
      boxShadow: focused ? `0 0 15px rgba(41, 242, 223, 0.3)` : 'none',
    },
  };

  return { ...baseStyles, ...themeStyles[inputTheme] };
}

/**
 * Get size styles
 */
function getSizeStyles(size: InputSize): CSSProperties {
  const sizeMap: Record<InputSize, CSSProperties> = {
    sm: {
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      minHeight: '28px',
    },
    md: {
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      minHeight: '38px',
    },
    lg: {
      padding: '1rem 1.25rem',
      fontSize: '1.125rem',
      minHeight: '48px',
    },
  };

  return sizeMap[size];
}

/**
 * Base Input Component
 */
export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      inputTheme = 'rhuds',
      size = 'md',
      label,
      error,
      success,
      glow = false,
      scanlines = false,
      placeholder,
      required = false,
      icon,
      iconPosition = 'left',
      disabled = false,
      className,
      style,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const [focused, setFocused] = useState(false);

    const sizeStyles = useMemo(() => getSizeStyles(size), [size]);
    const themeStyles = useMemo(
      () => getThemeStyles(inputTheme, theme, error, focused),
      [inputTheme, theme, error, focused]
    );

    const computedStyle = useMemo<CSSProperties>(
      () => ({
        ...themeStyles,
        ...sizeStyles,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
        ...style,
      }),
      [themeStyles, sizeStyles, disabled, style]
    );

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const tokens = (theme?.currentMode?.tokens as any) || {};
    const colors = (tokens.colors as Record<string, string>) || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {label && (
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.text || '#ffffff' }}>
            {label}
            {required && <span style={{ color: '#EF3EF1' }}>*</span>}
          </label>
        )}

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {icon && iconPosition === 'left' && (
            <span
              style={{ position: 'absolute', left: '0.75rem', pointerEvents: 'none', opacity: 0.7 }}
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={className}
            style={{
              ...computedStyle,
              paddingLeft: icon && iconPosition === 'left' ? '2.5rem' : computedStyle.paddingLeft,
              paddingRight:
                icon && iconPosition === 'right' ? '2.5rem' : computedStyle.paddingRight,
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <span
              style={{
                position: 'absolute',
                right: '0.75rem',
                pointerEvents: 'none',
                opacity: 0.7,
              }}
            >
              {icon}
            </span>
          )}
        </div>

        {error && <span style={{ fontSize: '0.75rem', color: '#EF3EF1' }}>{error}</span>}
        {success && <span style={{ fontSize: '0.75rem', color: '#29F2DF' }}>{success}</span>}
      </div>
    );
  }
);

BaseInput.displayName = 'BaseInput';
