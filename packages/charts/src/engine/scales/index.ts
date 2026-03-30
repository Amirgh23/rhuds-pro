/**
 * Default Scales
 */

export { BaseScale } from './BaseScale';
export { LinearScale } from './LinearScale';
export { CategoryScale } from './CategoryScale';
export { TimeScale } from './TimeScale';
export { LogarithmicScale } from './LogarithmicScale';

// Export Scale type alias for compatibility
export type { IScale as Scale } from '../types/index';

import { LinearScale } from './LinearScale';
import { CategoryScale } from './CategoryScale';
import { TimeScale } from './TimeScale';
import { LogarithmicScale } from './LogarithmicScale';

export default {
  linear: LinearScale,
  category: CategoryScale,
  time: TimeScale,
  logarithmic: LogarithmicScale,
};
