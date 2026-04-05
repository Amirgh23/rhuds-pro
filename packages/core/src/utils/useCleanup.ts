/**
 * Utility hooks for proper cleanup of timers and listeners
 */

import { useEffect, useRef } from 'react';

/**
 * Hook to manage intervals with automatic cleanup
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      savedCallback.current?.();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Hook to manage timeouts with automatic cleanup
 */
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => {
      savedCallback.current?.();
    }, delay);

    return () => clearTimeout(id);
  }, [delay]);
}

/**
 * Hook to manage animation frames with automatic cleanup
 */
export function useAnimationFrame(callback: (time: number) => void, enabled = true) {
  const savedCallback = useRef<(time: number) => void>();
  const frameId = useRef<number>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const animate = (time: number) => {
      savedCallback.current?.(time);
      frameId.current = requestAnimationFrame(animate);
    };

    frameId.current = requestAnimationFrame(animate);

    return () => {
      if (frameId.current !== undefined) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [enabled]);
}

/**
 * Hook to manage event listeners with automatic cleanup
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: Window | Document | HTMLElement = window,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = useRef<(event: WindowEventMap[K]) => void>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: Event) => {
      savedHandler.current?.(event as WindowEventMap[K]);
    };

    element.addEventListener(eventName, eventListener, options);

    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

/**
 * Hook to manage AbortController for fetch and other async operations
 */
export function useAbortController() {
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    controllerRef.current = new AbortController();

    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return controllerRef.current!;
}

/**
 * Hook to manage multiple timers/intervals
 */
export function useTimerManager() {
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const setTimeout = (callback: () => void, delay: number) => {
    const id = global.setTimeout(callback, delay);
    timersRef.current.add(id);
    return id;
  };

  const setInterval = (callback: () => void, delay: number) => {
    const id = global.setInterval(callback, delay);
    intervalsRef.current.add(id);
    return id;
  };

  const clearTimer = (id: NodeJS.Timeout) => {
    global.clearTimeout(id);
    timersRef.current.delete(id);
  };

  const clearInterval = (id: NodeJS.Timeout) => {
    global.clearInterval(id);
    intervalsRef.current.delete(id);
  };

  const cleanup = () => {
    timersRef.current.forEach((id) => global.clearTimeout(id));
    intervalsRef.current.forEach((id) => global.clearInterval(id));
    timersRef.current.clear();
    intervalsRef.current.clear();
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return { setTimeout, setInterval, clearTimer, clearInterval, cleanup };
}
