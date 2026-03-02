/**
 * Stack Component
 * Flexible stack layout (row or column)
 */

import React, { useMemo } from 'react';
import { StackProps } from './types';

/**
 * Stack Component
 */
export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  gap = '1rem',
  align = 'stretch',
  justify = 'flex-start',
  children,
  className,
  style,
}) => {
  const computedStyle = useMemo<React.CSSProperties>(() => {
    return {
      display: 'flex',
      flexDirection: direction,
      gap: typeof gap === 'number' ? `${gap}rem` : gap,
      alignItems: align,
      justifyContent: justify,
      ...style,
    };
  }, [direction, gap, align, justify, style]);

  return (
    <div className={className} style={computedStyle}>
      {children}
    </div>
  );
};

Stack.displayName = 'Stack';
