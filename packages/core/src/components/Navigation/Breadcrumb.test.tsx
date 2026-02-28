import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Breadcrumb } from './Breadcrumb'

describe('Breadcrumb Component', () => {
  const mockItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'electronics', label: 'Electronics', href: '/products/electronics', active: true },
  ]

  it('renders breadcrumb items', () => {
    render(<Breadcrumb items={mockItems} />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Electronics')).toBeInTheDocument()
  })

  it('renders separators between items', () => {
    const { container } = render(<Breadcrumb items={mockItems} />)

    const separators = container.querySelectorAll('[aria-hidden="true"]')
    expect(separators.length).toBeGreaterThan(0)
  })

  it('uses custom separator', () => {
    const { container } = render(
      <Breadcrumb items={mockItems} separator=">" />
    )

    expect(screen.getByText('>')).toBeInTheDocument()
  })

  it('marks active item', () => {
    render(<Breadcrumb items={mockItems} />)

    const electronicsLink = screen.getByText('Electronics').closest('a')
    expect(electronicsLink).toHaveAttribute('aria-current', 'page')
  })

  it('calls onItemClick when non-active item is clicked', () => {
    const onItemClick = jest.fn()
    render(<Breadcrumb items={mockItems} onItemClick={onItemClick} />)

    const homeLink = screen.getByText('Home')
    fireEvent.click(homeLink)

    expect(onItemClick).toHaveBeenCalledWith('home')
  })

  it('does not call onItemClick when active item is clicked', () => {
    const onItemClick = jest.fn()
    render(<Breadcrumb items={mockItems} onItemClick={onItemClick} />)

    const electronicsLink = screen.getByText('Electronics')
    fireEvent.click(electronicsLink)

    expect(onItemClick).not.toHaveBeenCalled()
  })

  it('supports onClick callback for items without href', () => {
    const onClick = jest.fn()
    const items = [
      { id: 'home', label: 'Home', onClick },
      { id: 'products', label: 'Products', active: true },
    ]

    render(<Breadcrumb items={items} />)

    const homeLink = screen.getByText('Home')
    fireEvent.click(homeLink)

    expect(onClick).toHaveBeenCalled()
  })

  it('has correct ARIA attributes', () => {
    render(<Breadcrumb items={mockItems} ariaLabel="Breadcrumb navigation" />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb navigation')
  })

  it('renders list with correct structure', () => {
    const { container } = render(<Breadcrumb items={mockItems} />)

    const list = container.querySelector('ol')
    expect(list).toBeInTheDocument()

    const listItems = container.querySelectorAll('li')
    expect(listItems.length).toBeGreaterThan(0)
  })

  it('does not render separator after last item', () => {
    const { container } = render(<Breadcrumb items={mockItems} />)

    const listItems = container.querySelectorAll('li')
    const lastItem = listItems[listItems.length - 1]
    const separator = lastItem.querySelector('[aria-hidden="true"]')

    expect(separator).not.toBeInTheDocument()
  })
})
