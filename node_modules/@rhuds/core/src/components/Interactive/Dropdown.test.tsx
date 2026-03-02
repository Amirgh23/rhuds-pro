import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Dropdown } from './Dropdown'

describe('Dropdown Component', () => {
  const mockItems = [
    { id: '1', label: 'Option 1', onClick: jest.fn() },
    { id: '2', label: 'Option 2', onClick: jest.fn() },
    { id: '3', label: 'Option 3', onClick: jest.fn() },
  ]

  it('renders trigger element', () => {
    render(
      <Dropdown trigger={<button>Open Menu</button>} items={mockItems} />
    )

    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('opens menu when trigger is clicked', () => {
    render(
      <Dropdown trigger={<button>Open Menu</button>} items={mockItems} />
    )

    const trigger = screen.getByText('Open Menu')
    fireEvent.click(trigger)

    expect(screen.getByRole('menu')).toHaveStyle('opacity: 1')
  })

  it('closes menu when item is clicked', () => {
    render(
      <Dropdown trigger={<button>Open Menu</button>} items={mockItems} />
    )

    const trigger = screen.getByText('Open Menu')
    fireEvent.click(trigger)

    const item = screen.getByRole('menuitem', { name: 'Option 1' })
    fireEvent.click(item)

    expect(screen.getByRole('menu')).toHaveStyle('opacity: 0')
  })

  it('calls item onClick handler when clicked', () => {
    const onClick = jest.fn()
    const items = [{ id: '1', label: 'Option 1', onClick }]

    render(
      <Dropdown trigger={<button>Open Menu</button>} items={items} />
    )

    const trigger = screen.getByText('Open Menu')
    fireEvent.click(trigger)

    const item = screen.getByRole('menuitem')
    fireEvent.click(item)

    expect(onClick).toHaveBeenCalled()
  })

  it('closes menu when clicking outside', () => {
    render(
      <div>
        <Dropdown trigger={<button>Open Menu</button>} items={mockItems} />
        <div data-testid="outside">Outside element</div>
      </div>
    )

    const trigger = screen.getByText('Open Menu')
    fireEvent.click(trigger)

    const outside = screen.getByTestId('outside')
    fireEvent.mouseDown(outside)

    expect(screen.getByRole('menu')).toHaveStyle('opacity: 0')
  })

  it('supports keyboard navigation with arrow keys', () => {
    render(
      <Dropdown trigger={<button>Open Menu</button>} items={mockItems} />
    )

    const trigger = screen.getByText('Open Menu')
    fireEvent.click(trigger)

    const menu = screen.getByRole('menu')
    fireEvent.keyDown(menu, { key: 'ArrowDown' })

    const firstItem = screen.getByRole('menuitem', { name: 'Option 1' })
    expect(firstItem).toHaveFocus()
  })

  it('supports keyboard navigation with Escape key', () => {
    render(
      <Dropdown trigger={<button>Open Menu</button>} items={mockItems} />
    )

    const trigger = screen.getByText('Open Menu')
    fireEvent.click(trigger)

    const menu = screen.getByRole('menu')
    fireEvent.keyDown(menu, { key: 'Escape' })

    expect(menu).toHaveStyle('opacity: 0')
  })

  it('disables items when disabled prop is true', () => {
    const items = [
      { id: '1', label: 'Option 1', onClick: jest.fn() },
      { id: '2', label: 'Option 2', onClick: jest.fn(), disabled: true },
    ]

    render(
      <Dropdown trigger={<button>Open Menu</button>} items={items} />
    )

    const trigger = screen.getByText('Open Menu')
    fireEvent.click(trigger)

    const disabledItem = screen.getByRole('menuitem', { name: 'Option 2' })
    expect(disabledItem).toBeDisabled()
  })

  it('renders divider items', () => {
    const items = [
      { id: '1', label: 'Option 1', onClick: jest.fn() },
      { id: 'divider', label: '', divider: true },
      { id: '2', label: 'Option 2', onClick: jest.fn() },
    ]

    render(
      <Dropdown trigger={<button>Open Menu</button>} items={items} />
    )

    const trigger = screen.getByText('Open Menu')
    fireEvent.click(trigger)

    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('supports controlled open state', () => {
    const onOpenChange = jest.fn()
    const { rerender } = render(
      <Dropdown
        trigger={<button>Open Menu</button>}
        items={mockItems}
        isOpen={false}
        onOpenChange={onOpenChange}
      />
    )

    const trigger = screen.getByText('Open Menu')
    fireEvent.click(trigger)

    expect(onOpenChange).toHaveBeenCalledWith(true)

    rerender(
      <Dropdown
        trigger={<button>Open Menu</button>}
        items={mockItems}
        isOpen={true}
        onOpenChange={onOpenChange}
      />
    )

    expect(screen.getByRole('menu')).toHaveStyle('opacity: 1')
  })

  it('has correct ARIA attributes', () => {
    render(
      <Dropdown
        trigger={<button>Open Menu</button>}
        items={mockItems}
        ariaLabel="Custom menu"
      />
    )

    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-label', 'Custom menu')
  })
})
