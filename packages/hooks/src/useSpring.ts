import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpringOptions {
  from: Record<string, number>;
  to: Record<string, number>;
  tension?: number;
  friction?: number;
  mass?: number;
}

export interface UseSpringReturn {
  values: Record<string, number>;
  isAnimating: boolean;
}

export function useSpring(options: UseSpringOptions): UseSpringReturn {
  const { from, to, tension = 170, friction = 26, mass = 1 } = options;

  const [values, setValues] = useState(from);
  const [isAnimating, setIsAnimating] = useState(true);
  
  const velocityRef = useRef<Record<string, number>>({});
  const animationRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const newValues = { ...values };
    let hasMovement = false;

    Object.keys(to).forEach(key => {
      const current = newValues[key];
      const target = to[key];
      const velocity = velocityRef.current[key] || 0;

      const spring = -tension * (current - target);
      const damper = -friction * velocity;
      const acceleration = (spring + damper) / mass;

      const newVelocity = velocity + acceleration * 0.016;
      const newValue = current + newVelocity * 0.016;

      velocityRef.current[key] = newVelocity;
      newValues[key] = newValue;

      if (Math.abs(newVelocity) > 0.01 || Math.abs(newValue - target) > 0.01) {
        hasMovement = true;
      }
    });

    setValues(newValues);

    if (hasMovement) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      setValues(to);
    }
  }, [values, to, tension, friction, mass]);

  useEffect(() => {
    setIsAnimating(true);
    velocityRef.current = {};
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [to, animate]);

  return { values, isAnimating };
}
