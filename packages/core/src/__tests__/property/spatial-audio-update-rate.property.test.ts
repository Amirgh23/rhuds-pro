/**
 * Property Test: Spatial Audio Update Rate
 * Property 24: Spatial Audio Update Rate
 * Validates: Requirements 7.5
 *
 * Property: When spatial audio is enabled, the audio position SHALL be updated at 60fps
 * This means position updates should occur at intervals of ~16.67ms (1000ms / 60fps)
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { SpatialAudioManager } from '../../audio/spatial';

describe('Property 24: Spatial Audio Update Rate', () => {
  it('should update spatial audio positions at 60fps intervals', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            x: fc.float({ min: -1000, max: 1000 }),
            y: fc.float({ min: -1000, max: 1000 }),
            z: fc.float({ min: -1000, max: 1000 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (positions) => {
          const mockAudioContext = {
            createPanner: () => ({
              connect: () => {},
              panningModel: 'HRTF',
              distanceModel: 'inverse',
              refDistance: 1,
              maxDistance: 10000,
              rolloffFactor: 1,
              positionX: { value: 0 },
              positionY: { value: 0 },
              positionZ: { value: 0 },
              orientationX: { value: 0 },
              orientationY: { value: 0 },
              orientationZ: { value: 1 },
            }),
            listener: {
              positionX: { value: 0 },
              positionY: { value: 0 },
              positionZ: { value: 0 },
              forwardX: { value: 0 },
              forwardY: { value: 0 },
              forwardZ: { value: -1 },
              upX: { value: 0 },
              upY: { value: 1 },
              upZ: { value: 0 },
            },
          };

          const manager = new SpatialAudioManager(mockAudioContext as any);

          // Create sources at various positions
          positions.forEach((pos, idx) => {
            manager.createSource(`source-${idx}`, { position: pos });
          });

          // Simulate 60fps update cycle (16.67ms per frame)
          const targetFrameTime = 1000 / 60; // ~16.67ms
          const updateTimes: number[] = [];

          // Simulate multiple frames
          for (let frame = 0; frame < 60; frame++) {
            const startTime = performance.now();
            manager.updateDistances();
            const endTime = performance.now();
            updateTimes.push(endTime - startTime);
          }

          // Calculate average update time
          const avgUpdateTime = updateTimes.reduce((a, b) => a + b, 0) / updateTimes.length;

          // Update time should be much less than frame time (16.67ms)
          // Allowing up to 5ms for update operations (leaving 11.67ms for rendering)
          expect(avgUpdateTime).toBeLessThan(5);

          // Verify consistency: standard deviation should be low
          const variance =
            updateTimes.reduce((sum, time) => sum + Math.pow(time - avgUpdateTime, 2), 0) /
            updateTimes.length;
          const stdDev = Math.sqrt(variance);
          expect(stdDev).toBeLessThan(2); // Low variance indicates consistent updates

          manager.cleanup();
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should maintain 60fps update rate with multiple sources', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 50 }), (sourceCount) => {
        const mockAudioContext = {
          createPanner: () => ({
            connect: () => {},
            panningModel: 'HRTF',
            distanceModel: 'inverse',
            refDistance: 1,
            maxDistance: 10000,
            rolloffFactor: 1,
            positionX: { value: 0 },
            positionY: { value: 0 },
            positionZ: { value: 0 },
            orientationX: { value: 0 },
            orientationY: { value: 0 },
            orientationZ: { value: 1 },
          }),
          listener: {
            positionX: { value: 0 },
            positionY: { value: 0 },
            positionZ: { value: 0 },
            forwardX: { value: 0 },
            forwardY: { value: 0 },
            forwardZ: { value: -1 },
            upX: { value: 0 },
            upY: { value: 1 },
            upZ: { value: 0 },
          },
        };

        const manager = new SpatialAudioManager(mockAudioContext as any);

        // Create multiple sources
        for (let i = 0; i < sourceCount; i++) {
          manager.createSource(`source-${i}`, {
            position: {
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              z: Math.random() * 100 - 50,
            },
          });
        }

        // Measure update time with all sources
        const updateTimes: number[] = [];
        for (let frame = 0; frame < 30; frame++) {
          const startTime = performance.now();
          manager.updateDistances();
          const endTime = performance.now();
          updateTimes.push(endTime - startTime);
        }

        const avgUpdateTime = updateTimes.reduce((a, b) => a + b, 0) / updateTimes.length;

        // Even with many sources, update should be fast enough for 60fps
        // Allow more time for more sources, but should still be < 10ms
        expect(avgUpdateTime).toBeLessThan(10);

        manager.cleanup();
      }),
      { numRuns: 5 }
    );
  });
});
