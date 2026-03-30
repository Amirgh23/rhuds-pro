/**
 * Built-in Plugins
 * Tooltip, Legend, Title, and Filler plugins
 */

import { TooltipPlugin } from './TooltipPlugin';
import { LegendPlugin } from './LegendPlugin';
import { TitlePlugin } from './TitlePlugin';
import { FillerPlugin } from './FillerPlugin';

export { TooltipPlugin, type TooltipOptions } from './TooltipPlugin';
export { LegendPlugin, type LegendOptions, type LegendItem } from './LegendPlugin';
export { TitlePlugin, type TitleOptions } from './TitlePlugin';
export { FillerPlugin, type FillerOptions } from './FillerPlugin';

// Export Plugin interface
export type { Plugin } from '../types/index';

export default {
  TooltipPlugin,
  LegendPlugin,
  TitlePlugin,
  FillerPlugin,
};
