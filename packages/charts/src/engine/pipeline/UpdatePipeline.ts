/**
 * Update Pipeline
 * Orchestrates the chart update process
 */

import type { Chart, UpdateMode } from '../types/index';
import type { DatasetController } from '../controllers/index';
import type { IScale } from '../types/index';
import { LayoutManager } from '../layout/LayoutManager';

export type { UpdateMode } from '../types/index';

export interface UpdateContext {
  mode: UpdateMode;
  chart: Chart;
  controllers: DatasetController[];
  scales: Map<string, IScale>;
  layout: LayoutManager;
}

export class UpdatePipeline {
  /**
   * Execute the update pipeline
   */
  static execute(context: UpdateContext): void {
    // 1. Parse data
    this.parseData(context);

    // 2. Update scales
    this.updateScales(context);

    // 3. Update controllers
    this.updateControllers(context);

    // 4. Calculate layout
    this.calculateLayout(context);

    // 5. Render
    this.render(context);
  }

  /**
   * Parse data from all controllers
   */
  private static parseData(context: UpdateContext): void {
    for (const controller of context.controllers) {
      try {
        const dataset = controller.getDataset();
        controller.parse(0, dataset.data.length);
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    }
  }

  /**
   * Update all scales
   */
  private static updateScales(context: UpdateContext): void {
    const chartArea = context.chart.chartArea;
    const maxWidth = chartArea.width || 800;
    const maxHeight = chartArea.height || 600;

    for (const [id, scale] of context.scales) {
      try {
        scale.update(maxWidth, maxHeight);
      } catch (error) {
        console.error(`Error updating scale ${id}:`, error);
      }
    }
  }

  /**
   * Update all controllers
   */
  private static updateControllers(context: UpdateContext): void {
    for (const controller of context.controllers) {
      try {
        controller.update(context.mode);
      } catch (error) {
        console.error('Error updating controller:', error);
      }
    }
  }

  /**
   * Calculate layout
   */
  private static calculateLayout(context: UpdateContext): void {
    try {
      context.layout.calculateLayout();
    } catch (error) {
      console.error('Error calculating layout:', error);
    }
  }

  /**
   * Render the chart
   */
  private static render(context: UpdateContext): void {
    try {
      const chart = context.chart;
      const ctx = chart.getContext();

      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, chart.getWidth(), chart.getHeight());

      // Draw all controllers
      for (const controller of context.controllers) {
        controller.draw();
      }
    } catch (error) {
      console.error('Error rendering chart:', error);
    }
  }
}

export default UpdatePipeline;
