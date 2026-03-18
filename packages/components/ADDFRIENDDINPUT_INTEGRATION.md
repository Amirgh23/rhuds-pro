# AddFriendInput Integration Guide

## Component Overview

`AddFriendInput` is a cyberpunk-styled input component for entering friend codes or verification codes with animated visual feedback.

## File Structure

```
packages/components/src/Input/
├── AddFriendInput.tsx          # Main component
├── AddFriendInput.demo.tsx     # Demo with variants
└── ADDFRIENDDINPUT_GUIDE.md    # Detailed guide
```

## Installation & Import

```tsx
import { AddFriendInput } from '@rhuds/components';
```

## Quick Start

### Basic Usage

```tsx
<AddFriendInput />
```

### With Custom Colors

```tsx
<AddFriendInput
  primaryColor="rgb(0, 255, 255)"
  backgroundColor="rgb(10, 20, 30)"
  title="Add Teammate"
/>
```

### With Event Handlers

```tsx
<AddFriendInput
  onChange={(value) => console.log('Input:', value)}
  onCheck={(value) => console.log('Verified:', value)}
/>
```

## Props Reference

| Prop              | Type     | Default              | Description           |
| ----------------- | -------- | -------------------- | --------------------- |
| `title`           | string   | "Add a friend"       | Title text            |
| `placeholder`     | string   | "000000"             | Input placeholder     |
| `buttonLabel`     | string   | "Check Code"         | Button text           |
| `primaryColor`    | string   | "rgb(169, 116, 255)" | Accent color          |
| `backgroundColor` | string   | "rgb(36, 34, 39)"    | Background color      |
| `minLength`       | number   | 6                    | Min input length      |
| `maxLength`       | number   | 6                    | Max input length      |
| `onChange`        | function | undefined            | Input change callback |
| `onCheck`         | function | undefined            | Check button callback |
| `className`       | string   | undefined            | Custom CSS class      |

## Features

✨ **Animations**

- Pulsing glow effect on container
- Jumping and rotating icon animation
- Hue rotation on verification
- Smooth hover transitions

🎨 **Customization**

- Full color theming support
- Configurable input constraints
- Custom labels and titles
- CSS class support

🔄 **Interactivity**

- Real-time input display with separators
- Checkbox-based verification
- Event callbacks for integration
- Internal state management

## Theme Variations

### Purple (Default)

```tsx
<AddFriendInput />
```

### Cyan

```tsx
<AddFriendInput primaryColor="rgb(0, 255, 255)" backgroundColor="rgb(10, 20, 30)" />
```

### Green

```tsx
<AddFriendInput primaryColor="rgb(0, 255, 100)" backgroundColor="rgb(20, 30, 20)" />
```

### Red

```tsx
<AddFriendInput primaryColor="rgb(255, 50, 50)" backgroundColor="rgb(40, 20, 20)" />
```

### Gold

```tsx
<AddFriendInput primaryColor="rgb(255, 200, 0)" backgroundColor="rgb(30, 25, 35)" />
```

## Advanced Usage

### Form Integration

```tsx
import { AddFriendInput } from '@rhuds/components';
import { useState } from 'react';

export function FriendForm() {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);

  const handleCheck = (value: string) => {
    // Validate code
    if (value.length === 6) {
      setVerified(true);
      // Submit to API
      submitFriendCode(value);
    }
  };

  return <AddFriendInput onChange={setCode} onCheck={handleCheck} title="Enter Friend Code" />;
}
```

### Multiple Instances

```tsx
<div style={{ display: 'flex', gap: '2rem' }}>
  <AddFriendInput title="Player 1" primaryColor="rgb(255, 0, 0)" />
  <AddFriendInput title="Player 2" primaryColor="rgb(0, 0, 255)" />
</div>
```

## Styling & Customization

### CSS Variables

The component uses CSS variables for theming:

- `--color`: Primary accent color
- `--background-color`: Background color

### Custom Styling

```tsx
<AddFriendInput
  className="my-custom-class"
  primaryColor="rgb(100, 200, 255)"
  backgroundColor="rgb(20, 20, 40)"
/>
```

## Accessibility

- ✅ Semantic HTML structure
- ✅ Proper label associations
- ✅ Hidden checkbox with visible label
- ✅ ARIA-friendly SVG icon
- ✅ Keyboard navigable

## Performance

- Lightweight component (~5KB)
- Minimal re-renders
- CSS animations (GPU accelerated)
- No external dependencies

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ⚠️ Limited support (no CSS variables)

## Related Components

- `BashInput` - Terminal-style input
- `CyberpunkAccessInput` - Access code input
- `GradientSearchInput` - Search input with gradient
- `FloatingLabelInput` - Input with floating label

## Examples

See `AddFriendInput.demo.tsx` for complete examples with all theme variations.

## Troubleshooting

### Input not showing

- Check if `maxLength` is set correctly
- Verify `placeholder` prop is provided

### Colors not applying

- Ensure color format is valid RGB or hex
- Check CSS specificity if using custom className

### Animation not playing

- Verify browser supports CSS animations
- Check if animations are disabled in browser settings

## Contributing

To add new features or themes:

1. Update `AddFriendInputProps` interface
2. Add new props to component
3. Update demo file with new examples
4. Update this guide

## License

Part of @rhuds/components library
