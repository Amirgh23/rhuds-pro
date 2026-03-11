/**
 * Gesture-Driven Animation System
 * Drag, swipe, pinch, and rotate gesture support
 */

import React from 'react';

/**
 * Drag gesture configuration
 */
export interface DragConfig {
  axis?: 'x' | 'y' | 'both';
  bounds?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  elastic?: boolean | number;
  onDragStart?: (event: PointerEvent) => void;
  onDrag?: (event: PointerEvent, delta: { x: number; y: number }) => void;
  onDragEnd?: (event: PointerEvent, velocity: { x: number; y: number }) => void;
}

/**
 * Drag state
 */
interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
  lastTime: number;
}

/**
 * Hook for drag gesture support
 */
export function useDrag(config: DragConfig = {}) {
  const [state, setState] = React.useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    velocityX: 0,
    velocityY: 0,
    lastTime: 0,
  });

  const stateRef = React.useRef(state);
  stateRef.current = state;

  const handlePointerDown = React.useCallback(
    (event: PointerEvent) => {
      const newState: DragState = {
        isDragging: true,
        startX: event.clientX,
        startY: event.clientY,
        currentX: event.clientX,
        currentY: event.clientY,
        deltaX: 0,
        deltaY: 0,
        velocityX: 0,
        velocityY: 0,
        lastTime: Date.now(),
      };
      setState(newState);
      config.onDragStart?.(event);
    },
    [config]
  );

  const handlePointerMove = React.useCallback(
    (event: PointerEvent) => {
      if (!stateRef.current.isDragging) return;

      const now = Date.now();
      const dt = (now - stateRef.current.lastTime) / 1000;

      let deltaX = event.clientX - stateRef.current.startX;
      let deltaY = event.clientY - stateRef.current.startY;

      // Apply axis constraints
      if (config.axis === 'x') deltaY = 0;
      if (config.axis === 'y') deltaX = 0;

      // Apply bounds with elastic effect
      if (config.bounds) {
        const elastic = typeof config.elastic === 'number' ? config.elastic : 0.5;
        const applyElastic = config.elastic !== false;

        if (config.bounds.left !== undefined && deltaX < config.bounds.left) {
          deltaX = applyElastic
            ? config.bounds.left + (deltaX - config.bounds.left) * elastic
            : config.bounds.left;
        }
        if (config.bounds.right !== undefined && deltaX > config.bounds.right) {
          deltaX = applyElastic
            ? config.bounds.right + (deltaX - config.bounds.right) * elastic
            : config.bounds.right;
        }
        if (config.bounds.top !== undefined && deltaY < config.bounds.top) {
          deltaY = applyElastic
            ? config.bounds.top + (deltaY - config.bounds.top) * elastic
            : config.bounds.top;
        }
        if (config.bounds.bottom !== undefined && deltaY > config.bounds.bottom) {
          deltaY = applyElastic
            ? config.bounds.bottom + (deltaY - config.bounds.bottom) * elastic
            : config.bounds.bottom;
        }
      }

      // Calculate velocity
      const velocityX = dt > 0 ? (deltaX - stateRef.current.deltaX) / dt : 0;
      const velocityY = dt > 0 ? (deltaY - stateRef.current.deltaY) / dt : 0;

      const newState: DragState = {
        ...stateRef.current,
        currentX: event.clientX,
        currentY: event.clientY,
        deltaX,
        deltaY,
        velocityX,
        velocityY,
        lastTime: now,
      };

      setState(newState);
      config.onDrag?.(event, { x: deltaX, y: deltaY });
    },
    [config]
  );

  const handlePointerUp = React.useCallback(
    (event: PointerEvent) => {
      if (!stateRef.current.isDragging) return;

      config.onDragEnd?.(event, {
        x: stateRef.current.velocityX,
        y: stateRef.current.velocityY,
      });

      setState((prev) => ({ ...prev, isDragging: false }));
    },
    [config]
  );

  React.useEffect(() => {
    document.addEventListener('pointermove', handlePointerMove as any);
    document.addEventListener('pointerup', handlePointerUp as any);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove as any);
      document.removeEventListener('pointerup', handlePointerUp as any);
    };
  }, [handlePointerMove, handlePointerUp]);

  return {
    bind: {
      onPointerDown: handlePointerDown as any,
    },
    ...state,
  };
}

/**
 * Swipe gesture configuration
 */
export interface SwipeConfig {
  threshold?: number;
  velocity?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

/**
 * Hook for swipe gesture detection
 */
export function useSwipe(config: SwipeConfig = {}) {
  const threshold = config.threshold ?? 50;
  const velocityThreshold = config.velocity ?? 0.5;

  const drag = useDrag({
    onDragEnd: (_, velocity) => {
      const { deltaX, deltaY } = drag;

      // Check horizontal swipe
      if (Math.abs(deltaX) > threshold || Math.abs(velocity.x) > velocityThreshold) {
        if (deltaX > 0) {
          config.onSwipeRight?.();
        } else {
          config.onSwipeLeft?.();
        }
      }

      // Check vertical swipe
      if (Math.abs(deltaY) > threshold || Math.abs(velocity.y) > velocityThreshold) {
        if (deltaY > 0) {
          config.onSwipeDown?.();
        } else {
          config.onSwipeUp?.();
        }
      }
    },
  });

  return drag;
}

/**
 * Pinch gesture configuration
 */
export interface PinchConfig {
  onPinch?: (scale: number) => void;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
}

/**
 * Hook for pinch gesture support
 */
export function usePinch(config: PinchConfig = {}) {
  const [isPinching, setIsPinching] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const initialDistanceRef = React.useRef(0);

  const handleTouchStart = React.useCallback(
    (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialDistanceRef.current = distance;
        setIsPinching(true);
        config.onPinchStart?.();
      }
    },
    [config]
  );

  const handleTouchMove = React.useCallback(
    (event: TouchEvent) => {
      if (event.touches.length === 2 && isPinching) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const newScale = distance / initialDistanceRef.current;
        setScale(newScale);
        config.onPinch?.(newScale);
      }
    },
    [isPinching, config]
  );

  const handleTouchEnd = React.useCallback(() => {
    if (isPinching) {
      setIsPinching(false);
      config.onPinchEnd?.();
    }
  }, [isPinching, config]);

  return {
    bind: {
      onTouchStart: handleTouchStart as any,
      onTouchMove: handleTouchMove as any,
      onTouchEnd: handleTouchEnd as any,
    },
    isPinching,
    scale,
  };
}

/**
 * Rotate gesture configuration
 */
export interface RotateConfig {
  onRotate?: (angle: number) => void;
  onRotateStart?: () => void;
  onRotateEnd?: () => void;
}

/**
 * Hook for rotate gesture support
 */
export function useRotate(config: RotateConfig = {}) {
  const [isRotating, setIsRotating] = React.useState(false);
  const [angle, setAngle] = React.useState(0);
  const initialAngleRef = React.useRef(0);

  const handleTouchStart = React.useCallback(
    (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const angle = Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
        initialAngleRef.current = angle;
        setIsRotating(true);
        config.onRotateStart?.();
      }
    },
    [config]
  );

  const handleTouchMove = React.useCallback(
    (event: TouchEvent) => {
      if (event.touches.length === 2 && isRotating) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentAngle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        );
        const rotation = (currentAngle - initialAngleRef.current) * (180 / Math.PI);
        setAngle(rotation);
        config.onRotate?.(rotation);
      }
    },
    [isRotating, config]
  );

  const handleTouchEnd = React.useCallback(() => {
    if (isRotating) {
      setIsRotating(false);
      config.onRotateEnd?.();
    }
  }, [isRotating, config]);

  return {
    bind: {
      onTouchStart: handleTouchStart as any,
      onTouchMove: handleTouchMove as any,
      onTouchEnd: handleTouchEnd as any,
    },
    isRotating,
    angle,
  };
}

