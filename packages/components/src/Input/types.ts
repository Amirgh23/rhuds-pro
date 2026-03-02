/**
 * Input Component Types
 */

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input type */
  type?: InputType;

  /** Input label */
  label?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Error message */
  error?: string;

  /** Success message */
  success?: string;

  /** Input value */
  value?: string;

  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /** Focus handler */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;

  /** Blur handler */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;

  /** Disabled state */
  disabled?: boolean;

  /** Required field */
  required?: boolean;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}
