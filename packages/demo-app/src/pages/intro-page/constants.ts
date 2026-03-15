/**
 * Constants for intro page animations, colors, and responsive breakpoints
 */

import type { AnimationConfig, ColorPalette, TypographyScale, SpacingScale } from './types';

/**
 * Animation timing configuration
 * Defines delays, durations, and sequencing for all animations
 */
export const ANIMATION_CONFIG: AnimationConfig = {
  // Hero section animation
  heroDelay: 200, // ms - delay before hero frame animates
  heroDuration: 1500, // ms - duration of hero frame animation

  // Feature cards animation
  cardsStartDelay: 1700, // ms - delay before feature cards start animating
  cardStaggerInterval: 150, // ms - delay between each card animation
  cardDuration: 1200, // ms - duration of each card animation

  // Background animation
  backgroundDuration: Infinity, // infinite loop
  backgroundSpeed: 1.0, // 0.5 - 2.0 range

  // Total sequence
  totalDuration: 3000, // ms - total animation sequence duration
};

/**
 * Arwes color palette
 * Primary colors: cyan and magenta
 * Background: black
 */
export const COLOR_PALETTE: ColorPalette = {
  // Primary colors
  background: '#000000',
  primary: 'rgba(41, 242, 223, 1)', // Cyan
  secondary: 'rgba(239, 62, 241, 1)', // Magenta

  // Text colors
  textPrimary: 'rgba(41, 242, 223, 1)', // Cyan
  textSecondary: 'rgba(41, 242, 223, 0.8)', // Cyan 80%
  textTertiary: 'rgba(41, 242, 223, 0.6)', // Cyan 60%

  // Accent colors
  accentBlue: 'rgba(0, 150, 255, 1)',
  accentGreen: 'rgba(0, 255, 150, 1)',

  // Glow colors
  glowCyan: 'rgba(41, 242, 223, 0.8)',
  glowMagenta: 'rgba(239, 62, 241, 0.8)',
};

/**
 * Typography scale with responsive sizing
 * Uses clamp() for fluid typography across breakpoints
 */
export const TYPOGRAPHY_SCALE: TypographyScale = {
  h1: {
    fontSize: 'clamp(40px, 8vw, 72px)',
    fontFamily: 'monospace',
    fontWeight: 700,
    color: 'rgba(41, 242, 223, 1)',
    textShadow: '0 0 20px rgba(41, 242, 223, 0.6)',
  },
  h2: {
    fontSize: 'clamp(28px, 5vw, 48px)',
    fontFamily: 'monospace',
    fontWeight: 600,
    color: 'rgba(41, 242, 223, 1)',
  },
  h3: {
    fontSize: 'clamp(20px, 3vw, 32px)',
    fontFamily: 'monospace',
    fontWeight: 600,
    color: 'rgba(41, 242, 223, 1)',
  },
  body: {
    fontSize: 'clamp(14px, 2vw, 18px)',
    fontFamily: 'monospace',
    fontWeight: 400,
    color: 'rgba(41, 242, 223, 0.8)',
    lineHeight: 1.6,
  },
  caption: {
    fontSize: 'clamp(12px, 1.5vw, 14px)',
    fontFamily: 'monospace',
    fontWeight: 400,
    color: 'rgba(41, 242, 223, 0.6)',
  },
};

/**
 * Responsive spacing scale
 * Mobile-first approach with progressive enhancement
 */
export const SPACING_SCALE: SpacingScale = {
  mobile: {
    containerPadding: '16px',
    sectionGap: '16px',
    cardGap: '12px',
    heroMarginBottom: '32px',
  },
  tablet: {
    containerPadding: '24px',
    sectionGap: '24px',
    cardGap: '20px',
    heroMarginBottom: '48px',
  },
  desktop: {
    containerPadding: '32px',
    sectionGap: '32px',
    cardGap: '24px',
    heroMarginBottom: '64px',
  },
};

/**
 * Responsive breakpoints (in pixels)
 */
export const BREAKPOINTS = {
  mobile: 320,
  mobileLarge: 480,
  tablet: 768,
  tabletLarge: 1024,
  desktop: 1024,
  desktopLarge: 1440,
  desktopXL: 2560,
} as const;

/**
 * Media query strings for responsive design
 */
export const MEDIA_QUERIES = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  touchDevice: '(hover: none) and (pointer: coarse)',
} as const;

/**
 * Frame component configuration
 */
export const FRAME_CONFIG = {
  // Hero section frame
  heroSquareSize: 20,
  heroPadding: 6,

  // Feature card frames
  cardSquareSize: 16,
  cardPadding: 4,

  // Frame animation
  animationDuration: 1500,
  animationDelay: 0,
} as const;

/**
 * Background animation configuration
 */
export const BACKGROUND_CONFIG = {
  // Particle counts
  particleCountMobile: 25,
  particleCountTablet: 50,
  particleCountDesktop: 100,

  // Opacity range
  minOpacity: 0.1,
  maxOpacity: 0.3,
  defaultOpacity: 0.15,

  // Animation speed
  minSpeed: 0.5,
  maxSpeed: 2.0,
  defaultSpeed: 1.0,
} as const;

/**
 * Touch target minimum size (in pixels)
 * WCAG 2.1 Level AAA recommendation
 */
export const TOUCH_TARGET_SIZE = 44;

/**
 * Z-index layering
 */
export const Z_INDEX = {
  background: 0,
  content: 10,
  navigation: 100,
  modal: 1000,
} as const;

/**
 * Default feature cards data
 */
export const DEFAULT_FEATURES: Array<{
  id: string;
  title: string;
  description: string;
}> = [
  {
    id: 'components',
    title: '50+ Components',
    description: 'Comprehensive collection of Arwes-styled UI components for React',
  },
  {
    id: 'frames',
    title: 'Arwes Frames',
    description: 'Animated SVG frames with assembling animations and glow effects',
  },
  {
    id: 'typescript',
    title: 'TypeScript Support',
    description: 'Fully typed components with excellent IDE support and type safety',
  },
];

/**
 * Navigation links
 */
export const DEFAULT_NAV_LINKS = [
  { label: 'Components', route: '/components' },
  { label: 'Playground', route: '/playground' },
  { label: 'Documentation', route: '/docs' },
  { label: 'GitHub', route: 'https://github.com/rhuds' },
];

/**
 * Quick Install section data
 */
export const QUICK_INSTALL_STEPS = [
  {
    id: 'npm',
    title: 'npm',
    command: 'npm install @rhuds/core @rhuds/components',
  },
  {
    id: 'yarn',
    title: 'yarn',
    command: 'yarn add @rhuds/core @rhuds/components',
  },
  {
    id: 'pnpm',
    title: 'pnpm',
    command: 'pnpm add @rhuds/core @rhuds/components',
  },
];

/**
 * Performance metrics data
 */
export const PERFORMANCE_METRICS = [
  {
    id: 'bundle-size',
    label: 'Bundle Size',
    value: '45KB',
    unit: 'gzipped',
  },
  {
    id: 'performance',
    label: 'Performance',
    value: '98',
    unit: 'Lighthouse',
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    value: '100',
    unit: 'WCAG AA',
  },
  {
    id: 'components',
    label: 'Components',
    value: '50+',
    unit: 'ready to use',
  },
];

/**
 * Library comparison data
 */
export const LIBRARY_COMPARISON = [
  {
    feature: 'Arwes Frames',
    rhuds: true,
    material: false,
    chakra: false,
  },
  {
    feature: 'Sci-Fi Theme',
    rhuds: true,
    material: false,
    chakra: false,
  },
  {
    feature: 'TypeScript',
    rhuds: true,
    material: true,
    chakra: true,
  },
  {
    feature: 'Accessibility',
    rhuds: true,
    material: true,
    chakra: true,
  },
  {
    feature: 'Customizable',
    rhuds: true,
    material: true,
    chakra: true,
  },
];

/**
 * Theme options
 */
export const THEME_OPTIONS = [
  {
    id: 'dark',
    name: 'Dark Cyberpunk',
    description: 'Default dark theme with cyan and magenta accents',
    colors: {
      primary: '#29F2DF',
      secondary: '#EF3EF1',
      background: '#000000',
    },
  },
  {
    id: 'light',
    name: 'Light Neon',
    description: 'Light theme with vibrant neon colors',
    colors: {
      primary: '#0066FF',
      secondary: '#FF00FF',
      background: '#FFFFFF',
    },
  },
  {
    id: 'matrix',
    name: 'Matrix Green',
    description: 'Matrix-inspired green monochrome theme',
    colors: {
      primary: '#00FF00',
      secondary: '#00AA00',
      background: '#000000',
    },
  },
];

/**
 * Project roadmap items
 */
export const PROJECT_ROADMAP = [
  {
    id: 'q1-2024',
    quarter: 'Q1 2024',
    items: ['Core component library launch', 'TypeScript support', 'Initial documentation'],
  },
  {
    id: 'q2-2024',
    quarter: 'Q2 2024',
    items: ['Advanced animations', 'Theme customization', 'Accessibility improvements'],
  },
  {
    id: 'q3-2024',
    quarter: 'Q3 2024',
    items: ['WebGL components', 'Performance optimization', 'Community feedback integration'],
  },
  {
    id: 'q4-2024',
    quarter: 'Q4 2024',
    items: ['Mobile optimization', 'Plugin system', 'Enterprise features'],
  },
];
