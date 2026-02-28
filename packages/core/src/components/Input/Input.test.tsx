import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './Input'

describe('Input Component', () => {
  it('renders input field', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password')
  })

  it('handles value changes', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('disables when disabled prop is true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('shows error state', () => {
    const { container } = render(<Input error errorMessage="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders with icon', () => {
    render(
      <Input
        icon={<span data-testid="search-icon">🔍</span>}
        placeholder="Search"
      />
    )
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Input size="sm" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()

    rerender(<Input size="lg" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(
      <Input
        ariaLabel="Email address"
        ariaDescribedBy="email-help"
      />
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Email address')
  })

  it('shows error message with aria-invalid', () => {
    render(<Input error errorMessage="Invalid input" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })
})
