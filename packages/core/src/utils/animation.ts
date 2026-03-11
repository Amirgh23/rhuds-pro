import { interpolateColor } from '../theme/colorUtils';

/**
 * Create color transition keyframes (simple version)
 */
export function createColorTransitionKeyframesSimple(
  startColor: string,
  endColor: string,
  steps: number
): string[] {
  const keyframes: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    keyframes.push(interpolateColor(startColor, endColor, progress));
  }

  return keyframes;
}

// Re-export for convenience
export { interpolateColor } from '../theme/colorUtils';
