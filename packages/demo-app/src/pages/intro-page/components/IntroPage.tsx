/**
 * IntroPage - Root component for the intro page redesign
 *
 * Orchestrates the entire intro page layout with semantic HTML structure,
 * responsive design, animation sequencing, and accessibility features.
 *
 * Features:
 * - Semantic HTML (header, main, section, footer, nav)
 * - Z-index layering (background: 0, content: 10, navigation: 100)
 * - Responsive breakpoints (mobile <768px, tablet 768-1023px, desktop >=1024px)
 * - Skip-to-content link for keyboard accessibility
 * - Animation orchestration with staggered timing
 */

import React, { useEffect, useState } from 'react';
import type { IntroPageProps } from '../types';
import { ANIMATION_CONFIG, Z_INDEX, DEFAULT_FEATURES, DEFAULT_NAV_LINKS } from '../constants';
import { AnimatedBackground } from './AnimatedBackground';
import '../styles/index.css';

/**
 * IntroPage Component
 *
 * Root container managing overall layout, animation orchestration, and responsive behavior.
 *
 * Props:
 * - onNavigate: Callback when navigation occurs
 * - animationEnabled: Whether to enable animations (default: true)
 * - theme: Color theme ('dark' or 'light', default: 'dark')
 */
export const IntroPage: React.FC<IntroPageProps> = ({
  onNavigate,
  animationEnabled = true,
  theme = 'dark',
}) => {
  const [isAnimating, setIsAnimating] = useState(animationEnabled);

  // Handle animation state
  useEffect(() => {
    setIsAnimating(animationEnabled);
  }, [animationEnabled]);

  // Handle skip-to-content link click
  const handleSkipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle navigation
  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  return (
    <div className="intro-page" data-theme={theme}>
      {/* Skip-to-content link for keyboard accessibility */}
      <a href="#main-content" className="skip-to-content" onClick={handleSkipToContent}>
        Skip to main content
      </a>

      {/* Animated background layer (z-index: 0) */}
      <div
        className="intro-page__background"
        style={{ zIndex: Z_INDEX.background }}
        aria-hidden="true"
      >
        <AnimatedBackground opacity={0.25} animationSpeed={1.0} />
      </div>

      {/* Navigation header (z-index: 100) */}
      <header className="intro-page__header" style={{ zIndex: Z_INDEX.navigation }} role="banner">
        <nav className="intro-page__nav" role="navigation" aria-label="Main navigation">
          <div className="intro-page__nav-container">
            <div className="intro-page__logo">RHUDS</div>
            <ul className="intro-page__nav-links">
              {DEFAULT_NAV_LINKS.map((link) => (
                <li key={link.route}>
                  <a
                    href={link.route}
                    className="intro-page__nav-link"
                    onClick={(e) => {
                      if (!link.route.startsWith('http')) {
                        e.preventDefault();
                        handleNavigate(link.route);
                      }
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Main content area (z-index: 10) */}
      <main
        id="main-content"
        className="intro-page__main"
        style={{ zIndex: Z_INDEX.content }}
        role="main"
      >
        {/* Hero section */}
        <section className="intro-page__hero" aria-labelledby="hero-title">
          <div className="intro-page__hero-container">
            <h1 id="hero-title" className="intro-page__hero-title">
              RHUDS
            </h1>
            <p className="intro-page__hero-subtitle">React HUD Design System</p>
            <p className="intro-page__hero-description">
              Futuristic UI components for React with Arwes-inspired animations and sci-fi
              aesthetics
            </p>
            <div className="intro-page__cta-buttons">
              <button
                className="intro-page__cta-button intro-page__cta-button--primary"
                onClick={() => handleNavigate('/components')}
                aria-label="Get started with RHUDS components"
              >
                Get Started
              </button>
              <button
                className="intro-page__cta-button intro-page__cta-button--secondary"
                onClick={() => handleNavigate('/docs')}
                aria-label="View RHUDS documentation"
              >
                Documentation
              </button>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="intro-page__features" aria-labelledby="features-title">
          <h2 id="features-title" className="intro-page__features-title">
            Key Features
          </h2>
          <div className="intro-page__features-grid">
            {DEFAULT_FEATURES.map((feature) => (
              <article
                key={feature.id}
                className="intro-page__feature-card"
                data-testid="feature-card"
              >
                <h3 className="intro-page__feature-title">{feature.title}</h3>
                <p className="intro-page__feature-description">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer (z-index: 10) */}
      <footer className="intro-page__footer" style={{ zIndex: Z_INDEX.content }} role="contentinfo">
        <div className="intro-page__footer-container">
          <div className="intro-page__footer-section">
            <h3 className="intro-page__footer-title">About</h3>
            <p className="intro-page__footer-text">
              RHUDS is a comprehensive React component library with Arwes-inspired design system.
            </p>
          </div>
          <div className="intro-page__footer-section">
            <h3 className="intro-page__footer-title">Links</h3>
            <ul className="intro-page__footer-links">
              <li>
                <a href="https://github.com/rhuds" className="intro-page__footer-link">
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="intro-page__footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate('/docs');
                  }}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/components"
                  className="intro-page__footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate('/components');
                  }}
                >
                  Components
                </a>
              </li>
            </ul>
          </div>
          <div className="intro-page__footer-section">
            <h3 className="intro-page__footer-title">Version</h3>
            <p className="intro-page__footer-text">v1.0.0</p>
          </div>
        </div>
        <div className="intro-page__footer-bottom">
          <p className="intro-page__footer-copyright">
            © 2024 RHUDS. Built with React, TypeScript, and Arwes design system.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IntroPage;
