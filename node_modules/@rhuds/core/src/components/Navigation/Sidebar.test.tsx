import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from './Sidebar'

describe('Sidebar Component', () => {
  const mockItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ]

  it('renders sidebar with items', () => {
    render(<Sidebar items={mockItems} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('renders icons when provided', () => {
    render(<Sidebar items={mockItems} />)

    expect(screen.getByText('📊')).toBeInTheDocument()
    expect(screen.getByText('⚙️')).toBeInTheDocument()
    expect(screen.getByText('👤')).toBeInTheDocument()
  })

  it('marks active item', () => {
    const items = [
      { id: 'dashboard', label: 'Dashboard', active: true },
      { id: 'settings', label: 'Settings' },
    ]

    render(<Sidebar items={items} />)

    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveAttribute('active')
  })

  it('calls onItemClick when item is clicked', () => {
    const onItemClick = jest.fn()
    render(<Sidebar items={mockItems} onItemClick={onItemClick} />)

    const dashboardLink = screen.getByText('Dashboard')
    fireEvent.click(dashboardLink)

    expect(onItemClick).toHaveBeenCalledWith('dashboard')
  })

  it('toggles collapse state', () => {
    render(<Sidebar items={mockItems} />)

    const collapseButton = screen.getByLabelText('Collapse sidebar')
    fireEvent.click(collapseButton)

    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument()
  })

  it('disables items when disabled prop is true', () => {
    const items = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'settings', label: 'Settings', disabled: true },
    ]

    render(<Sidebar items={items} />)

    const settingsLink = screen.getByText('Settings').closest('a')
    expect(settingsLink).toHaveAttribute('disabled')
  })

  it('supports controlled collapsed state', () => {
    const onCollapsedChange = jest.fn()
    const { rerender } = render(
      <Sidebar
        items={mockItems}
        isCollapsed={false}
        onCollapsedChange={onCollapsedChange}
      />
    )

    const collapseButton = screen.getByLabelText('Collapse sidebar')
    fireEvent.click(collapseButton)

    expect(onCollapsedChange).toHaveBeenCalledWith(true)

    rerender(
      <Sidebar
        items={mockItems}
        isCollapsed={true}
        onCollapsedChange={onCollapsedChange}
      />
    )

    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument()
  })

  it('has correct ARIA attributes', () => {
    render(<Sidebar items={mockItems} ariaLabel="Sidebar navigation" />)

    const aside = screen.getByRole('complementary')
    expect(aside).toHaveAttribute('aria-label', 'Sidebar navigation')
  })

  it('renders menu items with correct roles', () => {
    render(<Sidebar items={mockItems} />)

    const menuItems = screen.getAllByRole('menuitem')
    expect(menuItems).toHaveLength(3)
  })

  it('shows title on collapsed items', () => {
    render(<Sidebar items={mockItems} isCollapsed={true} />)

    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveAttribute('title', 'Dashboard')
  })
})
