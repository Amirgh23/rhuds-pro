/**
 * Notification Component
 * Toast notification with auto-dismiss
 */

import React, { useMemo, useEffect, useState } from 'react';
import { useTheme } from '@rhuds/core';
import { NotificationProps, NotificationType } from './types';

/**
 * Notification Component
 */
export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  showClose = true,
  icon,
  animationDuration = 300,
  className,
  style,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, animationDuration);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, animationDuration, onClose]);

  const getTypeStyles = (notificationType: NotificationType) => {
    const tokens = (theme as any)?.currentMode?.tokens || theme;
    
    switch (notificationType) {
      case 'success':
        return {
          backgroundColor: '#29F2DF',
          color: '#000000',
          icon: '✓',
        };
      case 'error':
        return {
          backgroundColor: '#EF3EF1',
          color: '#ffffff',
          icon: '✕',
        };
      case 'warning':
        return {
          backgroundColor: '#29F2DF',
          color: '#000000',
          icon: '⚠',
        };
      case 'info':
      default:
        return {
          backgroundColor: tokens.colors?.primary || '#29F2DF',
          color: tokens.colors?.background || '#1a1a1a',
          icon: 'ℹ',
        };
    }
  };

  const typeStyles = getTypeStyles(type);

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      backgroundColor: typeStyles.backgroundColor,
      color: typeStyles.color,
      padding: '1rem 1.5rem',
      borderRadius: '4px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      maxWidth: '400px',
      zIndex: 2000,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(400px)',
      transition: `all ${animationDuration}ms ease-in-out`,
      ...style,
    };
  }, [isVisible, animationDuration, typeStyles, style]);

  const iconStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    flexShrink: 0,
  };

  const messageStyle: React.CSSProperties = {
    flex: 1,
    fontSize: '0.95rem',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    cursor: 'pointer',
    color: 'inherit',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s ease-in-out',
    flexShrink: 0,
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, animationDuration);
  };

  return (
    <div className={className} style={containerStyle}>
      <span style={iconStyle}>
        {icon || typeStyles.icon}
      </span>
      <span style={messageStyle}>{message}</span>
      {showClose && (
        <button
          style={closeButtonStyle}
          onClick={handleClose}
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
  );
};

Notification.displayName = 'Notification';

