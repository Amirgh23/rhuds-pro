/**
 * Intro page module exports
 * Exports all types, constants, utilities, and components
 */

// Components
export { IntroPage, default } from './components/IntroPage';

// Types
export type {
  IntroPageProps,
  HeroSectionProps,
  FeatureCardProps,
  FeatureCardData,
  FeatureCardsGridProps,
  AnimatedBackgroundProps,
  NavigationProps,
  NavLink,
  AnimationConfig,
  ColorPalette,
  TypographyScale,
  TypographyStyle,
  SpacingScale,
  SpacingValues,
} from './types';

// Constants
export {
  ANIMATION_CONFIG,
  COLOR_PALETTE,
  TYPOGRAPHY_SCALE,
  SPACING_SCALE,
  BREAKPOINTS,
  MEDIA_QUERIES,
  FRAME_CONFIG,
  BACKGROUND_CONFIG,
  TOUCH_TARGET_SIZE,
  Z_INDEX,
  DEFAULT_FEATURES,
  DEFAULT_NAV_LINKS,
} from './constants';

// Animation utilities
export {
  createAnimationTimings,
  AnimationOrchestrator,
  easingFunctions,
  calculateCardDelay,
  calculateTotalAnimationDuration,
  delayExecution,
  createStaggeredSequence,
} from './utils/animation';

// Hooks
export {
  useIntersectionObserver,
  useMultipleIntersectionObservers,
  useDelayedIntersectionObserver,
} from './hooks/useIntersectionObserver';
export {
  useFrameRateMonitor,
  useMultipleFrameRateMonitors,
  usePerformanceMetrics,
  PerformanceMetricsCollector,
} from './hooks/useFrameRateMonitor';
