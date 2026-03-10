/**
 * FeatureCard Component - Individual Feature Card with Frame
 *
 * Displays a single feature with animated Arwes frame, icon, title, and description.
 *
 * Features:
 * - Animated FrameSVGOctagon or FrameSVGCorners frame
 * - Icon/badge support
 * - Hover effects (scale, glow)
 * - Animation delay support for staggered sequences
 * - Responsive design with mobile/tablet/desktop adjustments
 * - Keyboard accessible and screen reader friendly
 * - GPU-accelerated animations
 */

import React, { useRef, useMemo } from 'react';
import { FrameSVGOctagon, FrameSVGCorners } from '@rhuds/frames';
import { useFrameSVGAssemblingAnimation } from '@rhuds/frames';
import type { FeatureCardProps } from '../types';
import { FRAME_CONFIG, COLOR_PALETTE } from '../constants';
import '../styles/FeatureCard.css';

/**
 * FeatureCard Component
 *
 * Renders an individual feature card with animated frame and content.
 *
 * Props:
 * - title: Feature title text
 * - description: Feature description text
 * - icon: Optional icon/badge React node
 * - frameType: Frame component type ('octagon' or 'corners', default: 'octagon')
 * - animationDelay: Delay before animation starts (default: 0)
 * - onHover: Optional callback when card is hovered
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  frameType = 'octagon',
  animationDelay = 0,
  onHover,
}) => {
  const frameRef = useRef<SVGSVGElement>(null);

  // Use the frame animation hook
  const { onRender } = useFrameSVGAssemblingAnimation(frameRef, {
    duration: FRAME_CONFIG.cardDuration || 1200,
    animate: true,
  });

  // Calculate frame dimensions
  const frameDimensions = useMemo(() => {
    return {
      padding: FRAME_CONFIG.cardPadding,
      squareSize: FRAME_CONFIG.cardSquareSize,
    };
  }, []);

  // Handle hover event
  const handleMouseEnter = () => {
    if (onHover) {
      onHover();
    }
  };

  // Render the appropriate frame component
  const renderFrame = () => {
    if (frameType === 'corners') {
      return (
        <FrameSVGCorners
          elementRef={frameRef}
          onRender={onRender}
          padding={frameDimensions.padding}
          strokeWidth={1}
          cornerLength={24}
          className="feature-card__frame"
          style={{
            color: COLOR_PALETTE.primary,
            width: '100%',
            height: 'auto',
          }}
        />
      );
    }

    // Default to octagon
    return (
      <FrameSVGOctagon
        elementRef={frameRef}
        onRender={onRender}
        padding={frameDimensions.padding}
        squareSize={frameDimensions.squareSize}
        className="feature-card__frame"
        style={{
          color: COLOR_PALETTE.primary,
          width: '100%',
          height: 'auto',
        }}
      />
    );
  };

  return (
    <article
      className="feature-card"
      onMouseEnter={handleMouseEnter}
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
      role="region"
      aria-labelledby={`feature-card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="feature-card__frame-wrapper">
        {/* Frame */}
        {renderFrame()}

        {/* Content inside frame */}
        <div className="feature-card__content">
          {/* Icon/Badge */}
          {icon && <div className="feature-card__icon">{icon}</div>}

          {/* Title */}
          <h3
            id={`feature-card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="feature-card__title"
          >
            {title}
          </h3>

          {/* Description */}
          <p className="feature-card__description">{description}</p>
        </div>
      </div>
    </article>
  );
};

export default FeatureCard;
