/**
 * Animation System
 * Handles chart animations and transitions
 */

import { Animation, easingFunctions } from './Animation';
import { AnimationManager } from './AnimationManager';

export {
  Animation,
  easingFunctions,
  type AnimationOptions,
  type EasingFunction,
} from './Animation';
export { AnimationManager } from './AnimationManager';

export default {
  Animation,
  AnimationManager,
};
