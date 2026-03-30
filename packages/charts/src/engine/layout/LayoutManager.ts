/**
 * Layout Manager
 * Manages chart layout, positioning, and space allocation
 */

import type { Scale } from '../scales/index';

export interface LayoutArea {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface LayoutOptions {
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
}

export class LayoutManager {
  private containerWidth: number = 0;
  private containerHeight: number = 0;
  private chartArea: LayoutArea = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
  private scales: Map<string, Scale> = new Map();
  private options: LayoutOptions = {};

  constructor(containerWidth: number, containerHeight: number, options: LayoutOptions = {}) {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.options = options;
  }

  /**
   * Register a scale for layout calculation
   */
  registerScale(id: string, scale: Scale, position: 'top' | 'bottom' | 'left' | 'right'): void {
    this.scales.set(id, scale);
  }

  /**
   * Calculate layout based on registered scales
   */
  calculateLayout(): void {
    const padding = this.parsePadding(this.options.padding || 10);
    const margin = this.parseMargin(this.options.margin || 0);

    let left = padding.left + margin.left;
    let top = padding.top + margin.top;
    let right = this.containerWidth - padding.right - margin.right;
    let bottom = this.containerHeight - padding.bottom - margin.bottom;

    // Reserve space for scales
    const scaleHeights = this.calculateScaleHeights();

    if (scaleHeights.top > 0) {
      top += scaleHeights.top;
    }
    if (scaleHeights.bottom > 0) {
      bottom -= scaleHeights.bottom;
    }
    if (scaleHeights.left > 0) {
      left += scaleHeights.left;
    }
    if (scaleHeights.right > 0) {
      right -= scaleHeights.right;
    }

    this.chartArea = {
      left,
      top,
      right,
      bottom,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
  }

  /**
   * Get the chart area
   */
  getChartArea(): LayoutArea {
    return { ...this.chartArea };
  }

  /**
   * Update container dimensions
   */
  updateContainerSize(width: number, height: number): void {
    this.containerWidth = width;
    this.containerHeight = height;
    this.calculateLayout();
  }

  /**
   * Get available space for data
   */
  getAvailableSpace(): { width: number; height: number } {
    return {
      width: this.chartArea.width,
      height: this.chartArea.height,
    };
  }

  /**
   * Parse padding configuration
   */
  private parsePadding(
    padding: number | { top?: number; right?: number; bottom?: number; left?: number }
  ): { top: number; right: number; bottom: number; left: number } {
    if (typeof padding === 'number') {
      return { top: padding, right: padding, bottom: padding, left: padding };
    }
    return {
      top: padding.top || 0,
      right: padding.right || 0,
      bottom: padding.bottom || 0,
      left: padding.left || 0,
    };
  }

  /**
   * Parse margin configuration
   */
  private parseMargin(
    margin: number | { top?: number; right?: number; bottom?: number; left?: number }
  ): { top: number; right: number; bottom: number; left: number } {
    if (typeof margin === 'number') {
      return { top: margin, right: margin, bottom: margin, left: margin };
    }
    return {
      top: margin.top || 0,
      right: margin.right || 0,
      bottom: margin.bottom || 0,
      left: margin.left || 0,
    };
  }

  /**
   * Calculate space needed for scales
   */
  private calculateScaleHeights(): {
    top: number;
    bottom: number;
    left: number;
    right: number;
  } {
    let top = 0;
    let bottom = 0;
    let left = 0;
    let right = 0;

    // Estimate scale heights (simplified)
    // In a real implementation, this would query actual scale dimensions
    const scaleHeight = 40;
    const scaleWidth = 60;

    this.scales.forEach((scale, id) => {
      // This is a simplified approach
      // In production, scales would report their actual dimensions
      if (id.includes('x') || id.includes('bottom')) {
        bottom = Math.max(bottom, scaleHeight);
      }
      if (id.includes('y') || id.includes('left')) {
        left = Math.max(left, scaleWidth);
      }
    });

    return { top, bottom, left, right };
  }
}

export default LayoutManager;
