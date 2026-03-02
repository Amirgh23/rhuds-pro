/**
 * Interpolate between two colors
 */
export function interpolateColor(color1: string, color2: string, progress: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * progress);
  const g = Math.round(g1 + (g2 - g1) * progress);
  const b = Math.round(b1 + (b2 - b1) * progress);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Create color transition keyframes
 */
export function createColorTransitionKeyframes(
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
