/**
 * Cold War Backgrounds Demo
 * Showcases all Cold War background components with theme and intensity controls
 */

import React, { useState } from 'react';
import {
  ColdWarGridLines,
  ColdWarRadar,
  ColdWarScanlines,
  ColdWarParticles,
  ColdWarNoise,
} from './index';
import type { ColdWarTheme, ColdWarIntensity } from './ColdWarGridLines';

const THEMES: ColdWarTheme[] = ['perseus', 'greenTerminal', 'satelliteView'];
const INTENSITIES: ColdWarIntensity[] = ['low', 'medium', 'high'];

const THEME_LABELS: Record<ColdWarTheme, string> = {
  perseus: 'Perseus (Amber)',
  greenTerminal: 'Green Terminal',
  satelliteView: 'Satellite View (Blue)',
};

const INTENSITY_LABELS: Record<ColdWarIntensity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

interface ComponentConfig {
  name: string;
  component: React.ComponentType<any>;
}

const COMPONENTS: ComponentConfig[] = [
  { name: 'Grid Lines', component: ColdWarGridLines },
  { name: 'Radar', component: ColdWarRadar },
  { name: 'Scanlines', component: ColdWarScanlines },
  { name: 'Particles', component: ColdWarParticles },
  { name: 'Noise', component: ColdWarNoise },
];

export const ColdWarBackgroundsDemo: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<ColdWarTheme>('perseus');
  const [selectedIntensity, setSelectedIntensity] = useState<ColdWarIntensity>('medium');
  const [selectedComponent, setSelectedComponent] = useState<number>(0);

  const Component = COMPONENTS[selectedComponent].component;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        fontFamily: 'monospace',
        backgroundColor: '#1a1a1a',
        color: '#00ff00',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ margin: 0, fontSize: '24px' }}>Cold War Background Components</h1>

      {/* Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          padding: '15px',
          border: '1px solid #00ff00',
          backgroundColor: 'rgba(0, 255, 0, 0.05)',
        }}
      >
        {/* Component Selector */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
            Component:
          </label>
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '8px',
              fontFamily: 'monospace',
              backgroundColor: '#2a2a2a',
              color: '#00ff00',
              border: '1px solid #00ff00',
              cursor: 'pointer',
            }}
          >
            {COMPONENTS.map((comp, idx) => (
              <option key={idx} value={idx}>
                {comp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Selector */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>Theme:</label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as ColdWarTheme)}
            style={{
              width: '100%',
              padding: '8px',
              fontFamily: 'monospace',
              backgroundColor: '#2a2a2a',
              color: '#00ff00',
              border: '1px solid #00ff00',
              cursor: 'pointer',
            }}
          >
            {THEMES.map((theme) => (
              <option key={theme} value={theme}>
                {THEME_LABELS[theme]}
              </option>
            ))}
          </select>
        </div>

        {/* Intensity Selector */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
            Intensity:
          </label>
          <select
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(e.target.value as ColdWarIntensity)}
            style={{
              width: '100%',
              padding: '8px',
              fontFamily: 'monospace',
              backgroundColor: '#2a2a2a',
              color: '#00ff00',
              border: '1px solid #00ff00',
              cursor: 'pointer',
            }}
          >
            {INTENSITIES.map((intensity) => (
              <option key={intensity} value={intensity}>
                {INTENSITY_LABELS[intensity]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          border: '2px solid #00ff00',
          backgroundColor: '#000000',
          overflow: 'hidden',
        }}
      >
        <Component
          width={800}
          height={400}
          theme={selectedTheme}
          intensity={selectedIntensity}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>

      {/* Info */}
      <div
        style={{
          padding: '15px',
          border: '1px solid #00ff00',
          backgroundColor: 'rgba(0, 255, 0, 0.05)',
          fontSize: '12px',
          lineHeight: '1.6',
        }}
      >
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>Component:</strong> {COMPONENTS[selectedComponent].name}
        </p>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>Theme:</strong> {THEME_LABELS[selectedTheme]}
        </p>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>Intensity:</strong> {INTENSITY_LABELS[selectedIntensity]}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Features:</strong> Performance optimized, accessibility support
          (prefers-reduced-motion), monospace typography, tactical aesthetic
        </p>
      </div>

      {/* Component Grid */}
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '15px' }}>All Components</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '15px',
          }}
        >
          {COMPONENTS.map((comp, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #00ff00',
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: selectedComponent === idx ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
                transition: 'background-color 0.2s',
              }}
              onClick={() => setSelectedComponent(idx)}
            >
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
                {comp.name}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>
                {idx === 0 && 'Tactical grid with perspective'}
                {idx === 1 && 'Rotating radar sweep'}
                {idx === 2 && 'CRT scanlines effect'}
                {idx === 3 && 'Military tactical particles'}
                {idx === 4 && 'Tactical noise texture'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ColdWarBackgroundsDemo.displayName = 'ColdWarBackgroundsDemo';
