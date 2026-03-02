/**
 * Property-based tests for Theme System
 * Using fast-check for property testing
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createAppTheme } from '../../theme/creators';
import type { RHUDSTheme } from '../../theme/models';

describe('Property Tests: Theme System', () => {
  /**
   * Property 1: Theme Serialization Round-Trip
   * Validates: Requirements 1.11, 51.7, 75.5, 82.7
   * 
   * Any theme that is serialized and then deserialized should be equal to the original
   */
  it('should preserve theme data through serialization round-trip', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          colors: fc.record({
            primary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(s => `#${s}`),
            secondary: fc.hexaString({ minLength: 6, maxLength: 6 }).map(s => `#${s}`),
            accent: fc.hexaString({ minLength: 6, maxLength: 6 }).map(s => `#${s}`),
          }),
        }),
        (themeConfig) => {
          // Create theme
          const theme = createAppTheme(themeConfig);
          
          // Serialize
          const serialized = JSON.stringify(theme);
          
          // Deserialize
          const deserialized = JSON.parse(serialized);
          
          // Check equality
          expect(deserialized.name).toBe(theme.name);
          expect(deserialized.colors.primary).toBe(theme.colors.primary);
          expect(deserialized.colors.secondary).toBe(theme.colors.secondary);
          expect(deserialized.colors.accent).toBe(theme.colors.accent);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Theme name should always be a non-empty string
   */
  it('should always have a valid theme name', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (name) => {
          const theme = createAppTheme({ name });
          expect(theme.name).toBe(name);
          expect(theme.name.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Theme colors should always be valid hex colors
   */
  it('should always have valid hex colors', () => {
    fc.assert(
      fc.property(
        fc.hexaString({ minLength: 6, maxLength: 6 }),
        (hex) => {
          const color = `#${hex}`;
          const theme = createAppTheme({
            name: 'test',
            colors: { primary: color },
          });
          
          expect(theme.colors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
        }
      ),
      { numRuns: 50 }
    );
  });
});
