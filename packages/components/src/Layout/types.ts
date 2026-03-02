/**
 * Layout Components Types
 */

export interface GridProps {
  /** Number of columns */
  columns?: number | Record<string, number>;

  /** Gap between items */
  gap?: number | string;

  /** Children elements */
  children: React.ReactNode;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

export interface ContainerProps {
  /** Max width */
  maxWidth?: number | string;

  /** Padding */
  padding?: number | string;

  /** Center content */
  centered?: boolean;

  /** Children elements */
  children: React.ReactNode;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}

export interface StackProps {
  /** Stack direction */
  direction?: 'row' | 'column';

  /** Gap between items */
  gap?: number | string;

  /** Align items */
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';

  /** Justify content */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';

  /** Children elements */
  children: React.ReactNode;

  /** Custom className */
  className?: string;

  /** Custom styles */
  style?: React.CSSProperties;
}
