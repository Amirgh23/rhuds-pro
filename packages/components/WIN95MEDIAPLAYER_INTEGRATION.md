# Win95MediaPlayer Integration Guide

## Overview

The `Win95MediaPlayer` component is a nostalgic Windows 95-style media player UI. It's perfect for retro-themed applications, throwback interfaces, or as a fun UI element in modern applications.

## Installation

The component is already included in the `@rhuds/components` package.

```tsx
import { Win95MediaPlayer } from '@rhuds/components';
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { Win95MediaPlayer } from '@rhuds/components';

export function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(21);

  return (
    <Win95MediaPlayer
      trackName="song.wav"
      currentTime="00:42"
      totalDuration="03:17"
      progress={progress}
      volume={75}
      isPlaying={isPlaying}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onProgressChange={setProgress}
    />
  );
}
```

## Component Structure

```
Win95MediaPlayer
├── Title Bar
│   ├── Title Text
│   └── Control Buttons (Min, Max, Close)
├── Menu Bar
│   ├── File
│   ├── Play
│   └── Options
├── Body
│   ├── Display
│   │   ├── Track Name
│   │   └── Time Display
│   ├── Progress Bar
│   │   ├── Progress Fill
│   │   └── Progress Thumb
│   └── Controls
│       ├── Previous Button
│       ├── Play/Pause Button
│       ├── Stop Button
│       └── Next Button
└── Status Bar
    ├── Status Text
    └── Volume Display
```

## Props Reference

### Display Props

- `trackName` (string): Current track name
- `currentTime` (string): Current playback time in MM:SS format
- `totalDuration` (string): Total track duration in MM:SS format

### State Props

- `progress` (number): Progress percentage (0-100)
- `volume` (number): Volume level (0-100)
- `isPlaying` (boolean): Whether player is currently playing

### Event Handlers

- `onPlay()`: Called when play button is clicked
- `onPause()`: Called when pause button is clicked
- `onStop()`: Called when stop button is clicked
- `onPrevious()`: Called when previous button is clicked
- `onNext()`: Called when next button is clicked
- `onProgressChange(progress: number)`: Called when progress changes
- `onVolumeChange(volume: number)`: Called when volume changes

### Other Props

- `className` (string): Custom CSS class name

## Usage Examples

### Example 1: Basic Player

```tsx
<Win95MediaPlayer
  trackName="retro_song.wav"
  currentTime="01:30"
  totalDuration="04:00"
  progress={37.5}
  volume={75}
/>
```

### Example 2: Controlled Player with Playlist

```tsx
function PlaylistPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const playlist = [
    { name: 'track_01.wav', duration: '03:45' },
    { name: 'track_02.wav', duration: '04:20' },
    { name: 'track_03.wav', duration: '03:15' },
  ];

  const track = playlist[currentTrack];

  return (
    <Win95MediaPlayer
      trackName={track.name}
      currentTime="00:00"
      totalDuration={track.duration}
      progress={progress}
      volume={75}
      isPlaying={isPlaying}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onStop={() => {
        setIsPlaying(false);
        setProgress(0);
      }}
      onNext={() => {
        setCurrentTrack((prev) => (prev + 1) % playlist.length);
        setProgress(0);
      }}
      onPrevious={() => {
        setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
        setProgress(0);
      }}
      onProgressChange={setProgress}
    />
  );
}
```

### Example 3: Multiple Players in Grid

```tsx
function MusicLibrary() {
  const albums = [
    { title: 'Synthwave Mix', tracks: 12 },
    { title: 'Retro Hits', tracks: 8 },
    { title: 'Chiptune Collection', tracks: 15 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      {albums.map((album, index) => (
        <Win95MediaPlayer
          key={index}
          trackName={`${album.title} - Track 1`}
          currentTime="00:00"
          totalDuration="03:30"
          progress={0}
          volume={75}
        />
      ))}
    </div>
  );
}
```

### Example 4: With Audio Integration

```tsx
function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);

  const handlePlay = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handleProgressChange = (newProgress: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      setVolume(newVolume);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="music.wav" />
      <Win95MediaPlayer
        trackName="music.wav"
        currentTime="00:42"
        totalDuration="03:17"
        progress={progress}
        volume={volume}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onProgressChange={handleProgressChange}
        onVolumeChange={handleVolumeChange}
      />
    </>
  );
}
```

## Styling & Customization

### CSS Variables

The component uses CSS variables that can be overridden:

```css
--card-bg: #c0c0c0; /* Main background */
--card-border-light: #ffffff; /* Light borders */
--card-border-dark: #808080; /* Dark borders */
--card-border-darker: #404040; /* Darker borders */
--card-titlebar: linear-gradient(90deg, #000080, #1084d0);
--card-title-text: #ffffff; /* Title text */
--card-text: #000000; /* Main text */
--card-display-bg: #000000; /* Display background */
--card-display-text: #00ff00; /* Display text (LCD green) */
```

### Custom Styling Example

```tsx
<div
  style={
    {
      '--card-display-text': '#ffff00',
      '--card-display-bg': '#001100',
    } as React.CSSProperties
  }
>
  <Win95MediaPlayer {...props} />
</div>
```

## Accessibility Features

- ✅ ARIA labels on all buttons
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Semantic HTML structure

## Performance Considerations

- Lightweight component (~5KB minified)
- CSS-based animations (no JavaScript animations)
- Efficient event handling
- Minimal re-renders with proper memoization

## Browser Compatibility

| Browser | Support    |
| ------- | ---------- |
| Chrome  | ✅ Full    |
| Firefox | ✅ Full    |
| Safari  | ✅ Full    |
| Edge    | ✅ Full    |
| IE11    | ⚠️ Partial |

## Common Patterns

### Pattern 1: Time Formatting

```tsx
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Usage
<Win95MediaPlayer currentTime={formatTime(42)} totalDuration={formatTime(197)} {...props} />;
```

### Pattern 2: Progress Calculation

```tsx
function calculateProgress(current: number, total: number): number {
  return (current / total) * 100;
}

// Usage
<Win95MediaPlayer progress={calculateProgress(42, 197)} {...props} />;
```

## Troubleshooting

### Player not responding to clicks

- Ensure event handlers are properly bound
- Check that state is being updated correctly
- Verify no CSS is preventing pointer events

### Display text not visible

- Check CSS variables are set correctly
- Ensure `--card-display-text` color has sufficient contrast
- Verify component is not hidden by parent styles

### Buttons not styled correctly

- Clear browser cache
- Check for CSS conflicts with global styles
- Verify styled-components is properly installed

## Related Components

- `CyberCard` - Modern cyberpunk card
- `GlassCard` - Glassmorphism card
- `HudBox` - Futuristic HUD container
- `NotificationCard` - Notification display

## Support

For issues or questions, refer to the component guide at:
`packages/components/src/DataDisplay/WIN95MEDIAPLAYER_GUIDE.md`

## License

Part of the RHUDS Pro component library.
