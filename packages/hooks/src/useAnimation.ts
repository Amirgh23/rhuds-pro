import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseAnimationOptions {
  from: React.CSSProperties;
  to: React.CSSProperties;
  duration: number;
  easing?: string;
  delay?: number;
  repeat?: number;
  direction?: 'normal' | 'reverse' | 'alternate';
  autoPlay?: boolean;
}

export interface UseAnimationReturn {
  style: React.CSSProperties;
  play: () => void;
  pause: () => void;
  reset: () => void;
  isPlaying: boolean;
}

export function useAnimation(options: UseAnimationOptions): UseAnimationReturn {
  const {
    from,
    to,
    duration,
    delay = 0,
    repeat = 0,
    direction = 'normal',
    autoPlay = true,
  } = options;

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [style, setStyle] = useState<React.CSSProperties>(from);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const repeatCountRef = useRef(0);

  const interpolate = useCallback((start: number, end: number, progress: number) => {
    return start + (end - start) * progress;
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp + delay;
    }

    const elapsed = timestamp - startTimeRef.current;
    
    if (elapsed < 0) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    let progress = Math.min(elapsed / duration, 1);

    if (direction === 'reverse') {
      progress = 1 - progress;
    } else if (direction === 'alternate' && repeatCountRef.current % 2 === 1) {
      progress = 1 - progress;
    }

    const newStyle: React.CSSProperties = {};
    
    Object.keys(to).forEach(key => {
      const fromValue = from[key as keyof React.CSSProperties];
      const toValue = to[key as keyof React.CSSProperties];
      
      if (typeof fromValue === 'number' && typeof toValue === 'number') {
        (newStyle as any)[key] = interpolate(fromValue, toValue, progress);
      } else {
        (newStyle as any)[key] = progress < 1 ? fromValue : toValue;
      }
    });

    setStyle(newStyle);

    if (progress >= 1) {
      if (repeat === -1 || repeatCountRef.current < repeat) {
        repeatCountRef.current++;
        startTimeRef.current = null;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [from, to, duration, delay, repeat, direction, interpolate]);

  const play = useCallback(() => {
    setIsPlaying(true);
    startTimeRef.current = null;
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    pause();
    setStyle(from);
    repeatCountRef.current = 0;
    startTimeRef.current = null;
  }, [from, pause]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  return { style, play, pause, reset, isPlaying };
}
