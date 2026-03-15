# Animation Flow Diagram

## How Scroll Animations Work

```
┌─────────────────────────────────────────────────────────────┐
│                    PAGE LOADS                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         useGSAPAnimations Hook Initializes                  │
│  - Creates Intersection Observer                            │
│  - Finds all [data-gsap] elements                           │
│  - Sets up viewport detection                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              HERO SECTION DISPLAYS                          │
│  - No data-gsap attribute                                   │
│  - fadeInScale animation (0s delay)                         │
│  - Visible immediately                                      │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              USER SCROLLS DOWN                              │
│  - Intersection Observer detects elements                   │
│  - Checks if element is in viewport                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         ELEMENT ENTERS VIEWPORT (100px margin)              │
│  - isIntersecting = true                                    │
│  - Read data-gsap attribute value                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         ADD ANIMATION CLASS TO ELEMENT                      │
│                                                              │
│  data-gsap="fade-up"    → add class animate-fade-up         │\n│  data-gsap="fade-left"  → add class animate-fade-left       │\n│  data-gsap="fade-right" → add class animate-fade-right      │\n│  data-gsap="scale-up"   → add class animate-scale-up        │\n└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         CSS ANIMATION PLAYS (0.8s)                          │
│                                                              │
│  @keyframes fadeUpAnimation {                               │
│    from { opacity: 0; transform: translateY(60px); }        │
│    to   { opacity: 1; transform: translateY(0); }           │
│  }                                                           │
│                                                              │
│  Easing: cubic-bezier(0.34, 1.56, 0.64, 1)                 │
│  (Smooth bouncy ease-out)                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         ANIMATION COMPLETE                                  │
│  - Element is now visible                                   │
│  - Stop observing element                                   │
│  - Save resources                                           │
└─────────────────────────────────────────────────────────────┘
```

## Animation Types

### 1. Fade Up (fade-up)

```
BEFORE                          AFTER
┌─────────────┐                ┌─────────────┐
│             │                │             │
│  opacity: 0 │  ──────────→   │  opacity: 1 │
│  y: 60px    │    0.8s        │  y: 0px     │
│             │                │             │
└─────────────┘                └─────────────┘
```

### 2. Fade Left (fade-left)

```
BEFORE                          AFTER
        ┌─────────────┐        ┌─────────────┐
        │             │        │             │
        │  opacity: 0 │  ──→   │  opacity: 1 │
        │  x: -80px   │ 0.8s   │  x: 0px     │
        │             │        │             │
        └─────────────┘        └─────────────┘
```

### 3. Fade Right (fade-right)

```
BEFORE                          AFTER
┌─────────────┐                ┌─────────────┐
│             │                │             │
│  opacity: 0 │  ──────────→   │  opacity: 1 │
│  x: 80px    │    0.8s        │  x: 0px     │
│             │                │             │
└─────────────┘                └─────────────┘
```

### 4. Scale Up (scale-up)

```
BEFORE                          AFTER
      ┌────────┐               ┌─────────────┐
      │        │               │             │
      │opacity:0│  ──────────→  │  opacity: 1 │
      │scale:0.85│   0.8s       │  scale: 1   │
      │        │               │             │
      └────────┘               └─────────────┘
```

## Timing Breakdown

```
Timeline: 0ms ─────────────────────────────────── 800ms

Animation Progress:
0%    ┌─ Start (opacity: 0, transform applied)
      │
25%   ├─ 25% complete (bouncy ease-out kicks in)
      │
50%   ├─ 50% complete (halfway through)
      │
75%   ├─ 75% complete (almost done)
      │
100%  └─ Complete (opacity: 1, transform: none)
```

## Easing Function Visualization

```
Cubic Bezier: (0.34, 1.56, 0.64, 1)

Progress (%)
    │
100 │                                    ╱
    │                                ╱╱
 75 │                            ╱╱
    │                        ╱╱
 50 │                    ╱╱
    │                ╱╱
 25 │            ╱╱
    │        ╱╱
  0 │────────────────────────────────
    └─────────────────────────────────
      0%    25%    50%    75%   100%
           Time (%)

Characteristics:
- Starts slow
- Accelerates in middle
- Bounces slightly at end (overshoot)
- Creates smooth, professional feel
```

## Stagger Effect

```
Element 1: ├─ 0.1s delay ─┤ [Animation 0.8s]
Element 2:                ├─ 0.1s delay ─┤ [Animation 0.8s]
Element 3:                               ├─ 0.1s delay ─┤ [Animation 0.8s]
Element 4:                                              ├─ 0.1s delay ─┤ [Animation 0.8s]

Total time: ~1.1s for all elements to complete
```

## Viewport Detection

```
Viewport (visible area)
┌─────────────────────────────────┐
│                                 │
│  ┌─────────────────────────────┐│  ← rootMargin: 0px (top)
│  │                             ││
│  │  Visible Content            ││
│  │                             ││
│  └─────────────────────────────┘│  ← rootMargin: -100px (bottom)
│                                 │
└─────────────────────────────────┘

Below Viewport (not yet visible)
┌─────────────────────────────────┐
│  ┌─────────────────────────────┐│  ← Trigger zone (100px)
│  │  [data-gsap] Element        ││  ← Animation triggers here
│  │  (waiting to enter)         ││
│  └─────────────────────────────┘│
│                                 │
└─────────────────────────────────┘
```

## Performance Optimization

```
GPU Acceleration Applied:
┌─────────────────────────────────┐
│  will-change: transform, opacity │
│  transform: translateZ(0)        │
│  backface-visibility: hidden     │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Browser Optimization:          │
│  - Creates GPU layer            │
│  - Hardware acceleration        │
│  - Smooth 60fps animation       │
│  - No layout recalculation      │
└─────────────────────────────────┘
```

## Complete Page Flow

```
Page Load
    │
    ├─→ Hero Section (immediate)
    │
    ├─→ User Scrolls
    │
    ├─→ Features Section (fade-up)
    │
    ├─→ Terminal Section (fade-up)
    │
    ├─→ Preview Section (fade-up)
    │
    ├─→ Stats Section (scale-up)
    │
    ├─→ Code Playground (fade-up)
    │
    ├─→ GitHub Stats (scale-up)
    │
    ├─→ Theme Switcher (fade-up)
    │
    ├─→ Testimonials (fade-up)
    │
    ├─→ Comparison (fade-right)
    │
    ├─→ Newsletter (fade-up)
    │
    ├─→ Roadmap (fade-left)
    │
    ├─→ Performance (fade-up)
    │
    └─→ Footer
```

## Browser Rendering Pipeline

```
1. Parse HTML
   └─→ Find [data-gsap] elements

2. Apply CSS
   └─→ Load animation keyframes

3. JavaScript Execution
   └─→ useGSAPAnimations hook runs
   └─→ Intersection Observer created

4. User Scrolls
   └─→ Intersection Observer detects element
   └─→ Animation class added

5. CSS Animation
   └─→ Browser applies keyframes
   └─→ GPU renders animation
   └─→ 60fps smooth motion

6. Animation Complete
   └─→ Element unobserved
   └─→ Resources freed
```

## Summary

The animation system creates a smooth, professional scrolling experience by:

1. Detecting when elements enter the viewport
2. Adding animation classes at the right moment
3. Playing GPU-accelerated CSS animations
4. Cleaning up resources after animation completes

Result: Smooth, performant, professional animations like OSE Engineering website.
