/**
 * Bleeps Provider
 * React context provider for bleep manager
 */

import React from 'react';
import { BleepManager, BleepManagerConfig } from './types';
import { createBleepManager } from './BleepManager';

/**
 * Bleeps context value
 */
interface BleepsContextValue {
  bleepManager: BleepManager;
}

const BleepsContext = React.createContext<BleepsContextValue | null>(null);

/**
 * Hook to access bleep manager
 */
export function useBleeps(): BleepManager {
  const context = React.useContext(BleepsContext);
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
  children: React.ReactNode;
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
  const bleepManager = React.useMemo(() => createBleepManager(config), [config]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      bleepManager.stopAll();
      bleepManager.unloadAll();
    };
  }, [bleepManager]);

  const value = React.useMemo(
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

  return React.useMemo(
    () => ({
      play: () => bleepManager.play(id),
      pause: () => bleepManager.pause(id),
      stop: () => bleepManager.stop(id),
      bleep: bleepManager.getBleep(id),
    }),
    [bleepManager, id]
  );
}

