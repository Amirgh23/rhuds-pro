/**
 * Container Component
 * Max-width container with responsive padding
 */

import React, { useMemo } from 'react';
import { ContainerProps } from './types';

/**
 * Container Component
 */
export const Container: React.FC<ContainerProps> = ({
  maxWidth = '1200px',
  padding = '1rem',
  centered = true,
  children,
  className,
  style,
}) => {
  const computedStyle = useMemo<React.CSSProperties>(() => {
    return {
      maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
      padding: typeof padding === 'number' ? `${padding}rem` : padding,
      margin: centered ? '0 auto' : undefined,
      width: '100%',
      boxSizing: 'border-box',
      ...style,
    };
  }, [maxWidth, padding, centered, style]);

  return (
    <div className={className} style={computedStyle}>
      {children}
    </div>
  );
};

Container.displayName = 'Container';
