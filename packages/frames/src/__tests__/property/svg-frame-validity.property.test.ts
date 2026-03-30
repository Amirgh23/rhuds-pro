/**
 * Property Test: SVG Frame Validity
 * Property 12: SVG Frame Validity
 * Validates: Requirements 9.7
 *
 * When a frame is rendered, the Frame_Renderer SHALL generate valid SVG markup
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  calculateOctagonPaths,
  calculateKranoxPaths,
  calculateCornersPaths,
  calculateLinesPaths,
  calculateUnderlinePaths,
  calculateNefrexPaths,
} from '../../core/pathCalculator';
import type { PathDefinition } from '../../core/svgRenderer';

/**
 * Validate that a path definition is valid SVG
 */
function isValidSVGPath(path: PathDefinition): boolean {
  if (!Array.isArray(path)) return false;
  if (path.length === 0) return false;

  // Validate all segments
  const validCommands = ['M', 'L', 'H', 'V', 'C', 'S', 'Q', 'T', 'A', 'Z'];

  for (let i = 0; i < path.length; i++) {
    const segment = path[i];

    if (segment === 'Z') {
      // Z command should not have arguments
      continue;
    }

    if (!Array.isArray(segment)) return false;

    const [command, ...args] = segment;

    // Validate command
    if (!validCommands.includes(command)) return false;

    // Validate arguments are numbers or strings
    for (const arg of args) {
      if (typeof arg !== 'number' && typeof arg !== 'string') {
        return false;
      }
    }
  }

  return true;
}

/**
 * Convert path definition to SVG path string for validation
 */
function pathToSVGString(path: PathDefinition, width: number = 100, height: number = 100): string {
  const segments: string[] = [];

  for (const segment of path) {
    if (segment === 'Z') {
      segments.push('Z');
      continue;
    }

    const [command, ...args] = segment;
    const parsedArgs: number[] = [];

    // Parse arguments
    for (let i = 0; i < args.length; i++) {
      const isX = i % 2 === 0;
      const dimension = isX ? width : height;
      const arg = args[i];

      if (typeof arg === 'number') {
        parsedArgs.push(arg);
      } else if (typeof arg === 'string') {
        // Handle percentage and calc expressions
        const str = arg.trim();

        // Handle calc: "100% - 20"
        const calcMatch = str.match(/^([\d.]+)%\s*([+-])\s*([\d.]+)$/);
        if (calcMatch) {
          const percent = parseFloat(calcMatch[1]);
          const operator = calcMatch[2];
          const offset = parseFloat(calcMatch[3]);
          const base = (dimension * percent) / 100;
          parsedArgs.push(operator === '+' ? base + offset : base - offset);
        } else if (str.endsWith('%')) {
          // Handle percentage: "100%"
          const percent = parseFloat(str);
          parsedArgs.push((dimension * percent) / 100);
        } else {
          // Handle plain number as string
          parsedArgs.push(parseFloat(str) || 0);
        }
      }
    }

    segments.push(command + parsedArgs.join(','));
  }

  return segments.join(' ');
}

describe('Property 12: SVG Frame Validity', () => {
  describe('Octagon Frame Validity', () => {
    it('should generate valid SVG paths for all octagon configurations', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }), // padding
          fc.integer({ min: 1, max: 50 }), // squareSize
          fc.boolean(), // leftTop
          fc.boolean(), // rightTop
          fc.boolean(), // rightBottom
          fc.boolean(), // leftBottom
          (padding, squareSize, leftTop, rightTop, rightBottom, leftBottom) => {
            const { bgPath, linePath } = calculateOctagonPaths({
              padding,
              squareSize,
              leftTop,
              rightTop,
              rightBottom,
              leftBottom,
            });

            // Both paths should be valid
            expect(isValidSVGPath(bgPath)).toBe(true);
            expect(isValidSVGPath(linePath)).toBe(true);

            // Should be able to convert to SVG string
            const bgString = pathToSVGString(bgPath);
            const lineString = pathToSVGString(linePath);

            expect(typeof bgString).toBe('string');
            expect(typeof lineString).toBe('string');
            expect(bgString.length).toBeGreaterThan(0);
            expect(lineString.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate paths that start with M and end with Z', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }),
          fc.integer({ min: 1, max: 50 }),
          (padding, squareSize) => {
            const { bgPath, linePath } = calculateOctagonPaths({ padding, squareSize });

            // Check bgPath
            const bgFirst = bgPath[0];
            const bgLast = bgPath[bgPath.length - 1];

            expect(Array.isArray(bgFirst)).toBe(true);
            expect((bgFirst as any)[0]).toBe('M');
            expect(bgLast).toBe('Z');

            // Check linePath
            const lineFirst = linePath[0];
            const lineLast = linePath[linePath.length - 1];

            expect(Array.isArray(lineFirst)).toBe(true);
            expect((lineFirst as any)[0]).toBe('M');
            expect(lineLast).toBe('Z');
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Kranox Frame Validity', () => {
    it('should generate valid SVG paths for all kranox configurations', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }), // padding
          fc.integer({ min: 1, max: 5 }), // strokeWidth
          fc.integer({ min: 1, max: 50 }), // squareSize
          fc.integer({ min: 1, max: 50 }), // smallLineLength
          fc.integer({ min: 1, max: 100 }), // largeLineLength
          (padding, strokeWidth, squareSize, smallLineLength, largeLineLength) => {
            const { bgPath, assemblyPaths } = calculateKranoxPaths({
              padding,
              strokeWidth,
              squareSize,
              smallLineLength,
              largeLineLength,
            });

            // bgPath should be valid
            expect(isValidSVGPath(bgPath)).toBe(true);

            // All assembly paths should be valid
            assemblyPaths.forEach((path) => {
              expect(isValidSVGPath(path)).toBe(true);
            });

            // Should have 8 assembly paths (4 corners × 2 lines)
            expect(assemblyPaths.length).toBe(8);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Corners Frame Validity', () => {
    it('should generate valid SVG paths for all corners configurations', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }), // padding
          fc.integer({ min: 1, max: 5 }), // strokeWidth
          fc.integer({ min: 1, max: 100 }), // cornerLength
          (padding, strokeWidth, cornerLength) => {
            const { cornerPaths } = calculateCornersPaths({
              padding,
              strokeWidth,
              cornerLength,
            });

            // All corner paths should be valid
            cornerPaths.forEach((path) => {
              expect(isValidSVGPath(path)).toBe(true);
            });

            // Should have 8 corner paths (4 corners × 2 lines)
            expect(cornerPaths.length).toBe(8);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Lines Frame Validity', () => {
    it('should generate valid SVG paths for all lines configurations', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }), // padding
          fc.integer({ min: 1, max: 5 }), // strokeWidth
          fc.integer({ min: 1, max: 50 }), // lineLength
          (padding, strokeWidth, lineLength) => {
            const { linePath } = calculateLinesPaths({
              padding,
              strokeWidth,
              lineLength,
            });

            // linePath should be valid
            expect(isValidSVGPath(linePath)).toBe(true);

            // Should start with M and end with Z
            const first = linePath[0];
            const last = linePath[linePath.length - 1];

            expect(Array.isArray(first)).toBe(true);
            expect((first as any)[0]).toBe('M');
            expect(last).toBe('Z');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Underline Frame Validity', () => {
    it('should generate valid SVG paths for all underline configurations', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }), // padding
          fc.integer({ min: 1, max: 5 }), // strokeWidth
          fc.integer({ min: 1, max: 50 }), // squareSize
          (padding, strokeWidth, squareSize) => {
            const { squarePaths, underlinePath } = calculateUnderlinePaths({
              padding,
              strokeWidth,
              squareSize,
            });

            // All square paths should be valid and closed
            squarePaths.forEach((path) => {
              expect(isValidSVGPath(path)).toBe(true);
              expect(path[path.length - 1]).toBe('Z');
            });

            // Underline path should be valid
            expect(isValidSVGPath(underlinePath)).toBe(true);

            // Should have 4 square paths
            expect(squarePaths.length).toBe(4);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Nefrex Frame Validity', () => {
    it('should generate valid SVG paths for all nefrex configurations', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }), // padding
          fc.integer({ min: 1, max: 5 }), // strokeWidth
          fc.integer({ min: 1, max: 50 }), // squareSize
          fc.integer({ min: 1, max: 50 }), // smallLineLength
          fc.integer({ min: 1, max: 100 }), // largeLineLength
          (padding, strokeWidth, squareSize, smallLineLength, largeLineLength) => {
            const { bgPath, assemblyPaths } = calculateNefrexPaths({
              padding,
              strokeWidth,
              squareSize,
              smallLineLength,
              largeLineLength,
            });

            // bgPath should be valid
            expect(isValidSVGPath(bgPath)).toBe(true);

            // All assembly paths should be valid
            assemblyPaths.forEach((path) => {
              expect(isValidSVGPath(path)).toBe(true);
            });

            // Should have 8 assembly paths
            expect(assemblyPaths.length).toBe(8);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('SVG String Generation', () => {
    it('should generate valid SVG path strings from octagon, kranox, lines, and nefrex frame types', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50, max: 500 }), // width
          fc.integer({ min: 50, max: 500 }), // height
          (width, height) => {
            const octagon = calculateOctagonPaths();
            const kranox = calculateKranoxPaths();
            const lines = calculateLinesPaths();
            const nefrex = calculateNefrexPaths();

            // All should generate valid SVG strings
            const octagonStr = pathToSVGString(octagon.bgPath, width, height);
            const kranoxStr = pathToSVGString(kranox.bgPath, width, height);
            const linesStr = pathToSVGString(lines.linePath, width, height);
            const nefrexStr = pathToSVGString(nefrex.bgPath, width, height);

            // All should be non-empty strings
            expect(octagonStr.length).toBeGreaterThan(0);
            expect(kranoxStr.length).toBeGreaterThan(0);
            expect(linesStr.length).toBeGreaterThan(0);
            expect(nefrexStr.length).toBeGreaterThan(0);

            // All should start with M
            expect(octagonStr.startsWith('M')).toBe(true);
            expect(kranoxStr.startsWith('M')).toBe(true);
            expect(linesStr.startsWith('M')).toBe(true);
            expect(nefrexStr.startsWith('M')).toBe(true);

            // All should end with Z
            expect(octagonStr.endsWith('Z')).toBe(true);
            expect(kranoxStr.endsWith('Z')).toBe(true);
            expect(linesStr.endsWith('Z')).toBe(true);
            expect(nefrexStr.endsWith('Z')).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Path Consistency', () => {
    it('should generate consistent paths for same configuration', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }),
          fc.integer({ min: 1, max: 50 }),
          (padding, squareSize) => {
            const result1 = calculateOctagonPaths({ padding, squareSize });
            const result2 = calculateOctagonPaths({ padding, squareSize });

            // Same configuration should produce identical paths
            expect(JSON.stringify(result1.bgPath)).toBe(JSON.stringify(result2.bgPath));
            expect(JSON.stringify(result1.linePath)).toBe(JSON.stringify(result2.linePath));
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
