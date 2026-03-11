/**
 * Animation Subsystems
 * Modular animation logic for complex scenarios
 */

import React from 'react';
import { AnimatorControl, AnimatorState } from './types';

/**
 * Animator state type for subsystems
 */
export type AnimatorStateType = 'entering' | 'entered' | 'exiting' | 'exited';

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
  notify(state: AnimatorStateType, control: AnimatorControl): void {
    this.subsystems.forEach((subsystem) => {
      if (state === 'entering') {
        subsystem.onEntering?.(control);
      } else if (state === 'entered') {
        subsystem.onEntered?.(control);
      } else if (state === 'exiting') {
        subsystem.onExiting?.(control);
      } else if (state === 'exited') {
        subsystem.onExited?.(control);
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
export function createBlurSubsystem(element: HTMLElement, amount: number = 10): AnimationSubsystem {
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


/**
 * Dynamic rendering subsystem
 * Conditionally renders components based on animation state
 */
export interface DynamicRenderingConfig {
  renderOnEntering?: boolean;
  renderOnEntered?: boolean;
  renderOnExiting?: boolean;
  renderOnExited?: boolean;
}

export function createDynamicRenderingSubsystem(
  config: DynamicRenderingConfig = {}
): AnimationSubsystem {
  const {
    renderOnEntering = true,
    renderOnEntered = true,
    renderOnExiting = false,
    renderOnExited = false,
  } = config;

  return {
    name: 'dynamicRendering',
    onEntering: (control) => {
      if (!renderOnEntering) {
        // Component should not render during entering
      }
    },
    onEntered: (control) => {
      if (!renderOnEntered) {
        // Component should not render when entered
      }
    },
    onExiting: (control) => {
      if (!renderOnExiting) {
        // Component should not render during exiting
      }
    },
    onExited: (control) => {
      if (!renderOnExited) {
        // Component should not render when exited
      }
    },
  };
}

/**
 * External animation management subsystem
 * Integrates with third-party animation libraries
 */
export interface ExternalAnimationConfig {
  library: 'framer-motion' | 'react-spring' | 'react-transition-group' | 'custom';
  onStateChange?: (state: AnimatorStateType) => void;
  cleanup?: () => void;
}

export function createExternalManagementSubsystem(
  config: ExternalAnimationConfig
): AnimationSubsystem {
  return {
    name: 'externalManagement',
    onEntering: () => {
      config.onStateChange?.('entering');
    },
    onEntered: () => {
      config.onStateChange?.('entered');
    },
    onExiting: () => {
      config.onStateChange?.('exiting');
    },
    onExited: () => {
      config.onStateChange?.('exited');
    },
    cleanup: () => {
      config.cleanup?.();
    },
  };
}

/**
 * Animation subsystem provider context
 */
export interface AnimationSubsystemProviderValue {
  registerSubsystem: (subsystem: AnimationSubsystem) => void;
  unregisterSubsystem: (name: string) => void;
  getSubsystem: (name: string) => AnimationSubsystem | undefined;
  getAllSubsystems: () => AnimationSubsystem[];
}

const AnimationSubsystemContext = React.createContext<
  AnimationSubsystemProviderValue | undefined
>(undefined);

/**
 * Hook to access animation subsystem provider
 */
export function useAnimationSubsystems(): AnimationSubsystemProviderValue {
  const context = React.useContext(AnimationSubsystemContext);
  if (!context) {
    throw new Error('useAnimationSubsystems must be used within AnimationSubsystemProvider');
  }
  return context;
}

/**
 * Animation subsystem provider component
 */
export interface AnimationSubsystemProviderProps {
  children: React.ReactNode;
}

export const AnimationSubsystemProvider: React.FC<AnimationSubsystemProviderProps> = ({
  children,
}) => {
  const manager = React.useMemo(() => new SubsystemManager(), []);

  const value: AnimationSubsystemProviderValue = {
    registerSubsystem: (subsystem) => manager.register(subsystem),
    unregisterSubsystem: (name) => manager.unregister(name),
    getSubsystem: (name) => manager.get(name),
    getAllSubsystems: () => manager.getAll(),
  };

  return (
    <AnimationSubsystemContext.Provider value={value}>
      {children}
    </AnimationSubsystemContext.Provider>
  );
};

/**
 * Global animator configuration
 */
export interface AnimatorGeneralConfig {
  defaultDuration?: {
    enter?: number;
    exit?: number;
    stagger?: number;
  };
  defaultEasing?: string;
  enableSubsystems?: boolean;
  enableGestures?: boolean;
  enableScrollAnimations?: boolean;
}

/**
 * Animator general provider context
 */
export interface AnimatorGeneralProviderValue {
  config: AnimatorGeneralConfig;
  updateConfig: (config: Partial<AnimatorGeneralConfig>) => void;
}

const AnimatorGeneralContext = React.createContext<
  AnimatorGeneralProviderValue | undefined
>(undefined);

/**
 * Hook to access animator general provider
 */
export function useAnimatorGeneral(): AnimatorGeneralProviderValue {
  const context = React.useContext(AnimatorGeneralContext);
  if (!context) {
    throw new Error('useAnimatorGeneral must be used within AnimatorGeneralProvider');
  }
  return context;
}

/**
 * Animator general provider component
 */
export interface AnimatorGeneralProviderProps {
  children: React.ReactNode;
  config?: AnimatorGeneralConfig;
}

export const AnimatorGeneralProvider: React.FC<AnimatorGeneralProviderProps> = ({
  children,
  config: initialConfig = {},
}) => {
  const [config, setConfig] = React.useState<AnimatorGeneralConfig>(initialConfig);

  const value: AnimatorGeneralProviderValue = {
    config,
    updateConfig: (newConfig) => {
      setConfig((prev: AnimatorGeneralConfig) => ({ ...prev, ...newConfig }));
    },
  };

  return (
    <AnimatorGeneralContext.Provider value={value}>
      {children}
    </AnimatorGeneralContext.Provider>
  );
};
