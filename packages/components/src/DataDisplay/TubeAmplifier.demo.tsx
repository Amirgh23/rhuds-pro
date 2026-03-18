import React, { useState } from 'react';
import { TubeAmplifier } from './TubeAmplifier';

export const TubeAmplifierDemo: React.FC = () => {
  const [isPowered, setIsPowered] = useState(false);
  const [leftLevel, setLeftLevel] = useState(45);
  const [rightLevel, setRightLevel] = useState(55);
  const [volume, setVolume] = useState(50);
  const [tone, setTone] = useState(50);

  return (
    <div style={{ padding: '2rem', background: '#050505', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '2rem', color: '#fff', fontFamily: 'Jura, sans-serif' }}>
        Tube Amplifier - Vintage Audio Equipment
      </h2>

      {/* Main Amplifier */}
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
        <TubeAmplifier
          brandName="FIDELITY 900"
          isPowered={isPowered}
          leftChannelLevel={leftLevel}
          rightChannelLevel={rightLevel}
          volume={volume}
          tone={tone}
          onPowerToggle={setIsPowered}
          onVolumeChange={setVolume}
          onToneChange={setTone}
        />
      </div>

      {/* Controls */}
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '2rem',
          background: '#1a1a1a',
          borderRadius: '8px',
          color: '#fff',
          fontFamily: 'Jura, sans-serif',
        }}
      >
        <h3 style={{ marginBottom: '1.5rem', color: '#ff8800' }}>Interactive Controls</h3>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isPowered}
              onChange={(e) => setIsPowered(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <span>Power On</span>
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Left Channel Level: {leftLevel}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={leftLevel}
            onChange={(e) => setLeftLevel(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Right Channel Level: {rightLevel}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={rightLevel}
            onChange={(e) => setRightLevel(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Volume: {volume}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tone: {tone}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={tone}
            onChange={(e) => setTone(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Multiple Amplifiers */}
      <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '2rem', color: '#fff', textAlign: 'center' }}>
          Multiple Amplifiers
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TubeAmplifier
              brandName="VINTAGE PRO"
              isPowered={true}
              leftChannelLevel={65}
              rightChannelLevel={70}
              volume={75}
              tone={60}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TubeAmplifier
              brandName="CLASSIC 500"
              isPowered={false}
              leftChannelLevel={0}
              rightChannelLevel={0}
              volume={50}
              tone={50}
            />
          </div>
        </div>
      </div>

      {/* Different States */}
      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '2rem', color: '#fff', textAlign: 'center' }}>
          Different Operating States
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TubeAmplifier
              brandName="IDLE STATE"
              isPowered={false}
              leftChannelLevel={0}
              rightChannelLevel={0}
              volume={0}
              tone={50}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TubeAmplifier
              brandName="WARM UP"
              isPowered={true}
              leftChannelLevel={30}
              rightChannelLevel={35}
              volume={40}
              tone={50}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TubeAmplifier
              brandName="FULL POWER"
              isPowered={true}
              leftChannelLevel={95}
              rightChannelLevel={98}
              volume={100}
              tone={75}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TubeAmplifierDemo;
