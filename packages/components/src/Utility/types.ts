/**
 * Utility Components Types
 */

// ============================================================================
// Tooltip Component Types
// ============================================================================

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Tooltip content */
  content: string | React.ReactNode;
  /** Tooltip position */
  position?: TooltipPosition;
  /** Trigger element */
  children: React.ReactNode;
  /** Show delay (ms) */
  showDelay?: number;
  /** Hide delay (ms) */
  hideDelay?: number;
  /** Animation duration */
  animationDuration?: number;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

// ============================================================================
// Popover Component Types
// ============================================================================

export interface PopoverProps {
  /** Popover content */
  content: React.ReactNode;
  /** Popover title */
  title?: string;
  /** Popover position */
  position?: TooltipPosition;
  /** Trigger element */
  children: React.ReactNode;
  /** Is popover open */
  isOpen?: boolean;
  /** On open change */
  onOpenChange?: (isOpen: boolean) => void;
  /** Close on outside click */
  closeOnOutsideClick?: boolean;
  /** Animation duration */
  animationDuration?: number;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

// ============================================================================
// Dropdown Component Types
// ============================================================================

export interface DropdownItem {
  /** Item key/identifier */
  key: string;
  /** Item label */
  label?: string;
  /** Item icon */
  icon?: string | React.ReactNode;
  /** Item click handler */
  onClick?: () => void;
  /** Is item disabled */
  disabled?: boolean;
  /** Is item divider */
  divider?: boolean;
}

export interface DropdownProps {
  /** Dropdown items */
  items: DropdownItem[];
  /** Trigger element */
  children: React.ReactNode;
  /** Is dropdown open */
  isOpen?: boolean;
  /** On open change */
  onOpenChange?: (isOpen: boolean) => void;
  /** On item click */
  onItemClick?: (item: DropdownItem) => void;
  /** Dropdown position */
  position?: TooltipPosition;
  /** Close on item click */
  closeOnItemClick?: boolean;
  /** Close on outside click */
  closeOnOutsideClick?: boolean;
  /** Animation duration */
  animationDuration?: number;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}
