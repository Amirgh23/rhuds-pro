/**
 * HudInputSmall - Form Control Small Size
 * دقیقاً مطابق با https://seantheme.com/hud/form_elements.html
 */

import React from 'react';

interface HudInputSmallProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  color?: string;
}

export const HudInputSmall: React.FC<HudInputSmallProps> = ({
  value,
  onChange,
  placeholder = 'Small input',
  disabled = false,
  type = 'text',
  color = '#29F2DF',
}) => {
  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '0.25rem 0.5rem',
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backgroundClip: 'padding-box',
    border: `1px solid ${color}`,
    borderRadius: '0.2rem',
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
      style={{
        ...inputStyle,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 0 0.2rem ${color}40`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
};

HudInputSmall.displayName = 'HudInputSmall';
