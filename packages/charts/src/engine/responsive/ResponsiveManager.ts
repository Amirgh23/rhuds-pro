/**
 * Responsive Design Manager
 * Mobile, tablet, desktop optimization with breakpoint management
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface Breakpoint {
  name: DeviceType;
  minWidth: number;
  maxWidth: number;
  width: number;
  height: number;
  scale?: number;
}

export interface ResponsiveConfig {
  mobile?: { width: number; height: number };
  tablet?: { width: number; height: number };
  desktop?: { width: number; height: number };
  autoScale?: boolean;
  maintainAspectRatio?: boolean;
}

export interface ResponsiveState {
  device: DeviceType;
  width: number;
  height: number;
  scale: number;
  breakpoint: Breakpoint;
}

/**
 * Responsive Manager
 */
export class ResponsiveManager {
  private breakpoints: Map<DeviceType, Breakpoint> = new Map();
  private currentState: ResponsiveState | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private config: ResponsiveConfig;

  constructor(config: ResponsiveConfig = {}) {
    this.config = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1920, height: 1080 },
      autoScale: true,
      maintainAspectRatio: true,
      ...config,
    };

    this.initializeBreakpoints();
  }

  /**
   * Initialize breakpoints
   */
  private initializeBreakpoints(): void {
    this.breakpoints.set('mobile', {
      name: 'mobile',
      minWidth: 0,
      maxWidth: 767,
      width: this.config.mobile!.width,
      height: this.config.mobile!.height,
      scale: 1,
    });

    this.breakpoints.set('tablet', {
      name: 'tablet',
      minWidth: 768,
      maxWidth: 1023,
      width: this.config.tablet!.width,
      height: this.config.tablet!.height,
      scale: 1.2,
    });

    this.breakpoints.set('desktop', {
      name: 'desktop',
      minWidth: 1024,
      maxWidth: Infinity,
      width: this.config.desktop!.width,
      height: this.config.desktop!.height,
      scale: 1.5,
    });
  }

  /**
   * Get current device type
   */
  public getCurrentDevice(): DeviceType {
    const width = window.innerWidth;

    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Get breakpoint for device
   */
  public getBreakpoint(device: DeviceType): Breakpoint | undefined {
    return this.breakpoints.get(device);
  }

  /**
   * Get responsive dimensions
   */
  public getResponsiveDimensions(
    containerWidth: number,
    containerHeight: number
  ): { width: number; height: number; scale: number } {
    const device = this.getCurrentDevice();
    const breakpoint = this.breakpoints.get(device);

    if (!breakpoint) {
      return { width: containerWidth, height: containerHeight, scale: 1 };
    }

    let width = Math.min(containerWidth, breakpoint.width);
    let height = Math.min(containerHeight, breakpoint.height);
    let scale = breakpoint.scale || 1;

    // Maintain aspect ratio if configured
    if (this.config.maintainAspectRatio) {
      const aspectRatio = breakpoint.width / breakpoint.height;
      const containerAspectRatio = containerWidth / containerHeight;

      if (containerAspectRatio > aspectRatio) {
        width = height * aspectRatio;
      } else {
        height = width / aspectRatio;
      }
    }

    // Auto scale if configured
    if (this.config.autoScale) {
      const scaleX = containerWidth / width;
      const scaleY = containerHeight / height;
      scale = Math.min(scaleX, scaleY, scale);
    }

    return { width, height, scale };
  }

  /**
   * Watch element for responsive changes
   */
  public watchElement(element: HTMLElement, callback: (state: ResponsiveState) => void): void {
    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateState(element, callback);
      });
    }

    this.resizeObserver.observe(element);
    this.updateState(element, callback);
  }

  /**
   * Update responsive state
   */
  private updateState(element: HTMLElement, callback: (state: ResponsiveState) => void): void {
    const rect = element.getBoundingClientRect();
    const device = this.getCurrentDevice();
    const breakpoint = this.breakpoints.get(device);

    if (!breakpoint) return;

    const dimensions = this.getResponsiveDimensions(rect.width, rect.height);

    this.currentState = {
      device,
      width: dimensions.width,
      height: dimensions.height,
      scale: dimensions.scale,
      breakpoint,
    };

    callback(this.currentState);
    this.emit('responsive:changed', this.currentState);
  }

  /**
   * Stop watching element
   */
  public stopWatching(element: HTMLElement): void {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(element);
    }
  }

  /**
   * Get responsive styles
   */
  public getResponsiveStyles(): Record<string, string> {
    const device = this.getCurrentDevice();

    const styles: Record<string, string> = {
      'font-size': this.getResponsiveFontSize(device),
      'padding': this.getResponsivePadding(device),
      'margin': this.getResponsiveMargin(device),
    };

    return styles;
  }

  /**
   * Get responsive font size
   */
  private getResponsiveFontSize(device: DeviceType): string {
    switch (device) {
      case 'mobile':
        return '12px';
      case 'tablet':
        return '14px';
      case 'desktop':
        return '16px';
      default:
        return '16px';
    }
  }

  /**
   * Get responsive padding
   */
  private getResponsivePadding(device: DeviceType): string {
    switch (device) {
      case 'mobile':
        return '8px';
      case 'tablet':
        return '12px';
      case 'desktop':
        return '16px';
      default:
        return '16px';
    }
  }

  /**
   * Get responsive margin
   */
  private getResponsiveMargin(device: DeviceType): string {
    switch (device) {
      case 'mobile':
        return '4px';
      case 'tablet':
        return '8px';
      case 'desktop':
        return '12px';
      default:
        return '12px';
    }
  }

  /**
   * Create media query listener
   */
  public onMediaQueryChange(query: string, callback: (matches: boolean) => void): void {\n    const mediaQuery = window.matchMedia(query);

    const handler = (e: MediaQueryListEvent) => {
      callback(e.matches);
    };

    mediaQuery.addEventListener('change', handler);

    // Call immediately with current state
    callback(mediaQuery.matches);

    this.emit('media:listener:added', { query });
  }

  /**
   * Get current state
   */
  public getCurrentState(): ResponsiveState | null {
    return this.currentState;
  }

  /**
   * Get all breakpoints
   */
  public getAllBreakpoints(): Breakpoint[] {
    return Array.from(this.breakpoints.values());
  }

  /**
   * Update breakpoint
   */
  public updateBreakpoint(device: DeviceType, config: Partial<Breakpoint>): void {
    const breakpoint = this.breakpoints.get(device);
    if (breakpoint) {
      Object.assign(breakpoint, config);
      this.emit('breakpoint:updated', { device, config });
    }
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
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.breakpoints.clear();
    this.listeners.clear();
  }
}

export default ResponsiveManager;
