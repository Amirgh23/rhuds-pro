/**
 * Theme Helper Utilities
 * Safe access to theme tokens with fallbacks
 */

export interface ThemeTokens {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
    background?: string;
    surface?: string;
    text?: string;
    border?: string;
  };
  spacing?: Record<string, string>;
  typography?: any;
  shadows?: any;
  transitions?: any;
  breakpoints?: any;
}

/**
 * Safely extract tokens from theme context
 */
export function getThemeTokens(theme: any): ThemeTokens {
  return (theme as any)?.currentMode?.tokens || theme || {};
}

/**
 * Get color with fallback
 */
export function getColor(theme: any, colorKey: keyof NonNullable<ThemeTokens['colors']>, fallback: string): string {
  const tokens = getThemeTokens(theme);
  return tokens.colors?.[colorKey] || fallback;
}

/**
 * Default color fallbacks
 */
export const DEFAULT_COLORS = {
  primary: '#00f6ff',
  secondary: '#7b61ff',
  accent: '#00f6ff',
  success: '#00ff00',
  warning: '#ffff00',
  error: '#ff0000',
  info: '#00f6ff',
  background: '#1a1a1a',
  surface: '#2a2a2a',
  text: '#ffffff',
  border: '#444444',
};
