import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureCard } from '../FeatureCard';

describe('FeatureCard', () => {
  const defaultProps = {
    icon: '⚡',
    title: 'Test Feature',
    description: 'This is a test feature card',
    color: 'cyan' as const,
  };

  it('renders with required props', () => {
    render(<FeatureCard {...defaultProps} />);
    expect(screen.getByText('Test Feature')).toBeInTheDocument();
    expect(screen.getByText('This is a test feature card')).toBeInTheDocument();
  });

  it('renders icon correctly', () => {
    render(<FeatureCard {...defaultProps} />);
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('applies correct color class', () => {
    const { container } = render(<FeatureCard {...defaultProps} color="magenta" />);
    const card = container.querySelector('.feature-card');
    expect(card).toHaveStyle('--card-color: #EF3EF1');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<FeatureCard {...defaultProps} onClick={handleClick} />);
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalled();
  });

  it('handles keyboard activation (Enter key)', () => {
    const handleClick = jest.fn();
    render(<FeatureCard {...defaultProps} onClick={handleClick} />);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });

  it('handles keyboard activation (Space key)', () => {
    const handleClick = jest.fn();
    render(<FeatureCard {...defaultProps} onClick={handleClick} />);
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders with different colors', () => {
    const colors: Array<'cyan' | 'magenta' | 'blue'> = ['cyan', 'magenta', 'blue'];
    colors.forEach((color) => {
      const { container } = render(<FeatureCard {...defaultProps} color={color} />);
      const card = container.querySelector('.feature-card');
      expect(card).toBeInTheDocument();
    });
  });

  it('applies animation delay', () => {
    const { container } = render(<FeatureCard {...defaultProps} animationDelay={200} />);
    const card = container.querySelector('.feature-card');
    expect(card).toBeInTheDocument();
  });

  it('renders frame SVG', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 300 400');
  });

  it('has proper CSS classes', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    expect(container.querySelector('.feature-card')).toBeInTheDocument();
    expect(container.querySelector('.feature-card__content')).toBeInTheDocument();
    expect(container.querySelector('.feature-card__icon')).toBeInTheDocument();
    expect(container.querySelector('.feature-card__title')).toBeInTheDocument();
    expect(container.querySelector('.feature-card__description')).toBeInTheDocument();
  });
});
