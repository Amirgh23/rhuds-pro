/**
 * Tests for RHUDS Pro theme data models
 */

import { describe, it, expect } from 'vitest';
import type {
  RHUDSTheme,
  ColorPalette,
  ColorSystem,
  UnitScale,
  TypographySystem,
  BreakpointSystem,
  AnimationDefaults,
  ZIndexSystem,
} from '../models';

describe('Theme Data Models', () => {
  describe('ColorPalette', () => {
    it('should define a valid color palette structure', () => {
      const palette: ColorPalette = {
        main: '#00f6ff',
        light: '#66f9ff',
        dark: '#00c4cc',
        contrast: '#000000',
        alpha: (opacity: number) => `rgba(0, 246, 255, ${opacity})`,
      };

      expect(palette.main).toBe('#00f6ff');
      expect(palette.alpha(0.5)).toBe('rgba(0, 246, 255, 0.5)');
    });

    it('should support optional gradient definition', () => {
      const palette: ColorPalette = {
        main: '#00f6ff',
        light: '#66f9ff',
        dark: '#00c4cc',
        contrast: '#000000',
        alpha: (opacity: number) => `rgba(0, 246, 255, ${opacity})`,
        gradient: {
          type: 'linear',
          angle: 45,
          stops: [
            { color: '#00f6ff', position: 0 },
            { color: '#00c4cc', position: 100 },
          ],
        },
      };

      expect(palette.gradient).toBeDefined();
      expect(palette.gradient?.type).toBe('linear');
    });
  });

  describe('UnitScale', () => {
    it('should define a valid unit scale from 0-10', () => {
      const scale: UnitScale = {
        0: 0,
        1: 4,
        2: 8,
        3: 12,
        4: 16,
        5: 24,
        6: 32,
        7: 48,
        8: 64,
        9: 96,
        10: 128,
      };

      expect(scale[0]).toBe(0);
      expect(scale[5]).toBe(24);
      expect(scale[10]).toBe(128);
    });
  });

  describe('RHUDSTheme', () => {
    it('should define a complete theme structure', () => {
      const theme: RHUDSTheme = {
        name: 'Test Theme',
        version: '1.0.0',
        colors: {
          primary: {
            main: '#00f6ff',
            light: '#66f9ff',
            dark: '#00c4cc',
            contrast: '#000000',
            alpha: (opacity: number) => `rgba(0, 246, 255, ${opacity})`,
          },
          secondary: {
            main: '#ff00f6',
            light: '#ff66f9',
            dark: '#cc00c4',
            contrast: '#ffffff',
            alpha: (opacity: number) => `rgba(255, 0, 246, ${opacity})`,
          },
          success: {
            main: '#00ff00',
            light: '#66ff66',
            dark: '#00cc00',
            contrast: '#000000',
            alpha: (opacity: number) => `rgba(0, 255, 0, ${opacity})`,
          },
          warning: {
            main: '#ffaa00',
            light: '#ffcc66',
            dark: '#cc8800',
            contrast: '#000000',
            alpha: (opacity: number) => `rgba(255, 170, 0, ${opacity})`,
          },
          error: {
            main: '#ff0000',
            light: '#ff6666',
            dark: '#cc0000',
            contrast: '#ffffff',
            alpha: (opacity: number) => `rgba(255, 0, 0, ${opacity})`,
          },
          info: {
            main: '#0088ff',
            light: '#66aaff',
            dark: '#0066cc',
            contrast: '#ffffff',
            alpha: (opacity: number) => `rgba(0, 136, 255, ${opacity})`,
          },
          neutral: {
            main: '#888888',
            light: '#aaaaaa',
            dark: '#666666',
            contrast: '#ffffff',
            alpha: (opacity: number) => `rgba(136, 136, 136, ${opacity})`,
          },
          background: {
            main: '#0a0a0a',
            light: '#1a1a1a',
            dark: '#000000',
            contrast: '#ffffff',
            alpha: (opacity: number) => `rgba(10, 10, 10, ${opacity})`,
          },
          text: {
            main: '#ffffff',
            light: '#cccccc',
            dark: '#999999',
            contrast: '#000000',
            alpha: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
          },
        },
        units: {
          space: {
            0: 0,
            1: 4,
            2: 8,
            3: 12,
            4: 16,
            5: 24,
            6: 32,
            7: 48,
            8: 64,
            9: 96,
            10: 128,
          },
          size: {
            0: 0,
            1: 4,
            2: 8,
            3: 12,
            4: 16,
            5: 24,
            6: 32,
            7: 48,
            8: 64,
            9: 96,
            10: 128,
          },
          radius: {
            0: 0,
            1: 2,
            2: 4,
            3: 6,
            4: 8,
            5: 12,
            6: 16,
            7: 24,
            8: 32,
            9: 48,
            10: 64,
          },
          shadow: {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
          },
        },
        typography: {
          fontFamily: {
            primary: 'Inter, system-ui, sans-serif',
            secondary: 'Orbitron, sans-serif',
            mono: 'Fira Code, monospace',
          },
          fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '3.75rem',
          },
          fontWeight: {
            thin: 100,
            extralight: 200,
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
            black: 900,
          },
          lineHeight: {
            none: 1,
            tight: 1.25,
            snug: 1.375,
            normal: 1.5,
            relaxed: 1.625,
            loose: 2,
          },
          letterSpacing: {
            tighter: '-0.05em',
            tight: '-0.025em',
            normal: '0',
            wide: '0.025em',
            wider: '0.05em',
            widest: '0.1em',
          },
        },
        breakpoints: {
          values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536,
          },
          labels: {
            xs: 'Extra Small',
            sm: 'Small',
            md: 'Medium',
            lg: 'Large',
            xl: 'Extra Large',
            '2xl': '2X Large',
          },
        },
        animation: {
          duration: {
            instant: 0,
            fast: 150,
            normal: 300,
            slow: 500,
            slower: 700,
            slowest: 1000,
          },
          easing: {
            linear: 'linear',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
            easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
            easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
            easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
            easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
            easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
            easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
            easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
            easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
            easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
            easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
            easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',
            easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
            easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
            easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
            easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
            easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          },
        },
        zIndex: {
          base: 0,
          dropdown: 1000,
          sticky: 1100,
          fixed: 1200,
          modalBackdrop: 1300,
          modal: 1400,
          popover: 1500,
          tooltip: 1600,
          notification: 1700,
        },
      };

      expect(theme.name).toBe('Test Theme');
      expect(theme.colors.primary.main).toBe('#00f6ff');
      expect(theme.units.space[5]).toBe(24);
      expect(theme.typography.fontFamily.primary).toBe('Inter, system-ui, sans-serif');
      expect(theme.breakpoints.values.md).toBe(768);
      expect(theme.animation.duration.normal).toBe(300);
      expect(theme.zIndex.modal).toBe(1400);
    });
  });

  describe('Type Safety', () => {
    it('should enforce required properties', () => {
      // This test verifies TypeScript compilation
      // If the types are incorrect, this won't compile
      const validateTheme = (theme: RHUDSTheme): boolean => {
        return (
          theme.colors !== undefined &&
          theme.units !== undefined &&
          theme.typography !== undefined &&
          theme.breakpoints !== undefined &&
          theme.animation !== undefined &&
          theme.zIndex !== undefined
        );
      };

      expect(validateTheme).toBeDefined();
    });
  });
});
