import {
  DEFAULT_BREAKPOINTS,
  getCurrentBreakpoint,
  getResponsiveValue,
  RESPONSIVE_PADDING,
  RESPONSIVE_GAP,
  RESPONSIVE_GRID_COLUMNS,
  getResponsivePadding,
  getResponsiveGap,
  getResponsiveGridColumns,
  getMediaQuery,
  isMobile,
  isTablet,
  isDesktop,
  isWide,
  getMediaQueryString,
  validateResponsiveValues,
  createResponsiveValues,
  getContainerMaxWidth,
  validateNoHorizontalScroll,
  getResponsiveFontSize,
  getResponsiveSpacing,
} from '../responsiveLayout';

describe('Responsive Layout System', () => {
  describe('DEFAULT_BREAKPOINTS', () => {
    test('has mobile breakpoint', () => {
      expect(DEFAULT_BREAKPOINTS.mobile).toBe(768);
    });

    test('has tablet breakpoint', () => {
      expect(DEFAULT_BREAKPOINTS.tablet).toBe(1024);
    });

    test('has desktop breakpoint', () => {
      expect(DEFAULT_BREAKPOINTS.desktop).toBe(1920);
    });

    test('has wide breakpoint', () => {
      expect(DEFAULT_BREAKPOINTS.wide).toBe(2560);
    });
  });

  describe('getCurrentBreakpoint', () => {
    test('returns mobile for small viewport', () => {
      expect(getCurrentBreakpoint(500)).toBe('mobile');
    });

    test('returns tablet for medium viewport', () => {
      expect(getCurrentBreakpoint(800)).toBe('tablet');
    });

    test('returns desktop for large viewport', () => {
      expect(getCurrentBreakpoint(1200)).toBe('desktop');
    });

    test('returns wide for very large viewport', () => {
      expect(getCurrentBreakpoint(2000)).toBe('wide');
    });

    test('respects custom breakpoints', () => {
      const customBreakpoints = { ...DEFAULT_BREAKPOINTS, mobile: 600 };
      expect(getCurrentBreakpoint(500, customBreakpoints)).toBe('mobile');
      expect(getCurrentBreakpoint(700, customBreakpoints)).toBe('tablet');
    });
  });

  describe('getResponsiveValue', () => {
    test('returns mobile value for small viewport', () => {
      const values = { mobile: 10, tablet: 20, desktop: 30 };
      expect(getResponsiveValue(values, 500)).toBe(10);
    });

    test('returns tablet value for medium viewport', () => {
      const values = { mobile: 10, tablet: 20, desktop: 30 };
      expect(getResponsiveValue(values, 800)).toBe(20);
    });

    test('returns desktop value for large viewport', () => {
      const values = { mobile: 10, tablet: 20, desktop: 30 };
      expect(getResponsiveValue(values, 1200)).toBe(30);
    });

    test('returns wide value if available', () => {
      const values = { mobile: 10, tablet: 20, desktop: 30, wide: 40 };
      expect(getResponsiveValue(values, 2000)).toBe(40);
    });
  });

  describe('RESPONSIVE_PADDING', () => {
    test('has mobile padding', () => {
      expect(RESPONSIVE_PADDING.mobile).toBe(16);
    });

    test('has tablet padding', () => {
      expect(RESPONSIVE_PADDING.tablet).toBe(24);
    });

    test('has desktop padding', () => {
      expect(RESPONSIVE_PADDING.desktop).toBe(32);
    });

    test('has wide padding', () => {
      expect(RESPONSIVE_PADDING.wide).toBe(40);
    });
  });

  describe('RESPONSIVE_GAP', () => {
    test('has mobile gap', () => {
      expect(RESPONSIVE_GAP.mobile).toBe(16);
    });

    test('has tablet gap', () => {
      expect(RESPONSIVE_GAP.tablet).toBe(20);
    });

    test('has desktop gap', () => {
      expect(RESPONSIVE_GAP.desktop).toBe(24);
    });

    test('has wide gap', () => {
      expect(RESPONSIVE_GAP.wide).toBe(32);
    });
  });

  describe('RESPONSIVE_GRID_COLUMNS', () => {
    test('has mobile columns', () => {
      expect(RESPONSIVE_GRID_COLUMNS.mobile).toBe(1);
    });

    test('has tablet columns', () => {
      expect(RESPONSIVE_GRID_COLUMNS.tablet).toBe(2);
    });

    test('has desktop columns', () => {
      expect(RESPONSIVE_GRID_COLUMNS.desktop).toBe(3);
    });

    test('has wide columns', () => {
      expect(RESPONSIVE_GRID_COLUMNS.wide).toBe(4);
    });
  });

  describe('getResponsivePadding', () => {
    test('returns mobile padding for small viewport', () => {
      expect(getResponsivePadding(500)).toBe(16);
    });

    test('returns tablet padding for medium viewport', () => {
      expect(getResponsivePadding(800)).toBe(24);
    });

    test('returns desktop padding for large viewport', () => {
      expect(getResponsivePadding(1200)).toBe(32);
    });
  });

  describe('getResponsiveGap', () => {
    test('returns mobile gap for small viewport', () => {
      expect(getResponsiveGap(500)).toBe(16);
    });

    test('returns tablet gap for medium viewport', () => {
      expect(getResponsiveGap(800)).toBe(20);
    });

    test('returns desktop gap for large viewport', () => {
      expect(getResponsiveGap(1200)).toBe(24);
    });
  });

  describe('getResponsiveGridColumns', () => {
    test('returns mobile columns for small viewport', () => {
      expect(getResponsiveGridColumns(500)).toBe(1);
    });

    test('returns tablet columns for medium viewport', () => {
      expect(getResponsiveGridColumns(800)).toBe(2);
    });

    test('returns desktop columns for large viewport', () => {
      expect(getResponsiveGridColumns(1200)).toBe(3);
    });
  });

  describe('getMediaQuery', () => {
    test('returns mobile media query', () => {
      const query = getMediaQuery('mobile');
      expect(query).toContain('max-width');
      expect(query).toContain('767px');
    });

    test('returns tablet media query', () => {
      const query = getMediaQuery('tablet');
      expect(query).toContain('min-width');
      expect(query).toContain('max-width');
    });

    test('returns desktop media query', () => {
      const query = getMediaQuery('desktop');
      expect(query).toContain('min-width');
      expect(query).toContain('max-width');
    });

    test('returns wide media query', () => {
      const query = getMediaQuery('wide');
      expect(query).toContain('min-width');
      expect(query).toContain('1920px');
    });
  });

  describe('Breakpoint detection functions', () => {
    test('isMobile detects mobile viewport', () => {
      expect(isMobile(500)).toBe(true);
      expect(isMobile(800)).toBe(false);
    });

    test('isTablet detects tablet viewport', () => {
      expect(isTablet(800)).toBe(true);
      expect(isTablet(500)).toBe(false);
      expect(isTablet(1200)).toBe(false);
    });

    test('isDesktop detects desktop viewport', () => {
      expect(isDesktop(1200)).toBe(true);
      expect(isDesktop(800)).toBe(false);
      expect(isDesktop(2000)).toBe(false);
    });

    test('isWide detects wide viewport', () => {
      expect(isWide(2000)).toBe(true);
      expect(isWide(1200)).toBe(false);
    });
  });

  describe('getMediaQueryString', () => {
    test('returns valid media query string', () => {
      const query = getMediaQueryString('mobile');
      expect(query).toContain('@media');
      expect(query).toContain('max-width');
    });
  });

  describe('validateResponsiveValues', () => {
    test('validates correct values', () => {
      const values = { mobile: 10, tablet: 20, desktop: 30 };
      const result = validateResponsiveValues(values);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('detects missing mobile value', () => {
      const values = { mobile: undefined, tablet: 20, desktop: 30 };
      const result = validateResponsiveValues(values);
      expect(result.valid).toBe(false);
    });
  });

  describe('createResponsiveValues', () => {
    test('creates values with defaults', () => {
      const defaults = { mobile: 10, tablet: 20, desktop: 30 };
      const values = createResponsiveValues({}, defaults);
      expect(values).toEqual(defaults);
    });

    test('creates values with overrides', () => {
      const defaults = { mobile: 10, tablet: 20, desktop: 30 };
      const values = createResponsiveValues({ mobile: 15 }, defaults);
      expect(values.mobile).toBe(15);
      expect(values.tablet).toBe(20);
    });
  });

  describe('getContainerMaxWidth', () => {
    test('returns 100% for mobile', () => {
      expect(getContainerMaxWidth(500)).toBe('100%');
    });

    test('returns 720px for tablet', () => {
      expect(getContainerMaxWidth(800)).toBe('720px');
    });

    test('returns 960px for desktop', () => {
      expect(getContainerMaxWidth(1200)).toBe('960px');
    });

    test('returns 1200px for wide', () => {
      expect(getContainerMaxWidth(2000)).toBe('1200px');
    });
  });

  describe('validateNoHorizontalScroll', () => {
    test('validates no horizontal scroll', () => {
      const result = validateNoHorizontalScroll(1000, 900);
      expect(result.valid).toBe(true);
    });

    test('detects horizontal scroll', () => {
      const result = validateNoHorizontalScroll(1000, 1100);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('exceeds');
    });

    test('allows equal widths', () => {
      const result = validateNoHorizontalScroll(1000, 1000);
      expect(result.valid).toBe(true);
    });
  });

  describe('getResponsiveFontSize', () => {
    test('returns clamp function', () => {
      const size = getResponsiveFontSize(14, 18);
      expect(size).toContain('clamp');
    });

    test('includes min and max sizes', () => {
      const size = getResponsiveFontSize(14, 18);
      expect(size).toContain('14px');
      expect(size).toContain('18px');
    });
  });

  describe('getResponsiveSpacing', () => {
    test('returns clamp function', () => {
      const spacing = getResponsiveSpacing(16, 32);
      expect(spacing).toContain('clamp');
    });

    test('includes min and max spacing', () => {
      const spacing = getResponsiveSpacing(16, 32);
      expect(spacing).toContain('16px');
      expect(spacing).toContain('32px');
    });
  });

  describe('Responsive Design Constraints', () => {
    test('mobile breakpoint is less than tablet', () => {
      expect(DEFAULT_BREAKPOINTS.mobile).toBeLessThan(DEFAULT_BREAKPOINTS.tablet);
    });

    test('tablet breakpoint is less than desktop', () => {
      expect(DEFAULT_BREAKPOINTS.tablet).toBeLessThan(DEFAULT_BREAKPOINTS.desktop);
    });

    test('desktop breakpoint is less than wide', () => {
      expect(DEFAULT_BREAKPOINTS.desktop).toBeLessThan(DEFAULT_BREAKPOINTS.wide);
    });

    test('grid columns increase with viewport size', () => {
      expect(RESPONSIVE_GRID_COLUMNS.mobile).toBeLessThan(RESPONSIVE_GRID_COLUMNS.tablet);
      expect(RESPONSIVE_GRID_COLUMNS.tablet).toBeLessThan(RESPONSIVE_GRID_COLUMNS.desktop);
    });

    test('padding increases with viewport size', () => {
      expect(RESPONSIVE_PADDING.mobile).toBeLessThan(RESPONSIVE_PADDING.tablet);
      expect(RESPONSIVE_PADDING.tablet).toBeLessThan(RESPONSIVE_PADDING.desktop);
    });
  });
});
