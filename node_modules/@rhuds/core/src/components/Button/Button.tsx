import React from 'react'
import styled, { css } from 'styled-components'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  soundEffect?: boolean
  testId?: string
  ariaLabel?: string
}

const StyledButton = styled.button<{
  variant: string
  size: string
  fullWidth: boolean
  isAnimating: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--rhuds-spacing-sm);
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-family: var(--rhuds-typography-fontFamily);
  transition: all var(--rhuds-transitions-normal);
  font-weight: var(--rhuds-typography-fontWeight-semibold);
  white-space: nowrap;
  user-select: none;

  ${(props) => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: var(--rhuds-colors-primary);
          color: var(--rhuds-colors-background);
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);

          &:hover:not(:disabled) {
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
            transform: translateY(-2px);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      case 'secondary':
        return css`
          background: var(--rhuds-colors-secondary);
          color: var(--rhuds-colors-background);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);

          &:hover:not(:disabled) {
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
            transform: translateY(-2px);
          }
        `
      case 'ghost':
        return css`
          background: transparent;
          color: var(--rhuds-colors-primary);
          border: 1px solid var(--rhuds-colors-primary);

          &:hover:not(:disabled) {
            background: rgba(0, 255, 0, 0.1);
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
          }
        `
      case 'danger':
        return css`
          background: var(--rhuds-colors-error);
          color: var(--rhuds-colors-background);
          box-shadow: 0 0 10px rgba(255, 0, 85, 0.3);

          &:hover:not(:disabled) {
            box-shadow: 0 0 20px rgba(255, 0, 85, 0.6);
            transform: translateY(-2px);
          }
        `
      default:
        return ''
    }
  }}

  ${(props) => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: 6px 12px;
          font-size: var(--rhuds-typography-fontSize-sm);
          min-height: 32px;
        `
      case 'lg':
        return css`
          padding: 12px 24px;
          font-size: var(--rhuds-typography-fontSize-lg);
          min-height: 48px;
        `
      default:
        return css`
          padding: 8px 16px;
          font-size: var(--rhuds-typography-fontSize-md);
          min-height: 40px;
        `
    }
  }}

  ${(props) => props.fullWidth && css`width: 100%;`}

  ${(props) =>
    props.isAnimating &&
    css`
      animation: hudPulse 0.3s ease-out;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid var(--rhuds-colors-primary);
    outline-offset: 2px;
  }

  @keyframes hudPulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const Spinner = styled.div<{ size: string }>`
  display: inline-block;
  width: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '14px'
      case 'lg':
        return '18px'
      default:
        return '16px'
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '14px'
      case 'lg':
        return '18px'
      default:
        return '16px'
    }
  }};
  border: 2px solid rgba(0, 255, 0, 0.3);
  border-top-color: var(--rhuds-colors-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      onClick,
      children,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      soundEffect = true,
      testId,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    const [isAnimating, setIsAnimating] = React.useState(false)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading) {
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)
        onClick?.(e)
      }
    }

    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        isAnimating={isAnimating}
        onClick={handleClick}
        fullWidth={fullWidth}
        data-testid={testId}
        aria-label={ariaLabel}
        {...props}
      >
        {icon && iconPosition === 'left' && <IconWrapper>{icon}</IconWrapper>}
        {children}
        {icon && iconPosition === 'right' && <IconWrapper>{icon}</IconWrapper>}
        {loading && <Spinner size={size} />}
      </StyledButton>
    )
  }
)

Button.displayName = 'Button'
