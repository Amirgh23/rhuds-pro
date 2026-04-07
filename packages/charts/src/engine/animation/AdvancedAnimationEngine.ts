/**
 * Advanced Animation Engine
 * Keyframe-based animations with physics and easing
 */

export interface Keyframe {
  time: number;
  value: any;
  easing?: string;
}

export interface AnimationSequence {
  name: string;
  duration: number;
  keyframes: Keyframe[];
  loop?: boolean;
  delay?: number;
}

export interface PhysicsConfig {
  mass?: number;
  friction?: number;
  tension?: number;
  damping?: number;
}

/**
 * Advanced Animation Engine
 */
export class AdvancedAnimationEngine {
  private sequences: Map<string, AnimationSequence> = new Map();
  private activeAnimations: Map<string, any> = new Map();
  private frameId: number | null = null;
  private startTime: number = 0;
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Create animation sequence
   */
  public createSequence(
    name: string,
    keyframes: Keyframe[],
    options: { loop?: boolean; delay?: number } = {}
  ): AnimationSequence {
    const duration = Math.max(...keyframes.map((k) => k.time));

    const sequence: AnimationSequence = {
      name,
      duration,
      keyframes: keyframes.sort((a, b) => a.time - b.time),
      loop: options.loop || false,
      delay: options.delay || 0,
    };

    this.sequences.set(name, sequence);
    return sequence;
  }

  /**
   * Play animation sequence
   */
  public play(name: string, target: any, onUpdate: (value: any) => void): Promise<void> {
    return new Promise((resolve) => {
      const sequence = this.sequences.get(name);
      if (!sequence) {
        throw new Error(`Sequence not found: ${name}`);
      }

      const animation = {
        sequence,
        target,
        onUpdate,
        startTime: Date.now() + (sequence.delay || 0),
        resolve,
        isPlaying: true,
      };

      this.activeAnimations.set(name, animation);
      this.animate();
    });
  }

  /**
   * Animate frame
   */
  private animate = (): void => {
    const now = Date.now();
    let hasActive = false;

    this.activeAnimations.forEach((animation, name) => {
      if (!animation.isPlaying) return;

      const elapsed = now - animation.startTime;
      const { sequence } = animation;

      if (elapsed < 0) {
        hasActive = true;
        return;
      }

      let progress = elapsed / sequence.duration;

      if (progress >= 1) {
        if (sequence.loop) {
          animation.startTime = now;
          progress = 0;
          hasActive = true;
        } else {
          animation.isPlaying = false;
          animation.resolve();
          this.activeAnimations.delete(name);
          this.emit('complete', { name });
          return;
        }
      } else {
        hasActive = true;
      }

      const value = this.interpolateKeyframes(sequence.keyframes, progress);
      animation.onUpdate(value);
      this.emit('update', { name, progress, value });
    });

    if (hasActive) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  /**
   * Interpolate keyframes
   */
  private interpolateKeyframes(keyframes: Keyframe[], progress: number): any {
    let startFrame = keyframes[0];
    let endFrame = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (keyframes[i].time <= progress * 100 && keyframes[i + 1].time >= progress * 100) {
        startFrame = keyframes[i];
        endFrame = keyframes[i + 1];
        break;
      }
    }

    const frameProgress = (progress * 100 - startFrame.time) / (endFrame.time - startFrame.time);
    const easing = this.getEasingFunction(startFrame.easing || 'linear');
    const easedProgress = easing(frameProgress);

    return this.lerp(startFrame.value, endFrame.value, easedProgress);
  }

  /**
   * Get easing function
   */
  private getEasingFunction(name: string): (t: number) => number {
    const easings: Record<string, (t: number) => number> = {
      linear: (t) => t,
      easeIn: (t) => t * t,
      easeOut: (t) => t * (2 - t),
      easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      easeInCubic: (t) => t * t * t,
      easeOutCubic: (t) => --t * t * t + 1,
      easeInQuart: (t) => t * t * t * t,
      easeOutQuart: (t) => 1 - --t * t * t * t,
      easeInQuint: (t) => t * t * t * t * t,
      easeOutQuint: (t) => 1 + --t * t * t * t * t,
    };

    return easings[name] || easings.linear;
  }

  /**
   * Linear interpolation
   */
  private lerp(start: any, end: any, t: number): any {
    if (typeof start === 'number' && typeof end === 'number') {
      return start + (end - start) * t;
    }

    if (Array.isArray(start) && Array.isArray(end)) {
      return start.map((s, i) => s + (end[i] - s) * t);
    }

    if (typeof start === 'object' && typeof end === 'object') {
      const result: any = {};
      Object.keys(start).forEach((key) => {
        result[key] = this.lerp(start[key], end[key], t);
      });
      return result;
    }

    return end;
  }

  /**
   * Physics-based animation
   */
  public animateWithPhysics(
    target: any,
    destination: any,
    config: PhysicsConfig = {},
    onUpdate: (value: any) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const mass = config.mass || 1;
      const friction = config.friction || 0.1;
      const tension = config.tension || 0.1;
      const damping = config.damping || 0.2;

      let velocity = 0;
      let position = target;
      let isComplete = false;

      const animate = () => {
        const distance = destination - position;
        const force = distance * tension - velocity * damping;
        const acceleration = force / mass;

        velocity += acceleration;
        velocity *= 1 - friction;
        position += velocity;

        onUpdate(position);

        if (Math.abs(distance) < 0.01 && Math.abs(velocity) < 0.01) {
          if (!isComplete) {
            isComplete = true;
            onUpdate(destination);
            resolve();
          }
        } else {
          requestAnimationFrame(animate);
        }
      };

      animate();
    });
  }

  /**
   * Gesture-based animation
   */
  public animateGesture(
    element: HTMLElement,
    onGesture: (gesture: string, data: any) => void
  ): void {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    element.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    });

    element.addEventListener('touchmove', (e) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;

      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      onGesture('pan', { deltaX, deltaY });
    });

    element.addEventListener('touchend', (e) => {
      const duration = Date.now() - startTime;
      const deltaX = e.changedTouches[0].clientX - startX;
      const deltaY = e.changedTouches[0].clientY - startY;

      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / duration;

      if (velocity > 0.5) {
        onGesture('swipe', { deltaX, deltaY, velocity });
      }
    });
  }

  /**
   * Scroll-based animation
   */
  public animateOnScroll(element: HTMLElement, onScroll: (progress: number) => void): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          const progress = 1 - rect.top / window.innerHeight;
          onScroll(Math.max(0, Math.min(1, progress)));
        }
      });
    });

    observer.observe(element);
  }

  /**
   * Stop animation
   */
  public stop(name: string): void {
    const animation = this.activeAnimations.get(name);
    if (animation) {
      animation.isPlaying = false;
      this.activeAnimations.delete(name);
    }
  }

  /**
   * Stop all animations
   */
  public stopAll(): void {
    this.activeAnimations.forEach((animation) => {
      animation.isPlaying = false;
    });
    this.activeAnimations.clear();

    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Destroy engine
   */
  public destroy(): void {
    this.stopAll();
    this.sequences.clear();
    this.listeners.clear();
  }
}

export default AdvancedAnimationEngine;
