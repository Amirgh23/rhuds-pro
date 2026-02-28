import React from 'react'
import styled, { css } from 'styled-components'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'number' | 'search'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  icon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  soundEffect?: boolean
  testId?: string
  ariaLabel?: string
  ariaDescribedBy?: string
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--rhuds-spacing-xs);
  width: 100%;
`

const InputContainer = styled.div<{ error: boolean; size: string }>`
  display: flex;
  align-items: center;
  gap: var(--rhuds-spacing-sm);
  border: 1px solid var(--rhuds-colors-border);
  border-radius: 2px;
  padding: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '6px 12px'
      case 'lg':
        return '12px 16px'
      default:
        return '8px 12px'
    }
  }};
  background: var(--rhuds-colors-surface);
  transition: all var(--rhuds-transitions-normal);

  ${(props) =>
    props.error &&
    css`
      border-color: var(--rhuds-colors-error);
      box-shadow: 0 0 10px rgba(255, 0, 85, 0.2);
    `}

  &:focus-within {
    border-color: var(--rhuds-colors-primary);
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  }
`

const StyledInput = styled.input<{ size: string }>`
  flex: 1;
  border: none;
  background: transparent;
  color: var(--rhuds-colors-text);
  font-family: var(--rhuds-typography-fontFamily);
  font-size: ${(props) => {
    switch (props.size) {
      case 'sm':
        return 'var(--rhuds-typography-fontSize-sm)'
      case 'lg':
        return 'var(--rhuds-typography-fontSize-lg)'
      default:
        return 'var(--rhuds-typography-fontSize-md)'
    }
  }};
  outline: none;
  padding: 0;

  &::placeholder {
    color: var(--rhuds-colors-border);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
  }
`

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--rhuds-colors-primary);
  flex-shrink: 0;
`

const ErrorMessage = styled.span`
  color: var(--rhuds-colors-error);
  font-size: var(--rhuds-typography-fontSize-sm);
  margin-top: var(--rhuds-spacing-xs);
`

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      value,
      onChange,
      disabled = false,
      error = false,
      errorMessage,
      icon,
      size = 'md',
      soundEffect = true,
      testId,
      ariaLabel,
      ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const errorId = errorMessage ? `${testId}-error` : undefined

    return (
      <InputWrapper>
        <InputContainer error={error} size={size}>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <StyledInput
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            size={size}
            data-testid={testId}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy || errorId}
            aria-invalid={error}
            {...props}
          />
        </InputContainer>
        {errorMessage && (
          <ErrorMessage id={errorId} role="alert">
            {errorMessage}
          </ErrorMessage>
        )}
      </InputWrapper>
    )
  }
)

Input.displayName = 'Input'
