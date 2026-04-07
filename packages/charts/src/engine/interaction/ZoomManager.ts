/**
 * Zoom Manager
 * مدیریت بزرگ‌نمایی و کاهش‌نمایی
 */
export class ZoomManager {
  private zoomLevel: number = 1;
  private minZoom: number = 0.5;
  private maxZoom: number = 5;
  private zoomHistory: number[] = [1];
  private listeners: Map<string, Function[]> = new Map();

  constructor(minZoom: number = 0.5, maxZoom: number = 5) {
    this.minZoom = minZoom;
    this.maxZoom = maxZoom;
  }

  /**
   * Zoom in
   * بزرگ‌نمایی می‌کند
   */
  zoomIn(factor: number = 1.2): number {
    const newZoom = Math.min(this.zoomLevel * factor, this.maxZoom);
    this.setZoom(newZoom);
    return newZoom;
  }

  /**
   * Zoom out
   * کاهش‌نمایی می‌کند
   */
  zoomOut(factor: number = 1.2): number {
    const newZoom = Math.max(this.zoomLevel / factor, this.minZoom);
    this.setZoom(newZoom);
    return newZoom;
  }

  /**
   * Set zoom level
   * سطح بزرگ‌نمایی را تنظیم می‌کند
   */
  setZoom(level: number): void {
    const clampedLevel = Math.max(this.minZoom, Math.min(level, this.maxZoom));
    if (clampedLevel !== this.zoomLevel) {
      this.zoomLevel = clampedLevel;
      this.zoomHistory.push(clampedLevel);
      this.emit('zoom', { level: clampedLevel });
    }
  }

  /**
   * Reset zoom
   * بزرگ‌نمایی را بازنشانی می‌کند
   */
  reset(): void {
    this.setZoom(1);
  }

  /**
   * Undo zoom
   * آخرین بزرگ‌نمایی را برمی‌گرداند
   */
  undo(): void {
    if (this.zoomHistory.length > 1) {
      this.zoomHistory.pop();
      const previousZoom = this.zoomHistory[this.zoomHistory.length - 1];
      this.zoomLevel = previousZoom;
      this.emit('zoom', { level: previousZoom });
    }
  }

  /**
   * Get current zoom
   */
  getZoom(): number {
    return this.zoomLevel;
  }

  /**
   * Subscribe to zoom events
   */
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in zoom listener:', error);
        }
      });
    }
  }

  /**
   * Get zoom info
   */
  getInfo() {
    return {
      current: this.zoomLevel,
      min: this.minZoom,
      max: this.maxZoom,
      history: [...this.zoomHistory],
    };
  }
}
