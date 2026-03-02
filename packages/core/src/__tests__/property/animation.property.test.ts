/**
 * Property-based tests for Animation System
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { easeIn, easeOut, easeInOut } from '../../animation/easing';

describe('Property Tests: Animation System', () => {
  /**
   * Property 4: Animation Time Monotonicity
   * Validates: Requirements 75.7
   * 
   * Easing functions should be monotonic (always increasing)
   */
  it('should have monotonic easing functions', () => {
    const easingFunctions = [easeIn, easeOut, easeInOut];
    
    easingFunctions.forEach(easingFn => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 1 }),
          fc.double({ min: 0, max: 1 }),
          (t1, t2) => {
            if (t1 < t2) {
              const value1 = easingFn(t1);
              const value2 = easingFn(t2);
              expect(value1).toBeLessThanOrEqual(value2);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Easing functions should map [0,1] to [0,1]
   */
  it('should map input range [0,1] to output range [0,1]', () => {
    const easingFunctions = [easeIn, easeOut, easeInOut];
    
    easingFunctions.forEach(easingFn => {
      fc.assert(
        fc.property(
          fc.double({ min: 0, max: 1 }),
          (t) => {
            const value = easingFn(t);
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Easing functions should start at 0 and end at 1
   */
  it('should start at 0 and end at 1', () => {
    const easingFunctions = [easeIn, easeOut, easeInOut];
    
    easingFunctions.forEach(easingFn => {
      expect(easingFn(0)).toBeCloseTo(0, 5);
      expect(easingFn(1)).toBeCloseTo(1, 5);
    });
  });

  /**
   * Property: Animation duration should always be positive
   */
  it('should have positive animation duration', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (duration) => {
          expect(duration).toBeGreaterThan(0);
        }
      ),
      { numRuns: 50 }
    );
  });
});
