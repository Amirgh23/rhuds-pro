/**
 * Pan Controller
 * کنترل جابجایی نمودار
 */
export class PanController {
  private offsetX: number = 0;
  private offsetY: number = 0;
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private listeners: Map<string, Function[]> = new Map();
  private constraints: { minX?: number; maxX?: number; minY?: number; maxY?: number } = {};

  /**
   * Start pan
   * جابجایی را شروع می‌کند
   */
  startPan(x: number, y: number): void {
    this.isDragging = true;
    this.startX = x;
    this.startY = y;
    this.emit('panStart', { x: this.offsetX, y: this.offsetY });
  }

  /**
   * Update pan
   * جابجایی را به‌روزرسانی می‌کند
   */
  updatePan(x: number, y: number): void {
    if (!this.isDragging) return;

    const deltaX = x - this.startX;
    const deltaY = y - this.startY;

    this.offsetX += deltaX;
    this.offsetY += deltaY;

    // Apply constraints
    if (this.constraints.minX !== undefined) {
      this.offsetX = Math.max(this.offsetX, this.constraints.minX);
    }
    if (this.constraints.maxX !== undefined) {
      this.offsetX = Math.min(this.offsetX, this.constraints.maxX);
    }
    if (this.constraints.minY !== undefined) {
      this.offsetY = Math.max(this.offsetY, this.constraints.minY);
    }
    if (this.constraints.maxY !== undefined) {
      this.offsetY = Math.min(this.offsetY, this.constraints.maxY);
    }

    this.startX = x;
    this.startY = y;

    this.emit('pan', { x: this.offsetX, y: this.offsetY, deltaX, deltaY });
  }

  /**
   * End pan
   * جابجایی را پایان می‌دهد
   */
  endPan(): void {
    this.isDragging = false;
    this.emit('panEnd', { x: this.offsetX, y: this.offsetY });
  }

  /**
   * Reset pan
   * جابجایی را بازنشانی می‌کند
   */
  reset(): void {
    this.offsetX = 0;
    this.offsetY = 0;
    this.isDragging = false;
    this.emit('reset', { x: 0, y: 0 });
  }

  /**
   * Set constraints
   * محدودیت‌ها را تنظیم می‌کند
   */
  setConstraints(constraints: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  }): void {
    this.constraints = constraints;
  }

  /**
   * Get offset
   */
  getOffset(): { x: number; y: number } {
    return { x: this.offsetX, y: this.offsetY };
  }

  /**
   * Subscribe to pan events
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
          console.error('Error in pan listener:', error);
        }
      });
    }
  }

  /**
   * Get pan info
   */
  getInfo() {
    return {
      offset: { x: this.offsetX, y: this.offsetY },
      isDragging: this.isDragging,
      constraints: this.constraints,
    };
  }
}
