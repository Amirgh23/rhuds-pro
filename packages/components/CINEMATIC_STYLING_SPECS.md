# Cinematic Styling Specifications - Technical Reference

## ColdWarButton - Detailed Styling

### Base Structure

```
┌─────────────────────────────────────┐
│ ◆ [LED]  BUTTON TEXT  [SN:0142]    │  ← Corner brackets + LED + Serial
│ ─────────────────────────────────── │  ← Scan-line on hover
└─────────────────────────────────────┘
```

### Box-Shadow Layers (Default State)

```
Layer 1: inset 0 1px 0 rgba(255, 255, 255, 0.1)
         → Top inner highlight (beveled effect)

Layer 2: inset 0 -1px 0 rgba(0, 0, 0, 0.5)
         → Bottom inner shadow (depth)

Layer 3: 0 0 0 1px ${colors.border}
         → Primary border line

Layer 4: 0 0 0 2px rgba(0, 0, 0, 0.8)
         → Outer frame/bezel

Layer 5: 0 4px 12px rgba(0, 0, 0, 0.4)
         → Drop shadow (elevation)

Layer 6: 0 0 20px ${colors.glow}40
         → Bloom glow (atmospheric)
```

### LED Indicator (Left Side)

```
Position: absolute, left: 8px, top: 50%, transform: translateY(-50%)
Size: 6px × 6px
Shape: circle (border-radius: 50%)
Color: ${colors.glow}
Box-Shadow: 0 0 4px ${colors.glow}, inset 0 0 2px rgba(255, 255, 255, 0.5)
Animation: led-pulse 0.6s ease-in-out infinite (on hover)
Z-Index: 3
```

### Corner Brackets

```
Top-Left:
  Position: absolute, top: 4px, left: 4px
  Size: 8px × 8px
  Border: 2px solid ${colors.glow} (top + left only)
  Opacity: 0.6
  Animation: corner-bracket-glow 1s ease-in-out infinite (on hover)

Bottom-Right:
  Position: absolute, bottom: 4px, right: 4px
  Size: 8px × 8px
  Border: 2px solid ${colors.glow} (bottom + right only)
  Opacity: 0.6
  Animation: corner-bracket-glow 1s ease-in-out infinite (on hover)
```

### Scan-Line Sweep (Hover State)

```
Position: absolute, top: 0, left: -100%
Width: 100%
Height: 2px
Background: linear-gradient(90deg, transparent, ${colors.glow}, transparent)
Animation: scan-line-sweep 0.8s ease-in-out infinite
Z-Index: 2
```

### Serial Number (Bottom-Right)

```
Position: absolute, bottom: 2px, right: 4px
Font-Size: 8px
Font-Weight: 400
Letter-Spacing: 0.05em
Color: ${colors.glow}
Opacity: 0.4
Font-Family: 'Courier New', monospace
Z-Index: 2
Content: "SN:0142"
```

### Text Styling

```
Font-Family: 'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace
Font-Weight: 500
Letter-Spacing: 0.03em
Text-Transform: uppercase
Text-Shadow (Bloom):
  0 0 4px ${colors.glow},
  0 0 8px ${colors.glow}80,
  0 0 16px ${colors.glow}40,
  0 0 24px ${colors.glow}20
```

---

## ColdWarCard - Detailed Styling

### Base Structure

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
```

### Box-Shadow Layers (Default State)

```
Layer 1: inset 0 1px 0 rgba(255, 255, 255, 0.05)
         → Top inner highlight

Layer 2: inset 0 -1px 0 rgba(0, 0, 0, 0.3)
         → Bottom inner shadow

Layer 3: 0 0 0 1px ${colorAccent}40
         → Accent border (subtle)

Layer 4: 0 0 0 2px rgba(0, 0, 0, 0.8)
         → Outer frame

Layer 5: 0 8px 24px rgba(0, 0, 0, 0.5)
         → Drop shadow (elevation)

Layer 6: 0 0 30px ${colorAccent}20
         → Bloom glow
```

### Background Pattern (Brushed Metal)

```
Layer 1: linear-gradient(135deg, ${surface}00 0%, ${surface}40 50%, ${surface}00 100%)
         → Diagonal metallic sheen

Layer 2: linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
         → Vertical grid lines

Layer 3: linear-gradient(0deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
         → Horizontal grid lines

Background-Size: 100% 100%, 4px 4px, 4px 4px
```

### Targeting Brackets (All Corners)

```
Top-Left:
  Position: absolute, top: 6px, left: 6px
  Size: 12px × 12px
  Border: 2px solid ${colorAccent} (top + left only)
  Opacity: 0.5

Top-Right:
  Position: absolute, top: 6px, right: 6px
  Size: 12px × 12px
  Border: 2px solid ${colorAccent} (top + right only)
  Opacity: 0.5

Bottom-Left:
  Position: absolute, bottom: 6px, left: 6px
  Size: 12px × 12px
  Border: 2px solid ${colorAccent} (bottom + left only)
  Opacity: 0.5

Bottom-Right:
  Position: absolute, bottom: 6px, right: 6px
  Size: 12px × 12px
  Border: 2px solid ${colorAccent} (bottom + right only)
  Opacity: 0.5
```

### Tape Overlays (Top Corners)

```
Top-Left Tape:
  Position: absolute, top: 0, left: 0
  Size: 24px × 16px
  Background-Color: rgba(200, 180, 140, 0.3)
  Border-Bottom: 1px solid rgba(139, 119, 101, 0.5)
  Border-Right: 1px solid rgba(139, 119, 101, 0.5)
  Box-Shadow: inset 0 1px 2px rgba(255, 255, 255, 0.1)
  Animation: card-tape-flicker 3s ease-in-out infinite
  Z-Index: 2

Top-Right Tape:
  Position: absolute, top: 0, right: 0
  Size: 24px × 16px
  Background-Color: rgba(200, 180, 140, 0.3)
  Border-Bottom: 1px solid rgba(139, 119, 101, 0.5)
  Border-Left: 1px solid rgba(139, 119, 101, 0.5)
  Box-Shadow: inset 0 1px 2px rgba(255, 255, 255, 0.1)
  Animation: card-tape-flicker 3s ease-in-out infinite 0.5s
  Z-Index: 2
```

### Watermark Stamp (Center)

```
Position: absolute, top: 50%, left: 50%
Transform: translate(-50%, -50%) rotate(-15deg)
Font-Size: 32px
Font-Weight: 900
Letter-Spacing: 0.1em
Color: ${colorAccent}
Opacity: 0.08
Text-Transform: uppercase
Font-Family: 'Share Tech Mono', monospace
Z-Index: 1
Pointer-Events: none
Text-Shadow: 0 0 10px ${colorAccent}20
Content: "CLASSIFIED"
```

### Footer Bar (Coordinates)

```
Padding: 8px 16px
Border-Top: 1px solid ${colorAccent}
Border-Top-Style: solid
Font-Family: 'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace
Font-Size: 10px
Letter-Spacing: 0.02em
Color: ${themeColors.textSecondary}
Background-Color: ${themeColors.background}80
Z-Index: 2
Position: relative
Display: flex
Justify-Content: space-between
Align-Items: center
Content: "55.7558° N, 37.6173° E" | "// SECURE"
```

---

## ColdWarInput - Detailed Styling

### Base Structure

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
```

### Label Bar (File Tab Aesthetic)

```
Display: flex
Align-Items: center
Gap: 6px
Padding: 4px 8px 4px 12px
Background-Color: ${colors.focus}20
Border-Left: 3px solid ${colors.focus}
Border-Top-Left-Radius: 2px
Border-Top-Right-Radius: 2px
Font-Family: 'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace
Font-Size: 11px
Font-Weight: 600
Letter-Spacing: 0.04em
Text-Transform: uppercase
Color: ${colors.focus}
Position: relative
Z-Index: 2

LED Indicator (inside label):
  Display: inline-block
  Width: 4px
  Height: 4px
  Border-Radius: 50%
  Background-Color: ${colors.focus}
  Animation: led-pulse 1s ease-in-out infinite
```

### Input Box-Shadow Layers (Default State)

```
Layer 1: inset 0 1px 0 rgba(255, 255, 255, 0.05)
         → Top inner highlight

Layer 2: inset 0 -1px 0 rgba(0, 0, 0, 0.3)
         → Bottom inner shadow

Layer 3: 0 0 0 1px ${colors.border}40
         → Border line (subtle)

Layer 4: 0 0 0 2px rgba(0, 0, 0, 0.8)
         → Outer frame

Layer 5: 0 4px 12px rgba(0, 0, 0, 0.4)
         → Drop shadow
```

### Input Box-Shadow Layers (Focus State)

```
Layer 1: inset 0 1px 0 rgba(255, 255, 255, 0.08)
         → Top inner highlight (enhanced)

Layer 2: inset 0 -1px 0 rgba(0, 0, 0, 0.3)
         → Bottom inner shadow

Layer 3: 0 0 0 1px ${colors.focus}60
         → Focus border (prominent)

Layer 4: 0 0 0 2px rgba(0, 0, 0, 0.8)
         → Outer frame

Layer 5: 0 6px 16px rgba(0, 0, 0, 0.5)
         → Drop shadow (enhanced)

Layer 6: 0 0 20px ${colors.focus}40
         → Bloom glow
```

### Background Pattern (Grid)

```
Layer 1: linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
         → Vertical grid lines

Layer 2: linear-gradient(0deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
         → Horizontal grid lines

Background-Size: 8px 8px
```

### Scanning Animation Border (Focus State)

```
Position: absolute, top: 0, left: -100%
Width: 100%
Height: 1px
Background: linear-gradient(90deg, transparent, ${colors.focus}, transparent)
Animation: scan-line-sweep 0.6s ease-in-out infinite
Pointer-Events: none
Z-Index: 1
```

### Targeting Reticle SVG (Focus State)

```
Position: absolute, right: 8px, top: 50%
Transform: translateY(-50%)
Width: 12px
Height: 12px
Opacity: 0.4
Pointer-Events: none
Animation: targeting-reticle-spin 4s linear infinite

SVG Elements:
  - Circle: cx="12" cy="12" r="8", stroke: ${colors.focus}, stroke-width: 1
  - Top Line: x1="12" y1="4" x2="12" y2="8"
  - Bottom Line: x1="12" y1="16" x2="12" y2="20"
  - Left Line: x1="4" y1="12" x2="8" y2="12"
  - Right Line: x1="16" y1="12" x2="20" y2="12"
```

### Status Footer (Error/Success)

```
Display: flex
Align-Items: center
Gap: 6px
Margin-Top: 4px
Padding-Left: 8px
Font-Size: 10px
Font-Weight: 400
Letter-Spacing: 0.02em
Text-Transform: uppercase
Color: ${errorMessage ? colors.error : colors.success}
Font-Family: 'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace

Status Indicator (LED):
  Display: inline-block
  Width: 3px
  Height: 3px
  Border-Radius: 50%
  Background-Color: ${errorMessage ? colors.error : colors.success}
  Animation: led-pulse 0.8s ease-in-out infinite
```

---

## Animation Timing Reference

```
led-pulse: 0.6s - 1s (breathing effect)
corner-bracket-glow: 1s (pulsing brackets)
scan-line-sweep: 0.6s - 0.8s (horizontal sweep)
targeting-reticle-spin: 4s (slow rotation)
card-tape-flicker: 3s (flickering tape)
input-cursor-blink: 0.8s (cursor blink)
```

---

## Color Palette Integration

### Primary Theme (Perseus)

```
Primary: #ffb000 (Amber/Gold)
Secondary: #33ff00 (Neon Green)
Background: #0a0a0c (Deep Black)
Surface: #1a1a1e (Dark Gray)
Accent: #0066cc (Blue)
Text: #ffffff (White)
Error: #ff3333 (Red)
Success: #33ff00 (Green)
```

### Glow Colors

- Primary Glow: rgba(255, 176, 0, 0.6) - Amber
- Focus Glow: rgba(0, 102, 204, 0.6) - Blue
- Success Glow: rgba(51, 255, 0, 0.6) - Green
- Error Glow: rgba(255, 51, 51, 0.6) - Red

---

## Responsive Considerations

- Button sizes scale with viewport
- Card padding adjusts for mobile
- Input label bar remains fixed size
- Corner brackets scale proportionally
- Animations remain consistent across devices
