/**
 * Cold War Modal
 * Tactical modal dialog with military aesthetic
 */

import React, { ReactNode, CSSProperties, useEffect } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  glow?: boolean;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarModal: React.FC<ColdWarModalProps> = ({
  isOpen,
  title,
  children,
  footer,
  theme = 'perseus',
  scanlines = true,
  glow = true,
  closable = true,
  onClose,
  className = '',
  style = {},
}) => {
  const [modalCode] = React.useState(() => generateTechCode('MDL'));

  const themeColors = THEME_VARIANTS[theme];
  const primaryRgb = getRgbString(themeColors.primary);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closable && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closable, onClose]);

  if (!isOpen) return null;

  const overlayStyles: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalStyles: CSSProperties = {
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    background: 'rgba(10, 10, 20, 0.95)',
    border: `2px solid ${themeColors.primary}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.6),
      0 0 40px rgba(${primaryRgb}, 0.3)
    `,
    ...style,
  };

  const headerStyles: CSSProperties = {
    padding: '16px 20px',
    borderBottom: `2px solid ${themeColors.primary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: `rgba(${primaryRgb}, 0.1)`,
  };

  const titleStyles: CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    margin: 0,
    textShadow: glow ? `0 0 8px ${themeColors.primary}` : 'none',
  };

  const closeButtonStyles: CSSProperties = {
    background: 'none',
    border: `1px solid ${themeColors.primary}`,
    color: themeColors.primary,
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px 8px',
    clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
  };

  const contentStyles: CSSProperties = {
    padding: '20px',
    flex: 1,
    overflowY: 'auto',
    color: themeColors.text,
    fontSize: '14px',
    letterSpacing: '0.02em',
  };

  const footerStyles: CSSProperties = {
    padding: '16px 20px',
    borderTop: `1px solid ${themeColors.primary}`,
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  };

  const codeStyles: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: closable ? '60px' : '20px',
    fontSize: '9px',
    color: themeColors.primary,
    opacity: 0.4,
    letterSpacing: '0.05em',
  };

  return (
    <div style={overlayStyles} onClick={closable ? onClose : undefined}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()} className={className}>
        {scanlines && <ScanlinesOverlay intensity="medium" />}
        {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

        <div style={headerStyles}>
          <h3 style={titleStyles}>{title || 'TACTICAL MODAL'}</h3>
          <div style={codeStyles}>{modalCode}</div>
          {closable && (
            <button onClick={onClose} style={closeButtonStyles} aria-label="Close modal">
              ✕
            </button>
          )}
        </div>

        <div style={contentStyles}>{children}</div>

        {footer && <div style={footerStyles}>{footer}</div>}
      </div>
    </div>
  );
};

export default ColdWarModal;
