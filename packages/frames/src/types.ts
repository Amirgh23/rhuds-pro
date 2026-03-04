/**
 * Frame Rendering System Types
 */

/**
 * Frame configuration
 */
export interface FrameConfig {
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
  variant?: 'octagon' | 'kranox' | 'corners' | 'lines' | 'underline' | 'nefrex';
}

/**
 * SVG path command
 */
export type SVGCommand = 'M' | 'L' | 'H' | 'V' | 'C' | 'S' | 'Q' | 'T' | 'A' | 'Z';

/**
 * SVG path data
 */
export interface SVGPath {
  commands: Array<{
    command: SVGCommand;
    args: number[];
  }>;
}

/**
 * Clipping path configuration
 */
export interface ClipPathConfig {
  id: string;
  path: SVGPath;
}

/**
 * Frame variant configuration
 */
export interface FrameVariantConfig extends FrameConfig {
  cornerSize?: number;
  lineLength?: number;
  dashArray?: string;
  rotation?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Frame renderer props
 */
export interface FrameRendererProps {
  config: FrameConfig;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SVG frame component props
 */
export interface FrameSVGProps extends FrameRendererProps {
  responsive?: boolean;
  preserveAspectRatio?: string;
}
