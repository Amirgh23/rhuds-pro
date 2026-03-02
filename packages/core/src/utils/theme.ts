import type { RHUDSTheme } from '../theme/models';

/**
 * Get system theme preference
 */
export function getSystemThemePreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

/**
 * Watch system theme preference changes
 */
export function watchSystemThemePreference(
  callback: (preference: 'light' | 'dark') => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }
}

/**
 * Extend existing theme
 */
export function extendTheme(baseTheme: RHUDSTheme, overrides: Partial<RHUDSTheme>): RHUDSTheme {
  return {
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...(overrides.colors || {}),
    },
    typography: {
      ...baseTheme.typography,
      ...(overrides.typography || {}),
    },
    breakpoints: {
      ...baseTheme.breakpoints,
      ...(overrides.breakpoints || {}),
    },
  };
}

/**
 * Compose multiple themes
 */
export function composeThemes(...themes: RHUDSTheme[]): RHUDSTheme {
  return themes.reduce((acc, theme) => extendTheme(acc, theme));
}
