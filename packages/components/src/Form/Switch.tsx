/**
 * Switch Component
 * Animated toggle switch
 */

import React, { useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { SwitchProps } from './types';

/**
 * Switch Component
 */
export const Switch: React.FC<SwitchProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  className,
  style,
}) => {
  const theme = useTheme();

  const switchStyle = useMemo<React.CSSProperties>(() => {
    return {
      width: '50px',
      height: '28px',
      backgroundColor: checked ? theme.currentMode.tokens.colors.primary : '#666',
      border: 'none',
      borderRadius: '14px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'background-color 0.3s ease-in-out',
      position: 'relative',
      padding: 0,
      outline: 'none',
      ...style,
    };
  }, [checked, disabled, theme, style]);

  const thumbStyle = useMemo<React.CSSProperties>(() => {
    return {
      position: 'absolute',
      top: '2px',
      left: checked ? '26px' : '2px',
      width: '24px',
      height: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      transition: 'left 0.3s ease-in-out',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    };
  }, [checked]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
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
      <button
        style={switchStyle}
        onClick={() => !disabled && onChange?.(!checked)}
        disabled={disabled}
        type="button"
      >
        <div style={thumbStyle} />
      </button>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
};

Switch.displayName = 'Switch';
