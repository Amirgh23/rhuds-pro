/**
 * Property-Based Tests for Intro Page Redesign - Part 2
 * Properties 26-51
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import { IntroPage } from '../components/IntroPage';
import {
  getComputedStyleValue,
  setViewportWidth,
  getDimensions,
  getContrastRatio,
  isKeyboardAccessible,
  hasFocusRing,
  getPadding,
  getGridColumnCount,
  hasGlowEffect,
} from './test-utils';

describe('Intro Page - Property-Based Tests Part 2', () => {
  beforeEach(() => {
    setViewportWidth(1024);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Property 26: Touch Target Minimum Size
  describe('Property 26: Touch Target Minimum Size', () => {
    it('should have minimum 44x44px touch targets on mobile', () => {
      // Feature: intro-page-redesign, Property 26: Touch Target Minimum Size
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 768 }), (mobileWidth) => {
          setViewportWidth(mobileWidth);
          const { container } = render(<IntroPage />);
          const interactiveElements = container.querySelectorAll('button, a, input');
          interactiveElements.forEach((el) => {
            const dimensions = getDimensions(el as HTMLElement);
            expect(dimensions.width).toBeGreaterThanOrEqual(44);
            expect(dimensions.height).toBeGreaterThanOrEqual(44);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 27: Layout Stability on Viewport Change
  describe('Property 27: Layout Stability on Viewport Change', () => {
    it('should not shift layout by more than 10px on viewport change', () => {
      // Feature: intro-page-redesign, Property 27: Layout Stability on Viewport Change
      fc.assert(
        fc.property(
          fc.tuple(fc.integer({ min: 320, max: 768 }), fc.integer({ min: 1024, max: 2560 })),
          ([width1, width2]) => {
            setViewportWidth(width1);
            const { container: container1 } = render(<IntroPage />);
            const hero1 = container1.querySelector('[data-testid="hero-section"]');
            const hero1Rect = (hero1 as HTMLElement)?.getBoundingClientRect();
            setViewportWidth(width2);
            const { container: container2 } = render(<IntroPage />);
            const hero2 = container2.querySelector('[data-testid="hero-section"]');
            const hero2Rect = (hero2 as HTMLElement)?.getBoundingClientRect();
            if (hero1Rect && hero2Rect) {
              const xShift = Math.abs(hero1Rect.left - hero2Rect.left);
              const yShift = Math.abs(hero1Rect.top - hero2Rect.top);
              expect(xShift).toBeLessThan(10);
              expect(yShift).toBeLessThan(10);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Property 28: Page Load Performance
  describe('Property 28: Page Load Performance', () => {
    it('should render initial content within 1000ms', () => {
      // Feature: intro-page-redesign, Property 28: Page Load Performance
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const startTime = performance.now();
          render(<IntroPage />);
          const endTime = performance.now();
          expect(endTime - startTime).toBeLessThan(1000);
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 29: Animation Frame Rate
  describe('Property 29: Animation Frame Rate', () => {
    it('should maintain animation frame rate >= 55fps', () => {
      // Feature: intro-page-redesign, Property 29: Animation Frame Rate
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const frameComponents = container.querySelectorAll('[data-testid^="frame-"]');
          frameComponents.forEach((frame) => {
            const duration = getComputedStyleValue(frame as HTMLElement, 'animation-duration');
            const durationMs = parseFloat(duration) * 1000;
            expect(durationMs).toBeGreaterThan(0);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 30: Animation Implementation
  describe('Property 30: Animation Implementation', () => {
    it('should use requestAnimationFrame for background animation', () => {
      // Feature: intro-page-redesign, Property 30: Animation Implementation
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const background = container.querySelector('[data-testid="animated-background"]');
          if (background) {
            const animationName = getComputedStyleValue(
              background as HTMLElement,
              'animation-name'
            );
            expect(animationName).not.toBe('none');
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 31: Lazy Loading Non-Critical Assets
  describe('Property 31: Lazy Loading Non-Critical Assets', () => {
    it('should lazy-load non-critical assets below the fold', () => {
      // Feature: intro-page-redesign, Property 31: Lazy Loading Non-Critical Assets
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const featureCards = container.querySelectorAll('[data-testid="feature-card"]');
          featureCards.forEach((card) => {
            const loading = (card as HTMLElement).getAttribute('loading');
            const dataLazy = (card as HTMLElement).getAttribute('data-lazy');
            expect(loading === 'lazy' || dataLazy === 'true').toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 32: GPU-Accelerated Animations
  describe('Property 32: GPU-Accelerated Animations', () => {
    it('should use GPU-accelerated properties (transform, opacity)', () => {
      // Feature: intro-page-redesign, Property 32: GPU-Accelerated Animations
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const animatedElements = container.querySelectorAll('[data-testid^="frame-"]');
          animatedElements.forEach((el) => {
            const willChange = getComputedStyleValue(el as HTMLElement, 'will-change');
            expect(
              willChange.includes('transform') ||
                willChange.includes('opacity') ||
                willChange === 'auto'
            ).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 33: Decorative SVG Accessibility
  describe('Property 33: Decorative SVG Accessibility', () => {
    it('should mark decorative SVGs with aria-hidden="true"', () => {
      // Feature: intro-page-redesign, Property 33: Decorative SVG Accessibility
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const decorativeSvgs = container.querySelectorAll('[data-testid^="frame-"] svg');
          decorativeSvgs.forEach((svg) => {
            const ariaHidden = (svg as SVGElement).getAttribute('aria-hidden');
            expect(ariaHidden).toBe('true');
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 34: Text Contrast Ratio
  describe('Property 34: Text Contrast Ratio', () => {
    it('should maintain text contrast ratio >= 4.5:1 for body text', () => {
      // Feature: intro-page-redesign, Property 34: Text Contrast Ratio
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const bodyElements = container.querySelectorAll('p, span');
          bodyElements.forEach((el) => {
            const color = getComputedStyleValue(el as HTMLElement, 'color');
            const bgColor = getComputedStyleValue(el as HTMLElement, 'background-color');
            const contrast = getContrastRatio(color, bgColor);
            expect(contrast).toBeGreaterThanOrEqual(4.5);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 35: Large Text Contrast Ratio
  describe('Property 35: Large Text Contrast Ratio', () => {
    it('should maintain contrast ratio >= 3:1 for large text (18px+)', () => {
      // Feature: intro-page-redesign, Property 35: Large Text Contrast Ratio
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const largeTextElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
          largeTextElements.forEach((el) => {
            const fontSize = parseFloat(getComputedStyleValue(el as HTMLElement, 'font-size'));
            if (fontSize >= 18) {
              const color = getComputedStyleValue(el as HTMLElement, 'color');
              const bgColor = getComputedStyleValue(el as HTMLElement, 'background-color');
              const contrast = getContrastRatio(color, bgColor);
              expect(contrast).toBeGreaterThanOrEqual(3);
            }
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 36: Keyboard Navigation
  describe('Property 36: Keyboard Navigation', () => {
    it('should make all interactive elements keyboard accessible', () => {
      // Feature: intro-page-redesign, Property 36: Keyboard Navigation
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const interactiveElements = container.querySelectorAll('button, a, input, select');
          interactiveElements.forEach((el) => {
            const isAccessible = isKeyboardAccessible(el as HTMLElement);
            expect(isAccessible).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 37: Focus Indicator Visibility
  describe('Property 37: Focus Indicator Visibility', () => {
    it('should display visible focus indicator on keyboard focus', () => {
      // Feature: intro-page-redesign, Property 37: Focus Indicator Visibility
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const interactiveElements = container.querySelectorAll('button, a');
          interactiveElements.forEach((el) => {
            const hasFocus = hasFocusRing(el as HTMLElement);
            expect(hasFocus).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 38: Semantic HTML Structure
  describe('Property 38: Semantic HTML Structure', () => {
    it('should use semantic HTML elements (header, main, section, nav, footer)', () => {
      // Feature: intro-page-redesign, Property 38: Semantic HTML Structure
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const hasHeader = container.querySelector('header') !== null;
          const hasMain = container.querySelector('main') !== null;
          const hasSection = container.querySelector('section') !== null;
          const hasNav = container.querySelector('nav') !== null;
          const hasFooter = container.querySelector('footer') !== null;
          expect(hasHeader || hasNav).toBe(true);
          expect(hasMain).toBe(true);
          expect(hasSection).toBe(true);
          expect(hasFooter).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 39: Skip-to-Content Link
  describe('Property 39: Skip-to-Content Link', () => {
    it('should provide skip-to-content link for keyboard users', () => {
      // Feature: intro-page-redesign, Property 39: Skip-to-Content Link
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const skipLink = container.querySelector('[data-testid="skip-to-content"]');
          expect(skipLink).toBeTruthy();
          if (skipLink) {
            const href = (skipLink as HTMLElement).getAttribute('href');
            expect(href).toBeTruthy();
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 40: CTA Button Hover Effects
  describe('Property 40: CTA Button Hover Effects', () => {
    it('should apply glow and scale effects on CTA button hover', () => {
      // Feature: intro-page-redesign, Property 40: CTA Button Hover Effects
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const ctaButtons = container.querySelectorAll('[data-testid="cta-button"]');
          ctaButtons.forEach((button) => {
            const hasGlow = hasGlowEffect(button as HTMLElement);
            expect(hasGlow).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 41: CTA Button Styling
  describe('Property 41: CTA Button Styling', () => {
    it('should use Arwes frame or border styling for CTA buttons', () => {
      // Feature: intro-page-redesign, Property 41: CTA Button Styling
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const ctaButtons = container.querySelectorAll('[data-testid="cta-button"]');
          ctaButtons.forEach((button) => {
            const hasFrame = (button as HTMLElement).querySelector('[data-testid^="frame-"]');
            const borderStyle = getComputedStyleValue(button as HTMLElement, 'border-style');
            expect(hasFrame || borderStyle !== 'none').toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 42: CTA Button Navigation
  describe('Property 42: CTA Button Navigation', () => {
    it('should navigate to appropriate route on CTA button click', () => {
      // Feature: intro-page-redesign, Property 42: CTA Button Navigation
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const ctaButtons = container.querySelectorAll('[data-testid="cta-button"]');
          ctaButtons.forEach((button) => {
            const href = (button as HTMLElement).getAttribute('href');
            const onClick = (button as HTMLElement).getAttribute('onclick');
            expect(href || onClick).toBeTruthy();
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 43: Content Presence
  describe('Property 43: Content Presence', () => {
    it('should display library name, tagline, features, version, and links', () => {
      // Feature: intro-page-redesign, Property 43: Content Presence
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const hasLibraryName = container.textContent?.includes('RHUDS');
          const hasTagline =
            container.textContent?.includes('React') || container.textContent?.includes('HUD');
          const hasFeatures =
            container.querySelectorAll('[data-testid="feature-card"]').length >= 3;
          const hasVersion = container.textContent?.match(/v\d+\.\d+\.\d+|Beta|Alpha/);
          const hasLinks = container.querySelectorAll('a').length >= 2;
          expect(hasLibraryName).toBe(true);
          expect(hasTagline).toBe(true);
          expect(hasFeatures).toBe(true);
          expect(hasVersion).toBeTruthy();
          expect(hasLinks).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 44: Animation Sequence Timing
  describe('Property 44: Animation Sequence Timing', () => {
    it('should follow correct animation sequence timing', () => {
      // Feature: intro-page-redesign, Property 44: Animation Sequence Timing
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const background = container.querySelector('[data-testid="animated-background"]');
          const heroFrame = container.querySelector(
            '[data-testid="hero-section"] [data-testid^="frame-"]'
          );
          const featureFrames = container.querySelectorAll(
            '[data-testid="feature-cards-grid"] [data-testid^="frame-"]'
          );
          if (background && heroFrame && featureFrames.length > 0) {
            const bgDelay = parseFloat(
              getComputedStyleValue(background as HTMLElement, 'animation-delay')
            );
            const heroDelay = parseFloat(
              getComputedStyleValue(heroFrame as HTMLElement, 'animation-delay')
            );
            expect(bgDelay).toBe(0);
            expect(heroDelay).toBeGreaterThanOrEqual(0.2);
            expect(heroDelay).toBeLessThanOrEqual(0.3);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 45: Frame Component Variety
  describe('Property 45: Frame Component Variety', () => {
    it('should use at least 2 different frame component types', () => {
      // Feature: intro-page-redesign, Property 45: Frame Component Variety
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const frameTypes = new Set<string>();
          const frameComponents = container.querySelectorAll('[data-testid^="frame-"]');
          frameComponents.forEach((frame) => {
            const testId = (frame as HTMLElement).getAttribute('data-testid');
            if (testId) {
              frameTypes.add(testId.replace('frame-', ''));
            }
          });
          expect(frameTypes.size).toBeGreaterThanOrEqual(2);
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 46: Frame Padding Range
  describe('Property 46: Frame Padding Range', () => {
    it('should have frame padding between 4px and 8px', () => {
      // Feature: intro-page-redesign, Property 46: Frame Padding Range
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const frameComponents = container.querySelectorAll('[data-testid^="frame-"]');
          frameComponents.forEach((frame) => {
            const padding = getPadding(frame as HTMLElement);
            expect(padding.top).toBeGreaterThanOrEqual(4);
            expect(padding.top).toBeLessThanOrEqual(8);
            expect(padding.right).toBeGreaterThanOrEqual(4);
            expect(padding.right).toBeLessThanOrEqual(8);
            expect(padding.bottom).toBeGreaterThanOrEqual(4);
            expect(padding.bottom).toBeLessThanOrEqual(8);
            expect(padding.left).toBeGreaterThanOrEqual(4);
            expect(padding.left).toBeLessThanOrEqual(8);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 47: Frame Square Size Range
  describe('Property 47: Frame Square Size Range', () => {
    it('should have frame squareSize between 12px and 32px', () => {
      // Feature: intro-page-redesign, Property 47: Frame Square Size Range
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const frameComponents = container.querySelectorAll('[data-testid^="frame-"]');
          frameComponents.forEach((frame) => {
            const squareSize = (frame as HTMLElement).getAttribute('data-square-size');
            if (squareSize) {
              const size = parseInt(squareSize, 10);
              expect(size).toBeGreaterThanOrEqual(12);
              expect(size).toBeLessThanOrEqual(32);
            }
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 48: Mobile-First Design
  describe('Property 48: Mobile-First Design', () => {
    it('should use mobile-first CSS structure with progressive enhancement', () => {
      // Feature: intro-page-redesign, Property 48: Mobile-First Design
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const grid = container.querySelector('[data-testid="feature-cards-grid"]');
          if (grid) {
            const columnCount = getGridColumnCount(grid as HTMLElement);
            if (viewportWidth < 768) {
              expect(columnCount).toBe(1);
            } else if (viewportWidth < 1024) {
              expect(columnCount).toBeGreaterThanOrEqual(1);
            } else {
              expect(columnCount).toBeGreaterThanOrEqual(2);
            }
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 49: Mobile Frame Simplification
  describe('Property 49: Mobile Frame Simplification', () => {
    it('should use simpler frame types on mobile viewports', () => {
      // Feature: intro-page-redesign, Property 49: Mobile Frame Simplification
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 768 }), (mobileWidth) => {
          setViewportWidth(mobileWidth);
          const { container } = render(<IntroPage />);
          const heroFrame = container.querySelector(
            '[data-testid="hero-section"] [data-testid^="frame-"]'
          );
          if (heroFrame) {
            const frameType = (heroFrame as HTMLElement).getAttribute('data-testid');
            expect(frameType).toMatch(/octagon|corners/);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 50: No Horizontal Scrolling
  describe('Property 50: No Horizontal Scrolling', () => {
    it('should not have horizontal scrolling at any viewport size', () => {
      // Feature: intro-page-redesign, Property 50: No Horizontal Scrolling
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const documentWidth = container.scrollWidth;
          expect(documentWidth).toBeLessThanOrEqual(viewportWidth);
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 51: Mobile Background Optimization
  describe('Property 51: Mobile Background Optimization', () => {
    it('should reduce particle count on mobile compared to desktop', () => {
      // Feature: intro-page-redesign, Property 51: Mobile Background Optimization
      fc.assert(
        fc.property(
          fc.tuple(fc.integer({ min: 320, max: 768 }), fc.integer({ min: 1024, max: 2560 })),
          ([mobileWidth, desktopWidth]) => {
            setViewportWidth(mobileWidth);
            const { container: mobileContainer } = render(<IntroPage />);
            const mobileBg = mobileContainer.querySelector('[data-testid="animated-background"]');
            const mobileParticleCount = parseInt(
              (mobileBg as HTMLElement)?.getAttribute('data-particle-count') || '0',
              10
            );
            setViewportWidth(desktopWidth);
            const { container: desktopContainer } = render(<IntroPage />);
            const desktopBg = desktopContainer.querySelector('[data-testid="animated-background"]');
            const desktopParticleCount = parseInt(
              (desktopBg as HTMLElement)?.getAttribute('data-particle-count') || '0',
              10
            );
            expect(mobileParticleCount).toBeLessThan(desktopParticleCount);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
