/**
 * Bleeps Provider - React Integration for Audio System
 */

import React from 'react';
import { BleepManager } from './BleepManager';
import type { BleepConfig, BleepPlayOptions, BleepManagerConfig } from './types';

interface BleepsContextValue {
  manager: BleepManager;
  createBleep: (config: BleepConfig) => void;
  playBleep: (id: string, options?: BleepPlayOptions) => void;
  stopBleep: (id: string) => void;
  pauseBleep: (id: string) => void;
  resumeBleep: (id: string) => void;
  setBleepVolume: (id: string, volume: number) => void;
  setCategoryVolume: (category: string, volume: number) => void;
  setMasterVolume: (volume: number) => void;
}

const BleepsContext = React.createContext<BleepsContextValue | null>(null);

/**
 * Hook to access bleep manager
 */
export function useBleeps(): BleepsContextValue {
  const context = React.useContext(BleepsContext);
  if (!context) {
    throw new Error('useBleeps must be used within BleepsProvider');
  }
  return context;
}

export interface BleepsProviderProps {
  config?: BleepManagerConfig;
  children: React.ReactNode;
}

/**
 * Bleeps Provider Component
 *
 * Provides audio system to all child components.
 * Manages bleep creation, playback, and mixing.
 *
 * @example
 * ```tsx
 * <BleepsProvider config={{ masterVolume: 0.8 }}>
 *   <App />
 * </BleepsProvider>
 * ```
 */
export const BleepsProvider: React.FC<BleepsProviderProps> = ({ config, children }) => {
  const managerRef = React.useRef<BleepManager | null>(null);

  if (!managerRef.current) {
    managerRef.current = new BleepManager(config);
  }

  const manager = managerRef.current;

  const value: BleepsContextValue = React.useMemo(
    () => ({
      manager,
      createBleep: (config: BleepConfig) => manager.createBleep(config),
      playBleep: (id: string, options?: BleepPlayOptions) => manager.playBleep(id, options),
      stopBleep: (id: string) => manager.stopBleep(id),
      pauseBleep: (id: string) => manager.pauseBleep(id),
      resumeBleep: (id: string) => manager.resumeBleep(id),
      setBleepVolume: (id: string, volume: number) => manager.setBleepVolume(id, volume),
      setCategoryVolume: (category: string, volume: number) =>
        manager.setCategoryVolume(category, volume),
      setMasterVolume: (volume: number) => manager.setMasterVolume(volume),
    }),
    [manager]
  );

  React.useEffect(() => {
    return () => {
      manager.cleanup();
    };
  }, [manager]);

  return <BleepsContext.Provider value={value}>{children}</BleepsContext.Provider>;
};

BleepsProvider.displayName = 'BleepsProvider';

export default BleepsProvider;
