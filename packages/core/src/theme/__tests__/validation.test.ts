/**
 * Unit tests for RHUDS Pro theme validation
 * 
 * Tests Requirements: 1.7
 */

import {
  validateTheme,
  isValidTheme,
  ThemeValidationError,
} from '../validation';
import {
  createThemeUnit,
  createThemeColor,
  createThemeStyle,
  createThemeBreakpoints,
  createCreateTheme,
  createAppTheme,
} from '../creators';

describe('ThemeValidationError', () => {
  it('should be an instance of Error', () => {
    const error = new ThemeValidationError('Test error');
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ThemeValidationError');
    expect(error.message).toBe('Test error');
  });
});

describe('validateTheme', () => {
  it('should validate a complete valid theme', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    expect(() => validateTheme(theme)).not.toThrow();
  });

  it('should throw error for non-object theme', () => {
    expect(() => validateTheme(null)).toThrow(ThemeValidationError);
    expect(() => validateTheme(undefined)).toThrow(ThemeValidationError);
    expect(() => validateTheme('string')).toThrow(ThemeValidationError);
    expect(() => validateTheme(123)).toThrow(ThemeValidationError);
  });

  it('should throw error for missing colors', () => {
    const invalidTheme = {
      units: {},
      typography: {},
      breakpoints: {},
      animation: {},
      zIndex: {},
    };
    
    expect(() => validateTheme(invalidTheme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(invalidTheme)).toThrow(/colors/);
  });

  it('should throw error for missing color palettes', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    // Remove required palette using Object.assign to bypass TypeScript
    Object.assign(theme.colors, { primary: undefined });
    delete theme.colors.primary;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/primary/);
  });

  it('should throw error for invalid color palette structure', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    // Invalid palette - missing properties
    const themeAny: any = theme;
    themeAny.colors.primary = { main: '#ff0000' };
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
  });

  it('should throw error for missing units', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.units;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/units/);
  });

  it('should throw error for missing unit scales', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.units.space;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/space/);
  });

  it('should throw error for invalid unit scale', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    // Invalid scale - missing level
    const themeAny: any = theme;
    delete themeAny.units.space[5];
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
  });

  it('should throw error for missing typography', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.typography;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/typography/);
  });

  it('should throw error for missing font family', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.typography.fontFamily;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/fontFamily/);
  });

  it('should throw error for missing font size', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.typography.fontSize.base;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/base/);
  });

  it('should throw error for missing breakpoints', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.breakpoints;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/breakpoints/);
  });

  it('should throw error for missing breakpoint values', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.breakpoints.values;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/values/);
  });

  it('should throw error for missing breakpoint labels', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.breakpoints.labels;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/labels/);
  });

  it('should throw error for missing animation', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.animation;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/animation/);
  });

  it('should throw error for missing animation duration', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.animation.duration;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/duration/);
  });

  it('should throw error for missing animation easing', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.animation.easing;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/easing/);
  });

  it('should throw error for missing zIndex', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.zIndex;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/zIndex/);
  });

  it('should throw error for missing zIndex properties', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.zIndex.modal;
    
    expect(() => validateTheme(theme)).toThrow(ThemeValidationError);
    expect(() => validateTheme(theme)).toThrow(/modal/);
  });
});

describe('isValidTheme', () => {
  it('should return true for valid theme', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    expect(isValidTheme(theme)).toBe(true);
  });

  it('should return false for invalid theme', () => {
    expect(isValidTheme(null)).toBe(false);
    expect(isValidTheme(undefined)).toBe(false);
    expect(isValidTheme({})).toBe(false);
    expect(isValidTheme({ colors: {} })).toBe(false);
  });

  it('should return false for theme with missing properties', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.colors;
    
    expect(isValidTheme(theme)).toBe(false);
  });
});

describe('Theme creation with validation', () => {
  it('should validate theme created with createCreateTheme', () => {
    const createTheme = createCreateTheme();
    
    // Should not throw
    expect(() => createTheme({})).not.toThrow();
  });

  it('should validate theme created with createAppTheme', () => {
    // Should not throw
    expect(() => createAppTheme({
      name: 'Test App',
      primaryColor: '#29F2DF',
    })).not.toThrow();
  });

  it('should validate theme with custom colors', () => {
    const createTheme = createCreateTheme();
    
    expect(() => createTheme({
      colors: {
        primary: createThemeColor('#ff0000'),
      },
    })).not.toThrow();
  });

  it('should validate theme with custom units', () => {
    const createTheme = createCreateTheme();
    
    expect(() => createTheme({
      units: {
        space: createThemeUnit(8),
      },
    })).not.toThrow();
  });

  it('should validate theme with custom typography', () => {
    const createTheme = createCreateTheme();
    
    expect(() => createTheme({
      typography: createThemeStyle({
        fontFamily: {
          primary: 'Inter, sans-serif',
        },
      }),
    })).not.toThrow();
  });

  it('should validate theme with custom breakpoints', () => {
    const createTheme = createCreateTheme();
    
    expect(() => createTheme({
      breakpoints: createThemeBreakpoints({
        sm: 600,
      }),
    })).not.toThrow();
  });
});

describe('Validation error messages', () => {
  it('should provide clear error message for missing color palette', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.colors.primary;
    
    try {
      validateTheme(theme);
      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(ThemeValidationError);
      expect((error as Error).message).toContain('primary');
      expect((error as Error).message).toContain('palette');
    }
  });

  it('should provide clear error message for invalid color palette', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    themeAny.colors.primary = { main: '#ff0000' }; // Missing other properties
    
    try {
      validateTheme(theme);
      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(ThemeValidationError);
      expect((error as Error).message).toContain('primary');
    }
  });

  it('should provide clear error message for missing unit scale', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.units.space;
    
    try {
      validateTheme(theme);
      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(ThemeValidationError);
      expect((error as Error).message).toContain('space');
    }
  });

  it('should provide clear error message for invalid unit scale', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.units.space[5];
    
    try {
      validateTheme(theme);
      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(ThemeValidationError);
      expect((error as Error).message).toContain('space');
      expect((error as Error).message).toContain('5');
    }
  });

  it('should provide clear error message for missing typography property', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.typography.fontFamily.primary;
    
    try {
      validateTheme(theme);
      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(ThemeValidationError);
      expect((error as Error).message).toContain('primary');
    }
  });

  it('should provide clear error message for missing breakpoint', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.breakpoints.values.md;
    
    try {
      validateTheme(theme);
      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(ThemeValidationError);
      expect((error as Error).message).toContain('md');
    }
  });

  it('should provide clear error message for missing animation property', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.animation.duration.normal;
    
    try {
      validateTheme(theme);
      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(ThemeValidationError);
      expect((error as Error).message).toContain('normal');
    }
  });

  it('should provide clear error message for missing zIndex property', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    const themeAny: any = theme;
    delete themeAny.zIndex.modal;
    
    try {
      validateTheme(theme);
      fail('Should have thrown error');
    } catch (error) {
      expect(error).toBeInstanceOf(ThemeValidationError);
      expect((error as Error).message).toContain('modal');
    }
  });
});

describe('Edge cases', () => {
  it('should validate theme with optional metadata', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({
      name: 'Test Theme',
      version: '1.0.0',
    });
    
    expect(() => validateTheme(theme)).not.toThrow();
  });

  it('should validate theme with custom color palettes', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({
      colors: {
        custom: {
          brand: createThemeColor('#29F2DF'),
        },
      },
    });
    
    expect(() => validateTheme(theme)).not.toThrow();
  });

  it('should handle theme with all default values', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    expect(() => validateTheme(theme)).not.toThrow();
    expect(isValidTheme(theme)).toBe(true);
  });
});
