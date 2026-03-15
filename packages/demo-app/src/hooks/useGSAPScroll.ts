import { useEffect, useRef } from 'react';

interface ScrollTriggerOptions {
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

export const useGSAPScroll = (ref: React.RefObject<HTMLElement>) => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!ref.current || hasInitialized.current) return;

    // Dynamically import GSAP
    const loadGSAP = async () => {
      try {
        const gsap = (await import('gsap')).default;
        const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;

        gsap.registerPlugin(ScrollTrigger);

        // Create scroll animations
        const elements = ref.current?.querySelectorAll('[data-scroll]');
        if (!elements) return;

        elements.forEach((element: Element) => {
          const htmlElement = element as HTMLElement;
          const animationType = htmlElement.dataset.scroll;

          gsap.fromTo(
            htmlElement,
            {
              opacity: 0,
              y: 100,
              x: 0,
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 1,
              scrollTrigger: {
                trigger: htmlElement,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1,
                markers: false,
              },
            }
          );
        });

        hasInitialized.current = true;
      } catch (error) {
        console.log('GSAP not available, using CSS animations instead');
      }
    };

    loadGSAP();
  }, [ref]);
};
