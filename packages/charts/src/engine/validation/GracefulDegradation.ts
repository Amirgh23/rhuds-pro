/**
 * Graceful Degradation
 * Provides fallbacks for missing features
 */

import type { Chart } from '../Chart';

export class GracefulDegradation {
  /**
   * Check if canvas context is available
   */
  static hasCanvasContext(chart: Chart): boolean {
    try {
      const ctx = chart.getContext();
      return ctx !== null && ctx !== undefined;
    } catch {
      return false;
    }
  }

  /**
   * Check if plugin is available
   */
  static hasPlugin(chart: Chart, pluginId: string): boolean {
    try {
      const plugins = (chart as any).plugins;
      return plugins && plugins.has(pluginId);
    } catch {
      return false;
    }
  }

  /**
   * Check if animations are supported
   */
  static supportsAnimations(): boolean {
    try {
      return typeof requestAnimationFrame !== 'undefined';
    } catch {
      return false;
    }
  }

  /**
   * Check if theme is available
   */
  static hasTheme(chart: Chart, themeName: string): boolean {
    try {
      const options = (chart as any).options;
      return options && options.variant === themeName;
    } catch {
      return false;
    }
  }

  /**
   * Get fallback canvas context
   */
  static getFallbackContext(chart: Chart): CanvasRenderingContext2D | null {
    try {
      const canvas = (chart as any).canvas;
      if (!canvas) return null;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('Canvas context not available, using fallback');
        return null;
      }

      return ctx;
    } catch {
      console.warn('Error getting canvas context');
      return null;
    }
  }

  /**
   * Get fallback animation duration
   */
  static getFallbackAnimationDuration(chart: Chart): number {
    try {
      const options = (chart as any).options;
      if (options && options.animation && options.animation.duration) {
        return options.animation.duration;
      }
    } catch {
      // Ignore
    }

    return 0; // No animation fallback
  }

  /**
   * Get fallback theme
   */
  static getFallbackTheme(): string {
    return 'r-huds'; // Default theme
  }

  /**
   * Render fallback message
   */
  static renderFallbackMessage(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    message: string
  ): void {
    try {
      ctx.save();
      ctx.fillStyle = '#FF0000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(message, width / 2, height / 2);
      ctx.restore();
    } catch {
      console.error('Error rendering fallback message');
    }
  }
}

export default GracefulDegradation;
