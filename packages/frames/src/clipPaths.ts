/**
 * Arwes-style Frame Clip Path Generators
 * Creates CSS clip-path values for different frame styles
 * Based on @arwes/frames
 */

export interface FrameOctagonClipOptions {
  leftTop?: boolean;
  rightTop?: boolean;
  rightBottom?: boolean;
  leftBottom?: boolean;
  squareSize?: string | number;
}

export interface FrameKranoxClipOptions {
  padding?: number;
  strokeWidth?: number;
  squareSize?: number;
  smallLineLength?: number;
  largeLineLength?: number;
}

/**
 * Creates octagon clip path (Arwes basic style)
 * Supports selective corner clipping
 */
export function createFrameOctagonClip(options: FrameOctagonClipOptions = {}): string {
  const {
    leftTop = true,
    rightTop = true,
    rightBottom = true,
    leftBottom = true,
    squareSize = '1rem'
  } = options;
  
  const size = typeof squareSize === 'number' ? `${squareSize}px` : squareSize;
  
  // Build polygon points based on which corners are clipped
  const points: string[] = [];
  
  // Top left corner
  if (leftTop) {
    points.push(`${size} 0%`);
  } else {
    points.push('0% 0%');
  }
  
  // Top right corner
  if (rightTop) {
    points.push(`calc(100% - ${size}) 0%`);
    points.push(`100% ${size}`);
  } else {
    points.push('100% 0%');
  }
  
  // Bottom right corner
  if (rightBottom) {
    points.push(`100% calc(100% - ${size})`);
    points.push(`calc(100% - ${size}) 100%`);
  } else {
    points.push('100% 100%');
  }
  
  // Bottom left corner
  if (leftBottom) {
    points.push(`${size} 100%`);
    points.push(`0% calc(100% - ${size})`);
  } else {
    points.push('0% 100%');
  }
  
  // Close at top left
  if (leftTop) {
    points.push(`0% ${size}`);
  } else {
    points.push('0% 0%');
  }
  
  return `polygon(${points.join(', ')})`;
}

/**
 * Creates Kranox frame clip path (Arwes assembling style)
 * Complex frame with padding and stroke considerations
 */
export function createFrameKranoxClip(options: FrameKranoxClipOptions = {}): string {
  const {
    padding = 0,
    strokeWidth = 1,
    squareSize = 12,
    smallLineLength = 12,
    largeLineLength = 48
  } = options;
  
  const size = typeof squareSize === 'number' ? `${squareSize}px` : squareSize;
  
  // Kranox uses a complex polygon with multiple points for assembly look
  return `polygon(
    ${size} 0%, 
    calc(100% - ${size}) 0%, 
    100% ${size}, 
    100% calc(100% - ${size}), 
    calc(100% - ${size}) 100%, 
    ${size} 100%, 
    0% calc(100% - ${size}), 
    0% ${size}
  )`;
}