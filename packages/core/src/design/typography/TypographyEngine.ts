/**
 * Typography Engine
 * موتور Typography
 */
export class TypographyEngine {
  private scales: Map<string, any> = new Map();
  private fonts: Map<string, any> = new Map();
  private styles: Map<string, any> = new Map();

  /**
   * Register font
   * فونت را ثبت می‌کند
   */
  registerFont(id: string, config: any): void {
    this.fonts.set(id, {
      family: config.family || 'Arial',
      weights: config.weights || [400, 700],
      sizes: config.sizes || [12, 14, 16, 18, 20, 24, 32],
      lineHeights: config.lineHeights || [1.2, 1.5, 1.8],
    });
  }

  /**
   * Register typography scale
   * مقیاس Typography را ثبت می‌کند
   */
  registerScale(id: string, scale: any): void {
    this.scales.set(id, {
      h1: scale.h1 || { size: 32, weight: 700, lineHeight: 1.2 },
      h2: scale.h2 || { size: 24, weight: 700, lineHeight: 1.3 },
      h3: scale.h3 || { size: 20, weight: 600, lineHeight: 1.4 },
      body: scale.body || { size: 16, weight: 400, lineHeight: 1.5 },
      small: scale.small || { size: 14, weight: 400, lineHeight: 1.6 },
      caption: scale.caption || { size: 12, weight: 400, lineHeight: 1.7 },
    });
  }

  /**
   * Get typography style
   * سبک Typography را بازیابی می‌کند
   */
  getStyle(scaleId: string, level: string): any {
    const scale = this.scales.get(scaleId);
    if (!scale) return null;
    return scale[level];
  }

  /**
   * Generate responsive typography
   * Typography واکنش‌پذیر را تولید می‌کند
   */
  generateResponsive(baseSize: number, minSize: number, maxSize: number): any {
    return {
      mobile: minSize,
      tablet: (minSize + baseSize) / 2,
      desktop: baseSize,
      large: maxSize,
    };
  }

  /**
   * Calculate line height
   * ارتفاع خط را محاسبه می‌کند
   */
  calculateLineHeight(fontSize: number, ratio: number = 1.5): number {
    return fontSize * ratio;
  }

  /**
   * Generate font stack
   * پشته فونت را تولید می‌کند
   */
  generateFontStack(primary: string, fallbacks: string[] = []): string {
    const stack = [primary, ...fallbacks, 'sans-serif'];
    return stack.map((f) => `"${f}"`).join(', ');
  }

  /**
   * Get font metrics
   * معیارهای فونت را بازیابی می‌کند
   */
  getFontMetrics(fontId: string): any {
    const font = this.fonts.get(fontId);
    if (!font) return null;
    return {
      family: font.family,
      weights: font.weights,
      sizes: font.sizes,
      lineHeights: font.lineHeights,
    };
  }

  /**
   * Create typography preset
   * پیش‌تنظیم Typography را ایجاد می‌کند
   */
  createPreset(name: string, config: any): any {
    return {
      name,
      fontFamily: config.fontFamily || 'Arial',
      fontSize: config.fontSize || 16,
      fontWeight: config.fontWeight || 400,
      lineHeight: config.lineHeight || 1.5,
      letterSpacing: config.letterSpacing || 0,
      textTransform: config.textTransform || 'none',
    };
  }

  /**
   * Get all presets
   */
  getAllPresets(): any[] {
    const presets: any[] = [];
    this.styles.forEach((style, id) => {
      presets.push({ id, ...style });
    });
    return presets;
  }
}
