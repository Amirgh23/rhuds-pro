/**
 * Cold War Redesign - Showcase Page
 * Demonstrates the tactical military aesthetic across all components
 */

import React from 'react';
import { ColdWarButton } from '@rhuds/components';
import { ColdWarInput } from '@rhuds/components';
import { ColdWarCard } from '@rhuds/components';
import { ColdWarBubbleChartStyled } from '../../../components/src/Visualization';
import { TacticalMotionBackground } from '../components/TacticalMotionBackground';
import { ColdWarContextMenu } from '../components/ColdWarContextMenu';
import { useColdWarContextMenu } from '../hooks/useColdWarContextMenu';
// Background Components
import {
  ColdWarGridLines,
  ColdWarRadar as ColdWarRadarBg,
  ColdWarScanlines,
  ColdWarParticles,
  ColdWarNoise,
  ColdWarMatrix,
  ColdWarHexGrid,
  ColdWarWaveform,
  ColdWarCircuit,
  ColdWarSonar,
  ColdWarSatellite,
  ColdWarTerminal,
  ColdWarTacticalMap,
  type ColdWarTheme,
  type ColdWarIntensity,
} from '@rhuds/backgrounds';
// Form Controls
import {
  ColdWarCheckbox,
  ColdWarRadio,
  ColdWarSwitch,
  ColdWarNeonSlider,
  ColdWarSlider,
  ColdWarHoloCheckbox,
  ColdWarCyberpunkCheckbox,
  ColdWarBubbleCheckbox,
  ColdWarNeonCheckbox,
  ColdWarGlowingCheckbox,
  ColdWarGlitchRadio,
  ColdWarCyberpunkRadio,
  ColdWarNeonRadio,
  ColdWarToggleSwitch,
  ColdWarCyberpunkToggle,
  ColdWarLockSwitch,
} from '@rhuds/components';
// Layout & Cards
import {
  ColdWarHudBox,
  ColdWarGrid,
  ColdWarStack,
  ColdWarGlitchFrame,
  ColdWarHudFrame,
  ColdWarCyberCard,
  ColdWarThermostatCard,
  ColdWarProfileCard,
} from '@rhuds/components';
// Data Display
import {
  ColdWarTable,
  ColdWarDataGrid,
  ColdWarPipBoy,
  ColdWarRadar,
  ColdWarAmplifier,
  ColdWarMediaPlayer,
  ColdWarNotificationCard,
  ColdWarHudNotificationCard,
  ColdWarTerminalSelector,
} from '@rhuds/components';
// Navigation
import {
  ColdWarTabs,
  ColdWarBreadcrumb,
  ColdWarSidebar,
  ColdWarMenu,
  ColdWarPagination,
} from '@rhuds/components';
// Feedback & Loaders
import {
  ColdWarAlert,
  ColdWarProgressBar,
  ColdWarAbstergoLoader,
  ColdWarHeartRateLoader,
  ColdWarHackerLoader,
  ColdWarBinaryLoader,
  ColdWarCubeLoader,
  ColdWarProgressLoader,
  ColdWarBinaryHackerLoader,
  ColdWarMatrixLoader,
  ColdWarScrollingLoader,
  ColdWarLoadingText,
  ColdWarWaveLoader,
} from '@rhuds/components';
// Advanced
import {
  ColdWarCodeEditor,
  ColdWarRichEditor,
  ColdWarAccordion,
  ColdWarCarousel,
  ColdWarStepper,
} from '@rhuds/components';
// Utility & Specialized
import {
  ColdWarTooltip,
  ColdWarPopover,
  ColdWarDropdown,
  ColdWarSupportTooltip,
  ColdWarDatePicker,
  ColdWarColorPicker,
  ColdWarFileUpload,
} from '@rhuds/components';
// Visualization & Forms
import {
  ColdWarChart,
  ColdWarLoginForm,
  ColdWarCyberLoginForm,
  ColdWarAnimatedLoginForm,
} from '@rhuds/components';
import '../styles/cold-war-theme.css';

type ThemeVariant = 'perseus' | 'greenTerminal' | 'satelliteView';

// Helper component for organizing component sections
interface ComponentSectionProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const ComponentSection: React.FC<ComponentSectionProps> = ({ title, children, style }) => (
  <div style={style}>
    <h3
      style={{
        fontSize: 'var(--cw-font-size-lg)',
        fontWeight: 700,
        letterSpacing: 'var(--cw-letter-spacing-headers)',
        textTransform: 'uppercase',
        color: 'var(--cw-color-primary)',
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--cw-color-primary)',
      }}
    >
      {title}
    </h3>
    {children}
  </div>
);

interface ThemeConfig {
  name: string;
  description: string;
  buttonVariant: 'primary' | 'secondary' | 'danger' | 'success' | 'tactical' | 'glitch';
  cardColor: 'amber' | 'green' | 'blue' | 'red' | 'neutral';
  inputVariant: 'tactical' | 'terminal' | 'holo' | 'glitch' | 'minimal';
}

const THEME_CONFIGS: Record<ThemeVariant, ThemeConfig> = {
  perseus: {
    name: 'Perseus',
    description: 'Tactical Amber & Black - Primary military aesthetic',
    buttonVariant: 'primary',
    cardColor: 'amber',
    inputVariant: 'tactical',
  },
  greenTerminal: {
    name: 'Green Terminal',
    description: 'Phosphor Green & Black - Retro terminal style',
    buttonVariant: 'primary',
    cardColor: 'green',
    inputVariant: 'terminal',
  },
  satelliteView: {
    name: 'Satellite View',
    description: 'Satellite Blue & White - Radar view aesthetic',
    buttonVariant: 'primary',
    cardColor: 'blue',
    inputVariant: 'holo',
  },
};

export const ColdWarShowcase: React.FC = () => {
  const [theme, setTheme] = React.useState<ThemeVariant>('perseus');
  const [activeTab, setActiveTab] = React.useState(0);
  const [inputValue, setInputValue] = React.useState('');
  const [selectedButton, setSelectedButton] = React.useState<string | null>(null);
  const [bgTheme, setBgTheme] = React.useState<ColdWarTheme>('perseus');
  const [bgIntensity, setBgIntensity] = React.useState<ColdWarIntensity>('medium');
  const { contextMenu, handleContextMenu, handleCloseContextMenu } = useColdWarContextMenu();
  const themeConfig = THEME_CONFIGS[theme];

  // Scroll to top when tab changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

  // Tab items configuration
  const tabItems = [
    { label: 'Buttons & Inputs', id: 0 },
    { label: 'Form Controls', id: 1 },
    { label: 'Layout & Cards', id: 2 },
    { label: 'Data Display', id: 3 },
    { label: 'Navigation', id: 4 },
    { label: 'Feedback & Loaders', id: 5 },
    { label: 'Advanced', id: 6 },
    { label: 'Utility & Specialized', id: 7 },
    { label: 'Visualization & Forms', id: 8 },
    { label: 'Background Animation', id: 9 },
  ];

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: 'var(--cw-color-background)',
    color: 'var(--cw-color-text)',
    fontFamily: 'var(--cw-font-family)',
    padding: '48px',
    position: 'relative',
    zIndex: 1,
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '48px',
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--cw-font-size-2xl)',
    fontWeight: 700,
    letterSpacing: 'var(--cw-letter-spacing-headers)',
    textTransform: 'uppercase',
    color: 'var(--cw-color-primary)',
    marginBottom: '16px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 'var(--cw-font-size-lg)',
    color: 'var(--cw-color-text-secondary)',
    letterSpacing: 'var(--cw-letter-spacing-body)',
  };

  const themeControlStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '48px',
    flexWrap: 'wrap',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '64px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 'var(--cw-font-size-xl)',
    fontWeight: 700,
    letterSpacing: 'var(--cw-letter-spacing-headers)',
    textTransform: 'uppercase',
    color: 'var(--cw-color-primary)',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: '2px solid var(--cw-color-primary)',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  };

  const featureBoxStyle: React.CSSProperties = {
    padding: '24px',
    backgroundColor: 'var(--cw-color-surface)',
    border: '1px solid var(--cw-color-primary)',
    clipPath: 'var(--cw-chamfer-medium)',
    textAlign: 'center',
  };

  return (
    <div style={pageStyle} data-theme={theme}>
      <TacticalMotionBackground variant={theme === 'satelliteView' ? 'satellite' : 'perimeter'} />
      {contextMenu && (
        <ColdWarContextMenu x={contextMenu.x} y={contextMenu.y} onClose={handleCloseContextMenu} />
      )}
      <div onContextMenu={handleContextMenu}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Cold War Tactical HUD</h1>
          <p style={subtitleStyle}>Call of Duty: Black Ops Aesthetic for RHUDS Pro</p>
        </div>

        {/* Theme Selector */}
        <div style={themeControlStyle}>
          {(['perseus', 'greenTerminal', 'satelliteView'] as const).map((t) => (
            <ColdWarButton
              key={t}
              theme={t}
              variant={theme === t ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setTheme(t)}
            >
              {THEME_CONFIGS[t].name}
            </ColdWarButton>
          ))}
        </div>

        {/* Tab Navigation */}
        <div style={themeControlStyle}>
          {tabItems.map((tab) => (
            <ColdWarButton
              key={tab.id}
              theme={theme}
              variant={activeTab === tab.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              glow={activeTab === tab.id}
            >
              {tab.label}
            </ColdWarButton>
          ))}
        </div>

        {/* Tab Content - Only render active tab */}
        {activeTab === 0 && (
          <>
            {/* Features Section */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Key Features</h2>
              <div style={gridStyle}>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>Chamfered Corners</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    Tactical clip-path geometry for military aesthetic
                  </p>
                </div>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>Tactical Colors</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    Amber, Green, Red with WCAG AAA contrast
                  </p>
                </div>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>CRT Effects</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    Scanlines, glow, flicker, and noise overlays
                  </p>
                </div>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>Monospace Typography</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    Share Tech Mono with uppercase text transform
                  </p>
                </div>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>Tactical Animations</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    Mechanical easing curves and 150-300ms timing
                  </p>
                </div>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>Accessibility</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    Full WCAG 2.1 AA compliance with reduced motion
                  </p>
                </div>
              </div>
            </div>

            {/* Components Section */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Components</h2>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Buttons - All Variants
              </h3>
              <div style={gridStyle}>
                {(['primary', 'secondary', 'danger', 'success', 'tactical', 'glitch'] as const).map(
                  (variant) => (
                    <ColdWarButton
                      key={variant}
                      theme={theme}
                      variant={variant}
                      size="md"
                      onClick={() => setSelectedButton(variant)}
                      glow={true}
                      scanlines={false}
                      style={{
                        opacity: selectedButton === null || selectedButton === variant ? 1 : 0.6,
                      }}
                    >
                      {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </ColdWarButton>
                  )
                )}
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Buttons - Sizes & States
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '12px',
                }}
              >
                <ColdWarButton theme={theme} variant="primary" size="sm">
                  Small
                </ColdWarButton>
                <ColdWarButton theme={theme} variant="primary" size="md">
                  Medium
                </ColdWarButton>
                <ColdWarButton theme={theme} variant="primary" size="lg">
                  Large
                </ColdWarButton>
                <ColdWarButton theme={theme} variant="primary" disabled>
                  Disabled
                </ColdWarButton>
                <ColdWarButton theme={theme} variant="primary" isLoading>
                  Loading
                </ColdWarButton>
                <ColdWarButton theme={theme} variant="primary" glow={true} scanlines={true}>
                  Scanlines
                </ColdWarButton>
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Buttons - With Icons
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                }}
              >
                <ColdWarButton theme={theme} variant="primary" leftIcon={<span>▶</span>}>
                  Left Icon
                </ColdWarButton>
                <ColdWarButton theme={theme} variant="secondary" rightIcon={<span>◀</span>}>
                  Right Icon
                </ColdWarButton>
                <ColdWarButton
                  theme={theme}
                  variant="tactical"
                  leftIcon={<span>⚡</span>}
                  rightIcon={<span>⚡</span>}
                >
                  Both Icons
                </ColdWarButton>
                <ColdWarButton
                  theme={theme}
                  variant="success"
                  leftIcon={<span>✓</span>}
                  iconPlacement="only"
                >
                  Icon
                </ColdWarButton>
                <ColdWarButton theme={theme} variant="danger" leftIcon={<span>✗</span>} glow={true}>
                  Glow + Icon
                </ColdWarButton>
                <ColdWarButton
                  theme={theme}
                  variant="glitch"
                  leftIcon={<span>⚠</span>}
                  scanlines={true}
                >
                  Scanlines + Icon
                </ColdWarButton>
              </div>
              {selectedButton && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '16px',
                    backgroundColor: 'var(--cw-color-surface)',
                    border: '1px solid var(--cw-color-primary)',
                    clipPath: 'var(--cw-chamfer-small)',
                    fontSize: 'var(--cw-font-size-sm)',
                    color: 'var(--cw-color-text-secondary)',
                  }}
                >
                  Selected:{' '}
                  <span style={{ color: 'var(--cw-color-primary)', fontWeight: 'bold' }}>
                    {selectedButton}
                  </span>
                </div>
              )}

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Inputs - All Variants
              </h3>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}
              >
                <ColdWarInput
                  theme={theme}
                  variant={themeConfig.inputVariant}
                  size="lg"
                  label="Theme Input"
                  placeholder="Enter text..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  glow={true}
                  scanlines={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  size="md"
                  label="Tactical Input"
                  placeholder="Tactical mode..."
                  glow={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant="terminal"
                  size="md"
                  label="Terminal Input"
                  placeholder="Terminal mode..."
                  glow={true}
                  scanlines={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant="holo"
                  size="md"
                  label="Holo Input"
                  placeholder="Holographic..."
                  glow={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant="glitch"
                  size="md"
                  label="Glitch Input"
                  placeholder="Glitch effect..."
                  glow={true}
                  scanlines={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant="minimal"
                  size="sm"
                  label="Minimal Input"
                  placeholder="Minimal style..."
                />
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Inputs - States
              </h3>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}
              >
                <ColdWarInput
                  theme={theme}
                  variant={themeConfig.inputVariant}
                  size="md"
                  label="Success State"
                  placeholder="Success..."
                  state="success"
                  successMessage="✓ Input valid"
                  glow={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant={themeConfig.inputVariant}
                  size="md"
                  label="Error State"
                  placeholder="Error..."
                  state="error"
                  errorMessage="✗ Invalid input"
                  glow={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant={themeConfig.inputVariant}
                  size="md"
                  label="Disabled State"
                  placeholder="Disabled..."
                  disabled={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant={themeConfig.inputVariant}
                  size="md"
                  label="Focus State"
                  placeholder="Click to focus..."
                  state="focus"
                  glow={true}
                />
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Inputs - With Icons
              </h3>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}
              >
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  size="md"
                  label="Left Icon"
                  placeholder="Search..."
                  leftIcon={<span>🔍</span>}
                  iconPlacement="left"
                  glow={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  size="md"
                  label="Right Icon"
                  placeholder="Username..."
                  rightIcon={<span>👤</span>}
                  iconPlacement="right"
                  glow={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  size="md"
                  label="Both Icons"
                  placeholder="Email..."
                  leftIcon={<span>📧</span>}
                  rightIcon={<span>✓</span>}
                  iconPlacement="both"
                  glow={true}
                />
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Inputs - Different Types
              </h3>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}
              >
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  size="md"
                  label="Password Input"
                  placeholder="Enter password..."
                  type="password"
                  leftIcon={<span>🔒</span>}
                  glow={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  size="md"
                  label="Email Input"
                  placeholder="user@example.com"
                  type="email"
                  leftIcon={<span>📧</span>}
                  glow={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  size="md"
                  label="Number Input"
                  placeholder="Enter number..."
                  type="number"
                  leftIcon={<span>#</span>}
                  glow={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  size="md"
                  label="Date Input"
                  placeholder="Select date..."
                  type="date"
                  leftIcon={<span>📅</span>}
                  glow={true}
                />
              </div>
              {inputValue && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '16px',
                    backgroundColor: 'var(--cw-color-surface)',
                    border: '1px solid var(--cw-color-primary)',
                    clipPath: 'var(--cw-chamfer-small)',
                    fontSize: 'var(--cw-font-size-sm)',
                    color: 'var(--cw-color-text-secondary)',
                  }}
                >
                  Input Value:{' '}
                  <span style={{ color: 'var(--cw-color-primary)', fontWeight: 'bold' }}>
                    {inputValue}
                  </span>
                </div>
              )}

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Cards - All Variants
              </h3>
              <div style={gridStyle}>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color={themeConfig.cardColor}
                  header="Theme Card"
                  elevation="high"
                  glow={true}
                  scanlines={true}
                >
                  {themeConfig.description}
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="glass"
                  color="amber"
                  header="Glass"
                  elevation="medium"
                  glow={true}
                >
                  Glass morphism effect with transparency
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="notification"
                  color="green"
                  header="Notification"
                  elevation="low"
                  glow={true}
                >
                  Notification style with left border accent
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="data"
                  color="blue"
                  header="Data"
                  elevation="medium"
                  glow={true}
                >
                  Data display with minimal styling
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="minimal"
                  color="red"
                  header="Minimal"
                  elevation="none"
                  glow={false}
                >
                  Minimal style with border only
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color={themeConfig.cardColor}
                  header="Scanlines"
                  scanlines={true}
                  scanlinesIntensity="high"
                >
                  Card with scanlines effect
                </ColdWarCard>
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Cards - With Footer
              </h3>
              <div style={gridStyle}>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="amber"
                  header="Mission Briefing"
                  footer="CLASSIFIED - TOP SECRET"
                  elevation="medium"
                  glow={true}
                >
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Operation Perseus: Infiltrate enemy base and retrieve classified documents. Time
                    window: 0300-0500 hours.
                  </p>
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="data"
                  color="green"
                  header="System Status"
                  footer="Last updated: 23:45:12"
                  elevation="low"
                  glow={true}
                >
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    All systems operational. Network connectivity: 100%. Security level: Maximum.
                  </p>
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="notification"
                  color="red"
                  header="Alert"
                  footer="Priority: URGENT"
                  elevation="high"
                  glow={true}
                >
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Unauthorized access detected. Initiating security protocols.
                  </p>
                </ColdWarCard>
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Cards - Interactive
              </h3>
              <div style={gridStyle}>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="amber"
                  header="Clickable Card"
                  elevation="medium"
                  glow={true}
                  onClick={() => alert('Card clicked!')}
                  hoverable={true}
                >
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Click this card to trigger an action. Hover to see the effect.
                  </p>
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="glass"
                  color="blue"
                  header="Hoverable Card"
                  elevation="low"
                  glow={true}
                  hoverable={true}
                >
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Hover over this card to see the interactive effect.
                  </p>
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="neutral"
                  header="Non-Hoverable"
                  elevation="medium"
                  glow={false}
                  hoverable={false}
                >
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    This card does not respond to hover events.
                  </p>
                </ColdWarCard>
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Cards - Elevations
              </h3>
              <div style={gridStyle}>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color={themeConfig.cardColor}
                  header="No Elevation"
                  elevation="none"
                >
                  Flat card with no shadow
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color={themeConfig.cardColor}
                  header="Low Elevation"
                  elevation="low"
                >
                  Subtle shadow effect
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color={themeConfig.cardColor}
                  header="Medium Elevation"
                  elevation="medium"
                >
                  Standard shadow effect
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color={themeConfig.cardColor}
                  header="High Elevation"
                  elevation="high"
                >
                  Strong shadow effect
                </ColdWarCard>
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Cards - All Colors
              </h3>
              <div style={gridStyle}>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="amber"
                  header="Amber"
                  elevation="medium"
                  glow={true}
                >
                  Tactical amber accent
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="green"
                  header="Green"
                  elevation="medium"
                  glow={true}
                >
                  Success green accent
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="blue"
                  header="Blue"
                  elevation="medium"
                  glow={true}
                >
                  Information blue accent
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="red"
                  header="Red"
                  elevation="medium"
                  glow={true}
                >
                  Error red accent
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="neutral"
                  header="Neutral"
                  elevation="medium"
                  glow={false}
                >
                  Neutral gray accent
                </ColdWarCard>
              </div>
            </div>

            {/* Bubble Chart Visualization Section */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Tactical Data Visualization</h2>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Threat Assessment Matrix
              </h3>
              <div style={{ marginBottom: '24px' }}>
                <ColdWarBubbleChartStyled
                  data={[
                    { x: 15, y: 85, r: 25, label: 'Alpha', color: '#FF3333' },
                    { x: 35, y: 65, r: 20, label: 'Bravo', color: '#FFB000' },
                    { x: 55, y: 45, r: 15, label: 'Charlie', color: '#FFB000' },
                    { x: 75, y: 25, r: 10, label: 'Delta', color: '#33FF00' },
                    { x: 90, y: 10, r: 8, label: 'Echo', color: '#33FF00' },
                  ]}
                  width={800}
                  height={400}
                  xLabel="Time to Target (minutes)"
                  yLabel="Threat Level (%)"
                />
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Operational Zones
              </h3>
              <div style={{ marginBottom: '24px' }}>
                <ColdWarBubbleChartStyled
                  data={[
                    { x: 20, y: 80, r: 30, label: 'Zone A', color: '#FFB000' },
                    { x: 50, y: 50, r: 35, label: 'Zone B', color: '#33FF00' },
                    { x: 80, y: 20, r: 25, label: 'Zone C', color: '#0066CC' },
                  ]}
                  width={800}
                  height={400}
                  xLabel="Longitude"
                  yLabel="Latitude"
                />
              </div>
            </div>

            {/* Color Palette Section */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Color Palette - {themeConfig.name}</h2>
              <div style={gridStyle}>
                <div
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--cw-color-primary)',
                    color: 'var(--cw-color-background)',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    clipPath: 'var(--cw-chamfer-small)',
                  }}
                >
                  Primary
                  <br />
                  <span style={{ fontSize: 'var(--cw-font-size-sm)', fontWeight: 'normal' }}>
                    {theme === 'perseus' && '#FFB000'}
                    {theme === 'greenTerminal' && '#33FF00'}
                    {theme === 'satelliteView' && '#00CCFF'}
                  </span>
                </div>
                <div
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--cw-color-secondary)',
                    color: 'var(--cw-color-background)',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    clipPath: 'var(--cw-chamfer-small)',
                  }}
                >
                  Secondary
                  <br />
                  <span style={{ fontSize: 'var(--cw-font-size-sm)', fontWeight: 'normal' }}>
                    {theme === 'perseus' && '#33FF00'}
                    {theme === 'greenTerminal' && '#FFB000'}
                    {theme === 'satelliteView' && '#0066CC'}
                  </span>
                </div>
                <div
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--cw-color-accent)',
                    color: 'var(--cw-color-background)',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    clipPath: 'var(--cw-chamfer-small)',
                  }}
                >
                  Accent
                  <br />
                  <span style={{ fontSize: 'var(--cw-font-size-sm)', fontWeight: 'normal' }}>
                    {theme === 'perseus' && '#0066CC'}
                    {theme === 'greenTerminal' && '#00CCFF'}
                    {theme === 'satelliteView' && '#FFB000'}
                  </span>
                </div>
                <div
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--cw-color-error)',
                    color: 'var(--cw-color-background)',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    clipPath: 'var(--cw-chamfer-small)',
                  }}
                >
                  Error
                  <br />
                  <span style={{ fontSize: 'var(--cw-font-size-sm)', fontWeight: 'normal' }}>
                    #FF3333
                  </span>
                </div>
                <div
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--cw-color-success)',
                    color: 'var(--cw-color-background)',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    clipPath: 'var(--cw-chamfer-small)',
                  }}
                >
                  Success
                  <br />
                  <span style={{ fontSize: 'var(--cw-font-size-sm)', fontWeight: 'normal' }}>
                    #33FF00
                  </span>
                </div>
                <div
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--cw-color-warning)',
                    color: 'var(--cw-color-background)',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    clipPath: 'var(--cw-chamfer-small)',
                  }}
                >
                  Warning
                  <br />
                  <span style={{ fontSize: 'var(--cw-font-size-sm)', fontWeight: 'normal' }}>
                    #FFB000
                  </span>
                </div>
              </div>
            </div>

            {/* Theme Variants Section */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Theme Variants</h2>
              <div style={gridStyle}>
                <ColdWarCard theme="perseus" header="Perseus" color="amber">
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Tactical Amber & Black
                    <br />
                    Primary military aesthetic
                  </p>
                </ColdWarCard>
                <ColdWarCard theme="greenTerminal" header="Green Terminal" color="green">
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Phosphor Green & Black
                    <br />
                    Retro terminal style
                  </p>
                </ColdWarCard>
                <ColdWarCard theme="satelliteView" header="Satellite View" color="blue">
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Satellite Blue & White
                    <br />
                    Radar view aesthetic
                  </p>
                </ColdWarCard>
              </div>
            </div>

            {/* Texture Effects Section */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Texture Effects</h2>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Scanlines - Intensities
              </h3>
              <div style={gridStyle}>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="amber"
                  header="Low Intensity"
                  scanlines={true}
                  scanlinesIntensity="low"
                  elevation="medium"
                >
                  Subtle scanlines effect for minimal distraction
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="amber"
                  header="Medium Intensity"
                  scanlines={true}
                  scanlinesIntensity="medium"
                  elevation="medium"
                >
                  Balanced scanlines effect for retro aesthetic
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="amber"
                  header="High Intensity"
                  scanlines={true}
                  scanlinesIntensity="high"
                  elevation="medium"
                >
                  Strong scanlines effect for dramatic CRT look
                </ColdWarCard>
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Glow Effects
              </h3>
              <div style={gridStyle}>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="amber"
                  header="No Glow"
                  glow={false}
                  elevation="medium"
                >
                  Card without phosphor glow effect
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="green"
                  header="With Glow"
                  glow={true}
                  elevation="medium"
                >
                  Card with phosphor glow effect enabled
                </ColdWarCard>
                <ColdWarCard
                  theme={theme}
                  variant="tactical"
                  color="blue"
                  header="Glow + Scanlines"
                  glow={true}
                  scanlines={true}
                  scanlinesIntensity="medium"
                  elevation="medium"
                >
                  Combined glow and scanlines effects
                </ColdWarCard>
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Button Effects
              </h3>
              <div style={gridStyle}>
                <ColdWarButton theme={theme} variant="primary" glow={false} scanlines={false}>
                  No Effects
                </ColdWarButton>
                <ColdWarButton theme={theme} variant="primary" glow={true} scanlines={false}>
                  Glow Only
                </ColdWarButton>
                <ColdWarButton theme={theme} variant="primary" glow={false} scanlines={true}>
                  Scanlines Only
                </ColdWarButton>
                <ColdWarButton theme={theme} variant="primary" glow={true} scanlines={true}>
                  Both Effects
                </ColdWarButton>
              </div>

              <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
                Input Effects
              </h3>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}
              >
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  label="No Effects"
                  placeholder="Plain input..."
                  glow={false}
                  scanlines={false}
                />
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  label="Glow Only"
                  placeholder="Glowing input..."
                  glow={true}
                  scanlines={false}
                />
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  label="Scanlines Only"
                  placeholder="Scanlines input..."
                  glow={false}
                  scanlines={true}
                />
                <ColdWarInput
                  theme={theme}
                  variant="tactical"
                  label="Both Effects"
                  placeholder="Full effects..."
                  glow={true}
                  scanlines={true}
                />
              </div>
            </div>

            {/* Interactive Demo Section */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Interactive Demo</h2>
              <div style={gridStyle}>
                <ColdWarCard theme={theme} header="Current Theme" color={themeConfig.cardColor}>
                  <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong>Name:</strong> {themeConfig.name}
                    </p>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong>Description:</strong> {themeConfig.description}
                    </p>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong>Input Variant:</strong> {themeConfig.inputVariant}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Card Color:</strong> {themeConfig.cardColor}
                    </p>
                  </div>
                </ColdWarCard>
                <ColdWarCard theme={theme} header="Component Status" color={themeConfig.cardColor}>
                  <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong>Selected Button:</strong> {selectedButton || 'None'}
                    </p>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong>Input Value:</strong> {inputValue || 'Empty'}
                    </p>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong>Theme Variant:</strong> {theme}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Status:</strong>{' '}
                      <span style={{ color: 'var(--cw-color-success)' }}>Active</span>
                    </p>
                  </div>
                </ColdWarCard>
                <ColdWarCard theme={theme} header="Quick Actions" color={themeConfig.cardColor}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <ColdWarButton
                      theme={theme}
                      variant="primary"
                      size="sm"
                      onClick={() => setInputValue('')}
                    >
                      Clear Input
                    </ColdWarButton>
                    <ColdWarButton
                      theme={theme}
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedButton(null)}
                    >
                      Reset Button
                    </ColdWarButton>
                  </div>
                </ColdWarCard>
              </div>
            </div>

            {/* Documentation Links */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Documentation</h2>
              <div style={gridStyle}>
                <ColdWarCard theme={theme} header="Migration Guide">
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Complete guide for migrating from old components to Cold War aesthetic
                  </p>
                </ColdWarCard>
                <ColdWarCard theme={theme} header="Visual Specifications">
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Detailed visual language specifications with exact values
                  </p>
                </ColdWarCard>
                <ColdWarCard theme={theme} header="Component API">
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Complete prop documentation for all Cold War components
                  </p>
                </ColdWarCard>
              </div>
            </div>
          </>
        )}

        {/* Tab 1: Form Controls */}
        {activeTab === 1 && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Form Controls</h2>

            <ComponentSection title="Checkboxes" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarCheckbox theme={theme} label="Standard Checkbox" />
                <ColdWarHoloCheckbox theme={theme} label="Holo Checkbox" />
                <ColdWarCyberpunkCheckbox theme={theme} label="Cyberpunk Checkbox" />
                <ColdWarBubbleCheckbox theme={theme} label="Bubble Checkbox" />
                <ColdWarNeonCheckbox theme={theme} label="Neon Checkbox" />
                <ColdWarGlowingCheckbox theme={theme} label="Glowing Checkbox" />
              </div>
            </ComponentSection>

            <ComponentSection title="Radio Buttons" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarRadio theme={theme} label="Standard Radio" name="radio1" />
                <ColdWarGlitchRadio theme={theme} label="Glitch Radio" name="radio2" />
                <ColdWarCyberpunkRadio theme={theme} label="Cyberpunk Radio" name="radio3" />
                <ColdWarNeonRadio theme={theme} label="Neon Radio" name="radio4" />
              </div>
            </ComponentSection>

            <ComponentSection title="Switches & Toggles" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarSwitch theme={theme} label="Standard Switch" />
                <ColdWarToggleSwitch theme={theme} label="Toggle Switch" />
                <ColdWarCyberpunkToggle theme={theme} label="Cyberpunk Toggle" />
                <ColdWarLockSwitch theme={theme} label="Lock Switch" />
              </div>
            </ComponentSection>

            <ComponentSection title="Sliders" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <ColdWarSlider theme={theme} label="Standard Slider" min={0} max={100} />
                <ColdWarNeonSlider theme={theme} label="Neon Slider" min={0} max={100} />
              </div>
            </ComponentSection>
          </div>
        )}

        {/* Tab 2: Layout & Cards */}
        {activeTab === 2 && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Layout & Cards</h2>

            <ComponentSection title="HUD Boxes" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarHudBox theme={theme}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--cw-color-primary)' }}>
                    HUD Box 1
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Content inside HUD box with tactical styling
                  </p>
                </ColdWarHudBox>
                <ColdWarHudBox theme={theme} variant="glass">
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--cw-color-primary)' }}>
                    HUD Box 2
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Glass variant HUD box
                  </p>
                </ColdWarHudBox>
                <ColdWarHudBox theme={theme} variant="bordered">
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--cw-color-primary)' }}>
                    HUD Box 3
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Bordered variant HUD box
                  </p>
                </ColdWarHudBox>
              </div>
            </ComponentSection>

            <ComponentSection title="Grid Layouts" style={{ marginBottom: '32px' }}>
              <ColdWarGrid theme={theme} columns={3} gap="24px">
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--cw-color-surface)',
                    border: '1px solid var(--cw-color-primary)',
                  }}
                >
                  Grid Item 1
                </div>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--cw-color-surface)',
                    border: '1px solid var(--cw-color-primary)',
                  }}
                >
                  Grid Item 2
                </div>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--cw-color-surface)',
                    border: '1px solid var(--cw-color-primary)',
                  }}
                >
                  Grid Item 3
                </div>
              </ColdWarGrid>
            </ComponentSection>

            <ComponentSection title="Stack Layouts" style={{ marginBottom: '32px' }}>
              <ColdWarStack theme={theme} direction="vertical" gap="16px">
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--cw-color-surface)',
                    border: '1px solid var(--cw-color-primary)',
                  }}
                >
                  Stack Item 1
                </div>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--cw-color-surface)',
                    border: '1px solid var(--cw-color-primary)',
                  }}
                >
                  Stack Item 2
                </div>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--cw-color-surface)',
                    border: '1px solid var(--cw-color-primary)',
                  }}
                >
                  Stack Item 3
                </div>
              </ColdWarStack>
            </ComponentSection>

            <ComponentSection title="Frames" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarHudFrame theme={theme} title="HUD Frame">
                  Frame content with tactical styling
                </ColdWarHudFrame>
                <ColdWarGlitchFrame theme={theme} title="Glitch Frame">
                  Frame with glitch effect
                </ColdWarGlitchFrame>
              </div>
            </ComponentSection>

            <ComponentSection title="Card Variants" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarCyberCard theme={theme}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--cw-color-primary)' }}>
                    Cyber Card
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    Cyberpunk styled card
                  </p>
                </ColdWarCyberCard>
                <ColdWarCard
                  theme={theme}
                  variant="glass"
                  color="blue"
                  header="Glass Card"
                  elevation="medium"
                >
                  Glass morphism card
                </ColdWarCard>
                <ColdWarThermostatCard theme={theme} />
                <ColdWarProfileCard theme={theme} />
              </div>
            </ComponentSection>
          </div>
        )}

        {/* Tab 3: Data Display */}
        {activeTab === 3 && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Data Display</h2>

            <ComponentSection title="Tables" style={{ marginBottom: '32px' }}>
              <ColdWarTable
                theme={theme}
                columns={[
                  { label: 'Name', key: 'name' },
                  { label: 'Status', key: 'status' },
                  { label: 'Level', key: 'level' },
                ]}
                data={[
                  { name: 'Alpha', status: 'Active', level: '5' },
                  { name: 'Bravo', status: 'Inactive', level: '3' },
                  { name: 'Charlie', status: 'Active', level: '7' },
                ]}
              />
            </ComponentSection>

            <ComponentSection title="Data Grids" style={{ marginBottom: '32px' }}>
              <ColdWarDataGrid
                theme={theme}
                columns={[
                  { label: 'ID', key: 'id' },
                  { label: 'Name', key: 'name' },
                  { label: 'Value', key: 'value' },
                ]}
                data={[
                  { id: '001', name: 'Item A', value: '100' },
                  { id: '002', name: 'Item B', value: '200' },
                  { id: '003', name: 'Item C', value: '300' },
                ]}
              />
            </ComponentSection>

            <ComponentSection title="PipBoy Display" style={{ marginBottom: '32px' }}>
              <ColdWarPipBoy theme={theme} />
            </ComponentSection>

            <ComponentSection title="Radar" style={{ marginBottom: '32px' }}>
              <ColdWarRadar theme={theme} />
            </ComponentSection>

            <ComponentSection title="Amplifier" style={{ marginBottom: '32px' }}>
              <ColdWarAmplifier theme={theme} />
            </ComponentSection>

            <ComponentSection title="Media Player" style={{ marginBottom: '32px' }}>
              <ColdWarMediaPlayer theme={theme} />
            </ComponentSection>

            <ComponentSection title="Notification Cards" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarNotificationCard
                  theme={theme}
                  title="Notification"
                  message="System alert"
                />
                <ColdWarHudNotificationCard
                  theme={theme}
                  title="HUD Alert"
                  message="Tactical update"
                />
              </div>
            </ComponentSection>

            <ComponentSection title="Terminal Selector" style={{ marginBottom: '32px' }}>
              <ColdWarTerminalSelector theme={theme} />
            </ComponentSection>
          </div>
        )}

        {/* Tab 4: Navigation */}
        {activeTab === 4 && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Navigation</h2>

            <ComponentSection title="Tabs" style={{ marginBottom: '32px' }}>
              <ColdWarTabs
                theme={theme}
                tabs={[
                  { id: 'tab1', label: 'Tab 1', content: 'Content for tab 1' },
                  { id: 'tab2', label: 'Tab 2', content: 'Content for tab 2' },
                  { id: 'tab3', label: 'Tab 3', content: 'Content for tab 3' },
                ]}
              />
            </ComponentSection>

            <ComponentSection title="Pagination" style={{ marginBottom: '32px' }}>
              <ColdWarPagination
                theme={theme}
                totalPages={5}
                currentPage={1}
                onPageChange={() => {}}
              />
            </ComponentSection>

            <ComponentSection title="Breadcrumb" style={{ marginBottom: '32px' }}>
              <ColdWarBreadcrumb
                theme={theme}
                items={[
                  { id: '1', label: 'Home', href: '/' },
                  { id: '2', label: 'Components', href: '/components' },
                  { id: '3', label: 'Navigation', href: '/navigation' },
                ]}
              />
            </ComponentSection>

            <ComponentSection title="Sidebar" style={{ marginBottom: '32px' }}>
              <ColdWarSidebar
                theme={theme}
                items={[
                  { id: '1', label: 'Dashboard', icon: '📊' },
                  { id: '2', label: 'Settings', icon: '⚙️' },
                  { id: '3', label: 'Profile', icon: '👤' },
                  { id: '4', label: 'Logout', icon: '🚪' },
                ]}
              />
            </ComponentSection>

            <ComponentSection title="Menu" style={{ marginBottom: '32px' }}>
              <ColdWarMenu
                theme={theme}
                items={[
                  { id: '1', label: 'File', icon: '📁' },
                  { id: '2', label: 'Edit', icon: '✏️' },
                  { id: '3', label: 'View', icon: '👁️' },
                  { id: '4', label: 'Help', icon: '❓' },
                ]}
              />
            </ComponentSection>
          </div>
        )}

        {/* Tab 5: Feedback & Loaders */}
        {activeTab === 5 && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Feedback & Loaders</h2>

            <ComponentSection title="Alerts" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <ColdWarAlert
                  theme={theme}
                  variant="info"
                  title="Info Alert"
                  message="This is an informational alert"
                />
                <ColdWarAlert
                  theme={theme}
                  variant="success"
                  title="Success Alert"
                  message="Operation completed successfully"
                />
                <ColdWarAlert
                  theme={theme}
                  variant="warning"
                  title="Warning Alert"
                  message="Please review this warning"
                />
                <ColdWarAlert
                  theme={theme}
                  variant="danger"
                  title="Error Alert"
                  message="An error has occurred"
                />
              </div>
            </ComponentSection>

            <ComponentSection title="Dialogs & Modals" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarButton
                  theme={theme}
                  variant="primary"
                  onClick={() => alert('Dialog would open')}
                >
                  Open Dialog
                </ColdWarButton>
                <ColdWarButton
                  theme={theme}
                  variant="secondary"
                  onClick={() => alert('Modal would open')}
                >
                  Open Modal
                </ColdWarButton>
              </div>
            </ComponentSection>

            <ComponentSection title="Toasts" style={{ marginBottom: '32px' }}>
              <ColdWarButton
                theme={theme}
                variant="primary"
                onClick={() => alert('Toast notification')}
              >
                Show Toast
              </ColdWarButton>
            </ComponentSection>

            <ComponentSection title="Progress Loaders" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarProgressBar theme={theme} value={45} />
                <ColdWarProgressLoader theme={theme} />
              </div>
            </ComponentSection>

            <ComponentSection title="Animated Loaders" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarAbstergoLoader theme={theme} />
                <ColdWarHeartRateLoader theme={theme} />
                <ColdWarHackerLoader theme={theme} />
                <ColdWarBinaryLoader theme={theme} />
                <ColdWarCubeLoader theme={theme} />
                <ColdWarBinaryHackerLoader theme={theme} />
                <ColdWarMatrixLoader theme={theme} />
                <ColdWarScrollingLoader theme={theme} />
                <ColdWarLoadingText theme={theme} text="Loading..." />
                <ColdWarWaveLoader theme={theme} />
              </div>
            </ComponentSection>
          </div>
        )}

        {/* Tab 6: Advanced */}
        {activeTab === 6 && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Advanced Components</h2>

            <ComponentSection title="Code Editor" style={{ marginBottom: '32px' }}>
              <ColdWarCodeEditor
                theme={theme}
                code="const greeting = 'Hello, World!';\nconsole.log(greeting);"
                language="javascript"
              />
            </ComponentSection>

            <ComponentSection title="Rich Text Editor" style={{ marginBottom: '32px' }}>
              <ColdWarRichEditor theme={theme} />
            </ComponentSection>

            <ComponentSection title="Accordion" style={{ marginBottom: '32px' }}>
              <ColdWarAccordion
                theme={theme}
                items={[
                  { id: '1', title: 'Section 1', content: 'Content for section 1' },
                  { id: '2', title: 'Section 2', content: 'Content for section 2' },
                  { id: '3', title: 'Section 3', content: 'Content for section 3' },
                ]}
              />
            </ComponentSection>

            <ComponentSection title="Carousel" style={{ marginBottom: '32px' }}>
              <ColdWarCarousel
                theme={theme}
                items={[
                  { id: '1', content: 'Slide 1' },
                  { id: '2', content: 'Slide 2' },
                  { id: '3', content: 'Slide 3' },
                ]}
              />
            </ComponentSection>

            <ComponentSection title="Stepper" style={{ marginBottom: '32px' }}>
              <ColdWarStepper
                theme={theme}
                steps={[
                  { id: '1', label: 'Step 1', description: 'First step' },
                  { id: '2', label: 'Step 2', description: 'Second step' },
                  { id: '3', label: 'Step 3', description: 'Third step' },
                ]}
                currentStep={1}
              />
            </ComponentSection>
          </div>
        )}

        {/* Tab 7: Utility & Specialized */}
        {activeTab === 7 && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Utility & Specialized Components</h2>

            <ComponentSection title="Tooltips" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarTooltip theme={theme} content="Tooltip content">
                  <ColdWarButton theme={theme} variant="primary">
                    Hover me
                  </ColdWarButton>
                </ColdWarTooltip>
                <ColdWarSupportTooltip
                  theme={theme}
                  title="Help"
                  description="Get support"
                  links={[{ label: 'Documentation', url: '#' }]}
                >
                  <ColdWarButton theme={theme} variant="secondary">
                    Support
                  </ColdWarButton>
                </ColdWarSupportTooltip>
              </div>
            </ComponentSection>

            <ComponentSection title="Popovers" style={{ marginBottom: '32px' }}>
              <ColdWarPopover theme={theme} content="Popover content" title="Popover Title">
                <ColdWarButton theme={theme} variant="primary">
                  Open Popover
                </ColdWarButton>
              </ColdWarPopover>
            </ComponentSection>

            <ComponentSection title="Dropdowns" style={{ marginBottom: '32px' }}>
              <ColdWarDropdown
                theme={theme}
                trigger={
                  <ColdWarButton theme={theme} variant="primary">
                    Dropdown Menu
                  </ColdWarButton>
                }
                items={[
                  { id: '1', label: 'Option 1' },
                  { id: '2', label: 'Option 2' },
                  { id: '3', label: 'Option 3' },
                ]}
              />
            </ComponentSection>

            <ComponentSection title="Date Picker" style={{ marginBottom: '32px' }}>
              <ColdWarDatePicker theme={theme} />
            </ComponentSection>

            <ComponentSection title="Color Picker" style={{ marginBottom: '32px' }}>
              <ColdWarColorPicker theme={theme} />
            </ComponentSection>

            <ComponentSection title="File Upload" style={{ marginBottom: '32px' }}>
              <ColdWarFileUpload theme={theme} />
            </ComponentSection>
          </div>
        )}
        {/* Tab 8: Visualization & Forms */}
        {activeTab === 8 && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Visualization & Forms</h2>

            <ComponentSection title="Charts" style={{ marginBottom: '32px' }}>
              <ColdWarChart
                theme={theme}
                data={[
                  { label: 'Jan', value: 30 },
                  { label: 'Feb', value: 45 },
                  { label: 'Mar', value: 35 },
                  { label: 'Apr', value: 50 },
                  { label: 'May', value: 60 },
                ]}
                title="Tactical Data"
              />
            </ComponentSection>

            <ComponentSection title="Bubble Chart" style={{ marginBottom: '32px' }}>
              <ColdWarBubbleChartStyled
                data={[
                  { x: 20, y: 80, r: 25, label: 'Target A', color: '#FF3333' },
                  { x: 50, y: 50, r: 20, label: 'Target B', color: '#FFB000' },
                  { x: 80, y: 20, r: 15, label: 'Target C', color: '#33FF00' },
                ]}
                width={800}
                height={400}
                xLabel="X Axis"
                yLabel="Y Axis"
              />
            </ComponentSection>

            <ComponentSection title="Login Forms" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <ColdWarLoginForm theme={theme} />
                <ColdWarCyberLoginForm theme={theme} />
                <ColdWarAnimatedLoginForm theme={theme} />
              </div>
            </ComponentSection>
          </div>
        )}
        {/* Tab 9: Background Animation */}
        {activeTab === 9 && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Background Animation</h2>

            {/* Background Controls */}
            <div style={{ marginBottom: '32px' }}>
              <ComponentSection title="Background Controls" style={{ marginBottom: '24px' }}>
                <div
                  style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: 'var(--cw-font-size-sm)',
                      }}
                    >
                      Theme:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(['perseus', 'greenTerminal', 'satelliteView'] as const).map((t) => (
                        <ColdWarButton
                          key={t}
                          theme={theme}
                          variant={bgTheme === t ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setBgTheme(t)}
                        >
                          {t === 'perseus' ? 'Amber' : t === 'greenTerminal' ? 'Green' : 'Blue'}
                        </ColdWarButton>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: 'var(--cw-font-size-sm)',
                      }}
                    >
                      Intensity:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(['low', 'medium', 'high'] as const).map((i) => (
                        <ColdWarButton
                          key={i}
                          theme={theme}
                          variant={bgIntensity === i ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setBgIntensity(i)}
                        >
                          {i.charAt(0).toUpperCase() + i.slice(1)}
                        </ColdWarButton>
                      ))}
                    </div>
                  </div>
                </div>
              </ComponentSection>
            </div>

            {/* Grid Lines */}
            <ComponentSection
              title="Grid Lines - Tactical Grid with Perspective"
              style={{ marginBottom: '32px' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarGridLines
                  theme={bgTheme}
                  intensity={bgIntensity}
                  width={800}
                  height={300}
                />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                Perspective grid animation with pulsing intersection points
              </p>
            </ComponentSection>

            {/* Radar */}
            <ComponentSection
              title="Radar - Rotating Sweep with Rings"
              style={{ marginBottom: '32px' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarRadarBg theme={bgTheme} intensity={bgIntensity} width={800} height={300} />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                360° rotating radar sweep with concentric rings and crosshairs
              </p>
            </ComponentSection>

            {/* Scanlines */}
            <ComponentSection
              title="Scanlines - CRT Effect with Tactical Markers"
              style={{ marginBottom: '32px' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarScanlines
                  theme={bgTheme}
                  intensity={bgIntensity}
                  width={800}
                  height={300}
                />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                CRT scanlines effect with corner tactical markers and pulse animation
              </p>
            </ComponentSection>

            {/* Particles */}
            <ComponentSection
              title="Particles - Military Tactical Particles"
              style={{ marginBottom: '32px' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarParticles
                  theme={bgTheme}
                  intensity={bgIntensity}
                  width={800}
                  height={300}
                />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                Directional particle system with lifecycle management and tactical styling
              </p>
            </ComponentSection>

            {/* Noise */}
            <ComponentSection
              title="Noise - Tactical Noise Texture"
              style={{ marginBottom: '32px' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarNoise theme={bgTheme} intensity={bgIntensity} width={800} height={300} />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                Procedural Perlin-like noise texture with tactical color mapping
              </p>
            </ComponentSection>

            {/* Matrix */}
            <ComponentSection
              title="Matrix - Military Code Cascade"
              style={{ marginBottom: '32px' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: '#000',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarMatrix theme={bgTheme} intensity={bgIntensity} width={800} height={300} />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                Cascading military encryption codes with Matrix-style animation
              </p>
            </ComponentSection>

            {/* Hex Grid */}
            <ComponentSection
              title="Hex Grid - Hexagonal Tactical Grid"
              style={{ marginBottom: '32px' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarHexGrid theme={bgTheme} intensity={bgIntensity} width={800} height={300} />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                Hexagonal grid with target zones and tactical overlays
              </p>
            </ComponentSection>

            {/* Waveform */}
            <ComponentSection
              title="Waveform - Audio Signal Analysis"
              style={{ marginBottom: '32px' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarWaveform theme={bgTheme} intensity={bgIntensity} width={800} height={300} />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                Audio waveform with frequency spectrum and signal strength analysis
              </p>
            </ComponentSection>

            {/* Circuit */}
            <ComponentSection
              title="Circuit - Electronic Schematic"
              style={{ marginBottom: '32px' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarCircuit theme={bgTheme} intensity={bgIntensity} width={800} height={300} />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                Military circuit board with data flow and connection nodes
              </p>
            </ComponentSection>

            {/* ColdWarSonar */}
            <ComponentSection title="Sonar Display">
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarSonar theme={bgTheme} intensity={bgIntensity} width={800} height={300} />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                Submarine sonar with ping waves and target detection
              </p>
            </ComponentSection>

            {/* ColdWarSatellite */}
            <ComponentSection title="Satellite Tracking">
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarSatellite
                  theme={bgTheme}
                  intensity={bgIntensity}
                  width={800}
                  height={300}
                />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                Orbital satellite tracking with ground stations and signal coverage
              </p>
            </ComponentSection>

            {/* ColdWarTerminal */}
            <ComponentSection title="Military Terminal">
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarTerminal theme={bgTheme} intensity={bgIntensity} width={800} height={300} />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                Command terminal with scrolling text and system logs
              </p>
            </ComponentSection>

            {/* ColdWarTacticalMap */}
            <ComponentSection title="Tactical Map">
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  backgroundColor: 'var(--cw-color-background)',
                  border: '1px solid var(--cw-color-primary)',
                  clipPath: 'var(--cw-chamfer-medium)',
                  overflow: 'hidden',
                }}
              >
                <ColdWarTacticalMap
                  theme={bgTheme}
                  intensity={bgIntensity}
                  width={800}
                  height={300}
                />
              </div>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: 'var(--cw-font-size-sm)',
                  color: 'var(--cw-color-text-secondary)',
                }}
              >
                Military map with waypoints, zones, and movement paths
              </p>
            </ComponentSection>

            {/* Features Info */}
            <ComponentSection title="Background Features" style={{ marginBottom: '32px' }}>
              <div style={gridStyle}>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>3 Themes</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    Perseus (Amber), Green Terminal, Satellite View (Blue)
                  </p>
                </div>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>3 Intensities</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    Low, Medium, High - adjust animation intensity
                  </p>
                </div>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>Canvas Rendering</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    60fps animation with performance optimization
                  </p>
                </div>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>Accessibility</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    Full prefers-reduced-motion support
                  </p>
                </div>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>Particle Pooling</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    Optimized memory management for particles
                  </p>
                </div>
                <div style={featureBoxStyle}>
                  <h3 style={{ ...subtitleStyle, marginBottom: '8px' }}>Modular Design</h3>
                  <p style={{ fontSize: 'var(--cw-font-size-sm)', margin: 0 }}>
                    Use individually or combine for complex effects
                  </p>
                </div>
              </div>
            </ComponentSection>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColdWarShowcase;
