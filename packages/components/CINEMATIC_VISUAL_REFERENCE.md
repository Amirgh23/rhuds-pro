# Cinematic Visual Reference Guide

## Component Visual Specifications

### ColdWarButton - Tactical Mechanical Switch

#### Default State

```
┌─────────────────────────────────────┐
│ ◆ [LED]  BUTTON TEXT  [SN:0142]    │
│                                     │
└─────────────────────────────────────┘

LED Indicator:
  • Position: Left side (8px from edge)
  • Size: 6px diameter
  • Color: Primary color (amber)
  • Glow: Subtle box-shadow
  • Animation: None (default)

Corner Brackets:
  • Top-Left: 8px × 8px L-shape
  • Bottom-Right: 8px × 8px L-shape
  • Color: Primary color (amber)
  • Opacity: 0.6
  • Animation: None (default)

Serial Number:
  • Position: Bottom-right corner
  • Text: "SN:0142"
  • Font: Courier New, 8px
  • Color: Primary color (amber)
  • Opacity: 0.4
```

#### Hover State

```
┌─────────────────────────────────────┐
│ ◆ [LED]  BUTTON TEXT  [SN:0142]    │
│ ═════════════════════════════════════ ← Scan-line sweep
│                                     │
└─────────────────────────────────────┘

LED Indicator:
  • Animation: led-pulse (0.6s)
  • Glow intensifies

Corner Brackets:
  • Animation: corner-bracket-glow (1s)
  • Opacity pulses 0.4 → 0.8

Scan-Line:
  • Animation: scan-line-sweep (0.8s)
  • Sweeps left to right continuously
  • Height: 2px
  • Gradient: transparent → color → transparent
```

#### Active State

```
┌─────────────────────────────────────┐
│ ◆ [LED]  BUTTON TEXT  [SN:0142]    │
│ ╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳╳ ← Glitch effect
│                                     │
└─────────────────────────────────────┘

Transform: scale(0.98)
Box-Shadow: Enhanced bloom
Glitch Animation: 100ms jitter
```

---

### ColdWarCard - Intel/Dossier

#### Default State

```
┌─ ┐                              ┌─ ┐
│  │  [TAPE]                [TAPE]  │  │
│  │                                 │  │
│  │  HEADER TEXT                    │  │
│  │  ─────────────────────────────  │  │
│  │                                 │  │
│  │  Card content here...           │  │
│  │                                 │  │
│  │  ╔═══════════════════════════╗  │  │
│  │  ║    CLASSIFIED            ║  │  │
│  │  ║  (watermark, rotated)    ║  │  │
│  │  ╚═══════════════════════════╝  │  │
│  │                                 │  │
│  │  55.7558° N, 37.6173° E // SECURE
│  │                                 │  │
└─ ┘                              └─ ┘

Targeting Brackets:
  • All four corners (12px × 12px)
  • L-shaped borders (2px)
  • Color: Accent color (amber)
  • Opacity: 0.5

Tape Overlays:
  • Top-left & top-right corners
  • Size: 24px × 16px
  • Color: Tan/brown (rgba(200, 180, 140, 0.3))
  • Animation: card-tape-flicker (3s)

Watermark:
  • Text: "CLASSIFIED"
  • Position: Center, rotated -15deg
  • Font-Size: 32px
  • Color: Accent color
  • Opacity: 0.08
  • Text-Shadow: Subtle glow

Footer:
  • Coordinates: "55.7558° N, 37.6173° E"
  • Status: "// SECURE"
  • Font: Monospace, 10px
  • Background: Dark with transparency
```

#### Hover State

```
┌─ ┐                              ┌─ ┐
│  │  [TAPE]                [TAPE]  │  │
│  │  ✨ (enhanced glow)            │  │
│  │  HEADER TEXT                    │  │
│  │  ─────────────────────────────  │  │
│  │  ✨ (enhanced glow)            │  │
│  │  Card content here...           │  │
│  │                                 │  │
│  │  ╔═══════════════════════════╗  │  │
│  │  ║    CLASSIFIED            ║  │  │
│  │  ║  (watermark, rotated)    ║  │  │
│  │  ╚═══════════════════════════╝  │  │
│  │                                 │  │
│  │  55.7558° N, 37.6173° E // SECURE
│  │                                 │  │
└─ ┘                              └─ ┘

Transform: translateY(-4px)
Box-Shadow: Enhanced bloom (0 0 40px)
Tape Animation: Intensified flicker
```

---

### ColdWarInput - Terminal/Data Entry

#### Default State

```
┌─ ◆ SECURE CHANNEL ─────────────────┐
│                                     │
│ [ICON] ┌─────────────────────────┐ │
│        │ ENTER CREDENTIALS...    │ │
│        │ (grid pattern bg)       │ │
│        └─────────────────────────┘ │
│                                     │
│ ◆ CONNECTED // SECURE              │
└─────────────────────────────────────┘

Label Bar:
  • Background: Focus color with 20% opacity
  • Border-Left: 3px solid focus color
  • LED Indicator: 4px circle, pulsing
  • Font: Monospace, 11px, uppercase
  • Position: Top of input

Input Field:
  • Background: Grid pattern (8px × 8px)
  • Border: Multi-layer box-shadow
  • Font: Monospace, uppercase
  • Placeholder: Subtle opacity

Status Footer:
  • LED Indicator: 3px circle
  • Text: Status message
  • Font: Monospace, 10px
  • Color: Success/Error color
```

#### Focus State

```
┌─ ◆ SECURE CHANNEL ─────────────────┐
│                                     │
│ [ICON] ┌─────────────────────────┐ │
│        │ ENTER CREDENTIALS...    │ │
│        │ ⟳ (reticle spinning)    │ │
│        └─────────────────────────┘ │
│        ↓ (scan-line sweeping)      │
│                                     │
│ ◆ CONNECTED // SECURE              │
└─────────────────────────────────────┘

Scanning Animation:
  • Horizontal line sweeping left to right
  • Animation: scan-line-sweep (0.6s)
  • Height: 1px
  • Gradient: transparent → focus color → transparent

Targeting Reticle:
  • SVG circle with crosshairs
  • Position: Right side of input
  • Size: 12px × 12px
  • Animation: targeting-reticle-spin (4s)
  • Opacity: 0.4

Box-Shadow:
  • Enhanced bloom effect
  • Focus color glow: 0 0 20px
  • Drop shadow: 0 6px 16px

LED Indicator:
  • Animation: led-pulse (1s)
  • Intensified glow
```

#### Error State

```
┌─ ◆ SECURE CHANNEL ─────────────────┐
│                                     │
│ [ICON] ┌─────────────────────────┐ │
│        │ ENTER CREDENTIALS...    │ │
│        │ (error color border)    │ │
│        └─────────────────────────┘ │
│                                     │
│ ◆ ERROR: INVALID CREDENTIALS       │
└─────────────────────────────────────┘

Border Color: Error color (red)
Box-Shadow: Error color glow
Status LED: Red, pulsing
Status Text: Error message
```

---

## Animation Timing Reference

| Animation              | Duration    | Easing      | Use Case         |
| ---------------------- | ----------- | ----------- | ---------------- |
| led-pulse              | 0.6s - 1s   | ease-in-out | LED indicators   |
| corner-bracket-glow    | 1s          | ease-in-out | Corner brackets  |
| scan-line-sweep        | 0.6s - 0.8s | ease-in-out | Scanning effects |
| targeting-reticle-spin | 4s          | linear      | Reticle rotation |
| card-tape-flicker      | 3s          | ease-in-out | Tape overlays    |
| input-cursor-blink     | 0.8s        | ease-in-out | Cursor animation |

---

## Color Palette Reference

### Primary Theme (Perseus)

```
Primary (Amber):        #ffb000
Secondary (Green):      #33ff00
Background (Black):     #0a0a0c
Surface (Dark Gray):    #1a1a1e
Accent (Blue):          #0066cc
Text (White):           #ffffff
Error (Red):            #ff3333
Success (Green):        #33ff00
```

### Glow Colors

```
Primary Glow:   rgba(255, 176, 0, 0.6)
Focus Glow:     rgba(0, 102, 204, 0.6)
Success Glow:   rgba(51, 255, 0, 0.6)
Error Glow:     rgba(255, 51, 51, 0.6)
```

---

## Box-Shadow Layering Visualization

### Button Box-Shadow (6 Layers)

```
Layer 1: inset 0 1px 0 rgba(255, 255, 255, 0.1)
         ↓ Top highlight (beveled)

Layer 2: inset 0 -1px 0 rgba(0, 0, 0, 0.5)
         ↓ Bottom shadow (depth)

Layer 3: 0 0 0 1px ${colors.border}
         ↓ Border line

Layer 4: 0 0 0 2px rgba(0, 0, 0, 0.8)
         ↓ Outer frame

Layer 5: 0 4px 12px rgba(0, 0, 0, 0.4)
         ↓ Drop shadow

Layer 6: 0 0 20px ${colors.glow}40
         ↓ Bloom glow
```

### Card Box-Shadow (6 Layers)

```
Layer 1: inset 0 1px 0 rgba(255, 255, 255, 0.05)
         ↓ Top highlight

Layer 2: inset 0 -1px 0 rgba(0, 0, 0, 0.3)
         ↓ Bottom shadow

Layer 3: 0 0 0 1px ${colorAccent}40
         ↓ Accent border

Layer 4: 0 0 0 2px rgba(0, 0, 0, 0.8)
         ↓ Outer frame

Layer 5: 0 8px 24px rgba(0, 0, 0, 0.5)
         ↓ Drop shadow

Layer 6: 0 0 30px ${colorAccent}20
         ↓ Bloom glow
```

---

## Text-Shadow Layering Visualization

### Bloom Effect (4 Layers)

```
Layer 1: 0 0 4px ${color}
         ↓ Inner glow (tight)

Layer 2: 0 0 8px ${color}80
         ↓ Mid glow (medium)

Layer 3: 0 0 16px ${color}40
         ↓ Outer glow (wide)

Layer 4: 0 0 24px ${color}20
         ↓ Far glow (very wide)
```

---

## Background Pattern Visualization

### Brushed Metal Gradient

```
Layer 1: linear-gradient(135deg, transparent 0%, color 50%, transparent 100%)
         ↓ Diagonal metallic sheen

Layer 2: linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
         ↓ Vertical grid lines (4px)

Layer 3: linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px)
         ↓ Horizontal grid lines (4px)

Result: Subtle metallic texture with grid overlay
```

### Grid Pattern

```
Layer 1: linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
         ↓ Vertical grid lines (8px)

Layer 2: linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px)
         ↓ Horizontal grid lines (8px)

Result: Terminal-like grid pattern
```

---

## Decorative Elements Reference

### LED Indicator

```
Size: 6px × 6px
Shape: Circle (border-radius: 50%)
Color: Primary color
Box-Shadow: 0 0 4px ${color}, inset 0 0 2px rgba(255,255,255,0.5)
Animation: led-pulse (on hover)
Position: Absolute (left: 8px, top: 50%)
```

### Corner Brackets

```
Size: 8px - 12px × 8px - 12px
Shape: L-shaped borders (2px)
Color: Primary/Accent color
Opacity: 0.5 - 0.6
Animation: corner-bracket-glow (on hover)
Positions: All four corners
```

### Tape Overlays

```
Size: 24px × 16px
Color: rgba(200, 180, 140, 0.3)
Border: 1px solid rgba(139, 119, 101, 0.5)
Box-Shadow: inset 0 1px 2px rgba(255,255,255,0.1)
Animation: card-tape-flicker (3s)
Positions: Top-left & top-right corners
```

### Watermark Stamp

```
Text: "CLASSIFIED"
Font-Size: 32px
Font-Weight: 900
Color: Accent color
Opacity: 0.08
Transform: rotate(-15deg)
Position: Center (absolute)
Text-Shadow: 0 0 10px ${color}20
```

### Targeting Reticle

```
Type: SVG
Size: 12px × 12px
Elements: Circle + 4 crosshairs
Color: Focus color
Opacity: 0.4
Animation: targeting-reticle-spin (4s linear)
Position: Right side of input
```

---

## Responsive Behavior

### Button

- **sm**: 28px height, 12px padding
- **md**: 36px height, 16px padding
- **lg**: 44px height, 24px padding

### Card

- **Padding**: Scales with viewport
- **Brackets**: Proportional to card size
- **Watermark**: Scales with card dimensions

### Input

- **sm**: 28px height, 10px padding
- **md**: 36px height, 12px padding
- **lg**: 44px height, 16px padding
- **Label Bar**: Fixed height (20px)

---

## Accessibility Features

- ✅ Reduced motion support (@media prefers-reduced-motion)
- ✅ High contrast mode support
- ✅ Focus-visible outlines
- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support

---

## Performance Optimization

- ✅ GPU-accelerated animations (transform, opacity)
- ✅ No layout thrashing
- ✅ Efficient box-shadow rendering
- ✅ Optimized SVG rendering
- ✅ Smooth 60fps performance
- ✅ Minimal repaints
