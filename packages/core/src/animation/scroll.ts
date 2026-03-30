/**
 * Scroll-Triggered Animation System
 * Handles viewport intersection detection and scroll-based animations
 */

export interface ScrollTriggerConfig {
  threshold?: number | number[];
  rootMargin?: string;
  onEnter?: () => void;
  onExit?: () => void;
  onProgress?: (progress: number) => void;
}

export interface ScrollProgressConfig {
  onProgress: (progress: number) => void;
  container?: Element;
}

/**
 * Scroll trigger using Intersection Observer API
 */
export class ScrollTrigger {
  private observer: IntersectionObserver | null = null;
  private element: Element | null = null;
  private config: ScrollTriggerConfig;
  private isVisible: boolean = false;

  constructor(config: ScrollTriggerConfig = {}) {
    this.config = config;
  }

  /**
   * Attach to element
   */
  attach(element: Element): void {
    this.element = element;
    this.setupObserver();
  }

  /**
   * Setup intersection observer
   */
  private setupObserver(): void {
    if (!this.element) return;

    const options: IntersectionObserverInit = {
      threshold: this.config.threshold ?? 0.1,
      rootMargin: this.config.rootMargin ?? '0px',
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isVisible) {
          this.isVisible = true;
          this.config.onEnter?.();
        } else if (!entry.isIntersecting && this.isVisible) {
          this.isVisible = false;
          this.config.onExit?.();
        }
      });
    }, options);

    this.observer.observe(this.element);
  }

  /**
   * Detach from element
   */
  detach(): void {
    if (this.observer && this.element) {
      this.observer.unobserve(this.element);
      this.observer.disconnect();
      this.observer = null;
    }
    this.element = null;
  }

  /**
   * Check if element is visible
   */
  isElementVisible(): boolean {
    return this.isVisible;
  }
}

/**
 * Scroll progress tracker
 */
export class ScrollProgress {
  private element: Element | null = null;
  private container: Element;
  private config: ScrollProgressConfig;
  private animationFrameId: number | null = null;

  constructor(config: ScrollProgressConfig) {
    this.config = config;
    this.container = config.container ?? window.document.documentElement;
  }

  /**
   * Attach to element
   */
  attach(element: Element): void {
    this.element = element;
    this.startTracking();
  }

  /**
   * Start tracking scroll progress
   */
  private startTracking(): void {
    if (!this.element) return;

    const updateProgress = () => {
      if (!this.element) return;

      const rect = this.element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Calculate progress: 0 when element is below viewport, 1 when above
      const progress = Math.max(
        0,
        Math.min(1, 1 - (elementTop - viewportHeight) / (elementHeight + viewportHeight))
      );

      this.config.onProgress(progress);
      this.animationFrameId = requestAnimationFrame(updateProgress);
    };

    this.animationFrameId = requestAnimationFrame(updateProgress);
  }

  /**
   * Detach from element
   */
  detach(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.element = null;
  }
}

/**
 * Scroll-based animation controller
 */
export class ScrollAnimation {
  private triggers: Map<string, ScrollTrigger> = new Map();
  private progressTrackers: Map<string, ScrollProgress> = new Map();

  /**
   * Add scroll trigger
   */
  addTrigger(id: string, element: Element, config: ScrollTriggerConfig): void {
    const trigger = new ScrollTrigger(config);
    trigger.attach(element);
    this.triggers.set(id, trigger);
  }

  /**
   * Remove scroll trigger
   */
  removeTrigger(id: string): void {
    const trigger = this.triggers.get(id);
    if (trigger) {
      trigger.detach();
      this.triggers.delete(id);
    }
  }

  /**
   * Add scroll progress tracker
   */
  addProgressTracker(id: string, element: Element, config: ScrollProgressConfig): void {
    const tracker = new ScrollProgress(config);
    tracker.attach(element);
    this.progressTrackers.set(id, tracker);
  }

  /**
   * Remove scroll progress tracker
   */
  removeProgressTracker(id: string): void {
    const tracker = this.progressTrackers.get(id);
    if (tracker) {
      tracker.detach();
      this.progressTrackers.delete(id);
    }
  }

  /**
   * Check if trigger is visible
   */
  isTriggerVisible(id: string): boolean {
    const trigger = this.triggers.get(id);
    return trigger ? trigger.isElementVisible() : false;
  }

  /**
   * Cleanup all triggers and trackers
   */
  cleanup(): void {
    this.triggers.forEach((trigger) => trigger.detach());
    this.progressTrackers.forEach((tracker) => tracker.detach());
    this.triggers.clear();
    this.progressTrackers.clear();
  }
}

export default {
  ScrollTrigger,
  ScrollProgress,
  ScrollAnimation,
};

/**
 * Scroll animation configuration
 */
export interface ScrollAnimationConfig {
  threshold?: number | number[];
  rootMargin?: string;
  onEnter?: () => void;
  onExit?: () => void;
  onProgress?: (progress: number) => void;
}

/**
 * Scroll animation manager (alias for ScrollAnimation)
 */
export class ScrollAnimationManager extends ScrollAnimation {}

/**
 * Factory function for scroll animations
 */
export function useScrollAnimation(config: ScrollAnimationConfig = {}): ScrollAnimation {
  return new ScrollAnimation();
}

/**
 * Factory function for creating scroll animation manager
 */
export function createScrollAnimationManager(): ScrollAnimationManager {
  return new ScrollAnimationManager();
}

/**
 * Hook for detecting if element is in view
 */
export function useInView(config: ScrollTriggerConfig = {}): ScrollTrigger {
  return new ScrollTrigger(config);
}

/**
 * Hook for tracking scroll progress
 */
export function useScrollProgress(config: ScrollProgressConfig): ScrollProgress {
  return new ScrollProgress(config);
}

/**
 * Hook for parallax effect (uses scroll progress)
 */
export function useParallax(config: ScrollProgressConfig): ScrollProgress {
  return new ScrollProgress(config);
}
