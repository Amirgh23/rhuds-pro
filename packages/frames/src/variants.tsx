/**
 * Frame Variants
 * Pre-built frame components with different styles
 */

import React, { useMemo } from 'react';
import { FrameVariantConfig } from './types';
import { FrameSVG, useFrameSVGRenderer } from './FrameSVG';
import {
  createOctagonPath,
  createKranoxPath,
  createCornersPath,
  createLinesPath,
  createUnderlinePath,
  createNefrexPath,
  pathToString,
} from './svg';

/**
 * FrameSVGOctagon - Octagonal frame with cut corners
 */
export const FrameSVGOctagon: React.FC<FrameVariantConfig> = ({
  width,
  height,
  color = '#00ffff',
  strokeWidth = 2,
  cornerSize = 20,
  children,
  className,
  style,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  const pathString = useMemo(() => {
    const path = createOctagonPath(width, height, cornerSize);
    return pathToString(path);
  }, [width, height, cornerSize]);

  useFrameSVGRenderer(svgRef, pathString, { color, strokeWidth });

  return (
    <FrameSVG
      config={{ width, height, color, strokeWidth }}
      className={className}
      style={style}
    >
      <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      {children}
    </FrameSVG>
  );
};

/**
 * FrameSVGKranox - Kranox-style assembly frame
 */
export const FrameSVGKranox: React.FC<FrameVariantConfig> = ({
  width,
  height,
  color = '#00ffff',
  strokeWidth = 2,
  lineLength = 20,
  children,
  className,
  style,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  const pathString = useMemo(() => {
    const path = createKranoxPath(width, height, lineLength);
    return pathToString(path);
  }, [width, height, lineLength]);

  useFrameSVGRenderer(svgRef, pathString, { color, strokeWidth });

  return (
    <FrameSVG
      config={{ width, height, color, strokeWidth }}
      className={className}
      style={style}
    >
      <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      {children}
    </FrameSVG>
  );
};

/**
 * FrameSVGCorners - Corner-only frame
 */
export const FrameSVGCorners: React.FC<
  FrameVariantConfig & { position?: 'inside' | 'outside' }
> = ({
  width,
  height,
  color = '#00ffff',
  strokeWidth = 2,
  cornerSize = 20,
  position = 'outside',
  children,
  className,
  style,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  const pathString = useMemo(() => {
    const path = createCornersPath(width, height, cornerSize, position);
    return pathToString(path);
  }, [width, height, cornerSize, position]);

  useFrameSVGRenderer(svgRef, pathString, { color, strokeWidth });

  return (
    <FrameSVG
      config={{ width, height, color, strokeWidth }}
      className={className}
      style={style}
    >
      <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      {children}
    </FrameSVG>
  );
};

/**
 * FrameSVGLines - Dashed line frame
 */
export const FrameSVGLines: React.FC<FrameVariantConfig> = ({
  width,
  height,
  color = '#00ffff',
  strokeWidth = 2,
  dashArray = '5,5',
  children,
  className,
  style,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  const pathString = useMemo(() => {
    const path = createLinesPath(width, height, dashArray);
    return pathToString(path);
  }, [width, height, dashArray]);

  useFrameSVGRenderer(svgRef, pathString, { color, strokeWidth, dashArray });

  return (
    <FrameSVG
      config={{ width, height, color, strokeWidth }}
      className={className}
      style={style}
    >
      <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      {children}
    </FrameSVG>
  );
};

/**
 * FrameSVGUnderline - Underline with corner squares
 */
export const FrameSVGUnderline: React.FC<FrameVariantConfig> = ({
  width,
  height,
  color = '#00ffff',
  strokeWidth = 2,
  cornerSize = 10,
  children,
  className,
  style,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  const pathString = useMemo(() => {
    const path = createUnderlinePath(width, height, cornerSize);
    return pathToString(path);
  }, [width, height, cornerSize]);

  useFrameSVGRenderer(svgRef, pathString, { color, strokeWidth, fill: 'currentColor' });

  return (
    <FrameSVG
      config={{ width, height, color, strokeWidth }}
      className={className}
      style={style}
    >
      <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      {children}
    </FrameSVG>
  );
};

/**
 * FrameSVGNefrex - Nefrex-style assembly frame
 */
export const FrameSVGNefrex: React.FC<FrameVariantConfig> = ({
  width,
  height,
  color = '#00ffff',
  strokeWidth = 2,
  lineLength = 15,
  children,
  className,
  style,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  const pathString = useMemo(() => {
    const path = createNefrexPath(width, height, lineLength);
    return pathToString(path);
  }, [width, height, lineLength]);

  useFrameSVGRenderer(svgRef, pathString, { color, strokeWidth });

  return (
    <FrameSVG
      config={{ width, height, color, strokeWidth }}
      className={className}
      style={style}
    >
      <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      {children}
    </FrameSVG>
  );
};
