/**
 * Cold War Code Input Component
 * Multi-digit verification code input
 */

import React, { CSSProperties, useState, useRef } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarCodeInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
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

export const ColdWarCodeInput: React.FC<ColdWarCodeInputProps> = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  size = 'md',
  theme = 'perseus',
  glow = true,
  scanlines = false,
  scanlinesIntensity = 'medium',
  disabled = false,
  className = '',
  style = {},
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const themeColors = THEME_COLORS[theme];
  const variantColor = themeColors.primary;
  const rgb = getRgbString(variantColor);
  const techCode = generateTechCode('CODE');

  const sizeMap = {
    sm: { width: '32px', height: '32px', fontSize: '14px' },
    md: { width: '40px', height: '40px', fontSize: '16px' },
    lg: { width: '48px', height: '48px', fontSize: '18px' },
  };

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newValue = value.split('');
    newValue[index] = val;
    const result = newValue.join('');
    onChange?.(result);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (result.length === length && result.split('').every((c) => c)) {
      onComplete?.(result);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    ...style,
  };

  const digitStyle = (index: number): CSSProperties => {
    const isFocused = focusedIndex === index;
    const hasValue = value[index];

    return {
      position: 'relative',
      width: sizeMap[size].width,
      height: sizeMap[size].height,
      fontSize: sizeMap[size].fontSize,
      fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
      fontWeight: 700,
      textAlign: 'center',
      textTransform: 'uppercase',
      color: disabled ? '#666' : hasValue ? variantColor : '#fff',
      backgroundColor: disabled ? themeColors.surface : themeColors.background,
      border: `${isFocused ? '2px' : '1px'} solid ${disabled ? '#666' : isFocused ? variantColor : '#666'}`,
      clipPath:
        'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
      outline: 'none',
      transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      boxShadow: isFocused && glow && !disabled ? `0 0 20px rgba(${rgb}, 0.4)` : 'none',
    };
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '-16px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '8px',
    color: disabled ? '#666' : variantColor,
    opacity: 0.5,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      <span style={techCodeStyle}>{techCode}</span>
      <div style={containerStyle}>
        {Array.from({ length }).map((_, index) => (
          <div key={index} style={{ position: 'relative' }}>
            {scanlines && !disabled && focusedIndex === index && (
              <ScanlinesOverlay intensity={scanlinesIntensity} />
            )}
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={value[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              disabled={disabled}
              style={digitStyle(index)}
              aria-label={`Digit ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColdWarCodeInput;
