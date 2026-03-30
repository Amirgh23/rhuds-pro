/**
 * Tooltip Plugin
 * Displays tooltips for chart elements
 */

import type { Plugin } from '../types/index';
import type { Chart } from '../Chart';
import type { ChartElement } from '../elements/index';

export interface TooltipOptions {
  enabled?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  textColor?: string;
  padding?: number;
  cornerRadius?: number;
  displayColors?: boolean;
  callbacks?: {
    title?: (items: any[]) => string;
    label?: (item: any) => string;
    afterLabel?: (item: any) => string;
  };
}

export class TooltipPlugin implements Plugin {
  id = 'tooltip';
  options: TooltipOptions = {
    enabled: true,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: '#29F2DF',
    borderWidth: 1,
    textColor: '#29F2DF',
    padding: 10,
    cornerRadius: 4,
    displayColors: true,
  };

  private hoveredElement: ChartElement | null = null;
  private tooltipX: number = 0;
  private tooltipY: number = 0;

  constructor(options: TooltipOptions = {}) {
    this.options = { ...this.options, ...options };
  }

  /**
   * Plugin initialization
   */
  beforeInit(chart: Chart): void {
    // Setup event listeners
    const eventSystem = (chart as any).eventSystem;
    if (eventSystem) {
      eventSystem.on('hover', (event: any) => {
        this.hoveredElement = event.element;
        if (this.hoveredElement) {
          const pos = this.hoveredElement.tooltipPosition();
          this.tooltipX = pos.x;
          this.tooltipY = pos.y;
        }
      });

      eventSystem.on('leave', () => {
        this.hoveredElement = null;
      });
    }
  }

  /**
   * Draw tooltip
   */
  beforeDraw(chart: Chart, args: any): void {
    if (!this.options.enabled || !this.hoveredElement) return;

    const ctx = chart.getContext();
    if (!ctx) return;

    const tooltipText = this.getTooltipText(this.hoveredElement);
    if (!tooltipText) return;

    this.drawTooltip(ctx, tooltipText);
  }

  /**
   * Get tooltip text
   */
  private getTooltipText(element: ChartElement): string {
    if (this.options.callbacks?.label) {
      return this.options.callbacks.label({ element });
    }

    // Default tooltip text
    return `Value: ${(element as any).value || 'N/A'}`;
  }

  /**
   * Draw tooltip on canvas
   */
  private drawTooltip(ctx: CanvasRenderingContext2D, text: string): void {
    const padding = this.options.padding || 10;
    const cornerRadius = this.options.cornerRadius || 4;

    // Measure text
    ctx.font = '12px Arial';
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = 16;

    const boxWidth = textWidth + padding * 2;
    const boxHeight = textHeight + padding * 2;

    let x = this.tooltipX - boxWidth / 2;
    let y = this.tooltipY - boxHeight - 10;

    // Keep tooltip within bounds
    const padding_x = 5;
    const padding_y = 5;

    if (x < padding_x) x = padding_x;
    if (y < padding_y) y = padding_y;

    // Draw background
    ctx.save();
    ctx.fillStyle = this.options.backgroundColor || 'rgba(0, 0, 0, 0.8)';
    ctx.strokeStyle = this.options.borderColor || '#29F2DF';
    ctx.lineWidth = this.options.borderWidth || 1;

    // Rounded rectangle
    ctx.beginPath();
    ctx.moveTo(x + cornerRadius, y);
    ctx.lineTo(x + boxWidth - cornerRadius, y);
    ctx.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + cornerRadius);
    ctx.lineTo(x + boxWidth, y + boxHeight - cornerRadius);
    ctx.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - cornerRadius, y + boxHeight);
    ctx.lineTo(x + cornerRadius, y + boxHeight);
    ctx.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - cornerRadius);
    ctx.lineTo(x, y + cornerRadius);
    ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    // Draw text
    ctx.fillStyle = this.options.textColor || '#29F2DF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + boxWidth / 2, y + boxHeight / 2);

    ctx.restore();
  }

  /**
   * Plugin cleanup
   */
  destroy(): void {
    this.hoveredElement = null;
  }
}

export default TooltipPlugin;
