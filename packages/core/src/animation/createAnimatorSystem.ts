/**
 * Animator System Initialization
 * Creates and configures the animation engine
 */

import { AnimatorSystemConfig } from './types';

/**
 * Global animator system state
 */
interface AnimatorSystemState {
  config: Required<AnimatorSystemConfig>;
  isInitialized: boolean;
}

/**
 * Default animator system configuration
 */
const defaultConfig: Required<AnimatorSystemConfig> = {
  defaultDuration: {
    enter: 300,
    exit: 200,
    stagger: 50,
    delay: 0,
  },
  defaultEasing: {
    enter: 'easeInOut',
    exit: 'easeInOut',
  },
  disabled: false,
};

/**
 * Global animator system state
 */
let systemState: AnimatorSystemState = {
  config: { ...defaultConfig },
  isInitialized: false,
};

/**
 * Create and initialize the animator system
 * 
 * This function initializes the global animation engine with
 * default configurations that can be overridden per-component.
 * 
 * @param config - Optional configuration for the animator system
 * @returns The animator system configuration
 * 
 * @example
 * ```tsx
 * const animatorSystem = createAnimatorSystem({
 *   defaultDuration: {
 *     enter: 400,
 *     exit: 300,
 *   },
 *   defaultEasing: {
 *     enter: 'easeOutCubic',
 *     exit: 'easeInCubic',
 *   },
 * });
 * ```
 */
export function createAnimatorSystem(
  config?: AnimatorSystemConfig
): Required<AnimatorSystemConfig> {
  // Merge with default config
  systemState.config = {
    defaultDuration: {
      ...defaultConfig.defaultDuration,
      ...config?.defaultDuration,
    },
    defaultEasing: {
      ...defaultConfig.defaultEasing,
      ...config?.defaultEasing,
    },
    disabled: config?.disabled ?? defaultConfig.disabled,
  };

  systemState.isInitialized = true;

  return systemState.config;
}

/**
 * Get the current animator system configuration
 * 
 * @returns The current animator system configuration
 */
export function getAnimatorSystemConfig(): Required<AnimatorSystemConfig> {
  if (!systemState.isInitialized) {
    // Auto-initialize with defaults if not already initialized
    createAnimatorSystem();
  }
  return systemState.config;
}

/**
 * Check if the animator system is initialized
 * 
 * @returns True if the system is initialized
 */
export function isAnimatorSystemInitialized(): boolean {
  return systemState.isInitialized;
}

/**
 * Reset the animator system to default configuration
 */
export function resetAnimatorSystem(): void {
  systemState = {
    config: { ...defaultConfig },
    isInitialized: false,
  };
}

/**
 * Update animator system configuration
 * 
 * @param config - Partial configuration to merge with current config
 */
export function updateAnimatorSystemConfig(
  config: Partial<AnimatorSystemConfig>
): void {
  systemState.config = {
    defaultDuration: {
      ...systemState.config.defaultDuration,
      ...config.defaultDuration,
    },
    defaultEasing: {
      ...systemState.config.defaultEasing,
      ...config.defaultEasing,
    },
    disabled: config.disabled ?? systemState.config.disabled,
  };
}
