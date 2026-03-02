import React from 'react'
import { render, screen } from '@testing-library/react'
import { Icon } from './Icon'

describe('Icon Component', () => {
  it('renders SVG icon', () => {
    const { container } = render(
      <Icon testId="test-icon">
        <circle cx="12" cy="12" r="10" />
      </Icon>
    )
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { container, rerender } = render(
      <Icon size="sm">
        <circle cx="12" cy="12" r="10" />
      </Icon>
    )
    expect(container.querySelector('svg')).toHaveAttribute('width', '16px')

    rerender(
      <Icon size="lg">
        <circle cx="12" cy="12" r="10" />
      </Icon>
    )
    expect(container.querySelector('svg')).toHaveAttribute('width', '32px')
  })

  it('renders with different colors', () => {
    const { container, rerender } = render(
      <Icon color="primary">
        <circle cx="12" cy="12" r="10" />
      </Icon>
    )
    expect(container.querySelector('svg')).toBeInTheDocument()

    rerender(
      <Icon color="secondary">
        <circle cx="12" cy="12" r="10" />
      </Icon>
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
