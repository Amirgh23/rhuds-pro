import {
  DEFAULT_FRAME_STYLE,
  FRAME_SIZE_PRESETS,
  getFrameStyle,
  getFrameGlowEffect,
  getFrameContainerStyles,
  getFrameSVGStyles,
  validateFrameStyle,
  createFrameStyle,
  getFrameAnimationStyles,
  getFrameHoverStyles,
  getResponsiveFrameStyle,
  FRAME_COLOR_VARIANTS,
  getFrameColorVariant,
  getCompleteFrameStyles,
} from '../frameStyles';

describe('Frame Styling System', () => {
  describe('DEFAULT_FRAME_STYLE', () => {
    test('has valid padding', () => {
      expect(DEFAULT_FRAME_STYLE.padding).toBeGreaterThanOrEqual(4);
      expect(DEFAULT_FRAME_STYLE.padding).toBeLessThanOrEqual(8);
    });

    test('has valid square size', () => {
      expect(DEFAULT_FRAME_STYLE.squareSize).toBeGreaterThanOrEqual(12);
      expect(DEFAULT_FRAME_STYLE.squareSize).toBeLessThanOrEqual(32);
    });

    test('has cyan color', () => {
      expect(DEFAULT_FRAME_STYLE.color).toBe('#29F2DF');
    });

    test('has valid glow intensity', () => {
      expect(DEFAULT_FRAME_STYLE.glowIntensity).toBeGreaterThanOrEqual(0);
      expect(DEFAULT_FRAME_STYLE.glowIntensity).toBeLessThanOrEqual(1);
    });
  });

  describe('FRAME_SIZE_PRESETS', () => {
    test('has small preset', () => {
      expect(FRAME_SIZE_PRESETS.small).toBeDefined();
      expect(FRAME_SIZE_PRESETS.small.padding).toBe(4);
      expect(FRAME_SIZE_PRESETS.small.squareSize).toBe(12);
    });

    test('has medium preset', () => {
      expect(FRAME_SIZE_PRESETS.medium).toBeDefined();
      expect(FRAME_SIZE_PRESETS.medium.padding).toBe(6);
      expect(FRAME_SIZE_PRESETS.medium.squareSize).toBe(20);
    });

    test('has large preset', () => {
      expect(FRAME_SIZE_PRESETS.large).toBeDefined();
      expect(FRAME_SIZE_PRESETS.large.padding).toBe(8);
      expect(FRAME_SIZE_PRESETS.large.squareSize).toBe(32);
    });
  });

  describe('getFrameStyle', () => {
    test('returns small frame style', () => {
      const style = getFrameStyle('small');
      expect(style.padding).toBe(4);
      expect(style.squareSize).toBe(12);
    });

    test('returns medium frame style', () => {
      const style = getFrameStyle('medium');
      expect(style.padding).toBe(6);
      expect(style.squareSize).toBe(20);
    });

    test('returns large frame style', () => {
      const style = getFrameStyle('large');
      expect(style.padding).toBe(8);
      expect(style.squareSize).toBe(32);
    });

    test('respects custom color', () => {
      const style = getFrameStyle('medium', '#EF3EF1');
      expect(style.color).toBe('#EF3EF1');
    });
  });

  describe('getFrameGlowEffect', () => {
    test('returns drop-shadow filter', () => {
      const glow = getFrameGlowEffect();
      expect(glow).toContain('drop-shadow');
    });

    test('includes multiple glow layers', () => {
      const glow = getFrameGlowEffect();
      const dropShadows = (glow.match(/drop-shadow/g) || []).length;
      expect(dropShadows).toBeGreaterThanOrEqual(3);
    });

    test('respects intensity parameter', () => {
      const glow1 = getFrameGlowEffect('#29F2DF', 0.5);
      const glow2 = getFrameGlowEffect('#29F2DF', 1);
      expect(glow2).toContain('15px');
      expect(glow1).toContain('7.5px');
    });
  });

  describe('getFrameContainerStyles', () => {
    test('returns container styles object', () => {
      const styles = getFrameContainerStyles();
      expect(styles).toHaveProperty('padding');
      expect(styles).toHaveProperty('position');
      expect(styles).toHaveProperty('overflow');
    });

    test('has relative positioning', () => {
      const styles = getFrameContainerStyles();
      expect(styles.position).toBe('relative');
    });

    test('has hidden overflow', () => {
      const styles = getFrameContainerStyles();
      expect(styles.overflow).toBe('hidden');
    });

    test('respects custom config', () => {
      const config = { ...DEFAULT_FRAME_STYLE, padding: 4 };
      const styles = getFrameContainerStyles(config);
      expect(styles.padding).toBe('4px');
    });
  });

  describe('getFrameSVGStyles', () => {
    test('returns SVG styles object', () => {
      const styles = getFrameSVGStyles();
      expect(styles).toHaveProperty('position');
      expect(styles).toHaveProperty('filter');
      expect(styles).toHaveProperty('pointerEvents');
    });

    test('has absolute positioning', () => {
      const styles = getFrameSVGStyles();
      expect(styles.position).toBe('absolute');
    });

    test('has no pointer events', () => {
      const styles = getFrameSVGStyles();
      expect(styles.pointerEvents).toBe('none');
    });

    test('includes glow filter', () => {
      const styles = getFrameSVGStyles();
      expect(styles.filter).toContain('drop-shadow');
    });
  });

  describe('validateFrameStyle', () => {
    test('validates correct style', () => {
      const result = validateFrameStyle(DEFAULT_FRAME_STYLE);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('detects invalid padding', () => {
      const invalidStyle = { ...DEFAULT_FRAME_STYLE, padding: 10 };
      const result = validateFrameStyle(invalidStyle);
      expect(result.valid).toBe(false);
    });

    test('detects invalid square size', () => {
      const invalidStyle = { ...DEFAULT_FRAME_STYLE, squareSize: 50 };
      const result = validateFrameStyle(invalidStyle);
      expect(result.valid).toBe(false);
    });

    test('detects invalid glow intensity', () => {
      const invalidStyle = { ...DEFAULT_FRAME_STYLE, glowIntensity: 1.5 };
      const result = validateFrameStyle(invalidStyle);
      expect(result.valid).toBe(false);
    });
  });

  describe('createFrameStyle', () => {
    test('creates style with defaults', () => {
      const style = createFrameStyle();
      expect(style).toEqual(DEFAULT_FRAME_STYLE);
    });

    test('creates style with overrides', () => {
      const style = createFrameStyle({
        padding: 6,
        squareSize: 24,
      });
      expect(style.padding).toBe(6);
      expect(style.squareSize).toBe(24);
    });

    test('validates created style', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const style = createFrameStyle({
        padding: 10,
      });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getFrameAnimationStyles', () => {
    test('returns animation styles', () => {
      const styles = getFrameAnimationStyles();
      expect(styles).toHaveProperty('animation');
      expect(styles).toHaveProperty('transformOrigin');
    });

    test('includes frame assembly animation', () => {
      const styles = getFrameAnimationStyles();
      expect(styles.animation).toContain('frameAssemble');
    });

    test('has center transform origin', () => {
      const styles = getFrameAnimationStyles();
      expect(styles.transformOrigin).toBe('center');
    });
  });

  describe('getFrameHoverStyles', () => {
    test('returns hover styles', () => {
      const styles = getFrameHoverStyles();
      expect(styles).toHaveProperty('transition');
      expect(styles).toHaveProperty('filter');
      expect(styles).toHaveProperty('transform');
    });

    test('includes scale transform', () => {
      const styles = getFrameHoverStyles();
      expect(styles.transform).toContain('scale');
    });

    test('includes glow effect', () => {
      const styles = getFrameHoverStyles();
      expect(styles.filter).toContain('drop-shadow');
    });
  });

  describe('getResponsiveFrameStyle', () => {
    test('returns small style for mobile', () => {
      const style = getResponsiveFrameStyle(500);
      expect(style.padding).toBe(4);
      expect(style.squareSize).toBe(12);
    });

    test('returns medium style for tablet', () => {
      const style = getResponsiveFrameStyle(800);
      expect(style.padding).toBe(6);
      expect(style.squareSize).toBe(20);
    });

    test('returns large style for desktop', () => {
      const style = getResponsiveFrameStyle(1200);
      expect(style.padding).toBe(8);
      expect(style.squareSize).toBe(32);
    });
  });

  describe('FRAME_COLOR_VARIANTS', () => {
    test('has primary variant', () => {
      expect(FRAME_COLOR_VARIANTS.primary).toBe('#29F2DF');
    });

    test('has secondary variant', () => {
      expect(FRAME_COLOR_VARIANTS.secondary).toBe('#EF3EF1');
    });

    test('has tertiary variant', () => {
      expect(FRAME_COLOR_VARIANTS.tertiary).toBe('#1C7FA6');
    });

    test('has accent variant', () => {
      expect(FRAME_COLOR_VARIANTS.accent).toBe('#FFFFFF');
    });
  });

  describe('getFrameColorVariant', () => {
    test('returns primary color', () => {
      expect(getFrameColorVariant('primary')).toBe('#29F2DF');
    });

    test('returns secondary color', () => {
      expect(getFrameColorVariant('secondary')).toBe('#EF3EF1');
    });

    test('defaults to primary', () => {
      expect(getFrameColorVariant()).toBe('#29F2DF');
    });
  });

  describe('getCompleteFrameStyles', () => {
    test('returns complete styles object', () => {
      const styles = getCompleteFrameStyles();
      expect(styles).toHaveProperty('container');
      expect(styles).toHaveProperty('svg');
      expect(styles).toHaveProperty('animation');
      expect(styles).toHaveProperty('hover');
    });

    test('includes all required style properties', () => {
      const styles = getCompleteFrameStyles();
      expect(styles.container).toBeDefined();
      expect(styles.svg).toBeDefined();
      expect(styles.animation).toBeDefined();
      expect(styles.hover).toBeDefined();
    });

    test('respects size parameter', () => {
      const styles = getCompleteFrameStyles('large');
      expect(styles.container.padding).toBe('8px');
    });

    test('respects color variant parameter', () => {
      const styles = getCompleteFrameStyles('medium', 'secondary');
      expect(styles.svg.filter).toContain('239, 62, 241');
    });
  });

  describe('Frame Styling Constraints', () => {
    test('padding is within 4-8px range', () => {
      Object.values(FRAME_SIZE_PRESETS).forEach((preset) => {
        expect(preset.padding).toBeGreaterThanOrEqual(4);
        expect(preset.padding).toBeLessThanOrEqual(8);
      });
    });

    test('square size is within 12-32px range', () => {
      Object.values(FRAME_SIZE_PRESETS).forEach((preset) => {
        expect(preset.squareSize).toBeGreaterThanOrEqual(12);
        expect(preset.squareSize).toBeLessThanOrEqual(32);
      });
    });

    test('all color variants are valid', () => {
      Object.values(FRAME_COLOR_VARIANTS).forEach((color) => {
        expect(color).toMatch(/^#[0-9A-F]{6}$|^#[0-9A-F]{3}$/i);
      });
    });
  });
});
