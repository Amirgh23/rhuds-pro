/**
 * SVG Path Generation Engine
 * Generates SVG commands for frame rendering
 */

import { SVGPath, SVGCommand } from './types';

/**
 * SVG path builder
 */
export class SVGPathBuilder {
  private commands: Array<{ command: SVGCommand; args: number[] }> = [];

  /**
   * Move to position
   */
  moveTo(x: number, y: number): this {
    this.commands.push({ command: 'M', args: [x, y] });
    return this;
  }

  /**
   * Line to position
   */
  lineTo(x: number, y: number): this {
    this.commands.push({ command: 'L', args: [x, y] });
    return this;
  }

  /**
   * Horizontal line
   */
  horizontalLine(x: number): this {
    this.commands.push({ command: 'H', args: [x] });
    return this;
  }

  /**
   * Vertical line
   */
  verticalLine(y: number): this {
    this.commands.push({ command: 'V', args: [y] });
    return this;
  }

  /**
   * Cubic bezier curve
   */
  cubicBezier(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x: number,
    y: number
  ): this {
    this.commands.push({ command: 'C', args: [x1, y1, x2, y2, x, y] });
    return this;
  }

  /**
   * Arc
   */
  arc(
    rx: number,
    ry: number,
    rotation: number,
    largeArc: boolean,
    sweep: boolean,
    x: number,
    y: number
  ): this {
    this.commands.push({
      command: 'A',
      args: [rx, ry, rotation, largeArc ? 1 : 0, sweep ? 1 : 0, x, y],
    });
    return this;
  }

  /**
   * Close path
   */
  close(): this {
    this.commands.push({ command: 'Z', args: [] });
    return this;
  }

  /**
   * Get SVG path string
   */
  toString(): string {
    return this.commands
      .map((cmd) => {
        const args = cmd.args.join(' ');
        return args ? `${cmd.command}${args}` : cmd.command;
      })
      .join(' ');
  }

  /**
   * Get SVG path object
   */
  build(): SVGPath {
    return {
      commands: [...this.commands],
    };
  }

  /**
   * Reset builder
   */
  reset(): this {
    this.commands = [];
    return this;
  }
}

/**
 * Create octagon path
 */
export function createOctagonPath(
  width: number,
  height: number,
  cornerSize: number = 20
): SVGPath {
  const builder = new SVGPathBuilder();
  const w = width;
  const h = height;
  const c = cornerSize;

  builder
    .moveTo(c, 0)
    .lineTo(w - c, 0)
    .lineTo(w, c)
    .lineTo(w, h - c)
    .lineTo(w - c, h)
    .lineTo(c, h)
    .lineTo(0, h - c)
    .lineTo(0, c)
    .close();

  return builder.build();
}

/**
 * Create kranox path (assembly style)
 */
export function createKranoxPath(
  width: number,
  height: number,
  lineLength: number = 20
): SVGPath {
  const builder = new SVGPathBuilder();
  const w = width;
  const h = height;
  const l = lineLength;

  // Top-left corner
  builder.moveTo(0, l).lineTo(0, 0).lineTo(l, 0);

  // Top-right corner
  builder.moveTo(w - l, 0).lineTo(w, 0).lineTo(w, l);

  // Bottom-right corner
  builder.moveTo(w, h - l).lineTo(w, h).lineTo(w - l, h);

  // Bottom-left corner
  builder.moveTo(l, h).lineTo(0, h).lineTo(0, h - l);

  return builder.build();
}

/**
 * Create corners path (corner-only rendering)
 */
export function createCornersPath(
  width: number,
  height: number,
  cornerSize: number = 20,
  position: 'inside' | 'outside' = 'outside'
): SVGPath {
  const builder = new SVGPathBuilder();
  const w = width;
  const h = height;
  const c = cornerSize;
  const offset = position === 'outside' ? -c : 0;

  // Top-left
  builder.moveTo(offset, offset).lineTo(c + offset, offset).lineTo(offset, c + offset);

  // Top-right
  builder
    .moveTo(w - offset, offset)
    .lineTo(w - c - offset, offset)
    .lineTo(w - offset, c + offset);

  // Bottom-right
  builder
    .moveTo(w - offset, h - offset)
    .lineTo(w - c - offset, h - offset)
    .lineTo(w - offset, h - c - offset);

  // Bottom-left
  builder
    .moveTo(offset, h - offset)
    .lineTo(c + offset, h - offset)
    .lineTo(offset, h - c - offset);

  return builder.build();
}

/**
 * Create lines path (dashed lines)
 */
export function createLinesPath(
  width: number,
  height: number,
  dashArray: string = '5,5'
): SVGPath {
  const builder = new SVGPathBuilder();
  const w = width;
  const h = height;

  // Top line
  builder.moveTo(0, 0).lineTo(w, 0);

  // Right line
  builder.moveTo(w, 0).lineTo(w, h);

  // Bottom line
  builder.moveTo(w, h).lineTo(0, h);

  // Left line
  builder.moveTo(0, h).lineTo(0, 0);

  return builder.build();
}

/**
 * Create underline path
 */
export function createUnderlinePath(
  width: number,
  height: number,
  squareSize: number = 10
): SVGPath {
  const builder = new SVGPathBuilder();
  const w = width;
  const h = height;
  const s = squareSize;

  // Bottom line
  builder.moveTo(0, h).lineTo(w, h);

  // Left square
  builder
    .moveTo(0, h)
    .lineTo(s, h)
    .lineTo(s, h + s)
    .lineTo(0, h + s)
    .close();

  // Right square
  builder
    .moveTo(w - s, h)
    .lineTo(w, h)
    .lineTo(w, h + s)
    .lineTo(w - s, h + s)
    .close();

  return builder.build();
}

/**
 * Create nefrex path (assembly style variant)
 */
export function createNefrexPath(
  width: number,
  height: number,
  lineLength: number = 15
): SVGPath {
  const builder = new SVGPathBuilder();
  const w = width;
  const h = height;
  const l = lineLength;

  // Top border with squares
  builder.moveTo(0, 0).lineTo(w, 0);
  for (let i = 0; i < w; i += l * 2) {
    builder
      .moveTo(i, 0)
      .lineTo(i + l, 0)
      .lineTo(i + l, l)
      .lineTo(i, l)
      .close();
  }

  // Right border
  builder.moveTo(w, 0).lineTo(w, h);

  // Bottom border
  builder.moveTo(w, h).lineTo(0, h);

  // Left border
  builder.moveTo(0, h).lineTo(0, 0);

  return builder.build();
}

/**
 * Convert SVG path to string
 */
export function pathToString(path: SVGPath): string {
  return path.commands
    .map((cmd) => {
      const args = cmd.args.join(' ');
      return args ? `${cmd.command}${args}` : cmd.command;
    })
    .join(' ');
}

/**
 * Combine multiple paths
 */
export function combinePaths(...paths: SVGPath[]): SVGPath {
  const commands: Array<{ command: SVGCommand; args: number[] }> = [];

  for (const path of paths) {
    commands.push(...path.commands);
  }

  return { commands };
}
