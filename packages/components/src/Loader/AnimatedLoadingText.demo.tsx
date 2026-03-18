import React from 'react';
import { AnimatedLoadingText } from './AnimatedLoadingText';

export const AnimatedLoadingTextDemo = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem' }}>
      <div>
        <h3 style={{ color: '#29F2DF', marginBottom: '1rem' }}>Default (White)</h3>
        <AnimatedLoadingText text="LOADING" />
      </div>

      <div>
        <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Green Theme</h3>
        <AnimatedLoadingText
          text="LOADING"
          primaryColor="rgb(0, 255, 136)"
          backgroundColor="rgb(15, 15, 25)"
        />
      </div>

      <div>
        <h3 style={{ color: '#a974ff', marginBottom: '1rem' }}>Purple Theme</h3>
        <AnimatedLoadingText
          text="LOADING"
          primaryColor="rgb(169, 116, 255)"
          backgroundColor="rgb(36, 34, 39)"
        />
      </div>

      <div>
        <h3 style={{ color: '#FF006E', marginBottom: '1rem' }}>Pink Theme</h3>
        <AnimatedLoadingText
          text="LOADING"
          primaryColor="rgb(255, 0, 110)"
          backgroundColor="rgb(20, 10, 20)"
        />
      </div>

      <div>
        <h3 style={{ color: '#00D9FF', marginBottom: '1rem' }}>Cyan Theme</h3>
        <AnimatedLoadingText
          text="LOADING"
          primaryColor="rgb(0, 217, 255)"
          backgroundColor="rgb(10, 20, 30)"
        />
      </div>

      <div>
        <h3 style={{ color: '#FFD700', marginBottom: '1rem' }}>Gold Theme</h3>
        <AnimatedLoadingText
          text="LOADING"
          primaryColor="rgb(255, 215, 0)"
          backgroundColor="rgb(30, 25, 10)"
        />
      </div>

      <div>
        <h3 style={{ color: '#29F2DF', marginBottom: '1rem' }}>Custom Text - "PLEASE WAIT"</h3>
        <AnimatedLoadingText
          text="PLEASE WAIT"
          primaryColor="rgb(41, 242, 223)"
          backgroundColor="rgb(15, 20, 30)"
        />
      </div>

      <div>
        <h3 style={{ color: '#00ff88', marginBottom: '1rem' }}>Custom Text - "INITIALIZING"</h3>
        <AnimatedLoadingText
          text="INITIALIZING"
          primaryColor="rgb(0, 255, 136)"
          backgroundColor="rgb(15, 15, 25)"
        />
      </div>
    </div>
  );
};
