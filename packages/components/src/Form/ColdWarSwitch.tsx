/**
 * Cold War Switch
 * Tactical toggle switch with military aesthetic
 */

import React, { InputHTMLAttributes, CSSProperties, useState } from 'react';
import { THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString } from '../utils/coldWarUtils';

export interface ColdWarSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  glow?: boolean;
  className?: string;
  containerStyle?: CSSProperties;
}

export const ColdWarSwitch: React.FC<ColdWarSwitchProps> = ({
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
    sm: { width: '32px', height: '16px', fontSize: '11px', thumbSize: '12px', thumbOffset: '2px' },
    md: { width: '44px', height: '22px', fontSize: '13px', thumbSize: '16px', thumbOffset: '3px' },
    lg: { width: '56px', height: '28px', fontSize: '15px', thumbSize: '20px', thumbOffset: '4px' },
  };
  const sizes = sizeMap[size];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    onChange?.(e);
  };

  const trackStyles: CSSProperties = {
    width: sizes.width,
    height: sizes.height,
    border: `2px solid ${isChecked ? themeColors.primary : '#3a3a3e'}`,
    background: isChecked ? `rgba(${primaryRgb}, 0.2)` : 'rgba(10, 10, 20, 0.9)',
    clipPath: `polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  };

  if (isHovered && !disabled) {
    trackStyles.boxShadow = `0 0 10px rgba(${primaryRgb}, 0.5)`;
  }

  if (glow && isChecked && !disabled) {
    trackStyles.boxShadow = `
      0 0 10px rgba(${primaryRgb}, 0.6),
      0 0 20px rgba(${primaryRgb}, 0.3),
      inset 0 0 10px rgba(${primaryRgb}, 0.3)
    `;
  }

  if (disabled) {
    trackStyles.opacity = 0.4;
  }

  const thumbStyles: CSSProperties = {
    width: sizes.thumbSize,
    height: sizes.thumbSize,
    background: isChecked ? themeColors.primary : '#3a3a3e',
    clipPath: 'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)',
    position: 'absolute',
    left: isChecked ? `calc(100% - ${sizes.thumbSize} - ${sizes.thumbOffset})` : sizes.thumbOffset,
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.tactical}`,
    boxShadow: glow && isChecked ? `0 0 8px ${themeColors.primary}` : 'none',
  };

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

      <div style={trackStyles}>
        <div style={thumbStyles} />
      </div>

      {label && <span style={labelStyles}>{label}</span>}
    </label>
  );
};

export default ColdWarSwitch;
