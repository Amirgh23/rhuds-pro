import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeatureCardsGrid } from '../FeatureCardsGrid';

describe('FeatureCardsGrid', () => {
  const mockCards = [
    {
      icon: '⚡',
      title: 'Feature 1',
      description: 'Description 1',
      color: 'cyan' as const,
    },
    {
      icon: '✨',
      title: 'Feature 2',
      description: 'Description 2',
      color: 'magenta' as const,
    },
    {
      icon: '🎮',
      title: 'Feature 3',
      description: 'Description 3',
      color: 'blue' as const,
    },
  ];

  it('renders all cards', () => {
    render(<FeatureCardsGrid cards={mockCards} />);
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
  });

  it('renders with correct grid structure', () => {
    const { container } = render(<FeatureCardsGrid cards={mockCards} />);
    const grid = container.querySelector('.feature-cards-grid');
    expect(grid).toBeInTheDocument();
    const items = container.querySelectorAll('.feature-cards-grid__item');
    expect(items).toHaveLength(3);
  });

  it('applies animation delays to cards', () => {
    const { container } = render(
      <FeatureCardsGrid cards={mockCards} startDelay={1700} staggerInterval={150} />
    );
    const items = container.querySelectorAll('.feature-cards-grid__item');
    items.forEach((item, index) => {
      const expectedDelay = 1700 + index * 150;
      expect(item).toHaveStyle(`animation-delay: ${expectedDelay}ms`);
    });
  });

  it('handles card click events', () => {
    const handleCardClick = jest.fn();
    render(<FeatureCardsGrid cards={mockCards} onCardClick={handleCardClick} />);
    const cards = screen.getAllByRole('button');
    cards[0].click();
    expect(handleCardClick).toHaveBeenCalledWith(0);
  });

  it('renders empty grid with no cards', () => {
    const { container } = render(<FeatureCardsGrid cards={[]} />);
    const grid = container.querySelector('.feature-cards-grid');
    expect(grid).toBeInTheDocument();
    const items = container.querySelectorAll('.feature-cards-grid__item');
    expect(items).toHaveLength(0);
  });

  it('passes card props correctly', () => {
    render(<FeatureCardsGrid cards={mockCards} />);
    mockCards.forEach((card) => {
      expect(screen.getByText(card.title)).toBeInTheDocument();
      expect(screen.getByText(card.description)).toBeInTheDocument();
    });
  });

  it('has proper CSS classes', () => {
    const { container } = render(<FeatureCardsGrid cards={mockCards} />);
    expect(container.querySelector('.feature-cards-grid')).toBeInTheDocument();
    expect(container.querySelectorAll('.feature-cards-grid__item')).toHaveLength(3);
  });

  it('supports custom start delay', () => {
    const { container } = render(
      <FeatureCardsGrid cards={mockCards} startDelay={2000} staggerInterval={100} />
    );
    const firstItem = container.querySelector('.feature-cards-grid__item');
    expect(firstItem).toHaveStyle('animation-delay: 2000ms');
  });

  it('supports custom stagger interval', () => {
    const { container } = render(
      <FeatureCardsGrid cards={mockCards} startDelay={1700} staggerInterval={200} />
    );
    const items = container.querySelectorAll('.feature-cards-grid__item');
    expect(items[1]).toHaveStyle('animation-delay: 1900ms');
    expect(items[2]).toHaveStyle('animation-delay: 2100ms');
  });
});
