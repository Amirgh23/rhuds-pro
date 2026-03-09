/**
 * React hook for using the ThemeManager
 *
 * Provides runtime theme switching, persistence, and system preference support.
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { RHUDSTheme } from './models';
import { ThemeManager, getSystemThemePreference, watchSystemThemePreference } from './ThemeManager';

/**
 * Hook for managing themes with runtime switching and persistence
 *
 * @param themeManager - ThemeManager instance
 * @param options - Configuration options
 * @returns Theme management utilities
 *
 * @example
 * ```typescript
 * const { currentTheme, switchTheme, availableThemes } = useThemeManager(manager);
 *
 * // Switch theme
 * await switchTheme('dark');
 *
 * // Or switch by theme object
 * await switchTheme(customTheme);
 * ```
 */
export function useThemeManager(
  themeManager: ThemeManager,
  options?: {
    respectSystemPreference?: boolean;
    autoLoad?: boolean;
  }
) {
  const [currentTheme, setCurrentTheme] = useState<RHUDSTheme>(themeManager.getCurrentTheme());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load theme from storage on mount
  useEffect(() => {
    if (options?.autoLoad !== false) {
      setIsLoading(true);
      themeManager
        .loadFromStorage()
        .then((theme) => {
          if (theme) {
            setCurrentTheme(theme);
          }
        })
        .catch((err) => {
          console.error('Failed to load theme from storage:', err);
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [themeManager, options?.autoLoad]);

  // Subscribe to theme changes
  useEffect(() => {
    const unsubscribe = themeManager.subscribe((theme) => {
      setCurrentTheme(theme);
    });

    return unsubscribe;
  }, [themeManager]);

  // Watch system theme preference
  useEffect(() => {
    if (options?.respectSystemPreference) {
      const unwatch = watchSystemThemePreference((preference) => {
        // Try to find a matching theme
        const themeNames = themeManager.getThemeNames();
        const matchingTheme = themeNames.find((name) => name.toLowerCase().includes(preference));

        if (matchingTheme) {
          themeManager.switchTheme(matchingTheme).catch((err) => {
            console.error('Failed to switch to system preference theme:', err);
          });
        }
      });

      return unwatch;
    }
  }, [themeManager, options?.respectSystemPreference]);

  /**
   * Switch to a different theme
   */
  const switchTheme = useCallback(
    async (theme: RHUDSTheme | string) => {
      setIsLoading(true);
      setError(null);

      try {
        await themeManager.switchTheme(theme);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [themeManager]
  );

  /**
   * Register a new theme
   */
  const registerTheme = useCallback(
    (theme: RHUDSTheme) => {
      themeManager.registerTheme(theme);
    },
    [themeManager]
  );

  /**
   * Clear theme from storage
   */
  const clearStorage = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await themeManager.clearStorage();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [themeManager]);

  /**
   * Get system theme preference
   */
  const systemPreference = getSystemThemePreference();

  return {
    currentTheme,
    switchTheme,
    registerTheme,
    clearStorage,
    availableThemes: themeManager.getThemeNames(),
    isLoading,
    error,
    systemPreference,
  };
}
