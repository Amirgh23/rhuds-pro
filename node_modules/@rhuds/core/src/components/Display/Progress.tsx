import React from 'react'
import styled, { css } from 'styled-components'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  testId?: string
}

const ProgressContainer = styled.div`
  width: 100%;
  height: 8px;
  background: var(--rhuds-colors-border);
  border-radius: 4px;
  overflow: hidden;
`

const ProgressBar = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${(props) => props.percentage}%;
  transition: width var(--rhuds-transitions-normal);
  border-radius: 4px;

  ${(props) => {
    switch (props.color) {
      case 'primary':
        return css`
          background: var(--rhuds-colors-primary);
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
        `
      case 'secondary':
        return css`
          background: var(--rhuds-colors-secondary);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        `
      case 'success':
        return css`
          background: var(--rhuds-colors-success);
        `
      case 'warning':
        return css`
          background: var(--rhuds-colors-warning);
        `
      case 'error':
        return css`
          background: var(--rhuds-colors-error);
        `
      default:
        return ''
    }
  }}
`

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, color = 'primary', testId, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <ProgressContainer ref={ref} data-testid={testId} {...props}>
        <ProgressBar percentage={percentage} color={color} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} />
      </ProgressContainer>
    )
  }
)

Progress.displayName = 'Progress'
