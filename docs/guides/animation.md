# Animation Guide

Master the RHUDS animation system for creating smooth, performant animations.

## Overview

RHUDS provides a comprehensive animation system with:
- Declarative animations
- Physics-based motion
- Gesture support
- Scroll animations
- Performance optimization

## Basic Animations

### Using Animator Component

```tsx
import { Animator } from '@rhuds/core';

function MyComponent() {
  return (
    <Animator animate>
      <div>This content will fade in</div>
    </Animator>
  );
}
```

### Custom Animation Duration

```tsx
<Animator animate duration={500}>
  <div>Slower animation</div>
</Animator>
```

### Custom Easing

```tsx
<Animator animate easing="ease-in-out">
  <div>Custom easing</div>
</Animator>
```

## Animation Hook

### useAnimator

```tsx
import { useAnimator } from '@rhuds/core';

function AnimatedComponent() {
  const animator = useAnimator();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      animator.animate({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        duration: 300,
        easing: 'ease-out',
      });
    }
  }, [isVisible]);
  
  return <div ref={animator.ref}>Content</div>;
}
```

## Creating Custom Animations

### Using createAnimation

```tsx
import { createAnimation } from '@rhuds/core';

const fadeIn = createAnimation({
  from: { opacity: 0 },
  to: { opacity: 1 },
  duration: 300,
  easing: 'ease-out',
});

const slideUp = createAnimation({
  from: { 
    opacity: 0, 
    transform: 'translateY(20px)' 
  },
  to: { 
    opacity: 1, 
    transform: 'translateY(0)' 
  },
  duration: 400,
  easing: 'ease-out',
});
```

### Using Custom Animations

```tsx
<Animator animation={fadeIn}>
  <div>Fades in</div>
</Animator>

<Animator animation={slideUp}>
  <div>Slides up</div>
</Animator>
```

## Easing Functions

RHUDS provides 20+ easing functions:

```tsx
// Basic
'linear'
'ease'
'ease-in'
'ease-out'
'ease-in-out'

// Quadratic
'ease-in-quad'
'ease-out-quad'
'ease-in-out-quad'

// Cubic
'ease-in-cubic'
'ease-out-cubic'
'ease-in-out-cubic'

// Quartic
'ease-in-quart'
'ease-out-quart'
'ease-in-out-quart'

// Quintic
'ease-in-quint'
'ease-out-quint'
'ease-in-out-quint'

// Exponential
'ease-in-expo'
'ease-out-expo'
'ease-in-out-expo'

// Circular
'ease-in-circ'
'ease-out-circ'
'ease-in-out-circ'

// Back
'ease-in-back'
'ease-out-back'
'ease-in-out-back'
```

### Using Easing Functions

```tsx
<Animator easing="ease-out-back">
  <div>Bounces slightly</div>
</Animator>
```

## Physics-Based Animations

### Spring Animation

```tsx
import { useSpring } from '@rhuds/hooks';

function SpringComponent() {
  const [value, setValue] = useState(0);
  const animated = useSpring(value, {
    stiffness: 100,
    damping: 10,
    mass: 1,
  });
  
  return (
    <div style={{ transform: `translateX(${animated}px)` }}>
      Spring animated
    </div>
  );
}
```

### Spring Configuration

```tsx
const springConfig = {
  stiffness: 100,  // Higher = faster
  damping: 10,     // Higher = less bouncy
  mass: 1,         // Higher = slower
};
```

## Gesture Animations

### Drag Animation

```tsx
import { useDrag } from '@rhuds/core';

function DraggableComponent() {
  const { bind, x, y } = useDrag();
  
  return (
    <div 
      {...bind()} 
      style={{ 
        transform: `translate(${x}px, ${y}px)`,
        cursor: 'grab',
      }}
    >
      Drag me!
    </div>
  );
}
```

### Pinch/Zoom Animation

```tsx
import { usePinch } from '@rhuds/core';

function ZoomableComponent() {
  const { bind, scale } = usePinch();
  
  return (
    <div 
      {...bind()} 
      style={{ transform: `scale(${scale})` }}
    >
      Pinch to zoom
    </div>
  );
}
```

## Scroll Animations

### Scroll-Triggered Animation

```tsx
import { useScrollAnimation } from '@rhuds/core';

function ScrollComponent() {
  const ref = useScrollAnimation({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
    threshold: 0.5,
  });
  
  return (
    <div ref={ref}>
      Animates when scrolled into view
    </div>
  );
}
```

### Parallax Effect

```tsx
import { useParallax } from '@rhuds/core';

function ParallaxComponent() {
  const ref = useParallax({ speed: 0.5 });
  
  return (
    <div ref={ref}>
      Parallax background
    </div>
  );
}
```

## Stagger Animations

Animate multiple elements in sequence:

```tsx
import { Animator } from '@rhuds/core';

function StaggeredList() {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  
  return (
    <div>
      {items.map((item, index) => (
        <Animator 
          key={index}
          animate
          delay={index * 100}
        >
          <div>{item}</div>
        </Animator>
      ))}
    </div>
  );
}
```

## Animation Sequences

Chain multiple animations:

```tsx
import { useAnimationSequence } from '@rhuds/core';

function SequenceComponent() {
  const sequence = useAnimationSequence([
    { opacity: 0, duration: 0 },
    { opacity: 1, duration: 300 },
    { transform: 'scale(1.2)', duration: 200 },
    { transform: 'scale(1)', duration: 200 },
  ]);
  
  return (
    <div style={sequence.style}>
      Animated sequence
    </div>
  );
}
```

## Performance Optimization

### Use Transform and Opacity

Prefer `transform` and `opacity` for best performance:

```tsx
// Good - GPU accelerated
<Animator 
  from={{ opacity: 0, transform: 'translateY(20px)' }}
  to={{ opacity: 1, transform: 'translateY(0)' }}
/>

// Avoid - triggers layout
<Animator 
  from={{ top: 20 }}
  to={{ top: 0 }}
/>
```

### Will-Change Hint

```tsx
<div style={{ willChange: 'transform, opacity' }}>
  Optimized for animation
</div>
```

### Reduce Motion

Respect user preferences:

```tsx
import { usePrefersReducedMotion } from '@rhuds/core';

function AccessibleAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  return (
    <Animator animate={!prefersReducedMotion}>
      <div>Respects motion preferences</div>
    </Animator>
  );
}
```

## Animation Presets

### Fade Animations

```tsx
const fadeIn = { from: { opacity: 0 }, to: { opacity: 1 } };
const fadeOut = { from: { opacity: 1 }, to: { opacity: 0 } };
```

### Slide Animations

```tsx
const slideUp = {
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
};

const slideDown = {
  from: { opacity: 0, transform: 'translateY(-20px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
};

const slideLeft = {
  from: { opacity: 0, transform: 'translateX(20px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
};

const slideRight = {
  from: { opacity: 0, transform: 'translateX(-20px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
};
```

### Scale Animations

```tsx
const scaleIn = {
  from: { opacity: 0, transform: 'scale(0.8)' },
  to: { opacity: 1, transform: 'scale(1)' },
};

const scaleOut = {
  from: { opacity: 1, transform: 'scale(1)' },
  to: { opacity: 0, transform: 'scale(0.8)' },
};
```

### Rotate Animations

```tsx
const rotateIn = {
  from: { opacity: 0, transform: 'rotate(-180deg)' },
  to: { opacity: 1, transform: 'rotate(0deg)' },
};
```

## Best Practices

1. **Keep Durations Short**: 200-400ms for most UI animations
2. **Use Appropriate Easing**: ease-out for entrances, ease-in for exits
3. **Avoid Layout Thrashing**: Use transform instead of position properties
4. **Test Performance**: Monitor frame rate on lower-end devices
5. **Respect Accessibility**: Honor prefers-reduced-motion
6. **Stagger Wisely**: Don't overdo stagger delays (50-100ms is usually enough)

## Examples

### Button Hover Animation

```tsx
function AnimatedButton() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 200ms ease-out',
      }}
    >
      Hover me
    </button>
  );
}
```

### Modal Enter/Exit

```tsx
function AnimatedModal({ isOpen }) {
  return (
    <Animator animate={isOpen}>
      <div className="modal">
        Modal content
      </div>
    </Animator>
  );
}
```

### Loading Spinner

```tsx
function Spinner() {
  return (
    <div
      style={{
        animation: 'spin 1s linear infinite',
      }}
    >
      ⟳
    </div>
  );
}
```

## Next Steps

- [Audio Guide](./audio.md)
- [Performance Optimization](./performance.md)
- [API Reference](../api/core.md)
