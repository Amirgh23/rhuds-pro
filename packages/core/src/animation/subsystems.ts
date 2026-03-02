/**
 * Animation Subsystems
 * Modular animation logic for complex scenarios
 */

import { AnimatorControl, AnimatorState } from './types';

/**
 * Animation subsystem interface
 */
export interface AnimationSubsystem {
  name: string;
  onEntering?: (control: AnimatorControl) => void;
  onEntered?: (control: AnimatorControl) => void;
  onExiting?: (control: AnimatorControl) => void;
  onExited?: (control: AnimatorControl) => void;
  cleanup?: () => void;
}

/**
 * Subsystem manager for coordinating multiple animation subsystems
 */
export class SubsystemManager {
  private subsystems: Map<string, AnimationSubsystem> = new Map();

  /**
   * Register a subsystem
   */
  register(subsystem: AnimationSubsystem): void {
    this.subsystems.set(subsystem.name, subsystem);
  }

  /**
   * Unregister a subsystem
   */
  unregister(name: string): void {
    const subsystem = this.subsystems.get(name);
    if (subsystem?.cleanup) {
      subsystem.cleanup();
    }
    this.subsystems.delete(name);
  }

  /**
   * Notify all subsystems of state change
   */
  notify(state: AnimatorState, control: AnimatorControl): void {
    this.subsystems.forEach((subsystem) => {
      switch (state) {
        case 'entering':
          subsystem.onEntering?.(control);
          break;
        case 'entered':
          subsystem.onEntered?.(control);
          break;
        case 'exiting':
          subsystem.onExiting?.(control);
          break;
        case 'exited':
          subsystem.onExited?.(control);
          break;
      }
    });
  }

  /**
   * Cleanup all subsystems
   */
  cleanup(): void {
    this.subsystems.forEach((subsystem) => {
      subsystem.cleanup?.();
    });
    this.subsystems.clear();
  }

  /**
   * Get all registered subsystems
   */
  getAll(): AnimationSubsystem[] {
    return Array.from(this.subsystems.values());
  }

  /**
   * Get a specific subsystem by name
   */
  get(name: string): AnimationSubsystem | undefined {
    return this.subsystems.get(name);
  }
}

/**
 * Create a fade subsystem
 */
export function createFadeSubsystem(element: HTMLElement): AnimationSubsystem {
  return {
    name: 'fade',
    onEntering: () => {
      element.style.opacity = '0';
    },
    onEntered: () => {
      element.style.opacity = '1';
    },
    onExiting: () => {
      element.style.opacity = '0';
    },
    onExited: () => {
      element.style.opacity = '0';
    },
  };
}

/**
 * Create a scale subsystem
 */
export function createScaleSubsystem(
  element: HTMLElement,
  from: number = 0.8,
  to: number = 1
): AnimationSubsystem {
  return {
    name: 'scale',
    onEntering: () => {
      element.style.transform = `scale(${from})`;
    },
    onEntered: () => {
      element.style.transform = `scale(${to})`;
    },
    onExiting: () => {
      element.style.transform = `scale(${from})`;
    },
    onExited: () => {
      element.style.transform = `scale(${from})`;
    },
  };
}

/**
 * Create a slide subsystem
 */
export function createSlideSubsystem(
  element: HTMLElement,
  direction: 'left' | 'right' | 'up' | 'down' = 'up',
  distance: number = 20
): AnimationSubsystem {
  const getTransform = (entering: boolean) => {
    const sign = entering ? 1 : 0;
    switch (direction) {
      case 'left':
        return `translateX(${sign * distance}px)`;
      case 'right':
        return `translateX(${-sign * distance}px)`;
      case 'up':
        return `translateY(${sign * distance}px)`;
      case 'down':
        return `translateY(${-sign * distance}px)`;
    }
  };

  return {
    name: 'slide',
    onEntering: () => {
      element.style.transform = getTransform(true);
    },
    onEntered: () => {
      element.style.transform = getTransform(false);
    },
    onExiting: () => {
      element.style.transform = getTransform(true);
    },
    onExited: () => {
      element.style.transform = getTransform(true);
    },
  };
}

/**
 * Create a rotate subsystem
 */
export function createRotateSubsystem(
  element: HTMLElement,
  from: number = -180,
  to: number = 0
): AnimationSubsystem {
  return {
    name: 'rotate',
    onEntering: () => {
      element.style.transform = `rotate(${from}deg)`;
    },
    onEntered: () => {
      element.style.transform = `rotate(${to}deg)`;
    },
    onExiting: () => {
      element.style.transform = `rotate(${from}deg)`;
    },
    onExited: () => {
      element.style.transform = `rotate(${from}deg)`;
    },
  };
}

/**
 * Create a blur subsystem
 */
export function createBlurSubsystem(
  element: HTMLElement,
  amount: number = 10
): AnimationSubsystem {
  return {
    name: 'blur',
    onEntering: () => {
      element.style.filter = `blur(${amount}px)`;
    },
    onEntered: () => {
      element.style.filter = 'blur(0px)';
    },
    onExiting: () => {
      element.style.filter = `blur(${amount}px)`;
    },
    onExited: () => {
      element.style.filter = `blur(${amount}px)`;
    },
  };
}
