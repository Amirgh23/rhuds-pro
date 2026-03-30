/**
 * Cold War Media Player Component
 * Tactical media player with military aesthetic
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarMediaPlayerProps {
  trackName?: string;
  currentTime?: string;
  totalDuration?: string;
  progress?: number;
  volume?: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onProgressChange?: (progress: number) => void;
  onVolumeChange?: (volume: number) => void;
  theme?: ThemeVariant;
  color?: 'amber' | 'green' | 'blue' | 'red';
  glow?: boolean;
  scanlines?: boolean;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

const COLOR_MAP = { amber: '#FFB000', green: '#33FF00', blue: '#00CCFF', red: '#FF3333' };

export const ColdWarMediaPlayer: React.FC<ColdWarMediaPlayerProps> = ({
  trackName = 'TACTICAL_AUDIO_01.WAV',
  currentTime = '00:42',
  totalDuration = '03:17',
  progress = 21,
  volume = 75,
  isPlaying = false,
  onPlay,
  onPause,
  onStop,
  onPrevious,
  onNext,
  theme = 'perseus',
  color = 'amber',
  glow = true,
  scanlines = false,
  className = '',
  style = {},
}) => {
  const [localProgress, setLocalProgress] = useState(progress);
  const themeColors = THEME_COLORS[theme];
  const playerColor = COLOR_MAP[color];
  const rgb = getRgbString(playerColor);
  const techCode = generateTechCode('MEDIA');

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '320px',
    padding: '16px',
    backgroundColor: themeColors.background,
    border: `2px solid ${playerColor}`,
    clipPath:
      'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
    overflow: 'hidden',
    ...style,
  };

  const displayStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    padding: '12px',
    marginBottom: '12px',
    backgroundColor: themeColors.surface,
    border: `1px solid ${playerColor}`,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: glow ? `inset 0 0 15px rgba(${rgb}, 0.2)` : 'none',
  };

  const trackStyle: CSSProperties = {
    fontSize: '12px',
    fontFamily: "'Share Tech Mono', monospace",
    color: playerColor,
    textTransform: 'uppercase',
  };

  const timeStyle: CSSProperties = {
    fontSize: '11px',
    fontFamily: "'Share Tech Mono', monospace",
    color: playerColor,
  };

  const progressBarStyle: CSSProperties = {
    position: 'relative',
    height: '8px',
    marginBottom: '16px',
    backgroundColor: themeColors.surface,
    border: `1px solid rgba(${rgb}, 0.3)`,
    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
    cursor: 'pointer',
  };

  const progressFillStyle: CSSProperties = {
    height: '100%',
    width: `${localProgress}%`,
    backgroundColor: playerColor,
    transition: 'width 100ms ease',
    boxShadow: glow ? `0 0 10px rgba(${rgb}, 0.6)` : 'none',
  };

  const controlsStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  };

  const buttonStyle: CSSProperties = {
    width: '36px',
    height: '36px',
    backgroundColor: themeColors.surface,
    border: `1px solid ${playerColor}`,
    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
    color: playerColor,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const statusStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    marginTop: '12px',
    padding: '8px',
    fontSize: '10px',
    fontFamily: "'Share Tech Mono', monospace",
    textTransform: 'uppercase',
    color: '#666',
    borderTop: `1px solid rgba(${rgb}, 0.2)`,
    display: 'flex',
    justifyContent: 'space-between',
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '8px',
    color: playerColor,
    opacity: 0.5,
    zIndex: 15,
  };

  return (
    <div className={className} style={containerStyle}>
      {scanlines && <ScanlinesOverlay intensity="medium" />}
      <span style={techCodeStyle}>{techCode}</span>

      <div style={displayStyle}>
        <span style={trackStyle}>{trackName}</span>
        <span style={timeStyle}>
          {currentTime} / {totalDuration}
        </span>
      </div>

      <div style={progressBarStyle}>
        <div style={progressFillStyle} />
      </div>

      <div style={controlsStyle}>
        <button style={buttonStyle} onClick={onPrevious} title="Previous">
          ⏮
        </button>
        <button
          style={buttonStyle}
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button style={buttonStyle} onClick={onStop} title="Stop">
          ⏹
        </button>
        <button style={buttonStyle} onClick={onNext} title="Next">
          ⏭
        </button>
      </div>

      <div style={statusStyle}>
        <span>{isPlaying ? 'PLAYING' : 'STOPPED'}</span>
        <span>VOL: {volume}%</span>
      </div>
    </div>
  );
};

export default ColdWarMediaPlayer;
