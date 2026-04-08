/**
 * Design System Integration
 * Integrates all design systems with unified interface
 */

import { AdvancedColorSystem } from '../color/AdvancedColorSystem';
import { TypographyEngine } from '../typography/TypographyEngine';
import { AdvancedLayoutEngine } from '../layout/AdvancedLayoutEngine';

export interface DesignConfig {
  theme?: string;
  colorScheme?: 'light' | 'dark';
  typography?: string;
  layout?: string;
}

export interface DesignTheme {
  name: string;
  colors: Record<string, string>;
  typography: Record<string, any>;
  layout: Record<string, any>;
}

/**
 * Design Integration Manager
 * Manages all design systems and provides unified interface
 */
export class DesignIntegration {
  private colorSystem: AdvancedColorSystem;
  private typography: TypographyEngine;
  private layout: AdvancedLayoutEngine;
  private config: DesignConfig;
  private themes: Map<string, DesignTheme> = new Map();

  constructor(config: DesignConfig = {}) {
    this.config = {
      theme: 'default',
      colorScheme: 'dark',
      typography: 'default',
      layout: 'default',
      ...config,
    };

    this.colorSystem = new AdvancedColorSystem();
    this.typography = new TypographyEngine();
    this.layout = new AdvancedLayoutEngine();

    this.setupDefaultThemes();
  }

  /**
   * Setup default themes
   */
  private setupDefaultThemes(): void {
    // RHUDS theme
    this.registerTheme('rhuds', {
      name: 'RHUDS',
      colors: {
        primary: '#0ff',
        secondary: '#f0f',
        accent: '#0f0',
        background: '#000',
        text: '#0ff',
      },
      typography: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 14,
        fontWeight: 400,
      },
      layout: {
        columns: 12,
        gap: 16,
        maxWidth: 1200,
      },
    });

    // ColdWar theme
    this.registerTheme('coldwar', {
      name: 'Cold War',
      colors: {
        primary: '#00ff00',
        secondary: '#ffff00',
        accent: '#ff0000',
        background: '#0a0a0a',
        text: '#00ff00',
      },
      typography: {
        fontFamily: 'Courier New, monospace',
        fontSize: 12,
        fontWeight: 400,
      },
      layout: {
        columns: 12,
        gap: 12,
        maxWidth: 1024,
      },
    });

    // Light theme
    this.registerTheme('light', {
      name: 'Light',
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#28a745',
        background: '#ffffff',
        text: '#000000',
      },
      typography: {
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        fontSize: 14,
        fontWeight: 400,
      },
      layout: {
        columns: 12,
        gap: 16,
        maxWidth: 1200,
      },
    });
  }

  /**
   * Register a theme
   */
  public registerTheme(name: string, theme: DesignTheme): void {
    this.themes.set(name, theme);
  }

  /**
   * Get theme
   */
  public getTheme(name: string): DesignTheme | undefined {
    return this.themes.get(name);
  }

  /**
   * Set active theme
   */
  public setTheme(name: string): void {
    const theme = this.themes.get(name);
    if (!theme) {
      throw new Error(`Theme not found: ${name}`);
    }

    this.config.theme = name;

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      // Store in palette instead of individual registration
    });
    this.colorSystem.registerPalette(name, theme.colors);

    // Apply typography
    this.typography.registerFont('default', theme.typography);

    // Apply layout
    this.layout.registerGrid('default', theme.layout);
  }

  /**
   * Get color
   */
  public getColor(name: string): string {
    return this.colorSystem.getColor(name);
  }

  /**
   * Generate gradient
   */
  public generateGradient(from: string, to: string, steps: number): string[] {
    return this.colorSystem.generateGradient(from, to, steps);
  }

  /**
   * Get contrast ratio
   */
  public getContrast(color1: string, color2: string): number {
    return this.colorSystem.getContrast(color1, color2);
  }

  /**
   * Get typography style
   */
  public getTypographyStyle(variant: string): any {
    return this.typography.getStyle('default', variant);
  }

  /**
   * Get responsive typography
   */
  public getResponsiveTypography(baseSize: number, minSize: number, maxSize: number): any {
    return this.typography.generateResponsive(baseSize, minSize, maxSize);
  }

  /**
   * Get layout grid
   */
  public getLayoutGrid(): any {
    const grid = this.layout.grids?.get('default');
    return grid || { columns: 12, gap: 16, maxWidth: 1200 };
  }

  /**
   * Get responsive grid
   */
  public getResponsiveGrid(config: any): any {
    return this.layout.generateResponsiveGrid(config);
  }

  /**
   * Get media query
   */
  public getMediaQuery(breakpoint: string, type: 'min' | 'max' = 'min'): string {
    return this.layout.generateMediaQuery(breakpoint, type);
  }

  /**
   * Get all themes
   */
  public getAllThemes(): string[] {
    return Array.from(this.themes.keys());
  }

  /**
   * Get current theme
   */
  public getCurrentTheme(): string {
    return this.config.theme || 'default';
  }

  /**
   * Get color system
   */
  public getColorSystem(): AdvancedColorSystem {
    return this.colorSystem;
  }

  /**
   * Get typography engine
   */
  public getTypographyEngine(): TypographyEngine {
    return this.typography;
  }

  /**
   * Get layout engine
   */
  public getLayoutEngine(): AdvancedLayoutEngine {
    return this.layout;
  }

  /**
   * Export theme as CSS
   */
  public exportThemeAsCSS(themeName: string): string {
    const theme = this.themes.get(themeName);
    if (!theme) return '';

    let css = `:root {\n`;

    // Colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      css += `  --color-${key}: ${value};\n`;
    });

    // Typography
    css += `  --font-family: ${theme.typography.fontFamily};\n`;
    css += `  --font-size: ${theme.typography.fontSize}px;\n`;
    css += `  --font-weight: ${theme.typography.fontWeight};\n`;

    // Layout
    css += `  --grid-columns: ${theme.layout.columns};\n`;
    css += `  --grid-gap: ${theme.layout.gap}px;\n`;
    css += `  --max-width: ${theme.layout.maxWidth}px;\n`;

    css += `}\n`;

    return css;
  }

  /**
   * Destroy integration
   */
  public destroy(): void {
    this.themes.clear();
  }
}

export default DesignIntegration;
