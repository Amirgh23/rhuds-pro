/**
 * Animation System Types
 * Core type definitions for the RHUDS Pro animation system
 */

import { ReactNode } from 'react';

/**
 * Animation state values
 */
export type AnimatorState = 'entering' | 'entered' | 'exiting' | 'exited';

/**
 * Easing function type
 */
export type EasingFunction = (t: number) => number;

/**
 * Animation duration configuration
 */
export interface AnimationDuration {
  enter?: number;
  exit?: number;
  stagger?: number;
  delay?: number;
}

/**
 * Animation easing configuration
 */
export interface AnimationEasing {
  enter?: EasingFunction | string;
  exit?: EasingFunction | string;
}

/**
 * Animator settings for configuring animation behavior
 */
export interface AnimatorSettings {
  duration?: AnimationDuration;
  easing?: AnimationEasing;
  initialState?: 'entered' | 'exited';
  unmountOnExited?: boolean;
}

/**
 * Animation flow state with convenience flags
 */
export interface AnimatorFlow {
  value: AnimatorState;
  entering: boolean;
  entered: boolean;
  exiting: boolean;
  exited: boolean;
  transitioning: boolean;
}

/**
 * Animator control interface passed to children
 */
export interface AnimatorControl {
  flow: AnimatorFlow;
  duration: AnimationDuration;
  animate: (state: AnimatorState) => void;
}

/**
 * Animator component props
 */
export interface AnimatorProps {
  // Lifecycle control
  activate?: boolean;
  duration?: AnimationDuration;
  initialState?: 'entered' | 'exited';
  unmountOnExited?: boolean;
  
  // Animation configuration
  animator?: AnimatorSettings;
  
  // Callbacks
  onAnimateEntering?: () => void;
  onAnimateEntered?: () => void;
  onAnimateExiting?: () => void;
  onAnimateExited?: () => void;
  
  // State control
  disabled?: boolean;
  dismissed?: boolean;
  
  // Children
  children?: ReactNode | ((animator: AnimatorControl) => ReactNode);
}

/**
 * Animation configuration for createAnimation
 */
export interface AnimationConfig {
  duration: number;
  easing?: EasingFunction | string;
  delay?: number;
  onStart?: () => void;
  onComplete?: () => void;
  onUpdate?: (progress: number) => void;
}

/**
 * Animation instance returned by createAnimation
 */
export interface Animation {
  play: () => void;
  pause: () => void;
  stop: () => void;
  reverse: () => void;
  seek: (progress: number) => void;
  isPlaying: () => boolean;
  getProgress: () => number;
}

/**
 * Animator system configuration
 */
export interface AnimatorSystemConfig {
  defaultDuration?: AnimationDuration;
  defaultEasing?: AnimationEasing;
  disabled?: boolean;
}

/**
 * Stagger manager props
 */
export interface StaggerProps {
  stagger?: number | 'auto';
  direction?: 'forward' | 'reverse';
  children: ReactNode[];
}

/**
 * Sequence manager props
 */
export interface SequenceProps {
  children: ReactNode[];
  onComplete?: () => void;
}

/**
 * Switch manager props
 */
export interface SwitchProps {
  condition: boolean;
  children: [ReactNode, ReactNode];
}
