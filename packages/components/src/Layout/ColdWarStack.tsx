import React, { CSSProperties } from 'react';
import { ThemeVariant } from '../utils/coldWarUtils';

export interface ColdWarStackProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  gap?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  theme?: ThemeVariant;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarStack: React.FC<ColdWarStackProps> = ({
  children,
  direction = 'vertical',
  gap = '16px',
  align = 'stretch',
  justify = 'start',
  theme = 'perseus',
  className = '',
  style = {},
}) => {
  const stackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    gap,
    alignItems: align,
    justifyContent: justify,
    width: '100%',
    ...style,
  };

  return (
    <div className={className} style={stackStyle}>
      {children}
    </div>
  );
};

export default ColdWarStack;
