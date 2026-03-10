/**
 * Tests for IntroPage component
 * Validates semantic HTML structure, accessibility, and responsive layout
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntroPage } from '../IntroPage';

describe('IntroPage Component', () => {
  describe('Semantic HTML Structure', () => {
    it('should render with semantic HTML elements', () => {
      render(<IntroPage />);

      // Check for header element
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();

      // Check for main element
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();

      // Check for navigation element
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      // Check for contentinfo (footer)
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should render with proper heading hierarchy', () => {
      render(<IntroPage />);

      // Check for h1 (hero title)
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('RHUDS');

      // Check for h2 (features title)
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toBeInTheDocument();
      expect(h2).toHaveTextContent('Key Features');
    });
  });

  describe('Content Presence', () => {
    it('should display library name prominently', () => {
      render(<IntroPage />);
      expect(screen.getByText('RHUDS')).toBeInTheDocument();
    });

    it('should display subtitle and description', () => {
      render(<IntroPage />);
      expect(screen.getByText('React HUD Design System')).toBeInTheDocument();
      expect(screen.getByText(/Futuristic UI Components/i)).toBeInTheDocument();
    });

    it('should display at least 3 features', () => {
      render(<IntroPage />);
      const featureCards = screen.getAllByTestId('feature-card');
      expect(featureCards.length).toBeGreaterThanOrEqual(3);
    });

    it('should display version information', () => {
      render(<IntroPage />);
      expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    });

    it('should display links to GitHub and documentation', () => {
      render(<IntroPage />);
      const githubLink = screen.getByText('GitHub');
      const docsLink = screen.getByText('Documentation');
      expect(githubLink).toBeInTheDocument();
      expect(docsLink).toBeInTheDocument();
    });

    it('should display technology stack information', () => {
      render(<IntroPage />);
      expect(screen.getByText(/React|TypeScript|Arwes/i)).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should render navigation links', () => {
      render(<IntroPage />);
      expect(screen.getByText('Components')).toBeInTheDocument();
      expect(screen.getByText('Playground')).toBeInTheDocument();
      expect(screen.getByText('Documentation')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    it('should have proper navigation structure', () => {
      render(<IntroPage />);
      const nav = screen.getByRole('navigation');
      const links = nav.querySelectorAll('a');
      expect(links.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Call-to-Action Buttons', () => {
    it('should render primary and secondary CTA buttons', () => {
      render(<IntroPage />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('should have Get Started button', () => {
      render(<IntroPage />);
      const getStartedBtn = screen.getByRole('button', { name: /Get Started/i });
      expect(getStartedBtn).toBeInTheDocument();
    });

    it('should have Documentation button', () => {
      render(<IntroPage />);
      const docsBtn = screen.getByRole('button', { name: /Documentation/i });
      expect(docsBtn).toBeInTheDocument();
    });

    it('should have minimum touch target size', () => {
      render(<IntroPage />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        expect(rect.height).toBeGreaterThanOrEqual(44);
        expect(rect.width).toBeGreaterThanOrEqual(44);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have skip-to-content link', () => {
      render(<IntroPage />);
      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
    });

    it('should have decorative SVG marked as aria-hidden', () => {
      render(<IntroPage />);
      const canvas = screen.getByRole('img', { hidden: true });
      expect(canvas).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have proper focus management', async () => {
      render(<IntroPage />);
      const user = userEvent.setup();

      const button = screen.getByRole('button', { name: /Get Started/i });
      await user.tab();
      expect(button).toHaveFocus();
    });

    it('should have visible focus indicators', () => {
      render(<IntroPage />);
      const button = screen.getByRole('button', { name: /Get Started/i });
      button.focus();
      const styles = window.getComputedStyle(button);
      expect(styles.outline).not.toBe('none');
    });
  });

  describe('Z-index Layering', () => {
    it('should have background with z-index 0', () => {
      render(<IntroPage />);
      const background = document.querySelector('.intro-page__background');
      expect(background).toHaveStyle('z-index: 0');
    });

    it('should have content with z-index 10', () => {
      render(<IntroPage />);
      const main = screen.getByRole('main');
      expect(main).toHaveStyle('z-index: 10');
    });

    it('should have navigation with z-index 100', () => {
      render(<IntroPage />);
      const header = screen.getByRole('banner');
      expect(header).toHaveStyle('z-index: 100');
    });
  });

  describe('Responsive Layout', () => {
    it('should render feature cards grid', () => {
      render(<IntroPage />);
      const grid = document.querySelector('.intro-page__features-grid');
      expect(grid).toBeInTheDocument();
    });

    it('should have feature cards with proper structure', () => {
      render(<IntroPage />);
      const cards = screen.getAllByTestId('feature-card');
      cards.forEach((card) => {
        expect(card.querySelector('.intro-page__feature-title')).toBeInTheDocument();
        expect(card.querySelector('.intro-page__feature-description')).toBeInTheDocument();
      });
    });

    it('should not have horizontal scrolling', () => {
      render(<IntroPage />);
      const introPage = document.querySelector('.intro-page');
      expect(introPage).toHaveStyle('overflow-x: hidden');
    });
  });

  describe('Props and Callbacks', () => {
    it('should accept onNavigate callback', () => {
      const onNavigate = jest.fn();
      render(<IntroPage onNavigate={onNavigate} />);

      const button = screen.getByRole('button', { name: /Get Started/i });
      button.click();

      expect(onNavigate).toHaveBeenCalled();
    });

    it('should accept animationEnabled prop', () => {
      const { rerender } = render(<IntroPage animationEnabled={true} />);
      expect(document.querySelector('.intro-page')).toBeInTheDocument();

      rerender(<IntroPage animationEnabled={false} />);
      expect(document.querySelector('.intro-page')).toBeInTheDocument();
    });

    it('should accept theme prop', () => {
      const { rerender } = render(<IntroPage theme="dark" />);
      expect(document.querySelector('.intro-page')).toHaveAttribute('data-theme', 'dark');

      rerender(<IntroPage theme="light" />);
      expect(document.querySelector('.intro-page')).toHaveAttribute('data-theme', 'light');
    });
  });

  describe('Feature Cards', () => {
    it('should display feature titles', () => {
      render(<IntroPage />);
      expect(screen.getByText('50+ Components')).toBeInTheDocument();
      expect(screen.getByText('Arwes Frames')).toBeInTheDocument();
      expect(screen.getByText('TypeScript Support')).toBeInTheDocument();
    });

    it('should display feature descriptions', () => {
      render(<IntroPage />);
      expect(screen.getByText(/Comprehensive collection/i)).toBeInTheDocument();
      expect(screen.getByText(/Animated SVG frames/i)).toBeInTheDocument();
      expect(screen.getByText(/Fully typed components/i)).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('should render footer with proper structure', () => {
      render(<IntroPage />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer.querySelector('.intro-page__footer-container')).toBeInTheDocument();
    });

    it('should have footer sections', () => {
      render(<IntroPage />);
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Links')).toBeInTheDocument();
      expect(screen.getByText('Version')).toBeInTheDocument();
    });

    it('should have footer links', () => {
      render(<IntroPage />);
      const footerLinks = document.querySelectorAll('.intro-page__footer-link');
      expect(footerLinks.length).toBeGreaterThan(0);
    });
  });
});
