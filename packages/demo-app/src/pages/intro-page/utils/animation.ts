/**
 * Animation orchestration utilities for intro page
 * Manages timing, sequencing, and coordination of all animations
 */

import { ANIMATION_CONFIG } from '../constants';

/**
 * Animation timing controller
 * Manages delays and durations for coordinated animation sequences
 */
export interface AnimationTimings {
  heroDelay: number;
  heroDuration: number;
  cardsStartDelay: number;
  cardStaggerInterval: number;
  cardDuration: number;
  getCardDelay: (cardIndex: number) => number;
  getTotalDuration: () => number;
}

/**
 * Create animation timing controller
 * Provides methods to calculate animation delays and durations
 */
export function createAnimationTimings(
  config: typeof ANIMATION_CONFIG = ANIMATION_CONFIG
): AnimationTimings {
  return {
    heroDelay: config.heroDelay,
    heroDuration: config.heroDuration,
    cardsStartDelay: config.cardsStartDelay,
    cardStaggerInterval: config.cardStaggerInterval,
    cardDuration: config.cardDuration,

    /**
     * Calculate delay for a specific card based on its index
     * Formula: cardsStartDelay + (cardIndex * staggerInterval)
     */
    getCardDelay(cardIndex: number): number {
      return this.cardsStartDelay + cardIndex * this.cardStaggerInterval;
    },

    /**
     * Calculate total animation sequence duration
     * Includes all cards and their stagger intervals
     */
    getTotalDuration(): number {
      return config.totalDuration;
    },
  };
}

/**
 * Animation orchestrator
 * Coordinates timing and sequencing of multiple animations
 */
export class AnimationOrchestrator {
  private timings: AnimationTimings;
  private activeAnimations: Map<string, number> = new Map();
  private animationFrameId: number | null = null;
  private startTime: number = 0;
  private isRunning: boolean = false;

  constructor(timings: AnimationTimings = createAnimationTimings()) {
    this.timings = timings;
  }

  /**
   * Start the animation sequence
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startTime = performance.now();
    this.scheduleNextFrame();
  }

  /**
   * Stop the animation sequence
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.activeAnimations.clear();
  }

  /**
   * Reset the animation sequence
   */
  reset(): void {
    this.stop();
    this.activeAnimations.clear();
    this.startTime = 0;
  }

  /**
   * Schedule next animation frame
   */
  private scheduleNextFrame(): void {
    if (!this.isRunning) return;

    this.animationFrameId = requestAnimationFrame(() => {
      const elapsed = performance.now() - this.startTime;

      // Check if total sequence is complete
      if (elapsed >= this.timings.getTotalDuration()) {
        this.isRunning = false;
        return;
      }

      this.scheduleNextFrame();
    });
  }

  /**
   * Register an animation
   */
  registerAnimation(id: string, delay: number, duration: number): void {
    this.activeAnimations.set(id, delay);
  }

  /**
   * Check if an animation should be active at current time
   */
  isAnimationActive(id: string, currentTime: number): boolean {
    const delay = this.activeAnimations.get(id);
    if (delay === undefined) return false;
    return currentTime >= delay;
  }

  /**
   * Get animation progress (0-1) for a given animation
   */
  getAnimationProgress(id: string, currentTime: number): number {
    const delay = this.activeAnimations.get(id);
    if (delay === undefined) return 0;

    const elapsed = currentTime - delay;
    if (elapsed < 0) return 0;

    // Determine duration based on animation type
    const duration = id.startsWith('card-') ? this.timings.cardDuration : this.timings.heroDuration;

    const progress = Math.min(elapsed / duration, 1);
    return progress;
  }

  /**
   * Get current elapsed time
   */
  getCurrentTime(): number {
    if (!this.isRunning) return 0;
    return performance.now() - this.startTime;
  }

  /**
   * Check if orchestrator is running
   */
  getIsRunning(): boolean {
    return this.isRunning;
  }
}

/**
 * Easing functions for animations
 */
export const easingFunctions = {
  /**
   * Linear easing (no acceleration)
   */
  linear: (t: number): number => t,

  /**
   * Ease-in (slow start)
   */
  easeIn: (t: number): number => t * t,

  /**
   * Ease-out (slow end)
   */
  easeOut: (t: number): number => 1 - (1 - t) * (1 - t),

  /**
   * Ease-in-out (slow start and end)
   */
  easeInOut: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  /**
   * Cubic easing
   */
  cubicIn: (t: number): number => t * t * t,

  /**
   * Cubic easing out
   */
  cubicOut: (t: number): number => 1 - Math.pow(1 - t, 3),

  /**
   * Cubic easing in-out
   */
  cubicInOut: (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

/**
 * Calculate animation delay for a card in a staggered sequence
 */
export function calculateCardDelay(
  cardIndex: number,
  startDelay: number = ANIMATION_CONFIG.cardsStartDelay,
  staggerInterval: number = ANIMATION_CONFIG.cardStaggerInterval
): number {
  return startDelay + cardIndex * staggerInterval;
}

/**
 * Calculate total animation duration including all cards
 */
export function calculateTotalAnimationDuration(
  cardCount: number,
  startDelay: number = ANIMATION_CONFIG.cardsStartDelay,
  staggerInterval: number = ANIMATION_CONFIG.cardStaggerInterval,
  cardDuration: number = ANIMATION_CONFIG.cardDuration
): number {
  const lastCardDelay = startDelay + (cardCount - 1) * staggerInterval;
  return lastCardDelay + cardDuration;
}

/**
 * Delay execution of a function
 */
export function delayExecution(callback: () => void, delay: number): () => void {
  let timeoutId: NodeJS.Timeout | null = null;

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  timeoutId = setTimeout(callback, delay);

  return cancel;
}

/**
 * Create a staggered animation sequence
 */
export function createStaggeredSequence(
  items: unknown[],
  startDelay: number = ANIMATION_CONFIG.cardsStartDelay,
  staggerInterval: number = ANIMATION_CONFIG.cardStaggerInterval
): Array<{ index: number; delay: number }> {
  return items.map((_, index) => ({
    index,
    delay: startDelay + index * staggerInterval,
  }));
}
