import { useEffect } from 'react';

/**
 * Professional scroll animations using Intersection Observer
 * Provides smooth reveal animations for elements as they enter the viewport
 * Supports: fade-up, fade-left, fade-right, scale-up animations
 */
export const useGSAPAnimations = () => {
  useEffect(() => {
    // Create Intersection Observer for scroll-triggered animations
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const animationType = element.dataset.gsap;

          // Add animation class based on type
          if (animationType === 'fade-up') {
            element.classList.add('animate-fade-up');
          } else if (animationType === 'fade-left') {
            element.classList.add('animate-fade-left');
          } else if (animationType === 'fade-right') {
            element.classList.add('animate-fade-right');
          } else if (animationType === 'scale-up') {
            element.classList.add('animate-scale-up');
          }

          // Stop observing after animation is triggered
          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observe all elements with data-gsap attribute
    const elements = document.querySelectorAll('[data-gsap]');
    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return { gsap: null, ScrollTrigger: null };
};
