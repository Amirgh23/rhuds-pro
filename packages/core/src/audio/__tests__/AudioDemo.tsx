/**
 * Audio System Demo
 * Demonstrates audio playback, effects, and visualization
 */

import React, { useEffect, useRef, useState } from 'react';
import { BleepsProvider, useBleeps, useBleep } from '../BleepsProvider';
import { createAudioAnalyzer, AudioVisualizer } from '../visualization';

/**
 * Basic Audio Playback Demo
 */
export const BasicAudioDemo: React.FC = () => {
  const bleepManager = useBleeps();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Create a bleep
    bleepManager.createBleep('click', {
      sources: [{ src: '/sounds/click.mp3' }],
      volume: 0.8,
      category: 'ui',
    });

    return () => {
      bleepManager.removeBleep('click');
    };
  }, [bleepManager]);

  const handlePlay = async () => {
    await bleepManager.play('click');
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 500);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Basic Audio Playback</h2>
      <button onClick={handlePlay} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Play Click Sound'}
      </button>
    </div>
  );
};

/**
 * Volume Control Demo
 */
export const VolumeControlDemo: React.FC = () => {
  const bleepManager = useBleeps();
  const [masterVolume, setMasterVolume] = useState(1);
  const [uiVolume, setUiVolume] = useState(1);

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setMasterVolume(volume);
    bleepManager.setMasterVolume(volume);
  };

  const handleUiVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setUiVolume(volume);
    bleepManager.setCategoryVolume('ui', volume);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Volume Control</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Master Volume: {(masterVolume * 100).toFixed(0)}%
          <br />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={masterVolume}
            onChange={handleMasterVolumeChange}
            style={{ width: '200px' }}
          />
        </label>
      </div>

      <div>
        <label>
          UI Category Volume: {(uiVolume * 100).toFixed(0)}%
          <br />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={uiVolume}
            onChange={handleUiVolumeChange}
            style={{ width: '200px' }}
          />
        </label>
      </div>
    </div>
  );
};

/**
 * Audio Visualization Demo
 */
export const AudioVisualizationDemo: React.FC = () => {
  const bleepManager = useBleeps();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerRef = useRef<AudioVisualizer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const audioContext = bleepManager.getAudioContext();
    const analyzer = createAudioAnalyzer(audioContext, {
      fftSize: 256,
      smoothingTimeConstant: 0.8,
    });

    visualizerRef.current = new AudioVisualizer(canvasRef.current, analyzer);

    // Create a music bleep
    bleepManager.createBleep('music', {
      sources: [{ src: '/sounds/music.mp3' }],
      volume: 0.6,
      loop: { enabled: true },
      category: 'music',
    });

    return () => {
      visualizerRef.current?.stop();
      bleepManager.removeBleep('music');
    };
  }, [bleepManager]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      bleepManager.stop('music');
      visualizerRef.current?.stop();
      setIsPlaying(false);
    } else {
      await bleepManager.play('music');
      visualizerRef.current?.start();
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Audio Visualization</h2>
      <button onClick={handleTogglePlay}>
        {isPlaying ? 'Stop' : 'Play'} Music
      </button>
      <br />
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        style={{ border: '1px solid #ccc', marginTop: '10px' }}
      />
    </div>
  );
};

/**
 * Spatial Audio Demo
 */
export const SpatialAudioDemo: React.FC = () => {
  const bleepManager = useBleeps();
  const [position, setPosition] = useState({ x: 0, y: 0, z: -5 });

  useEffect(() => {
    bleepManager.createBleep('spatial', {
      sources: [{ src: '/sounds/ambient.mp3' }],
      volume: 0.8,
      loop: { enabled: true },
      spatial: {
        enabled: true,
        position: { x: 0, y: 0, z: -5 },
        refDistance: 1,
        maxDistance: 100,
        rolloffFactor: 1,
      },
    });

    return () => {
      bleepManager.removeBleep('spatial');
    };
  }, [bleepManager]);

  const updatePosition = (axis: 'x' | 'y' | 'z', value: number) => {
    const newPosition = { ...position, [axis]: value };
    setPosition(newPosition);

    const bleep = bleepManager.getBleep('spatial');
    if (bleep && bleep.config.spatial?.enabled) {
      // Update spatial position (would need to expose this in BleepImpl)
      console.log('Update position:', newPosition);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Spatial Audio (3D)</h2>
      <p>Move the sound source in 3D space</p>

      <div style={{ marginBottom: '10px' }}>
        <label>
          X: {position.x.toFixed(1)}
          <br />
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={position.x}
            onChange={(e) => updatePosition('x', parseFloat(e.target.value))}
            style={{ width: '200px' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>
          Y: {position.y.toFixed(1)}
          <br />
          <input
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={position.y}
            onChange={(e) => updatePosition('y', parseFloat(e.target.value))}
            style={{ width: '200px' }}
          />
        </label>
      </div>

      <div>
        <label>
          Z: {position.z.toFixed(1)}
          <br />
          <input
            type="range"
            min="-20"
            max="0"
            step="0.1"
            value={position.z}
            onChange={(e) => updatePosition('z', parseFloat(e.target.value))}
            style={{ width: '200px' }}
          />
        </label>
      </div>
    </div>
  );
};

/**
 * Complete Audio Demo App
 */
export const AudioSystemDemo: React.FC = () => {
  return (
    <BleepsProvider
      config={{
        masterVolume: 0.8,
        categories: {
          ui: { name: 'ui', volume: 1, muted: false },
          music: { name: 'music', volume: 0.6, muted: false },
          sfx: { name: 'sfx', volume: 0.8, muted: false },
        },
      }}
    >
      <div style={{ fontFamily: 'sans-serif' }}>
        <h1 style={{ padding: '20px' }}>Audio System Demo</h1>

        <BasicAudioDemo />
        <hr />

        <VolumeControlDemo />
        <hr />

        <AudioVisualizationDemo />
        <hr />

        <SpatialAudioDemo />
      </div>
    </BleepsProvider>
  );
};

export default AudioSystemDemo;
