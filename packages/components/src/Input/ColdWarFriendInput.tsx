/**
 * Cold War Friend Input Component
 * Input for adding friends with tactical styling
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarFriendInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
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

export const ColdWarFriendInput: React.FC<ColdWarFriendInputProps> = ({
  label,
  placeholder = 'ENTER CALLSIGN...',
  value,
  onChange,
  onAdd,
  size = 'md',
  theme = 'perseus',
  glow = true,
  scanlines = false,
  scanlinesIntensity = 'medium',
  disabled = false,
  className = '',
  style = {},
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const themeColors = THEME_COLORS[theme];
  const variantColor = themeColors.primary;
  const rgb = getRgbString(variantColor);
  const techCode = generateTechCode('FRD');

  const sizeMap = {
    sm: { height: '32px', fontSize: '12px', padding: '8px 12px 8px 40px', iconSize: '14px' },
    md: { height: '40px', fontSize: '14px', padding: '12px 16px 12px 48px', iconSize: '16px' },
    lg: { height: '48px', fontSize: '16px', padding: '16px 20px 16px 56px', iconSize: '18px' },
  };

  const handleAdd = () => {
    if (value && onAdd && !disabled) {
      onAdd(value);
    }
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    ...style,
  };

  const labelStyle: CSSProperties = {
    fontSize: '12px',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: disabled ? '#666' : variantColor,
  };

  const inputWrapperStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyle: CSSProperties = {
    position: 'absolute',
    left: '12px',
    fontSize: sizeMap[size].iconSize,
    color: disabled ? '#666' : variantColor,
    zIndex: 10,
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    height: sizeMap[size].height,
    padding: sizeMap[size].padding,
    fontSize: sizeMap[size].fontSize,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    color: disabled ? '#666' : '#fff',
    backgroundColor: disabled ? themeColors.surface : themeColors.background,
    border: `1px solid ${disabled ? '#666' : isFocused ? variantColor : '#666'}`,
    clipPath: 'polygon(12px 0, calc(100% - 48px) 0, calc(100% - 48px) 100%, 0 100%, 0 12px)',
    outline: 'none',
    transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  };

  if (isFocused && glow && !disabled) {
    inputStyle.boxShadow = `0 0 20px rgba(${rgb}, 0.4), inset 0 0 20px rgba(${rgb}, 0.1)`;
    inputStyle.borderWidth = '2px';
  }

  const buttonStyle: CSSProperties = {
    height: sizeMap[size].height,
    width: '48px',
    marginLeft: '-1px',
    backgroundColor: disabled ? themeColors.surface : themeColors.background,
    border: `1px solid ${disabled ? '#666' : variantColor}`,
    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
    color: disabled ? '#666' : variantColor,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: sizeMap[size].iconSize,
    transition: 'all 150ms ease-in-out',
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '2px',
    right: '52px',
    fontSize: '8px',
    color: disabled ? '#666' : variantColor,
    opacity: 0.5,
    pointerEvents: 'none',
    zIndex: 15,
  };

  return (
    <div className={className} style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        <span style={iconStyle}>👤</span>
        {scanlines && !disabled && <ScanlinesOverlay intensity={scanlinesIntensity} />}
        <span style={techCodeStyle}>{techCode}</span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={inputStyle}
        />
        <button
          style={buttonStyle}
          onClick={handleAdd}
          disabled={disabled || !value}
          aria-label="Add friend"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ColdWarFriendInput;
