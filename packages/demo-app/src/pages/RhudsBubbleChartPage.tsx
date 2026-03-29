import React, { useState } from 'react';
import { RhudsBubbleChartStyled } from '../../../components/src/Visualization';

export const RhudsBubbleChartPage: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<'sales' | 'performance' | 'engagement'>(
    'sales'
  );

  // Sales Performance Data
  const salesData = [
    { x: 20, y: 30, r: 15, label: 'Q1', color: '#29F2DF' },
    { x: 35, y: 50, r: 20, label: 'Q2', color: '#1C7FA6' },
    { x: 50, y: 65, r: 25, label: 'Q3', color: '#EF3EF1' },
    { x: 65, y: 75, r: 30, label: 'Q4', color: '#29F2DF' },
  ];

  // System Performance Data
  const performanceData = [
    { x: 30, y: 40, r: 18, label: 'CPU', color: '#29F2DF' },
    { x: 50, y: 60, r: 22, label: 'RAM', color: '#1C7FA6' },
    { x: 70, y: 50, r: 28, label: 'GPU', color: '#EF3EF1' },
    { x: 80, y: 75, r: 32, label: 'NET', color: '#29F2DF' },
  ];

  // User Engagement Data
  const engagementData = [
    { x: 25, y: 35, r: 18, label: 'Web', color: '#29F2DF' },
    { x: 45, y: 55, r: 22, label: 'Mobile', color: '#1C7FA6' },
    { x: 65, y: 65, r: 28, label: 'Desktop', color: '#EF3EF1' },
    { x: 80, y: 45, r: 32, label: 'API', color: '#29F2DF' },
  ];

  const chartConfigs = {
    sales: {
      data: salesData,
      title: 'Sales Performance Analysis',
      xLabel: 'Market Share (%)',
      yLabel: 'Revenue Growth (%)',
      description:
        'Quarterly sales performance metrics showing market penetration and revenue growth trends.',
    },
    performance: {
      data: performanceData,
      title: 'System Performance Metrics',
      xLabel: 'Utilization (%)',
      yLabel: 'Performance Score',
      description:
        'Real-time system resource utilization and performance scoring across different components.',
    },
    engagement: {
      data: engagementData,
      title: 'User Engagement Distribution',
      xLabel: 'User Count',
      yLabel: 'Engagement Rate',
      description: 'User engagement metrics across different platforms and channels.',
    },
  };

  const currentConfig = chartConfigs[selectedChart];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1
            style={{
              color: '#29F2DF',
              fontSize: '2.5rem',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(41, 242, 223, 0.3)',
            }}
          >
            RHUDS Bubble Chart
          </h1>
          <p
            style={{
              color: '#aaa',
              fontSize: '1rem',
              marginBottom: '2rem',
            }}
          >
            Modern data visualization with smooth aesthetics and interactive features
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
                background: selectedChart === key ? '#29F2DF' : '#1a1a1e',
                color: selectedChart === key ? '#000' : '#29F2DF',
                border: `2px solid ${selectedChart === key ? '#29F2DF' : '#29F2DF'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
              }}
            >
              {key === 'sales' && 'Sales'}
              {key === 'performance' && 'Performance'}
              {key === 'engagement' && 'Engagement'}
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
                color: '#29F2DF',
                marginBottom: '1rem',
                fontSize: '1.3rem',
              }}
            >
              {currentConfig.title}
            </h2>
            <RhudsBubbleChartStyled
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
              background: 'rgba(41, 242, 223, 0.05)',
              border: '1px solid rgba(41, 242, 223, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3
                style={{
                  color: '#29F2DF',
                  marginBottom: '1rem',
                  fontSize: '1.1rem',
                }}
              >
                Chart Information
              </h3>
              <p
                style={{
                  color: '#ccc',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                }}
              >
                {currentConfig.description}
              </p>

              <h4
                style={{
                  color: '#1C7FA6',
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem',
                }}
              >
                Data Points:
              </h4>
              <ul
                style={{
                  color: '#aaa',
                  marginLeft: '1.5rem',
                  lineHeight: '1.8',
                }}
              >
                {currentConfig.data.map((point, idx) => (
                  <li key={idx}>
                    <span style={{ color: '#29F2DF' }}>{point.label}</span>: X={point.x}, Y=
                    {point.y}, Size={point.r}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: 'rgba(41, 242, 223, 0.1)',
                borderRadius: '4px',
                marginTop: '1rem',
              }}
            >
              <p
                style={{
                  color: '#29F2DF',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                }}
              >
                💡 TIP
              </p>
              <p
                style={{
                  color: '#aaa',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                }}
              >
                Hover over different data points to see their values. The bubble size represents the
                third dimension of your data.
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
              title: 'Modern Design',
              description:
                'Clean, contemporary aesthetic with smooth transitions and subtle effects.',
              icon: '✨',
            },
            {
              title: 'Responsive',
              description:
                'Automatically adapts to different screen sizes and container dimensions.',
              icon: '📱',
            },
            {
              title: 'Customizable',
              description: 'Full control over colors, labels, grid, and all visual aspects.',
              icon: '🎨',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.5rem',
                background: 'rgba(41, 242, 223, 0.05)',
                border: '1px solid rgba(41, 242, 223, 0.2)',
                borderRadius: '8px',
                textAlign: 'center',
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
                  color: '#29F2DF',
                  marginBottom: '0.5rem',
                }}
              >
                {feature.title}
              </h4>
              <p
                style={{
                  color: '#aaa',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
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
            background: 'rgba(41, 242, 223, 0.05)',
            border: '1px solid rgba(41, 242, 223, 0.2)',
            borderRadius: '8px',
          }}
        >
          <h3
            style={{
              color: '#29F2DF',
              marginBottom: '1rem',
            }}
          >
            Color Palette
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              { name: 'Primary', color: '#29F2DF' },
              { name: 'Secondary', color: '#1C7FA6' },
              { name: 'Accent', color: '#EF3EF1' },
              { name: 'Background', color: '#0a0a0a' },
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
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
                <div>
                  <p
                    style={{
                      color: '#29F2DF',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      color: '#aaa',
                      fontSize: '0.8rem',
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
