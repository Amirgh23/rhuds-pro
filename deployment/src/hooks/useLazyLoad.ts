import { useEffect, useRef, useState, useCallback } from 'react';

interface UseLazyLoadOptions {
  rootMargin?: string;
  threshold?: number | number[];
  onVisible?: () => void;
}

/**
 * Hook for lazy loading elements using Intersection Observer
 * @param options Configuration options for the observer
 * @returns Ref to attach to the element and loading state
 */
export const useLazyLoad = (options: UseLazyLoadOptions = {}) => {
  const { rootMargin = '50px', threshold = 0.01, onVisible } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleVisible = useCallback(() => {
    setIsVisible(true);
    onVisible?.();
  }, [onVisible]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleVisible();
            observer.unobserve(element);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      if (observer && element) {
        observer.unobserve(element);
      }
    };
  }, [rootMargin, threshold, handleVisible]);

  return { ref, isVisible };
};

/**
 * Hook for lazy loading images with blur-up effect
 * @param src Full resolution image source
 * @param placeholder Low-quality placeholder image
 * @returns Image source and loading state
 */
export const useLazyLoadImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const [isLoaded, setIsLoaded] = useState(!placeholder);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    const img = imgRef.current;

    if (!img || !placeholder) {
      setIsLoaded(true);
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    observer.observe(img);

    return () => {
      if (observer && img) {
        observer.unobserve(img);
      }
    };
  }, [src, placeholder]);

  return {
    ref: imgRef,
    imageSrc,
    isLoaded,
    setIsLoaded,
  };
};
