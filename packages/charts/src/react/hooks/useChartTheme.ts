/**
 * useChartTheme Hook
 * Manages chart theme state
 */

import { useState, useCallback } from 'react';

export type ChartTheme = 'r-huds' | 'coldwar';

export interface ThemeConfig {
  colors?: string[];
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  [key: string]: any;
}

export const useChartTheme = (initialTheme: ChartTheme = 'r-huds') => {
  const [theme, setTheme] = useState<ChartTheme>(initialTheme);
  const [customTheme, setCustomTheme] = useState<ThemeConfig>({});

  const switchTheme = useCallback((newTheme: ChartTheme) => {
    setTheme(newTheme);
  }, []);

  const updateTheme = useCallback((themeConfig: ThemeConfig) => {
    setCustomTheme((prevTheme) => ({
      ...prevTheme,
      ...themeConfig,
    }));
  }, []);

  const resetTheme = useCallback(() => {
    setTheme(initialTheme);
    setCustomTheme({});
  }, [initialTheme]);

  const getThemeConfig = useCallback((): ThemeConfig => {
    const baseThemes: Record<ChartTheme, ThemeConfig> = {
      'r-huds': {
        colors: ['#29F2DF', '#FF006E', '#8338EC', '#FFBE0B', '#FB5607'],
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        textColor: '#29F2DF',
        borderColor: '#1C7FA6',
      },
      coldwar: {
        colors: ['#00FF00', '#FFFF00', '#FF0000', '#00FFFF', '#FF00FF'],
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        textColor: '#00FF00',
        borderColor: '#00AA00',
      },
    };

    return {
      ...baseThemes[theme],
      ...customTheme,
    };
  }, [theme, customTheme]);

  return {
    theme,
    customTheme,
    switchTheme,
    updateTheme,
    resetTheme,
    getThemeConfig,
  };
};

export default useChartTheme;
