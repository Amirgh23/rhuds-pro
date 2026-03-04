/**
 * SVG Path Renderer - Arwes Style
 * Renders SVG paths with support for percentage and calc() coordinates
 */

export type PathCommand = 'M' | 'L' | 'H' | 'V' | 'C' | 'S' | 'Q' | 'T' | 'A' | 'Z';
export type PathValue = number | string;
export type PathSegment = [PathCommand, ...PathValue[]] | 'Z';
export type PathDefinition = PathSegment[];

export interface FrameSVGPathGeneric {
  name?: string;
  style?: Partial<CSSStyleDeclaration> | Record<string, string | number>;
  path: PathDefinition;
}

/**
 * Parse coordinate value with support for:
 * - Numbers: 100
 * - Percentages: "100%"
 * - Calculations: "100% - 20", "50% + 100"
 */
function parseCoordinate(value: PathValue, dimension: number): number {
  if (typeof value === 'number') {
    return value;
  }

  const str = String(value).trim();

  // Handle percentage with calculation: "100% - 20" or "50% + 100"
  const calcMatch = str.match(/^([\d.]+)%\s*([+-])\s*([\d.]+)$/);
  if (calcMatch) {
    const percent = parseFloat(calcMatch[1]);
    const operator = calcMatch[2];
    const offset = parseFloat(calcMatch[3]);
    const base = (dimension * percent) / 100;
    return operator === '+' ? base + offset : base - offset;
  }

  // Handle simple percentage: "100%"
  if (str.endsWith('%')) {
    const percent = parseFloat(str);
    return (dimension * percent) / 100;
  }

  // Handle plain number as string: "100"
  return parseFloat(str) || 0;
}

/**
 * Convert path definition to SVG path string
 */
function pathToString(path: PathDefinition, width: number, height: number): string {
  const segments: string[] = [];

  for (const segment of path) {
    if (segment === 'Z') {
      segments.push('Z');
      continue;
    }

    const [command, ...args] = segment;
    const parsedArgs: number[] = [];

    // Parse arguments based on command type
    for (let i = 0; i < args.length; i++) {
      const isX = i % 2 === 0;
      const dimension = isX ? width : height;
      parsedArgs.push(parseCoordinate(args[i], dimension));
    }

    segments.push(command + parsedArgs.join(','));
  }

  return segments.join(' ');
}

/**
 * Apply styles to SVG element
 */
function applyStyles(
  element: SVGElement,
  styles: Partial<CSSStyleDeclaration> | Record<string, string | number>
): void {
  Object.entries(styles).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Convert camelCase to kebab-case for CSS properties
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      element.style.setProperty(cssKey, String(value));
    }
  });
}

/**
 * Render SVG paths (Arwes style)
 * Main rendering function that creates path elements
 */
export function renderFrameSVGPaths(
  container: SVGElement,
  width: number,
  height: number,
  paths: FrameSVGPathGeneric[]
): void {
  // Clear existing content
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Create path elements
  paths.forEach((pathDef) => {
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Set path data
    const d = pathToString(pathDef.path, width, height);
    pathElement.setAttribute('d', d);

    // Set data-name attribute for styling
    if (pathDef.name) {
      pathElement.setAttribute('data-name', pathDef.name);
    }

    // Apply styles
    if (pathDef.style) {
      applyStyles(pathElement, pathDef.style);
    }

    container.appendChild(pathElement);
  });
}
