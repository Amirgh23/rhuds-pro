/**
 * Unit tests for ThemeManager
 * 
 * Tests theme switching, persistence, inheritance, and composition.
 * Requirements: 1.8-1.10, 51.1-51.7
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ThemeManager,
  LocalStorageThemeStorage,
  ThemeSyncManager,
  extendTheme,
  composeThemes,
  getSystemThemePreference,
  watchSystemThemePreference,
} from '../ThemeManager';
import { createAppTheme } from '../creators';
import { RHUDSTheme } from '../models';

describe('ThemeManager', () => {
  let baseTheme: RHUDSTheme;
  let darkTheme: RHUDSTheme;

  beforeEach(() => {
    // Create test themes
    baseTheme = createAppTheme({
      name: 'base',
      version: '1.0.0',
      primaryColor: '#00f6ff',
    });

    darkTheme = createAppTheme({
      name: 'dark',
      version: '1.0.0',
      primaryColor: '#00f6ff',
    });

    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Runtime Theme Switching (Requirement 1.8)', () => {
    it('should switch themes at runtime', async () => {
      const manager = new ThemeManager(baseTheme);
      
      expect(manager.getCurrentTheme().name).toBe('base');
      
      await manager.switchTheme(darkTheme);
      
      expect(manager.getCurrentTheme().name).toBe('dark');
    });

    it('should switch themes by name', async () => {
      const manager = new ThemeManager(baseTheme);
      manager.registerTheme(darkTheme);
      
      await manager.switchTheme('dark');
      
      expect(manager.getCurrentTheme().name).toBe('dark');
    });

    it('should throw error when switching to unregistered theme name', async () => {
      const manager = new ThemeManager(baseTheme);
      
      await expect(manager.switchTheme('nonexistent')).rejects.toThrow(
        'Theme "nonexistent" not found in registry'
      );
    });

    it('should notify listeners on theme change', async () => {
      const manager = new ThemeManager(baseTheme);
      const listener = vi.fn();
      
      manager.subscribe(listener);
      await manager.switchTheme(darkTheme);
      
      expect(listener).toHaveBeenCalledWith(darkTheme);
    });

    it('should allow unsubscribing from theme changes', async () => {
      const manager = new ThemeManager(baseTheme);
      const listener = vi.fn();
      
      const unsubscribe = manager.subscribe(listener);
      unsubscribe();
      
      await manager.switchTheme(darkTheme);
      
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Theme Registry', () => {
    it('should register themes', () => {
      const manager = new ThemeManager(baseTheme);
      
      manager.registerTheme(darkTheme);
      
      expect(manager.getTheme('dark')).toBe(darkTheme);
    });

    it('should throw error when registering theme without name', () => {
      const manager = new ThemeManager(baseTheme);
      const themeWithoutName = { ...darkTheme, name: undefined };
      
      expect(() => manager.registerTheme(themeWithoutName as RHUDSTheme)).toThrow(
        'Theme must have a name to be registered'
      );
    });

    it('should return all registered theme names', () => {
      const manager = new ThemeManager(baseTheme);
      manager.registerTheme(darkTheme);
      
      const names = manager.getThemeNames();
      
      expect(names).toContain('base');
      expect(names).toContain('dark');
    });
  });

  describe('Theme Persistence (Requirements 51.1-51.7)', () => {
    it('should save theme to localStorage', async () => {
      const manager = new ThemeManager(baseTheme);
      
      await manager.switchTheme(darkTheme);
      
      const saved = localStorage.getItem('rhuds-pro-theme');
      expect(saved).toBeTruthy();
      
      const parsed = JSON.parse(saved!);
      expect(parsed.name).toBe('dark');
    });

    it('should load theme from localStorage (Requirement 51.2)', async () => {
      const manager1 = new ThemeManager(baseTheme);
      await manager1.switchTheme(darkTheme);
      
      // Create new manager and load from storage
      const manager2 = new ThemeManager(baseTheme);
      const loaded = await manager2.loadFromStorage();
      
      expect(loaded).toBeTruthy();
      expect(loaded!.name).toBe('dark');
      expect(manager2.getCurrentTheme().name).toBe('dark');
    });

    it('should return null when no theme in storage', async () => {
      const manager = new ThemeManager(baseTheme);
      
      const loaded = await manager.loadFromStorage();
      
      expect(loaded).toBeNull();
    });

    it('should clear theme from storage', async () => {
      const manager = new ThemeManager(baseTheme);
      await manager.switchTheme(darkTheme);
      
      await manager.clearStorage();
      
      const saved = localStorage.getItem('rhuds-pro-theme');
      expect(saved).toBeNull();
    });

    it('should persist theme within 100ms (Requirement 51.5)', async () => {
      const manager = new ThemeManager(baseTheme);
      
      const startTime = Date.now();
      await manager.switchTheme(darkTheme);
      const elapsed = Date.now() - startTime;
      
      expect(elapsed).toBeLessThan(100);
    });

    it('should handle localStorage quota exceeded errors gracefully (Requirement 51.6)', async () => {
      const storage = new LocalStorageThemeStorage();
      
      // Mock localStorage to throw quota exceeded error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        const error = new DOMException('Quota exceeded', 'QuotaExceededError');
        throw error;
      });
      
      // Should not throw
      await expect(storage.save(baseTheme)).resolves.not.toThrow();
      
      // Restore original
      localStorage.setItem = originalSetItem;
    });

    it('should preserve theme configuration in round-trip (Requirement 51.7)', async () => {
      const storage = new LocalStorageThemeStorage();
      
      await storage.save(baseTheme);
      const loaded = await storage.load();
      
      expect(loaded).toBeTruthy();
      expect(loaded!.name).toBe(baseTheme.name);
      expect(loaded!.version).toBe(baseTheme.version);
      expect(loaded!.colors.primary.main).toBe(baseTheme.colors.primary.main);
      expect(loaded!.units.space[4]).toBe(baseTheme.units.space[4]);
      
      // Test alpha function is restored
      expect(typeof loaded!.colors.primary.alpha).toBe('function');
      expect(loaded!.colors.primary.alpha(0.5)).toMatch(/rgba\(\d+,\s*\d+,\s*\d+,\s*0\.5\)/);
    });
  });

  describe('Theme Inheritance (Requirement 1.9)', () => {
    it('should extend base theme with overrides', () => {
      const extended = extendTheme(baseTheme, {
        name: 'extended',
        colors: {
          primary: {
            main: '#ff0000',
            light: '#ff6666',
            dark: '#cc0000',
            contrast: '#ffffff',
            alpha: (opacity: number) => `rgba(255, 0, 0, ${opacity})`,
          },
        },
      });
      
      expect(extended.name).toBe('extended');
      expect(extended.colors.primary.main).toBe('#ff0000');
      // Other properties should be inherited
      expect(extended.units).toEqual(baseTheme.units);
      expect(extended.typography).toEqual(baseTheme.typography);
    });

    it('should deeply merge nested properties', () => {
      const extended = extendTheme(baseTheme, {
        units: {
          space: {
            4: 20, // Override just one value
          },
        },
      });
      
      expect(extended.units.space[4]).toBe(20);
      // Other space values should be inherited
      expect(extended.units.space[0]).toBe(baseTheme.units.space[0]);
      expect(extended.units.space[5]).toBe(baseTheme.units.space[5]);
    });
  });

  describe('Theme Composition (Requirement 1.10)', () => {
    it('should compose multiple theme fragments', () => {
      const colorFragment = {
        colors: {
          primary: {
            main: '#ff0000',
            light: '#ff6666',
            dark: '#cc0000',
            contrast: '#ffffff',
            alpha: (opacity: number) => `rgba(255, 0, 0, ${opacity})`,
          },
        },
      };

      const unitFragment = {
        units: {
          space: {
            4: 20,
          },
        },
      };

      const composed = composeThemes(baseTheme, colorFragment, unitFragment);
      
      expect(composed.colors.primary.main).toBe('#ff0000');
      expect(composed.units.space[4]).toBe(20);
      // Other properties should be from base
      expect(composed.typography).toEqual(baseTheme.typography);
    });

    it('should throw error when composing with no themes', () => {
      expect(() => composeThemes()).toThrow(
        'At least one theme is required for composition'
      );
    });

    it('should handle multiple levels of composition', () => {
      const fragment1 = { name: 'fragment1' };
      const fragment2 = { version: '2.0.0' };
      const fragment3 = {
        colors: {
          primary: {
            main: '#00ff00',
            light: '#66ff66',
            dark: '#00cc00',
            contrast: '#000000',
            alpha: (opacity: number) => `rgba(0, 255, 0, ${opacity})`,
          },
        },
      };

      const composed = composeThemes(baseTheme, fragment1, fragment2, fragment3);
      
      expect(composed.name).toBe('fragment1');
      expect(composed.version).toBe('2.0.0');
      expect(composed.colors.primary.main).toBe('#00ff00');
    });
  });

  describe('Theme Sync Across Tabs (Requirement 51.3)', () => {
    it('should create sync manager', () => {
      const manager = new ThemeManager(baseTheme);
      const syncManager = new ThemeSyncManager(manager);
      
      expect(syncManager).toBeDefined();
      
      syncManager.destroy();
    });

    it('should clean up event listeners on destroy', () => {
      const manager = new ThemeManager(baseTheme);
      const syncManager = new ThemeSyncManager(manager);
      
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      syncManager.destroy();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'storage',
        expect.any(Function)
      );
    });
  });

  describe('System Theme Preference (Requirement 51.4)', () => {
    it('should get system theme preference', () => {
      const preference = getSystemThemePreference();
      
      expect(['light', 'dark']).toContain(preference);
    });

    it('should watch system theme preference changes', () => {
      const callback = vi.fn();
      
      const unwatch = watchSystemThemePreference(callback);
      
      expect(unwatch).toBeInstanceOf(Function);
      
      unwatch();
    });

    it('should handle SSR environment gracefully', () => {
      // Mock window as undefined
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      const preference = getSystemThemePreference();
      expect(preference).toBe('light');
      
      const unwatch = watchSystemThemePreference(() => {});
      expect(unwatch).toBeInstanceOf(Function);
      unwatch(); // Should not throw
      
      // Restore window
      global.window = originalWindow;
    });
  });

  describe('Error Handling', () => {
    it('should handle listener errors gracefully', async () => {
      const manager = new ThemeManager(baseTheme);
      const errorListener = vi.fn(() => {
        throw new Error('Listener error');
      });
      const goodListener = vi.fn();
      
      manager.subscribe(errorListener);
      manager.subscribe(goodListener);
      
      // Should not throw
      await expect(manager.switchTheme(darkTheme)).resolves.not.toThrow();
      
      // Good listener should still be called
      expect(goodListener).toHaveBeenCalled();
    });

    it('should handle JSON parse errors when loading', async () => {
      localStorage.setItem('rhuds-pro-theme', 'invalid json');
      
      const storage = new LocalStorageThemeStorage();
      const loaded = await storage.load();
      
      expect(loaded).toBeNull();
    });

    it('should handle storage errors when clearing', async () => {
      const storage = new LocalStorageThemeStorage();
      
      // Mock localStorage to throw error
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Storage error');
      });
      
      // Should not throw
      await expect(storage.clear()).resolves.not.toThrow();
      
      // Restore original
      localStorage.removeItem = originalRemoveItem;
    });
  });
});
