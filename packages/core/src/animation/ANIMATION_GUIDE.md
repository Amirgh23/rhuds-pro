# RHUDS Pro Animation System Guide

## Overview

The RHUDS Pro Animation System provides a comprehensive suite of animation tools including:

- **Core Animator**: Lifecycle-based animation component with state machine
- **Physics-Based Animations**: Spring dynamics, decay, and inertia
- **Gesture-Driven Animations**: Drag, swipe, pinch, and rotate gestures
- **Scroll-Triggered Animations**: Viewport detection and scroll progress
- **Animation Managers**: Stagger, sequence, and switch managers
- **Animation Subsystems**: Modular animation logic

## Quick Start

### Basic Animation

```tsx
import { Animator } from '@rhuds/core';

function MyComponent() {
  const [show, setShow] = useState(false);

  return (
    <Animator activate={show} duration={{ enter: 300, exit: 200 }}>
      {(animator) => (
        <div
          style={{
            opacity: animator.flow.entered ? 1 : 0,
            transform: animator.flow.entered ? 'scale(1)' : 'scale(0.8)',
          }}
        >
          Animated Content
        </div>
      )}
    </Animator>
  );
}
```

### Global Configuration

```tsx
import { AnimatorGeneralProvider } from '@rhuds/core';

function App() {
  return (
    <AnimatorGeneralProvider
      config={{
        defaultDuration: { enter: 400, exit: 300 },
        defaultEasing: { enter: 'easeOutCubic', exit: 'easeInCubic' },
      }}
    >
      <YourApp />
    </AnimatorGeneralProvider>
  );
}
```

## Physics-Based Animations

### Spring Animation

```tsx
import { Animator, createSpringEasing, springPresets } from '@rhuds/core';

<Animator
  activate={true}
  duration={{ enter: 1000 }}
  animator={{
    easing: {
      enter: createSpringEasing(springPresets.wobbly),
    },
  }}
>
  {/* Your content */}
</Animator>
```

### Custom Spring Configuration

```tsx
const customSpring = createSpringEasing({
  mass: 1,
  tension: 170,
  friction: 26,
  velocity: 0,
});
```

### Decay Animation

```tsx
import { createDecayEasing } from '@rhuds/core';

const decayEasing = createDecayEasing({
  velocity: 1,
  deceleration: 0.998,
});
```

### Inertia Animation

```tsx
import { createInertiaEasing } from '@rhuds/core';

const inertiaEasing = createInertiaEasing({
  velocity: 2,
  min: 0,
  max: 1,
  bounceStiffness: 0.5,
  bounceDamping: 0.8,
});
```

## Gesture-Driven Animations

### Drag Gesture

```tsx
import { useDrag } from '@rhuds/core';

function DraggableBox() {
  const drag = useDrag({
    axis: 'both',
    bounds: { left: -200, right: 200, top: -200, bottom: 200 },
    elastic: 0.3,
    onDragEnd: (event, velocity) => {
      console.log('Drag ended with velocity:', velocity);
    },
  });

  return (
    <div
      {...drag.bind}
      style={{
        transform: `translate(${drag.deltaX}px, ${drag.deltaY}px)`,
        cursor: drag.isDragging ? 'grabbing' : 'grab',
      }}
    >
      Drag Me
    </div>
  );
}
```

### Swipe Gesture

```tsx
import { useSwipe } from '@rhuds/core';

function SwipeableCard() {
  const swipe = useSwipe({
    threshold: 50,
    onSwipeLeft: () => console.log('Swiped left'),
    onSwipeRight: () => console.log('Swiped right'),
  });

  return <div {...swipe.bind}>Swipe Me</div>;
}
```

### Pinch Gesture

```tsx
import { usePinch } from '@rhuds/core';

function ZoomableImage() {
  const pinch = usePinch({
    onPinch: (scale) => console.log('Scale:', scale),
  });

  return (
    <img
      {...pinch.bind}
      src="image.jpg"
      style={{ transform: `scale(${pinch.scale})` }}
    />
  );
}
```

### Rotate Gesture

```tsx
import { useRotate } from '@rhuds/core';

function RotatableElement() {
  const rotate = useRotate({
    onRotate: (angle) => console.log('Angle:', angle),
  });

  return (
    <div
      {...rotate.bind}
      style={{ transform: `rotate(${rotate.angle}deg)` }}
    >
      Rotate Me
    </div>
  );
}
```

## Scroll-Triggered Animations

### Viewport Intersection

```tsx
import { useInView } from '@rhuds/core';

function FadeInOnScroll() {
  const [ref, isInView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transition: 'opacity 0.6s',
      }}
    >
      Fades in when scrolled into view
    </div>
  );
}
```

### Scroll Progress

```tsx
import { useScrollProgress } from '@rhuds/core';

function ProgressBar() {
  const [ref, progress] = useScrollProgress();

  return (
    <div ref={ref} style={{ height: '200vh' }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          width: `${progress * 100}%`,
          height: '4px',
          background: '#00ffff',
        }}
      />
    </div>
  );
}
```

### Parallax Scrolling

```tsx
import { useParallax } from '@rhuds/core';

function ParallaxLayer() {
  const [ref, offset] = useParallax({ speed: 0.5 });

  return (
    <div
      ref={ref}
      style={{ transform: `translateY(${offset.y}px)` }}
    >
      Parallax Content
    </div>
  );
}
```

### Scroll Snap

```tsx
import { useScrollSnap } from '@rhuds/core';

function SnapScroller() {
  const ref = useScrollSnap({
    axis: 'y',
    onSnap: (index) => console.log('Snapped to:', index),
  });

  return (
    <div ref={ref} style={{ overflowY: 'scroll', height: '100vh' }}>
      <div>Section 1</div>
      <div>Section 2</div>
      <div>Section 3</div>
    </div>
  );
}
```

## Animation Managers

### Stagger Manager

```tsx
import { Stagger } from '@rhuds/core';

<Stagger stagger={100} direction="forward">
  {items.map((item) => (
    <Animator key={item.id} activate={true}>
      {/* Item content */}
    </Animator>
  ))}
</Stagger>
```

### Sequence Manager

```tsx
import { Sequence } from '@rhuds/core';

<Sequence onComplete={() => console.log('All animations complete')}>
  <Animator activate={true}>{/* First */}</Animator>
  <Animator activate={true}>{/* Second */}</Animator>
  <Animator activate={true}>{/* Third */}</Animator>
</Sequence>
```

### Switch Manager

```tsx
import { Switch } from '@rhuds/core';

<Switch condition={showA}>
  {[
    <div key="a">Content A</div>,
    <div key="b">Content B</div>,
  ]}
</Switch>
```

## Animation Subsystems

### Creating Custom Subsystems

```tsx
import { SubsystemManager, AnimationSubsystem } from '@rhuds/core';

const customSubsystem: AnimationSubsystem = {
  name: 'custom',
  onEntering: (control) => {
    console.log('Animation entering');
  },
  onEntered: (control) => {
    console.log('Animation entered');
  },
  cleanup: () => {
    console.log('Cleanup');
  },
};

const manager = new SubsystemManager();
manager.register(customSubsystem);
```

### Built-in Subsystems

```tsx
import {
  createFadeSubsystem,
  createScaleSubsystem,
  createSlideSubsystem,
  createRotateSubsystem,
  createBlurSubsystem,
} from '@rhuds/core';

const element = document.getElementById('myElement');

const fadeSubsystem = createFadeSubsystem(element);
const scaleSubsystem = createScaleSubsystem(element, 0.8, 1);
const slideSubsystem = createSlideSubsystem(element, 'up', 20);
const rotateSubsystem = createRotateSubsystem(element, -180, 0);
const blurSubsystem = createBlurSubsystem(element, 10);
```

## Easing Functions

### Built-in Easing

```tsx
import { easeInOut, easeOutCubic, easeInBack } from '@rhuds/core';

<Animator
  animator={{
    easing: {
      enter: easeOutCubic,
      exit: easeInCubic,
    },
  }}
>
  {/* Content */}
</Animator>
```

### Available Easing Functions

- Linear: `linear`
- Quadratic: `easeIn`, `easeOut`, `easeInOut`
- Cubic: `easeInCubic`, `easeOutCubic`, `easeInOutCubic`
- Quartic: `easeInQuart`, `easeOutQuart`, `easeInOutQuart`
- Quintic: `easeInQuint`, `easeOutQuint`, `easeInOutQuint`
- Sine: `easeInSine`, `easeOutSine`, `easeInOutSine`
- Exponential: `easeInExpo`, `easeOutExpo`, `easeInOutExpo`
- Circular: `easeInCirc`, `easeOutCirc`, `easeInOutCirc`
- Back: `easeInBack`, `easeOutBack`, `easeInOutBack`
- Elastic: `easeInElastic`, `easeOutElastic`, `easeInOutElastic`
- Bounce: `easeInBounce`, `easeOutBounce`, `easeInOutBounce`

## Performance Tips

1. **Use `triggerOnce`** for scroll animations that only need to run once
2. **Limit gesture tracking** to specific elements, not the entire document
3. **Use `unmountOnExited`** to remove components from the DOM when not visible
4. **Batch animations** using Stagger or Sequence managers
5. **Use CSS transforms** instead of position properties for better performance

## Best Practices

1. Always provide cleanup functions in custom subsystems
2. Use appropriate easing functions for different animation types
3. Test gesture interactions on both desktop and mobile devices
4. Consider reduced motion preferences for accessibility
5. Use the AnimatorGeneralProvider for consistent animation behavior

## Troubleshooting

### Animations not working

- Check that `activate` prop is changing
- Verify duration values are reasonable (not 0)
- Ensure AnimatorGeneralProvider is wrapping your app if using global config

### Gestures not responding

- Verify event listeners are properly attached
- Check that elements have appropriate cursor styles
- Test on actual touch devices for touch gestures

### Scroll animations triggering incorrectly

- Adjust `threshold` and `rootMargin` values
- Check that elements have proper height/positioning
- Verify IntersectionObserver is supported in your target browsers

## Examples

See the `__tests__/AdvancedDemo.tsx` file for complete working examples of all features.
