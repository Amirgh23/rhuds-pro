/**
 * Performance Optimization
 * Dataset optimization and memory management
 */

import { DatasetOptimizer } from './DatasetOptimizer';
import { MemoryManager } from './MemoryManager';

export { DatasetOptimizer, type OptimizationConfig } from './DatasetOptimizer';
export { MemoryManager, type MemoryStats } from './MemoryManager';

export default {
  DatasetOptimizer,
  MemoryManager,
};
