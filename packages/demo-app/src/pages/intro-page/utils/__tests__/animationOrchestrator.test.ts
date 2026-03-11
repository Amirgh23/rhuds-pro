import {
  DEFAULT_ANIMATION_TIMINGS,
  getFeatureCardDelay,
  getHeroDelay,
  getBackgroundDelay,
  validateAnimationTimings,
  createAnimationTimings,
  getAnimationSequenceInfo,
} from '../animationOrchestrator';

describe('Animation Orchestrator', () => {
  describe('DEFAULT_ANIMATION_TIMINGS', () => {
    test('has correct default values', () => {
      expect(DEFAULT_ANIMATION_TIMINGS.backgroundStart).toBe(0);
      expect(DEFAULT_ANIMATION_TIMINGS.heroStart).toBe(200);
      expect(DEFAULT_ANIMATION_TIMINGS.heroDelay).toBe(200);
      expect(DEFAULT_ANIMATION_TIMINGS.featureCardsStart).toBe(1700);
      expect(DEFAULT_ANIMATION_TIMINGS.featureCardsStaggerInterval).toBe(150);
      expect(DEFAULT_ANIMATION_TIMINGS.totalDuration).toBe(3000);
    });
  });

  describe('getFeatureCardDelay', () => {
    test('returns correct delay for first card', () => {
      const delay = getFeatureCardDelay(0);
      expect(delay).toBe(1700);
    });

    test('returns correct delay for second card', () => {
      const delay = getFeatureCardDelay(1);
      expect(delay).toBe(1850);
    });

    test('returns correct delay for third card', () => {
      const delay = getFeatureCardDelay(2);
      expect(delay).toBe(2000);
    });

    test('respects custom timings', () => {
      const customTimings = {
        ...DEFAULT_ANIMATION_TIMINGS,
        featureCardsStart: 2000,
        featureCardsStaggerInterval: 200,
      };
      const delay = getFeatureCardDelay(1, customTimings);
      expect(delay).toBe(2200);
    });
  });

  describe('getHeroDelay', () => {
    test('returns correct hero delay', () => {
      const delay = getHeroDelay();
      expect(delay).toBe(200);
    });

    test('respects custom timings', () => {
      const customTimings = {
        ...DEFAULT_ANIMATION_TIMINGS,
        heroStart: 300,
      };
      const delay = getHeroDelay(customTimings);
      expect(delay).toBe(300);
    });
  });

  describe('getBackgroundDelay', () => {
    test('returns correct background delay', () => {
      const delay = getBackgroundDelay();
      expect(delay).toBe(0);
    });

    test('respects custom timings', () => {
      const customTimings = {
        ...DEFAULT_ANIMATION_TIMINGS,
        backgroundStart: 100,
      };
      const delay = getBackgroundDelay(customTimings);
      expect(delay).toBe(100);
    });
  });

  describe('validateAnimationTimings', () => {
    test('validates correct timings', () => {
      const result = validateAnimationTimings(DEFAULT_ANIMATION_TIMINGS);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('detects invalid hero delay', () => {
      const invalidTimings = {
        ...DEFAULT_ANIMATION_TIMINGS,
        heroDelay: 600,
      };
      const result = validateAnimationTimings(invalidTimings);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('detects feature cards start before hero', () => {
      const invalidTimings = {
        ...DEFAULT_ANIMATION_TIMINGS,
        featureCardsStart: 100,
      };
      const result = validateAnimationTimings(invalidTimings);
      expect(result.valid).toBe(false);
    });

    test('detects invalid stagger interval', () => {
      const invalidTimings = {
        ...DEFAULT_ANIMATION_TIMINGS,
        featureCardsStaggerInterval: 400,
      };
      const result = validateAnimationTimings(invalidTimings);
      expect(result.valid).toBe(false);
    });

    test('detects invalid total duration', () => {
      const invalidTimings = {
        ...DEFAULT_ANIMATION_TIMINGS,
        totalDuration: 1000,
      };
      const result = validateAnimationTimings(invalidTimings);
      expect(result.valid).toBe(false);
    });
  });

  describe('createAnimationTimings', () => {
    test('creates timings with defaults', () => {
      const timings = createAnimationTimings();
      expect(timings).toEqual(DEFAULT_ANIMATION_TIMINGS);
    });

    test('creates timings with overrides', () => {
      const timings = createAnimationTimings({
        heroDelay: 300,
        featureCardsStaggerInterval: 200,
      });
      expect(timings.heroDelay).toBe(300);
      expect(timings.featureCardsStaggerInterval).toBe(200);
      expect(timings.backgroundStart).toBe(0);
    });

    test('validates created timings', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const timings = createAnimationTimings({
        totalDuration: 1000,
      });
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getAnimationSequenceInfo', () => {
    test('returns correct sequence info for 3 cards', () => {
      const info = getAnimationSequenceInfo(3);
      expect(info.backgroundStart).toBe(0);
      expect(info.heroStart).toBe(200);
      expect(info.featureCardsStart).toBe(1700);
      expect(info.featureCardsEnd).toBe(3200);
    });

    test('returns correct sequence info for 1 card', () => {
      const info = getAnimationSequenceInfo(1);
      expect(info.featureCardsEnd).toBe(3200);
    });

    test('returns correct sequence info for 5 cards', () => {
      const info = getAnimationSequenceInfo(5);
      expect(info.featureCardsEnd).toBe(3800);
    });

    test('respects custom timings', () => {
      const customTimings = {
        ...DEFAULT_ANIMATION_TIMINGS,
        featureCardsStart: 2000,
        featureCardsStaggerInterval: 200,
      };
      const info = getAnimationSequenceInfo(3, customTimings);
      expect(info.featureCardsStart).toBe(2000);
      expect(info.featureCardsEnd).toBe(3900);
    });

    test('total duration is maximum of all animations', () => {
      const info = getAnimationSequenceInfo(3);
      expect(info.totalDuration).toBe(Math.max(info.heroEnd, info.featureCardsEnd));
    });
  });

  describe('Animation Timing Constraints', () => {
    test('hero delay is within acceptable range', () => {
      expect(DEFAULT_ANIMATION_TIMINGS.heroDelay).toBeGreaterThanOrEqual(0);
      expect(DEFAULT_ANIMATION_TIMINGS.heroDelay).toBeLessThanOrEqual(500);
    });

    test('feature cards start after hero', () => {
      expect(DEFAULT_ANIMATION_TIMINGS.featureCardsStart).toBeGreaterThan(
        DEFAULT_ANIMATION_TIMINGS.heroStart
      );
    });

    test('stagger interval is within acceptable range', () => {
      expect(DEFAULT_ANIMATION_TIMINGS.featureCardsStaggerInterval).toBeGreaterThanOrEqual(50);
      expect(DEFAULT_ANIMATION_TIMINGS.featureCardsStaggerInterval).toBeLessThanOrEqual(300);
    });

    test('total duration is within acceptable range', () => {
      expect(DEFAULT_ANIMATION_TIMINGS.totalDuration).toBeGreaterThanOrEqual(2000);
      expect(DEFAULT_ANIMATION_TIMINGS.totalDuration).toBeLessThanOrEqual(5000);
    });
  });
});
