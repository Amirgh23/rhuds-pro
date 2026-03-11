/**
 * Color Palette System for Intro Page
 * Defines Arwes-style color scheme with cyan, magenta, and blue tones
 */

export interface ColorPalette {
  primary: string; // Cyan
  secondary: string; // Magenta
  tertiary: string; // Blue
  background: string; // Black
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  effects: {
    glow: string;
    shadow: string;
  };
}

/**
 * Default Arwes color palette for intro page
 */
export const DEFAULT_COLOR_PALETTE: ColorPalette = {
  primary: '#29F2DF', // Cyan
  secondary: '#EF3EF1', // Magenta
  tertiary: '#1C7FA6', // Blue
  background: '#000000', // Black
  text: {
    primary: '#FFFFFF', // White
    secondary: '#C8D8E8', // Light cyan
    accent: '#29F2DF', // Cyan
  },
  effects: {
    glow: 'rgba(41, 242, 223, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.8)',
  },
};

/**
 * Validate that all colors in palette are valid hex or rgba values
 */
export const validateColorPalette = (
  palette: ColorPalette
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const colorRegex = /^(#[0-9A-F]{6}|rgba?\([^)]+\))$/i;

  const validateColor = (color: string, name: string) => {
    if (!colorRegex.test(color)) {
      errors.push(`Invalid color format for ${name}: ${color}`);
    }
  };

  validateColor(palette.primary, 'primary');
  validateColor(palette.secondary, 'secondary');
  validateColor(palette.tertiary, 'tertiary');
  validateColor(palette.background, 'background');
  validateColor(palette.text.primary, 'text.primary');
  validateColor(palette.text.secondary, 'text.secondary');
  validateColor(palette.text.accent, 'text.accent');

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Get color with opacity
 */
export const getColorWithOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

/**
 * Get glow effect for a color
 */
export const getGlowEffect = (color: string, intensity: number = 1): string => {
  const baseGlow = `0 0 ${20 * intensity}px ${color}`;
  const secondaryGlow = `0 0 ${40 * intensity}px ${color}`;
  const tertiaryGlow = `0 0 ${60 * intensity}px ${color}`;

  return `${baseGlow}, ${secondaryGlow}, ${tertiaryGlow}`;
};

/**
 * Get frame color based on type
 */
export const getFrameColor = (type: 'primary' | 'secondary' | 'tertiary' = 'primary'): string => {
  const colors = {
    primary: DEFAULT_COLOR_PALETTE.primary,
    secondary: DEFAULT_COLOR_PALETTE.secondary,
    tertiary: DEFAULT_COLOR_PALETTE.tertiary,
  };
  return colors[type];
};

/**
 * Get background gradient
 */
export const getBackgroundGradient = (): string => {
  return `linear-gradient(180deg, #000000 0%, #0a0a0f 50%, #000000 100%)`;
};

/**
 * Get glassmorphism effect
 */
export const getGlassmorphismEffect = (
  primaryColor: string = DEFAULT_COLOR_PALETTE.primary,
  opacity: number = 0.1
): {
  background: string;
  backdropFilter: string;
  border: string;
} => {
  return {
    background: `linear-gradient(135deg, ${getColorWithOpacity(primaryColor, opacity)} 0%, rgba(239, 62, 241, ${opacity}) 100%)`,
    backdropFilter: 'blur(40px) saturate(200%)',
    border: `2px solid ${getColorWithOpacity(primaryColor, 0.4)}`,
  };
};

/**
 * Create custom color palette
 */
export const createColorPalette = (overrides: Partial<ColorPalette> = {}): ColorPalette => {
  const palette = {
    ...DEFAULT_COLOR_PALETTE,
    ...overrides,
    text: {
      ...DEFAULT_COLOR_PALETTE.text,
      ...(overrides.text || {}),
    },
    effects: {
      ...DEFAULT_COLOR_PALETTE.effects,
      ...(overrides.effects || {}),
    },
  };

  const validation = validateColorPalette(palette);
  if (!validation.valid) {
    console.warn('Invalid color palette:', validation.errors);
  }

  return palette;
};

/**
 * Get color contrast information
 */
export const getColorContrast = (
  foreground: string,
  background: string
): { ratio: number; wcagAA: boolean; wcagAAA: boolean } => {
  // Simplified contrast calculation
  const getLuminance = (color: string): number => {
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) return 0.5;

    const [r, g, b] = match.map((v) => parseInt(v) / 255);
    return 0.299 * r + 0.587 * g + 0.114 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
  };
};

/**
 * Get all colors from palette as array
 */
export const getPaletteColors = (palette: ColorPalette = DEFAULT_COLOR_PALETTE): string[] => {
  return [
    palette.primary,
    palette.secondary,
    palette.tertiary,
    palette.background,
    palette.text.primary,
    palette.text.secondary,
    palette.text.accent,
  ];
};
