/**
 * Frame Variant Generator
 * تولید‌کننده فریم‌های متنوع
 */
export class FrameVariantGenerator {
  private variants: Map<string, any> = new Map();
  private templates: Map<string, any> = new Map();

  /**
   * Generate frame variants
   * فریم‌های متنوع را تولید می‌کند
   */
  generateVariants(baseConfig: any): any[] {
    const variants: any[] = [];

    // Size variants
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    sizes.forEach((size) => {
      variants.push(this.createSizeVariant(size, baseConfig));
    });

    // Style variants
    const styles = ['solid', 'outline', 'gradient', 'neon', 'glow'];
    styles.forEach((style) => {
      variants.push(this.createStyleVariant(style, baseConfig));
    });

    // Animation variants
    const animations = ['pulse', 'glow', 'flicker', 'wave', 'rotate'];
    animations.forEach((animation) => {
      variants.push(this.createAnimationVariant(animation, baseConfig));
    });

    // Corner variants
    const corners = ['sharp', 'rounded', 'beveled', 'cut', 'curved'];
    corners.forEach((corner) => {
      variants.push(this.createCornerVariant(corner, baseConfig));
    });

    return variants;
  }

  /**
   * Create size variant
   */
  private createSizeVariant(size: string, baseConfig: any): any {
    const sizeMap: any = {
      small: { padding: 8, strokeWidth: 1, fontSize: 12 },
      medium: { padding: 16, strokeWidth: 2, fontSize: 14 },
      large: { padding: 24, strokeWidth: 3, fontSize: 16 },
      xlarge: { padding: 32, strokeWidth: 4, fontSize: 18 },
    };

    return {
      id: `frame-${size}`,
      name: `${size.charAt(0).toUpperCase() + size.slice(1)} Frame`,
      type: 'size',
      ...sizeMap[size],
      ...baseConfig,
    };
  }

  /**
   * Create style variant
   */
  private createStyleVariant(style: string, baseConfig: any): any {
    const styleMap: any = {
      solid: { fill: true, stroke: true, opacity: 1 },
      outline: { fill: false, stroke: true, opacity: 1 },
      gradient: { fill: true, gradient: true, opacity: 0.8 },
      neon: { fill: false, stroke: true, glow: true, opacity: 1 },
      glow: { fill: true, glow: true, opacity: 0.9 },
    };

    return {
      id: `frame-${style}`,
      name: `${style.charAt(0).toUpperCase() + style.slice(1)} Frame`,
      type: 'style',
      ...styleMap[style],
      ...baseConfig,
    };
  }

  /**
   * Create animation variant
   */
  private createAnimationVariant(animation: string, baseConfig: any): any {
    const animationMap: any = {
      pulse: { duration: 2000, keyframes: ['0%', '50%', '100%'] },
      glow: { duration: 1500, keyframes: ['0%', '50%', '100%'] },
      flicker: { duration: 300, keyframes: ['0%', '50%', '100%'] },
      wave: { duration: 2000, keyframes: ['0%', '25%', '50%', '75%', '100%'] },
      rotate: { duration: 3000, keyframes: ['0%', '100%'] },
    };

    return {
      id: `frame-${animation}`,
      name: `${animation.charAt(0).toUpperCase() + animation.slice(1)} Frame`,
      type: 'animation',
      animation: animationMap[animation],
      ...baseConfig,
    };
  }

  /**
   * Create corner variant
   */
  private createCornerVariant(corner: string, baseConfig: any): any {
    const cornerMap: any = {
      sharp: { borderRadius: 0, cornerStyle: 'sharp' },
      rounded: { borderRadius: 8, cornerStyle: 'rounded' },
      beveled: { borderRadius: 0, cornerStyle: 'beveled' },
      cut: { borderRadius: 0, cornerStyle: 'cut' },
      curved: { borderRadius: 16, cornerStyle: 'curved' },
    };

    return {
      id: `frame-${corner}`,
      name: `${corner.charAt(0).toUpperCase() + corner.slice(1)} Frame`,
      type: 'corner',
      ...cornerMap[corner],
      ...baseConfig,
    };
  }

  /**
   * Register variant
   */
  registerVariant(id: string, config: any): void {
    this.variants.set(id, config);
  }

  /**
   * Get variant
   */
  getVariant(id: string): any {
    return this.variants.get(id);
  }

  /**
   * Get all variants
   */
  getAllVariants(): any[] {
    const all: any[] = [];
    this.variants.forEach((variant, id) => {
      all.push({ id, ...variant });
    });
    return all;
  }

  /**
   * Create composite variant
   * فریم ترکیبی را ایجاد می‌کند
   */
  createComposite(name: string, variants: string[]): any {
    const composite: any = {
      name,
      type: 'composite',
      variants: [],
    };

    variants.forEach((variantId) => {
      const variant = this.getVariant(variantId);
      if (variant) {
        composite.variants.push(variant);
      }
    });

    return composite;
  }
}
