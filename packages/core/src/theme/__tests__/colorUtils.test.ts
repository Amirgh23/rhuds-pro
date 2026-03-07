/**
 * Unit tests for color manipulation utilities
 * Requirements: 2.1-2.4
 */

import { describe, it, expect } from 'vitest';
import {
  // Color conversion
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  
  // Color manipulation
  lighten,
  darken,
  saturate,
  desaturate,
  generateColorVariations,
  
  // Alpha channel
  alpha,
  createAlphaFunction,
  
  // Gradients
  createGradient,
  createLinearGradient,
  createRadialGradient,
  createConicGradient,
  
  // Animated transitions
  interpolateColor,
  createColorTransitionKeyframes,
  createColorTransitionAnimation,
  animateGradient,
  
  // Utilities
  isValidHexColor,
  parseColor,
  
  // Accessibility (Requirement 2.6)
  getContrastRatio,
  meetsWCAG,
  findAccessibleColor,
  getAccessibilityInfo,
  
  // Validation (Requirement 2.5)
  detectColorFormat,
  isValidColor,
  isValidRgbColor,
  isValidRgbaColor,
  isValidHslColor,
  isValidHslaColor,
  normalizeColor,
  validateAndParseColor,
} from '../colorUtils';

describe('Color Conversion Functions', () => {
  describe('hexToRgb', () => {
    it('should convert 6-digit hex to RGB', () => {
      const result = hexToRgb('#29F2DF');
      expect(result).toEqual({ r: 0, g: 246, b: 255 });
    });

    it('should convert 3-digit hex to RGB', () => {
      const result = hexToRgb('#0ff');
      expect(result).toEqual({ r: 0, g: 255, b: 255 });
    });

    it('should handle hex without # prefix', () => {
      const result = hexToRgb('00f6ff');
      expect(result).toEqual({ r: 0, g: 246, b: 255 });
    });

    it('should throw error for invalid hex', () => {
      expect(() => hexToRgb('invalid')).toThrow('Invalid hex color');
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB to hex', () => {
      const result = rgbToHex({ r: 0, g: 246, b: 255 });
      expect(result).toBe('#29F2DF');
    });

    it('should handle edge values', () => {
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
    });

    it('should clamp values outside 0-255 range', () => {
      const result = rgbToHex({ r: -10, g: 300, b: 128 });
      expect(result).toBe('#00ff80');
    });
  });

  describe('rgbToHsl and hslToRgb', () => {
    it('should convert RGB to HSL', () => {
      const result = rgbToHsl({ r: 0, g: 246, b: 255 });
      expect(result.h).toBeCloseTo(182, 0);
      expect(result.s).toBeCloseTo(100, 0);
      expect(result.l).toBeCloseTo(50, 0);
    });

    it('should convert HSL to RGB', () => {
      const result = hslToRgb({ h: 182, s: 100, l: 50 });
      expect(result.r).toBeCloseTo(0, 0);
      expect(result.g).toBeCloseTo(246, 0);
      expect(result.b).toBeCloseTo(255, 0);
    });

    it('should handle grayscale colors', () => {
      const gray = rgbToHsl({ r: 128, g: 128, b: 128 });
      expect(gray.s).toBe(0);
      expect(gray.l).toBeCloseTo(50, 0);
    });
  });
});

describe('Color Manipulation Functions (Requirement 2.1)', () => {
  const testColor = '#29F2DF';

  describe('lighten', () => {
    it('should lighten a color', () => {
      const result = lighten(testColor, 20);
      const originalHsl = rgbToHsl(hexToRgb(testColor));
      const resultHsl = rgbToHsl(hexToRgb(result));
      
      expect(resultHsl.l).toBeGreaterThan(originalHsl.l);
      expect(resultHsl.l).toBeCloseTo(originalHsl.l + 20, 0);
    });

    it('should not exceed 100% lightness', () => {
      const result = lighten(testColor, 100);
      const resultHsl = rgbToHsl(hexToRgb(result));
      expect(resultHsl.l).toBeLessThanOrEqual(100);
    });
  });

  describe('darken', () => {
    it('should darken a color', () => {
      const result = darken(testColor, 20);
      const originalHsl = rgbToHsl(hexToRgb(testColor));
      const resultHsl = rgbToHsl(hexToRgb(result));
      
      expect(resultHsl.l).toBeLessThan(originalHsl.l);
      expect(resultHsl.l).toBeCloseTo(originalHsl.l - 20, 0);
    });

    it('should not go below 0% lightness', () => {
      const result = darken(testColor, 100);
      const resultHsl = rgbToHsl(hexToRgb(result));
      expect(resultHsl.l).toBeGreaterThanOrEqual(0);
    });
  });

  describe('saturate', () => {
    it('should increase saturation', () => {
      const result = saturate(testColor, 20);
      const originalHsl = rgbToHsl(hexToRgb(testColor));
      const resultHsl = rgbToHsl(hexToRgb(result));
      
      // Original is already at 100% saturation, so it should stay at 100%
      expect(resultHsl.s).toBe(100);
    });

    it('should increase saturation of desaturated color', () => {
      const desaturatedColor = '#808080'; // Gray
      const result = saturate(desaturatedColor, 50);
      const resultHsl = rgbToHsl(hexToRgb(result));
      expect(resultHsl.s).toBeGreaterThan(0);
    });
  });

  describe('desaturate', () => {
    it('should decrease saturation', () => {
      const result = desaturate(testColor, 50);
      const originalHsl = rgbToHsl(hexToRgb(testColor));
      const resultHsl = rgbToHsl(hexToRgb(result));
      
      expect(resultHsl.s).toBeLessThan(originalHsl.s);
      expect(resultHsl.s).toBeCloseTo(originalHsl.s - 50, 0);
    });

    it('should not go below 0% saturation', () => {
      const result = desaturate(testColor, 200);
      const resultHsl = rgbToHsl(hexToRgb(result));
      expect(resultHsl.s).toBe(0);
    });
  });

  describe('generateColorVariations', () => {
    it('should generate lighter variations', () => {
      const variations = generateColorVariations(testColor, {
        steps: 5,
        type: 'lighter',
        amount: 10,
      });
      
      expect(variations).toHaveLength(5);
      expect(variations[0]).toBe(testColor);
      
      // Each variation should be lighter than the previous
      for (let i = 1; i < variations.length; i++) {
        const prevL = rgbToHsl(hexToRgb(variations[i - 1])).l;
        const currL = rgbToHsl(hexToRgb(variations[i])).l;
        expect(currL).toBeGreaterThanOrEqual(prevL);
      }
    });

    it('should generate darker variations', () => {
      const variations = generateColorVariations(testColor, {
        steps: 5,
        type: 'darker',
        amount: 10,
      });
      
      expect(variations).toHaveLength(5);
      
      // Each variation should be darker than the previous
      for (let i = 1; i < variations.length; i++) {
        const prevL = rgbToHsl(hexToRgb(variations[i - 1])).l;
        const currL = rgbToHsl(hexToRgb(variations[i])).l;
        expect(currL).toBeLessThanOrEqual(prevL);
      }
    });
  });
});

describe('Alpha Channel Manipulation (Requirement 2.2)', () => {
  const testColor = '#29F2DF';

  describe('alpha', () => {
    it('should add alpha channel to color', () => {
      const result = alpha(testColor, 0.5);
      expect(result).toBe('rgba(41, 242, 223, 0.5)');
    });

    it('should clamp opacity to 0-1 range', () => {
      expect(alpha(testColor, -0.5)).toBe('rgba(41, 242, 223, 0)');
      expect(alpha(testColor, 1.5)).toBe('rgba(41, 242, 223, 1)');
    });

    it('should handle full opacity', () => {
      const result = alpha(testColor, 1);
      expect(result).toBe('rgba(41, 242, 223, 1)');
    });

    it('should handle zero opacity', () => {
      const result = alpha(testColor, 0);
      expect(result).toBe('rgba(41, 242, 223, 0)');
    });
  });

  describe('createAlphaFunction', () => {
    it('should create a function that adds alpha channel', () => {
      const alphaFn = createAlphaFunction(testColor);
      expect(typeof alphaFn).toBe('function');
      expect(alphaFn(0.5)).toBe('rgba(41, 242, 223, 0.5)');
    });

    it('should create reusable alpha function', () => {
      const alphaFn = createAlphaFunction(testColor);
      expect(alphaFn(0.25)).toBe('rgba(41, 242, 223, 0.25)');
      expect(alphaFn(0.75)).toBe('rgba(41, 242, 223, 0.75)');
    });
  });
});

describe('Gradient Definitions (Requirement 2.3)', () => {
  describe('createLinearGradient', () => {
    it('should create linear gradient CSS string', () => {
      const result = createLinearGradient({
        type: 'linear',
        angle: 45,
        stops: [
          { color: '#29F2DF', position: 0 },
          { color: '#1C7FA6', position: 100 },
        ],
      });
      
      expect(result).toBe('linear-gradient(45deg, #29F2DF 0%, #1C7FA6 100%)');
    });

    it('should default angle to 0 if not provided', () => {
      const result = createLinearGradient({
        type: 'linear',
        stops: [
          { color: '#29F2DF', position: 0 },
          { color: '#1C7FA6', position: 100 },
        ],
      });
      
      expect(result).toContain('0deg');
    });

    it('should handle multiple color stops', () => {
      const result = createLinearGradient({
        type: 'linear',
        angle: 90,
        stops: [
          { color: '#29F2DF', position: 0 },
          { color: '#1C7FA6', position: 50 },
          { color: '#ff0055', position: 100 },
        ],
      });
      
      expect(result).toBe('linear-gradient(90deg, #29F2DF 0%, #1C7FA6 50%, #ff0055 100%)');
    });
  });

  describe('createRadialGradient', () => {
    it('should create radial gradient CSS string', () => {
      const result = createRadialGradient({
        type: 'radial',
        stops: [
          { color: '#29F2DF', position: 0 },
          { color: '#1C7FA6', position: 100 },
        ],
      });
      
      expect(result).toBe('radial-gradient(circle, #29F2DF 0%, #1C7FA6 100%)');
    });
  });

  describe('createConicGradient', () => {
    it('should create conic gradient CSS string', () => {
      const result = createConicGradient({
        type: 'conic',
        angle: 0,
        stops: [
          { color: '#29F2DF', position: 0 },
          { color: '#1C7FA6', position: 100 },
        ],
      });
      
      expect(result).toBe('conic-gradient(from 0deg, #29F2DF 0%, #1C7FA6 100%)');
    });
  });

  describe('createGradient', () => {
    it('should create gradient based on type', () => {
      const linear = createGradient({
        type: 'linear',
        angle: 45,
        stops: [
          { color: '#29F2DF', position: 0 },
          { color: '#1C7FA6', position: 100 },
        ],
      });
      
      expect(linear).toContain('linear-gradient');
    });

    it('should throw error for unknown gradient type', () => {
      expect(() =>
        createGradient({
          type: 'unknown' as any,
          stops: [],
        })
      ).toThrow('Unknown gradient type');
    });
  });
});

describe('Animated Color Transitions (Requirement 2.4)', () => {
  describe('interpolateColor', () => {
    it('should interpolate between two colors', () => {
      const result = interpolateColor('#000000', '#ffffff', 0.5);
      const rgb = hexToRgb(result);
      
      // Should be approximately gray
      expect(rgb.r).toBeCloseTo(128, 5);
      expect(rgb.g).toBeCloseTo(128, 5);
      expect(rgb.b).toBeCloseTo(128, 5);
    });

    it('should return start color at progress 0', () => {
      const result = interpolateColor('#29F2DF', '#1C7FA6', 0);
      expect(result).toBe('#29F2DF');
    });

    it('should return end color at progress 1', () => {
      const result = interpolateColor('#29F2DF', '#1C7FA6', 1);
      expect(result).toBe('#1C7FA6');
    });

    it('should clamp progress to 0-1 range', () => {
      const result1 = interpolateColor('#000000', '#ffffff', -0.5);
      expect(result1).toBe('#000000');
      
      const result2 = interpolateColor('#000000', '#ffffff', 1.5);
      expect(result2).toBe('#ffffff');
    });
  });

  describe('createColorTransitionKeyframes', () => {
    it('should create simple two-color transition', () => {
      const result = createColorTransitionKeyframes('fadeColor', {
        from: '#29F2DF',
        to: '#1C7FA6',
        duration: 1000,
      });
      
      expect(result).toContain('@keyframes fadeColor');
      expect(result).toContain('0% { color: #29F2DF; }');
      expect(result).toContain('100% { color: #1C7FA6; }');
    });

    it('should create multi-step transition with keyframes', () => {
      const result = createColorTransitionKeyframes('complexFade', {
        from: '#29F2DF',
        to: '#1C7FA6',
        duration: 1000,
        keyframes: [
          { time: 0.5, color: '#ff0055' },
        ],
      });
      
      expect(result).toContain('50% { color: #ff0055; }');
    });
  });

  describe('createColorTransitionAnimation', () => {
    it('should create animation property string', () => {
      const result = createColorTransitionAnimation('fadeColor', {
        from: '#29F2DF',
        to: '#1C7FA6',
        duration: 1000,
        easing: 'ease-in-out',
      });
      
      expect(result).toBe('fadeColor 1000ms ease-in-out');
    });

    it('should default to linear easing', () => {
      const result = createColorTransitionAnimation('fadeColor', {
        from: '#29F2DF',
        to: '#1C7FA6',
        duration: 500,
      });
      
      expect(result).toBe('fadeColor 500ms linear');
    });
  });

  describe('animateGradient', () => {
    it('should interpolate between two gradients', () => {
      const from = {
        type: 'linear' as const,
        angle: 0,
        stops: [
          { color: '#000000', position: 0 },
          { color: '#ffffff', position: 100 },
        ],
      };
      
      const to = {
        type: 'linear' as const,
        angle: 90,
        stops: [
          { color: '#ff0000', position: 0 },
          { color: '#0000ff', position: 100 },
        ],
      };
      
      const result = animateGradient(from, to, 0.5);
      
      expect(result.type).toBe('linear');
      expect(result.angle).toBe(45);
      expect(result.stops).toHaveLength(2);
    });

    it('should throw error for different gradient types', () => {
      const from = {
        type: 'linear' as const,
        stops: [{ color: '#000000', position: 0 }],
      };
      
      const to = {
        type: 'radial' as const,
        stops: [{ color: '#ffffff', position: 0 }],
      };
      
      expect(() => animateGradient(from, to, 0.5)).toThrow(
        'Cannot animate between different gradient types'
      );
    });

    it('should throw error for different stop counts', () => {
      const from = {
        type: 'linear' as const,
        stops: [{ color: '#000000', position: 0 }],
      };
      
      const to = {
        type: 'linear' as const,
        stops: [
          { color: '#ffffff', position: 0 },
          { color: '#ff0000', position: 100 },
        ],
      };
      
      expect(() => animateGradient(from, to, 0.5)).toThrow(
        'Gradient stops must have the same length'
      );
    });
  });
});

describe('Utility Functions', () => {
  describe('isValidHexColor', () => {
    it('should validate 6-digit hex colors', () => {
      expect(isValidHexColor('#29F2DF')).toBe(true);
      expect(isValidHexColor('#FFFFFF')).toBe(true);
    });

    it('should validate 3-digit hex colors', () => {
      expect(isValidHexColor('#0ff')).toBe(true);
      expect(isValidHexColor('#FFF')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('00f6ff')).toBe(false);
      expect(isValidHexColor('#00f6f')).toBe(false);
      expect(isValidHexColor('#gggggg')).toBe(false);
      expect(isValidHexColor('invalid')).toBe(false);
    });
  });

  describe('parseColor', () => {
    it('should parse hex colors', () => {
      const result = parseColor('#29F2DF');
      expect(result).toEqual({ r: 0, g: 246, b: 255 });
    });

    it('should parse rgb colors', () => {
      const result = parseColor('rgb(0, 246, 255)');
      expect(result).toEqual({ r: 0, g: 246, b: 255 });
    });

    it('should parse rgba colors', () => {
      const result = parseColor('rgba(41, 242, 223, 0.5)');
      expect(result).toEqual({ r: 0, g: 246, b: 255 });
    });

    it('should parse hsl colors', () => {
      const result = parseColor('hsl(182, 100%, 50%)');
      expect(result?.r).toBeCloseTo(0, 0);
      expect(result?.g).toBeCloseTo(246, 0);
      expect(result?.b).toBeCloseTo(255, 0);
    });

    it('should return null for invalid colors', () => {
      expect(parseColor('invalid')).toBeNull();
      expect(parseColor('notacolor')).toBeNull();
    });
  });
});

describe('Color Accessibility Features (Requirement 2.6)', () => {
  describe('getContrastRatio', () => {
    it('should calculate maximum contrast ratio for black and white', () => {
      const ratio = getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('should calculate minimum contrast ratio for same colors', () => {
      const ratio = getContrastRatio('#29F2DF', '#29F2DF');
      expect(ratio).toBeCloseTo(1, 1);
    });

    it('should calculate contrast ratio for different colors', () => {
      const ratio = getContrastRatio('#29F2DF', '#ffffff');
      expect(ratio).toBeGreaterThan(1);
      expect(ratio).toBeLessThan(21);
    });

    it('should be symmetric (order should not matter)', () => {
      const ratio1 = getContrastRatio('#29F2DF', '#000000');
      const ratio2 = getContrastRatio('#000000', '#29F2DF');
      expect(ratio1).toBeCloseTo(ratio2, 2);
    });

    it('should throw error for invalid colors', () => {
      expect(() => getContrastRatio('invalid', '#ffffff')).toThrow('Invalid color format');
      expect(() => getContrastRatio('#000000', 'invalid')).toThrow('Invalid color format');
    });
  });

  describe('meetsWCAG', () => {
    it('should pass AA normal text for high contrast', () => {
      expect(meetsWCAG('#000000', '#ffffff', 'AA', 'normal')).toBe(true);
    });

    it('should fail AA normal text for low contrast', () => {
      expect(meetsWCAG('#29F2DF', '#ffffff', 'AA', 'normal')).toBe(false);
    });

    it('should pass AA large text with lower contrast', () => {
      // Large text requires only 3:1 ratio
      expect(meetsWCAG('#767676', '#ffffff', 'AA', 'large')).toBe(true);
    });

    it('should require higher contrast for AAA', () => {
      // A color that passes AA but not AAA
      const color = '#595959'; // ~7:1 ratio with white
      expect(meetsWCAG(color, '#ffffff', 'AA', 'normal')).toBe(true);
      expect(meetsWCAG(color, '#ffffff', 'AAA', 'normal')).toBe(true);
    });

    it('should default to AA normal text', () => {
      const result1 = meetsWCAG('#000000', '#ffffff');
      const result2 = meetsWCAG('#000000', '#ffffff', 'AA', 'normal');
      expect(result1).toBe(result2);
    });
  });

  describe('findAccessibleColor', () => {
    it('should return same color if already accessible', () => {
      const result = findAccessibleColor('#000000', '#ffffff', 'AA', 'normal');
      expect(result).toBe('#000000');
    });

    it('should darken light color on white background', () => {
      const result = findAccessibleColor('#29F2DF', '#ffffff', 'AA', 'normal');
      expect(result).not.toBeNull();
      if (result) {
        expect(meetsWCAG(result, '#ffffff', 'AA', 'normal')).toBe(true);
        // Should be darker than original
        const originalL = rgbToHsl(hexToRgb('#29F2DF')).l;
        const resultL = rgbToHsl(hexToRgb(result)).l;
        expect(resultL).toBeLessThan(originalL);
      }
    });

    it('should lighten dark color on black background', () => {
      const result = findAccessibleColor('#003333', '#000000', 'AA', 'normal');
      expect(result).not.toBeNull();
      if (result) {
        expect(meetsWCAG(result, '#000000', 'AA', 'normal')).toBe(true);
        // Should be lighter than original
        const originalL = rgbToHsl(hexToRgb('#003333')).l;
        const resultL = rgbToHsl(hexToRgb(result)).l;
        expect(resultL).toBeGreaterThan(originalL);
      }
    });

    it('should work with different WCAG levels', () => {
      const resultAA = findAccessibleColor('#29F2DF', '#ffffff', 'AA', 'normal');
      const resultAAA = findAccessibleColor('#29F2DF', '#ffffff', 'AAA', 'normal');
      
      expect(resultAA).not.toBeNull();
      expect(resultAAA).not.toBeNull();
      
      if (resultAA && resultAAA) {
        // AAA should be darker than AA
        const aaL = rgbToHsl(hexToRgb(resultAA)).l;
        const aaaL = rgbToHsl(hexToRgb(resultAAA)).l;
        expect(aaaL).toBeLessThanOrEqual(aaL);
      }
    });

    it('should throw error for invalid colors', () => {
      expect(() => findAccessibleColor('invalid', '#ffffff')).toThrow('Invalid base color format');
      expect(() => findAccessibleColor('#000000', 'invalid')).toThrow('Invalid background color format');
    });
  });

  describe('getAccessibilityInfo', () => {
    it('should return complete accessibility information', () => {
      const info = getAccessibilityInfo('#000000', '#ffffff');
      
      expect(info).toHaveProperty('ratio');
      expect(info).toHaveProperty('AA');
      expect(info).toHaveProperty('AAA');
      expect(info.ratio).toBeCloseTo(21, 1);
      expect(info.AA.normal).toBe(true);
      expect(info.AA.large).toBe(true);
      expect(info.AAA.normal).toBe(true);
      expect(info.AAA.large).toBe(true);
    });

    it('should show failing criteria for low contrast', () => {
      const info = getAccessibilityInfo('#29F2DF', '#ffffff');
      
      expect(info.ratio).toBeLessThan(4.5);
      expect(info.AA.normal).toBe(false);
      expect(info.AAA.normal).toBe(false);
    });

    it('should differentiate between text sizes', () => {
      // A color that passes large text but not normal text
      const info = getAccessibilityInfo('#767676', '#ffffff');
      
      expect(info.AA.large).toBe(true);
      expect(info.AA.normal).toBe(info.ratio >= 4.5);
    });
  });
});

describe('Color Validation (Requirement 2.5)', () => {
  describe('detectColorFormat', () => {
    it('should detect hex format', () => {
      expect(detectColorFormat('#29F2DF')).toBe('hex');
      expect(detectColorFormat('#0ff')).toBe('hex');
    });

    it('should detect rgb format', () => {
      expect(detectColorFormat('rgb(0, 246, 255)')).toBe('rgb');
    });

    it('should detect rgba format', () => {
      expect(detectColorFormat('rgba(41, 242, 223, 0.5)')).toBe('rgba');
    });

    it('should detect hsl format', () => {
      expect(detectColorFormat('hsl(184, 100%, 50%)')).toBe('hsl');
    });

    it('should detect hsla format', () => {
      expect(detectColorFormat('hsla(184, 100%, 50%, 0.5)')).toBe('hsla');
    });

    it('should return unknown for invalid format', () => {
      expect(detectColorFormat('invalid')).toBe('unknown');
      expect(detectColorFormat('notacolor')).toBe('unknown');
    });
  });

  describe('isValidColor', () => {
    it('should validate hex colors', () => {
      expect(isValidColor('#29F2DF')).toBe(true);
      expect(isValidColor('#0ff')).toBe(true);
    });

    it('should validate rgb colors', () => {
      expect(isValidColor('rgb(0, 246, 255)')).toBe(true);
    });

    it('should validate rgba colors', () => {
      expect(isValidColor('rgba(41, 242, 223, 0.5)')).toBe(true);
    });

    it('should validate hsl colors', () => {
      expect(isValidColor('hsl(184, 100%, 50%)')).toBe(true);
    });

    it('should validate hsla colors', () => {
      expect(isValidColor('hsla(184, 100%, 50%, 0.5)')).toBe(true);
    });

    it('should reject invalid colors', () => {
      expect(isValidColor('invalid')).toBe(false);
      expect(isValidColor('notacolor')).toBe(false);
    });
  });

  describe('isValidRgbColor', () => {
    it('should validate correct rgb colors', () => {
      expect(isValidRgbColor('rgb(0, 246, 255)')).toBe(true);
      expect(isValidRgbColor('rgb(255, 255, 255)')).toBe(true);
    });

    it('should reject values outside 0-255 range', () => {
      expect(isValidRgbColor('rgb(256, 0, 0)')).toBe(false);
      expect(isValidRgbColor('rgb(-1, 0, 0)')).toBe(false);
    });

    it('should reject rgba format', () => {
      expect(isValidRgbColor('rgba(41, 242, 223, 0.5)')).toBe(false);
    });

    it('should reject invalid format', () => {
      expect(isValidRgbColor('rgb(0, 246)')).toBe(false);
      expect(isValidRgbColor('invalid')).toBe(false);
    });
  });

  describe('isValidRgbaColor', () => {
    it('should validate correct rgba colors', () => {
      expect(isValidRgbaColor('rgba(41, 242, 223, 0.5)')).toBe(true);
      expect(isValidRgbaColor('rgba(255, 255, 255, 1)')).toBe(true);
    });

    it('should reject alpha values outside 0-1 range', () => {
      expect(isValidRgbaColor('rgba(41, 242, 223, 1.5)')).toBe(false);
      expect(isValidRgbaColor('rgba(41, 242, 223, -0.5)')).toBe(false);
    });

    it('should reject rgb values outside 0-255 range', () => {
      expect(isValidRgbaColor('rgba(256, 0, 0, 0.5)')).toBe(false);
    });
  });

  describe('isValidHslColor', () => {
    it('should validate correct hsl colors', () => {
      expect(isValidHslColor('hsl(184, 100%, 50%)')).toBe(true);
      expect(isValidHslColor('hsl(0, 0%, 0%)')).toBe(true);
    });

    it('should reject hue values outside 0-360 range', () => {
      expect(isValidHslColor('hsl(400, 100%, 50%)')).toBe(false);
      expect(isValidHslColor('hsl(-10, 100%, 50%)')).toBe(false);
    });

    it('should reject saturation/lightness outside 0-100 range', () => {
      expect(isValidHslColor('hsl(180, 150%, 50%)')).toBe(false);
      expect(isValidHslColor('hsl(180, 100%, 150%)')).toBe(false);
    });
  });

  describe('isValidHslaColor', () => {
    it('should validate correct hsla colors', () => {
      expect(isValidHslaColor('hsla(184, 100%, 50%, 0.5)')).toBe(true);
      expect(isValidHslaColor('hsla(0, 0%, 0%, 1)')).toBe(true);
    });

    it('should reject alpha values outside 0-1 range', () => {
      expect(isValidHslaColor('hsla(184, 100%, 50%, 1.5)')).toBe(false);
      expect(isValidHslaColor('hsla(184, 100%, 50%, -0.5)')).toBe(false);
    });
  });

  describe('normalizeColor', () => {
    it('should normalize to hex format', () => {
      expect(normalizeColor('rgb(0, 246, 255)', 'hex')).toBe('#29F2DF');
      expect(normalizeColor('hsl(184, 100%, 50%)', 'hex')).toBe('#29F2DF');
    });

    it('should normalize to rgb format', () => {
      const result = normalizeColor('#29F2DF', 'rgb');
      expect(result).toBe('rgb(0, 246, 255)');
    });

    it('should normalize to hsl format', () => {
      const result = normalizeColor('#29F2DF', 'hsl');
      expect(result).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
    });

    it('should expand 3-digit hex to 6-digit', () => {
      expect(normalizeColor('#0ff', 'hex')).toBe('#28125A');
    });

    it('should return null for invalid colors', () => {
      expect(normalizeColor('invalid', 'hex')).toBeNull();
    });
  });

  describe('validateAndParseColor', () => {
    it('should validate and parse hex colors', () => {
      const result = validateAndParseColor('#29F2DF');
      expect(result.valid).toBe(true);
      expect(result.format).toBe('hex');
      expect(result.rgb).toEqual({ r: 0, g: 246, b: 255 });
      expect(result.error).toBeUndefined();
    });

    it('should validate and parse rgb colors', () => {
      const result = validateAndParseColor('rgb(0, 246, 255)');
      expect(result.valid).toBe(true);
      expect(result.format).toBe('rgb');
      expect(result.rgb).toEqual({ r: 0, g: 246, b: 255 });
    });

    it('should validate and parse hsl colors', () => {
      const result = validateAndParseColor('hsl(184, 100%, 50%)');
      expect(result.valid).toBe(true);
      expect(result.format).toBe('hsl');
      expect(result.rgb).not.toBeNull();
    });

    it('should return error for invalid colors', () => {
      const result = validateAndParseColor('invalid');
      expect(result.valid).toBe(false);
      expect(result.format).toBe('unknown');
      expect(result.rgb).toBeNull();
      expect(result.error).toBe('Invalid color format');
    });

    it('should handle all supported formats', () => {
      const formats = [
        '#29F2DF',
        'rgb(0, 246, 255)',
        'rgba(41, 242, 223, 0.5)',
        'hsl(184, 100%, 50%)',
        'hsla(184, 100%, 50%, 0.5)',
      ];

      formats.forEach(color => {
        const result = validateAndParseColor(color);
        expect(result.valid).toBe(true);
        expect(result.rgb).not.toBeNull();
      });
    });
  });
});
