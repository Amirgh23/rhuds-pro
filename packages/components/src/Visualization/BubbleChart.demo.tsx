import React, { useState } from 'react';
import { BubbleChart, BubbleDataPoint } from './BubbleChart';

export const BubbleChartDemo: React.FC = () => {
  const [variant, setVariant] = useState<'rhuds' | 'coldwar'>('rhuds');

  // Sample data for bubble chart
  const sampleData: BubbleDataPoint[] = [
    { x: 10, y: 20, r: 15, label: 'A', color: '#29F2DF' },
    { x: 25, y: 35, r: 20, label: 'B', color: '#1C7FA6' },
    { x: 40, y: 15, r: 18, label: 'C', color: '#EF3EF1' },
    { x: 55, y: 45, r: 25, label: 'D', color: '#FF6384' },
    { x: 70, y: 30, r: 22, label: 'E', color: '#36A2EB' },
    { x: 85, y: 50, r: 28, label: 'F', color: '#FFCE56' },
  ];

  const coldwarData: BubbleDataPoint[] = [
    { x: 10, y: 20, r: 15, label: 'A', color: '#FFB000' },
    { x: 25, y: 35, r: 20, label: 'B', color: '#33FF00' },
    { x: 40, y: 15, r: 18, label: 'C', color: '#FF3333' },
    { x: 55, y: 45, r: 25, label: 'D', color: '#00ccff' },
    { x: 70, y: 30, r: 22, label: 'E', color: '#FFB000' },
    { x: 85, y: 50, r: 28, label: 'F', color: '#33FF00' },
  ];

  const data = variant === 'coldwar' ? coldwarData : sampleData;

  return (
    <div style={{ padding: '2rem', background: variant === 'coldwar' ? '#0a0a0c' : '#1a1a1a' }}>
      <h2 style={{ color: variant === 'coldwar' ? '#FFB000' : '#29F2DF', marginBottom: '1rem' }}>
        Bubble Chart - {variant.toUpperCase()}
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setVariant('rhuds')}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            background: variant === 'rhuds' ? '#29F2DF' : '#333',
            color: variant === 'rhuds' ? '#000' : '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          RHUDS Theme
        </button>
        <button
          onClick={() => setVariant('coldwar')}
          style={{
            padding: '0.5rem 1rem',
            background: variant === 'coldwar' ? '#FFB000' : '#333',
            color: variant === 'coldwar' ? '#000' : '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          COLDWAR Theme
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <BubbleChart
          data={data}
          width={700}
          height={500}
          showGrid={true}
          showLegend={true}
          xLabel="Performance"
          yLabel="Efficiency"
          variant={variant}
        />
      </div>

      <div style={{ marginTop: '2rem', color: variant === 'coldwar' ? '#FFB000' : '#29F2DF' }}>
        <h3>Data Points:</h3>
        <ul>
          {data.map((point, idx) => (
            <li key={idx}>
              {point.label}: X={point.x}, Y={point.y}, Size={point.r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
