/**
 * Cold War Checkbox
 * Tactical checkbox with military aesthetic
 */

import React, { InputHTMLAttributes, CSSProperties, useState } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString } from '../utils/coldWarUtils';

export interface ColdWarCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  glow?: boolean;
  className?: string;
  containerStyle?: CSSProperties;
}

export const ColdWarCheckbox: React.FC<ColdWarCheckboxProps> = ({
  label,
  size = 'md',
  theme = 'perseus',
  glow = true,
  disabled = false,
  checked,
  className = '',
  containerStyle = {},
  onChange,
  ...inputProps
}) => {
  const [isChecked, setIsChecked] = useState(checked || false);
  const [isHovered, setIsHovered] = useState(false);

  const themeColors = THEME_VARIANTS[theme];
  const primaryRgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { box: '16px', fontSize: '11px', checkSize: '8px' },
    md: { box: '20px', fontSize: '13px', checkSize: '10px' },
    lg: { box: '24px', fontSize: '15px', checkSize: '12px' },
  };
  const sizes = sizeMap[size];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    onChange?.(e);
  };

  const boxStyles: CSSProperties = {
    width: sizes.box,
    height: sizes.box,
    border: `2px solid ${isChecked ? themeColors.primary : '#3a3a3e'}`,
    background: isChecked ? `rgba(${primaryRgb}, 0.2)` : 'rgba(10, 10, 20, 0.9)',
    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  if (isHovered && !disabled) {
    boxStyles.boxShadow = `0 0 10px rgba(${primaryRgb}, 0.5)`;
  }

  if (glow && isChecked && !disabled) {
    boxStyles.boxShadow = `
      0 0 10px rgba(${primaryRgb}, 0.6),
      0 0 20px rgba(${primaryRgb}, 0.3),
      inset 0 0 10px rgba(${primaryRgb}, 0.3)
    `;
  }

  if (disabled) {
    boxStyles.opacity = 0.4;
  }

  const labelStyles: CSSProperties = {
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: sizes.fontSize,
    fontWeight: 500,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    color: disabled ? '#3a3a3e' : themeColors.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
  };

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...containerStyle,
      }}
      className={className}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        style={{ display: 'none' }}
        {...inputProps}
      />

      <div style={boxStyles}>
        {isChecked && (
          <div
            style={{
              width: sizes.checkSize,
              height: sizes.checkSize,
              background: themeColors.primary,
              clipPath:
                'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)',
              boxShadow: glow ? `0 0 8px ${themeColors.primary}` : 'none',
            }}
          />
        )}
      </div>

      {label && <span style={labelStyles}>{label}</span>}
    </label>
  );
};

export default ColdWarCheckbox;
