import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './Modal'

describe('Modal Component', () => {
  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Test content
      </Modal>
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        Test content
      </Modal>
    )

    const dialog = screen.queryByRole('dialog')
    expect(dialog).toHaveStyle('visibility: hidden')
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        Test content
      </Modal>
    )

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={onClose} closeOnBackdropClick={true}>
        Test content
      </Modal>
    )

    const backdrop = screen.getByRole('presentation')
    fireEvent.click(backdrop)

    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when backdrop is clicked if closeOnBackdropClick is false', () => {
    const onClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={onClose} closeOnBackdropClick={false}>
        Test content
      </Modal>
    )

    const backdrop = screen.getByRole('presentation')
    fireEvent.click(backdrop)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={onClose} closeOnEscape={true}>
        Test content
      </Modal>
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when Escape key is pressed if closeOnEscape is false', () => {
    const onClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={onClose} closeOnEscape={false}>
        Test content
      </Modal>
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders footer when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} footer={<div>Footer content</div>}>
        Test content
      </Modal>
    )

    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('applies correct size styles', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} size="sm">
        Test content
      </Modal>
    )

    let dialog = screen.getByRole('dialog')
    expect(dialog).toHaveStyle('max-width: 400px')

    rerender(
      <Modal isOpen={true} onClose={() => {}} size="lg">
        Test content
      </Modal>
    )

    dialog = screen.getByRole('dialog')
    expect(dialog).toHaveStyle('max-width: 800px')
  })

  it('has correct ARIA attributes', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal" ariaLabel="Custom label">
        Test content
      </Modal>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Custom label')
  })

  it('renders without title when not provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Test content
      </Modal>
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
})
