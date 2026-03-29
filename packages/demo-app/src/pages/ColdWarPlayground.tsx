import React, { useState } from 'react';
import {
  ColdWarButton,
  ColdWarInput,
  ColdWarCard,
  Container,
  Text,
  Stack,
} from '@rhuds/components';
import { ColdWarBubbleChartStyled } from '../../../components/src/Visualization';
import { TacticalMotionBackground } from '../components/TacticalMotionBackground';
import { ColdWarComponentPlayground } from '../components/ColdWarComponentPlayground';
import { GeometricWrapper } from '../components/GeometricWrapper';
import { ColdWarContextMenu } from '../components/ColdWarContextMenu';
import { useColdWarContextMenu } from '../hooks/useColdWarContextMenu';

type ThemeVariant = 'perseus' | 'greenTerminal' | 'satelliteView';

const ColdWarPlayground: React.FC = () => {
  const [theme, setTheme] = useState<ThemeVariant>('perseus');
  const { contextMenu, handleContextMenu, handleCloseContextMenu } = useColdWarContextMenu();

  const [inputValue, setInputValue] = useState('');
  const [buttonVariant, setButtonVariant] = useState<string>('primary');
  const [buttonSize, setButtonSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [cardColor, setCardColor] = useState<'amber' | 'green' | 'blue' | 'red' | 'neutral'>(
    'amber'
  );
  const [cardVariant, setCardVariant] = useState<
    'tactical' | 'glass' | 'notification' | 'data' | 'minimal'
  >('tactical');
  const [cardElevation, setCardElevation] = useState<'none' | 'low' | 'medium' | 'high'>('medium');
  const [glow, setGlow] = useState(true);
  const [scanlines, setScanlines] = useState(false);
  const [hoverable, setHoverable] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--cw-color-background)',
        color: 'var(--cw-color-text)',
        fontFamily: 'var(--cw-font-family)',
        padding: 0,
        position: 'relative',
        zIndex: 1,
      }}
      data-theme={theme}
      onContextMenu={handleContextMenu}
    >
      <TacticalMotionBackground variant={theme === 'satelliteView' ? 'satellite' : 'perimeter'} />
      {contextMenu && (
        <ColdWarContextMenu x={contextMenu.x} y={contextMenu.y} onClose={handleCloseContextMenu} />
      )}
      <Container
        maxWidth="1400px"
        style={{ padding: '3rem 2rem', position: 'relative', zIndex: 10, marginTop: '70px' }}
      >
        <Text variant="h1" style={{ color: 'var(--cw-color-primary)', marginBottom: '1rem' }}>
          Cold War Component Playground
        </Text>
        <Text variant="body" style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '3rem' }}>
          Interactive component builder and code generator
        </Text>

        {/* Theme Selector */}
        <div style={{ marginBottom: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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

        {/* Button Component */}
        <ColdWarComponentPlayground
          title="ColdWarButton"
          description="Tactical button with multiple variants and effects"
          code={`<ColdWarButton
  theme="${theme}"
  variant="${buttonVariant}"
  size="${buttonSize}"
  glow={${glow}}
  scanlines={${scanlines}}
>
  Click Me
</ColdWarButton>`}
        >
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <GeometricWrapper
                variant="cut-corners"
                color="#29F2DF"
                glowIntensity="low"
                style={{
                  padding: '2rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <ColdWarButton
                  theme={theme}
                  variant={buttonVariant as any}
                  size={buttonSize}
                  glow={glow}
                  scanlines={scanlines}
                >
                  Preview Button
                </ColdWarButton>
              </GeometricWrapper>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Stack direction="column" gap="1rem">
                <div>
                  <label
                    style={{
                      color: 'var(--cw-color-primary)',
                      fontSize: 'var(--cw-font-size-sm)',
                      fontWeight: 700,
                      letterSpacing: 'var(--cw-letter-spacing-labels)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Variant
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(
                      ['primary', 'secondary', 'danger', 'success', 'tactical', 'glitch'] as const
                    ).map((v) => (
                      <ColdWarButton
                        key={v}
                        theme={theme}
                        variant={buttonVariant === v ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setButtonVariant(v)}
                      >
                        {v}
                      </ColdWarButton>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      color: 'var(--cw-color-primary)',
                      fontSize: 'var(--cw-font-size-sm)',
                      fontWeight: 700,
                      letterSpacing: 'var(--cw-letter-spacing-labels)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Size
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['sm', 'md', 'lg'] as const).map((s) => (
                      <ColdWarButton
                        key={s}
                        theme={theme}
                        variant={buttonSize === s ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setButtonSize(s)}
                      >
                        {s.toUpperCase()}
                      </ColdWarButton>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--cw-color-text)',
                      cursor: 'pointer',
                      fontSize: 'var(--cw-font-size-sm)',
                      fontFamily: 'var(--cw-font-family)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={glow}
                      onChange={(e) => setGlow(e.target.checked)}
                    />
                    Glow Effect
                  </label>
                </div>
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--cw-color-text)',
                      cursor: 'pointer',
                      fontSize: 'var(--cw-font-size-sm)',
                      fontFamily: 'var(--cw-font-family)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={scanlines}
                      onChange={(e) => setScanlines(e.target.checked)}
                    />
                    Scanlines Effect
                  </label>
                </div>
              </Stack>
            </div>
          </div>
        </ColdWarComponentPlayground>

        {/* Input Component */}
        <ColdWarComponentPlayground
          title="ColdWarInput"
          description="Tactical input field with validation states"
          code={`<ColdWarInput
  theme="${theme}"
  variant="tactical"
  label="Test Input"
  placeholder="Type something..."
  glow={${glow}}
  scanlines={${scanlines}}
/>`}
        >
          <GeometricWrapper
            variant="angled"
            color="#29F2DF"
            style={{ padding: '2rem', background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <ColdWarInput
              theme={theme}
              variant="tactical"
              label="Test Input"
              placeholder="Type something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              glow={glow}
              scanlines={scanlines}
            />
          </GeometricWrapper>
        </ColdWarComponentPlayground>

        {/* Card Component */}
        <ColdWarComponentPlayground
          title="ColdWarCard"
          description="Display card with multiple variants and effects"
          code={`<ColdWarCard
  theme="${theme}"
  variant="${cardVariant}"
  elevation="${cardElevation}"
  color="${cardColor}"
  header="Card Title"
  footer="Card Footer"
  glow={${glow}}
  scanlines={${scanlines}}
  hoverable={${hoverable}}
>
  Card content goes here
</ColdWarCard>`}
        >
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <GeometricWrapper
                variant="complex"
                color="#29F2DF"
                style={{
                  padding: '2rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                <ColdWarCard
                  theme={theme}
                  variant={cardVariant}
                  elevation={cardElevation}
                  color={cardColor}
                  header="Preview Card"
                  footer="Card Footer"
                  glow={glow}
                  scanlines={scanlines}
                  hoverable={hoverable}
                >
                  <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                    This is a preview of the Cold War card component with your selected settings.
                  </p>
                </ColdWarCard>
              </GeometricWrapper>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Stack direction="column" gap="1rem">
                <div>
                  <label
                    style={{
                      color: 'var(--cw-color-primary)',
                      fontSize: 'var(--cw-font-size-sm)',
                      fontWeight: 700,
                      letterSpacing: 'var(--cw-letter-spacing-labels)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Color
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(['amber', 'green', 'blue', 'red', 'neutral'] as const).map((c) => (
                      <ColdWarButton
                        key={c}
                        theme={theme}
                        variant={cardColor === c ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setCardColor(c)}
                      >
                        {c}
                      </ColdWarButton>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      color: 'var(--cw-color-primary)',
                      fontSize: 'var(--cw-font-size-sm)',
                      fontWeight: 700,
                      letterSpacing: 'var(--cw-letter-spacing-labels)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Variant
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(['tactical', 'glass', 'notification', 'data', 'minimal'] as const).map(
                      (v) => (
                        <ColdWarButton
                          key={v}
                          theme={theme}
                          variant={cardVariant === v ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setCardVariant(v)}
                        >
                          {v}
                        </ColdWarButton>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      color: 'var(--cw-color-primary)',
                      fontSize: 'var(--cw-font-size-sm)',
                      fontWeight: 700,
                      letterSpacing: 'var(--cw-letter-spacing-labels)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Elevation
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(['none', 'low', 'medium', 'high'] as const).map((e) => (
                      <ColdWarButton
                        key={e}
                        theme={theme}
                        variant={cardElevation === e ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setCardElevation(e)}
                      >
                        {e}
                      </ColdWarButton>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--cw-color-text)',
                      cursor: 'pointer',
                      fontSize: 'var(--cw-font-size-sm)',
                      fontFamily: 'var(--cw-font-family)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={hoverable}
                      onChange={(e) => setHoverable(e.target.checked)}
                    />
                    Hoverable
                  </label>
                </div>
              </Stack>
            </div>
          </div>
        </ColdWarComponentPlayground>

        {/* Bubble Chart Component */}
        <ColdWarComponentPlayground
          title="Bubble Chart Visualization"
          description="Tactical data visualization with bubble chart"
          code={`<ColdWarBubbleChartStyled
  data={[
    { x: 25, y: 35, r: 18, label: 'A', color: '#FFB000' },
    { x: 45, y: 55, r: 22, label: 'B', color: '#33FF00' },
    { x: 65, y: 65, r: 28, label: 'C', color: '#FF3333' },
    { x: 80, y: 45, r: 32, label: 'D', color: '#00ccff' },
  ]}
  width={600}
  height={400}
  xLabel="Threat Level"
  yLabel="Strategic Value"
/>`}
        >
          <GeometricWrapper
            variant="complex"
            color="#FFB000"
            style={{
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <ColdWarBubbleChartStyled
              data={[
                { x: 25, y: 35, r: 18, label: 'A', color: '#FFB000' },
                { x: 45, y: 55, r: 22, label: 'B', color: '#33FF00' },
                { x: 65, y: 65, r: 28, label: 'C', color: '#FF3333' },
                { x: 80, y: 45, r: 32, label: 'D', color: '#00ccff' },
              ]}
              width={600}
              height={400}
              xLabel="Threat Level"
              yLabel="Strategic Value"
            />
          </GeometricWrapper>
        </ColdWarComponentPlayground>

        {/* Component Library Overview */}
        <div style={{ marginTop: '4rem' }}>
          <Text variant="h2" style={{ color: 'var(--cw-color-primary)', marginBottom: '2rem' }}>
            Component Library
          </Text>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            <ColdWarCard theme={theme} header="Buttons" color="amber">
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                Multiple variants: primary, secondary, danger, success, tactical, glitch
              </p>
            </ColdWarCard>
            <ColdWarCard theme={theme} header="Inputs" color="green">
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                Various input types with validation states and icons
              </p>
            </ColdWarCard>
            <ColdWarCard theme={theme} header="Cards" color="blue">
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                Display components with multiple variants and effects
              </p>
            </ColdWarCard>
            <ColdWarCard theme={theme} header="Bubble Chart" color="amber">
              <p style={{ margin: 0, fontSize: 'var(--cw-font-size-sm)' }}>
                Tactical data visualization with canvas-based rendering
              </p>
            </ColdWarCard>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ColdWarPlayground;
