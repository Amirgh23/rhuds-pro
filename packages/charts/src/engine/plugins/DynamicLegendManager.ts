/**
 * Dynamic Legend Manager
 * مدیریت Legend پویا
 */
export class DynamicLegendManager {
  private items: Map<string, any> = new Map();
  private filters: Set<string> = new Set();
  private listeners: Map<string, Function[]> = new Map();
  private customIcons: Map<string, string> = new Map();

  /**
   * Add legend item
   * آیتم Legend را اضافه می‌کند
   */
  addItem(id: string, config: any): void {
    this.items.set(id, {
      ...config,
      visible: true,
      filtered: false,
    });
    this.emit('itemAdded', { id, config });
  }

  /**
   * Remove legend item
   * آیتم Legend را حذف می‌کند
   */
  removeItem(id: string): void {
    this.items.delete(id);
    this.filters.delete(id);
    this.emit('itemRemoved', { id });
  }

  /**
   * Toggle item visibility
   * نمایش/پنهان کردن آیتم
   */
  toggleItem(id: string): void {
    const item = this.items.get(id);
    if (item) {
      item.visible = !item.visible;
      this.emit('itemToggled', { id, visible: item.visible });
    }
  }

  /**
   * Filter items
   * آیتم‌ها را فیلتر می‌کند
   */
  filterItems(query: string): void {
    this.filters.clear();

    this.items.forEach((item, id) => {
      const matches = item.label?.toLowerCase().includes(query.toLowerCase());
      if (!matches) {
        this.filters.add(id);
      }
    });

    this.emit('filtered', { query, filtered: Array.from(this.filters) });
  }

  /**
   * Clear filters
   * فیلترها را پاک می‌کند
   */
  clearFilters(): void {
    this.filters.clear();
    this.emit('filtersCleared', {});
  }

  /**
   * Register custom icon
   * آیکون سفارشی را ثبت می‌کند
   */
  registerIcon(id: string, icon: string): void {
    this.customIcons.set(id, icon);
  }

  /**
   * Get icon
   */
  getIcon(id: string): string | undefined {
    return this.customIcons.get(id);
  }

  /**
   * Get visible items
   */
  getVisibleItems() {
    const visible: any[] = [];
    this.items.forEach((item, id) => {
      if (item.visible && !this.filters.has(id)) {
        visible.push({ id, ...item });
      }
    });
    return visible;
  }

  /**
   * Get all items
   */
  getAllItems() {
    const all: any[] = [];
    this.items.forEach((item, id) => {
      all.push({ id, ...item });
    });
    return all;
  }

  /**
   * Subscribe to legend events
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
          console.error('Error in legend listener:', error);
        }
      });
    }
  }

  /**
   * Get legend info
   */
  getInfo() {
    return {
      total: this.items.size,
      visible: this.getVisibleItems().length,
      filtered: this.filters.size,
      items: this.getAllItems(),
    };
  }
}
