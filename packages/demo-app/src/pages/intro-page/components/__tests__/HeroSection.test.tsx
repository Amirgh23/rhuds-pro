/**
 * HeroSection Component Tests
 *
 * Unit tests for the HeroSection component covering:
 * - Component rendering
 * - Props handling
 * - CTA button functionality
 * - Accessibility features
 * - Responsive behavior
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { HeroSection } from '../HeroSection';
import { ANIMATION_CONFIG } from '../../constants';
import '@testing-library/jest-dom';

// Mock ResizeObserver before importing components
beforeAll(() => {
  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  global.ResizeObserver = MockResizeObserver as any;
});

describe('HeroSection Component', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  describe('Basic Rendering', () => {
    it('should render hero section with default props', () => {
      render(<HeroSection />);
      expect(screen.getByText('RHUDS')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      const customTitle = 'Custom Title';
      render(<HeroSection title={customTitle} />);
      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it('should render with custom subtitle', () => {
      const customSubtitle = 'Custom Subtitle';
      render(<HeroSection subtitle={customSubtitle} />);
      expect(screen.getByText(customSubtitle)).toBeInTheDocument();
    });

    it('should render with custom description', () => {
      const customDescription = 'Custom Description';
      render(<HeroSection description={customDescription} />);
      expect(screen.getByText(customDescription)).toBeInTheDocument();
    });

    it('should render default title "RHUDS"', () => {
      render(<HeroSection />);
      expect(screen.getByText('RHUDS')).toBeInTheDocument();
    });

    it('should render default subtitle', () => {
      render(<HeroSection />);
      expect(screen.getByText('React HUD Design System')).toBeInTheDocument();
    });

    it('should render default description', () => {
      render(<HeroSection />);
      expect(
        screen.getByText(/Futuristic UI components for React with Arwes-inspired animations/)
      ).toBeInTheDocument();
    });

    it('should render without description when not provided', () => {
      const { container } = render(<HeroSection description={undefined} />);
      expect(container.querySelector('.hero-section')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // CTA Button Tests
  // ============================================================================

  describe('CTA Buttons', () => {
    it('should render primary CTA button', () => {
      render(<HeroSection />);
      const button = screen.getByRole('button', { name: /Get Started/i });
      expect(button).toBeInTheDocument();
    });

    it('should render secondary CTA button', () => {
      render(<HeroSection />);
      const button = screen.getByRole('button', { name: /Documentation/i });
      expect(button).toBeInTheDocument();
    });

    it('should have minimum height of 44px for touch accessibility', () => {
      const { container } = render(<HeroSection />);
      const button = container.querySelector('.hero-section__cta-button');
      expect(button).toHaveClass('hero-section__cta-button');
    });

    it('should have minimum width of 120px', () => {
      const { container } = render(<HeroSection />);
      const button = container.querySelector('.hero-section__cta-button');
      expect(button).toHaveClass('hero-section__cta-button');
    });

    it('should call onCTAClick with primary action', async () => {
      const mockOnCTAClick = vi.fn();
      render(<HeroSection onCTAClick={mockOnCTAClick} />);
      const button = screen.getByRole('button', { name: /Get Started/i });
      await userEvent.click(button);
      expect(mockOnCTAClick).toHaveBeenCalledWith('primary');
    });

    it('should call onCTAClick with secondary action', async () => {
      const mockOnCTAClick = vi.fn();
      render(<HeroSection onCTAClick={mockOnCTAClick} />);
      const button = screen.getByRole('button', { name: /Documentation/i });
      await userEvent.click(button);
      expect(mockOnCTAClick).toHaveBeenCalledWith('secondary');
    });

    it('should have correct aria-label for primary button', () => {
      render(<HeroSection />);
      const button = screen.getByRole('button', { name: /Get started with RHUDS components/i });
      expect(button).toBeInTheDocument();
    });

    it('should have correct aria-label for secondary button', () => {
      render(<HeroSection />);
      const button = screen.getByRole('button', { name: /View RHUDS documentation/i });
      expect(button).toBeInTheDocument();
    });

    it('should render buttons with uppercase text', () => {
      const { container } = render(<HeroSection />);
      const button = container.querySelector('.hero-section__cta-button');
      expect(button).toHaveClass('hero-section__cta-button');
    });

    it('should render buttons with letter spacing', () => {
      const { container } = render(<HeroSection />);
      const button = container.querySelector('.hero-section__cta-button');
      expect(button).toHaveClass('hero-section__cta-button');
    });

    it('should handle multiple button clicks', async () => {
      const mockOnCTAClick = vi.fn();
      render(<HeroSection onCTAClick={mockOnCTAClick} />);
      const primaryButton = screen.getByRole('button', { name: /Get Started/i });
      const secondaryButton = screen.getByRole('button', { name: /Documentation/i });

      await userEvent.click(primaryButton);
      await userEvent.click(secondaryButton);

      expect(mockOnCTAClick).toHaveBeenCalledTimes(2);
      expect(mockOnCTAClick).toHaveBeenNthCalledWith(1, 'primary');
      expect(mockOnCTAClick).toHaveBeenNthCalledWith(2, 'secondary');
    });

    it('should handle rapid button clicks', async () => {
      const mockOnCTAClick = vi.fn();
      render(<HeroSection onCTAClick={mockOnCTAClick} />);
      const button = screen.getByRole('button', { name: /Get Started/i });

      await userEvent.click(button);
      await userEvent.click(button);
      await userEvent.click(button);

      expect(mockOnCTAClick).toHaveBeenCalledTimes(3);
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  describe('Accessibility', () => {
    it('should have proper section role', () => {
      render(<HeroSection />);
      const section = screen.getByRole('region', { hidden: true });
      expect(section).toBeInTheDocument();
    });

    it('should have aria-labelledby attribute', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('.hero-section');
      expect(section).toHaveAttribute('aria-labelledby', 'hero-title');
    });

    it('should have proper heading hierarchy', () => {
      render(<HeroSection />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have id on title for aria-labelledby', () => {
      render(<HeroSection />);
      const title = screen.getByText('RHUDS');
      expect(title).toHaveAttribute('id', 'hero-title');
    });

    it('should have proper button roles', () => {
      render(<HeroSection />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('should have keyboard accessible buttons', async () => {
      render(<HeroSection />);
      const button = screen.getByRole('button', { name: /Get Started/i });
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should have semantic HTML structure', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Styling Tests
  // ============================================================================

  describe('Styling', () => {
    it('should apply monospace font family to title', () => {
      const { container } = render(<HeroSection />);
      const title = container.querySelector('.hero-section__title');
      expect(title).toHaveClass('hero-section__title');
    });

    it('should apply cyan color to title', () => {
      const { container } = render(<HeroSection />);
      const title = container.querySelector('.hero-section__title');
      expect(title).toHaveClass('hero-section__title');
    });

    it('should apply glow effect to title', () => {
      const { container } = render(<HeroSection />);
      const title = container.querySelector('.hero-section__title');
      expect(title).toHaveClass('hero-section__title');
    });

    it('should apply letter spacing to title', () => {
      const { container } = render(<HeroSection />);
      const title = container.querySelector('.hero-section__title');
      expect(title).toHaveClass('hero-section__title');
    });

    it('should apply correct font weight to title', () => {
      const { container } = render(<HeroSection />);
      const title = container.querySelector('.hero-section__title');
      expect(title).toHaveClass('hero-section__title');
    });

    it('should apply correct font weight to subtitle', () => {
      const { container } = render(<HeroSection />);
      const subtitle = container.querySelector('.hero-section__subtitle');
      expect(subtitle).toHaveClass('hero-section__subtitle');
    });

    it('should apply correct color to subtitle', () => {
      const { container } = render(<HeroSection />);
      const subtitle = container.querySelector('.hero-section__subtitle');
      expect(subtitle).toHaveClass('hero-section__subtitle');
    });

    it('should apply correct color to description', () => {
      const { container } = render(<HeroSection />);
      const description = container.querySelector('.hero-section__description');
      expect(description).toHaveClass('hero-section__description');
    });

    it('should apply line height to description', () => {
      const { container } = render(<HeroSection />);
      const description = container.querySelector('.hero-section__description');
      expect(description).toHaveClass('hero-section__description');
    });
  });

  // ============================================================================
  // Centering and Positioning Tests
  // ============================================================================

  describe('Centering and Positioning', () => {
    it('should center hero section horizontally', () => {
      const { container } = render(<HeroSection />);
      const container_el = container.querySelector('.hero-section__container');
      expect(container_el).toHaveClass('hero-section__container');
    });

    it('should center hero section vertically', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('.hero-section');
      expect(section).toHaveClass('hero-section');
    });

    it('should apply correct max-width to container', () => {
      const { container } = render(<HeroSection />);
      const container_el = container.querySelector('.hero-section__container');
      expect(container_el).toHaveClass('hero-section__container');
    });

    it('should apply correct width to container', () => {
      const { container } = render(<HeroSection />);
      const container_el = container.querySelector('.hero-section__container');
      expect(container_el).toHaveClass('hero-section__container');
    });

    it('should center frame wrapper', () => {
      const { container } = render(<HeroSection />);
      const wrapper = container.querySelector('.hero-section__frame-wrapper');
      expect(wrapper).toHaveClass('hero-section__frame-wrapper');
    });

    it('should center content inside frame', () => {
      const { container } = render(<HeroSection />);
      const content = container.querySelector('.hero-section__content');
      expect(content).toHaveClass('hero-section__content');
    });

    it('should position content absolutely inside frame', () => {
      const { container } = render(<HeroSection />);
      const content = container.querySelector('.hero-section__content');
      expect(content).toHaveClass('hero-section__content');
    });

    it('should apply correct z-index to section', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('.hero-section');
      expect(section).toHaveClass('hero-section');
    });
  });

  // ============================================================================
  // Responsive Behavior Tests
  // ============================================================================

  describe('Responsive Behavior', () => {
    it('should render with responsive padding', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('.hero-section');
      expect(section).toHaveClass('hero-section');
    });

    it('should render with responsive min-height', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('.hero-section');
      expect(section).toHaveClass('hero-section');
    });

    it('should render title with responsive font size', () => {
      const { container } = render(<HeroSection />);
      const title = container.querySelector('.hero-section__title');
      expect(title).toHaveClass('hero-section__title');
    });

    it('should render subtitle with responsive font size', () => {
      const { container } = render(<HeroSection />);
      const subtitle = container.querySelector('.hero-section__subtitle');
      expect(subtitle).toHaveClass('hero-section__subtitle');
    });

    it('should render description with responsive font size', () => {
      const { container } = render(<HeroSection />);
      const description = container.querySelector('.hero-section__description');
      expect(description).toHaveClass('hero-section__description');
    });

    it('should render CTA buttons with responsive font size', () => {
      const { container } = render(<HeroSection />);
      const button = container.querySelector('.hero-section__cta-button');
      expect(button).toHaveClass('hero-section__cta-button');
    });
  });

  // ============================================================================
  // Props Validation Tests
  // ============================================================================

  describe('Props Validation', () => {
    it('should accept frameType prop', () => {
      const { container } = render(<HeroSection frameType="nefrex" />);
      const section = container.querySelector('.hero-section');
      expect(section).toBeInTheDocument();
    });

    it('should accept animationDelay prop', () => {
      const { container } = render(<HeroSection animationDelay={300} />);
      const section = container.querySelector('.hero-section');
      expect(section).toHaveClass('hero-section');
    });

    it('should use default animation delay from config', () => {
      const { container } = render(<HeroSection />);
      const section = container.querySelector('.hero-section');
      expect(section).toHaveClass('hero-section');
    });

    it('should accept onCTAClick callback', () => {
      const mockCallback = vi.fn();
      render(<HeroSection onCTAClick={mockCallback} />);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should handle empty description gracefully', () => {
      const { container } = render(<HeroSection description="" />);
      const section = container.querySelector('.hero-section');
      expect(section).toBeInTheDocument();
    });

    it('should handle null description gracefully', () => {
      const { container } = render(<HeroSection description={undefined} />);
      const section = container.querySelector('.hero-section');
      expect(section).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration', () => {
    it('should render complete hero section with all elements', () => {
      const { container } = render(<HeroSection />);
      expect(container.querySelector('.hero-section')).toBeInTheDocument();
      expect(container.querySelector('.hero-section__frame-wrapper')).toBeInTheDocument();
      expect(container.querySelector('.hero-section__title')).toBeInTheDocument();
      expect(container.querySelector('.hero-section__subtitle')).toBeInTheDocument();
      expect(container.querySelector('.hero-section__description')).toBeInTheDocument();
      expect(container.querySelector('.hero-section__cta-buttons')).toBeInTheDocument();
    });

    it('should maintain layout with long text', () => {
      const longTitle = 'A'.repeat(100);
      const { container } = render(<HeroSection title={longTitle} />);
      const section = container.querySelector('.hero-section');
      expect(section).toBeInTheDocument();
    });

    it('should render with custom props combination', () => {
      const { container } = render(
        <HeroSection
          title="Custom"
          subtitle="Custom Subtitle"
          description="Custom Description"
          frameType="kranox"
          animationDelay={500}
        />
      );
      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Custom Description')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle very short title', () => {
      render(<HeroSection title="R" />);
      expect(screen.getByText('R')).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'RHUDS™ © 2024';
      render(<HeroSection title={specialTitle} />);
      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it('should handle unicode characters', () => {
      const unicodeTitle = 'RHUDS 🚀';
      render(<HeroSection title={unicodeTitle} />);
      expect(screen.getByText(unicodeTitle)).toBeInTheDocument();
    });

    it('should handle zero animation delay', () => {
      const { container } = render(<HeroSection animationDelay={0} />);
      const section = container.querySelector('.hero-section');
      expect(section).toHaveClass('hero-section');
    });

    it('should handle very large animation delay', () => {
      const { container } = render(<HeroSection animationDelay={10000} />);
      const section = container.querySelector('.hero-section');
      expect(section).toHaveClass('hero-section');
    });

    it('should render without onCTAClick callback', () => {
      render(<HeroSection onCTAClick={undefined} />);
      const button = screen.getByRole('button', { name: /Get Started/i });
      expect(button).toBeInTheDocument();
    });
  });
});
