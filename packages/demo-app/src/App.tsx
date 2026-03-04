import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, BleepsProvider, createAppTheme } from '@rhuds/core';
import { Text, Button, Stack } from '@rhuds/components';
import { ShowcasePage } from './pages/ShowcasePage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { DocsPage } from './pages/DocsPage';

// Create theme
const appTheme = createAppTheme({
  name: 'demo-theme',
  primaryColor: '#00f6ff',
  secondaryColor: '#7b61ff',
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
      surface: appTheme.colors.neutral.dark,
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

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.5)',
      borderBottom: '1px solid rgba(0, 246, 255, 0.3)',
      padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      flexWrap: 'wrap',
      gap: '1rem',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Text variant="h2" style={{ color: appTheme.colors.primary.main }}>
          🎮 RHUDS Pro
        </Text>
      </Link>
      <Stack direction="row" gap="1rem" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant={isActive('/') ? 'primary' : 'secondary'}>
            Showcase
          </Button>
        </Link>
        <Link to="/playground" style={{ textDecoration: 'none' }}>
          <Button variant={isActive('/playground') ? 'primary' : 'secondary'}>
            Playground
          </Button>
        </Link>
        <Link to="/docs" style={{ textDecoration: 'none' }}>
          <Button variant={isActive('/docs') ? 'primary' : 'secondary'}>
            Documentation
          </Button>
        </Link>
      </Stack>
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: appTheme.colors.background.main,
      color: appTheme.colors.text.main,
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    }}>
      <Navigation />
      <Routes>
        <Route path="/" element={<ShowcasePage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/:section" element={<DocsPage />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider themes={[themeMode]} defaultTheme="dark">
        <BleepsProvider>
          <AppContent />
        </BleepsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
