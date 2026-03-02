import React from 'react'
import styled from 'styled-components'

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number
  gap?: 'sm' | 'md' | 'lg'
  responsive?: boolean
  testId?: string
}

const StyledGrid = styled.div<{ columns: number; gap: string; responsive: boolean }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
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

  ${(props) =>
    props.responsive &&
    `
    @media (max-width: var(--rhuds-breakpoints-tablet)) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: var(--rhuds-breakpoints-mobile)) {
      grid-template-columns: 1fr;
    }
  `}
`

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ columns = 3, gap = 'md', responsive = true, testId, children, ...props }, ref) => {
    return (
      <StyledGrid
        ref={ref}
        columns={columns}
        gap={gap}
        responsive={responsive}
        data-testid={testId}
        {...props}
      >
        {children}
      </StyledGrid>
    )
  }
)

Grid.displayName = 'Grid'
