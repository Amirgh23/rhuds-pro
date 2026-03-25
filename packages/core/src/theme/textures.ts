/**
 * Texture Effects for Cold War Redesign
 * CRT scanlines, noise, phosphor glow, and flicker effects
 */

export type TextureIntensity = 'low' | 'medium' | 'high';

/**
 * Convert hex color to RGB string for use in rgba()
 * @param hex - Hex color value
 * @returns RGB string (e.g., "255, 176, 0")
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  return '0, 0, 0';
}

/**
 * Scanline effect generator
 * Creates horizontal CRT scanlines
 */
export const SCANLINE_EFFECTS = {
  low: {
    backgroundImage: `repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.08),
      rgba(0, 0, 0, 0.08) 1px,
      transparent 1px,
      transparent 3px
    )`,
    backgroundSize: '100% 3px',
    backgroundPosition: '0 0',
  },
  medium: {
    backgroundImage: `repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 3px
    )`,
    backgroundSize: '100% 3px',
    backgroundPosition: '0 0',
  },
  high: {
    backgroundImage: `repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.25),
      rgba(0, 0, 0, 0.25) 1px,
      transparent 1px,
      transparent 3px
    )`,
    backgroundSize: '100% 3px',
    backgroundPosition: '0 0',
  },
};

/**
 * Noise/grain overlay generator
 * Creates subtle fractal noise texture
 */
export const NOISE_EFFECTS = {
  low: {
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/></filter><rect width="100" height="100" fill="rgba(0,0,0,0.02)" filter="url(%23noise)"/></svg>')`,
    backgroundSize: '100px 100px',
  },
  medium: {
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/></filter><rect width="100" height="100" fill="rgba(0,0,0,0.04)" filter="url(%23noise)"/></svg>')`,
    backgroundSize: '100px 100px',
  },
  high: {
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/></filter><rect width="100" height="100" fill="rgba(0,0,0,0.06)" filter="url(%23noise)"/></svg>')`,
    backgroundSize: '100px 100px',
  },
};

/**
 * Phosphor glow effect generator
 * Creates text shadow glow effect
 */
export function createPhosphorGlow(color: string, intensity: TextureIntensity = 'medium'): string {
  const intensityMap = {
    low: { inner: 0.3, mid: 0.15, outer: 0.05 },
    medium: { inner: 0.5, mid: 0.3, outer: 0.1 },
    high: { inner: 0.7, mid: 0.5, outer: 0.2 },
  };

  const vals = intensityMap[intensity];
  const rgb = hexToRgb(color);
  return `0 0 10px rgba(${rgb}, ${vals.inner}), 0 0 20px rgba(${rgb}, ${vals.mid}), 0 0 30px rgba(${rgb}, ${vals.outer})`;
}

/**
 * CRT flicker animation keyframes
 */
export const CRT_FLICKER_ANIMATION = `
  @keyframes crt-flicker {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.98;
    }
  }
`;

/**
 * Scanline pulse animation keyframes
 */
export const SCANLINE_PULSE_ANIMATION = `
  @keyframes scanline-pulse {
    0%, 100% {
      opacity: 0.15;
    }
    50% {
      opacity: 0.25;
    }
  }
`;

/**
 * Glitch animation keyframes
 */
export const GLITCH_ANIMATION = `
  @keyframes glitch {
    0%, 100% {
      transform: translate(0);
    }
    20% {
      transform: translate(-2px, 2px);
    }
    40% {
      transform: translate(-2px, -2px);
    }
    60% {
      transform: translate(2px, 2px);
    }
    80% {
      transform: translate(2px, -2px);
    }
  }
`;

/**
 * Button hover animation keyframes
 */
export const BUTTON_HOVER_ANIMATION = `
  @keyframes button-hover {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 rgba(255, 176, 0, 0);
    }
    100% {
      transform: scale(1.05);
      box-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
    }
  }
`;

/**
 * CSS utility classes for texture effects
 */
export const TEXTURE_UTILITIES = {
  scanlines: {
    low: SCANLINE_EFFECTS.low,
    medium: SCANLINE_EFFECTS.medium,
    high: SCANLINE_EFFECTS.high,
  },
  noise: {
    low: NOISE_EFFECTS.low,
    medium: NOISE_EFFECTS.medium,
    high: NOISE_EFFECTS.high,
  },
  flicker: {
    animation: 'crt-flicker 0.15s infinite',
  },
  glitch: {
    animation: 'glitch 100ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

/**
 * Reduced motion support
 */
export const REDUCED_MOTION_STYLES = `
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

/**
 * Get texture effect by name and intensity
 * @param effectType - Type of texture effect
 * @param intensity - Effect intensity
 * @returns CSS properties object
 */
export function getTextureEffect(
  effectType: 'scanlines' | 'noise' | 'flicker' | 'glitch',
  intensity: TextureIntensity = 'medium'
): Record<string, any> {
  switch (effectType) {
    case 'scanlines':
      return TEXTURE_UTILITIES.scanlines[intensity];
    case 'noise':
      return TEXTURE_UTILITIES.noise[intensity];
    case 'flicker':
      return TEXTURE_UTILITIES.flicker;
    case 'glitch':
      return TEXTURE_UTILITIES.glitch;
    default:
      return {};
  }
}
