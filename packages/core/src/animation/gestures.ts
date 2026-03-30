/**
 * Gesture-Driven Animation System
 * Handles drag, swipe, pinch, and rotate gestures
 */

export interface GesturePoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface DragConfig {
  onDrag?: (delta: { x: number; y: number }) => void;
  onDragEnd?: (velocity: { x: number; y: number }) => void;
  bounds?: { minX: number; maxX: number; minY: number; maxY: number };
  elastic?: boolean;
}

export interface SwipeConfig {
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  threshold?: number;
  velocityThreshold?: number;
}

export interface PinchConfig {
  onPinch?: (scale: number) => void;
  minScale?: number;
  maxScale?: number;
}

export interface RotateConfig {
  onRotate?: (angle: number) => void;
}

/**
 * Drag gesture handler
 */
export class DragGesture {
  private startPoint: GesturePoint | null = null;
  private lastPoint: GesturePoint | null = null;
  private currentPosition = { x: 0, y: 0 };
  private config: DragConfig;

  constructor(config: DragConfig = {}) {
    this.config = config;
  }

  /**
   * Handle pointer down
   */
  onPointerDown(x: number, y: number): void {
    const now = performance.now();
    this.startPoint = { x, y, timestamp: now };
    this.lastPoint = { x, y, timestamp: now };
  }

  /**
   * Handle pointer move
   */
  onPointerMove(x: number, y: number): void {
    if (!this.startPoint || !this.lastPoint) return;

    const now = performance.now();
    const deltaX = x - this.lastPoint.x;
    const deltaY = y - this.lastPoint.y;

    let newX = this.currentPosition.x + deltaX;
    let newY = this.currentPosition.y + deltaY;

    // Apply bounds
    if (this.config.bounds) {
      const { minX, maxX, minY, maxY } = this.config.bounds;
      if (this.config.elastic) {
        // Elastic bounds - allow overshoot with resistance
        const elasticity = 0.3;
        if (newX < minX) {
          newX = minX + (newX - minX) * elasticity;
        } else if (newX > maxX) {
          newX = maxX + (newX - maxX) * elasticity;
        }
        if (newY < minY) {
          newY = minY + (newY - minY) * elasticity;
        } else if (newY > maxY) {
          newY = maxY + (newY - maxY) * elasticity;
        }
      } else {
        // Hard bounds
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
      }
    }

    this.currentPosition = { x: newX, y: newY };
    this.lastPoint = { x, y, timestamp: now };

    this.config.onDrag?.({ x: deltaX, y: deltaY });
  }

  /**
   * Handle pointer up
   */
  onPointerUp(x: number, y: number): void {
    if (!this.startPoint || !this.lastPoint) return;

    const now = performance.now();
    const timeDelta = (now - this.lastPoint.timestamp) / 1000;

    if (timeDelta > 0) {
      const velocityX = (x - this.lastPoint.x) / timeDelta;
      const velocityY = (y - this.lastPoint.y) / timeDelta;

      this.config.onDragEnd?.({ x: velocityX, y: velocityY });
    }

    this.reset();
  }

  /**
   * Get current position
   */
  getPosition() {
    return { ...this.currentPosition };
  }

  /**
   * Reset gesture
   */
  reset(): void {
    this.startPoint = null;
    this.lastPoint = null;
  }
}

/**
 * Swipe gesture handler
 */
export class SwipeGesture {
  private startPoint: GesturePoint | null = null;
  private config: SwipeConfig;
  private threshold: number;
  private velocityThreshold: number;

  constructor(config: SwipeConfig = {}) {
    this.config = config;
    this.threshold = config.threshold ?? 50;
    this.velocityThreshold = config.velocityThreshold ?? 0.5;
  }

  /**
   * Handle pointer down
   */
  onPointerDown(x: number, y: number): void {
    this.startPoint = { x, y, timestamp: performance.now() };
  }

  /**
   * Handle pointer up
   */
  onPointerUp(x: number, y: number): void {
    if (!this.startPoint) return;

    const now = performance.now();
    const timeDelta = (now - this.startPoint.timestamp) / 1000;

    if (timeDelta === 0) {
      this.reset();
      return;
    }

    const deltaX = x - this.startPoint.x;
    const deltaY = y - this.startPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / timeDelta;

    if (distance > this.threshold && velocity > this.velocityThreshold) {
      const angle = Math.atan2(deltaY, deltaX);
      let direction: 'left' | 'right' | 'up' | 'down';

      if (Math.abs(angle) < Math.PI / 4) {
        direction = 'right';
      } else if (Math.abs(angle) > (3 * Math.PI) / 4) {
        direction = 'left';
      } else if (angle > 0) {
        direction = 'down';
      } else {
        direction = 'up';
      }

      this.config.onSwipe?.(direction);
    }

    this.reset();
  }

  /**
   * Reset gesture
   */
  reset(): void {
    this.startPoint = null;
  }
}

/**
 * Pinch gesture handler (multi-touch)
 */
export class PinchGesture {
  private touches: Map<number, GesturePoint> = new Map();
  private lastDistance: number = 0;
  private config: PinchConfig;
  private minScale: number;
  private maxScale: number;

  constructor(config: PinchConfig = {}) {
    this.config = config;
    this.minScale = config.minScale ?? 0.5;
    this.maxScale = config.maxScale ?? 3;
  }

  /**
   * Handle touch start
   */
  onTouchStart(touches: Array<{ id: number; x: number; y: number }>): void {
    touches.forEach((touch) => {
      this.touches.set(touch.id, {
        x: touch.x,
        y: touch.y,
        timestamp: performance.now(),
      });
    });
  }

  /**
   * Handle touch move
   */
  onTouchMove(touches: Array<{ id: number; x: number; y: number }>): void {
    if (this.touches.size < 2) return;

    const touchArray = Array.from(this.touches.values());
    if (touchArray.length < 2) return;

    const touch1 = touchArray[0];
    const touch2 = touchArray[1];

    const distance = Math.sqrt(Math.pow(touch2.x - touch1.x, 2) + Math.pow(touch2.y - touch1.y, 2));

    if (this.lastDistance > 0) {
      const scale = distance / this.lastDistance;
      const clampedScale = Math.max(this.minScale, Math.min(this.maxScale, scale));
      this.config.onPinch?.(clampedScale);
    }

    this.lastDistance = distance;

    // Update touch positions
    touches.forEach((touch) => {
      this.touches.set(touch.id, {
        x: touch.x,
        y: touch.y,
        timestamp: performance.now(),
      });
    });
  }

  /**
   * Handle touch end
   */
  onTouchEnd(touchIds: number[]): void {
    touchIds.forEach((id) => this.touches.delete(id));
    if (this.touches.size < 2) {
      this.lastDistance = 0;
    }
  }

  /**
   * Reset gesture
   */
  reset(): void {
    this.touches.clear();
    this.lastDistance = 0;
  }
}

/**
 * Rotate gesture handler (multi-touch)
 */
export class RotateGesture {
  private touches: Map<number, GesturePoint> = new Map();
  private lastAngle: number = 0;
  private config: RotateConfig;

  constructor(config: RotateConfig = {}) {
    this.config = config;
  }

  /**
   * Handle touch start
   */
  onTouchStart(touches: Array<{ id: number; x: number; y: number }>): void {
    touches.forEach((touch) => {
      this.touches.set(touch.id, {
        x: touch.x,
        y: touch.y,
        timestamp: performance.now(),
      });
    });
  }

  /**
   * Handle touch move
   */
  onTouchMove(touches: Array<{ id: number; x: number; y: number }>): void {
    if (this.touches.size < 2) return;

    const touchArray = Array.from(this.touches.values());
    if (touchArray.length < 2) return;

    const touch1 = touchArray[0];
    const touch2 = touchArray[1];

    const angle = Math.atan2(touch2.y - touch1.y, touch2.x - touch1.x);

    if (this.lastAngle !== 0) {
      const deltaAngle = angle - this.lastAngle;
      this.config.onRotate?.(deltaAngle);
    }

    this.lastAngle = angle;

    // Update touch positions
    touches.forEach((touch) => {
      this.touches.set(touch.id, {
        x: touch.x,
        y: touch.y,
        timestamp: performance.now(),
      });
    });
  }

  /**
   * Handle touch end
   */
  onTouchEnd(touchIds: number[]): void {
    touchIds.forEach((id) => this.touches.delete(id));
    if (this.touches.size < 2) {
      this.lastAngle = 0;
    }
  }

  /**
   * Reset gesture
   */
  reset(): void {
    this.touches.clear();
    this.lastAngle = 0;
  }
}

export default {
  DragGesture,
  SwipeGesture,
  PinchGesture,
  RotateGesture,
};

/**
 * Factory function for drag gestures
 */
export function useDrag(config: DragConfig = {}): DragGesture {
  return new DragGesture(config);
}

/**
 * Factory function for swipe gestures
 */
export function useSwipe(config: SwipeConfig = {}): SwipeGesture {
  return new SwipeGesture(config);
}

/**
 * Factory function for pinch gestures
 */
export function usePinch(config: PinchConfig = {}): PinchGesture {
  return new PinchGesture(config);
}

/**
 * Factory function for rotate gestures
 */
export function useRotate(config: RotateConfig = {}): RotateGesture {
  return new RotateGesture(config);
}
