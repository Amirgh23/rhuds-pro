/**
 * Cold War Terminal Selector Component
 * Theme selector with terminal preview
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarTerminalSelectorProps {
  onThemeChange?: (theme: string) => void;
  theme?: ThemeVariant;
  glow?: boolean;
  scanlines?: boolean;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

const TERMINAL_THEMES = [
  { id: 'green', color: '#33FF00', name: 'GREEN' },
  { id: 'amber', color: '#FFB000', name: 'AMBER' },
  { id: 'blue', color: '#00CCFF', name: 'BLUE' },
  { id: 'red', color: '#FF3333', name: 'RED' },
];

export const ColdWarTerminalSelector: React.FC<ColdWarTerminalSelectorProps> = ({
  onThemeChange,
  theme = 'perseus',
  glow = true,
  scanlines = false,
  className = '',
  style = {},
}) => {
  const [selectedTheme, setSelectedTheme] = useState('green');
  const themeColors = THEME_COLORS[theme];
  const techCode = generateTechCode('TERM');
  const currentColor = TERMINAL_THEMES.find((t) => t.id === selectedTheme)?.color || '#33FF00';
  const rgb = getRgbString(currentColor);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    onThemeChange?.(themeId);
  };

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '320px',
    padding: '16px',
    backgroundColor: themeColors.background,
    border: `2px solid ${currentColor}`,
    clipPath:
      'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
    overflow: 'hidden',
    ...style,
  };

  const terminalStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '180px',
    marginBottom: '16px',
    backgroundColor: themeColors.surface,
    border: `1px solid ${currentColor}`,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    padding: '12px',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '11px',
    color: currentColor,
    overflow: 'hidden',
    boxShadow: glow ? `inset 0 0 20px rgba(${rgb}, 0.2)` : 'none',
  };

  const selectorStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  };

  const dotStyle = (themeId: string): CSSProperties => {
    const isSelected = selectedTheme === themeId;
    const dotColor = TERMINAL_THEMES.find((t) => t.id === themeId)?.color || '#fff';
    const dotRgb = getRgbString(dotColor);

    return {
      width: '20px',
      height: '20px',
      backgroundColor: dotColor,
      border: isSelected ? `2px solid #fff` : `1px solid ${dotColor}`,
      clipPath:
        'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
      cursor: 'pointer',
      transition: 'all 200ms ease',
      boxShadow: isSelected ? `0 0 15px rgba(${dotRgb}, 0.8)` : 'none',
    };
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '8px',
    color: currentColor,
    opacity: 0.5,
    zIndex: 15,
  };

  return (
    <div className={className} style={containerStyle}>
      {scanlines && <ScanlinesOverlay intensity="medium" />}
      <span style={techCodeStyle}>{techCode}</span>
      <div style={terminalStyle}>
        <div style={{ marginBottom: '8px' }}>$ system.boot()</div>
        <div style={{ opacity: 0.7 }}>[ OK ] Kernel loaded</div>
        <div style={{ opacity: 0.7 }}>[ OK ] Network ready</div>
        <div style={{ marginTop: '8px' }}>$ echo "TACTICAL SYSTEM"</div>
        <div style={{ opacity: 0.7 }}>TACTICAL SYSTEM</div>
        <div style={{ marginTop: '8px' }}>$ _</div>
      </div>
      <div style={selectorStyle}>
        {TERMINAL_THEMES.map((t) => (
          <div
            key={t.id}
            style={dotStyle(t.id)}
            onClick={() => handleThemeChange(t.id)}
            title={t.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ColdWarTerminalSelector;
