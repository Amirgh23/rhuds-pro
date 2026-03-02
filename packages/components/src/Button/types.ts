/**
 * Button Component Types
 */

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: ButtonVariant;

  /** Button size */
  size?: ButtonSize;

  /** Show loading state */
  loading?: boolean;

  /** Disable button */
  disabled?: boolean;

  /** Full width button */
  fullWidth?: boolean;

  /** Button content */
  children: React.ReactNode;

  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}
