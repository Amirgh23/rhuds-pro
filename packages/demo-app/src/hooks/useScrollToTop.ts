import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const scrollToTop = () => {
  // Scroll window to top
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // Find and scroll any internal scroll containers (like DocsPage)
  const scrollContainers = document.querySelectorAll('[style*="overflowY"]');
  scrollContainers.forEach((container) => {
    if (container instanceof HTMLElement) {
      container.scrollTop = 0;
    }
  });
};

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll immediately
    scrollToTop();

    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      scrollToTop();
    });

    // Also scroll after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      scrollToTop();
    }, 100);

    // Additional scroll after longer delay to handle lazy-loaded components
    const longTimeoutId = setTimeout(() => {
      scrollToTop();
    }, 300);

    // Prevent any scroll events from scrolling the page
    const handleScroll = (e: Event) => {
      // Only prevent scroll if it's not from user interaction
      if (e.type === 'scroll' && document.documentElement.scrollTop > 0) {
        scrollToTop();
      }
    };

    // Add scroll listener to prevent unwanted scrolling
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(longTimeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);
};
