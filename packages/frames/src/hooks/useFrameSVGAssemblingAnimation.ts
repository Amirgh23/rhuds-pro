/**
 * useFrameSVGAssemblingAnimation Hook - Arwes Style
 * Provides assembling animation for Frame components
 */

import { useCallback, useEffect, RefObject } from 'react';

export interface FrameAssemblingAnimationResult {
  onRender: (svg: SVGSVGElement, width: number, height: number) => void;
}

export interface UseFrameSVGAssemblingAnimationOptions {
  duration?: number;
  animate?: boolean;
}

/**
 * Hook for Frame SVG assembling animation
 * Animates stroke-dasharray and opacity
 */
export function useFrameSVGAssemblingAnimation(
  svgRef: RefObject<SVGSVGElement>,
  options: UseFrameSVGAssemblingAnimationOptions = {}
): FrameAssemblingAnimationResult {
  const { duration = 1000, animate = true } = options;

  const onRender = useCallback(
    (svg: SVGSVGElement, width: number, height: number) => {
      if (!animate) return;

      const paths = svg.querySelectorAll('path[data-name="line"]');

      paths.forEach((path) => {
        const pathElement = path as SVGPathElement;
        
        try {
          const length = pathElement.getTotalLength();

          // Set initial state
          pathElement.style.strokeDasharray = `${length}`;
          pathElement.style.strokeDashoffset = `${length}`;
          pathElement.style.opacity = '0';

          // Animate after a small delay
          requestAnimationFrame(() => {
            setTimeout(() => {
              pathElement.style.transition = `stroke-dashoffset ${duration}ms ease-out, opacity ${duration}ms ease-out`;
              pathElement.style.strokeDashoffset = '0';
              pathElement.style.opacity = '1';
            }, 50);
          });
        } catch (e) {
          // If getTotalLength fails, just show the path
          pathElement.style.opacity = '1';
        }
      });
    },
    [duration, animate]
  );

  // Trigger animation on mount
  useEffect(() => {
    if (svgRef.current && animate) {
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      onRender(svg, rect.width, rect.height);
    }
  }, [svgRef, onRender, animate]);

  return { onRender };
}
