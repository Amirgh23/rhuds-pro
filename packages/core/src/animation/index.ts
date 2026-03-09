/**
 * Animation System
 * Core animation system for RHUDS Pro
 */

// Easing functions
export * from './easing';

// Core functions
export {
  createAnimatorSystem,
  getAnimatorSystemConfig,
  isAnimatorSystemInitialized,
  resetAnimatorSystem,
  updateAnimatorSystemConfig,
} from './createAnimatorSystem';

export { createAnimation } from './createAnimation';

// Animation managers
export { Stagger } from './managers/Stagger';
export { Sequence } from './managers/Sequence';

// Context and hooks
export {
  AnimatorProvider,
  useParentAnimator,
  useAnimatorDepth,
  useParentActivation,
} from './AnimatorContext';

// Global provider
export { AnimatorGeneralProvider, useAnimatorGeneral } from './AnimatorGeneralProvider';

// Physics-based animations
export {
  createSpringEasing,
  createDecayEasing,
  createInertiaEasing,
  springPresets,
} from './physics';
export type { SpringConfig, DecayConfig, InertiaConfig } from './physics';

// Gesture-driven animations
export { useDrag, useSwipe, usePinch, useRotate } from './gestures';
export type { DragConfig, SwipeConfig, PinchConfig, RotateConfig } from './gestures';

// Animation subsystems
export {
  SubsystemManager,
  createFadeSubsystem,
  createScaleSubsystem,
  createSlideSubsystem,
  createRotateSubsystem,
  createBlurSubsystem,
} from './subsystems';
export type { AnimationSubsystem } from './subsystems';
