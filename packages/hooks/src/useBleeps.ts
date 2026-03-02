import { useContext } from 'react';

// This will be properly imported from @rhuds/core
export interface PlayOptions {
  volume?: number;
  loop?: boolean;
  rate?: number;
}

export interface UseBleepsReturn {
  play: (soundKey: string, options?: PlayOptions) => void;
  stop: (soundKey?: string) => void;
  pause: (soundKey?: string) => void;
  resume: (soundKey?: string) => void;
  setVolume: (volume: number, category?: string) => void;
  getVolume: (category?: string) => number;
  preload: (soundKey: string) => Promise<void>;
}

export function useBleeps(): UseBleepsReturn {
  // This will use BleepsContext from @rhuds/core
  throw new Error('useBleeps must be used within <BleepsProvider>');
}
