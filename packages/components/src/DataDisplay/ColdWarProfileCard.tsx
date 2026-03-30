/**
 * Cold War Profile Card Component
 * Tactical profile card with glitch effects
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarProfileCardProps {
  username?: string;
  title?: string;
  repositories?: number;
  followers?: string;
  profileUrl?: string;
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

export const ColdWarProfileCard: React.FC<ColdWarProfileCardProps> = ({
  username = 'OPERATIVE',
  title = 'FIELD AGENT',
  repositories = 128,
  followers = '42K',
  profileUrl = '#',
  theme = 'perseus',
  color = 'amber',
  glow = true,
  scanlines = false,
  className = '',
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const themeColors = THEME_COLORS[theme];
  const cardColor = COLOR_MAP[color];
  const rgb = getRgbString(cardColor);
  const techCode = generateTechCode('PROF');

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '280px',
    padding: '24px',
    backgroundColor: themeColors.background,
    border: `2px solid ${cardColor}`,
    clipPath:
      'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
    overflow: 'hidden',
    ...style,
  };

  const avatarStyle: CSSProperties = {
    position: 'relative',
    width: '80px',
    height: '80px',
    margin: '0 auto 16px',
    backgroundColor: themeColors.surface,
    border: `2px solid ${cardColor}`,
    clipPath:
      'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: cardColor,
    boxShadow: glow ? `0 0 20px rgba(${rgb}, 0.4)` : 'none',
  };

  const usernameStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    fontSize: '18px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '4px',
  };

  const titleStyle: CSSProperties = {
    fontSize: '12px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: cardColor,
    textAlign: 'center',
    marginBottom: '20px',
    opacity: 0.8,
  };

  const statsStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '16px 0',
    borderTop: `1px solid rgba(${rgb}, 0.3)`,
    borderBottom: `1px solid rgba(${rgb}, 0.3)`,
    marginBottom: '16px',
  };

  const statStyle: CSSProperties = {
    textAlign: 'center',
  };

  const statLabelStyle: CSSProperties = {
    fontSize: '10px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#666',
    marginBottom: '4px',
  };

  const statValueStyle: CSSProperties = {
    fontSize: '20px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 700,
    color: cardColor,
  };

  const buttonStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    padding: '10px',
    fontSize: '12px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: themeColors.background,
    backgroundColor: cardColor,
    border: 'none',
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    textDecoration: 'none',
    display: 'block',
    textAlign: 'center',
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
    <div
      className={className}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {scanlines && <ScanlinesOverlay intensity="medium" />}
      {glow && <GlowOverlay color={cardColor} intensity="low" />}
      <span style={techCodeStyle}>{techCode}</span>
      <div style={avatarStyle}>👤</div>
      <div style={usernameStyle}>{username}</div>
      <div style={titleStyle}>{title}</div>
      <div style={statsStyle}>
        <div style={statStyle}>
          <div style={statLabelStyle}>MISSIONS</div>
          <div style={statValueStyle}>{repositories}</div>
        </div>
        <div style={statStyle}>
          <div style={statLabelStyle}>CONTACTS</div>
          <div style={statValueStyle}>{followers}</div>
        </div>
      </div>
      <a href={profileUrl} style={buttonStyle}>
        VIEW PROFILE
      </a>
    </div>
  );
};

export default ColdWarProfileCard;
