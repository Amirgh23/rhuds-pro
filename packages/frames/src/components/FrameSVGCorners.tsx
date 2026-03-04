/**
 * FrameSVGCorners - Arwes Corners Frame
 */

import React, { useMemo, type CSSProperties, type RefObject } from 'react';
import { FrameSVG } from './FrameSVG';
import { calculateCornersPaths, type CornersPathOptions } from '../core/pathCalculator';
import type { FrameSVGPathGeneric } from '../core/svgRenderer';

export interface FrameSVGCornersProps extends CornersPathOptions {
  elementRef?: RefObject<SVGSVGElement>;
  onRender?: (svg: SVGSVGElement, width: number, height: number) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Corners Frame Component (Arwes corners style)
 */
export const FrameSVGCorners: React.FC<FrameSVGCornersProps> = ({
  padding = 0,
  strokeWidth = 1,
  cornerLength = 32,
  elementRef,
  onRender,
  className,
  style,
}) => {
  const paths: FrameSVGPathGeneric[] = useMemo(() => {
    const { cornerPaths } = calculateCornersPaths({
      padding,
      strokeWidth,
      cornerLength,
    });

    return cornerPaths.map((path) => ({
      name: 'line',
      style: {
        strokeWidth: String(strokeWidth),
        stroke: 'currentColor',
        fill: 'none',
        filter: 'drop-shadow(0 0 2px currentColor)',
      },
      path,
    }));
  }, [padding, strokeWidth, cornerLength]);

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
