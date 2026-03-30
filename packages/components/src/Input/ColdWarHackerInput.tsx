/**
 * Cold War Hacker Input
 * Terminal-style input with typing animation effect
 */

import React, { InputHTMLAttributes, CSSProperties, useState, useEffect } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarHackerInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  glow?: boolean;
  showCursor?: boolean;
  className?: string;
  containerStyle?: CSSProperties;
}

export const ColdWarHackerInput: React.FC<ColdWarHackerInputProps> = ({
  label,
  size = 'md',
  theme = 'perseus',
  scanlines = true,
  glow = true,
  showCursor = true,
  disabled = false,
  className = '',
  containerStyle = {},
  placeholder = 'ENTER COMMAND...',
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const themeColors = THEME_VARIANTS[theme];
  const primaryRgb = getRgbString(themeColors.primary);

  const sizeMap = {
    sm: { padding: '6px 10px', fontSize: '12px', minHeight: '28px' },
    md: { padding: '8px 12px', fontSize: '14px', minHeight: '36px' },
    lg: { padding: '12px 16px', fontSize: '16px', minHeight: '44px' },
  };
  const sizeStyles = sizeMap[size];

  useEffect(() => {
    if (showCursor && isFocused) {
      const interval = setInterval(() => {
        setCursorVisible((prev) => !prev);
      }, 530);
      return () => clearInterval(interval);
    }
  }, [showCursor, isFocused]);

  const baseStyles: CSSProperties = {
    width: '100%',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontWeight: 400,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    border: `1px solid ${isFocused ? themeColors.primary : '#2a2a2e'}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('input'),
    background: 'rgba(0, 0, 0, 0.95)',
    color: themeColors.primary,
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    outline: 'none',
    position: 'relative',
    ...sizeStyles,
  };

  if (isFocused && glow) {
    baseStyles.boxShadow = `
      0 0 10px rgba(${primaryRgb}, 0.5),
      inset 0 0 20px rgba(${primaryRgb}, 0.2)
    `;
    baseStyles.textShadow = `0 0 4px ${themeColors.primary}`;
  }

  if (disabled) {
    baseStyles.opacity = 0.4;
    baseStyles.cursor = 'not-allowed';
  }

  const labelStyles: CSSProperties = {
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    marginBottom: '4px',
    display: 'block',
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label style={labelStyles}>{label}</label>}

      <div style={{ position: 'relative' }}>
        <input
          {...inputProps}
          disabled={disabled}
          placeholder={placeholder}
          style={baseStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {scanlines && <ScanlinesOverlay intensity="high" />}

        {showCursor && isFocused && cursorVisible && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '8px',
              height: '60%',
              background: themeColors.primary,
              boxShadow: `0 0 8px ${themeColors.primary}`,
              zIndex: 7,
            }}
          />
        )}

        {isFocused && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${themeColors.primary}, transparent)`,
              animation: 'scan-horizontal 1.5s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 8,
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes scan-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ColdWarHackerInput;
