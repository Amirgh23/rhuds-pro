import React from 'react';
import { BubbleChart, BubbleChartProps } from './BubbleChart';

/**
 * Cold War Theme Bubble Chart
 *
 * Specialized Bubble Chart component with Call of Duty: Black Ops Cold War aesthetic.
 * Features:
 * - Tactical Amber/Phosphor Green/Muted Red color palette
 * - Sharp, angular corners (no border-radius)
 * - Retro military aesthetic
 * - Dashed grid lines
 * - Intense glow effects
 * - Monospace typography
 */
export function ColdWarBubbleChart(props: Omit<BubbleChartProps, 'variant'>) {
  return <BubbleChart {...props} variant="coldwar" />;
}

/**
 * Cold War Bubble Chart with tactical styling
 */
export const ColdWarBubbleChartStyled = React.forwardRef<
  HTMLCanvasElement,
  Omit<BubbleChartProps, 'variant'>
>((props, ref) => {
  return (
    <div
      style={{
        padding: '1.5rem',
        background: '#0a0a0c',
        border: '2px solid #FFB000',
        boxShadow: '0 0 30px rgba(255, 176, 0, 0.3), inset 0 0 20px rgba(255, 176, 0, 0.1)',
        position: 'relative',
      }}
    >
      {/* Tactical corner markers */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '20px',
          height: '20px',
          border: '2px solid #FFB000',
          borderRight: 'none',
          borderBottom: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: '20px',
          height: '20px',
          border: '2px solid #FFB000',
          borderLeft: 'none',
          borderBottom: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '20px',
          height: '20px',
          border: '2px solid #FFB000',
          borderRight: 'none',
          borderTop: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: '20px',
          height: '20px',
          border: '2px solid #FFB000',
          borderLeft: 'none',
          borderTop: 'none',
        }}
      />

      <BubbleChart {...props} variant="coldwar" />
    </div>
  );
});

ColdWarBubbleChartStyled.displayName = 'ColdWarBubbleChartStyled';
