import { useState, useCallback, ChangeEvent } from 'react';

export interface FormValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message?: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}

export interface UseFormFieldReturn {
  value: any;
  error: string;
  touched: boolean;
  inputProps: {
    value: any;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
  setValue: (value: any) => void;
  setError: (error: string) => void;
  setTouched: (touched: boolean) => void;
}

export function useFormField(
  name: string,
  initialValue: any = '',
  validationRules: FormValidationRule[] = []
): UseFormFieldReturn {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = useCallback(
    async (val: any) => {
      for (const rule of validationRules) {
        if (rule.type === 'required' && !val) {
          setError(rule.message || 'This field is required');
          return false;
        }
        if (rule.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          setError(rule.message || 'Invalid email address');
          return false;
        }
        if (rule.type === 'min' && val && val.length < rule.value) {
          setError(rule.message || `Minimum length is ${rule.value}`);
          return false;
        }
        if (rule.type === 'max' && val && val.length > rule.value) {
          setError(rule.message || `Maximum length is ${rule.value}`);
          return false;
        }
        if (rule.type === 'pattern' && val && !rule.value.test(val)) {
          setError(rule.message || 'Invalid format');
          return false;
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
      const newValue = e.target.value;
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
