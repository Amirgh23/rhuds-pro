import React from 'react';
import { render, screen } from '@testing-library/react';
import { BubbleChart, RhudsBubbleChart, ColdWarBubbleChart } from './index';

describe('BubbleChart', () => {
  const mockData = [
    { x: 10, y: 20, r: 15, label: 'A' },
    { x: 25, y: 35, r: 20, label: 'B' },
    { x: 40, y: 15, r: 18, label: 'C' },
  ];

  it('renders canvas element', () => {
    const { container } = render(<BubbleChart data={mockData} variant="rhuds" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with correct dimensions', () => {
    const { container } = render(
      <BubbleChart data={mockData} width={800} height={600} variant="rhuds" />
    );
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });

  it('renders RHUDS variant', () => {
    const { container } = render(<RhudsBubbleChart data={mockData} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders Cold War variant', () => {
    const { container } = render(<ColdWarBubbleChart data={mockData} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    const { container } = render(
      <BubbleChart data={mockData} colors={['#FF0000', '#00FF00', '#0000FF']} variant="rhuds" />
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with axis labels', () => {
    const { container } = render(
      <BubbleChart data={mockData} xLabel="Performance" yLabel="Efficiency" variant="rhuds" />
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with grid disabled', () => {
    const { container } = render(<BubbleChart data={mockData} showGrid={false} variant="rhuds" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    const { container } = render(<BubbleChart data={[]} variant="rhuds" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <BubbleChart data={mockData} className="custom-chart" variant="rhuds" />
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('custom-chart');
  });

  it('applies correct border style for coldwar variant', () => {
    const { container } = render(<BubbleChart data={mockData} variant="coldwar" />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const style = window.getComputedStyle(canvas);
    expect(style.borderRadius).toBe('0px');
  });

  it('applies correct border style for rhuds variant', () => {
    const { container } = render(<BubbleChart data={mockData} variant="rhuds" />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const style = window.getComputedStyle(canvas);
    expect(style.borderRadius).toBe('4px');
  });
});
