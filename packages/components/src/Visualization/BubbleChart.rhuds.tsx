import React from 'react';
import { BubbleChart, BubbleChartProps } from './BubbleChart';

/**
 * RHUDS Theme Bubble Chart
 *
 * Specialized Bubble Chart component with RHUDS (Reactive HUD UI Design System) theme.
 * Features:
 * - Cyan/Blue/Magenta color palette
 * - Smooth, rounded corners
 * - Modern neon aesthetic
 * - Subtle grid lines
 * - Clean typography
 */
export function RhudsBubbleChart(props: Omit<BubbleChartProps, 'variant'>) {
  return <BubbleChart {...props} variant="rhuds" />;
}

/**
 * RHUDS Bubble Chart with default styling
 */
export const RhudsBubbleChartStyled = React.forwardRef<
  HTMLCanvasElement,
  Omit<BubbleChartProps, 'variant'>
>((props, ref) => {
  return (
    <div
      style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.9), rgba(26, 26, 30, 0.9))',
        borderRadius: '8px',
        border: '1px solid rgba(41, 242, 223, 0.2)',
        boxShadow: '0 0 20px rgba(41, 242, 223, 0.1)',
      }}
    >
      <BubbleChart {...props} variant="rhuds" />
    </div>
  );
});

RhudsBubbleChartStyled.displayName = 'RhudsBubbleChartStyled';
