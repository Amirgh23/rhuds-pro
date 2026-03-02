import React from 'react'
import { render, screen } from '@testing-library/react'
import { Text } from './Text'

describe('Text Component', () => {
  it('renders text content', () => {
    render(<Text>Hello World</Text>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Text variant="heading">Heading</Text>)
    expect(screen.getByText('Heading')).toBeInTheDocument()

    rerender(<Text variant="label">Label</Text>)
    expect(screen.getByText('Label')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Text size="sm">Small</Text>)
    expect(screen.getByText('Small')).toBeInTheDocument()

    rerender(<Text size="lg">Large</Text>)
    expect(screen.getByText('Large')).toBeInTheDocument()
  })

  it('renders with different colors', () => {
    const { rerender } = render(<Text color="primary">Primary</Text>)
    expect(screen.getByText('Primary')).toBeInTheDocument()

    rerender(<Text color="secondary">Secondary</Text>)
    expect(screen.getByText('Secondary')).toBeInTheDocument()
  })

  it('renders as different HTML elements', () => {
    const { container, rerender } = render(<Text as="p">Paragraph</Text>)
    expect(container.querySelector('p')).toBeInTheDocument()

    rerender(<Text as="h1">Heading</Text>)
    expect(container.querySelector('h1')).toBeInTheDocument()
  })
})
