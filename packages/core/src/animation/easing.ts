/**
 * Easing Functions
 * Standard easing curves for animations
 */

import { EasingFunction } from './types';

/**
 * Linear easing (no acceleration)
 */
export const linear: EasingFunction = (t: number) => t;

/**
 * Ease-in (accelerating from zero velocity)
 */
export const easeIn: EasingFunction = (t: number) => t * t;

/**
 * Ease-out (decelerating to zero velocity)
 */
export const easeOut: EasingFunction = (t: number) => t * (2 - t);

/**
 * Ease-in-out (accelerating then decelerating)
 */
export const easeInOut: EasingFunction = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

/**
 * Ease-in cubic
 */
export const easeInCubic: EasingFunction = (t: number) => t * t * t;

/**
 * Ease-out cubic
 */
export const easeOutCubic: EasingFunction = (t: number) => {
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
};

/**
 * Ease-in-out cubic
 */
export const easeInOutCubic: EasingFunction = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

/**
 * Ease-in quart
 */
export const easeInQuart: EasingFunction = (t: number) => t * t * t * t;

/**
 * Ease-out quart
 */
export const easeOutQuart: EasingFunction = (t: number) => {
  const t1 = t - 1;
  return 1 - t1 * t1 * t1 * t1;
};

/**
 * Ease-in-out quart
 */
export const easeInOutQuart: EasingFunction = (t: number) => {
  const t1 = t - 1;
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * t1 * t1 * t1 * t1;
};

/**
 * Ease-in quint
 */
export const easeInQuint: EasingFunction = (t: number) => t * t * t * t * t;

/**
 * Ease-out quint
 */
export const easeOutQuint: EasingFunction = (t: number) => {
  const t1 = t - 1;
  return 1 + t1 * t1 * t1 * t1 * t1;
};

/**
 * Ease-in-out quint
 */
export const easeInOutQuint: EasingFunction = (t: number) => {
  const t1 = t - 1;
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * t1 * t1 * t1 * t1 * t1;
};

/**
 * Ease-in sine
 */
export const easeInSine: EasingFunction = (t: number) => 1 - Math.cos((t * Math.PI) / 2);

/**
 * Ease-out sine
 */
export const easeOutSine: EasingFunction = (t: number) => Math.sin((t * Math.PI) / 2);

/**
 * Ease-in-out sine
 */
export const easeInOutSine: EasingFunction = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Ease-in expo
 */
export const easeInExpo: EasingFunction = (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10));

/**
 * Ease-out expo
 */
export const easeOutExpo: EasingFunction = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Ease-in-out expo
 */
export const easeInOutExpo: EasingFunction = (t: number) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
};

/**
 * Ease-in circ
 */
export const easeInCirc: EasingFunction = (t: number) => 1 - Math.sqrt(1 - Math.pow(t, 2));

/**
 * Ease-out circ
 */
export const easeOutCirc: EasingFunction = (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2));

/**
 * Ease-in-out circ
 */
export const easeInOutCirc: EasingFunction = (t: number) =>
  t < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;

/**
 * Ease-in back
 */
export const easeInBack: EasingFunction = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
};

/**
 * Ease-out back
 */
export const easeOutBack: EasingFunction = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * Ease-in-out back
 */
export const easeInOutBack: EasingFunction = (t: number) => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
};

/**
 * Ease-in elastic
 */
export const easeInElastic: EasingFunction = (t: number) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
};

/**
 * Ease-out elastic
 */
export const easeOutElastic: EasingFunction = (t: number) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

/**
 * Ease-in-out elastic
 */
export const easeInOutElastic: EasingFunction = (t: number) => {
  const c5 = (2 * Math.PI) / 4.5;
  return t === 0
    ? 0
    : t === 1
      ? 1
      : t < 0.5
        ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
};

/**
 * Ease-in bounce
 */
export const easeInBounce: EasingFunction = (t: number) => 1 - easeOutBounce(1 - t);

/**
 * Ease-out bounce
 */
export const easeOutBounce: EasingFunction = (t: number) => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

/**
 * Ease-in-out bounce
 */
export const easeInOutBounce: EasingFunction = (t: number) =>
  t < 0.5 ? (1 - easeOutBounce(1 - 2 * t)) / 2 : (1 + easeOutBounce(2 * t - 1)) / 2;

/**
 * Tactical (Mechanical) easing for Cold War aesthetic
 * Snappy, responsive feel with slight overshoot
 */
export const easeTactical: EasingFunction = (t: number) => {
  // cubic-bezier(0.68, -0.55, 0.265, 1.55)
  const c1 = 0.68;
  const c2 = -0.55;
  const c3 = 0.265;
  const c4 = 1.55;
  return c1 * t * t * t + c2 * t * t + c3 * t + c4;
};

/**
 * Snappy easing for Cold War aesthetic
 * Quick response with pronounced overshoot
 */
export const easeSnappy: EasingFunction = (t: number) => {
  // cubic-bezier(0.34, 1.56, 0.64, 1)
  const c1 = 0.34;
  const c2 = 1.56;
  const c3 = 0.64;
  const c4 = 1;
  return c1 * t * t * t + c2 * t * t + c3 * t + c4;
};

/**
 * Smooth easing for Cold War aesthetic
 * Gentle acceleration and deceleration
 */
export const easeSmooth: EasingFunction = (t: number) => {
  // cubic-bezier(0.25, 0.46, 0.45, 0.94)
  const c1 = 0.25;
  const c2 = 0.46;
  const c3 = 0.45;
  const c4 = 0.94;
  return c1 * t * t * t + c2 * t * t + c3 * t + c4;
};

/**
 * Glitch easing for Cold War aesthetic
 * Mechanical, jerky feel for glitch effects
 */
export const easeGlitch: EasingFunction = easeTactical;

/**
 * Map of easing function names to functions
 */
export const easingFunctions: Record<string, EasingFunction> = {
  linear,
  easeIn,
  easeOut,
  easeInOut,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
  // Cold War tactical easing curves
  easeTactical,
  easeSnappy,
  easeSmooth,
  easeGlitch,
};

/**
 * Get easing function by name or return the function itself
 */
export function getEasingFunction(easing: EasingFunction | string | undefined): EasingFunction {
  if (!easing) return easeInOut;
  if (typeof easing === 'function') return easing;
  return easingFunctions[easing] || easeInOut;
}
