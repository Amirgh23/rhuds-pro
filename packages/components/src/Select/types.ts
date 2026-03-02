/**
 * Select Component Types
 */

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  /** Select options */
  options: SelectOption[];

  /** Selected value */
  value?: string | number;

  /** Change handler */
  onChange?: (value: string | number) => void;

  /** Select label */
  label?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Error message */
  error?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Required field */
  required?: boolean;

  /** Enable search */
  searchable?: boolean;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}
