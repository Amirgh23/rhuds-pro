/**
 * Advanced Tooltip Engine
 * موتور Tooltip پیشرفته
 */
export class AdvancedTooltipEngine {
  private tooltips: Map<string, any> = new Map();
  private activeTooltip: string | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private templates: Map<string, (data: any) => string> = new Map();

  /**
   * Register tooltip
   * Tooltip را ثبت می‌کند
   */
  registerTooltip(id: string, config: any): void {
    this.tooltips.set(id, {
      ...config,
      visible: false,
      x: 0,
      y: 0,
      content: '',
    });
  }

  /**
   * Show tooltip
   * Tooltip را نمایش می‌دهد
   */
  showTooltip(id: string, x: number, y: number, data: any): void {
    const tooltip = this.tooltips.get(id);
    if (!tooltip) return;

    tooltip.visible = true;
    tooltip.x = x;
    tooltip.y = y;
    tooltip.content = this.renderContent(id, data);

    this.activeTooltip = id;
    this.emit('show', { id, x, y, content: tooltip.content });
  }

  /**
   * Hide tooltip
   * Tooltip را پنهان می‌کند
   */
  hideTooltip(id: string): void {
    const tooltip = this.tooltips.get(id);
    if (tooltip) {
      tooltip.visible = false;
      this.emit('hide', { id });
    }
  }

  /**
   * Update tooltip position
   * موضع Tooltip را به‌روزرسانی می‌کند
   */
  updatePosition(id: string, x: number, y: number): void {
    const tooltip = this.tooltips.get(id);
    if (tooltip && tooltip.visible) {
      tooltip.x = x;
      tooltip.y = y;
      this.emit('move', { id, x, y });
    }
  }

  /**
   * Register template
   * الگو را ثبت می‌کند
   */
  registerTemplate(id: string, template: (data: any) => string): void {
    this.templates.set(id, template);
  }

  /**
   * Render content
   * محتوا را رندر می‌کند
   */
  private renderContent(id: string, data: any): string {
    const template = this.templates.get(id);
    if (template) {
      return template(data);
    }

    // Default template
    if (typeof data === 'object') {
      return Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('<br>');
    }

    return String(data);
  }

  /**
   * Get tooltip
   */
  getTooltip(id: string) {
    return this.tooltips.get(id);
  }

  /**
   * Get active tooltip
   */
  getActiveTooltip() {
    return this.activeTooltip ? this.tooltips.get(this.activeTooltip) : null;
  }

  /**
   * Subscribe to tooltip events
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
          console.error('Error in tooltip listener:', error);
        }
      });
    }
  }

  /**
   * Clear all tooltips
   */
  clear(): void {
    this.tooltips.clear();
    this.activeTooltip = null;
  }
}
