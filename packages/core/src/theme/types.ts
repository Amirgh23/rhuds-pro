/**
 * Theme token definitions for RHUDS
 */

export interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: Record<string, string>;
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number>;
  };
  shadows: Record<string, string>;
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  breakpoints: Record<string, string>;
}

export interface ThemeMode {
  name:
    | 'light'
    | 'dark'
    | 'neon-green'
    | 'neon-blue'
    | 'neon-red'
    | 'perseus'
    | 'green-terminal'
    | 'satellite-view';
  tokens: ThemeTokens;
}

export interface ThemeContextValue {
  currentMode: ThemeMode;
  availableModes: ThemeMode[];
  setTheme: (mode: ThemeMode['name']) => void;
  customizeToken: (path: string, value: string) => void;
}
