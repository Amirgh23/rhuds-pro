import { useEffect, useRef } from 'react';

interface ScrollTransformConfig {
  yOffset?: number;
  xOffset?: number;
  rotation?: number;
  scale?: number;
  opacity?: boolean;
}

export const useScrollTransform = (
  ref: React.RefObject<HTMLElement>,
  config: ScrollTransformConfig = {}
) => {
  const { yOffset = 0.5, xOffset = 0, rotation = 0, scale = 1, opacity = false } = config;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    let animationFrameId: number;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const windowHeight = window.innerHeight;
      const scrollProgress = 1 - elementTop / windowHeight;

      let transform = '';

      if (yOffset !== 0) {
        const yTranslate = scrollProgress * 100 * yOffset;
        transform += `translateY(${yTranslate}px) `;
      }

      if (xOffset !== 0) {
        const xTranslate = scrollProgress * 100 * xOffset;
        transform += `translateX(${xTranslate}px) `;
      }

      if (rotation !== 0) {
        const rotateValue = scrollProgress * rotation;
        transform += `rotate(${rotateValue}deg) `;
      }

      if (scale !== 1) {
        const scaleValue = 1 + (scale - 1) * scrollProgress;
        transform += `scale(${scaleValue}) `;
      }

      element.style.transform = transform;

      if (opacity) {
        element.style.opacity = String(Math.min(scrollProgress, 1));
      }
    };

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [yOffset, xOffset, rotation, scale, opacity]);
};
