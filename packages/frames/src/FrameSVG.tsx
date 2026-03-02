/**
 * FrameSVG Base Component
 * Base component for SVG-based frame rendering
 */

import React, { useMemo } from 'react';
import { FrameSVGProps } from './types';
import { pathToString } from './svg';

/**
 * FrameSVG base component
 */
export const FrameSVG: React.FC<FrameSVGProps> = ({
  config,
  children,
  className,
  style,
  responsive = true,
  preserveAspectRatio = 'xMidYMid meet',
}) => {
  const { width, height, color = '#00ffff', strokeWidth = 2 } = config;

  const viewBox = useMemo(() => `0 0 ${width} ${height}`, [width, height]);

  const svgStyle = useMemo(
    () => ({
      width: responsive ? '100%' : width,
      height: responsive ? 'auto' : height,
      ...style,
    }),
    [responsive, width, height, style]
  );

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: responsive ? '100%' : width,
        height: responsive ? 'auto' : height,
      }}
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        style={svgStyle}
      >
        <defs>
          {/* Clip paths will be added by child components */}
        </defs>

        {/* Frame will be rendered by child components */}
      </svg>

      {/* Content */}
      {children && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

FrameSVG.displayName = 'FrameSVG';

/**
 * Hook for custom frame rendering
 */
export function useFrameSVGRenderer(
  svgRef: React.RefObject<SVGSVGElement>,
  pathString: string,
  config: {
    color?: string;
    strokeWidth?: number;
    fill?: string;
    dashArray?: string;
  } = {}
) {
  const { color = '#00ffff', strokeWidth = 2, fill = 'none', dashArray } = config;

  React.useEffect(() => {
    if (!svgRef.current) return;

    // Create or update path element
    let pathElement = svgRef.current.querySelector('path');
    if (!pathElement) {
      pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      svgRef.current.appendChild(pathElement);
    }

    pathElement.setAttribute('d', pathString);
    pathElement.setAttribute('stroke', color);
    pathElement.setAttribute('stroke-width', String(strokeWidth));
    pathElement.setAttribute('fill', fill);

    if (dashArray) {
      pathElement.setAttribute('stroke-dasharray', dashArray);
    }
  }, [pathString, color, strokeWidth, fill, dashArray]);

  return {
    render: (pathString: string) => {
      if (!svgRef.current) return;

      let pathElement = svgRef.current.querySelector('path');
      if (!pathElement) {
        pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgRef.current.appendChild(pathElement);
      }

      pathElement.setAttribute('d', pathString);
    },
  };
}

/**
 * Create clipping path element
 */
export function createClipPathElement(
  id: string,
  pathString: string
): SVGClipPathElement {
  const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
  clipPath.setAttribute('id', id);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathString);

  clipPath.appendChild(path);

  return clipPath;
}

/**
 * Apply clipping path to element
 */
export function applyClipPath(
  element: HTMLElement,
  clipPathId: string
): void {
  element.style.clipPath = `url(#${clipPathId})`;
}
