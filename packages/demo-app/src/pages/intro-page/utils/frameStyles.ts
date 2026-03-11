/**
 * Frame Component Styling Utilities
 * Defines consistent styling for Arwes frame components
 */

export interface FrameStyleConfig {
  padding: number; // in pixels
  squareSize: number; // in pixels
  color: string; // hex or rgba
  glowIntensity: number; // 0-1
}

/**
 * Default frame styling configuration
 */
export const DEFAULT_FRAME_STYLE: FrameStyleConfig = {
  padding: 8, // 4-8px range
  squareSize: 20, // 12-32px range
  color: '#29F2DF', // Cyan
  glowIntensity: 0.8,
};

/**
 * Frame size presets
 */
export const FRAME_SIZE_PRESETS = {
  small: {
    padding: 4,
    squareSize: 12,
  },
  medium: {
    padding: 6,
    squareSize: 20,
  },
  large: {
    padding: 8,
    squareSize: 32,
  },
};

/**
 * Get frame styling for a specific size
 */
export const getFrameStyle = (
  size: 'small' | 'medium' | 'large' = 'medium',
  color: string = '#29F2DF'
): FrameStyleConfig => {
  const preset = FRAME_SIZE_PRESETS[size];
  return {
    ...preset,
    color,
    glowIntensity: 0.8,
  };
};

/**
 * Get glow effect for frame
 */
export const getFrameGlowEffect = (color: string = '#29F2DF', intensity: number = 0.8): string => {
  const baseGlow = `0 0 ${15 * intensity}px ${color}`;
  const secondaryGlow = `0 0 ${30 * intensity}px ${color}`;
  const tertiaryGlow = `0 0 ${50 * intensity}px ${color}`;

  return `drop-shadow(${baseGlow}) drop-shadow(${secondaryGlow}) drop-shadow(${tertiaryGlow})`;
};

/**
 * Get frame container styles
 */
export const getFrameContainerStyles = (
  config: FrameStyleConfig = DEFAULT_FRAME_STYLE
): React.CSSProperties => {
  return {
    padding: `${config.padding}px`,
    position: 'relative',
    overflow: 'hidden',
    ,
  };
};

/**
 * Get frame SVG styles
 */
export const getFrameSVGStyles = (
  config: FrameStyleConfig = DEFAULT_FRAME_STYLE
): React.CSSProperties => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    filter: getFrameGlowEffect(config.color, config.glowIntensity),
  };
};

/**
 * Validate frame style configuration
 */
export const validateFrameStyle = (
  config: FrameStyleConfig
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (config.padding < 4 || config.padding > 8) {
    errors.push('Frame padding should be between 4px and 8px');
  }

  if (config.squareSize < 12 || config.squareSize > 32) {
    errors.push('Frame square size should be between 12px and 32px');
  }

  if (config.glowIntensity < 0 || config.glowIntensity > 1) {
    errors.push('Glow intensity should be between 0 and 1');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Create custom frame style configuration
 */
export const createFrameStyle = (overrides: Partial<FrameStyleConfig> = {}): FrameStyleConfig => {
  const config = { ...DEFAULT_FRAME_STYLE, ...overrides };
  const validation = validateFrameStyle(config);

  if (!validation.valid) {
    console.warn('Invalid frame style configuration:', validation.errors);
  }

  return config;
};

/**
 * Get frame animation styles
 */
export const getFrameAnimationStyles = (): React.CSSProperties => {
  return {
    animation: 'frameAssemble 1.5s ease-out forwards',
    transformOrigin: 'center',
  };
};

/**
 * Get frame hover effect styles
 */
export const getFrameHoverStyles = (baseColor: string = '#29F2DF'): React.CSSProperties => {
  return {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: getFrameGlowEffect(baseColor, 1.2),
    transform: 'scale(1.02)',
  };
};

/**
 * Get responsive frame styles based on viewport
 */
export const getResponsiveFrameStyle = (viewportWidth: number): FrameStyleConfig => {
  if (viewportWidth < 768) {
    // Mobile
    return getFrameStyle('small');
  } else if (viewportWidth < 1024) {
    // Tablet
    return getFrameStyle('medium');
  } else {
    // Desktop
    return getFrameStyle('large');
  }
};

/**
 * Get frame color variants
 */
export const FRAME_COLOR_VARIANTS = {
  primary: '#29F2DF', // Cyan
  secondary: '#EF3EF1', // Magenta
  tertiary: '#1C7FA6', // Blue
  accent: '#FFFFFF', // White
};

/**
 * Get frame color by variant
 */
export const getFrameColorVariant = (
  variant: keyof typeof FRAME_COLOR_VARIANTS = 'primary'
): string => {
  return FRAME_COLOR_VARIANTS[variant];
};

/**
 * Get all frame styles for a component
 */
export const getCompleteFrameStyles = (
  size: 'small' | 'medium' | 'large' = 'medium',
  colorVariant: keyof typeof FRAME_COLOR_VARIANTS = 'primary'
): {
  container: React.CSSProperties;
  svg: React.CSSProperties;
  animation: React.CSSProperties;
  hover: React.CSSProperties;
} => {
  const color = getFrameColorVariant(colorVariant);
  const config = getFrameStyle(size, color);

  return {
    container: getFrameContainerStyles(config),
    svg: getFrameSVGStyles(config),
    animation: getFrameAnimationStyles(),
    hover: getFrameHoverStyles(color),
  };
};
