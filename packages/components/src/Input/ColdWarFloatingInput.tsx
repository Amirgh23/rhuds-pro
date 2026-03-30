/**
 * Cold War Floating Label Input Component
 * Input with floating label animation
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarFloatingInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

export const ColdWarFloatingInput: React.FC<ColdWarFloatingInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
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
  const hasValue = value && value.length > 0;
  const isFloating = isFocused || hasValue;

  const themeColors = THEME_COLORS[theme];
  const variantColor = themeColors.primary;
  const rgb = getRgbString(variantColor);
  const techCode = generateTechCode('FLT');

  const sizeMap = {
    sm: { height: '32px', fontSize: '12px', padding: '8px 12px', labelSize: '10px' },
    md: { height: '40px', fontSize: '14px', padding: '12px 16px', labelSize: '12px' },
    lg: { height: '48px', fontSize: '16px', padding: '16px 20px', labelSize: '14px' },
  };

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingTop: '8px',
    ...style,
  };

  const inputWrapperStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    height: sizeMap[size].height,
    padding: sizeMap[size].padding,
    fontSize: sizeMap[size].fontSize,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    color: disabled ? '#666' : '#fff',
    backgroundColor: disabled ? themeColors.surface : themeColors.background,
    border: `1px solid ${disabled ? '#666' : isFocused ? variantColor : '#666'}`,
    clipPath:
      'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
    outline: 'none',
    transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  };

  if (isFocused && glow && !disabled) {
    inputStyle.boxShadow = `0 0 20px rgba(${rgb}, 0.4), inset 0 0 20px rgba(${rgb}, 0.1)`;
    inputStyle.borderWidth = '2px';
  }

  const floatingLabelStyle: CSSProperties = {
    position: 'absolute',
    left: '12px',
    top: isFloating ? '-8px' : '50%',
    transform: isFloating ? 'translateY(0)' : 'translateY(-50%)',
    fontSize: isFloating ? sizeMap[size].labelSize : sizeMap[size].fontSize,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: disabled ? '#666' : isFocused ? variantColor : '#999',
    backgroundColor: themeColors.background,
    padding: isFloating ? '0 4px' : '0',
    transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    pointerEvents: 'none',
    zIndex: 10,
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '2px',
    right: '4px',
    fontSize: '8px',
    color: disabled ? '#666' : variantColor,
    opacity: 0.5,
    pointerEvents: 'none',
    zIndex: 15,
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={inputWrapperStyle}>
        <label style={floatingLabelStyle}>{label}</label>
        {scanlines && !disabled && <ScanlinesOverlay intensity={scanlinesIntensity} />}
        <span style={techCodeStyle}>{techCode}</span>
        <input
          type="text"
          placeholder={isFloating ? placeholder : ''}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={inputStyle}
        />
      </div>
    </div>
  );
};

export default ColdWarFloatingInput;
