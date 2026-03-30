/**
 * Chart Engine - Core charting system
 * Exports all engine layer types and components
 */

// Export Chart class
export { Chart } from './Chart';

// Export all types
export * from './types/index';
export * from './types/registry';

// Export registry system
export * from './registry/index';

// Export controllers (excluding DatasetController which is already exported from types)
export {
  LineController,
  BarController,
  PieController,
  DoughnutController,
  RadarController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  MixedController,
} from './controllers/index';

// Export elements (with alias to avoid conflict with type)
export * as ElementClasses from './elements/index';

// Export scales (excluding Scale which is already exported from types)
export { BaseScale, LinearScale, CategoryScale, TimeScale, LogarithmicScale } from './scales/index';

// Export defaults manager
export * from './defaults/index';

// Export data parser
export * from './data/index';
