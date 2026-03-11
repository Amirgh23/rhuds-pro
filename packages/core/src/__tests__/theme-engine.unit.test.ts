import { createAppTheme, createThemeUnit, createThemeColor } from '../theme/creators';

describe('Theme Engine - Unit Tests', () => {
  describe('createAppTheme', () => {
    it('should create a valid app theme with default configuration', () => {
      const theme = createAppTheme({
        name: 'test-theme',
        primaryColor: '#29F2DF',
        secondaryColor: '#1C7FA6',
      });

      expect(theme).toBeDefined();
      expect(theme.name).toBe('test-theme');
      expect(theme.colors).toBeDefined();
      expect(theme.units).toBeDefined();
      expect(theme.typography).toBeDefined();
    });

    it('should create theme with custom primary and secondary colors', () => {
      const theme = createAppTheme({
        name: 'custom-theme',
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00',
      });

      expect(theme.colors.primary).toBeDefined();
      expect(theme.colors.secondary).toBeDefined();
    });

    it('should generate all required color variants', () => {
      const theme = createAppTheme({
        name: 'test-theme',
        primaryColor: '#29F2DF',
        secondaryColor: '#1C7FA6',
      });

      expect(theme.colors.success).toBeDefined();
      expect(theme.colors.warning).toBeDefined();
      expect(theme.colors.error).toBeDefined();
      expect(theme.colors.info).toBeDefined();
      expect(theme.colors.background).toBeDefined();
      expect(theme.colors.text).toBeDefined();
    });

    it('should create spacing units', () => {
      const theme = createAppTheme({
        name: 'test-theme',
        primaryColor: '#29F2DF',
        secondaryColor: '#1C7FA6',
      });

      expect(theme.units.space).toBeDefined();
      expect(Array.isArray(theme.units.space)).toBe(true);
      expect(theme.units.space.length).toBeGreaterThan(0);
    });

    it('should create typography system', () => {
      const theme = createAppTheme({
        name: 'test-theme',
        primaryColor: '#29F2DF',
        secondaryColor: '#1C7FA6',
      });

      expect(theme.typography.fontFamily).toBeDefined();
      expect(theme.typography.fontSize).toBeDefined();
      expect(theme.typography.fontWeight).toBeDefined();
      expect(theme.typography.lineHeight).toBeDefined();
    });
  });

  describe('createThemeUnit', () => {
    it('should create a valid spacing scale', () => {
      const units = createThemeUnit({
        baseUnit: 8,
        scale: 1.5,
        steps: 12,
      });

      expect(units).toBeDefined();
      expect(Array.isArray(units)).toBe(true);
      expect(units.length).toBe(12);
    });

    it('should generate increasing spacing values', () => {
      const units = createThemeUnit({
        baseUnit: 8,
        scale: 1.5,
        steps: 5,
      });

      for (let i = 1; i < units.length; i++) {
        expect(units[i]).toBeGreaterThan(units[i - 1]);
      }
    });

    it('should start with base unit value', () => {
      const baseUnit = 8;
      const units = createThemeUnit({
        baseUnit,
        scale: 1.5,
        steps: 5,
      });

      expect(units[0]).toBe(baseUnit);
    });
  });

  describe('createThemeColor', () => {
    it('should create a color palette from hex color', () => {
      const palette = createThemeColor('#29F2DF');

      expect(palette).toBeDefined();
      expect(palette.main).toBe('#29F2DF');
      expect(palette.light).toBeDefined();
      expect(palette.dark).toBeDefined();
    });

    it('should generate lighter and darker variants', () => {
      const palette = createThemeColor('#29F2DF');

      expect(palette.light).not.toBe(palette.main);
      expect(palette.dark).not.toBe(palette.main);
    });

    it('should support alpha channel manipulation', () => {
      const palette = createThemeColor('#29F2DF');
      const alphaColor = palette.alpha(0.5);

      expect(alphaColor).toBeDefined();
      expect(typeof alphaColor).toBe('string');
    });
  });

  describe('Theme Validation', () => {
    it('should validate required theme properties', () => {
      const theme = createAppTheme({
        name: 'test-theme',
        primaryColor: '#29F2DF',
        secondaryColor: '#1C7FA6',
      });

      expect(theme.name).toBeTruthy();
      expect(theme.colors).toBeTruthy();
      expect(theme.units).toBeTruthy();
      expect(theme.typography).toBeTruthy();
    });

    it('should handle invalid color formats gracefully', () => {
      expect(() => {
        createAppTheme({
          name: 'test-theme',
          primaryColor: 'invalid-color',
          secondaryColor: '#1C7FA6',
        });
      }).not.toThrow();
    });
  });

  describe('Theme Persistence', () => {
    it('should serialize theme to JSON', () => {
      const theme = createAppTheme({
        name: 'test-theme',
        primaryColor: '#29F2DF',
        secondaryColor: '#1C7FA6',
      });

      const serialized = JSON.stringify(theme);
      expect(serialized).toBeTruthy();
      expect(typeof serialized).toBe('string');
    });

    it('should deserialize theme from JSON', () => {
      const originalTheme = createAppTheme({
        name: 'test-theme',
        primaryColor: '#29F2DF',
        secondaryColor: '#1C7FA6',
      });

      const serialized = JSON.stringify(originalTheme);
      const deserialized = JSON.parse(serialized);

      expect(deserialized.name).toBe(originalTheme.name);
      expect(deserialized.colors).toBeDefined();
    });
  });
});
