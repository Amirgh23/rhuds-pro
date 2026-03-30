/**
 * Responsive Layout
 * Handles responsive behavior and resize detection
 */

import { LayoutManager, type LayoutOptions } from './LayoutManager';

export interface ResponsiveOptions extends LayoutOptions {
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  responsive?: boolean;
}

export class ResponsiveLayout extends LayoutManager {
  private resizeObserver: ResizeObserver | null = null;
  private container: HTMLElement | null = null;
  private resizeCallback: (() => void) | null = null;
  private responsiveOptions: ResponsiveOptions = {};

  constructor(containerWidth: number, containerHeight: number, options: ResponsiveOptions = {}) {
    super(containerWidth, containerHeight, options);
    this.responsiveOptions = options;
  }

  /**
   * Attach to a container element for resize detection
   */
  attachToContainer(container: HTMLElement, onResize: () => void): void {
    this.container = container;
    this.resizeCallback = onResize;

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(container);
    }
  }

  /**
   * Detach from container
   */
  detachFromContainer(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.container = null;
    this.resizeCallback = null;
  }

  /**
   * Handle resize event
   */
  private handleResize(): void {
    if (!this.container) return;

    const rect = this.container.getBoundingClientRect();
    const newWidth = rect.width;
    const newHeight = rect.height;

    // Apply aspect ratio if configured
    let finalHeight = newHeight;
    if (this.responsiveOptions.maintainAspectRatio && this.responsiveOptions.aspectRatio) {
      finalHeight = newWidth / this.responsiveOptions.aspectRatio;
    }

    this.updateContainerSize(newWidth, finalHeight);

    if (this.resizeCallback) {
      this.resizeCallback();
    }
  }

  /**
   * Get current dimensions
   */
  getDimensions(): { width: number; height: number } {
    if (this.container) {
      const rect = this.container.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    return { width: 0, height: 0 };
  }

  /**
   * Set aspect ratio
   */
  setAspectRatio(ratio: number): void {
    this.responsiveOptions.aspectRatio = ratio;
  }

  /**
   * Enable/disable responsive behavior
   */
  setResponsive(enabled: boolean): void {
    this.responsiveOptions.responsive = enabled;
    if (!enabled && this.resizeObserver) {
      this.detachFromContainer();
    }
  }
}

export default ResponsiveLayout;
