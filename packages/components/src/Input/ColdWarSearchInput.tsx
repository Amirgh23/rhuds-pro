/**
 * Cold War Search Input
 * Tactical search field with scanning animation
 */

import React, { InputHTMLAttributes, CSSProperties, useState } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarSearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  glow?: boolean;
  onSearch?: (value: string) => void;
  className?: string;
  containerStyle?: CSSProperties;
}

export const ColdWarSearchInput: React.FC<ColdWarSearchInputProps> = ({
  size = 'md',
  theme = 'perseus',
  scanlines = true,
  glow = true,
  onSearch,
  disabled = false,
  className = '',
  containerStyle = {},
  placeholder = 'SEARCH...',
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

  const themeColors = THEME_VARIANTS[theme];
  const primaryRgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { padding: '6px 32px 6px 10px', fontSize: '12px', minHeight: '28px', iconSize: '14px' },
    md: { padding: '8px 36px 8px 12px', fontSize: '14px', minHeight: '36px', iconSize: '16px' },
    lg: { padding: '12px 40px 12px 16px', fontSize: '16px', minHeight: '44px', iconSize: '18px' },
  };
  const sizeStyles = sizeMap[size];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const baseStyles: CSSProperties = {
    width: '100%',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontWeight: 400,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    border: `1px solid ${isFocused ? themeColors.primary : '#2a2a2e'}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('input'),
    background: 'rgba(10, 10, 20, 0.9)',
    color: themeColors.text,
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    outline: 'none',
    ...sizeStyles,
  };

  if (isFocused && glow) {
    baseStyles.boxShadow = `0 0 10px rgba(${primaryRgb}, 0.5)`;
    baseStyles.textShadow = `0 0 4px ${themeColors.primary}`;
  }

  if (disabled) {
    baseStyles.opacity = 0.4;
    baseStyles.cursor = 'not-allowed';
  }

  return (
    <div style={{ position: 'relative', ...containerStyle }} className={className}>
      <input
        {...inputProps}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        style={baseStyles}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {scanlines && <ScanlinesOverlay intensity="medium" />}

      {/* Search icon */}
      <div
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: sizeStyles.iconSize,
          color: isFocused ? themeColors.primary : '#3a3a3e',
          pointerEvents: 'none',
          zIndex: 7,
        }}
      >
        🔍
      </div>

      {/* Scanning animation on focus */}
      {isFocused && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${themeColors.primary}, transparent)`,
            animation: 'scan-horizontal 1s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: 8,
          }}
        />
      )}

      <style>{`
        @keyframes scan-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ColdWarSearchInput;
