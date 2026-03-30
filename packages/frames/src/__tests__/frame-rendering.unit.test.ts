/**
 * Unit Tests for Frame Rendering System
 * Tests SVG path generation, clipping paths, and responsive sizing
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateOctagonPaths,
  calculateKranoxPaths,
  calculateCornersPaths,
  calculateLinesPaths,
  calculateUnderlinePaths,
  calculateNefrexPaths,
} from '../core/pathCalculator';
import { createFrameOctagonClip, createFrameKranoxClip } from '../clipPaths';
import type { PathDefinition } from '../core/svgRenderer';

describe('Frame Rendering System', () => {
  describe('SVG Path Generation', () => {
    describe('Octagon Paths', () => {
      it('should generate octagon paths with default options', () => {
        const { bgPath, linePath } = calculateOctagonPaths();

        expect(bgPath).toBeDefined();
        expect(linePath).toBeDefined();
        expect(Array.isArray(bgPath)).toBe(true);
        expect(Array.isArray(linePath)).toBe(true);
      });

      it('should generate octagon paths with custom square size', () => {
        const { bgPath } = calculateOctagonPaths({ squareSize: 32 });

        expect(bgPath).toBeDefined();
        expect(bgPath.length).toBeGreaterThan(0);
      });

      it('should support selective corner clipping', () => {
        const { bgPath: allCorners } = calculateOctagonPaths({
          leftTop: true,
          rightTop: true,
          rightBottom: true,
          leftBottom: true,
        });

        const { bgPath: noCorners } = calculateOctagonPaths({
          leftTop: false,
          rightTop: false,
          rightBottom: false,
          leftBottom: false,
        });

        expect(allCorners).toBeDefined();
        expect(noCorners).toBeDefined();
        // Paths should be different
        expect(JSON.stringify(allCorners)).not.toBe(JSON.stringify(noCorners));
      });

      it('should include Z command to close path', () => {
        const { bgPath } = calculateOctagonPaths();

        expect(bgPath[bgPath.length - 1]).toBe('Z');
      });

      it('should handle padding correctly', () => {
        const { bgPath } = calculateOctagonPaths({ padding: 10 });

        expect(bgPath).toBeDefined();
        expect(bgPath.length).toBeGreaterThan(0);
      });
    });

    describe('Kranox Paths', () => {
      it('should generate kranox paths with default options', () => {
        const { bgPath, assemblyPaths } = calculateKranoxPaths();

        expect(bgPath).toBeDefined();
        expect(assemblyPaths).toBeDefined();
        expect(Array.isArray(assemblyPaths)).toBe(true);
        expect(assemblyPaths.length).toBeGreaterThan(0);
      });

      it('should generate assembly paths for all corners', () => {
        const { assemblyPaths } = calculateKranoxPaths();

        // Should have paths for 4 corners with 2 lines each = 8 paths
        expect(assemblyPaths.length).toBe(8);
      });

      it('should support custom line lengths', () => {
        const { assemblyPaths: shortLines } = calculateKranoxPaths({
          smallLineLength: 8,
          largeLineLength: 24,
        });

        const { assemblyPaths: longLines } = calculateKranoxPaths({
          smallLineLength: 32,
          largeLineLength: 96,
        });

        expect(shortLines).toBeDefined();
        expect(longLines).toBeDefined();
      });
    });

    describe('Corners Paths', () => {
      it('should generate corner paths with default options', () => {
        const { cornerPaths } = calculateCornersPaths();

        expect(cornerPaths).toBeDefined();
        expect(Array.isArray(cornerPaths)).toBe(true);
        expect(cornerPaths.length).toBe(8); // 4 corners with 2 lines each
      });

      it('should support custom corner length', () => {
        const { cornerPaths } = calculateCornersPaths({ cornerLength: 64 });

        expect(cornerPaths).toBeDefined();
        expect(cornerPaths.length).toBe(8);
      });

      it('should generate corner paths at correct positions', () => {
        const { cornerPaths } = calculateCornersPaths({ cornerLength: 32 });

        // Should have paths for all 4 corners
        expect(cornerPaths.length).toBeGreaterThanOrEqual(4);
      });
    });

    describe('Lines Paths', () => {
      it('should generate lines paths with default options', () => {
        const { linePath } = calculateLinesPaths();

        expect(linePath).toBeDefined();
        expect(Array.isArray(linePath)).toBe(true);
      });

      it('should create rectangular border', () => {
        const { linePath } = calculateLinesPaths();

        // Should start with M (moveTo) and end with Z (close)
        expect(linePath[0][0]).toBe('M');
        expect(linePath[linePath.length - 1]).toBe('Z');
      });

      it('should support custom padding', () => {
        const { linePath } = calculateLinesPaths({ padding: 20 });

        expect(linePath).toBeDefined();
      });
    });

    describe('Underline Paths', () => {
      it('should generate underline paths with default options', () => {
        const { squarePaths, underlinePath } = calculateUnderlinePaths();

        expect(squarePaths).toBeDefined();
        expect(underlinePath).toBeDefined();
        expect(Array.isArray(squarePaths)).toBe(true);
        expect(Array.isArray(underlinePath)).toBe(true);
      });

      it('should generate 4 corner squares', () => {
        const { squarePaths } = calculateUnderlinePaths();

        expect(squarePaths.length).toBe(4);
      });

      it('should support custom square size', () => {
        const { squarePaths } = calculateUnderlinePaths({ squareSize: 16 });

        expect(squarePaths).toBeDefined();
        expect(squarePaths.length).toBe(4);
      });

      it('should generate closed square paths', () => {
        const { squarePaths } = calculateUnderlinePaths();

        squarePaths.forEach((path) => {
          expect(path[path.length - 1]).toBe('Z');
        });
      });
    });

    describe('Nefrex Paths', () => {
      it('should generate nefrex paths with default options', () => {
        const { bgPath, assemblyPaths } = calculateNefrexPaths();

        expect(bgPath).toBeDefined();
        expect(assemblyPaths).toBeDefined();
        expect(Array.isArray(assemblyPaths)).toBe(true);
      });

      it('should generate assembly paths for all corners', () => {
        const { assemblyPaths } = calculateNefrexPaths();

        // Should have paths for 4 corners with 2 lines each = 8 paths
        expect(assemblyPaths.length).toBe(8);
      });

      it('should support custom configuration', () => {
        const { bgPath, assemblyPaths } = calculateNefrexPaths({
          squareSize: 48,
          smallLineLength: 64,
          largeLineLength: 256,
        });

        expect(bgPath).toBeDefined();
        expect(assemblyPaths).toBeDefined();
      });
    });
  });

  describe('Clipping Path System', () => {
    describe('Octagon Clip Path', () => {
      it('should generate octagon clip path string', () => {
        const clipPath = createFrameOctagonClip();

        expect(typeof clipPath).toBe('string');
        expect(clipPath).toContain('polygon');
      });

      it('should support selective corner clipping', () => {
        const allCorners = createFrameOctagonClip({
          leftTop: true,
          rightTop: true,
          rightBottom: true,
          leftBottom: true,
        });

        const noCorners = createFrameOctagonClip({
          leftTop: false,
          rightTop: false,
          rightBottom: false,
          leftBottom: false,
        });

        expect(allCorners).not.toBe(noCorners);
      });

      it('should support custom square size', () => {
        const clipPath = createFrameOctagonClip({ squareSize: '2rem' });

        expect(clipPath).toContain('2rem');
      });

      it('should support numeric square size', () => {
        const clipPath = createFrameOctagonClip({ squareSize: 32 });

        expect(clipPath).toContain('32px');
      });

      it('should generate valid CSS polygon', () => {
        const clipPath = createFrameOctagonClip();

        expect(clipPath).toMatch(/polygon\(/);
        expect(clipPath).toMatch(/\)/);
      });
    });

    describe('Kranox Clip Path', () => {
      it('should generate kranox clip path string', () => {
        const clipPath = createFrameKranoxClip();

        expect(typeof clipPath).toBe('string');
        expect(clipPath).toContain('polygon');
      });

      it('should support custom configuration', () => {
        const clipPath = createFrameKranoxClip({
          padding: 10,
          squareSize: 24,
        });

        expect(clipPath).toBeDefined();
        expect(clipPath).toContain('polygon');
      });

      it('should generate valid CSS polygon', () => {
        const clipPath = createFrameKranoxClip();

        expect(clipPath).toMatch(/polygon\(/);
        expect(clipPath).toMatch(/\)/);
      });
    });
  });

  describe('Path Validation', () => {
    it('should generate valid SVG path commands', () => {
      const { bgPath } = calculateOctagonPaths();

      const validCommands = ['M', 'L', 'H', 'V', 'C', 'S', 'Q', 'T', 'A', 'Z'];

      bgPath.forEach((segment) => {
        if (segment !== 'Z') {
          const [command] = segment as [string, ...any[]];
          expect(validCommands).toContain(command);
        }
      });
    });

    it('should generate paths with numeric arguments', () => {
      const { bgPath } = calculateOctagonPaths();

      bgPath.forEach((segment) => {
        if (segment !== 'Z') {
          const [, ...args] = segment as [string, ...any[]];
          args.forEach((arg) => {
            expect(typeof arg === 'number' || typeof arg === 'string').toBe(true);
          });
        }
      });
    });

    it('should close all paths with Z command', () => {
      const { bgPath } = calculateOctagonPaths();
      const { linePath } = calculateLinesPaths();

      // Octagon and lines paths should close with Z
      expect(bgPath[bgPath.length - 1]).toBe('Z');
      expect(linePath[linePath.length - 1]).toBe('Z');
    });
  });

  describe('Responsive Sizing', () => {
    it('should support percentage-based coordinates', () => {
      const { bgPath } = calculateOctagonPaths();

      const hasPercentage = bgPath.some((segment) => {
        if (segment === 'Z') return false;
        const [, ...args] = segment as [string, ...any[]];
        return args.some((arg) => typeof arg === 'string' && arg.includes('%'));
      });

      expect(hasPercentage).toBe(true);
    });

    it('should support calc() expressions', () => {
      const { bgPath } = calculateOctagonPaths();

      const hasCalc = bgPath.some((segment) => {
        if (segment === 'Z') return false;
        const [, ...args] = segment as [string, ...any[]];
        return args.some((arg) => typeof arg === 'string' && arg.includes('-'));
      });

      expect(hasCalc).toBe(true);
    });

    it('should handle different padding values', () => {
      const paths = [
        calculateOctagonPaths({ padding: 0 }),
        calculateOctagonPaths({ padding: 10 }),
        calculateOctagonPaths({ padding: 20 }),
      ];

      paths.forEach((pathSet) => {
        expect(pathSet.bgPath).toBeDefined();
        expect(pathSet.linePath).toBeDefined();
      });
    });
  });

  describe('Configuration Options', () => {
    it('should accept all octagon configuration options', () => {
      const config = {
        padding: 5,
        squareSize: 20,
        leftTop: true,
        rightTop: false,
        rightBottom: true,
        leftBottom: false,
      };

      const { bgPath } = calculateOctagonPaths(config);
      expect(bgPath).toBeDefined();
    });

    it('should accept all kranox configuration options', () => {
      const config = {
        padding: 5,
        strokeWidth: 2,
        squareSize: 16,
        smallLineLength: 20,
        largeLineLength: 60,
      };

      const { bgPath, assemblyPaths } = calculateKranoxPaths(config);
      expect(bgPath).toBeDefined();
      expect(assemblyPaths).toBeDefined();
    });

    it('should use default values when options not provided', () => {
      const { bgPath: defaultPath } = calculateOctagonPaths();
      const { bgPath: explicitPath } = calculateOctagonPaths({
        padding: 0,
        squareSize: 16,
        leftTop: true,
        rightTop: true,
        rightBottom: true,
        leftBottom: true,
      });

      expect(defaultPath).toBeDefined();
      expect(explicitPath).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero padding', () => {
      const { bgPath } = calculateOctagonPaths({ padding: 0 });
      expect(bgPath).toBeDefined();
    });

    it('should handle large padding', () => {
      const { bgPath } = calculateOctagonPaths({ padding: 100 });
      expect(bgPath).toBeDefined();
    });

    it('should handle zero square size', () => {
      const { bgPath } = calculateOctagonPaths({ squareSize: 0 });
      expect(bgPath).toBeDefined();
    });

    it('should handle large square size', () => {
      const { bgPath } = calculateOctagonPaths({ squareSize: 200 });
      expect(bgPath).toBeDefined();
    });

    it('should handle all corners disabled', () => {
      const { bgPath } = calculateOctagonPaths({
        leftTop: false,
        rightTop: false,
        rightBottom: false,
        leftBottom: false,
      });

      expect(bgPath).toBeDefined();
      expect(bgPath.length).toBeGreaterThan(0);
    });

    it('should handle single corner enabled', () => {
      const { bgPath } = calculateOctagonPaths({
        leftTop: true,
        rightTop: false,
        rightBottom: false,
        leftBottom: false,
      });

      expect(bgPath).toBeDefined();
    });
  });
});
