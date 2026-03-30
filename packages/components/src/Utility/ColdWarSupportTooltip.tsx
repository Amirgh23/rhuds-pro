/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR SUPPORT TOOLTIP - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Adapted from CyberSupportTooltip with Cold War aesthetic
 */

import React, { useState, ReactNode, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';

export interface ColdWarSupportLink {
  label: string;
  url: string;
  icon?: string;
}

export interface ColdWarSupportTooltipProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  title?: string;
  description: string;
  links?: ColdWarSupportLink[];
  placement?: 'top' | 'bottom' | 'left' | 'right';
  glow?: boolean;
  showCorners?: boolean;
  children: ReactNode;
  className?: string;
}

export const ColdWarSupportTooltip: React.FC<ColdWarSupportTooltipProps> = ({
  theme = 'perseus',
  title = 'SUPPORT',
  description,
  links = [],
  placement = 'top',
  glow = true,
  showCorners = true,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [techCode] = useState(() => generateTechCode('SUP'));
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const getTooltipPosition = (): CSSProperties => {
    const baseStyles: CSSProperties = { position: 'absolute', zIndex: 1000 };
    switch (placement) {
      case 'top':
        return {
          ...baseStyles,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '12px',
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '12px',
        };
      case 'left':
        return {
          ...baseStyles,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '12px',
        };
      case 'right':
        return {
          ...baseStyles,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '12px',
        };
      default:
        return baseStyles;
    }
  };

  const tooltipStyles: CSSProperties = {
    ...getTooltipPosition(),
    minWidth: '250px',
    maxWidth: '350px',
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    background: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(${rgb}, 0.03) 2px,
        rgba(${rgb}, 0.03) 4px
      ),
      linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100())
    `,
    border: `1px solid rgba(${rgb}, 0.5)`,
    boxShadow: glow
      ? `
        inset 0 0 30px rgba(0, 0, 0, 0.6),
        inset 0 0 10px rgba(${rgb}, 0.1),
        0 0 20px rgba(${rgb}, 0.4),
        0 8px 16px rgba(0, 0, 0, 0.5)
      `
      : `inset 0 0 30px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.5)`,
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    pointerEvents: isVisible ? 'auto' : 'none',
  };

  const headerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderBottom: `1px solid rgba(${rgb}, 0.3)`,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    background: `rgba(${rgb}, 0.1)`,
  };

  const contentStyles: CSSProperties = {
    padding: '12px',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '12px',
    lineHeight: '1.6',
    color: themeColors.text,
  };

  const linkStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    marginTop: '8px',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    background: `rgba(${rgb}, 0.1)`,
    border: `1px solid rgba(${rgb}, 0.3)`,
    textDecoration: 'none',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    cursor: 'pointer',
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      className={className}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div style={tooltipStyles}>
        {/* Header */}
        <div style={headerStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: themeColors.primary,
                boxShadow: `0 0 6px ${themeColors.primary}`,
                animation: 'led-pulse 1s ease-in-out infinite',
              }}
            />
            <span>{title}</span>
          </div>
          <span style={{ fontSize: '8px', opacity: 0.5 }}>{techCode}</span>
        </div>

        {/* Content */}
        <div style={contentStyles}>{description}</div>

        {/* Links */}
        {links.length > 0 && (
          <div style={{ padding: '0 12px 12px' }}>
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyles}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(${rgb}, 0.2)`;
                  e.currentTarget.style.boxShadow = `0 0 10px rgba(${rgb}, 0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `rgba(${rgb}, 0.1)`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {link.icon && <span>{link.icon}</span>}
                <span>{link.label}</span>
                <span style={{ marginLeft: 'auto' }}>→</span>
              </a>
            ))}
          </div>
        )}

        {/* Corner Brackets */}
        {showCorners && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                width: '8px',
                height: '8px',
                borderTop: `1px solid ${themeColors.primary}`,
                borderLeft: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderTop: `1px solid ${themeColors.primary}`,
                borderRight: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '4px',
                left: '4px',
                width: '8px',
                height: '8px',
                borderBottom: `1px solid ${themeColors.primary}`,
                borderLeft: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderBottom: `1px solid ${themeColors.primary}`,
                borderRight: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
          </>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes led-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ColdWarSupportTooltip;
