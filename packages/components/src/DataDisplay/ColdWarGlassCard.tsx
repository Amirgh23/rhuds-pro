/**
 * Cold War Glass Card Component
 * Tactical card with glass morphism effect
 */

import React, { CSSProperties } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarGlassCardProps {
  title?: string;
  body?: string | string[];
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
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

export const ColdWarGlassCard: React.FC<ColdWarGlassCardProps> = ({
  title = 'TACTICAL BRIEFING',
  body = 'Mission parameters and operational details.',
  primaryButtonText = 'CONFIRM',
  secondaryButtonText = 'CANCEL',
  onPrimaryClick,
  onSecondaryClick,
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
  const techCode = generateTechCode('GLASS');
  const bodyContent = Array.isArray(body) ? body : [body];

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '280px',
    padding: '24px',
    backgroundColor: `rgba(${getRgbString(themeColors.surface)}, 0.6)`,
    backdropFilter: 'blur(12px)',
    border: `2px solid ${cardColor}`,
    borderTop: `2px solid rgba(${rgb}, 0.5)`,
    borderLeft: `2px solid rgba(${rgb}, 0.5)`,
    clipPath:
      'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
    boxShadow: glow ? `0 0 20px rgba(${rgb}, 0.3), inset 0 0 20px rgba(${rgb}, 0.1)` : 'none',
    transition: 'all 300ms ease',
    overflow: 'hidden',
    ...style,
  };

  const titleStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    fontSize: '16px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: cardColor,
    marginBottom: '16px',
    textAlign: 'center',
  };

  const bodyStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    fontSize: '12px',
    fontFamily: "'Share Tech Mono', monospace",
    color: '#ccc',
    marginBottom: '20px',
    lineHeight: 1.6,
  };

  const footerStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  };

  const buttonStyle = (isPrimary: boolean): CSSProperties => ({
    padding: '8px 16px',
    fontSize: '12px',
    fontFamily: "'Share Tech Mono', monospace",
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: isPrimary ? themeColors.background : cardColor,
    backgroundColor: isPrimary ? cardColor : 'transparent',
    border: `1px solid ${cardColor}`,
    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
    cursor: 'pointer',
    transition: 'all 200ms ease',
  });

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
      <div style={titleStyle}>{title}</div>
      <div style={bodyStyle}>
        {bodyContent.map((paragraph, index) => (
          <p key={index} style={{ margin: '0 0 8px 0' }}>
            {paragraph}
          </p>
        ))}
      </div>
      <div style={footerStyle}>
        <button style={buttonStyle(true)} onClick={onPrimaryClick}>
          {primaryButtonText}
        </button>
        <button style={buttonStyle(false)} onClick={onSecondaryClick}>
          {secondaryButtonText}
        </button>
      </div>
    </div>
  );
};

export default ColdWarGlassCard;
