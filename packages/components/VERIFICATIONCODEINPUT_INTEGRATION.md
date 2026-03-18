# VerificationCodeInput Integration Guide

## Component Overview

`VerificationCodeInput` is a cyberpunk-styled verification code input component for multi-digit code entry with keyboard navigation and paste support.

## File Structure

```
packages/components/src/Input/
├── VerificationCodeInput.tsx          # Main component
├── VerificationCodeInput.demo.tsx     # Demo with variants
└── VERIFICATIONCODEINPUT_GUIDE.md     # Detailed guide
```

## Installation & Import

```tsx
import { VerificationCodeInput } from '@rhuds/components';
```

## Quick Start

### Basic Usage

```tsx
<VerificationCodeInput />
```

### With Handlers

```tsx
<VerificationCodeInput
  length={6}
  onChange={(code) => console.log('Input:', code)}
  onComplete={(code) => console.log('Complete:', code)}
/>
```

### Custom Colors

```tsx
<VerificationCodeInput
  length={6}
  primaryColor="rgb(0, 255, 136)"
  backgroundColor="rgb(15, 15, 25)"
  title="Enter Code"
/>
```

## Props Reference

| Prop              | Type     | Default              | Description            |
| ----------------- | -------- | -------------------- | ---------------------- |
| `length`          | number   | 6                    | Number of code digits  |
| `title`           | string   | "Verification Code"  | Title text             |
| `primaryColor`    | string   | "rgb(0, 255, 136)"   | Accent color           |
| `backgroundColor` | string   | "rgb(15, 15, 25)"    | Background color       |
| `textColor`       | string   | "rgb(200, 200, 200)" | Text color             |
| `onComplete`      | function | undefined            | Completion callback    |
| `onChange`        | function | undefined            | Change callback        |
| `className`       | string   | undefined            | Custom CSS class       |
| `autoFocus`       | boolean  | true                 | Auto-focus first input |

## Features

✨ **Interactions**

- Keyboard navigation (arrows, backspace)
- Paste support from clipboard
- Auto-focus on first input
- Real-time validation

🎨 **Customization**

- Full color theming
- Configurable digit count
- Custom labels and titles
- CSS class support

🔄 **State Management**

- Internal digit state
- Event callbacks
- Completion detection
- Change tracking

## Theme Variations

### Green (Default)

```tsx
<VerificationCodeInput primaryColor="rgb(0, 255, 136)" backgroundColor="rgb(15, 15, 25)" />
```

### Cyan

```tsx
<VerificationCodeInput primaryColor="rgb(0, 200, 255)" backgroundColor="rgb(10, 20, 35)" />
```

### Purple

```tsx
<VerificationCodeInput primaryColor="rgb(200, 100, 255)" backgroundColor="rgb(25, 15, 35)" />
```

### Red (Error State)

```tsx
<VerificationCodeInput
  primaryColor="rgb(255, 50, 50)"
  backgroundColor="rgb(40, 15, 15)"
  title="Invalid Code - Try Again"
/>
```

## Advanced Usage

### Two-Factor Authentication

```tsx
import { VerificationCodeInput } from '@rhuds/components';
import { useState } from 'react';

export function TwoFactorAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async (code: string) => {
    setLoading(true);
    try {
      const result = await verifyTwoFactor(code);
      if (!result.success) {
        setError('Invalid code');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <VerificationCodeInput
        length={6}
        title="Enter 2FA Code"
        onComplete={handleComplete}
        primaryColor={error ? 'rgb(255, 50, 50)' : 'rgb(0, 255, 136)'}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

### Multi-Step Verification

```tsx
<div style={{ display: 'flex', gap: '2rem' }}>
  <div>
    <h4>Step 1: Email Code</h4>
    <VerificationCodeInput
      length={4}
      primaryColor="rgb(0, 255, 136)"
      onComplete={(code) => verifyEmail(code)}
    />
  </div>
  <div>
    <h4>Step 2: Phone Code</h4>
    <VerificationCodeInput
      length={4}
      primaryColor="rgb(0, 200, 255)"
      onComplete={(code) => verifyPhone(code)}
    />
  </div>
</div>
```

## Styling & Customization

### CSS Variables

The component uses CSS variables for theming:

- `--color`: Primary accent color
- `--background-color`: Background color
- `--text-color`: Text color

### Custom Styling

```tsx
<VerificationCodeInput
  className="my-custom-verification"
  primaryColor="rgb(100, 200, 255)"
  backgroundColor="rgb(20, 20, 40)"
/>
```

## Accessibility

- ✅ Semantic HTML structure
- ✅ Proper input types (numeric)
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Clear visual feedback
- ✅ ARIA-friendly

## Performance

- Lightweight component (~4KB)
- Minimal re-renders
- CSS animations (GPU accelerated)
- No external dependencies

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ⚠️ Limited support

## Related Components

- `AddFriendInput` - Friend code input
- `BashInput` - Terminal-style input
- `CyberpunkAccessInput` - Access code input
- `FloatingLabelInput` - Input with floating label

## Examples

See `VerificationCodeInput.demo.tsx` for complete examples with all theme variations.

## Troubleshooting

### Code not showing

- Check if `length` prop is set correctly
- Verify `autoFocus` is enabled

### Colors not applying

- Ensure color format is valid RGB or hex
- Check CSS specificity if using custom className

### Paste not working

- Verify clipboard permissions
- Check if pasted content contains digits

## Contributing

To add new features:

1. Update `VerificationCodeInputProps` interface
2. Add new props to component
3. Update demo file with new examples
4. Update this guide

## License

Part of @rhuds/components library
