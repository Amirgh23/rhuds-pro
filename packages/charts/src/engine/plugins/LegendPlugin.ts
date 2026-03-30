/**
 * Legend Plugin
 * Displays legend for chart datasets
 */

import type { Plugin } from '../types/index';
import type { Chart } from '../Chart';

export interface LegendOptions {
  display?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  labels?: {
    boxWidth?: number;
    padding?: number;
    font?: { size?: number; family?: string };
    color?: string;
    usePointStyle?: boolean;
  };
  onClick?: (e: any, legendItem: any) => void;
}

export interface LegendItem {
  text: string;
  fillStyle: string;
  hidden?: boolean;
  index?: number;
}

export class LegendPlugin implements Plugin {
  id = 'legend';
  options: LegendOptions = {
    display: true,
    position: 'top',
    align: 'center',
    labels: {
      boxWidth: 12,
      padding: 10,
      font: { size: 12, family: 'Arial' },
      color: '#29F2DF',
      usePointStyle: false,
    },
  };

  private legendItems: LegendItem[] = [];
  private hiddenDatasets: Set<number> = new Set();

  constructor(options: LegendOptions = {}) {
    this.options = { ...this.options, ...options };
  }

  /**
   * Plugin initialization
   */
  beforeInit(chart: Chart): void {
    this.buildLegendItems(chart);
  }

  /**
   * Build legend items from datasets
   */
  private buildLegendItems(chart: Chart): void {
    const data = (chart as any).data;
    if (!data || !data.datasets) return;

    this.legendItems = data.datasets.map((dataset: any, index: number) => ({
      text: dataset.label || `Dataset ${index + 1}`,
      fillStyle: dataset.backgroundColor || '#29F2DF',
      hidden: false,
      index,
    }));
  }

  /**
   * Draw legend
   */
  beforeDraw(chart: Chart, args: any): void {
    if (!this.options.display) return;

    const ctx = chart.getContext();
    if (!ctx) return;

    this.drawLegend(ctx, chart);
  }

  /**
   * Draw legend on canvas
   */
  private drawLegend(ctx: CanvasRenderingContext2D, chart: Chart): void {
    const position = this.options.position || 'top';
    const labels = this.options.labels || {};
    const boxWidth = labels.boxWidth || 12;
    const padding = labels.padding || 10;
    const fontSize = labels.font?.size || 12;
    const fontFamily = labels.font?.family || 'Arial';
    const textColor = labels.color || '#29F2DF';

    ctx.save();
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;

    let x = 10;
    let y = 10;

    if (position === 'top' || position === 'bottom') {
      // Horizontal layout
      for (const item of this.legendItems) {
        // Draw color box
        ctx.fillStyle = item.fillStyle;
        ctx.fillRect(x, y, boxWidth, boxWidth);

        // Draw text
        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, x + boxWidth + 5, y + boxWidth / 2);

        x += boxWidth + 5 + ctx.measureText(item.text).width + padding;
      }
    } else {
      // Vertical layout
      for (const item of this.legendItems) {
        // Draw color box
        ctx.fillStyle = item.fillStyle;
        ctx.fillRect(x, y, boxWidth, boxWidth);

        // Draw text
        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, x + boxWidth + 5, y + boxWidth / 2);

        y += boxWidth + padding;
      }
    }

    ctx.restore();
  }

  /**
   * Handle legend item click
   */
  handleClick(index: number, chart: Chart): void {
    if (this.hiddenDatasets.has(index)) {
      this.hiddenDatasets.delete(index);
    } else {
      this.hiddenDatasets.add(index);
    }

    // Trigger chart update
    (chart as any).update('show');

    if (this.options.onClick) {
      this.options.onClick({}, this.legendItems[index]);
    }
  }

  /**
   * Get hidden datasets
   */
  getHiddenDatasets(): Set<number> {
    return this.hiddenDatasets;
  }

  /**
   * Plugin cleanup
   */
  destroy(): void {
    this.legendItems = [];
    this.hiddenDatasets.clear();
  }
}

export default LegendPlugin;
