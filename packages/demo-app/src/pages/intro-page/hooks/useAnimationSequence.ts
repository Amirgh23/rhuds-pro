import { useEffect, useState, useCallback } from 'react';
import {
  DEFAULT_ANIMATION_TIMINGS,
  AnimationTimings,
  getAnimationSequenceInfo,
} from '../utils/animationOrchestrator';

interface AnimationSequenceState {
  backgroundReady: boolean;
  heroReady: boolean;
  featureCardsReady: boolean[];
  isComplete: boolean;
}

/**
 * Hook for managing animation sequence timing
 * Coordinates the timing of background, hero, and feature card animations
 */
export const useAnimationSequence = (
  cardCount: number = 3,
  timings: AnimationTimings = DEFAULT_ANIMATION_TIMINGS
): AnimationSequenceState => {
  const [state, setState] = useState<AnimationSequenceState>({
    backgroundReady: false,
    heroReady: false,
    featureCardsReady: Array(cardCount).fill(false),
    isComplete: false,
  });

  // Background animation starts immediately
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      backgroundReady: true,
    }));
  }, []);

  // Hero animation starts after heroDelay
  useEffect(() => {
    const timer = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        heroReady: true,
      }));
    }, timings.heroStart);

    return () => clearTimeout(timer);
  }, [timings.heroStart]);

  // Feature cards animations start with stagger
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    for (let i = 0; i < cardCount; i++) {
      const delay = timings.featureCardsStart + i * timings.featureCardsStaggerInterval;
      const timer = setTimeout(() => {
        setState((prev) => {
          const newReady = [...prev.featureCardsReady];
          newReady[i] = true;
          return {
            ...prev,
            featureCardsReady: newReady,
          };
        });
      }, delay);
      timers.push(timer);
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [cardCount, timings.featureCardsStart, timings.featureCardsStaggerInterval]);

  // Mark sequence as complete when all animations are ready
  useEffect(() => {
    const allReady =
      state.backgroundReady && state.heroReady && state.featureCardsReady.every((ready) => ready);

    if (allReady && !state.isComplete) {
      setState((prev) => ({
        ...prev,
        isComplete: true,
      }));
    }
  }, [state.backgroundReady, state.heroReady, state.featureCardsReady, state.isComplete]);

  return state;
};

/**
 * Hook for getting animation sequence information
 * Useful for debugging and monitoring animation timing
 */
export const useAnimationSequenceInfo = (
  cardCount: number = 3,
  timings: AnimationTimings = DEFAULT_ANIMATION_TIMINGS
) => {
  const [info, setInfo] = useState(() => getAnimationSequenceInfo(cardCount, timings));

  useEffect(() => {
    setInfo(getAnimationSequenceInfo(cardCount, timings));
  }, [cardCount, timings]);

  return info;
};

/**
 * Hook for monitoring animation performance
 * Tracks frame rate and animation smoothness
 */
export const useAnimationPerformance = () => {
  const [frameRate, setFrameRate] = useState(60);
  const [isSmooth, setIsSmooth] = useState(true);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFrameRate = (currentTime: number) => {
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        setFrameRate(frameCount);
        setIsSmooth(frameCount >= 55); // Target 55fps minimum
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFrameRate);
    };

    animationId = requestAnimationFrame(measureFrameRate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return { frameRate, isSmooth };
};
