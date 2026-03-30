import React, { CSSProperties, useState } from 'react';
import { getRgbString, ThemeVariant } from '../utils/coldWarUtils';

export interface ColdWarCyberpunkToggleProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

export const ColdWarCyberpunkToggle: React.FC<ColdWarCyberpunkToggleProps> = ({
  label,
  checked: controlledChecked,
  onChange,
  size = 'md',
  theme = 'perseus',
  glow = true,
  disabled = false,
  className = '',
  style = {},
}) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const checked = controlledChecked !== undefined ? controlledChecked : internalChecked;
  const themeColors = THEME_COLORS[theme];
  const rgb = getRgbString(themeColors.primary);
  const sizeMap = {
    sm: { width: '36px', height: '18px', fontSize: '12px', thumbSize: '14px' },
    md: { width: '44px', height: '22px', fontSize: '14px', thumbSize: '18px' },
    lg: { width: '52px', height: '26px', fontSize: '16px', thumbSize: '22px' },
  };

  const handleChange = () => {
    if (!disabled) {
      const newChecked = !checked;
      if (controlledChecked === undefined) setInternalChecked(newChecked);
      onChange?.(newChecked);
    }
  };

  return (
    <label
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      onClick={handleChange}
    >
      <div
        style={{
          position: 'relative',
          width: sizeMap[size].width,
          height: sizeMap[size].height,
          backgroundColor: disabled
            ? themeColors.surface
            : checked
              ? `rgba(${rgb}, 0.2)`
              : themeColors.background,
          border: `2px solid ${disabled ? '#666' : checked ? themeColors.primary : '#666'}`,
          clipPath:
            'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          boxShadow:
            checked && glow && !disabled
              ? `0 0 15px rgba(${rgb}, 0.6), inset 0 0 10px rgba(${rgb}, 0.2)`
              : 'none',
        }}
      >
        <div
          style={{
            width: sizeMap[size].thumbSize,
            height: sizeMap[size].thumbSize,
            backgroundColor: disabled ? '#666' : themeColors.primary,
            clipPath:
              'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)',
            transform: checked
              ? `translateX(${parseInt(sizeMap[size].width) - parseInt(sizeMap[size].thumbSize) - 4}px)`
              : 'translateX(0)',
            transition: 'transform 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            boxShadow: glow && !disabled ? `0 0 10px rgba(${rgb}, 0.8)` : 'none',
          }}
        />
      </div>
      {label && (
        <span
          style={{
            fontSize: sizeMap[size].fontSize,
            fontFamily: "'Share Tech Mono', monospace",
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            color: disabled ? '#666' : '#fff',
            userSelect: 'none',
          }}
        >
          {label}
        </span>
      )}
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => {}}
        style={{ display: 'none' }}
      />
    </label>
  );
};

export default ColdWarCyberpunkToggle;
