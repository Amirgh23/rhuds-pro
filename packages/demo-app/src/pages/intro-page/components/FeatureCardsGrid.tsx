/**
 * FeatureCardsGrid Component - Responsive Grid Container for Feature Cards
 *
 * Displays feature cards in a responsive grid with:
 * - Responsive column layout (3 desktop, 2 tablet, 1 mobile)
 * - Staggered animation sequencing
 * - Intersection observer for viewport-based animation triggers
 * - Consistent spacing and alignment
 * - GPU-accelerated animations
 * - Accessibility support
 */

import React, { useMemo, useCallback } from 'react';
import { FeatureCard } from './FeatureCard';
import { useMultipleIntersectionObservers } from '../hooks/useIntersectionObserver';
import type { FeatureCardsGridProps, FeatureCardData } from '../types';
import { ANIMATION_CONFIG, SPACING_SCALE, BREAKPOINTS } from '../constants';
import '../styles/FeatureCardsGrid.css';

/**
 * FeatureCardsGrid Component
 *
 * Renders a responsive grid of feature cards with staggered animations.
 *
 * Props:
 * - features: Array of feature card data
 * - columns: Number of columns ('auto', 1, 2, or 3)
 * - animationDelay: Initial delay before first card animates
 * - staggerInterval: Delay between each card animation
 */
export const FeatureCardsGrid: React.FC<FeatureCardsGridProps> = ({
  features,
  columns = 'auto',
  animationDelay = ANIMATION_CONFIG.cardsStartDelay,
  staggerInterval = ANIMATION_CONFIG.cardStaggerInterval,
}) => {
  // Use intersection observer for viewport-based animation triggers
  const { refs, visibilityMap, registerElement } = useMultipleIntersectionObservers({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Register all feature cards with intersection observer
  useMemo(() => {
    features.forEach((feature) => {
      registerElement(feature.id);
    });
  }, [features, registerElement]);

  // Calculate animation delay for each card
  const getCardAnimationDelay = useCallback(
    (index: number, isVisible: boolean): number => {
      // If card is not visible yet, don't animate
      if (!isVisible) {
        return 0;
      }
      // Calculate staggered delay: initial delay + (index * stagger interval)
      return animationDelay + index * staggerInterval;
    },
    [animationDelay, staggerInterval]
  );

  // Determine grid columns based on viewport width
  const getGridColumns = useCallback((): number => {
    if (columns !== 'auto') {
      return columns as number;
    }

    // Auto-detect based on viewport width
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.desktop) {
        return 3; // Desktop: 3 columns
      } else if (width >= BREAKPOINTS.tablet) {
        return 2; // Tablet: 2 columns
      }
    }
    return 1; // Mobile: 1 column
  }, [columns]);

  // Get gap size based on viewport width
  const getGapSize = useCallback((): string => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.desktop) {
        return SPACING_SCALE.desktop.cardGap; // 24px
      } else if (width >= BREAKPOINTS.tablet) {
        return SPACING_SCALE.tablet.cardGap; // 20px
      }
    }
    return SPACING_SCALE.mobile.cardGap; // 16px
  }, []);

  // Render feature cards
  const renderCards = () => {
    return features.map((feature, index) => {
      const cardRef = refs.get(feature.id);
      const visibilityState = visibilityMap.get(feature.id);
      const isVisible = visibilityState?.hasBeenVisible || false;
      const cardDelay = getCardAnimationDelay(index, isVisible);

      return (
        <div
          key={feature.id}
          ref={cardRef}
          className="feature-cards-grid__item"
          data-testid={`feature-card-item-${feature.id}`}
        >
          <FeatureCard
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            frameType={feature.frameType || 'octagon'}
            animationDelay={cardDelay}
          />
        </div>
      );
    });
  };

  return (
    <section
      className="feature-cards-grid"
      role="region"
      aria-labelledby="features-section-title"
      data-testid="feature-cards-grid"
      style={
        {
          '--grid-columns': getGridColumns(),
          '--gap-size': getGapSize(),
        } as React.CSSProperties
      }
    >
      {renderCards()}
    </section>
  );
};

export default FeatureCardsGrid;
