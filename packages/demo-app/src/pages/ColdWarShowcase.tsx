/**
 * Cold War Redesign - Showcase Page
 * Demonstrates the tactical military aesthetic across all components
 */

import React from 'react';
import { ColdWarButton } from '@rhuds/components';
import { ColdWarInput } from '@rhuds/components';
import { ColdWarCard } from '@rhuds/components';
import { TacticalMotionBackground } from '../components/TacticalMotionBackground';
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
  const [inputValue, setInputValue] = React.useState('');
  const [selectedButton, setSelectedButton] = React.useState<string | null>(null);
  const themeConfig = THEME_CONFIGS[theme];

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
      {/* Header */}
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
          <ColdWarButton theme={theme} variant="glitch" leftIcon={<span>⚠</span>} scanlines={true}>
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

        <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>Glow Effects</h3>
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

        <h3 style={{ ...subtitleStyle, marginTop: '24px', marginBottom: '16px' }}>Input Effects</h3>
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
  );
};

export default ColdWarShowcase;
