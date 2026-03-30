/**
 * Registry System for Chart Components
 * Manages registration and lookup of all chart components
 */

import type { DatasetController, ChartElement, Scale, Plugin, ChartType } from '../types/index';

/**
 * Registry class manages all chart components
 * Provides centralized storage and lookup for controllers, elements, scales, and plugins
 */
export class Registry {
  controllers: Map<string, any> = new Map();
  elements: Map<string, any> = new Map();
  scales: Map<string, any> = new Map();
  plugins: Map<string, Plugin> = new Map();

  /**
   * Register a dataset controller
   * @param id - Unique identifier for the controller
   * @param controller - Controller class or instance
   * @throws Error if controller with same id already exists
   */
  registerController(id: string, controller: any): void {
    if (this.controllers.has(id)) {
      throw new Error(`Controller with id '${id}' is already registered`);
    }
    this.controllers.set(id, controller);
  }

  /**
   * Get a registered dataset controller
   * @param id - Controller identifier
   * @returns Controller class or instance, or undefined if not found
   */
  getController(id: string): any | undefined {
    return this.controllers.get(id);
  }

  /**
   * Register a chart element
   * @param id - Unique identifier for the element
   * @param element - Element class or instance
   * @throws Error if element with same id already exists
   */
  registerElement(id: string, element: any): void {
    if (this.elements.has(id)) {
      throw new Error(`Element with id '${id}' is already registered`);
    }
    this.elements.set(id, element);
  }

  /**
   * Get a registered chart element
   * @param id - Element identifier
   * @returns Element class or instance, or undefined if not found
   */
  getElement(id: string): any | undefined {
    return this.elements.get(id);
  }

  /**
   * Register a scale
   * @param id - Unique identifier for the scale
   * @param scale - Scale class or instance
   * @throws Error if scale with same id already exists
   */
  registerScale(id: string, scale: any): void {
    if (this.scales.has(id)) {
      throw new Error(`Scale with id '${id}' is already registered`);
    }
    this.scales.set(id, scale);
  }

  /**
   * Get a registered scale
   * @param id - Scale identifier
   * @returns Scale class or instance, or undefined if not found
   */
  getScale(id: string): any | undefined {
    return this.scales.get(id);
  }

  /**
   * Register a plugin
   * @param id - Unique identifier for the plugin
   * @param plugin - Plugin instance
   * @throws Error if plugin with same id already exists
   */
  registerPlugin(id: string, plugin: Plugin): void {
    if (this.plugins.has(id)) {
      throw new Error(`Plugin with id '${id}' is already registered`);
    }
    this.plugins.set(id, plugin);
  }

  /**
   * Get a registered plugin
   * @param id - Plugin identifier
   * @returns Plugin instance, or undefined if not found
   */
  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * Get all registered controllers
   * @returns Map of all controllers
   */
  getControllers(): Map<string, any> {
    return new Map(this.controllers);
  }

  /**
   * Get all registered elements
   * @returns Map of all elements
   */
  getElements(): Map<string, any> {
    return new Map(this.elements);
  }

  /**
   * Get all registered scales
   * @returns Map of all scales
   */
  getScales(): Map<string, any> {
    return new Map(this.scales);
  }

  /**
   * Get all registered plugins
   * @returns Map of all plugins
   */
  getPlugins(): Map<string, Plugin> {
    return new Map(this.plugins);
  }

  /**
   * Check if a controller is registered
   * @param id - Controller identifier
   * @returns true if controller exists, false otherwise
   */
  hasController(id: string): boolean {
    return this.controllers.has(id);
  }

  /**
   * Check if an element is registered
   * @param id - Element identifier
   * @returns true if element exists, false otherwise
   */
  hasElement(id: string): boolean {
    return this.elements.has(id);
  }

  /**
   * Check if a scale is registered
   * @param id - Scale identifier
   * @returns true if scale exists, false otherwise
   */
  hasScale(id: string): boolean {
    return this.scales.has(id);
  }

  /**
   * Check if a plugin is registered
   * @param id - Plugin identifier
   * @returns true if plugin exists, false otherwise
   */
  hasPlugin(id: string): boolean {
    return this.plugins.has(id);
  }

  /**
   * Get registry statistics
   * @returns Object with counts of each component type
   */
  getStats(): {
    totalControllers: number;
    totalElements: number;
    totalScales: number;
    totalPlugins: number;
    total: number;
  } {
    return {
      totalControllers: this.controllers.size,
      totalElements: this.elements.size,
      totalScales: this.scales.size,
      totalPlugins: this.plugins.size,
      total: this.controllers.size + this.elements.size + this.scales.size + this.plugins.size,
    };
  }

  /**
   * Clear all registered components
   * Useful for testing or resetting the registry
   */
  clear(): void {
    this.controllers.clear();
    this.elements.clear();
    this.scales.clear();
    this.plugins.clear();
  }
}

/**
 * Global registry instance
 */
export const globalRegistry = new Registry();
