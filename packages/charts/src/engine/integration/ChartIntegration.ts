/**
 * Chart Integration System
 * Integrates all 18+ chart types with unified interface
 */

import { LineController } from '../controllers/LineController';
import { BarController } from '../controllers/BarController';
import { PieController } from '../controllers/PieController';
import { DoughnutController } from '../controllers/DoughnutController';
import { RadarController } from '../controllers/RadarController';
import { PolarAreaController } from '../controllers/PolarAreaController';
import { BubbleController } from '../controllers/BubbleController';
import { ScatterController } from '../controllers/ScatterController';
import { WaterfallController } from '../controllers/WaterfallController';
import { SankeyController } from '../controllers/SankeyController';
import { TreemapController } from '../controllers/TreemapController';
import { SunburstController } from '../controllers/SunburstController';
import { HeatmapController } from '../controllers/HeatmapController';
import { GanttController } from '../controllers/GanttController';
import { FunnelController } from '../controllers/FunnelController';
import { GaugeController } from '../controllers/GaugeController';
import { SpeedometerController } from '../controllers/SpeedometerController';
import { NetworkController } from '../controllers/NetworkController';

export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'doughnut'
  | 'radar'
  | 'polarArea'
  | 'bubble'
  | 'scatter'
  | 'waterfall'
  | 'sankey'
  | 'treemap'
  | 'sunburst'
  | 'heatmap'
  | 'gantt'
  | 'funnel'
  | 'gauge'
  | 'speedometer'
  | 'network';

export interface ChartConfig {
  type: ChartType;
  data: any;
  options?: any;
  plugins?: any[];
}

export interface ChartController {
  render(canvas: HTMLCanvasElement, data: any, options: any): void;
  update(data: any): void;
  destroy(): void;
  getType(): ChartType;
}

/**
 * Chart Integration Manager
 * Manages all chart types and provides unified interface
 */
export class ChartIntegration {
  private controllers: Map<ChartType, new () => ChartController> = new Map();
  private activeCharts: Map<string, ChartController> = new Map();

  constructor() {
    this.registerControllers();
  }

  /**
   * Register all chart controllers
   */
  private registerControllers(): void {
    // Basic charts
    this.controllers.set('line', LineController as any);
    this.controllers.set('bar', BarController as any);
    this.controllers.set('pie', PieController as any);
    this.controllers.set('doughnut', DoughnutController as any);
    this.controllers.set('radar', RadarController as any);
    this.controllers.set('polarArea', PolarAreaController as any);
    this.controllers.set('bubble', BubbleController as any);
    this.controllers.set('scatter', ScatterController as any);

    // Advanced charts
    this.controllers.set('waterfall', WaterfallController as any);
    this.controllers.set('sankey', SankeyController as any);
    this.controllers.set('treemap', TreemapController as any);
    this.controllers.set('sunburst', SunburstController as any);
    this.controllers.set('heatmap', HeatmapController as any);
    this.controllers.set('gantt', GanttController as any);
    this.controllers.set('funnel', FunnelController as any);
    this.controllers.set('gauge', GaugeController as any);
    this.controllers.set('speedometer', SpeedometerController as any);
    this.controllers.set('network', NetworkController as any);
  }

  /**
   * Create and render a chart
   */
  public createChart(id: string, config: ChartConfig, canvas: HTMLCanvasElement): ChartController {
    const ControllerClass = this.controllers.get(config.type);

    if (!ControllerClass) {
      throw new Error(`Unknown chart type: ${config.type}`);
    }

    const controller = new ControllerClass();
    controller.render(canvas, config.data, config.options || {});

    this.activeCharts.set(id, controller);
    return controller;
  }

  /**
   * Update chart data
   */
  public updateChart(id: string, data: any): void {
    const controller = this.activeCharts.get(id);
    if (controller) {
      controller.update(data);
    }
  }

  /**
   * Destroy chart
   */
  public destroyChart(id: string): void {
    const controller = this.activeCharts.get(id);
    if (controller) {
      controller.destroy();
      this.activeCharts.delete(id);
    }
  }

  /**
   * Get all supported chart types
   */
  public getSupportedTypes(): ChartType[] {
    return Array.from(this.controllers.keys());
  }

  /**
   * Check if chart type is supported
   */
  public isSupported(type: ChartType): boolean {
    return this.controllers.has(type);
  }

  /**
   * Get active charts count
   */
  public getActiveChartsCount(): number {
    return this.activeCharts.size;
  }

  /**
   * Destroy all charts
   */
  public destroyAll(): void {
    this.activeCharts.forEach((controller) => {
      controller.destroy();
    });
    this.activeCharts.clear();
  }
}

export default ChartIntegration;
