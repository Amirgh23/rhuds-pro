/**
 * Cold War Notification Card Component
 * Tactical notification with timestamp
 */

import React, { CSSProperties } from 'react';
import {
  getRgbString,
  generateTechCode,
  getMilitaryTimestamp,
  ThemeVariant,
} from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarNotificationCardProps {
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

export const ColdWarNotificationCard: React.FC<ColdWarNotificationCardProps> = ({
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
  const techCode = generateTechCode('NOTIF');
  const displayTime = timestamp || getMilitaryTimestamp();

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '320px',
    height: '80px',
    padding: '12px 16px',
    backgroundColor: themeColors.surface,
    border: `2px solid ${cardColor}`,
    borderLeft: `4px solid ${cardColor}`,
    clipPath:
      'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 200ms ease',
    overflow: 'hidden',
    ...style,
  };

  const iconStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    width: '48px',
    height: '48px',
    flexShrink: 0,
    backgroundColor: themeColors.background,
    border: `1px solid ${cardColor}`,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: cardColor,
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
    letterSpacing: '0.03em',
    color: '#fff',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const messageStyle: CSSProperties = {
    fontSize: '11px',
    fontFamily: "'Share Tech Mono', monospace",
    color: '#999',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const timestampStyle: CSSProperties = {
    fontSize: '9px',
    fontFamily: "'Share Tech Mono', monospace",
    color: cardColor,
    opacity: 0.7,
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
      {scanlines && <ScanlinesOverlay intensity="low" />}
      <span style={techCodeStyle}>{techCode}</span>
      <div style={iconStyle}>📡</div>
      <div style={contentStyle}>
        <div style={titleStyle}>{title}</div>
        <div style={messageStyle}>{message}</div>
        <div style={timestampStyle}>{displayTime}</div>
      </div>
    </div>
  );
};

export default ColdWarNotificationCard;
