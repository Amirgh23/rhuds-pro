/**
 * Grid Component
 * Responsive grid layout
 */

import React, { useMemo } from 'react';
import { GridProps } from './types';

/**
 * Grid Component
 */
export const Grid: React.FC<GridProps> = ({
  columns = 1,
  gap = '1rem',
  children,
  className,
  style,
}) => {
  const computedStyle = useMemo(() => {
    const gridColumns = typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns;

    return {
      display: 'grid',
      gridTemplateColumns: gridColumns,
      gap: typeof gap === 'number' ? `${gap}rem` : gap,
      ...style,
    } as React.CSSProperties;
  }, [columns, gap, style]);

  return (
    <div className={className} style={computedStyle}>
      {children}
    </div>
  );
};

Grid.displayName = 'Grid';
