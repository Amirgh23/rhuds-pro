/**
 * Chart Core Engine
 * Main Chart class that orchestrates all chart operations
 */

import type {
  Chart as IChart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartTheme,
  ChartType,
  UpdateMode,
  Plugin,
  IDatasetController,
  IScale,
  ChartArea,
  ChartEvent,
  EventHandler,
} from './types/index';
import { Registry } from './registry/Registry';
import { DefaultsManager } from './defaults/DefaultsManager';
import { LayoutManager } from './layout/LayoutManager';

/**
 * Main Chart class
 * Manages the entire chart lifecycle and rendering
 */
export class Chart implements IChart {
  type: ChartType;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  config: ChartConfiguration;
  data: ChartData;
  options: ChartOptions;
  theme: ChartTheme;
  registry: Registry;
  controllers: IDatasetController[] = [];
  scales: Map<string, IScale> = new Map();
  plugins: Plugin[] = [];
  chartArea: ChartArea = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
  initialized: boolean = false;
  rendered: boolean = false;
  layoutManager: LayoutManager;

  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private animationFrameId: number | null = null;

  /**
   * Create a new Chart instance
   * @param canvas - HTML canvas element
   * @param config - Chart configuration
   * @throws Error if canvas is invalid or configuration is invalid
   */
  constructor(canvas: HTMLCanvasElement, config: ChartConfiguration) {
    if (!canvas) {
      throw new Error('Canvas element is required');
    }

    if (!config) {
      throw new Error('Chart configuration is required');
    }

    if (!config.type) {
      throw new Error('Chart type is required');
    }

    if (!config.data || !config.data.datasets || config.data.datasets.length === 0) {
      throw new Error('Chart data with at least one dataset is required');
    }

    this.canvas = canvas;
    this.config = config;
    this.type = config.type;
    this.data = config.data;
    this.options = config.options || {};

    // Initialize canvas context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to get 2D context from canvas');
    }
    this.ctx = ctx;

    // Set canvas dimensions
    // Get dimensions from canvas attributes first, then from computed styles
    let width = canvas.width;
    let height = canvas.height;

    if (!width || width === 0) {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || canvas.offsetWidth || 400;
    }
    if (!height || height === 0) {
      const rect = canvas.getBoundingClientRect();
      height = rect.height || canvas.offsetHeight || 300;
    }

    this.width = Math.max(width, 100);
    this.height = Math.max(height, 100);
    canvas.width = this.width;
    canvas.height = this.height;

    // Initialize registry with defaults
    this.registry = new Registry();
    DefaultsManager.registerDefaults(this.registry);

    // Initialize layout manager
    this.layoutManager = new LayoutManager(this.width, this.height, {
      padding: 20,
      margin: 10,
    });

    // Register any plugins from config
    if (config.plugins) {
      config.plugins.forEach((plugin) => {
        this.registry.registerPlugin(plugin.id, plugin);
      });
    }

    // Set default theme (RHUDS)
    this.theme = this.createDefaultTheme();

    // Initialize
    this.initialize();
  }

  /**
   * Initialize the chart
   * Sets up controllers, scales, and plugins
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }

    try {
      // Call plugin beforeInit hooks
      this.callPluginHooks('beforeInit');

      // Create dataset controllers
      this.createControllers();

      // Initialize controllers
      this.controllers.forEach((controller) => {
        controller.initialize();
      });

      // Create scales
      this.createScales();

      // Mark as initialized
      this.initialized = true;

      // Call plugin afterInit hooks
      this.callPluginHooks('afterInit');
    } catch (error) {
      console.error('Error initializing chart:', error);
      throw error;
    }
  }

  /**
   * Update the chart with new data or options
   * @param mode - Update mode (default, active, resize, reset, none)
   */
  update(mode: UpdateMode = 'default'): void {
    if (!this.initialized) {
      this.initialize();
    }

    try {
      // Call plugin beforeUpdate hooks
      this.callPluginHooks('beforeUpdate', { mode });

      // Calculate layout and chart area
      this.layoutManager.calculateLayout();
      const layoutArea = this.layoutManager.getChartArea();
      this.chartArea = {
        left: layoutArea.left,
        top: layoutArea.top,
        right: layoutArea.right,
        bottom: layoutArea.bottom,
        width: Math.max(layoutArea.width, 100),
        height: Math.max(layoutArea.height, 100),
      };

      // Update scales
      this.updateScales();

      // Update controllers
      this.controllers.forEach((controller) => {
        controller.update(mode);
      });

      // Call plugin afterUpdate hooks
      this.callPluginHooks('afterUpdate', { mode });

      // Render the chart
      this.render(mode);
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }

  /**
   * Render the chart to the canvas
   * @param mode - Update mode
   */
  render(mode: UpdateMode = 'default'): void {
    if (!this.initialized) {
      return;
    }

    try {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Call plugin beforeDraw hooks
      this.callPluginHooks('beforeDraw');

      // Draw background if configured
      if (this.options.backgroundColor) {
        this.ctx.fillStyle = this.options.backgroundColor as string;
        this.ctx.fillRect(0, 0, this.width, this.height);
      }

      // Draw scales
      if (this.chartArea) {
        this.scales.forEach((scale) => {
          scale.draw(this.chartArea);
        });
      }

      // Draw controllers (datasets)
      if (this.controllers && this.controllers.length > 0) {
        this.controllers.forEach((controller) => {
          if (controller && typeof controller.draw === 'function') {
            controller.draw();
          }
        });
      }

      // Call plugin afterDraw hooks
      this.callPluginHooks('afterDraw');

      this.rendered = true;
    } catch (error) {
      console.error('Error rendering chart:', error);
    }
  }

  /**
   * Destroy the chart and cleanup resources
   */
  destroy(): void {
    try {
      // Cancel animation frame if running
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      // Destroy controllers
      this.controllers.forEach((controller) => {
        controller.destroy();
      });
      this.controllers = [];

      // Destroy scales
      this.scales.forEach((scale) => {
        // Scales don't have destroy method yet, but we clear them
      });
      this.scales.clear();

      // Call plugin destroy hooks
      this.plugins.forEach((plugin) => {
        if (plugin.destroy) {
          try {
            plugin.destroy(this);
          } catch (error) {
            console.error(`Error destroying plugin ${plugin.id}:`, error);
          }
        }
      });

      // Clear event handlers
      this.eventHandlers.clear();

      // Mark as not initialized
      this.initialized = false;
      this.rendered = false;
    } catch (error) {
      console.error('Error destroying chart:', error);
    }
  }

  /**
   * Resize the chart
   * @param width - New width
   * @param height - New height
   */
  resize(width: number, height: number): void {
    if (width === this.width && height === this.height) {
      return;
    }

    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;

    // Update layout manager with new dimensions
    this.layoutManager.updateContainerSize(width, height);

    this.update('resize');
  }

  /**
   * Register an event handler
   * @param event - Event type
   * @param handler - Event handler function
   */
  on(event: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * Unregister an event handler
   * @param event - Event type
   * @param handler - Event handler function
   */
  off(event: string, handler: EventHandler): void {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event)!.delete(handler);
    }
  }

  /**
   * Emit an event
   * @param event - Chart event
   */
  emit(event: ChartEvent): void {
    if (this.eventHandlers.has(event.type)) {
      const handlers = this.eventHandlers.get(event.type)!;
      handlers.forEach((handler) => {
        try {
          // TODO: Implement hit detection to find elements at event coordinates
          handler(event, []);
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error);
        }
      });
    }
  }

  /**
   * Get the canvas 2D rendering context
   * @returns Canvas 2D context
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Get the chart width
   * @returns Chart width in pixels
   */
  getWidth(): number {
    return this.width;
  }

  /**
   * Get the chart height
   * @returns Chart height in pixels
   */
  getHeight(): number {
    return this.height;
  }

  /**
   * Create dataset controllers for each dataset
   */
  private createControllers(): void {
    this.controllers = [];

    this.data.datasets.forEach((dataset, index) => {
      const chartType = dataset.type || this.type;

      // Get the controller class from registry
      const ControllerClass = this.registry.getController(chartType);
      if (!ControllerClass) {
        console.warn(`No controller found for chart type: ${chartType}`);
        return;
      }

      // Create controller instance
      const controller = new ControllerClass(this, index, chartType);
      this.controllers.push(controller);
    });
  }

  /**
   * Create scales for the chart
   */
  private createScales(): void {
    this.scales.clear();

    // Get scale configuration from options
    const scalesConfig = this.options.scales || {};

    // Create scales based on configuration
    Object.entries(scalesConfig).forEach(([scaleId, scaleConfig]) => {
      const scaleType = (scaleConfig as any).type || 'linear';

      // Get the scale class from registry
      const ScaleClass = this.registry.getScale(scaleType);
      if (!ScaleClass) {
        console.warn(`No scale found for scale type: ${scaleType}`);
        return;
      }

      // Create scale instance
      const scale = new ScaleClass(scaleId, scaleConfig as any, this.ctx, this);
      this.scales.set(scaleId, scale);

      // Register with layout manager
      const position = scaleId === 'x' || scaleId === 'bottom' ? 'bottom' : 'left';
      this.layoutManager.registerScale(scaleId, scale as any, position);
    });

    // Create default scales if none configured
    if (this.scales.size === 0) {
      this.createDefaultScales();
    }
  }

  /**
   * Create default scales based on chart type
   */
  private createDefaultScales(): void {
    // Most charts need x and y scales
    const needsXY = ['line', 'bar', 'bubble', 'scatter'].includes(this.type);

    if (needsXY) {
      const LinearScale = this.registry.getScale('linear');
      const CategoryScale = this.registry.getScale('category');

      if (LinearScale && CategoryScale) {
        // X scale (category for bar/line, linear for scatter/bubble)
        const xScaleType = this.type === 'bar' || this.type === 'line' ? 'category' : 'linear';
        const XScaleClass = this.registry.getScale(xScaleType);
        if (XScaleClass) {
          const xScale = new XScaleClass('x', { type: xScaleType }, this.ctx, this);
          this.scales.set('x', xScale);
          this.layoutManager.registerScale('x', xScale as any, 'bottom');
        }

        // Y scale (always linear for these types)
        const yScale = new LinearScale('y', { type: 'linear' }, this.ctx, this);
        this.scales.set('y', yScale);
        this.layoutManager.registerScale('y', yScale as any, 'left');
      }
    } else if (this.type === 'pie' || this.type === 'doughnut' || this.type === 'polarArea') {
      // Pie/Doughnut/PolarArea don't need scales
      return;
    } else if (this.type === 'radar') {
      // Radar needs radial scale
      const RadialScale = this.registry.getScale('linear');
      if (RadialScale) {
        const radialScale = new RadialScale('r', { type: 'linear' }, this.ctx, this);
        this.scales.set('r', radialScale);
      }
    }
  }

  /**
   * Update all scales
   */
  private updateScales(): void {
    this.scales.forEach((scale) => {
      scale.update(this.chartArea.width, this.chartArea.height);
    });
  }

  /**
   * Call plugin hooks with error isolation
   * @param hookName - Name of the hook to call
   * @param args - Arguments to pass to the hook
   */
  private callPluginHooks(hookName: string, args: any = {}): void {
    this.plugins.forEach((plugin) => {
      const hook = (plugin as any)[hookName];
      if (typeof hook === 'function') {
        try {
          hook.call(plugin, this, args, plugin);
        } catch (error) {
          console.error(`Error in plugin ${plugin.id} hook ${hookName}:`, error);
          // Continue rendering even if plugin fails
        }
      }
    });
  }

  /**
   * Create default theme (RHUDS)
   */
  private createDefaultTheme(): ChartTheme {
    return {
      variant: 'r-huds',
      colors: {
        primary: '#29F2DF',
        secondary: '#1C7FA6',
        accent: '#FF00FF',
        background: '#0A0E27',
        text: '#29F2DF',
        grid: '#1C7FA6',
        border: '#29F2DF',
      },
      effects: {
        glow: true,
        glowIntensity: 0.5,
        neonPulse: true,
        scanlines: false,
        scanlinesIntensity: 'low',
        lightTrail: false,
        phosphorBurn: false,
        radarSweep: false,
      },
      fonts: {
        family: 'monospace',
        size: 12,
        weight: 400,
        lineHeight: 1.5,
      },
      animation: {
        duration: 750,
        easing: 'easeInOutQuad',
        delay: 0,
      },
    };
  }
}
