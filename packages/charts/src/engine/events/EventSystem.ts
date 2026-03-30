/**
 * Event System
 * Handles chart events and interactions
 */

import type { ChartElement } from '../elements/index';

export interface ChartEvent {
  type: string;
  x: number;
  y: number;
  element?: ChartElement;
  datasetIndex?: number;
  index?: number;
  native?: MouseEvent | TouchEvent;
}

export type EventHandler = (event: ChartEvent) => void;

export class EventSystem {
  private handlers: Map<string, EventHandler[]> = new Map();
  private hoveredElements: Set<ChartElement> = new Set();
  private elements: ChartElement[] = [];

  /**
   * Register event handler
   */
  on(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  /**
   * Unregister event handler
   */
  off(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   */
  emit(event: ChartEvent): void {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error);
        }
      });
    }
  }

  /**
   * Set elements for hit detection
   */
  setElements(elements: ChartElement[]): void {
    this.elements = elements;
  }

  /**
   * Handle mouse move event
   */
  handleMouseMove(x: number, y: number, nativeEvent?: MouseEvent): void {
    const element = this.getElementAtPosition(x, y);

    // Handle hover state changes
    if (element && !this.hoveredElements.has(element)) {
      // Element entered
      this.hoveredElements.add(element);
      this.emit({
        type: 'hover',
        x,
        y,
        element,
        native: nativeEvent,
      });
    } else if (!element && this.hoveredElements.size > 0) {
      // All elements left
      this.hoveredElements.forEach((hoveredElement) => {
        this.emit({
          type: 'leave',
          x,
          y,
          element: hoveredElement,
          native: nativeEvent,
        });
      });
      this.hoveredElements.clear();
    }

    this.emit({
      type: 'mousemove',
      x,
      y,
      element,
      native: nativeEvent,
    });
  }

  /**
   * Handle click event
   */
  handleClick(x: number, y: number, nativeEvent?: MouseEvent): void {
    const element = this.getElementAtPosition(x, y);

    this.emit({
      type: 'click',
      x,
      y,
      element,
      native: nativeEvent,
    });
  }

  /**
   * Handle double click event
   */
  handleDoubleClick(x: number, y: number, nativeEvent?: MouseEvent): void {
    const element = this.getElementAtPosition(x, y);

    this.emit({
      type: 'dblclick',
      x,
      y,
      element,
      native: nativeEvent,
    });
  }

  /**
   * Handle touch event
   */
  handleTouch(x: number, y: number, nativeEvent?: TouchEvent): void {
    const element = this.getElementAtPosition(x, y);

    this.emit({
      type: 'touch',
      x,
      y,
      element,
      native: nativeEvent,
    });
  }

  /**
   * Get element at position using hit detection
   */
  private getElementAtPosition(x: number, y: number): ChartElement | undefined {
    // Iterate in reverse to get topmost element
    for (let i = this.elements.length - 1; i >= 0; i--) {
      const element = this.elements[i];
      if (element.inRange(x, y)) {
        return element;
      }
    }
    return undefined;
  }

  /**
   * Get hovered elements
   */
  getHoveredElements(): ChartElement[] {
    return Array.from(this.hoveredElements);
  }

  /**
   * Clear all event handlers
   */
  clear(): void {
    this.handlers.clear();
    this.hoveredElements.clear();
    this.elements = [];
  }
}

export default EventSystem;
