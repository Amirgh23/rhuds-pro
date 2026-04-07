/**
 * Streaming Data Manager
 * مدیریت داده‌های جریانی و بروزرسانی‌های زنده
 */
export class StreamingDataManager {
  private listeners: Map<string, Function[]> = new Map();
  private buffers: Map<string, any[]> = new Map();
  private batchSize: number = 10;
  private batchInterval: number = 100; // ms
  private timers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Subscribe to data stream
   * اشتراک در جریان داده
   */
  subscribe(id: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, []);
    }
    this.listeners.get(id)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(id);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Push data to stream
   * داده را به جریان اضافه می‌کند
   */
  push(id: string, data: any): void {
    if (!this.buffers.has(id)) {
      this.buffers.set(id, []);
    }

    this.buffers.get(id)!.push(data);

    // Start batch timer if not already running
    if (!this.timers.has(id)) {
      this.startBatchTimer(id);
    }
  }

  /**
   * Start batch timer
   */
  private startBatchTimer(id: string): void {
    const timer = setInterval(() => {
      const buffer = this.buffers.get(id);
      if (buffer && buffer.length > 0) {
        const batch = buffer.splice(0, this.batchSize);
        this.emit(id, batch);
      } else {
        clearInterval(timer);
        this.timers.delete(id);
      }
    }, this.batchInterval);

    this.timers.set(id, timer);
  }

  /**
   * Emit data to listeners
   */
  private emit(id: string, data: any): void {
    const callbacks = this.listeners.get(id);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in streaming callback:', error);
        }
      });
    }
  }

  /**
   * Clear stream
   */
  clear(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(id);
    }
    this.buffers.delete(id);
    this.listeners.delete(id);
  }

  /**
   * Set batch configuration
   */
  setBatchConfig(size: number, interval: number): void {
    this.batchSize = size;
    this.batchInterval = interval;
  }
}
