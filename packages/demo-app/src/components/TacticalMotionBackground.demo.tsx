/**
 * Tactical Motion Background Demo
 * Showcases "The Situation Room" cinematic background
 */

import React from 'react';
import { TacticalMotionBackground } from './TacticalMotionBackground';
import { ColdWarButton } from '@rhuds/components';
import '../styles/cold-war-theme.css';

export const TacticalMotionBackgroundDemo: React.FC = () => {
  const [variant, setVariant] = React.useState<'satellite' | 'perimeter'>('perimeter');

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#050508',
    color: '#ffffff',
    fontFamily: "'Share Tech Mono', monospace",
    overflow: 'hidden',
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 10,
    padding: '60px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '60px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#ffb000',
    margin: '0 0 16px 0',
    textShadow: '0 0 20px rgba(255, 176, 0, 0.3)',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '18px',
    color: '#cccccc',
    letterSpacing: '0.02em',
    margin: '0',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginBottom: '60px',
    flexWrap: 'wrap',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '60px',
  };

  const cardStyle: React.CSSProperties = {
    padding: '24px',
    backgroundColor: 'rgba(26, 26, 30, 0.8)',
    border: '1px solid #ffb000',
    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
    backdropFilter: 'blur(10px)',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    color: '#ffb000',
    margin: '0 0 12px 0',
  };

  const cardContentStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#cccccc',
    lineHeight: '1.6',
    margin: '0',
  };

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  };

  const listItemStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#cccccc',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255, 176, 0, 0.1)',
  };

  return (
    <div style={containerStyle}>
      <TacticalMotionBackground variant={variant} />

      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Tactical Motion Background</h1>
          <p style={subtitleStyle}>"The Situation Room" - Cinematic Surveillance Aesthetic</p>
        </div>

        <div style={controlsStyle}>
          <ColdWarButton
            variant={variant === 'perimeter' ? 'primary' : 'secondary'}
            onClick={() => setVariant('perimeter')}
          >
            Perimeter (Amber)
          </ColdWarButton>
          <ColdWarButton
            variant={variant === 'satellite' ? 'primary' : 'secondary'}
            onClick={() => setVariant('satellite')}
          >
            Satellite (Blue)
          </ColdWarButton>
        </div>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Visual Concept</h3>
            <p style={cardContentStyle}>
              A living, breathing atmosphere that feels like a wall of monitors displaying
              surveillance data, satellite feeds, and tactical maps. Subtle enough not to distract,
              complex enough to build immersion.
            </p>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Layer Structure</h3>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <strong>Layer 1:</strong> Deep Space (Vignette)
              </li>
              <li style={listItemStyle}>
                <strong>Layer 2:</strong> Perspective Grid (Motion)
              </li>
              <li style={listItemStyle}>
                <strong>Layer 3:</strong> Floating Data Points
              </li>
              <li style={listItemStyle}>
                <strong>Layer 4:</strong> Radar Sweep
              </li>
              <li style={listItemStyle}>
                <strong>Layer 5:</strong> Atmospheric Particles
              </li>
              <li style={listItemStyle}>
                <strong>Layer 6:</strong> CRT Scanlines
              </li>
              <li style={listItemStyle}>
                <strong>Layer 7:</strong> Vignette & Flicker
              </li>
            </ul>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Performance Features</h3>
            <p style={cardContentStyle}>
              ✓ GPU-accelerated transforms (translate3d)
              <br />✓ will-change optimization
              <br />✓ Efficient CSS animations
              <br />✓ Minimal JavaScript overhead
              <br />✓ Responsive to all screen sizes
            </p>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Variants</h3>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <strong>Perimeter:</strong> Amber/Orange tactical aesthetic
              </li>
              <li style={listItemStyle}>
                <strong>Satellite:</strong> Blue/Green surveillance aesthetic
              </li>
            </ul>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Animation Details</h3>
            <p style={cardContentStyle}>
              • Grid pans diagonally (20s cycle)
              <br />• Data points pulse and fade (2-4s each)
              <br />• Radar sweeps continuously (8s cycle)
              <br />• Particles drift slowly (30s cycle)
              <br />• Scanlines flicker subtly (150ms cycle)
              <br />• Vignette breathes (4s cycle)
            </p>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Usage</h3>
            <p style={{ ...cardContentStyle, fontSize: '12px', color: '#33ff00' }}>
              &lt;TacticalMotionBackground variant="perimeter" /&gt;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TacticalMotionBackgroundDemo;
