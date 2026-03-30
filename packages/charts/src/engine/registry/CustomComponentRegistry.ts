/**
 * Custom Component Registry
 * Allows registration of custom controllers, elements, and scales
 */

import type { DatasetController } from '../controllers/index';
import type { ChartElement } from '../elements/index';
import type { Scale } from '../scales/index';

export interface CustomComponentValidator {
  validate(component: any): boolean;
  getError(): string;
}

export class ControllerValidator implements CustomComponentValidator {
  validate(component: any): boolean {
    return (
      typeof component === 'function' &&
      typeof component.prototype.parse === 'function' &&
      typeof component.prototype.update === 'function' &&
      typeof component.prototype.draw === 'function'
    );
  }

  getError(): string {
    return 'Custom controller must implement parse(), update(), and draw() methods';
  }
}

export class ElementValidator implements CustomComponentValidator {
  validate(component: any): boolean {
    return (
      typeof component === 'function' &&
      typeof component.prototype.inRange === 'function' &&
      typeof component.prototype.draw === 'function'
    );
  }

  getError(): string {
    return 'Custom element must implement inRange() and draw() methods';
  }
}

export class ScaleValidator implements CustomComponentValidator {
  validate(component: any): boolean {
    return (
      typeof component === 'function' &&
      typeof component.prototype.update === 'function' &&
      typeof component.prototype.getPixelForValue === 'function'
    );
  }

  getError(): string {
    return 'Custom scale must implement update() and getPixelForValue() methods';
  }
}

export class CustomComponentRegistry {
  private customControllers: Map<string, DatasetController> = new Map();
  private customElements: Map<string, ChartElement> = new Map();
  private customScales: Map<string, Scale> = new Map();

  private controllerValidator = new ControllerValidator();
  private elementValidator = new ElementValidator();
  private scaleValidator = new ScaleValidator();

  /**
   * Register custom dataset controller
   */
  registerController(id: string, controller: DatasetController): void {
    if (!this.controllerValidator.validate(controller)) {
      throw new Error(this.controllerValidator.getError());
    }

    if (this.customControllers.has(id)) {
      console.warn(`Controller '${id}' already registered, overwriting`);
    }

    this.customControllers.set(id, controller);
  }

  /**
   * Register custom chart element
   */
  registerElement(id: string, element: ChartElement): void {
    if (!this.elementValidator.validate(element)) {
      throw new Error(this.elementValidator.getError());
    }

    if (this.customElements.has(id)) {
      console.warn(`Element '${id}' already registered, overwriting`);
    }

    this.customElements.set(id, element);
  }

  /**
   * Register custom scale
   */
  registerScale(id: string, scale: Scale): void {
    if (!this.scaleValidator.validate(scale)) {
      throw new Error(this.scaleValidator.getError());
    }

    if (this.customScales.has(id)) {
      console.warn(`Scale '${id}' already registered, overwriting`);
    }

    this.customScales.set(id, scale);
  }

  /**
   * Get custom controller
   */
  getController(id: string): DatasetController | undefined {
    return this.customControllers.get(id);
  }

  /**
   * Get custom element
   */
  getElement(id: string): ChartElement | undefined {
    return this.customElements.get(id);
  }

  /**
   * Get custom scale
   */
  getScale(id: string): Scale | undefined {
    return this.customScales.get(id);
  }

  /**
   * Check if controller exists
   */
  hasController(id: string): boolean {
    return this.customControllers.has(id);
  }

  /**
   * Check if element exists
   */
  hasElement(id: string): boolean {
    return this.customElements.has(id);
  }

  /**
   * Check if scale exists
   */
  hasScale(id: string): boolean {
    return this.customScales.has(id);
  }

  /**
   * Get all custom controllers
   */
  getAllControllers(): Map<string, DatasetController> {
    return new Map(this.customControllers);
  }

  /**
   * Get all custom elements
   */
  getAllElements(): Map<string, ChartElement> {
    return new Map(this.customElements);
  }

  /**
   * Get all custom scales
   */
  getAllScales(): Map<string, Scale> {
    return new Map(this.customScales);
  }

  /**
   * Clear all custom components
   */
  clear(): void {
    this.customControllers.clear();
    this.customElements.clear();
    this.customScales.clear();
  }
}

export default CustomComponentRegistry;
