import { useState, useCallback, ChangeEvent } from 'react';

/**
 * Validation rule for form fields
 * @template T - The type of value being validated
 */
export interface FormValidationRule<T = string> {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: T extends string ? number | RegExp : T;
  message?: string;
  validator?: (value: T) => boolean | Promise<boolean>;
}

/**
 * Return type for useFormField hook
 * @template T - The type of the form field value
 */
export interface UseFormFieldReturn<T = string> {
  value: T;
  error: string;
  touched: boolean;
  inputProps: {
    value: T;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
  setValue: (value: T) => void;
  setError: (error: string) => void;
  setTouched: (touched: boolean) => void;
}

/**
 * Hook for managing form field state with validation
 * @template T - The type of the form field value (default: string)
 * @param name - The name of the form field
 * @param initialValue - The initial value of the field
 * @param validationRules - Array of validation rules to apply
 * @returns Form field state and handlers
 */
export function useFormField<T = string>(
  name: string,
  initialValue: T = '' as T,
  validationRules: FormValidationRule<T>[] = []
): UseFormFieldReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = useCallback(
    async (val: T): Promise<boolean> => {
      for (const rule of validationRules) {
        if (rule.type === 'required' && !val) {
          setError(rule.message || 'This field is required');
          return false;
        }
        if (rule.type === 'email' && val && typeof val === 'string') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            setError(rule.message || 'Invalid email address');
            return false;
          }
        }
        if (rule.type === 'min' && val && typeof val === 'string') {
          const minLength = rule.value as number;
          if (val.length < minLength) {
            setError(rule.message || `Minimum length is ${minLength}`);
            return false;
          }
        }
        if (rule.type === 'max' && val && typeof val === 'string') {
          const maxLength = rule.value as number;
          if (val.length > maxLength) {
            setError(rule.message || `Maximum length is ${maxLength}`);
            return false;
          }
        }
        if (rule.type === 'pattern' && val && typeof val === 'string') {
          const pattern = rule.value as RegExp;
          if (!pattern.test(val)) {
            setError(rule.message || 'Invalid format');
            return false;
          }
        }
        if (rule.type === 'custom' && rule.validator) {
          const isValid = await rule.validator(val);
          if (!isValid) {
            setError(rule.message || 'Validation failed');
            return false;
          }
        }
      }
      setError('');
      return true;
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value as T;
      setValue(newValue);
      if (touched) {
        validate(newValue);
      }
    },
    [touched, validate]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    validate(value);
  }, [value, validate]);

  return {
    value,
    error,
    touched,
    inputProps: {
      value,
      onChange: handleChange,
      onBlur: handleBlur,
    },
    setValue,
    setError,
    setTouched,
  };
}
