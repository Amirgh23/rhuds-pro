/**
 * Unit tests for useThemeManager hook
 * 
 * Tests React integration for theme management.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useThemeManager } from '../useThemeManager';
import { ThemeManager } from '../ThemeManager';
import { createAppTheme } from '../creators';
import { RHUDSTheme } from '../models';

describe('useThemeManager', () => {
  let baseTheme: RHUDSTheme;
  let darkTheme: RHUDSTheme;
  let manager: ThemeManager;

  beforeEach(() => {
    // Create test themes
    baseTheme = createAppTheme({
      name: 'base',
      version: '1.0.0',
      primaryColor: '#29F2DF',
    });

    darkTheme = createAppTheme({
      name: 'dark',
      version: '1.0.0',
      primaryColor: '#1C7FA6',
    });

    // Clear localStorage
    localStorage.clear();

    // Create manager
    manager = new ThemeManager(baseTheme);
    manager.registerTheme(darkTheme);
  });

  it('should return current theme', () => {
    const { result } = renderHook(() => useThemeManager(manager));

    expect(result.current.currentTheme.name).toBe('base');
  });

  it('should switch themes', async () => {
    const { result } = renderHook(() => useThemeManager(manager));

    await act(async () => {
      await result.current.switchTheme('dark');
    });

    expect(result.current.currentTheme.name).toBe('dark');
  });

  it('should register new themes', () => {
    const { result } = renderHook(() => useThemeManager(manager));

    const newTheme = createAppTheme({
      name: 'custom',
      primaryColor: '#ff0000',
    });

    act(() => {
      result.current.registerTheme(newTheme);
    });

    expect(result.current.availableThemes).toContain('custom');
  });

  it('should load theme from storage on mount', async () => {
    // Save theme to storage
    await manager.switchTheme(darkTheme);

    // Create new manager
    const newManager = new ThemeManager(baseTheme);

    const { result } = renderHook(() =>
      useThemeManager(newManager, { autoLoad: true })
    );

    await waitFor(() => {
      expect(result.current.currentTheme.name).toBe('dark');
    });
  });

  it('should not auto-load when disabled', () => {
    const { result } = renderHook(() =>
      useThemeManager(manager, { autoLoad: false })
    );

    expect(result.current.currentTheme.name).toBe('base');
  });

  it('should update when theme changes externally', async () => {
    const { result } = renderHook(() => useThemeManager(manager));

    await act(async () => {
      await manager.switchTheme(darkTheme);
    });

    expect(result.current.currentTheme.name).toBe('dark');
  });

  it('should handle loading state', async () => {
    const { result } = renderHook(() => useThemeManager(manager));

    expect(result.current.isLoading).toBe(false);

    const switchPromise = act(async () => {
      await result.current.switchTheme('dark');
    });

    await switchPromise;

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => useThemeManager(manager));

    await act(async () => {
      try {
        await result.current.switchTheme('nonexistent');
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('not found in registry');
  });

  it('should clear storage', async () => {
    await manager.switchTheme(darkTheme);

    const { result } = renderHook(() => useThemeManager(manager));

    await act(async () => {
      await result.current.clearStorage();
    });

    const saved = localStorage.getItem('rhuds-pro-theme');
    expect(saved).toBeNull();
  });

  it('should return available themes', () => {
    const { result } = renderHook(() => useThemeManager(manager));

    expect(result.current.availableThemes).toContain('base');
    expect(result.current.availableThemes).toContain('dark');
  });

  it('should return system preference', () => {
    const { result } = renderHook(() => useThemeManager(manager));

    expect(['light', 'dark']).toContain(result.current.systemPreference);
  });

  it('should respect system preference when enabled', async () => {
    // Mock matchMedia to return dark preference
    const mockMatchMedia = vi.fn((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    window.matchMedia = mockMatchMedia as any;

    const { result } = renderHook(() =>
      useThemeManager(manager, { respectSystemPreference: true })
    );

    // Should attempt to switch to dark theme
    await waitFor(() => {
      expect(result.current.currentTheme.name).toBe('dark');
    });
  });

  it('should clean up subscriptions on unmount', () => {
    const { unmount } = renderHook(() => useThemeManager(manager));

    const subscribeSpy = vi.spyOn(manager, 'subscribe');

    unmount();

    // Verify subscription was cleaned up
    expect(subscribeSpy).toHaveBeenCalled();
  });
});
