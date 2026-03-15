import { useEffect, useRef } from 'react';

interface RevealConfig {
  threshold?: number;
  rootMargin?: string;
  duration?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const useRevealOnScroll = (ref: React.RefObject<HTMLElement>, config: RevealConfig = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    duration = 0.8,
    delay = 0,
    direction = 'up',
  } = config;

  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    // Set initial state
    element.style.opacity = '0';
    let initialTransform = '';

    switch (direction) {
      case 'up':
        initialTransform = 'translateY(60px)';
        break;
      case 'down':
        initialTransform = 'translateY(-60px)';
        break;
      case 'left':
        initialTransform = 'translateX(60px)';
        break;
      case 'right':
        initialTransform = 'translateX(-60px)';
        break;
    }

    element.style.transform = initialTransform;
    element.style.transition = `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
            hasAnimated.current = true;
            observer.unobserve(element);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, duration, delay, direction]);
};
