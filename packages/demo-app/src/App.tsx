import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, BleepsProvider, createAppTheme } from '@rhuds/core';
import { HudToastProvider } from '@rhuds/components';
import IntroPageFuturistic from './pages/IntroPageFuturistic';
import { ShowcasePage } from './pages/ShowcasePage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { DocsPage } from './pages/DocsPage';
import PortfolioPage from './pages/PortfolioPage';
import { Navbar } from './components/Navbar';
import './styles/global.css';

// Create theme
const appTheme = createAppTheme({
  name: 'demo-theme',
  primaryColor: '#29F2DF',
  secondaryColor: '#1C7FA6',
});

// Create theme mode for ThemeProvider
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
      border: appTheme.colors.primary.alpha(0.3),
    },
    spacing: {
      '0': `${appTheme.units.space[0]}px`,
      '1': `${appTheme.units.space[1]}px`,
      '2': `${appTheme.units.space[2]}px`,
      '3': `${appTheme.units.space[3]}px`,
      '4': `${appTheme.units.space[4]}px`,
      '5': `${appTheme.units.space[5]}px`,
      '6': `${appTheme.units.space[6]}px`,
      '7': `${appTheme.units.space[7]}px`,
      '8': `${appTheme.units.space[8]}px`,
      '9': `${appTheme.units.space[9]}px`,
      '10': `${appTheme.units.space[10]}px`,
    },
    typography: {
      fontFamily: appTheme.typography.fontFamily.primary,
      fontSize: {
        xs: appTheme.typography.fontSize.xs,
        sm: appTheme.typography.fontSize.sm,
        base: appTheme.typography.fontSize.base,
        lg: appTheme.typography.fontSize.lg,
        xl: appTheme.typography.fontSize.xl,
      },
      fontWeight: {
        normal: appTheme.typography.fontWeight.normal,
        medium: appTheme.typography.fontWeight.medium,
        bold: appTheme.typography.fontWeight.bold,
      },
      lineHeight: {
        tight: appTheme.typography.lineHeight.tight,
        normal: appTheme.typography.lineHeight.normal,
        relaxed: appTheme.typography.lineHeight.relaxed,
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
      <Navbar />
      <Routes>
        <Route path="/" element={<IntroPageFuturistic />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/:section" element={<DocsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Routes>
    </div>
  );
};

AppContent.displayName = 'AppContent';

const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider themes={[themeMode]} defaultTheme="dark">
        <BleepsProvider>
          <HudToastProvider maxToasts={5}>
            <AppContent />
          </HudToastProvider>
        </BleepsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
