/**
 * Cold War Holo Input Component
 * Input with holographic effect
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarHoloInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  holoIntensity?: 'low' | 'medium' | 'high';
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

export const ColdWarHoloInput: React.FC<ColdWarHoloInputProps> = ({
  label,
  placeholder = 'ENTER TEXT...',
  value,
  onChange,
  size = 'md',
  theme = 'perseus',
  glow = true,
  scanlines = false,
  scanlinesIntensity = 'medium',
  holoIntensity = 'medium',
  disabled = false,
  className = '',
  style = {},
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const themeColors = THEME_COLORS[theme];
  const variantColor = themeColors.primary;
  const rgb = getRgbString(variantColor);
  const techCode = generateTechCode('HOLO');

  const sizeMap = {
    sm: { height: '32px', fontSize: '12px', padding: '8px 12px' },
    md: { height: '40px', fontSize: '14px', padding: '12px 16px' },
    lg: { height: '48px', fontSize: '16px', padding: '16px 20px' },
  };

  const intensityMap = { low: 0.3, medium: 0.5, high: 0.7 };
  const holoOpacity = intensityMap[holoIntensity];

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

  const holoLayerStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, rgba(${rgb}, ${holoOpacity}) 0%, transparent 50%, rgba(${rgb}, ${holoOpacity}) 100%)`,
    clipPath:
      'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
    opacity: isFocused ? 1 : 0.5,
    transition: 'opacity 200ms ease-in-out',
    pointerEvents: 'none',
    zIndex: 1,
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
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        <div style={holoLayerStyle} />
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
      </div>
    </div>
  );
};

export default ColdWarHoloInput;
