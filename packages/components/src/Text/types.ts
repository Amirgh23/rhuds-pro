/**
 * Text Component Types
 */

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'code';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextWeight = 'light' | 'normal' | 'semibold' | 'bold';
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export interface TextProps {
  /** Text content */
  children: React.ReactNode;

  /** Text variant/style */
  variant?: TextVariant;

  /** Text alignment */
  align?: TextAlign;

  /** Font weight */
  weight?: TextWeight;

  /** Text color */
  color?: string;

  /** Text size in pixels */
  size?: number;

  /** Line height multiplier */
  lineHeight?: number;

  /** Letter spacing in pixels */
  letterSpacing?: number;

  /** Text transform */
  transform?: TextTransform;

  /** Enable animation */
  animated?: boolean;

  /** Animation speed */
  animationSpeed?: number;

  /** Truncate text with ellipsis */
  truncate?: boolean;

  /** Max lines before truncation */
  maxLines?: number;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;

  /** HTML element to render as */
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
