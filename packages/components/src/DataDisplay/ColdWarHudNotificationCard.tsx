/**
 * Cold War HUD Notification Card Component
 * Tactical HUD notification with corner brackets
 */

import React, { CSSProperties } from 'react';
import {
  getRgbString,
  generateTechCode,
  getMilitaryTimestamp,
  ThemeVariant,
} from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarHudNotificationCardProps {
  title?: string;
  message?: string;
  timestamp?: string;
  onClick?: () => void;
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

export const ColdWarHudNotificationCard: React.FC<ColdWarHudNotificationCardProps> = ({
  title = 'TACTICAL ALERT',
  message = 'New mission briefing available.',
  timestamp,
  onClick,
  theme = 'perseus',
  color = 'amber',
  glow = true,
  scanlines = false,
  className = '',
  style = {},
}) => {
  const themeColors = THEME_COLORS[theme];
  const cardColor = COLOR_MAP[color];
  const rgb = getRgbString(cardColor);
  const techCode = generateTechCode('HUD');
  const displayTime = timestamp || getMilitaryTimestamp();

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '320px',
    height: '80px',
    padding: '12px 16px',
    backgroundColor: themeColors.background,
    border: `2px solid ${cardColor}`,
    clipPath:
      'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 200ms ease',
    overflow: 'hidden',
    boxShadow: glow ? `0 0 20px rgba(${rgb}, 0.3), inset 0 0 20px rgba(${rgb}, 0.1)` : 'none',
    ...style,
  };

  const cornerStyle: CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    border: `2px solid ${cardColor}`,
    zIndex: 10,
  };

  const iconStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    width: '48px',
    height: '48px',
    flexShrink: 0,
    backgroundColor: themeColors.surface,
    border: `1px solid ${cardColor}`,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: cardColor,
    boxShadow: glow ? `0 0 10px rgba(${rgb}, 0.4)` : 'none',
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    flex: 1,
    overflow: 'hidden',
  };

  const titleStyle: CSSProperties = {
    fontSize: '14px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: cardColor,
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textShadow: glow ? `0 0 10px rgba(${rgb}, 0.5)` : 'none',
  };

  const messageStyle: CSSProperties = {
    fontSize: '11px',
    fontFamily: "'Share Tech Mono', monospace",
    color: '#ccc',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  };

  const timestampStyle: CSSProperties = {
    fontSize: '9px',
    fontFamily: "'Share Tech Mono', monospace",
    color: cardColor,
    opacity: 0.7,
    textTransform: 'uppercase',
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '4px',
    right: '8px',
    fontSize: '8px',
    color: cardColor,
    opacity: 0.5,
    zIndex: 15,
  };

  return (
    <div className={className} style={containerStyle} onClick={onClick}>
      {scanlines && <ScanlinesOverlay intensity="medium" />}
      <span style={techCodeStyle}>{techCode}</span>

      {/* Corner Brackets */}
      <div
        style={{
          ...cornerStyle,
          top: '4px',
          left: '4px',
          borderRight: 'none',
          borderBottom: 'none',
        }}
      />
      <div
        style={{
          ...cornerStyle,
          top: '4px',
          right: '4px',
          borderLeft: 'none',
          borderBottom: 'none',
        }}
      />
      <div
        style={{
          ...cornerStyle,
          bottom: '4px',
          left: '4px',
          borderRight: 'none',
          borderTop: 'none',
        }}
      />
      <div
        style={{
          ...cornerStyle,
          bottom: '4px',
          right: '4px',
          borderLeft: 'none',
          borderTop: 'none',
        }}
      />

      <div style={iconStyle}>📡</div>
      <div style={contentStyle}>
        <div style={titleStyle}>{title}</div>
        <div style={messageStyle}>{message}</div>
        <div style={timestampStyle}>{displayTime}</div>
      </div>
    </div>
  );
};

export default ColdWarHudNotificationCard;
