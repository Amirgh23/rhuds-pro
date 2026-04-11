/**
 * Theme Provider Context
 * Provides theme configuration and switching capabilities to all components
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type ThemeName = 'rhuds' | 'coldwar' | 'cyberpunk' | 'neon' | 'glitch' | 'glow' | 'holo';

export interface ThemeConfig {
  name: ThemeName;
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, any>;
  effects: Record<string, any>;
}

export interface ThemeContextType {
  /** Current active theme */
  currentTheme: ThemeName;
  /** Theme configuration */
  themeConfig: ThemeConfig;
  /** Switch to a different theme */
  switchTheme: (theme: ThemeName) => void;
  /** Get theme configuration */
  getThemeConfig: (theme: ThemeName) => ThemeConfig;
}

/**
 * Default theme configurations
 */
const THEME_CONFIGS: Record<ThemeName, ThemeConfig> = {
  rhuds: {
    name: 'rhuds',
    colors: {
      primary: '#29F2DF',
      secondary: '#666666',
      error: '#EF3EF1',
      success: '#29F2DF',
      warning: '#FFB000',
      background: '#0a0a14',
      surface: '#1a1a2e',
      text: '#ffffff',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '1rem',
      fontWeight: 400,
    },
    effects: {
      glow: true,
      scanlines: false,
      cornerBrackets: false,
    },
  },
  coldwar: {
    name: 'coldwar',
    colors: {
      primary: '#FFB000',
      secondary: '#3A3A3E',
      error: '#FF3333',
      success: '#33FF00',
      warning: '#FFB000',
      background: '#0a0a14',
      surface: '#1a1a2e',
      text: '#ffffff',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
    effects: {
      glow: true,
      scanlines: true,
      cornerBrackets: true,
    },
  },
  cyberpunk: {
    name: 'cyberpunk',
    colors: {
      primary: '#29F2DF',
      secondary: '#EF3EF1',
      error: '#FF0080',
      success: '#00FF00',
      warning: '#FFFF00',
      background: '#0a0a14',
      surface: '#1a1a2e',
      text: '#ffffff',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    effects: {
      glow: true,
      scanlines: true,
      cornerBrackets: false,
    },
  },
  neon: {
    name: 'neon',
    colors: {
      primary: '#00FFFF',
      secondary: '#FF00FF',
      error: '#FF0080',
      success: '#00FF00',
      warning: '#FFFF00',
      background: '#000000',
      surface: '#0a0a0a',
      text: '#ffffff',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: "'Courier New', monospace",
      fontSize: '1rem',
      fontWeight: 600,
    },
    effects: {
      glow: true,
      scanlines: false,
      cornerBrackets: false,
    },
  },
  glitch: {
    name: 'glitch',
    colors: {
      primary: '#29F2DF',
      secondary: '#EF3EF1',
      error: '#FF0000',
      success: '#00FF00',
      warning: '#FFFF00',
      background: '#0a0a14',
      surface: '#1a1a2e',
      text: '#ffffff',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    effects: {
      glow: true,
      scanlines: true,
      cornerBrackets: false,
    },
  },
  glow: {
    name: 'glow',
    colors: {
      primary: '#29F2DF',
      secondary: '#EF3EF1',
      error: '#FF0080',
      success: '#00FF00',
      warning: '#FFB000',
      background: '#0a0a14',
      surface: '#1a1a2e',
      text: '#ffffff',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '1rem',
      fontWeight: 400,
    },
    effects: {
      glow: true,
      scanlines: false,
      cornerBrackets: false,
    },
  },
  holo: {
    name: 'holo',
    colors: {
      primary: '#00FFFF',
      secondary: '#FF00FF',
      error: '#FF0080',
      success: '#00FF00',
      warning: '#FFFF00',
      background: '#0a0a14',
      surface: '#1a1a2e',
      text: '#ffffff',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '1rem',
      fontWeight: 400,
    },
    effects: {
      glow: true,
      scanlines: false,
      cornerBrackets: false,
    },
  },
};

/**
 * Theme Context
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Provider Props
 */
export interface ThemeProviderProps {
  /** Initial theme */
  initialTheme?: ThemeName;
  /** Child components */
  children: React.ReactNode;
}

/**
 * Theme Provider Component
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialTheme = 'rhuds',
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(initialTheme);

  const switchTheme = useCallback((theme: ThemeName) => {
    setCurrentTheme(theme);
  }, []);

  const getThemeConfig = useCallback((theme: ThemeName): ThemeConfig => {
    return THEME_CONFIGS[theme] || THEME_CONFIGS.rhuds;
  }, []);

  const themeConfig = useMemo(() => getThemeConfig(currentTheme), [currentTheme, getThemeConfig]);

  const value: ThemeContextType = useMemo(
    () => ({
      currentTheme,
      themeConfig,
      switchTheme,
      getThemeConfig,
    }),
    [currentTheme, themeConfig, switchTheme, getThemeConfig]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook to use theme context
 */
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

/**
 * Hook to get current theme name
 */
export const useCurrentTheme = (): ThemeName => {
  const { currentTheme } = useThemeContext();
  return currentTheme;
};

/**
 * Hook to get theme configuration
 */
export const useThemeConfig = (): ThemeConfig => {
  const { themeConfig } = useThemeContext();
  return themeConfig;
};

/**
 * Hook to switch theme
 */
export const useSwitchTheme = (): ((theme: ThemeName) => void) => {
  const { switchTheme } = useThemeContext();
  return switchTheme;
};
