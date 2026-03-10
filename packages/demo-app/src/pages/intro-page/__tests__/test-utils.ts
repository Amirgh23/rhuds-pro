/**
 * Test utilities for intro page components
 * Provides helpers for testing animations, responsive design, and accessibility
 */

/**
 * Get computed style value for an element
 */
export function getComputedStyleValue(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Check if element has a specific CSS class
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * Get all elements matching a selector
 */
export function queryAll(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(selector));
}

/**
 * Wait for animation to complete
 */
export async function waitForAnimation(
  element: HTMLElement,
  duration: number = 1500
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration + 100); // Add buffer
  });
}

/**
 * Get element's z-index value
 */
export function getZIndex(element: HTMLElement): number {
  const zIndex = getComputedStyleValue(element, 'z-index');
  return zIndex === 'auto' ? 0 : parseInt(zIndex, 10);
}

/**
 * Check if element is visible in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
}

/**
 * Get contrast ratio between two colors
 * Returns a number representing the contrast ratio (1-21)
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fgLum = getRelativeLuminance(foreground);
  const bgLum = getRelativeLuminance(background);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance of a color
 * Used for WCAG contrast ratio calculation
 */
function getRelativeLuminance(color: string): number {
  const rgb = parseRgbColor(color);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map((c) => {
    const c2 = c / 255;
    return c2 <= 0.03928 ? c2 / 12.92 : Math.pow((c2 + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Parse RGB color string to array of numbers
 */
function parseRgbColor(color: string): number[] | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
}

/**
 * Check if element has glow effect (drop-shadow or text-shadow)
 */
export function hasGlowEffect(element: HTMLElement): boolean {
  const filter = getComputedStyleValue(element, 'filter');
  const textShadow = getComputedStyleValue(element, 'text-shadow');
  return filter.includes('drop-shadow') || textShadow !== 'none';
}

/**
 * Get all computed colors from an element and its children
 */
export function getAllComputedColors(element: HTMLElement): Set<string> {
  const colors = new Set<string>();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, null);

  let node: Node | null = walker.currentNode;
  while (node) {
    const el = node as HTMLElement;
    const color = getComputedStyleValue(el, 'color');
    const bgColor = getComputedStyleValue(el, 'background-color');
    const borderColor = getComputedStyleValue(el, 'border-color');

    if (color && color !== 'rgba(0, 0, 0, 0)') colors.add(color);
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') colors.add(bgColor);
    if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') colors.add(borderColor);

    node = walker.nextNode();
  }

  return colors;
}

/**
 * Check if color is in approved palette
 */
export function isApprovedColor(color: string): boolean {
  const approvedColors = [
    'rgba(41, 242, 223, 1)', // Cyan
    'rgba(239, 62, 241, 1)', // Magenta
    'rgba(0, 150, 255, 1)', // Blue
    'rgba(0, 255, 150, 1)', // Green
    '#000000', // Black
    'rgba(0, 0, 0, 1)', // Black
    'rgba(0, 0, 0, 0)', // Transparent
  ];

  // Normalize color for comparison
  const normalized = normalizeColor(color);
  return approvedColors.some((c) => normalizeColor(c) === normalized);
}

/**
 * Normalize color string for comparison
 */
function normalizeColor(color: string): string {
  // Remove spaces
  return color.replace(/\s/g, '');
}

/**
 * Check if element uses monospace font
 */
export function usesMonospaceFont(element: HTMLElement): boolean {
  const fontFamily = getComputedStyleValue(element, 'font-family');
  const monospaceKeywords = ['monospace', 'courier', 'consolas', 'menlo', 'monaco'];
  return monospaceKeywords.some((keyword) => fontFamily.toLowerCase().includes(keyword));
}

/**
 * Get all interactive elements on page
 */
export function getInteractiveElements(): HTMLElement[] {
  const selectors = [
    'button',
    'a',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
  ];
  const elements: HTMLElement[] = [];

  selectors.forEach((selector) => {
    elements.push(...queryAll(selector));
  });

  return elements;
}

/**
 * Check if element is keyboard accessible
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  const tabIndex = element.getAttribute('tabindex');
  const isNaturallyFocusable = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(
    element.tagName
  );
  return isNaturallyFocusable || (tabIndex !== null && parseInt(tabIndex, 10) >= 0);
}

/**
 * Simulate viewport resize
 */
export function setViewportWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });

  window.dispatchEvent(new Event('resize'));
}

/**
 * Get grid column count from computed style
 */
export function getGridColumnCount(element: HTMLElement): number {
  const gridTemplateColumns = getComputedStyleValue(element, 'grid-template-columns');
  if (!gridTemplateColumns || gridTemplateColumns === 'none') return 1;

  // Count the number of columns
  return gridTemplateColumns.split(' ').length;
}

/**
 * Check if element has focus ring
 */
export function hasFocusRing(element: HTMLElement): boolean {
  const outline = getComputedStyleValue(element, 'outline');
  const boxShadow = getComputedStyleValue(element, 'box-shadow');
  return outline !== 'none' || boxShadow !== 'none';
}

/**
 * Get element's computed padding
 */
export function getPadding(element: HTMLElement): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  return {
    top: parseFloat(getComputedStyleValue(element, 'padding-top')),
    right: parseFloat(getComputedStyleValue(element, 'padding-right')),
    bottom: parseFloat(getComputedStyleValue(element, 'padding-bottom')),
    left: parseFloat(getComputedStyleValue(element, 'padding-left')),
  };
}

/**
 * Get element's computed dimensions
 */
export function getDimensions(element: HTMLElement): {
  width: number;
  height: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}

/**
 * Check if element has semantic role
 */
export function hasSemanticRole(element: HTMLElement, role: string): boolean {
  return element.getAttribute('role') === role || element.tagName.toLowerCase() === role;
}
