import React, { CSSProperties, useState } from 'react';
import { getRgbString, ThemeVariant } from '../utils/coldWarUtils';

export interface ColdWarNeonSliderProps {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

export const ColdWarNeonSlider: React.FC<ColdWarNeonSliderProps> = ({
  label,
  value: controlledValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  size = 'md',
  theme = 'perseus',
  glow = true,
  showValue = true,
  disabled = false,
  className = '',
  style = {},
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const themeColors = THEME_COLORS[theme];
  const rgb = getRgbString(themeColors.primary);
  const percentage = ((value - min) / (max - min)) * 100;
  const sizeMap = {
    sm: { height: '4px', fontSize: '12px', thumbSize: '12px' },
    md: { height: '6px', fontSize: '14px', thumbSize: '16px' },
    lg: { height: '8px', fontSize: '16px', thumbSize: '20px' },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (controlledValue === undefined) setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', ...style }}
    >
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <span
              style={{
                fontSize: sizeMap[size].fontSize,
                fontFamily: "'Share Tech Mono', monospace",
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                color: disabled ? '#666' : '#fff',
              }}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              style={{
                fontSize: sizeMap[size].fontSize,
                fontFamily: "'Share Tech Mono', monospace",
                color: disabled ? '#666' : themeColors.primary,
              }}
            >
              {value}
            </span>
          )}
        </div>
      )}
      <div style={{ position: 'relative', width: '100%', height: sizeMap[size].height }}>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: themeColors.surface,
            clipPath:
              'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: themeColors.primary,
            clipPath:
              'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
            transition: 'width 100ms ease-out',
            boxShadow: glow && !disabled ? `0 0 15px rgba(${rgb}, 0.8)` : 'none',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
};

export default ColdWarNeonSlider;
