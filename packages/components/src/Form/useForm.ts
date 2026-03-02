/**
 * useForm Hook
 * Form state management and validation
 */

import { useState, useCallback, useMemo } from 'react';
import { FormState, FormValidationRule, UseFormProps } from './types';

/**
 * Validate a field value
 */
function validateField(value: any, rules?: FormValidationRule[]): string[] {
  if (!rules) return [];

  const errors: string[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(rule.message);
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(rule.message);
        }
        break;

      case 'minLength':
        if (value && rule.minLength && value.length < rule.minLength) {
          errors.push(rule.message);
        }
        break;

      case 'maxLength':
        if (value && rule.maxLength && value.length > rule.maxLength) {
          errors.push(rule.message);
        }
        break;

      case 'pattern':
        if (value && rule.pattern && !rule.pattern.test(value)) {
          errors.push(rule.message);
        }
        break;

      case 'custom':
        if (value && rule.validate && !rule.validate(value)) {
          errors.push(rule.message);
        }
        break;
    }
  }

  return errors;
}

/**
 * useForm Hook
 */
export function useForm({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string[]> = {};

    for (const [fieldName, fieldValue] of Object.entries(values)) {
      const fieldErrors = validateField(fieldValue, validationRules[fieldName]);
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  // Handle field change
  const handleChange = useCallback(
    (fieldName: string, value: any) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }));
      setDirty((prev) => ({ ...prev, [fieldName]: true }));

      // Validate field
      const fieldErrors = validateField(value, validationRules[fieldName]);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldErrors,
      }));
    },
    [validationRules]
  );

  // Handle field blur
  const handleBlur = useCallback((fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  // Handle form submit
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit?.(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setDirty({});
  }, [initialValues]);

  // Form state
  const formState = useMemo<FormState>(() => {
    return {
      values,
      errors,
      touched,
      dirty,
      isValid: Object.keys(errors).length === 0,
      isSubmitting,
    };
  }, [values, errors, touched, dirty, isSubmitting]);

  return {
    values,
    errors,
    touched,
    dirty,
    isSubmitting,
    formState,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors,
    setTouched,
    setDirty,
  };
}
