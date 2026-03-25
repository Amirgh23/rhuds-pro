/**
 * Cold War Animated Background Demo
 * Demonstrates different variants and intensities
 */

import React from 'react';
import { ColdWarAnimatedBackground } from './ColdWarAnimatedBackground';
import { ColdWarButton } from '@rhuds/components';
import '../styles/cold-war-theme.css';

export const ColdWarAnimatedBackgroundDemo: React.FC = () => {
  const [variant, setVariant] = React.useState<'perseus' | 'green-terminal' | 'satellite-view'>(
    'perseus'
  );
  const [intensity, setIntensity] = React.useState<'low' | 'medium' | 'high'>('medium');

  const containerStyle: React.CSSProperties = {
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
    fontSize: '32px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--cw-color-primary)',
    marginBottom: '16px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: 'var(--cw-color-text-secondary)',
    letterSpacing: '0.02em',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    marginBottom: '48px',
    flexWrap: 'wrap',
    padding: '24px',
    backgroundColor: 'var(--cw-color-surface)',
    border: '1px solid var(--cw-color-primary)',
    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
  };

  const controlGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    color: 'var(--cw-color-text-secondary)',
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const infoBoxStyle: React.CSSProperties = {
    padding: '24px',
    backgroundColor: 'var(--cw-color-surface)',
    border: '1px solid var(--cw-color-primary)',
    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
    marginTop: '48px',
  };

  const infoTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    color: 'var(--cw-color-primary)',
    marginBottom: '12px',
  };

  const infoTextStyle: React.CSSProperties = {
    fontSize: '14px',
    color: 'var(--cw-color-text-secondary)',
    lineHeight: '1.6',
    margin: '8px 0',
  };

  return (
    <div style={containerStyle}>
      <ColdWarAnimatedBackground variant={variant} intensity={intensity} />

      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Cold War Animated Background</h1>
        <p style={subtitleStyle}>Tactical Military Aesthetic with Dynamic Effects</p>
      </div>

      {/* Controls */}
      <div style={controlsStyle}>
        {/* Variant Control */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>Theme Variant</label>
          <div style={buttonGroupStyle}>
            {(['perseus', 'green-terminal', 'satellite-view'] as const).map((v) => (
              <ColdWarButton
                key={v}
                variant={variant === v ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setVariant(v)}
              >
                {v.replace('-', ' ')}
              </ColdWarButton>
            ))}
          </div>
        </div>

        {/* Intensity Control */}
        <div style={controlGroupStyle}>
          <label style={labelStyle}>Effect Intensity</label>
          <div style={buttonGroupStyle}>
            {(['low', 'medium', 'high'] as const).map((i) => (
              <ColdWarButton
                key={i}
                variant={intensity === i ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setIntensity(i)}
              >
                {i}
              </ColdWarButton>
            ))}
          </div>
        </div>
      </div>

      {/* Information */}
      <div style={infoBoxStyle}>
        <h2 style={infoTitleStyle}>Current Configuration</h2>
        <p style={infoTextStyle}>
          <strong>Variant:</strong> {variant.replace('-', ' ').toUpperCase()}
        </p>
        <p style={infoTextStyle}>
          <strong>Intensity:</strong> {intensity.toUpperCase()}
        </p>

        <h2 style={{ ...infoTitleStyle, marginTop: '24px' }}>Features</h2>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li style={infoTextStyle}>Animated grid with continuous movement</li>
          <li style={infoTextStyle}>CRT scanlines effect</li>
          <li style={infoTextStyle}>Dynamic noise overlay</li>
          <li style={infoTextStyle}>Pulsing corner markers</li>
          <li style={infoTextStyle}>Animated radar circles</li>
          <li style={infoTextStyle}>Theme-aware color system</li>
          <li style={infoTextStyle}>Accessibility support (prefers-reduced-motion)</li>
        </ul>

        <h2 style={{ ...infoTitleStyle, marginTop: '24px' }}>Usage</h2>
        <pre
          style={{
            backgroundColor: 'var(--cw-color-background)',
            padding: '12px',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            color: 'var(--cw-color-primary)',
          }}
        >
          {`<ColdWarAnimatedBackground 
  variant="${variant}" 
  intensity="${intensity}" 
/>`}
        </pre>
      </div>
    </div>
  );
};

export default ColdWarAnimatedBackgroundDemo;
