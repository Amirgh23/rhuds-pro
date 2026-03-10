/**
 * Bleeps Provider
 * React context provider for bleep manager
 */

import React, { createContext, useContext, useMemo, type ReactNode, useEffect } from 'react';
import { BleepManager, BleepManagerConfig } from './types';
import { createBleepManager } from './BleepManager';

/**
 * Bleeps context value
 */
interface BleepsContextValue {
  bleepManager: BleepManager;
}

const BleepsContext = createContext<BleepsContextValue | null>(null);

/**
 * Hook to access bleep manager
 */
export function useBleeps(): BleepManager {
  const context = useContext(BleepsContext);
  if (!context) {
    throw new Error('useBleeps must be used within BleepsProvider');
  }
  return context.bleepManager;
}

/**
 * Bleeps provider props
 */
export interface BleepsProviderProps {
  config?: BleepManagerConfig;
  children: ReactNode;
}

/**
 * Bleeps Provider
 *
 * Provides bleep manager to all child components.
 *
 * @example
 * ```tsx
 * <BleepsProvider
 *   config={{
 *     masterVolume: 0.8,
 *     categories: {
 *       ui: { name: 'ui', volume: 1, muted: false },
 *       music: { name: 'music', volume: 0.6, muted: false },
 *     },
 *   }}
 * >
 *   <App />
 * </BleepsProvider>
 * ```
 */
export const BleepsProvider: React.FC<BleepsProviderProps> = ({ config, children }) => {
  const bleepManager = useMemo(() => createBleepManager(config), [config]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      bleepManager.stopAll();
      bleepManager.unloadAll();
    };
  }, [bleepManager]);

  const value = useMemo(
    () => ({
      bleepManager,
    }),
    [bleepManager]
  );

  return <BleepsContext.Provider value={value}>{children}</BleepsContext.Provider>;
};

BleepsProvider.displayName = 'BleepsProvider';

/**
 * Hook to play a bleep
 */
export function useBleep(id: string) {
  const bleepManager = useBleeps();

  return useMemo(
    () => ({
      play: () => bleepManager.play(id),
      pause: () => bleepManager.pause(id),
      stop: () => bleepManager.stop(id),
      bleep: bleepManager.getBleep(id),
    }),
    [bleepManager, id]
  );
}
