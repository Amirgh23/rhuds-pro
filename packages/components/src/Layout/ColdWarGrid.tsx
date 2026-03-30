import React, { CSSProperties } from 'react';
import { ThemeVariant } from '../utils/coldWarUtils';

export interface ColdWarGridProps {
  children: React.ReactNode;
  columns?: number | string;
  gap?: string;
  theme?: ThemeVariant;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarGrid: React.FC<ColdWarGridProps> = ({
  children,
  columns = 'auto-fit',
  gap = '16px',
  theme = 'perseus',
  className = '',
  style = {},
}) => {
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns:
      typeof columns === 'number'
        ? `repeat(${columns}, 1fr)`
        : `repeat(${columns}, minmax(250px, 1fr))`,
    gap,
    width: '100%',
    ...style,
  };

  return (
    <div className={className} style={gridStyle}>
      {children}
    </div>
  );
};

export default ColdWarGrid;
