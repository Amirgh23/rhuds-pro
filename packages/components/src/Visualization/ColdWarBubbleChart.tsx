/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR BUBBLE CHART - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Wrapper around existing BubbleChart with Cold War styling
 */

import React from 'react';
import { BubbleChart, BubbleChartProps } from './BubbleChart';

export interface ColdWarBubbleChartProps extends Omit<BubbleChartProps, 'theme'> {
  /** Cold War theme variant */
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
}

/**
 * Cold War Bubble Chart Component
 * Wraps the existing BubbleChart with Cold War theme mapping
 */
export const ColdWarBubbleChart: React.FC<ColdWarBubbleChartProps> = ({
  theme = 'perseus',
  ...props
}) => {
  // Map Cold War themes to BubbleChart themes
  const themeMap = {
    perseus: 'coldWar' as const,
    greenTerminal: 'coldWar' as const,
    satelliteView: 'coldWar' as const,
  };

  return <BubbleChart {...props} theme={themeMap[theme]} />;
};

export default ColdWarBubbleChart;
