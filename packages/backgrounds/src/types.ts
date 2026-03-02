/**
 * Background Effects System Types
 */

/**
 * Particle configuration
 */
export interface ParticleConfig {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color?: string;
  life?: number;
  maxLife?: number;
}

/**
 * Emitter configuration
 */
export interface EmitterConfig {
  x: number;
  y: number;
  rate: number; // particles per second
  speed: number;
  size: number;
  color?: string;
  direction?: number; // 0-360 degrees
  spread?: number; // spread angle
  life?: number;
}

/**
 * Dots component props
 */
export interface DotsProps {
  width: number;
  height: number;
  pattern?: 'grid' | 'random' | 'hexagonal';
  dotSize?: number;
  spacing?: number;
  color?: string;
  opacity?: number;
  animated?: boolean;
  animationSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Puffs component props
 */
export interface PuffsProps {
  width: number;
  height: number;
  particleCount?: number;
  particleSize?: number;
  color?: string;
  speed?: number;
  opacity?: number;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * GridLines component props
 */
export interface GridLinesProps {
  width: number;
  height: number;
  cellSize?: number;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
  dashArray?: string;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * MovingLines component props
 */
export interface MovingLinesProps {
  width: number;
  height: number;
  lineCount?: number;
  color?: string;
  strokeWidth?: number;
  speed?: number;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Nebula component props
 */
export interface NebulaProps {
  width: number;
  height: number;
  colors?: string[];
  scale?: number;
  speed?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * StarField component props
 */
export interface StarFieldProps {
  width: number;
  height: number;
  starCount?: number;
  speed?: number;
  parallaxFactor?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AnimatedGradient component props
 */
export interface AnimatedGradientProps {
  width: number;
  height: number;
  colors?: string[];
  angle?: number;
  speed?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Plasma component props
 */
export interface PlasmaProps {
  width: number;
  height: number;
  color1?: string;
  color2?: string;
  speed?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Background renderer props
 */
export interface BackgroundRendererProps {
  width: number;
  height: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Particle system configuration
 */
export interface ParticleSystemConfig {
  maxParticles?: number;
  gravity?: number;
  friction?: number;
  collisionEnabled?: boolean;
}
