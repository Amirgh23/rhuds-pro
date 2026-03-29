import React, { useState } from 'react';
import { ColdWarButton } from '@rhuds/components';
import { ColdWarCard } from '@rhuds/components';
import { ColdWarBubbleChartStyled } from '../../../components/src/Visualization';
import { TacticalMotionBackground } from '../components/TacticalMotionBackground';
import { ColdWarContextMenu } from '../components/ColdWarContextMenu';
import { useColdWarContextMenu } from '../hooks/useColdWarContextMenu';

type ThemeVariant = 'perseus' | 'greenTerminal' | 'satelliteView';
type DocSection = 'overview' | 'components' | 'theming' | 'effects' | 'api' | 'bubblechart';

const ColdWarDocs: React.FC = () => {
  const [theme, setTheme] = useState<ThemeVariant>('perseus');
  const [activeSection, setActiveSection] = useState<DocSection>('overview');
  const { contextMenu, handleContextMenu, handleCloseContextMenu } = useColdWarContextMenu();

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: 'var(--cw-color-background)',
    color: 'var(--cw-color-text)',
    fontFamily: 'var(--cw-font-family)',
    padding: '80px 48px 48px',
    position: 'relative',
    zIndex: 1,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
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
    gridTemplateColumns: '250px 1fr',
    gap: '32px',
  };

  const sidebarStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'sticky',
    top: '100px',
    height: 'fit-content',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  };

  const codeBlockStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid var(--cw-color-primary)',
    padding: '16px',
    borderRadius: '4px',
    fontSize: 'var(--cw-font-size-xs)',
    fontFamily: 'monospace',
    color: 'var(--cw-color-primary)',
    overflow: 'auto',
    maxHeight: '300px',
    marginBottom: '16px',
  };

  const renderOverview = () => (
    <div style={contentStyle}>
      <div>
        <h2 style={sectionTitleStyle}>Cold War Design System</h2>
        <p
          style={{ fontSize: 'var(--cw-font-size-base)', lineHeight: '1.6', marginBottom: '16px' }}
        >
          The Cold War design system brings the tactical aesthetic of Call of Duty: Black Ops to
          RHUDS Pro. It features military-inspired UI elements with authentic CRT effects and
          monospace typography.
        </p>
      </div>

      <ColdWarCard theme={theme} header="Key Features" color="amber">
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: 'var(--cw-font-size-sm)' }}>
          <li>Chamfered corners for tactical geometry</li>
          <li>Three distinct theme variants</li>
          <li>CRT effects (scanlines, glow, flicker)</li>
          <li>WCAG 2.1 AA accessibility compliance</li>
          <li>Monospace typography with uppercase transform</li>
          <li>Mechanical animation easing curves</li>
        </ul>
      </ColdWarCard>

      <ColdWarCard theme={theme} header="Theme Variants" color="green">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Perseus:</strong> Tactical Amber & Black - Primary military aesthetic
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Green Terminal:</strong> Phosphor Green & Black - Retro terminal style
          </p>
          <p style={{ margin: 0 }}>
            <strong>Satellite View:</strong> Satellite Blue & White - Radar view aesthetic
          </p>
        </div>
      </ColdWarCard>
    </div>
  );

  const renderComponents = () => (
    <div style={contentStyle}>
      <div>
        <h2 style={sectionTitleStyle}>Components</h2>
      </div>

      <ColdWarCard theme={theme} header="ColdWarButton" color="amber">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Variants:</strong> primary, secondary, danger, success, tactical, glitch
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Sizes:</strong> sm, md, lg
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Props:</strong> theme, variant, size, glow, scanlines, disabled, isLoading,
            leftIcon, rightIcon, iconPlacement
          </p>
          <div style={codeBlockStyle}>
            {`<ColdWarButton
  theme="perseus"
  variant="primary"
  size="md"
  glow={true}
  scanlines={false}
>
  Click Me
</ColdWarButton>`}
          </div>
        </div>
      </ColdWarCard>

      <ColdWarCard theme={theme} header="ColdWarInput" color="green">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Variants:</strong> tactical, terminal, holo, glitch, minimal
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>States:</strong> default, focus, success, error, disabled
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Props:</strong> theme, variant, size, label, placeholder, value, onChange, glow,
            scanlines, state, errorMessage, successMessage, leftIcon, rightIcon
          </p>
          <div style={codeBlockStyle}>
            {`<ColdWarInput
  theme="perseus"
  variant="tactical"
  label="Username"
  placeholder="Enter username..."
  glow={true}
  scanlines={true}
/>`}
          </div>
        </div>
      </ColdWarCard>

      <ColdWarCard theme={theme} header="ColdWarCard" color="blue">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Variants:</strong> tactical, glass, notification, data, minimal
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Colors:</strong> amber, green, blue, red, neutral
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Elevations:</strong> none, low, medium, high
          </p>
          <div style={codeBlockStyle}>
            {`<ColdWarCard
  theme="perseus"
  variant="tactical"
  color="amber"
  header="Mission Briefing"
  elevation="medium"
  glow={true}
>
  Content here
</ColdWarCard>`}
          </div>
        </div>
      </ColdWarCard>
    </div>
  );

  const renderTheming = () => (
    <div style={contentStyle}>
      <div>
        <h2 style={sectionTitleStyle}>Theming System</h2>
      </div>

      <ColdWarCard theme={theme} header="CSS Variables" color="amber">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            All Cold War components use CSS custom properties for theming:
          </p>
          <div style={codeBlockStyle}>
            {`--cw-color-background
--cw-color-surface
--cw-color-primary
--cw-color-secondary
--cw-color-accent
--cw-color-text
--cw-color-text-secondary
--cw-color-error
--cw-color-success
--cw-color-warning

--cw-font-family
--cw-font-size-xs
--cw-font-size-sm
--cw-font-size-base
--cw-font-size-lg
--cw-font-size-xl
--cw-font-size-2xl

--cw-letter-spacing-body
--cw-letter-spacing-headers

--cw-chamfer-small
--cw-chamfer-medium
--cw-chamfer-large`}
          </div>
        </div>
      </ColdWarCard>

      <ColdWarCard theme={theme} header="Theme Switching" color="green">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            Switch themes by setting the data-theme attribute on a container:
          </p>
          <div style={codeBlockStyle}>
            {`<div data-theme="perseus">
  {/* Components here */}
</div>

<div data-theme="greenTerminal">
  {/* Components here */}
</div>

<div data-theme="satelliteView">
  {/* Components here */}
</div>`}
          </div>
        </div>
      </ColdWarCard>

      <ColdWarCard theme={theme} header="Color Palettes" color="blue">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Perseus:</strong> #FFB000 (Amber), #33FF00 (Green), #0066CC (Blue)
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Green Terminal:</strong> #33FF00 (Green), #FFB000 (Amber), #00CCFF (Cyan)
          </p>
          <p style={{ margin: 0 }}>
            <strong>Satellite View:</strong> #00CCFF (Cyan), #0066CC (Blue), #FFB000 (Amber)
          </p>
        </div>
      </ColdWarCard>
    </div>
  );

  const renderEffects = () => (
    <div style={contentStyle}>
      <div>
        <h2 style={sectionTitleStyle}>Visual Effects</h2>
      </div>

      <ColdWarCard theme={theme} header="Glow Effect" color="amber">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            Phosphor glow effect simulates CRT monitor phosphor persistence. Enable with the glow
            prop:
          </p>
          <div style={codeBlockStyle}>
            {`<ColdWarButton glow={true}>
  Glowing Button
</ColdWarButton>`}
          </div>
          <p style={{ margin: 0 }}>
            Creates a soft halo around the component using box-shadow and filter effects.
          </p>
        </div>
      </ColdWarCard>

      <ColdWarCard theme={theme} header="Scanlines Effect" color="green">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            Horizontal scanlines simulate CRT display lines. Enable with the scanlines prop:
          </p>
          <div style={codeBlockStyle}>
            {`<ColdWarCard scanlines={true} scanlinesIntensity="medium">
  Content
</ColdWarCard>`}
          </div>
          <p style={{ margin: 0 }}>
            Intensities: low, medium, high. Uses CSS pseudo-elements for performance.
          </p>
        </div>
      </ColdWarCard>

      <ColdWarCard theme={theme} header="Chamfered Corners" color="blue">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            Tactical clip-path geometry creates chamfered corners. Three sizes available:
          </p>
          <div style={codeBlockStyle}>
            {`--cw-chamfer-small: polygon(...)
--cw-chamfer-medium: polygon(...)
--cw-chamfer-large: polygon(...)`}
          </div>
          <p style={{ margin: 0 }}>
            Applied automatically to components based on their size and variant.
          </p>
        </div>
      </ColdWarCard>

      <ColdWarCard theme={theme} header="Animation Easing" color="amber">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            Mechanical easing curves for tactical feel. Timing: 150-300ms for interactions.
          </p>
          <div style={codeBlockStyle}>
            {`cubic-bezier(0.34, 1.56, 0.64, 1)
cubic-bezier(0.25, 0.46, 0.45, 0.94)
cubic-bezier(0.68, -0.55, 0.265, 1.55)`}
          </div>
          <p style={{ margin: 0 }}>Creates snappy, responsive feel appropriate for military UI.</p>
        </div>
      </ColdWarCard>
    </div>
  );

  const renderAPI = () => (
    <div style={contentStyle}>
      <div>
        <h2 style={sectionTitleStyle}>Component API Reference</h2>
      </div>

      <ColdWarCard theme={theme} header="ColdWarButton Props" color="amber">
        <div style={{ fontSize: 'var(--cw-font-size-xs)', fontFamily: 'monospace' }}>
          <div style={codeBlockStyle}>
            {`interface ColdWarButtonProps {
  theme: 'perseus' | 'greenTerminal' | 'satelliteView'
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'tactical' | 'glitch'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  scanlines?: boolean
  disabled?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  iconPlacement?: 'left' | 'right' | 'both' | 'only'
  onClick?: (e: React.MouseEvent) => void
  children: React.ReactNode
}`}
          </div>
        </div>
      </ColdWarCard>

      <ColdWarCard theme={theme} header="ColdWarInput Props" color="green">
        <div style={{ fontSize: 'var(--cw-font-size-xs)', fontFamily: 'monospace' }}>
          <div style={codeBlockStyle}>
            {`interface ColdWarInputProps {
  theme: 'perseus' | 'greenTerminal' | 'satelliteView'
  variant?: 'tactical' | 'terminal' | 'holo' | 'glitch' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  glow?: boolean
  scanlines?: boolean
  state?: 'default' | 'focus' | 'success' | 'error'
  errorMessage?: string
  successMessage?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  iconPlacement?: 'left' | 'right' | 'both'
  disabled?: boolean
}`}
          </div>
        </div>
      </ColdWarCard>

      <ColdWarCard theme={theme} header="ColdWarCard Props" color="blue">
        <div style={{ fontSize: 'var(--cw-font-size-xs)', fontFamily: 'monospace' }}>
          <div style={codeBlockStyle}>
            {`interface ColdWarCardProps {
  theme: 'perseus' | 'greenTerminal' | 'satelliteView'
  variant?: 'tactical' | 'glass' | 'notification' | 'data' | 'minimal'
  color?: 'amber' | 'green' | 'blue' | 'red' | 'neutral'
  header?: string
  footer?: string
  elevation?: 'none' | 'low' | 'medium' | 'high'
  glow?: boolean
  scanlines?: boolean
  scanlinesIntensity?: 'low' | 'medium' | 'high'
  hoverable?: boolean
  onClick?: () => void
  children: React.ReactNode
}`}
          </div>
        </div>
      </ColdWarCard>
    </div>
  );

  const renderMigration = () => (
    <div style={contentStyle}>
      <div>
        <h2 style={sectionTitleStyle}>Bubble Chart Visualization</h2>
      </div>

      <ColdWarCard theme={theme} header="Tactical Data Visualization" color="amber">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            The Bubble Chart component provides advanced 3D data visualization with tactical
            styling.
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Features:</strong>
          </p>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
            <li>Canvas-based rendering for performance</li>
            <li>Support for 100+ data points</li>
            <li>Customizable colors and styling</li>
            <li>Grid and axis display options</li>
            <li>Glow effects for tactical appearance</li>
          </ul>
        </div>
      </ColdWarCard>

      <ColdWarCard theme={theme} header="Example: Tactical Analysis" color="green">
        <div style={{ fontSize: 'var(--cw-font-size-sm)', marginBottom: '12px' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Data Structure:</strong>
          </p>
          <div style={codeBlockStyle}>
            {`const tacticalData = [
  { x: 25, y: 35, r: 18, label: 'A', color: '#FFB000' },
  { x: 45, y: 55, r: 22, label: 'B', color: '#33FF00' },
  { x: 65, y: 65, r: 28, label: 'C', color: '#FF3333' },
  { x: 80, y: 45, r: 32, label: 'D', color: '#00ccff' },
];`}
          </div>
        </div>
        <ColdWarBubbleChartStyled
          data={[
            { x: 25, y: 35, r: 18, label: 'A', color: '#FFB000' },
            { x: 45, y: 55, r: 22, label: 'B', color: '#33FF00' },
            { x: 65, y: 65, r: 28, label: 'C', color: '#FF3333' },
            { x: 80, y: 45, r: 32, label: 'D', color: '#00ccff' },
          ]}
          width={500}
          height={350}
          xLabel="Threat Level"
          yLabel="Strategic Value"
        />
      </ColdWarCard>

      <ColdWarCard theme={theme} header="Usage" color="blue">
        <div style={{ fontSize: 'var(--cw-font-size-sm)' }}>
          <div style={codeBlockStyle}>
            {`import { ColdWarBubbleChart } from '@rhuds/components/Visualization';

<ColdWarBubbleChart
  data={tacticalData}
  width={600}
  height={400}
  xLabel="Threat Level"
  yLabel="Strategic Value"
/>`}
          </div>
        </div>
      </ColdWarCard>
    </div>
  );

  const sections: Record<DocSection, () => React.ReactNode> = {
    overview: renderOverview,
    components: renderComponents,
    theming: renderTheming,
    effects: renderEffects,
    api: renderAPI,
    bubblechart: renderMigration,
  };

  return (
    <div style={pageStyle} data-theme={theme} onContextMenu={handleContextMenu}>
      <TacticalMotionBackground variant={theme === 'satelliteView' ? 'satellite' : 'perimeter'} />
      {contextMenu && (
        <ColdWarContextMenu x={contextMenu.x} y={contextMenu.y} onClose={handleCloseContextMenu} />
      )}
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Cold War Documentation</h1>
          <p style={{ color: 'var(--cw-color-text-secondary)', marginBottom: '24px' }}>
            Complete guide to Cold War design system and components
          </p>

          {/* Theme Selector */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {(['perseus', 'greenTerminal', 'satelliteView'] as const).map((t) => (
              <ColdWarButton
                key={t}
                theme={t}
                variant={theme === t ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTheme(t)}
              >
                {t === 'perseus' && 'Perseus'}
                {t === 'greenTerminal' && 'Green Terminal'}
                {t === 'satelliteView' && 'Satellite View'}
              </ColdWarButton>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={gridStyle}>
          {/* Sidebar */}
          <div style={sidebarStyle}>
            {(['overview', 'components', 'theming', 'effects', 'api', 'bubblechart'] as const).map(
              (section) => (
                <ColdWarButton
                  key={section}
                  theme={theme}
                  variant={activeSection === section ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveSection(section)}
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  {section === 'overview' && 'Overview'}
                  {section === 'components' && 'Components'}
                  {section === 'theming' && 'Theming'}
                  {section === 'effects' && 'Effects'}
                  {section === 'api' && 'API Reference'}
                  {section === 'bubblechart' && 'Bubble Chart'}
                </ColdWarButton>
              )
            )}
          </div>

          {/* Content */}
          <div>{sections[activeSection]()}</div>
        </div>
      </div>
    </div>
  );
};

export default ColdWarDocs;
