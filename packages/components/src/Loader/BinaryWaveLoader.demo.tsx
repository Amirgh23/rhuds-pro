import React from 'react';
import { BinaryWaveLoader } from './BinaryWaveLoader';

export const BinaryWaveLoaderDemo = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem' }}>
      <div>
        <h3 style={{ color: '#29F2DF', marginBottom: '1rem' }}>Default (Black on Gray)</h3>
        <BinaryWaveLoader />
      </div>

      <div>
        <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Green Theme</h3>
        <BinaryWaveLoader primaryColor="rgb(0, 255, 136)" backgroundColor="rgb(200, 200, 200)" />
      </div>

      <div>
        <h3 style={{ color: '#a974ff', marginBottom: '1rem' }}>Purple Theme</h3>
        <BinaryWaveLoader primaryColor="rgb(169, 116, 255)" backgroundColor="rgb(220, 220, 220)" />
      </div>

      <div>
        <h3 style={{ color: '#FF006E', marginBottom: '1rem' }}>Pink Theme</h3>
        <BinaryWaveLoader primaryColor="rgb(255, 0, 110)" backgroundColor="rgb(240, 240, 240)" />
      </div>

      <div>
        <h3 style={{ color: '#00D9FF', marginBottom: '1rem' }}>Cyan Theme</h3>
        <BinaryWaveLoader primaryColor="rgb(0, 217, 255)" backgroundColor="rgb(210, 210, 210)" />
      </div>

      <div>
        <h3 style={{ color: '#FFD700', marginBottom: '1rem' }}>Gold Theme</h3>
        <BinaryWaveLoader primaryColor="rgb(255, 215, 0)" backgroundColor="rgb(230, 230, 230)" />
      </div>

      <div>
        <h3 style={{ color: '#29F2DF', marginBottom: '1rem' }}>Large Size</h3>
        <BinaryWaveLoader
          primaryColor="rgb(41, 242, 223)"
          backgroundColor="rgb(200, 200, 200)"
          width="200px"
          height="30px"
        />
      </div>

      <div>
        <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Small Size</h3>
        <BinaryWaveLoader
          primaryColor="rgb(0, 255, 136)"
          backgroundColor="rgb(200, 200, 200)"
          width="80px"
          height="15px"
        />
      </div>
    </div>
  );
};
