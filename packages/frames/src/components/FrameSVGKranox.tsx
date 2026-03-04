/**
 * FrameSVGKranox - Arwes Kranox Frame (Assembling Style)
 */

import React, { useMemo, type CSSProperties, type RefObject } from 'react';
import { FrameSVG } from './FrameSVG';
import { calculateKranoxPaths, type KranoxPathOptions } from '../core/pathCalculator';
import type { FrameSVGPathGeneric } from '../core/svgRenderer';

export interface FrameSVGKranoxProps extends KranoxPathOptions {
  elementRef?: RefObject<SVGSVGElement>;
  onRender?: (svg: SVGSVGElement, width: number, height: number) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Kranox Frame Component (Arwes assembling style)
 */
export const FrameSVGKranox: React.FC<FrameSVGKranoxProps> = ({
  padding = 0,
  strokeWidth = 2,
  squareSize = 12,
  smallLineLength = 12,
  largeLineLength = 48,
  elementRef,
  onRender,
  className,
  style,
}) => {
  const paths: FrameSVGPathGeneric[] = useMemo(() => {
    const { bgPath, assemblyPaths } = calculateKranoxPaths({
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
