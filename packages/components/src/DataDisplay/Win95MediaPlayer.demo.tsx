import React, { useState } from 'react';
import { Win95MediaPlayer } from './Win95MediaPlayer';

export const Win95MediaPlayerDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(21);
  const [volume, setVolume] = useState(75);

  return (
    <div style={{ padding: '2rem', background: '#c0c0c0', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '2rem', color: '#000080', fontFamily: 'Segoe UI, Tahoma' }}>
        Win95 Media Player - Theme Variations
      </h2>

      {/* Default Theme */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#000080' }}>Default Theme</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Win95MediaPlayer
            trackName="Track_01.wav"
            currentTime="00:42"
            totalDuration="03:17"
            progress={progress}
            volume={volume}
            isPlaying={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onStop={() => {
              setIsPlaying(false);
              setProgress(0);
            }}
            onProgressChange={setProgress}
            onVolumeChange={setVolume}
          />
        </div>
      </div>

      {/* Dark Theme */}
      <div style={{ marginBottom: '3rem', background: '#1a1a1a', padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#00ff00' }}>Dark Theme Variant</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Win95MediaPlayer
            trackName="synthwave_mix.wav"
            currentTime="01:15"
            totalDuration="04:32"
            progress={28}
            volume={85}
            isPlaying={true}
          />
        </div>
      </div>

      {/* Multiple Players */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#000080' }}>Multiple Players</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Win95MediaPlayer
              trackName="song_01.wav"
              currentTime="00:30"
              totalDuration="03:45"
              progress={13}
              volume={60}
              isPlaying={false}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Win95MediaPlayer
              trackName="song_02.wav"
              currentTime="02:10"
              totalDuration="05:20"
              progress={41}
              volume={90}
              isPlaying={true}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Win95MediaPlayer
              trackName="song_03.wav"
              currentTime="00:00"
              totalDuration="02:58"
              progress={0}
              volume={50}
              isPlaying={false}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Win95MediaPlayer
              trackName="song_04.wav"
              currentTime="03:55"
              totalDuration="03:55"
              progress={100}
              volume={75}
              isPlaying={false}
            />
          </div>
        </div>
      </div>

      {/* Different Progress States */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#000080' }}>Progress States</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Win95MediaPlayer
              trackName="track_start.wav"
              currentTime="00:00"
              totalDuration="04:00"
              progress={0}
              volume={75}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Win95MediaPlayer
              trackName="track_mid.wav"
              currentTime="02:00"
              totalDuration="04:00"
              progress={50}
              volume={75}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Win95MediaPlayer
              trackName="track_end.wav"
              currentTime="03:55"
              totalDuration="04:00"
              progress={98}
              volume={75}
            />
          </div>
        </div>
      </div>

      {/* Different Volume Levels */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#000080' }}>Volume Levels</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Win95MediaPlayer
              trackName="quiet.wav"
              currentTime="00:45"
              totalDuration="03:30"
              progress={21}
              volume={25}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Win95MediaPlayer
              trackName="medium.wav"
              currentTime="00:45"
              totalDuration="03:30"
              progress={21}
              volume={50}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Win95MediaPlayer
              trackName="loud.wav"
              currentTime="00:45"
              totalDuration="03:30"
              progress={21}
              volume={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Win95MediaPlayerDemo;
