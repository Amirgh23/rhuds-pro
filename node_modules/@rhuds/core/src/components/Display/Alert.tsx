import React from 'react'
import styled, { css } from 'styled-components'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'warning' | 'info'
  dismissible?: boolean
  onDismiss?: () => void
  testId?: string
}

const StyledAlert = styled.div<{ type: string }>`
  padding: var(--rhuds-spacing-md);
  border-radius: 2px;
  border-left: 4px solid;
  display: flex;
  align-items: center;
  gap: var(--rhuds-spacing-md);

  ${(props) => {
    switch (props.type) {
      case 'success':
        return css`
          background: rgba(0, 255, 0, 0.1);
          border-color: var(--rhuds-colors-success);
          color: var(--rhuds-colors-success);
        `
      case 'error':
        return css`
          background: rgba(255, 0, 85, 0.1);
          border-color: var(--rhuds-colors-error);
          color: var(--rhuds-colors-error);
        `
      case 'warning':
        return css`
          background: rgba(255, 170, 0, 0.1);
          border-color: var(--rhuds-colors-warning);
          color: var(--rhuds-colors-warning);
        `
      case 'info':
        return css`
          background: rgba(0, 255, 255, 0.1);
          border-color: var(--rhuds-colors-info);
          color: var(--rhuds-colors-info);
        `
      default:
        return ''
    }
  }}
`

const AlertContent = styled.div`
  flex: 1;
`

const DismissButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ type = 'info', dismissible = false, onDismiss, testId, children, ...props }, ref) => {
    const [visible, setVisible] = React.useState(true)

    const handleDismiss = () => {
      setVisible(false)
      onDismiss?.()
    }

    if (!visible) return null

    return (
      <StyledAlert ref={ref} type={type} role="alert" data-testid={testId} {...props}>
        <AlertContent>{children}</AlertContent>
        {dismissible && <DismissButton onClick={handleDismiss}>×</DismissButton>}
      </StyledAlert>
    )
  }
)

Alert.displayName = 'Alert'
