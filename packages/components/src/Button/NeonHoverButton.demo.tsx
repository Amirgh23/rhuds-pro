import React from 'react';
import { NeonHoverButton } from './NeonHoverButton';

export const NeonHoverButtonDemo: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem' }}>
      <div>
        <h3>Default Neon Hover Button</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#0a0e27',
          }}
        >
          <NeonHoverButton text="uiverse" />
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
          }}
        >
          <NeonHoverButton text="Hover Me" animationColor="#00D9FF" />
        </div>
      </div>

      <div>
        <h3>Custom Color - Purple</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#0a0e27',
          }}
        >
          <NeonHoverButton text="Click Me" animationColor="#FF00FF" />
        </div>
      </div>

      <div>
        <h3>Large Font Size</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#0a0e27',
          }}
        >
          <NeonHoverButton text="Big Button" fontSize="3em" />
        </div>
      </div>

      <div>
        <h3>Multiple Buttons</h3>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            padding: '2rem',
            background: '#0a0e27',
          }}
        >
          <NeonHoverButton text="Button 1" animationColor="#37FF8B" />
          <NeonHoverButton text="Button 2" animationColor="#00D9FF" />
          <NeonHoverButton text="Button 3" animationColor="#FF00FF" />
        </div>
      </div>

      <div>
        <h3>With Click Handler</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#0a0e27',
          }}
        >
          <NeonHoverButton text="Click Me" onClick={() => alert('Button clicked!')} />
        </div>
      </div>
    </div>
  );
};

export default NeonHoverButtonDemo;
