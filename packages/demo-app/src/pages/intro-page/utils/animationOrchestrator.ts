/**
 * Animation Orchestration Utilities
 * Manages timing and sequencing of frame animations across the intro page
 */

export interface AnimationTimings {
  backgroundStart: number;
  heroStart: number;
  heroDelay: number;
  featureCardsStart: number;
  featureCardsStaggerInterval: number;
  totalDuration: number;
}

/**
 * Default animation timings for intro page
 * All times in milliseconds
 */
export const DEFAULT_ANIMATION_TIMINGS: AnimationTimings = {
  backgroundStart: 0, // Background starts immediately
  heroStart: 200, // Hero frame starts after 200ms
  heroDelay: 200,
  featureCardsStart: 1700, // Feature cards start after 1700ms
  featureCardsStaggerInterval: 150, // 150ms between each card
  totalDuration: 3000, // Total sequence completes within 3000ms
};

/**
 * Calculate animation delay for a specific feature card
 * @param cardIndex - Zero-based index of the card
 * @param timings - Animation timings configuration
 * @returns Delay in milliseconds
 */
export const getFeatureCardDelay = (
  cardIndex: number,
  timings: AnimationTimings = DEFAULT_ANIMATION_TIMINGS
): number => {
  return timings.featureCardsStart + cardIndex * timings.featureCardsStaggerInterval;
};

/**
 * Calculate animation delay for hero section
 * @param timings - Animation timings configuration
 * @returns Delay in milliseconds
 */
export const getHeroDelay = (timings: AnimationTimings = DEFAULT_ANIMATION_TIMINGS): number => {
  return timings.heroStart;
};

/**
 * Calculate animation delay for background
 * @param timings - Animation timings configuration
 * @returns Delay in milliseconds
 */
export const getBackgroundDelay = (
  timings: AnimationTimings = DEFAULT_ANIMATION_TIMINGS
): number => {
  return timings.backgroundStart;
};

/**
 * Validate animation timings to ensure they're within acceptable ranges
 * @param timings - Animation timings to validate
 * @returns Validation result with any errors
 */
export const validateAnimationTimings = (
  timings: AnimationTimings
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (timings.heroDelay < 0 || timings.heroDelay > 500) {
    errors.push('Hero delay should be between 0ms and 500ms');
  }

  if (timings.featureCardsStart < timings.heroStart) {
    errors.push('Feature cards start time should be after hero start time');
  }

  if (timings.featureCardsStaggerInterval < 50 || timings.featureCardsStaggerInterval > 300) {
    errors.push('Feature cards stagger interval should be between 50ms and 300ms');
  }

  if (timings.totalDuration < 2000 || timings.totalDuration > 5000) {
    errors.push('Total animation duration should be between 2000ms and 5000ms');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Create a custom animation timings configuration
 * @param overrides - Partial timings to override defaults
 * @returns Complete animation timings configuration
 */
export const createAnimationTimings = (
  overrides: Partial<AnimationTimings> = {}
): AnimationTimings => {
  const timings = { ...DEFAULT_ANIMATION_TIMINGS, ...overrides };
  const validation = validateAnimationTimings(timings);

  if (!validation.valid) {
    console.warn('Invalid animation timings:', validation.errors);
  }

  return timings;
};

/**
 * Get animation sequence information for debugging/monitoring
 * @param cardCount - Number of feature cards
 * @param timings - Animation timings configuration
 * @returns Sequence information
 */
export const getAnimationSequenceInfo = (
  cardCount: number,
  timings: AnimationTimings = DEFAULT_ANIMATION_TIMINGS
): {
  backgroundStart: number;
  heroStart: number;
  heroEnd: number;
  featureCardsStart: number;
  featureCardsEnd: number;
  totalDuration: number;
} => {
  const heroEnd = timings.heroStart + 1500; // Assuming hero animation is ~1500ms
  const featureCardsEnd =
    timings.featureCardsStart + (cardCount - 1) * timings.featureCardsStaggerInterval + 1500;

  return {
    backgroundStart: timings.backgroundStart,
    heroStart: timings.heroStart,
    heroEnd,
    featureCardsStart: timings.featureCardsStart,
    featureCardsEnd,
    totalDuration: Math.max(heroEnd, featureCardsEnd),
  };
};
