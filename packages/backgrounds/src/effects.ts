/**
 * Advanced Background Effects
 * Nebula, star field, animated gradients
 */

/**
 * Nebula effect renderer
 */
export class NebulaEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private time: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    this.ctx = ctx;
  }

  /**
   * Render nebula effect
   */
  render(colors: string[], scale: number = 1, speed: number = 1, opacity: number = 0.5): void {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Create gradient
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 2
    );

    // Add color stops
    colors.forEach((color, index) => {
      const position = index / (colors.length - 1);
      gradient.addColorStop(position, color);
    });

    // Apply nebula with noise
    ctx.globalAlpha = opacity;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add turbulence effect
    this.addTurbulence(scale, speed);

    ctx.globalAlpha = 1;
    this.time += speed * 0.016;
  }

  /**
   * Add turbulence to nebula
   */
  private addTurbulence(scale: number, speed: number): void {
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.sin(i * 0.001 + this.time * speed) * 0.5 + 0.5;
      data[i] = Math.min(255, data[i] * (0.8 + noise * 0.2));
      data[i + 1] = Math.min(255, data[i + 1] * (0.8 + noise * 0.2));
      data[i + 2] = Math.min(255, data[i + 2] * (0.8 + noise * 0.2));
    }

    ctx.putImageData(imageData, 0, 0);
  }
}

/**
 * Star field effect renderer
 */
export class StarFieldEffect {
  private stars: Array<{
    x: number;
    y: number;
    z: number;
    size: number;
    brightness: number;
  }> = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private time: number = 0;

  constructor(canvas: HTMLCanvasElement, starCount: number = 200) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    this.ctx = ctx;

    // Generate stars
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(),
        size: Math.random() * 2,
        brightness: Math.random(),
      });
    }
  }

  /**
   * Render star field with parallax
   */
  render(speed: number = 1, parallaxFactor: number = 0.5, color: string = '#ffffff'): void {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    for (const star of this.stars) {
      // Update z position (parallax)
      star.z -= speed * 0.001;
      if (star.z <= 0) {
        star.z = 1;
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      }

      // Calculate screen position
      const scale = star.z * parallaxFactor + (1 - parallaxFactor);
      const screenX = (star.x - width / 2) * scale + width / 2;
      const screenY = (star.y - height / 2) * scale + height / 2;

      // Draw star
      const brightness = Math.sin(this.time + star.brightness * Math.PI * 2) * 0.5 + 0.5;
      ctx.globalAlpha = brightness;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(screenX, screenY, star.size * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    this.time += 0.016;
  }
}

/**
 * Animated gradient effect
 */
export class AnimatedGradientEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private time: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    this.ctx = ctx;
  }

  /**
   * Render animated gradient
   */
  render(colors: string[], angle: number = 0, speed: number = 1, opacity: number = 1): void {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Calculate gradient angle with animation
    const animatedAngle = angle + this.time * speed;
    const rad = (animatedAngle * Math.PI) / 180;
    const x1 = width / 2 + (Math.cos(rad) * Math.max(width, height)) / 2;
    const y1 = height / 2 + (Math.sin(rad) * Math.max(width, height)) / 2;
    const x2 = width / 2 - (Math.cos(rad) * Math.max(width, height)) / 2;
    const y2 = height / 2 - (Math.sin(rad) * Math.max(width, height)) / 2;

    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

    // Add color stops
    colors.forEach((color, index) => {
      const position = index / (colors.length - 1);
      gradient.addColorStop(position, color);
    });

    ctx.globalAlpha = opacity;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    this.time += 0.016;
  }
}

/**
 * Plasma effect renderer
 */
export class PlasmaEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private time: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    this.ctx = ctx;
  }

  /**
   * Render plasma effect
   */
  render(color1: string, color2: string, speed: number = 1, opacity: number = 0.5): void {
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < width * height; i++) {
      const x = i % width;
      const y = Math.floor(i / width);

      // Plasma formula
      const value =
        Math.sin((x + this.time * speed) * 0.01) * 0.5 +
        Math.sin((y + this.time * speed) * 0.01) * 0.5 +
        Math.sin((x + y + this.time * speed) * 0.01) * 0.5;

      const normalized = (value + 1.5) / 3;

      // Interpolate between colors
      const rgb1 = this.hexToRgb(color1);
      const rgb2 = this.hexToRgb(color2);

      data[i * 4] = Math.round(rgb1.r + (rgb2.r - rgb1.r) * normalized);
      data[i * 4 + 1] = Math.round(rgb1.g + (rgb2.g - rgb1.g) * normalized);
      data[i * 4 + 2] = Math.round(rgb1.b + (rgb2.b - rgb1.b) * normalized);
      data[i * 4 + 3] = Math.round(255 * opacity);
    }

    ctx.putImageData(imageData, 0, 0);
    this.time += speed * 0.016;
  }

  /**
   * Convert hex color to RGB
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
}

/**
 * Noise generator for procedural effects
 */
export class NoiseGenerator {
  private permutation: number[] = [];

  constructor(seed: number = 0) {
    this.permutation = this.generatePermutation(seed);
  }

  /**
   * Generate Perlin noise
   */
  perlin(x: number, y: number, z: number = 0): number {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const zi = Math.floor(z) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);

    const u = this.fade(xf);
    const v = this.fade(yf);
    const w = this.fade(zf);

    const p = this.permutation;
    const aa = p[p[p[xi] + yi] + zi];
    const ab = p[p[p[xi] + yi + 1] + zi];
    const ba = p[p[p[xi + 1] + yi] + zi];
    const bb = p[p[p[xi + 1] + yi + 1] + zi];

    const x1 = this.lerp(this.grad(aa, xf, yf, zf), this.grad(ba, xf - 1, yf, zf), u);
    const x2 = this.lerp(this.grad(ab, xf, yf - 1, zf), this.grad(bb, xf - 1, yf - 1, zf), u);

    const result = this.lerp(x1, x2, v);
    // Clamp to [-1, 1] range
    return Math.max(-1, Math.min(1, result));
  }

  /**
   * Fade function
   */
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * Linear interpolation
   */
  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  /**
   * Gradient function
   */
  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 8 ? y : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  /**
   * Generate permutation table
   */
  private generatePermutation(seed: number): number[] {
    const p: number[] = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }

    // Shuffle with seed using a better random function
    let random = seed;
    const seededRandom = () => {
      random = (random * 9301 + 49297) % 233280;
      return random / 233280;
    };

    for (let i = 255; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }

    // Duplicate for wrapping
    return [...p, ...p];
  }
}
