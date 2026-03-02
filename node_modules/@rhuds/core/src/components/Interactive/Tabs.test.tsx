import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs } from './Tabs'

describe('Tabs Component', () => {
  const mockItems = [
    { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
    { id: 'tab3', label: 'Tab 3', content: 'Content 3' },
  ]

  it('renders all tabs', () => {
    render(<Tabs items={mockItems} />)

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument()
  })

  it('displays first tab content by default', () => {
    render(<Tabs items={mockItems} />)

    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
  })

  it('switches tab when clicked', () => {
    render(<Tabs items={mockItems} />)

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
    fireEvent.click(tab2)

    expect(screen.getByText('Content 2')).toBeInTheDocument()
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
  })

  it('supports keyboard navigation with arrow keys', () => {
    render(<Tabs items={mockItems} />)

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
    fireEvent.keyDown(tab1, { key: 'ArrowRight' })

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
    expect(tab2).toHaveFocus()
  })

  it('wraps around with arrow keys', () => {
    render(<Tabs items={mockItems} />)

    const tab3 = screen.getByRole('tab', { name: 'Tab 3' })
    fireEvent.click(tab3)
    fireEvent.keyDown(tab3, { key: 'ArrowRight' })

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
    expect(tab1).toHaveFocus()
  })

  it('supports Home and End keys', () => {
    render(<Tabs items={mockItems} />)

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
    fireEvent.click(tab2)
    fireEvent.keyDown(tab2, { key: 'Home' })

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
    expect(tab1).toHaveFocus()

    fireEvent.keyDown(tab1, { key: 'End' })

    const tab3 = screen.getByRole('tab', { name: 'Tab 3' })
    expect(tab3).toHaveFocus()
  })

  it('disables tabs when disabled prop is true', () => {
    const items = [
      { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
      { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true },
    ]

    render(<Tabs items={items} />)

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
    expect(tab2).toBeDisabled()
  })

  it('supports controlled active tab', () => {
    const onTabChange = jest.fn()
    const { rerender } = render(
      <Tabs items={mockItems} activeTabId="tab1" onTabChange={onTabChange} />
    )

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
    fireEvent.click(tab2)

    expect(onTabChange).toHaveBeenCalledWith('tab2')

    rerender(
      <Tabs items={mockItems} activeTabId="tab2" onTabChange={onTabChange} />
    )

    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('renders card variant', () => {
    const { container } = render(<Tabs items={mockItems} variant="card" />)

    const tabsList = container.querySelector('[role="tablist"]')
    expect(tabsList).toHaveStyle('gap: var(--rhuds-spacing-sm)')
  })

  it('has correct ARIA attributes', () => {
    render(<Tabs items={mockItems} ariaLabel="Custom tabs" />)

    const tablist = screen.getByRole('tablist')
    expect(tablist).toHaveAttribute('aria-label', 'Custom tabs')

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
    expect(tab1).toHaveAttribute('aria-selected', 'true')

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
    expect(tab2).toHaveAttribute('aria-selected', 'false')
  })

  it('renders tab panels with correct ARIA attributes', () => {
    render(<Tabs items={mockItems} testId="tabs" />)

    const panel1 = screen.getByRole('tabpanel', { hidden: true })
    expect(panel1).toHaveAttribute('aria-labelledby', 'tabs-tab-tab1')
  })
})
