/**
 * Advanced Color System
 * سیستم رنگ پیشرفته
 */
export class AdvancedColorSystem {
  private palettes: Map<string, any> = new Map();
  private themes: Map<string, any> = new Map();
  private animations: Map<string, any> = new Map();

  /**
   * Register color palette
   * پالت رنگ را ثبت می‌کند
   */
  registerPalette(id: string, palette: any): void {
    this.palettes.set(id, {
      ...palette,
      primary: palette.primary || '#0ff',
      secondary: palette.secondary || '#f0f',
      accent: palette.accent || '#0f0',
      background: palette.background || '#000',
      text: palette.text || '#fff',
    });
  }

  /**
   * Register theme
   * تم را ثبت می‌کند
   */
  registerTheme(id: string, theme: any): void {
    this.themes.set(id, {
      ...theme,
      palette: theme.palette || 'default',
      mode: theme.mode || 'light',
    });
  }

  /**
   * Get color
   * رنگ را بازیابی می‌کند
   */
  getColor(paletteId: string, colorName: string): string {
    const palette = this.palettes.get(paletteId);
    if (!palette) return '#000';
    return palette[colorName] || '#000';
  }

  /**
   * Generate color gradient
   * گرادیان رنگ را تولید می‌کند
   */
  generateGradient(color1: string, color2: string, steps: number = 5): string[] {
    const gradient: string[] = [];
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);

    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
      const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
      const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
      gradient.push(this.rgbToHex(r, g, b));
    }

    return gradient;
  }

  /**
   * Get complementary color
   * رنگ متمم را بازیابی می‌کند
   */
  getComplementary(color: string): string {
    const rgb = this.hexToRgb(color);
    return this.rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
  }

  /**
   * Get analogous colors
   * رنگ‌های مشابه را بازیابی می‌کند
   */
  getAnalogous(color: string): string[] {
    const hsl = this.hexToHsl(color);
    return [
      this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
      color,
      this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
    ];
  }

  /**
   * Check color contrast
   * تضاد رنگ را بررسی می‌کند
   */
  getContrast(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    const lum1 = this.getLuminance(rgb1);
    const lum2 = this.getLuminance(rgb2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Helper: Hex to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  /**
   * Helper: RGB to Hex
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
   * Helper: Hex to HSL
   */
  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    const rgb = this.hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * Helper: HSL to Hex
   */
  private hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    return this.rgbToHex(
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    );
  }

  /**
   * Helper: Get luminance
   */
  private getLuminance(rgb: { r: number; g: number; b: number }): number {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((x) => {
      x = x / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
}
