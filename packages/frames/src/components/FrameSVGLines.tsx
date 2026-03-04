/**
 * FrameSVGLines - Arwes Lines Frame
 */

import React, { useMemo, type CSSProperties, type RefObject } from 'react';
import { FrameSVG } from './FrameSVG';
import { calculateLinesPaths, type LinesPathOptions } from '../core/pathCalculator';
import type { FrameSVGPathGeneric } from '../core/svgRenderer';

export interface FrameSVGLinesProps extends LinesPathOptions {
  elementRef?: RefObject<SVGSVGElement>;
  onRender?: (svg: SVGSVGElement, width: number, height: number) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Lines Frame Component (Arwes lines style)
 */
export const FrameSVGLines: React.FC<FrameSVGLinesProps> = ({
  padding = 0,
  strokeWidth = 2,
  lineLength = 8,
  elementRef,
  onRender,
  className,
  style,
}) => {
  const paths: FrameSVGPathGeneric[] = useMemo(() => {
    const { linePath } = calculateLinesPaths({
      padding,
      strokeWidth,
      lineLength,
    });

    return [
      {
        name: 'line',
        style: {
          strokeWidth: String(strokeWidth),
          stroke: 'currentColor',
          fill: 'none',
          strokeDasharray: '8 4',
          filter: 'drop-shadow(0 0 2px currentColor)',
        },
        path: linePath,
      },
    ];
  }, [padding, strokeWidth, lineLength]);

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
