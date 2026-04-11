import { useCallback, useRef } from 'react';

/**
 * Hook for throttling function calls
 * @template T - The type of the callback function
 * @param callback - The function to throttle
 * @param delay - The minimum delay between function calls in milliseconds
 * @returns A throttled version of the callback
 */
export function useThrottle<T extends (...args: unknown[]) => void>(callback: T, delay: number): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );
}
