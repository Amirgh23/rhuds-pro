/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR CAROUSEL - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL IMAGE CAROUSEL - $1M IMPLEMENTATION
 *
 * FEATURES:
 * - Image carousel with tactical navigation
 * - Prev/Next buttons with Cold War styling
 * - Indicator dots
 * - Auto-play support
 * - Keyboard navigation
 * - Scanlines and glow effects
 */

import React, { useState, useEffect, ReactNode, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarCarouselItem {
  id: string;
  content: ReactNode;
  caption?: string;
}

export interface ColdWarCarouselProps {
  /** Theme variant */
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  /** Carousel items */
  items: ColdWarCarouselItem[];
  /** Auto-play interval (ms) */
  autoPlay?: number;
  /** Show navigation buttons */
  showNavigation?: boolean;
  /** Show indicators */
  showIndicators?: boolean;
  /** Apply scanlines effect */
  scanlines?: boolean;
  /** Scanlines intensity */
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  /** Apply glow effect */
  glow?: boolean;
  /** Show corner brackets */
  showCorners?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * Cold War Carousel Component
 */
export const ColdWarCarousel: React.FC<ColdWarCarouselProps> = ({
  theme = 'perseus',
  items,
  autoPlay,
  showNavigation = true,
  showIndicators = true,
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showCorners = true,
  className = '',
  style = {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [techCode] = useState(() => generateTechCode('CAR'));
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  useEffect(() => {
    if (autoPlay && items.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, autoPlay);
      return () => clearInterval(interval);
    }
  }, [autoPlay, items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const containerStyles: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    background: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(${rgb}, 0.02) 2px,
        rgba(${rgb}, 0.02) 4px
      ),
      linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100())
    `,
    border: `1px solid rgba(${rgb}, 0.3)`,
    boxShadow: `
      inset 0 0 30px rgba(0, 0, 0, 0.6),
      inset 0 0 10px rgba(${rgb}, 0.1),
      0 4px 12px rgba(0, 0, 0, 0.4)
    `,
    overflow: 'hidden',
    ...style,
  };

  const headerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderBottom: `1px solid rgba(${rgb}, 0.3)`,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    background: `rgba(${rgb}, 0.1)`,
  };

  const viewportStyles: CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: '300px',
    overflow: 'hidden',
  };

  const slideStyles: CSSProperties = {
    display: 'flex',
    transition: `transform ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    transform: `translateX(-${currentIndex * 100}%)`,
  };

  const itemStyles: CSSProperties = {
    minWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const navButtonStyles: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '12px',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '18px',
    fontWeight: 600,
    color: themeColors.primary,
    background: `rgba(${rgb}, 0.2)`,
    border: `1px solid rgba(${rgb}, 0.5)`,
    cursor: 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    zIndex: 10,
  };

  const indicatorsStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    borderTop: `1px solid rgba(${rgb}, 0.2)`,
  };

  const indicatorStyles = (isActive: boolean): CSSProperties => ({
    width: isActive ? '24px' : '8px',
    height: '8px',
    background: isActive ? themeColors.primary : `rgba(${rgb}, 0.3)`,
    border: `1px solid ${themeColors.primary}`,
    cursor: 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    boxShadow: isActive ? `0 0 10px ${themeColors.primary}` : 'none',
  });

  const currentItem = items[currentIndex];

  return (
    <div className={className} style={containerStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: themeColors.primary,
              boxShadow: `0 0 6px ${themeColors.primary}`,
              animation: 'led-pulse 1s ease-in-out infinite',
            }}
          />
          <span>TACTICAL CAROUSEL</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '9px',
            opacity: 0.6,
          }}
        >
          <span>{techCode}</span>
          <span>
            {currentIndex + 1}/{items.length}
          </span>
        </div>
      </div>

      {/* Viewport */}
      <div style={viewportStyles}>
        <div style={slideStyles}>
          {items.map((item) => (
            <div key={item.id} style={itemStyles}>
              {item.content}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {showNavigation && items.length > 1 && (
          <>
            <button
              style={{ ...navButtonStyles, left: '12px' }}
              onClick={goToPrevious}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `rgba(${rgb}, 0.4)`;
                e.currentTarget.style.boxShadow = `0 0 15px rgba(${rgb}, 0.5)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `rgba(${rgb}, 0.2)`;
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              style={{ ...navButtonStyles, right: '12px' }}
              onClick={goToNext}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `rgba(${rgb}, 0.4)`;
                e.currentTarget.style.boxShadow = `0 0 15px rgba(${rgb}, 0.5)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `rgba(${rgb}, 0.2)`;
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      {currentItem.caption && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: `1px solid rgba(${rgb}, 0.2)`,
            fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
            fontSize: '12px',
            color: themeColors.text,
            textAlign: 'center',
          }}
        >
          {currentItem.caption}
        </div>
      )}

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div style={indicatorsStyles}>
          {items.map((_, index) => (
            <div
              key={index}
              style={indicatorStyles(index === currentIndex)}
              onClick={() => goToIndex(index)}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.background = `rgba(${rgb}, 0.5)`;
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.background = `rgba(${rgb}, 0.3)`;
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Corner Brackets */}
      {showCorners && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              width: '12px',
              height: '12px',
              borderTop: `2px solid ${themeColors.primary}`,
              borderLeft: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderTop: `2px solid ${themeColors.primary}`,
              borderRight: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '4px',
              width: '12px',
              height: '12px',
              borderBottom: `2px solid ${themeColors.primary}`,
              borderLeft: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderBottom: `2px solid ${themeColors.primary}`,
              borderRight: `2px solid ${themeColors.primary}`,
              opacity: 0.6,
              zIndex: 10,
            }}
          />
        </>
      )}

      {/* Scanlines */}
      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}

      {/* Glow */}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      {/* Animations */}
      <style>
        {`
          @keyframes led-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ColdWarCarousel;
