import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarGlowingCheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high';
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

export const ColdWarGlowingCheckbox: React.FC<ColdWarGlowingCheckboxProps> = ({
  label,
  checked: controlledChecked,
  onChange,
  size = 'md',
  theme = 'perseus',
  glow = true,
  glowIntensity = 'high',
  disabled = false,
  className = '',
  style = {},
}) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const checked = controlledChecked !== undefined ? controlledChecked : internalChecked;
  const themeColors = THEME_COLORS[theme];
  const rgb = getRgbString(themeColors.primary);
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
          width: sizeMap[size].size,
          height: sizeMap[size].size,
          backgroundColor: disabled ? themeColors.surface : themeColors.background,
          border: `2px solid ${disabled ? '#666' : checked ? themeColors.primary : '#666'}`,
          clipPath:
            'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {checked && glow && !disabled && (
          <GlowOverlay color={themeColors.primary} intensity={glowIntensity} />
        )}
        {checked && (
          <div
            style={{
              width: sizeMap[size].checkSize,
              height: sizeMap[size].checkSize,
              backgroundColor: themeColors.primary,
              clipPath:
                'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)',
              opacity: checked ? 1 : 0,
              transform: checked ? 'scale(1)' : 'scale(0)',
              transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              zIndex: 10,
            }}
          />
        )}
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

export default ColdWarGlowingCheckbox;
