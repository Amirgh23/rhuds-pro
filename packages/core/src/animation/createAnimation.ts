/**
 * Animation Creation
 * Creates animation instances with custom easing curves
 */

import { AnimationConfig, Animation, EasingFunction } from './types';
import { getEasingFunction } from './easing';

/**
 * Animation state
 */
interface AnimationState {
  startTime: number;
  pauseTime: number;
  isPaused: boolean;
  isReversed: boolean;
  rafId: number | null;
}

/**
 * Create an animation instance
 *
 * This function creates a controllable animation with custom
 * duration, easing, and callbacks. The animation can be played,
 * paused, stopped, reversed, and seeked.
 *
 * @param config - Animation configuration
 * @returns Animation instance with control methods
 *
 * @example
 * ```tsx
 * const animation = createAnimation({
 *   duration: 1000,
 *   easing: 'easeOutCubic',
 *   onUpdate: (progress) => {
 *     element.style.opacity = progress.toString();
 *   },
 *   onComplete: () => {
 *     console.log('Animation complete');
 *   },
 * });
 *
 * animation.play();
 * ```
 */
export function createAnimation(config: AnimationConfig): Animation {
  const { duration, easing, delay = 0, onStart, onComplete, onUpdate } = config;

  // Get easing function
  const easingFn: EasingFunction = getEasingFunction(easing);

  // Animation state
  const state: AnimationState = {
    startTime: 0,
    pauseTime: 0,
    isPaused: false,
    isReversed: false,
    rafId: null,
  };

  // Current progress (0-1)
  let currentProgress = 0;

  /**
   * Animation loop
   */
  function animate(timestamp: number): void {
    if (state.isPaused) return;

    // Initialize start time
    if (state.startTime === 0) {
      state.startTime = timestamp;
    }

    // Calculate elapsed time
    const elapsed = timestamp - state.startTime;

    // Apply delay
    if (elapsed < delay) {
      state.rafId = requestAnimationFrame(animate);
      return;
    }

    // Calculate progress (0-1)
    const adjustedElapsed = elapsed - delay;
    let progress = Math.min(adjustedElapsed / duration, 1);

    // Apply easing
    progress = easingFn(progress);

    // Handle reverse
    if (state.isReversed) {
      progress = 1 - progress;
    }

    // Update current progress
    currentProgress = progress;

    // Call update callback
    onUpdate?.(progress);

    // Check if animation is complete
    if (adjustedElapsed >= duration) {
      onComplete?.();
      state.rafId = null;
      return;
    }

    // Continue animation
    state.rafId = requestAnimationFrame(animate);
  }

  /**
   * Play the animation
   */
  function play(): void {
    if (state.rafId !== null) {
      // Already playing
      return;
    }

    // Resume from pause
    if (state.isPaused) {
      state.isPaused = false;
      const pauseDuration = Date.now() - state.pauseTime;
      state.startTime += pauseDuration;
      state.rafId = requestAnimationFrame(animate);
      return;
    }

    // Start new animation
    state.startTime = 0;
    state.isPaused = false;
    onStart?.();
    state.rafId = requestAnimationFrame(animate);
  }

  /**
   * Pause the animation
   */
  function pause(): void {
    if (state.rafId === null || state.isPaused) {
      return;
    }

    state.isPaused = true;
    state.pauseTime = Date.now();

    if (state.rafId !== null) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
  }

  /**
   * Stop the animation
   */
  function stop(): void {
    if (state.rafId !== null) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }

    state.startTime = 0;
    state.pauseTime = 0;
    state.isPaused = false;
    state.isReversed = false;
    currentProgress = 0;
  }

  /**
   * Reverse the animation direction
   */
  function reverse(): void {
    state.isReversed = !state.isReversed;
  }

  /**
   * Seek to a specific progress point
   *
   * @param progress - Progress value (0-1)
   */
  function seek(progress: number): void {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    currentProgress = clampedProgress;

    // Calculate the time that corresponds to this progress
    const targetTime = clampedProgress * duration + delay;
    state.startTime = Date.now() - targetTime;

    // Update immediately
    const easedProgress = easingFn(clampedProgress);
    onUpdate?.(easedProgress);
  }

  /**
   * Check if animation is playing
   */
  function isPlaying(): boolean {
    return state.rafId !== null && !state.isPaused;
  }

  /**
   * Get current progress
   */
  function getProgress(): number {
    return currentProgress;
  }

  // Return animation instance
  return {
    play,
    pause,
    stop,
    reverse,
    seek,
    isPlaying: isPlaying(),
    getProgress,
  };
}
