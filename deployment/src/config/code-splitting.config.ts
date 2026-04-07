/**
 * Code Splitting Configuration
 * Defines route-based code splitting strategy and chunk optimization
 */

export interface CodeSplitConfig {
  route: string;
  component: () => Promise<any>;
  chunkName: string;
  preload?: boolean;
  prefetch?: boolean;
}

/**
 * Route-based code splitting configuration
 * Each route is split into its own chunk for lazy loading
 */
export const CODE_SPLIT_ROUTES: CodeSplitConfig[] = [
  {
    route: '/showcase',
    component: () => import('../pages/ShowcasePage'),
    chunkName: 'showcase',
    prefetch: true,
  },
  {
    route: '/playground',
    component: () => import('../pages/InteractivePlayground'),
    chunkName: 'playground',
    prefetch: true,
  },
  {
    route: '/docs',
    component: () => import('../pages/DocsPage'),
    chunkName: 'docs',
    prefetch: false,
  },
  {
    route: '/coldwar',
    component: () => import('../pages/ColdWarShowcase'),
    chunkName: 'coldwar',
    prefetch: false,
  },
  {
    route: '/charts',
    component: () => import('../pages/ChartsShowcase'),
    chunkName: 'charts',
    prefetch: false,
  },
];

/**
 * Heavy component code splitting
 * Components that are large or not immediately needed
 */
export const HEAVY_COMPONENTS = {
  CodeEditor: () => import('@rhuds/components'),
  RichTextEditor: () => import('@rhuds/components'),
  DataGrid: () => import('@rhuds/components'),
  Chart: () => import('@rhuds/components'),
  BubbleChart: () => import('@rhuds/components'),
};

/**
 * Chunk size optimization targets
 * Helps identify which chunks need further optimization
 */
export const CHUNK_SIZE_TARGETS = {
  main: 50, // KB
  vendor: 100, // KB
  route: 30, // KB per route
  component: 20, // KB per component
};

/**
 * Prefetch strategy
 * Determines which chunks should be prefetched based on user behavior
 */
export const PREFETCH_STRATEGY = {
  // Prefetch on route hover
  onRouteHover: ['showcase', 'playground'],

  // Prefetch on idle time
  onIdle: ['docs', 'coldwar'],

  // Prefetch on network connection
  onFastConnection: ['charts'],
};

/**
 * Dynamic import helper with error handling
 */
export async function dynamicImport<T>(importFn: () => Promise<T>, fallback?: T): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    console.error('Failed to load dynamic module:', error);
    if (fallback) {
      return fallback;
    }
    throw error;
  }
}

export default CODE_SPLIT_ROUTES;
