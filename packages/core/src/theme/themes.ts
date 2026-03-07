import { ThemeMode } from './types'

export const darkMode: ThemeMode = {
  name: 'dark',
  tokens: {
    colors: {
      primary: '#29F2DF',
      secondary: '#1C7FA6',
      accent: '#EF3EF1',
      background: '#0A1225',
      surface: '#28125A',
      text: '#e0e0e0',
      border: '#1C7FA6',
      success: '#00ff9f',
      warning: '#ffb800',
      error: '#ff0055',
      info: '#29F2DF',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
    },
    typography: {
      fontFamily: "'Courier New', monospace",
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      glow: '0 0 10px rgba(41, 242, 223, 0.3)',
      'glow-lg': '0 0 20px rgba(41, 242, 223, 0.6)',
    },
    transitions: {
      fast: '200ms ease-out',
      normal: '300ms ease-out',
      slow: '500ms ease-out',
    },
    breakpoints: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1440px',
    },
  },
}

export const lightMode: ThemeMode = {
  name: 'light',
  tokens: {
    colors: {
      primary: '#0066cc',
      secondary: '#00aaff',
      accent: '#ff0099',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#1a1a1a',
      border: '#e0e0e0',
      success: '#00aa00',
      warning: '#ff8800',
      error: '#cc0000',
      info: '#0099ff',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
    },
    typography: {
      fontFamily: "'Courier New', monospace",
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      glow: '0 0 10px rgba(0, 102, 204, 0.3)',
      'glow-lg': '0 0 20px rgba(0, 102, 204, 0.6)',
    },
    transitions: {
      fast: '200ms ease-out',
      normal: '300ms ease-out',
      slow: '500ms ease-out',
    },
    breakpoints: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1440px',
    },
  },
}

export const neonGreenMode: ThemeMode = {
  name: 'neon-green',
  tokens: {
    ...darkMode.tokens,
    colors: {
      ...darkMode.tokens.colors,
      primary: '#29F2DF',
      secondary: '#1C7FA6',
      accent: '#EF3EF1',
    },
    shadows: {
      ...darkMode.tokens.shadows,
      glow: '0 0 10px rgba(41, 242, 223, 0.5)',
      'glow-lg': '0 0 30px rgba(41, 242, 223, 0.8)',
    },
  },
}

export const neonBlueMode: ThemeMode = {
  name: 'neon-blue',
  tokens: {
    ...darkMode.tokens,
    colors: {
      ...darkMode.tokens.colors,
      primary: '#1C7FA6',
      secondary: '#28125A',
      accent: '#29F2DF',
    },
    shadows: {
      ...darkMode.tokens.shadows,
      glow: '0 0 10px rgba(28, 127, 166, 0.5)',
      'glow-lg': '0 0 30px rgba(28, 127, 166, 0.8)',
    },
  },
}

export const neonRedMode: ThemeMode = {
  name: 'neon-red',
  tokens: {
    ...darkMode.tokens,
    colors: {
      ...darkMode.tokens.colors,
      primary: '#EF3EF1',
      secondary: '#29F2DF',
      accent: '#1C7FA6',
    },
    shadows: {
      ...darkMode.tokens.shadows,
      glow: '0 0 10px rgba(239, 62, 241, 0.5)',
      'glow-lg': '0 0 30px rgba(239, 62, 241, 0.8)',
    },
  },
}

export const DEFAULT_THEMES: ThemeMode[] = [
  darkMode,
  lightMode,
  neonGreenMode,
  neonBlueMode,
  neonRedMode,
]
