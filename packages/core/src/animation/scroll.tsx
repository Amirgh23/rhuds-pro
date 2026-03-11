/**
 * Scroll-Triggered Animation System
 * Viewport intersection detection and scroll-based animations
 */

import React from 'react';

/**
 * Scroll animation configuration
 */
export interface ScrollAnimationConfig {
  trigger: 'enter' | 'exit' | 'progress';
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
  onEnter?: () => void;
  onExit?: () => void;
  onProgress?: (progress: number) => void;
}

/**
 * Scroll animation state
 */
interface ScrollAnimationState {
  isVisible: boolean;
  progress: number;
  hasEntered: boolean;
}

/**
 * Hook for scroll-triggered animations
 *
 * Detects when an element enters/exits the viewport and triggers
 * animations based on scroll position.
 *
 * @param config - Scroll animation configuration
 * @returns Ref and progress value
 */
export function useScrollAnimation(config: ScrollAnimationConfig) {
  const ref = React.useRef<HTMLElement>(null);
  const [state, setState] = React.useState<ScrollAnimationState>({
    isVisible: false,
    progress: 0,
    hasEntered: false,
  });

  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const scrollListenerRef = React.useRef<(() => void) | null>(null);

  // Handle intersection observer callback
  const handleIntersection = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const isVisible = entry.isIntersecting;

        setState((prev) => {
          const newState = { ...prev, isVisible };

          // Trigger enter callback
          if (isVisible && !prev.isVisible && config.trigger === 'enter') {
            config.onEnter?.();
          }

          // Trigger exit callback
          if (!isVisible && prev.isVisible && config.trigger === 'exit') {
            config.onExit?.();
          }

          // Mark as entered for 'once' option
          if (isVisible && config.once) {
            newState.hasEntered = true;
          }

          return newState;
        });
      });
    },
    [config]
  );

  // Handle scroll progress
  const handleScrollProgress = React.useCallback(() => {
    if (!ref.current || config.trigger !== 'progress') return;

    const rect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate progress from 0 to 1
    // 0 when element is below viewport, 1 when above
    const elementTop = rect.top;
    const elementBottom = rect.bottom;

    let progress = 0;

    if (elementBottom < 0) {
      // Element is above viewport
      progress = 1;
    } else if (elementTop > viewportHeight) {
      // Element is below viewport
      progress = 0;
    } else {
      // Element is in viewport - calculate progress
      const visibleTop = Math.max(0, elementTop);
      const visibleBottom = Math.min(viewportHeight, elementBottom);
      const visibleHeight = visibleBottom - visibleTop;
      const elementHeight = rect.height;

      progress = visibleHeight / elementHeight;
    }

    setState((prev) => {
      if (Math.abs(prev.progress - progress) > 0.001) {
        config.onProgress?.(progress);
        return { ...prev, progress };
      }
      return prev;
    });
  }, [config]);

  // Setup intersection observer
  React.useEffect(() => {
    if (!ref.current) return;

    const threshold = config.threshold ?? 0;
    const rootMargin = config.rootMargin ?? '0px';

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(ref.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleIntersection, config.threshold, config.rootMargin]);

  // Setup scroll listener for progress tracking
  React.useEffect(() => {
    if (config.trigger !== 'progress') return;

    scrollListenerRef.current = () => {
      handleScrollProgress();
    };

    window.addEventListener('scroll', scrollListenerRef.current, { passive: true });
    window.addEventListener('resize', scrollListenerRef.current, { passive: true });

    // Initial call
    handleScrollProgress();

    return () => {
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current);
        window.removeEventListener('resize', scrollListenerRef.current);
      }
    };
  }, [config.trigger, handleScrollProgress]);

  return {
    ref,
    isVisible: state.isVisible,
    progress: state.progress,
    hasEntered: state.hasEntered,
  };
}

/**
 * Scroll animation manager for coordinating multiple scroll animations
 */
export class ScrollAnimationManager {
  private animations: Map<string, ScrollAnimationConfig> = new Map();
  private scrollListener: (() => void) | null = null;

  /**
   * Register a scroll animation
   */
  register(id: string, config: ScrollAnimationConfig): void {
    this.animations.set(id, config);
  }

  /**
   * Unregister a scroll animation
   */
  unregister(id: string): void {
    this.animations.delete(id);
  }

  /**
   * Get a scroll animation by ID
   */
  get(id: string): ScrollAnimationConfig | undefined {
    return this.animations.get(id);
  }

  /**
   * Get all registered animations
   */
  getAll(): ScrollAnimationConfig[] {
    return Array.from(this.animations.values());
  }

  /**
   * Start listening to scroll events
   */
  startListening(): void {
    if (this.scrollListener) return;

    this.scrollListener = () => {
      this.animations.forEach((config) => {
        if (config.trigger === 'progress' && config.onProgress) {
          // Progress will be calculated by individual hooks
        }
      });
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  /**
   * Stop listening to scroll events
   */
  stopListening(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = null;
    }
  }

  /**
   * Cleanup all animations
   */
  cleanup(): void {
    this.stopListening();
    this.animations.clear();
  }
}

/**
 * Create a scroll animation manager instance
 */
export function createScrollAnimationManager(): ScrollAnimationManager {
  return new ScrollAnimationManager();
}
