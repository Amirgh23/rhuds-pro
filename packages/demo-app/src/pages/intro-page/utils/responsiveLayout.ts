/**
 * Responsive Layout System for Intro Page
 * Manages breakpoints and responsive design patterns
 */

export interface Breakpoints {
  mobile: number; // < 768px
  tablet: number; // 768px - 1023px
  desktop: number; // >= 1024px
  wide: number; // >= 1920px
}

export interface ResponsiveValues<T> {
  mobile: T;
  tablet: T;
  desktop: T;
  wide?: T;
}

/**
 * Default breakpoints for responsive design
 */
export const DEFAULT_BREAKPOINTS: Breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1920,
  wide: 2560,
};

/**
 * Get current breakpoint based on viewport width
 */
export const getCurrentBreakpoint = (
  viewportWidth: number,
  breakpoints: Breakpoints = DEFAULT_BREAKPOINTS
): 'mobile' | 'tablet' | 'desktop' | 'wide' => {
  if (viewportWidth < breakpoints.mobile) {
    return 'mobile';
  } else if (viewportWidth < breakpoints.tablet) {
    return 'tablet';
  } else if (viewportWidth < breakpoints.desktop) {
    return 'desktop';
  } else {
    return 'wide';
  }
};

/**
 * Get responsive value based on current breakpoint
 */
export const getResponsiveValue = <T>(
  values: ResponsiveValues<T>,
  viewportWidth: number,
  breakpoints: Breakpoints = DEFAULT_BREAKPOINTS
): T => {
  const breakpoint = getCurrentBreakpoint(viewportWidth, breakpoints);

  if (breakpoint === 'wide' && values.wide) {
    return values.wide;
  }

  return values[breakpoint];
};

/**
 * Responsive padding configuration
 */
export const RESPONSIVE_PADDING: ResponsiveValues<number> = {
  mobile: 16,
  tablet: 24,
  desktop: 32,
  wide: 40,
};

/**
 * Responsive gap configuration
 */
export const RESPONSIVE_GAP: ResponsiveValues<number> = {
  mobile: 16,
  tablet: 20,
  desktop: 24,
  wide: 32,
};

/**
 * Responsive grid columns
 */
export const RESPONSIVE_GRID_COLUMNS: ResponsiveValues<number> = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
  wide: 4,
};

/**
 * Get responsive padding
 */
export const getResponsivePadding = (viewportWidth: number): number => {
  return getResponsiveValue(RESPONSIVE_PADDING, viewportWidth);
};

/**
 * Get responsive gap
 */
export const getResponsiveGap = (viewportWidth: number): number => {
  return getResponsiveValue(RESPONSIVE_GAP, viewportWidth);
};

/**
 * Get responsive grid columns
 */
export const getResponsiveGridColumns = (viewportWidth: number): number => {
  return getResponsiveValue(RESPONSIVE_GRID_COLUMNS, viewportWidth);
};

/**
 * Media query helper
 */
export const getMediaQuery = (
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide',
  breakpoints: Breakpoints = DEFAULT_BREAKPOINTS
): string => {
  const queries = {
    mobile: `(max-width: ${breakpoints.mobile - 1}px)`,
    tablet: `(min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`,
    desktop: `(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
    wide: `(min-width: ${breakpoints.desktop}px)`,
  };

  return queries[breakpoint];
};

/**
 * Check if viewport is mobile
 */
export const isMobile = (
  viewportWidth: number,
  breakpoints: Breakpoints = DEFAULT_BREAKPOINTS
): boolean => {
  return viewportWidth < breakpoints.mobile;
};

/**
 * Check if viewport is tablet
 */
export const isTablet = (
  viewportWidth: number,
  breakpoints: Breakpoints = DEFAULT_BREAKPOINTS
): boolean => {
  return viewportWidth >= breakpoints.mobile && viewportWidth < breakpoints.tablet;
};

/**
 * Check if viewport is desktop
 */
export const isDesktop = (
  viewportWidth: number,
  breakpoints: Breakpoints = DEFAULT_BREAKPOINTS
): boolean => {
  return viewportWidth >= breakpoints.tablet && viewportWidth < breakpoints.desktop;
};

/**
 * Check if viewport is wide
 */
export const isWide = (
  viewportWidth: number,
  breakpoints: Breakpoints = DEFAULT_BREAKPOINTS
): boolean => {
  return viewportWidth >= breakpoints.desktop;
};

/**
 * Get CSS media queries as string
 */
export const getMediaQueryString = (
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide',
  breakpoints: Breakpoints = DEFAULT_BREAKPOINTS
): string => {
  return `@media ${getMediaQuery(breakpoint, breakpoints)}`;
};

/**
 * Validate responsive values
 */
export const validateResponsiveValues = <T>(
  values: ResponsiveValues<T>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!values.mobile) {
    errors.push('Mobile value is required');
  }

  if (!values.tablet) {
    errors.push('Tablet value is required');
  }

  if (!values.desktop) {
    errors.push('Desktop value is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Create custom responsive values
 */
export const createResponsiveValues = <T>(
  overrides: Partial<ResponsiveValues<T>>,
  defaults: ResponsiveValues<T>
): ResponsiveValues<T> => {
  return {
    ...defaults,
    ...overrides,
  };
};

/**
 * Get container max width based on breakpoint
 */
export const getContainerMaxWidth = (viewportWidth: number): string => {
  if (isMobile(viewportWidth)) {
    return '100%';
  } else if (isTablet(viewportWidth)) {
    return '720px';
  } else if (isDesktop(viewportWidth)) {
    return '960px';
  } else {
    return '1200px';
  }
};

/**
 * Check for horizontal scrolling prevention
 */
export const validateNoHorizontalScroll = (
  containerWidth: number,
  contentWidth: number
): { valid: boolean; message: string } => {
  if (contentWidth > containerWidth) {
    return {
      valid: false,
      message: `Content width (${contentWidth}px) exceeds container width (${containerWidth}px)`,
    };
  }

  return {
    valid: true,
    message: 'No horizontal scrolling detected',
  };
};

/**
 * Get responsive font size using clamp
 */
export const getResponsiveFontSize = (
  minSize: number,
  maxSize: number,
  minViewport: number = 320,
  maxViewport: number = 1920
): string => {
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const intercept = minSize - slope * minViewport;

  return `clamp(${minSize}px, ${intercept}px + ${slope * 100}vw, ${maxSize}px)`;
};

/**
 * Get responsive spacing using clamp
 */
export const getResponsiveSpacing = (minSpacing: number, maxSpacing: number): string => {
  return getResponsiveFontSize(minSpacing, maxSpacing);
};
