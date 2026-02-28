import React from 'react'
import styled, { css } from 'styled-components'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  soundEffect?: boolean
  testId?: string
  ariaLabel?: string
}

const Backdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  transition: opacity var(--rhuds-transitions-normal),
    visibility var(--rhuds-transitions-normal);
`

const ModalContent = styled.div<{ size: string; isOpen: boolean }>`
  background: var(--rhuds-colors-surface);
  border: 1px solid var(--rhuds-colors-border);
  border-radius: 2px;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.2), 0 0 60px rgba(0, 255, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
  transform: ${(props) => (props.isOpen ? 'scale(1)' : 'scale(0.95)')};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transition: transform var(--rhuds-transitions-normal),
    opacity var(--rhuds-transitions-normal);

  ${(props) => {
    switch (props.size) {
      case 'sm':
        return css`
          width: 90%;
          max-width: 400px;
        `
      case 'lg':
        return css`
          width: 90%;
          max-width: 800px;
        `
      default:
        return css`
          width: 90%;
          max-width: 600px;
        `
    }
  }}

  @media (max-width: 768px) {
    width: 95%;
    max-height: 95vh;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--rhuds-spacing-lg);
  border-bottom: 1px solid var(--rhuds-colors-border);
  gap: var(--rhuds-spacing-md);
`

const ModalTitle = styled.h2`
  margin: 0;
  font-size: var(--rhuds-typography-fontSize-lg);
  font-weight: var(--rhuds-typography-fontWeight-bold);
  color: var(--rhuds-colors-text);
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--rhuds-colors-text);
  cursor: pointer;
  font-size: 24px;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--rhuds-transitions-normal);

  &:hover {
    color: var(--rhuds-colors-primary);
    transform: rotate(90deg);
  }

  &:focus-visible {
    outline: 2px solid var(--rhuds-colors-primary);
    outline-offset: 2px;
  }
`

const ModalBody = styled.div`
  padding: var(--rhuds-spacing-lg);
  color: var(--rhuds-colors-text);
`

const ModalFooter = styled.div`
  padding: var(--rhuds-spacing-lg);
  border-top: 1px solid var(--rhuds-colors-border);
  display: flex;
  gap: var(--rhuds-spacing-md);
  justify-content: flex-end;
`

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      footer,
      size = 'md',
      closeOnBackdropClick = true,
      closeOnEscape = true,
      soundEffect = true,
      testId,
      ariaLabel,
    },
    ref
  ) => {
    React.useEffect(() => {
      if (!isOpen) return

      const handleEscape = (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, closeOnEscape, onClose])

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && e.target === e.currentTarget) {
        onClose()
      }
    }

    const handleCloseClick = () => {
      onClose()
    }

    return (
      <Backdrop
        isOpen={isOpen}
        onClick={handleBackdropClick}
        data-testid={testId ? `${testId}-backdrop` : undefined}
        role="presentation"
      >
        <ModalContent
          ref={ref}
          size={size}
          isOpen={isOpen}
          data-testid={testId}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel || title}
        >
          {title && (
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
              <CloseButton
                onClick={handleCloseClick}
                aria-label="Close modal"
                data-testid={testId ? `${testId}-close` : undefined}
              >
                ✕
              </CloseButton>
            </ModalHeader>
          )}
          <ModalBody>{children}</ModalBody>
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </ModalContent>
      </Backdrop>
    )
  }
)

Modal.displayName = 'Modal'
