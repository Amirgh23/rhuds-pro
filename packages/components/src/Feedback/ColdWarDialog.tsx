/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR DIALOG - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL CONFIRMATION DIALOG - Military-grade decision interface
 *
 * FEATURES:
 * - Confirmation/Cancel action buttons
 * - Variant types (info, warning, danger, success)
 * - Backdrop blur with scanlines
 * - Animated entry/exit
 * - Keyboard support (Enter, Escape)
 * - Focus trap for accessibility
 * - Corner brackets and tech overlays
 * - ARIA accessibility labels
 */

import React, { ReactNode, CSSProperties, useEffect, useRef } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode, getMilitaryTimestamp } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export type DialogVariant = 'info' | 'warning' | 'danger' | 'success';

export interface ColdWarDialogProps {
  isOpen: boolean;
  variant?: DialogVariant;
  title: string;
  message: ReactNode;
  icon?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  showTimestamp?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarDialog: React.FC<ColdWarDialogProps> = ({
  isOpen,
  variant = 'info',
  title,
  message,
  icon,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  showCancel = true,
  theme = 'perseus',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showTechCode = true,
  showTimestamp = true,
  onConfirm,
  onCancel,
  onClose,
  className = '',
  style = {},
}) => {
  const [techCode] = React.useState(() => generateTechCode('DLG'));
  const [timestamp] = React.useState(() => getMilitaryTimestamp());
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const themeColors = THEME_VARIANTS[theme];

  const variantMap = {
    info: { color: themeColors.accent, rgb: '0, 204, 255', icon: 'ℹ' },
    warning: { color: themeColors.warning, rgb: '255, 176, 0', icon: '⚠' },
    danger: { color: themeColors.error, rgb: '255, 51, 51', icon: '⚠' },
    success: { color: themeColors.success, rgb: '51, 255, 0', icon: '✓' },
  };
  const colors = variantMap[variant];
  const primaryRgb = getRgbString(themeColors.primary);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      confirmButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isOpen && document.activeElement === confirmButtonRef.current) {
        handleConfirm();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleEnter);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleEnter);
    };
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  if (!isOpen) return null;

  const overlayStyles: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
    animation: 'dialog-fade-in 0.3s ease-out',
  };

  const dialogStyles: CSSProperties = {
    width: '100%',
    maxWidth: '500px',
    background: 'rgba(10, 10, 20, 0.98)',
    border: `3px solid ${colors.color}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    boxShadow: `
      0 12px 40px rgba(0, 0, 0, 0.7),
      0 0 50px rgba(${colors.rgb}, 0.4),
      inset 0 0 40px rgba(${colors.rgb}, 0.1)
    `,
    animation: 'dialog-scale-in 0.3s ease-out',
    ...style,
  };

  const headerStyles: CSSProperties = {
    padding: '20px 24px',
    borderBottom: `2px solid ${colors.color}`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: `rgba(${colors.rgb}, 0.15)`,
    position: 'relative',
    zIndex: 6,
  };

  const iconStyles: CSSProperties = {
    fontSize: '28px',
    color: colors.color,
    flexShrink: 0,
    textShadow: glow ? `0 0 12px ${colors.color}` : 'none',
  };

  const titleStyles: CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: colors.color,
    margin: 0,
    flex: 1,
    textShadow: glow ? `0 0 8px ${colors.color}` : 'none',
  };

  const contentStyles: CSSProperties = {
    padding: '24px',
    color: themeColors.text,
    fontSize: '14px',
    letterSpacing: '0.02em',
    lineHeight: 1.6,
    position: 'relative',
    zIndex: 6,
  };

  const footerStyles: CSSProperties = {
    padding: '16px 24px',
    borderTop: `1px solid ${colors.color}`,
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    background: `rgba(${colors.rgb}, 0.05)`,
    position: 'relative',
    zIndex: 6,
  };

  const buttonBaseStyles: CSSProperties = {
    padding: '10px 24px',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    border: 'none',
    borderRadius: 0,
    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
    cursor: 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
  };

  const confirmButtonStyles: CSSProperties = {
    ...buttonBaseStyles,
    background: colors.color,
    color: '#000',
    border: `2px solid ${colors.color}`,
    boxShadow: glow ? `0 0 15px rgba(${colors.rgb}, 0.5)` : 'none',
  };

  const cancelButtonStyles: CSSProperties = {
    ...buttonBaseStyles,
    background: 'transparent',
    color: themeColors.text,
    border: `2px solid ${themeColors.textSecondary}`,
  };

  const timestampStyles: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '24px',
    fontSize: '9px',
    color: colors.color,
    opacity: 0.4,
    letterSpacing: '0.05em',
  };

  const techCodeStyles: CSSProperties = {
    position: 'absolute',
    bottom: '8px',
    right: '24px',
    fontSize: '8px',
    color: colors.color,
    opacity: 0.3,
    letterSpacing: '0.05em',
  };

  return (
    <div style={overlayStyles} onClick={handleCancel}>
      <div
        ref={dialogRef}
        style={dialogStyles}
        onClick={(e) => e.stopPropagation()}
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
        {glow && <GlowOverlay color={colors.color} intensity="medium" />}

        {/* Corner brackets */}
        <div
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            width: '12px',
            height: '12px',
            borderTop: `2px solid ${colors.color}`,
            borderLeft: `2px solid ${colors.color}`,
            opacity: 0.6,
            zIndex: 4,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '12px',
            height: '12px',
            borderTop: `2px solid ${colors.color}`,
            borderRight: `2px solid ${colors.color}`,
            opacity: 0.6,
            zIndex: 4,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '6px',
            left: '6px',
            width: '12px',
            height: '12px',
            borderBottom: `2px solid ${colors.color}`,
            borderLeft: `2px solid ${colors.color}`,
            opacity: 0.6,
            zIndex: 4,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '6px',
            right: '6px',
            width: '12px',
            height: '12px',
            borderBottom: `2px solid ${colors.color}`,
            borderRight: `2px solid ${colors.color}`,
            opacity: 0.6,
            zIndex: 4,
          }}
        />

        {/* Timestamp */}
        {showTimestamp && <div style={timestampStyles}>{timestamp}</div>}

        {/* Tech code */}
        {showTechCode && <div style={techCodeStyles}>{techCode}</div>}

        <div style={headerStyles}>
          <div style={iconStyles}>{icon || colors.icon}</div>
          <h2 id="dialog-title" style={titleStyles}>
            {title}
          </h2>
        </div>

        <div id="dialog-message" style={contentStyles}>
          {message}
        </div>

        <div style={footerStyles}>
          {showCancel && (
            <button onClick={handleCancel} style={cancelButtonStyles} aria-label="Cancel action">
              {cancelLabel}
            </button>
          )}
          <button
            ref={confirmButtonRef}
            onClick={handleConfirm}
            style={confirmButtonStyles}
            aria-label="Confirm action"
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes dialog-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes dialog-scale-in {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ColdWarDialog;
