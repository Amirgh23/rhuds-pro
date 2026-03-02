/**
 * Property-based tests for Color System
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  lighten,
  darken,
  getContrastRatio,
} from '../../theme/colorUtils';

describe('Property Tests: Color System', () => {
  /**
   * Property 2: Color Conversion Preservation
   * Validates: Requirements 2.8, 40.9, 75.6
   * 
   * Converting RGB -> HSL -> RGB should preserve the original color
   */
  it('should preserve color through RGB -> HSL -> RGB conversion', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        (r, g, b) => {
          const hsl = rgbToHsl(r, g, b);
          const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
          
          // Allow small rounding errors (±1)
          expect(Math.abs(rgb.r - r)).toBeLessThanOrEqual(1);
          expect(Math.abs(rgb.g - g)).toBeLessThanOrEqual(1);
          expect(Math.abs(rgb.b - b)).toBeLessThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: Color Format Round-Trip
   * Validates: Requirements 40.9
   * 
   * Converting HEX -> RGB -> HEX should preserve the original color
   */
  it('should preserve color through HEX -> RGB -> HEX conversion', () => {
    fc.assert(
      fc.property(
        fc.hexaString({ minLength: 6, maxLength: 6 }),
        (hex) => {
          const originalHex = `#${hex}`.toUpperCase();
          const rgb = hexToRgb(originalHex);
          const convertedHex = rgbToHex(rgb.r, rgb.g, rgb.b).toUpperCase();
          
          expect(convertedHex).toBe(originalHex);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Lighten should always increase lightness
   */
  it('should always increase lightness when lightening', () => {
    fc.assert(
      fc.property(
        fc.hexaString({ minLength: 6, maxLength: 6 }),
        fc.double({ min: 0.1, max: 0.5 }),
        (hex, amount) => {
          const original = `#${hex}`;
          const lightened = lighten(original, amount);
          
          const originalRgb = hexToRgb(original);
          const lightenedRgb = hexToRgb(lightened);
          
          const originalHsl = rgbToHsl(originalRgb.r, originalRgb.g, originalRgb.b);
          const lightenedHsl = rgbToHsl(lightenedRgb.r, lightenedRgb.g, lightenedRgb.b);
          
          expect(lightenedHsl.l).toBeGreaterThanOrEqual(originalHsl.l);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Darken should always decrease lightness
   */
  it('should always decrease lightness when darkening', () => {
    fc.assert(
      fc.property(
        fc.hexaString({ minLength: 6, maxLength: 6 }),
        fc.double({ min: 0.1, max: 0.5 }),
        (hex, amount) => {
          const original = `#${hex}`;
          const darkened = darken(original, amount);
          
          const originalRgb = hexToRgb(original);
          const darkenedRgb = hexToRgb(darkened);
          
          const originalHsl = rgbToHsl(originalRgb.r, originalRgb.g, originalRgb.b);
          const darkenedHsl = rgbToHsl(darkenedRgb.r, darkenedRgb.g, darkenedRgb.b);
          
          expect(darkenedHsl.l).toBeLessThanOrEqual(originalHsl.l);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Contrast ratio should be symmetric
   */
  it('should have symmetric contrast ratio', () => {
    fc.assert(
      fc.property(
        fc.hexaString({ minLength: 6, maxLength: 6 }),
        fc.hexaString({ minLength: 6, maxLength: 6 }),
        (hex1, hex2) => {
          const color1 = `#${hex1}`;
          const color2 = `#${hex2}`;
          
          const ratio1 = getContrastRatio(color1, color2);
          const ratio2 = getContrastRatio(color2, color1);
          
          expect(Math.abs(ratio1 - ratio2)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Contrast ratio should be between 1 and 21
   */
  it('should have contrast ratio between 1 and 21', () => {
    fc.assert(
      fc.property(
        fc.hexaString({ minLength: 6, maxLength: 6 }),
        fc.hexaString({ minLength: 6, maxLength: 6 }),
        (hex1, hex2) => {
          const color1 = `#${hex1}`;
          const color2 = `#${hex2}`;
          
          const ratio = getContrastRatio(color1, color2);
          
          expect(ratio).toBeGreaterThanOrEqual(1);
          expect(ratio).toBeLessThanOrEqual(21);
        }
      ),
      { numRuns: 50 }
    );
  });
});
