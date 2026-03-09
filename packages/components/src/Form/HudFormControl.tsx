/**
 * HudFormControl - Default Form Control
 * Based on https://seantheme.com/hud/form_elements.html
 */

import React from 'react';

interface HudFormControlProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'default' | 'sm' | 'lg';
  color?: string;
}

export const HudFormControl: React.FC<HudFormControlProps> = ({
  type = 'text',
  placeholder = 'Default input',
  value,
  onChange,
  disabled = false,
  readonly = false,
  size = 'default',
  color = '#29F2DF',
}) => {
  const sizeStyles = {
    default: { padding: '0.375rem 0.75rem', fontSize: '1rem' },
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.875rem' },
    lg: { padding: '0.5rem 1rem', fontSize: '1.25rem' },
  };

  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    ...sizeStyles[size],
    fontWeight: 400,
    lineHeight: 1.5,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backgroundClip: 'padding-box',
    border: `1px solid ${color}`,
    borderRadius: '0.25rem',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    outline: 'none',
    fontFamily: 'inherit',
  };

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readonly}
      style={{
        ...inputStyle,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : readonly ? 'default' : 'text',
      }}
      onFocus={(e) => {
        if (!disabled && !readonly) {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.boxShadow = `0 0 0 0.2rem ${color}40`;
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
};

HudFormControl.displayName = 'HudFormControl';
