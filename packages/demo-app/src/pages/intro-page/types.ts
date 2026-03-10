/**
 * TypeScript interfaces for intro page components
 * Defines prop types for all intro page components
 */

/**
 * Props for the main IntroPage component
 */
export interface IntroPageProps {
  onNavigate?: (route: string) => void;
  animationEnabled?: boolean;
  theme?: 'dark' | 'light';
}

/**
 * Props for the HeroSection component
 */
export interface HeroSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  frameType?: 'kranox' | 'nefrex';
  onCTAClick?: (action: 'primary' | 'secondary') => void;
  animationDelay?: number;
}

/**
 * Props for individual FeatureCard component
 */
export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  frameType?: 'octagon' | 'corners';
  animationDelay?: number;
  onHover?: () => void;
}

/**
 * Data structure for feature card information
 */
export interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  frameType?: 'octagon' | 'corners';
}

/**
 * Props for the FeatureCardsGrid component
 */
export interface FeatureCardsGridProps {
  features: FeatureCardData[];
  columns?: 'auto' | 1 | 2 | 3;
  animationDelay?: number;
  staggerInterval?: number;
}

/**
 * Props for the AnimatedBackground component
 */
export interface AnimatedBackgroundProps {
  type?: 'particles' | 'grid' | 'hybrid';
  opacity?: number;
  color?: string;
  particleCount?: number;
  animationSpeed?: number;
}

/**
 * Props for the Navigation component
 */
export interface NavigationProps {
  links?: NavLink[];
  onNavigate?: (route: string) => void;
}

/**
 * Navigation link data structure
 */
export interface NavLink {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

/**
 * Animation configuration for the intro page
 */
export interface AnimationConfig {
  heroDelay: number;
  heroDuration: number;
  cardsStartDelay: number;
  cardStaggerInterval: number;
  cardDuration: number;
  backgroundDuration: number;
  backgroundSpeed: number;
  totalDuration: number;
}

/**
 * Color palette for the intro page
 */
export interface ColorPalette {
  background: string;
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accentBlue: string;
  accentGreen: string;
  glowCyan: string;
  glowMagenta: string;
}

/**
 * Typography scale configuration
 */
export interface TypographyScale {
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  body: TypographyStyle;
  caption: TypographyStyle;
}

/**
 * Individual typography style configuration
 */
export interface TypographyStyle {
  fontSize: string;
  fontFamily: string;
  fontWeight: number;
  color: string;
  textShadow?: string;
  lineHeight?: number;
}

/**
 * Spacing scale for responsive design
 */
export interface SpacingScale {
  mobile: SpacingValues;
  tablet: SpacingValues;
  desktop: SpacingValues;
}

/**
 * Individual spacing values for a breakpoint
 */
export interface SpacingValues {
  containerPadding: string;
  sectionGap: string;
  cardGap: string;
  heroMarginBottom: string;
}
