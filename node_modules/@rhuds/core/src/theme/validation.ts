/**
 * RHUDS Pro Theme Validation
 * 
 * This module provides validation functions for theme objects to ensure
 * all required properties are present and valid.
 * 
 * Requirements: 1.7
 */

import type {
  RHUDSTheme,
  ColorSystem,
  ColorPalette,
  UnitSystem,
  UnitScale,
  TypographySystem,
  BreakpointSystem,
  AnimationDefaults,
  ZIndexSystem,
} from './models';

/**
 * Validation error class for theme validation failures
 */
export class ThemeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThemeValidationError';
  }
}

/**
 * Validate that a color palette has all required properties
 */
function validateColorPalette(palette: any, name: string): palette is ColorPalette {
  if (!palette || typeof palette !== 'object') {
    throw new ThemeValidationError(`Color palette "${name}" must be an object`);
  }

  if (typeof palette.main !== 'string') {
    throw new ThemeValidationError(`Color palette "${name}" must have a "main" property of type string`);
  }

  if (typeof palette.light !== 'string') {
    throw new ThemeValidationError(`Color palette "${name}" must have a "light" property of type string`);
  }

  if (typeof palette.dark !== 'string') {
    throw new ThemeValidationError(`Color palette "${name}" must have a "dark" property of type string`);
  }

  if (typeof palette.contrast !== 'string') {
    throw new ThemeValidationError(`Color palette "${name}" must have a "contrast" property of type string`);
  }

  if (typeof palette.alpha !== 'function') {
    throw new ThemeValidationError(`Color palette "${name}" must have an "alpha" property of type function`);
  }

  return true;
}

/**
 * Validate that a color system has all required palettes
 */
function validateColorSystem(colors: any): colors is ColorSystem {
  if (!colors || typeof colors !== 'object') {
    throw new ThemeValidationError('Theme must have a "colors" property of type object');
  }

  const requiredPalettes = [
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'neutral',
    'background',
    'text',
  ];

  for (const palette of requiredPalettes) {
    if (!colors[palette]) {
      throw new ThemeValidationError(`Color system must have a "${palette}" palette`);
    }
    validateColorPalette(colors[palette], palette);
  }

  return true;
}

/**
 * Validate that a unit scale has all required levels (0-10)
 */
function validateUnitScale(scale: any, name: string): scale is UnitScale {
  if (!scale || typeof scale !== 'object') {
    throw new ThemeValidationError(`Unit scale "${name}" must be an object`);
  }

  for (let i = 0; i <= 10; i++) {
    if (typeof scale[i] !== 'number') {
      throw new ThemeValidationError(`Unit scale "${name}" must have a numeric value at level ${i}`);
    }
  }

  return true;
}

/**
 * Validate that a unit system has all required scales
 */
function validateUnitSystem(units: any): units is UnitSystem {
  if (!units || typeof units !== 'object') {
    throw new ThemeValidationError('Theme must have a "units" property of type object');
  }

  if (!units.space) {
    throw new ThemeValidationError('Unit system must have a "space" scale');
  }
  validateUnitScale(units.space, 'space');

  if (!units.size) {
    throw new ThemeValidationError('Unit system must have a "size" scale');
  }
  validateUnitScale(units.size, 'size');

  if (!units.radius) {
    throw new ThemeValidationError('Unit system must have a "radius" scale');
  }
  validateUnitScale(units.radius, 'radius');

  if (!units.shadow || typeof units.shadow !== 'object') {
    throw new ThemeValidationError('Unit system must have a "shadow" property of type object');
  }

  const requiredShadows = ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'inner'];
  for (const shadow of requiredShadows) {
    if (typeof units.shadow[shadow] !== 'string') {
      throw new ThemeValidationError(`Shadow scale must have a "${shadow}" property of type string`);
    }
  }

  return true;
}

/**
 * Validate that a typography system has all required properties
 */
function validateTypographySystem(typography: any): typography is TypographySystem {
  if (!typography || typeof typography !== 'object') {
    throw new ThemeValidationError('Theme must have a "typography" property of type object');
  }

  // Validate font family
  if (!typography.fontFamily || typeof typography.fontFamily !== 'object') {
    throw new ThemeValidationError('Typography system must have a "fontFamily" property of type object');
  }

  const requiredFontFamilies = ['primary', 'secondary', 'mono'];
  for (const family of requiredFontFamilies) {
    if (typeof typography.fontFamily[family] !== 'string') {
      throw new ThemeValidationError(`Font family must have a "${family}" property of type string`);
    }
  }

  // Validate font size
  if (!typography.fontSize || typeof typography.fontSize !== 'object') {
    throw new ThemeValidationError('Typography system must have a "fontSize" property of type object');
  }

  const requiredFontSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
  for (const size of requiredFontSizes) {
    if (typeof typography.fontSize[size] !== 'string') {
      throw new ThemeValidationError(`Font size scale must have a "${size}" property of type string`);
    }
  }

  // Validate font weight
  if (!typography.fontWeight || typeof typography.fontWeight !== 'object') {
    throw new ThemeValidationError('Typography system must have a "fontWeight" property of type object');
  }

  const requiredFontWeights = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'];
  for (const weight of requiredFontWeights) {
    if (typeof typography.fontWeight[weight] !== 'number') {
      throw new ThemeValidationError(`Font weight scale must have a "${weight}" property of type number`);
    }
  }

  // Validate line height
  if (!typography.lineHeight || typeof typography.lineHeight !== 'object') {
    throw new ThemeValidationError('Typography system must have a "lineHeight" property of type object');
  }

  const requiredLineHeights = ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'];
  for (const height of requiredLineHeights) {
    if (typeof typography.lineHeight[height] !== 'number') {
      throw new ThemeValidationError(`Line height scale must have a "${height}" property of type number`);
    }
  }

  // Validate letter spacing
  if (!typography.letterSpacing || typeof typography.letterSpacing !== 'object') {
    throw new ThemeValidationError('Typography system must have a "letterSpacing" property of type object');
  }

  const requiredLetterSpacings = ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'];
  for (const spacing of requiredLetterSpacings) {
    if (typeof typography.letterSpacing[spacing] !== 'string') {
      throw new ThemeValidationError(`Letter spacing scale must have a "${spacing}" property of type string`);
    }
  }

  return true;
}

/**
 * Validate that a breakpoint system has all required properties
 */
function validateBreakpointSystem(breakpoints: any): breakpoints is BreakpointSystem {
  if (!breakpoints || typeof breakpoints !== 'object') {
    throw new ThemeValidationError('Theme must have a "breakpoints" property of type object');
  }

  // Validate values
  if (!breakpoints.values || typeof breakpoints.values !== 'object') {
    throw new ThemeValidationError('Breakpoint system must have a "values" property of type object');
  }

  const requiredBreakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  for (const bp of requiredBreakpoints) {
    if (typeof breakpoints.values[bp] !== 'number') {
      throw new ThemeValidationError(`Breakpoint values must have a "${bp}" property of type number`);
    }
  }

  // Validate labels
  if (!breakpoints.labels || typeof breakpoints.labels !== 'object') {
    throw new ThemeValidationError('Breakpoint system must have a "labels" property of type object');
  }

  for (const bp of requiredBreakpoints) {
    if (typeof breakpoints.labels[bp] !== 'string') {
      throw new ThemeValidationError(`Breakpoint labels must have a "${bp}" property of type string`);
    }
  }

  return true;
}

/**
 * Validate that animation defaults have all required properties
 */
function validateAnimationDefaults(animation: any): animation is AnimationDefaults {
  if (!animation || typeof animation !== 'object') {
    throw new ThemeValidationError('Theme must have an "animation" property of type object');
  }

  // Validate duration
  if (!animation.duration || typeof animation.duration !== 'object') {
    throw new ThemeValidationError('Animation defaults must have a "duration" property of type object');
  }

  const requiredDurations = ['instant', 'fast', 'normal', 'slow', 'slower', 'slowest'];
  for (const duration of requiredDurations) {
    if (typeof animation.duration[duration] !== 'number') {
      throw new ThemeValidationError(`Animation duration must have a "${duration}" property of type number`);
    }
  }

  // Validate easing
  if (!animation.easing || typeof animation.easing !== 'object') {
    throw new ThemeValidationError('Animation defaults must have an "easing" property of type object');
  }

  const requiredEasings = [
    'linear', 'easeIn', 'easeOut', 'easeInOut',
    'easeInQuad', 'easeOutQuad', 'easeInOutQuad',
    'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
    'easeInQuart', 'easeOutQuart', 'easeInOutQuart',
    'easeInQuint', 'easeOutQuint', 'easeInOutQuint',
    'easeInExpo', 'easeOutExpo', 'easeInOutExpo',
    'easeInCirc', 'easeOutCirc', 'easeInOutCirc',
    'easeInBack', 'easeOutBack', 'easeInOutBack',
  ];

  for (const easing of requiredEasings) {
    if (typeof animation.easing[easing] !== 'string') {
      throw new ThemeValidationError(`Animation easing must have a "${easing}" property of type string`);
    }
  }

  return true;
}

/**
 * Validate that z-index system has all required properties
 */
function validateZIndexSystem(zIndex: any): zIndex is ZIndexSystem {
  if (!zIndex || typeof zIndex !== 'object') {
    throw new ThemeValidationError('Theme must have a "zIndex" property of type object');
  }

  const requiredZIndices = [
    'base', 'dropdown', 'sticky', 'fixed',
    'modalBackdrop', 'modal', 'popover', 'tooltip', 'notification',
  ];

  for (const z of requiredZIndices) {
    if (typeof zIndex[z] !== 'number') {
      throw new ThemeValidationError(`Z-index system must have a "${z}" property of type number`);
    }
  }

  return true;
}

/**
 * Validate a complete RHUDS theme object
 * 
 * @param theme - Theme object to validate
 * @throws {ThemeValidationError} If theme is invalid
 * @returns true if theme is valid
 * 
 * @example
 * ```typescript
 * try {
 *   validateTheme(myTheme);
 *   console.log('Theme is valid');
 * } catch (error) {
 *   if (error instanceof ThemeValidationError) {
 *     console.error('Theme validation failed:', error.message);
 *   }
 * }
 * ```
 */
export function validateTheme(theme: any): theme is RHUDSTheme {
  if (!theme || typeof theme !== 'object') {
    throw new ThemeValidationError('Theme must be an object');
  }

  // Validate all required subsystems
  validateColorSystem(theme.colors);
  validateUnitSystem(theme.units);
  validateTypographySystem(theme.typography);
  validateBreakpointSystem(theme.breakpoints);
  validateAnimationDefaults(theme.animation);
  validateZIndexSystem(theme.zIndex);

  return true;
}

/**
 * Check if a theme is valid without throwing errors
 * 
 * @param theme - Theme object to check
 * @returns true if theme is valid, false otherwise
 * 
 * @example
 * ```typescript
 * if (isValidTheme(myTheme)) {
 *   // Use theme
 * } else {
 *   // Handle invalid theme
 * }
 * ```
 */
export function isValidTheme(theme: any): theme is RHUDSTheme {
  try {
    validateTheme(theme);
    return true;
  } catch {
    return false;
  }
}
