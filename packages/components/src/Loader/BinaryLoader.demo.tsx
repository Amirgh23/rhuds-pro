import React from 'react';
import { BinaryLoader } from '../index';

export function BinaryLoaderDemo() {
  return (
    <div
      style={{
        padding: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
        backgroundColor: '#0a0a0a',
      }}
    >
      <div>
        <h2 style={{ color: '#fff', marginBottom: '30px', textAlign: 'center' }}>Binary Loader</h2>
        <BinaryLoader />
      </div>
    </div>
  );
}
