/**
 * useFrameSVGRenderer Hook - Arwes Style
 * Manages SVG rendering with resize observer
 */

import { useEffect, RefObject } from 'react';

export type SVGRenderCallback = (svg: SVGSVGElement, width: number, height: number) => void;

/**
 * Hook for managing SVG rendering with automatic resize handling
 */
export function useFrameSVGRenderer(
  svgRef: RefObject<SVGSVGElement>,
  onRender?: SVGRenderCallback
): void {
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !onRender) return;

    const render = () => {
      const rect = svg.getBoundingClientRect();
      onRender(svg, rect.width, rect.height);
    };

    // Initial render
    render();

    // Setup resize observer
    const resizeObserver = new ResizeObserver(() => {
      render();
    });

    resizeObserver.observe(svg);

    return () => {
      resizeObserver.disconnect();
    };
  }, [svgRef, onRender]);
}
