/**
 * Title Plugin
 * Displays chart title
 */

import type { Plugin } from '../types/index';
import type { Chart } from '../Chart';

export interface TitleOptions {
  display?: boolean;
  text?: string;
  position?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  font?: {
    size?: number;
    family?: string;
    weight?: string;
  };
  color?: string;
  padding?: number;
}

export class TitlePlugin implements Plugin {
  id = 'title';
  options: TitleOptions = {
    display: false,
    text: '',
    position: 'top',
    align: 'center',
    font: {
      size: 16,
      family: 'Arial',
      weight: 'bold',
    },
    color: '#29F2DF',
    padding: 10,
  };

  constructor(options: TitleOptions = {}) {
    this.options = { ...this.options, ...options };
  }

  /**
   * Draw title
   */
  beforeDraw(chart: Chart, args: any): void {
    if (!this.options.display || !this.options.text) return;

    const ctx = chart.getContext();
    if (!ctx) return;

    this.drawTitle(ctx, chart);
  }

  /**
   * Draw title on canvas
   */
  private drawTitle(ctx: CanvasRenderingContext2D, chart: Chart): void {
    const fontSize = this.options.font?.size || 16;
    const fontFamily = this.options.font?.family || 'Arial';
    const fontWeight = this.options.font?.weight || 'bold';
    const color = this.options.color || '#29F2DF';
    const padding = this.options.padding || 10;
    const position = this.options.position || 'top';
    const align = this.options.align || 'center';

    ctx.save();
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;

    let x = chart.getWidth() / 2;
    let y = padding + fontSize;

    if (position === 'bottom') {
      y = chart.getHeight() - padding;
    }

    if (align === 'start') {
      x = padding;
      ctx.textAlign = 'left';
    } else if (align === 'end') {
      x = chart.getWidth() - padding;
      ctx.textAlign = 'right';
    } else {
      ctx.textAlign = 'center';
    }

    ctx.textBaseline = 'top';
    ctx.fillText(this.options.text, x, y);

    ctx.restore();
  }

  /**
   * Plugin cleanup
   */
  destroy(): void {
    // Cleanup if needed
  }
}

export default TitlePlugin;
