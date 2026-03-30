/**
 * Cold War Access Input Component
 * Secure access input with verification indicator
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarAccessInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  accessLevel?: 'low' | 'medium' | 'high' | 'classified';
  showAccessIndicator?: boolean;
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

const ACCESS_COLORS = {
  low: '#33FF00',
  medium: '#FFB000',
  high: '#FF6600',
  classified: '#FF3333',
};

export const ColdWarAccessInput: React.FC<ColdWarAccessInputProps> = ({
  label,
  placeholder = 'ENTER ACCESS CODE...',
  value,
  onChange,
  size = 'md',
  theme = 'perseus',
  glow = true,
  scanlines = false,
  scanlinesIntensity = 'medium',
  accessLevel = 'medium',
  showAccessIndicator = true,
  disabled = false,
  className = '',
  style = {},
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const themeColors = THEME_COLORS[theme];
  const variantColor = themeColors.primary;
  const rgb = getRgbString(variantColor);
  const accessColor = ACCESS_COLORS[accessLevel];
  const accessRgb = getRgbString(accessColor);
  const techCode = generateTechCode('ACC');

  const sizeMap = {
    sm: { height: '32px', fontSize: '12px', padding: '8px 12px 8px 40px', iconSize: '14px' },
    md: { height: '40px', fontSize: '14px', padding: '12px 16px 12px 48px', iconSize: '16px' },
    lg: { height: '48px', fontSize: '16px', padding: '16px 20px 16px 56px', iconSize: '18px' },
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

  const accessIndicatorStyle: CSSProperties = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: sizeMap[size].iconSize,
    height: sizeMap[size].iconSize,
    borderRadius: '50%',
    backgroundColor: accessColor,
    boxShadow: `0 0 10px rgba(${accessRgb}, 0.6)`,
    animation: 'access-pulse 2s ease-in-out infinite',
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
    <>
      <style>
        {`
          @keyframes access-pulse {
            0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
            50% { opacity: 0.6; transform: translateY(-50%) scale(1.2); }
          }
        `}
      </style>
      <div className={className} style={containerStyle}>
        {label && <label style={labelStyle}>{label}</label>}
        <div style={inputWrapperStyle}>
          {showAccessIndicator && <div style={accessIndicatorStyle} />}
          {scanlines && !disabled && <ScanlinesOverlay intensity={scanlinesIntensity} />}
          <span style={techCodeStyle}>{techCode}</span>
          <input
            type="password"
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
    </>
  );
};

export default ColdWarAccessInput;
