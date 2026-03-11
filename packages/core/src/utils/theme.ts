import type { RHUDSTheme } from '../theme/models';

// Re-export from theme
export { getSystemThemePreference, watchSystemThemePreference } from '../theme/ThemeManager';

/**
 * Extend existing theme (simple version)
 */
export function extendThemeSimple(
  baseTheme: RHUDSTheme,
  overrides: Partial<RHUDSTheme>
): RHUDSTheme {
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
 * Compose multiple themes (simple version)
 */
export function composeThemesSimple(...themes: RHUDSTheme[]): RHUDSTheme {
  return themes.reduce((acc, theme) => extendThemeSimple(acc, theme));
}
