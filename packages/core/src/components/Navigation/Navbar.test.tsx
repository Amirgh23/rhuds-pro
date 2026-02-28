import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar } from './Navbar'

describe('Navbar Component', () => {
  const mockItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About', href: '/about' },
    { id: 'contact', label: 'Contact', href: '/contact' },
  ]

  it('renders navbar with items', () => {
    render(<Navbar items={mockItems} />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders logo when provided', () => {
    render(<Navbar logo={<div>Logo</div>} items={mockItems} />)

    expect(screen.getByText('Logo')).toBeInTheDocument()
  })

  it('marks active item', () => {
    const items = [
      { id: 'home', label: 'Home', href: '/', active: true },
      { id: 'about', label: 'About', href: '/about' },
    ]

    render(<Navbar items={items} />)

    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveAttribute('active')
  })

  it('calls onItemClick when item is clicked', () => {
    const onItemClick = jest.fn()
    render(<Navbar items={mockItems} onItemClick={onItemClick} />)

    const homeLink = screen.getByText('Home')
    fireEvent.click(homeLink)

    expect(onItemClick).toHaveBeenCalledWith('home')
  })

  it('toggles mobile menu', () => {
    render(<Navbar items={mockItems} />)

    const toggleButton = screen.getByLabelText('Toggle mobile menu')
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes mobile menu when item is clicked', () => {
    render(<Navbar items={mockItems} />)

    const toggleButton = screen.getByLabelText('Toggle mobile menu')
    fireEvent.click(toggleButton)

    const homeLink = screen.getByText('Home')
    fireEvent.click(homeLink)

    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('supports controlled mobile menu state', () => {
    const onMobileMenuToggle = jest.fn()
    const { rerender } = render(
      <Navbar
        items={mockItems}
        mobileMenuOpen={false}
        onMobileMenuToggle={onMobileMenuToggle}
      />
    )

    const toggleButton = screen.getByLabelText('Toggle mobile menu')
    fireEvent.click(toggleButton)

    expect(onMobileMenuToggle).toHaveBeenCalled()

    rerender(
      <Navbar
        items={mockItems}
        mobileMenuOpen={true}
        onMobileMenuToggle={onMobileMenuToggle}
      />
    )

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('has correct ARIA attributes', () => {
    render(<Navbar items={mockItems} ariaLabel="Main navigation" />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
  })

  it('renders menu items with correct roles', () => {
    render(<Navbar items={mockItems} />)

    const menuItems = screen.getAllByRole('menuitem')
    expect(menuItems).toHaveLength(3)
  })
})
