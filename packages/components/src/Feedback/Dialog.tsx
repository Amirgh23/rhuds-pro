/**
 * Dialog Component
 * Dialog with action buttons
 */

import React, { useMemo, useEffect } from 'react';
import { useTheme } from '@rhuds/core';
import { Portal } from '../Utility/Portal';
import { DialogProps } from './types';

/**
 * Dialog Component
 */
export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  animationDuration = 300,
  showClose = true,
  className,
  style,
}) => {
  const theme = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const overlayStyle = useMemo<React.CSSProperties>(() => {
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: isOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      opacity: isOpen ? 1 : 0,
      transition: `opacity ${animationDuration}ms ease-in-out`,
    };
  }, [isOpen, animationDuration]);

  const dialogStyle = useMemo<React.CSSProperties>(() => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    return {
      backgroundColor: tokens.colors?.background || '#1a1a1a',
      color: tokens.colors?.text || '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
      transform: isOpen ? 'scale(1)' : 'scale(0.9)',
      opacity: isOpen ? 1 : 0,
      transition: `all ${animationDuration}ms ease-in-out`,
      ...style,
    };
  }, [isOpen, animationDuration, theme, style]);

  const headerStyle: React.CSSProperties = useMemo(() => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem',
      borderBottom: `1px solid ${tokens.colors?.primary || '#00f6ff'}`,
    };
  }, [theme]);

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 600,
    margin: 0,
  };

  const closeButtonStyle: React.CSSProperties = useMemo(() => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    return {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: tokens.colors?.text || '#ffffff',
      padding: '0',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.2s ease-in-out',
    };
  }, [theme]);

  const contentStyle: React.CSSProperties = {
    padding: '1.5rem',
  };

  const footerStyle: React.CSSProperties = useMemo(() => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    return {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      padding: '1.5rem',
      borderTop: `1px solid ${tokens.colors?.primary || '#00f6ff'}`,
    };
  }, [theme]);

  const getActionButtonStyle = (variant: string = 'secondary'): React.CSSProperties => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    const baseStyle: React.CSSProperties = {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 600,
      transition: 'opacity 0.2s ease-in-out',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: tokens.colors?.primary || '#00f6ff',
          color: tokens.colors?.background || '#1a1a1a',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: '#ff0000',
          color: '#ffffff',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: tokens.colors?.primary || '#00f6ff',
          border: `2px solid ${tokens.colors?.primary || '#00f6ff'}`,
        };
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <div style={overlayStyle} onClick={onClose}>
        <div
          className={className}
          style={dialogStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={headerStyle}>
            <h2 style={titleStyle}>{title}</h2>
            {showClose && (
              <button
                style={closeButtonStyle}
                onClick={onClose}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '1';
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div style={contentStyle}>{children}</div>

          {actions.length > 0 && (
            <div style={footerStyle}>
              {actions.map((action, index) => (
                <button
                  key={index}
                  style={getActionButtonStyle(action.variant)}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  onMouseEnter={(e) => {
                    if (!action.disabled) {
                      (e.currentTarget as HTMLElement).style.opacity = '0.8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!action.disabled) {
                      (e.currentTarget as HTMLElement).style.opacity = '1';
                    }
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

Dialog.displayName = 'Dialog';

