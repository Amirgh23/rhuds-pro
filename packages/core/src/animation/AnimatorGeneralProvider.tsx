/**
 * Animator General Provider
 * Global animation configuration provider
 */

import React from 'react';
import { AnimatorSystemConfig } from './types';
import { createAnimatorSystem, getAnimatorSystemConfig } from './createAnimatorSystem';

/**
 * Animator general context value
 */
interface AnimatorGeneralContextValue {
  config: Required<AnimatorSystemConfig>;
  updateConfig: (config: Partial<AnimatorSystemConfig>) => void;
}

const AnimatorGeneralContext = React.createContext<AnimatorGeneralContextValue | null>(null);

/**
 * Hook to access animator general configuration
 */
export function useAnimatorGeneral(): AnimatorGeneralContextValue {
  const context = React.useContext(AnimatorGeneralContext);
  if (!context) {
    throw new Error('useAnimatorGeneral must be used within AnimatorGeneralProvider');
  }
  return context;
}

/**
 * Animator general provider props
 */
export interface AnimatorGeneralProviderProps {
  config?: AnimatorSystemConfig;
  children: React.ReactNode;
}

/**
 * Animator General Provider
 *
 * Provides global animation configuration to all child components.
 * This allows you to set default animation durations, easing functions,
 * and other settings that apply to all animators in the tree.
 *
 * @example
 * ```tsx
 * <AnimatorGeneralProvider
 *   config={{
 *     defaultDuration: {
 *       enter: 400,
 *       exit: 300,
 *     },
 *     defaultEasing: {
 *       enter: 'easeOutCubic',
 *       exit: 'easeInCubic',
 *     },
 *   }}
 * >
 *   <App />
 * </AnimatorGeneralProvider>
 * ```
 */
export const AnimatorGeneralProvider: React.FC<AnimatorGeneralProviderProps> = ({
  config: initialConfig,
  children,
}) => {
  // Initialize animator system with config
  const systemConfig = React.useMemo(() => {
    if (initialConfig) {
      return createAnimatorSystem(initialConfig);
    }
    return getAnimatorSystemConfig();
  }, [initialConfig]);

  const [config, setConfig] = React.useState(systemConfig);

  const updateConfig = React.useCallback((newConfig: Partial<AnimatorSystemConfig>) => {
    setConfig((prev: any) => {
      const duration = newConfig.defaultDuration;
      const easing = newConfig.defaultEasing;

      return {
        autoStart: newConfig.autoStart ?? prev.autoStart,
        defaultDuration:
          typeof duration === 'object'
            ? {
                ...(prev.defaultDuration || {}),
                ...duration,
              }
            : prev.defaultDuration,
        defaultEasing:
          typeof easing === 'object'
            ? {
                ...(prev.defaultEasing || {}),
                ...easing,
              }
            : prev.defaultEasing,
        disabled: newConfig.disabled ?? prev.disabled,
      };
    });
  }, []);

  const value = React.useMemo(
    () => ({
      config,
      updateConfig,
    }),
    [config, updateConfig]
  );

  return (
    <AnimatorGeneralContext.Provider value={value}>{children}</AnimatorGeneralContext.Provider>
  );
};

AnimatorGeneralProvider.displayName = 'AnimatorGeneralProvider';
