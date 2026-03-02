/**
 * Radio Component
 * Accessible radio button
 */

import React, { useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { RadioProps, RadioGroupProps } from './types';

/**
 * Radio Component
 */
export const Radio: React.FC<RadioProps> = ({
  label,
  value,
  checked = false,
  onChange,
  disabled = false,
  className,
  style,
}) => {
  const theme = useTheme();

  const radioStyle = useMemo<React.CSSProperties>(() => {
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
        type="radio"
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        style={radioStyle}
      />
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
};

Radio.displayName = 'Radio';

/**
 * RadioGroup Component
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  disabled = false,
  className,
  style,
}) => {
  const theme = useTheme();

  const groupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.currentMode.tokens.colors.text,
    marginBottom: '0.5rem',
  };

  return (
    <div className={className} style={groupStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      {options.map((option) => (
        <Radio
          key={option.value}
          label={option.label}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

RadioGroup.displayName = 'RadioGroup';
