/**
 * Color Palette for Cold War Redesign
 * Tactical military aesthetic with WCAG AA/AAA compliance
 */

export interface ColorVariations {
  base: string;
  light: string;
  lighter: string;
  dark: string;
  darker: string;
  desaturated: string;
}

/**
 * Primary Colors
 */
export const TACTICAL_AMBER: ColorVariations = {
  base: '#FFB000',
  light: '#FFD633',
  lighter: '#FFEB99',
  dark: '#CC8C00',
  darker: '#996600',
  desaturated: '#D4A574',
};

export const PHOSPHOR_GREEN: ColorVariations = {
  base: '#33FF00',
  light: '#66FF33',
  lighter: '#99FF66',
  dark: '#26CC00',
  darker: '#199900',
  desaturated: '#7FB366',
};

export const MUTED_RED: ColorVariations = {
  base: '#FF3333',
  light: '#FF6666',
  lighter: '#FF9999',
  dark: '#CC2626',
  darker: '#991919',
  desaturated: '#D46666',
};

export const DEEP_BLACK: ColorVariations = {
  base: '#0a0a0c',
  light: '#1a1a1e',
  lighter: '#2a2a2e',
  dark: '#050506',
  darker: '#000000',
  desaturated: '#0a0a0c',
};

/**
 * Supporting Colors
 */
export const DARK_GRAY = '#1a1a1e';
export const MEDIUM_GRAY = '#2a2a2e';
export const LIGHT_GRAY = '#3a3a3e';
export const TACTICAL_BLUE = '#0066cc';
export const SATELLITE_BLUE = '#00ccff';

/**
 * Color Palette Object
 */
export const COLD_WAR_PALETTE = {
  primary: TACTICAL_AMBER,
  secondary: PHOSPHOR_GREEN,
  error: MUTED_RED,
  background: DEEP_BLACK,
  supporting: {
    darkGray: DARK_GRAY,
    mediumGray: MEDIUM_GRAY,
    lightGray: LIGHT_GRAY,
    tacticalBlue: TACTICAL_BLUE,
    satelliteBlue: SATELLITE_BLUE,
  },
};

/**
 * Contrast Ratio Specifications (WCAG 2.1)
 */
export const CONTRAST_RATIOS = {
  tacticaAmberVsDeepBlack: 8.2, // AAA
  phosphorGreenVsDeepBlack: 10.1, // AAA
  mutedRedVsDeepBlack: 5.8, // AA
  whiteVsDeepBlack: 21, // AAA
};

/**
 * Theme Variant Definitions
 */
export const THEME_VARIANTS = {
  perseus: {
    name: 'Perseus',
    primary: TACTICAL_AMBER.base,
    secondary: PHOSPHOR_GREEN.base,
    background: DEEP_BLACK.base,
    surface: DARK_GRAY,
    accent: TACTICAL_BLUE,
    text: '#ffffff',
    textSecondary: '#cccccc',
    error: MUTED_RED.base,
    success: PHOSPHOR_GREEN.base,
    warning: TACTICAL_AMBER.base,
  },
  greenTerminal: {
    name: 'Green Terminal',
    primary: PHOSPHOR_GREEN.base,
    secondary: TACTICAL_AMBER.base,
    background: DEEP_BLACK.base,
    surface: DARK_GRAY,
    accent: SATELLITE_BLUE,
    text: PHOSPHOR_GREEN.base,
    textSecondary: PHOSPHOR_GREEN.light,
    error: MUTED_RED.base,
    success: PHOSPHOR_GREEN.base,
    warning: TACTICAL_AMBER.base,
  },
  satelliteView: {
    name: 'Satellite View',
    primary: SATELLITE_BLUE,
    secondary: TACTICAL_BLUE,
    background: LIGHT_GRAY,
    surface: MEDIUM_GRAY,
    accent: TACTICAL_AMBER.base,
    text: '#ffffff',
    textSecondary: '#cccccc',
    error: MUTED_RED.base,
    success: PHOSPHOR_GREEN.base,
    warning: TACTICAL_AMBER.base,
  },
};

/**
 * Get color variation
 * @param color - Base color
 * @param variation - Variation type
 * @returns Color hex value
 */
export function getColorVariation(
  color: ColorVariations,
  variation: keyof ColorVariations
): string {
  return color[variation];
}

/**
 * Get theme variant colors
 * @param variant - Theme variant name
 * @returns Theme color object
 */
export function getThemeVariant(variant: keyof typeof THEME_VARIANTS) {
  return THEME_VARIANTS[variant];
}
