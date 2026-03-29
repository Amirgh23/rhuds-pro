import React, { useState } from 'react';
import { ColdWarBubbleChartStyled } from '../../../components/src/Visualization';

export const ColdWarBubbleChartPage: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<'tactical' | 'threat' | 'operations'>(
    'tactical'
  );

  // Tactical Analysis Data
  const tacticalData = [
    { x: 25, y: 35, r: 18, label: 'A', color: '#FFB000' },
    { x: 45, y: 55, r: 22, label: 'B', color: '#33FF00' },
    { x: 65, y: 65, r: 28, label: 'C', color: '#FF3333' },
    { x: 80, y: 45, r: 32, label: 'D', color: '#00ccff' },
  ];

  // Threat Assessment Data
  const threatData = [
    { x: 20, y: 30, r: 15, label: 'T1', color: '#FFB000' },
    { x: 40, y: 50, r: 20, label: 'T2', color: '#33FF00' },
    { x: 60, y: 70, r: 25, label: 'T3', color: '#FF3333' },
    { x: 75, y: 55, r: 30, label: 'T4', color: '#00ccff' },
  ];

  // Operations Data
  const operationsData = [
    { x: 15, y: 25, r: 20, label: 'OP1', color: '#FFB000' },
    { x: 35, y: 45, r: 25, label: 'OP2', color: '#33FF00' },
    { x: 55, y: 60, r: 30, label: 'OP3', color: '#FF3333' },
    { x: 75, y: 50, r: 28, label: 'OP4', color: '#00ccff' },
  ];

  const chartConfigs = {
    tactical: {
      data: tacticalData,
      title: 'TACTICAL ANALYSIS',
      xLabel: 'Threat Level',
      yLabel: 'Strategic Value',
      description:
        'Real-time tactical analysis showing threat levels and strategic importance of different operational zones.',
    },
    threat: {
      data: threatData,
      title: 'THREAT ASSESSMENT',
      xLabel: 'Threat Severity',
      yLabel: 'Response Priority',
      description:
        'Comprehensive threat assessment matrix with severity ratings and priority response levels.',
    },
    operations: {
      data: operationsData,
      title: 'OPERATIONS DEPLOYMENT',
      xLabel: 'Operation Scope',
      yLabel: 'Resource Allocation',
      description:
        'Military operations deployment status showing scope and resource allocation across different zones.',
    },
  };

  const currentConfig = chartConfigs[selectedChart];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0c',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1
            style={{
              color: '#FFB000',
              fontSize: '2.5rem',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              fontFamily: "'Share Tech Mono', monospace",
              textShadow: '0 0 30px rgba(255, 176, 0, 0.3)',
            }}
          >
            COLD WAR BUBBLE CHART
          </h1>
          <p
            style={{
              color: '#FFB000',
              fontSize: '1rem',
              marginBottom: '2rem',
              fontFamily: "'Share Tech Mono', monospace",
              opacity: 0.7,
            }}
          >
            TACTICAL DATA VISUALIZATION SYSTEM
          </p>
        </div>

        {/* Chart Selector */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}
        >
          {(Object.keys(chartConfigs) as Array<keyof typeof chartConfigs>).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedChart(key)}
              style={{
                padding: '0.75rem 1.5rem',
                background: selectedChart === key ? '#FFB000' : '#1a1a1e',
                color: selectedChart === key ? '#000' : '#FFB000',
                border: `2px solid #FFB000`,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                fontFamily: "'Share Tech Mono', monospace",
                boxShadow: selectedChart === key ? '0 0 20px rgba(255, 176, 0, 0.5)' : 'none',
              }}
            >
              {key === 'tactical' && 'TACTICAL'}
              {key === 'threat' && 'THREAT'}
              {key === 'operations' && 'OPERATIONS'}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {/* Chart */}
          <div>
            <h2
              style={{
                color: '#FFB000',
                marginBottom: '1rem',
                fontSize: '1.3rem',
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              {currentConfig.title}
            </h2>
            <ColdWarBubbleChartStyled
              data={currentConfig.data}
              width={550}
              height={450}
              xLabel={currentConfig.xLabel}
              yLabel={currentConfig.yLabel}
            />
          </div>

          {/* Info Panel */}
          <div
            style={{
              padding: '1.5rem',
              background: '#1a1a1e',
              border: '2px solid #FFB000',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 0 20px rgba(255, 176, 0, 0.2)',
            }}
          >
            <div>
              <h3
                style={{
                  color: '#FFB000',
                  marginBottom: '1rem',
                  fontSize: '1.1rem',
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                SYSTEM INFORMATION
              </h3>
              <p
                style={{
                  color: '#FFB000',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                  fontFamily: "'Share Tech Mono', monospace",
                  opacity: 0.8,
                }}
              >
                {currentConfig.description}
              </p>

              <h4
                style={{
                  color: '#33FF00',
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem',
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                DATA POINTS:
              </h4>
              <ul
                style={{
                  color: '#FFB000',
                  marginLeft: '1.5rem',
                  lineHeight: '1.8',
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                {currentConfig.data.map((point, idx) => (
                  <li key={idx}>
                    <span style={{ color: '#33FF00' }}>{point.label}</span>: X={point.x}, Y=
                    {point.y}, SIZE={point.r}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#0a0a0c',
                border: '1px solid #FFB000',
                marginTop: '1rem',
              }}
            >
              <p
                style={{
                  color: '#FF3333',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                ⚠ ALERT
              </p>
              <p
                style={{
                  color: '#FFB000',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                Bubble size represents resource allocation. Larger bubbles indicate higher priority
                operations.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            marginTop: '3rem',
          }}
        >
          {[
            {
              title: 'TACTICAL DESIGN',
              description: 'Military-grade aesthetic with sharp angles and intense color palette.',
              icon: '🎯',
            },
            {
              title: 'REAL-TIME DATA',
              description: 'Live data visualization with instant updates and responsive rendering.',
              icon: '📡',
            },
            {
              title: 'STRATEGIC ANALYSIS',
              description: 'Advanced threat assessment and operational planning capabilities.',
              icon: '🛡️',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.5rem',
                background: '#1a1a1e',
                border: '2px solid #FFB000',
                textAlign: 'center',
                boxShadow: '0 0 15px rgba(255, 176, 0, 0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '0.5rem',
                }}
              >
                {feature.icon}
              </div>
              <h4
                style={{
                  color: '#FFB000',
                  marginBottom: '0.5rem',
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                {feature.title}
              </h4>
              <p
                style={{
                  color: '#FFB000',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  fontFamily: "'Share Tech Mono', monospace",
                  opacity: 0.7,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Color Palette */}
        <div
          style={{
            marginTop: '3rem',
            padding: '1.5rem',
            background: '#1a1a1e',
            border: '2px solid #FFB000',
            boxShadow: '0 0 20px rgba(255, 176, 0, 0.2)',
          }}
        >
          <h3
            style={{
              color: '#FFB000',
              marginBottom: '1rem',
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            TACTICAL COLOR PALETTE
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              { name: 'TACTICAL AMBER', color: '#FFB000' },
              { name: 'PHOSPHOR GREEN', color: '#33FF00' },
              { name: 'MUTED RED', color: '#FF3333' },
              { name: 'SATELLITE BLUE', color: '#00ccff' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: item.color,
                    border: `2px solid ${item.color}`,
                    boxShadow: `0 0 15px ${item.color}`,
                  }}
                />
                <div>
                  <p
                    style={{
                      color: '#FFB000',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      fontFamily: "'Share Tech Mono', monospace",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      color: '#FFB000',
                      fontSize: '0.8rem',
                      fontFamily: "'Share Tech Mono', monospace",
                      opacity: 0.6,
                    }}
                  >
                    {item.color}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
