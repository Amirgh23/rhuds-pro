/**
 * FrameSVG - Base Frame Component (Arwes Style)
 */

import React, { useRef, useCallback, type CSSProperties, type RefObject } from 'react';
import { renderFrameSVGPaths, type FrameSVGPathGeneric } from '../core/svgRenderer';
import { useFrameSVGRenderer } from '../hooks/useFrameSVGRenderer';

export interface FrameSVGProps {
  paths: FrameSVGPathGeneric[];
  elementRef?: RefObject<SVGSVGElement>;
  onRender?: (svg: SVGSVGElement, width: number, height: number) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Base FrameSVG component
 * Renders custom SVG paths with Arwes styling
 */
export const FrameSVG: React.FC<FrameSVGProps> = ({
  paths,
  elementRef,
  onRender,
  className,
  style,
}) => {
  const internalRef = useRef<SVGSVGElement>(null);
  const svgRef = elementRef || internalRef;

  const handleRender = useCallback(
    (svg: SVGSVGElement, width: number, height: number) => {
      renderFrameSVGPaths(svg, width, height, paths);
      onRender?.(svg, width, height);
    },
    [paths, onRender]
  );

  useFrameSVGRenderer(svgRef, handleRender);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
      style={{
        display: 'block',
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
};
