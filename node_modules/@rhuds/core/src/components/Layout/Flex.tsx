import React from 'react'
import styled from 'styled-components'

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  gap?: 'sm' | 'md' | 'lg'
  testId?: string
}

const StyledFlex = styled.div<{
  direction: string
  align: string
  justify: string
  gap: string
}>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  align-items: ${(props) => {
    switch (props.align) {
      case 'start':
        return 'flex-start'
      case 'center':
        return 'center'
      case 'end':
        return 'flex-end'
      case 'stretch':
        return 'stretch'
      default:
        return 'center'
    }
  }};
  justify-content: ${(props) => {
    switch (props.justify) {
      case 'start':
        return 'flex-start'
      case 'center':
        return 'center'
      case 'end':
        return 'flex-end'
      case 'between':
        return 'space-between'
      case 'around':
        return 'space-around'
      default:
        return 'flex-start'
    }
  }};
  gap: ${(props) => {
    switch (props.gap) {
      case 'sm':
        return 'var(--rhuds-spacing-md)'
      case 'lg':
        return 'var(--rhuds-spacing-lg)'
      default:
        return 'var(--rhuds-spacing-md)'
    }
  }};
`

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction = 'row',
      align = 'center',
      justify = 'start',
      gap = 'md',
      testId,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledFlex
        ref={ref}
        direction={direction}
        align={align}
        justify={justify}
        gap={gap}
        data-testid={testId}
        {...props}
      >
        {children}
      </StyledFlex>
    )
  }
)

Flex.displayName = 'Flex'
