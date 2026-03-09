/**
 * HudInputReadonly - Readonly Input
 * دقیقاً مطابق با https://seantheme.com/hud/form_elements.html
 */

import React from 'react';

interface HudInputReadonlyProps {
  value?: string;
  placeholder?: string;
  plaintext?: boolean;
  color?: string;
}

export const HudInputReadonly: React.FC<HudInputReadonlyProps> = ({
  value = 'Readonly input here...',
  placeholder,
  plaintext = false,
  color = '#29F2DF',
}) => {
  const inputStyle: React.CSSProperties = plaintext
    ? {
        display: 'block',
        width: '100%',
        padding: '0.375rem 0',
        marginBottom: 0,
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
        color: '#fff',
        backgroundColor: 'transparent',
        border: 'solid transparent',
        borderWidth: '1px 0',
        outline: 'none',
        fontFamily: 'inherit',
      }
    : {
        display: 'block',
        width: '100%',
        padding: '0.375rem 0.75rem',
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
        color: 'rgba(255, 255, 255, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        backgroundClip: 'padding-box',
        border: `1px solid ${color}`,
        borderRadius: '0.25rem',
        outline: 'none',
        fontFamily: 'inherit',
        cursor: 'default',
      };

  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      readOnly
      style={inputStyle}
    />
  );
};

HudInputReadonly.displayName = 'HudInputReadonly';
