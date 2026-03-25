/**
 * Geometry Utilities for Cold War Redesign
 * Provides chamfered corner utilities using clip-path
 */

export type ChamferSize = 'small' | 'medium' | 'large';

/**
 * Chamfer size mappings in pixels
 */
export const CHAMFER_SIZES: Record<ChamferSize, number> = {
  small: 8,
  medium: 12,
  large: 16,
};

/**
 * Generate clip-path value for chamfered corners
 * @param size - Chamfer size in pixels or preset ('small', 'medium', 'large')
 * @returns CSS clip-path value
 */
export function createChamferClip(size: number | ChamferSize): string {
  const chamferPx = typeof size === 'number' ? size : CHAMFER_SIZES[size];
  return `polygon(${chamferPx}px 0, 100% 0, 100% calc(100% - ${chamferPx}px), calc(100% - ${chamferPx}px) 100%, 0 100%, 0 ${chamferPx}px)`;
}

/**
 * Get chamfer size based on component type
 * @param componentType - Type of component
 * @returns Chamfer size in pixels
 */
export function getChamferSize(
  componentType: 'button' | 'input' | 'card' | 'modal' | 'default'
): number {
  const sizeMap: Record<string, number> = {
    button: CHAMFER_SIZES.small,
    input: CHAMFER_SIZES.medium,
    card: CHAMFER_SIZES.medium,
    modal: CHAMFER_SIZES.large,
    default: CHAMFER_SIZES.medium,
  };
  return sizeMap[componentType] || CHAMFER_SIZES.medium;
}

/**
 * Generate CSS clip-path for component
 * @param componentType - Type of component
 * @returns CSS clip-path value
 */
export function getComponentChamferClip(
  componentType: 'button' | 'input' | 'card' | 'modal' | 'default'
): string {
  const size = getChamferSize(componentType);
  return createChamferClip(size);
}

/**
 * CSS utility class generator for chamfered corners
 */
export const chamferUtilities = {
  small: `clip-path: ${createChamferClip('small')};`,
  medium: `clip-path: ${createChamferClip('medium')};`,
  large: `clip-path: ${createChamferClip('large')};`,
  button: `clip-path: ${getComponentChamferClip('button')};`,
  input: `clip-path: ${getComponentChamferClip('input')};`,
  card: `clip-path: ${getComponentChamferClip('card')};`,
  modal: `clip-path: ${getComponentChamferClip('modal')};`,
};

/**
 * Border specifications for Cold War aesthetic
 */
export const BORDER_SPECS = {
  primary: {
    width: '1px',
    color: '#FFB000', // Tactical Amber
  },
  secondary: {
    width: '1px',
    color: '#2a2a2e', // Medium Gray
  },
  accent: {
    width: '2px',
    color: '#FFB000', // Tactical Amber
  },
  disabled: {
    width: '1px',
    color: '#3a3a3e', // Light Gray
  },
};

/**
 * Spacing scale (8px grid)
 */
export const SPACING_SCALE = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
};

/**
 * Shadow specifications
 */
export const SHADOW_SPECS = {
  none: 'none',
  low: '0 2px 4px rgba(0, 0, 0, 0.3)',
  medium: '0 4px 8px rgba(0, 0, 0, 0.4)',
  high: '0 8px 16px rgba(0, 0, 0, 0.5)',
};
