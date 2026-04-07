/**
 * Interaction Integration System
 * Integrates all interactive systems with unified interface
 */

import { AdaptiveScaleManager } from '../scales/AdaptiveScaleManager';
import { AdvancedTooltipEngine } from '../interaction/AdvancedTooltipEngine';
import { DynamicLegendManager } from '../plugins/DynamicLegendManager';

export interface InteractionConfig {
  zoom?: boolean;
  pan?: boolean;
  tooltips?: boolean;
  legend?: boolean;
  keyboard?: boolean;
  touch?: boolean;
}

export interface InteractionState {
  isZooming: boolean;
  isPanning: boolean;
  selectedDatasets: Set<number>;
  hoveredPoint: any | null;
}

/**
 * Interaction Integration Manager
 * Manages all interactive systems and provides unified interface
 */
export class InteractionIntegration {
  private scaleManager: AdaptiveScaleManager;
  private tooltipEngine: AdvancedTooltipEngine;
  private legendManager: DynamicLegendManager;
  private config: InteractionConfig;
  private state: InteractionState;
  private listeners: Map<string, Function[]> = new Map();

  constructor(config: InteractionConfig = {}) {
    this.config = {
      zoom: true,
      pan: true,
      tooltips: true,
      legend: true,
      keyboard: true,
      touch: true,
      ...config,
    };

    this.scaleManager = new AdaptiveScaleManager();
    this.tooltipEngine = new AdvancedTooltipEngine();
    this.legendManager = new DynamicLegendManager();

    this.state = {
      isZooming: false,
      isPanning: false,
      selectedDatasets: new Set(),
      hoveredPoint: null,
    };

    this.setupEventListeners();
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (this.config.keyboard) {
      document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
  }

  /**
   * Handle keyboard events
   */
  private handleKeyboard(event: KeyboardEvent): void {
    switch (event.key) {
      case '+':
      case '=':
        this.zoom(1.1);
        break;
      case '-':
        this.zoom(0.9);
        break;
      case 'ArrowUp':
        this.pan(0, -10);
        break;
      case 'ArrowDown':
        this.pan(0, 10);
        break;
      case 'ArrowLeft':
        this.pan(-10, 0);
        break;
      case 'ArrowRight':
        this.pan(10, 0);
        break;
    }
  }

  /**
   * Zoom in/out
   */
  public zoom(factor: number): void {
    if (!this.config.zoom) return;

    this.state.isZooming = true;
    this.scaleManager.zoom(factor);
    this.emit('zoom', { factor });

    setTimeout(() => {
      this.state.isZooming = false;
    }, 300);
  }

  /**
   * Pan chart
   */
  public pan(dx: number, dy: number): void {
    if (!this.config.pan) return;

    this.state.isPanning = true;
    this.scaleManager.pan(dx, dy);
    this.emit('pan', { dx, dy });

    setTimeout(() => {
      this.state.isPanning = false;
    }, 300);
  }

  /**
   * Reset zoom and pan
   */
  public reset(): void {
    this.scaleManager.reset();
    this.state.selectedDatasets.clear();
    this.state.hoveredPoint = null;
    this.emit('reset', {});
  }

  /**
   * Show tooltip
   */
  public showTooltip(point: any, position: { x: number; y: number }): void {
    if (!this.config.tooltips) return;

    this.state.hoveredPoint = point;
    this.tooltipEngine.show(point, position);
    this.emit('tooltip:show', { point, position });
  }

  /**
   * Hide tooltip
   */
  public hideTooltip(): void {
    this.tooltipEngine.hide();
    this.state.hoveredPoint = null;
    this.emit('tooltip:hide', {});
  }

  /**
   * Toggle dataset visibility
   */
  public toggleDataset(datasetIndex: number): void {
    if (this.state.selectedDatasets.has(datasetIndex)) {
      this.state.selectedDatasets.delete(datasetIndex);
    } else {
      this.state.selectedDatasets.add(datasetIndex);
    }

    this.legendManager.toggleDataset(datasetIndex);
    this.emit('dataset:toggle', { datasetIndex });
  }

  /**
   * Filter datasets
   */
  public filterDatasets(predicate: (index: number) => boolean): void {
    const indices = Array.from({ length: 10 }, (_, i) => i).filter(predicate);
    this.state.selectedDatasets = new Set(indices);
    this.emit('datasets:filter', { indices });
  }

  /**
   * Get interaction state
   */
  public getState(): InteractionState {
    return { ...this.state };
  }

  /**
   * Enable interaction
   */
  public enable(type: keyof InteractionConfig): void {
    this.config[type] = true;
  }

  /**
   * Disable interaction
   */
  public disable(type: keyof InteractionConfig): void {
    this.config[type] = false;
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Get scale manager
   */
  public getScaleManager(): AdaptiveScaleManager {
    return this.scaleManager;
  }

  /**
   * Get tooltip engine
   */
  public getTooltipEngine(): AdvancedTooltipEngine {
    return this.tooltipEngine;
  }

  /**
   * Get legend manager
   */
  public getLegendManager(): DynamicLegendManager {
    return this.legendManager;
  }

  /**
   * Destroy integration
   */
  public destroy(): void {
    this.listeners.clear();
    this.state.selectedDatasets.clear();
  }
}

export default InteractionIntegration;
