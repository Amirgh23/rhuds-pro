/**
 * Cold War Buttons Demo
 * Comprehensive demo of all Cold War button variants
 */

import React from 'react';
import { ColdWarButton, ColdWarHudButton, ColdWarGlitchButton, ColdWarNeonButton } from '../index';

export const ColdWarButtonsDemo: React.FC = () => {
  return (
    <div style={{ padding: '40px', background: '#0a0a0c', minHeight: '100vh' }}>
      <h1
        style={{
          color: '#FFB000',
          fontFamily: 'Share Tech Mono, monospace',
          textTransform: 'uppercase',
        }}
      >
        Cold War Buttons Demo
      </h1>

      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{ color: '#FFB000', fontFamily: 'Share Tech Mono, monospace', fontSize: '18px' }}
        >
          ColdWarButton - All Variants
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <ColdWarButton variant="primary">Primary</ColdWarButton>
          <ColdWarButton variant="secondary">Secondary</ColdWarButton>
          <ColdWarButton variant="danger">Danger</ColdWarButton>
          <ColdWarButton variant="success">Success</ColdWarButton>
          <ColdWarButton variant="tactical">Tactical</ColdWarButton>
          <ColdWarButton variant="glitch">Glitch</ColdWarButton>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{ color: '#FFB000', fontFamily: 'Share Tech Mono, monospace', fontSize: '18px' }}
        >
          ColdWarHudButton
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <ColdWarHudButton variant="primary">HUD Primary</ColdWarHudButton>
          <ColdWarHudButton variant="secondary">HUD Secondary</ColdWarHudButton>
          <ColdWarHudButton variant="danger">HUD Danger</ColdWarHudButton>
          <ColdWarHudButton variant="success">HUD Success</ColdWarHudButton>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{ color: '#FFB000', fontFamily: 'Share Tech Mono, monospace', fontSize: '18px' }}
        >
          ColdWarGlitchButton
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <ColdWarGlitchButton variant="primary" glitchIntensity="low">
            Low Glitch
          </ColdWarGlitchButton>
          <ColdWarGlitchButton variant="primary" glitchIntensity="medium">
            Medium Glitch
          </ColdWarGlitchButton>
          <ColdWarGlitchButton variant="primary" glitchIntensity="high">
            High Glitch
          </ColdWarGlitchButton>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{ color: '#FFB000', fontFamily: 'Share Tech Mono, monospace', fontSize: '18px' }}
        >
          ColdWarNeonButton
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <ColdWarNeonButton variant="primary" glowIntensity="low">
            Low Glow
          </ColdWarNeonButton>
          <ColdWarNeonButton variant="primary" glowIntensity="medium">
            Medium Glow
          </ColdWarNeonButton>
          <ColdWarNeonButton variant="primary" glowIntensity="high">
            High Glow
          </ColdWarNeonButton>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{ color: '#FFB000', fontFamily: 'Share Tech Mono, monospace', fontSize: '18px' }}
        >
          Sizes
        </h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <ColdWarButton variant="primary" size="sm">
            Small
          </ColdWarButton>
          <ColdWarButton variant="primary" size="md">
            Medium
          </ColdWarButton>
          <ColdWarButton variant="primary" size="lg">
            Large
          </ColdWarButton>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{ color: '#FFB000', fontFamily: 'Share Tech Mono, monospace', fontSize: '18px' }}
        >
          States
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <ColdWarButton variant="primary">Normal</ColdWarButton>
          <ColdWarButton variant="primary" disabled>
            Disabled
          </ColdWarButton>
          <ColdWarButton variant="primary" isLoading>
            Loading
          </ColdWarButton>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2
          style={{ color: '#FFB000', fontFamily: 'Share Tech Mono, monospace', fontSize: '18px' }}
        >
          With Icons
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <ColdWarButton variant="primary" leftIcon={<span>▶</span>}>
            Play
          </ColdWarButton>
          <ColdWarButton variant="danger" leftIcon={<span>✗</span>}>
            Cancel
          </ColdWarButton>
          <ColdWarButton variant="success" leftIcon={<span>✓</span>}>
            Confirm
          </ColdWarButton>
          <ColdWarButton variant="tactical" leftIcon={<span>⚡</span>} rightIcon={<span>⚡</span>}>
            Execute
          </ColdWarButton>
        </div>
      </section>

      <section>
        <h2
          style={{ color: '#FFB000', fontFamily: 'Share Tech Mono, monospace', fontSize: '18px' }}
        >
          Effects
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <ColdWarButton variant="primary" glow={true}>
            Glow
          </ColdWarButton>
          <ColdWarButton variant="primary" scanlines={true}>
            Scanlines
          </ColdWarButton>
          <ColdWarButton variant="primary" glow={true} scanlines={true}>
            Both
          </ColdWarButton>
        </div>
      </section>
    </div>
  );
};

export default ColdWarButtonsDemo;
