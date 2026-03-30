/**
 * Cold War Redesign - Showcase Page
 * Demonstrates the tactical military aesthetic across all components
 */

import React from 'react';
import {
  ColdWarButton,
  ColdWarHudButton,
  ColdWarGlitchButton,
  ColdWarNeonButton,
  ColdWarGridButton,
  ColdWarFingerprintButton,
  ColdWarGlitchHoverButton,
  ColdWarSliderButton,
  ColdWarSubscribeButton,
  ColdWarBorderButton,
  ColdWarInput,
  ColdWarSearchInput,
  ColdWarHackerInput,
  ColdWarAiInput,
  ColdWarHoloInput,
  ColdWarHoloInputAdvanced,
  ColdWarFuturisticInput,
  ColdWarBashInput,
  ColdWarFloatingInput,
  ColdWarAccessInput,
  ColdWarFriendInput,
  ColdWarCodeInput,
  ColdWarCard,
  ColdWarCyberCard,
  ColdWarGlassCard,
  ColdWarThermostatCard,
  ColdWarProfileCard,
  ColdWarTerminalSelector,
  ColdWarNotificationCard,
  ColdWarHudNotificationCard,
  ColdWarMediaPlayer,
  ColdWarAmplifier,
  ColdWarRadar,
  ColdWarPipBoy,
  ColdWarTable,
  ColdWarDataGrid,
  ColdWarHudBox,
  ColdWarGrid,
  ColdWarStack,
  ColdWarGlitchFrame,
  ColdWarHudFrame,
  ColdWarCheckbox,
  ColdWarHoloCheckbox,
  ColdWarCyberpunkCheckbox,
  ColdWarBubbleCheckbox,
  ColdWarNeonCheckbox,
  ColdWarGlowingCheckbox,
  ColdWarRadio,
  ColdWarGlitchRadio,
  ColdWarCyberpunkRadio,
  ColdWarNeonRadio,
  ColdWarSwitch,
  ColdWarToggleSwitch,
  ColdWarCyberpunkToggle,
  ColdWarLockSwitch,
  ColdWarSlider,
  ColdWarNeonSlider,
  ColdWarTabs,
  ColdWarProgressBar,
  ColdWarAlert,
  ColdWarPagination,
  ColdWarBreadcrumb,
  ColdWarSidebar,
  ColdWarMenu,
  ColdWarDialog,
  ColdWarNotificationProvider,
  useNotifications,
  ColdWarToast,
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
  ColdWarBubbleChartStyled,
} from '@rhuds/components';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { TacticalMotionBackground } from '../components/TacticalMotionBackground';
import { ColdWarContextMenu } from '../components/ColdWarContextMenu';
import { useColdWarContextMenu } from '../hooks/useColdWarContextMenu';
import '../styles/cold-war-theme.css';

type ThemeVariant = 'perseus' | 'greenTerminal' | 'satelliteView';

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
  const { contextMenu, handleContextMenu, handleCloseContextMenu } = useColdWarContextMenu();
  const themeConfig = THEME_CONFIGS[theme];

  const themeColors = {
    primary: theme === 'perseus' ? '#FFB000' : theme === 'greenTerminal' ? '#33FF00' : '#00CCFF',
  };

  // Use scroll to top hook
  useScrollToTop();

  // Scroll to top when tab changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

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

        {/* Form Controls Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Form Controls</h2>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>Checkboxes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
            <ColdWarCheckbox theme={theme} label="Small Checkbox" size="sm" />
            <ColdWarCheckbox theme={theme} label="Medium Checkbox" size="md" />
            <ColdWarCheckbox theme={theme} label="Large Checkbox" size="lg" />
            <ColdWarCheckbox theme={theme} label="Checked Checkbox" checked />
            <ColdWarCheckbox theme={theme} label="Disabled Checkbox" disabled />
            <ColdWarCheckbox theme={theme} label="Checked & Disabled" checked disabled />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Checkboxes - Advanced Variants
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
            <ColdWarHoloCheckbox theme={theme} label="Holographic Checkbox" />
            <ColdWarCyberpunkCheckbox theme={theme} label="Cyberpunk Checkbox" />
            <ColdWarBubbleCheckbox theme={theme} label="Bubble Checkbox" />
            <ColdWarNeonCheckbox theme={theme} label="Neon Checkbox" />
            <ColdWarGlowingCheckbox theme={theme} label="Glowing Checkbox" />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Radio Buttons
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
            <ColdWarRadio theme={theme} label="Option 1" name="radio-group" />
            <ColdWarRadio theme={theme} label="Option 2" name="radio-group" />
            <ColdWarRadio theme={theme} label="Option 3" name="radio-group" checked />
            <ColdWarRadio theme={theme} label="Disabled Option" name="radio-group" disabled />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Radio Buttons - Advanced Variants
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
            <ColdWarGlitchRadio theme={theme} label="Glitch Radio" name="radio-group-2" />
            <ColdWarCyberpunkRadio theme={theme} label="Cyberpunk Radio" name="radio-group-2" />
            <ColdWarNeonRadio theme={theme} label="Neon Radio" name="radio-group-2" checked />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>Switches</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
            <ColdWarSwitch theme={theme} label="Small Switch" size="sm" />
            <ColdWarSwitch theme={theme} label="Medium Switch" size="md" />
            <ColdWarSwitch theme={theme} label="Large Switch" size="lg" />
            <ColdWarSwitch theme={theme} label="Checked Switch" checked />
            <ColdWarSwitch theme={theme} label="Disabled Switch" disabled />
            <ColdWarSwitch theme={theme} label="Checked & Disabled" checked disabled />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Switches - Advanced Variants
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
            <ColdWarToggleSwitch theme={theme} label="Toggle Switch" />
            <ColdWarCyberpunkToggle theme={theme} label="Cyberpunk Toggle" />
            <ColdWarLockSwitch theme={theme} label="Lock Switch" />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>Sliders</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
            <ColdWarSlider theme={theme} label="Basic Slider" min={0} max={100} value={50} />
            <ColdWarNeonSlider theme={theme} label="Neon Slider" min={0} max={100} value={75} />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Layout - HUD Box Container
          </h3>
          <div style={gridStyle}>
            <ColdWarHudBox theme={theme} variant="default" color="amber">
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                Default HUD Box with transparent background
              </p>
            </ColdWarHudBox>
            <ColdWarHudBox theme={theme} variant="bordered" color="green">
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                Bordered HUD Box with semi-transparent background
              </p>
            </ColdWarHudBox>
            <ColdWarHudBox theme={theme} variant="filled" color="blue">
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                Filled HUD Box with solid background
              </p>
            </ColdWarHudBox>
            <ColdWarHudBox theme={theme} variant="glass" color="amber" scanlines glow>
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                Glass HUD Box with scanlines and glow effects
              </p>
            </ColdWarHudBox>
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Layout - Grid System
          </h3>
          <ColdWarGrid theme={theme} columns={3} gap="md">
            <ColdWarCard theme={theme} header="Grid Item 1" color="amber">
              Grid layout with 3 columns
            </ColdWarCard>
            <ColdWarCard theme={theme} header="Grid Item 2" color="green">
              Responsive grid system
            </ColdWarCard>
            <ColdWarCard theme={theme} header="Grid Item 3" color="blue">
              Auto-fit columns
            </ColdWarCard>
          </ColdWarGrid>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Layout - Stack System
          </h3>
          <ColdWarStack theme={theme} direction="horizontal" gap="md" align="center">
            <ColdWarButton theme={theme} variant="primary">
              Button 1
            </ColdWarButton>
            <ColdWarButton theme={theme} variant="secondary">
              Button 2
            </ColdWarButton>
            <ColdWarButton theme={theme} variant="tactical">
              Button 3
            </ColdWarButton>
          </ColdWarStack>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Layout - Frames
          </h3>
          <div style={gridStyle}>
            <ColdWarGlitchFrame theme={theme} glitchIntensity="medium">
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                Glitch Frame with animated distortion effect
              </p>
            </ColdWarGlitchFrame>
            <ColdWarHudFrame theme={theme} showCorners>
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                HUD Frame with corner brackets
              </p>
            </ColdWarHudFrame>
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Search Input
          </h3>
          <div style={{ maxWidth: '600px' }}>
            <ColdWarSearchInput
              theme={theme}
              size="md"
              placeholder="SEARCH OPERATIONS..."
              onSearch={(value) => console.log('Search:', value)}
              glow={true}
              scanlines={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Tabs Navigation
          </h3>
          <div style={{ maxWidth: '800px' }}>
            <ColdWarTabs
              theme={theme}
              glow={true}
              tabs={[
                {
                  id: 'intel',
                  label: 'Intelligence',
                  icon: <span>📊</span>,
                  content: (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', color: themeColors.primary }}>
                        INTELLIGENCE BRIEFING
                      </h4>
                      <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                        Latest intelligence reports from field operatives. All data classified TOP
                        SECRET.
                      </p>
                    </div>
                  ),
                },
                {
                  id: 'ops',
                  label: 'Operations',
                  icon: <span>⚡</span>,
                  content: (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', color: themeColors.primary }}>
                        ACTIVE OPERATIONS
                      </h4>
                      <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                        Current tactical operations in progress. Status: GREEN.
                      </p>
                    </div>
                  ),
                },
                {
                  id: 'assets',
                  label: 'Assets',
                  icon: <span>🎯</span>,
                  content: (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', color: themeColors.primary }}>
                        ASSET MANAGEMENT
                      </h4>
                      <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                        Personnel and equipment tracking. All assets accounted for.
                      </p>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>Pagination</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <ColdWarPagination
              theme={theme}
              currentPage={3}
              totalPages={10}
              glow={true}
              onPageChange={(page) => console.log('Page:', page)}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Hacker Input
          </h3>
          <div style={{ maxWidth: '600px' }}>
            <ColdWarHackerInput
              theme={theme}
              label="TERMINAL ACCESS"
              placeholder="ENTER COMMAND..."
              glow={true}
              scanlines={true}
              showCursor={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Progress Bar
          </h3>
          <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ColdWarProgressBar
              theme={theme}
              value={75}
              color="amber"
              showLabel={true}
              showPercentage={true}
              animated={true}
              scanlines={true}
              glow={true}
            />
            <ColdWarProgressBar
              theme={theme}
              value={50}
              color="green"
              size="lg"
              showLabel={true}
              glow={true}
            />
            <ColdWarProgressBar
              theme={theme}
              value={25}
              color="red"
              size="sm"
              showLabel={false}
              glow={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Alert Messages
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
            <ColdWarAlert
              theme={theme}
              variant="info"
              title="INFORMATION"
              message="System update available. Please review before proceeding."
              showTimestamp={true}
              glow={true}
            />
            <ColdWarAlert
              theme={theme}
              variant="success"
              title="OPERATION SUCCESSFUL"
              message="Mission completed. All objectives achieved."
              showTimestamp={true}
              glow={true}
            />
            <ColdWarAlert
              theme={theme}
              variant="warning"
              title="WARNING"
              message="Unauthorized access attempt detected. Security protocols activated."
              showTimestamp={true}
              glow={true}
            />
            <ColdWarAlert
              theme={theme}
              variant="danger"
              title="CRITICAL ALERT"
              message="System breach detected. Immediate action required."
              showTimestamp={true}
              glow={true}
            />
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
            Buttons - New Cold War Variants
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
            }}
          >
            <ColdWarHudButton theme={theme} variant="primary">
              HUD Button
            </ColdWarHudButton>
            <ColdWarGlitchButton theme={theme} variant="primary">
              Glitch Button
            </ColdWarGlitchButton>
            <ColdWarNeonButton theme={theme} variant="primary">
              Neon Button
            </ColdWarNeonButton>
            <ColdWarGridButton theme={theme} variant="primary">
              Grid Button
            </ColdWarGridButton>
            <ColdWarFingerprintButton theme={theme} variant="primary">
              Fingerprint
            </ColdWarFingerprintButton>
            <ColdWarGlitchHoverButton theme={theme} variant="primary">
              Glitch Hover
            </ColdWarGlitchHoverButton>
            <ColdWarSliderButton theme={theme} variant="primary">
              Slider Button
            </ColdWarSliderButton>
            <ColdWarSubscribeButton theme={theme} glow={true} />
            <ColdWarSubscribeButton theme={theme} subscribed={true} glow={true} />
            <ColdWarBorderButton theme={theme} variant="primary">
              Border Button
            </ColdWarBorderButton>
            <ColdWarHudButton theme={theme} variant="danger" leftIcon={<span>⚠</span>}>
              HUD Danger
            </ColdWarHudButton>
            <ColdWarGlitchButton theme={theme} variant="secondary" glitchIntensity="high">
              High Glitch
            </ColdWarGlitchButton>
            <ColdWarNeonButton theme={theme} variant="success" glowIntensity="high">
              High Glow
            </ColdWarNeonButton>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
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
            Inputs - Advanced Variants
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
            <ColdWarAiInput
              theme={theme}
              label="AI ASSISTANT"
              placeholder="Ask AI..."
              glow={true}
              scanlines={true}
            />
            <ColdWarHoloInput
              theme={theme}
              label="HOLOGRAPHIC INPUT"
              placeholder="Enter data..."
              glow={true}
            />
            <ColdWarHoloInputAdvanced
              theme={theme}
              label="ADVANCED HOLO"
              placeholder="Multi-layer holo..."
              glow={true}
            />
            <ColdWarFuturisticInput
              theme={theme}
              label="FUTURISTIC"
              placeholder="Animated border..."
              glow={true}
            />
            <ColdWarBashInput
              theme={theme}
              label="BASH TERMINAL"
              placeholder="command..."
              glow={true}
              scanlines={true}
            />
            <ColdWarFloatingInput
              theme={theme}
              label="Floating Label"
              placeholder="Type here..."
              glow={true}
            />
            <ColdWarAccessInput
              theme={theme}
              label="SECURE ACCESS"
              placeholder="Enter credentials..."
              glow={true}
            />
            <ColdWarFriendInput
              theme={theme}
              label="ADD FRIEND"
              placeholder="Username..."
              glow={true}
            />
            <ColdWarCodeInput theme={theme} length={6} glow={true} />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Inputs - States
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
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

        {/* Data Display Components Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Data Display Components</h2>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Pip-Boy Interface
          </h3>
          <div style={{ maxWidth: '600px' }}>
            <ColdWarPipBoy theme={theme} glow={true} />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>Data Table</h3>
          <div style={{ maxWidth: '800px' }}>
            <ColdWarTable
              theme={theme}
              columns={[
                { key: 'id', label: 'ID', sortable: true },
                { key: 'name', label: 'AGENT', sortable: true },
                { key: 'status', label: 'STATUS', sortable: true },
                { key: 'missions', label: 'MISSIONS', sortable: true },
              ]}
              data={[
                { id: 'A-001', name: 'PERSEUS', status: 'ACTIVE', missions: 47 },
                { id: 'A-002', name: 'BELL', status: 'ACTIVE', missions: 32 },
                { id: 'A-003', name: 'ADLER', status: 'DEPLOYED', missions: 89 },
                { id: 'A-004', name: 'WOODS', status: 'STANDBY', missions: 156 },
              ]}
              glow={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>Data Grid</h3>
          <div style={{ maxWidth: '900px' }}>
            <ColdWarDataGrid
              theme={theme}
              columns={[
                { key: 'id', label: 'ID', sortable: true, filterable: true },
                { key: 'location', label: 'LOCATION', sortable: true, filterable: true },
                { key: 'threat', label: 'THREAT LEVEL', sortable: true },
                { key: 'distance', label: 'DISTANCE (KM)', sortable: true },
              ]}
              data={[
                { id: 'T-001', location: 'MOSCOW', threat: 'HIGH', distance: 1200 },
                { id: 'T-002', location: 'BERLIN', threat: 'MEDIUM', distance: 850 },
                { id: 'T-003', location: 'PRAGUE', threat: 'LOW', distance: 450 },
                { id: 'T-004', location: 'WARSAW', threat: 'MEDIUM', distance: 620 },
                { id: 'T-005', location: 'VIENNA', threat: 'LOW', distance: 380 },
              ]}
              pageSize={3}
              glow={true}
            />
          </div>
        </div>

        {/* Phase 3: Navigation & Feedback Components */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Phase 3: Navigation & Feedback</h2>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Breadcrumb Navigation
          </h3>
          <div style={{ marginBottom: '24px' }}>
            <ColdWarBreadcrumb
              theme={theme}
              items={[
                {
                  id: '1',
                  label: 'Home',
                  icon: <span>🏠</span>,
                  onClick: () => console.log('Home'),
                },
                {
                  id: '2',
                  label: 'Operations',
                  icon: <span>⚡</span>,
                  onClick: () => console.log('Operations'),
                },
                { id: '3', label: 'Mission Briefing', icon: <span>📋</span> },
              ]}
              glow={true}
              scanlines={true}
              showTechCode={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Sidebar Navigation
          </h3>
          <div style={{ marginBottom: '24px', maxWidth: '300px' }}>
            <ColdWarSidebar
              theme={theme}
              items={[
                {
                  id: '1',
                  label: 'Dashboard',
                  icon: <span>📊</span>,
                  onClick: () => console.log('Dashboard'),
                },
                {
                  id: '2',
                  label: 'Operations',
                  icon: <span>⚡</span>,
                  onClick: () => console.log('Operations'),
                },
                {
                  id: '3',
                  label: 'Intelligence',
                  icon: <span>🔍</span>,
                  onClick: () => console.log('Intel'),
                },
                {
                  id: '4',
                  label: 'Assets',
                  icon: <span>🎯</span>,
                  onClick: () => console.log('Assets'),
                },
                {
                  id: '5',
                  label: 'Settings',
                  icon: <span>⚙</span>,
                  onClick: () => console.log('Settings'),
                },
              ]}
              activeItemId="2"
              glow={true}
              scanlines={true}
              showTechCode={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Dropdown Menu
          </h3>
          <div style={{ marginBottom: '24px' }}>
            <ColdWarMenu
              theme={theme}
              trigger={
                <ColdWarButton theme={theme} variant="primary">
                  TACTICAL MENU
                </ColdWarButton>
              }
              items={[
                {
                  id: '1',
                  label: 'New Mission',
                  icon: <span>➕</span>,
                  onClick: () => console.log('New'),
                },
                {
                  id: '2',
                  label: 'View Reports',
                  icon: <span>📄</span>,
                  onClick: () => console.log('Reports'),
                },
                {
                  id: '3',
                  label: 'Export Data',
                  icon: <span>💾</span>,
                  onClick: () => console.log('Export'),
                },
                { id: 'divider-1', label: '', divider: true },
                {
                  id: '4',
                  label: 'Settings',
                  icon: <span>⚙</span>,
                  onClick: () => console.log('Settings'),
                },
                {
                  id: '5',
                  label: 'Logout',
                  icon: <span>🚪</span>,
                  onClick: () => console.log('Logout'),
                  danger: true,
                },
              ]}
              glow={true}
              scanlines={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Dialog Component
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarButton
              theme={theme}
              variant="primary"
              onClick={() => {
                const DialogDemo = () => {
                  const [isOpen, setIsOpen] = React.useState(true);
                  return (
                    <ColdWarDialog
                      isOpen={isOpen}
                      variant="info"
                      title="MISSION BRIEFING"
                      message="Operation Perseus requires immediate deployment. Confirm mission acceptance?"
                      confirmLabel="ACCEPT"
                      cancelLabel="DECLINE"
                      theme={theme}
                      glow={true}
                      scanlines={true}
                      onConfirm={() => {
                        console.log('Mission accepted');
                        setIsOpen(false);
                      }}
                      onCancel={() => {
                        console.log('Mission declined');
                        setIsOpen(false);
                      }}
                      onClose={() => setIsOpen(false)}
                    />
                  );
                };
                // Note: In real app, use state management
                alert('Dialog demo - check console');
              }}
            >
              INFO DIALOG
            </ColdWarButton>
            <ColdWarButton
              theme={theme}
              variant="danger"
              onClick={() => alert('Warning Dialog demo')}
            >
              WARNING DIALOG
            </ColdWarButton>
            <ColdWarButton
              theme={theme}
              variant="success"
              onClick={() => alert('Success Dialog demo')}
            >
              SUCCESS DIALOG
            </ColdWarButton>
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Toast Notifications
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarButton
              theme={theme}
              variant="primary"
              onClick={() => alert('Toast demo - In production, use ColdWarNotificationProvider')}
            >
              SHOW INFO TOAST
            </ColdWarButton>
            <ColdWarButton
              theme={theme}
              variant="success"
              onClick={() => alert('Success Toast demo')}
            >
              SUCCESS TOAST
            </ColdWarButton>
            <ColdWarButton theme={theme} variant="danger" onClick={() => alert('Error Toast demo')}>
              ERROR TOAST
            </ColdWarButton>
          </div>
        </div>

        {/* Phase 3: Loaders */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Phase 3: Loaders</h2>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Abstergo Loader
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarAbstergoLoader theme={theme} size="sm" scanlines glow showCorners />
            <ColdWarAbstergoLoader theme={theme} size="md" scanlines glow showCorners />
            <ColdWarAbstergoLoader theme={theme} size="lg" scanlines glow showCorners />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Heart Rate Loader
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarHeartRateLoader theme={theme} size="sm" pulseSpeed="slow" glow />
            <ColdWarHeartRateLoader theme={theme} size="md" pulseSpeed="normal" glow />
            <ColdWarHeartRateLoader theme={theme} size="lg" pulseSpeed="fast" glow />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Hacker Loader
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarHackerLoader
              theme={theme}
              size="md"
              messages={['CONNECTING...', 'ACCESSING DATABASE...', 'LOADING DATA...']}
              typingSpeed={50}
              scanlines
              glow
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Binary Loader
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarBinaryLoader theme={theme} size="sm" speed="slow" density="low" glow />
            <ColdWarBinaryLoader theme={theme} size="md" speed="normal" density="medium" glow />
            <ColdWarBinaryLoader theme={theme} size="lg" speed="fast" density="high" glow />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            3D Cube Loader
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarCubeLoader theme={theme} size="sm" scanlines glow showCorners />
            <ColdWarCubeLoader theme={theme} size="md" scanlines glow showCorners />
            <ColdWarCubeLoader theme={theme} size="lg" scanlines glow showCorners />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Progress Loader
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarProgressLoader theme={theme} size="sm" progress={25} animated glow />
            <ColdWarProgressLoader theme={theme} size="md" progress={50} animated glow />
            <ColdWarProgressLoader theme={theme} size="lg" progress={75} animated glow />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Binary Hacker Loader
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarBinaryHackerLoader
              theme={theme}
              size="md"
              messages={['DECRYPTING...', 'ANALYZING...', 'COMPLETE']}
              scanlines
              glow
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Matrix Loader
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarMatrixLoader theme={theme} size="sm" glow />
            <ColdWarMatrixLoader theme={theme} size="md" glow />
            <ColdWarMatrixLoader theme={theme} size="lg" glow />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Scrolling Loader
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarScrollingLoader
              theme={theme}
              size="md"
              message="TACTICAL OPERATIONS IN PROGRESS"
              scrollSpeed="normal"
              glow
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Loading Text
          </h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarLoadingText theme={theme} size="sm" text="LOADING" animationStyle="dots" glow />
            <ColdWarLoadingText
              theme={theme}
              size="md"
              text="LOADING"
              animationStyle="pulse"
              glow
            />
            <ColdWarLoadingText theme={theme} size="lg" text="LOADING" animationStyle="fade" glow />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>Wave Loader</h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <ColdWarWaveLoader theme={theme} size="sm" waveFrequency="low" glow />
            <ColdWarWaveLoader theme={theme} size="md" waveFrequency="medium" glow />
            <ColdWarWaveLoader theme={theme} size="lg" waveFrequency="high" glow />
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
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

        {/* Data Display Section */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Data Display Components</h2>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Cards - All Variants
          </h3>
          <div style={gridStyle}>
            <ColdWarCard theme={theme} header="Basic Card" color="amber">
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                Standard tactical card with header and content
              </p>
            </ColdWarCard>
            <ColdWarCyberCard theme={theme} title="CYBER CARD" color="green" glow={true}>
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                Animated borders with cyber aesthetic
              </p>
            </ColdWarCyberCard>
            <ColdWarGlassCard
              theme={theme}
              title="GLASS CARD"
              body="Glass morphism effect with tactical styling"
              color="blue"
              glow={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Profile & Notification Cards
          </h3>
          <div style={gridStyle}>
            <ColdWarProfileCard
              theme={theme}
              username="OPERATIVE-7"
              title="FIELD AGENT"
              repositories={128}
              followers="42K"
              color="amber"
              glow={true}
            />
            <ColdWarNotificationCard
              theme={theme}
              title="TACTICAL ALERT"
              message="New mission briefing available"
              color="green"
              glow={true}
            />
            <ColdWarHudNotificationCard
              theme={theme}
              title="HUD ALERT"
              message="System status nominal"
              color="blue"
              glow={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Specialized Display Components
          </h3>
          <div style={gridStyle}>
            <ColdWarThermostatCard
              theme={theme}
              temperature={72}
              label="CURRENT"
              status="OPTIMAL"
              color="amber"
              glow={true}
            />
            <ColdWarTerminalSelector theme={theme} glow={true} scanlines={true} />
            <ColdWarRadar
              theme={theme}
              targets={2}
              color="green"
              glow={true}
              scanlines={true}
              size={280}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Media & Audio Components
          </h3>
          <div style={gridStyle}>
            <ColdWarMediaPlayer
              theme={theme}
              trackName="TACTICAL_AUDIO_01.WAV"
              currentTime="00:42"
              totalDuration="03:17"
              progress={21}
              volume={75}
              isPlaying={false}
              color="amber"
              glow={true}
            />
            <ColdWarAmplifier
              theme={theme}
              brandName="TACTICAL AUDIO 900"
              isPowered={false}
              leftChannelLevel={45}
              rightChannelLevel={55}
              volume={50}
              tone={50}
              color="green"
              glow={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            PipBoy Interface
          </h3>
          <div style={{ maxWidth: '100%', marginBottom: '24px' }}>
            <ColdWarPipBoy
              theme={theme}
              hp={{ current: 348, max: 450 }}
              ap={{ current: 67, max: 67 }}
              time="08:40"
              date="02.23.2026"
              rads={0}
              radarStatus="SEARCHING..."
              targets={1}
              color="green"
              glow={true}
              scanlines={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>Data Tables</h3>
          <div style={{ maxWidth: '100%', marginBottom: '24px' }}>
            <ColdWarTable
              theme={theme}
              data={[
                { id: 'OPS-001', status: 'ACTIVE', priority: 'HIGH', progress: 85 },
                { id: 'OPS-002', status: 'PENDING', priority: 'MEDIUM', progress: 45 },
                { id: 'OPS-003', status: 'COMPLETE', priority: 'LOW', progress: 100 },
                { id: 'OPS-004', status: 'ACTIVE', priority: 'HIGH', progress: 62 },
              ]}
              columns={[
                { key: 'id', label: 'OPERATION ID', sortable: true },
                { key: 'status', label: 'STATUS', sortable: true },
                { key: 'priority', label: 'PRIORITY', sortable: true },
                { key: 'progress', label: 'PROGRESS', sortable: true },
              ]}
              color="amber"
              glow={true}
              scanlines={true}
            />
          </div>

          <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>
            Data Grid with Pagination
          </h3>
          <div style={{ maxWidth: '100%', marginBottom: '24px' }}>
            <ColdWarDataGrid
              theme={theme}
              data={[
                { id: 'TGT-001', name: 'TARGET ALPHA', location: 'SECTOR 7', status: 'TRACKED' },
                { id: 'TGT-002', name: 'TARGET BRAVO', location: 'SECTOR 3', status: 'ENGAGED' },
                { id: 'TGT-003', name: 'TARGET CHARLIE', location: 'SECTOR 9', status: 'TRACKED' },
                { id: 'TGT-004', name: 'TARGET DELTA', location: 'SECTOR 5', status: 'IDLE' },
                { id: 'TGT-005', name: 'TARGET ECHO', location: 'SECTOR 2', status: 'TRACKED' },
                { id: 'TGT-006', name: 'TARGET FOXTROT', location: 'SECTOR 8', status: 'ENGAGED' },
              ]}
              columns={[
                { key: 'id', label: 'TARGET ID', sortable: true },
                { key: 'name', label: 'NAME', sortable: true },
                { key: 'location', label: 'LOCATION', sortable: true },
                { key: 'status', label: 'STATUS', sortable: true },
              ]}
              pageSize={3}
              color="green"
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
      </div>
    </div>
  );
};

export default ColdWarShowcase;
