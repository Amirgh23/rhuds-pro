/**
 * FrameSVGNefrex - Arwes Nefrex Frame (Basic + Assembling)
 */

import React, { useMemo, type CSSProperties, type RefObject } from 'react';
import { FrameSVG } from './FrameSVG';
import { calculateNefrexPaths, type NefrexPathOptions } from '../core/pathCalculator';
import type { FrameSVGPathGeneric } from '../core/svgRenderer';

export interface FrameSVGNefrexProps extends NefrexPathOptions {
  elementRef?: RefObject<SVGSVGElement>;
  onRender?: (svg: SVGSVGElement, width: number, height: number) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Nefrex Frame Component (Arwes basic + assembling style)
 */
export const FrameSVGNefrex: React.FC<FrameSVGNefrexProps> = ({
  padding = 0,
  strokeWidth = 2,
  squareSize = 32,
  smallLineLength = 32,
  largeLineLength = 128,
  elementRef,
  onRender,
  className,
  style,
}) => {
  const paths: FrameSVGPathGeneric[] = useMemo(() => {
    const { bgPath, assemblyPaths } = calculateNefrexPaths({
      padding,
      strokeWidth,
      squareSize,
      smallLineLength,
      largeLineLength,
    });

    return [
      {
        name: 'bg',
        style: {
          strokeWidth: '0',
          fill: 'currentColor',
          filter: 'drop-shadow(0 0 4px currentColor)',
        },
        path: bgPath,
      },
      ...assemblyPaths.map((path) => ({
        name: 'line',
        style: {
          strokeWidth: String(strokeWidth),
          stroke: 'currentColor',
          fill: 'none',
          filter: 'drop-shadow(0 0 2px currentColor)',
        },
        path,
      })),
    ];
  }, [padding, strokeWidth, squareSize, smallLineLength, largeLineLength]);

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
