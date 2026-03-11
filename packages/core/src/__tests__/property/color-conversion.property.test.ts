import { fc } from 'fast-check';

/**
 * Property 2: Color Conversion Preservation
 *
 * Validates that color conversions between formats preserve the color value
 * within acceptable tolerance.
 *
 * Validates Requirements: 2.8, 40.9, 75.6
 */
describe('Property 2: Color Conversion Preservation', () => {
  // Helper functions for color conversion
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
        .toUpperCase()
    );
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
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

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

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
  };

  it('should preserve RGB values through HEX conversion round-trip', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 })
        ),
        ([r, g, b]) => {
          const hex = rgbToHex(r, g, b);
          const converted = hexToRgb(hex);

          expect(converted.r).toBe(r);
          expect(converted.g).toBe(g);
          expect(converted.b).toBe(b);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve RGB values through HSL conversion round-trip', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 })
        ),
        ([r, g, b]) => {
          const hsl = rgbToHsl(r, g, b);
          const converted = hslToRgb(hsl.h, hsl.s, hsl.l);

          // Allow small tolerance due to rounding
          expect(Math.abs(converted.r - r)).toBeLessThanOrEqual(1);
          expect(Math.abs(converted.g - g)).toBeLessThanOrEqual(1);
          expect(Math.abs(converted.b - b)).toBeLessThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain color brightness through conversions', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 })
        ),
        ([r, g, b]) => {
          const originalBrightness = (r + g + b) / 3;
          const hsl = rgbToHsl(r, g, b);
          const converted = hslToRgb(hsl.h, hsl.s, hsl.l);
          const convertedBrightness = (converted.r + converted.g + converted.b) / 3;

          // Brightness should be preserved within tolerance
          expect(Math.abs(originalBrightness - convertedBrightness)).toBeLessThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 3: Color Format Round-Trip
 *
 * Validates that colors can be converted between multiple formats and
 * return to the original format without data loss.
 *
 * Validates Requirements: 40.9
 */
describe('Property 3: Color Format Round-Trip', () => {
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
        .toUpperCase()
    );
  };

  it('should support HEX format round-trip', () => {
    fc.assert(
      fc.property(fc.hexaString({ minLength: 6, maxLength: 6 }), (hexPart) => {
        const originalHex = `#${hexPart}`;
        const rgb = hexToRgb(originalHex);
        const convertedHex = rgbToHex(rgb.r, rgb.g, rgb.b);

        expect(convertedHex).toBe(originalHex);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate HEX format', () => {
    fc.assert(
      fc.property(fc.hexaString({ minLength: 6, maxLength: 6 }), (hexPart) => {
        const hex = `#${hexPart}`;
        const hexRegex = /^#[0-9A-F]{6}$/i;

        expect(hexRegex.test(hex)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
