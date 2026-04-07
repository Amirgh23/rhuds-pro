import { useEffect } from 'react';

interface PrefetchOptions {
  as?: 'image' | 'script' | 'style' | 'font';
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

/**
 * Hook for prefetching resources
 * Improves perceived performance by loading resources ahead of time
 */
export function usePrefetch(url: string, options: PrefetchOptions = {}) {
  useEffect(() => {
    if (!url) return;

    // Check if link already exists
    const existingLink = document.querySelector(`link[href="${url}"]`);
    if (existingLink) return;

    // Create prefetch link
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;

    if (options.as) {
      link.as = options.as;
    }

    if (options.type) {
      link.type = options.type;
    }

    if (options.crossOrigin) {
      link.crossOrigin = options.crossOrigin;
    }

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [url, options]);
}

/**
 * Hook for preloading critical resources
 * Use for resources needed immediately
 */
export function usePreload(url: string, options: PrefetchOptions = {}) {
  useEffect(() => {
    if (!url) return;

    const existingLink = document.querySelector(`link[href="${url}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;

    if (options.as) {
      link.as = options.as;
    }

    if (options.type) {
      link.type = options.type;
    }

    if (options.crossOrigin) {
      link.crossOrigin = options.crossOrigin;
    }

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [url, options]);
}

/**
 * Hook for DNS prefetch
 * Resolves DNS for external domains ahead of time
 */
export function useDnsPrefetch(domain: string) {
  useEffect(() => {
    if (!domain) return;

    const existingLink = document.querySelector(`link[href="//dns-prefetch://${domain}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [domain]);
}

/**
 * Hook for preconnect
 * Establishes early connection to external domains
 */
export function usePreconnect(url: string, crossOrigin?: 'anonymous' | 'use-credentials') {
  useEffect(() => {
    if (!url) return;

    const existingLink = document.querySelector(`link[href="${url}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;

    if (crossOrigin) {
      link.crossOrigin = crossOrigin;
    }

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [url, crossOrigin]);
}

export default usePrefetch;
