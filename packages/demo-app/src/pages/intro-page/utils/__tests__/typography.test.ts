import {
  DEFAULT_TYPOGRAPHY,
  getHeadingStyles,
  getBodyStyles,
  getAccentStyles,
  getSmallStyles,
  validateContrast,
  getResponsiveFontSize,
  createTypographyConfig,
} from '../typography';

describe('Typography System', () => {
  describe('DEFAULT_TYPOGRAPHY', () => {
    test('has correct font family', () => {
      expect(DEFAULT_TYPOGRAPHY.fontFamily).toContain('system-ui');
    });

    test('has cyan heading color', () => {
      expect(DEFAULT_TYPOGRAPHY.colors.heading).toBe('#29F2DF');
    });

    test('has magenta accent color', () => {
      expect(DEFAULT_TYPOGRAPHY.colors.accent).toBe('#EF3EF1');
    });

    test('has responsive font sizes', () => {
      expect(DEFAULT_TYPOGRAPHY.sizes.h1).toContain('clamp');
      expect(DEFAULT_TYPOGRAPHY.sizes.body).toContain('clamp');
    });

    test('has glow effects', () => {
      expect(DEFAULT_TYPOGRAPHY.effects.headingGlow).toContain('rgba');
      expect(DEFAULT_TYPOGRAPHY.effects.bodyGlow).toContain('rgba');
    });
  });

  describe('getHeadingStyles', () => {
    test('returns h1 styles', () => {
      const styles = getHeadingStyles('h1');
      expect(styles.fontSize).toBe(DEFAULT_TYPOGRAPHY.sizes.h1);
      expect(styles.fontWeight).toBe('900');
      expect(styles.color).toBe('#29F2DF');
    });

    test('returns h2 styles', () => {
      const styles = getHeadingStyles('h2');
      expect(styles.fontSize).toBe(DEFAULT_TYPOGRAPHY.sizes.h2);
    });

    test('returns h3 styles', () => {
      const styles = getHeadingStyles('h3');
      expect(styles.fontSize).toBe(DEFAULT_TYPOGRAPHY.sizes.h3);
    });

    test('includes glow effect', () => {
      const styles = getHeadingStyles();
      expect(styles.textShadow).toContain('rgba(41, 242, 223');
    });

    test('has proper line height', () => {
      const styles = getHeadingStyles();
      expect(styles.lineHeight).toBe('1.2');
    });
  });

  describe('getBodyStyles', () => {
    test('returns body text styles', () => {
      const styles = getBodyStyles();
      expect(styles.fontSize).toBe(DEFAULT_TYPOGRAPHY.sizes.body);
      expect(styles.color).toBe('#C8D8E8');
      expect(styles.fontWeight).toBe('400');
    });

    test('includes glow effect', () => {
      const styles = getBodyStyles();
      expect(styles.textShadow).toContain('rgba');
    });

    test('has proper line height', () => {
      const styles = getBodyStyles();
      expect(styles.lineHeight).toBe('1.6');
    });

    test('meets minimum font size requirement', () => {
      const styles = getBodyStyles();
      expect(styles.fontSize).toContain('14px');
    });
  });

  describe('getAccentStyles', () => {
    test('returns accent text styles', () => {
      const styles = getAccentStyles();
      expect(styles.color).toBe('#EF3EF1');
      expect(styles.fontWeight).toBe('700');
    });

    test('includes magenta glow', () => {
      const styles = getAccentStyles();
      expect(styles.textShadow).toContain('239, 62, 241');
    });
  });

  describe('getSmallStyles', () => {
    test('returns small text styles', () => {
      const styles = getSmallStyles();
      expect(styles.fontSize).toBe(DEFAULT_TYPOGRAPHY.sizes.small);
      expect(styles.fontWeight).toBe('400');
    });

    test('has reduced opacity', () => {
      const styles = getSmallStyles();
      expect(styles.opacity).toBe(0.8);
    });
  });

  describe('validateContrast', () => {
    test('validates cyan on black contrast', () => {
      const result = validateContrast('rgba(41, 242, 223, 1)', 'rgba(0, 0, 0, 1)');
      expect(result.valid).toBe(true);
      expect(result.ratio).toBeGreaterThan(4.5);
    });

    test('validates white on black contrast', () => {
      const result = validateContrast('rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)');
      expect(result.valid).toBe(true);
      expect(result.ratio).toBeGreaterThan(4.5);
    });

    test('returns ratio value', () => {
      const result = validateContrast('rgba(41, 242, 223, 1)', 'rgba(0, 0, 0, 1)');
      expect(result.ratio).toBeGreaterThan(0);
      expect(typeof result.ratio).toBe('number');
    });
  });

  describe('getResponsiveFontSize', () => {
    test('returns clamp function', () => {
      const size = getResponsiveFontSize(14, 18);
      expect(size).toContain('clamp');
    });

    test('includes min and max sizes', () => {
      const size = getResponsiveFontSize(14, 18);
      expect(size).toContain('14px');
      expect(size).toContain('18px');
    });

    test('uses default viewport values', () => {
      const size = getResponsiveFontSize(14, 18);
      expect(size).toBeDefined();
    });

    test('respects custom viewport values', () => {
      const size = getResponsiveFontSize(14, 18, 480, 1920);
      expect(size).toContain('clamp');
    });
  });

  describe('createTypographyConfig', () => {
    test('creates config with defaults', () => {
      const config = createTypographyConfig();
      expect(config).toEqual(DEFAULT_TYPOGRAPHY);
    });

    test('creates config with color overrides', () => {
      const config = createTypographyConfig({
        colors: {
          heading: '#FF0000',
          body: '#00FF00',
          accent: '#0000FF',
          secondary: '#FFFF00',
        },
      });
      expect(config.colors.heading).toBe('#FF0000');
      expect(config.colors.body).toBe('#00FF00');
    });

    test('creates config with size overrides', () => {
      const config = createTypographyConfig({
        sizes: {
          h1: '80px',
          h2: '60px',
          h3: '40px',
          body: '16px',
          small: '14px',
        },
      });
      expect(config.sizes.h1).toBe('80px');
    });

    test('preserves non-overridden values', () => {
      const config = createTypographyConfig({
        colors: {
          heading: '#FF0000',
          body: '#00FF00',
          accent: '#0000FF',
          secondary: '#FFFF00',
        },
      });
      expect(config.fontFamily).toBe(DEFAULT_TYPOGRAPHY.fontFamily);
    });
  });

  describe('Typography Constraints', () => {
    test('heading color is cyan', () => {
      expect(DEFAULT_TYPOGRAPHY.colors.heading).toBe('#29F2DF');
    });

    test('body text has reduced opacity', () => {
      const styles = getBodyStyles();
      expect(styles.color).toBe('#C8D8E8');
    });

    test('font sizes use clamp for responsiveness', () => {
      Object.values(DEFAULT_TYPOGRAPHY.sizes).forEach((size) => {
        expect(size).toContain('clamp');
      });
    });

    test('minimum body font size is 14px', () => {
      expect(DEFAULT_TYPOGRAPHY.sizes.body).toContain('14px');
    });

    test('heading glow effect includes cyan', () => {
      expect(DEFAULT_TYPOGRAPHY.effects.headingGlow).toContain('41, 242, 223');
    });
  });
});
