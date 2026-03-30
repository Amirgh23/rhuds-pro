/**
 * Cold War Alert
 * Tactical alert/notification component with military aesthetic
 */

import React, { ReactNode, CSSProperties, useState } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, getMilitaryTimestamp } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface ColdWarAlertProps {
  variant?: AlertVariant;
  title?: string;
  message: ReactNode;
  icon?: ReactNode;
  closable?: boolean;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  glow?: boolean;
  showTimestamp?: boolean;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarAlert: React.FC<ColdWarAlertProps> = ({
  variant = 'info',
  title,
  message,
  icon,
  closable = true,
  theme = 'perseus',
  scanlines = true,
  glow = true,
  showTimestamp = true,
  onClose,
  className = '',
  style = {},
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timestamp] = useState(() => getMilitaryTimestamp());

  const themeColors = THEME_VARIANTS[theme];

  const variantMap = {
    info: { color: themeColors.accent, rgb: '0, 204, 255', icon: 'ℹ' },
    success: { color: themeColors.success, rgb: '51, 255, 0', icon: '✓' },
    warning: { color: themeColors.warning, rgb: '255, 176, 0', icon: '⚠' },
    danger: { color: themeColors.error, rgb: '255, 51, 51', icon: '✗' },
  };
  const colors = variantMap[variant];

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const baseStyles: CSSProperties = {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    background: `rgba(10, 10, 20, 0.95)`,
    border: `2px solid ${colors.color}`,
    borderLeft: `4px solid ${colors.color}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    boxShadow: glow ? `0 0 20px rgba(${colors.rgb}, 0.3)` : 'none',
    ...style,
  };

  const iconStyles: CSSProperties = {
    fontSize: '20px',
    color: colors.color,
    flexShrink: 0,
    textShadow: glow ? `0 0 8px ${colors.color}` : 'none',
  };

  const contentStyles: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const titleStyles: CSSProperties = {
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: colors.color,
    margin: 0,
  };

  const messageStyles: CSSProperties = {
    fontSize: '12px',
    letterSpacing: '0.02em',
    color: themeColors.text,
    margin: 0,
  };

  const timestampStyles: CSSProperties = {
    fontSize: '10px',
    color: themeColors.textSecondary,
    opacity: 0.6,
    marginTop: '4px',
  };

  const closeButtonStyles: CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.color,
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
  };

  return (
    <div className={className} style={baseStyles}>
      {scanlines && <ScanlinesOverlay intensity="low" />}
      {glow && <GlowOverlay color={colors.color} intensity="low" />}

      <div style={iconStyles}>{icon || colors.icon}</div>

      <div style={contentStyles}>
        {title && <h4 style={titleStyles}>{title}</h4>}
        <div style={messageStyles}>{message}</div>
        {showTimestamp && <div style={timestampStyles}>{timestamp}</div>}
      </div>

      {closable && (
        <button onClick={handleClose} style={closeButtonStyles} aria-label="Close alert">
          ✕
        </button>
      )}
    </div>
  );
};

export default ColdWarAlert;
