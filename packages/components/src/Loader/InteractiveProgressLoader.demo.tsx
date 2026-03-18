import React from 'react';
import { InteractiveProgressLoader } from './InteractiveProgressLoader';

export const InteractiveProgressLoaderDemo: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem' }}>
      <div>
        <h3>Default Interactive Progress Loader</h3>
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          Hover over the grid areas to rotate the loader in 3D
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#f5f5f5',
            minHeight: '400px',
            borderRadius: '8px',
          }}
        >
          <InteractiveProgressLoader />
        </div>
      </div>

      <div>
        <h3>Custom Color - Cyan</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#0a0e27',
            minHeight: '400px',
            borderRadius: '8px',
          }}
        >
          <InteractiveProgressLoader primaryColor="#00D9FF" neutralColor="#fff" />
        </div>
      </div>

      <div>
        <h3>Custom Color - Purple</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#f5f5f5',
            minHeight: '400px',
            borderRadius: '8px',
          }}
        >
          <InteractiveProgressLoader primaryColor="#FF00FF" neutralColor="#fff" />
        </div>
      </div>

      <div>
        <h3>With Reload Handler</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#f5f5f5',
            minHeight: '400px',
            borderRadius: '8px',
          }}
        >
          <InteractiveProgressLoader
            primaryColor="seagreen"
            onReload={() => console.log('Reloading...')}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveProgressLoaderDemo;
