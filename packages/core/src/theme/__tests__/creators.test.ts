/**
 * Unit tests for RHUDS Pro theme creation functions
 * 
 * Tests Requirements: 1.1-1.6
 */

import {
  createThemeUnit,
  createThemeColor,
  createThemeStyle,
  createThemeBreakpoints,
  createCreateTheme,
  createAppTheme,
} from '../creators';

describe('createThemeUnit', () => {
  it('should create a unit scale with default multipliers', () => {
    const scale = createThemeUnit(4);
    
    expect(scale[0]).toBe(0);
    expect(scale[1]).toBe(4);
    expect(scale[2]).toBe(8);
    expect(scale[3]).toBe(12);
    expect(scale[4]).toBe(16);
    expect(scale[5]).toBe(24);
    expect(scale[6]).toBe(32);
    expect(scale[7]).toBe(48);
    expect(scale[8]).toBe(64);
    expect(scale[9]).toBe(96);
    expect(scale[10]).toBe(128);
  });

  it('should create a unit scale with custom base unit', () => {
    const scale = createThemeUnit(8);
    
    expect(scale[1]).toBe(8);
    expect(scale[2]).toBe(16);
    expect(scale[4]).toBe(32);
  });

  it('should allow custom multipliers', () => {
    const scale = createThemeUnit(4, { 5: 10, 10: 50 });
    
    expect(scale[5]).toBe(40); // 4 * 10
    expect(scale[10]).toBe(200); // 4 * 50
  });

  it('should handle zero base unit', () => {
    const scale = createThemeUnit(0);
    
    expect(scale[0]).toBe(0);
    expect(scale[5]).toBe(0);
    expect(scale[10]).toBe(0);
  });
});

describe('createThemeColor', () => {
  it('should create a color palette from base color', () => {
    const palette = createThemeColor('#00f6ff');
    
    expect(palette.main).toBe('#00f6ff');
    expect(palette.light).toBeDefined();
    expect(palette.dark).toBeDefined();
    expect(palette.contrast).toBe('#ffffff');
    expect(typeof palette.alpha).toBe('function');
  });

  it('should generate lighter and darker variations', () => {
    const palette = createThemeColor('#808080');
    
    // Light should be lighter than main
    expect(palette.light).not.toBe(palette.main);
    // Dark should be darker than main
    expect(palette.dark).not.toBe(palette.main);
  });

  it('should allow custom light, dark, and contrast colors', () => {
    const palette = createThemeColor('#00f6ff', {
      light: '#66f9ff',
      dark: '#00c4cc',
      contrast: '#000000',
    });
    
    expect(palette.light).toBe('#66f9ff');
    expect(palette.dark).toBe('#00c4cc');
    expect(palette.contrast).toBe('#000000');
  });

  it('should create alpha function that returns rgba', () => {
    const palette = createThemeColor('#00f6ff');
    const alpha50 = palette.alpha(0.5);
    
    expect(alpha50).toMatch(/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.5\)$/);
  });

  it('should support gradient definition', () => {
    const gradient = {
      type: 'linear' as const,
      angle: 45,
      stops: [
        { color: '#00f6ff', position: 0 },
        { color: '#7b61ff', position: 100 },
      ],
    };
    
    const palette = createThemeColor('#00f6ff', { gradient });
    
    expect(palette.gradient).toEqual(gradient);
  });

  it('should throw error for invalid hex color', () => {
    expect(() => createThemeColor('invalid')).toThrow('Invalid hex color format');
    expect(() => createThemeColor('#fff')).toThrow('Invalid hex color format');
    expect(() => createThemeColor('rgb(0,0,0)')).toThrow('Invalid hex color format');
  });
});

describe('createThemeStyle', () => {
  it('should create typography system with defaults', () => {
    const typography = createThemeStyle();
    
    expect(typography.fontFamily.primary).toBeDefined();
    expect(typography.fontFamily.secondary).toBeDefined();
    expect(typography.fontFamily.mono).toBeDefined();
    expect(typography.fontSize.base).toBe('1rem');
    expect(typography.fontWeight.normal).toBe(400);
    expect(typography.lineHeight.normal).toBe(1.5);
    expect(typography.letterSpacing.normal).toBe('0em');
  });

  it('should allow custom font families', () => {
    const typography = createThemeStyle({
      fontFamily: {
        primary: 'Inter, sans-serif',
        secondary: 'Orbitron, sans-serif',
      },
    });
    
    expect(typography.fontFamily.primary).toBe('Inter, sans-serif');
    expect(typography.fontFamily.secondary).toBe('Orbitron, sans-serif');
  });

  it('should allow custom font sizes', () => {
    const typography = createThemeStyle({
      fontSize: {
        base: '16px',
        lg: '18px',
      },
    });
    
    expect(typography.fontSize.base).toBe('16px');
    expect(typography.fontSize.lg).toBe('18px');
    expect(typography.fontSize.sm).toBe('0.875rem'); // Default preserved
  });

  it('should allow custom font weights', () => {
    const typography = createThemeStyle({
      fontWeight: {
        normal: 450,
        bold: 750,
      },
    });
    
    expect(typography.fontWeight.normal).toBe(450);
    expect(typography.fontWeight.bold).toBe(750);
  });

  it('should allow custom line heights', () => {
    const typography = createThemeStyle({
      lineHeight: {
        tight: 1.2,
        normal: 1.6,
      },
    });
    
    expect(typography.lineHeight.tight).toBe(1.2);
    expect(typography.lineHeight.normal).toBe(1.6);
  });

  it('should allow custom letter spacing', () => {
    const typography = createThemeStyle({
      letterSpacing: {
        tight: '-0.01em',
        wide: '0.05em',
      },
    });
    
    expect(typography.letterSpacing.tight).toBe('-0.01em');
    expect(typography.letterSpacing.wide).toBe('0.05em');
  });
});

describe('createThemeBreakpoints', () => {
  it('should create breakpoint system with defaults', () => {
    const breakpoints = createThemeBreakpoints();
    
    expect(breakpoints.values.xs).toBe(0);
    expect(breakpoints.values.sm).toBe(640);
    expect(breakpoints.values.md).toBe(768);
    expect(breakpoints.values.lg).toBe(1024);
    expect(breakpoints.values.xl).toBe(1280);
    expect(breakpoints.values['2xl']).toBe(1536);
    
    expect(breakpoints.labels.xs).toBe('mobile');
    expect(breakpoints.labels.sm).toBe('tablet');
    expect(breakpoints.labels.md).toBe('laptop');
  });

  it('should allow custom breakpoint values', () => {
    const breakpoints = createThemeBreakpoints({
      sm: 600,
      md: 900,
      lg: 1200,
    });
    
    expect(breakpoints.values.sm).toBe(600);
    expect(breakpoints.values.md).toBe(900);
    expect(breakpoints.values.lg).toBe(1200);
    expect(breakpoints.values.xs).toBe(0); // Default preserved
  });

  it('should allow custom breakpoint labels', () => {
    const breakpoints = createThemeBreakpoints(
      undefined,
      {
        sm: 'small',
        md: 'medium',
        lg: 'large',
      }
    );
    
    expect(breakpoints.labels.sm).toBe('small');
    expect(breakpoints.labels.md).toBe('medium');
    expect(breakpoints.labels.lg).toBe('large');
  });
});

describe('createCreateTheme', () => {
  it('should return a theme creation function', () => {
    const createTheme = createCreateTheme();
    
    expect(typeof createTheme).toBe('function');
  });

  it('should create a complete theme with defaults', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    expect(theme.colors).toBeDefined();
    expect(theme.units).toBeDefined();
    expect(theme.typography).toBeDefined();
    expect(theme.breakpoints).toBeDefined();
    expect(theme.animation).toBeDefined();
    expect(theme.zIndex).toBeDefined();
  });

  it('should include theme metadata', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({
      name: 'Test Theme',
      version: '1.0.0',
    });
    
    expect(theme.name).toBe('Test Theme');
    expect(theme.version).toBe('1.0.0');
  });

  it('should merge custom colors with defaults', () => {
    const createTheme = createCreateTheme();
    const customPrimary = createThemeColor('#ff0000');
    
    const theme = createTheme({
      colors: {
        primary: customPrimary,
      },
    });
    
    expect(theme.colors.primary.main).toBe('#ff0000');
    expect(theme.colors.secondary).toBeDefined(); // Default preserved
  });

  it('should merge custom units with defaults', () => {
    const createTheme = createCreateTheme();
    const customSpace = createThemeUnit(8);
    
    const theme = createTheme({
      units: {
        space: customSpace,
      },
    });
    
    expect(theme.units.space[1]).toBe(8);
    expect(theme.units.size).toBeDefined(); // Default preserved
  });

  it('should include default color palettes', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    expect(theme.colors.primary).toBeDefined();
    expect(theme.colors.secondary).toBeDefined();
    expect(theme.colors.success).toBeDefined();
    expect(theme.colors.warning).toBeDefined();
    expect(theme.colors.error).toBeDefined();
    expect(theme.colors.info).toBeDefined();
    expect(theme.colors.neutral).toBeDefined();
    expect(theme.colors.background).toBeDefined();
    expect(theme.colors.text).toBeDefined();
  });

  it('should include default animation settings', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    expect(theme.animation.duration.fast).toBe(150);
    expect(theme.animation.duration.normal).toBe(300);
    expect(theme.animation.easing.easeInOut).toBeDefined();
  });

  it('should include default z-index values', () => {
    const createTheme = createCreateTheme();
    const theme = createTheme({});
    
    expect(theme.zIndex.modal).toBe(1400);
    expect(theme.zIndex.tooltip).toBe(1600);
    expect(theme.zIndex.notification).toBe(1700);
  });
});

describe('createAppTheme', () => {
  it('should create a complete application theme', () => {
    const theme = createAppTheme({
      name: 'My App',
      primaryColor: '#00f6ff',
    });
    
    expect(theme.name).toBe('My App');
    expect(theme.colors.primary.main).toBe('#00f6ff');
  });

  it('should support custom primary and secondary colors', () => {
    const theme = createAppTheme({
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
    });
    
    expect(theme.colors.primary.main).toBe('#ff0000');
    expect(theme.colors.secondary.main).toBe('#00ff00');
  });

  it('should support custom base unit', () => {
    const theme = createAppTheme({
      baseUnit: 8,
    });
    
    expect(theme.units.space[1]).toBe(8);
    expect(theme.units.size[1]).toBe(8);
  });

  it('should support custom font family', () => {
    const theme = createAppTheme({
      fontFamily: 'Inter, sans-serif',
    });
    
    expect(theme.typography.fontFamily.primary).toBe('Inter, sans-serif');
  });

  it('should support custom breakpoints', () => {
    const theme = createAppTheme({
      breakpoints: {
        sm: 600,
        md: 900,
      },
    });
    
    expect(theme.breakpoints.values.sm).toBe(600);
    expect(theme.breakpoints.values.md).toBe(900);
  });

  it('should support custom colors', () => {
    const theme = createAppTheme({
      customColors: {
        brand: '#ff00ff',
        accent: '#00ffff',
      },
    });
    
    expect(theme.colors.custom).toBeDefined();
    expect(theme.colors.custom?.brand.main).toBe('#ff00ff');
    expect(theme.colors.custom?.accent.main).toBe('#00ffff');
  });

  it('should create a theme with all required properties', () => {
    const theme = createAppTheme({
      name: 'Complete Theme',
      version: '1.0.0',
      primaryColor: '#00f6ff',
      secondaryColor: '#7b61ff',
      baseUnit: 4,
      fontFamily: 'Inter, sans-serif',
    });
    
    // Verify all required theme properties exist
    expect(theme.colors).toBeDefined();
    expect(theme.units).toBeDefined();
    expect(theme.typography).toBeDefined();
    expect(theme.breakpoints).toBeDefined();
    expect(theme.animation).toBeDefined();
    expect(theme.zIndex).toBeDefined();
  });
});

describe('Theme creation integration', () => {
  it('should allow composing themes from individual functions', () => {
    const createTheme = createCreateTheme();
    
    const theme = createTheme({
      name: 'Composed Theme',
      colors: {
        primary: createThemeColor('#00f6ff'),
        secondary: createThemeColor('#7b61ff'),
      },
      units: {
        space: createThemeUnit(8),
        size: createThemeUnit(8),
      },
      typography: createThemeStyle({
        fontFamily: {
          primary: 'Inter, sans-serif',
        },
      }),
      breakpoints: createThemeBreakpoints({
        sm: 600,
        md: 900,
      }),
    });
    
    expect(theme.colors.primary.main).toBe('#00f6ff');
    expect(theme.units.space[1]).toBe(8);
    expect(theme.typography.fontFamily.primary).toBe('Inter, sans-serif');
    expect(theme.breakpoints.values.sm).toBe(600);
  });
});
