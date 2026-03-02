import React from 'react'
import styled from 'styled-components'

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'text' | 'muted'
  testId?: string
}

const StyledIcon = styled.svg<{ size: string; color: string }>`
  width: ${(props) => {
    switch (props.size) {
      case 'sm':
        return '16px'
      case 'lg':
        return '32px'
      case 'xl':
        return '48px'
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
      case 'xl':
        return '48px'
      default:
        return '24px'
    }
  }};
  fill: ${(props) => {
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
  flex-shrink: 0;
`

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 'md', color = 'text', testId, children, ...props }, ref) => {
    return (
      <StyledIcon
        ref={ref}
        size={size}
        color={color}
        viewBox="0 0 24 24"
        data-testid={testId}
        {...props}
      >
        {children}
      </StyledIcon>
    )
  }
)

Icon.displayName = 'Icon'
