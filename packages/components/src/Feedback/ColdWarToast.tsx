/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR TOAST - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL TOAST MESSAGE - Lightweight notification component
 *
 * FEATURES:
 * - Compact toast message display
 * - Variant types (info, success, warning, danger)
 * - Auto-dismiss with progress indicator
 * - Animated entry/exit
 * - Pause on hover
 * - Scanlines and glow effects
 * - Corner brackets and tech overlays
 * - ARIA accessibility support
 */

import React, { ReactNode, CSSProperties, useState, useEffect } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface ColdWarToastProps {
  variant?: ToastVariant;
  message: ReactNode;
  icon?: ReactNode;
  duration?: number;
  closable?: boolean;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  showProgress?: boolean;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarToast: React.FC<ColdWarToastProps> = ({
  variant = 'info',
  message,
  icon,
  duration = 3000,
  closable = true,
  theme = 'perseus',
  scanlines = false,
  scanlinesIntensity = 'low',
  glow = true,
  showTechCode = false,
  showProgress = true,
  onClose,
  className = '',
  style = {},
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const [techCode] = React.useState(() => generateTechCode('TST'));

  const themeColors = THEME_VARIANTS[theme];

  const variantMap = {
    info: { color: themeColors.accent, rgb: '0, 204, 255', icon: 'ℹ' },
    success: { color: themeColors.success, rgb: '51, 255, 0', icon: '✓' },
    warning: { color: themeColors.warning, rgb: '255, 176, 0', icon: '⚠' },
    danger: { color: themeColors.error, rgb: '255, 51, 51', icon: '✗' },
  };
  const colors = variantMap[variant];

  useEffect(() => {
    if (!duration || isPaused) return;

    const interval = 50;
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement;
        if (next <= 0) {
          handleClose();
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, isPaused]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const toastStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    minWidth: '280px',
    maxWidth: '400px',
    background: 'rgba(10, 10, 20, 0.98)',
    border: `2px solid ${colors.color}`,
    borderLeft: `3px solid ${colors.color}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `
      0 4px 16px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(${colors.rgb}, 0.3)
    `,
    animation: isVisible ? 'toast-slide-in 0.3s ease-out' : 'toast-slide-out 0.3s ease-in',
    ...style,
  };

  const iconStyles: CSSProperties = {
    fontSize: '18px',
    color: colors.color,
    flexShrink: 0,
    textShadow: glow ? `0 0 8px ${colors.color}` : 'none',
  };

  const messageStyles: CSSProperties = {
    flex: 1,
    fontSize: '12px',
    letterSpacing: '0.02em',
    color: themeColors.text,
    lineHeight: 1.4,
  };

  const closeButtonStyles: CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.color,
    fontSize: '14px',
    cursor: 'pointer',
    padding: '0',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    opacity: 0.7,
  };

  const progressBarStyles: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '2px',
    width: `${progress}%`,
    background: `linear-gradient(90deg, ${colors.color}, rgba(${colors.rgb}, 0.5))`,
    transition: 'width 50ms linear',
    boxShadow: glow ? `0 0 6px ${colors.color}` : 'none',
    zIndex: 7,
  };

  const techCodeStyles: CSSProperties = {
    position: 'absolute',
    top: '3px',
    right: closable ? '36px' : '8px',
    fontSize: '7px',
    color: colors.color,
    opacity: 0.3,
    letterSpacing: '0.05em',
    zIndex: 4,
  };

  return (
    <div
      className={className}
      style={toastStyles}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="polite"
    >
      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={colors.color} intensity="low" />}

      {/* Corner brackets */}
      <div
        style={{
          position: 'absolute',
          top: '3px',
          left: '3px',
          width: '6px',
          height: '6px',
          borderTop: `1px solid ${colors.color}`,
          borderLeft: `1px solid ${colors.color}`,
          opacity: 0.5,
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '3px',
          right: '3px',
          width: '6px',
          height: '6px',
          borderBottom: `1px solid ${colors.color}`,
          borderRight: `1px solid ${colors.color}`,
          opacity: 0.5,
          zIndex: 4,
        }}
      />

      {/* Tech code */}
      {showTechCode && <div style={techCodeStyles}>{techCode}</div>}

      <div style={iconStyles}>{icon || colors.icon}</div>

      <div style={messageStyles}>{message}</div>

      {closable && (
        <button onClick={handleClose} style={closeButtonStyles} aria-label="Close toast">
          ✕
        </button>
      )}

      {showProgress && duration && <div style={progressBarStyles} />}

      <style>
        {`
          @keyframes toast-slide-in {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes toast-slide-out {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-20px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ColdWarToast;
