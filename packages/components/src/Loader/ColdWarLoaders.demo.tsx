/**
 * Cold War Loaders Demo
 * Comprehensive showcase of all 11 Cold War loader components
 */

import React, { useState } from 'react';
import { ColdWarAbstergoLoader } from './ColdWarAbstergoLoader';
import { ColdWarHeartRateLoader } from './ColdWarHeartRateLoader';
import { ColdWarHackerLoader } from './ColdWarHackerLoader';
import { ColdWarBinaryLoader } from './ColdWarBinaryLoader';
import { ColdWarCubeLoader } from './ColdWarCubeLoader';
import { ColdWarProgressLoader } from './ColdWarProgressLoader';
import { ColdWarBinaryHackerLoader } from './ColdWarBinaryHackerLoader';
import { ColdWarMatrixLoader } from './ColdWarMatrixLoader';
import { ColdWarScrollingLoader } from './ColdWarScrollingLoader';
import { ColdWarLoadingText } from './ColdWarLoadingText';
import { ColdWarWaveLoader } from './ColdWarWaveLoader';
import { ColdWarProgressBar } from './ColdWarProgressBar';

export const ColdWarLoadersDemo: React.FC = () => {
  const [theme, setTheme] = useState<'perseus' | 'greenTerminal' | 'satelliteView'>('perseus');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [progress, setProgress] = useState(65);

  const containerStyles: React.CSSProperties = {
    padding: '40px',
    background: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 100%)',
    minHeight: '100vh',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
  };

  const headerStyles: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '40px',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: 700,
    color: theme === 'perseus' ? '#FFB000' : theme === 'greenTerminal' ? '#33FF00' : '#00CCFF',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '10px',
    textShadow: `0 0 20px ${theme === 'perseus' ? 'rgba(255, 176, 0, 0.5)' : theme === 'greenTerminal' ? 'rgba(51, 255, 0, 0.5)' : 'rgba(0, 204, 255, 0.5)'}`,
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '14px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
  };

  const controlsStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  };

  const controlGroupStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  };

  const selectStyles: React.CSSProperties = {
    padding: '8px 16px',
    background: 'rgba(10, 10, 20, 0.9)',
    border: `1px solid ${theme === 'perseus' ? '#FFB000' : theme === 'greenTerminal' ? '#33FF00' : '#00CCFF'}`,
    color: theme === 'perseus' ? '#FFB000' : theme === 'greenTerminal' ? '#33FF00' : '#00CCFF',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    outline: 'none',
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const sectionStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  };

  const loaderTitleStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: theme === 'perseus' ? '#FFB000' : theme === 'greenTerminal' ? '#33FF00' : '#00CCFF',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: '11px',
    color: '#666',
    textAlign: 'center',
    maxWidth: '280px',
  };

  const sliderContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '200px',
  };

  const sliderStyles: React.CSSProperties = {
    width: '100%',
    accentColor:
      theme === 'perseus' ? '#FFB000' : theme === 'greenTerminal' ? '#33FF00' : '#00CCFF',
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Cold War Loaders</h1>
        <p style={subtitleStyles}>11 AAA Cinematic Loading Components</p>
      </div>

      <div style={controlsStyles}>
        <div style={controlGroupStyles}>
          <label style={labelStyles}>Theme</label>
          <select
            style={selectStyles}
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
          >
            <option value="perseus">Perseus (Amber)</option>
            <option value="greenTerminal">Green Terminal</option>
            <option value="satelliteView">Satellite View (Blue)</option>
          </select>
        </div>

        <div style={controlGroupStyles}>
          <label style={labelStyles}>Size</label>
          <select
            style={selectStyles}
            value={size}
            onChange={(e) => setSize(e.target.value as any)}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>

        <div style={sliderContainerStyles}>
          <label style={labelStyles}>Progress: {progress}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={sliderStyles}
          />
        </div>
      </div>

      <div style={gridStyles}>
        {/* 1. Abstergo Loader */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>1. Abstergo Loader</h3>
          <ColdWarAbstergoLoader theme={theme} size={size} />
          <p style={descriptionStyles}>
            Spinning Abstergo logo with tactical styling and rotating animation
          </p>
        </div>

        {/* 2. Heart Rate Loader */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>2. Heart Rate Loader</h3>
          <ColdWarHeartRateLoader theme={theme} size={size} pulseSpeed="normal" />
          <p style={descriptionStyles}>
            Animated heartbeat/EKG line with medical tactical aesthetic
          </p>
        </div>

        {/* 3. Hacker Loader */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>3. Hacker Loader</h3>
          <ColdWarHackerLoader theme={theme} size={size} typingSpeed={50} />
          <p style={descriptionStyles}>
            Typing text animation with cursor - terminal-style loading
          </p>
        </div>

        {/* 4. Binary Loader */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>4. Binary Loader</h3>
          <ColdWarBinaryLoader theme={theme} size={size} speed="normal" density="medium" />
          <p style={descriptionStyles}>
            Falling binary digits (0s and 1s) - Matrix-style animation
          </p>
        </div>

        {/* 5. Cube Loader */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>5. 3D Cube Loader</h3>
          <ColdWarCubeLoader theme={theme} size={size} />
          <p style={descriptionStyles}>
            3D rotating cube with tactical edges and chamfered corners
          </p>
        </div>

        {/* 6. Progress Loader */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>6. Progress Loader</h3>
          <ColdWarProgressLoader theme={theme} size={size} progress={progress} animated />
          <p style={descriptionStyles}>Circular progress indicator with percentage display</p>
        </div>

        {/* 7. Binary Hacker Loader */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>7. Binary Hacker Loader</h3>
          <ColdWarBinaryHackerLoader theme={theme} size={size} />
          <p style={descriptionStyles}>
            Combination of binary rain and hacker text - dual-layer animation
          </p>
        </div>

        {/* 8. Matrix Loader */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>8. Matrix Loader</h3>
          <ColdWarMatrixLoader theme={theme} size={size} />
          <p style={descriptionStyles}>Full Matrix-style digital rain with multiple columns</p>
        </div>

        {/* 9. Scrolling Loader */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>9. Scrolling Loader</h3>
          <ColdWarScrollingLoader theme={theme} size={size} scrollSpeed="normal" />
          <p style={descriptionStyles}>Horizontal scrolling text with tactical message display</p>
        </div>

        {/* 10. Loading Text */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>10. Loading Text</h3>
          <ColdWarLoadingText theme={theme} size={size} animationStyle="dots" />
          <p style={descriptionStyles}>
            Animated "LOADING..." text with dot animation and pulse effects
          </p>
        </div>

        {/* 11. Wave Loader */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>11. Wave Loader</h3>
          <ColdWarWaveLoader theme={theme} size={size} waveFrequency="medium" />
          <p style={descriptionStyles}>Animated wave/sine pattern - audio waveform style</p>
        </div>

        {/* 12. Progress Bar (Bonus) */}
        <div style={sectionStyles}>
          <h3 style={loaderTitleStyles}>12. Progress Bar</h3>
          <ColdWarProgressBar
            value={progress}
            max={100}
            size={size}
            theme={theme}
            showLabel
            showPercentage
            animated
          />
          <p style={descriptionStyles}>Tactical progress bar with military aesthetic</p>
        </div>
      </div>

      <div style={{ marginTop: '60px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
        <p>
          All loaders support 3 themes, 3 sizes, scanlines, glow effects, and accessibility features
        </p>
        <p style={{ marginTop: '8px' }}>
          Themes: Perseus (Amber) • Green Terminal • Satellite View (Blue)
        </p>
      </div>
    </div>
  );
};

export default ColdWarLoadersDemo;
