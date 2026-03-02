import React from 'react'
import styled, { css } from 'styled-components'

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'body' | 'caption' | 'label' | 'heading'
  color?: 'primary' | 'secondary' | 'text' | 'muted'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  weight?: 'light' | 'normal' | 'semibold' | 'bold'
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  testId?: string
}

const StyledText = styled.span<{
  variant: string
  color: string
  size: string
  weight: string
}>`
  font-family: var(--rhuds-typography-fontFamily);
  color: ${(props) => {
    switch (props.color) {
      case 'primary':
        return 'var(--rhuds-colors-primary)'
      case 'secondary':
        return 'var(--rhuds-colors-secondary)'
      case 'muted':
        return 'var(--rhuds-colors-border)'
      default:
        return 'var(--rhuds-colors-text)'
    }
  }};
  font-size: var(--rhuds-typography-fontSize-${(props) => props.size});
  font-weight: var(--rhuds-typography-fontWeight-${(props) => props.weight});
  line-height: var(--rhuds-typography-lineHeight-normal);

  ${(props) => {
    switch (props.variant) {
      case 'heading':
        return css`
          font-weight: var(--rhuds-typography-fontWeight-bold);
          line-height: var(--rhuds-typography-lineHeight-tight);
        `
      case 'label':
        return css`
          font-weight: var(--rhuds-typography-fontWeight-semibold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        `
      case 'caption':
        return css`
          font-size: var(--rhuds-typography-fontSize-xs);
          opacity: 0.8;
        `
      default:
        return ''
    }
  }}
`

export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      variant = 'body',
      color = 'text',
      size = 'md',
      weight = 'normal',
      as = 'span',
      testId,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledText
        ref={ref}
        as={as}
        variant={variant}
        color={color}
        size={size}
        weight={weight}
        data-testid={testId}
        {...props}
      >
        {children}
      </StyledText>
    )
  }
)

Text.displayName = 'Text'
