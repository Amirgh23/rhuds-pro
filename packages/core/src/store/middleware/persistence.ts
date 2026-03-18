/**
 * State Persistence Middleware
 * Automatically saves state to localStorage
 */

import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';

/**
 * Persistence configuration
 */
export interface PersistenceConfig {
  key?: string;
  whitelist?: string[];
  blacklist?: string[];
  throttle?: number;
}

/**
 * Create persistence middleware
 */
export function createPersistenceMiddleware(
  config: PersistenceConfig = {}
): Middleware<{}, RootState> {
  const { key = 'rhuds-state', whitelist = [], blacklist = [], throttle = 1000 } = config;

  let saveTimeout: ReturnType<typeof setTimeout> | null = null;

  return (store) => (next) => (action) => {
    const result = next(action);

    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Schedule save
    saveTimeout = setTimeout(() => {
      const state = store.getState();
      const stateToPersist: Partial<RootState> = {};

      // Filter state based on whitelist/blacklist
      Object.keys(state).forEach((sliceKey) => {
        const shouldPersist =
          (whitelist.length === 0 || whitelist.includes(sliceKey)) && !blacklist.includes(sliceKey);

        if (shouldPersist) {
          (stateToPersist as any)[sliceKey] = (state as any)[sliceKey];
        }
      });

      try {
        localStorage.setItem(key, JSON.stringify(stateToPersist));
      } catch (error) {
        console.error('Failed to persist state:', error);
      }
    }, throttle);

    return result;
  };
}

/**
 * Load persisted state from localStorage
 */
export function loadPersistedState(key: string = 'rhuds-state'): Partial<RootState> | undefined {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return undefined;
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to load persisted state:', error);
    return undefined;
  }
}
