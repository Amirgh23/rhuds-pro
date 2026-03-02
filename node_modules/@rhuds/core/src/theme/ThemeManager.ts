/**
 * RHUDS Pro Theme Manager
 * 
 * Manages runtime theme switching, persistence, inheritance, and composition.
 * 
 * Requirements: 1.8-1.10, 51.1-51.7
 */

import type { RHUDSTheme, DeepPartial } from './models';

const STORAGE_KEY = 'rhuds-pro-theme';
const STORAGE_TIMEOUT = 100; // ms - Requirement 51.5

/**
 * Theme storage interface for persistence
 */
export interface ThemeStorage {
  save(theme: RHUDSTheme): Promise<void>;
  load(): Promise<RHUDSTheme | null>;
  clear(): Promise<void>;
}

/**
 * LocalStorage implementation of ThemeStorage
 */
export class LocalStorageThemeStorage implements ThemeStorage {
  private storageKey: string;

  constructor(storageKey: string = STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  async save(theme: RHUDSTheme): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Serialize theme (remove functions like alpha)
      const serializable = this.serializeTheme(theme);
      const json = JSON.stringify(serializable);
      
      localStorage.setItem(this.storageKey, json);
      
      const elapsed = Date.now() - startTime;
      if (elapsed > STORAGE_TIMEOUT) {
        console.warn(`Theme save took ${elapsed}ms, exceeding ${STORAGE_TIMEOUT}ms target`);
      }
    } catch (error) {
      // Handle quota exceeded errors gracefully (Requirement 51.6)
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Unable to save theme.');
        // Try to clear old data and retry
        try {
          localStorage.removeItem(this.storageKey);
          const serializable = this.serializeTheme(theme);
          localStorage.setItem(this.storageKey, JSON.stringify(serializable));
        } catch (retryError) {
          console.error('Failed to save theme after clearing storage:', retryError);
        }
      } else {
        console.error('Failed to save theme:', error);
      }
    }
  }

  async load(): Promise<RHUDSTheme | null> {
    try {
      const json = localStorage.getItem(this.storageKey);
      if (!json) {
        return null;
      }
      
      const serialized = JSON.parse(json);
      return this.deserializeTheme(serialized);
    } catch (error) {
      console.error('Failed to load theme:', error);
      return null;
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear theme:', error);
    }
  }

  /**
   * Serialize theme by removing functions
   */
  private serializeTheme(theme: RHUDSTheme): any {
    const serialized: any = {
      name: theme.name,
      version: theme.version,
      colors: {},
      units: theme.units,
      typography: theme.typography,
      breakpoints: theme.breakpoints,
      animation: theme.animation,
      zIndex: theme.zIndex,
    };

    // Serialize color palettes (remove alpha function)
    for (const [key, palette] of Object.entries(theme.colors)) {
      if (key === 'custom' && palette) {
        serialized.colors.custom = {};
        for (const [customKey, customPalette] of Object.entries(palette as Record<string, any>)) {
          serialized.colors.custom[customKey] = {
            main: customPalette.main,
            light: customPalette.light,
            dark: customPalette.dark,
            contrast: customPalette.contrast,
            gradient: customPalette.gradient,
          };
        }
      } else {
        const paletteData = palette as any;
        serialized.colors[key] = {
          main: paletteData.main,
          light: paletteData.light,
          dark: paletteData.dark,
          contrast: paletteData.contrast,
          gradient: paletteData.gradient,
        };
      }
    }

    return serialized;
  }

  /**
   * Deserialize theme by restoring functions
   */
  private deserializeTheme(serialized: any): RHUDSTheme {
    const theme: RHUDSTheme = {
      name: serialized.name,
      version: serialized.version,
      colors: {} as any,
      units: serialized.units,
      typography: serialized.typography,
      breakpoints: serialized.breakpoints,
      animation: serialized.animation,
      zIndex: serialized.zIndex,
    };

    // Restore color palettes with alpha function
    for (const [key, palette] of Object.entries(serialized.colors)) {
      if (key === 'custom' && palette) {
        theme.colors.custom = {};
        for (const [customKey, customPalette] of Object.entries(palette as any)) {
          theme.colors.custom[customKey] = {
            ...(customPalette as any),
            alpha: this.createAlphaFunction((customPalette as any).main),
          };
        }
      } else {
        (theme.colors as any)[key] = {
          ...(palette as any),
          alpha: this.createAlphaFunction((palette as any).main),
        };
      }
    }

    return theme;
  }

  /**
   * Create alpha function for a color
   */
  private createAlphaFunction(baseColor: string): (opacity: number) => string {
    return (opacity: number) => {
      // Parse hex color
      const hex = baseColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
  }
}

/**
 * Theme Manager for runtime theme switching and management
 */
export class ThemeManager {
  private currentTheme: RHUDSTheme;
  private storage: ThemeStorage;
  private listeners: Set<(theme: RHUDSTheme) => void> = new Set();
  private themeRegistry: Map<string, RHUDSTheme> = new Map();

  constructor(initialTheme: RHUDSTheme, storage?: ThemeStorage) {
    this.currentTheme = initialTheme;
    this.storage = storage || new LocalStorageThemeStorage();
    
    // Register initial theme
    if (initialTheme.name) {
      this.themeRegistry.set(initialTheme.name, initialTheme);
    }
  }

  /**
   * Get the current theme
   */
  getCurrentTheme(): RHUDSTheme {
    return this.currentTheme;
  }

  /**
   * Switch to a different theme at runtime (Requirement 1.8)
   * 
   * @param theme - Theme to switch to (can be theme object or theme name)
   */
  async switchTheme(theme: RHUDSTheme | string): Promise<void> {
    let newTheme: RHUDSTheme;

    if (typeof theme === 'string') {
      // Look up theme by name
      const registeredTheme = this.themeRegistry.get(theme);
      if (!registeredTheme) {
        throw new Error(`Theme "${theme}" not found in registry`);
      }
      newTheme = registeredTheme;
    } else {
      newTheme = theme;
    }

    // Update current theme
    this.currentTheme = newTheme;

    // Persist to storage
    await this.storage.save(newTheme);

    // Notify listeners
    this.notifyListeners(newTheme);
  }

  /**
   * Register a theme in the theme registry
   */
  registerTheme(theme: RHUDSTheme): void {
    if (!theme.name) {
      throw new Error('Theme must have a name to be registered');
    }
    this.themeRegistry.set(theme.name, theme);
  }

  /**
   * Get a registered theme by name
   */
  getTheme(name: string): RHUDSTheme | undefined {
    return this.themeRegistry.get(name);
  }

  /**
   * Get all registered theme names
   */
  getThemeNames(): string[] {
    return Array.from(this.themeRegistry.keys());
  }

  /**
   * Load theme from storage (Requirement 51.2)
   */
  async loadFromStorage(): Promise<RHUDSTheme | null> {
    const theme = await this.storage.load();
    if (theme) {
      this.currentTheme = theme;
      this.notifyListeners(theme);
    }
    return theme;
  }

  /**
   * Clear theme from storage
   */
  async clearStorage(): Promise<void> {
    await this.storage.clear();
  }

  /**
   * Subscribe to theme changes
   */
  subscribe(listener: (theme: RHUDSTheme) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of theme change
   */
  private notifyListeners(theme: RHUDSTheme): void {
    this.listeners.forEach(listener => {
      try {
        listener(theme);
      } catch (error) {
        console.error('Error in theme change listener:', error);
      }
    });
  }
}

/**
 * Extend a base theme with overrides (Requirement 1.9)
 * 
 * @param baseTheme - Base theme to extend
 * @param overrides - Partial theme overrides
 * @returns New theme with overrides applied
 * 
 * @example
 * ```typescript
 * const darkTheme = extendTheme(baseTheme, {
 *   colors: {
 *     background: createThemeColor('#0a0a0a')
 *   }
 * });
 * ```
 */
export function extendTheme(
  baseTheme: RHUDSTheme,
  overrides: DeepPartial<RHUDSTheme>
): RHUDSTheme {
  return deepMerge(baseTheme, overrides) as RHUDSTheme;
}

/**
 * Compose multiple theme fragments into a single theme (Requirement 1.10)
 * 
 * @param themes - Array of theme fragments to compose
 * @returns Composed theme
 * 
 * @example
 * ```typescript
 * const customTheme = composeThemes(
 *   baseTheme,
 *   { colors: customColors },
 *   { typography: customTypography }
 * );
 * ```
 */
export function composeThemes(...themes: Array<DeepPartial<RHUDSTheme>>): RHUDSTheme {
  if (themes.length === 0) {
    throw new Error('At least one theme is required for composition');
  }

  let result = themes[0];
  for (let i = 1; i < themes.length; i++) {
    result = deepMerge(result, themes[i]);
  }

  return result as RHUDSTheme;
}

/**
 * Deep merge utility for theme composition
 */
function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const result = { ...target } as any;

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        // Recursively merge objects
        result[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        // Override with source value
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

/**
 * Check if value is a plain object
 */
function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Sync theme across browser tabs (Requirement 51.3)
 */
export class ThemeSyncManager {
  private themeManager: ThemeManager;
  private storageKey: string;

  constructor(themeManager: ThemeManager, storageKey: string = STORAGE_KEY) {
    this.themeManager = themeManager;
    this.storageKey = storageKey;

    // Listen for storage events from other tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageEvent);
    }
  }

  private handleStorageEvent = async (event: StorageEvent) => {
    // Only handle events for our storage key
    if (event.key !== this.storageKey) {
      return;
    }

    // Load the updated theme
    const theme = await this.themeManager.loadFromStorage();
    if (theme) {
      console.log('Theme synced from another tab');
    }
  };

  /**
   * Clean up event listeners
   */
  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageEvent);
    }
  }
}

/**
 * Respect system theme preferences (Requirement 51.4)
 */
export function getSystemThemePreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

/**
 * Listen for system theme preference changes
 */
export function watchSystemThemePreference(
  callback: (preference: 'light' | 'dark') => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (event: MediaQueryListEvent) => {
    callback(event.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handler);

  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}
