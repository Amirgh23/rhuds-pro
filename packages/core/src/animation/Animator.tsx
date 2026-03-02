/**
 * Animator Component
 * Manages component lifecycle animations with state machine
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  AnimatorProps,
  AnimatorControl,
  AnimatorFlow,
  AnimatorState,
  AnimationDuration,
} from './types';
import { getEasingFunction } from './easing';
import { AnimatorProvider, useParentActivation } from './AnimatorContext';

/**
 * Create animator flow object from state
 */
function createFlow(state: AnimatorState): AnimatorFlow {
  return {
    value: state,
    entering: state === 'entering',
    entered: state === 'entered',
    exiting: state === 'exiting',
    exited: state === 'exited',
    transitioning: state === 'entering' || state === 'exiting',
  };
}

/**
 * Animator component for managing component lifecycle animations
 * 
 * Implements a state machine with four states:
 * - exited: Component is not visible/mounted
 * - entering: Component is animating in
 * - entered: Component is fully visible
 * - exiting: Component is animating out
 */
export const Animator: React.FC<AnimatorProps> = ({
  activate = true,
  duration: durationProp,
  initialState = 'exited',
  unmountOnExited = false,
  animator,
  onAnimateEntering,
  onAnimateEntered,
  onAnimateExiting,
  onAnimateExited,
  disabled = false,
  dismissed = false,
  children,
}) => {
  // Handle parent activation propagation
  const effectiveActivate = useParentActivation(activate, true);
  // Merge duration from props and animator settings
  const duration: AnimationDuration = {
    enter: durationProp?.enter ?? animator?.duration?.enter ?? 300,
    exit: durationProp?.exit ?? animator?.duration?.exit ?? 200,
    stagger: durationProp?.stagger ?? animator?.duration?.stagger ?? 0,
    delay: durationProp?.delay ?? animator?.duration?.delay ?? 0,
  };

  // Initialize state
  const [state, setState] = useState<AnimatorState>(
    animator?.initialState ?? initialState
  );
  
  // Track if component is mounted
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Animate to a specific state
  const animate = useCallback(
    (targetState: AnimatorState) => {
      if (!mountedRef.current || disabled || dismissed) return;

      cleanup();

      setState(targetState);

      // Handle state transitions
      if (targetState === 'entering') {
        onAnimateEntering?.();
        
        // Transition to entered after duration
        timeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setState('entered');
            onAnimateEntered?.();
          }
        }, duration.enter);
      } else if (targetState === 'exiting') {
        onAnimateExiting?.();
        
        // Transition to exited after duration
        timeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setState('exited');
            onAnimateExited?.();
          }
        }, duration.exit);
      } else if (targetState === 'entered') {
        onAnimateEntered?.();
      } else if (targetState === 'exited') {
        onAnimateExited?.();
      }
    },
    [
      disabled,
      dismissed,
      duration.enter,
      duration.exit,
      onAnimateEntering,
      onAnimateEntered,
      onAnimateExiting,
      onAnimateExited,
      cleanup,
    ]
  );

  // Handle activate prop changes
  useEffect(() => {
    if (disabled || dismissed) return;

    if (effectiveActivate) {
      // Activate: transition to entering/entered
      if (state === 'exited') {
        animate('entering');
      } else if (state === 'exiting') {
        // Interrupt exit animation
        animate('entering');
      }
    } else {
      // Deactivate: transition to exiting/exited
      if (state === 'entered') {
        animate('exiting');
      } else if (state === 'entering') {
        // Interrupt enter animation
        animate('exiting');
      }
    }
  }, [effectiveActivate, disabled, dismissed, state, animate]);

  // Handle disabled state
  useEffect(() => {
    if (disabled) {
      cleanup();
    }
  }, [disabled, cleanup]);

  // Handle dismissed state (permanent removal)
  useEffect(() => {
    if (dismissed) {
      cleanup();
      setState('exited');
    }
  }, [dismissed, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Create animator control object
  const flow = createFlow(state);
  const control: AnimatorControl = {
    flow,
    duration,
    animate,
  };

  // Handle unmountOnExited
  if (unmountOnExited && state === 'exited') {
    return null;
  }

  // Render children
  if (typeof children === 'function') {
    return (
      <AnimatorProvider control={control}>
        {children(control)}
      </AnimatorProvider>
    );
  }

  return (
    <AnimatorProvider control={control}>
      {children}
    </AnimatorProvider>
  );
};

Animator.displayName = 'Animator';
