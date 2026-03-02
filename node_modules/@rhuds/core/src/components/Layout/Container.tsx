import React from 'react'
import styled from 'styled-components'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  padding?: 'sm' | 'md' | 'lg'
  testId?: string
}

const StyledContainer = styled.div<{ maxWidth: string; padding: string }>`
  width: 100%;
  max-width: ${(props) => {
    switch (props.maxWidth) {
      case 'sm':
        return '640px'
      case 'md':
        return '768px'
      case 'lg':
        return '1024px'
      case 'xl':
        return '1280px'
      case '2xl':
        return '1536px'
      default:
        return '100%'
    }
  }};
  margin: 0 auto;
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

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = 'lg', padding = 'md', testId, children, ...props }, ref) => {
    return (
      <StyledContainer ref={ref} maxWidth={maxWidth} padding={padding} data-testid={testId} {...props}>
        {children}
      </StyledContainer>
    )
  }
)

Container.displayName = 'Container'
