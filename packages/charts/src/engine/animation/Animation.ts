/**
 * Animation System
 * Handles chart animations and transitions
 */

export type EasingFunction = (t: number) => number;

export interface AnimationOptions {
  duration?: number;
  easing?: EasingFunction | string;
  delay?: number;
  loop?: boolean;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export const easingFunctions: Record<string, EasingFunction> = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (t - 1) * (t - 1) * (t - 1) + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (t - 1) * (t - 1) * (t - 1) * (t - 1),
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (t - 1) * (t - 1) * (t - 1) * (t - 1),
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + (t - 1) * (t - 1) * (t - 1) * (t - 1) * (t - 1),
  easeInOutQuint: (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (t - 1) * (t - 1) * (t - 1) * (t - 1) * (t - 1),
};

export class Animation {
  private startTime: number = 0;
  private duration: number = 1000;
  private easing: EasingFunction = easingFunctions.linear;
  private delay: number = 0;
  private loop: boolean = false;
  private onProgress: ((progress: number) => void) | null = null;
  private onComplete: (() => void) | null = null;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private pausedTime: number = 0;

  constructor(options: AnimationOptions = {}) {
    this.duration = options.duration || 1000;
    this.delay = options.delay || 0;
    this.loop = options.loop || false;
    this.onProgress = options.onProgress || null;
    this.onComplete = options.onComplete || null;

    if (typeof options.easing === 'string') {
      this.easing = easingFunctions[options.easing] || easingFunctions.linear;
    } else if (typeof options.easing === 'function') {
      this.easing = options.easing;
    }
  }

  /**
   * Start the animation
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.startTime = Date.now();
    this.animate();
  }

  /**
   * Pause the animation
   */
  pause(): void {
    if (!this.isRunning || this.isPaused) return;

    this.isPaused = true;
    this.pausedTime = Date.now();

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Resume the animation
   */
  resume(): void {
    if (!this.isRunning || !this.isPaused) return;

    const pausedDuration = Date.now() - this.pausedTime;
    this.startTime += pausedDuration;
    this.isPaused = false;
    this.animate();
  }

  /**
   * Stop the animation
   */
  stop(): void {
    this.isRunning = false;
    this.isPaused = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Check if animation is running
   */
  isAnimating(): boolean {
    return this.isRunning && !this.isPaused;
  }

  /**
   * Get current progress (0-1)
   */
  getProgress(): number {
    if (!this.isRunning) return 0;

    const elapsed = Date.now() - this.startTime - this.delay;
    if (elapsed < 0) return 0;

    const progress = Math.min(1, elapsed / this.duration);
    return this.easing(progress);
  }

  /**
   * Animation frame loop
   */
  private animate(): void {
    if (!this.isRunning || this.isPaused) return;

    const elapsed = Date.now() - this.startTime - this.delay;

    if (elapsed < 0) {
      // Still in delay period
      this.animationFrameId = requestAnimationFrame(() => this.animate());
      return;
    }

    const progress = Math.min(1, elapsed / this.duration);
    const easedProgress = this.easing(progress);

    if (this.onProgress) {
      this.onProgress(easedProgress);
    }

    if (progress >= 1) {
      // Animation complete
      if (this.loop) {
        this.startTime = Date.now();
        this.animationFrameId = requestAnimationFrame(() => this.animate());
      } else {
        this.isRunning = false;
        if (this.onComplete) {
          this.onComplete();
        }
      }
    } else {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
  }
}

export default Animation;
