import React from 'react'
import styled, { css } from 'styled-components'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  testId?: string
}

const StyledBadge = styled.span<{ color: string; size: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: var(--rhuds-typography-fontWeight-semibold);
  white-space: nowrap;

  ${(props) => {
    switch (props.color) {
      case 'primary':
        return css`
          background: var(--rhuds-colors-primary);
          color: var(--rhuds-colors-background);
        `
      case 'secondary':
        return css`
          background: var(--rhuds-colors-secondary);
          color: var(--rhuds-colors-background);
        `
      case 'success':
        return css`
          background: var(--rhuds-colors-success);
          color: var(--rhuds-colors-background);
        `
      case 'warning':
        return css`
          background: var(--rhuds-colors-warning);
          color: var(--rhuds-colors-background);
        `
      case 'error':
        return css`
          background: var(--rhuds-colors-error);
          color: var(--rhuds-colors-background);
        `
      case 'info':
        return css`
          background: var(--rhuds-colors-info);
          color: var(--rhuds-colors-background);
        `
      default:
        return ''
    }
  }}

  ${(props) => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: 2px 8px;
          font-size: var(--rhuds-typography-fontSize-xs);
        `
      case 'lg':
        return css`
          padding: 6px 12px;
          font-size: var(--rhuds-typography-fontSize-md);
        `
      default:
        return css`
          padding: 4px 10px;
          font-size: var(--rhuds-typography-fontSize-sm);
        `
    }
  }}
`

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ color = 'primary', size = 'md', testId, children, ...props }, ref) => {
    return (
      <StyledBadge ref={ref} color={color} size={size} data-testid={testId} {...props}>
        {children}
      </StyledBadge>
    )
  }
)

Badge.displayName = 'Badge'
