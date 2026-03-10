/**
 * HeroSection Component - Intro Page Hero Section
 *
 * Displays the main hero content with animated Arwes frame, title, subtitle,
 * description, and call-to-action buttons.
 *
 * Features:
 * - Animated FrameSVGKranox or FrameSVGNefrex frame
 * - Responsive typography with fluid sizing
 * - Centered layout with proper spacing
 * - Call-to-action buttons with hover effects
 * - Keyboard accessible and screen reader friendly
 * - Animation orchestration with configurable delay
 */

import React, { useRef, useMemo } from 'react';
import { FrameSVGKranox } from '@rhuds/frames';
import { useFrameSVGAssemblingAnimation } from '@rhuds/frames';
import type { HeroSectionProps } from '../types';
import { ANIMATION_CONFIG, FRAME_CONFIG, COLOR_PALETTE } from '../constants';

/**
 * HeroSection Component
 *
 * Renders the hero section with animated frame and content.
 *
 * Props:
 * - title: Main title text (e.g., "RHUDS")
 * - subtitle: Subtitle text (e.g., "React HUD Design System")
 * - description: Optional description text
 * - frameType: Frame component type ('kranox' or 'nefrex', default: 'kranox')
 * - onCTAClick: Callback when CTA button is clicked
 * - animationDelay: Delay before animation starts (default: ANIMATION_CONFIG.heroDelay)
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'RHUDS',
  subtitle = 'React HUD Design System',
  description = 'Futuristic UI components for React with Arwes-inspired animations and sci-fi aesthetics',
  frameType = 'kranox',
  onCTAClick,
  animationDelay = ANIMATION_CONFIG.heroDelay,
}) => {
  const frameRef = useRef<SVGSVGElement>(null);

  // Use the frame animation hook
  const { onRender } = useFrameSVGAssemblingAnimation(frameRef, {
    duration: ANIMATION_CONFIG.heroDuration,
    animate: true,
  });

  // Calculate frame dimensions based on content
  const frameDimensions = useMemo(() => {
    return {
      width: 600,
      height: 400,
      padding: FRAME_CONFIG.heroPadding,
      squareSize: FRAME_CONFIG.heroSquareSize,
    };
  }, []);

  // Handle CTA button clicks
  const handleCTAClick = (action: 'primary' | 'secondary') => {
    if (onCTAClick) {
      onCTAClick(action);
    }
  };

  return (
    <section
      className="hero-section"
      aria-labelledby="hero-title"
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <div className="hero-section__container">
        {/* Frame wrapper */}
        <div className="hero-section__frame-wrapper">
          <FrameSVGKranox
            elementRef={frameRef}
            onRender={onRender}
            padding={frameDimensions.padding}
            squareSize={frameDimensions.squareSize}
            strokeWidth={2}
            smallLineLength={12}
            largeLineLength={48}
            className="hero-section__frame"
            style={{
              color: COLOR_PALETTE.primary,
              width: '100%',
              height: 'auto',
              minHeight: '300px',
            }}
          />

          {/* Content inside frame */}
          <div className="hero-section__content">
            <h1 id="hero-title" className="hero-section__title">
              {title}
            </h1>
            <p className="hero-section__subtitle">{subtitle}</p>
            {description && <p className="hero-section__description">{description}</p>}

            {/* CTA Buttons */}
            <div className="hero-section__cta-buttons">
              <button
                className="hero-section__cta-button hero-section__cta-button--primary"
                onClick={() => handleCTAClick('primary')}
                aria-label="Get started with RHUDS components"
              >
                Get Started
              </button>
              <button
                className="hero-section__cta-button hero-section__cta-button--secondary"
                onClick={() => handleCTAClick('secondary')}
                aria-label="View RHUDS documentation"
              >
                Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
