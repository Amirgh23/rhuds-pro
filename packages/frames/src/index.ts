/**
 * Frame Rendering System
 * SVG-based frame components for futuristic UI borders
 */

// Types
export * from './types';

// SVG utilities
export {
  SVGPathBuilder,
  createOctagonPath,
  createKranoxPath,
  createCornersPath,
  createLinesPath,
  createUnderlinePath,
  createNefrexPath,
  pathToString,
  combinePaths,
} from './svg';

// Base component
export { FrameSVG, useFrameSVGRenderer, createClipPathElement, applyClipPath } from './FrameSVG';

// Frame variants
export {
  FrameSVGOctagon,
  FrameSVGKranox,
  FrameSVGCorners,
  FrameSVGLines,
  FrameSVGUnderline,
  FrameSVGNefrex,
} from './variants';
