/**
 * Layout System
 * Manages chart layout, positioning, and responsive behavior
 */

import { LayoutManager } from './LayoutManager';
import { ResponsiveLayout } from './ResponsiveLayout';

export { LayoutManager, type LayoutArea, type LayoutOptions } from './LayoutManager';
export { ResponsiveLayout, type ResponsiveOptions } from './ResponsiveLayout';

export default {
  LayoutManager,
  ResponsiveLayout,
};
