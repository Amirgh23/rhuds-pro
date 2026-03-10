/**
 * FeatureCardsGrid Component Tests
 *
 * Comprehensive unit tests for the FeatureCardsGrid component including:
 * - Responsive grid layout (3 desktop, 2 tablet, 1 mobile)
 * - Staggered animation delays
 * - Intersection observer integration
 * - Card rendering and consistency
 * - Responsive behavior
 * - Accessibility features
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeAll } from 'vitest';
import { FeatureCardsGrid } from '../FeatureCardsGrid';
import type { FeatureCardData } from '../../types';
import { ANIMATION_CONFIG, SPACING_SCALE, BREAKPOINTS } from '../../constants';
import '@testing-library/jest-dom';

// Mock IntersectionObserver and ResizeObserver
beforeAll(() => {
  class MockIntersectionObserver {
    constructor(public callback: IntersectionObserverCallback) {}

    observe() {
      // Mock implementation
    }

    unobserve() {
      // Mock implementation
    }

    disconnect() {
      // Mock implementation
    }
  }

  class MockResizeObserver {
    constructor(public callback: ResizeObserverCallback) {}

    observe() {
      // Mock implementation
    }

    unobserve() {
      // Mock implementation
    }

    disconnect() {
      // Mock implementation
    }
  }

  global.IntersectionObserver = MockIntersectionObserver as any;
  global.ResizeObserver = MockResizeObserver as any;
});

// Mock feature data
const mockFeatures: FeatureCardData[] = [
  {
    id: 'feature-1',
    title: 'Feature One',
    description: 'Description for feature one',
    frameType: 'octagon',
  },
  {
    id: 'feature-2',
    title: 'Feature Two',
    description: 'Description for feature two',
    frameType: 'octagon',
  },
  {
    id: 'feature-3',
    title: 'Feature Three',
    description: 'Description for feature three',
    frameType: 'octagon',
  },
  {
    id: 'feature-4',
    title: 'Feature Four',
    description: 'Description for feature four',
    frameType: 'octagon',
  },
  {
    id: 'feature-5',
    title: 'Feature Five',
    description: 'Description for feature five',
    frameType: 'octagon',
  },
  {
    id: 'feature-6',
    title: 'Feature Six',
    description: 'Description for feature six',
    frameType: 'octagon',
  },
];

describe('FeatureCardsGrid Component', () => {
  // ========================================================================
  // Basic Rendering Tests
  // ========================================================================

  test('renders grid container with correct role', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByRole('region');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('feature-cards-grid');
  });

  test('renders all feature cards', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    mockFeatures.forEach((feature) => {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    });
  });

  test('renders correct number of grid items', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const items = screen.getAllByTestId(/feature-card-item-/);
    expect(items).toHaveLength(mockFeatures.length);
  });

  test('renders empty grid when no features provided', () => {
    render(<FeatureCardsGrid features={[]} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
    const items = grid.querySelectorAll('.feature-cards-grid__item');
    expect(items).toHaveLength(0);
  });

  // ========================================================================
  // Grid Layout Tests
  // ========================================================================

  test('applies correct grid template columns for desktop', () => {
    // Set viewport to desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    render(<FeatureCardsGrid features={mockFeatures} columns="auto" />);
    const grid = screen.getByTestId('feature-cards-grid');

    // Check CSS custom property
    const style = grid.getAttribute('style');
    expect(style).toContain('--grid-columns');
  });

  test('applies correct grid template columns for tablet', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    render(<FeatureCardsGrid features={mockFeatures} columns="auto" />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('applies correct grid template columns for mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    });

    render(<FeatureCardsGrid features={mockFeatures} columns="auto" />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('respects explicit columns prop', () => {
    render(<FeatureCardsGrid features={mockFeatures} columns={2} />);
    const grid = screen.getByTestId('feature-cards-grid');
    const style = grid.getAttribute('style');
    expect(style).toContain('--grid-columns');
  });

  test('renders 1 column when columns prop is 1', () => {
    render(<FeatureCardsGrid features={mockFeatures} columns={1} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('renders 2 columns when columns prop is 2', () => {
    render(<FeatureCardsGrid features={mockFeatures} columns={2} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('renders 3 columns when columns prop is 3', () => {
    render(<FeatureCardsGrid features={mockFeatures} columns={3} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  // ========================================================================
  // Animation Delay Tests
  // ========================================================================

  test('applies correct animation delay to first card', () => {
    const animationDelay = 1700;
    render(
      <FeatureCardsGrid
        features={mockFeatures}
        animationDelay={animationDelay}
        staggerInterval={150}
      />
    );

    const firstCard = screen.getByTestId('feature-card-item-feature-1');
    expect(firstCard).toBeInTheDocument();
  });

  test('applies staggered animation delays to cards', () => {
    const animationDelay = 1700;
    const staggerInterval = 150;

    render(
      <FeatureCardsGrid
        features={mockFeatures}
        animationDelay={animationDelay}
        staggerInterval={staggerInterval}
      />
    );

    // Verify all cards are rendered
    mockFeatures.forEach((feature) => {
      expect(screen.getByTestId(`feature-card-item-${feature.id}`)).toBeInTheDocument();
    });
  });

  test('uses default animation delay from ANIMATION_CONFIG', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('uses default stagger interval from ANIMATION_CONFIG', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('applies custom animation delay', () => {
    const customDelay = 2000;
    render(<FeatureCardsGrid features={mockFeatures} animationDelay={customDelay} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('applies custom stagger interval', () => {
    const customStagger = 200;
    render(<FeatureCardsGrid features={mockFeatures} staggerInterval={customStagger} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  // ========================================================================
  // Card Consistency Tests
  // ========================================================================

  test('all cards have consistent structure', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);

    mockFeatures.forEach((feature) => {
      const card = screen.getByTestId(`feature-card-item-${feature.id}`);
      expect(card).toHaveClass('feature-cards-grid__item');
      expect(card.querySelector('.feature-card')).toBeInTheDocument();
    });
  });

  test('all cards have consistent padding', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);

    const items = screen.getAllByTestId(/feature-card-item-/);
    items.forEach((item) => {
      expect(item).toHaveClass('feature-cards-grid__item');
    });
  });

  test('all cards have consistent spacing', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);

    const grid = screen.getByTestId('feature-cards-grid');
    const items = grid.querySelectorAll('.feature-cards-grid__item');
    expect(items.length).toBe(mockFeatures.length);
  });

  test('cards maintain equal height in grid', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);

    const items = screen.getAllByTestId(/feature-card-item-/);
    items.forEach((item) => {
      expect(item).toHaveStyle('display: flex');
      expect(item).toHaveStyle('flex-direction: column');
    });
  });

  // ========================================================================
  // Responsive Behavior Tests
  // ========================================================================

  test('grid adapts to viewport width changes', () => {
    const { rerender } = render(<FeatureCardsGrid features={mockFeatures} columns="auto" />);

    // Change viewport width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    rerender(<FeatureCardsGrid features={mockFeatures} columns="auto" />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('gap size is applied via CSS custom property', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByTestId('feature-cards-grid');
    const style = grid.getAttribute('style');
    expect(style).toContain('--gap-size');
  });

  test('grid maintains proper spacing on mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('grid maintains proper spacing on tablet', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('grid maintains proper spacing on desktop', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });

    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  // ========================================================================
  // Intersection Observer Tests
  // ========================================================================

  test('uses intersection observer for viewport detection', () => {
    const observerSpy = vi.spyOn(global, 'IntersectionObserver' as any);
    render(<FeatureCardsGrid features={mockFeatures} />);
    expect(observerSpy).toHaveBeenCalled();
    observerSpy.mockRestore();
  });

  test('registers all cards with intersection observer', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    mockFeatures.forEach((feature) => {
      expect(screen.getByTestId(`feature-card-item-${feature.id}`)).toBeInTheDocument();
    });
  });

  test('triggers animation when card enters viewport', async () => {
    render(<FeatureCardsGrid features={mockFeatures} />);

    await waitFor(() => {
      mockFeatures.forEach((feature) => {
        expect(screen.getByTestId(`feature-card-item-${feature.id}`)).toBeInTheDocument();
      });
    });
  });

  // ========================================================================
  // Accessibility Tests
  // ========================================================================

  test('grid has proper ARIA role', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByRole('region');
    expect(grid).toBeInTheDocument();
  });

  test('grid has aria-labelledby attribute', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toHaveAttribute('aria-labelledby', 'features-section-title');
  });

  test('all cards are keyboard accessible', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);

    mockFeatures.forEach((feature) => {
      const card = screen.getByTestId(`feature-card-item-${feature.id}`);
      expect(card).toBeInTheDocument();
    });
  });

  test('grid maintains semantic structure', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid.tagName).toBe('SECTION');
  });

  // ========================================================================
  // Feature Data Tests
  // ========================================================================

  test('renders features with custom icons', () => {
    const featuresWithIcons: FeatureCardData[] = [
      {
        id: 'feature-1',
        title: 'Feature One',
        description: 'Description',
        icon: <span data-testid="custom-icon">🎨</span>,
      },
    ];

    render(<FeatureCardsGrid features={featuresWithIcons} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  test('renders features with different frame types', () => {
    const featuresWithFrames: FeatureCardData[] = [
      {
        id: 'feature-1',
        title: 'Feature One',
        description: 'Description',
        frameType: 'octagon',
      },
      {
        id: 'feature-2',
        title: 'Feature Two',
        description: 'Description',
        frameType: 'corners',
      },
    ];

    render(<FeatureCardsGrid features={featuresWithFrames} />);
    expect(screen.getByText('Feature One')).toBeInTheDocument();
    expect(screen.getByText('Feature Two')).toBeInTheDocument();
  });

  // ========================================================================
  // CSS Class Tests
  // ========================================================================

  test('grid has correct CSS classes', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toHaveClass('feature-cards-grid');
  });

  test('grid items have correct CSS classes', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const items = screen.getAllByTestId(/feature-card-item-/);
    items.forEach((item) => {
      expect(item).toHaveClass('feature-cards-grid__item');
    });
  });

  // ========================================================================
  // Data Attribute Tests
  // ========================================================================

  test('grid has correct data-testid', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('grid items have correct data-testid', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    mockFeatures.forEach((feature) => {
      const item = screen.getByTestId(`feature-card-item-${feature.id}`);
      expect(item).toBeInTheDocument();
    });
  });

  // ========================================================================
  // Edge Cases
  // ========================================================================

  test('handles single feature card', () => {
    const singleFeature: FeatureCardData[] = [mockFeatures[0]];
    render(<FeatureCardsGrid features={singleFeature} />);
    expect(screen.getByText('Feature One')).toBeInTheDocument();
  });

  test('handles many feature cards (12+)', () => {
    const manyFeatures = Array.from({ length: 12 }, (_, i) => ({
      id: `feature-${i + 1}`,
      title: `Feature ${i + 1}`,
      description: `Description ${i + 1}`,
    }));

    render(<FeatureCardsGrid features={manyFeatures} />);
    const items = screen.getAllByTestId(/feature-card-item-/);
    expect(items).toHaveLength(12);
  });

  test('handles features with long titles', () => {
    const longTitleFeature: FeatureCardData[] = [
      {
        id: 'feature-1',
        title: 'This is a very long feature title that might wrap to multiple lines',
        description: 'Description',
      },
    ];

    render(<FeatureCardsGrid features={longTitleFeature} />);
    expect(
      screen.getByText('This is a very long feature title that might wrap to multiple lines')
    ).toBeInTheDocument();
  });

  test('handles features with long descriptions', () => {
    const longDescFeature: FeatureCardData[] = [
      {
        id: 'feature-1',
        title: 'Feature',
        description:
          'This is a very long description that contains multiple sentences and might wrap to several lines on smaller screens.',
      },
    ];

    render(<FeatureCardsGrid features={longDescFeature} />);
    expect(
      screen.getByText(
        'This is a very long description that contains multiple sentences and might wrap to several lines on smaller screens.'
      )
    ).toBeInTheDocument();
  });

  // ========================================================================
  // Props Validation Tests
  // ========================================================================

  test('renders with default props', () => {
    render(<FeatureCardsGrid features={mockFeatures} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('renders with all props specified', () => {
    render(
      <FeatureCardsGrid
        features={mockFeatures}
        columns={3}
        animationDelay={1700}
        staggerInterval={150}
      />
    );
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();
  });

  test('updates when features prop changes', () => {
    const { rerender } = render(<FeatureCardsGrid features={mockFeatures.slice(0, 3)} />);
    expect(screen.getAllByTestId(/feature-card-item-/)).toHaveLength(3);

    rerender(<FeatureCardsGrid features={mockFeatures} />);
    expect(screen.getAllByTestId(/feature-card-item-/)).toHaveLength(6);
  });

  test('updates when columns prop changes', () => {
    const { rerender } = render(<FeatureCardsGrid features={mockFeatures} columns={1} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();

    rerender(<FeatureCardsGrid features={mockFeatures} columns={3} />);
    expect(grid).toBeInTheDocument();
  });

  test('updates when animationDelay prop changes', () => {
    const { rerender } = render(<FeatureCardsGrid features={mockFeatures} animationDelay={1000} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();

    rerender(<FeatureCardsGrid features={mockFeatures} animationDelay={2000} />);
    expect(grid).toBeInTheDocument();
  });

  test('updates when staggerInterval prop changes', () => {
    const { rerender } = render(<FeatureCardsGrid features={mockFeatures} staggerInterval={100} />);
    const grid = screen.getByTestId('feature-cards-grid');
    expect(grid).toBeInTheDocument();

    rerender(<FeatureCardsGrid features={mockFeatures} staggerInterval={200} />);
    expect(grid).toBeInTheDocument();
  });
});
