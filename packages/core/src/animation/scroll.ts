/**
 * Scroll-Triggered Animation System
 * Viewport intersection and scroll progress tracking
 */

import { useEffect, useState, useRef, RefObject } from 'react';

/**
 * Scroll trigger configuration
 */
export interface ScrollTriggerConfig {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  onEnter?: () => void;
  onExit?: () => void;
  onProgress?: (progress: number) => void;
}

/**
 * Hook for viewport intersection detection
 */
export function useInView(
  config: ScrollTriggerConfig = {}
): [RefObject<HTMLElement>, boolean] {
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (config.triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting;

          if (inView !== isInView) {
            setIsInView(inView);

            if (inView) {
              config.onEnter?.();
              if (config.triggerOnce) {
                setHasTriggered(true);
              }
            } else {
              config.onExit?.();
            }
          }
        });
      },
      {
        threshold: config.threshold ?? 0,
        rootMargin: config.rootMargin ?? '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [config, isInView, hasTriggered]);

  return [ref, isInView];
}

/**
 * Hook for scroll progress tracking
 */
export function useScrollProgress(
  config: ScrollTriggerConfig = {}
): [RefObject<HTMLElement>, number] {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress based on element position in viewport
      // 0 = element bottom at viewport top
      // 1 = element top at viewport bottom
      const elementTop = rect.top;
      const elementHeight = rect.height;

      let scrollProgress = 0;

      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        // Element is in viewport
        const visibleHeight = Math.min(
          windowHeight - elementTop,
          elementHeight,
          windowHeight
        );
        scrollProgress = visibleHeight / elementHeight;
      } else if (elementTop + elementHeight <= 0) {
        // Element is above viewport
        scrollProgress = 1;
      }

      scrollProgress = Math.max(0, Math.min(1, scrollProgress));

      if (scrollProgress !== progress) {
        setProgress(scrollProgress);
        config.onProgress?.(scrollProgress);
      }
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [config, progress]);

  return [ref, progress];
}

/**
 * Parallax scroll configuration
 */
export interface ParallaxConfig {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}

/**
 * Hook for parallax scrolling effect
 */
export function useParallax(
  config: ParallaxConfig = {}
): [RefObject<HTMLElement>, { x: number; y: number }] {
  const speed = config.speed ?? 0.5;
  const direction = config.direction ?? 'vertical';
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let x = 0;
      let y = 0;

      if (direction === 'vertical') {
        y = (rect.top + scrollY) * speed;
      } else {
        x = (rect.left + scrollX) * speed;
      }

      setOffset({ x, y });
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, direction]);

  return [ref, offset];
}

/**
 * Scroll snap configuration
 */
export interface ScrollSnapConfig {
  axis?: 'x' | 'y' | 'both';
  proximity?: number;
  onSnap?: (index: number) => void;
}

/**
 * Hook for scroll snap behavior
 */
export function useScrollSnap(
  config: ScrollSnapConfig = {}
): RefObject<HTMLElement> {
  const ref = useRef<HTMLElement>(null);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }

      snapTimeoutRef.current = setTimeout(() => {
        const children = Array.from(element.children) as HTMLElement[];
        const containerRect = element.getBoundingClientRect();

        let closestChild: HTMLElement | null = null;
        let closestDistance = Infinity;
        let closestIndex = -1;

        children.forEach((child, index) => {
          const childRect = child.getBoundingClientRect();
          let distance = 0;

          if (config.axis === 'x' || config.axis === 'both') {
            distance += Math.abs(childRect.left - containerRect.left);
          }
          if (config.axis === 'y' || config.axis === 'both' || !config.axis) {
            distance += Math.abs(childRect.top - containerRect.top);
          }

          if (distance < closestDistance) {
            closestDistance = distance;
            closestChild = child;
            closestIndex = index;
          }
        });

        if (closestChild && closestDistance < (config.proximity ?? 100)) {
          closestChild.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          });
          config.onSnap?.(closestIndex);
        }
      }, 150);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScroll);
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, [config]);

  return ref;
}
