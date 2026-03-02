/**
 * Input Component
 * Text input with validation support
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { InputProps } from './types';

/**
 * Input Component
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  placeholder,
  error,
  success,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  className,
  style,
  ...props
}) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const computedStyle = useMemo<React.CSSProperties>(() => {
    const borderColor = error ? '#ff0000' : success ? '#00ff00' : focused ? theme.currentMode.tokens.colors.primary : '#666';

    return {
      width: '100%',
      padding: '0.75rem',
      fontSize: '1rem',
      border: `2px solid ${borderColor}`,
      borderRadius: '4px',
      backgroundColor: disabled ? '#333' : '#1a1a1a',
      color: theme.currentMode.tokens.colors.text,
      outline: 'none',
      transition: 'all 0.2s ease-in-out',
      cursor: disabled ? 'not-allowed' : 'text',
      opacity: disabled ? 0.6 : 1,
      ...style,
    };
  }, [error, success, focused, disabled, theme, style]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: theme.currentMode.tokens.colors.text }}>
          {label}
          {required && <span style={{ color: '#ff0000' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        className={className}
        style={computedStyle}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#ff0000' }}>
          {error}
        </span>
      )}
      {success && (
        <span style={{ fontSize: '0.75rem', color: '#00ff00' }}>
          {success}
        </span>
      )}
    </div>
  );
};

Input.displayName = 'Input';
