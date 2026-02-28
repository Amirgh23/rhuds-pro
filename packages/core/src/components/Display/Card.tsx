import React from 'react'
import styled, { css } from 'styled-components'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled'
  interactive?: boolean
  onClick?: () => void
  header?: React.ReactNode
  footer?: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'
  testId?: string
}

const StyledCard = styled.div<{ variant: string; interactive: boolean }>`
  border-radius: 2px;
  transition: all var(--rhuds-transitions-normal);
  background: var(--rhuds-colors-surface);

  ${(props) => {
    switch (props.variant) {
      case 'elevated':
        return css`
          box-shadow: var(--rhuds-shadows-lg);
          border: none;
        `
      case 'outlined':
        return css`
          border: 1px solid var(--rhuds-colors-border);
          box-shadow: none;
        `
      case 'filled':
        return css`
          background: var(--rhuds-colors-background);
          border: 1px solid var(--rhuds-colors-border);
          box-shadow: none;
        `
      default:
        return ''
    }
  }}

  ${(props) =>
    props.interactive &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--rhuds-shadows-glow-lg);
      }
    `}
`

const CardHeader = styled.div`
  padding: var(--rhuds-spacing-md);
  border-bottom: 1px solid var(--rhuds-colors-border);
`

const CardContent = styled.div<{ padding: string }>`
  padding: ${(props) => {
    switch (props.padding) {
      case 'sm':
        return 'var(--rhuds-spacing-md)'
      case 'lg':
        return 'var(--rhuds-spacing-lg)'
      default:
        return 'var(--rhuds-spacing-md)'
    }
  }};
`

const CardFooter = styled.div`
  padding: var(--rhuds-spacing-md);
  border-top: 1px solid var(--rhuds-colors-border);
`

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      interactive = false,
      onClick,
      header,
      footer,
      padding = 'md',
      testId,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledCard
        ref={ref}
        variant={variant}
        interactive={interactive}
        onClick={onClick}
        data-testid={testId}
        {...props}
      >
        {header && <CardHeader>{header}</CardHeader>}
        <CardContent padding={padding}>{children}</CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </StyledCard>
    )
  }
)

Card.displayName = 'Card'
