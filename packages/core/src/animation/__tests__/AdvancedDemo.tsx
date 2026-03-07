/**
 * Advanced Animation Features Demo
 * Demonstrates physics, gestures, and scroll animations
 */

import React, { useState } from 'react';
import { Animator } from '../Animator';
import { AnimatorGeneralProvider } from '../AnimatorGeneralProvider';
import { useDrag, useSwipe, usePinch } from '../gestures';
import { useInView, useScrollProgress, useParallax } from '../scroll';
import { createSpringEasing, springPresets } from '../physics';

/**
 * Spring Animation Demo
 */
export const SpringAnimationDemo: React.FC = () => {
  const [activate, setActivate] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Spring Animation Demo</h2>
      <button onClick={() => setActivate(!activate)}>
        Toggle Animation
      </button>
      
      <Animator
        activate={activate}
        duration={{ enter: 1000, exit: 800 }}
        animator={{
          easing: {
            enter: createSpringEasing(springPresets.wobbly),
            exit: createSpringEasing(springPresets.gentle),
          },
        }}
      >
        {(animator) => (
          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              background: '#28125A',
              opacity: animator.flow.entered ? 1 : 0,
              transform: animator.flow.entered ? 'scale(1)' : 'scale(0.5)',
              transition: 'all 1s',
            }}
          >
            Spring Animation with Wobbly Effect
          </div>
        )}
      </Animator>
    </div>
  );
};

/**
 * Drag Gesture Demo
 */
export const DragGestureDemo: React.FC = () => {
  const drag = useDrag({
    axis: 'both',
    bounds: {
      left: -200,
      right: 200,
      top: -200,
      bottom: 200,
    },
    elastic: 0.3,
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Drag Gesture Demo</h2>
      <p>Drag the box below (with elastic bounds)</p>
      
      <div
        {...drag.bind}
        style={{
          width: '100px',
          height: '100px',
          background: '#29F2DF',
          cursor: drag.isDragging ? 'grabbing' : 'grab',
          transform: `translate(${drag.deltaX}px, ${drag.deltaY}px)`,
          transition: drag.isDragging ? 'none' : 'transform 0.3s',
        }}
      >
        Drag Me
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p>Delta X: {drag.deltaX.toFixed(0)}px</p>
        <p>Delta Y: {drag.deltaY.toFixed(0)}px</p>
        <p>Velocity X: {drag.velocityX.toFixed(2)}px/s</p>
        <p>Velocity Y: {drag.velocityY.toFixed(2)}px/s</p>
      </div>
    </div>
  );
};

/**
 * Swipe Gesture Demo
 */
export const SwipeGestureDemo: React.FC = () => {
  const [direction, setDirection] = useState<string>('None');

  const swipe = useSwipe({
    threshold: 50,
    onSwipeLeft: () => setDirection('Left'),
    onSwipeRight: () => setDirection('Right'),
    onSwipeUp: () => setDirection('Up'),
    onSwipeDown: () => setDirection('Down'),
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Swipe Gesture Demo</h2>
      <p>Swipe in any direction on the box below</p>
      
      <div
        {...swipe.bind}
        style={{
          width: '300px',
          height: '200px',
          background: '#29F2DF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          userSelect: 'none',
        }}
      >
        Swipe Me
      </div>
      
      <p style={{ marginTop: '20px' }}>
        Last Swipe Direction: <strong>{direction}</strong>
      </p>
    </div>
  );
};

/**
 * Pinch Gesture Demo
 */
export const PinchGestureDemo: React.FC = () => {
  const pinch = usePinch({
    onPinch: (scale) => {
      console.log('Pinch scale:', scale);
    },
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pinch Gesture Demo</h2>
      <p>Use two fingers to pinch on the box below (touch device required)</p>
      
      <div
        {...pinch.bind}
        style={{
          width: '200px',
          height: '200px',
          background: '#29F2DF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${pinch.scale})`,
          transition: pinch.isPinching ? 'none' : 'transform 0.3s',
        }}
      >
        Pinch Me
      </div>
      
      <p style={{ marginTop: '20px' }}>
        Scale: <strong>{pinch.scale.toFixed(2)}</strong>
      </p>
    </div>
  );
};

/**
 * Scroll Trigger Demo
 */
export const ScrollTriggerDemo: React.FC = () => {
  const [ref, isInView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Scroll Trigger Demo</h2>
      <p>Scroll down to see the animation</p>
      
      <div style={{ height: '100vh' }} />
      
      <div
        ref={ref}
        style={{
          padding: '40px',
          background: '#EF3EF1',
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(50px)',
          transition: 'all 0.6s ease-out',
        }}
      >
        I animate when scrolled into view!
      </div>
      
      <div style={{ height: '100vh' }} />
    </div>
  );
};

/**
 * Scroll Progress Demo
 */
export const ScrollProgressDemo: React.FC = () => {
  const [ref, progress] = useScrollProgress();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Scroll Progress Demo</h2>
      <p>Scroll to see the progress bar fill</p>
      
      <div style={{ height: '50vh' }} />
      
      <div ref={ref} style={{ height: '200vh', position: 'relative' }}>
        <div
          style={{
            position: 'sticky',
            top: '20px',
            padding: '20px',
            background: '#fff',
            border: '2px solid #000',
          }}
        >
          <div
            style={{
              height: '20px',
              background: '#29F2DF',
              width: `${progress * 100}%`,
              transition: 'width 0.1s',
            }}
          />
          <p>Progress: {(progress * 100).toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Parallax Demo
 */
export const ParallaxDemo: React.FC = () => {
  const [ref, offset] = useParallax({ speed: 0.5 });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Parallax Demo</h2>
      <p>Scroll to see the parallax effect</p>
      
      <div style={{ height: '50vh' }} />
      
      <div
        ref={ref}
        style={{
          padding: '40px',
          background: '#EF3EF1',
          transform: `translateY(${offset.y}px)`,
        }}
      >
        I move slower than the scroll!
      </div>
      
      <div style={{ height: '100vh' }} />
    </div>
  );
};

/**
 * Complete Demo App
 */
export const AdvancedAnimationDemo: React.FC = () => {
  return (
    <AnimatorGeneralProvider
      config={{
        defaultDuration: {
          enter: 400,
          exit: 300,
        },
      }}
    >
      <div style={{ fontFamily: 'sans-serif' }}>
        <h1 style={{ padding: '20px' }}>Advanced Animation Features Demo</h1>
        
        <SpringAnimationDemo />
        <hr />
        
        <DragGestureDemo />
        <hr />
        
        <SwipeGestureDemo />
        <hr />
        
        <PinchGestureDemo />
        <hr />
        
        <ScrollTriggerDemo />
        <hr />
        
        <ScrollProgressDemo />
        <hr />
        
        <ParallaxDemo />
      </div>
    </AnimatorGeneralProvider>
  );
};

export default AdvancedAnimationDemo;
