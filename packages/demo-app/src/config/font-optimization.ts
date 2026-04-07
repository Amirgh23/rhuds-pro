/**
 * Font Optimization Configuration
 * Implements font-display: swap and lazy loading strategies
 */

export const fontOptimizationConfig = {
  // Critical fonts - loaded immediately with swap strategy
  critical: {
    Inter: {
      weights: [400, 500, 600, 700],
      display: 'swap',
      preload: true,
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    'Space Grotesk': {
      weights: [400, 700],
      display: 'swap',
      preload: true,
      url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap',
    },
    Audiowide: {
      weights: [400],
      display: 'swap',
      preload: true,
      url: 'https://fonts.googleapis.com/css2?family=Audiowide&display=swap',
    },
  },

  // Secondary fonts - loaded asynchronously
  secondary: {
    Orbitron: {
      weights: [400, 700, 900],
      display: 'swap',
      preload: false,
      url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
    },
    'Space Mono': {
      weights: [400, 700],
      display: 'swap',
      preload: false,
      url: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
    },
    Michroma: {
      weights: [400],
      display: 'swap',
      preload: false,
      url: 'https://fonts.googleapis.com/css2?family=Michroma&display=swap',
    },
    Electrolize: {
      weights: [400],
      display: 'swap',
      preload: false,
      url: 'https://fonts.googleapis.com/css2?family=Electrolize&display=swap',
    },
    Rajdhani: {
      weights: [400, 500, 600, 700],
      display: 'swap',
      preload: false,
      url: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap',
    },
    Oxanium: {
      weights: [400, 600, 700, 800],
      display: 'swap',
      preload: false,
      url: 'https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&display=swap',
    },
    'Rubik Mono One': {
      weights: [400],
      display: 'swap',
      preload: false,
      url: 'https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap',
    },
  },

  // System font fallbacks
  fallbacks: {
    sansSerif:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    monospace: '"Courier New", Courier, monospace',
    serif: 'Georgia, serif',
  },

  // Font loading strategy
  strategy: {
    // Load critical fonts immediately
    criticalFontsImmediate: true,
    // Load secondary fonts on idle
    secondaryFontsOnIdle: true,
    // Preload critical font files
    preloadCritical: true,
    // Use font-display: swap for all fonts
    useSwapDisplay: true,
  },

  // Performance metrics
  metrics: {
    // Expected font load time reduction: 50-100ms
    expectedImprovement: '50-100ms',
    // Font loading should not block rendering
    blockRendering: false,
    // Use system fonts as fallback
    useFallbacks: true,
  },
};

/**
 * Load secondary fonts on idle
 * Improves perceived performance by deferring non-critical font loading
 */
export function loadSecondaryFonts(): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loadFontsAsync();
    });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
      loadFontsAsync();
    }, 2000);
  }
}

/**
 * Load fonts asynchronously
 */
function loadFontsAsync(): void {
  const secondaryFonts = fontOptimizationConfig.secondary;

  Object.entries(secondaryFonts).forEach(([fontName, fontConfig]) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontConfig.url;
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  });
}

/**
 * Initialize font optimization
 * Call this in your app initialization
 */
export function initializeFontOptimization(): void {
  // Load secondary fonts on idle
  if (fontOptimizationConfig.strategy.secondaryFontsOnIdle) {
    loadSecondaryFonts();
  }
}
