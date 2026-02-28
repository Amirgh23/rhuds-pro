import React from 'react'
import styled, { keyframes } from 'styled-components'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary'
  testId?: string
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const StyledSpinner = styled.div<{ size: string; color: string }>`
  display: inline-block;
  width: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '16px'
      case 'lg':
        return '32px'
      default:
        return '24px'
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '16px'
      case 'lg':
        return '32px'
      default:
        return '24px'
    }
  }};
  border: 2px solid ${(props) => (props.color === 'secondary' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 255, 0, 0.3)')};
  border-top-color: ${(props) => (props.color === 'secondary' ? 'var(--rhuds-colors-secondary)' : 'var(--rhuds-colors-primary)')};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', color = 'primary', testId, ...props }, ref) => {
    return <StyledSpinner ref={ref} size={size} color={color} data-testid={testId} {...props} />
  }
)

Spinner.displayName = 'Spinner'
