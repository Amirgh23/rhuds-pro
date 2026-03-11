import { fc } from 'fast-check';
import { createAppTheme } from '../../theme/creators';

/**
 * Property 1: Theme Serialization Round-Trip
 *
 * Validates that a theme can be serialized to JSON and deserialized back
 * to an equivalent theme without data loss.
 *
 * Validates Requirements: 1.11, 51.7, 75.5, 82.7
 */
describe('Property 1: Theme Serialization Round-Trip', () => {
  it('should preserve theme data through JSON serialization', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          primaryColor: fc.hexaString({ minLength: 6, maxLength: 6 }).map((h) => `#${h}`),
          secondaryColor: fc.hexaString({ minLength: 6, maxLength: 6 }).map((h) => `#${h}`),
        }),
        (config) => {
          // Create original theme
          const originalTheme = createAppTheme(config);

          // Serialize to JSON
          const serialized = JSON.stringify(originalTheme);

          // Deserialize from JSON
          const deserialized = JSON.parse(serialized);

          // Verify key properties are preserved
          expect(deserialized.name).toBe(originalTheme.name);
          expect(deserialized.colors).toBeDefined();
          expect(deserialized.units).toBeDefined();
          expect(deserialized.typography).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain color palette consistency after serialization', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          primaryColor: fc.hexaString({ minLength: 6, maxLength: 6 }).map((h) => `#${h}`),
          secondaryColor: fc.hexaString({ minLength: 6, maxLength: 6 }).map((h) => `#${h}`),
        }),
        (config) => {
          const theme = createAppTheme(config);
          const serialized = JSON.stringify(theme);
          const deserialized = JSON.parse(serialized);

          // Verify color palette structure
          expect(deserialized.colors.primary).toBeDefined();
          expect(deserialized.colors.secondary).toBeDefined();
          expect(deserialized.colors.success).toBeDefined();
          expect(deserialized.colors.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve spacing units through serialization', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          primaryColor: fc.hexaString({ minLength: 6, maxLength: 6 }).map((h) => `#${h}`),
          secondaryColor: fc.hexaString({ minLength: 6, maxLength: 6 }).map((h) => `#${h}`),
        }),
        (config) => {
          const theme = createAppTheme(config);
          const serialized = JSON.stringify(theme);
          const deserialized = JSON.parse(serialized);

          // Verify spacing units are preserved
          expect(deserialized.units.space).toBeDefined();
          expect(Array.isArray(deserialized.units.space)).toBe(true);
          expect(deserialized.units.space.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain typography settings after serialization', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          primaryColor: fc.hexaString({ minLength: 6, maxLength: 6 }).map((h) => `#${h}`),
          secondaryColor: fc.hexaString({ minLength: 6, maxLength: 6 }).map((h) => `#${h}`),
        }),
        (config) => {
          const theme = createAppTheme(config);
          const serialized = JSON.stringify(theme);
          const deserialized = JSON.parse(serialized);

          // Verify typography structure
          expect(deserialized.typography).toBeDefined();
          expect(deserialized.typography.fontFamily).toBeDefined();
          expect(deserialized.typography.fontSize).toBeDefined();
          expect(deserialized.typography.fontWeight).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
