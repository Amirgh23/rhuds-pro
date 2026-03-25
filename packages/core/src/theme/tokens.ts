/**
 * Design Token System for Cold War Redesign
 * Centralized token management and export
 */

import { COLD_WAR_PALETTE, THEME_VARIANTS } from './colors';
import { SPACING_SCALE, BORDER_SPECS, SHADOW_SPECS, CHAMFER_SIZES } from './geometry';

/**
 * Design Tokens Interface
 */
export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    accent: string;
    text: string;
    textSecondary: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: Record<string, string>;
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    letterSpacing: Record<string, string>;
    lineHeight: Record<string, number>;
  };
  borders: Record<string, { width: string; color: string }>;
  shadows: Record<string, string>;
  chamfer: Record<string, number>;
  animations: {
    timing: Record<string, string>;
    easing: Record<string, string>;
  };
}

/**
 * Typography specifications
 */
export const TYPOGRAPHY_TOKENS = {
  fontFamily: "'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace",
  fontSize: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  letterSpacing: {
    headers: '0.05em',
    body: '0.02em',
    buttons: '0.03em',
    labels: '0.04em',
    monospace: '0.01em',
  },
  lineHeight: {
    xs: 1.4,
    sm: 1.33,
    base: 1.43,
    lg: 1.5,
    xl: 1.4,
    '2xl': 1.33,
  },
};

/**
 * Animation timing specifications
 */
export const ANIMATION_TOKENS = {
  timing: {
    hover: '150ms',
    click: '200ms',
    load: '300ms',
    transition: '250ms',
    glitch: '100ms',
    flicker: '150ms',
  },
  easing: {
    tactical: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    snappy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    glitch: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    linear: 'linear',
  },
};

/**
 * Create design tokens for a theme variant
 * @param variant - Theme variant name
 * @returns Complete design tokens object
 */
export function createDesignTokens(variant: keyof typeof THEME_VARIANTS): DesignTokens {
  const themeColors = THEME_VARIANTS[variant];

  return {
    colors: {
      primary: themeColors.primary,
      secondary: themeColors.secondary,
      background: themeColors.background,
      surface: themeColors.surface,
      accent: themeColors.accent,
      text: themeColors.text,
      textSecondary: themeColors.textSecondary,
      error: themeColors.error,
      success: themeColors.success,
      warning: themeColors.warning,
    },
    spacing: SPACING_SCALE,
    typography: TYPOGRAPHY_TOKENS,
    borders: BORDER_SPECS,
    shadows: SHADOW_SPECS,
    chamfer: CHAMFER_SIZES,
    animations: ANIMATION_TOKENS,
  };
}

/**
 * Export tokens to JSON
 * @param tokens - Design tokens object
 * @returns JSON string
 */
export function exportTokensToJSON(tokens: DesignTokens): string {
  return JSON.stringify(tokens, null, 2);
}

/**
 * Import tokens from JSON
 * @param json - JSON string
 * @returns Design tokens object
 */
export function importTokensFromJSON(json: string): DesignTokens {
  try {
    return JSON.parse(json) as DesignTokens;
  } catch (error) {
    console.error('Failed to parse tokens JSON:', error);
    throw new Error('Invalid tokens JSON format');
  }
}

/**
 * Validate design tokens
 * @param tokens - Design tokens object
 * @returns Validation result
 */
export function validateDesignTokens(tokens: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required color tokens
  const requiredColors = [
    'primary',
    'secondary',
    'background',
    'surface',
    'accent',
    'text',
    'error',
    'success',
    'warning',
  ];
  if (!tokens.colors) {
    errors.push('Missing colors object');
  } else {
    requiredColors.forEach((color) => {
      if (!tokens.colors[color]) {
        errors.push(`Missing color token: ${color}`);
      }
    });
  }

  // Check required spacing tokens
  if (!tokens.spacing) {
    errors.push('Missing spacing object');
  }

  // Check required typography tokens
  if (!tokens.typography) {
    errors.push('Missing typography object');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get all available theme variants
 * @returns Array of theme variant names
 */
export function getAvailableThemes(): string[] {
  return Object.keys(THEME_VARIANTS);
}

/**
 * Create CSS custom properties from tokens
 * @param tokens - Design tokens object
 * @param prefix - CSS variable prefix
 * @returns CSS string
 */
export function createCSSVariables(tokens: DesignTokens, prefix = 'rhuds'): string {
  const vars: string[] = [':root {'];

  // Colors
  Object.entries(tokens.colors).forEach(([key, value]) => {
    vars.push(`  --${prefix}-color-${key}: ${value};`);
  });

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    vars.push(`  --${prefix}-spacing-${key}: ${value};`);
  });

  // Typography
  vars.push(`  --${prefix}-font-family: ${tokens.typography.fontFamily};`);
  Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
    vars.push(`  --${prefix}-font-size-${key}: ${value};`);
  });
  Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
    vars.push(`  --${prefix}-font-weight-${key}: ${value};`);
  });
  Object.entries(tokens.typography.letterSpacing).forEach(([key, value]) => {
    vars.push(`  --${prefix}-letter-spacing-${key}: ${value};`);
  });

  // Shadows
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    vars.push(`  --${prefix}-shadow-${key}: ${value};`);
  });

  // Animations
  Object.entries(tokens.animations.timing).forEach(([key, value]) => {
    vars.push(`  --${prefix}-animation-${key}: ${value};`);
  });
  Object.entries(tokens.animations.easing).forEach(([key, value]) => {
    vars.push(`  --${prefix}-easing-${key}: ${value};`);
  });

  vars.push('}');
  return vars.join('\n');
}

/**
 * Get token value by path
 * @param tokens - Design tokens object
 * @param path - Token path (e.g., "colors.primary")
 * @returns Token value
 */
export function getTokenByPath(tokens: DesignTokens, path: string): any {
  return path.split('.').reduce((obj, key) => obj?.[key], tokens);
}

/**
 * Create theme-specific CSS
 * @param variant - Theme variant name
 * @param prefix - CSS variable prefix
 * @returns CSS string
 */
export function createThemeCSS(variant: keyof typeof THEME_VARIANTS, prefix = 'rhuds'): string {
  const tokens = createDesignTokens(variant);
  const cssVars = createCSSVariables(tokens, prefix);
  return cssVars;
}
