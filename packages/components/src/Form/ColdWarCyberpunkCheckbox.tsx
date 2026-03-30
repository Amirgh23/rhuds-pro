/**
 * Cold War Cyberpunk Checkbox Component
 * Checkbox with cyberpunk glitch effects
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';

export interface ColdWarCyberpunkCheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
  glitchOnChange?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', secondary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: {
    primary: '#33FF00',
    secondary: '#FFB000',
    background: '#0a0a0c',
    surface: '#1a1a1e',
  },
  satelliteView: {
    primary: '#00CCFF',
    secondary: '#0066CC',
    background: '#3a3a3e',
    surface: '#2a2a2e',
  },
};

export const ColdWarCyberpunkCheckbox: React.FC<ColdWarCyberpunkCheckboxProps> = ({
  label,
  checked: controlledChecked,
  onChange,
  size = 'md',
  theme = 'perseus',
  glow = true,
  glitchOnChange = true,
  disabled = false,
  className = '',
  style = {},
}) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const checked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const themeColors = THEME_COLORS[theme];
  const variantColor = themeColors.primary;
  const rgb = getRgbString(variantColor);
  const techCode = generateTechCode('CYB-CHK');

  const sizeMap = {
    sm: { size: '16px', fontSize: '12px', checkSize: '10px' },
    md: { size: '20px', fontSize: '14px', checkSize: '12px' },
    lg: { size: '24px', fontSize: '16px', checkSize: '14px' },
  };

  const handleChange = () => {
    if (!disabled) {
      const newChecked = !checked;
      if (controlledChecked === undefined) setInternalChecked(newChecked);
      onChange?.(newChecked);
      if (glitchOnChange) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }
  };

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style,
  };

  const boxStyle: CSSProperties = {
    position: 'relative',
    width: sizeMap[size].size,
    height: sizeMap[size].size,
    backgroundColor: disabled ? themeColors.surface : themeColors.background,
    border: `2px solid ${disabled ? '#666' : checked ? variantColor : '#666'}`,
    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transform: isGlitching
      ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`
      : 'none',
  };

  if (checked && glow && !disabled) {
    boxStyle.boxShadow = `0 0 15px rgba(${rgb}, 0.6), inset 0 0 10px rgba(${rgb}, 0.3)`;
  }

  const checkStyle: CSSProperties = {
    width: sizeMap[size].checkSize,
    height: sizeMap[size].checkSize,
    backgroundColor: variantColor,
    clipPath: 'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)',
    opacity: checked ? 1 : 0,
    transform: checked ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(45deg)',
    transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  };

  const labelStyle: CSSProperties = {
    fontSize: sizeMap[size].fontSize,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: disabled ? '#666' : '#fff',
    userSelect: 'none',
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    fontSize: '6px',
    color: disabled ? '#666' : variantColor,
    opacity: 0.5,
    pointerEvents: 'none',
    zIndex: 15,
  };

  return (
    <label className={className} style={containerStyle} onClick={handleChange}>
      <div style={boxStyle}>
        <span style={techCodeStyle}>{techCode}</span>
        <div style={checkStyle} />
      </div>
      {label && <span style={labelStyle}>{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => {}}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ display: 'none' }}
      />
    </label>
  );
};

export default ColdWarCyberpunkCheckbox;
