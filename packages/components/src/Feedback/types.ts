/**
 * Feedback Components Types
 */

// ============================================================================
// Modal Component Types
// ============================================================================

export interface ModalProps {
  /** Is modal open */
  isOpen: boolean;
  /** On close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Close button text */
  closeText?: string;
  /** Animation duration */
  animationDuration?: number;
  /** Show close button */
  showClose?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

// ============================================================================
// Dialog Component Types
// ============================================================================

export interface DialogAction {
  /** Action label */
  label: string;
  /** Action handler */
  onClick: () => void;
  /** Action variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Is action disabled */
  disabled?: boolean;
}

export interface DialogProps {
  /** Is dialog open */
  isOpen: boolean;
  /** On close handler */
  onClose: () => void;
  /** Dialog title */
  title: string;
  /** Dialog content */
  children: React.ReactNode;
  /** Dialog actions */
  actions?: DialogAction[];
  /** Animation duration */
  animationDuration?: number;
  /** Show close button */
  showClose?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

// ============================================================================
// Notification Component Types
// ============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  /** Notification message */
  message: string;
  /** Notification type */
  type?: NotificationType;
  /** Auto dismiss duration (ms) */
  duration?: number;
  /** On close handler */
  onClose?: () => void;
  /** Show close button */
  showClose?: boolean;
  /** Custom icon */
  icon?: string | React.ReactNode;
  /** Animation duration */
  animationDuration?: number;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export interface NotificationContextValue {
  /** Show notification */
  show: (message: string, type?: NotificationType, duration?: number) => void;
  /** Show success notification */
  success: (message: string, duration?: number) => void;
  /** Show error notification */
  error: (message: string, duration?: number) => void;
  /** Show warning notification */
  warning: (message: string, duration?: number) => void;
  /** Show info notification */
  info: (message: string, duration?: number) => void;
}
