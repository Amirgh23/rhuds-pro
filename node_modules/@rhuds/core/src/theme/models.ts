/**
 * RHUDS Pro Theme Data Models and TypeScript Interfaces
 * 
 * This file defines the complete type system for the RHUDS Pro theme engine,
 * including color palettes, unit scales, typography, breakpoints, animations,
 * and z-index management.
 */

// ============================================================================
// Color System Interfaces
// ============================================================================

/**
 * Color palette with variations and alpha channel support
 */
export interface ColorPalette {
  /** Main color value */
  main: string;
  /** Lighter variation of the main color */
  light: string;
  /** Darker variation of the main color */
  dark: string;
  /** Contrast color for text on main color background */
  contrast: string;
  /** Function to generate color with alpha channel */
  alpha: (opacity: number) => string;
  /** Optional gradient definition */
  gradient?: GradientDefinition;
}

/**
 * Gradient definition for color gradients
 */
export interface GradientDefinition {
  /** Type of gradient */
  type: 'linear' | 'radial' | 'conic';
  /** Angle for linear gradients (in degrees) */
  angle?: number;
  /** Gradient color stops */
  stops: Array<{ color: string; position: number }>;
}

/**
 * Complete color system with semantic color palettes
 */
export interface ColorSystem {
  /** Primary brand color */
  primary: ColorPalette;
  /** Secondary brand color */
  secondary: ColorPalette;
  /** Success state color */
  success: ColorPalette;
  /** Warning state color */
  warning: ColorPalette;
  /** Error state color */
  error: ColorPalette;
  /** Info state color */
  info: ColorPalette;
  /** Neutral/gray colors */
  neutral: ColorPalette;
  /** Background colors */
  background: ColorPalette;
  /** Text colors */
  text: ColorPalette;
  /** Custom color palettes */
  custom?: Record<string, ColorPalette>;
}

// ============================================================================
// Unit System Interfaces
// ============================================================================

/**
 * Unit scale from 0-10 for consistent spacing and sizing
 */
export interface UnitScale {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  10: number;
}

/**
 * Shadow definitions for elevation
 */
export interface ShadowScale {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

/**
 * Unit system for spacing, sizing, and shadows
 */
export interface UnitSystem {
  /** Spacing scale (margins, padding) */
  space: UnitScale;
  /** Sizing scale (width, height) */
  size: UnitScale;
  /** Border radius scale */
  radius: UnitScale;
  /** Shadow definitions */
  shadow: ShadowScale;
}

// ============================================================================
// Typography System Interfaces
// ============================================================================

/**
 * Font family definitions
 */
export interface FontFamilySystem {
  /** Primary font family for body text */
  primary: string;
  /** Secondary font family for headings */
  secondary: string;
  /** Monospace font family for code */
  mono: string;
}

/**
 * Font size scale
 */
export interface FontSizeScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

/**
 * Font weight scale
 */
export interface FontWeightScale {
  thin: number;
  extralight: number;
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
  black: number;
}

/**
 * Line height scale
 */
export interface LineHeightScale {
  none: number;
  tight: number;
  snug: number;
  normal: number;
  relaxed: number;
  loose: number;
}

/**
 * Letter spacing scale
 */
export interface LetterSpacingScale {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
}

/**
 * Complete typography system
 */
export interface TypographySystem {
  /** Font family definitions */
  fontFamily: FontFamilySystem;
  /** Font size scale */
  fontSize: FontSizeScale;
  /** Font weight scale */
  fontWeight: FontWeightScale;
  /** Line height scale */
  lineHeight: LineHeightScale;
  /** Letter spacing scale */
  letterSpacing: LetterSpacingScale;
}

// ============================================================================
// Breakpoint System Interfaces
// ============================================================================

/**
 * Breakpoint values in pixels
 */
export interface BreakpointValues {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

/**
 * Breakpoint labels for semantic naming
 */
export interface BreakpointLabels {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

/**
 * Complete breakpoint system
 */
export interface BreakpointSystem {
  /** Breakpoint values in pixels */
  values: BreakpointValues;
  /** Semantic labels for breakpoints */
  labels: BreakpointLabels;
}

// ============================================================================
// Animation System Interfaces
// ============================================================================

/**
 * Animation duration scale in milliseconds
 */
export interface DurationScale {
  instant: number;
  fast: number;
  normal: number;
  slow: number;
  slower: number;
  slowest: number;
}

/**
 * Easing function definitions
 */
export interface EasingFunctions {
  linear: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
  easeInQuad: string;
  easeOutQuad: string;
  easeInOutQuad: string;
  easeInCubic: string;
  easeOutCubic: string;
  easeInOutCubic: string;
  easeInQuart: string;
  easeOutQuart: string;
  easeInOutQuart: string;
  easeInQuint: string;
  easeOutQuint: string;
  easeInOutQuint: string;
  easeInExpo: string;
  easeOutExpo: string;
  easeInOutExpo: string;
  easeInCirc: string;
  easeOutCirc: string;
  easeInOutCirc: string;
  easeInBack: string;
  easeOutBack: string;
  easeInOutBack: string;
}

/**
 * Animation defaults for the theme
 */
export interface AnimationDefaults {
  /** Duration scale */
  duration: DurationScale;
  /** Easing functions */
  easing: EasingFunctions;
}

// ============================================================================
// Z-Index System Interface
// ============================================================================

/**
 * Z-index management for layering
 */
export interface ZIndexSystem {
  /** Base z-index for normal content */
  base: number;
  /** Dropdown menus */
  dropdown: number;
  /** Sticky elements */
  sticky: number;
  /** Fixed elements */
  fixed: number;
  /** Modal backdrop */
  modalBackdrop: number;
  /** Modal content */
  modal: number;
  /** Popover elements */
  popover: number;
  /** Tooltip elements */
  tooltip: number;
  /** Notification/toast elements */
  notification: number;
}

// ============================================================================
// Main Theme Interface
// ============================================================================

/**
 * Complete RHUDS Pro theme definition
 * 
 * This is the main theme interface that combines all subsystems
 * into a cohesive, type-safe theme object.
 */
export interface RHUDSTheme {
  /** Theme metadata */
  name?: string;
  version?: string;
  
  /** Color system with semantic palettes */
  colors: ColorSystem;
  
  /** Unit system for spacing, sizing, and shadows */
  units: UnitSystem;
  
  /** Typography system */
  typography: TypographySystem;
  
  /** Breakpoint system for responsive design */
  breakpoints: BreakpointSystem;
  
  /** Animation defaults */
  animation: AnimationDefaults;
  
  /** Z-index management */
  zIndex: ZIndexSystem;
}

// ============================================================================
// Theme Configuration Interfaces
// ============================================================================

/**
 * Partial theme configuration for theme creation
 */
export type ThemeConfig = Partial<RHUDSTheme>;

/**
 * Deep partial type for nested theme configuration
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Theme override configuration
 */
export type ThemeOverride = DeepPartial<RHUDSTheme>;

// ============================================================================
// Color Manipulation Types
// ============================================================================

/**
 * RGB color representation
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * HSL color representation
 */
export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Color variation options
 */
export interface VariationOptions {
  /** Number of lighter variations */
  lighterSteps?: number;
  /** Number of darker variations */
  darkerSteps?: number;
  /** Amount to adjust lightness per step */
  lightnessStep?: number;
}

// ============================================================================
// Serialization Types
// ============================================================================

/**
 * Serializable theme format (without functions)
 */
export interface SerializableTheme extends Omit<RHUDSTheme, 'colors'> {
  colors: {
    primary: Omit<ColorPalette, 'alpha'>;
    secondary: Omit<ColorPalette, 'alpha'>;
    success: Omit<ColorPalette, 'alpha'>;
    warning: Omit<ColorPalette, 'alpha'>;
    error: Omit<ColorPalette, 'alpha'>;
    info: Omit<ColorPalette, 'alpha'>;
    neutral: Omit<ColorPalette, 'alpha'>;
    background: Omit<ColorPalette, 'alpha'>;
    text: Omit<ColorPalette, 'alpha'>;
    custom?: Record<string, Omit<ColorPalette, 'alpha'>>;
  };
}
