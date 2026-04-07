/**
 * Dark Mode Manager
 * Theme switching, system preference detection, color adaptation
 */

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  text: string;
  textSecondary: string;
  gridLines: string;
  tooltipBackground: string;
  tooltipText: string;
}

export interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
  storageKey?: string;
}

/**
 * Dark Mode Manager
 */
export class DarkModeManager {
  private currentMode: ThemeMode = 'auto';
  private isDarkMode: boolean = false;
  private config: ThemeConfig;
  private mediaQuery: MediaQueryList | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private storageKey: string;

  constructor(config: ThemeConfig) {
    this.config = config;
    this.storageKey = config.storageKey || 'rhuds-theme-mode';
    this.initializeTheme();
  }

  /**
   * Initialize theme
   */
  private initializeTheme(): void {
    // Check stored preference
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      this.currentMode = stored as ThemeMode;
    }

    // Setup system preference listener
    if (window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', (e) => {
        if (this.currentMode === 'auto') {
          this.isDarkMode = e.matches;
          this.applyTheme();
          this.emit('theme:changed', { mode: this.currentMode, isDark: this.isDarkMode });
        }
      });

      // Set initial dark mode based on system preference
      this.isDarkMode = this.mediaQuery.matches;
    }

    this.applyTheme();
  }

  /**
   * Set theme mode
   */
  public setTheme(mode: ThemeMode): void {
    this.currentMode = mode;
    localStorage.setItem(this.storageKey, mode);

    if (mode === 'auto') {
      this.isDarkMode = this.mediaQuery?.matches || false;
    } else {
      this.isDarkMode = mode === 'dark';
    }

    this.applyTheme();
    this.emit('theme:set', { mode, isDark: this.isDarkMode });
  }

  /**
   * Get current theme mode
   */
  public getTheme(): ThemeMode {
    return this.currentMode;
  }

  /**
   * Check if dark mode is active
   */
  public isDark(): boolean {
    return this.isDarkMode;
  }

  /**
   * Get current colors
   */
  public getColors(): ThemeColors {
    return this.isDarkMode ? this.config.dark : this.config.light;
  }

  /**
   * Get specific color
   */
  public getColor(key: keyof ThemeColors): string {
    const colors = this.getColors();
    return colors[key];
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    const colors = this.getColors();
    const root = document.documentElement;

    // Set CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--rhuds-${this.camelToKebab(key)}`, value);
    });

    // Set data attribute
    root.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');

    // Add/remove dark mode class
    if (this.isDarkMode) {
      document.body.classList.add('rhuds-dark-mode');
      document.body.classList.remove('rhuds-light-mode');
    } else {
      document.body.classList.add('rhuds-light-mode');
      document.body.classList.remove('rhuds-dark-mode');
    }

    this.emit('theme:applied', { isDark: this.isDarkMode });
  }

  /**
   * Adapt color for current theme
   */
  public adaptColor(lightColor: string, darkColor: string): string {
    return this.isDarkMode ? darkColor : lightColor;
  }

  /**
   * Lighten color
   */
  public lightenColor(color: string, amount: number = 0.1): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    const [r, g, b] = rgb;
    const factor = 1 + amount;

    return this.rgbToHex(
      Math.min(255, Math.round(r * factor)),
      Math.min(255, Math.round(g * factor)),
      Math.min(255, Math.round(b * factor))
    );
  }

  /**
   * Darken color
   */
  public darkenColor(color: string, amount: number = 0.1): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    const [r, g, b] = rgb;
    const factor = 1 - amount;

    return this.rgbToHex(
      Math.max(0, Math.round(r * factor)),
      Math.max(0, Math.round(g * factor)),
      Math.max(0, Math.round(b * factor))
    );
  }

  /**
   * Get contrasting text color
   */
  public getContrastingTextColor(backgroundColor: string): string {
    const rgb = this.hexToRgb(backgroundColor);
    if (!rgb) return this.isDarkMode ? '#ffffff' : '#000000';

    const [r, g, b] = rgb;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  /**
   * Create theme stylesheet
   */
  public createThemeStylesheet(): HTMLStyleElement {
    const style = document.createElement('style');

    const lightColors = this.config.light;
    const darkColors = this.config.dark;

    let css = ':root {\n';

    // Light theme variables
    Object.entries(lightColors).forEach(([key, value]) => {
      css += `  --rhuds-${this.camelToKebab(key)}: ${value};\n`;
    });

    css += '}\n\n';

    // Dark theme variables
    css += '[data-theme="dark"] {\n';
    Object.entries(darkColors).forEach(([key, value]) => {
      css += `  --rhuds-${this.camelToKebab(key)}: ${value};\n`;
    });
    css += '}\n';

    style.textContent = css;
    document.head.appendChild(style);

    return style;
  }

  /**
   * Convert camelCase to kebab-case
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Convert hex to RGB
   */
  private hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : null;
  }

  /**
   * Convert RGB to hex
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Destroy manager
   */
  public destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', () => {});
    }
    this.listeners.clear();
  }
}

export default DarkModeManager;
