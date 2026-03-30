/**
 * Styled Component Types
 * Defines types for styled chart variants
 */

import type { CSSProperties, ReactNode } from 'react';
import type { BaseChartProps } from '../../react/types';

/**
 * RHUDS styled chart props
 */
export interface RHUDSChartProps extends BaseChartProps {
  /** Force RHUDS variant */
  variant?: 'r-huds';

  /** Glow intensity (0-1) */
  glowIntensity?: number;

  /** Enable neon pulse effect */
  neonPulse?: boolean;

  /** Enable light trail effect */
  lightTrail?: boolean;
}

/**
 * ColdWar styled chart props
 */
export interface ColdWarChartProps extends BaseChartProps {
  /** Force ColdWar variant */
  variant?: 'coldwar';

  /** Scanline intensity ('low' | 'medium' | 'high') */
  scanlinesIntensity?: 'low' | 'medium' | 'high';

  /** Enable radar sweep effect */
  radarSweep?: boolean;

  /** Enable phosphor burn effect */
  phosphorBurn?: boolean;
}

/**
 * Styled chart wrapper props
 */
export interface StyledChartWrapperProps {
  /** Wrapper class name */
  className?: string;

  /** Wrapper styles */
  style?: CSSProperties;

  /** Children */
  children?: ReactNode;
}
