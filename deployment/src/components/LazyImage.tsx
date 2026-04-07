import React, { useRef, useEffect, useState, useCallback } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  width?: number;
  height?: number;
  className?: string;
  onLoad?: () => void;
}

const LazyImageComponent: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  width,
  height,
  className = '',
  onLoad,
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const [isLoaded, setIsLoaded] = useState(!placeholder);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    const img = imgRef.current;

    if (!img) return;

    // If no placeholder, load immediately
    if (!placeholder) {
      setIsLoaded(true);
      return;
    }

    // Create intersection observer for lazy loading
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
        rootMargin: '50px', // Start loading 50px before visible
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

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onLoad={handleLoad}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoaded ? 1 : 0.5,
      }}
    />
  );
};

export const LazyImage = React.memo(LazyImageComponent);
