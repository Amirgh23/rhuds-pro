/**
 * FrameSVGOctagon - Arwes Octagon Frame
 */

import React, { useMemo, type CSSProperties, type RefObject } from 'react';
import { FrameSVG } from './FrameSVG';
import { calculateOctagonPaths, type OctagonPathOptions } from '../core/pathCalculator';
import type { FrameSVGPathGeneric } from '../core/svgRenderer';

export interface FrameSVGOctagonProps extends OctagonPathOptions {
  elementRef?: RefObject<SVGSVGElement>;
  onRender?: (svg: SVGSVGElement, width: number, height: number) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Octagon Frame Component (Arwes basic style)
 */
export const FrameSVGOctagon: React.FC<FrameSVGOctagonProps> = ({
  padding = 0,
  squareSize = 16,
  leftTop = true,
  rightTop = true,
  rightBottom = true,
  leftBottom = true,
  elementRef,
  onRender,
  className,
  style,
}) => {
  const paths: FrameSVGPathGeneric[] = useMemo(() => {
    const { bgPath, linePath } = calculateOctagonPaths({
      padding,
      squareSize,
      leftTop,
      rightTop,
      rightBottom,
      leftBottom,
    });

    return [
      {
        name: 'bg',
        style: {
          strokeWidth: '0',
          fill: 'currentColor',
          filter: 'drop-shadow(0 0 2px currentColor)',
        },
        path: bgPath,
      },
      {
        name: 'line',
        style: {
          strokeWidth: '1',
          stroke: 'currentColor',
          fill: 'none',
          filter: 'drop-shadow(0 0 2px currentColor)',
        },
        path: linePath,
      },
    ];
  }, [padding, squareSize, leftTop, rightTop, rightBottom, leftBottom]);

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
