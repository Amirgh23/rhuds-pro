import React from 'react';
import { Cube3DLoader } from './Cube3DLoader';

export const Cube3DLoaderDemo: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
      <div>
        <h3>3D Cube Loader - Default</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#0a0e27',
          }}
        >
          <Cube3DLoader />
        </div>
      </div>

      <div>
        <h3>3D Cube Loader - With Custom Class</h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            background: '#0a0e27',
          }}
        >
          <Cube3DLoader className="custom-cube-loader" />
        </div>
      </div>

      <div>
        <h3>Multiple Loaders</h3>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            padding: '2rem',
            background: '#0a0e27',
          }}
        >
          <Cube3DLoader />
          <Cube3DLoader />
          <Cube3DLoader />
        </div>
      </div>
    </div>
  );
};

export default Cube3DLoaderDemo;
