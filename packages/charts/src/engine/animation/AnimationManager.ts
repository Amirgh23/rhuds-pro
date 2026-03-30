/**
 * Animation Manager
 * Manages multiple concurrent animations
 */

import { Animation, type AnimationOptions } from './Animation';

export class AnimationManager {
  private animations: Map<string, Animation> = new Map();
  private frameId: number | null = null;
  private isRunning: boolean = false;
  private onFrameCallback: (() => void) | null = null;

  /**
   * Create and start a new animation
   */
  create(id: string, options: AnimationOptions): Animation {
    const animation = new Animation(options);
    this.animations.set(id, animation);
    return animation;
  }

  /**
   * Get an animation by ID
   */
  get(id: string): Animation | undefined {
    return this.animations.get(id);
  }

  /**
   * Start an animation
   */
  start(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.start();
      this.ensureRunning();
    }
  }

  /**
   * Pause an animation
   */
  pause(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.pause();
    }
  }

  /**
   * Resume an animation
   */
  resume(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.resume();
      this.ensureRunning();
    }
  }

  /**
   * Stop an animation
   */
  stop(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.stop();
    }
  }

  /**
   * Remove an animation
   */
  remove(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.stop();
      this.animations.delete(id);
    }
  }

  /**
   * Check if any animations are running
   */
  hasRunningAnimations(): boolean {
    for (const animation of this.animations.values()) {
      if (animation.isAnimating()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Set frame callback (called on each animation frame)
   */
  setFrameCallback(callback: (() => void) | null): void {
    this.onFrameCallback = callback;
  }

  /**
   * Ensure animation loop is running
   */
  private ensureRunning(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.frameLoop();
  }

  /**
   * Animation frame loop
   */
  private frameLoop(): void {
    if (this.onFrameCallback) {
      this.onFrameCallback();
    }

    if (this.hasRunningAnimations()) {
      this.frameId = requestAnimationFrame(() => this.frameLoop());
    } else {
      this.isRunning = false;
      this.frameId = null;
    }
  }

  /**
   * Stop all animations
   */
  stopAll(): void {
    for (const animation of this.animations.values()) {
      animation.stop();
    }
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.isRunning = false;
  }

  /**
   * Clear all animations
   */
  clear(): void {
    this.stopAll();
    this.animations.clear();
  }
}

export default AnimationManager;
