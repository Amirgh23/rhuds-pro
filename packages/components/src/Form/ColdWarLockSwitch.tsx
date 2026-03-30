import React, { CSSProperties, useState } from 'react';
import { getRgbString, ThemeVariant } from '../utils/coldWarUtils';

export interface ColdWarLockSwitchProps {
  label?: string;
  locked?: boolean;
  onChange?: (locked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
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

export const ColdWarLockSwitch: React.FC<ColdWarLockSwitchProps> = ({
  label,
  locked: controlledLocked,
  onChange,
  size = 'md',
  theme = 'perseus',
  glow = true,
  disabled = false,
  className = '',
  style = {},
}) => {
  const [internalLocked, setInternalLocked] = useState(false);
  const locked = controlledLocked !== undefined ? controlledLocked : internalLocked;
  const themeColors = THEME_COLORS[theme];
  const color = locked ? '#FF3333' : themeColors.secondary;
  const rgb = getRgbString(color);
  const sizeMap = {
    sm: { width: '32px', height: '16px', fontSize: '12px', iconSize: '10px' },
    md: { width: '40px', height: '20px', fontSize: '14px', iconSize: '12px' },
    lg: { width: '48px', height: '24px', fontSize: '16px', iconSize: '14px' },
  };

  const handleChange = () => {
    if (!disabled) {
      const newLocked = !locked;
      if (controlledLocked === undefined) setInternalLocked(newLocked);
      onChange?.(newLocked);
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
          backgroundColor: disabled ? themeColors.surface : themeColors.background,
          border: `2px solid ${disabled ? '#666' : color}`,
          clipPath:
            'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: locked ? 'flex-start' : 'flex-end',
          padding: '2px',
          boxShadow: glow && !disabled ? `0 0 15px rgba(${rgb}, 0.6)` : 'none',
        }}
      >
        <div
          style={{ fontSize: sizeMap[size].iconSize, color, transition: 'all 200ms ease-in-out' }}
        >
          {locked ? '🔒' : '🔓'}
        </div>
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
        checked={locked}
        disabled={disabled}
        onChange={() => {}}
        style={{ display: 'none' }}
      />
    </label>
  );
};

export default ColdWarLockSwitch;
