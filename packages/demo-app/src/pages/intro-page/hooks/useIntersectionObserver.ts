/**
 * useIntersectionObserver hook
 * Detects when elements enter the viewport for animation triggers
 */

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Intersection observer options
 */
export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
}

/**
 * Intersection observer state
 */
export interface IntersectionState {
  isVisible: boolean;
  hasBeenVisible: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * Hook for detecting element visibility in viewport
 * Useful for triggering animations when elements enter view
 *
 * @param options - Intersection observer options
 * @returns Ref to attach to element and visibility state
 *
 * @example
 * const { ref, isVisible } = useIntersectionObserver({
 *   threshold: 0.1,
 *   triggerOnce: true
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isVisible && <AnimatedComponent />}
 *   </div>
 * );
 */
export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}): {
  ref: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
  hasBeenVisible: boolean;
  entry: IntersectionObserverEntry | null;
} {
  const { threshold = 0.1, rootMargin = '0px', root = null, triggerOnce = false } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<IntersectionState>({
    isVisible: false,
    hasBeenVisible: false,
    entry: null,
  });

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.target === ref.current) {
          const isIntersecting = entry.isIntersecting;

          setState((prevState) => {
            const hasBeenVisible = prevState.hasBeenVisible || isIntersecting;

            // If triggerOnce is true and element has been visible, don't update
            if (triggerOnce && prevState.hasBeenVisible) {
              return prevState;
            }

            return {
              isVisible: isIntersecting,
              hasBeenVisible,
              entry,
            };
          });
        }
      });
    },
    [triggerOnce]
  );

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: assume element is visible if IntersectionObserver not supported
      setState({
        isVisible: true,
        hasBeenVisible: true,
        entry: null,
      });
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, handleIntersection]);

  return {
    ref,
    isVisible: state.isVisible,
    hasBeenVisible: state.hasBeenVisible,
    entry: state.entry,
  };
}

/**
 * Hook for multiple elements with intersection observer
 * Tracks visibility of multiple elements simultaneously
 *
 * @param options - Intersection observer options
 * @returns Map of element IDs to visibility state
 *
 * @example
 * const { refs, visibilityMap } = useMultipleIntersectionObservers({
 *   threshold: 0.1,
 *   triggerOnce: true
 * });
 *
 * return (
 *   <>
 *     {items.map((item) => (
 *       <div key={item.id} ref={refs.get(item.id)}>
 *         {visibilityMap.get(item.id)?.isVisible && <AnimatedComponent />}
 *       </div>
 *     ))}
 *   </>
 * );
 */
export function useMultipleIntersectionObservers(options: UseIntersectionObserverOptions = {}): {
  refs: Map<string, React.RefObject<HTMLDivElement>>;
  visibilityMap: Map<string, IntersectionState>;
  registerElement: (id: string) => React.RefObject<HTMLDivElement>;
} {
  const { threshold = 0.1, rootMargin = '0px', root = null, triggerOnce = false } = options;

  const refsMap = useRef<Map<string, React.RefObject<HTMLDivElement>>>(new Map());
  const [visibilityMap, setVisibilityMap] = useState<Map<string, IntersectionState>>(new Map());

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      setVisibilityMap((prevMap) => {
        const newMap = new Map(prevMap);

        entries.forEach((entry) => {
          // Find the ID for this entry
          let elementId: string | null = null;
          for (const [id, ref] of refsMap.current.entries()) {
            if (ref.current === entry.target) {
              elementId = id;
              break;
            }
          }

          if (elementId) {
            const prevState = newMap.get(elementId) || {
              isVisible: false,
              hasBeenVisible: false,
              entry: null,
            };

            const hasBeenVisible = prevState.hasBeenVisible || entry.isIntersecting;

            // If triggerOnce is true and element has been visible, don't update
            if (triggerOnce && prevState.hasBeenVisible) {
              return;
            }

            newMap.set(elementId, {
              isVisible: entry.isIntersecting,
              hasBeenVisible,
              entry,
            });
          }
        });

        return newMap;
      });
    },
    [triggerOnce]
  );

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: assume all elements are visible
      const newMap = new Map<string, IntersectionState>();
      for (const id of refsMap.current.keys()) {
        newMap.set(id, {
          isVisible: true,
          hasBeenVisible: true,
          entry: null,
        });
      }
      setVisibilityMap(newMap);
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root,
    });

    // Observe all registered elements
    for (const ref of refsMap.current.values()) {
      if (ref.current) {
        observer.observe(ref.current);
      }
    }

    return () => {
      for (const ref of refsMap.current.values()) {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, handleIntersection]);

  const registerElement = useCallback((id: string): React.RefObject<HTMLDivElement> => {
    if (!refsMap.current.has(id)) {
      refsMap.current.set(id, { current: null });
    }
    return refsMap.current.get(id)!;
  }, []);

  return {
    refs: refsMap.current,
    visibilityMap,
    registerElement,
  };
}

/**
 * Hook for delayed intersection observer trigger
 * Triggers animation after element is visible for a specified duration
 *
 * @param delay - Delay in milliseconds before triggering
 * @param options - Intersection observer options
 * @returns Ref and trigger state
 *
 * @example
 * const { ref, shouldTrigger } = useDelayedIntersectionObserver(500);
 *
 * return (
 *   <div ref={ref}>
 *     {shouldTrigger && <AnimatedComponent />}
 *   </div>
 * );
 */
export function useDelayedIntersectionObserver(
  delay: number = 0,
  options: UseIntersectionObserverOptions = {}
): {
  ref: React.RefObject<HTMLDivElement>;
  shouldTrigger: boolean;
} {
  const { ref, isVisible } = useIntersectionObserver(options);
  const [shouldTrigger, setShouldTrigger] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible && !shouldTrigger) {
      timeoutRef.current = setTimeout(() => {
        setShouldTrigger(true);
      }, delay);
    } else if (!isVisible) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShouldTrigger(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, delay, shouldTrigger]);

  return { ref, shouldTrigger };
}
