# TubeAmplifier Integration Guide

## Overview

The `TubeAmplifier` component is a highly detailed vintage tube amplifier UI with realistic CSS styling. It's perfect for audio applications, retro-themed interfaces, or decorative UI elements in modern applications.

## Installation

The component is already included in the `@rhuds/components` package.

```tsx
import { TubeAmplifier } from '@rhuds/components';
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { TubeAmplifier } from '@rhuds/components';

export function App() {
  const [isPowered, setIsPowered] = useState(false);

  return (
    <TubeAmplifier
      brandName="FIDELITY 900"
      isPowered={isPowered}
      leftChannelLevel={45}
      rightChannelLevel={55}
      volume={50}
      tone={50}
      onPowerToggle={setIsPowered}
    />
  );
}
```

## Component Structure

```
TubeAmplifier
├── Wood Case (Realistic wood grain)
├── Tube Bay (3 vacuum tubes with glowing filaments)
└── Faceplate
    ├── Mounting Bolts
    ├── VU Meters (Left & Right channels)
    ├── Controls
    │   ├── Volume Knob
    │   ├── Power Switch
    │   ├── Active Light
    │   └── Tone Knob
    └── Brand Name
```

## Props Reference

### Display Props

- `brandName` (string): Brand name on faceplate
- `isPowered` (boolean): Power state

### Meter Props

- `leftChannelLevel` (number): Left VU meter level (0-100)
- `rightChannelLevel` (number): Right VU meter level (0-100)

### Control Props

- `volume` (number): Volume level (0-100)
- `tone` (number): Tone level (0-100)

### Event Handlers

- `onPowerToggle(isPowered)`: Called when power is toggled
- `onVolumeChange(volume)`: Called when volume changes
- `onToneChange(tone)`: Called when tone changes

### Other Props

- `className` (string): Custom CSS class name

## Usage Examples

### Example 1: Basic Amplifier

```tsx
<TubeAmplifier
  brandName="VINTAGE PRO"
  isPowered={false}
  leftChannelLevel={0}
  rightChannelLevel={0}
  volume={50}
  tone={50}
/>
```

### Example 2: Powered Amplifier

```tsx
<TubeAmplifier
  brandName="FIDELITY 900"
  isPowered={true}
  leftChannelLevel={65}
  rightChannelLevel={70}
  volume={75}
  tone={60}
/>
```

### Example 3: Interactive Amplifier with State

```tsx
function InteractiveAmp() {
  const [isPowered, setIsPowered] = useState(false);
  const [leftLevel, setLeftLevel] = useState(45);
  const [rightLevel, setRightLevel] = useState(55);
  const [volume, setVolume] = useState(50);
  const [tone, setTone] = useState(50);

  return (
    <div>
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

      {/* Controls */}
      <div style={{ marginTop: '2rem' }}>
        <label>
          <input
            type="checkbox"
            checked={isPowered}
            onChange={(e) => setIsPowered(e.target.checked)}
          />
          Power
        </label>

        <div>
          <label>Left Level: {leftLevel}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={leftLevel}
            onChange={(e) => setLeftLevel(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Right Level: {rightLevel}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={rightLevel}
            onChange={(e) => setRightLevel(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
```

### Example 4: Amplifier Rack

```tsx
function AmplifierRack() {
  const amplifiers = [
    { name: 'CHANNEL 1', powered: true, left: 60, right: 65 },
    { name: 'CHANNEL 2', powered: true, left: 55, right: 60 },
    { name: 'MONITOR', powered: false, left: 0, right: 0 },
    { name: 'BACKUP', powered: false, left: 0, right: 0 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
      {amplifiers.map((amp, index) => (
        <TubeAmplifier
          key={index}
          brandName={amp.name}
          isPowered={amp.powered}
          leftChannelLevel={amp.left}
          rightChannelLevel={amp.right}
          volume={75}
          tone={50}
        />
      ))}
    </div>
  );
}
```

### Example 5: With Audio Integration

```tsx
function AudioAmp() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPowered, setIsPowered] = useState(false);
  const [leftLevel, setLeftLevel] = useState(0);
  const [rightLevel, setRightLevel] = useState(0);

  useEffect(() => {
    if (!audioRef.current || !isPowered) return;

    const analyser = new AnalyserNode(new AudioContext());
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevels = () => {
      analyser.getByteFrequencyData(dataArray);
      const left = (Math.max(...dataArray.slice(0, dataArray.length / 2)) / 255) * 100;
      const right = (Math.max(...dataArray.slice(dataArray.length / 2)) / 255) * 100;
      setLeftLevel(left);
      setRightLevel(right);
      requestAnimationFrame(updateLevels);
    };

    updateLevels();
  }, [isPowered]);

  return (
    <>
      <audio ref={audioRef} src="music.mp3" />
      <TubeAmplifier
        brandName="AUDIO MONITOR"
        isPowered={isPowered}
        leftChannelLevel={leftLevel}
        rightChannelLevel={rightLevel}
        volume={75}
        tone={50}
        onPowerToggle={setIsPowered}
      />
    </>
  );
}
```

## Styling & Customization

### CSS Variables

The component uses CSS variables that can be overridden:

```css
--wood-base: #3e2723; /* Wood base color */
--wood-grain: #281510; /* Wood grain color */
--metal-face: #d8d8d8; /* Metal faceplate */
--metal-shadow: #999; /* Metal shadows */
--glass-coating: rgba(200, 220, 255, 0.1);
--filament-off: #4a3b3b; /* Off filament color */
--filament-on: #ff8800; /* On filament color */
--glow-color: rgba(255, 160, 50, 0.6);
--jewel-off: #400; /* Off jewel light */
--jewel-on: #ff0000; /* On jewel light */
```

### Custom Styling Example

```tsx
<div
  style={
    {
      '--filament-on': '#00ff00',
      '--jewel-on': '#00ff00',
      '--glow-color': 'rgba(0, 255, 0, 0.6)',
      '--wood-base': '#1a1a1a',
    } as React.CSSProperties
  }
>
  <TubeAmplifier {...props} />
</div>
```

## Accessibility Features

- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Semantic HTML structure

## Performance Considerations

- Lightweight component (~12KB minified)
- CSS-based animations (no JavaScript animations)
- Efficient event handling
- Minimal re-renders with proper memoization
- GPU-accelerated transforms

## Browser Compatibility

| Browser | Support    |
| ------- | ---------- |
| Chrome  | ✅ Full    |
| Firefox | ✅ Full    |
| Safari  | ✅ Full    |
| Edge    | ✅ Full    |
| IE11    | ⚠️ Partial |

## Common Patterns

### Pattern 1: Warm-up Sequence

```tsx
function WarmupAmp() {
  const [isPowered, setIsPowered] = useState(false);
  const [isWarmedUp, setIsWarmedUp] = useState(false);

  useEffect(() => {
    if (!isPowered) {
      setIsWarmedUp(false);
      return;
    }

    const timer = setTimeout(() => setIsWarmedUp(true), 3000);
    return () => clearTimeout(timer);
  }, [isPowered]);

  return (
    <TubeAmplifier
      isPowered={isPowered}
      leftChannelLevel={isWarmedUp ? 60 : 0}
      rightChannelLevel={isWarmedUp ? 65 : 0}
      onPowerToggle={setIsPowered}
    />
  );
}
```

### Pattern 2: Peak Detection

```tsx
function PeakAmp() {
  const [levels, setLevels] = useState({ left: 0, right: 0 });

  const handleLevelUpdate = (left: number, right: number) => {
    setLevels({
      left: Math.min(100, left),
      right: Math.min(100, right),
    });
  };

  return <TubeAmplifier leftChannelLevel={levels.left} rightChannelLevel={levels.right} />;
}
```

## Troubleshooting

### Tubes not glowing

- Ensure `isPowered` is set to `true`
- Check CSS variables are not overridden
- Verify browser supports CSS gradients

### Meters not moving

- Check `leftChannelLevel` and `rightChannelLevel` values
- Ensure values are between 0-100
- Verify event handlers are properly connected

### Styling issues

- Clear browser cache
- Check for CSS conflicts with global styles
- Verify styled-components is properly installed

## Related Components

- `Win95MediaPlayer` - Windows 95 media player
- `CyberCard` - Modern cyberpunk card
- `GlassCard` - Glassmorphism card
- `HudBox` - Futuristic HUD container

## Support

For issues or questions, refer to the component guide at:
`packages/components/src/DataDisplay/TUBEAMPLIFIER_GUIDE.md`

## License

Part of the RHUDS Pro component library.
