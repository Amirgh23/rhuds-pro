/**
 * Cold War Thermostat Card Component
 * Tactical temperature control with vertical slider
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarThermostatCardProps {
  temperature?: number;
  minTemp?: number;
  maxTemp?: number;
  label?: string;
  status?: string;
  onChange?: (temp: number) => void;
  theme?: ThemeVariant;
  color?: 'amber' | 'green' | 'blue' | 'red';
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

const COLOR_MAP = { amber: '#FFB000', green: '#33FF00', blue: '#00CCFF', red: '#FF3333' };

export const ColdWarThermostatCard: React.FC<ColdWarThermostatCardProps> = ({
  temperature = 70,
  minTemp = 30,
  maxTemp = 110,
  label = 'CURRENT',
  status = 'OPTIMAL',
  onChange,
  theme = 'perseus',
  color = 'amber',
  glow = true,
  scanlines = false,
  className = '',
  style = {},
}) => {
  const [currentTemp, setCurrentTemp] = useState(temperature);
  const themeColors = THEME_COLORS[theme];
  const cardColor = COLOR_MAP[color];
  const rgb = getRgbString(cardColor);
  const techCode = generateTechCode('THERM');
  const tempRange = maxTemp - minTemp;
  const tempPercent = ((currentTemp - minTemp) / tempRange) * 100;

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '180px',
    padding: '16px',
    backgroundColor: themeColors.background,
    border: `2px solid ${cardColor}`,
    clipPath:
      'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
    overflow: 'hidden',
    ...style,
  };

  const thermostatStyle: CSSProperties = {
    position: 'relative',
    width: '60px',
    height: '200px',
    margin: '0 auto 16px',
    backgroundColor: themeColors.surface,
    border: `1px solid rgba(${rgb}, 0.3)`,
    borderRadius: '30px',
    overflow: 'hidden',
  };

  const trackStyle: CSSProperties = {
    position: 'absolute',
    top: '20px',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '16px',
    backgroundColor: themeColors.surface,
    border: `1px solid rgba(${rgb}, 0.2)`,
    borderRadius: '8px',
  };

  const mercuryStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: `${tempPercent}%`,
    backgroundColor: cardColor,
    boxShadow: glow ? `0 0 15px rgba(${rgb}, 0.6)` : 'none',
    transition: 'height 300ms ease',
    borderRadius: '0 0 8px 8px',
  };

  const readoutStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
  };

  const tempValueStyle: CSSProperties = {
    fontSize: '32px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 700,
    color: cardColor,
    textShadow: glow ? `0 0 10px rgba(${rgb}, 0.6)` : 'none',
  };

  const labelStyle: CSSProperties = {
    fontSize: '10px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#666',
    marginTop: '4px',
  };

  const statusStyle: CSSProperties = {
    fontSize: '12px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: cardColor,
    marginTop: '8px',
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '8px',
    color: cardColor,
    opacity: 0.5,
    zIndex: 15,
  };

  return (
    <div className={className} style={containerStyle}>
      {scanlines && <ScanlinesOverlay intensity="medium" />}
      <span style={techCodeStyle}>{techCode}</span>
      <div style={thermostatStyle}>
        <div style={trackStyle}>
          <div style={mercuryStyle} />
        </div>
      </div>
      <div style={readoutStyle}>
        <div style={tempValueStyle}>{currentTemp}°</div>
        <div style={labelStyle}>{label}</div>
        <div style={statusStyle}>{status}</div>
      </div>
    </div>
  );
};

export default ColdWarThermostatCard;
