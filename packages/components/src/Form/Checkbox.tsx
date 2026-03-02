/**
 * Checkbox Component
 * Accessible checkbox input
 */

import React, { useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { CheckboxProps } from './types';

/**
 * Checkbox Component
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  className,
  style,
}) => {
  const theme = useTheme();

  const checkboxStyle = useMemo<React.CSSProperties>(() => {
    return {
      width: '20px',
      height: '20px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      accentColor: theme.currentMode.tokens.colors.primary,
      ...style,
    };
  }, [disabled, theme, style]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: theme.currentMode.tokens.colors.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
  };

  return (
    <label style={containerStyle} className={className}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        style={checkboxStyle}
      />
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
};

Checkbox.displayName = 'Checkbox';
