/**
 * Cold War Amplifier Component
 * Tactical amplifier control panel
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarAmplifierProps {
  brandName?: string;
  isPowered?: boolean;
  leftChannelLevel?: number;
  rightChannelLevel?: number;
  volume?: number;
  tone?: number;
  onPowerToggle?: (isPowered: boolean) => void;
  onVolumeChange?: (volume: number) => void;
  onToneChange?: (tone: number) => void;
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

export const ColdWarAmplifier: React.FC<ColdWarAmplifierProps> = ({
  brandName = 'TACTICAL AUDIO 900',
  isPowered = false,
  leftChannelLevel = 45,
  rightChannelLevel = 55,
  volume = 50,
  tone = 50,
  onPowerToggle,
  theme = 'perseus',
  color = 'amber',
  glow = true,
  scanlines = false,
  className = '',
  style = {},
}) => {
  const [localPowered, setLocalPowered] = useState(isPowered);
  const themeColors = THEME_COLORS[theme];
  const ampColor = COLOR_MAP[color];
  const rgb = getRgbString(ampColor);
  const techCode = generateTechCode('AMP');

  const handlePowerToggle = () => {
    const newState = !localPowered;
    setLocalPowered(newState);
    onPowerToggle?.(newState);
  };

  const getNeedleRotation = (level: number) => -45 + (level / 100) * 65;

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '380px',
    padding: '24px',
    backgroundColor: themeColors.background,
    border: `2px solid ${ampColor}`,
    clipPath:
      'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
    overflow: 'hidden',
    ...style,
  };

  const metersStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '24px',
  };

  const meterStyle: CSSProperties = {
    width: '100px',
    height: '80px',
    backgroundColor: themeColors.surface,
    border: `1px solid ${ampColor}`,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const needleStyle = (level: number): CSSProperties => ({
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    width: '2px',
    height: '60px',
    backgroundColor: '#FF3333',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${getNeedleRotation(level)}deg)`,
    transition: 'transform 300ms ease',
    boxShadow: '0 0 5px #FF3333',
  });

  const labelStyle: CSSProperties = {
    position: 'absolute',
    bottom: '25px',
    width: '100%',
    textAlign: 'center',
    fontSize: '10px',
    fontFamily: "'Share Tech Mono', monospace",
    color: ampColor,
    textTransform: 'uppercase',
  };

  const controlsStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const knobStyle: CSSProperties = {
    width: '60px',
    height: '60px',
    backgroundColor: themeColors.surface,
    border: `2px solid ${ampColor}`,
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontFamily: "'Share Tech Mono', monospace",
    color: ampColor,
    textTransform: 'uppercase',
    boxShadow: glow ? `0 0 15px rgba(${rgb}, 0.3)` : 'none',
  };

  const powerStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    backgroundColor: localPowered ? ampColor : themeColors.surface,
    border: `2px solid ${ampColor}`,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    color: localPowered ? themeColors.background : ampColor,
    boxShadow: localPowered && glow ? `0 0 20px rgba(${rgb}, 0.8)` : 'none',
  };

  const brandStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    fontSize: '14px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: ampColor,
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '8px',
    color: ampColor,
    opacity: 0.5,
    zIndex: 15,
  };

  return (
    <div className={className} style={containerStyle}>
      {scanlines && <ScanlinesOverlay intensity="medium" />}
      <span style={techCodeStyle}>{techCode}</span>

      <div style={metersStyle}>
        <div style={meterStyle}>
          <div style={needleStyle(leftChannelLevel)} />
          <div style={labelStyle}>L . CH</div>
        </div>
        <div style={meterStyle}>
          <div style={needleStyle(rightChannelLevel)} />
          <div style={labelStyle}>R . CH</div>
        </div>
      </div>

      <div style={controlsStyle}>
        <div style={knobStyle}>
          VOL
          <br />
          {volume}
        </div>
        <div style={powerStyle} onClick={handlePowerToggle}>
          ⚡
        </div>
        <div style={knobStyle}>
          TONE
          <br />
          {tone}
        </div>
      </div>

      <div style={brandStyle}>{brandName}</div>
    </div>
  );
};

export default ColdWarAmplifier;
