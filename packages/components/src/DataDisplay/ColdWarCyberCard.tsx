/**
 * Cold War Cyber Card Component
 * Tactical card with animated borders and glitch effects
 */

import React, { CSSProperties } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarCyberCardProps {
  title?: string;
  footer?: string;
  children?: React.ReactNode;
  theme?: ThemeVariant;
  color?: 'amber' | 'green' | 'blue' | 'red';
  glow?: boolean;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

const COLOR_MAP = { amber: '#FFB000', green: '#33FF00', blue: '#00CCFF', red: '#FF3333' };

export const ColdWarCyberCard: React.FC<ColdWarCyberCardProps> = ({
  title,
  footer,
  children,
  theme = 'perseus',
  color = 'amber',
  glow = true,
  scanlines = false,
  scanlinesIntensity = 'medium',
  className = '',
  style = {},
}) => {
  const themeColors = THEME_COLORS[theme];
  const cardColor = COLOR_MAP[color];
  const rgb = getRgbString(cardColor);
  const techCode = generateTechCode('CYBER');

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '320px',
    aspectRatio: '9/16',
    backgroundColor: themeColors.background,
    border: `2px solid ${cardColor}`,
    clipPath:
      'polygon(0 0, 85% 0, 100% 14%, 100% 60%, 92% 65%, 93% 77%, 99% 80%, 99% 90%, 89% 100%, 0 100%)',
    overflow: 'hidden',
    ...style,
  };

  const titleStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: cardColor,
    textAlign: 'right',
    background: `linear-gradient(90deg, transparent 0%, rgba(${rgb}, 0.2) 27%, rgba(${rgb}, 0.2) 63%, transparent 100%)`,
    borderBottom: `1px solid rgba(${rgb}, 0.3)`,
  };

  const bodyStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: 1,
  };

  const footerStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    padding: '12px 16px',
    fontSize: '10px',
    fontFamily: "'Share Tech Mono', monospace",
    color: cardColor,
    textAlign: 'right',
    borderTop: `1px solid rgba(${rgb}, 0.3)`,
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    left: '8px',
    fontSize: '8px',
    color: cardColor,
    opacity: 0.5,
    zIndex: 15,
  };

  return (
    <div className={className} style={containerStyle}>
      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={cardColor} intensity="medium" />}
      <span style={techCodeStyle}>{techCode}</span>
      {title && <div style={titleStyle}>{title}</div>}
      <div style={bodyStyle}>{children}</div>
      {footer && <div style={footerStyle}>{footer}</div>}
    </div>
  );
};

export default ColdWarCyberCard;
