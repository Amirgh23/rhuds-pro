/**
 * @rhuds/frames - Arwes-style Frame Components
 */

// Core
export { renderFrameSVGPaths } from './core/svgRenderer';
export type { FrameSVGPathGeneric, PathDefinition, PathCommand, PathValue } from './core/svgRenderer';

export {
  calculateOctagonPaths,
  calculateKranoxPaths,
  calculateCornersPaths,
  calculateLinesPaths,
  calculateUnderlinePaths,
  calculateNefrexPaths,
} from './core/pathCalculator';

export type {
  OctagonPathOptions,
  KranoxPathOptions,
  CornersPathOptions,
  LinesPathOptions,
  UnderlinePathOptions,
  NefrexPathOptions,
} from './core/pathCalculator';

// Hooks
export { useFrameSVGRenderer, useFrameSVGAssemblingAnimation } from './hooks';
export type { SVGRenderCallback, FrameAssemblingAnimationResult } from './hooks';

// Components
export {
  FrameSVG,
  FrameSVGOctagon,
  FrameSVGKranox,
  FrameSVGCorners,
  FrameSVGLines,
  FrameSVGUnderline,
  FrameSVGNefrex,
} from './components';

export type {
  FrameSVGProps,
  FrameSVGOctagonProps,
  FrameSVGKranoxProps,
  FrameSVGCornersProps,
  FrameSVGLinesProps,
  FrameSVGUnderlineProps,
  FrameSVGNefrexProps,
} from './components';

// ClipPath utilities (for direct CSS usage)
export { createFrameOctagonClip, createFrameKranoxClip } from './clipPaths';
export type { FrameOctagonClipOptions, FrameKranoxClipOptions } from './clipPaths';

// HUD Frame (legacy/additional)
export { HudFrame, HudFrameWithControls } from './HudFrame';
export type { HudFrameProps, HudFrameWithControlsProps } from './HudFrame';
