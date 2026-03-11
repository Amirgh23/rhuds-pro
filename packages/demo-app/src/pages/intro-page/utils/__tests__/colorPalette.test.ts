import {
  DEFAULT_COLOR_PALETTE,
  validateColorPalette,
  getColorWithOpacity,
  getGlowEffect,
  getFrameColor,
  getBackgroundGradient,
  getGlassmorphismEffect,
  createColorPalette,
  getColorContrast,
  getPaletteColors,
} from '../colorPalette';

describe('Color Palette System', () => {
  describe('DEFAULT_COLOR_PALETTE', () => {
    test('has cyan primary color', () => {
      expect(DEFAULT_COLOR_PALETTE.primary).toBe('#29F2DF');
    });

    test('has magenta secondary color', () => {
      expect(DEFAULT_COLOR_PALETTE.secondary).toBe('#EF3EF1');
    });

    test('has blue tertiary color', () => {
      expect(DEFAULT_COLOR_PALETTE.tertiary).toBe('#1C7FA6');
    });

    test('has black background', () => {
      expect(DEFAULT_COLOR_PALETTE.background).toBe('#000000');
    });

    test('has text colors', () => {
      expect(DEFAULT_COLOR_PALETTE.text.primary).toBe('#FFFFFF');
      expect(DEFAULT_COLOR_PALETTE.text.secondary).toBe('#C8D8E8');
      expect(DEFAULT_COLOR_PALETTE.text.accent).toBe('#29F2DF');
    });

    test('has glow effects', () => {
      expect(DEFAULT_COLOR_PALETTE.effects.glow).toContain('rgba');
      expect(DEFAULT_COLOR_PALETTE.effects.shadow).toContain('rgba');
    });
  });

  describe('validateColorPalette', () => {
    test('validates correct palette', () => {
      const result = validateColorPalette(DEFAULT_COLOR_PALETTE);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('detects invalid hex color', () => {
      const invalidPalette = {
        ...DEFAULT_COLOR_PALETTE,
        primary: 'invalid',
      };
      const result = validateColorPalette(invalidPalette);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('accepts rgba colors', () => {
      const palettWithRgba = {
        ...DEFAULT_COLOR_PALETTE,
        primary: 'rgba(41, 242, 223, 1)',
      };
      const result = validateColorPalette(palettWithRgba);
      expect(result.valid).toBe(true);
    });
  });

  describe('getColorWithOpacity', () => {
    test('converts hex to rgba with opacity', () => {
      const result = getColorWithOpacity('#29F2DF', 0.5);
      expect(result).toContain('rgba');
      expect(result).toContain('0.5');
    });

    test('handles full opacity', () => {
      const result = getColorWithOpacity('#29F2DF', 1);
      expect(result).toContain('rgba');
      expect(result).toContain('1');
    });

    test('handles zero opacity', () => {
      const result = getColorWithOpacity('#29F2DF', 0);
      expect(result).toContain('rgba');
      expect(result).toContain('0');
    });

    test('returns rgba colors unchanged', () => {
      const color = 'rgba(41, 242, 223, 0.5)';
      const result = getColorWithOpacity(color, 0.8);
      expect(result).toBe(color);
    });
  });

  describe('getGlowEffect', () => {
    test('returns glow effect string', () => {
      const glow = getGlowEffect('#29F2DF');
      expect(glow).toContain('0 0');
      expect(glow).toContain('#29F2DF');
    });

    test('respects intensity parameter', () => {
      const glow1 = getGlowEffect('#29F2DF', 1);
      const glow2 = getGlowEffect('#29F2DF', 2);
      expect(glow2).toContain('40px');
      expect(glow1).toContain('20px');
    });

    test('includes multiple glow layers', () => {
      const glow = getGlowEffect('#29F2DF');
      const commas = (glow.match(/,/g) || []).length;
      expect(commas).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getFrameColor', () => {
    test('returns primary frame color', () => {
      expect(getFrameColor('primary')).toBe('#29F2DF');
    });

    test('returns secondary frame color', () => {
      expect(getFrameColor('secondary')).toBe('#EF3EF1');
    });

    test('returns tertiary frame color', () => {
      expect(getFrameColor('tertiary')).toBe('#1C7FA6');
    });

    test('defaults to primary', () => {
      expect(getFrameColor()).toBe('#29F2DF');
    });
  });

  describe('getBackgroundGradient', () => {
    test('returns gradient string', () => {
      const gradient = getBackgroundGradient();
      expect(gradient).toContain('linear-gradient');
      expect(gradient).toContain('180deg');
    });

    test('includes black colors', () => {
      const gradient = getBackgroundGradient();
      expect(gradient).toContain('#000000');
      expect(gradient).toContain('#0a0a0f');
    });
  });

  describe('getGlassmorphismEffect', () => {
    test('returns glassmorphism object', () => {
      const effect = getGlassmorphismEffect();
      expect(effect).toHaveProperty('background');
      expect(effect).toHaveProperty('backdropFilter');
      expect(effect).toHaveProperty('border');
    });

    test('includes blur effect', () => {
      const effect = getGlassmorphismEffect();
      expect(effect.backdropFilter).toContain('blur');
    });

    test('includes saturate effect', () => {
      const effect = getGlassmorphismEffect();
      expect(effect.backdropFilter).toContain('saturate');
    });

    test('respects custom opacity', () => {
      const effect = getGlassmorphismEffect('#29F2DF', 0.2);
      expect(effect.background).toContain('0.2');
    });
  });

  describe('createColorPalette', () => {
    test('creates palette with defaults', () => {
      const palette = createColorPalette();
      expect(palette).toEqual(DEFAULT_COLOR_PALETTE);
    });

    test('creates palette with overrides', () => {
      const palette = createColorPalette({
        primary: '#FF0000',
      });
      expect(palette.primary).toBe('#FF0000');
      expect(palette.secondary).toBe(DEFAULT_COLOR_PALETTE.secondary);
    });

    test('validates created palette', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const palette = createColorPalette({
        primary: 'invalid',
      });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getColorContrast', () => {
    test('returns contrast ratio', () => {
      const contrast = getColorContrast('rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)');
      expect(contrast.ratio).toBeGreaterThan(0);
    });

    test('validates WCAG AA compliance', () => {
      const contrast = getColorContrast('rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)');
      expect(contrast.wcagAA).toBe(true);
    });

    test('validates WCAG AAA compliance', () => {
      const contrast = getColorContrast('rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)');
      expect(contrast.wcagAAA).toBe(true);
    });

    test('cyan on black meets WCAG AA', () => {
      const contrast = getColorContrast('#29F2DF', '#000000');
      expect(contrast.wcagAA).toBe(true);
    });
  });

  describe('getPaletteColors', () => {
    test('returns array of colors', () => {
      const colors = getPaletteColors();
      expect(Array.isArray(colors)).toBe(true);
      expect(colors.length).toBeGreaterThan(0);
    });

    test('includes all palette colors', () => {
      const colors = getPaletteColors();
      expect(colors).toContain('#29F2DF');
      expect(colors).toContain('#EF3EF1');
      expect(colors).toContain('#1C7FA6');
    });

    test('respects custom palette', () => {
      const customPalette = createColorPalette({
        primary: '#FF0000',
      });
      const colors = getPaletteColors(customPalette);
      expect(colors).toContain('#FF0000');
    });
  });

  describe('Color Palette Constraints', () => {
    test('primary color is cyan', () => {
      expect(DEFAULT_COLOR_PALETTE.primary).toBe('#29F2DF');
    });

    test('secondary color is magenta', () => {
      expect(DEFAULT_COLOR_PALETTE.secondary).toBe('#EF3EF1');
    });

    test('background is black', () => {
      expect(DEFAULT_COLOR_PALETTE.background).toBe('#000000');
    });

    test('all colors are valid hex or rgba', () => {
      const validation = validateColorPalette(DEFAULT_COLOR_PALETTE);
      expect(validation.valid).toBe(true);
    });

    test('cyan and black have sufficient contrast', () => {
      const contrast = getColorContrast('#29F2DF', '#000000');
      expect(contrast.wcagAA).toBe(true);
    });
  });
});
