/**
 * Icon Component Types
 */

export interface IconProps {
  /** Icon name or SVG path */
  name?: string;

  /** SVG content */
  svg?: string;

  /** Icon size in pixels */
  size?: number;

  /** Icon color */
  color?: string;

  /** Rotate icon */
  rotate?: number;

  /** Flip icon */
  flip?: 'horizontal' | 'vertical' | 'both';

  /** Animate icon */
  animated?: boolean;

  /** Animation speed */
  animationSpeed?: number;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}
