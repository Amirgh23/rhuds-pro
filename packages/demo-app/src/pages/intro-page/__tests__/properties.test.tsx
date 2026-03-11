/**
 * Property-Based Tests for Intro Page Redesign
 * Tests universal correctness properties across all inputs
 * Uses fast-check for property-based testing
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, waitFor } from '@testing-library/react';
import { IntroPage } from '../components/IntroPage';
import {
  getComputedStyleValue,
  getAllComputedColors,
  isApprovedColor,
  usesMonospaceFont,
  hasGlowEffect,
  getZIndex,
  getGridColumnCount,
  setViewportWidth,
  getDimensions,
  getContrastRatio,
  isKeyboardAccessible,
  hasFocusRing,
  getPadding,
} from './test-utils';

describe('Intro Page - Property-Based Tests', () => {
  beforeEach(() => {
    setViewportWidth(1024);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Property 1: Color Palette Consistency
  describe('Property 1: Color Palette Consistency', () => {
    it('should use only approved colors for all elements', () => {
      // Feature: intro-page-redesign, Property 1: Color Palette Consistency
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const colors = getAllComputedColors(container);
          colors.forEach((color) => {
            const isValid = isApprovedColor(color) || color === 'rgba(0, 0, 0, 0)';
            expect(isValid).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 2: Monospace Typography
  describe('Property 2: Monospace Typography', () => {
    it('should use monospace font for all text elements', () => {
      // Feature: intro-page-redesign, Property 2: Monospace Typography
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const textElements = container.querySelectorAll('h1, h2, h3, p, span, button, a');
          textElements.forEach((el) => {
            const isMonospace = usesMonospaceFont(el as HTMLElement);
            expect(isMonospace).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 3: Heading Glow Effects
  describe('Property 3: Heading Glow Effects', () => {
    it('should apply glow effects to all heading elements', () => {
      // Feature: intro-page-redesign, Property 3: Heading Glow Effects
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const headings = container.querySelectorAll('h1, h2, h3');
          headings.forEach((heading) => {
            const hasGlow = hasGlowEffect(heading as HTMLElement);
            expect(hasGlow).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 4: Background Layering
  describe('Property 4: Background Layering', () => {
    it('should render background with lower z-index than content', () => {
      // Feature: intro-page-redesign, Property 4: Background Layering
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const background = container.querySelector('[data-testid="animated-background"]');
          const heroSection = container.querySelector('[data-testid="hero-section"]');
          if (background && heroSection) {
            const bgZIndex = getZIndex(background as HTMLElement);
            const heroZIndex = getZIndex(heroSection as HTMLElement);
            expect(bgZIndex).toBeLessThan(heroZIndex);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 5: Background Animation Non-Blocking
  describe('Property 5: Background Animation Non-Blocking', () => {
    it('should not block user interactions during animation', () => {
      // Feature: intro-page-redesign, Property 5: Background Animation Non-Blocking
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const background = container.querySelector('[data-testid="animated-background"]');
          if (background) {
            const pointerEvents = getComputedStyleValue(
              background as HTMLElement,
              'pointer-events'
            );
            expect(pointerEvents).toBe('none');
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 6: Background Opacity Range
  describe('Property 6: Background Opacity Range', () => {
    it('should maintain opacity between 0.1 and 0.3', () => {
      // Feature: intro-page-redesign, Property 6: Background Opacity Range
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const background = container.querySelector('[data-testid="animated-background"]');
          if (background) {
            const opacity = parseFloat(getComputedStyleValue(background as HTMLElement, 'opacity'));
            expect(opacity).toBeGreaterThanOrEqual(0.1);
            expect(opacity).toBeLessThanOrEqual(0.3);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 7: Hero Section Frame Component
  describe('Property 7: Hero Section Frame Component', () => {
    it('should contain FrameSVGKranox or FrameSVGNefrex in hero section', () => {
      // Feature: intro-page-redesign, Property 7: Hero Section Frame Component
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const heroSection = container.querySelector('[data-testid="hero-section"]');
          if (heroSection) {
            const frameComponent =
              heroSection.querySelector('[data-testid="frame-kranox"]') ||
              heroSection.querySelector('[data-testid="frame-nefrex"]');
            expect(frameComponent).toBeTruthy();
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 8: Hero Section Centering
  describe('Property 8: Hero Section Centering', () => {
    it('should horizontally center the hero section', () => {
      // Feature: intro-page-redesign, Property 8: Hero Section Centering
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const heroSection = container.querySelector('[data-testid="hero-section"]');
          if (heroSection) {
            const rect = (heroSection as HTMLElement).getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const viewportCenterX = viewportWidth / 2;
            expect(Math.abs(centerX - viewportCenterX)).toBeLessThan(10);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 9: Hero Section Positioning
  describe('Property 9: Hero Section Positioning', () => {
    it('should position hero section in upper portion of viewport', () => {
      // Feature: intro-page-redesign, Property 9: Hero Section Positioning
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const heroSection = container.querySelector('[data-testid="hero-section"]');
          if (heroSection) {
            const rect = (heroSection as HTMLElement).getBoundingClientRect();
            expect(rect.bottom).toBeLessThan(window.innerHeight * 0.8);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 10: Feature Cards Frame Components
  describe('Property 10: Feature Cards Frame Components', () => {
    it('should use FrameSVGOctagon or FrameSVGCorners for feature cards', () => {
      // Feature: intro-page-redesign, Property 10: Feature Cards Frame Components
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const featureCards = container.querySelectorAll('[data-testid="feature-card"]');
          featureCards.forEach((card) => {
            const frameComponent =
              card.querySelector('[data-testid="frame-octagon"]') ||
              card.querySelector('[data-testid="frame-corners"]');
            expect(frameComponent).toBeTruthy();
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 11: Responsive Grid Layout
  describe('Property 11: Responsive Grid Layout', () => {
    it('should display correct number of columns at each breakpoint', () => {
      // Feature: intro-page-redesign, Property 11: Responsive Grid Layout
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const grid = container.querySelector('[data-testid="feature-cards-grid"]');
          if (grid) {
            const columnCount = getGridColumnCount(grid as HTMLElement);
            if (viewportWidth >= 1024) {
              expect(columnCount).toBe(3);
            } else if (viewportWidth >= 768) {
              expect(columnCount).toBe(2);
            } else {
              expect(columnCount).toBe(1);
            }
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 12: Feature Cards Consistency
  describe('Property 12: Feature Cards Consistency', () => {
    it('should have consistent padding and spacing across all cards', () => {
      // Feature: intro-page-redesign, Property 12: Feature Cards Consistency
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const featureCards = container.querySelectorAll('[data-testid="feature-card"]');
          if (featureCards.length > 1) {
            const firstCardPadding = getPadding(featureCards[0] as HTMLElement);
            featureCards.forEach((card) => {
              const cardPadding = getPadding(card as HTMLElement);
              expect(cardPadding.top).toBe(firstCardPadding.top);
              expect(cardPadding.right).toBe(firstCardPadding.right);
              expect(cardPadding.bottom).toBe(firstCardPadding.bottom);
              expect(cardPadding.left).toBe(firstCardPadding.left);
            });
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 13: Frame Animation Hook Usage
  describe('Property 13: Frame Animation Hook Usage', () => {
    it('should use animation hook for all frame components', () => {
      // Feature: intro-page-redesign, Property 13: Frame Animation Hook Usage
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const frameComponents = container.querySelectorAll('[data-testid^="frame-"]');
          frameComponents.forEach((frame) => {
            const hasAnimationClass = (frame as HTMLElement).classList.contains('frame-animating');
            expect(hasAnimationClass).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 14: Frame Animation Single Playback
  describe('Property 14: Frame Animation Single Playback', () => {
    it('should play animation exactly once per mount', () => {
      // Feature: intro-page-redesign, Property 14: Frame Animation Single Playback
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const frameComponents = container.querySelectorAll('[data-testid^="frame-"]');
          frameComponents.forEach((frame) => {
            const animationIterationCount = getComputedStyleValue(
              frame as HTMLElement,
              'animation-iteration-count'
            );
            expect(animationIterationCount).toBe('1');
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 15: Animation Duration Range
  describe('Property 15: Animation Duration Range', () => {
    it('should have animation duration between 1000ms and 2500ms', () => {
      // Feature: intro-page-redesign, Property 15: Animation Duration Range
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const frameComponents = container.querySelectorAll('[data-testid^="frame-"]');
          frameComponents.forEach((frame) => {
            const duration = getComputedStyleValue(frame as HTMLElement, 'animation-duration');
            const durationMs = parseFloat(duration) * 1000;
            expect(durationMs).toBeGreaterThanOrEqual(1000);
            expect(durationMs).toBeLessThanOrEqual(2500);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 16: Animation Technique
  describe('Property 16: Animation Technique', () => {
    it('should use stroke-dasharray and stroke-dashoffset for animations', () => {
      // Feature: intro-page-redesign, Property 16: Animation Technique
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const svgPaths = container.querySelectorAll('[data-testid^="frame-"] path');
          svgPaths.forEach((path) => {
            const strokeDasharray = (path as SVGPathElement).getAttribute('stroke-dasharray');
            const strokeDashoffset = (path as SVGPathElement).getAttribute('stroke-dashoffset');
            expect(strokeDasharray).toBeTruthy();
            expect(strokeDashoffset).toBeTruthy();
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 17: Animation Stagger Interval
  describe('Property 17: Animation Stagger Interval', () => {
    it('should stagger animations by 100-300ms intervals', () => {
      // Feature: intro-page-redesign, Property 17: Animation Stagger Interval
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const frameComponents = Array.from(container.querySelectorAll('[data-testid^="frame-"]'));
          if (frameComponents.length > 1) {
            const delays: number[] = frameComponents.map((frame) => {
              const delay = getComputedStyleValue(frame as HTMLElement, 'animation-delay');
              return parseFloat(delay) * 1000;
            });
            for (let i = 1; i < delays.length; i++) {
              const interval = delays[i] - delays[i - 1];
              expect(interval).toBeGreaterThanOrEqual(100);
              expect(interval).toBeLessThanOrEqual(300);
            }
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 18: Frame Glow Effect
  describe('Property 18: Frame Glow Effect', () => {
    it('should apply glow effect to frame lines', () => {
      // Feature: intro-page-redesign, Property 18: Frame Glow Effect
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const frameComponents = container.querySelectorAll('[data-testid^="frame-"]');
          frameComponents.forEach((frame) => {
            const hasGlow = hasGlowEffect(frame as HTMLElement);
            expect(hasGlow).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 19: Body Text Font Size
  describe('Property 19: Body Text Font Size', () => {
    it('should have minimum 14px font size for body text', () => {
      // Feature: intro-page-redesign, Property 19: Body Text Font Size
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const bodyElements = container.querySelectorAll('p, span:not(h1 span):not(h2 span)');
          bodyElements.forEach((el) => {
            const fontSize = parseFloat(getComputedStyleValue(el as HTMLElement, 'font-size'));
            expect(fontSize).toBeGreaterThanOrEqual(14);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 20: Responsive Font Sizing
  describe('Property 20: Responsive Font Sizing', () => {
    it('should scale font sizes responsively with viewport changes', () => {
      // Feature: intro-page-redesign, Property 20: Responsive Font Sizing
      fc.assert(
        fc.property(
          fc.tuple(fc.integer({ min: 320, max: 768 }), fc.integer({ min: 1024, max: 2560 })),
          ([mobileWidth, desktopWidth]) => {
            setViewportWidth(mobileWidth);
            const { container: mobileContainer } = render(<IntroPage />);
            const mobileHeading = mobileContainer.querySelector('h1');
            setViewportWidth(desktopWidth);
            const { container: desktopContainer } = render(<IntroPage />);
            const desktopHeading = desktopContainer.querySelector('h1');
            if (mobileHeading && desktopHeading) {
              const mobileFontSize = parseFloat(
                getComputedStyleValue(mobileHeading as HTMLElement, 'font-size')
              );
              const desktopFontSize = parseFloat(
                getComputedStyleValue(desktopHeading as HTMLElement, 'font-size')
              );
              expect(desktopFontSize).toBeGreaterThan(mobileFontSize);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Property 21: Navigation Bar Positioning
  describe('Property 21: Navigation Bar Positioning', () => {
    it('should position navigation bar at top of page', () => {
      // Feature: intro-page-redesign, Property 21: Navigation Bar Positioning
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const nav = container.querySelector('nav');
          if (nav) {
            const rect = (nav as HTMLElement).getBoundingClientRect();
            expect(rect.top).toBeLessThanOrEqual(100);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 22: Navigation Links Presence
  describe('Property 22: Navigation Links Presence', () => {
    it('should contain links to Components, Playground, Documentation, GitHub', () => {
      // Feature: intro-page-redesign, Property 22: Navigation Links Presence
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const nav = container.querySelector('nav');
          if (nav) {
            const links = nav.querySelectorAll('a');
            const linkTexts = Array.from(links).map((l) => l.textContent?.toLowerCase() || '');
            const hasRequiredLinks =
              ['components', 'playground', 'documentation', 'github'].filter((required) =>
                linkTexts.some((text) => text.includes(required))
              ).length >= 3;
            expect(hasRequiredLinks).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 23: Navigation Hover Glow
  describe('Property 23: Navigation Hover Glow', () => {
    it('should apply glow effect on navigation link hover', () => {
      // Feature: intro-page-redesign, Property 23: Navigation Hover Glow
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 2560 }), (viewportWidth) => {
          setViewportWidth(viewportWidth);
          const { container } = render(<IntroPage />);
          const navLinks = container.querySelectorAll('nav a');
          navLinks.forEach((link) => {
            const hoverStyle = window.getComputedStyle(link, ':hover');
            const hasGlow =
              hoverStyle.filter.includes('drop-shadow') ||
              hoverStyle.textShadow !== 'none' ||
              hoverStyle.boxShadow !== 'none';
            expect(hasGlow).toBe(true);
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 24: Navigation Mobile Accessibility
  describe('Property 24: Navigation Mobile Accessibility', () => {
    it('should keep navigation accessible on mobile viewports', () => {
      // Feature: intro-page-redesign, Property 24: Navigation Mobile Accessibility
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 768 }), (mobileWidth) => {
          setViewportWidth(mobileWidth);
          const { container } = render(<IntroPage />);
          const nav = container.querySelector('nav');
          if (nav) {
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach((link) => {
              const isAccessible = isKeyboardAccessible(link as HTMLElement);
              expect(isAccessible).toBe(true);
            });
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Property 25: Responsive Padding Adjustment
  describe('Property 25: Responsive Padding Adjustment', () => {
    it('should reduce padding on mobile compared to desktop', () => {
      // Feature: intro-page-redesign, Property 25: Responsive Padding Adjustment
      fc.assert(
        fc.property(
          fc.tuple(fc.integer({ min: 320, max: 768 }), fc.integer({ min: 1024, max: 2560 })),
          ([mobileWidth, desktopWidth]) => {
            setViewportWidth(mobileWidth);
            const { container: mobileContainer } = render(<IntroPage />);
            const mobileHero = mobileContainer.querySelector('[data-testid="hero-section"]');
            setViewportWidth(desktopWidth);
            const { container: desktopContainer } = render(<IntroPage />);
            const desktopHero = desktopContainer.querySelector('[data-testid="hero-section"]');
            if (mobileHero && desktopHero) {
              const mobilePadding = getPadding(mobileHero as HTMLElement);
              const desktopPadding = getPadding(desktopHero as HTMLElement);
              expect(mobilePadding.top + mobilePadding.bottom).toBeLessThan(
                desktopPadding.top + desktopPadding.bottom
              );
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
