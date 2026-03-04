/**
 * Path Calculator - Arwes Style
 * Calculates SVG path definitions for different frame variants
 */

import type { PathDefinition } from './svgRenderer';

export interface OctagonPathOptions {
  padding?: number;
  squareSize?: number;
  leftTop?: boolean;
  rightTop?: boolean;
  rightBottom?: boolean;
  leftBottom?: boolean;
}

export interface KranoxPathOptions {
  padding?: number;
  strokeWidth?: number;
  squareSize?: number;
  smallLineLength?: number;
  largeLineLength?: number;
}

export interface CornersPathOptions {
  padding?: number;
  strokeWidth?: number;
  cornerLength?: number;
}

export interface LinesPathOptions {
  padding?: number;
  strokeWidth?: number;
  lineLength?: number;
}

export interface UnderlinePathOptions {
  padding?: number;
  strokeWidth?: number;
  squareSize?: number;
}

export interface NefrexPathOptions {
  padding?: number;
  strokeWidth?: number;
  squareSize?: number;
  smallLineLength?: number;
  largeLineLength?: number;
}

/**
 * Calculate Octagon frame paths
 */
export function calculateOctagonPaths(options: OctagonPathOptions = {}) {
  const {
    padding = 0,
    squareSize = 16,
    leftTop = true,
    rightTop = true,
    rightBottom = true,
    leftBottom = true,
  } = options;

  const p = padding;
  const s = squareSize;

  // Background path
  const bgPath: PathDefinition = [
    ['M', leftTop ? p + s : p, p],
    ['L', rightTop ? `100% - ${p + s}` : `100% - ${p}`, p],
    ...(rightTop ? [['L', `100% - ${p}`, p + s] as PathDefinition[0]] : []),
    ['L', `100% - ${p}`, rightBottom ? `100% - ${p + s}` : `100% - ${p}`],
    ...(rightBottom ? [['L', `100% - ${p + s}`, `100% - ${p}`] as PathDefinition[0]] : []),
    ['L', leftBottom ? p + s : p, `100% - ${p}`],
    ...(leftBottom ? [['L', p, `100% - ${p + s}`] as PathDefinition[0]] : []),
    ['L', p, leftTop ? p + s : p],
    'Z',
  ];

  // Line path (border)
  const linePath: PathDefinition = [...bgPath];

  return { bgPath, linePath };
}

/**
 * Calculate Kranox frame paths (complex assembling style)
 */
export function calculateKranoxPaths(options: KranoxPathOptions = {}) {
  const {
    padding = 0,
    strokeWidth = 1,
    squareSize = 12,
    smallLineLength = 12,
    largeLineLength = 48,
  } = options;

  const p = padding;
  const s = squareSize;
  const sw = strokeWidth;
  const sll = smallLineLength;
  const lll = largeLineLength;

  // Background
  const bgPath: PathDefinition = [
    ['M', p + s, p],
    ['L', `100% - ${p + s}`, p],
    ['L', `100% - ${p}`, p + s],
    ['L', `100% - ${p}`, `100% - ${p + s}`],
    ['L', `100% - ${p + s}`, `100% - ${p}`],
    ['L', p + s, `100% - ${p}`],
    ['L', p, `100% - ${p + s}`],
    ['L', p, p + s],
    'Z',
  ];

  // Assembly lines (decorative)
  const assemblyPaths: PathDefinition[] = [
    // Top left corner
    [['M', p + s, p], ['L', p + s + lll, p]],
    [['M', p, p + s], ['L', p, p + s + lll]],
    // Top right corner
    [['M', `100% - ${p + s}`, p], ['L', `100% - ${p + s + lll}`, p]],
    [['M', `100% - ${p}`, p + s], ['L', `100% - ${p}`, p + s + lll]],
    // Bottom right corner
    [['M', `100% - ${p + s}`, `100% - ${p}`], ['L', `100% - ${p + s + lll}`, `100% - ${p}`]],
    [['M', `100% - ${p}`, `100% - ${p + s}`], ['L', `100% - ${p}`, `100% - ${p + s + lll}`]],
    // Bottom left corner
    [['M', p + s, `100% - ${p}`], ['L', p + s + lll, `100% - ${p}`]],
    [['M', p, `100% - ${p + s}`], ['L', p, `100% - ${p + s + lll}`]],
  ];

  return { bgPath, assemblyPaths };
}

/**
 * Calculate Corners frame paths
 */
export function calculateCornersPaths(options: CornersPathOptions = {}) {
  const { padding = 0, strokeWidth = 1, cornerLength = 32 } = options;

  const p = padding;
  const cl = cornerLength;

  const cornerPaths: PathDefinition[] = [
    // Top left
    [['M', p, p], ['L', p + cl, p]],
    [['M', p, p], ['L', p, p + cl]],
    // Top right
    [['M', `100% - ${p}`, p], ['L', `100% - ${p + cl}`, p]],
    [['M', `100% - ${p}`, p], ['L', `100% - ${p}`, p + cl]],
    // Bottom right
    [['M', `100% - ${p}`, `100% - ${p}`], ['L', `100% - ${p + cl}`, `100% - ${p}`]],
    [['M', `100% - ${p}`, `100% - ${p}`], ['L', `100% - ${p}`, `100% - ${p + cl}`]],
    // Bottom left
    [['M', p, `100% - ${p}`], ['L', p + cl, `100% - ${p}`]],
    [['M', p, `100% - ${p}`], ['L', p, `100% - ${p + cl}`]],
  ];

  return { cornerPaths };
}

/**
 * Calculate Lines frame paths
 */
export function calculateLinesPaths(options: LinesPathOptions = {}) {
  const { padding = 0, strokeWidth = 2, lineLength = 8 } = options;

  const p = padding;

  // Simple rectangular border with dashed effect
  const linePath: PathDefinition = [
    ['M', p, p],
    ['L', `100% - ${p}`, p],
    ['L', `100% - ${p}`, `100% - ${p}`],
    ['L', p, `100% - ${p}`],
    'Z',
  ];

  return { linePath };
}

/**
 * Calculate Underline frame paths
 */
export function calculateUnderlinePaths(options: UnderlinePathOptions = {}) {
  const { padding = 0, strokeWidth = 1, squareSize = 8 } = options;

  const p = padding;
  const s = squareSize;

  // Corner squares
  const squarePaths: PathDefinition[] = [
    // Top left
    [['M', p, p], ['L', p + s, p], ['L', p + s, p + s], ['L', p, p + s], 'Z'],
    // Top right
    [['M', `100% - ${p + s}`, p], ['L', `100% - ${p}`, p], ['L', `100% - ${p}`, p + s], ['L', `100% - ${p + s}`, p + s], 'Z'],
    // Bottom right
    [['M', `100% - ${p + s}`, `100% - ${p + s}`], ['L', `100% - ${p}`, `100% - ${p + s}`], ['L', `100% - ${p}`, `100% - ${p}`], ['L', `100% - ${p + s}`, `100% - ${p}`], 'Z'],
    // Bottom left
    [['M', p, `100% - ${p + s}`], ['L', p + s, `100% - ${p + s}`], ['L', p + s, `100% - ${p}`], ['L', p, `100% - ${p}`], 'Z'],
  ];

  // Underline
  const underlinePath: PathDefinition = [
    ['M', p, `100% - ${p}`],
    ['L', `100% - ${p}`, `100% - ${p}`],
  ];

  return { squarePaths, underlinePath };
}

/**
 * Calculate Nefrex frame paths
 */
export function calculateNefrexPaths(options: NefrexPathOptions = {}) {
  const {
    padding = 0,
    strokeWidth = 2,
    squareSize = 32,
    smallLineLength = 32,
    largeLineLength = 128,
  } = options;

  const p = padding;
  const s = squareSize;
  const sll = smallLineLength;
  const lll = largeLineLength;

  // Background with octagon corners
  const bgPath: PathDefinition = [
    ['M', p + s, p],
    ['L', `100% - ${p + s}`, p],
    ['L', `100% - ${p}`, p + s],
    ['L', `100% - ${p}`, `100% - ${p + s}`],
    ['L', `100% - ${p + s}`, `100% - ${p}`],
    ['L', p + s, `100% - ${p}`],
    ['L', p, `100% - ${p + s}`],
    ['L', p, p + s],
    'Z',
  ];

  // Assembly decorations
  const assemblyPaths: PathDefinition[] = [
    // Top left
    [['M', p + s + 8, p + 8], ['L', p + s + 8 + sll, p + 8]],
    [['M', p + 8, p + s + 8], ['L', p + 8, p + s + 8 + sll]],
    // Top right
    [['M', `100% - ${p + s + 8}`, p + 8], ['L', `100% - ${p + s + 8 + sll}`, p + 8]],
    [['M', `100% - ${p + 8}`, p + s + 8], ['L', `100% - ${p + 8}`, p + s + 8 + sll]],
    // Bottom right
    [['M', `100% - ${p + s + 8}`, `100% - ${p + 8}`], ['L', `100% - ${p + s + 8 + sll}`, `100% - ${p + 8}`]],
    [['M', `100% - ${p + 8}`, `100% - ${p + s + 8}`], ['L', `100% - ${p + 8}`, `100% - ${p + s + 8 + sll}`]],
    // Bottom left
    [['M', p + s + 8, `100% - ${p + 8}`], ['L', p + s + 8 + sll, `100% - ${p + 8}`]],
    [['M', p + 8, `100% - ${p + s + 8}`], ['L', p + 8, `100% - ${p + s + 8 + sll}`]],
  ];

  return { bgPath, assemblyPaths };
}
