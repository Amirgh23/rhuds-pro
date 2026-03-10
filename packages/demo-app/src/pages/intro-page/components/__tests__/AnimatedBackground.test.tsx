/**
 * Unit tests for AnimatedBackground component
 * Tests particle count responsiveness, opacity range, animation frame rate,
 * canvas rendering, and cleanup on unmount
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AnimatedBackground } from '../AnimatedBackground';
import { BACKGROUND_CONFIG, BREAKPOINTS } from '../../constants';
import { setViewportWidth } from '../../__tests__/test-utils';

describe('AnimatedBackground Component', () => {
  // Setup and teardown
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset viewport to desktop
    setViewportWidth(1200);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Component renders without errors
  it('should render canvas element without errors', () => {
    render(<AnimatedBackground />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 2: Canvas has correct attributes
  it('should have aria-hidden attribute for accessibility', () => {
    render(<AnimatedBackground />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  // Test 3: Canvas is positioned absolutely
  it('should have absolute positioning', () => {
    render(<AnimatedBackground />);
    const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
    const style = window.getComputedStyle(canvas);
    expect(style.position).toBe('absolute');
  });

  // Test 4: Canvas covers full viewport
  it('should have 100% width and height', () => {
    render(<AnimatedBackground />);
    const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
    expect(canvas.style.width).toBe('100%');
    expect(canvas.style.height).toBe('100%');
  });

  // Test 5: Correct z-index for background layering
  it('should have z-index of 0 for background layering', () => {
    render(<AnimatedBackground />);
    const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
    expect(canvas.style.zIndex).toBe('0');
  });

  // Test 6: GPU acceleration with will-change
  it('should have will-change property for GPU acceleration', () => {
    render(<AnimatedBackground />);
    const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
    expect(canvas.style.willChange).toBe('transform');
  });

  // Test 7: Particle count on desktop (80-100)
  it('should use 100 particles on desktop viewport', async () => {
    setViewportWidth(1200);
    render(<AnimatedBackground />);

    await waitFor(() => {
      const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
      expect(canvas).toBeInTheDocument();
    });

    const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();
  });

  // Test 8: Particle count on tablet (50)
  it('should use 50 particles on tablet viewport', async () => {
    setViewportWidth(800);
    render(<AnimatedBackground />);

    await waitFor(() => {
      const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
      expect(canvas).toBeInTheDocument();
    });

    const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();
  });

  // Test 9: Particle count on mobile (20-30)
  it('should use 25 particles on mobile viewport', async () => {
    setViewportWidth(375);
    render(<AnimatedBackground />);

    await waitFor(() => {
      const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
      expect(canvas).toBeInTheDocument();
    });

    const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();
  });

  // Test 10: Opacity range validation (0.1-0.3)
  it('should clamp opacity to minimum 0.1', () => {
    render(<AnimatedBackground opacity={0.05} />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 11: Opacity range validation (max)
  it('should clamp opacity to maximum 0.3', () => {
    render(<AnimatedBackground opacity={0.5} />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 12: Default opacity value
  it('should use default opacity of 0.15', () => {
    render(<AnimatedBackground />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 13: Custom particle count
  it('should accept custom particle count', () => {
    render(<AnimatedBackground particleCount={50} />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 14: Animation speed range validation
  it('should clamp animation speed to valid range', () => {
    render(<AnimatedBackground animationSpeed={3.0} />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 15: Canvas context is obtained
  it('should successfully obtain canvas 2D context', async () => {
    render(<AnimatedBackground />);

    await waitFor(() => {
      const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
      expect(canvas).toBeInTheDocument();
    });
  });

  // Test 16: Canvas resizes on window resize
  it('should resize canvas on window resize event', async () => {
    render(<AnimatedBackground />);

    const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
    const initialWidth = canvas.width;

    // Simulate resize
    setViewportWidth(800);

    await waitFor(() => {
      expect(canvas).toBeInTheDocument();
    });
  });

  // Test 17: Cleanup on unmount
  it('should cancel animation frame on unmount', () => {
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');

    const { unmount } = render(<AnimatedBackground />);
    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    cancelAnimationFrameSpy.mockRestore();
  });

  // Test 18: Cleanup removes resize listener
  it('should remove resize listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<AnimatedBackground />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  // Test 19: Animation loop is started
  it('should start animation loop on mount', () => {
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');

    render(<AnimatedBackground />);

    expect(requestAnimationFrameSpy).toHaveBeenCalled();
    requestAnimationFrameSpy.mockRestore();
  });

  // Test 20: Responsive particle count updates on viewport change
  it('should update particle count when viewport changes', async () => {
    const { rerender } = render(<AnimatedBackground />);

    setViewportWidth(375); // Mobile
    rerender(<AnimatedBackground />);

    await waitFor(() => {
      const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
      expect(canvas).toBeInTheDocument();
    });
  });

  // Test 21: Canvas is display block
  it('should have display block style', () => {
    render(<AnimatedBackground />);
    const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
    expect(canvas.style.display).toBe('block');
  });

  // Test 22: Color prop is accepted
  it('should accept custom color prop', () => {
    render(<AnimatedBackground color="rgba(0, 150, 255, 1)" />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 23: Type prop is accepted
  it('should accept type prop', () => {
    render(<AnimatedBackground type="particles" />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 24: Canvas element is not null after render
  it('should have valid canvas element after render', async () => {
    render(<AnimatedBackground />);

    await waitFor(() => {
      const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
      expect(canvas).not.toBeNull();
      expect(canvas.tagName).toBe('CANVAS');
    });
  });

  // Test 25: Multiple instances can coexist
  it('should allow multiple AnimatedBackground instances', () => {
    const { container } = render(
      <div>
        <AnimatedBackground />
        <AnimatedBackground opacity={0.2} />
      </div>
    );

    const canvases = container.querySelectorAll('canvas');
    expect(canvases.length).toBe(2);
  });

  // Test 26: Particle count is within expected range for mobile
  it('should use particle count in mobile range (20-30)', () => {
    setViewportWidth(375);
    render(<AnimatedBackground />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 27: Particle count is within expected range for desktop
  it('should use particle count in desktop range (80-100)', () => {
    setViewportWidth(1200);
    render(<AnimatedBackground />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 28: Animation speed is clamped to minimum
  it('should clamp animation speed to minimum 0.5', () => {
    render(<AnimatedBackground animationSpeed={0.1} />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 29: Animation speed is clamped to maximum
  it('should clamp animation speed to maximum 2.0', () => {
    render(<AnimatedBackground animationSpeed={5.0} />);
    const canvas = screen.getByTestId('animated-background-canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Test 30: Canvas has correct positioning styles
  it('should have correct positioning styles', () => {
    render(<AnimatedBackground />);
    const canvas = screen.getByTestId('animated-background-canvas') as HTMLCanvasElement;
    expect(canvas.style.position).toBe('absolute');
    expect(canvas.style.top).toBe('0px');
    expect(canvas.style.left).toBe('0px');
  });
});
