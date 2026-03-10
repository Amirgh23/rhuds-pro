/**
 * Animation System Types
 * Core type definitions for the RHUDS Pro animation system
 */

/**
 * Easing function type
 */
export type EasingFunction = (t: number) => number;

/**
 * Animation state
 */
export type AnimationState = 'idle' | 'running' | 'paused' | 'completed';

/**
 * Animator control interface
 */
export interface AnimatorControl {
  flow: {
    entered: boolean;
    entering: boolean;
  };
}

/**
 * Animator state
 */
export interface AnimatorState {
  entered: boolean;
  entering: boolean;
  exiting: boolean;
  exited: boolean;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string | EasingFunction;
  loop?: boolean | number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fill?: 'none' | 'forwards' | 'backwards' | 'both';
}

/**
 * Animation instance
 */
export interface Animation {
  id: string;
  config: AnimationConfig;
  state: AnimationState;
  progress: number;
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (time: number) => void;
  getProgress: () => number;
  getDuration: () => number;
  getCurrentTime: () => number;
}

/**
 * Animator system configuration
 */
export interface AnimatorSystemConfig {
  autoStart?: boolean;
  defaultEasing?: string | EasingFunction;
  defaultDuration?: number;
}

/**
 * Animation manager interface
 */
export interface AnimationManager {
  createAnimation: (id: string, config: AnimationConfig) => Animation;
  getAnimation: (id: string) => Animation | undefined;
  removeAnimation: (id: string) => void;
  playAll: () => void;
  pauseAll: () => void;
  stopAll: () => void;
  getAnimations: () => Animation[];
}
