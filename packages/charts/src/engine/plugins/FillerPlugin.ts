/**
 * Filler Plugin
 * Fills area between lines or to zero line
 */

import type { Plugin } from '../types/index';
import type { Chart } from '../Chart';

export interface FillerOptions {
  propagate?: boolean;
}

export class FillerPlugin implements Plugin {
  id = 'filler';
  options: FillerOptions = {
    propagate: true,
  };

  constructor(options: FillerOptions = {}) {
    this.options = { ...this.options, ...options };
  }

  /**
   * Plugin initialization
   */
  beforeInit(chart: Chart): void {
    // Setup filler for datasets
    const data = (chart as any).data;
    if (!data || !data.datasets) return;

    for (const dataset of data.datasets) {
      if (dataset.fill) {
        // Mark dataset for filling
        (dataset as any)._fill = true;
      }
    }
  }

  /**
   * Draw fills
   */
  beforeDraw(chart: Chart, args: any): void {
    const ctx = chart.getContext();
    if (!ctx) return;

    const data = (chart as any).data;
    if (!data || !data.datasets) return;

    for (let i = 0; i < data.datasets.length; i++) {
      const dataset = data.datasets[i];
      if (dataset.fill) {
        this.drawFill(ctx, chart, i, dataset);
      }
    }
  }

  /**
   * Draw fill for a dataset
   */
  private drawFill(
    ctx: CanvasRenderingContext2D,
    chart: Chart,
    datasetIndex: number,
    dataset: any
  ): void {
    const controllers = (chart as any).controllers;
    if (!controllers || !controllers[datasetIndex]) return;

    const controller = controllers[datasetIndex];
    const elements = controller.elements || [];

    if (elements.length === 0) return;

    ctx.save();
    ctx.fillStyle = dataset.backgroundColor || 'rgba(41, 242, 223, 0.1)';
    ctx.globalAlpha = 0.1;

    // Draw fill path
    ctx.beginPath();

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (i === 0) {
        ctx.moveTo((element as any).x, (element as any).y);
      } else {
        ctx.lineTo((element as any).x, (element as any).y);
      }
    }

    // Close path to zero line or next dataset
    if (dataset.fill === true || dataset.fill === 'origin') {
      // Fill to zero line
      const lastElement = elements[elements.length - 1];
      ctx.lineTo((lastElement as any).x, chart.getHeight() - 50); // Approximate zero line
      ctx.lineTo((elements[0] as any).x, chart.getHeight() - 50);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * Plugin cleanup
   */
  destroy(): void {
    // Cleanup if needed
  }
}

export default FillerPlugin;
