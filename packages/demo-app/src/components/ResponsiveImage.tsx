import React, { useState, useEffect } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Responsive Image Component
 * Automatically serves WebP/AVIF formats with fallback to original
 * Supports lazy loading and responsive sizing
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  title,
  className = '',
  width,
  height,
  priority = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Extract base filename without extension
  const basename = src.split('/').pop()?.split('.')[0] || 'image';
  const imagePath = `/images-optimized/${basename}`;

  // Generate srcSet for responsive images
  const sizes = [320, 640, 1024, 1280, 1920];
  const webpSrcSet = sizes.map((size) => `${imagePath}-${size}w.webp ${size}w`).join(', ');
  const avifSrcSet = sizes.map((size) => `${imagePath}-${size}w.avif ${size}w`).join(', ');

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <picture>
      {/* AVIF format (best compression) */}
      <source srcSet={avifSrcSet} type="image/avif" sizes="100vw" />

      {/* WebP format (good compression) */}
      <source srcSet={webpSrcSet} type="image/webp" sizes="100vw" />

      {/* Fallback to original image */}
      <img
        src={src}
        alt={alt}
        title={title}
        className={`${className} ${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''}`}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoaded ? 1 : 0.7,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </picture>
  );
};

export default ResponsiveImage;
