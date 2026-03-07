/**
 * Button Component
 * Interactive button with multiple variants and states
 */

import React, { useMemo } from 'react';
import { useTheme, useBleeps } from '@rhuds/core';
import { ButtonProps } from './types';

/**
 * Get button variant styles
 */
function getVariantStyles(variant: string, theme: any): React.CSSProperties {
  const tokens = (theme as any)?.currentMode?.tokens || theme;
  const colors = tokens.colors || {};
  
  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.primary || '#29F2DF',
      color: colors.text || '#ffffff',
      border: `2px solid ${colors.primary || '#29F2DF'}`,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.primary || '#29F2DF',
      border: `2px solid ${colors.primary || '#29F2DF'}`,
    },
    danger: {
      backgroundColor: colors.error || '#EF3EF1',
      color: '#ffffff',
      border: `2px solid ${colors.error || '#EF3EF1'}`,
    },
    success: {
      backgroundColor: colors.success || '#29F2DF',
      color: '#000000',
      border: `2px solid ${colors.success || '#29F2DF'}`,
    },
    warning: {
      backgroundColor: colors.warning || '#29F2DF',
      color: '#000000',
      border: `2px solid ${colors.warning || '#29F2DF'}`,
    },
  };

  return variants[variant] || variants.primary;
}

/**
 * Get button size styles
 */
function getSizeStyles(size: string): React.CSSProperties {
  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  return sizes[size] || sizes.md;
}

/**
 * Button Component
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  className,
  style,
  ...props
}) => {
  const theme = useTheme();
  const { play } = useBleeps();

  const computedStyle = useMemo<React.CSSProperties>(() => {
    const variantStyles = getVariantStyles(variant, theme);
    const sizeStyles = getSizeStyles(size);

    return {
      ...variantStyles,
      ...sizeStyles,
      width: fullWidth ? '100%' : 'auto',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.6 : 1,
      transition: 'all 0.2s ease-in-out',
      borderRadius: '4px',
      fontWeight: 600,
      outline: 'none',
      ...style,
    };
  }, [variant, size, disabled, loading, fullWidth, theme, style]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      play?.('click');
      onClick?.(e);
    }
  };

  return (
    <button
      className={className}
      style={computedStyle}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          (e.currentTarget as HTMLElement).style.opacity = '0.8';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          (e.currentTarget as HTMLElement).style.opacity = '1';
        }
      }}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  );
};

Button.displayName = 'Button';
