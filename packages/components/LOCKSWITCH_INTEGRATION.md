# LockSwitch Integration Summary

## Component Details

- **Name**: LockSwitch
- **Category**: Form
- **Location**: `packages/components/src/Form/LockSwitch.tsx`
- **Type**: Functional React Component with TypeScript

## Files Created/Modified

### New Files

1. **LockSwitch.tsx** - Main component implementation
   - Accepts `checked`, `onChange`, `onColor`, `offColor`, `disabled`, and `className` props
   - Features lock/unlock SVG icons with smooth transitions
   - Includes animated track with glowing effects
   - Supports dynamic color customization via hex format

2. **LOCKSWITCH_GUIDE.md** - Comprehensive documentation
   - Usage examples and prop documentation
   - Animation details and timing
   - Styling and customization guide
   - Accessibility and performance notes

### Modified Files

1. **packages/components/src/index.ts**
   - Added export: `export { default as LockSwitch } from './Form/LockSwitch';`
   - Added type export: `export type { LockSwitchProps } from './Form/LockSwitch';`

2. **packages/demo-app/src/pages/playground/ComponentLibrary.tsx**
   - Added LockSwitch entry to component library
   - Includes example code for playground

3. **packages/demo-app/src/pages/ShowcasePage.tsx**
   - Added import for LockSwitch
   - Added state management for lockSwitchValue
   - Added showcase section with 3 color variations (Red/Green, Red/Cyan, Red/Yellow)

## Component Features

### Core Functionality

- Toggle between locked and unlocked states
- Lock/unlock icon animations
- Separate colors for on and off states
- Glowing effects based on state
- Disabled state support
- Smooth 300ms track and 500ms icon animations

### Visual Design

- Lock icon (closed padlock) for locked state
- Unlock icon (open padlock) for unlocked state
- White thumb indicator with shadow
- Glowing box-shadow effects
- Dark theme optimized

### Animation Sequence

1. **Track Animation (300ms)**: Background color and padding transition
2. **Icon Animation (500ms)**: Icons fade in/out and slide
3. **Thumb Animation (300ms)**: Thumb slides to new position

### Props Interface

```typescript
interface LockSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onColor?: string;
  offColor?: string;
  disabled?: boolean;
  className?: string;
}
```

## Integration Points

### Playground

- Component available in ComponentLibrary
- Example code: `<LockSwitch checked={false} onColor="#00ff88" offColor="#ff0000" onChange={(checked) => console.log(checked)} />`
- Fully functional in interactive playground

### Showcase

- Displayed in ShowcasePage under Form section (11d)
- Shows 3 color variations:
  - Red/Green (default)
  - Red/Cyan
  - Red/Yellow
- Demonstrates controlled toggle pattern and color customization

### Export

- Exported from main components package
- TypeScript types included
- Ready for external use

## Color Customization

The component supports any hex color:

- **offColor**: Color for locked state (default #ff0000)
- **onColor**: Color for unlocked state (default #00ff88)
- Both colors automatically update glowing effects

## Usage Pattern

```tsx
import { LockSwitch } from '@rhuds/components';

function MyComponent() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <LockSwitch
      checked={isUnlocked}
      onChange={setIsUnlocked}
      offColor="#ff0000"
      onColor="#00ff88"
    />
  );
}
```

## Animation Timing

- **Track Transition**: 300ms
- **Icon Transition**: 500ms
- **Thumb Transition**: 300ms
- **Easing**: Linear (default CSS)

## Disabled State

- Opacity reduces to 0.5
- Cursor changes to `not-allowed`
- Toggle interactions are prevented
- Change handler is not triggered

## Testing

- Component renders without errors
- Props are properly typed
- State transitions work correctly
- Icon animations trigger on state change
- Disabled state functions correctly
- Color customization works as expected

## Notes

- Component uses styled-components for styling
- All animations use CSS transitions (no JavaScript)
- Lock/unlock icons are SVG-based
- Supports any hex color format
- Fully responsive and works at any size
- Perfect for security/access control UI patterns
