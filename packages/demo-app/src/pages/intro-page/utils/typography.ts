/**
 * Typography System for Intro Page
 * Defines consistent text styling following Arwes design language
 */

export interface TypographyConfig {
  fontFamily: string;
  colors: {
    heading: string;
    body: string;
    accent: string;
    secondary: string;
  };
  sizes: {
    h1: string;
    h2: string;
    h3: string;
    body: string;
    small: string;
  };
  effects: {
    headingGlow: string;
    bodyGlow: string;
  };
}

/**
 * Default typography configuration for Arwes-style intro page
 */
export const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  colors: {
    heading: '#29F2DF', // Cyan
    body: '#C8D8E8', // Light cyan with reduced opacity
    accent: '#EF3EF1', // Magenta
    secondary: '#1C7FA6', // Blue
  },
  sizes: {
    h1: 'clamp(40px, 8vw, 72px)',
    h2: 'clamp(28px, 6vw, 48px)',
    h3: 'clamp(20px, 4vw, 32px)',
    body: 'clamp(14px, 2vw, 18px)',
    small: 'clamp(12px, 1.5vw, 16px)',
  },
  effects: {
    headingGlow: `
      0 0 30px rgba(41, 242, 223, 0.5),
      0 0 60px rgba(239, 62, 241, 0.3),
      0 0 90px rgba(28, 127, 166, 0.2)
    `,
    bodyGlow: `
      0 2px 12px rgba(0, 0, 0, 0.8),
      0 0 20px rgba(41, 242, 223, 0.2)
    `,
  },
};

/**
 * Get heading styles
 */
export const getHeadingStyles = (level: 'h1' | 'h2' | 'h3' = 'h1') => ({
  fontFamily: DEFAULT_TYPOGRAPHY.fontFamily,
  fontSize: DEFAULT_TYPOGRAPHY.sizes[level],
  fontWeight: '900',
  color: DEFAULT_TYPOGRAPHY.colors.heading,
  textShadow: DEFAULT_TYPOGRAPHY.effects.headingGlow,
  letterSpacing: '1px',
  lineHeight: '1.2',
});

/**
 * Get body text styles
 */
export const getBodyStyles = () => ({
  fontFamily: DEFAULT_TYPOGRAPHY.fontFamily,
  fontSize: DEFAULT_TYPOGRAPHY.sizes.body,
  color: DEFAULT_TYPOGRAPHY.colors.body,
  textShadow: DEFAULT_TYPOGRAPHY.effects.bodyGlow,
  lineHeight: '1.6',
  fontWeight: '400',
});

/**
 * Get accent text styles
 */
export const getAccentStyles = () => ({
  fontFamily: DEFAULT_TYPOGRAPHY.fontFamily,
  color: DEFAULT_TYPOGRAPHY.colors.accent,
  fontWeight: '700',
  textShadow: `0 0 20px rgba(239, 62, 241, 0.8)`,
});

/**
 * Get small text styles
 */
export const getSmallStyles = () => ({
  fontFamily: DEFAULT_TYPOGRAPHY.fontFamily,
  fontSize: DEFAULT_TYPOGRAPHY.sizes.small,
  color: DEFAULT_TYPOGRAPHY.colors.body,
  opacity: 0.8,
  fontWeight: '400',
});

/**
 * Validate typography contrast ratios
 * Returns true if contrast meets WCAG AA standards
 */
export const validateContrast = (
  foreground: string,
  background: string
): { valid: boolean; ratio: number } => {
  // Simplified contrast calculation
  // In production, use a proper color contrast library
  const getLuminance = (color: string): number => {
    // Extract RGB values from color string
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) return 0.5;

    const [r, g, b] = match.map((v) => parseInt(v) / 255);

    // Calculate relative luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    valid: ratio >= 4.5, // WCAG AA standard for normal text
    ratio: Math.round(ratio * 100) / 100,
  };
};

/**
 * Get responsive font size using clamp
 */
export const getResponsiveFontSize = (
  minSize: number,
  maxSize: number,
  minViewport: number = 320,
  maxViewport: number = 1920
): string => {
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const intercept = minSize - slope * minViewport;

  return `clamp(${minSize}px, ${intercept}px + ${slope * 100}vw, ${maxSize}px)`;
};

/**
 * Create custom typography configuration
 */
export const createTypographyConfig = (
  overrides: Partial<TypographyConfig> = {}
): TypographyConfig => {
  return {
    ...DEFAULT_TYPOGRAPHY,
    ...overrides,
    colors: {
      ...DEFAULT_TYPOGRAPHY.colors,
      ...(overrides.colors || {}),
    },
    sizes: {
      ...DEFAULT_TYPOGRAPHY.sizes,
      ...(overrides.sizes || {}),
    },
    effects: {
      ...DEFAULT_TYPOGRAPHY.effects,
      ...(overrides.effects || {}),
    },
  };
};
