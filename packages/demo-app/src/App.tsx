import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// import { ThemeProvider, BleepsProvider, createAppTheme } from '@rhuds/core';
import { HudToastProvider } from '@rhuds/components';
import { useScrollToTop } from './hooks/useScrollToTop';
import { useFontOptimization } from './hooks/useFontOptimization';
import { usePrefetchChunk, usePrefetchOnConnection } from './hooks/useCodeSplitting';
import { useHttp2PushMonitoring, useConnectionAwarePush } from './hooks/useHttp2Push';
import {
  useAllResourceHints,
  usePreloadMonitoring,
  useConnectionAwarePreload,
} from './hooks/usePreloadPrefetch';
import {
  useAllResourceHintsOptimization,
  useResourceHintMonitoring,
  useConnectionAwareResourceHints,
} from './hooks/useResourceHintsOptimization';
import { usePerformanceAlerts } from './hooks/usePerformanceAlerts';
import { useMemoryMonitoring } from './hooks/useCustomMetrics';
// Phase 7 Week 1 - Advanced Caching & Edge Computing
import { useEdgeCaching } from './hooks/useEdgeCaching';
import { useAdvancedServiceWorker } from './hooks/useAdvancedServiceWorker';
import { useEdgePerformanceMonitoring } from './hooks/useEdgePerformanceMonitoring';
// Phase 7 Week 2 - Third-Party Script Optimization
import { useAnalyticsOptimization } from './hooks/useAnalyticsOptimization';
import { useAdNetworkOptimization } from './hooks/useAdNetworkOptimization';
import { useThirdPartyScriptManager } from './hooks/useThirdPartyScriptManager';
import { useThirdPartyPerformanceMonitoring } from './hooks/useThirdPartyPerformanceMonitoring';
// Phase 7 Week 3 - Advanced Optimization
import { useResourceOptimization } from './hooks/useResourceOptimization';
import { usePredictiveCaching } from './hooks/usePredictiveCaching';
import { useAdaptiveCaching } from './hooks/useAdaptiveCaching';
import { usePerformanceTuning } from './hooks/usePerformanceTuning';
import { Navbar } from './components/Navbar';
import PerformanceMetricsDashboard from './components/PerformanceMetricsDashboard';
import { registerServiceWorker } from './service-worker-register';
import './styles/global.css';
import './styles/cold-war-theme.css';

// Lazy load pages for code splitting
const ThemeSelector = lazy(() =>
  import('./pages/ThemeSelector').then((m) => ({ default: m.ThemeSelector }))
);
const IntroPageFuturistic = lazy(() => import('./pages/IntroPageFuturistic'));
const ColdWarIntro = lazy(() =>
  import('./pages/ColdWarIntro').then((m) => ({ default: m.ColdWarIntro }))
);
const ShowcasePage = lazy(() =>
  import('./pages/ShowcasePage').then((m) => ({ default: m.ShowcasePage }))
);
const InteractivePlayground = lazy(() => import('./pages/InteractivePlayground'));
const DocsPage = lazy(() => import('./pages/DocsPage').then((m) => ({ default: m.DocsPage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ColdWarPortfolioPage = lazy(() => import('./pages/ColdWarPortfolioPage'));
const ColdWarShowcase = lazy(() => import('./pages/ColdWarShowcase'));
const ColdWarPlayground = lazy(() => import('./pages/ColdWarPlayground'));
const ColdWarDocs = lazy(() => import('./pages/ColdWarDocs'));
const ChartsShowcase = lazy(() => import('./pages/ChartsShowcase'));
const ColdWarChartsPage = lazy(() =>
  import('./pages/ColdWarChartsPage').then((m) => ({ default: m.ColdWarChartsPage }))
);

// Create theme (simplified fallback)
const appTheme = {
  colors: {
    primary: { main: '#29F2DF' },
    secondary: { main: '#1C7FA6' },
    success: { main: '#00FF88' },
    warning: { main: '#FFB800' },
    error: { main: '#FF4444' },
    info: { main: '#00CCFF' },
    background: { main: '#0f0f1e' },
    text: { main: '#e0e0e0' },
  },
  units: {
    space: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40],
  },
  typography: {
    fontFamily: { primary: 'system-ui, -apple-system, sans-serif' },
    fontSize: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20 },
    fontWeight: { normal: 400, medium: 500, bold: 700 },
    lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.8 },
  },
};

// Create theme mode for ThemeProvider (simplified)
const themeMode = {
  name: 'dark' as const,
  tokens: {
    colors: {
      primary: appTheme.colors.primary.main,
      secondary: appTheme.colors.secondary.main,
      accent: appTheme.colors.primary.main,
      success: appTheme.colors.success.main,
      warning: appTheme.colors.warning.main,
      error: appTheme.colors.error.main,
      info: appTheme.colors.info.main,
      background: appTheme.colors.background.main,
      surface: '#28125A',
      text: appTheme.colors.text.main,
      border: 'rgba(41, 242, 223, 0.3)',
    },
    spacing: {
      '0': '0px',
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
    },
    typography: {
      fontFamily: appTheme.typography.fontFamily.primary,
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.8,
      },
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.1)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 15px rgba(0,0,0,0.1)',
    },
    transitions: {
      fast: '0.1s',
      normal: '0.2s',
      slow: '0.3s',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  // Use custom hook to scroll to top on route change
  useScrollToTop();

  // Initialize font optimization (load secondary fonts on idle)
  useFontOptimization();

  // Initialize HTTP/2 push monitoring
  useHttp2PushMonitoring();

  // Monitor connection changes for push strategy
  useConnectionAwarePush();

  // Apply all resource hints (preload, prefetch, preconnect, dns-prefetch)
  useAllResourceHints();

  // Initialize preload monitoring
  usePreloadMonitoring();

  // Monitor connection changes for preload strategy
  useConnectionAwarePreload();

  // Apply all resource hints optimization
  useAllResourceHintsOptimization();

  // Initialize resource hint monitoring
  useResourceHintMonitoring();

  // Monitor connection changes for resource hints
  useConnectionAwareResourceHints();

  // Initialize performance alerts
  usePerformanceAlerts(true);

  // Initialize memory monitoring
  useMemoryMonitoring(5000);

  // Phase 7 Week 1 - Advanced Caching & Edge Computing
  // Initialize edge caching with automatic cache warming
  useEdgeCaching({
    enabled: true,
    autoWarm: true,
    warmUrls: ['/', '/showcase', '/charts', '/coldwar-showcase', '/playground', '/docs'],
    pruneInterval: 60000,
  });

  // Initialize advanced service worker with all features
  useAdvancedServiceWorker({
    enabled: true,
    autoRegister: true,
    enableBackgroundSync: true,
    enablePushNotifications: true,
  });

  // Initialize edge performance monitoring
  useEdgePerformanceMonitoring({
    enabled: true,
    autoStart: true,
    snapshotInterval: 60000,
  });

  // Phase 7 Week 2 - Third-Party Script Optimization
  // Initialize analytics optimization
  useAnalyticsOptimization({
    enabled: true,
    trackPageViews: true,
    trackUserActions: true,
    autoFlush: true,
    flushInterval: 30000,
  });

  // Initialize ad network optimization
  useAdNetworkOptimization({
    enabled: true,
    lazyLoad: true,
    cacheAds: true,
    batchRequests: true,
  });

  // Initialize third-party script manager
  useThirdPartyScriptManager({
    enabled: true,
    autoLoad: false,
    loadByPriority: true,
  });

  // Initialize third-party performance monitoring
  useThirdPartyPerformanceMonitoring({
    enabled: true,
    autoStart: true,
    snapshotInterval: 60000,
  });

  // Phase 7 Week 3 - Advanced Optimization
  // Initialize resource optimization
  useResourceOptimization({
    enabled: true,
    autoOptimize: true,
    resetInterval: 300000,
  });

  // Initialize predictive caching
  usePredictiveCaching({
    enabled: true,
    autoRecord: true,
    recordInterval: 5000,
  });

  // Initialize adaptive caching based on network conditions
  useAdaptiveCaching({
    enabled: true,
    monitorInterval: 10000,
  });

  // Initialize performance tuning
  usePerformanceTuning({
    enabled: true,
    autoUpdate: true,
    updateInterval: 60000,
  });

  // Prefetch popular routes on idle
  usePrefetchChunk('route-showcase', 'idle');
  usePrefetchChunk('route-playground', 'idle');

  // Prefetch on fast connection
  usePrefetchOnConnection(['route-coldwar', 'route-charts']);

  // Register service worker on mount
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Loading component for lazy-loaded pages
  const LoadingSpinner = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#29F2DF',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textShadow: '0 0 10px rgba(41, 242, 223, 0.5)',
      }}
    >
      <p>Loading...</p>
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A1225',
        color: appTheme.colors.text.main,
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {showNavbar && <Navbar />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<ThemeSelector />} />
          <Route path="/intro" element={<IntroPageFuturistic />} />
          <Route path="/coldwar-intro" element={<ColdWarIntro />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/charts" element={<ChartsShowcase />} />
          <Route path="/coldwar-charts" element={<ColdWarChartsPage />} />
          <Route path="/coldwar-showcase" element={<ColdWarShowcase />} />
          <Route path="/coldwar-playground" element={<ColdWarPlayground />} />
          <Route path="/coldwar-docs" element={<ColdWarDocs />} />
          <Route path="/playground" element={<InteractivePlayground />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/docs/:section" element={<DocsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/coldwar-portfolio" element={<ColdWarPortfolioPage />} />
          {/* Legacy routes for backward compatibility */}
          <Route path="/cold-war" element={<ColdWarShowcase />} />
          <Route path="/cold-war/playground" element={<ColdWarPlayground />} />
          <Route path="/cold-war/docs" element={<ColdWarDocs />} />
        </Routes>
      </Suspense>
      <PerformanceMetricsDashboard />
    </div>
  );
};

AppContent.displayName = 'AppContent';

const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* ThemeProvider and BleepsProvider commented out - not available */}
      {/* <ThemeProvider themes={[themeMode]} defaultTheme="dark">
        <BleepsProvider> */}
      <HudToastProvider maxToasts={5}>
        <AppContent />
      </HudToastProvider>
      {/* </BleepsProvider>
      </ThemeProvider> */}
    </BrowserRouter>
  );
};

export default App;
