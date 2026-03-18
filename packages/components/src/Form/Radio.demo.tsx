import React from 'react';
import Radio, { RadioOption } from './Radio';

const RadioDemo = () => {
  const [selectedValue, setSelectedValue] = React.useState('free');

  const planOptions: RadioOption[] = [
    { id: 'free', label: 'Free' },
    { id: 'basic', label: 'Basic' },
    { id: 'premium', label: 'Premium' },
  ];

  const tierOptions: RadioOption[] = [
    { id: 'starter', label: 'Starter' },
    { id: 'pro', label: 'Pro' },
    { id: 'enterprise', label: 'Enterprise' },
  ];

  return (
    <div style={{ padding: '2rem', background: '#0a0e27', minHeight: '100vh' }}>
      <h1 style={{ color: '#00ff88', marginBottom: '2rem', fontFamily: 'monospace' }}>
        Radio Component Demo
      </h1>

      {/* Primary Color - Cyan */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#00ffff', marginBottom: '1rem', fontSize: '1.2rem' }}>Cyan Theme</h2>
        <div
          style={{ background: 'rgba(0, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '8px' }}
        >
          <Radio
            options={planOptions}
            defaultValue="free"
            onChange={(value) => console.log('Selected:', value)}
            color="#00ffff"
            colorOpacity="#00ffff1c"
            name="cyan-radio"
          />
        </div>
      </div>

      {/* Secondary Color - Magenta */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#ff00ff', marginBottom: '1rem', fontSize: '1.2rem' }}>
          Magenta Theme
        </h2>
        <div
          style={{ background: 'rgba(255, 0, 255, 0.05)', padding: '1.5rem', borderRadius: '8px' }}
        >
          <Radio
            options={tierOptions}
            defaultValue="starter"
            onChange={(value) => console.log('Selected:', value)}
            color="#ff00ff"
            colorOpacity="#ff00ff1c"
            name="magenta-radio"
          />
        </div>
      </div>

      {/* Tertiary Color - Yellow */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#ffff00', marginBottom: '1rem', fontSize: '1.2rem' }}>Yellow Theme</h2>
        <div
          style={{ background: 'rgba(255, 255, 0, 0.05)', padding: '1.5rem', borderRadius: '8px' }}
        >
          <Radio
            options={planOptions}
            defaultValue="basic"
            onChange={(value) => console.log('Selected:', value)}
            color="#ffff00"
            colorOpacity="#ffff001c"
            name="yellow-radio"
          />
        </div>
      </div>

      {/* Green Theme */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#00ff88', marginBottom: '1rem', fontSize: '1.2rem' }}>Green Theme</h2>
        <div
          style={{ background: 'rgba(0, 255, 136, 0.05)', padding: '1.5rem', borderRadius: '8px' }}
        >
          <Radio
            options={tierOptions}
            defaultValue="pro"
            onChange={(value) => console.log('Selected:', value)}
            color="#00ff88"
            colorOpacity="#00ff881c"
            name="green-radio"
          />
        </div>
      </div>

      {/* Controlled Component Example */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#ff6b9d', marginBottom: '1rem', fontSize: '1.2rem' }}>
          Controlled Component
        </h2>
        <div
          style={{
            background: 'rgba(255, 107, 157, 0.05)',
            padding: '1.5rem',
            borderRadius: '8px',
          }}
        >
          <Radio
            options={planOptions}
            defaultValue={selectedValue}
            onChange={setSelectedValue}
            color="#ff6b9d"
            colorOpacity="#ff6b9d1c"
            name="controlled-radio"
          />
          <p style={{ color: '#ff6b9d', marginTop: '1rem', fontFamily: 'monospace' }}>
            Selected: <strong>{selectedValue}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RadioDemo;
