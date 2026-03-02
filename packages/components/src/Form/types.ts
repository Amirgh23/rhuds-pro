/**
 * Form Components Types
 */

export interface CheckboxProps {
  /** Checkbox label */
  label?: string;

  /** Checked state */
  checked?: boolean;

  /** Change handler */
  onChange?: (checked: boolean) => void;

  /** Disabled state */
  disabled?: boolean;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

export interface RadioProps {
  /** Radio label */
  label?: string;

  /** Radio value */
  value: string | number;

  /** Checked state */
  checked?: boolean;

  /** Change handler */
  onChange?: (value: string | number) => void;

  /** Disabled state */
  disabled?: boolean;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

export interface RadioGroupProps {
  /** Radio options */
  options: Array<{ label: string; value: string | number }>;

  /** Selected value */
  value?: string | number;

  /** Change handler */
  onChange?: (value: string | number) => void;

  /** Group label */
  label?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

export interface SwitchProps {
  /** Switch label */
  label?: string;

  /** Checked state */
  checked?: boolean;

  /** Change handler */
  onChange?: (checked: boolean) => void;

  /** Disabled state */
  disabled?: boolean;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

export interface FormValidationRule {
  /** Validation type */
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';

  /** Error message */
  message: string;

  /** Pattern for regex validation */
  pattern?: RegExp;

  /** Min length */
  minLength?: number;

  /** Max length */
  maxLength?: number;

  /** Custom validation function */
  validate?: (value: any) => boolean;
}

export interface FormFieldState {
  /** Field value */
  value: any;

  /** Field errors */
  errors: string[];

  /** Field touched state */
  touched: boolean;

  /** Field dirty state */
  dirty: boolean;
}

export interface FormState {
  /** Form values */
  values: Record<string, any>;

  /** Form errors */
  errors: Record<string, string[]>;

  /** Form touched fields */
  touched: Record<string, boolean>;

  /** Form dirty fields */
  dirty: Record<string, boolean>;

  /** Form is valid */
  isValid: boolean;

  /** Form is submitting */
  isSubmitting: boolean;
}

export interface UseFormProps {
  /** Initial values */
  initialValues: Record<string, any>;

  /** Validation rules */
  validationRules?: Record<string, FormValidationRule[]>;

  /** Submit handler */
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
}
