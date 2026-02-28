import React from 'react'
import styled from 'styled-components'

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal'
  spacing?: 'sm' | 'md' | 'lg'
  testId?: string
}

const StyledStack = styled.div<{ direction: string; spacing: string }>`
  display: flex;
  flex-direction: ${(props) => (props.direction === 'vertical' ? 'column' : 'row')};
  gap: ${(props) => {
    switch (props.spacing) {
      case 'sm':
        return 'var(--rhuds-spacing-md)'
      case 'lg':
        return 'var(--rhuds-spacing-lg)'
      default:
        return 'var(--rhuds-spacing-md)'
    }
  }};
`

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ direction = 'vertical', spacing = 'md', testId, children, ...props }, ref) => {
    return (
      <StyledStack
        ref={ref}
        direction={direction}
        spacing={spacing}
        data-testid={testId}
        {...props}
      >
        {children}
      </StyledStack>
    )
  }
)

Stack.displayName = 'Stack'
