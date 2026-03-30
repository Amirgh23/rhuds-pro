/**
 * Cold War Radar Component
 * Tactical radar display with rotating scanner
 */

import React, { CSSProperties } from 'react';
import {
  getRgbString,
  generateTechCode,
  generateCoordinates,
  ThemeVariant,
} from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarRadarProps {
  coordinates?: string;
  depth?: string;
  wind?: string;
  targets?: number;
  theme?: ThemeVariant;
  color?: 'amber' | 'green' | 'blue' | 'red';
  glow?: boolean;
  scanlines?: boolean;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

const COLOR_MAP = { amber: '#FFB000', green: '#33FF00', blue: '#00CCFF', red: '#FF3333' };

export const ColdWarRadar: React.FC<ColdWarRadarProps> = ({
  coordinates,
  depth = 'DEPT - 600',
  wind = 'WIND - 54.3',
  targets = 2,
  theme = 'perseus',
  color = 'green',
  glow = true,
  scanlines = false,
  size = 280,
  className = '',
  style = {},
}) => {
  const themeColors = THEME_COLORS[theme];
  const radarColor = COLOR_MAP[color];
  const rgb = getRgbString(radarColor);
  const techCode = generateTechCode('RADAR');
  const displayCoords = coordinates || generateCoordinates();

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: `${size}px`,
    padding: '20px',
    backgroundColor: themeColors.background,
    border: `2px solid ${radarColor}`,
    clipPath:
      'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
    overflow: 'hidden',
    ...style,
  };

  const dataDisplayStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    marginBottom: '20px',
    padding: '12px',
    fontSize: '11px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    color: radarColor,
    textAlign: 'center',
    backgroundColor: themeColors.surface,
    border: `1px solid ${radarColor}`,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
  };

  const radarCardStyle: CSSProperties = {
    position: 'relative',
    width: `${size - 80}px`,
    height: `${size - 80}px`,
    margin: '0 auto',
    backgroundColor: themeColors.surface,
    border: `2px solid ${radarColor}`,
    borderRadius: '50%',
    overflow: 'hidden',
    boxShadow: glow ? `0 0 30px rgba(${rgb}, 0.4), inset 0 0 30px rgba(${rgb}, 0.1)` : 'none',
  };

  const circleStyle = (diameter: number): CSSProperties => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${diameter}px`,
    height: `${diameter}px`,
    border: `1px solid rgba(${rgb}, 0.3)`,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  });

  const scannerStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '2px',
    height: `${(size - 80) / 2}px`,
    backgroundColor: radarColor,
    transformOrigin: 'bottom center',
    animation: 'radarScan 3s linear infinite',
    boxShadow: `0 0 10px ${radarColor}`,
  };

  const dotStyle = (top: string, left: string, delay: number): CSSProperties => ({
    position: 'absolute',
    top,
    left,
    width: '6px',
    height: '6px',
    backgroundColor: radarColor,
    borderRadius: '50%',
    boxShadow: `0 0 10px ${radarColor}`,
    animation: `radarPulse 1.5s ${delay}s ease infinite`,
  });

  const infoStyle: CSSProperties = {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    right: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '9px',
    fontFamily: "'Share Tech Mono', monospace",
    color: radarColor,
    opacity: 0.7,
    zIndex: 10,
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '8px',
    color: radarColor,
    opacity: 0.5,
    zIndex: 15,
  };

  return (
    <>
      <style>
        {`
          @keyframes radarScan {
            0% { transform: translate(-50%, -100%) rotate(0deg); }
            100% { transform: translate(-50%, -100%) rotate(360deg); }
          }
          @keyframes radarPulse {
            0%, 85% { opacity: 0; transform: scale(1); }
            90% { opacity: 1; transform: scale(1.5); }
            100% { opacity: 0; transform: scale(1); }
          }
        `}
      </style>
      <div className={className} style={containerStyle}>
        {scanlines && <ScanlinesOverlay intensity="medium" />}
        <span style={techCodeStyle}>{techCode}</span>

        <div style={dataDisplayStyle}>{displayCoords}</div>

        <div style={radarCardStyle}>
          <div style={circleStyle((size - 80) / 2)} />
          <div style={circleStyle((size - 80) / 4)} />
          <div style={circleStyle((size - 80) * 0.75)} />
          <div style={scannerStyle} />
          {targets >= 1 && <div style={dotStyle('30%', '50%', 0)} />}
          {targets >= 2 && <div style={dotStyle('80%', '70%', 1.2)} />}
        </div>

        <div style={infoStyle}>
          <span>{depth}</span>
          <span>{wind}</span>
        </div>
      </div>
    </>
  );
};

export default ColdWarRadar;
