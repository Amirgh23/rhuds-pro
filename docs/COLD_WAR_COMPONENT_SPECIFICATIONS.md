# RHUDS Pro Cold War Component Specifications

## Overview

This document provides detailed specifications for all components updated with the Call of Duty: Black Ops Cold War aesthetic. Each component includes visual specifications, prop documentation, code examples, and before/after comparisons.

## Table of Contents

1. [ColdWarButton](#coldwarbutton)
2. [ColdWarInput](#coldwarinput)
3. [ColdWarCard](#coldwarcard)
4. [Component Migration Matrix](#component-migration-matrix)
5. [State Specifications](#state-specifications)
6. [Accessibility Specifications](#accessibility-specifications)

---

## ColdWarButton

### Overview

Consolidated button component replacing 15+ button variants with unified Cold War aesthetic.

### Visual Specifications

**Geometry**:

- Chamfer: 8px (small components)
- Border: 1px (default), 2px (active)
- Padding: 12px 24px (md size)

**Typography**:

- Font: Share Tech Mono, monospace
- Size: 14px (md size)
- Weight: 500 (medium)
- Transform: uppercase
- Letter-spacing: 0.03em

**Colors**:

- Default: Amber text on Deep Black background
- Hover: Amber text on Dark Gray background
- Active: Amber text on Medium Gray background
- Disabled: Gray text on Dark Gray background

### Props

```typescript
interface ColdWarButtonProps {
  // Variants
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'tactical' | 'glitch';

  // Sizes
  size?: 'sm' | 'md' | 'lg';

  // States
  disabled?: boolean;
  loading?: boolean;

  // Content
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';

  // Events
  onClick?: () => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;
}
```

### Variants

#### Primary

```tsx
<ColdWarButton variant="primary">LAUNCH SYSTEM</ColdWarButton>
```

**Colors**: Tactical Amber on Deep Black
**Usage**: Main actions, primary CTAs

#### Secondary

```tsx
<ColdWarButton variant="secondary">SECONDARY ACTION</ColdWarButton>
```

**Colors**: Phosphor Green on Deep Black
**Usage**: Secondary actions, alternative options

#### Danger

```tsx
<ColdWarButton variant="danger">DELETE SYSTEM</ColdWarButton>
```

**Colors**: Muted Red on Deep Black
**Usage**: Destructive actions, warnings

#### Success

```tsx
<ColdWarButton variant="success">CONFIRM ACTION</ColdWarButton>
```

**Colors**: Phosphor Green on Deep Black
**Usage**: Positive confirmations, success states

#### Tactical

```tsx
<ColdWarButton variant="tactical">TACTICAL STRIKE</ColdWarButton>
```

**Colors**: Tactical Amber with glitch effect
**Usage**: Special tactical actions, emphasis

#### Glitch

```tsx
<ColdWarButton variant="glitch">SYSTEM ERROR</ColdWarButton>
```

**Colors**: Tactical Amber with glitch animation
**Usage**: Error states, system alerts

### Sizes

| Size | Padding   | Font Size | Chamfer |
| ---- | --------- | --------- | ------- |
| sm   | 8px 16px  | 12px      | 6px     |
| md   | 12px 24px | 14px      | 8px     |
| lg   | 16px 32px | 16px      | 10px    |

### States

#### Default

```css
background: #0a0a0c;
border: 1px solid #ffb000;
color: #ffb000;
```

#### Hover

```css
background: #1a1a1e;
border: 1px solid #ffb000;
color: #ffb000;
box-shadow: 0 0 10px rgba(255, 176, 0, 0.5);
```

#### Active

```css
background: #2a2a2e;
border: 2px solid #ffb000;
color: #ffb000;
box-shadow: 0 0 15px rgba(255, 176, 0, 0.5);
```

#### Disabled

```css
background: #1a1a1e;
border: 1px solid #3a3a3e;
color: #3a3a3e;
cursor: not-allowed;
```

#### Loading

```css
background: #0a0a0c;
border: 1px solid #ffb000;
color: #ffb000;
animation: button-pulse 1s infinite;
```

### Code Example

```tsx
import { ColdWarButton } from '@rhuds/components';

export function ButtonDemo() {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <ColdWarButton variant="primary" size="md">
        Primary
      </ColdWarButton>

      <ColdWarButton variant="secondary" size="md">
        Secondary
      </ColdWarButton>

      <ColdWarButton variant="danger" size="md">
        Danger
      </ColdWarButton>

      <ColdWarButton variant="success" size="md">
        Success
      </ColdWarButton>

      <ColdWarButton variant="tactical" size="md">
        Tactical
      </ColdWarButton>

      <ColdWarButton variant="glitch" size="md">
        Glitch
      </ColdWarButton>

      <ColdWarButton disabled>Disabled</ColdWarButton>

      <ColdWarButton loading>Loading</ColdWarButton>
    </div>
  );
}
```

---

## ColdWarInput

### Overview

Consolidated input component replacing 10+ input variants with unified Cold War aesthetic.

### Visual Specifications

**Geometry**:

- Chamfer: 12px (medium components)
- Border: 1px (default), 2px (focus)
- Padding: 12px 16px (md size)

**Typography**:

- Font: Share Tech Mono, monospace
- Size: 14px (md size)
- Weight: 400 (regular)
- Transform: uppercase (labels only)
- Letter-spacing: 0.02em

**Colors**:

- Default: Light Gray text on Dark Gray background
- Focus: Amber text on Dark Gray background
- Error: Red text on Dark Gray background
- Success: Green text on Dark Gray background
- Disabled: Gray text on Medium Gray background

### Props

```typescript
interface ColdWarInputProps {
  // Variants
  variant?: 'tactical' | 'terminal' | 'holo' | 'glitch' | 'minimal';

  // Sizes
  size?: 'sm' | 'md' | 'lg';

  // States
  disabled?: boolean;
  error?: boolean;
  success?: boolean;

  // Content
  label?: string;
  placeholder?: string;
  value?: string;

  // Icons
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';

  // Messages
  errorMessage?: string;
  successMessage?: string;

  // Events
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;
}
```

### Variants

#### Tactical

```tsx
<ColdWarInput variant="tactical" label="TACTICAL INPUT" placeholder="Enter command..." />
```

**Style**: Standard tactical HUD input
**Usage**: Primary input method

#### Terminal

```tsx
<ColdWarInput variant="terminal" label="TERMINAL INPUT" placeholder="$ command..." />
```

**Style**: Terminal/hacker aesthetic
**Usage**: Code input, terminal commands

#### Holo

```tsx
<ColdWarInput variant="holo" label="HOLOGRAPHIC INPUT" placeholder="Holographic data..." />
```

**Style**: Holographic/futuristic aesthetic
**Usage**: Sci-fi themed inputs

#### Glitch

```tsx
<ColdWarInput variant="glitch" label="GLITCH INPUT" placeholder="Glitch effect..." />
```

**Style**: Glitch animation effect
**Usage**: Error states, system alerts

#### Minimal

```tsx
<ColdWarInput variant="minimal" label="MINIMAL INPUT" placeholder="Minimal style..." />
```

**Style**: Minimal borders, subtle styling
**Usage**: Clean, minimal interfaces

### Sizes

| Size | Padding   | Font Size | Chamfer |
| ---- | --------- | --------- | ------- |
| sm   | 8px 12px  | 12px      | 10px    |
| md   | 12px 16px | 14px      | 12px    |
| lg   | 16px 20px | 16px      | 14px    |

### States

#### Default

```css
background: #1a1a1e;
border: 1px solid #2a2a2e;
color: #cccccc;
```

#### Focus

```css
background: #1a1a1e;
border: 2px solid #ffb000;
color: #ffb000;
box-shadow: 0 0 10px rgba(255, 176, 0, 0.3);
```

#### Error

```css
background: #1a1a1e;
border: 2px solid #ff3333;
color: #ff3333;
box-shadow: 0 0 10px rgba(255, 51, 51, 0.3);
```

#### Success

```css
background: #1a1a1e;
border: 2px solid #33ff00;
color: #33ff00;
box-shadow: 0 0 10px rgba(51, 255, 0, 0.3);
```

#### Disabled

```css
background: #2a2a2e;
border: 1px solid #3a3a3e;
color: #3a3a3e;
cursor: not-allowed;
```

### Code Example

```tsx
import { ColdWarInput } from '@rhuds/components';
import { useState } from 'react';

export function InputDemo() {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <ColdWarInput
        variant="tactical"
        label="TACTICAL INPUT"
        placeholder="Enter text..."
        value={value}
        onChange={setValue}
      />

      <ColdWarInput variant="terminal" label="TERMINAL INPUT" placeholder="$ command..." />

      <ColdWarInput variant="holo" label="HOLOGRAPHIC INPUT" placeholder="Holographic data..." />

      <ColdWarInput variant="glitch" label="GLITCH INPUT" placeholder="Glitch effect..." />

      <ColdWarInput variant="minimal" label="MINIMAL INPUT" placeholder="Minimal style..." />

      <ColdWarInput
        label="ERROR STATE"
        placeholder="Error input..."
        error={true}
        errorMessage="Invalid input"
      />

      <ColdWarInput
        label="SUCCESS STATE"
        placeholder="Success input..."
        success={true}
        successMessage="Input valid"
      />

      <ColdWarInput label="DISABLED INPUT" placeholder="Disabled..." disabled={true} />
    </div>
  );
}
```

---

## ColdWarCard

### Overview

Consolidated card component replacing 8+ card variants with unified Cold War aesthetic.

### Visual Specifications

**Geometry**:

- Chamfer: 12px (medium components)
- Border: 1px (default), 2px (active)
- Padding: 24px

**Typography**:

- Font: Share Tech Mono, monospace
- Header Size: 16px
- Header Weight: 700 (bold)
- Header Transform: uppercase
- Body Size: 14px
- Body Weight: 400 (regular)

**Colors**:

- Default: Amber border on Dark Gray background
- Hover: Amber border on Medium Gray background
- Active: Amber border (2px) on Medium Gray background
- Disabled: Gray border on Dark Gray background

### Props

```typescript
interface ColdWarCardProps {
  // Variants
  variant?: 'tactical' | 'glass' | 'notification' | 'data' | 'minimal';

  // Colors
  color?: 'amber' | 'green' | 'blue' | 'red' | 'neutral';

  // Elevation
  elevation?: 'none' | 'low' | 'medium' | 'high';

  // Content
  header?: string;
  footer?: string;
  children: React.ReactNode;

  // States
  disabled?: boolean;

  // Events
  onClick?: () => void;

  // Styling
  className?: string;
  style?: React.CSSProperties;
}
```

### Variants

#### Tactical

```tsx
<ColdWarCard variant="tactical" color="amber" header="TACTICAL DATA">
  Card content
</ColdWarCard>
```

**Style**: Standard tactical HUD card
**Usage**: Primary data display

#### Glass

```tsx
<ColdWarCard variant="glass" color="green" header="GLASS MORPHISM">
  Card content
</ColdWarCard>
```

**Style**: Glass morphism effect
**Usage**: Layered, transparent cards

#### Notification

```tsx
<ColdWarCard variant="notification" color="blue" header="NOTIFICATION">
  Card content
</ColdWarCard>
```

**Style**: Notification/alert style
**Usage**: Alerts, notifications

#### Data

```tsx
<ColdWarCard variant="data" color="red" header="DATA DISPLAY">
  Card content
</ColdWarCard>
```

**Style**: Data visualization card
**Usage**: Charts, metrics, data

#### Minimal

```tsx
<ColdWarCard variant="minimal" color="neutral" header="MINIMAL CARD">
  Card content
</ColdWarCard>
```

**Style**: Minimal borders, subtle styling
**Usage**: Clean, minimal interfaces

### Colors

| Color   | Primary | Secondary | Usage               |
| ------- | ------- | --------- | ------------------- |
| amber   | #FFB000 | #FFD633   | Primary, tactical   |
| green   | #33FF00 | #66FF33   | Success, secondary  |
| blue    | #0066CC | #00CCFF   | Information, accent |
| red     | #FF3333 | #FF6666   | Error, warning      |
| neutral | #3a3a3e | #2a2a2e   | Neutral, default    |

### Elevations

| Elevation | Shadow                     | Usage              |
| --------- | -------------------------- | ------------------ |
| none      | none                       | Flat design        |
| low       | 0 2px 4px rgba(0,0,0,0.3)  | Subtle elevation   |
| medium    | 0 4px 8px rgba(0,0,0,0.4)  | Standard elevation |
| high      | 0 8px 16px rgba(0,0,0,0.5) | Strong elevation   |

### Code Example

```tsx
import { ColdWarCard } from '@rhuds/components';

export function CardDemo() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
      }}
    >
      <ColdWarCard variant="tactical" color="amber" header="TACTICAL CARD" elevation="medium">
        <p>Tactical card with amber accent</p>
      </ColdWarCard>

      <ColdWarCard variant="glass" color="green" header="GLASS CARD" elevation="low">
        <p>Glass morphism effect</p>
      </ColdWarCard>

      <ColdWarCard variant="notification" color="blue" header="NOTIFICATION" elevation="medium">
        <p>Notification style card</p>
      </ColdWarCard>

      <ColdWarCard variant="data" color="red" header="DATA DISPLAY" elevation="high">
        <p>Data visualization card</p>
      </ColdWarCard>

      <ColdWarCard variant="minimal" color="neutral" header="MINIMAL CARD" elevation="none">
        <p>Minimal style card</p>
      </ColdWarCard>
    </div>
  );
}
```

---

## Component Migration Matrix

### Button Components

| Old Component   | New Component                 | Migration Path      |
| --------------- | ----------------------------- | ------------------- |
| PrimaryButton   | ColdWarButton (primary)       | Update variant prop |
| SecondaryButton | ColdWarButton (secondary)     | Update variant prop |
| DangerButton    | ColdWarButton (danger)        | Update variant prop |
| SuccessButton   | ColdWarButton (success)       | Update variant prop |
| GlitchButton    | ColdWarButton (glitch)        | Update variant prop |
| NeonButton      | ColdWarButton (tactical)      | Update styling      |
| GlassButton     | ColdWarButton (primary)       | Update styling      |
| IconButton      | ColdWarButton (icon prop)     | Add icon prop       |
| LoadingButton   | ColdWarButton (loading prop)  | Add loading prop    |
| DisabledButton  | ColdWarButton (disabled prop) | Add disabled prop   |

### Input Components

| Old Component | New Component           | Migration Path      |
| ------------- | ----------------------- | ------------------- |
| TextInput     | ColdWarInput (tactical) | Update variant prop |
| TerminalInput | ColdWarInput (terminal) | Update variant prop |
| HoloInput     | ColdWarInput (holo)     | Update variant prop |
| GlitchInput   | ColdWarInput (glitch)   | Update variant prop |
| MinimalInput  | ColdWarInput (minimal)  | Update variant prop |
| SearchInput   | ColdWarInput (tactical) | Add icon prop       |
| PasswordInput | ColdWarInput (tactical) | Add type prop       |
| NumberInput   | ColdWarInput (tactical) | Add type prop       |
| EmailInput    | ColdWarInput (tactical) | Add type prop       |
| DateInput     | ColdWarInput (tactical) | Add type prop       |

### Card Components

| Old Component    | New Component              | Migration Path      |
| ---------------- | -------------------------- | ------------------- |
| TacticalCard     | ColdWarCard (tactical)     | Update variant prop |
| GlassCard        | ColdWarCard (glass)        | Update variant prop |
| NotificationCard | ColdWarCard (notification) | Update variant prop |
| DataCard         | ColdWarCard (data)         | Update variant prop |
| MinimalCard      | ColdWarCard (minimal)      | Update variant prop |
| HudCard          | ColdWarCard (tactical)     | Update styling      |
| NeonCard         | ColdWarCard (tactical)     | Update styling      |
| GlitchCard       | ColdWarCard (glitch)       | Update styling      |

---

## State Specifications

### Interactive States

All components support the following states:

- **Default**: Normal, uninteracted state
- **Hover**: Mouse over the component
- **Active**: Component is being interacted with
- **Focus**: Keyboard focus (for accessibility)
- **Disabled**: Component is disabled
- **Loading**: Component is in loading state
- **Error**: Component has an error
- **Success**: Component has succeeded

### Transition Specifications

| State Change       | Duration | Easing   | Usage           |
| ------------------ | -------- | -------- | --------------- |
| Default → Hover    | 150ms    | tactical | Hover effects   |
| Default → Active   | 200ms    | tactical | Click effects   |
| Default → Focus    | 150ms    | tactical | Focus effects   |
| Default → Disabled | 100ms    | smooth   | Disable effects |
| Default → Loading  | 300ms    | smooth   | Loading effects |
| Default → Error    | 200ms    | tactical | Error effects   |
| Default → Success  | 200ms    | tactical | Success effects |

---

## Accessibility Specifications

### Color Contrast

All components meet WCAG 2.1 AA standards:

- **Normal text**: 4.5:1 minimum
- **UI components**: 3:1 minimum
- **Large text**: 3:1 minimum

### Keyboard Navigation

All components support:

- **Tab**: Navigate to component
- **Shift+Tab**: Navigate backwards
- **Enter**: Activate button/submit form
- **Space**: Toggle checkbox/radio
- **Arrow keys**: Navigate options

### Screen Reader Support

All components include:

- **ARIA labels**: Descriptive labels for screen readers
- **ARIA roles**: Proper semantic roles
- **ARIA states**: Current state information
- **ARIA live regions**: Dynamic content updates

### Focus Indicators

All components display:

- **Visible focus outline**: 2px solid primary color
- **Focus offset**: 2px from component edge
- **High contrast**: Meets WCAG AAA standards

### Reduced Motion Support

All components respect:

- **prefers-reduced-motion**: Disable animations
- **Instant transitions**: 0.01ms duration
- **No animations**: Static fallback

---

## Performance Specifications

### Animation Performance

- **Target**: 60fps (16.67ms per frame)
- **GPU acceleration**: Use transform and opacity
- **Avoid**: width, height, left, top, margin, padding

### Bundle Size

- **ColdWarButton**: ~5KB
- **ColdWarInput**: ~5KB
- **ColdWarCard**: ~5KB
- **Total**: ~15KB

### Rendering Performance

- **Initial render**: <100ms
- **Re-render**: <50ms
- **Animation frame**: <16.67ms

---

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Feature Support

| Feature                | Chrome | Firefox | Safari | Edge |
| ---------------------- | ------ | ------- | ------ | ---- |
| clip-path              | ✓      | ✓       | ✓      | ✓    |
| CSS custom properties  | ✓      | ✓       | ✓      | ✓    |
| CSS animations         | ✓      | ✓       | ✓      | ✓    |
| CSS filters            | ✓      | ✓       | ✓      | ✓    |
| SVG filters            | ✓      | ✓       | ✓      | ✓    |
| prefers-reduced-motion | ✓      | ✓       | ✓      | ✓    |

### Fallbacks

```css
/* clip-path fallback */
.chamfered {
  clip-path: polygon(...);
  border-radius: 8px; /* Fallback */
}

/* CSS custom properties fallback */
.color-primary {
  color: var(--color-primary, #ffb000);
}

/* Animation fallback */
@supports not (animation: test) {
  .animated {
    /* Static fallback */
  }
}
```

---

## Testing Specifications

### Unit Tests

Each component should have:

- Props validation tests
- State management tests
- Event handler tests
- Accessibility tests

### Integration Tests

Each component should have:

- Theme switching tests
- Keyboard navigation tests
- Screen reader tests
- Focus management tests

### Visual Regression Tests

Each component should have:

- Default state screenshots
- All variant screenshots
- All state screenshots
- All size screenshots

### Performance Tests

Each component should have:

- Render performance tests
- Animation performance tests
- Memory usage tests
- Bundle size tests

---

## Resources

- [ColdWarButton Component](packages/components/src/Button/ColdWarButton.tsx)
- [ColdWarInput Component](packages/components/src/Input/ColdWarInput.tsx)
- [ColdWarCard Component](packages/components/src/DataDisplay/ColdWarCard.tsx)
- [Cold War Theme CSS](packages/components/src/styles/cold-war-theme.css)
- [Visual Language Guide](docs/COLD_WAR_VISUAL_LANGUAGE_GUIDE.md)
- [Migration Guide](packages/components/COLD_WAR_MIGRATION_GUIDE.md)
