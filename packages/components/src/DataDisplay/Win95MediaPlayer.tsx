import React, { useState } from 'react';
import styled from 'styled-components';

export interface Win95MediaPlayerProps {
  /** Track name (default: "Track_01.wav") */
  trackName?: string;
  /** Current time (default: "00:42") */
  currentTime?: string;
  /** Total duration (default: "03:17") */
  totalDuration?: string;
  /** Progress percentage (default: 21) */
  progress?: number;
  /** Volume percentage (default: 75) */
  volume?: number;
  /** Is playing state */
  isPlaying?: boolean;
  /** On play click handler */
  onPlay?: () => void;
  /** On pause click handler */
  onPause?: () => void;
  /** On stop click handler */
  onStop?: () => void;
  /** On previous click handler */
  onPrevious?: () => void;
  /** On next click handler */
  onNext?: () => void;
  /** On progress change handler */
  onProgressChange?: (progress: number) => void;
  /** On volume change handler */
  onVolumeChange?: (volume: number) => void;
  /** Custom className */
  className?: string;
}

export const Win95MediaPlayer: React.FC<Win95MediaPlayerProps> = ({
  trackName = 'Track_01.wav',
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
  onProgressChange,
  onVolumeChange,
  className,
}) => {
  const [localProgress, setLocalProgress] = useState(progress);
  const [localVolume, setLocalVolume] = useState(volume);

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newProgress = ((e.clientX - rect.left) / rect.width) * 100;
    setLocalProgress(newProgress);
    onProgressChange?.(newProgress);
  };

  const handlePlayClick = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  return (
    <StyledWrapper className={className}>
      <div className="win95-card">
        {/* Title Bar */}
        <div className="card-titlebar">
          <span className="card-title-text">Media Player</span>
          <div className="card-controls">
            <button className="card-btn card-btn-min" aria-label="Minimize" />
            <button className="card-btn card-btn-max" aria-label="Maximize" />
            <button className="card-btn card-btn-close" aria-label="Close" />
          </div>
        </div>

        {/* Menu Bar */}
        <div className="card-menubar">
          <span className="menu-item">File</span>
          <span className="menu-item">Play</span>
          <span className="menu-item">Options</span>
        </div>

        {/* Body */}
        <div className="card-body">
          {/* Display */}
          <div className="player-display">
            <span className="track-name">{trackName}</span>
            <span className="track-time">
              {currentTime} / {totalDuration}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="player-progress" onClick={handleProgressChange}>
            <div className="progress-fill" style={{ width: `${localProgress}%` }} />
            <div className="progress-thumb" style={{ left: `${localProgress}%` }} />
          </div>

          {/* Controls */}
          <div className="player-controls">
            <button
              className="ctrl-btn ctrl-prev"
              onClick={onPrevious}
              aria-label="Previous track"
              title="Previous"
            />
            <button
              className="ctrl-btn ctrl-play"
              onClick={handlePlayClick}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause' : 'Play'}
            />
            <button
              className="ctrl-btn ctrl-stop"
              onClick={onStop}
              aria-label="Stop"
              title="Stop"
            />
            <button
              className="ctrl-btn ctrl-next"
              onClick={onNext}
              aria-label="Next track"
              title="Next"
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="card-statusbar">
          <span className="status-text">{isPlaying ? 'Playing' : 'Stopped'}</span>
          <span className="status-vol">Vol: {localVolume}%</span>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .win95-card {
    --card-bg: #c0c0c0;
    --card-border-light: #ffffff;
    --card-border-dark: #808080;
    --card-border-darker: #404040;
    --card-titlebar: linear-gradient(90deg, #000080, #1084d0);
    --card-title-text: #ffffff;
    --card-text: #000000;
    --card-display-bg: #000000;
    --card-display-text: #00ff00;

    font-family: 'Segoe UI', Tahoma, sans-serif;
    font-size: 1em;
    width: 18em;
    background: var(--card-bg);
    border: 0.0625em solid;
    border-color: var(--card-border-light) var(--card-border-darker) var(--card-border-darker)
      var(--card-border-light);
    box-shadow:
      inset 0.0625em 0.0625em 0 var(--card-border-light),
      inset -0.0625em -0.0625em 0 var(--card-border-dark);
  }

  .card-titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25em 0.25em 0.25em 0.5em;
    background: var(--card-titlebar);
    color: var(--card-title-text);
  }

  .card-title-text {
    font-size: 0.8125em;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  .card-controls {
    display: flex;
    gap: 0.125em;
  }

  .card-btn {
    width: 1em;
    height: 0.875em;
    background: var(--card-bg);
    border: 0.0625em solid;
    border-color: var(--card-border-light) var(--card-border-darker) var(--card-border-darker)
      var(--card-border-light);
    cursor: pointer;
    position: relative;
    padding: 0;
    outline: none;
    transition: all 0.1s ease;

    &:hover {
      background: #dfdfdf;
    }

    &:active {
      border-color: var(--card-border-darker) var(--card-border-light) var(--card-border-light)
        var(--card-border-darker);
    }

    &:focus {
      outline: 0.0625em dotted var(--card-text);
      outline-offset: -0.1875em;
    }
  }

  .card-btn-min::after {
    content: '';
    position: absolute;
    bottom: 0.125em;
    left: 50%;
    transform: translateX(-50%);
    width: 0.375em;
    height: 0.125em;
    background: var(--card-text);
  }

  .card-btn-max::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.4375em;
    height: 0.375em;
    border: 0.0625em solid var(--card-text);
    border-top-width: 0.125em;
    background: transparent;
  }

  .card-btn-close::before,
  .card-btn-close::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.5em;
    height: 0.0625em;
    background: var(--card-text);
  }

  .card-btn-close::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .card-btn-close::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  .card-menubar {
    display: flex;
    gap: 0.125em;
    padding: 0.25em 0.375em;
    border-bottom: 0.0625em solid var(--card-border-dark);
  }

  .menu-item {
    font-size: 0.75em;
    padding: 0.125em 0.5em;
    color: var(--card-text);
    cursor: pointer;
    user-select: none;
    transition: all 0.1s ease;

    &:hover {
      background: #000080;
      color: #ffffff;
    }
  }

  .card-body {
    padding: 0.75em;
  }

  .player-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em;
    margin-bottom: 0.5em;
    background: var(--card-display-bg);
    border: 0.0625em solid;
    border-color: var(--card-border-dark) var(--card-border-light) var(--card-border-light)
      var(--card-border-dark);
    box-shadow: inset 0.0625em 0.0625em 0 var(--card-border-darker);
  }

  .track-name {
    font-size: 0.6875em;
    font-family: monospace;
    color: var(--card-display-text);
    animation: blink-text 1s step-end infinite;
  }

  @keyframes blink-text {
    50% {
      opacity: 0.7;
    }
  }

  .track-time {
    font-size: 0.625em;
    font-family: monospace;
    color: var(--card-display-text);
  }

  .player-progress {
    position: relative;
    height: 0.75em;
    margin-bottom: 0.625em;
    background: var(--card-bg);
    border: 0.0625em solid;
    border-color: var(--card-border-dark) var(--card-border-light) var(--card-border-light)
      var(--card-border-dark);
    box-shadow: inset 0.0625em 0.0625em 0 var(--card-border-darker);
    cursor: pointer;
  }

  .progress-fill {
    height: 100%;
    background: #000080;
    transition: width 0.1s ease;
  }

  .progress-thumb {
    position: absolute;
    top: -0.0625em;
    width: 0.5em;
    height: 0.875em;
    background: var(--card-bg);
    border: 0.0625em solid;
    border-color: var(--card-border-light) var(--card-border-darker) var(--card-border-darker)
      var(--card-border-light);
    transform: translateX(-50%);
    transition: left 0.1s ease;
  }

  .player-controls {
    display: flex;
    justify-content: center;
    gap: 0.25em;
  }

  .ctrl-btn {
    width: 2em;
    height: 1.5em;
    background: var(--card-bg);
    border: 0.125em solid;
    border-color: var(--card-border-light) var(--card-border-darker) var(--card-border-darker)
      var(--card-border-light);
    cursor: pointer;
    position: relative;
    outline: none;
    transition: all 0.1s ease;

    &:hover {
      background: #dfdfdf;
    }

    &:active {
      border-color: var(--card-border-darker) var(--card-border-light) var(--card-border-light)
        var(--card-border-darker);
    }

    &:focus {
      outline: 0.0625em dotted var(--card-text);
      outline-offset: -0.25em;
    }
  }

  .ctrl-prev::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 40%;
    border: 0.25em solid transparent;
    border-right: 0.3125em solid var(--card-text);
    transform: translate(-50%, -50%);
  }

  .ctrl-prev::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 30%;
    width: 0.125em;
    height: 0.5em;
    background: var(--card-text);
    transform: translate(-50%, -50%);
  }

  .ctrl-play::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 55%;
    border: 0.3125em solid transparent;
    border-left: 0.375em solid var(--card-text);
    transform: translate(-50%, -50%);
  }

  .ctrl-stop::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.5em;
    height: 0.5em;
    background: var(--card-text);
    transform: translate(-50%, -50%);
  }

  .ctrl-next::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 60%;
    border: 0.25em solid transparent;
    border-left: 0.3125em solid var(--card-text);
    transform: translate(-50%, -50%);
  }

  .ctrl-next::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 70%;
    width: 0.125em;
    height: 0.5em;
    background: var(--card-text);
    transform: translate(-50%, -50%);
  }

  .card-statusbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25em 0.375em;
    background: var(--card-bg);
    border-top: 0.0625em solid var(--card-border-light);
    box-shadow: inset 0 0.0625em 0 var(--card-border-dark);
  }

  .status-text {
    font-size: 0.6875em;
    color: var(--card-text);
    padding: 0.125em 0.25em;
    border: 0.0625em solid;
    border-color: var(--card-border-dark) var(--card-border-light) var(--card-border-light)
      var(--card-border-dark);
    flex: 1;
  }

  .status-vol {
    font-size: 0.625em;
    padding: 0.125em 0.375em;
    margin-left: 0.25em;
    background: var(--card-bg);
    border: 0.0625em solid;
    border-color: var(--card-border-dark) var(--card-border-light) var(--card-border-light)
      var(--card-border-dark);
    color: var(--card-text);
  }
`;

export default Win95MediaPlayer;
