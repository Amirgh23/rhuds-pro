/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR NOTIFICATION - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL NOTIFICATION SYSTEM - Toast notification manager
 *
 * FEATURES:
 * - Multiple notification positions (top/bottom, left/right/center)
 * - Auto-dismiss with progress bar
 * - Stack management with animations
 * - Variant types (info, success, warning, danger)
 * - Action buttons support
 * - Pause on hover
 * - Scanlines and glow effects
 * - ARIA live regions for accessibility
 */

import React, {
  ReactNode,
  CSSProperties,
  useState,
  useEffect,
  createContext,
  useContext,
} from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode, getMilitaryTimestamp } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export type NotificationVariant = 'info' | 'success' | 'warning' | 'danger';
export type NotificationPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface Notification {
  id: string;
  variant: NotificationVariant;
  title?: string;
  message: ReactNode;
  icon?: ReactNode;
  duration?: number;
  actions?: NotificationAction[];
  onClose?: () => void;
}

export interface ColdWarNotificationProps {
  position?: NotificationPosition;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  glow?: boolean;
  maxNotifications?: number;
  className?: string;
  style?: CSSProperties;
}

interface NotificationContextValue {
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within ColdWarNotificationProvider');
  }
  return context;
};

export const ColdWarNotificationProvider: React.FC<{
  children: ReactNode;
  position?: NotificationPosition;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  glow?: boolean;
  maxNotifications?: number;
}> = ({
  children,
  position = 'top-right',
  theme = 'perseus',
  scanlines = true,
  glow = true,
  maxNotifications = 5,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>): string => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };

    setNotifications((prev) => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getPositionStyles = (): CSSProperties => {
    const positionMap: Record<NotificationPosition, CSSProperties> = {
      'top-left': { top: '20px', left: '20px' },
      'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
      'top-right': { top: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
      'bottom-right': { bottom: '20px', right: '20px' },
    };
    return positionMap[position];
  };

  const containerStyles: CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '400px',
    pointerEvents: 'none',
    ...getPositionStyles(),
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, clearAll }}>
      {children}
      <div style={containerStyles} role="region" aria-live="polite" aria-label="Notifications">
        {notifications.map((notification) => (
          <ColdWarNotificationItem
            key={notification.id}
            notification={notification}
            theme={theme}
            scanlines={scanlines}
            glow={glow}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

interface NotificationItemProps {
  notification: Notification;
  theme: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines: boolean;
  glow: boolean;
  onRemove: (id: string) => void;
}

const ColdWarNotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  theme,
  scanlines,
  glow,
  onRemove,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const [techCode] = useState(() => generateTechCode('NTF'));
  const [timestamp] = useState(() => getMilitaryTimestamp());

  const themeColors = THEME_VARIANTS[theme];

  const variantMap = {
    info: { color: themeColors.accent, rgb: '0, 204, 255', icon: 'ℹ' },
    success: { color: themeColors.success, rgb: '51, 255, 0', icon: '✓' },
    warning: { color: themeColors.warning, rgb: '255, 176, 0', icon: '⚠' },
    danger: { color: themeColors.error, rgb: '255, 51, 51', icon: '✗' },
  };
  const colors = variantMap[notification.variant];

  useEffect(() => {
    if (!notification.duration || isPaused) return;

    const interval = 50;
    const decrement = (interval / notification.duration) * 100;

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
  }, [notification.duration, isPaused]);

  const handleClose = () => {
    notification.onClose?.();
    onRemove(notification.id);
  };

  const notificationStyles: CSSProperties = {
    width: '100%',
    background: 'rgba(10, 10, 20, 0.98)',
    border: `2px solid ${colors.color}`,
    borderLeft: `4px solid ${colors.color}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    pointerEvents: 'auto',
    boxShadow: `
      0 6px 20px rgba(0, 0, 0, 0.5),
      0 0 30px rgba(${colors.rgb}, 0.3)
    `,
    animation: 'notification-slide-in 0.3s ease-out',
  };

  const contentStyles: CSSProperties = {
    padding: '16px',
    display: 'flex',
    gap: '12px',
    position: 'relative',
    zIndex: 6,
  };

  const iconStyles: CSSProperties = {
    fontSize: '20px',
    color: colors.color,
    flexShrink: 0,
    textShadow: glow ? `0 0 8px ${colors.color}` : 'none',
  };

  const textContainerStyles: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const titleStyles: CSSProperties = {
    fontSize: '13px',
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
    lineHeight: 1.4,
  };

  const timestampStyles: CSSProperties = {
    fontSize: '9px',
    color: themeColors.textSecondary,
    opacity: 0.5,
    marginTop: '4px',
  };

  const closeButtonStyles: CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.color,
    fontSize: '16px',
    cursor: 'pointer',
    padding: '0',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    opacity: 0.7,
  };

  const actionsStyles: CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  };

  const actionButtonStyles: CSSProperties = {
    padding: '6px 12px',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    background: 'transparent',
    color: colors.color,
    border: `1px solid ${colors.color}`,
    borderRadius: 0,
    clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)',
    cursor: 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
  };

  const progressBarStyles: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    width: `${progress}%`,
    background: `linear-gradient(90deg, ${colors.color}, rgba(${colors.rgb}, 0.5))`,
    transition: 'width 50ms linear',
    boxShadow: glow ? `0 0 8px ${colors.color}` : 'none',
    zIndex: 7,
  };

  const techCodeStyles: CSSProperties = {
    position: 'absolute',
    top: '4px',
    right: '40px',
    fontSize: '7px',
    color: colors.color,
    opacity: 0.3,
    letterSpacing: '0.05em',
    zIndex: 4,
  };

  return (
    <div
      style={notificationStyles}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="assertive"
    >
      {scanlines && <ScanlinesOverlay intensity="low" />}
      {glow && <GlowOverlay color={colors.color} intensity="low" />}

      <div style={techCodeStyles}>{techCode}</div>

      <div style={contentStyles}>
        <div style={iconStyles}>{notification.icon || colors.icon}</div>

        <div style={textContainerStyles}>
          {notification.title && <h4 style={titleStyles}>{notification.title}</h4>}
          <div style={messageStyles}>{notification.message}</div>
          <div style={timestampStyles}>{timestamp}</div>

          {notification.actions && notification.actions.length > 0 && (
            <div style={actionsStyles}>
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    handleClose();
                  }}
                  style={actionButtonStyles}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleClose} style={closeButtonStyles} aria-label="Close notification">
          ✕
        </button>
      </div>

      {notification.duration && <div style={progressBarStyles} />}

      <style>
        {`
          @keyframes notification-slide-in {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ColdWarNotificationProvider;
