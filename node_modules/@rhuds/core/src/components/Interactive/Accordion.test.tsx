import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Accordion } from './Accordion'

describe('Accordion Component', () => {
  const mockItems = [
    { id: 'item1', title: 'Item 1', content: 'Content 1' },
    { id: 'item2', title: 'Item 2', content: 'Content 2' },
    { id: 'item3', title: 'Item 3', content: 'Content 3' },
  ]

  it('renders all accordion items', () => {
    render(<Accordion items={mockItems} />)

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('expands item when header is clicked', () => {
    render(<Accordion items={mockItems} />)

    const header1 = screen.getByRole('button', { name: /Item 1/i })
    fireEvent.click(header1)

    expect(screen.getByText('Content 1')).toBeVisible()
  })

  it('collapses item when header is clicked again', () => {
    render(<Accordion items={mockItems} />)

    const header1 = screen.getByRole('button', { name: /Item 1/i })
    fireEvent.click(header1)
    fireEvent.click(header1)

    expect(screen.queryByText('Content 1')).not.toBeVisible()
  })

  it('collapses previous item when new item is expanded (single mode)', () => {
    render(<Accordion items={mockItems} allowMultiple={false} />)

    const header1 = screen.getByRole('button', { name: /Item 1/i })
    const header2 = screen.getByRole('button', { name: /Item 2/i })

    fireEvent.click(header1)
    expect(screen.getByText('Content 1')).toBeVisible()

    fireEvent.click(header2)
    expect(screen.queryByText('Content 1')).not.toBeVisible()
    expect(screen.getByText('Content 2')).toBeVisible()
  })

  it('allows multiple items to be expanded (multiple mode)', () => {
    render(<Accordion items={mockItems} allowMultiple={true} />)

    const header1 = screen.getByRole('button', { name: /Item 1/i })
    const header2 = screen.getByRole('button', { name: /Item 2/i })

    fireEvent.click(header1)
    fireEvent.click(header2)

    expect(screen.getByText('Content 1')).toBeVisible()
    expect(screen.getByText('Content 2')).toBeVisible()
  })

  it('supports keyboard navigation with arrow keys', () => {
    render(<Accordion items={mockItems} />)

    const header1 = screen.getByRole('button', { name: /Item 1/i })
    fireEvent.keyDown(header1, { key: 'ArrowDown' })

    const header2 = screen.getByRole('button', { name: /Item 2/i })
    expect(header2).toHaveFocus()
  })

  it('supports Home and End keys', () => {
    render(<Accordion items={mockItems} />)

    const header2 = screen.getByRole('button', { name: /Item 2/i })
    fireEvent.keyDown(header2, { key: 'Home' })

    const header1 = screen.getByRole('button', { name: /Item 1/i })
    expect(header1).toHaveFocus()

    fireEvent.keyDown(header1, { key: 'End' })

    const header3 = screen.getByRole('button', { name: /Item 3/i })
    expect(header3).toHaveFocus()
  })

  it('disables items when disabled prop is true', () => {
    const items = [
      { id: 'item1', title: 'Item 1', content: 'Content 1' },
      { id: 'item2', title: 'Item 2', content: 'Content 2', disabled: true },
    ]

    render(<Accordion items={items} />)

    const header2 = screen.getByRole('button', { name: /Item 2/i })
    expect(header2).toBeDisabled()
  })

  it('supports controlled expanded state', () => {
    const onExpandChange = jest.fn()
    const { rerender } = render(
      <Accordion
        items={mockItems}
        expandedIds={[]}
        onExpandChange={onExpandChange}
      />
    )

    const header1 = screen.getByRole('button', { name: /Item 1/i })
    fireEvent.click(header1)

    expect(onExpandChange).toHaveBeenCalledWith(['item1'])

    rerender(
      <Accordion
        items={mockItems}
        expandedIds={['item1']}
        onExpandChange={onExpandChange}
      />
    )

    expect(screen.getByText('Content 1')).toBeVisible()
  })

  it('has correct ARIA attributes', () => {
    render(<Accordion items={mockItems} ariaLabel="Custom accordion" />)

    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('aria-label', 'Custom accordion')

    const header1 = screen.getByRole('button', { name: /Item 1/i })
    expect(header1).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(header1)

    expect(header1).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders content with correct ARIA attributes', () => {
    render(<Accordion items={mockItems} testId="accordion" />)

    const header1 = screen.getByRole('button', { name: /Item 1/i })
    fireEvent.click(header1)

    const content = screen.getByText('Content 1')
    expect(content.parentElement).toHaveAttribute('role', 'region')
  })
})
