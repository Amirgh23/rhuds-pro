/**
 * FrameSVGUnderline - Arwes Underline Frame
 */

import React, { useMemo, type CSSProperties, type RefObject } from 'react';
import { FrameSVG } from './FrameSVG';
import { calculateUnderlinePaths, type UnderlinePathOptions } from '../core/pathCalculator';
import type { FrameSVGPathGeneric } from '../core/svgRenderer';

export interface FrameSVGUnderlineProps extends UnderlinePathOptions {
  elementRef?: RefObject<SVGSVGElement>;
  onRender?: (svg: SVGSVGElement, width: number, height: number) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Underline Frame Component (Arwes basic + squareSize style)
 */
export const FrameSVGUnderline: React.FC<FrameSVGUnderlineProps> = ({
  padding = 0,
  strokeWidth = 1,
  squareSize = 8,
  elementRef,
  onRender,
  className,
  style,
}) => {
  const paths: FrameSVGPathGeneric[] = useMemo(() => {
    const { squarePaths, underlinePath } = calculateUnderlinePaths({
      padding,
      strokeWidth,
      squareSize,
    });

    return [
      // Corner squares as background
      ...squarePaths.map((path) => ({
        name: 'bg',
        style: {
          strokeWidth: '0',
          fill: 'currentColor',
          filter: 'drop-shadow(0 0 2px currentColor)',
        },
        path,
      })),
      // Underline
      {
        name: 'line',
        style: {
          strokeWidth: String(strokeWidth),
          stroke: 'currentColor',
          fill: 'none',
          filter: 'drop-shadow(0 0 2px currentColor)',
        },
        path: underlinePath,
      },
    ];
  }, [padding, strokeWidth, squareSize]);

  return (
    <FrameSVG
      paths={paths}
      elementRef={elementRef}
      onRender={onRender}
      className={className}
      style={style}
    />
  );
};
