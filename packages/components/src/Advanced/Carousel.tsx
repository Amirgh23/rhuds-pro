/**
 * Carousel Component
 * Image/content carousel with auto-play
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@rhuds/core';
import { CarouselProps } from './types';

/**
 * Carousel Component
 */
export const Carousel: React.FC<CarouselProps> = ({
  items,
  currentIndex: controlledCurrentIndex = 0,
  onIndexChange,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  animationDuration = 500,
  className,
  style,
}) => {
  const themeContext = useTheme();
  const theme = (themeContext as any).currentMode?.tokens || (themeContext as any);
  const [internalCurrentIndex, setInternalCurrentIndex] = useState(controlledCurrentIndex);

  const currentIndex = controlledCurrentIndex !== undefined ? controlledCurrentIndex : internalCurrentIndex;

  useEffect(() => {
    if (autoPlayInterval > 0) {
      const timer = setInterval(() => {
        const nextIndex = (currentIndex + 1) % items.length;
        setInternalCurrentIndex(nextIndex);
        onIndexChange?.(nextIndex);
      }, autoPlayInterval);

      return () => clearInterval(timer);
    }
  }, [currentIndex, items.length, autoPlayInterval, onIndexChange]);

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setInternalCurrentIndex(prevIndex);
    onIndexChange?.(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    setInternalCurrentIndex(nextIndex);
    onIndexChange?.(nextIndex);
  };

  const handleDotClick = (index: number) => {
    setInternalCurrentIndex(index);
    onIndexChange?.(index);
  };

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      position: 'relative',
      width: '100%',
      backgroundColor: theme.currentMode.tokens.colors.background,
      borderRadius: '8px',
      overflow: 'hidden',
      ...style,
    };
  }, [theme, style]);

  const slideContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingBottom: '66.67%',
    overflow: 'hidden',
  };

  const slideStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: currentIndex === items.findIndex((item) => item.key === items[currentIndex]?.key) ? 1 : 0,
    transition: `opacity ${animationDuration}ms ease-in-out`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: theme.currentMode.tokens.colors.primary,
    color: theme.currentMode.tokens.colors.background,
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transition: 'opacity 0.2s ease-in-out',
  };

  const dotsContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '0.5rem',
    zIndex: 10,
  };

  const dotStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: theme.currentMode.tokens.colors.primary,
    cursor: 'pointer',
    opacity: 0.5,
    transition: 'opacity 0.2s ease-in-out',
  };

  const activeDotStyle: React.CSSProperties = {
    ...dotStyle,
    opacity: 1,
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={slideContainerStyle}>
        {items.map((item, index) => (
          <div
            key={item.key}
            style={{
              ...slideStyle,
              opacity: index === currentIndex ? 1 : 0,
            }}
          >
            {item.content}
          </div>
        ))}
      </div>

      {showArrows && (
        <>
          <button
            style={{ ...arrowStyle, left: '1rem' }}
            onClick={handlePrevious}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            }}
          >
            ‹
          </button>
          <button
            style={{ ...arrowStyle, right: '1rem' }}
            onClick={handleNext}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
            }}
          >
            ›
          </button>
        </>
      )}

      {showDots && (
        <div style={dotsContainerStyle}>
          {items.map((_, index) => (
            <div
              key={index}
              style={index === currentIndex ? activeDotStyle : dotStyle}
              onClick={() => handleDotClick(index)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = index === currentIndex ? '1' : '0.5';
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Carousel.displayName = 'Carousel';


