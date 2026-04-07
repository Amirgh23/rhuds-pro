import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { LazyImage } from '../LazyImage';

describe('LazyImage Component', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder initially', () => {
    render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
        placeholder="https://example.com/placeholder.jpg"
      />
    );

    const img = screen.getByAltText('Test image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('placeholder');
  });

  it('renders without placeholder immediately', () => {
    render(<LazyImage src="https://example.com/image.jpg" alt="Test image" />);

    const img = screen.getByAltText('Test image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('image.jpg');
  });

  it('applies correct dimensions', () => {
    render(
      <LazyImage src="https://example.com/image.jpg" alt="Test image" width={300} height={200} />
    );

    const img = screen.getByAltText('Test image') as HTMLImageElement;
    expect(img.width).toBe(300);
    expect(img.height).toBe(200);
  });

  it('applies custom className', () => {
    render(
      <LazyImage src="https://example.com/image.jpg" alt="Test image" className="custom-class" />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveClass('custom-class');
  });

  it('calls onLoad callback when image loads', async () => {
    const onLoad = jest.fn();
    const { container } = render(
      <LazyImage src="https://example.com/image.jpg" alt="Test image" onLoad={onLoad} />
    );

    const img = container.querySelector('img') as HTMLImageElement;
    img.onload?.(new Event('load'));

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
    });
  });

  it('memoizes component correctly', () => {
    const { rerender } = render(
      <LazyImage src="https://example.com/image1.jpg" alt="Test image" />
    );

    const img1 = screen.getByAltText('Test image') as HTMLImageElement;
    const src1 = img1.src;

    rerender(<LazyImage src="https://example.com/image1.jpg" alt="Test image" />);

    const img2 = screen.getByAltText('Test image') as HTMLImageElement;
    expect(img2.src).toBe(src1);
  });
});
