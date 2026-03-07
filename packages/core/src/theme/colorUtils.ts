/**
 * RHUDS Pro Color Manipulation Utilities
 * 
 * This module provides advanced color manipulation capabilities including:
 * - Color variations (lighter, darker, saturated, desaturated)
 * - Alpha channel manipulation
 * - Gradient definitions (linear, radial, conic)
 * - Animated color transitions
 * 
 * Requirements: 2.1-2.4
 */

import type { RGB, HSL, GradientDefinition } from './models';

// ============================================================================
// Color Conversion Functions
// ============================================================================

/**
 * Convert hex color to RGB
 * @param hex - Hex color string (e.g., '#29F2DF')
 * @returns RGB object with r, g, b values (0-255)
 */
export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  }
  
  // Handle 6-digit hex
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB to hex
 * @param rgb - RGB object with r, g, b values (0-255)
 * @returns Hex color string (e.g., '#29F2DF')
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    const hex = clamped.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Convert RGB to HSL
 * @param rgb - RGB object with r, g, b values (0-255)
 * @returns HSL object with h (0-360), s (0-100), l (0-100)
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 * @param hsl - HSL object with h (0-360), s (0-100), l (0-100)
 * @returns RGB object with r, g, b values (0-255)
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// ============================================================================
// Color Manipulation Functions (Requirement 2.1)
// ============================================================================

/**
 * Lighten a color by a percentage
 * @param color - Hex color string (e.g., '#29F2DF')
 * @param amount - Amount to lighten (0-100)
 * @returns Lightened hex color string
 * 
 * @example
 * ```typescript
 * lighten('#29F2DF', 20); // Returns lighter version
 * ```
 */
export function lighten(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb);
  hsl.l = Math.min(100, hsl.l + amount);
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Darken a color by a percentage
 * @param color - Hex color string (e.g., '#29F2DF')
 * @param amount - Amount to darken (0-100)
 * @returns Darkened hex color string
 * 
 * @example
 * ```typescript
 * darken('#29F2DF', 20); // Returns darker version
 * ```
 */
export function darken(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb);
  hsl.l = Math.max(0, hsl.l - amount);
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Increase saturation of a color
 * @param color - Hex color string (e.g., '#29F2DF')
 * @param amount - Amount to increase saturation (0-100)
 * @returns More saturated hex color string
 * 
 * @example
 * ```typescript
 * saturate('#29F2DF', 20); // Returns more saturated version
 * ```
 */
export function saturate(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb);
  hsl.s = Math.min(100, hsl.s + amount);
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Decrease saturation of a color
 * @param color - Hex color string (e.g., '#29F2DF')
 * @param amount - Amount to decrease saturation (0-100)
 * @returns Less saturated hex color string
 * 
 * @example
 * ```typescript
 * desaturate('#29F2DF', 20); // Returns less saturated version
 * ```
 */
export function desaturate(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb);
  hsl.s = Math.max(0, hsl.s - amount);
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Generate color variations from a base color
 * @param baseColor - Base hex color string
 * @param options - Configuration for variation generation
 * @returns Array of color variations
 * 
 * @example
 * ```typescript
 * generateColorVariations('#29F2DF', { steps: 5, type: 'lighter' });
 * // Returns ['#29F2DF', '#33f8ff', '#66f9ff', '#99fbff', '#ccfdff']
 * ```
 */
export function generateColorVariations(
  baseColor: string,
  options: {
    steps?: number;
    type: 'lighter' | 'darker' | 'saturated' | 'desaturated';
    amount?: number;
  }
): string[] {
  const steps = options.steps || 5;
  const amount = options.amount || 10;
  const variations: string[] = [baseColor];

  for (let i = 1; i < steps; i++) {
    const stepAmount = amount * i;
    let variation: string;

    switch (options.type) {
      case 'lighter':
        variation = lighten(baseColor, stepAmount);
        break;
      case 'darker':
        variation = darken(baseColor, stepAmount);
        break;
      case 'saturated':
        variation = saturate(baseColor, stepAmount);
        break;
      case 'desaturated':
        variation = desaturate(baseColor, stepAmount);
        break;
    }

    variations.push(variation);
  }

  return variations;
}

// ============================================================================
// Alpha Channel Manipulation (Requirement 2.2)
// ============================================================================

/**
 * Add alpha channel to a color
 * @param color - Hex color string (e.g., '#29F2DF')
 * @param opacity - Opacity value (0-1)
 * @returns RGBA color string
 * 
 * @example
 * ```typescript
 * alpha('#29F2DF', 0.5); // Returns 'rgba(0, 246, 255, 0.5)'
 * ```
 */
export function alpha(color: string, opacity: number): string {
  const rgb = hexToRgb(color);
  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampedOpacity})`;
}

/**
 * Create an alpha function for a specific color
 * @param baseColor - Base hex color string
 * @returns Function that takes opacity and returns RGBA string
 * 
 * @example
 * ```typescript
 * const primaryAlpha = createAlphaFunction('#29F2DF');
 * primaryAlpha(0.5); // Returns 'rgba(0, 246, 255, 0.5)'
 * ```
 */
export function createAlphaFunction(baseColor: string): (opacity: number) => string {
  return (opacity: number) => alpha(baseColor, opacity);
}

// ============================================================================
// Gradient Definitions (Requirement 2.3)
// ============================================================================

/**
 * Create a linear gradient CSS string
 * @param definition - Gradient definition object
 * @returns CSS linear-gradient string
 * 
 * @example
 * ```typescript
 * createLinearGradient({
 *   type: 'linear',
 *   angle: 45,
 *   stops: [
 *     { color: '#29F2DF', position: 0 },
 *     { color: '#1C7FA6', position: 100 }
 *   ]
 * });
 * // Returns 'linear-gradient(45deg, #29F2DF 0%, #1C7FA6 100%)'
 * ```
 */
export function createLinearGradient(definition: GradientDefinition): string {
  if (definition.type !== 'linear') {
    throw new Error('Gradient type must be "linear"');
  }

  const angle = definition.angle ?? 0;
  const stops = definition.stops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  return `linear-gradient(${angle}deg, ${stops})`;
}

/**
 * Create a radial gradient CSS string
 * @param definition - Gradient definition object
 * @returns CSS radial-gradient string
 * 
 * @example
 * ```typescript
 * createRadialGradient({
 *   type: 'radial',
 *   stops: [
 *     { color: '#29F2DF', position: 0 },
 *     { color: '#1C7FA6', position: 100 }
 *   ]
 * });
 * // Returns 'radial-gradient(circle, #29F2DF 0%, #1C7FA6 100%)'
 * ```
 */
export function createRadialGradient(definition: GradientDefinition): string {
  if (definition.type !== 'radial') {
    throw new Error('Gradient type must be "radial"');
  }

  const stops = definition.stops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  return `radial-gradient(circle, ${stops})`;
}

/**
 * Create a conic gradient CSS string
 * @param definition - Gradient definition object
 * @returns CSS conic-gradient string
 * 
 * @example
 * ```typescript
 * createConicGradient({
 *   type: 'conic',
 *   angle: 0,
 *   stops: [
 *     { color: '#29F2DF', position: 0 },
 *     { color: '#1C7FA6', position: 100 }
 *   ]
 * });
 * // Returns 'conic-gradient(from 0deg, #29F2DF 0%, #1C7FA6 100%)'
 * ```
 */
export function createConicGradient(definition: GradientDefinition): string {
  if (definition.type !== 'conic') {
    throw new Error('Gradient type must be "conic"');
  }

  const angle = definition.angle ?? 0;
  const stops = definition.stops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  return `conic-gradient(from ${angle}deg, ${stops})`;
}

/**
 * Create a gradient CSS string from a gradient definition
 * @param definition - Gradient definition object
 * @returns CSS gradient string
 * 
 * @example
 * ```typescript
 * createGradient({
 *   type: 'linear',
 *   angle: 45,
 *   stops: [
 *     { color: '#29F2DF', position: 0 },
 *     { color: '#1C7FA6', position: 100 }
 *   ]
 * });
 * ```
 */
export function createGradient(definition: GradientDefinition): string {
  switch (definition.type) {
    case 'linear':
      return createLinearGradient(definition);
    case 'radial':
      return createRadialGradient(definition);
    case 'conic':
      return createConicGradient(definition);
    default:
      throw new Error(`Unknown gradient type: ${(definition as any).type}`);
  }
}

// ============================================================================
// Animated Color Transitions (Requirement 2.4)
// ============================================================================

/**
 * Color transition keyframe definition
 */
export interface ColorTransitionKeyframe {
  /** Time in the animation (0-1) */
  time: number;
  /** Color at this keyframe */
  color: string;
}

/**
 * Color transition configuration
 */
export interface ColorTransitionConfig {
  /** Starting color */
  from: string;
  /** Ending color */
  to: string;
  /** Duration in milliseconds */
  duration: number;
  /** Easing function */
  easing?: string;
  /** Optional keyframes for multi-step transitions */
  keyframes?: ColorTransitionKeyframe[];
}

/**
 * Interpolate between two colors
 * @param color1 - Starting hex color
 * @param color2 - Ending hex color
 * @param progress - Progress value (0-1)
 * @returns Interpolated hex color
 * 
 * @example
 * ```typescript
 * interpolateColor('#29F2DF', '#1C7FA6', 0.5);
 * // Returns color halfway between the two
 * ```
 */
export function interpolateColor(color1: string, color2: string, progress: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const clampedProgress = Math.max(0, Math.min(1, progress));

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * clampedProgress);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * clampedProgress);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * clampedProgress);

  return rgbToHex({ r, g, b });
}

/**
 * Create CSS keyframes for color transition animation
 * @param name - Animation name
 * @param config - Color transition configuration
 * @returns CSS @keyframes string
 * 
 * @example
 * ```typescript
 * createColorTransitionKeyframes('fadeColor', {
 *   from: '#29F2DF',
 *   to: '#1C7FA6',
 *   duration: 1000
 * });
 * ```
 */
export function createColorTransitionKeyframes(
  name: string,
  config: ColorTransitionConfig
): string {
  if (config.keyframes && config.keyframes.length > 0) {
    // Multi-step transition with custom keyframes
    const keyframeSteps = config.keyframes
      .map(kf => `${Math.round(kf.time * 100)}% { color: ${kf.color}; }`)
      .join('\n  ');

    return `@keyframes ${name} {
  0% { color: ${config.from}; }
  ${keyframeSteps}
  100% { color: ${config.to}; }
}`;
  } else {
    // Simple two-color transition
    return `@keyframes ${name} {
  0% { color: ${config.from}; }
  100% { color: ${config.to}; }
}`;
  }
}

/**
 * Create CSS animation property for color transition
 * @param name - Animation name
 * @param config - Color transition configuration
 * @returns CSS animation property value
 * 
 * @example
 * ```typescript
 * createColorTransitionAnimation('fadeColor', {
 *   from: '#29F2DF',
 *   to: '#1C7FA6',
 *   duration: 1000,
 *   easing: 'ease-in-out'
 * });
 * // Returns 'fadeColor 1000ms ease-in-out'
 * ```
 */
export function createColorTransitionAnimation(
  name: string,
  config: ColorTransitionConfig
): string {
  const easing = config.easing || 'linear';
  return `${name} ${config.duration}ms ${easing}`;
}

/**
 * Animate gradient transition between two gradient definitions
 * @param from - Starting gradient definition
 * @param to - Ending gradient definition
 * @param progress - Progress value (0-1)
 * @returns Interpolated gradient definition
 * 
 * @example
 * ```typescript
 * animateGradient(
 *   { type: 'linear', angle: 0, stops: [...] },
 *   { type: 'linear', angle: 90, stops: [...] },
 *   0.5
 * );
 * ```
 */
export function animateGradient(
  from: GradientDefinition,
  to: GradientDefinition,
  progress: number
): GradientDefinition {
  if (from.type !== to.type) {
    throw new Error('Cannot animate between different gradient types');
  }

  if (from.stops.length !== to.stops.length) {
    throw new Error('Gradient stops must have the same length');
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Interpolate angle if present
  const angle =
    from.angle !== undefined && to.angle !== undefined
      ? from.angle + (to.angle - from.angle) * clampedProgress
      : from.angle ?? to.angle;

  // Interpolate stops
  const stops = from.stops.map((fromStop, index) => {
    const toStop = to.stops[index];
    return {
      color: interpolateColor(fromStop.color, toStop.color, clampedProgress),
      position: fromStop.position + (toStop.position - fromStop.position) * clampedProgress,
    };
  });

  return {
    type: from.type,
    angle,
    stops,
  };
}

// ============================================================================
// Color Accessibility Features (Requirement 2.6)
// ============================================================================

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 formula: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 * @param rgb - RGB color object
 * @returns Relative luminance value (0-1)
 */
function getRelativeLuminance(rgb: RGB): number {
  // Convert RGB values to sRGB
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  // Apply gamma correction
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.1 formula: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 * @param color1 - First color (hex string)
 * @param color2 - Second color (hex string)
 * @returns Contrast ratio (1-21)
 * 
 * @example
 * ```typescript
 * getContrastRatio('#000000', '#ffffff'); // Returns 21 (maximum contrast)
 * getContrastRatio('#29F2DF', '#ffffff'); // Returns ~1.6
 * ```
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format');
  }

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG compliance level
 */
export type WCAGLevel = 'AA' | 'AAA';

/**
 * WCAG text size category
 */
export type WCAGTextSize = 'normal' | 'large';

/**
 * Check if two colors meet WCAG 2.1 contrast requirements
 * @param foreground - Foreground color (hex string)
 * @param background - Background color (hex string)
 * @param level - WCAG level ('AA' or 'AAA')
 * @param textSize - Text size category ('normal' or 'large')
 * @returns True if colors meet WCAG requirements
 * 
 * WCAG 2.1 Requirements:
 * - Level AA: 4.5:1 for normal text, 3:1 for large text
 * - Level AAA: 7:1 for normal text, 4.5:1 for large text
 * - Large text: 18pt+ or 14pt+ bold
 * 
 * @example
 * ```typescript
 * meetsWCAG('#000000', '#ffffff', 'AA', 'normal'); // Returns true (21:1 ratio)
 * meetsWCAG('#29F2DF', '#ffffff', 'AA', 'normal'); // Returns false (~1.6:1 ratio)
 * ```
 */
export function meetsWCAG(
  foreground: string,
  background: string,
  level: WCAGLevel = 'AA',
  textSize: WCAGTextSize = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background);

  // WCAG 2.1 contrast requirements
  const requirements = {
    AA: {
      normal: 4.5,
      large: 3.0,
    },
    AAA: {
      normal: 7.0,
      large: 4.5,
    },
  };

  const requiredRatio = requirements[level][textSize];
  return ratio >= requiredRatio;
}

/**
 * Find an accessible color by adjusting lightness
 * @param baseColor - Base color to adjust (hex string)
 * @param background - Background color to contrast against (hex string)
 * @param level - WCAG level to meet ('AA' or 'AAA')
 * @param textSize - Text size category ('normal' or 'large')
 * @returns Accessible color (hex string) or null if not achievable
 * 
 * @example
 * ```typescript
 * findAccessibleColor('#29F2DF', '#ffffff', 'AA', 'normal');
 * // Returns a darker version of #29F2DF that meets AA contrast
 * ```
 */
export function findAccessibleColor(
  baseColor: string,
  background: string,
  level: WCAGLevel = 'AA',
  textSize: WCAGTextSize = 'normal'
): string | null {
  // Check if base color already meets requirements
  if (meetsWCAG(baseColor, background, level, textSize)) {
    return baseColor;
  }

  const rgb = parseColor(baseColor);
  if (!rgb) {
    throw new Error('Invalid base color format');
  }

  const hsl = rgbToHsl(rgb);
  const backgroundRgb = parseColor(background);
  if (!backgroundRgb) {
    throw new Error('Invalid background color format');
  }

  const backgroundLuminance = getRelativeLuminance(backgroundRgb);

  // Determine if we need to go lighter or darker
  const shouldGoLighter = backgroundLuminance < 0.5;

  // Try adjusting lightness in steps
  const maxSteps = 100;
  const step = 1;

  for (let i = 1; i <= maxSteps; i++) {
    const adjustedHsl = { ...hsl };

    if (shouldGoLighter) {
      adjustedHsl.l = Math.min(100, hsl.l + step * i);
    } else {
      adjustedHsl.l = Math.max(0, hsl.l - step * i);
    }

    const adjustedColor = rgbToHex(hslToRgb(adjustedHsl));

    if (meetsWCAG(adjustedColor, background, level, textSize)) {
      return adjustedColor;
    }

    // Stop if we've reached the limits
    if ((shouldGoLighter && adjustedHsl.l >= 100) || (!shouldGoLighter && adjustedHsl.l <= 0)) {
      break;
    }
  }

  // If we couldn't find an accessible color, return pure black or white
  const fallbackColor = shouldGoLighter ? '#ffffff' : '#000000';
  if (meetsWCAG(fallbackColor, background, level, textSize)) {
    return fallbackColor;
  }

  return null;
}

/**
 * Get accessibility information for a color pair
 * @param foreground - Foreground color (hex string)
 * @param background - Background color (hex string)
 * @returns Accessibility information object
 * 
 * @example
 * ```typescript
 * getAccessibilityInfo('#29F2DF', '#ffffff');
 * // Returns {
 * //   ratio: 1.6,
 * //   AA: { normal: false, large: false },
 * //   AAA: { normal: false, large: false }
 * // }
 * ```
 */
export function getAccessibilityInfo(foreground: string, background: string): {
  ratio: number;
  AA: { normal: boolean; large: boolean };
  AAA: { normal: boolean; large: boolean };
} {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio,
    AA: {
      normal: meetsWCAG(foreground, background, 'AA', 'normal'),
      large: meetsWCAG(foreground, background, 'AA', 'large'),
    },
    AAA: {
      normal: meetsWCAG(foreground, background, 'AAA', 'normal'),
      large: meetsWCAG(foreground, background, 'AAA', 'large'),
    },
  };
}

// ============================================================================
// Color Validation (Requirement 2.5)
// ============================================================================

/**
 * Color format type
 */
export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'unknown';

/**
 * Detect the format of a color string
 * @param color - Color string to analyze
 * @returns Color format type
 * 
 * @example
 * ```typescript
 * detectColorFormat('#29F2DF'); // Returns 'hex'
 * detectColorFormat('rgb(0, 246, 255)'); // Returns 'rgb'
 * detectColorFormat('rgba(0, 246, 255, 0.5)'); // Returns 'rgba'
 * detectColorFormat('hsl(184, 100%, 50%)'); // Returns 'hsl'
 * ```
 */
export function detectColorFormat(color: string): ColorFormat {
  if (isValidHexColor(color)) {
    return 'hex';
  }

  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(color)) {
    return 'rgb';
  }

  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i.test(color)) {
    return 'rgba';
  }

  if (/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i.test(color)) {
    return 'hsl';
  }

  if (/^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/i.test(color)) {
    return 'hsla';
  }

  return 'unknown';
}

/**
 * Validate if a color string is in a valid format
 * @param color - Color string to validate
 * @returns True if color is valid
 * 
 * @example
 * ```typescript
 * isValidColor('#29F2DF'); // Returns true
 * isValidColor('rgb(0, 246, 255)'); // Returns true
 * isValidColor('invalid'); // Returns false
 * ```
 */
export function isValidColor(color: string): boolean {
  return detectColorFormat(color) !== 'unknown';
}

/**
 * Validate hex color format
 * @param color - Color string to validate
 * @returns True if valid hex color
 * 
 * @example
 * ```typescript
 * isValidHexColor('#29F2DF'); // Returns true
 * isValidHexColor('#0ff'); // Returns true (3-digit hex)
 * isValidHexColor('00f6ff'); // Returns false (missing #)
 * ```
 */
export function isValidHexColor(color: string): boolean {
  return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color);
}

/**
 * Validate RGB color format
 * @param color - Color string to validate
 * @returns True if valid RGB color
 * 
 * @example
 * ```typescript
 * isValidRgbColor('rgb(0, 246, 255)'); // Returns true
 * isValidRgbColor('rgb(0, 246, 255, 0.5)'); // Returns false (use rgba)
 * ```
 */
export function isValidRgbColor(color: string): boolean {
  const match = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (!match) return false;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
}

/**
 * Validate RGBA color format
 * @param color - Color string to validate
 * @returns True if valid RGBA color
 * 
 * @example
 * ```typescript
 * isValidRgbaColor('rgba(0, 246, 255, 0.5)'); // Returns true
 * isValidRgbaColor('rgba(0, 246, 255, 1.5)'); // Returns false (alpha > 1)
 * ```
 */
export function isValidRgbaColor(color: string): boolean {
  const match = color.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/i);
  if (!match) return false;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = parseFloat(match[4]);

  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1;
}

/**
 * Validate HSL color format
 * @param color - Color string to validate
 * @returns True if valid HSL color
 * 
 * @example
 * ```typescript
 * isValidHslColor('hsl(184, 100%, 50%)'); // Returns true
 * isValidHslColor('hsl(400, 100%, 50%)'); // Returns false (hue > 360)
 * ```
 */
export function isValidHslColor(color: string): boolean {
  const match = color.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i);
  if (!match) return false;

  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);

  return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
}

/**
 * Validate HSLA color format
 * @param color - Color string to validate
 * @returns True if valid HSLA color
 * 
 * @example
 * ```typescript
 * isValidHslaColor('hsla(184, 100%, 50%, 0.5)'); // Returns true
 * isValidHslaColor('hsla(184, 100%, 50%, 1.5)'); // Returns false (alpha > 1)
 * ```
 */
export function isValidHslaColor(color: string): boolean {
  const match = color.match(/^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d.]+)\s*\)$/i);
  if (!match) return false;

  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);
  const a = parseFloat(match[4]);

  return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100 && a >= 0 && a <= 1;
}

/**
 * Normalize a color string to a standard format
 * @param color - Color string in any supported format
 * @param targetFormat - Target format to convert to (default: 'hex')
 * @returns Normalized color string or null if invalid
 * 
 * @example
 * ```typescript
 * normalizeColor('rgb(0, 246, 255)', 'hex'); // Returns '#29F2DF'
 * normalizeColor('#0ff', 'hex'); // Returns '#28125A'
 * normalizeColor('hsl(184, 100%, 50%)', 'rgb'); // Returns 'rgb(0, 246, 255)'
 * ```
 */
export function normalizeColor(
  color: string,
  targetFormat: 'hex' | 'rgb' | 'hsl' = 'hex'
): string | null {
  const rgb = parseColor(color);
  if (!rgb) return null;

  switch (targetFormat) {
    case 'hex':
      return rgbToHex(rgb);
    case 'rgb':
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    case 'hsl': {
      const hsl = rgbToHsl(rgb);
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    default:
      return null;
  }
}

/**
 * Validate and parse a color string
 * @param color - Color string to validate and parse
 * @returns Validation result with parsed RGB values
 * 
 * @example
 * ```typescript
 * validateAndParseColor('#29F2DF');
 * // Returns { valid: true, format: 'hex', rgb: { r: 0, g: 246, b: 255 } }
 * 
 * validateAndParseColor('invalid');
 * // Returns { valid: false, format: 'unknown', rgb: null, error: 'Invalid color format' }
 * ```
 */
export function validateAndParseColor(color: string): {
  valid: boolean;
  format: ColorFormat;
  rgb: RGB | null;
  error?: string;
} {
  const format = detectColorFormat(color);

  if (format === 'unknown') {
    return {
      valid: false,
      format: 'unknown',
      rgb: null,
      error: 'Invalid color format',
    };
  }

  try {
    const rgb = parseColor(color);
    if (!rgb) {
      return {
        valid: false,
        format,
        rgb: null,
        error: 'Failed to parse color',
      };
    }

    return {
      valid: true,
      format,
      rgb,
    };
  } catch (error) {
    return {
      valid: false,
      format,
      rgb: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Parse any color format to RGB
 * @param color - Color string (hex, rgb, rgba, hsl, hsla)
 * @returns RGB object or null if invalid
 */
export function parseColor(color: string): RGB | null {
  // Handle hex colors
  if (isValidHexColor(color)) {
    return hexToRgb(color);
  }

  // Handle rgb/rgba colors
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  // Handle hsl/hsla colors
  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/);
  if (hslMatch) {
    return hslToRgb({
      h: parseInt(hslMatch[1], 10),
      s: parseInt(hslMatch[2], 10),
      l: parseInt(hslMatch[3], 10),
    });
  }

  return null;
}
