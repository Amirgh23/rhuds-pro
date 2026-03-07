/**
 * RHUDS Pro Theme Creation Functions
 * 
 * This module provides convenient API functions for creating and composing
 * themes in the RHUDS Pro design system. These functions work with the theme
 * data models defined in models.ts.
 * 
 * Requirements: 1.1-1.7
 */

import { validateTheme } from './validation';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  lighten,
  darken,
  createAlphaFunction,
} from './colorUtils';
import type {
  UnitScale,
  ColorPalette,
  TypographySystem,
  FontFamilySystem,
  FontSizeScale,
  FontWeightScale,
  LineHeightScale,
  LetterSpacingScale,
  BreakpointSystem,
  BreakpointValues,
  BreakpointLabels,
  RHUDSTheme,
  ColorSystem,
  UnitSystem,
  ShadowScale,
  AnimationDefaults,
  DurationScale,
  EasingFunctions,
  ZIndexSystem,
  GradientDefinition,
  RGB,
  HSL,
} from './models';

// ============================================================================
// Theme Creation Functions
// ============================================================================

/**
 * Create a unit scale for spacing or sizing
 * 
 * @param baseUnit - Base unit value (typically 4 or 8)
 * @param multipliers - Optional custom multipliers for each scale level
 * @returns UnitScale object with values from 0-10
 * 
 * @example
 * ```typescript
 * const spacing = createThemeUnit(4);
 * // Returns: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64, 9: 96, 10: 128 }
 * ```
 */
export function createThemeUnit(
  baseUnit: number = 4,
  multipliers?: Partial<Record<keyof UnitScale, number>>
): UnitScale {
  const defaultMultipliers = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 6,
    6: 8,
    7: 12,
    8: 16,
    9: 24,
    10: 32,
  };

  const finalMultipliers = { ...defaultMultipliers, ...multipliers };

  return {
    0: baseUnit * finalMultipliers[0],
    1: baseUnit * finalMultipliers[1],
    2: baseUnit * finalMultipliers[2],
    3: baseUnit * finalMultipliers[3],
    4: baseUnit * finalMultipliers[4],
    5: baseUnit * finalMultipliers[5],
    6: baseUnit * finalMultipliers[6],
    7: baseUnit * finalMultipliers[7],
    8: baseUnit * finalMultipliers[8],
    9: baseUnit * finalMultipliers[9],
    10: baseUnit * finalMultipliers[10],
  };
}

/**
 * Create a color palette from a base color
 * 
 * @param baseColor - Base color in hex format
 * @param options - Optional configuration for palette generation
 * @returns ColorPalette with main, light, dark, contrast, and alpha function
 * 
 * @example
 * ```typescript
 * const primary = createThemeColor('#29F2DF');
 * // Returns palette with light/dark variations and alpha function
 * ```
 */
export function createThemeColor(
  baseColor: string,
  options?: {
    light?: string;
    dark?: string;
    contrast?: string;
    gradient?: GradientDefinition;
  }
): ColorPalette {
  // Validate hex color format
  if (!/^#[0-9A-F]{6}$/i.test(baseColor)) {
    throw new Error(`Invalid hex color format: ${baseColor}`);
  }

  return {
    main: baseColor,
    light: options?.light || lighten(baseColor, 20),
    dark: options?.dark || darken(baseColor, 20),
    contrast: options?.contrast || '#ffffff',
    alpha: createAlphaFunction(baseColor),
    gradient: options?.gradient,
  };
}

/**
 * Create typography system definitions
 * 
 * @param config - Typography configuration
 * @returns Complete TypographySystem
 * 
 * @example
 * ```typescript
 * const typography = createThemeStyle({
 *   fontFamily: {
 *     primary: 'Inter, sans-serif',
 *     secondary: 'Orbitron, sans-serif',
 *     mono: 'Fira Code, monospace'
 *   }
 * });
 * ```
 */
export function createThemeStyle(config?: {
  fontFamily?: Partial<FontFamilySystem>;
  fontSize?: Partial<FontSizeScale>;
  fontWeight?: Partial<FontWeightScale>;
  lineHeight?: Partial<LineHeightScale>;
  letterSpacing?: Partial<LetterSpacingScale>;
}): TypographySystem {
  const defaultFontFamily: FontFamilySystem = {
    primary: 'system-ui, -apple-system, sans-serif',
    secondary: 'Georgia, serif',
    mono: 'Consolas, Monaco, monospace',
  };

  const defaultFontSize: FontSizeScale = {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  };

  const defaultFontWeight: FontWeightScale = {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  };

  const defaultLineHeight: LineHeightScale = {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  };

  const defaultLetterSpacing: LetterSpacingScale = {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  };

  return {
    fontFamily: { ...defaultFontFamily, ...config?.fontFamily },
    fontSize: { ...defaultFontSize, ...config?.fontSize },
    fontWeight: { ...defaultFontWeight, ...config?.fontWeight },
    lineHeight: { ...defaultLineHeight, ...config?.lineHeight },
    letterSpacing: { ...defaultLetterSpacing, ...config?.letterSpacing },
  };
}

/**
 * Create responsive breakpoint definitions
 * 
 * @param values - Breakpoint values in pixels
 * @param labels - Optional semantic labels for breakpoints
 * @returns Complete BreakpointSystem
 * 
 * @example
 * ```typescript
 * const breakpoints = createThemeBreakpoints({
 *   xs: 0,
 *   sm: 640,
 *   md: 768,
 *   lg: 1024,
 *   xl: 1280,
 *   '2xl': 1536
 * });
 * ```
 */
export function createThemeBreakpoints(
  values?: Partial<BreakpointValues>,
  labels?: Partial<BreakpointLabels>
): BreakpointSystem {
  const defaultValues: BreakpointValues = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  const defaultLabels: BreakpointLabels = {
    xs: 'mobile',
    sm: 'tablet',
    md: 'laptop',
    lg: 'desktop',
    xl: 'wide',
    '2xl': 'ultrawide',
  };

  return {
    values: { ...defaultValues, ...values },
    labels: { ...defaultLabels, ...labels },
  };
}

/**
 * Create a theme composition function
 * 
 * This function returns a theme creator that can be used to compose
 * complete themes from individual subsystems.
 * 
 * @returns Function that creates complete RHUDSTheme objects
 * 
 * @example
 * ```typescript
 * const createTheme = createCreateTheme();
 * const myTheme = createTheme({
 *   name: 'My Theme',
 *   colors: { ... },
 *   units: { ... }
 * });
 * ```
 */
export function createCreateTheme() {
  return function (config: {
    name?: string;
    version?: string;
    colors?: Partial<ColorSystem>;
    units?: Partial<UnitSystem>;
    typography?: Partial<TypographySystem>;
    breakpoints?: Partial<BreakpointSystem>;
    animation?: Partial<AnimationDefaults>;
    zIndex?: Partial<ZIndexSystem>;
  }): RHUDSTheme {
    // Default color system - HUD Palette (4 colors only)
    const defaultColors: ColorSystem = {
      primary: createThemeColor('#29F2DF'),      // Cyan - Primary/brightest
      secondary: createThemeColor('#1C7FA6'),    // Blue - Secondary
      success: createThemeColor('#00ff9f'),      // Keep green for success
      warning: createThemeColor('#ffb800'),      // Keep orange for warning
      error: createThemeColor('#ff0055'),        // Keep red for error
      info: createThemeColor('#29F2DF'),         // Cyan - info
      neutral: createThemeColor('#EF3EF1'),      // Bright Pink - accent
      background: createThemeColor('#0A1225'),   // Dark blue/black - primary background
      text: createThemeColor('#ffffff'),
    };

    // Default unit system
    const defaultUnits: UnitSystem = {
      space: createThemeUnit(4),
      size: createThemeUnit(4),
      radius: createThemeUnit(2),
      shadow: {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    };

    // Default animation system
    const defaultAnimation: AnimationDefaults = {
      duration: {
        instant: 0,
        fast: 150,
        normal: 300,
        slow: 500,
        slower: 750,
        slowest: 1000,
      },
      easing: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
        easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
        easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
        easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
        easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
        easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
        easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
        easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
        easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
        easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',
        easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
        easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
        easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
        easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
        easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    };

    // Default z-index system
    const defaultZIndex: ZIndexSystem = {
      base: 0,
      dropdown: 1000,
      sticky: 1100,
      fixed: 1200,
      modalBackdrop: 1300,
      modal: 1400,
      popover: 1500,
      tooltip: 1600,
      notification: 1700,
    };

    // Merge with provided config
    const theme: RHUDSTheme = {
      name: config.name,
      version: config.version,
      colors: { ...defaultColors, ...config.colors },
      units: { ...defaultUnits, ...config.units },
      typography: { ...createThemeStyle(), ...config.typography },
      breakpoints: { ...createThemeBreakpoints(), ...config.breakpoints },
      animation: { ...defaultAnimation, ...config.animation },
      zIndex: { ...defaultZIndex, ...config.zIndex },
    };

    // Validate the theme before returning (Requirement 1.7)
    validateTheme(theme);

    return theme;
  };
}

/**
 * Create an application-specific theme
 * 
 * This is a convenience function that combines all theme creation functions
 * to create a complete, ready-to-use application theme.
 * 
 * @param config - Application theme configuration
 * @returns Complete RHUDSTheme ready for use
 * 
 * @example
 * ```typescript
 * const appTheme = createAppTheme({
 *   name: 'My App Theme',
 *   primaryColor: '#29F2DF',
 *   secondaryColor: '#1C7FA6',
 *   baseUnit: 8,
 *   fontFamily: 'Inter, sans-serif'
 * });
 * ```
 */
export function createAppTheme(config: {
  name?: string;
  version?: string;
  primaryColor?: string;
  secondaryColor?: string;
  baseUnit?: number;
  fontFamily?: string;
  breakpoints?: Partial<BreakpointValues>;
  customColors?: Record<string, string>;
}): RHUDSTheme {
  const createTheme = createCreateTheme();

  // Build color system
  const colors: Partial<ColorSystem> = {};
  if (config.primaryColor) {
    colors.primary = createThemeColor(config.primaryColor);
  }
  if (config.secondaryColor) {
    colors.secondary = createThemeColor(config.secondaryColor);
  }
  if (config.customColors) {
    colors.custom = {};
    for (const [key, value] of Object.entries(config.customColors)) {
      colors.custom[key] = createThemeColor(value);
    }
  }

  // Build unit system
  const units: Partial<UnitSystem> = {};
  if (config.baseUnit) {
    units.space = createThemeUnit(config.baseUnit);
    units.size = createThemeUnit(config.baseUnit);
  }

  // Build typography system
  const typography: Partial<TypographySystem> = {};
  if (config.fontFamily) {
    typography.fontFamily = {
      primary: config.fontFamily,
      secondary: config.fontFamily,
      mono: 'Consolas, Monaco, monospace',
    };
  }

  // Build breakpoint system
  const breakpoints = config.breakpoints
    ? createThemeBreakpoints(config.breakpoints)
    : undefined;

  // Create theme (validation happens inside createTheme)
  return createTheme({
    name: config.name,
    version: config.version,
    colors,
    units,
    typography: Object.keys(typography).length > 0 ? typography : undefined,
    breakpoints,
  });
}
