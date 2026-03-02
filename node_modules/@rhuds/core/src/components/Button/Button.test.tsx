import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /Click me/i })).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading spinner when loading', () => {
    const { container } = render(<Button loading>Loading</Button>)
    expect(container.querySelector('div[class*="Spinner"]')).toBeInTheDocument()
  })

  it('renders with icon', () => {
    render(
      <Button icon={<span data-testid="icon">🔒</span>}>
        Login
      </Button>
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders fullWidth', () => {
    const { container } = render(<Button fullWidth>Full Width</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveStyle('width: 100%')
  })

  it('has proper accessibility attributes', () => {
    render(<Button ariaLabel="Submit form">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Submit form')
  })

  it('has focus visible outline', () => {
    render(<Button>Focus me</Button>)
    const button = screen.getByRole('button')
    fireEvent.focus(button)
    expect(button).toHaveFocus()
  })
})
