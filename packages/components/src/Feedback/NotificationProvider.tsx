/**
 * Notification Provider
 * Context provider for managing notifications
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Portal } from '../Utility/Portal';
import { Notification } from './Notification';
import { NotificationContextValue, NotificationType } from './types';

interface NotificationItem {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

/**
 * Notification Provider Component
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const show = useCallback((message: string, type: NotificationType = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: NotificationItem = { id, message, type, duration };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration + 300);
    }
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    show(message, 'success', duration);
  }, [show]);

  const error = useCallback((message: string, duration?: number) => {
    show(message, 'error', duration);
  }, [show]);

  const warning = useCallback((message: string, duration?: number) => {
    show(message, 'warning', duration);
  }, [show]);

  const info = useCallback((message: string, duration?: number) => {
    show(message, 'info', duration);
  }, [show]);

  const value: NotificationContextValue = {
    show,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Portal containerId="notifications-root">
        <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 2000, padding: '1rem' }}>
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              onClose={() => {
                setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
              }}
            />
          ))}
        </div>
      </Portal>
    </NotificationContext.Provider>
  );
};

NotificationProvider.displayName = 'NotificationProvider';

/**
 * Hook to use notifications
 */
export const useNotification = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
