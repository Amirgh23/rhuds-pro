import React, { useState } from 'react';
import { RhudsBubbleChartStyled, ColdWarBubbleChartStyled } from '@rhuds/components';

export const BubbleChartShowcase: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<'rhuds' | 'coldwar'>('rhuds');

  // RHUDS Sample Data
  const rhudsSalesData = [
    { x: 20, y: 30, r: 15, label: 'Q1', color: '#29F2DF' },
    { x: 35, y: 50, r: 20, label: 'Q2', color: '#1C7FA6' },
    { x: 50, y: 65, r: 25, label: 'Q3', color: '#EF3EF1' },
    { x: 65, y: 75, r: 30, label: 'Q4', color: '#29F2DF' },
  ];

  const rhudsPerformanceData = [
    { x: 30, y: 40, r: 18, label: 'CPU', color: '#29F2DF' },
    { x: 50, y: 60, r: 22, label: 'RAM', color: '#1C7FA6' },
    { x: 70, y: 50, r: 28, label: 'GPU', color: '#EF3EF1' },
    { x: 80, y: 75, r: 32, label: 'NET', color: '#29F2DF' },
  ];

  // Cold War Sample Data
  const coldwarTacticalData = [
    { x: 25, y: 35, r: 18, label: 'A', color: '#FFB000' },
    { x: 45, y: 55, r: 22, label: 'B', color: '#33FF00' },
    { x: 65, y: 65, r: 28, label: 'C', color: '#FF3333' },
    { x: 80, y: 45, r: 32, label: 'D', color: '#00ccff' },
  ];

  const coldwarThreatData = [
    { x: 20, y: 30, r: 15, label: 'T1', color: '#FFB000' },
    { x: 40, y: 50, r: 20, label: 'T2', color: '#33FF00' },
    { x: 60, y: 70, r: 25, label: 'T3', color: '#FF3333' },
    { x: 75, y: 55, r: 30, label: 'T4', color: '#00ccff' },
  ];

  return (
    <div
      style={{
        padding: '2rem',
        background: activeTheme === 'coldwar' ? '#0a0a0c' : '#0a0a0a',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          color: activeTheme === 'coldwar' ? '#FFB000' : '#29F2DF',
          marginBottom: '2rem',
          fontFamily: activeTheme === 'coldwar' ? "'Share Tech Mono', monospace" : 'inherit',
        }}
      >
        Bubble Chart Showcase
      </h1>

      {/* Theme Selector */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setActiveTheme('rhuds')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTheme === 'rhuds' ? '#29F2DF' : '#333',
            color: activeTheme === 'rhuds' ? '#000' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          RHUDS Theme
        </button>
        <button
          onClick={() => setActiveTheme('coldwar')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTheme === 'coldwar' ? '#FFB000' : '#333',
            color: activeTheme === 'coldwar' ? '#000' : '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          COLD WAR Theme
        </button>
      </div>

      {/* RHUDS Theme Charts */}
      {activeTheme === 'rhuds' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h2 style={{ color: '#29F2DF', marginBottom: '1rem' }}>Sales Performance</h2>
            <RhudsBubbleChartStyled
              data={rhudsSalesData}
              width={500}
              height={400}
              xLabel="Market Share (%)"
              yLabel="Revenue Growth (%)"
            />
          </div>
          <div>
            <h2 style={{ color: '#29F2DF', marginBottom: '1rem' }}>System Performance</h2>
            <RhudsBubbleChartStyled
              data={rhudsPerformanceData}
              width={500}
              height={400}
              xLabel="Utilization (%)"
              yLabel="Performance Score"
            />
          </div>
        </div>
      )}

      {/* Cold War Theme Charts */}
      {activeTheme === 'coldwar' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h2
              style={{
                color: '#FFB000',
                marginBottom: '1rem',
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              TACTICAL ANALYSIS
            </h2>
            <ColdWarBubbleChartStyled
              data={coldwarTacticalData}
              width={500}
              height={400}
              xLabel="Threat Level"
              yLabel="Strategic Value"
            />
          </div>
          <div>
            <h2
              style={{
                color: '#FFB000',
                marginBottom: '1rem',
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              THREAT ASSESSMENT
            </h2>
            <ColdWarBubbleChartStyled
              data={coldwarThreatData}
              width={500}
              height={400}
              xLabel="Threat Severity"
              yLabel="Response Priority"
            />
          </div>
        </div>
      )}

      {/* Info Section */}
      <div
        style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: activeTheme === 'coldwar' ? '#1a1a1e' : '#1a1a1a',
          border: `1px solid ${activeTheme === 'coldwar' ? '#FFB000' : '#29F2DF'}`,
          borderRadius: activeTheme === 'coldwar' ? '0' : '4px',
          color: activeTheme === 'coldwar' ? '#FFB000' : '#29F2DF',
        }}
      >
        <h3>About Bubble Charts</h3>
        <p>
          Bubble charts display three-dimensional data using circles on a 2D plane. Each bubble
          represents:
        </p>
        <ul>
          <li>
            <strong>X-axis:</strong> Horizontal position
          </li>
          <li>
            <strong>Y-axis:</strong> Vertical position
          </li>
          <li>
            <strong>Radius:</strong> Size of the bubble (third dimension)
          </li>
        </ul>
        <p>
          {activeTheme === 'coldwar'
            ? 'The Cold War theme provides a tactical, military aesthetic with intense colors and glow effects.'
            : 'The RHUDS theme provides a modern, clean aesthetic with smooth transitions and subtle effects.'}
        </p>
      </div>
    </div>
  );
};
